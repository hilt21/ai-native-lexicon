import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse as parseHtml } from 'parse5';
import { parse, stringify } from 'yaml';
import { mapInput, nodeInput } from '../tests/skill-map-fixture.mjs';

const run = promisify(execFile);
const repository = fileURLToPath(new URL('../', import.meta.url));
const base = '/ai-native-lexicon';
const origin = 'https://hilt21.github.io';
const browser = process.argv.includes('--browser');
assert.ok(process.argv.slice(2).every((arg) => arg === '--browser'), 'Only --browser is supported');
const evidence = join(repository, 'output/playwright/l2-10');
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
  await npm(['run', 'build']);
  const baseline = await pages();
  const baselineLinks = await checkLinks(baseline);
  const baselineDataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
  stage('baseline public routes, unique IDs and internal links');

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
  stage('empty category/layer and generated portable enums');

  const concept = { aliases: ['Quasar acceptance alias'], ...await yaml('src/data/concepts/verification.yaml'), term: 'L2 Acceptance Concept', zh: '扩充验收概念', category: category.name, related: ['verification', 'evidence'], primitives: [primitiveSlug], definition: 'An isolated acceptance concept verifies that configuration and canonical records produce consistent projections.' };
  const primitive = { ...await yaml('src/data/primitives/state.yaml'), summary: 'Quasar acceptance verifies the canonical catalog across fields, typed filters and public projections.', term: 'L2 Acceptance Primitive', zh: '扩充验收原语', layer: layer.name, definitions: [{ concept: conceptSlug }], related: ['state'] };
  const guide = { ...await yaml('src/data/speaking-cards/card-01.yaml'), number: Math.max(...baselineDataset.speaking_cards.map(({ number }) => number)) + 7, title: 'L2 Acceptance Guide', coreIdea: 'Quasar acceptance connects new canonical content and taxonomy to every projection.', concepts: [conceptSlug], primitives: [primitiveSlug] };
  const anchor = `card-${String(guide.number).padStart(2, '0')}`;
  await save(conceptFile, concept); await save(primitiveFile, primitive); await save(cardFile, guide);
  const mapRoot = 'src/data/skill-maps/l2-acceptance-map';
  const acceptanceMap = { ...mapInput, title: 'Quasar', summary: 'Quasar acceptance map.' };
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
  assert.deepEqual(JSON.parse(boundaryOutput), [baselineDataset.concepts.length + 1, baselineDataset.primitives.length + 1, baselineDataset.speaking_cards.length + 1]);
  await npm(['run', 'check']);
  await npm(['test']);
  await npm(['run', 'build']);
  const dataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
  for (const type of ['concepts', 'primitives', 'speaking_cards']) {
    assert.equal(dataset[type].length, baselineDataset[type].length + 1);
    assert.equal(dataset.counts[type], dataset[type].length);
    for (const record of baselineDataset[type]) assert.deepEqual(dataset[type].find((entry) => type === 'speaking_cards' ? entry.number === record.number : entry.slug === record.slug), record);
  }
  assert.deepEqual(dataset.speaking_cards.find(({ number }) => number === guide.number), guide);
  assert.deepEqual(dataset.concepts.find(({ slug }) => slug === conceptSlug), { slug: conceptSlug, aliases: [], ...concept, added: `${concept.added}T00:00:00.000Z` });
  assert.deepEqual(dataset.primitives.find(({ slug }) => slug === primitiveSlug), { slug: primitiveSlug, ...primitive, added: `${primitive.added}T00:00:00.000Z` });
  assert.ok((await html('concepts')).includes(`${base}/concepts/${conceptSlug}/`));
  for (const path of ['', 'categories']) assert.ok((await html(path)).includes(`${base}/categories/${category.slug}/`), `${path}: new category entry`);
  const conceptPage = await html(`concepts/${conceptSlug}`);
  const primitivePage = await html(`primitives/${primitiveSlug}`);
  for (const page of [conceptPage, primitivePage]) assert.ok(page.includes(`${base}/speaking-card/#${anchor}`));
  assert.ok(conceptPage.includes(`${base}/primitives/${primitiveSlug}/`));
  assert.ok(conceptPage.includes(`${base}/categories/${category.slug}/`));
  assert.ok(primitivePage.includes(concept.definition));
  assert.ok(primitivePage.includes(`${base}/concepts/${conceptSlug}/`));
  assert.ok(primitivePage.includes(`${base}/primitives/#${layer.anchor}`));
  assert.ok((await html(`categories/${category.slug}`)).includes(`${base}/concepts/${conceptSlug}/`));
  assert.match(await html(`categories/${category.slug}`), /01 concepts/);
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
  assert.equal(dataset.schema_version, '1.3.0');
  assert.deepEqual(dataset.concepts.find(({ slug }) => slug === conceptSlug).aliases, ['Quasar acceptance alias']);
  assert.equal(dataset.counts.skill_maps, baselineDataset.skill_maps.length + 1);
  assert.equal(dataset.skill_maps.find(({ id }) => id === 'l2-acceptance-map').nodes.find(({ id }) => id === 'retired').status, 'retired');
  stage('complete content, relationships, projections and preserved public targets');

  for (const [file, changed, expected] of [
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

  if (browser) {
    await mkdir(evidence, { recursive: true });
    const { verifyBrowser } = await import('./verify-l2-browser.mjs');
    report.browserResult = await verifyBrowser(directory, evidence, { base, category, layer, conceptSlug, primitiveSlug, concept, primitive, guide, anchor, mapId: 'l2-acceptance-map' });
    report.viewports = report.browserResult.viewports;
    stage('real browser search, disclosure, relationship navigation and overflow');
  }
  for (const [file, source] of originalData) assert.equal(await readFile(file, 'utf8'), source, file);
  for (const path of added) await rm(join(directory, path));
  assert.equal(await digest(join(directory, 'src')), sourceBefore, 'Expansion must not edit source or existing data');
  assert.equal(await digest(join(repository, 'src/data')), canonicalBefore, 'Formal data must remain unchanged');
  stage('isolated cleanup and unchanged formal YAML/source');
  await mkdir(evidence, { recursive: true });
  await writeFile(join(evidence, browser ? 'browser-report.json' : 'automatic-report.json'), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
