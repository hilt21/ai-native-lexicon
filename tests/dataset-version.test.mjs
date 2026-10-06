import assert from 'node:assert/strict';
import test from 'node:test';
import { createDatasetVersion } from '../src/lib/dataset-version.mjs';

const content = {
  concepts: [{ slug: 'context', term: 'Context', added: new Date('2026-10-06T00:00:00Z') }, { slug: 'agent', term: 'Agent' }],
  primitives: [{ slug: 'state', term: 'State' }],
  speaking_cards: [{ number: 20, title: 'Talk', coreIdea: 'Explain a useful idea.', concepts: ['context'], primitives: ['state'] }],
  taxonomy: { categories: [{ slug: 'context', name: 'Context', description: 'Information available to a system.', order: 1 }], layers: [{ anchor: 'layer-runtime-trust', name: 'Runtime & Trust', order: 5 }] },
};

test('dataset versions depend on normalized content and taxonomy, not build time or key/record order', () => {
  const before = JSON.stringify(content);
  const first = createDatasetVersion({ ...content, generated_at: '2026-10-06T01:00:00Z' });
  const reordered = JSON.parse(before);
  reordered.concepts.reverse();
  reordered.concepts = reordered.concepts.map((record) => Object.fromEntries(Object.entries(record).reverse()));
  assert.match(first, /^sha256:[a-f0-9]{64}$/);
  assert.equal(createDatasetVersion({ ...reordered, generated_at: '2030-01-01T01:00:00Z' }), first);
  assert.equal(JSON.stringify(content), before, 'versioning must not mutate collection order or records');
});

test('semantic changes in each content type and taxonomy change the dataset version', () => {
  const version = createDatasetVersion(content);
  for (const change of [
    (data) => { data.concepts[0].term = 'Changed Concept'; },
    (data) => { data.primitives[0].term = 'Changed Primitive'; },
    (data) => { data.speaking_cards[0].coreIdea = 'A changed speaking idea.'; },
    (data) => { data.taxonomy.categories[0].description = 'A changed category boundary.'; },
    (data) => { data.taxonomy.layers[0].order = 6; },
  ]) {
    const changed = JSON.parse(JSON.stringify(content));
    change(changed);
    assert.notEqual(createDatasetVersion(changed), version);
  }
});
