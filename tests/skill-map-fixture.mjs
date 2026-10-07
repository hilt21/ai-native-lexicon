import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { stringify } from 'yaml';

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
