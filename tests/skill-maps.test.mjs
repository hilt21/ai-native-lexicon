import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fixture, mapInput, nodeInput } from './skill-map-fixture.mjs';
import { stringify } from 'yaml';
import { readSkillMaps } from '../src/domain/content/read-skill-maps.mjs';
import { validateSkillMapSources, validateSkillMapSnapshotChanges } from '../src/domain/content/validate-skill-map-references.mjs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { skillMapInputSchema, skillMapNodeInputSchema } from '../src/domain/content/skill-map-input.mjs';

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
  assert.match(errors, /extra.yaml[^\n]*surprise/);
});

test('union-shaped node and journey failures retain the invalid field in file diagnostics', async (t) => {
  const journey = { title: 'Work', summary: 'Guidance.', when_to_use: ['Do work.'], outputs: ['Result.'], variants: [{ id: 'standard', title: 'Standard', steps: [{ title: 'Read', why: 'Understand.', nodes: ['explain'] }] }], surprise: true };
  const result = await readSkillMaps(await fixture(t, { example: { map: mapInput, nodes: { explain: { ...nodeInput, mechanism: 42 } }, journeys: { work: journey } } }));
  assert.match(result.errors.join('\n'), /nodes\/explain.yaml[^\n]*mechanism/);
  assert.match(result.errors.join('\n'), /journeys\/work.yaml[^\n]*surprise/);
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
    [{ ...nodeInput, source_refs: [{ source: 'test-v1', path: ' ../outside' }] }, false],
    [{ ...nodeInput, tags: ['same', ' same'] }, false],
    [{ ...nodeInput, source_refs: [nodeInput.source_refs[0], nodeInput.source_refs[0]] }, false],
    [{ ...nodeInput, knowledge_refs: { concepts: [] } }, false],
    [{ ...nodeInput, mechanism: ' ' }, false],
  ]) {
    assert.equal(skillMapNodeInputSchema.safeParse(input).success, accepted);
    assert.equal(portable(input), accepted, JSON.stringify(portable.errors));
  }
});

test('portable map schema and runtime reject non-HTTP, relative and unencoded repository URIs', async () => {
  const ajv = new Ajv({ strict: false }); addFormats(ajv);
  const portable = ajv.compile(JSON.parse(await readFile(new URL('../schemas/skill-map.schema.json', import.meta.url), 'utf8')));
  for (const [repository, accepted] of [['https://github.com/example/skills', true], ['ftp://example.com/repo', false], ['https:example.com', false], ['https://example.com/re po', false]]) {
    const input = structuredClone(mapInput); input.sources[0].repository = repository;
    assert.equal(skillMapInputSchema.safeParse(input).success, accepted, repository);
    assert.equal(portable(input), accepted, repository);
  }
});
