# Agent guidance

This repository is a data-first lexicon. Concepts and Primitives are knowledge records; Speaking Guide and Skill Map are independently curated Application Resources. Speaking Cards and Skill Map pages are Content Projections. Keep each type's source files and contract separate; derive pages, search results, relationship lists, and exports from canonical data. See [ADR-0006](docs/adr/0006-application-resources-and-projections.md) for this boundary.

## Canonical data and relationships

- Concepts live in `src/data/concepts/*.yaml`; primitives live in `src/data/primitives/*.yaml`; Speaking Cards live in `src/data/speaking-cards/*.yaml`.
- Keep Concepts, Primitives, and Speaking Cards as separate data types. Do not copy concept definitions or primitive descriptions into cards.
- Preserve stable concept and primitive filename slugs and Speaking Card numbers/`#card-XX` anchors; they are public identifiers and relationship targets.
- Concept `related` values reference concepts; concept `primitives` values reference primitives. Primitive `related` values reference primitives. A primitive definition may reference a concept or provide a new inline definition; a referenced concept must link back to that primitive in its `primitives` array.
- Each Speaking Card's `concepts` and `primitives` arrays contain only supported, existing slugs and no duplicates. Empty arrays are valid when the card has no direct relationship. Do not add references just to increase coverage.
- Derive concept and primitive Speaking Card backlinks from the card references at build time; do not maintain a second manual backlink list.
- Internal links that navigate to another route must use `pathWithBase` from `src/lib/catalog.ts`, including cross-page links with card anchors, so GitHub Pages subpath deployments work. Same-page fragment links may use local anchors.
- Do not remove a concept or primitive without updating inbound relationships. Do not claim that a person or organization coined a term without a direct source.

## Skill Maps

