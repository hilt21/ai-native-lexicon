import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { parse, stringify } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { primitiveSchema } from '../src/lib/primitive-schema.mjs';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { validateConceptDirectory } from '../src/domain/content/catalog.mjs';
import { validatePrimitiveDirectory } from '../src/domain/content/catalog.mjs';

const state = parse(await readFile(new URL('../src/data/primitives/state.yaml', import.meta.url), 'utf8'));
const { records: concepts } = await validateConceptDirectory(new URL('../src/data/concepts/', import.meta.url));
const run = promisify(execFile);

test('the Primitive CLI rejects field errors before relationship validation', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-primitive-contract-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/primitives/', import.meta.url), directory, { recursive: true });
  await writeFile(join(directory, 'state.yaml'), stringify({ ...state, term: '   ' }));
  const result = await validatePrimitiveDirectory(directory, concepts);
  assert.match(result.errors.join('\n'), /state.yaml: term/);
});

test('the Primitive Astro adapter retains Dates, trimmed text and canonical definition references', () => {
  const data = primitiveSchema.parse({ ...state, term: ' State ' });
  assert.ok(data.added instanceof Date);
  assert.equal(data.added.toISOString(), '2026-09-23T00:00:00.000Z');
  assert.deepEqual({ ...data, added: state.added }, state);
  assert.deepEqual(data.definitions, [{ concept: 'state' }]);
});

test('Primitive relationship validation rejects missing targets, self-links and missing Concept backlinks', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-primitive-links-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/primitives/', import.meta.url), directory, { recursive: true });
  for (const [data, expected] of [
    [{ ...state, related: ['state'] }, /related cannot reference itself/],
    [{ ...state, related: ['missing-primitive'] }, /related target "missing-primitive" does not exist/],
    [{ ...state, definitions: [{ concept: 'missing-concept' }] }, /definitions target "missing-concept" does not exist/],
    [{ ...state, definitions: [{ concept: 'state' }, { concept: 'state' }] }, /duplicate definitions reference/],
  ]) {
    await writeFile(join(directory, 'state.yaml'), stringify(data));
    const result = await validatePrimitiveDirectory(directory, concepts);
    assert.match(result.errors.join('\n'), expected);
  }
  await writeFile(join(directory, 'state.yaml'), stringify(state));
  const withoutBacklink = concepts.map((concept) => concept.slug === 'state'
    ? { ...concept, data: { ...concept.data, primitives: concept.data.primitives.filter((slug) => slug !== 'state') } }
    : concept);
  const result = await validatePrimitiveDirectory(directory, withoutBacklink);
  assert.match(result.errors.join('\n'), /defining concept "state" must link back to this primitive/);
});

