import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { stringify } from 'yaml';
import { readSkillMaps } from '../src/domain/content/read-skill-maps.mjs';
import { validateSkillMapSources, validateSkillMapSnapshotChanges } from '../src/domain/content/validate-skill-map-references.mjs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { skillMapNodeInputSchema } from '../src/domain/content/skill-map-input.mjs';

export const mapInput = {
  schema_version: '1.0.0', title: 'Test skills', summary: 'A map for testing.', scope: 'Test ecosystem', audience: ['Builders'],
  sources: [{ id: 'test-v1', repository: 'https://github.com/example/skills', root_path: 'skills', commit: 'a'.repeat(40), observed_at: '2026-10-07', verification_status: 'verified', verified_at: '2026-10-07' }],
  current_sources: ['test-v1'],
  taxonomy: { types: [{ id: 'tool', label: 'Tool', description: 'A capability.' }], relation_types: [{ id: 'uses', description: 'Uses a capability.', outgoing_label: 'Uses', incoming_label: 'Used by' }] },
};
export const nodeInput = { title: 'Explain', summary: 'Explain a system.', type: 'tool', mechanism: 'Read and explain.', when_to_use: ['Understand a system.'], solves: ['Missing context.'], source_refs: [{ source: 'test-v1', path: 'explain/SKILL.md' }] };

export async function fixture(t, maps = { example: { map: mapInput, nodes: { explain: nodeInput } } }) {
  const directory = await mkdtemp(join(tmpdir(), 'lexicon-skill-maps-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  for (const [id, content] of Object.entries(maps)) {
    const root = join(directory, id);
    await mkdir(join(root, 'nodes'), { recursive: true });
    await mkdir(join(root, 'journeys'), { recursive: true });
    await writeFile(join(root, 'map.yaml'), stringify(content.map));
    await writeFile(join(root, 'relations.yaml'), stringify({ relations: content.relations ?? [] }));
    for (const [slug, node] of Object.entries(content.nodes ?? {})) await writeFile(join(root, 'nodes', `${slug}.yaml`), stringify(node));
    for (const [slug, journey] of Object.entries(content.journeys ?? {})) await writeFile(join(root, 'journeys', `${slug}.yaml`), stringify(journey));
  }
  return directory;
}

test('independent records assemble a map without requiring pstack layers or input/output fields', async (t) => {
  const result = await readSkillMaps(await fixture(t));
  assert.deepEqual(result.errors, []);
  assert.equal(result.records[0].id, 'example');
  assert.equal(result.records[0].data.nodes[0].id, 'explain');
  assert.deepEqual(result.records[0].data.nodes[0].inputs, []);
  assert.deepEqual(result.records[0].data.taxonomy.layers, []);
});

test('map reading diagnoses dangling relationships and active journeys using retired nodes', async (t) => {
  const retired = { title: 'Old', summary: 'No longer available.', type: 'tool', status: 'retired', retirement_note: 'Use the new capability.' };
  const journey = { title: 'Do a task', summary: 'Task guidance.', when_to_use: ['Do work.'], outputs: ['A result.'], variants: [{ id: 'standard', title: 'Standard', steps: [{ title: 'Start', why: 'Choose the entry.', nodes: ['old'] }] }] };
  const result = await readSkillMaps(await fixture(t, { example: { map: mapInput, nodes: { old: retired }, relations: [{ from: 'old', to: 'missing', type: 'uses' }], journeys: { work: journey } } }));
  assert.match(result.errors.join('\n'), /missing.*node|node.*missing/);
  assert.match(result.errors.join('\n'), /retired/);
});

test('map identities isolate same-named nodes, allow cycles and preserve repeated guidance steps', async (t) => {
  const journey = { title: 'Read twice', summary: 'Revisit context.', when_to_use: ['Need context.'], outputs: ['Understanding.'], variants: [{ id: 'standard', title: 'Standard', steps: [{ title: 'Read', why: 'Understand.', nodes: ['explain'] }, { title: 'Revisit', why: 'Check assumptions.', nodes: ['explain'] }] }] };
  const content = { map: mapInput, nodes: { explain: nodeInput }, relations: [{ from: 'explain', to: 'explain', type: 'uses' }], journeys: { understand: journey } };
  const result = await readSkillMaps(await fixture(t, { first: content, second: content }));
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.records.map((r) => r.id), ['first', 'second']);
  assert.equal(result.records[1].data.journeys[0].variants[0].steps.length, 2);
});

test('source publication and immutable-snapshot checks are separate from input parsing', async (t) => {
  const input = structuredClone(mapInput); input.sources[0].verification_status = 'pending'; delete input.sources[0].commit; delete input.sources[0].verified_at;
  const pending = await readSkillMaps(await fixture(t, { example: { map: input } }));
  assert.deepEqual(pending.errors, []);
  assert.match(validateSkillMapSources(pending.records).join('\n'), /pending/);
  const before = await readSkillMaps(await fixture(t));
  const after = structuredClone(before.records); after[0].data.sources[0].commit = 'b'.repeat(40);
  assert.match(validateSkillMapSnapshotChanges(before.records, after).join('\n'), /new snapshot id/);
});

test('record shape errors and directory collisions are reported rather than silently skipped', async (t) => {
  const directory = await fixture(t);
  await writeFile(join(directory, 'example/nodes/explain.yml'), stringify(nodeInput));
  await writeFile(join(directory, 'example/nodes/broken.yaml'), 'summary: [unfinished');
  await writeFile(join(directory, 'example/nodes/extra.yaml'), stringify({ ...nodeInput, surprise: true }));
  await mkdir(join(directory, 'example/nodes/nested'));
  await writeFile(join(directory, 'example/map.yml'), stringify(mapInput));
  const result = await readSkillMaps(directory);
  const errors = result.errors.join('\n');
  assert.match(errors, /duplicate filename/); assert.match(errors, /broken.yaml/); assert.match(errors, /extra.yaml/); assert.match(errors, /nested/); assert.match(errors, /unexpected map content/);
});

test('source paths cannot escape the immutable repository root', async (t) => {
  const node = { ...nodeInput, source_refs: [{ source: 'test-v1', path: '../secrets' }] };
  const result = await readSkillMaps(await fixture(t, { example: { map: mapInput, nodes: { explain: node } } }));
  assert.match(result.errors.join('\n'), /traversal/);
});

test('portable node schema and runtime input agree on active/retired shapes and source paths', async () => {
  const ajv = new Ajv({ strict: false }); addFormats(ajv);
  const portable = ajv.compile(JSON.parse(await readFile(new URL('../schemas/skill-map-node.schema.json', import.meta.url), 'utf8')));
  for (const [input, accepted] of [
    [nodeInput, true],
    [{ title: 'Retired', summary: 'Removed.', type: 'tool', status: 'retired', retirement_note: 'No longer supported.' }, true],
    [{ ...nodeInput, source_refs: [{ source: 'test-v1', path: '../outside' }] }, false],
    [{ ...nodeInput, source_refs: [nodeInput.source_refs[0], nodeInput.source_refs[0]] }, false],
    [{ ...nodeInput, knowledge_refs: { concepts: [] } }, false],
    [{ ...nodeInput, mechanism: ' ' }, false],
  ]) {
    assert.equal(skillMapNodeInputSchema.safeParse(input).success, accepted);
    assert.equal(portable(input), accepted, JSON.stringify(portable.errors));
  }
});
