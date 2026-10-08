import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCatalog, validateCatalog } from '../domain/content/catalog.mjs';

/** Shared catalog validation is the publication boundary for Astro and the CLI. */
export function translationsLoader(directory = new URL('../data/', import.meta.url)) {
  const root = resolve(directory instanceof URL ? fileURLToPath(directory) : directory).replaceAll('\\', '/');
  let stopWatching;
  let generation = 0;
  return {
    name:'translations-yaml-loader',
    async load(context) {
      stopWatching?.();
      const current = ++generation;
      const sync = async () => {
        const catalog = await readCatalog(directory);
        const {errors} = validateCatalog(catalog);
        if (errors.length) throw new Error(errors.join('\n'));
        const parsed = await Promise.all(catalog.translations.map(async (record) => {
          const data = await context.parseData(record);
          return {id:record.id,data,digest:context.generateDigest(data)};
        }));
        if (generation !== current) return;
        context.store.clear();
        for (const record of parsed) context.store.set(record);
      };
      await sync();
      if (context.watcher) {
        let pending = Promise.resolve();
        const reload = (path) => {
          const changed = path.replaceAll('\\', '/');
          if (changed === root || changed.startsWith(`${root}/`)) {
            pending = pending.then(sync,sync);
            void pending.catch((error) => context.logger.error(error.message));
          }
        };
        const events = ['add','change','unlink','addDir','unlinkDir'];
        for (const event of events) context.watcher.on(event,reload);
        context.watcher.add(root);
        stopWatching = () => {for (const event of events) context.watcher.off(event,reload);};
      }
    },
  };
}
