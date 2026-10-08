import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, cp, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse, stringify } from 'yaml';
import { categoryRegistry } from '../src/domain/taxonomy/categories.mjs';
import { layerRegistry } from '../src/domain/taxonomy/layers.mjs';
import { readCatalog, validateCatalog } from '../src/domain/content/catalog.mjs';

test('Matt Pocock and an additional skill map appear across page and machine projections using only YAML additions', async () => {
  const baseline = await readCatalog();
  assert.deepEqual(validateCatalog(baseline).errors, []);
  const mattRecord = baseline.skillMaps.find((map) => map.id === 'mattpocock');
  assert.ok(mattRecord, 'the approved Matt Pocock map must be discoverable through the public catalog');
  const matt = mattRecord.data;
  assert.equal(matt.nodes.length, 31);
  assert.deepEqual(matt.journeys.map(({ id }) => id).sort(), ['build-a-feature', 'choose-a-skill', 'clarify-an-idea', 'fix-a-hard-bug', 'handoff-work', 'improve-codebase', 'plan-a-huge-effort']);
  await inIsolatedProject(async (directory) => {
    const root = join(directory, 'src/data/skill-maps/example');
    await mkdir(join(root, 'nodes'), { recursive: true });
    await mkdir(join(root, 'journeys'), { recursive: true });
    const originalMap = await yaml(directory, 'src/data/skill-maps/pstack/map.yaml');
    delete originalMap.text_languages;
    await writeFile(join(root, 'map.yaml'), stringify({ ...originalMap, title: 'Example Skill Map', scope: 'Synthetic test ecosystem', taxonomy: { types: [{ id: 'tool', label: 'Tool', description: 'A custom capability.' }], relation_types: [] } }));
    await writeFile(join(root, 'relations.yaml'), stringify({ relations: [] }));
    const node = await yaml(directory, 'src/data/skill-maps/pstack/nodes/how.yaml');
    delete node.layer; delete node.primary_cluster; node.secondary_clusters = [];
    await writeFile(join(root, 'nodes/how.yaml'), stringify({ ...node, type: 'tool' }));
    await npm(directory, ['run', 'build'], { SKIP_PAGEFIND: 'true' });
    const dataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
    assert.equal(dataset.schema_version, '1.4.0');
    assert.equal(dataset.counts.skill_maps, baseline.skillMaps.length + 1);
    const exportedMatt = dataset.skill_maps.find((map) => map.id === 'mattpocock');
    assert.equal(exportedMatt.schema_version, '1.1.0');
    assert.equal(exportedMatt.text_languages.scope, 'zh-Hans');
    assert.equal(exportedMatt.text_languages.title, 'en');
    assert.equal(exportedMatt.nodes.length, 31);
    assert.equal(exportedMatt.journeys.length, 7);
    assert.equal(dataset.skill_maps.find((m) => m.id === 'example').nodes[0].id, 'how');
    const page = await readFile(join(directory, 'dist/skill-maps/example/nodes/how/index.html'), 'utf8');
    assert.match(page, /Example Skill Map/);
    assert.match(page, /\/ai-native-lexicon\/skill-maps\/example\/nodes\//);
    const search = await readFile(join(directory, 'dist/search/index.html'), 'utf8');
    assert.match(search, /\/ai-native-lexicon\/skill-maps\/example\/nodes\/how\//);
    assert.match(await readFile(join(directory, 'dist/llms.txt'), 'utf8'), /Example Skill Map/);
    assert.match(await readFile(join(directory, 'dist/llms.txt'), 'utf8'), /Matt Pocock Skills Map/);
    const maps = await readFile(join(directory, 'dist/skill-maps/index.html'), 'utf8');
    assert.match(maps, /\/ai-native-lexicon\/skill-maps\/mattpocock\//);
    for (const collection of ['nodes', 'journeys']) {
      for (const { id } of matt[collection]) {
        const route = `/ai-native-lexicon/skill-maps/mattpocock/${collection}/${id}/`;
        assert.ok(search.includes(route), `${route} is discoverable in Search`);
        const detail = await readFile(join(directory, `dist/skill-maps/mattpocock/${collection}/${id}/index.html`), 'utf8');
        assert.match(detail, /Matt Pocock Skills Map/);
        assert.match(detail, /dd400c3ad65e57c06f05e832e0aac92c7992f34d/);
      }
    }
    for (const path of ['index.html', 'nodes/index.html', 'overview/index.html']) {
      assert.match(await readFile(join(directory, 'dist/skill-maps/mattpocock', path), 'utf8'), /Matt Pocock Skills Map/);
    }
    const pstack = await readFile(join(directory, 'dist/skill-maps/pstack/journeys/fix-bug/index.html'), 'utf8');
    assert.match(pstack, /修复涉及模块或接口变化时/);
    const configuredMap = await yaml(directory, 'src/data/skill-maps/example/map.yaml');
    configuredMap.taxonomy.layers = [{ id: 'configured', label: 'Configured', description: 'An optional layer.' }];
    await writeFile(join(root, 'map.yaml'), stringify(configuredMap));
    await npm(directory, ['run', 'build'], { SKIP_PAGEFIND: 'true' });
    assert.match(await readFile(join(directory, 'dist/skill-maps/example/overview/index.html'), 'utf8'), /\/skill-maps\/example\/nodes\/how\//);
    await writeFile(join(root, 'nodes/how.yaml'), stringify({ title: 'Old how', summary: 'Retired test entry.', type: 'tool', status: 'retired', retirement_note: 'Use current tools.', source_refs: node.source_refs }));
    await npm(directory, ['run', 'build'], { SKIP_PAGEFIND: 'true' });
    const retired = await readFile(join(directory, 'dist/skill-maps/example/nodes/how/index.html'), 'utf8');
    assert.match(retired, /Retired/);
    assert.match(retired, new RegExp(originalMap.sources[0].commit));
    const second = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
    assert.equal(second.skill_maps.find((m) => m.id === 'example').nodes[0].status, 'retired');
  });
});

const run = promisify(execFile);
const repository = fileURLToPath(new URL('../', import.meta.url));

async function inIsolatedProject(verify) {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-extension-'));
  try {
    for (const path of ['src', 'scripts', 'schemas', 'tests', 'public', 'package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json']) {
      await cp(join(repository, path), join(directory, path), { recursive: true });
    }
    // External dependency symlinks break Astro's virtual CSS module paths on Linux.
    await cp(join(repository, 'node_modules'), join(directory, 'node_modules'), { recursive: true, verbatimSymlinks: true });
    await verify(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function npm(directory, args, environment = {}) {
  const env = {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    GITHUB_ACTIONS: 'true',
    GITHUB_REPOSITORY: 'hilt21/ai-native-lexicon',
    GITHUB_REPOSITORY_OWNER: 'hilt21',
    BASE_PATH: '/ai-native-lexicon',
    CONTENT_BRANCH: '',
    ...environment,
  };
  // The isolated suite must not inherit the parent node:test runner context.
  delete env.NODE_TEST_CONTEXT;
  try {
    const { stdout } = await run('npm', args, {
      cwd: directory,
      maxBuffer: 4 * 1024 * 1024,
      env,
    });
    if (args[0] === 'test') assert.match(stdout, /(?:# |ℹ )tests [1-9]\d*/);
  } catch (error) {
    throw new Error(`npm ${args.join(' ')} failed:\n${error.stdout}\n${error.stderr}`, { cause: error });
  }
}

async function yaml(directory, path) {
  return parse(await readFile(join(directory, path), 'utf8'));
}

test('adding valid YAML records passes checks, tests and build without changing existing identifiers', async () => {
  await inIsolatedProject(async (directory) => {
    const data = join(directory, 'src/data');
    const concept = await yaml(directory, 'src/data/concepts/verification.yaml');
    const primitive = await yaml(directory, 'src/data/primitives/view-projection.yaml');
    const card = await yaml(directory, 'src/data/speaking-cards/card-20.yaml');
    const originalCards = await Promise.all((await readdir(join(data, 'speaking-cards')))
      .filter((file) => /\.ya?ml$/.test(file))
      .map((file) => yaml(directory, `src/data/speaking-cards/${file}`)));
    const number = Math.max(...originalCards.map((entry) => entry.number)) + 1;

    await writeFile(join(data, 'concepts/l2-extension-concept.yaml'), stringify({
      ...concept,
      term: 'L2 Extension Concept',
      primitives: ['l2-extension-primitive'],
    }));
    await writeFile(join(data, 'primitives/l2-extension-primitive.yaml'), stringify({
      ...primitive,
      term: 'L2 Extension Primitive',
      definitions: [{ concept: 'l2-extension-concept' }],
    }));
    await writeFile(join(data, 'speaking-cards/l2-extension-card.yaml'), stringify({
      ...card,
      number,
      title: 'L2 Extension Card',
      concepts: ['l2-extension-concept'],
      primitives: ['l2-extension-primitive'],
    }));

    await npm(directory, ['run', 'check']);
    await npm(directory, ['test']);
    await npm(directory, ['run', 'build']);

    for (const collection of ['concepts', 'primitives']) {
      for (const file of (await readdir(join(repository, 'src/data', collection))).filter((file) => /\.ya?ml$/.test(file))) {
        await access(join(directory, 'dist', collection, file.replace(/\.ya?ml$/, ''), 'index.html'));
        assert.equal(await readFile(join(data, collection, file), 'utf8'), await readFile(join(repository, 'src/data', collection, file), 'utf8'));
      }
    }
    const conceptPage = await readFile(join(directory, 'dist/concepts/l2-extension-concept/index.html'), 'utf8');
    const primitivePage = await readFile(join(directory, 'dist/primitives/l2-extension-primitive/index.html'), 'utf8');
    assert.ok(conceptPage.includes('L2 Extension Concept'));
    assert.ok(primitivePage.includes('L2 Extension Primitive'));
    const cardsPage = await readFile(join(directory, 'dist/speaking-card/index.html'), 'utf8');
    for (const entry of [...originalCards, { number }]) {
      assert.ok(cardsPage.includes(`id="card-${String(entry.number).padStart(2, '0')}"`));
    }
    assert.ok(conceptPage.includes(`/ai-native-lexicon/speaking-card/#card-${String(number).padStart(2, '0')}`));
    assert.ok(primitivePage.includes(`/ai-native-lexicon/speaking-card/#card-${String(number).padStart(2, '0')}`));
  });
});

test('rendered edit links use the default content branch and an explicit override', async () => {
  await inIsolatedProject(async (directory) => {
    for (const branch of ['master', 'codex/edit-link-check']) {
      await npm(directory, ['run', 'build'], { CONTENT_BRANCH: branch === 'master' ? '' : branch });
      const conceptPage = await readFile(join(directory, 'dist/concepts/verification/index.html'), 'utf8');
      const aboutPage = await readFile(join(directory, 'dist/about/index.html'), 'utf8');
      const editBase = `https://github.com/hilt21/ai-native-lexicon/edit/${branch}/`;
      assert.ok(conceptPage.includes(`${editBase}src/data/concepts/verification.yaml`), `concept edit link must use ${branch}`);
      assert.ok(aboutPage.includes(editBase), `Starlight edit link must use ${branch}`);
    }
  });
});

test('a standalone Concept uses the shared contract in the CLI and deployed projections', async () => {
  await inIsolatedProject(async (directory) => {
    const original = await yaml(directory, 'src/data/concepts/verification.yaml');
    const { sources, ...fields } = original;
    const concept = {
      ...fields,
      term: 'L2 Concept Migration',
      primitives: ['view-projection'],
      added: '2026-10-06',
    };
    const file = join(directory, 'src/data/concepts/l2-concept-migration.yaml');
    await writeFile(file, stringify(concept));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['run', 'build']);
    const route = '/ai-native-lexicon/concepts/l2-concept-migration/';
    for (const path of ['concepts/index.html', 'categories/verification/index.html']) {
      assert.ok((await readFile(join(directory, 'dist', path), 'utf8')).includes(`href="${route}"`), path);
    }
    const detail = await readFile(join(directory, 'dist/concepts/l2-concept-migration/index.html'), 'utf8');
    assert.ok(detail.includes('href="/ai-native-lexicon/primitives/view-projection/"'));
    const dataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
    const exported = dataset.concepts.find(({ slug }) => slug === 'l2-concept-migration');
    assert.deepEqual(exported.sources, []);
    assert.equal(exported.added, '2026-10-06T00:00:00.000Z');

    await writeFile(file, stringify({ ...concept, added: '2026-10-06T00:00:00.000Z' }));
    await assert.rejects(npm(directory, ['run', 'check']), /l2-concept-migration[\s\S]*added/);
    await assert.rejects(npm(directory, ['run', 'validate:concepts']), /l2-concept-migration.yaml: added/);
  });
});

test('contract-only changes revalidate Astro records with a warm cache', async () => {
  await inIsolatedProject(async (directory) => {
    await npm(directory, ['exec', '--', 'astro', 'sync']);
    const contract = join(directory, 'src/domain/content/concept-input.mjs');
    const source = await readFile(contract, 'utf8');
    const stricter = source.replace('term: codepointText(2)', 'term: codepointText(200)');
    assert.notEqual(stricter, source);
    await writeFile(contract, stricter);
    await assert.rejects(npm(directory, ['exec', '--', 'astro', 'sync']), /term[\s\S]*Text length/);
  });
});

test('inline and concept-defined Primitives use the shared contract in deployed projections', async () => {
  await inIsolatedProject(async (directory) => {
    const primitive = await yaml(directory, 'src/data/primitives/state.yaml');
    const originalConcept = await yaml(directory, 'src/data/concepts/verification.yaml');
    const definition = 'This canonical fixture definition belongs to the new concept and is rendered by the referencing primitive.';
    const concept = {
      ...originalConcept,
      term: 'L2 Defining Concept',
      examples: [{ context: 'An isolated reader compares definitions.', example: 'Read the shared definition on either detail page.' }],
      distinguish_from: [{ target: 'verification', distinction: 'This fixture demonstrates projection rather than verification practice.' }],
      definition,
      primitives: ['l2-defined-primitive'],
      added: '2026-10-06',
    };
    const inline = {
      ...primitive,
      term: 'L2 Inline Primitive',
      definitions: [{ name: 'Independent meaning', text: 'The inline definition is owned by this primitive.' }],
      related: [],
      added: '2026-10-06',
    };
    const referenced = {
      ...primitive,
      term: 'L2 Defined Primitive',
      definitions: [{ concept: 'l2-primitive-concept' }],
      related: ['l2-inline-primitive'],
      added: '2026-10-06',
    };
    const conceptFile = join(directory, 'src/data/concepts/l2-primitive-concept.yaml');
    const primitiveFile = join(directory, 'src/data/primitives/l2-defined-primitive.yaml');
    await writeFile(conceptFile, stringify(concept));
    await writeFile(join(directory, 'src/data/primitives/l2-inline-primitive.yaml'), stringify(inline));
    await writeFile(primitiveFile, stringify(referenced));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['run', 'build']);

    const catalog = await readFile(join(directory, 'dist/primitives/index.html'), 'utf8');
    const layer = catalog.match(/<section[^>]*id="layer-structure-representation"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(layer, 'the existing layer anchor must remain stable');
    for (const slug of ['l2-inline-primitive', 'l2-defined-primitive']) {
      assert.ok(layer.includes(`href="/ai-native-lexicon/primitives/${slug}/"`));
    }
    const inlinePage = await readFile(join(directory, 'dist/primitives/l2-inline-primitive/index.html'), 'utf8');
    assert.ok(inlinePage.includes(inline.definitions[0].text));
    const detailPath = join(directory, 'dist/primitives/l2-defined-primitive/index.html');
    const detail = await readFile(detailPath, 'utf8');
    assert.ok(detail.includes(definition));
    assert.ok(detail.includes('href="/ai-native-lexicon/concepts/l2-primitive-concept/"'));
    assert.ok(detail.includes('href="/ai-native-lexicon/primitives/l2-inline-primitive/"'));
    assert.ok(detail.includes('href="/ai-native-lexicon/primitives/#layer-structure-representation"'));
    const conceptPage = await readFile(join(directory, 'dist/concepts/l2-primitive-concept/index.html'), 'utf8');
    assert.ok(conceptPage.includes('href="/ai-native-lexicon/primitives/l2-defined-primitive/"'));
    assert.ok(conceptPage.includes(concept.examples[0].context));
    assert.ok(conceptPage.includes(concept.examples[0].example));
    assert.ok(conceptPage.includes(concept.distinguish_from[0].distinction));
    assert.ok(conceptPage.includes('href="/ai-native-lexicon/concepts/verification/"'));
    const dataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
    const exported = dataset.primitives.find(({ slug }) => slug === 'l2-defined-primitive');
    assert.equal(dataset.schema_version, '1.4.0');
    assert.deepEqual(dataset.concepts.find(({ slug }) => slug === 'l2-primitive-concept').examples, concept.examples);
    assert.deepEqual(dataset.concepts.find(({ slug }) => slug === 'l2-primitive-concept').distinguish_from, concept.distinguish_from);
    assert.deepEqual(dataset.concepts.find(({ slug }) => slug === 'context').examples, []);
    assert.equal(exported.added, '2026-10-06T00:00:00.000Z');
    assert.deepEqual(exported.definitions, [{ concept: 'l2-primitive-concept' }]);

    const changedDefinition = 'This changed canonical fixture definition is read from the concept again after the next site build.';
    await writeFile(conceptFile, stringify({ ...concept, definition: changedDefinition }));
    await npm(directory, ['run', 'build']);
    const rebuilt = await readFile(detailPath, 'utf8');
    assert.ok(rebuilt.includes(changedDefinition));
    assert.equal(rebuilt.includes(definition), false);
    assert.deepEqual((await yaml(directory, 'src/data/primitives/l2-defined-primitive.yaml')).definitions, [{ concept: 'l2-primitive-concept' }]);

    await writeFile(primitiveFile, stringify({ ...referenced, sources: [{ ...referenced.sources[0], url: 'ftp://example.com/notes' }] }));
    await assert.rejects(npm(directory, ['run', 'check']), /l2-defined-primitive[\s\S]*sources/);
    await assert.rejects(npm(directory, ['run', 'validate:concepts']), /l2-defined-primitive.yaml: sources/);
  });
});

test('Primitive contract-only changes revalidate Astro records with a warm cache', async () => {
  await inIsolatedProject(async (directory) => {
    await npm(directory, ['exec', '--', 'astro', 'sync']);
    const contract = join(directory, 'src/domain/content/primitive-input.mjs');
    const source = await readFile(contract, 'utf8');
    const stricter = source.replace('term: text,', 'term: text.min(300),');
    assert.notEqual(stricter, source);
    await writeFile(contract, stricter);
    await assert.rejects(npm(directory, ['exec', '--', 'astro', 'sync']), /term[\s\S]*Too small/);
  });
});

test('a standalone Speaking Guide preserves anchors, backlinks and strict notes', async () => {
  await inIsolatedProject(async (directory) => {
    const original = await yaml(directory, 'src/data/speaking-cards/card-01.yaml');
    const numbers = await Promise.all((await readdir(join(directory, 'src/data/speaking-cards')))
      .filter((file) => /\.ya?ml$/.test(file)).map(async (file) => (await yaml(directory, `src/data/speaking-cards/${file}`)).number));
    const number = Math.max(...numbers) + 7;
    const guide = { ...original, number, title: 'L2 Standalone Speaking Guide', concepts: ['context'], primitives: ['context'] };
    const file = join(directory, 'src/data/speaking-cards/l2-guide.yml');
    await writeFile(file, stringify(guide));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['run', 'build']);
    const cards = await readFile(join(directory, 'dist/speaking-card/index.html'), 'utf8');
    for (const id of [...numbers, number]) assert.ok(cards.includes(`id="card-${String(id).padStart(2, '0')}"`));
    assert.ok(cards.includes(guide.title));
    for (const type of ['concepts', 'primitives']) {
      const detail = await readFile(join(directory, 'dist', type, 'context/index.html'), 'utf8');
      assert.ok(detail.includes(`/ai-native-lexicon/speaking-card/#card-${String(number).padStart(2, '0')}`));
    }
    await writeFile(file, stringify({ ...guide, number: numbers[0] }));
    await assert.rejects(npm(directory, ['run', 'build']), /duplicate speaking card number/);
    await writeFile(file, stringify({ ...guide, keyLines: [' '] }));
    await assert.rejects(npm(directory, ['run', 'check']), /keyLines/);
  });
});

test('parallel project builds keep Speaking Guide cache records isolated', async () => {
  const title = 'L2 Cache Isolation Guide';
  await Promise.all([false, true].map((addGuide) => inIsolatedProject(async (directory) => {
    if (addGuide) {
      const original = await yaml(directory, 'src/data/speaking-cards/card-01.yaml');
      const numbers = await Promise.all((await readdir(join(directory, 'src/data/speaking-cards')))
        .filter((file) => /\.ya?ml$/.test(file)).map(async (file) => (await yaml(directory, `src/data/speaking-cards/${file}`)).number));
      await writeFile(join(directory, 'src/data/speaking-cards/l2-cache-guide.yml'), stringify({ ...original, number: Math.max(...numbers) + 1, title }));
    }
    await npm(directory, ['run', 'build']);
    const page = await readFile(join(directory, 'dist/speaking-card/index.html'), 'utf8');
    assert.equal(page.includes(title), addGuide);
  })));
});

test('repository check fails on schema drift without repairing the committed file', async () => {
  await inIsolatedProject(async (directory) => {
    const file = join(directory, 'schemas/primitive.schema.json');
    const original = await readFile(file, 'utf8');
    await writeFile(file, '{}\n');
    await assert.rejects(npm(directory, ['run', 'check']), /Schema drift:[\s\S]*primitive.schema.json/);
    assert.equal(await readFile(file, 'utf8'), '{}\n');
    await writeFile(file, original);
    await npm(directory, ['run', 'check']);
    assert.equal(await readFile(file, 'utf8'), original);
  });
});

test('adding category YAML publishes an empty route and then its first Concept without source edits', async () => {
  await inIsolatedProject(async (directory) => {
    const sourceFiles = ['astro.config.mjs', 'src/domain/content/concept-input.mjs', 'src/domain/taxonomy/categories.mjs', 'src/lib/catalog.ts', 'src/pages/index.astro', 'src/pages/categories/index.astro', 'src/pages/categories/[category].astro', 'src/components/CategoryGrid.astro'];
    const sourceBefore = await Promise.all(sourceFiles.map((file) => readFile(join(directory, file), 'utf8')));
    const category = { name: 'L2 Expansion Domain', slug: 'l2-expansion-domain', code: 'L2', description: 'A configured category can exist before its first concept.', question: 'How does a new domain begin?', order: Math.max(...categoryRegistry.map(({ order }) => order)) + 10 };
    await writeFile(join(directory, 'src/data/taxonomy/categories/l2-expansion-domain.yml'), stringify(category));
    await npm(directory, ['run', 'schema:generate']);
    const schema = JSON.parse(await readFile(join(directory, 'schemas/concept.schema.json'), 'utf8'));
    assert.ok(schema.properties.category.enum.includes(category.name));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['test']);
    await npm(directory, ['run', 'build']);
    const route = '/ai-native-lexicon/categories/l2-expansion-domain/';
    const detail = join(directory, 'dist/categories/l2-expansion-domain/index.html');
    assert.match(await readFile(detail, 'utf8'), /00 concepts/);
    for (const file of ['dist/index.html', 'dist/categories/index.html']) {
      const html = await readFile(join(directory, file), 'utf8');
      assert.ok(html.includes(`href="${route}"`));
      const count = String(categoryRegistry.length + 1).padStart(2, '0');
      if (file === 'dist/index.html') assert.match(html, new RegExp(`<strong>${count}</strong>\\s*<span>domains of practice</span>`));
      else assert.ok(html.includes(`${count} DOMAINS OF PRACTICE`));
      const links = [...html.matchAll(/href="\/ai-native-lexicon\/categories\/([^/"\s]+)\/"/g)].map((match) => match[1]);
      assert.deepEqual(links, [...categoryRegistry.map(({ slug }) => slug), category.slug]);
      assert.equal(/>0\d{2} \/ /.test(html), false, 'grid indexes must not be padded as 010');
    }
    for (const { slug } of categoryRegistry) await access(join(directory, 'dist/categories', slug, 'index.html'));
    const concept = { ...await yaml(directory, 'src/data/concepts/verification.yaml'), term: 'L2 Category Member', category: category.name };
    const member = join(directory, 'src/data/concepts/l2-category-member.yaml');
    await writeFile(member, stringify(concept));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['run', 'build']);
    const categoryHtml = await readFile(detail, 'utf8');
    assert.match(categoryHtml, /01 concepts/);
    assert.ok(categoryHtml.includes('href="/ai-native-lexicon/concepts/l2-category-member/"'));
    const conceptHtml = await readFile(join(directory, 'dist/concepts/l2-category-member/index.html'), 'utf8');
    assert.ok(conceptHtml.includes(`href="${route}"`));
    await writeFile(member, stringify({ ...concept, category: 'Unconfigured Domain' }));
    await assert.rejects(npm(directory, ['run', 'validate:catalog']), /l2-category-member.yaml: category/);
    assert.deepEqual(await Promise.all(sourceFiles.map((file) => readFile(join(directory, file), 'utf8'))), sourceBefore);
  });
});

test('adding layer YAML publishes an empty group and its first Primitive with explicit anchors', async () => {
  await inIsolatedProject(async (directory) => {
    const sources = ['src/domain/content/primitive-input.mjs', 'src/domain/taxonomy/layers.mjs', 'src/domain/taxonomy/read-taxonomy.mjs', 'src/lib/primitive-presentation.ts', 'src/pages/primitives.astro', 'src/pages/primitives/[slug].astro'];
    const before = await Promise.all(sources.map((file) => readFile(join(directory, file), 'utf8')));
    const layer = { name: 'L2 Expansion Layer', anchor: 'layer-fixture-explicit-target', order: Math.max(...layerRegistry.map(({ order }) => order)) + 10 };
    await writeFile(join(directory, 'src/data/taxonomy/layers/l2-expansion-layer.yml'), stringify(layer));
    await npm(directory, ['run', 'schema:generate']);
    const schema = JSON.parse(await readFile(join(directory, 'schemas/primitive.schema.json'), 'utf8'));
    assert.ok(schema.properties.layer.enum.includes(layer.name));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['test']);
    await npm(directory, ['run', 'build']);
    const catalog = join(directory, 'dist/primitives/index.html');
    const empty = await readFile(catalog, 'utf8');
    assert.ok(empty.includes(`href="#${layer.anchor}"`));
    assert.match(empty.match(new RegExp(`<section[^>]*id="${layer.anchor}"[\\s\\S]*?</section>`))?.[0] ?? '', /00 primitives/);
    for (const { anchor } of layerRegistry) assert.ok(empty.includes(`id="${anchor}"`));
    const primitive = { ...await yaml(directory, 'src/data/primitives/state.yaml'), term: 'L2 Layer Member', layer: layer.name, definitions: [{ name: 'Independent meaning', text: 'A new primitive belongs to the configured layer.' }], related: [] };
    const member = join(directory, 'src/data/primitives/l2-layer-member.yaml');
    await writeFile(member, stringify(primitive));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['run', 'build']);
    const grouped = (await readFile(catalog, 'utf8')).match(new RegExp(`<section[^>]*id="${layer.anchor}"[\\s\\S]*?</section>`))?.[0] ?? '';
    assert.match(grouped, /01 primitives/);
    assert.ok(grouped.includes('id="l2-layer-member"'));
    assert.ok(grouped.includes('href="/ai-native-lexicon/primitives/l2-layer-member/"'));
    const detail = await readFile(join(directory, 'dist/primitives/l2-layer-member/index.html'), 'utf8');
    assert.ok(detail.includes(`href="/ai-native-lexicon/primitives/#${layer.anchor}"`));
    assert.equal(detail.includes('#layer-l2-expansion-layer'), false);
    await writeFile(member, stringify({ ...primitive, layer: 'Unconfigured Layer' }));
    await assert.rejects(npm(directory, ['run', 'validate:catalog']), /l2-layer-member.yaml: layer/);
    assert.deepEqual(await Promise.all(sources.map((file) => readFile(join(directory, file), 'utf8'))), before);
  });
});

test('new Speaking Guide YAML reaches search, dataset and llms with stable content versions', async () => {
  await inIsolatedProject(async (directory) => {
    const original = await yaml(directory, 'src/data/speaking-cards/card-01.yaml');
    const numbers = await Promise.all((await readdir(join(directory, 'src/data/speaking-cards'))).filter((file) => /\.ya?ml$/.test(file)).map(async (file) => (await yaml(directory, `src/data/speaking-cards/${file}`)).number));
    const number = Math.max(...numbers) + 7;
    const guide = { ...original, number, title: 'L2 Projection Guide', coreIdea: 'Quasar signal demonstrates projection coverage.', concepts: ['context'], primitives: ['state'] };
    const file = join(directory, 'src/data/speaking-cards/l2-projection-guide.yml');
    await writeFile(file, stringify(guide));
    await npm(directory, ['run', 'check']);
    await npm(directory, ['run', 'build']);
    const datasetPath = join(directory, 'dist/dataset.json');
    const first = JSON.parse(await readFile(datasetPath, 'utf8'));
    const exported = first.speaking_cards?.find((card) => card.number === number);
    assert.deepEqual(exported, guide);
    assert.equal(first.version, '0.2.0');
    assert.equal(first.schema_version, '1.4.0');
    assert.deepEqual(first.counts, { concepts: first.concepts.length, primitives: first.primitives.length, speaking_cards: numbers.length + 1, skill_maps: first.skill_maps.length });
    const href = `/ai-native-lexicon/speaking-card/#card-${String(number).padStart(2, '0')}`;
    const search = await readFile(join(directory, 'dist/search/index.html'), 'utf8');
    assert.ok(search.includes(`href="${href}"`));
    assert.ok(search.includes(guide.title));
    assert.ok(search.includes(guide.coreIdea));
    const row = search.match(new RegExp(`<a[^>]*href="${href}"[^>]*>`))?.[0] ?? '';
    for (const text of ['l2 projection guide', 'quasar signal', 'context', 'state']) assert.ok(row.includes(text), text);
    for (const path of ['concepts/context.yaml', 'primitives/state.yaml']) {
      const name = (await yaml(directory, `src/data/${path}`)).zh;
      assert.ok(row.includes(name), `${path}: related display name must be indexed`);
    }
    const llms = await readFile(join(directory, 'dist/llms.txt'), 'utf8');
    assert.ok(llms.includes(`[${guide.title}](https://hilt21.github.io${href}): ${guide.coreIdea}`));
    assert.ok(llms.includes('## Concepts') && llms.includes('## Primitives'));
    await npm(directory, ['run', 'build']);
    const repeated = JSON.parse(await readFile(datasetPath, 'utf8'));
    assert.equal(repeated.dataset_version, first.dataset_version);
    assert.notEqual(repeated.generated_at, first.generated_at);
    await writeFile(file, stringify({ ...guide, coreIdea: 'Changed canonical speaking content.' }));
    await npm(directory, ['run', 'build']);
    const changed = JSON.parse(await readFile(datasetPath, 'utf8'));
    assert.notEqual(changed.dataset_version, repeated.dataset_version);
    const categoryFile = join(directory, 'src/data/taxonomy/categories/context.yaml');
    const category = parse(await readFile(categoryFile, 'utf8'));
    await writeFile(categoryFile, stringify({ ...category, description: `${category.description} A revised domain boundary.` }));
    await npm(directory, ['run', 'build']);
    assert.notEqual(JSON.parse(await readFile(datasetPath, 'utf8')).dataset_version, changed.dataset_version);
  });
});
