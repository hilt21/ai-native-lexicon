import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse } from 'yaml';

import { categories as CATEGORIES } from '../src/domain/content/concept-input.mjs';
import { readConceptInputs } from '../src/domain/content/read-content.mjs';

export { CATEGORIES };

export async function readYamlDirectory(directory) {
  const files = (await readdir(directory)).filter((file) => /\.ya?ml$/.test(file)).sort();
  const records = [];
  const errors = [];
  for (const file of files) {
    const slug = basename(file).replace(/\.ya?ml$/, '');
    try {
      records.push({ slug, file, data: parse(await readFile(join(directory, file), 'utf8')) });
    } catch (error) {
      errors.push(`${file}: invalid YAML (${error.message})`);
    }
  }
  return { files, records, errors };
}

export async function validateConceptDirectory(directory) {
  const { files, records, errors } = await readConceptInputs(directory);
  const slugs = new Set(records.map(({ slug }) => slug));
  const terms = new Map();

  for (const { slug, file, data } of records) {
    for (const related of data.related ?? []) {
      if (related === slug) errors.push(`${file}: concept cannot relate to itself`);
      if (!slugs.has(related)) errors.push(`${file}: related concept "${related}" does not exist`);
    }
    const normalizedTerm = data.term.trim().toLowerCase();
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
