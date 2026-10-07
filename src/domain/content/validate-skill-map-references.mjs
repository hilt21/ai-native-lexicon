export function validateSkillMapReferences({ id, data }) {
  const errors = [];
  const fail = (where, message) => errors.push(`${id}/${where}: ${message}`);
  const index = (items, where) => {
    const values = new Map();
    for (const item of items) {
      if (values.has(item.id)) fail(where, `duplicate id "${item.id}"`);
      values.set(item.id, item);
    }
    return values;
  };
  const nodes = index(data.nodes, 'nodes');
  const sources = index(data.sources, 'map.yaml sources');
  const types = index(data.taxonomy.types, 'map.yaml types');
  const layers = index(data.taxonomy.layers, 'map.yaml layers');
  const clusters = index(data.taxonomy.clusters, 'map.yaml clusters');
  const relations = index(data.taxonomy.relation_types, 'map.yaml relation_types');
  const exists = (values, key, where, kind) => { if (!values.has(key)) fail(where, `missing ${kind} "${key}"`); };
  const refs = (record, where) => { for (const ref of record.source_refs) exists(sources, ref.source, where, 'source'); };
  for (const source of data.current_sources) exists(sources, source, 'map.yaml current_sources', 'source');
  for (const node of data.nodes) {
    const where = `nodes/${node.id}.yaml`;
    exists(types, node.type, where, 'type');
    if (node.layer) exists(layers, node.layer, where, 'layer');
    for (const cluster of [...node.secondary_clusters, ...(node.primary_cluster ? [node.primary_cluster] : [])]) exists(clusters, cluster, where, 'cluster');
    if (node.secondary_clusters.includes(node.primary_cluster)) fail(where, 'secondary_clusters repeats primary_cluster');
    refs(node, where);
    if (node.replaced_by && (node.replaced_by === node.id || nodes.get(node.replaced_by)?.status !== 'active')) fail(where, 'replaced_by must reference another active node');
  }
  const edges = new Set();
  for (const edge of data.relations) {
    exists(nodes, edge.from, 'relations.yaml', 'node'); exists(nodes, edge.to, 'relations.yaml', 'node'); exists(relations, edge.type, 'relations.yaml', 'relation type');
    const key = JSON.stringify([edge.from, edge.type, edge.to]);
    if (edges.has(key)) fail('relations.yaml', 'duplicate relationship');
    edges.add(key); refs(edge, 'relations.yaml');
  }
  for (const journey of data.journeys) {
    const where = `journeys/${journey.id}.yaml`;
    refs(journey, where);
    index(journey.variants, where);
    for (const variant of journey.variants) for (const step of variant.steps) for (const node of step.nodes) {
      exists(nodes, node, where, 'node');
      if (journey.status === 'active' && nodes.get(node)?.status === 'retired') fail(where, `active journey references retired node "${node}"`);
    }
  }
  return errors;
}

export function validateSkillMapSources(records) {
  return records.flatMap(({ id, data }) => data.sources.filter((s) => s.verification_status !== 'verified').map((s) => `${id}/map.yaml: source "${s.id}" is pending; complete source verification before publication`));
}

export function validateSkillMapSnapshotChanges(previous, current) {
  const errors = [];
  for (const map of current) {
    const before = previous.find((m) => m.id === map.id);
    if (!before) continue;
    for (const source of map.data.sources) {
      const old = before.data.sources.find((s) => s.id === source.id);
      if (old && ['commit', 'repository', 'root_path'].some((key) => old[key] !== source[key])) errors.push(`${map.id}: source snapshot "${source.id}" changed; use a new snapshot id`);
    }
  }
  return errors;
}
