# Editorial field guide design system

Preserve the paper/ink/acid-green identity while making the lexicon easy to scan and read. This document describes current display and interaction contracts; verification reports in `docs/audits/` describe particular runs.

## Sources of truth

- [Brand visual language](brand/visual-language.md) owns the identity, color, graphic, pattern, icon and branded-application rules derived from the owner-provided v1.0 boards. Read it before changing brand expression; the contracts below describe the current implementation.
- `src/styles/tokens.css` owns semantic theme, typography, spacing, reading-width, control, focus and motion tokens, including the Starlight palette mapping.
- `src/styles/custom.css` owns shared layouts. Component-scoped styles handle local structure using the same tokens.
- Canonical YAML supplies content and taxonomy; [the content boundary](../../src/domain/content/README.md) supplies validated inputs. [Translation overlays](translation-overlay.md) supply reviewed display prose separately.

Use semantic tokens rather than a competing local scale. Preserve native Starlight navigation, theme controls, focus, skip links and reduced-motion behavior.

## Shared components

| Component | Consumers | Contract |
| --- | --- | --- |
| `CatalogRow` | Knowledge, resource and search directories | One primary record link, explicit text languages, visible summary and optional marker/ordinal. |
| `ConceptRow`, `PrimitiveRow` | Knowledge directories | Receive localized records; retain English terms, existing Chinese names and actual summary language. |
| `ConceptList` | Home, all concepts, category details | Preserve caller ordering and filtering; optional category markers. |
| `CategoryGrid` | Home, categories | Preserve taxonomy order, derive member counts, resolve label/description languages; h3 below Home's h2, h2 on the category index. |
| `RelatedConcepts` | Concept details | Resolve linked summaries from the same localized catalog; preserve target identities. |
| `CopyDefinition`, `RecordNavigation` | Concept/Primitive details | Copy the rendered definition body with named actions and success/failure feedback; canonical English A–Z neighbors stay within the same type. |
| `TranslationCoverage`, `LocalizedPage` | Localized reading views | Expose missing/draft/stale fallback and resource edition boundaries; use shared publication eligibility. |
| `LanguageSelect` | Header, mobile splash Home | Reuse native Select; preserve query parameters and only valid destination fragments. Home exposes native theme/language controls below 50rem because splash has no sidebar menu. |
| `SkipLink` | Starlight shell | Splash pages focus visible content; ordinary pages keep the native inner-page target. |

Catalog rows switch at a 40rem container width and Primitive rows at 44rem, adapting to sidebar-constrained desktop space. Page layouts switch at 50rem; category grids also use 72rem and 30rem boundaries. Keep summaries visible at narrow widths. CSS media/container query boundaries remain literal values.

## Layout and reading

Home presents navigation and the primary browse action, then featured concepts, category orientation and canonical-data projections. Feature selection belongs to the view; record bodies and taxonomy enums come from YAML. Counts reflect the current catalog. The dataset action always targets the canonical root endpoint, including from Chinese Home.

The native Header uses the standard AI Lexicon wordmark while preserving AI Native Lexicon as its accessible product identity. The local Home experiment uses the [v2 Light mascot](brand/hero-artwork/v2/README.md) and [v3 Dark blended variant](brand/hero-artwork/v3/README.md) at 330px on wide desktop and 220-240px after the primary action on mobile; a four-task entry section remains before featured concepts. `HeroArtwork` reserves the asset aspect ratio and selects theme/DPR WebP through CSS `image-set` and the native `[data-theme]` state, without a second theme controller. Original-pixel v1 assets remain for existing media projections. Resource icons share the existing six record kinds across directories, title areas and catalog search; labels and independent record states remain visible.

Concept detail pages present the working definition, purpose/use/anti-pattern, optional ordered examples and distinctions, sources and relationships. Examples remain editorial illustrations. Distinctions link existing Concept targets. Primitive details resolve referenced Concept definitions without copying their prose into Primitive records. Sources project their canonical arrays; Copy preserves the displayed language and body.

Single-paragraph map leads use `.map-summary`; `.page-intro` retains its two-child layout. Scope UI grid margin resets to direct children so ordinary Markdown spacing survives. Use `--lex-control-border` for interactive filter borders and `--lex-line` for decorative separators. Shared buttons retain readable labels, visible focus and pressed states.

## Search and map interaction

Catalog field search counts unique records across six kinds, explains matching fields and preserves q/type state on initial render, edits, Clear, history and reload. The full matching/ranking contract is in [exports](../exports.md#catalog-field-search). Header Pagefind searches rendered pages/fragments, preserving native Cmd/Ctrl+K and ordinary punctuation input. Use native search controls rather than a global typing shortcut.

Skill Map directory controls own the displayed rows, count and empty state, including history restoration. Structure preserves taxonomy order, complete active membership counts and bounded examples of actual directed active-node relations. Journey order expresses guidance. Read [the map contract](skill-map.md) before changing those projections.

## Language and publication

Shared views in `src/views/` render English root and Chinese `zh-cn` routes after the deployment base. Use the same resolver for prose, reused summaries, search excerpts and Copy; annotate the smallest actual-language span. UI translations are separate from knowledge overlays. Application Resource bodies retain their source editions in Chinese chrome.

Keep native Head and locale configuration. HTML canonical/noindex/alternate policy and sitemap eligibility follow [the overlay contract](translation-overlay.md#routes-and-publication), including untranslated documentation fallbacks. Reader availability and Pagefind indexing are independent of crawler eligibility.

Default OG images and Speaking Guide share images are build-time projections. Each guide has two downloadable image formats and an English static sharing page; these links are canonical root assets/projections even in Chinese chrome. Original card anchors remain reading identities. Share pages point canonical to the original guide directory, retain a distinct OG URL/image, and are excluded from sitemap/Pagefind. They reuse semantic tokens and the native theme provider. Image generation reads validated canonical records, uses the bundled licensed font and publishes a complete replacement only after rendering succeeds; see [BRAND-01](https://github.com/hilt21/ai-native-lexicon/issues/44).

## Verification

Follow [repository verification](../../CONTRIBUTING.md#validation). Inspect changed pages in both themes at narrow/wide widths, keyboard focus and computed contrast, plus real BFCache/reload restoration when state changes. A static assertion or historical screenshot does not establish current rendered behavior. Keep unavailable screen-reader and actual 400% zoom checks explicitly unverified.
