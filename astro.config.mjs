import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { fileURLToPath } from 'node:url';
import { contentBranch } from './src/lib/repository.mjs';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ai-native-lexicon';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? 'example';
const hasRepository = Boolean(process.env.GITHUB_REPOSITORY);
const repositoryUrl = `https://github.com/${owner}/${repository}`;
const isPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const usePagefind = isPagesBuild && process.env.SKIP_PAGEFIND !== 'true';

export default defineConfig({
  cacheDir: './.astro/cache',
  vite: {
    define: {
      'import.meta.env.LEXICON_TAXONOMY_ROOT': JSON.stringify(fileURLToPath(new URL('./src/data/taxonomy/', import.meta.url))),
    },
  },
  site: process.env.SITE_URL ?? `https://${owner}.github.io`,
  base: process.env.BASE_PATH ?? (isPagesBuild ? `/${repository}` : '/'),
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'AI Native Lexicon',
      defaultLocale: 'root',
      locales: { root: { label: 'English', lang: 'en' }, 'zh-cn': { label: '简体中文', lang: 'zh-CN' } },
      routeMiddleware: './src/routeData.ts',
      description:
        'An open lexicon of concepts, patterns and mental models shaping AI-native software engineering.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      components: { SkipLink: './src/components/SkipLink.astro', PageTitle: './src/components/PageTitle.astro', LanguageSelect: './src/components/LanguageSelect.astro' },
      social: hasRepository ? [{ icon: 'github', label: 'GitHub', href: repositoryUrl }] : [],
      ...(hasRepository ? { editLink: { baseUrl: `${repositoryUrl}/edit/${contentBranch}/` } } : {}),
      pagefind: usePagefind,
      disable404Route: true,
      sidebar: [
        { label: 'Start', translations: { 'zh-CN': '开始' }, items: [{ label: 'Home', translations: { 'zh-CN': '首页' }, link: '/' }, { label: 'All concepts', translations: { 'zh-CN': '全部概念' }, link: '/concepts/' }, { label: 'Search', translations: { 'zh-CN': '搜索' }, link: '/search/' }] },
        { label: 'Explore', translations: { 'zh-CN': '探索' }, items: [{ label: 'Categories', translations: { 'zh-CN': '分类' }, link: '/categories/' }, { label: 'Primitives', translations: { 'zh-CN': '原语' }, link: '/primitives/' }, { label: 'About the lexicon', translations: { 'zh-CN': '关于词库' }, link: '/about/' }] },
        { label: 'Applications', translations: { 'zh-CN': '应用资源' }, items: [{ label: 'Speaking Cards', translations: { 'zh-CN': '讲解卡' }, link: '/speaking-card/' }, { label: 'Skill Maps', translations: { 'zh-CN': '技能地图' }, link: '/skill-maps/' }] },
      ],
    }),
  ],
});