test('the generation command writes the committed Primitive portable schema', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-generated-primitive-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = join(directory, 'primitive.schema.json');
  await run(process.execPath, [fileURLToPath(new URL('../scripts/content-schemas.mjs', import.meta.url)), 'generate-one', 'primitive', file]);
  const generated = JSON.parse(await readFile(file, 'utf8'));
  const committed = JSON.parse(await readFile(new URL('../schemas/primitive.schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(generated, committed);
  assert.equal(generated.properties.related.uniqueItems, true);
  assert.equal(generated.properties.added.format, 'date');
  assert.equal(generated.properties.sources.items.properties.url.format, 'uri');
});

test('Astro, CLI and portable schema agree on Primitive field acceptance', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-primitive-acceptance-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await cp(new URL('../src/data/primitives/', import.meta.url), directory, { recursive: true });
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  const portable = ajv.compile(JSON.parse(await readFile(new URL('../schemas/primitive.schema.json', import.meta.url), 'utf8')));
  const source = { ...state.sources[0], url: 'https://example.com/a%20b?x=2#notes' };
  const { term, ...withoutTerm } = state;
  const cases = [
    ['canonical input', state, true],
    ['timestamp', { ...state, added: '2026-09-23T00:00:00Z' }, false],
    ['leap date', { ...state, added: '2024-02-29' }, true],
    ['impossible date', { ...state, added: '2026-02-29' }, false],
    ['numeric date', { ...state, added: 42 }, false],
    ['Date object', { ...state, added: new Date('2026-09-23T00:00:00Z') }, false],
    ['trimmed text', { ...state, term: ' State ' }, true],
    ['inline definition', { ...state, definitions: [{ name: 'State', text: 'Current authoritative facts.' }] }, true],
    ['mixed definitions', { ...state, definitions: [...state.definitions, { name: 'Editorial view', text: 'Current authoritative facts.' }] }, true],
    ['empty related', { ...state, related: [] }, true],
    ['encoded HTTP source', { ...state, sources: [source] }, true],
    ['localhost HTTP source', { ...state, sources: [{ ...source, url: 'http://localhost:8080/notes' }] }, true],
    ['IPv6 HTTP source', { ...state, sources: [{ ...source, url: 'http://[::1]/notes' }] }, true],
    ['IPv4 HTTP source', { ...state, sources: [{ ...source, url: 'http://127.0.0.1:65535/notes' }] }, true],
    ['private IPv4 HTTP source', { ...state, sources: [{ ...source, url: 'http://192.168.1.10/notes' }] }, true],
    ['uppercase hostname', { ...state, sources: [{ ...source, url: 'https://EXAMPLE.COM/notes' }] }, true],
    ['empty port', { ...state, sources: [{ ...source, url: 'https://example.com:/notes' }] }, true],
    ['zero port', { ...state, sources: [{ ...source, url: 'http://example.com:0/notes' }] }, true],
    ['zero-padded port', { ...state, sources: [{ ...source, url: 'http://example.com:00000080/notes' }] }, true],
    ['unknown field', { ...state, extra: true }, false],
    ['missing field', withoutTerm, false],
    ['empty term', { ...state, term: '' }, false],
    ['blank term', { ...state, term: ' \t\n ' }, false],
    ['blank summary', { ...state, summary: '   ' }, false],
    ['invalid layer', { ...state, layer: 'Future Layer' }, false],
    ['empty definitions', { ...state, definitions: [] }, false],
    ['blank inline name', { ...state, definitions: [{ name: ' ', text: 'Facts' }] }, false],
    ['blank inline text', { ...state, definitions: [{ name: 'State', text: ' ' }] }, false],
    ['mixed definition shape', { ...state, definitions: [{ concept: 'state', name: 'State', text: 'Facts' }] }, false],
    ['unknown inline field', { ...state, definitions: [{ name: 'State', text: 'Facts', extra: true }] }, false],
    ['empty considerations', { ...state, considerations: [] }, false],
    ['blank consideration', { ...state, considerations: [' '] }, false],
    ['invalid ownership', { ...state, ownership: { ...state.ownership, kind: 'person' } }, false],
    ['blank ownership rationale', { ...state, ownership: { ...state.ownership, rationale: ' ' } }, false],
    ['invalid priority', { ...state, priority: { ...state.priority, level: 'P9' } }, false],
    ['blank priority scope', { ...state, priority: { ...state.priority, scope: ' ' } }, false],
    ['unknown composition field', { ...state, composition: { ...state.composition, extra: true } }, false],
    ['duplicate related', { ...state, related: ['event', 'event'] }, false],
    ['invalid related slug', { ...state, related: ['Bad Slug'] }, false],
    ['empty sources', { ...state, sources: [] }, false],
    ['blank source title', { ...state, sources: [{ ...source, title: ' ' }] }, false],
    ['invalid source basis', { ...state, sources: [{ ...source, basis: 'unreviewed' }] }, false],
    ['invalid source verification', { ...state, sources: [{ ...source, verification: 'maybe' }] }, false],
    ['unknown source field', { ...state, sources: [{ ...source, extra: true }] }, false],
    ['FTP source', { ...state, sources: [{ ...source, url: 'ftp://example.com/notes' }] }, false],
    ['source with a space', { ...state, sources: [{ ...source, url: 'https://example.com/a b' }] }, false],
    ['source with invalid encoding', { ...state, sources: [{ ...source, url: 'https://example.com/%ZZ' }] }, false],
    ['source without a host', { ...state, sources: [{ ...source, url: 'http://' }] }, false],
    ['source without a host after user info', { ...state, sources: [{ ...source, url: 'https://user@' }] }, false],
    ['source without authority separators', { ...state, sources: [{ ...source, url: 'https:example.com' }] }, false],
    ['out-of-range port', { ...state, sources: [{ ...source, url: 'http://example.com:65536/' }] }, false],
    ['oversized port', { ...state, sources: [{ ...source, url: 'https://example.com:99999999999/' }] }, false],
    ['invalid IPv4', { ...state, sources: [{ ...source, url: 'http://999.999.999.999/' }] }, false],
    ['invalid numeric hostname', { ...state, sources: [{ ...source, url: 'http://example.999/' }] }, false],
  ];
  for (const [name, data, expected] of cases) {
    assert.equal(primitiveSchema.safeParse(data).success, expected, `${name}: Astro`);
    assert.equal(Boolean(portable(data)), expected, `${name}: portable ${JSON.stringify(portable.errors)}`);
    await writeFile(join(directory, 'state.yaml'), stringify(data));
    const result = await validatePrimitiveDirectory(directory, concepts);
    assert.equal(result.errors.length === 0, expected, `${name}: CLI ${result.errors.join('\n')}`);
  }
});
