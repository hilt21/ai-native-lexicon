import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parse, stringify } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { conceptInputSchema } from '../src/domain/content/concept-input.mjs';
import { conceptSchema } from '../src/lib/concept-schema.mjs';
import { validateConceptDirectory } from '../scripts/concept-validation.mjs';
import { validatePrimitiveDirectory } from '../scripts/primitive-validation.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

const context = parse(await readFile(new URL('../src/data/concepts/context.yaml', import.meta.url), 'utf8'));

test('concept references reject duplicates before relationship validation', () => {
  assert.equal(conceptInputSchema.safeParse({ ...context, related: ['context-window', 'context-window'] }).success, false);
  assert.equal(conceptInputSchema.safeParse({ ...context, primitives: ['context', 'context'] }).success, false);
});

test('Astro, CLI and portable schema agree on concept field acceptance', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-concept-contract-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/concepts/', import.meta.url), directory, { recursive: true });
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  const portable = ajv.compile(JSON.parse(await readFile(new URL('../schemas/concept.schema.json', import.meta.url), 'utf8')));
  const { sources, term, ...withoutRequiredTerm } = context;
  const { sources: omitted, ...withoutSources } = context;
  const cases = [
    ['current input', context, true],
    ['sources default', withoutSources, true],
    ['leap date', { ...context, added: '2024-02-29' }, true],
    ['empty primitive associations', { ...context, primitives: [] }, true],
    ['unknown field', { ...context, extra: true }, false],
    ['missing term', withoutRequiredTerm, false],
    ['missing primitives', { ...context, primitives: undefined }, false],
    ['duplicate related', { ...context, related: ['context-window', 'context-window'] }, false],
    ['duplicate primitives', { ...context, primitives: ['context', 'context'] }, false],
    ['invalid slug', { ...context, related: ['Bad Slug', 'context-window'] }, false],
    ['impossible date', { ...context, added: '2026-02-29' }, false],
    ['non-date', { ...context, added: 42 }, false],
    ['timestamp', { ...context, added: '2026-01-01T00:00:00Z' }, false],
    ['short summary', { ...context, summary: 'Too short' }, false],
    ['long summary', { ...context, summary: 'x'.repeat(241) }, false],
    ['unknown source field', { ...context, sources: [{ title: 'Example', url: 'https://example.com', extra: true }] }, false],
    ['valid source', { ...context, sources: [{ title: 'Example', url: 'https://example.com/notes' }] }, true],
    ['invalid source', { ...context, sources: [{ title: 'Example', url: 'not a URI' }] }, false],
    ['Unicode short term', { ...context, term: '😀' }, false],
    ['Unicode short summary', { ...context, summary: '😀'.repeat(20) }, false],
    ['Unicode valid summary', { ...context, summary: '😀'.repeat(200) }, true],
    ['source with a space', { ...context, sources: [{ title: 'Example', url: 'https://example.com/a b' }] }, false],
    ['source with invalid encoding', { ...context, sources: [{ title: 'Example', url: 'https://example.com/%ZZ' }] }, false],
    ['encoded source', { ...context, sources: [{ title: 'Example', url: 'https://example.com/a%20b' }] }, true],
  ];
  for (const [name, data, expected] of cases) {
    assert.equal(conceptSchema.safeParse(data).success, expected, `${name}: Astro`);
    assert.equal(Boolean(portable(data)), expected, `${name}: portable ${JSON.stringify(portable.errors)}`);
    await writeFile(join(directory, 'context.yaml'), stringify(data));
    const result = await validateConceptDirectory(directory);
    assert.equal(result.errors.length === 0, expected, `${name}: CLI ${result.errors.join('\n')}`);
  }
});

test('the Astro compatibility schema retains Date output and source defaults', () => {
  const { sources, ...withoutSources } = context;
  const data = conceptSchema.parse(withoutSources);
  assert.deepEqual(data.sources, []);
  assert.ok(data.added instanceof Date);
  assert.equal(data.added.toISOString(), '2026-09-09T00:00:00.000Z');
  assert.deepEqual({ ...data, added: context.added }, context);
  assert.equal(conceptSchema.safeParse({ ...context, unexpected: true }).success, false);
});

test('concept links, self-links and defining primitive backlinks stay globally checked', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-concept-links-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/concepts/', import.meta.url), directory, { recursive: true });
  await writeFile(join(directory, 'context.yaml'), stringify({ ...context, related: ['context', 'missing-concept'] }));
  const broken = await validateConceptDirectory(directory);
  assert.match(broken.errors.join('\n'), /context.yaml: concept cannot relate to itself/);
  assert.match(broken.errors.join('\n'), /context.yaml: related concept "missing-concept" does not exist/);
  for (const primitives of [['missing-primitive'], []]) {
    await writeFile(join(directory, 'context.yaml'), stringify({ ...context, primitives }));
    const concepts = await validateConceptDirectory(directory);
    assert.deepEqual(concepts.errors, []);
    const result = await validatePrimitiveDirectory(fileURLToPath(new URL('../src/data/primitives/', import.meta.url)), concepts.records);
    assert.match(result.errors.join('\n'), /defining concept "context" must link back to this primitive/);
    if (primitives.length) assert.match(result.errors.join('\n'), /primitives target "missing-primitive" does not exist/);
  }
});

test('the schema generation command writes the committed portable contract', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-generated-concept-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = join(directory, 'concept.schema.json');
  await run(process.execPath, [fileURLToPath(new URL('../scripts/generate-concept-schema.mjs', import.meta.url)), file]);
  const generated = JSON.parse(await readFile(file, 'utf8'));
  const committed = JSON.parse(await readFile(new URL('../schemas/concept.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(generated, committed);
  assert.equal(generated.required.includes('sources'), false);
  assert.deepEqual(generated.properties.sources.default, []);
  assert.equal(generated.properties.related.uniqueItems, true);
});
