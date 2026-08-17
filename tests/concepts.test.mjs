import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, validateConceptDirectory } from '../scripts/concept-validation.mjs';

const directory = fileURLToPath(new URL('../src/data/concepts/', import.meta.url));

test('the MVP contains 30 valid concepts across all target categories', async () => {
  const result = await validateConceptDirectory(directory);
  assert.deepEqual(result.errors, []);
  assert.equal(result.records.length, 30);
  assert.deepEqual(Object.keys(result.categoryCounts), CATEGORIES);
  assert.ok(Object.values(result.categoryCounts).every((count) => count > 0));
});

test('every relationship resolves to another concept', async () => {
  const result = await validateConceptDirectory(directory);
  const slugs = new Set(result.records.map(({ slug }) => slug));
  for (const { slug, data } of result.records) {
    assert.ok(data.related.length >= 2, `${slug} needs at least two relationships`);
    assert.ok(data.related.every((related) => slugs.has(related)), `${slug} has a broken relationship`);
  }
});
