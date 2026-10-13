import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readSkillMaps } from '../src/domain/content/read-skill-maps.mjs';
import { validateSkillMapSources, validateSkillMapSnapshotChanges } from '../src/domain/content/validate-skill-map-references.mjs';

const prose = new Set(['title', 'summary', 'scope', 'audience', 'description', 'label', 'outgoing_label', 'incoming_label', 'mechanism', 'when_to_use', 'solves', 'inputs', 'outputs', 'handoffs', 'tags', 'retirement_note', 'note', 'why', 'when', 'text_languages']);
function structure(value) {
  if (Array.isArray(value)) return value.map(structure);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => !prose.has(key)).map(([key, child]) => [key, key === 'sources' || key === 'source_refs' ? child : structure(child)]));
  return value;
}

/** Edition content can change prose, never identities, graph or source snapshots. */
export function verifySkillMapEdition(original, candidate) {
  assert.deepEqual(candidate.errors, [], 'Candidate input/reference validation');
  assert.deepEqual(validateSkillMapSources(candidate.records), [], 'Candidate source publication state');
  assert.deepEqual(validateSkillMapSnapshotChanges(original.records, candidate.records), [], 'Immutable source snapshots');
  assert.deepEqual(structure(candidate.records), structure(original.records), 'Edition identity, classification, relation and journey structure');
  let nodes = 0, journeys = 0, relations = 0;
  for (const map of candidate.records) {
    assert.ok(!/\p{Script=Han}/u.test(JSON.stringify(map.data)), `${map.id}: Chinese text remains in the English candidate`);
    nodes += map.data.nodes.length; journeys += map.data.journeys.length; relations += map.data.relations.length;
  }
  return { maps: candidate.records.length, nodes, journeys, relations, sameStructure: true, immutableSources: true, noHanText: true, semanticReview: 'required-for-new-prose' };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  assert.ok(process.argv[2], 'Usage: node scripts/verify-skill-map-edition.mjs <candidate-map-root>');
  const original = await readSkillMaps();
  assert.deepEqual(original.errors, []);
  const result = verifySkillMapEdition(original, await readSkillMaps(resolve(process.argv[2])));
  console.log(JSON.stringify(result, null, 2));
}
