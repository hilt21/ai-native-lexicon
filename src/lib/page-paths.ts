import { categoryRegistry, getConcepts, getPrimitives } from './catalog';
import { getSkillMaps } from './skill-maps';
import type { Locale } from './locale';
export async function ConceptDetailPaths() {
  return (await getConcepts()).map(({ id }) => ({ params: { slug: id }, props: { concept: { id } } }));
}

export async function CategoryDetailPaths() {
  return categoryRegistry.map((meta) => ({ params: { category: meta.slug }, props: { category: meta.name, meta } }));
}

export async function PrimitiveDetailPaths() {
  return (await getPrimitives()).map(({ id }) => ({ params: { slug: id }, props: { primitive: { id } } }));
}

export async function MapTasksPaths(locale: Locale = 'en') { return (await getSkillMaps(locale)).map((map) => ({ params: { map: map.id }, props: { map } })); }

export async function MapNodesPaths(locale: Locale = 'en') { return MapTasksPaths(locale); }

export async function MapOverviewPaths(locale: Locale = 'en') { return MapTasksPaths(locale); }

export async function MapNodePaths(locale: Locale = 'en') { return (await getSkillMaps(locale)).flatMap((map) => map.data.nodes.map((node) => ({ params: { map: map.id, node: node.id }, props: { map, node } }))); }

export async function MapJourneyPaths(locale: Locale = 'en') { return (await getSkillMaps(locale)).flatMap((map) => map.data.journeys.map((journey) => ({ params: { map: map.id, journey: journey.id }, props: { map, journey } }))); }
