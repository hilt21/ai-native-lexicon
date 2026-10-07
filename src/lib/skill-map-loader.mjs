import { readSkillMaps } from '../domain/content/read-skill-maps.mjs';
import { validateSkillMapSources } from '../domain/content/validate-skill-map-references.mjs';

export function skillMapLoader() {
  return {
    name: 'skill-maps-yaml-loader',
    async load(context) {
      const sync = async () => {
        const result = await readSkillMaps();
        const errors = [...result.errors, ...validateSkillMapSources(result.records)];
        if (errors.length) throw new Error(errors.join('\n'));
        context.store.clear();
        for (const record of result.records) {
          const data = await context.parseData(record);
          context.store.set({ id: record.id, data, digest: context.generateDigest(data) });
        }
      };
      await sync();
      if (context.watcher) {
        context.watcher.add('src/data/skill-maps');
        const reload = (path) => {
          if (path.replaceAll('\\', '/').includes('/skill-maps/')) {
            void sync().catch((error) => context.logger.error(error.message));
          }
        };
        context.watcher.on('add', reload).on('change', reload).on('unlink', reload);
      }
    },
  };
}
