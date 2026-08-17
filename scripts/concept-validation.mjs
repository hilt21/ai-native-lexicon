import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse } from 'yaml';

export const CATEGORIES = [
  'Context',
  'Agent Architecture',
  'Harness',
  'Governance',
  'Execution',
  'Knowledge',
  'UX',
  'Organization',
];

export async function validateConceptDirectory(directory) {
  const files = (await readdir(directory)).filter((file) => /\.ya?ml$/.test(file)).sort();
  const records = [];
  const errors = [];

  for (const file of files) {
    const slug = basename(file).replace(/\.ya?ml$/, '');
    try {
      const data = parse(await readFile(join(directory, file), 'utf8'));
      records.push({ slug, file, data });
    } catch (error) {
      errors.push(`${file}: invalid YAML (${error.message})`);
    }
  }

  const slugs = new Set(records.map(({ slug }) => slug));
  const terms = new Map();

  for (const { slug, file, data } of records) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${file}: filename must be a kebab-case slug`);
    if (!data || typeof data !== 'object') {
      errors.push(`${file}: entry must be a YAML object`);
      continue;
    }
    if (!CATEGORIES.includes(data.category)) errors.push(`${file}: unknown category "${data.category}"`);
    if (!Array.isArray(data.related) || data.related.length < 2) errors.push(`${file}: related must contain at least two slugs`);
    for (const related of data.related ?? []) {
      if (related === slug) errors.push(`${file}: concept cannot relate to itself`);
      if (!slugs.has(related)) errors.push(`${file}: related concept "${related}" does not exist`);
    }
    const normalizedTerm = String(data.term ?? '').trim().toLowerCase();
    if (terms.has(normalizedTerm)) errors.push(`${file}: duplicate term also found in ${terms.get(normalizedTerm)}`);
    terms.set(normalizedTerm, file);
  }

  const categoryCounts = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
  for (const { data } of records) if (data?.category in categoryCounts) categoryCounts[data.category] += 1;
  for (const [category, count] of Object.entries(categoryCounts)) {
    if (count === 0) errors.push(`category "${category}" has no concepts`);
  }

  return { files, records, errors, categoryCounts };
}
