import { getCollection, render } from 'astro:content';
import { getPrimitives } from './catalog';
import { getSpeakingCards } from './speaking-cards';
import { layerRegistry, layerHeadingId } from '../domain/taxonomy/layers.mjs';
import type { Locale } from './locale';
/** Stable anchors are derived from the same canonical identities used by shared views. */
export async function pageFragments(root: string, locale: Locale) {
  const fragments = ['_top'];
  if (root === '/') fragments.push('lexicon-content');
  if (root === '/primitives/') {
    fragments.push(...(await getPrimitives()).map((entry) => entry.id), ...layerRegistry.flatMap((layer) => [layer.anchor, layerHeadingId(layer.anchor)]));
  }
  const concept = /^\/concepts\/([^/]+)\/$/.exec(root)?.[1];
  const cards = await getSpeakingCards();
  if (concept) {
    fragments.push(`${concept}-definition-copy`);
    if (cards.some((card) => card.concepts.includes(concept))) fragments.push(`${concept}-speaking-cards`);
  }
  const primitive = /^\/primitives\/([^/]+)\/$/.exec(root)?.[1];
  if (primitive) {
    const record = (await getPrimitives()).find((entry) => entry.id === primitive);
    if (!record) throw new Error(`Unknown primitive: ${primitive}`);
    if (cards.some((card) => card.primitives.includes(primitive))) fragments.push(`${primitive}-speaking-cards`);
    fragments.push(...record.data.definitions.map((_, index) => `${primitive}-definition-copy-${index}`));
  }
  if (root === '/speaking-card/') fragments.push(...cards.flatMap((card) => { const id = `card-${String(card.number).padStart(2, '0')}`; return [id, ...['title', 'lines', 'case', 'question', 'ending', 'concepts', 'primitives'].map((suffix) => `${id}-${suffix}`)]; }));
  const docs = await getCollection('docs');
  const id = root.replace(/^\/|\/$/g, '');
  const doc = (locale === 'zh-CN' ? docs.find((entry) => entry.id === `zh-cn/${id}`) : undefined) ?? docs.find((entry) => entry.id === id);
  if (doc) fragments.push(...(await render(doc)).headings.map((heading) => heading.slug));
  return fragments;
}
