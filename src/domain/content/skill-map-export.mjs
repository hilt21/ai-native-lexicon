const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const byId = (a, b) => compare(a.id, b.id);
const refs = (values = []) => [...values].sort((a, b) => compare(`${a.source}/${a.path}`, `${b.source}/${b.path}`));

/** @typedef {import('zod').output<typeof import('./skill-map-input.mjs').skillMapSchema> & {id: string}} ExportedSkillMap */
/** @param {ExportedSkillMap[]} maps */
export function normalizeSkillMaps(maps) {
  return maps.map((map) => ({
    ...map,
    sources: [...map.sources].sort(byId),
    nodes: map.nodes.map((node) => ({ ...node, tags: [...node.tags].sort(), secondary_clusters: [...node.secondary_clusters].sort(), source_refs: refs(node.source_refs) })).sort(byId),
    journeys: map.journeys.map((journey) => ({ ...journey, source_refs: refs(journey.source_refs) })).sort(byId),
    relations: map.relations.map((edge) => ({ ...edge, source_refs: refs(edge.source_refs) })).sort((a, b) => compare(JSON.stringify([a.from, a.type, a.to]), JSON.stringify([b.from, b.type, b.to]))),
  })).sort(byId);
}
