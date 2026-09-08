# Editorial field guide design system

Approved direction: preserve the paper/ink/acid-green identity and existing information architecture while making the lexicon easier to scan and read. This document describes the implemented primitives, not a new feature roadmap.

## Sources of truth

- `src/styles/tokens.css`: theme colors, typography scale, spacing, reading width, control size, focus color, motion duration and action shadow. Starlight variables map into this palette.
- `src/styles/custom.css`: shared display rules and responsive layouts. No page imports its own competing stylesheet.
- `src/data/concepts/*.yaml`: unchanged canonical content.

Use semantic tokens (`--lex-text-small`, `--lex-space-6`, `--lex-muted`) instead of introducing a new local scale. Preserve the existing Starlight navigation and theme controls.

## Reusable primitives

| Primitive | Consumers | Contract |
| --- | --- | --- |
| `ConceptRow` | `ConceptList`, Search | One link per record. `number` supplies an optional ordinal; `showCategory` controls category display; `searchText` passes the existing search index through unchanged. Mobile keeps the summary. |
| `ConceptList` | Home, all concepts, category details | Iterates records without changing their ordering or filtering. |
| `CategoryGrid` | Home, categories | `headingLevel` defaults to h3 below the homepage h2, and uses h2 on the category index. |
| `RelatedConcepts` | Concept details | Existing relationship links, shared typography, border and spacing tokens. |
| `.button-primary`, `.button-dark`, `.text-link` | Home, 404 | Shared size, type, focus and pressed states. |
| `.page-intro`, `.category-masthead`, `.definition-grid` | Listing and reading pages | Shared lead text, reading measure and spacing. |
| `.search-input-wrap` | Search | Existing label, native search input, visible focus-within and live count. |
| `SkipLink` | Starlight shell | Keeps the default inner-page link; splash pages target their visible focusable content instead of the hidden generated title. |

Rows switch at a **40rem container width**, so they also adapt when a desktop sidebar reduces the available space. Overall page layouts switch at 50rem, category grids at 72rem and 30rem. Breakpoints are CSS query boundaries; CSS variables cannot be used directly in these conditions.

## Migration and verification — 2026-09-08

| Page group | Reused system | Desktop/mobile checks |
| --- | --- | --- |
| Home | Globalized approved tokens, buttons, grid and rows | Preserved content, sections, navigation and responsive summaries; splash skip link focuses visible content. |
| All concepts | `ConceptList` → `ConceptRow` | 30 entries; summaries remain visible; no overflow. |
| Category index | `CategoryGrid` | Eight categories; h1 → h2 hierarchy; no overflow. |
| Category details | `ConceptList` without category column | Correct summary placement on desktop; stacked mobile layout. Representative route: `/categories/context/`. |
| Search | `ConceptRow` | Slash shortcut, `context engineering` returns one result, unmatched query returns zero and exposes empty state; clearing restores all records. |
| Concept details | Reading tokens, practice grid, `RelatedConcepts` | Definition and practice content remain readable; related links retained. Representative route: `/concepts/context-engineering/`. |
| About | Shared reading measure and Starlight heading-wrapper styling | Desktop table of contents and mobile layout retained. |
| 404 | Shared display type and button | Return-home link and visible splash skip target retained. |

Browser validation used actual Astro pages from a clean dependency installation, not the earlier static mock preview. Eight representative routes were checked at 390, 768, 1024 and 1440 CSS pixels in light mode, and 390/1440 in dark mode (48 combinations). All had one visible h1, one main landmark, no unnamed visible links, no document overflow, and no hidden concept summaries. Screenshots were inspected for each page group on desktop and mobile.

Accessibility checks included search labels/live count, keyboard search shortcut, visible focus, both splash skip targets, category heading hierarchy and reduced-motion emulation. Reduced motion produced no hero animation, zero-duration transitions and automatic scrolling. Measured token contrast ratios:

| Pair | Light | Dark |
| --- | --- | --- |
| Primary text / canvas | 15.52:1 | 15.68:1 |
| Secondary text / canvas | 5.40:1 | 8.31:1 |
| Focus / canvas | 5.89:1 | 15.32:1 |
| Button text / acid fill | 15.02:1 | 15.02:1 |

These checks are not a full screen-reader or WCAG certification. Dynamic concept/category routes share verified templates; every individual record was validated by the content tests and static build.

## CSS retirement

- Removed `home.css` only after removing its sole import and promoting its approved styles.
- Removed the old search-result presentation after Search switched to `ConceptRow`; retained the `[hidden]` rule used by filtering.
- Removed the previous viewport rules that hid summaries and the legacy fixed-minimum row columns after container-based layouts were verified.
- Removed duplicate declarations only where a later unconditional rule for the same selector/property superseded them. Kept shell, print and navigation styles supplied by Starlight.
- No changes to concept schema, content records, search matching, exports or routes. The prior dataset differs only by its generated timestamp; `llms.txt` is byte-identical.

Final verification: `npm run check`, `npm test` (6 tests), `npm run build` (44 pages), and `git diff --check` passed. After reinstalling from the unchanged lockfile, the original workspace also completed the full check/test/build chain. Its live Astro preview is available at `http://127.0.0.1:4324/`; the earlier port 4321 visual mock should no longer be used.
