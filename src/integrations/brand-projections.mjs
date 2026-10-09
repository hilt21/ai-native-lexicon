import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCatalog, validateCatalog } from '../domain/content/catalog.mjs';
import { renderBrandShareImages } from '../lib/brand-share-images.mjs';

export function brandProjections() {
  let site, base;
  const render = async (outputDirectory) => {
    const catalog = await readCatalog();
    const validation = validateCatalog(catalog);
    if (validation.errors.length) throw new Error(`Cannot publish brand images: ${validation.errors.join('; ')}`);
    return renderBrandShareImages({ guides: catalog.speakingCards.map((record) => record.data), outputDirectory, site, base });
  };
  return {
    name: 'lexicon-brand-projections',
    hooks: {
      'astro:config:done': ({ config }) => { site = config.site; base = config.base; },
      'astro:build:done': async ({ dir }) => { await render(join(fileURLToPath(dir), 'brand/social')); },
      'astro:server:setup': async () => { await render(fileURLToPath(new URL('../../public/brand/social/', import.meta.url))); },
    },
  };
}
