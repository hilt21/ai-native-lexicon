import { createHash } from 'node:crypto';
import { normalizeSkillMaps } from '../domain/content/skill-map-export.mjs';

function orderedKeys(value) {
  if (Array.isArray(value)) return value.map(orderedKeys);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, orderedKeys(value[key])]));
  }
  return value;
}

function byField(field) {
  return (a, b) => a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
}

/**
 * @param {{ concepts: {slug: string}[], primitives: {slug: string}[], speaking_cards: {number: number}[], skill_maps?: import('../domain/content/skill-map-export.mjs').ExportedSkillMap[], taxonomy: {categories: {slug: string}[], layers: {anchor: string}[]} }} content
 */
export function createDatasetVersion({ concepts, primitives, speaking_cards, skill_maps = [], taxonomy }) {
  const payload = {
    concepts: [...concepts].sort(byField('slug')),
    primitives: [...primitives].sort(byField('slug')),
    speaking_cards: [...speaking_cards].sort((a, b) => a.number - b.number),
    skill_maps: normalizeSkillMaps(skill_maps),
    taxonomy: {
      categories: [...taxonomy.categories].sort(byField('slug')),
      layers: [...taxonomy.layers].sort(byField('anchor')),
    },
  };
  // Use the export's JSON semantics, including Dates and omitted optional fields.
  const normalized = orderedKeys(JSON.parse(JSON.stringify(payload)));
  return `sha256:${createHash('sha256').update(JSON.stringify(normalized)).digest('hex')}`;
}
