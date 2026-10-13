import { z } from 'zod';
import { slug, isoDate } from './rules.mjs';
import { fingerprintUnit } from './translation-units.mjs';
import { readTranslations } from './read-translations.mjs';

const prose = {
  map: /^(?:title|summary|scope|audience\.\d+|taxonomy\.(?:types|layers|clusters)\.\d+\.(?:label|description)|taxonomy\.relation_types\.\d+\.(?:outgoing_label|incoming_label|description))$/,
  node: /^(?:title|summary|mechanism|retirement_note|official_description|(?:when_to_use|solves|inputs|outputs|handoffs|tags)\.\d+)$/,
  journey: /^(?:title|summary|retirement_note|(?:when_to_use|inputs|outputs)\.\d+|variants\.\d+\.(?:title|when|steps\.\d+\.(?:title|why|when|outputs\.\d+)))$/,
  relation: /^note$/,
};
const unitFields = {
  path: z.string().min(1), translation: z.string().min(1).regex(/^\S(?:[\s\S]*\S)?$/, 'Use nonblank text without surrounding whitespace'),
  language: z.enum(['en', 'zh-CN', 'zh-Hans']), source_fingerprint: z.string().regex(/^sha256:[a-f0-9]{64}$/),
};
const unit = z.discriminatedUnion('review_status', [
  z.object({ ...unitFields, review_status: z.literal('draft'), reviewed_at: isoDate.optional() }).strict(),
  z.object({ ...unitFields, review_status: z.literal('reviewed'), reviewed_at: isoDate }).strict(),
]);
export const skillMapTranslationInputSchema = z.object({
  schema_version: z.literal('1.0.0'), locale: z.literal('zh-CN'), map_id: slug,
  kind: z.enum(['map', 'node', 'journey', 'relation']), target_id: z.string().min(1),
  provenance: z.object({ original_sha256: z.string().regex(/^[a-f0-9]{64}$/), retained_at: isoDate }).strict(),
  units: z.array(unit),
}).strict().refine((r) => new Set(r.units.map((u) => u.path)).size === r.units.length, { message: 'Duplicate prose paths' });
export const skillMapTranslationIdentity = (r) => `${r.locale}/${r.map_id}/${r.kind}/${r.target_id}`;
export const relationIdentity = (edge) => JSON.stringify([edge.from, edge.type, edge.to]);

export function skillMapOwners(map) {
  return [
    { kind: 'map', id: map.id, data: map.data },
    ...map.data.nodes.map((data) => ({ kind: 'node', id: data.id, data })),
    ...map.data.journeys.map((data) => ({ kind: 'journey', id: data.id, data })),
    ...map.data.relations.map((data) => ({ kind: 'relation', id: relationIdentity(data), data })),
  ];
}

/** Bind indexed prose to its complete owner; reorder or sibling edits invalidate it. */
export function skillMapTranslationUnits(mapId, owner) {
  const units = [];
  const context = Object.fromEntries(Object.entries(owner.data).filter(([key]) => !['text_languages', 'nodes', 'journeys', 'relations'].includes(key)));
  const visit = (value, path = '') => {
    if (typeof value === 'string' && prose[owner.kind].test(path)) {
      units.push({ path, source: value, sourceFingerprint: fingerprintUnit({ kind: `skill-map-${owner.kind}`, target_id: `${mapId}/${owner.id}`, path, source: value, context }) });
    } else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) if (key !== 'text_languages') visit(child, path ? `${path}.${key}` : key);
    }
  };
  visit(context);
  return units;
}

export function readSkillMapTranslations(directory) {
  return readTranslations(directory, skillMapTranslationInputSchema, skillMapTranslationIdentity);
}

export function validateSkillMapTranslations(overlays, maps) {
  const owners = new Map(maps.flatMap((map) => skillMapOwners(map).map((owner) => [`${map.id}/${owner.kind}/${owner.id}`, skillMapTranslationUnits(map.id, owner)])));
  const errors = [], seen = new Set();
  for (const entry of overlays) {
    const r = entry.data, key = `${r.map_id}/${r.kind}/${r.target_id}`;
    if (seen.has(key)) errors.push(`${key}: duplicate translation owner`);
    seen.add(key);
    const descriptors = owners.get(key);
    if (!descriptors) { errors.push(`${key}: unknown translation owner`); continue; }
    for (const u of r.units) if (!descriptors.some((d) => d.path === u.path) && !prose[r.kind].test(u.path)) errors.push(`${key}/${u.path}: unsupported prose path`);
  }
  return errors;
}

export function resolveSkillMaps(maps, overlays, locale) {
  if (!['en', 'zh-CN'].includes(locale)) throw new Error(`Unsupported Skill Map locale: ${locale}`);
  const errors = validateSkillMapTranslations(overlays, maps);
  if (errors.length) throw new Error(errors.join('\n'));
  const byOwner = new Map(overlays.map(({ data: r }) => [`${r.map_id}/${r.kind}/${r.target_id}`, r]));
  return maps.map((canonical) => {
    const map = structuredClone(canonical), owners = {}, relationLanguages = {};
    for (const owner of skillMapOwners(map)) {
      const overlay = byOwner.get(`${map.id}/${owner.kind}/${owner.id}`);
      const units = {};
      for (const d of skillMapTranslationUnits(map.id, owner)) {
        const candidate = overlay?.units.find((u) => u.path === d.path);
        const status = locale === 'en' ? 'canonical' : !candidate ? 'missing' : candidate.review_status === 'draft' ? 'draft' : candidate.source_fingerprint !== d.sourceFingerprint ? 'stale' : 'reviewed';
        const translated = status === 'reviewed';
        const language = translated ? candidate.language : (owner.data.text_languages?.[d.path] ?? 'en');
        units[d.path] = { status, actualLang: language, text: translated ? candidate.translation : d.source, fallback: locale === 'zh-CN' && !translated };
        if (translated) {
          const keys = d.path.split('.'), last = keys.pop();
          const target = keys.reduce((value, key) => value[key], owner.data);
          target[last] = candidate.translation;
        }
        if (owner.kind === 'relation') relationLanguages[owner.id] = language;
        else (owner.data.text_languages ??= {})[d.path] = language;
      }
      const coverage = { translated: 0, total: 0, missing: 0, draft: 0, stale: 0 };
      for (const u of Object.values(units)) { coverage.total++; if (u.status === 'reviewed') coverage.translated++; else if (u.status !== 'canonical') coverage[u.status]++; }
      const core = owner.kind === 'map' ? ['title', 'summary', 'scope'] : owner.kind === 'relation' ? [] : ['title', 'summary'];
      owners[`${owner.kind}/${owner.id}`] = { units, coverage, coreTranslated: locale === 'en' || core.every((path) => units[path]?.status === 'reviewed') };
    }
    return { ...map, localization: { owners, relationLanguages } };
  });
}
