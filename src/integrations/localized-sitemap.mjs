import sitemap from '@astrojs/sitemap';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

/** Native sitemap consumes the HTML policy already emitted by route middleware. */
export function localizedSitemap() {
  let base = '', siteOrigin, outputDirectory, serializationError;
  const integration = sitemap({
    async serialize(item) {
      try {
        const url = new URL(item.url);
        if (url.origin !== siteOrigin || (base && url.pathname !== base && !url.pathname.startsWith(`${base}/`))) throw new Error(`Sitemap URL outside configured site/base: ${item.url}`);
        const relative = decodeURIComponent(url.pathname.slice(base.length)) || '/';
        // Machine endpoints have no HTML publication policy or locale counterparts.
        const extension = extname(relative.replace(/\/$/, ''));
        if (extension && extension !== '.html') return undefined;
        const file = resolve(outputDirectory, `.${relative}`, relative.endsWith('/') ? 'index.html' : '');
        if (!file.startsWith(`${outputDirectory}${sep}`)) throw new Error(`Sitemap path outside build output: ${item.url}`);
        const document = parse(await readFile(file, 'utf8'));
        const html = document.childNodes.find((node) => node.tagName === 'html');
        const head = html?.childNodes.find((node) => node.tagName === 'head');
        if (!head) throw new Error(`Sitemap HTML has no head: ${item.url}`);
        const canonical = [], robots = [], alternates = [];
        for (const node of head.childNodes) {
          const attrs = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
          if (node.tagName === 'link' && attrs.rel === 'canonical') canonical.push(attrs.href);
          if (node.tagName === 'meta' && attrs.name?.toLowerCase() === 'robots') robots.push(attrs.content ?? '');
          if (node.tagName === 'link' && attrs.rel === 'alternate' && attrs.hreflang) alternates.push({ lang: attrs.hreflang, url: new URL(attrs.href).href });
        }
        if (canonical.length !== 1) throw new Error(`Sitemap requires one HTML canonical: ${item.url}`);
        const canonicalUrl = new URL(canonical[0]).href;
        if (robots.some((value) => value.toLowerCase().split(/[\s,]+/).includes('noindex')) || canonicalUrl !== url.href) return undefined;
        const languages = new Map();
        for (const link of alternates) {
          if (languages.has(link.lang) && languages.get(link.lang) !== link.url) throw new Error(`Conflicting HTML hreflang ${link.lang}: ${item.url}`);
          languages.set(link.lang, link.url);
        }
        return { ...item, links: [...languages].map(([lang, url]) => ({ lang, url })) };
      } catch (error) {
        serializationError ??= error;
        throw error;
      }
    },
  });
  const configDone = integration.hooks['astro:config:done'];
  const buildDone = integration.hooks['astro:build:done'];
  integration.hooks['astro:config:done'] = async (context) => {
    base = context.config.base.replace(/\/$/, '');
    siteOrigin = context.config.site ? new URL(context.config.site).origin : undefined;
    await configDone?.(context);
  };
  integration.hooks['astro:build:done'] = async (context) => {
    outputDirectory = fileURLToPath(context.dir).replace(/[\\/]$/, '');
    serializationError = undefined;
    await buildDone?.(context);
    // Native sitemap 3.7.3 logs serializer failures and returns; publication must fail.
    if (serializationError) throw serializationError;
  };
  return integration;
}
