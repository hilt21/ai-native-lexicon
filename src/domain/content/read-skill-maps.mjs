import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { slug } from './rules.mjs';
import { skillMapInputSchema, skillMapNodeInputSchema, skillMapJourneyInputSchema, skillMapRelationsInputSchema } from './skill-map-input.mjs';
import { validateSkillMapReferences } from './validate-skill-map-references.mjs';

function describeIssue(issue) {
  if (issue.code === 'invalid_union') return issue.errors.flatMap((branch) => branch.flatMap(describeIssue));
  const field = [...issue.path, ...(issue.code === 'unrecognized_keys' ? issue.keys : [])].join('.') || '(record)';
  return [`${field}: ${issue.message}`];
}

export async function readSkillMaps(directory = new URL('../../data/skill-maps/', import.meta.url)) {
  const root = directory instanceof URL ? fileURLToPath(directory) : directory;
  const errors = [];
  const records = [];
  let entries;
  try { entries = await readdir(root, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return { records, errors }; throw error; }
  async function read(file, schema) {
    try { return schema.parse(parse(await readFile(join(root, file), 'utf8'))); }
    catch (error) {
      errors.push(`${file}: ${error.issues ? [...new Set(error.issues.flatMap(describeIssue))].join('; ') : error.message}`);
      return null;
    }
  }
  async function collection(id, name, schema) {
    const values = [];
    const seen = new Set();
    let files;
    try { files = await readdir(join(root, id, name), { withFileTypes: true }); }
    catch (error) { errors.push(`${id}/${name}: ${error.message}`); return values; }
    for (const file of files.sort((a, b) => a.name.localeCompare(b.name))) {
      if (file.isDirectory() || file.isSymbolicLink()) { errors.push(`${id}/${name}/${file.name}: nested or linked content is not supported`); continue; }
      if (!/\.ya?ml$/.test(file.name)) continue;
      const key = file.name.replace(/\.ya?ml$/, '');
      if (!slug.safeParse(key).success || seen.has(key)) { errors.push(`${id}/${name}/${file.name}: invalid or duplicate filename slug`); continue; }
      seen.add(key);
      const input = await read(join(id, name, file.name), schema);
      if (input) values.push({ id: key, ...input });
    }
    return values;
  }
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) { if (/\.ya?ml$/.test(entry.name) || entry.isSymbolicLink()) errors.push(`${entry.name}: put maps in named directories`); continue; }
    const id = entry.name;
    if (!slug.safeParse(id).success) { errors.push(`${id}: invalid map slug`); continue; }
    for (const item of await readdir(join(root, id), { withFileTypes: true })) {
      if ((/\.ya?ml$/.test(item.name) && !['map.yaml', 'relations.yaml'].includes(item.name)) || (item.isDirectory() && !['nodes', 'journeys'].includes(item.name)) || item.isSymbolicLink()) errors.push(`${id}/${item.name}: unexpected map content`);
    }
    const map = await read(join(id, 'map.yaml'), skillMapInputSchema);
    const relations = await read(join(id, 'relations.yaml'), skillMapRelationsInputSchema);
    const nodes = await collection(id, 'nodes', skillMapNodeInputSchema);
    const journeys = await collection(id, 'journeys', skillMapJourneyInputSchema);
    if (map && relations) records.push({ id, data: { ...map, nodes, journeys, relations: relations.relations } });
  }
  for (const record of records) errors.push(...validateSkillMapReferences(record));
  return { records, errors };
}
