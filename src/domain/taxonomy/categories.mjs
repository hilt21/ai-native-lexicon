import { z } from 'zod';
import { slug, text as requiredText } from '../content/rules.mjs';
import { readTaxonomy, taxonomyDirectory } from './read-taxonomy.mjs';

const text = requiredText.regex(/\S/, 'Use non-blank text');
export const categoryInputSchema = z.object({
  name: text,
  slug,
  code: text,
  description: text,
  question: text,
  order: z.number().int().positive(),
}).strict();

/** @param {string | URL} [directory] */
export function readCategories(directory = taxonomyDirectory('categories')) {
  const { records, errors } = readTaxonomy(directory, categoryInputSchema, ['name', 'slug', 'order']);
  if (!records.length) errors.push('categories: configure at least one category');
  return { categories: records, errors };
}

const result = readCategories();
if (result.errors.length) throw new Error(`Invalid category configuration:\n${result.errors.join('\n')}`);
export const categoryRegistry = result.categories;
export const categoryNames = categoryRegistry.map(({ name }) => name);
