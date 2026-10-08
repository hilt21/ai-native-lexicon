import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse, stringify } from 'yaml';
import { readCatalog, validateCatalog } from '../src/domain/content/catalog.mjs';

const run = promisify(execFile);

test('an independent Node process can read and validate the complete catalog without Astro', async () => {
  const module = new URL('../src/domain/content/catalog.mjs', import.meta.url).href;
  const { stdout } = await run(process.execPath, ['--input-type=module', '-e',
    `import {readCatalog,validateCatalog} from ${JSON.stringify(module)};
     const catalog=await readCatalog();
     const result=validateCatalog(catalog);
     console.log(JSON.stringify({errors:result.errors,counts:[catalog.concepts.length,catalog.primitives.length,catalog.speakingCards.length],date:typeof catalog.concepts[0].data.added}));`]);
  const result = JSON.parse(stdout);
  assert.deepEqual(result.errors, []);
  assert.ok(result.counts.every((count) => count > 0));
  assert.equal(result.date, 'string');
});

test('the public catalog boundary rejects cross-record failures and malformed input', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-catalog-contract-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/', import.meta.url), directory, { recursive: true });
  assert.deepEqual(validateCatalog(await readCatalog(directory)).errors, []);
  const cases = [
    ['concepts/context.yaml', (data) => ({ ...data, related: [data.related[0], 'missing-concept'] }), /related concept "missing-concept"/],
    ['concepts/context.yaml', (data) => ({ ...data, related: [data.related[0], 'context'] }), /cannot relate to itself/],
    ['concepts/context.yaml', (data) => ({ ...data, distinguish_from: [{ target: 'missing-concept', distinction: 'A meaningful difference.' }] }), /distinguish_from target "missing-concept" does not exist/],
    ['concepts/context.yaml', (data) => ({ ...data, distinguish_from: [{ target: 'context', distinction: 'A meaningful difference.' }] }), /distinguish_from cannot reference itself/],
    ['concepts/context.yaml', (data) => ({ ...data, distinguish_from: [{ target: 'context-window', distinction: 'First distinction.' }, { target: 'context-window', distinction: 'Another distinction.' }] }), /duplicate distinguish_from target/],
    ['concepts/context.yaml', (data) => ({ ...data, primitives: [] }), /defining concept "context" must link back/],
    ['primitives/context.yaml', (data) => ({ ...data, related: ['missing-primitive'] }), /related target "missing-primitive"/],
    ['primitives/context.yaml', (data) => ({ ...data, definitions: [{ concept: 'missing-concept' }] }), /definitions target "missing-concept"/],
    ['speaking-cards/card-01.yaml', (data) => ({ ...data, concepts: ['missing-concept'] }), /concept slug "missing-concept"/],
    ['speaking-cards/card-01.yaml', (data) => ({ ...data, primitives: ['missing-primitive'] }), /primitive slug "missing-primitive"/],
    ['speaking-cards/card-01.yaml', (data) => ({ ...data, primitives: ['context', 'context'] }), /Duplicate references/],
    ['concepts/context.yaml', (data) => ({ ...data, unexpected: true }), /Unrecognized key/],
    ['concepts/context.yaml', (data) => ({ ...data, tags: [] }), /Unrecognized key.*tags/],
  ];
  for (const [path, change, expected] of cases) {
    const file = join(directory, path);
    const source = await readFile(file, 'utf8');
    await writeFile(file, stringify(change(parse(source))));
    assert.match(validateCatalog(await readCatalog(directory)).errors.join('\n'), expected, path);
    await writeFile(file, source);
  }
  const primitive = parse(await readFile(join(directory, 'primitives/state.yaml'), 'utf8'));
  for (const slug of ['layer-purpose-governance', 'layer-purpose-governance-title']) {
    const collision = join(directory, 'primitives', `${slug}.yaml`);
    await writeFile(collision, stringify({ ...primitive, term: 'Layer Anchor Collision Fixture', definitions: [{ name: 'Standalone', text: 'A valid input with a reserved layer navigation ID as its filename.' }], related: [] }));
    assert.match(validateCatalog(await readCatalog(directory)).errors.join('\n'), /primitive filename slug collides with layer anchor or heading ID/);
    await rm(collision);
  }
  await writeFile(join(directory, 'speaking-cards/card-01.yaml'), 'number: [unfinished');
  assert.match(validateCatalog(await readCatalog(directory)).errors.join('\n'), /speaking-cards\/card-01.yaml: invalid YAML/);
});

