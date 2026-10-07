const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;

/** @typedef {import('zod').output<typeof import('./skill-map-input.mjs').skillMapSchema>} MapData */
/** @typedef {{ id: string, label: string, description?: string, kind?: 'layers' | 'types' | 'clusters', count: number, examples: MapData['nodes'] }} OverviewGroup */
/** Bounded examples retain complete membership counts and canonical edge direction.
 * @param {MapData} data */
export function skillMapOverview(data) {
  const active = data.nodes.filter((node) => node.status === 'active').sort((a, b) => compare(a.id, b.id));
  /** @param {{id: string, label: string, description?: string}} classification
   * @param {MapData['nodes']} nodes
   * @param {'layers' | 'types' | 'clusters' | undefined} kind
   * @returns {OverviewGroup} */
  const group = (classification, nodes, kind) => ({ ...classification, kind, count: nodes.length, examples: nodes.slice(0, 3) });
  const kind = data.taxonomy.layers.length ? 'layers' : 'types';
  const groups = data.taxonomy[kind].map((item) => group(item, active.filter((node) => kind === 'layers' ? node.layer === item.id : node.type === item.id), kind));
  const unlayered = active.filter((node) => !node.layer);
  if (kind === 'layers' && unlayered.length) groups.push(group({ id: 'other', label: 'Other items' }, unlayered, undefined));
  const clusters = data.taxonomy.clusters.map((item) => group(item, active.filter((node) => node.primary_cluster === item.id || node.secondary_clusters.includes(item.id)), 'clusters'));
  const nodes = new Map(active.map((node) => [node.id, node]));
  const relationships = data.taxonomy.relation_types.flatMap((type) => {
    const edge = data.relations.filter((edge) => edge.type === type.id && nodes.has(edge.from) && nodes.has(edge.to)).sort((a, b) => compare(a.from, b.from) || compare(a.to, b.to))[0];
    const from = edge && nodes.get(edge.from); const to = edge && nodes.get(edge.to);
    return edge && from && to ? [{ type, edge, from, to }] : [];
  });
  return { groups, clusters, relationships };
}
