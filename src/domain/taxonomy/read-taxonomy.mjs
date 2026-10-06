import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

// Astro prerender bundles move modules; its config pins the original data directory.
const buildRoot = typeof import.meta.env === 'undefined' ? undefined : import.meta.env.LEXICON_TAXONOMY_ROOT;

/** @param {'categories' | 'layers'} type */
export function taxonomyDirectory(type) {
  return buildRoot ? join(buildRoot, type) : new URL(`../../data/taxonomy/${type}/`, import.meta.url);
}

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
 * @template {{ order: number }} T
 * @param {string | URL} directory
 * @param {import('zod').ZodType<T>} schema
 * @param {(keyof T)[]} uniqueFields
 * @returns {{ records: T[], errors: string[] }}
 */
export function readTaxonomy(directory, schema, uniqueFields) {
  const path = directory instanceof URL ? fileURLToPath(directory) : directory;
  const entries = readdirSync(path, { withFileTypes: true });
  const records = [];
  const errors = [];
  const identifiers = new Map(uniqueFields.map((field) => [field, new Map()]));
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
    const result = schema.safeParse(input);
    if (!result.success) {
      for (const issue of result.error.issues) errors.push(`${entry.name}: ${issue.path.join('.') || 'record'}: ${issue.message}`);
      continue;
    }
    for (const field of uniqueFields) {
      const value = result.data[field];
      if (identifiers.get(field).has(value)) errors.push(`${entry.name}: duplicate ${field} "${value}" (also ${identifiers.get(field).get(value)})`);
      identifiers.get(field).set(value, entry.name);
    }
    records.push(result.data);
  }
  records.sort((a, b) => a.order - b.order);
  return { records, errors };
}
