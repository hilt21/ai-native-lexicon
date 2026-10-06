import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { conceptInputSchema } from './concept-input.mjs';
import { primitiveInputSchema } from './primitive-input.mjs';
import { speakingCardInputSchema } from './speaking-card-input.mjs';
import { slug as slugSchema } from './rules.mjs';

async function nestedYamlFiles(directory, prefix) {
  const files = [];
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const file = join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await nestedYamlFiles(directory, file));
    else if (entry.isFile() && /\.ya?ml$/.test(entry.name)) files.push(file);
  }
  return files.sort();
}

async function readDirectory(directory, schema, numbered = false) {
  const path = directory instanceof URL ? fileURLToPath(directory) : directory;
  const entries = await readdir(path, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
    .map((entry) => entry.name).sort();
  const records = [];
  const errors = [];
  for (const name of entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()) {
    for (const file of await nestedYamlFiles(path, name)) {
      errors.push(`${file}: nested YAML is not supported; place records directly in the content directory`);
    }
  }
  const slugs = new Map();
  const numbers = new Map();
  for (const file of files) {
    const slug = file.replace(/\.ya?ml$/, '');
    if (!slugSchema.safeParse(slug).success) {
      errors.push(`${file}: filename must be a kebab-case slug`);
      continue;
    }
    if (slugs.has(slug)) {
      errors.push(`${file}: duplicate filename slug "${slug}" (also ${slugs.get(slug)})`);
      continue;
    }
    slugs.set(slug, file);
    let source;
    try {
      source = await readFile(join(path, file), 'utf8');
    } catch (error) {
      errors.push(`${file}: cannot read YAML (${error.message})`);
      continue;
    }
    let input;
    try {
      input = parse(source);
    } catch (error) {
      errors.push(`${file}: invalid YAML (${error.message})`);
      continue;
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      errors.push(`${file}: entry must be a YAML object`);
      continue;
    }
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push(`${file}: ${issue.path.join('.') || 'record'}: ${issue.message}`);
      }
      continue;
    }
    if (numbered) {
      const number = parsed.data.number;
      if (numbers.has(number)) {
        errors.push(`${file}: duplicate speaking card number ${number} (also ${numbers.get(number)})`);
        continue;
      }
      numbers.set(number, file);
    }
    records.push({ slug, file, data: parsed.data });
  }
  if (numbered) records.sort((a, b) => a.data.number - b.data.number);
  return { files, records, errors };
}

export function readConceptInputs(directory = new URL('../../data/concepts/', import.meta.url)) {
  return readDirectory(directory, conceptInputSchema);
}

export function readPrimitiveInputs(directory = new URL('../../data/primitives/', import.meta.url)) {
  return readDirectory(directory, primitiveInputSchema);
}

export function readSpeakingCardInputs(directory = new URL('../../data/speaking-cards/', import.meta.url)) {
  return readDirectory(directory, speakingCardInputSchema, true);
}
