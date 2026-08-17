import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'ai-native-lexicon';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? 'example';
const hasRepository = Boolean(process.env.GITHUB_REPOSITORY);
const repositoryUrl = `https://github.com/${owner}/${repository}`;
const isPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const usePagefind = isPagesBuild && process.env.SKIP_PAGEFIND !== 'true';

export default defineConfig({
  site: process.env.SITE_URL ?? `https://${owner}.github.io`,
  base: process.env.BASE_PATH ?? (isPagesBuild ? `/${repository}` : '/'),
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'AI Native Lexicon',
      description:
        'An open lexicon of concepts, patterns and mental models shaping AI-native software engineering.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      social: hasRepository ? [{ icon: 'github', label: 'GitHub', href: repositoryUrl }] : [],
      ...(hasRepository ? { editLink: { baseUrl: `${repositoryUrl}/edit/main/` } } : {}),
      pagefind: usePagefind,
      disable404Route: true,
      sidebar: [
        { label: 'Start', items: [{ label: 'Home', link: '/' }, { label: 'All concepts', link: '/concepts/' }, { label: 'Search', link: '/search/' }] },
        { label: 'Explore', items: [{ label: 'Categories', link: '/categories/' }, { label: 'About the lexicon', link: '/about/' }] },
      ],
    }),
  ],
});
