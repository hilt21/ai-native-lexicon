import { createHash } from 'node:crypto';

function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, normalize(value[key])]));
  return value;
}

export function fingerprintUnit({kind, target_id, path, source, context = null}) {
  return `sha256:${createHash('sha256').update(JSON.stringify(normalize({version:1,kind,target_id,path,source,context}))).digest('hex')}`;
}

/** Enumerate contract families even when their current source vector is empty. */
export function translationUnits(kind, target_id, data) {
  const units = [];
  const add = (path, source, context = null) => {
    const descriptor = {kind,target_id,path,source,context};
    units.push({...descriptor, sourceFingerprint:fingerprintUnit(descriptor)});
  };
  if (kind === 'concept') {
    for (const path of ['summary','definition','why_it_matters','when_to_use','anti_pattern']) add(path,data[path]);
    const examples = data.examples ?? [], distinctions = data.distinguish_from ?? [];
    add('examples.context', examples.map((item) => item.context), examples);
    add('examples.example', examples.map((item) => item.example), examples);
    add('distinguish_from.distinction', distinctions.map((item) => item.distinction), distinctions);
  } else if (kind === 'primitive') {
    for (const path of ['summary','scope','usage','distinctions']) add(path,data[path]);
    add('composition.pattern',data.composition.pattern);
    add('composition.example',data.composition.example);
    const inline = data.definitions.filter((item) => !('concept' in item));
    add('definitions.name',inline.map((item) => item.name),data.definitions);
    add('definitions.text',inline.map((item) => item.text),data.definitions);
    add('considerations',data.considerations,data.considerations);
    add('ownership.rationale',data.ownership.rationale,{kind:data.ownership.kind});
    add('priority.scope',data.priority.scope,{level:data.priority.level});
    add('priority.rationale',data.priority.rationale,{level:data.priority.level});
  } else if (kind === 'category') {
    add('label',data.name);
    add('description',data.description);
    add('question',data.question);
  } else if (kind === 'layer') add('label',data.name);
  else throw new Error(`Unsupported translation kind: ${kind}`);
  return units;
}
