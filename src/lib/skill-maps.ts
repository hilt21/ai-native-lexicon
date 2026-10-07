import { getCollection, type CollectionEntry } from 'astro:content';
import { pathWithBase } from './catalog';

export type SkillMap = CollectionEntry<'skillMaps'>;
export type MapNode = SkillMap['data']['nodes'][number];
export type TaskJourney = SkillMap['data']['journeys'][number];

export async function getSkillMaps() {
  return (await getCollection('skillMaps')).sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0) || a.id.localeCompare(b.id));
}

export function mapLink(map: string, suffix = '') {
  return pathWithBase(`/skill-maps/${map}/${suffix}`);
}

export function sourceLink(map: SkillMap, ref: { source: string; path: string }) {
  const source = map.data.sources.find((s) => s.id === ref.source);
  if (!source?.commit) throw new Error(`Missing verified source ${ref.source}`);
  return `${source.repository.replace(/\/$/, '')}/blob/${source.commit}/${[...source.root_path.split('/'), ...ref.path.split('/')].map(encodeURIComponent).join('/')}`;
}

export function orderedJourneys(map: SkillMap) {
  return [...map.data.journeys].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id));
}

/** Language hints belong to the displayed field, including reused labels. */
export function textLang(record: { text_languages?: Record<string, string> }, path: string) {
  return record.text_languages?.[path];
}

export function taxonomyLang(map: SkillMap, kind: 'types' | 'layers' | 'clusters' | 'relation_types', id: string, field: 'label' | 'description' | 'outgoing_label' | 'incoming_label') {
  const index = map.data.taxonomy[kind].findIndex((item) => item.id === id);
  return textLang(map.data, `taxonomy.${kind}.${index}.${field}`);
}
