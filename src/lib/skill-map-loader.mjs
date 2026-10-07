import { readSkillMaps } from '../domain/content/read-skill-maps.mjs';
import { validateSkillMapSources } from '../domain/content/validate-skill-map-references.mjs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export function skillMapLoader(directory = new URL('../data/skill-maps/', import.meta.url)) {
  const root = resolve(directory instanceof URL ? fileURLToPath(directory) : directory).replaceAll('\\', '/');
  let stopWatching;
  let generation = 0;
  return {
    name: 'skill-maps-yaml-loader',
    async load(context) {
      stopWatching?.();
      const current = ++generation;
      const sync = async () => {
        const result = await readSkillMaps(directory);
        const errors = [...result.errors, ...validateSkillMapSources(result.records)];
        if (errors.length) throw new Error(errors.join('\n'));
        const parsed = await Promise.all(result.records.map(async (record) => {
          const data = await context.parseData(record);
          return { id: record.id, data, digest: context.generateDigest(data) };
        }));
        if (current !== generation) return;
        context.store.clear();
        for (const record of parsed) context.store.set(record);
      };
      await sync();
      if (context.watcher) {
        let pending = Promise.resolve();
        const reload = (path) => {
          const changed = path.replaceAll('\\', '/');
          if (changed === root || changed.startsWith(`${root}/`)) {
            pending = pending.then(sync, sync);
            void pending.catch((error) => context.logger.error(error.message));
          }
        };
        const events = ['add', 'change', 'unlink', 'addDir', 'unlinkDir'];
        for (const event of events) context.watcher.on(event, reload);
        context.watcher.add(root);
        stopWatching = () => { for (const event of events) context.watcher.off(event, reload); };
      }
    },
  };
}
