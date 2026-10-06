import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { z } from 'zod';
import { slug, text as requiredText } from '../content/rules.mjs';

const text = requiredText.regex(/\S/, 'Use non-blank text');
// Astro prerender bundles move modules; its config pins the original data directory.
const buildRoot = typeof import.meta.env === 'undefined' ? undefined : import.meta.env.LEXICON_TAXONOMY_ROOT;
export const categoryInputSchema = z.object({
  name: text,
  slug,
  code: text,
  description: text,
  question: text,
  order: z.number().int().positive(),
}).strict();

function nestedYamlFiles(directory, prefix) {
  const files = [];
  for (const entry of readdirSync(join(directory, prefix), { withFileTypes: true })) {
    const file = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...nestedYamlFiles(directory, file));
    else if (entry.isFile() && /\.ya?ml$/.test(entry.name)) files.push(file);
  }
  return files;
}

/**
 * @param {string | URL} [directory]
 * @returns {{ categories: import('zod').output<typeof categoryInputSchema>[], errors: string[] }}
 */
export function readCategories(directory = buildRoot ? join(buildRoot, 'categories') : new URL('../../data/taxonomy/categories/', import.meta.url)) {
  const path = directory instanceof URL ? fileURLToPath(directory) : directory;
  const entries = readdirSync(path, { withFileTypes: true });
  const categories = [];
  const errors = [];
  const identifiers = { name: new Map(), slug: new Map(), order: new Map() };
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isDirectory()) {
      for (const file of nestedYamlFiles(path, entry.name)) errors.push(`${file}: nested YAML is not supported`);
      continue;
    }
    if (!entry.isFile() || !/\.ya?ml$/.test(entry.name)) continue;
    let input;
    try {
      input = parse(readFileSync(join(path, entry.name), 'utf8'));
    } catch (error) {
      errors.push(`${entry.name}: cannot read or parse YAML (${error.message})`);
      continue;
    }
    const result = categoryInputSchema.safeParse(input);
    if (!result.success) {
      for (const issue of result.error.issues) errors.push(`${entry.name}: ${issue.path.join('.') || 'record'}: ${issue.message}`);
      continue;
    }
    for (const field of ['name', 'slug', 'order']) {
      const value = result.data[field];
      if (identifiers[field].has(value)) errors.push(`${entry.name}: duplicate ${field} "${value}" (also ${identifiers[field].get(value)})`);
      identifiers[field].set(value, entry.name);
    }
    categories.push(result.data);
  }
  if (!categories.length) errors.push('categories: configure at least one category');
  categories.sort((a, b) => a.order - b.order);
  return { categories, errors };
}

const result = readCategories();
if (result.errors.length) throw new Error(`Invalid category configuration:\n${result.errors.join('\n')}`);
export const categoryRegistry = result.categories;
export const categoryNames = categoryRegistry.map(({ name }) => name);
