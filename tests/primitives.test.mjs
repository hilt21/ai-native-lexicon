import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { validateConceptDirectory } from '../src/domain/content/catalog.mjs';
import { primitiveSchema } from '../src/lib/primitive-schema.mjs';

const conceptDirectory = fileURLToPath(new URL('../src/data/concepts/', import.meta.url));

async function yamlFileCount(directory) {
  return (await readdir(directory)).filter((file) => /\.ya?ml$/.test(file)).length;
}

test('concepts use explicit primitive references instead of legacy tags', async () => {
  const { records, errors } = await validateConceptDirectory(conceptDirectory);
  assert.deepEqual(errors, []);
  assert.ok(records.length > 0, 'concept catalog must not be empty');
  assert.equal(records.length, await yamlFileCount(conceptDirectory));
  for (const { slug, data } of records) {
    assert.ok(Array.isArray(data.primitives), `${slug}: missing primitives`);
    assert.equal('tags' in data, false, `${slug}: legacy tags`);
  }
});

const { validatePrimitiveDirectory } = await import('../src/domain/content/catalog.mjs');
const { validatePrimitiveReferences } = await import('../src/domain/content/validate-references.mjs');
const primitiveDirectory = fileURLToPath(new URL('../src/data/primitives/', import.meta.url));

test('primitive entries and all cross-collection references resolve', async () => {
  const { records } = await validateConceptDirectory(conceptDirectory);
  const result = await validatePrimitiveDirectory(primitiveDirectory, records);
  assert.ok(result.records.length > 0, 'primitive catalog must not be empty');
  assert.equal(result.records.length, await yamlFileCount(primitiveDirectory));
  assert.deepEqual(result.errors, []);
  for (const { slug, data } of result.records) {
    const parsed = primitiveSchema.safeParse(data);
    assert.ok(parsed.success, `${slug}: ${parsed.success ? '' : JSON.stringify(parsed.error.issues)}`);
  }
});

test('broken links, duplicate references and missing backlinks are rejected', () => {
  const concepts = [{ slug: 'a', data: { primitives: ['missing', 'missing'] } }];
  const primitives = [{ slug: 'p', data: { term: 'P', related: ['p', 'missing'], definitions: [{ concept: 'a' }, { concept: 'absent' }] } }];
  const errors = validatePrimitiveReferences(concepts, primitives).join('\n');
  for (const message of ['duplicate primitives', 'primitives target "missing"', 'related cannot reference itself', 'related target "missing"', 'definitions target "absent"', 'must link back']) {
    assert.ok(errors.includes(message), message);
  }
});

test('empty primitive associations are valid and duplicate names are rejected', () => {
  const concepts = [{ slug: 'a', data: { primitives: [] } }];
  const primitives = [{ slug: 'p', data: { term: 'P', related: [], definitions: [{ name: 'P', text: 'Definition' }] } }];
  assert.deepEqual(validatePrimitiveReferences(concepts, primitives), []);
  const duplicate = { ...primitives[0], slug: 'q' };
  assert.match(validatePrimitiveReferences(concepts, [...primitives, duplicate]).join('\n'), /duplicate primitive term/);
});

test('invalid YAML is reported with its filename', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-primitives-'));
  try {
    await writeFile(join(directory, 'broken.yaml'), 'term: [unterminated');
    const result = await validatePrimitiveDirectory(directory, []);
    assert.match(result.errors.join('\n'), /broken.yaml: invalid YAML/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('primitive schema rejects malformed entries and records the agreed vocabularies', async () => {
  const { records } = await validatePrimitiveDirectory(primitiveDirectory, []);
  const state = records.find(({ slug }) => slug === 'state').data;
  assert.equal(primitiveSchema.safeParse(state).success, true);
  assert.equal(primitiveSchema.safeParse({ ...state, priority: { ...state.priority, level: 'P9' } }).success, false);
  assert.equal(primitiveSchema.safeParse({ ...state, unreviewedField: true }).success, false);
  assert.equal(primitiveSchema.safeParse({ ...state, sources: [{ title: '', section: '', basis: 'report-synthesis', verification: 'unverified' }] }).success, false);
});

test('portable primitive schema retains the approved fields and definition references', async () => {
  const schema = JSON.parse(await readFile(new URL('../schemas/primitive.schema.json', import.meta.url), 'utf8'));
  for (const key of ['definitions', 'scope', 'usage', 'composition', 'considerations', 'distinctions', 'ownership', 'priority', 'sources']) {
    assert.ok(schema.required.includes(key), key);
  }
  assert.deepEqual(schema.properties.priority.properties.level.enum, ['P0', 'P1', 'P2']);
  assert.deepEqual(schema.properties.ownership.properties.kind.enum, ['llm', 'executor', 'hybrid']);
});

test('portable primitive schema rejects whitespace-only text like the runtime schema', async () => {
  const schema = JSON.parse(await readFile(new URL('../schemas/primitive.schema.json', import.meta.url), 'utf8'));
  const stringSchemas = [];
  function collectStringSchemas(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'string' && node.minLength !== undefined) stringSchemas.push(node);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(collectStringSchemas);
      else if (value && typeof value === 'object') collectStringSchemas(value);
    }
  }
  collectStringSchemas(schema);
  assert.ok(stringSchemas.length > 0);
  for (const stringSchema of stringSchemas) {
    assert.ok(stringSchema.pattern, 'every non-empty text field has a non-whitespace constraint');
    assert.equal(new RegExp(stringSchema.pattern).test('   '), false);
    assert.equal(new RegExp(stringSchema.pattern).test(' x '), true);
  }
  const { records } = await validatePrimitiveDirectory(primitiveDirectory, []);
  const state = records.find(({ slug }) => slug === 'state').data;
  assert.equal(primitiveSchema.safeParse({ ...state, term: '   ' }).success, false);
});

test('malformed concept records produce diagnostics instead of throwing', () => {
  const primitives = [{ slug: 'p', data: { term: 'P', related: [], definitions: [{ concept: 'a' }] } }];
  for (const data of ['invalid', 42, true, [], null, { primitives: 42 }]) {
    const errors = validatePrimitiveReferences([{ slug: 'a', data }], primitives);
    assert.ok(errors.length > 0);
  }
});
