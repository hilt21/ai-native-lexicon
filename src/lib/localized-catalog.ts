import { getCollection } from 'astro:content';
import { getConcepts, getPrimitives, type Concept, type Primitive } from './catalog';
import { categoryRegistry } from '../domain/taxonomy/categories.mjs';
import { layerRegistry } from '../domain/taxonomy/layers.mjs';
import { resolveCatalog } from '../domain/content/localize-catalog.mjs';
import type { Locale } from './locale';
export interface Unit { text: string | string[]; actualLang: Locale; status: 'canonical' | 'reviewed' | 'missing' | 'draft' | 'stale'; fallback: boolean }
export interface TranslationState { units: Record<string, Unit>; coverage: { translated: number; total: number; missing: number; draft: number; stale: number }; coreTranslated: boolean }
export type LocalizedConcept = Pick<Concept, 'id' | 'data'> & TranslationState & { canonical: Concept['data'] };
export type LocalizedPrimitive = Pick<Primitive, 'id' | 'data'> & TranslationState & { canonical: Primitive['data'] } & { definitions: { name: string; text: string; concept?: string; nameLang: string; textLang: string }[] };
export type LocalizedCategory = TranslationState & { id: string; canonical: (typeof categoryRegistry)[number]; data: (typeof categoryRegistry)[number] & { label: string } };
export type LocalizedLayer = TranslationState & { id: string; canonical: (typeof layerRegistry)[number]; data: (typeof layerRegistry)[number] & { label: string } };
export async function getLocalizedCatalog(locale: Locale) {
  const [concepts, primitives, translations] = await Promise.all([getConcepts(), getPrimitives(), getCollection('translations')]);
  const resolved = resolveCatalog({ concepts: concepts.map((entry) => ({ slug: entry.id, data: entry.data })), primitives: primitives.map((entry) => ({ slug: entry.id, data: entry.data })), categories: categoryRegistry, layers: layerRegistry }, translations.map(({ data }) => data), locale);
  return { ...resolved, concepts: resolved.concepts as LocalizedConcept[], primitives: resolved.primitives as LocalizedPrimitive[], categories: resolved.categories as LocalizedCategory[], layers: resolved.layers as LocalizedLayer[] };
}
export async function getLocalizedConcepts(locale: Locale) { return (await getLocalizedCatalog(locale)).concepts; }
export async function getLocalizedPrimitives(locale: Locale) { return (await getLocalizedCatalog(locale)).primitives; }
export function unitLang(record: unknown, path: string) {
  return (record as Partial<TranslationState>)?.units?.[path]?.actualLang ?? 'en';
}
