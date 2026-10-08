import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse as parseHtml } from 'parse5';
import { parse, stringify } from 'yaml';
import { translationUnits } from '../src/domain/content/translation-units.mjs';
import { mapInput, nodeInput } from '../tests/skill-map-fixture.mjs';

const run = promisify(execFile);
const repository = fileURLToPath(new URL('../', import.meta.url));
const base = '/ai-native-lexicon';
const origin = 'https://hilt21.github.io';
const browser = process.argv.includes('--browser');
assert.ok(process.argv.slice(2).every((arg) => arg === '--browser'), 'Only --browser is supported');
const evidence = resolve(process.env.L2_EVIDENCE ?? join(repository, 'output/playwright/l2-10'));
const directory = await mkdtemp(join(tmpdir(), 'lexicon-l2-acceptance-'));
const report = { base, browser, stages: [], viewports: [] };

async function files(root) {
  const result = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else if (entry.isFile()) result.push(path);
  }
  return result.sort();
}

async function digest(root) {
  const hash = createHash('sha256');
  for (const file of await files(root)) {
    hash.update(relative(root, file));
    hash.update(await readFile(file));
  }
  return hash.digest('hex');
}

async function npm(args) {
  const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', GITHUB_ACTIONS: 'true',
    GITHUB_REPOSITORY: 'hilt21/ai-native-lexicon', GITHUB_REPOSITORY_OWNER: 'hilt21',
    BASE_PATH: base, CONTENT_BRANCH: 'master' };
  delete env.NODE_TEST_CONTEXT;
  try {
    await run('npm', args, { cwd: directory, env, maxBuffer: 8 * 1024 * 1024 });
  } catch (error) {
    throw new Error(`npm ${args.join(' ')} failed:\n${error.stdout}\n${error.stderr}`, { cause: error });
  }
}

async function yaml(path) { return parse(await readFile(join(directory, path), 'utf8')); }
async function save(path, data) { await writeFile(join(directory, path), stringify(data)); }
async function html(path) { return readFile(join(directory, 'dist', path, 'index.html'), 'utf8'); }
function walk(node, visit) {
  if (node.tagName) visit(node, Object.fromEntries(node.attrs.map(({ name, value }) => [name, value])));
  for (const child of node.childNodes ?? []) walk(child, visit);
  if (node.content) walk(node.content, visit);
}

async function pages() {
  const result = new Map();
  for (const file of (await files(join(directory, 'dist'))).filter((file) => file.endsWith('.html'))) {
    const path = relative(join(directory, 'dist'), file).split('\\').join('/');
    const url = `${origin}${base}/${path.replace(/index\.html$/, '')}`;
    const ids = new Set();
    const links = [];
    walk(parseHtml(await readFile(file, 'utf8')), (node, attrs) => {
      if (attrs.id) {
        assert.ok(!ids.has(attrs.id), `${path}: duplicate id ${attrs.id}`);
        ids.add(attrs.id);
      }
      if (node.tagName === 'a' && attrs.href) links.push(attrs.href);
    });
    result.set(path, { url, ids, links });
  }
  return result;
}

