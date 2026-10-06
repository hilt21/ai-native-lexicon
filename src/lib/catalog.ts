import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from '../content.config';
import { categoryRegistry } from '../domain/taxonomy/categories.mjs';

export { categoryRegistry };
export const categoryMeta: Record<Category, (typeof categoryRegistry)[number]> = Object.fromEntries(
  categoryRegistry.map((category) => [category.name, category]),
);

export type Concept = CollectionEntry<'concepts'>;

export async function getConcepts() {
  return (await getCollection('concepts')).sort((a, b) => a.data.term.localeCompare(b.data.term));
}

export function getCategoryBySlug(slug: string) {
  return (Object.entries(categoryMeta) as [Category, (typeof categoryMeta)[Category]][]).find(
    ([, meta]) => meta.slug === slug,
  );
}

export function pathWithBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}` || '/';
}

export type Primitive = CollectionEntry<'primitives'>;

export async function getPrimitives() {
  return (await getCollection('primitives')).sort((a, b) => a.data.term.localeCompare(b.data.term));
}

export function getPrimitiveDefinitions(primitive: Primitive, conceptsById: Map<string, Concept>) {
  return primitive.data.definitions.map((definition) => {
    if ('concept' in definition) {
      const concept = conceptsById.get(definition.concept);
      if (!concept) throw new Error(`${primitive.id}: missing defining concept ${definition.concept}`);
      return { name: concept.data.term, text: concept.data.definition, concept: concept.id };
    }
    return { ...definition, concept: undefined };
  });
}