When adding or updating a map, use the [Skill Maps contribution guide](CONTRIBUTING.md#skill-maps) for the editing workflow and [field contract](docs/design/skill-map.md) for fields and UI behavior. Each map, including pstack and mattpocock, owns its taxonomy and inventory. Read current scope and source editions from its canonical records.

- Canonical records live in `src/data/skill-maps/<map-id>/map.yaml`, `relations.yaml`, `nodes/*.{yaml,yml}` and `journeys/*.{yaml,yml}`. Map directory names and node/journey filename slugs are stable public identities scoped to their map; title changes do not rename IDs.
- Define types, optional layers/clusters and relationship labels in each map's `taxonomy`. New maps are discovered automatically; do not add ecosystem-specific routes, handwritten indexes or conditional branches. Empty collections/layers and nodes without a layer are valid.
- Maintain node relationships only in `relations.yaml`; derive incoming/outgoing lists from it. Handoffs are explanatory text. Task Journeys express guidance and conditions, not executable workflows or authority. Internal references must resolve within the map; relationship cycles are valid.
- Pin verified source commits before publication and distinguish official descriptions from editorial interpretations. For a new upstream revision, add a source snapshot ID and update `current_sources`; preserve existing snapshot targets and sources referenced by retained records. Compare previous/current assembled records with `validateSkillMapSnapshotChanges` during update review, because a single parse cannot prove historical immutability. Pending sources are development inputs rejected by publication checks. Preserve applicable upstream license notices.
- For Matt Pocock inventory, distribution or invocation changes, read [the source audit](docs/audits/skill-map-mp-01.md) before reviewing the new pinned snapshot. Keep upstream inventory, plugin-distributed skills and locally installed skills distinct. Map prose is reference content; user-invoked skills require the user's invocation.
- For multilingual Map, Node or Journey prose, follow the [text-language contract](docs/design/skill-map.md#text-language-annotations-map-input-110). Maintain explicit `text_languages` paths with their strings when arrays move, respect the owning map edition, and apply each hint to the smallest text element wherever reused.
- Retire removed nodes/journeys with `status: retired` and `retirement_note` so detail URLs, evidence and exports survive. A node's optional `replaced_by` must target another active node; active journeys cannot recommend retired nodes.
- Concept/Primitive/Speaking Guide mappings are a future contract. Do not add `knowledge_refs` or manual backlinks before their schema, reference validation and projections are explicitly activated; do not copy knowledge definitions into map records.

## Schema and implementation

- Primitive layer configuration is canonical in `src/data/taxonomy/layers/`; preserve the explicit public `layer-*` anchors and existing name references. Empty layers are valid. Regenerate portable schemas after taxonomy edits.

- Category configuration is canonical in `src/data/taxonomy/categories/`. Add category metadata there, preserve names/public slugs and explicit order, then run `npm run schema:generate`. Empty configured categories are valid; see `CONTRIBUTING.md` for expansion steps.

- For concept fields, update `src/domain/content/concept-input.mjs` and regenerate the portable schema with `npm run schema:concept`; `src/lib/concept-schema.mjs` preserves Date output for existing Astro consumers. For primitive fields, update `src/domain/content/primitive-input.mjs` and regenerate with `npm run schema:primitive`; `src/lib/primitive-schema.mjs` preserves Date output. Keep portable schemas, cross-record validators, tests, and content documentation synchronized. Speaking Guide fields live in `src/domain/content/speaking-card-input.mjs`; cross-record checks live in `src/domain/content/validate-references.mjs`. Run `npm run schema:generate` after field changes; `npm run schema:check` detects drift without writing files.
- Skill Map fields live in `src/domain/content/skill-map-input.mjs`; fixed-directory assembly lives in `read-skill-maps.mjs` and internal/source checks in `validate-skill-map-references.mjs` in the same directory. CLI and Astro share this reader; pages query the `skillMaps` collection via `src/lib/skill-maps.ts`. Keep input rules, all four portable Skill Map schemas, validators and documentation synchronized; regenerate with `npm run schema:generate` after field changes.
- Keep the runtime thin: do not add a database, client framework, or generator unless the existing content collections cannot satisfy a demonstrated requirement.
- Do not duplicate canonical records into Markdown pages or handwritten indexes. Pages and machine-readable endpoints should query the existing content collections.

## Web design and interaction

Before changing page layout, styling or interaction, read the [editorial design system](docs/design/redesign-system.md) and inspect the current components. Historical audit results describe earlier implementations, not current behavior.

- Reuse semantic tokens in `src/styles/tokens.css` and shared layouts in `src/styles/custom.css`; preserve the paper/ink/acid-green identity and Starlight navigation, theme, focus, skip links and reduced-motion behavior.
- Single-paragraph map leads use `.map-summary`; `.page-intro` retains its two-child layout. Scope UI grid margin resets to direct children so ordinary Markdown spacing survives.
- Directory controls are authoritative state: keep rows, count and empty state synchronized on initial render, edits, Clear and history restoration. Structure shows bounded examples with complete membership counts and actual directed active-node relations.
- Keep catalog field search and header Pagefind scopes explicit. Preserve Starlight's dialog shortcuts and normal punctuation input; project Concept Sources from their canonical array.

## Verification

Run the full repository checks after data, schema, validation, route, component, configuration, or styling changes:

```sh
npm run check
npm test
npm run build
```

For data, taxonomy or Skill Map changes, also run `npm run test:extension`. For collection, identity or projection changes, run `npm run test:l2`; see [L2 acceptance](CONTRIBUTING.md#repeatable-l2-expansion-acceptance) for the production-subpath scenario.

For layout, styling, search, map interaction or language projection changes, run `npm run test:browser` against the production subpath with Pagefind enabled. Inspect changed-page screenshots in both themes and at narrow/wide widths; check keyboard focus, computed contrast and actual BFCache/reload restoration. Source assertions alone do not establish rendered behavior. Record unavailable screen-reader or zoom checks as unverified; 320px reflow does not substitute for 400% zoom.

Documentation-only edits require checking referenced paths, commands and consistency with the implementation; they do not require a site rebuild. Derive record counts and versions from data/configuration rather than historical audit totals.

## Architecture direction

Concept pages, primitive pages, category indexes, search, Speaking Card links, Skill Map pages, `/dataset.json`, and `/llms.txt` are projections of the canonical data. Preserve the separate responsibilities and stable slugs when adding a projection; do not introduce a second source of truth or a graph database. Skill Map route links may use `mapLink` from `src/lib/skill-maps.ts`, which applies `pathWithBase`.

When changing search or machine exports, consult [the export contract](docs/exports.md). Keep `skill_maps` separate from existing dataset arrays, change `schema_version` deliberately for export-shape changes, and preserve deterministic normalization in `src/domain/content/skill-map-export.mjs`; ordered journey steps and taxonomy differ from unordered relation/reference sets.

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