async function checkLinks(rendered) {
  const artifacts = new Set((await files(join(directory, 'dist'))).map((file) => relative(join(directory, 'dist'), file).split('\\').join('/')));
  let checked = 0;
  for (const [source, page] of rendered) {
    for (const href of page.links) {
      const target = new URL(href, page.url);
      if (target.origin !== origin) continue;
      assert.ok(target.pathname === base || target.pathname.startsWith(`${base}/`), `${source}: link escapes production base: ${href}`);
      const path = decodeURIComponent(target.pathname.slice(base.length)).replace(/^\//, '');
      const file = path.endsWith('/') || path === '' ? `${path}index.html` : artifacts.has(path) ? path : `${path}/index.html`;
      assert.ok(artifacts.has(file), `${source}: missing target ${href}`);
      if (target.hash) assert.ok(rendered.get(file)?.ids.has(decodeURIComponent(target.hash.slice(1))), `${source}: missing anchor ${href}`);
      checked++;
    }
  }
  return checked;
}

function nodeText(node) {
  return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(nodeText).join('');
}

function assertUnitLanguage(source, text, language) {
  const matches = [];
  walk(parseHtml(source), (node, attrs) => {
    if (attrs.lang && nodeText(node).trim() === text) matches.push(attrs.lang);
  });
  assert.ok(matches.includes(language), `Rendered unit ${JSON.stringify(text)} requires lang=${language}; got ${matches}`);
}

function assertTranslationPolicy(source, route, indexable) {
  const canonical = [], alternates = [], robots = [], coverage = [];
  walk(parseHtml(source), (_, attrs) => {
    if (attrs.rel === 'canonical') canonical.push(attrs.href);
    if (attrs.rel === 'alternate' && attrs.hreflang) alternates.push(attrs);
    if (attrs.name === 'robots') robots.push(attrs.content);
    if ('data-translation-coverage' in attrs) coverage.push(attrs);
  });
  assert.deepEqual(canonical, [`${origin}${base}/${indexable ? 'zh-cn/' : ''}${route}${route ? '/' : ''}`]);
  assert.equal(new Set(alternates.map((entry) => entry.hreflang)).size, alternates.length, 'hreflang must not duplicate');
  assert.equal(alternates.some((entry) => entry.hreflang === 'zh-CN'), indexable);
  assert.equal(robots.some((value) => value.includes('noindex')), !indexable);
  assert.equal(coverage.length, 1);
  return coverage[0];
}

async function publicCatalog() {
  const { stdout } = await run(process.execPath, ['--input-type=module', '-e', `
    import {readCatalog,validateCatalog} from './src/domain/content/catalog.mjs';
    const catalog = await readCatalog();
    const errors = validateCatalog(catalog).errors;
    console.log(JSON.stringify({errors,concepts:catalog.concepts,primitives:catalog.primitives,categories:catalog.categories,layers:catalog.layers,translations:catalog.translations}));
  `], { cwd: directory, maxBuffer: 8 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function fixtureOverlay(catalog, kind, id, translations, review_status = 'reviewed') {
  const collection = {concept:'concepts',primitive:'primitives',category:'categories',layer:'layers'}[kind];
  const record = catalog[collection].find((record) => (record.slug ?? record.anchor ?? record.id) === id);
  assert.ok(record, `Fixture translation target ${kind}/${id}`);
  const descriptors = new Map(translationUnits(kind,id,record.data ?? record).map((unit) => [unit.path,unit]));
  return {schema_version:'1.0.0',locale:'zh-CN',kind,target_id:id,units:Object.entries(translations).map(([path,translation]) => {
    assert.ok(descriptors.has(path), `Fixture translation path ${path}`);
    return {path,translation,source_fingerprint:descriptors.get(path).sourceFingerprint,review_status,...(review_status === 'reviewed' ? {reviewed_at:'2026-10-08'} : {})};
  })};
}

function canonicalDataset(dataset) {
  const copy = structuredClone(dataset); delete copy.generated_at; return copy;
}

function stage(name) { report.stages.push(name); console.log(`PASS ${name}`); }

const canonicalBefore = await digest(join(repository, 'src/data'));
try {
  for (const path of ['src', 'scripts', 'schemas', 'tests', 'public', 'package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json']) {
    await cp(join(repository, path), join(directory, path), { recursive: true });
  }
  // Keep dependency paths inside the fixture so Astro can resolve virtual CSS modules.
  await cp(join(repository, 'node_modules'), join(directory, 'node_modules'), { recursive: true, verbatimSymlinks: true });
  const sourceBefore = await digest(join(directory, 'src'));
  const originalData = new Map(await Promise.all((await files(join(directory, 'src/data'))).map(async (file) => [file, await readFile(file, 'utf8')])));
  // Prove absent-folder compatibility independently of per-record missing coverage.
  const translationInputRoot = join(directory, 'src/data/translations');
  const savedTranslations = join(directory, 'baseline-translations');
  let hadTranslations = false;
  try { await rename(translationInputRoot, savedTranslations); hadTranslations = true; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const absentCatalog = await publicCatalog();
  assert.deepEqual(absentCatalog.errors, []);
  assert.deepEqual(absentCatalog.translations, []);
  await npm(['run', 'build']);
  const baseline = await pages();
  const baselineLinks = await checkLinks(baseline);
  const baselineDataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
  stage('absent translation directory through public catalog, CLI/build and baseline routes/links');

  const categories = await Promise.all((await files(join(directory, 'src/data/taxonomy/categories'))).map(async (file) => parse(await readFile(file, 'utf8'))));
  const layers = await Promise.all((await files(join(directory, 'src/data/taxonomy/layers'))).map(async (file) => parse(await readFile(file, 'utf8'))));
  const category = { name: 'L2 Acceptance Domain', slug: 'l2-acceptance-domain', code: 'L2', description: 'A category used only in the isolated expansion acceptance project.', question: 'Can content expand without editing page code?', order: Math.max(...categories.map(({ order }) => order)) + 10 };
  const layer = { name: 'L2 Acceptance Layer', anchor: 'layer-l2-acceptance', order: Math.max(...layers.map(({ order }) => order)) + 10 };
  const conceptSlug = 'l2-acceptance-concept';
  const primitiveSlug = 'l2-acceptance-primitive';
  const conceptFile = `src/data/concepts/${conceptSlug}.yml`;
  const primitiveFile = `src/data/primitives/${primitiveSlug}.yml`;
  const cardFile = 'src/data/speaking-cards/l2-acceptance-guide.yml';
  const added = [conceptFile, primitiveFile, cardFile, `src/data/taxonomy/categories/${category.slug}.yml`, 'src/data/taxonomy/layers/l2-acceptance.yml'];
  for (const path of added) assert.ok(!originalData.has(join(directory, path)), `Fixture identity already exists: ${path}`);
  await save(added[3], category);
  await save(added[4], layer);
  await npm(['run', 'schema:generate']);
  for (const [name, field, value] of [['concept', 'category', category.name], ['primitive', 'layer', layer.name]]) {
    const schema = JSON.parse(await readFile(join(directory, 'schemas', `${name}.schema.json`), 'utf8'));
    assert.ok(schema.properties[field].enum.includes(value));
  }
  await npm(['run', 'check']);
  await npm(['run', 'build']);
  assert.match(await html(`categories/${category.slug}`), /00 concepts/);
  const emptyLayers = await html('primitives');
  assert.ok(emptyLayers.includes(`id="${layer.anchor}"`));
  assert.match(emptyLayers.slice(emptyLayers.indexOf(`id="${layer.anchor}"`)), /0 primitives/);
  for (const route of ['', 'categories', 'primitives']) assertTranslationPolicy(await html(`zh-cn/${route}`),route,false);
  assertTranslationPolicy(await html(`zh-cn/categories/${category.slug}`),`categories/${category.slug}`,false);
  stage('empty category/layer and generated portable enums');

  const concept = { ...await yaml('src/data/concepts/verification.yaml'), examples: [{ context: 'A reader checks an isolated expansion.', example: 'The same definition is visible on the Concept and referenced Primitive.' }, { context: 'A reader checks an isolated expansion.', example: 'A second current example survives owner deletion.' }], distinguish_from: [{ target: 'verification', distinction: 'This fixture exercises projections rather than verification practice.' }], aliases: ['Quasar acceptance alias'], term: 'L2 Acceptance Concept', zh: '扩充验收概念', category: category.name, related: ['verification', 'evidence'], primitives: [primitiveSlug], why_it_matters: 'An isolated expansion exercises real canonical projections and their translation fallbacks. NebulaFallbackFixture is an untranslated fixture marker.', definition: 'An isolated acceptance concept verifies that configuration and canonical records produce consistent projections.' };
  const primitive = { ...await yaml('src/data/primitives/state.yaml'), summary: 'Quasar acceptance verifies the canonical catalog across fields, typed filters and public projections.', term: 'L2 Acceptance Primitive', zh: '扩充验收原语', layer: layer.name, definitions: [{ concept: conceptSlug }, { name: 'Inline fixture one', text: 'First current inline fixture text.' }, { name: 'Inline fixture two', text: 'Second current inline fixture text.' }], considerations: ['First current fixture consideration.', 'Second current fixture consideration.'], related: ['state'] };
  const guide = { ...await yaml('src/data/speaking-cards/card-01.yaml'), number: Math.max(...baselineDataset.speaking_cards.map(({ number }) => number)) + 7, title: 'L2 Acceptance Guide', coreIdea: 'Quasar acceptance connects new canonical content and taxonomy to every projection.', concepts: [conceptSlug], primitives: [primitiveSlug] };
  const anchor = `card-${String(guide.number).padStart(2, '0')}`;
  await save(conceptFile, concept); await save(primitiveFile, primitive); await save(cardFile, guide);
  const stateConcepts = [
    ['l2-partial-concept','L2 Partial Concept','夹具局部概念'],
    ['l2-draft-concept','L2 Draft Concept','夹具草稿概念'],
    ['l2-stale-concept','L2 Stale Concept','夹具过期概念'],
  ];
  for (const [id,term,zh] of stateConcepts) {
    const path = `src/data/concepts/${id}.yaml`;
    assert.ok(!originalData.has(join(directory,path)));
    await save(path,{...concept,term,zh,aliases:[],examples:[],distinguish_from:[],primitives:[]}); added.push(path);
  }

  const mapRoot = 'src/data/skill-maps/l2-acceptance-map';
  const audience = '为首次验证 CelestialAudience 的读者提供参考。';
  const acceptanceMap = { ...mapInput, schema_version: '1.1.0', title: 'Quasar', summary: 'Quasar acceptance map.', audience: [audience], text_languages: { 'audience.0': 'zh-Hans' } };
  const acceptanceNode = { ...nodeInput, title: 'Quasar Node', summary: 'Quasar acceptance capability.' };
  const acceptanceJourney = { title: 'Quasar Journey', summary: 'Quasar acceptance guidance.', when_to_use: ['Validate canonical projections.'], outputs: ['A checked catalog.'], variants: [{ id: 'normal', title: 'Validate', steps: [{ title: 'Read', why: 'Inspect canonical inputs.', nodes: ['node'] }] }] };
  const mapFiles = [[`${mapRoot}/map.yaml`, acceptanceMap], [`${mapRoot}/relations.yaml`, { relations: [] }], [`${mapRoot}/nodes/node.yaml`, acceptanceNode], [`${mapRoot}/nodes/retired.yaml`, { title: 'Retained Quasar Node', summary: 'A retained capability.', type: 'tool', status: 'retired', retirement_note: 'Use the current capability.' }], [`${mapRoot}/journeys/journey.yaml`, acceptanceJourney]];
  for (const [path, data] of mapFiles) { assert.ok(!originalData.has(join(directory, path)), path); await mkdir(dirname(join(directory, path)), { recursive: true }); await save(path, data); added.push(path); }
  const { stdout: boundaryOutput } = await run(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { readFile } from 'node:fs/promises';
    import Ajv from 'ajv/dist/2020.js';
    import addFormats from 'ajv-formats';
    import { readCatalog, validateCatalog } from './src/domain/content/catalog.mjs';
    const catalog = await readCatalog();
    assert.deepEqual(validateCatalog(catalog).errors, []);
    const ajv = new Ajv({ allErrors: true }); addFormats(ajv);
    for (const [name, records] of [['concept',catalog.concepts],['primitive',catalog.primitives],['speaking-card',catalog.speakingCards]]) {
      const validate = ajv.compile(JSON.parse(await readFile('./schemas/'+name+'.schema.json','utf8')));
      for (const record of records) assert.ok(validate(record.data), JSON.stringify(validate.errors));
    }
    console.log(JSON.stringify([catalog.concepts.length,catalog.primitives.length,catalog.speakingCards.length]));
  `], { cwd: directory });
  assert.deepEqual(JSON.parse(boundaryOutput), [baselineDataset.concepts.length + 4, baselineDataset.primitives.length + 1, baselineDataset.speaking_cards.length + 1]);
  await npm(['run', 'check']);
  await npm(['test']);
  await npm(['run', 'build']);
  const dataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
  for (const type of ['concepts', 'primitives', 'speaking_cards']) {
    assert.equal(dataset[type].length, baselineDataset[type].length + (type === 'concepts' ? 4 : 1));
    assert.equal(dataset.counts[type], dataset[type].length);
    for (const record of baselineDataset[type]) assert.deepEqual(dataset[type].find((entry) => type === 'speaking_cards' ? entry.number === record.number : entry.slug === record.slug), record);
  }
  assert.deepEqual(dataset.speaking_cards.find(({ number }) => number === guide.number), guide);
  assert.deepEqual(dataset.concepts.find(({ slug }) => slug === conceptSlug), { slug: conceptSlug, aliases: [], examples: [], distinguish_from: [], ...concept, added: `${concept.added}T00:00:00.000Z` });
  assert.deepEqual(dataset.primitives.find(({ slug }) => slug === primitiveSlug), { slug: primitiveSlug, ...primitive, added: `${primitive.added}T00:00:00.000Z` });
  assert.ok((await html('concepts')).includes(`${base}/concepts/${conceptSlug}/`));
  for (const path of ['', 'categories']) assert.ok((await html(path)).includes(`${base}/categories/${category.slug}/`), `${path}: new category entry`);
  const conceptPage = await html(`concepts/${conceptSlug}`);
  const primitivePage = await html(`primitives/${primitiveSlug}`);
  for (const page of [conceptPage, primitivePage]) assert.ok(page.includes(`${base}/speaking-card/#${anchor}`));
  assert.ok(conceptPage.includes(`${base}/primitives/${primitiveSlug}/`));
  assert.ok(conceptPage.includes(`${base}/categories/${category.slug}/`));
  assert.ok(conceptPage.includes(concept.examples[0].context));
  assert.ok(conceptPage.includes(concept.examples[0].example));
  assert.ok(conceptPage.includes(concept.distinguish_from[0].distinction));
  assert.ok(conceptPage.includes(`${base}/concepts/verification/`));
  assert.ok(primitivePage.includes(concept.definition));
  assert.ok(primitivePage.includes(`${base}/concepts/${conceptSlug}/`));
  assert.ok(primitivePage.includes(`${base}/primitives/#${layer.anchor}`));
  assert.ok((await html(`categories/${category.slug}`)).includes(`${base}/concepts/${conceptSlug}/`));
  assert.match(await html(`categories/${category.slug}`), /04 concepts/);
  const layerHtml = await html('primitives');
  const memberSection = layerHtml.slice(layerHtml.indexOf(`id="${layer.anchor}"`));
  assert.match(memberSection, /01 primitives/);
  assert.ok(memberSection.includes(`${base}/primitives/${primitiveSlug}/`));
  const search = await html('search');
  const searchRows = [];
  walk(parseHtml(search), (_, attrs) => { if (attrs['data-search']) searchRows.push(attrs); });
  for (const [href, term] of [[`${base}/concepts/${conceptSlug}/`, concept.term], [`${base}/primitives/#${primitiveSlug}`, primitive.term]]) {
    assert.ok(searchRows.some((attrs) => attrs.href === href && attrs['data-search'].includes(term.toLowerCase())), `${term}: its own search entry`);
  }
  for (const value of [guide.title, guide.coreIdea, concept.term, concept.zh, primitive.term, primitive.zh]) {
    assert.ok(searchRows.some((attrs) => attrs.href === `${base}/speaking-card/#${anchor}` && attrs['data-search'].includes(value.toLowerCase())), value);
  }
  const llms = await readFile(join(directory, 'dist/llms.txt'), 'utf8');
  const cardsPage = await html('speaking-card');
  for (const route of [`concepts/${conceptSlug}/`, `primitives/${primitiveSlug}/`]) assert.ok(cardsPage.includes(`${base}/${route}`));
  for (const route of [`concepts/${conceptSlug}/`, `primitives/#${primitiveSlug}`, `speaking-card/#${anchor}`]) assert.ok(llms.includes(`${origin}${base}/${route}`));
  const expanded = await pages();
  for (const [path, old] of baseline) {
    assert.ok(expanded.has(path), `Removed baseline route ${path}`);
    for (const id of old.ids) assert.ok(expanded.get(path).ids.has(id), `${path}: removed baseline anchor ${id}`);
  }
  for (const anchor of ['layer-purpose-governance', 'layer-structure-representation', 'layer-dynamics-control', 'layer-cognition-action', 'layer-runtime-trust']) {
    assert.ok(baseline.get('primitives/index.html').ids.has(anchor));
    assert.ok(expanded.get('primitives/index.html').ids.has(anchor));
  }
  report.routes = { baseline: baseline.size, expanded: expanded.size, baselineLinks, expandedLinks: await checkLinks(expanded) };
  assert.equal(dataset.schema_version, '1.4.0');
  assert.deepEqual(dataset.concepts.find(({ slug }) => slug === conceptSlug).aliases, ['Quasar acceptance alias']);
  assert.equal(dataset.counts.skill_maps, baselineDataset.skill_maps.length + 1);
  assert.equal(dataset.skill_maps.find(({ id }) => id === 'l2-acceptance-map').nodes.find(({ id }) => id === 'retired').status, 'retired');
  stage('complete content, relationships, projections and preserved public targets');
  const missingPage = await html(`zh-cn/concepts/${conceptSlug}`);
  const missingCoverage = assertTranslationPolicy(missingPage, `concepts/${conceptSlug}`, false);
  assert.equal(missingCoverage['data-translated'], '0');
  assertUnitLanguage(missingPage, concept.definition, 'en');
  assertUnitLanguage(await html(`zh-cn/primitives/${primitiveSlug}`), concept.definition, 'en');
  for (const [path] of expanded) {
    if (path === '404.html' || path.startsWith('zh-cn/')) continue;
    assert.ok(expanded.has(`zh-cn/${path}`), `Missing Chinese counterpart ${path}`);
  }
  stage('no-overlay Chinese route parity, missing core SEO and current English reference fallback');


  for (const [file, changed, expected] of [
    [conceptFile, { ...concept, examples: [{ context: ' ', example: 'An illustration.' }] }, /examples/],
    [conceptFile, { ...concept, distinguish_from: [{ target: 'missing-concept', distinction: 'A difference.' }] }, /distinguish_from target/],
    [conceptFile, { ...concept, distinguish_from: [{ target: conceptSlug, distinction: 'A difference.' }] }, /distinguish_from cannot reference itself/],
    [conceptFile, { ...concept, distinguish_from: [{ target: 'verification', distinction: 'First.' }, { target: 'verification', distinction: 'Second.' }] }, /duplicate distinguish_from target/],
    [conceptFile, { ...concept, category: 'Unconfigured Domain' }, /category/],
    [conceptFile, { ...concept, aliases: [' '] }, /aliases/],
    [conceptFile, { ...concept, aliases: [concept.term] }, /aliases/],
    [conceptFile, { ...concept, aliases: ['Alias', ' alias '] }, /aliases/],
    [primitiveFile, { ...primitive, layer: 'Unconfigured Layer' }, /layer/],
    [cardFile, { ...guide, concepts: ['missing-concept'] }, /missing-concept/],
    [cardFile, { ...guide, primitives: ['missing-primitive'] }, /missing-primitive/],
    [primitiveFile, { ...primitive, related: ['missing-primitive'] }, /missing-primitive/],
    [cardFile, { ...guide, number: baselineDataset.speaking_cards[0].number }, /duplicate speaking card number/],
  ]) {
    const original = await readFile(join(directory, file), 'utf8');
    await save(file, changed);
    await assert.rejects(npm(['run', 'validate:catalog']), expected);
    await writeFile(join(directory, file), original);
  }
  const duplicate = `src/data/concepts/${conceptSlug}.yaml`;
  await save(duplicate, concept);
  await assert.rejects(npm(['run', 'validate:catalog']), /duplicate/);
  await rm(join(directory, duplicate));
  const schemaFile = join(directory, 'schemas/concept.schema.json');
  const schema = await readFile(schemaFile, 'utf8');
  await writeFile(schemaFile, '{}\n');
  await assert.rejects(npm(['run', 'check']), /Schema drift/);
  assert.equal(await readFile(schemaFile, 'utf8'), '{}\n');
  await writeFile(schemaFile, schema);
  await npm(['run', 'validate:catalog']);
  stage('invalid references, duplicate identities, unknown taxonomy and read-only drift rejection');

  // Reviewed units below are synthetic fixture assets; they do not accept formal translations.
  const fixtureTranslations = {
    conceptSummary:'覆盖星舰 HanOverlayFixture：独立夹具的当前摘要。',
    conceptDefinition:'HanOverlayDefinition：独立夹具的当前中文定义。',
    primitiveSummary:'PrimitiveHanFixture：独立夹具的中文原语摘要。',
    primitiveScope:'独立夹具的当前中文适用范围。',
    oldContexts:['L2旧情境甲','L2旧情境乙'], oldExamples:['L2旧示例甲','L2旧示例乙'],
    oldDistinctions:['L2旧区别甲'], oldNames:['L2旧名称甲','L2旧名称乙'],
    oldDefinitions:['L2旧内联定义甲','L2旧内联定义乙'], oldConsiderations:['L2旧注意甲','L2旧注意乙'],
  };
  const translationRoot = 'src/data/translations/l2-fixture';
  await mkdir(join(directory,translationRoot),{recursive:true});
  const fixtureCatalog = await publicCatalog();
  assert.deepEqual(fixtureCatalog.errors,[]);
  const overlays = [
    fixtureOverlay(fixtureCatalog,'concept',conceptSlug,{summary:fixtureTranslations.conceptSummary,definition:fixtureTranslations.conceptDefinition,'examples.context':fixtureTranslations.oldContexts,'examples.example':fixtureTranslations.oldExamples,'distinguish_from.distinction':fixtureTranslations.oldDistinctions}),
    fixtureOverlay(fixtureCatalog,'primitive',primitiveSlug,{summary:fixtureTranslations.primitiveSummary,scope:fixtureTranslations.primitiveScope,'definitions.name':fixtureTranslations.oldNames,'definitions.text':fixtureTranslations.oldDefinitions,considerations:fixtureTranslations.oldConsiderations}),
    fixtureOverlay(fixtureCatalog,'category',category.slug,{label:'夹具分类',description:'独立验收夹具分类说明。',question:'译文投影是否保持正式身份？'}),
    fixtureOverlay(fixtureCatalog,'layer',layer.anchor,{label:'夹具层'}),
    fixtureOverlay(fixtureCatalog,'concept','l2-partial-concept',{summary:'L2局部摘要：核心定义尚未翻译。'}),
    fixtureOverlay(fixtureCatalog,'concept','l2-draft-concept',{summary:'L2草稿摘要不得发布',definition:'L2草稿定义不得发布'},'draft'),
    fixtureOverlay(fixtureCatalog,'concept','l2-stale-concept',{summary:'L2过期摘要不得发布',definition:'L2过期定义不得发布'}),
  ];
  for (const unit of overlays.at(-1).units) unit.source_fingerprint = 'sha256:'+'0'.repeat(64);
  const taxonomyCases = { categories: fixtureCatalog.categories.filter((entry) => entry.slug !== category.slug).slice(0,3), layers: fixtureCatalog.layers.filter((entry) => entry.anchor !== layer.anchor).slice(0,3) };
  for (const [index,entry] of fixtureCatalog.categories.entries()) if (entry.slug !== category.slug) overlays.push(fixtureOverlay(fixtureCatalog,'category',entry.slug,{label:`L2分类${index}`,description:`L2分类${index}的独立夹具说明。`,question:`L2分类${index}的夹具问题？`}));
  for (const [index,entry] of fixtureCatalog.layers.entries()) if (entry.anchor !== layer.anchor) overlays.push(fixtureOverlay(fixtureCatalog,'layer',entry.anchor,{label:`L2层级${index}`}));

  const overlayPaths = overlays.map((overlay,index) => `${translationRoot}/${index}-${overlay.kind}.yaml`);
  for (const path of overlayPaths) assert.ok(!originalData.has(join(directory,path)), `Fixture translation file already exists: ${path}`);
  for (const [index,overlay] of overlays.entries()) {await save(overlayPaths[index],overlay); added.push(overlayPaths[index]);}
  assert.deepEqual((await publicCatalog()).errors,[]);
  await npm(['run','validate:catalog']);
  // Reader and CLI must reject the same invalid boundary; the actual Astro loader rejects it too.
  const invalidPath = `${translationRoot}/invalid.yaml`;
  await rm(join(directory,overlayPaths[0]));
  for (const invalid of [
    {...overlays[0],target_id:'missing-l2-target'},
    {...overlays[0],units:[{...overlays[0].units[0],path:'term'}]},
    {...overlays[0],units:[{...overlays[0].units[0],translation:['wrong scalar shape']}]},
    {...overlays[0],units:[{...overlays[0].units[0],reviewed_at:'2026-02-30'}]},
    {...overlays[0],units:[{...overlays[0].units.find((unit)=>unit.path==='examples.example'),translation:['wrong current vector length']}]},
  ]) {
    await save(invalidPath,invalid);
    assert.ok((await publicCatalog()).errors.length > 0);
    await assert.rejects(npm(['run','validate:catalog']),/translation|reviewed_at|duplicate/i);
    await rm(join(directory,invalidPath));
  }
  await save(overlayPaths[0],overlays[0]);
  await save(invalidPath,overlays[0]);
  assert.match((await publicCatalog()).errors.join('\n'),/duplicate translation identity/);
  await assert.rejects(npm(['run','validate:catalog']),/duplicate translation identity/);
  await save(invalidPath,{...overlays[0],target_id:'missing-l2-target'});
  await assert.rejects(npm(['exec','--','astro','build']),/translation.*target|missing-l2-target/i);
  await rm(join(directory,invalidPath));
  stage('translation public reader, CLI and actual Astro invalid-boundary rejection');

  await npm(['run','build']);
  const translatedDataset = JSON.parse(await readFile(join(directory,'dist/dataset.json'),'utf8'));
  assert.deepEqual(canonicalDataset(translatedDataset),canonicalDataset(dataset));
  assert.equal(translatedDataset.dataset_version,dataset.dataset_version);
  assert.equal(await readFile(join(directory,'dist/llms.txt'),'utf8'),llms);
  const translatedConcept = await html(`zh-cn/concepts/${conceptSlug}`);
  assertTranslationPolicy(translatedConcept,`concepts/${conceptSlug}`,true);
  assertUnitLanguage(translatedConcept,fixtureTranslations.conceptSummary,'zh-CN');
  assertUnitLanguage(translatedConcept,fixtureTranslations.conceptDefinition,'zh-CN');
  assertUnitLanguage(translatedConcept,concept.why_it_matters,'en');
  for (const text of fixtureTranslations.oldExamples) assertUnitLanguage(translatedConcept,text,'zh-CN');
  const translatedPrimitive = await html(`zh-cn/primitives/${primitiveSlug}`);
  assertTranslationPolicy(translatedPrimitive,`primitives/${primitiveSlug}`,true);
  assertUnitLanguage(translatedPrimitive,fixtureTranslations.conceptDefinition,'zh-CN');
  for (const [id,state,count] of [['l2-partial-concept','missing',1],['l2-draft-concept','draft',2],['l2-stale-concept','stale',2]]) {
    const page = await html(`zh-cn/concepts/${id}`), coverage = assertTranslationPolicy(page,`concepts/${id}`,false);
    assert.equal(coverage[`data-${state}`] === undefined,false);
    if (state !== 'missing') assert.equal(Number(coverage[`data-${state}`]),count);
    assert.equal(Number(coverage['data-translated']),id === 'l2-partial-concept' ? 1 : 0);
    const canonical = fixtureCatalog.concepts.find(({slug})=>slug===id).data;
    assertUnitLanguage(page,canonical.definition,'en');
    assert.ok(!page.includes('L2草稿定义不得发布') && !page.includes('L2过期定义不得发布'));
  }
  for (const route of ['', 'categories', 'primitives']) assertTranslationPolicy(await html(`zh-cn/${route}`),route,true);
  assertTranslationPolicy(await html(`zh-cn/categories/${category.slug}`),`categories/${category.slug}`,true);
  assertUnitLanguage(await html(`categories/${category.slug}`),category.name,'en');
  report.translations = { reviewedFixtureOnly:true,coreSEO:true,partialDraftStale:true,exportShape:dataset.schema_version,datasetVersionUnchanged:translatedDataset.dataset_version,canonicalArraysUnchanged:true,llmsUnchanged:true };
  if (browser) {
    await mkdir(evidence,{recursive:true});
    const {verifyBrowser} = await import('./verify-l2-browser.mjs');
    report.translations.taxonomyReviewedBrowser = await verifyBrowser(directory,evidence,{base,category,taxonomyOnly:true});
  }
  stage('reviewed/partial/draft/stale projections, actual language, core SEO and translation-only export invariance');

  // Unrelated metadata does not expire units; test this through the shared public resolver before restoring it.
  await save(conceptFile,{...concept,added:'2026-10-07',sources:[{title:'Fixture metadata source',url:'https://example.com/fixture-metadata'}]});
  const {stdout: metadataOutput} = await run(process.execPath,['--input-type=module','-e',`
    import assert from 'node:assert/strict';
    import {readCatalog,validateCatalog} from './src/domain/content/catalog.mjs';
    import {resolveCatalog} from './src/domain/content/localize-catalog.mjs';
    const catalog=await readCatalog(); assert.deepEqual(validateCatalog(catalog).errors,[]);
    const record=resolveCatalog(catalog,catalog.translations,'zh-CN').concepts.find(({id})=>id===${JSON.stringify(conceptSlug)});
    for (const path of ['summary','definition','examples.context','examples.example','distinguish_from.distinction']) assert.equal(record.units[path].status,'reviewed');
    console.log('metadata-current');
  `],{cwd:directory});
  assert.equal(metadataOutput.trim(),'metadata-current');
  await save(conceptFile,concept);
  for (const examples of [
    [...concept.examples].reverse(),
    [...concept.examples,{context:'Inserted fixture context',example:'Inserted fixture example'}],
    [],
  ]) {
    await save(conceptFile,{...concept,examples});
    const {stdout} = await run(process.execPath,['--input-type=module','-e',`
      import assert from 'node:assert/strict';
      import {readCatalog,validateCatalog} from './src/domain/content/catalog.mjs';
      import {resolveCatalog} from './src/domain/content/localize-catalog.mjs';
      const catalog=await readCatalog(); assert.deepEqual(validateCatalog(catalog).errors,[]);
      const record=resolveCatalog(catalog,catalog.translations,'zh-CN').concepts.find(({id})=>id===${JSON.stringify(conceptSlug)});
      assert.equal(record.units['examples.context'].status,'stale'); assert.equal(record.units['examples.example'].status,'stale');
      assert.deepEqual(record.data.examples,${JSON.stringify(examples)});
      console.log('owner-current-fallback');
    `],{cwd:directory});
    assert.equal(stdout.trim(),'owner-current-fallback');
    await npm(['run','validate:catalog']);
  }
  await save(conceptFile,concept);

  // Positional mutation retains historical overlay bytes: stale vectors must never reach any display projection.
  const referenceSlug = 'l2-reference-branch-concept', referenceFile = `src/data/concepts/${referenceSlug}.yaml`;
  const referenceConcept = {...concept,term:'L2 Reference Branch Concept',zh:'夹具引用分支概念',aliases:[],examples:[],distinguish_from:[],definition:'ReferenceBranchFixture is the current English referenced definition. The Primitive resolves this Concept at the shared catalog boundary without maintaining a duplicate definition.'};
  await save(referenceFile,referenceConcept); added.push(referenceFile);
  concept.examples = concept.examples.slice(1); concept.distinguish_from = [];
  primitive.definitions = [{concept:conceptSlug},{concept:referenceSlug},primitive.definitions[2]];
  primitive.considerations = primitive.considerations.slice(1);
  await save(conceptFile,concept); await save(primitiveFile,primitive);
  for (const [kind,entries] of [['category',taxonomyCases.categories],['layer',taxonomyCases.layers]]) {
    for (const [index,entry] of entries.entries()) {
      const id = entry.slug ?? entry.anchor, overlayIndex = overlays.findIndex((overlay) => overlay.kind === kind && overlay.target_id === id);
      const overlay = overlays[overlayIndex];
      if (index === 0) { overlay.units[0].review_status = 'draft'; delete overlay.units[0].reviewed_at; await save(overlayPaths[overlayIndex],overlay); }
      else if (index === 1) { overlay.units[0].source_fingerprint = 'sha256:'+'0'.repeat(64); await save(overlayPaths[overlayIndex],overlay); }
      else await rm(join(directory,overlayPaths[overlayIndex]));
    }
  }
  assert.deepEqual((await publicCatalog()).errors,[]);
  await npm(['run','build']);
  for (const route of ['', 'categories', 'primitives']) assertTranslationPolicy(await html(`zh-cn/${route}`),route,false);
  for (const [index,entry] of taxonomyCases.categories.entries()) {
    const coverage = assertTranslationPolicy(await html(`zh-cn/categories/${entry.slug}`),`categories/${entry.slug}`,false);
    assert.ok(Number(coverage[`data-${['draft','stale','missing'][index]}`]) > 0);
  }
  report.translations.taxonomyNavigation = { missingNoOverlay:true, reviewedIndexable:true, draftStaleMissingNoindex:true, englishTitleLanguage:true };
  const mutatedConcept = await html(`zh-cn/concepts/${conceptSlug}`), mutatedPrimitive = await html(`zh-cn/primitives/${primitiveSlug}`);
  assertTranslationPolicy(mutatedConcept,`concepts/${conceptSlug}`,true);
  assertTranslationPolicy(mutatedPrimitive,`primitives/${primitiveSlug}`,true);
  assertUnitLanguage(mutatedConcept,concept.examples[0].example,'en');
  assertUnitLanguage(mutatedPrimitive,fixtureTranslations.conceptDefinition,'zh-CN');
  assertUnitLanguage(mutatedPrimitive,referenceConcept.definition,'en');
  assertUnitLanguage(mutatedPrimitive,primitive.definitions[2].text,'en');
  const retiredText = [fixtureTranslations.oldContexts,fixtureTranslations.oldExamples,fixtureTranslations.oldDistinctions,fixtureTranslations.oldNames,fixtureTranslations.oldDefinitions,fixtureTranslations.oldConsiderations].flat();
  for (const route of [`zh-cn/concepts/${conceptSlug}`,`zh-cn/primitives/${primitiveSlug}`,'zh-cn/search']) {
    const source = await html(route);
    for (const text of retiredText) assert.ok(!source.includes(text),`${route}: stale owner text leaked ${text}`);
  }
  const finalPages = await pages();
  report.routes.translated = finalPages.size; report.routes.translatedLinks = await checkLinks(finalPages);
  report.translations.ownerMutation = { deletion:true,inlineToReference:true,currentReferenceLanguage:true,staleVectorsUnpublished:true,metadataRemainsCurrent:true };
  stage('owner deletion and reference branch fallback in actual HTML/search, preserved core SEO and metadata freshness');


  if (browser) {
    await mkdir(evidence, { recursive: true });
    const { verifyBrowser } = await import('./verify-l2-browser.mjs');
    report.browserResult = await verifyBrowser(directory, evidence, { base, category, layer, conceptSlug, primitiveSlug, concept, primitive, guide, anchor, mapId: 'l2-acceptance-map', audience, translations: { ...fixtureTranslations,referenceConcept,referenceSlug,retiredText,taxonomyCases } });
    report.viewports = report.browserResult.viewports;
    stage('real browser search, disclosure, relationship navigation and overflow');
  }
  // Restore copied formal overlay bytes before checking every original input.
  if (hadTranslations) await cp(savedTranslations, translationInputRoot, { recursive: true });
  for (const [file, source] of originalData) assert.equal(await readFile(file, 'utf8'), source, file);
  for (const path of added) await rm(join(directory, path), { force: true });
  await rm(join(directory,translationRoot),{recursive:true});
  assert.equal(await digest(join(directory, 'src')), sourceBefore, 'Expansion must not edit source or existing data');
  assert.equal(await digest(join(repository, 'src/data')), canonicalBefore, 'Formal data must remain unchanged');
  stage('isolated cleanup and unchanged formal YAML/source');
  await mkdir(evidence, { recursive: true });
  await writeFile(join(evidence, browser ? 'browser-report.json' : 'automatic-report.json'), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
