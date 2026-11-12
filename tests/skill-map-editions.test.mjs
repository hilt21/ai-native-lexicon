import assert from 'node:assert/strict';
import test from 'node:test';
import { readSkillMaps } from '../src/domain/content/read-skill-maps.mjs';
import { validateSkillMapSnapshotChanges } from '../src/domain/content/validate-skill-map-references.mjs';
import { verifySkillMapEdition } from '../scripts/verify-skill-map-edition.mjs';

// The migration proposal is a historical fixture. Live maps may add nodes,
// journeys and source snapshots after that edition.
const editionIds = ['mattpocock', 'pstack'];
function editionBaseline(catalog) {
  assert.deepEqual(catalog.errors, []);
  const records = catalog.records.filter(({ id }) => editionIds.includes(id));
  assert.deepEqual(records.map(({ id }) => id).sort(), editionIds);
  return { ...catalog, records };
}
const original = editionBaseline(await readSkillMaps(new URL('../docs/proposals/i18n-completion-2026-10-13/skill-maps/', import.meta.url)));
const candidate = structuredClone(original);
test('current maps preserve migration-era public identities and source snapshots', async () => {
  const current = editionBaseline(await readSkillMaps());
  assert.deepEqual(validateSkillMapSnapshotChanges(original.records, current.records), []);
  for (const { id, data } of original.records) {
    const live = current.records.find((m) => m.id === id).data;
    for (const key of ['nodes', 'journeys', 'sources']) {
      const liveIds = new Set(live[key].map((item) => item.id));
      for (const item of data[key]) assert.ok(liveIds.has(item.id), `${id}/${key}/${item.id} was removed`);
    }
  }
});
test('complete English edition retains stable identity, topology and source snapshots', () => {
  const result = verifySkillMapEdition(original, candidate);
  assert.equal(result.nodes, original.records.reduce((n, m) => n + m.data.nodes.length, 0));
  assert.equal(result.semanticReview, 'required-for-new-prose');
});
test('an independently added map is outside the two-map edition scope', () => {
  const extended = structuredClone(original);
  extended.records.push({ id: 'l2-acceptance-map', data: structuredClone(original.records[0].data) });
  assert.deepEqual(editionBaseline(extended), original);
  assert.equal(verifySkillMapEdition(editionBaseline(extended), candidate).maps, 2);
});
test('edition verification rejects omission of an in-scope map', () => {
  const changed = structuredClone(candidate);
  changed.records.pop();
  assert.throws(() => verifySkillMapEdition(original, changed), /structure/);
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
