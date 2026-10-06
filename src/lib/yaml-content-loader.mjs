import { readFile } from 'node:fs/promises';
import { glob } from 'astro/loaders';
import { parse } from 'yaml';

/**
 * @param {'concepts' | 'primitives'} collection
 * @returns {import('astro/loaders').Loader}
 */
export function yamlContentLoader(collection) {
  const loader = glob({ pattern: '*.{yaml,yml}', base: `./src/data/${collection}` });
  return {
    ...loader,
    name: `${collection}-yaml-loader`,
    load(context) {
      // Native glob hashes YAML only; reparse when external contracts change.
      context.store.clear();
      return loader.load({
        ...context,
        async parseData(entry) {
          if (!entry.filePath) throw new Error(`${collection} glob entries require a file path`);
          // Use the CLI's YAML parser before the shared input contract runs.
          const data = parse(await readFile(entry.filePath, 'utf8'));
          return context.parseData({ ...entry, data });
        },
      });
    },
  };
}
