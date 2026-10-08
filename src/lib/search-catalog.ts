import { pathWithBase, type Concept, type Primitive } from './catalog';
import { mapLink, textLang, taxonomyLang, type SkillMap } from './skill-maps';
import type { SpeakingCardData } from './speaking-cards';
import { matchRecords, searchKinds, type SearchField, type SearchRecord } from './field-search';

interface CatalogSearchRecord extends SearchRecord {
  href: string; summary: string; secondary: string; secondaryParts?: { text: string; lang?: string }[];
  titleLanguage?: string; summaryLanguage?: string;
}
const field = (label: string, value: string, context = false, lang?: string): SearchField => ({ label, value, context, lang });

/** The field-search projection of the same collections used by pages and exports. */
export function catalogSearchRecords(concepts: Concept[], primitives: Primitive[], guides: SpeakingCardData[], maps: SkillMap[]) {
  const conceptNames = new Map(concepts.map(({ id, data }) => [id, `${id} ${data.term} ${data.zh}`]));
  const primitiveNames = new Map(primitives.map(({ id, data }) => [id, `${id} ${data.term} ${data.zh}`]));
  const references = (ids: string[], names: Map<string, string>) => ids.map((id) => names.get(id) ?? id).join(' ');
  const records: CatalogSearchRecord[] = [
    ...concepts.map(({ id, data }) => ({
      identity: `concept:${id}`, type: 'concept' as const, title: data.term,
      href: pathWithBase(`/concepts/${id}/`), summary: data.summary, secondary: `${data.zh} · ${data.category}`,
      fields: [field('Title', data.term), field('Chinese name', data.zh), field('Aliases', data.aliases.join(' ')), field('Category', data.category), field('Summary', data.summary, true, 'en'), field('Definition', data.definition, true, 'en'), field('Related concepts', references(data.related, conceptNames)), field('Linked primitives', references(data.primitives, primitiveNames))],
    })),
    ...primitives.map(({ id, data }) => ({
      identity: `primitive:${id}`, type: 'primitive' as const, title: data.term,
      href: pathWithBase(`/primitives/#${id}`), summary: data.summary, secondary: `${data.zh} · ${data.layer} · ${data.priority.level}`,
      fields: [field('Title', data.term), field('Chinese name', data.zh), field('Summary', data.summary, true, 'en'), field('Layer', data.layer), field('Identifier', id)],
    })),
    ...guides.map((guide) => ({
      identity: `speaking-guide:${guide.number}`, type: 'speaking-guide' as const, title: guide.title,
      href: pathWithBase(`/speaking-card/#card-${String(guide.number).padStart(2, '0')}`), summary: guide.coreIdea, secondary: `Card ${String(guide.number).padStart(2, '0')}`,
      fields: [field('Title', guide.title), field('Core idea', guide.coreIdea, true), field('Linked concepts', references(guide.concepts, conceptNames)), field('Linked primitives', references(guide.primitives, primitiveNames))],
    })),
  ];
  for (const map of maps) {
    records.push({ identity: `skill-map:${map.id}`, type: 'skill-map', title: map.data.title, href: mapLink(map.id), summary: map.data.summary, secondary: map.data.scope,
      titleLanguage: textLang(map.data, 'title'), summaryLanguage: textLang(map.data, 'summary'), secondaryParts: [{ text: map.data.scope, lang: textLang(map.data, 'scope') }],
      fields: [field('Title', map.data.title), field('Summary', map.data.summary, true, textLang(map.data, 'summary')), field('Scope', map.data.scope, true, textLang(map.data, 'scope')), ...map.data.audience.map((value, index) => field('Audience', value, false, textLang(map.data, `audience.${index}`)))],
    });
    for (const node of map.data.nodes) {
      const typeLabel = map.data.taxonomy.types.find((type) => type.id === node.type)?.label ?? '';
      const secondaryParts = [{ text: map.data.title, lang: textLang(map.data, 'title') }, { text: ' · ' }, { text: typeLabel, lang: taxonomyLang(map, 'types', node.type, 'label') }, { text: node.status === 'retired' ? ' · Retired' : '' }];
      records.push({ identity: `map-node:${map.id}:${node.id}`, type: 'map-node', title: node.title, href: mapLink(map.id, `nodes/${node.id}/`), summary: node.summary, secondary: secondaryParts.map((part) => part.text).join(''), secondaryParts,
        titleLanguage: textLang(node, 'title'), summaryLanguage: textLang(node, 'summary'),
        fields: [field('Title', node.title), field('Summary', node.summary, true, textLang(node, 'summary')), field('Owning map', map.data.title), field('Map type', typeLabel), field('Status', node.status === 'retired' ? 'Retired' : ''), ...node.when_to_use.map((value, index) => field('When to use', value, true, textLang(node, `when_to_use.${index}`))), field('Tags', node.tags.join(' ')), field('Clusters', map.data.taxonomy.clusters.filter((cluster) => cluster.id === node.primary_cluster || node.secondary_clusters.includes(cluster.id)).map((cluster) => cluster.label).join(' '))],
      });
    }
    for (const journey of map.data.journeys) {
      const secondaryParts = [{ text: map.data.title, lang: textLang(map.data, 'title') }, { text: journey.status === 'retired' ? ' · Retired' : '' }];
      records.push({ identity: `task-journey:${map.id}:${journey.id}`, type: 'task-journey', title: journey.title, href: mapLink(map.id, `journeys/${journey.id}/`), summary: journey.summary, secondary: secondaryParts.map((part) => part.text).join(''), secondaryParts,
        titleLanguage: textLang(journey, 'title'), summaryLanguage: textLang(journey, 'summary'),
        fields: [field('Title', journey.title), field('Summary', journey.summary, true, textLang(journey, 'summary')), field('Owning map', map.data.title), field('Content type', 'Task journey'), field('Status', journey.status === 'retired' ? 'Retired' : ''), ...journey.when_to_use.map((value, index) => field('When to use', value, true, textLang(journey, `when_to_use.${index}`)))],
      });
    }
  }
  for (const record of records) record.fields.push(field('Content type', searchKinds.find((kind) => kind.value === record.type)!.label));
  const byIdentity = new Map(records.map((record) => [record.identity, record]));
  return matchRecords(records, '', '').map(({ record }) => byIdentity.get(record.identity)!);
}
