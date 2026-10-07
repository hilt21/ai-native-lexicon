const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const byId = (a, b) => compare(a.id, b.id);
const languages = (record) => record.text_languages === undefined ? {} : { text_languages: Object.fromEntries(Object.entries(record.text_languages).sort(([a], [b]) => compare(a, b))) };
function normalizedNode(node) {
  const tags = [...node.tags].sort();
  const normalized = { ...node, tags, secondary_clusters: [...node.secondary_clusters].sort(), source_refs: refs(node.source_refs) };
  if (node.text_languages !== undefined) {
    normalized.text_languages = Object.fromEntries(Object.entries(node.text_languages).map(([path, tag]) => {
      const match = /^tags\.(\d+)$/.exec(path);
      return [match ? `tags.${tags.indexOf(node.tags[Number(match[1])])}` : path, tag];
    }));
  }
  return { ...normalized, ...languages(normalized) };
}
const refs = (values = []) => [...values].sort((a, b) => compare(`${a.source}/${a.path}`, `${b.source}/${b.path}`));

/** @typedef {import('zod').output<typeof import('./skill-map-input.mjs').skillMapSchema> & {id: string}} ExportedSkillMap */
/** @param {ExportedSkillMap[]} maps */
export function normalizeSkillMaps(maps) {
  return maps.map((map) => ({
    ...map, ...languages(map),
    sources: [...map.sources].sort(byId),
    nodes: map.nodes.map(normalizedNode).sort(byId),
    journeys: map.journeys.map((journey) => ({ ...journey, ...languages(journey), source_refs: refs(journey.source_refs) })).sort(byId),
    relations: map.relations.map((edge) => ({ ...edge, source_refs: refs(edge.source_refs) })).sort((a, b) => compare(JSON.stringify([a.from, a.type, a.to]), JSON.stringify([b.from, b.type, b.to]))),
  })).sort(byId);
}
