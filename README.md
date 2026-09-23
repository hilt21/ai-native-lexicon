# AI Native Lexicon

> An open lexicon of concepts, patterns and mental models shaping AI-native software engineering.

AI Native Lexicon is a data-first glossary for the language emerging around context, agents, harnesses, governance, execution, knowledge, experience, and organizational design. The catalog contains 84 concepts with English definitions and Chinese names across 18 categories, 42 composable primitive entries, linked relationships, local search, machine-readable exports, and a GitHub Pages workflow.

## What is included

- Astro + Starlight static site with an editorial visual system
- one validated YAML record per concept or primitive; existing definitions are referenced, not copied
- home, A–Z index, category indexes, concept pages, a primitive index with anchor links, and related concepts
- built-in catalog search, plus Pagefind-powered site search on GitHub Pages
- `/dataset.json` and `/llms.txt` machine-readable projections
- schema, relationship, type, test, and production-build checks
- automatic GitHub Pages deployment from `master`

## Run locally

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

The local site opens at `http://localhost:4321/`. Before proposing a change, run:

```sh
npm run check
npm test
npm run build
```

## Repository structure

```text
src/data/concepts/       canonical YAML concept records
src/data/primitives/     primitive descriptions and references to concept definitions
src/content.config.ts    runtime Zod schema used by Astro
schemas/                 portable JSON Schema for editors and tools
src/pages/               generated site routes and data endpoints
src/components/          small presentation components
src/lib/catalog.ts       catalog queries and category metadata
scripts/                 cross-record relationship validation
tests/                   dataset integrity tests
.github/workflows/       validation and Pages deployment
```

The architecture deliberately keeps the publishing layer thin:

```text
validated YAML → content collections → web pages / categories / primitives / JSON / llms.txt
```

Future Concept Graph and Timeline views should consume the same collection rather than introduce a second content store.

## Add a concept

Copy an existing file in `src/data/concepts/`, rename it with a kebab-case slug, and complete every required field. `related` values are concept slugs and must resolve to existing records. `primitives` contains zero or more primitive slugs; legacy `tags` are no longer supported. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the editorial and review criteria.

## Add a primitive

Create a stable kebab-case YAML file in `src/data/primitives/` following [the primitive content guide](./docs/primitives.md). Records include definitions, scope, composition examples, considerations, distinctions, scoped priorities, ownership, and source status. The page and reverse concept links are generated from the collections.

## Deploy to GitHub Pages

1. Create a GitHub repository named `ai-native-lexicon` and push this project to `master`.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. The `Validate and deploy` workflow validates, tests, builds, and publishes the site.

The workflow derives the owner, repository name, canonical URL, base path, GitHub link, and edit links from the GitHub environment. For a custom domain, set `SITE_URL` and `BASE_PATH=/` in the workflow or repository environment.

## Data API

- `dataset.json` version `0.2.0` contains `concepts` and `primitives`. Concept `tags` are replaced by `primitives` references; primitive `definitions` either reference a concept by slug or contain a new inline definition.
- `llms.txt` provides a compact discovery document for language models and retrieval tools.

The records are intentionally ready for graph and timeline projections: stable slugs identify nodes, `related` defines edges, and `added` provides an initial temporal field.

## License

Source code is available under the MIT License. Lexicon content and dataset records are available under [CC BY 4.0](./LICENSE-CONTENT.md).
