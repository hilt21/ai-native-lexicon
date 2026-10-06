import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { parse, stringify } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { speakingCardSchema } from '../src/lib/speaking-card-schema.mjs';
import { readSpeakingCards } from '../scripts/read-speaking-cards.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const card = parse(await readFile(new URL('../src/data/speaking-cards/card-01.yaml', import.meta.url), 'utf8'));

test('Speaking Guide runtime, CLI and portable field acceptance agree', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-guide-contract-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  const portable = ajv.compile(JSON.parse(await readFile(new URL('../schemas/speaking-card.schema.json', import.meta.url), 'utf8')));
  const cases = [
    ['canonical', card, true],
    ['duplicate concepts', { ...card, concepts: ['context', 'context'] }, false],
    ['duplicate primitives', { ...card, primitives: ['context', 'context'] }, false],
    ['empty relations', { ...card, concepts: [], primitives: [] }, true],
    ['trimmed title', { ...card, title: ' Talk ' }, true],
    ['number gap', { ...card, number: 101 }, true],
    ['zero', { ...card, number: 0 }, false],
    ['fraction', { ...card, number: 1.5 }, false],
    ['unsafe integer', { ...card, number: 1e16 }, false],
    ['string number', { ...card, number: '1' }, false],
    ['blank title', { ...card, title: ' \n\t ' }, false],
    ['blank idea', { ...card, coreIdea: ' ' }, false],
    ['missing notes', { ...card, keyLines: undefined }, false],
    ['empty key lines', { ...card, keyLines: [] }, false],
    ['blank key line', { ...card, keyLines: [' '] }, false],
    ['wrong key lines', { ...card, keyLines: 'notes' }, false],
    ['empty real case', { ...card, realCase: [] }, false],
    ['invalid paragraph', { ...card, realCase: [42] }, false],
    ['invalid slug', { ...card, concepts: ['Bad Slug'] }, false],
    ['unknown field', { ...card, notes: ['unmodeled'] }, false],
  ];
  for (const [label, data, expected] of cases) {
    assert.equal(speakingCardSchema.safeParse(data).success, expected, `${label}: runtime`);
    assert.equal(Boolean(portable(data)), expected, `${label}: portable ${JSON.stringify(portable.errors)}`);
    await writeFile(join(directory, 'guide.yaml'), stringify(data));
    if (expected) assert.equal((await readSpeakingCards(directory)).length, 1, label);
    else await assert.rejects(readSpeakingCards(directory), undefined, `${label}: CLI`);
  }
});

test('the shared guide reader preserves number identity and diagnoses invalid directories', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-guide-directory-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, 'a.yml'), stringify({ ...card, number: 101 }));
  await writeFile(join(directory, 'z.yaml'), stringify({ ...card, number: 3 }));
  assert.deepEqual((await readSpeakingCards(directory)).map(({ number }) => number), [3, 101]);
  await writeFile(join(directory, 'duplicate.yaml'), stringify({ ...card, number: 3 }));
  await assert.rejects(readSpeakingCards(directory), /duplicate speaking card number 3/);
  await rm(join(directory, 'duplicate.yaml'));
  await writeFile(join(directory, 'broken.yaml'), 'number: [unfinished');
  await assert.rejects(readSpeakingCards(directory), /broken.yaml: invalid YAML/);
});

test('the guide schema command writes the exact committed portable contract', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-guide-schema-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const file = join(directory, 'speaking-card.schema.json');
  await promisify(execFile)(process.execPath, [fileURLToPath(new URL('../scripts/content-schemas.mjs', import.meta.url)), 'generate-one', 'speaking-card', file]);
  assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), JSON.parse(await readFile(new URL('../schemas/speaking-card.schema.json', import.meta.url), 'utf8')));
});
