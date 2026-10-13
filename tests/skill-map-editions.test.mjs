import assert from 'node:assert/strict';
import test from 'node:test';
import { readSkillMaps } from '../src/domain/content/read-skill-maps.mjs';
import { verifySkillMapEdition } from '../scripts/verify-skill-map-edition.mjs';

const original = await readSkillMaps();
const candidate = await readSkillMaps(new URL('../docs/proposals/i18n-completion-2026-10-13/skill-maps/', import.meta.url));
test('complete English edition retains stable identity, topology and source snapshots', () => {
  const result = verifySkillMapEdition(original, candidate);
  assert.equal(result.nodes, original.records.reduce((n, m) => n + m.data.nodes.length, 0));
  assert.equal(result.semanticReview, 'required-for-new-prose');
});
test('edition verification rejects a silently removed relation', () => {
  const changed = structuredClone(candidate);
  changed.records[0].data.relations.pop();
  assert.throws(() => verifySkillMapEdition(original, changed), /structure/);
});
test('edition verification rejects repointing an existing source snapshot', () => {
  const changed = structuredClone(candidate);
  changed.records[0].data.sources[0].commit = 'a'.repeat(40);
  assert.throws(() => verifySkillMapEdition(original, changed), /source snapshots/);
});
test('edition verification rejects an untranslated body field', () => {
  const changed = structuredClone(candidate);
  changed.records[0].data.nodes[0].mechanism = '未翻译的机制';
  assert.throws(() => verifySkillMapEdition(original, changed), /Chinese text remains/);
});
