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
