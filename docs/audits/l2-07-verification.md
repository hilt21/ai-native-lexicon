# L2-07 verification

Issue: #13. Parent: `4c0bd99a012f47470b80b1243ff7cc179a62169e` (L2-06).

## Requirement evidence

| Requirement | Actual result |
| --- | --- |
| Existing names, public URLs and order remain stable | Compared all 18 migrated YAML records with a captured copy of the original `categoryMeta`: names, slugs, codes, descriptions, questions and order match exactly. All 152 existing HTML routes remain. |
| One YAML configuration drives all consumers | The validated registry supplies Concept enum values, CLI input validation, generated JSON Schema, route generation, metadata lookup and ordered grids. No second handwritten enum/index remains. |
| Add an empty category using only YAML | The integration fixture adds `l2-expansion-domain.yml`, runs schema generation, check, tests and production-base build. The schema accepts the new name; the route and ordered grid links appear, the detail page displays `00 concepts`, and the dynamic domain count increases. |
| Add the first member without source edits | A new Concept YAML in that category passes check/build; its category page displays `01 concepts`, lists its detail URL, and the detail page links to the new category. Compared eight relevant source/config files before/after: unchanged. |
| Invalid configuration is diagnosed | Unit fixtures reject duplicate name/slug/order, bad slug, missing question, blank description and unknown metadata fields. A Concept with an unconfigured category fails CLI validation. |
| Correct display beyond nine categories | Grid numbering uses two-character minimum padding. Home/category fixtures assert actual ordered category links, dynamic counts and absence of `010`-style numbering. |
| Production base and drift checks | Fixture links use `/ai-native-lexicon/`; all prior category targets exist. `schema:check` and complete checks pass. |

## Commands and results

Executed 2026-10-06 with Node 24.19.0 in the isolated, unchanged-lockfile checkout:

- `npm run schema:generate`: succeeds; all three portable schema bytes remain unchanged because the existing names/order were preserved.
- `npm run check`: 0 errors, warnings or hints; 84 Concepts, 42 Primitives, 20 Cards.
- `npm test`: 52 passed.
- `npm run build`: 152 pages plus Pagefind at the production base.
- `npm run test:extension`: 10 passed, including empty-category publication and subsequent first-member addition.

The category-reader and YAML-to-page seams were implemented red before green. The fixture is discarded; formal Concept/Primitive/Card records were not changed.

## Build comparison and runtime choice

Compared the production build to the preserved pre-migration output: all 152 HTML routes remain; only home and category-index HTML change to correct counts/padding. Other HTML files and normalized dataset content are unchanged. No private build-directory path appears in published HTML, JS, JSON or text.

An initial prerender build failed because a bundled module's URL moved under `dist`. Astro's Vite configuration now pins the actual taxonomy root for prerendering. Native Node calls still resolve the canonical directory relative to the source module. This keeps the same YAML source and Node boundary while avoiding a copied taxonomy index.

Category slugs and names remain public identities; order only controls presentation. Layer configuration, Speaking Guide search/exports and the comprehensive extension runner remain later tickets. Delivery is a stacked PR over L2-06, pending merge under the agreed workflow.
