import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cards = JSON.parse(await readFile(fileURLToPath(new URL('../src/data/speaking-cards.json', import.meta.url)), 'utf8'));

test('every speaking card declares concept and primitive references', () => {
  for (const card of cards) {
    const label = `Card ${String(card.number).padStart(2, '0')} ${card.title}`;
    assert.ok(Array.isArray(card.concepts), `${label}: concepts must be an array`);
    assert.ok(Array.isArray(card.primitives), `${label}: primitives must be an array`);
  }
});

test('current references resolve to existing concept and primitive slugs', async () => {
  const { validateSpeakingCardReferences } = await import('../scripts/speaking-card-validation.mjs');
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
  const { validateSpeakingCardReferences } = await import('../scripts/speaking-card-validation.mjs');
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
  const { validateSpeakingCardReferences } = await import('../scripts/speaking-card-validation.mjs');
  assert.deepEqual(validateSpeakingCardReferences([
    { number: 13, title: 'Finding Good AI Use Cases', concepts: [], primitives: [] },
  ], [], []), []);
});
