import { getCollection } from 'astro:content';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { localePath, rootPath, routeLocale } from './lib/locale';
import { pathWithBase } from './lib/catalog';
export const onRequest = defineRouteMiddleware(async (context, next) => {
  await next();
  const route = context.locals.starlightRoute;
  const locale = routeLocale(context.url);
  const policy = context.locals.lexiconPage;
  const root = policy?.rootPath ?? rootPath(context.url);
  const docs = policy ? [] : await getCollection('docs');
  const docId = root.replace(/^\/|\/$/g, '');
  const chineseIndexable = policy?.chineseIndexable ?? docs.some((entry) => entry.id === `zh-cn/${docId}`);
  const english = new URL(localePath(root, 'en'), context.site ?? context.url).href;
  const chinese = new URL(localePath(root, 'zh-CN'), context.site ?? context.url).href;
  const canonical = locale === 'zh-CN' && chineseIndexable ? chinese : english;
  route.head = route.head.filter((entry) => !(entry.tag === 'link' && (entry.attrs?.rel === 'canonical' || entry.attrs?.hreflang)) && !(entry.tag === 'meta' && (entry.attrs?.name === 'robots' || entry.attrs?.property === 'og:url')));
  route.head.push({ tag: 'link', attrs: { rel: 'canonical', href: canonical } }, { tag: 'meta', attrs: { property: 'og:url', content: canonical } }, { tag: 'link', attrs: { rel: 'alternate', hreflang: 'en', href: english } }, { tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: english } });
  if (chineseIndexable) route.head.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: 'zh-CN', href: chinese } });
  if (locale === 'zh-CN' && !chineseIndexable) route.head.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex,follow' } });
  route.head = route.head.filter((entry) => !['og:image', 'og:image:width', 'og:image:height', 'og:image:alt'].includes(entry.attrs?.property as string) && !['twitter:card', 'twitter:image', 'twitter:image:alt'].includes(entry.attrs?.name as string));
  const image = new URL(pathWithBase('/brand/social/default.png'), context.site ?? context.url).href;
  route.head.push(
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: 'AI Native Lexicon — a field guide to AI-native systems.' } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'AI Native Lexicon — a field guide to AI-native systems.' } },
  );
});
