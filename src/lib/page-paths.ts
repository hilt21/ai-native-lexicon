import { categoryRegistry, getConcepts, getPrimitives } from './catalog';
import { getSkillMaps } from './skill-maps';
export async function ConceptDetailPaths() {
  return (await getConcepts()).map(({ id }) => ({ params: { slug: id }, props: { concept: { id } } }));
}

export async function CategoryDetailPaths() {
  return categoryRegistry.map((meta) => ({ params: { category: meta.slug }, props: { category: meta.name, meta } }));
}

export async function PrimitiveDetailPaths() {
  return (await getPrimitives()).map(({ id }) => ({ params: { slug: id }, props: { primitive: { id } } }));
}

export async function MapTasksPaths() { return (await getSkillMaps()).map((map) => ({ params: { map: map.id }, props: { map } })); }

export async function MapNodesPaths() { return (await getSkillMaps()).map((map) => ({ params: { map: map.id }, props: { map } })); }

export async function MapOverviewPaths() { return (await getSkillMaps()).map((map) => ({ params: { map: map.id }, props: { map } })); }

export async function MapNodePaths() { return (await getSkillMaps()).flatMap((map) => map.data.nodes.map((node) => ({ params: { map: map.id, node: node.id }, props: { map, node } }))); }

export async function MapJourneyPaths() { return (await getSkillMaps()).flatMap((map) => map.data.journeys.map((journey) => ({ params: { map: map.id, journey: journey.id }, props: { map, journey } }))); }
