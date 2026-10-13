import { getCollection, type CollectionEntry } from 'astro:content';
import { localePath, type Locale } from './locale';
import { resolveSkillMaps, relationIdentity } from '../domain/content/skill-map-translations.mjs';

export type SkillMap = CollectionEntry<'skillMaps'> & { localization?: { owners: Record<string, { coreTranslated: boolean; coverage: { translated: number; total: number; missing: number; draft: number; stale: number } }>; relationLanguages: Record<string, string> } };
export type MapNode = SkillMap['data']['nodes'][number];
export type TaskJourney = SkillMap['data']['journeys'][number];

export async function getSkillMaps(locale: Locale = 'en'): Promise<SkillMap[]> {
  const maps = (await getCollection('skillMaps')).sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0) || a.id.localeCompare(b.id));
  if (locale === 'en') return maps;
  return resolveSkillMaps(maps, await getCollection('skillMapTranslations'), locale);
}

export function relationLang(map: SkillMap, edge: SkillMap['data']['relations'][number]) {
  return map.localization?.relationLanguages[relationIdentity(edge)] ?? textLang(map.data, 'scope');
}

export function mapPageTranslation(map: SkillMap, route: string) {
  const match = /\/(nodes|journeys)\/([^/]+)\/$/.exec(route);
  const owner = match ? `${match[1] === 'nodes' ? 'node' : 'journey'}/${match[2]}` : `map/${map.id}`;
  const state = map.localization?.owners[owner];
  const mapReady = map.localization?.owners[`map/${map.id}`]?.coreTranslated ?? false;
  return { coreTranslated: mapReady && (state?.coreTranslated ?? false), coverage: state?.coverage };
}

export function mapLink(map: string, suffix = '', locale: Locale = 'en') {
  return localePath(`/skill-maps/${map}/${suffix}`, locale);
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
  return record.text_languages?.[path] ?? 'en';
}

export function taxonomyLang(map: SkillMap, kind: 'types' | 'layers' | 'clusters' | 'relation_types', id: string, field: 'label' | 'description' | 'outgoing_label' | 'incoming_label') {
  const index = map.data.taxonomy[kind].findIndex((item) => item.id === id);
  return textLang(map.data, `taxonomy.${kind}.${index}.${field}`);
}
