import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { translationInputSchema, translationIdentity } from './translation-input.mjs';

export async function readTranslations(directory = new URL('../../data/translations/', import.meta.url)) {
  const root = directory instanceof URL ? fileURLToPath(directory) : directory;
  let entries;
  try { entries = await readdir(root, {withFileTypes:true}); }
  catch (error) { if (error.code === 'ENOENT') return {records:[], errors:[]}; throw error; }
  const records = [], errors = [], identities = new Map();
  async function visit(path, relative = '', listing = undefined) {
    for (const entry of (listing ?? await readdir(path, {withFileTypes:true})).sort((a,b) => a.name.localeCompare(b.name))) {
      const file = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isDirectory()) { await visit(join(path,entry.name), file); continue; }
      if (!entry.isFile() || !/\.ya?ml$/.test(entry.name)) continue;
      let result;
      try { result = translationInputSchema.safeParse(parse(await readFile(join(path,entry.name),'utf8'))); }
      catch (error) { errors.push(`${file}: cannot read or parse YAML (${error.message})`); continue; }
      if (!result.success) {
        errors.push(...result.error.issues.map((issue) => `${file}: ${issue.path.join('.') || 'record'}: ${issue.message}`)); continue;
      }
      const id = translationIdentity(result.data);
      if (identities.has(id)) { errors.push(`${file}: duplicate translation identity ${id} (also ${identities.get(id)})`); continue; }
      identities.set(id,file); records.push({id,file,data:result.data});
    }
  }
  await visit(root, '', entries);
  return {records,errors};
}
