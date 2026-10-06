import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { conceptInputSchema } from '../src/domain/content/concept-input.mjs';
import { validateConceptDirectory } from '../src/domain/content/catalog.mjs';
import { primitiveInputSchema } from '../src/domain/content/primitive-input.mjs';
import { primitiveLayers, primitiveSchema } from '../src/lib/primitive-schema.mjs';
import { speakingCardInputSchema } from '../src/domain/content/speaking-card-input.mjs';
import { speakingCardSchema } from '../src/lib/speaking-card-schema.mjs';
import { parse, stringify } from 'yaml';
import { z } from 'zod';
import { readConceptInputs, readPrimitiveInputs, readSpeakingCardInputs } from '../src/domain/content/read-content.mjs';

const conceptDirectory = fileURLToPath(new URL('../src/data/concepts/', import.meta.url));

test('concept inputs preserve canonical fields and ISO date strings', async () => {
  const { records, errors } = await validateConceptDirectory(conceptDirectory);
  assert.deepEqual(errors, []);
  assert.ok(records.length > 0);
  for (const { file, data } of records) {
    assert.deepEqual(conceptInputSchema.parse(data), data, file);
    assert.equal(typeof conceptInputSchema.parse(data).added, 'string', file);
  }
  const portable = JSON.parse(await readFile(new URL('../schemas/concept.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(conceptInputSchema.shape.category.options, portable.properties.category.enum);
});

test('primitive inputs preserve legacy field semantics with string dates', async () => {
  assert.deepEqual(primitiveInputSchema.shape.layer.options, primitiveLayers);
  const { records, errors } = await readPrimitiveInputs();
  assert.deepEqual(errors, []);
  assert.ok(records.length > 0);
  for (const { file, data } of records) {
    const legacy = primitiveSchema.parse(data);
    assert.deepEqual(primitiveInputSchema.parse(data), {
      ...legacy, added: legacy.added.toISOString().slice(0, 10),
    }, file);
  }
});

test('speaking guide inputs preserve card numbers, references and text', async () => {
  const { records, errors } = await readSpeakingCardInputs();
  assert.deepEqual(errors, []);
  assert.ok(records.length > 0);
  for (const { file, data } of records) {
    assert.deepEqual(speakingCardInputSchema.parse(data), speakingCardSchema.parse(data), file);
  }
});

async function sample(path) {
  return parse(await readFile(new URL(`../src/data/${path}`, import.meta.url), 'utf8'));
}

test('input dates accept calendar dates and reject coercion or impossible dates', async () => {
  for (const [schema, path] of [[conceptInputSchema, 'concepts/context.yaml'], [primitiveInputSchema, 'primitives/context.yaml']]) {
    const data = await sample(path);
    assert.equal(schema.parse({ ...data, added: '2024-02-29' }).added, '2024-02-29');
    for (const added of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-1-1', 'not-a-date', '2026-01-01T00:00:00Z', new Date(), 0, null]) {
      assert.equal(schema.safeParse({ ...data, added }).success, false, String(added));
    }
  }
});

test('each input contract rejects unknown fields and malformed field values', async () => {
  const concept = await sample('concepts/context.yaml');
  const primitive = await sample('primitives/context.yaml');
  const card = await sample('speaking-cards/card-01.yaml');
  for (const [schema, data] of [[conceptInputSchema, concept], [primitiveInputSchema, primitive], [speakingCardInputSchema, card]]) {
    assert.equal(schema.safeParse({ ...data, unexpected: true }).success, false);
    assert.equal(schema.safeParse({ ...data, related: ['Invalid Slug'] }).success, false);
  }
  assert.equal(conceptInputSchema.safeParse({ ...concept, summary: 'too short' }).success, false);
  assert.equal(primitiveInputSchema.safeParse({ ...primitive, definitions: [{ concept: 'context', name: 'ambiguous', text: 'two forms' }] }).success, false);
  assert.equal(primitiveInputSchema.safeParse({ ...primitive, sources: [{ ...primitive.sources[0], url: 'ftp://example.com' }] }).success, false);
  assert.equal(speakingCardInputSchema.safeParse({ ...card, number: 0 }).success, false);
  assert.equal(speakingCardInputSchema.safeParse({ ...card, concepts: ['Invalid Slug'] }).success, false);
  assert.equal(speakingCardInputSchema.safeParse({ ...card, keyLines: [] }).success, false);
  assert.equal(speakingCardInputSchema.parse({ ...card, title: '  Talk  ' }).title, 'Talk');
});

test('input contracts export complete portable schemas into a temporary directory', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-input-schemas-'));
  try {
    for (const [name, schema] of [['concept', conceptInputSchema], ['primitive', primitiveInputSchema], ['speaking-card', speakingCardInputSchema]]) {
      // Default export throws for unrepresentable types; never opt into permissive output.
      const portable = z.toJSONSchema(schema);
      const file = join(directory, `${name}.schema.json`);
      await writeFile(file, JSON.stringify(portable));
      const exported = JSON.parse(await readFile(file, 'utf8'));
      assert.equal(exported.type, 'object');
      assert.equal(exported.additionalProperties, false);
      if (name !== 'speaking-card') {
        assert.equal(exported.properties.added.type, 'string');
        assert.equal(exported.properties.added.format, 'date');
      }
      if (name === 'primitive') {
        const pattern = new RegExp(exported.properties.sources.items.properties.url.pattern);
        assert.equal(pattern.test('https://example.com/notes'), true);
        assert.equal(pattern.test('ftp://example.com/notes'), false);
      }
      if (name === 'speaking-card') assert.equal(exported.properties.number.type, 'integer');
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('content readers discover canonical inputs with stable filenames and card numbers', async () => {
  for (const [reader, schema, type] of [
    [readConceptInputs, conceptInputSchema, 'concepts'],
    [readPrimitiveInputs, primitiveInputSchema, 'primitives'],
    [readSpeakingCardInputs, speakingCardInputSchema, 'speaking-cards'],
  ]) {
    const directory = fileURLToPath(new URL(`../src/data/${type}/`, import.meta.url));
    const files = (await readdir(directory)).filter((file) => /\.ya?ml$/.test(file)).sort();
    const records = await Promise.all(files.map(async (file) => ({ file, slug: file.replace(/\.ya?ml$/, ''), data: parse(await readFile(join(directory, file), 'utf8')) })));
    const actual = await reader(directory);
    assert.deepEqual(actual.errors, []);
    assert.deepEqual(actual.files, files);
    const expected = records.map(({ file, slug, data }) => ({ file, slug, data: schema.parse(data) }));
    if (type === 'speaking-cards') expected.sort((a, b) => a.data.number - b.data.number);
    assert.deepEqual(actual.records, expected);
  }
});

async function fixtureDirectory(t, entries) {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-content-inputs-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const [file, content] of Object.entries(entries)) {
    const path = join(directory, file);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
  return directory;
}

test('readers return file diagnostics for broken YAML, non-objects and invalid fields', async (t) => {
  const card = await sample('speaking-cards/card-01.yaml');
  const directory = await fixtureDirectory(t, {
    'valid.yml': stringify(card),
    'broken.yaml': 'title: [unfinished',
    'scalar.yaml': 'a scalar',
    'array.yaml': '- an array',
    'empty.yaml': '',
    'invalid.yaml': stringify({ ...card, number: 'one' }),
    'notes.txt': 'Not a content record',
  });
  const result = await readSpeakingCardInputs(directory);
  assert.deepEqual(result.records.map(({ file }) => file), ['valid.yml']);
  for (const file of ['broken.yaml', 'scalar.yaml', 'array.yaml', 'empty.yaml', 'invalid.yaml']) {
    assert.ok(result.errors.some((error) => error.startsWith(`${file}:`)), file);
  }
  assert.ok(result.errors.some((error) => error.startsWith('invalid.yaml:') && error.includes('number')));
  assert.equal(result.files.includes('notes.txt'), false);
});

test('readers reject duplicate filename slugs and invalid public identifiers', async (t) => {
  const concept = stringify(await sample('concepts/context.yaml'));
  const directory = await fixtureDirectory(t, {
    'context.yaml': concept,
    'context.yml': concept,
    'Bad_Name.yaml': concept,
  });
  const result = await readConceptInputs(directory);
  assert.ok(result.errors.some((error) => error.includes('context.yml') && error.includes('context.yaml') && error.includes('duplicate')));
  assert.ok(result.errors.some((error) => error.startsWith('Bad_Name.yaml:')));
  assert.deepEqual(result.records.map(({ slug }) => slug), ['context']);
});

test('speaking guide identity uses unique numbers without renumbering by filename', async (t) => {
  const card = await sample('speaking-cards/card-01.yaml');
  const directory = await fixtureDirectory(t, {
    'a-talk.yaml': stringify({ ...card, number: 20 }),
    'z-talk.yml': stringify({ ...card, number: 3 }),
    'zz-duplicate.yaml': stringify({ ...card, number: 3 }),
  });
  const result = await readSpeakingCardInputs(directory);
  assert.deepEqual(result.records.map(({ file, data }) => [file, data.number]), [['z-talk.yml', 3], ['a-talk.yaml', 20]]);
  assert.ok(result.errors.some((error) => error.includes('zz-duplicate.yaml') && error.includes('z-talk.yml') && error.includes('3')));
});

test('nested YAML is diagnosed instead of silently omitted or published', async (t) => {
  const card = stringify(await sample('speaking-cards/card-01.yaml'));
  const directory = await fixtureDirectory(t, {
    'direct.yaml': card,
    'nested/hidden.yml': card,
    'nested/deeper/another.yaml': 'invalid: [',
    'nested/notes.md': 'Not a content record',
  });
  const result = await readSpeakingCardInputs(directory);
  assert.deepEqual(result.files, ['direct.yaml']);
  assert.deepEqual(result.records.map(({ file }) => file), ['direct.yaml']);
  for (const file of ['nested/hidden.yml', 'nested/deeper/another.yaml']) {
    assert.ok(result.errors.some((error) => error.startsWith(`${file}:`) && error.includes('nested YAML')), file);
  }
  assert.equal(result.errors.length, 2);
});
