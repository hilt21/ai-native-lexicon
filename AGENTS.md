# Agent guidance

This repository is a data-first lexicon with three separate content types. Treat their source files as canonical and the catalog pages, search results, relationship lists, and exports as projections.

## Canonical data and relationships

- Concepts live in `src/data/concepts/*.yaml`; primitives live in `src/data/primitives/*.yaml`; Speaking Cards live in `src/data/speaking-cards/*.yaml`.
- Keep Concepts, Primitives, and Speaking Cards as separate data types. Do not copy concept definitions or primitive descriptions into cards.
- Preserve stable concept and primitive filename slugs and Speaking Card numbers/`#card-XX` anchors; they are public identifiers and relationship targets.
- Concept `related` values reference concepts; concept `primitives` values reference primitives. Primitive `related` values reference primitives. A primitive definition may reference a concept or provide a new inline definition; a referenced concept must link back to that primitive in its `primitives` array.
- Each Speaking Card's `concepts` and `primitives` arrays contain only supported, existing slugs and no duplicates. Empty arrays are valid when the card has no direct relationship. Do not add references just to increase coverage.
- Derive concept and primitive Speaking Card backlinks from the card references at build time; do not maintain a second manual backlink list.
- Internal links that navigate to another route must use `pathWithBase` from `src/lib/catalog.ts`, including cross-page links with card anchors, so GitHub Pages subpath deployments work. Same-page fragment links may use local anchors.
- Do not remove a concept or primitive without updating inbound relationships. Do not claim that a person or organization coined a term without a direct source.

## Schema and implementation

- Primitive layer configuration is canonical in `src/data/taxonomy/layers/`; preserve the explicit public `layer-*` anchors and existing name references. Empty layers are valid. Regenerate portable schemas after taxonomy edits.

- Category configuration is canonical in `src/data/taxonomy/categories/`. Add category metadata there, preserve names/public slugs and explicit order, then run `npm run schema:generate`. Empty configured categories are valid; see `CONTRIBUTING.md` for expansion steps.

- For concept fields, update `src/domain/content/concept-input.mjs` and regenerate the portable schema with `npm run schema:concept`; `src/lib/concept-schema.mjs` preserves Date output for existing Astro consumers. For primitive fields, update `src/domain/content/primitive-input.mjs` and regenerate with `npm run schema:primitive`; `src/lib/primitive-schema.mjs` preserves Date output. Keep portable schemas, cross-record validators, tests, and content documentation synchronized. Speaking Guide fields live in `src/domain/content/speaking-card-input.mjs`; cross-record checks live in `src/domain/content/validate-references.mjs`. Run `npm run schema:generate` after field changes; `npm run schema:check` detects drift without writing files.
- Keep the runtime thin: do not add a database, client framework, or generator unless the existing content collections cannot satisfy a demonstrated requirement.
- Do not duplicate canonical records into Markdown pages or handwritten indexes. Pages and machine-readable endpoints should query the existing content collections and card data.
- Keep changes surgical and follow the established visual and content style.

## Verification

Run the full repository checks after data, schema, validation, route, component, configuration, or styling changes:

```sh
npm run check
npm test
npm run build
```

`npm run check` runs read-only portable-schema drift detection, Astro checks and catalog reference validation. `npm test` runs data-integrity and UI-regression tests. The GitHub Actions workflow runs all three before deployment.

## Architecture direction

Concept pages, primitive pages, category indexes, search, Speaking Card links, `/dataset.json`, and `/llms.txt` are projections of the canonical data. Preserve the separate responsibilities and stable slugs when adding a projection; do not introduce a second source of truth or a graph database.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues for `hilt21/ai-native-lexicon`.
See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels.
See `docs/agents/triage-labels.md`.

### Domain docs

Use a single-context layout: root `GLOSSARY.md` and `docs/adr/`.
See `docs/agents/domain.md`.