test('portable schemas generate deterministically and drift-check only reads files', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-schema-drift-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const script = fileURLToPath(new URL('../scripts/content-schemas.mjs', import.meta.url));
  const files = ['concept.schema.json', 'primitive.schema.json', 'speaking-card.schema.json'];
  await run(process.execPath, [script, 'generate', directory]);
  const first = await Promise.all(files.map((file) => readFile(join(directory, file), 'utf8')));
  await run(process.execPath, [script, 'generate', directory]);
  assert.deepEqual(await Promise.all(files.map((file) => readFile(join(directory, file), 'utf8'))), first);
  for (const [i, file] of files.entries()) assert.equal(first[i], await readFile(new URL(`../schemas/${file}`, import.meta.url), 'utf8'), file);
  await run(process.execPath, [script, 'check', directory]);
  for (const [i, file] of files.entries()) {
    await writeFile(join(directory, file), '{}\n');
    await assert.rejects(run(process.execPath, [script, 'check', directory]), (error) => error.code === 1 && error.stderr.includes(file));
    assert.equal(await readFile(join(directory, file), 'utf8'), '{}\n');
    await writeFile(join(directory, file), first[i]);
  }
  await run(process.execPath, [script, 'check', directory]);
  assert.deepEqual(await Promise.all(files.map((file) => readFile(join(directory, file), 'utf8'))), first);
});


test('independent Concept YAML accepts aliases, preserves defaults and rejects ambiguous aliases', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-aliases-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/', import.meta.url), directory, { recursive: true });
  const file = join(directory, 'concepts/context.yaml');
  const original = parse(await readFile(file, 'utf8'));
  await writeFile(file, stringify({ ...original, aliases: ['Prompt Context', 'Working Context'] }));
  const accepted = await readCatalog(directory);
  assert.deepEqual(validateCatalog(accepted).errors, []);
  assert.deepEqual(accepted.concepts.find(({ slug }) => slug === 'context').data.aliases, ['Prompt Context', 'Working Context']);
  for (const aliases of [[''], ['  '], ['Working Context', 'Working Context'], ['Working Context', ' working context '], [original.term], [original.term.toUpperCase()], [original.zh]]) {
    await writeFile(file, stringify({ ...original, aliases }));
    assert.match(validateCatalog(await readCatalog(directory)).errors.join('\n'), /aliases/, JSON.stringify(aliases));
  }
  await writeFile(file, stringify(original));
  const legacy = await readCatalog(directory);
  assert.deepEqual(validateCatalog(legacy).errors, []);
  assert.deepEqual(legacy.concepts.find(({ slug }) => slug === 'context').data.aliases, []);
});

test('independent Concept YAML projects optional reading examples and distinctions with legacy defaults', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-reading-fields-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/', import.meta.url), directory, { recursive: true });
  const file = join(directory, 'concepts/context.yaml');
  const original = parse(await readFile(file, 'utf8'));
  const examples = [{ context: 'A reader compares terms.', example: 'Use the current information to explain the next step.' }];
  const distinguish_from = [{ target: 'context-window', distinction: 'Information differs from the capacity available to hold it.' }];
  await writeFile(file, stringify({ ...original, examples, distinguish_from }));
  const catalog = await readCatalog(directory);
  assert.deepEqual(validateCatalog(catalog).errors, []);
  const data = catalog.concepts.find(({ slug }) => slug === 'context').data;
  assert.deepEqual(data.examples, examples);
  assert.deepEqual(data.distinguish_from, distinguish_from);
  await writeFile(file, stringify(original));
  const legacy = (await readCatalog(directory)).concepts.find(({ slug }) => slug === 'context').data;
  assert.deepEqual(legacy.examples, []);
  assert.deepEqual(legacy.distinguish_from, []);
});
