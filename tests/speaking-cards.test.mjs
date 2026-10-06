import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import test from 'node:test';

import { readSpeakingCards } from '../scripts/read-speaking-cards.mjs';

const cards = await readSpeakingCards();

test('every speaking card declares concept and primitive references', () => {
  for (const card of cards) {
    const label = `Card ${String(card.number).padStart(2, '0')} ${card.title}`;
    assert.ok(Array.isArray(card.concepts), `${label}: concepts must be an array`);
    assert.ok(Array.isArray(card.primitives), `${label}: primitives must be an array`);
  }
});

test('current references resolve to existing concept and primitive slugs', async () => {
  const { validateSpeakingCardReferences } = await import('../src/domain/content/validate-references.mjs');
  const slugsIn = async (directory) => (await readdir(new URL(directory, import.meta.url)))
    .filter((file) => /\.ya?ml$/.test(file))
    .map((file) => file.replace(/\.ya?ml$/, ''));
  const [conceptSlugs, primitiveSlugs] = await Promise.all([
    slugsIn('../src/data/concepts/'),
    slugsIn('../src/data/primitives/'),
  ]);

  assert.deepEqual(validateSpeakingCardReferences(cards, conceptSlugs, primitiveSlugs), []);
});

test('invalid and duplicate speaking-card references report their card and target', async () => {
  const { validateSpeakingCardReferences } = await import('../src/domain/content/validate-references.mjs');
  const errors = validateSpeakingCardReferences([
    { number: 4, title: 'Agent Harness', concepts: ['harness', 'missing', 'harness'], primitives: ['missing'] },
  ], ['harness'], ['harness']);

  assert.deepEqual(errors, [
    'Card 04 Agent Harness: concept slug "missing" does not exist',
    'Card 04 Agent Harness: duplicate concept reference "harness"',
    'Card 04 Agent Harness: primitive slug "missing" does not exist',
  ]);
});

test('empty speaking-card relations are valid', async () => {
  const { validateSpeakingCardReferences } = await import('../src/domain/content/validate-references.mjs');
  assert.deepEqual(validateSpeakingCardReferences([
    { number: 13, title: 'Finding Good AI Use Cases', concepts: [], primitives: [] },
  ], [], []), []);
});

test('YAML cards are discovered, sorted by number, and reject duplicate identifiers', async () => {
  const { mkdtemp, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { pathToFileURL } = await import('node:url');
  const { stringify } = await import('yaml');
  const directory = await mkdtemp(join(tmpdir(), 'speaking-cards-'));
  const url = pathToFileURL(`${directory}/`);
  try {
    await writeFile(new URL('a.yaml', url), stringify({ ...cards[0], number: 22 }));
    await writeFile(new URL('z.yml', url), stringify({ ...cards[0], number: 3 }));
    assert.deepEqual((await readSpeakingCards(url)).map((card) => card.number), [3, 22]);
    await writeFile(new URL('duplicate.yaml', url), stringify({ ...cards[0], number: 3 }));
    await assert.rejects(readSpeakingCards(url), /duplicate speaking card number 3/);
    await rm(new URL('duplicate.yaml', url));
    await rm(new URL('z.yml', url));
    assert.deepEqual((await readSpeakingCards(url)).map((card) => card.number), [22]);
    await writeFile(new URL('a.yaml', url), 'number: [broken');
    await assert.rejects(readSpeakingCards(url), /a.yaml/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('speaking card schema rejects invalid fields and incomplete notes', async () => {
  const { speakingCardSchema } = await import('../src/lib/speaking-card-schema.mjs');
  for (const update of [{ number: 0 }, { number: 1.5 }, { title: ' ' }, { keyLines: [] }, { realCase: [] }, { concepts: ['invalid slug'] }, { unknown: true }]) {
    assert.equal(speakingCardSchema.safeParse({ ...cards[0], ...update }).success, false);
  }
});
