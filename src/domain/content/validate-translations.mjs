import { translationUnits } from './translation-units.mjs';
import { translationInputSchema, translationIdentity } from './translation-input.mjs';

export function translationTargets(catalog) {
  return {
    concept: new Map((catalog.concepts ?? []).map((record) => [record.id ?? record.slug, record.data])),
    primitive: new Map((catalog.primitives ?? []).map((record) => [record.id ?? record.slug, record.data])),
    category: new Map((catalog.categories ?? []).map((record) => [record.slug ?? record.id, record.data ?? record])),
    layer: new Map((catalog.layers ?? []).map((record) => [record.anchor ?? record.id, record.data ?? record])),
  };
}
export function validateTranslations(overlays, catalog) {
  const targets = translationTargets(catalog), identities = new Set(), errors = [];
  for (const record of overlays) {
    const input = record.data ?? record;
    const parsed = translationInputSchema.safeParse(input);
    if (!parsed.success) {
      errors.push(...parsed.error.issues.map((issue) => `translations/${record.file ?? 'record'}: ${issue.path.join('.')}: ${issue.message}`));
      continue;
    }
    const data = parsed.data, id = translationIdentity(data), file = record.file ?? id;
    if (identities.has(id)) errors.push(`translations/${file}: duplicate translation identity ${id}`);
    identities.add(id);
    if (!targets[data.kind]?.has(data.target_id)) {
      errors.push(`translations/${file}: translation target ${data.kind}/${data.target_id} does not exist`);
      continue;
    }
    const descriptors = new Map(translationUnits(data.kind,data.target_id,targets[data.kind].get(data.target_id)).map((unit) => [unit.path,unit]));
    for (const unit of data.units) {
      const source = descriptors.get(unit.path);
      if (!source) { errors.push(`translations/${file}: unknown translation path ${unit.path}`); continue; }
      const vector = Array.isArray(source.source);
      if (Array.isArray(unit.translation) !== vector) {
        errors.push(`translations/${file}: ${unit.path} requires a ${vector ? 'vector' : 'scalar'} translation`);
      } else if (vector && unit.source_fingerprint === source.sourceFingerprint && unit.translation.length !== source.source.length) {
        errors.push(`translations/${file}: ${unit.path} vector length must match the current source (${source.source.length})`);
      }
    }
  }
  return errors;
}
