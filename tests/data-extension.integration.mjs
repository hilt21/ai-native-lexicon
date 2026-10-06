import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, cp, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse, stringify } from 'yaml';

const run = promisify(execFile);
const repository = fileURLToPath(new URL('../', import.meta.url));

async function inIsolatedProject(verify) {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-extension-'));
  try {
    for (const path of ['src', 'scripts', 'schemas', 'tests', 'public', 'package.json', 'package-lock.json', 'astro.config.mjs', 'tsconfig.json']) {
      await cp(join(repository, path), join(directory, path), { recursive: true });
    }
    await symlink(join(repository, 'node_modules'), join(directory, 'node_modules'), 'junction');
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
    const dataset = JSON.parse(await readFile(join(directory, 'dist/dataset.json'), 'utf8'));
    const exported = dataset.primitives.find(({ slug }) => slug === 'l2-defined-primitive');
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
