# Translation overlay contract

English Concept and Primitive prose is the semantic baseline. A translation overlay is an independently edited translation asset; its resolved display record is a Content Projection. Translations do not alter canonical knowledge, identities, relationships or evidence verification. Speaking Guide and Skill Map editions retain their existing prose and language annotations.

## Input

Independent `.yaml` and `.yml` files below `src/data/translations/` are discovered recursively. File names and folders organize editing; identity comes from the unique `(locale, kind, target_id)` tuple. The strict input schema is version `1.0.0`, generated as `schemas/translation.schema.json`.

```yaml
schema_version: 1.0.0
locale: zh-CN
kind: concept
target_id: context
units: []
```

`kind` is `concept`, `primitive`, `category` or `layer`. Concept and Primitive targets use their stable filename slugs; category targets use their public `slug`; layer targets use their public `anchor`. Only `zh-CN` is accepted. Empty or omitted `units` is valid.

Each supplied unit has a unique `path`, nonblank `translation`, `source_fingerprint`, `review_status` and, for reviewed units, `reviewed_at`:

- `translation` is a string for a scalar path or a nonempty ordered array of nonblank strings for a vector path. Chinese prose does not inherit English character minima.
- `source_fingerprint` has the form `sha256:` followed by 64 lowercase hexadecimal characters. Obtain it from the public `translationUnits(kind, target_id, canonicalData)` descriptors; do not invent a digest or overwrite one without reviewing its changed source.
- `review_status` is `draft` or `reviewed`. `reviewed` requires a real calendar date in `YYYY-MM-DD` format. A draft may carry an optional date in the same format.
- Unknown keys, duplicate YAML keys, duplicate identities, duplicate unit paths, malformed dates/digests, unsupported targets/paths and scalar/vector mismatches are errors. Portable Schema verifies input shape; complete catalog validation additionally verifies identities, allowed paths and current vector cardinality.

## Registered paths

| Kind | Scalar paths | Ordered string-vector paths |
| --- | --- | --- |
| Concept | `summary`, `definition`, `why_it_matters`, `when_to_use`, `anti_pattern` | `examples.context`, `examples.example`, `distinguish_from.distinction` |
| Primitive | `summary`, `scope`, `usage`, `composition.pattern`, `composition.example`, `distinctions`, `ownership.rationale`, `priority.scope`, `priority.rationale` | `definitions.name`, `definitions.text`, `considerations` |
| Category | `label`, `description`, `question` | None |
| Layer | `label` | None |

Vectors cover the entire corresponding canonical array in canonical order. Primitive definition vectors contain **only inline branches**, in owner order; `{ concept: ... }` branches consume no vector element. Referenced definitions always reuse the referenced Concept's resolved definition and actual language. Category/layer `label` is display-only and leaves canonical `name` untouched.

There are no indexed translation paths. Identity fields, English/Chinese term names, aliases, relationship targets, sources, evidence states, ownership kind and priority level cannot be overridden. In particular `examples.0.context`, `definitions.concept`, `definitions.0.text`, `category`, `layer`, `term`, `zh` and `sources.0.title` are unsupported.

## Fingerprints and freshness

Each fingerprint hashes deterministic JSON of `{ version: 1, kind, target_id, path, source, context }`. Object keys are sorted recursively, array order is preserved, and source text comes from parsed canonical records. YAML formatting, file discovery order, `added`, source links and unrelated prose do not affect a unit's fingerprint.

The context binds complete ordered `examples`, `distinguish_from` and `definitions` owner arrays, including sibling prose and reference targets/branches. `considerations` binds its entire ordered array. Ownership rationale also binds `ownership.kind`; priority rationale/scope bind `priority.level`. Other scalar units bind their own text.

Insertion, deletion, reorder or branch changes invalidate every unit bound to that owner. A registered vector family remains recognized when its current owner is empty. Compare fingerprints **before** imposing current cardinality: matching vectors must have exactly the current source length; stale historical vectors may retain their former nonempty length and remain valid but unpublished. A matching nonempty translation for an empty source is an error. The current record still must satisfy its canonical contract, including nonempty Primitive definitions and considerations.

A mismatching fingerprint does not prove historical legitimacy. The contract accepts syntactically valid stale units only for registered families, publishes none of their text, and exposes the stale diagnosis.

## Shared resolution boundary

`readCatalog(dataRoot)` reads canonical records, fixture-owned taxonomy and overlays. Call `validateCatalog(catalog)` and reject every diagnostic before publication. The Astro `translationsLoader(dataRoot)` uses this same boundary. A missing translations directory is empty only when enumeration reports `ENOENT`; other filesystem errors propagate. Legacy callers that omit taxonomy use the canonical registry; supplied taxonomy is read from the caller's root.

`resolveCatalog(catalog, overlays, locale)` accepts `en` or `zh-CN` and does not mutate either input. It returns `concepts`, `primitives`, `categories` and `layers`, each containing `{ id, canonical, data, units, coverage, coreTranslated }`. `canonical` is the untouched canonical data object, `data` is an independent display projection, and `units` is keyed by the registered path. Primitive records additionally expose display `definitions` with `name`, `text`, optional `concept`, `nameLang`, `textLang` and the resolved text `unit`; `data.definitions` retains canonical reference branches.

Every resolved unit exposes `path`, `text`, `actualLang`, `status`, `sourceFingerprint` and `fallback`. English requests use canonical text with status `canonical`. Chinese requests use only reviewed, current translations; otherwise they use current English with status `missing`, `draft` or `stale`. Draft takes precedence over stale when a draft fingerprint also differs. Actual language is `en` for all fallback text and `zh-CN` for published translations.

Coverage counts visible registered units: `{ translated, total, missing, draft, stale }`. Empty vectors remain available for diagnostics but contribute nothing to reader-facing coverage. Concept `coreTranslated` requires current reviewed `summary` and `definition`; Primitive requires current reviewed `summary` and `scope`. Taxonomy requires its registered scalar units. Reviewed translation is an editorial translation judgment, independent of canonical knowledge acceptance or evidence verification; automated translations remain drafts until explicitly reviewed.

## Routes and publication

English URLs retain their root paths. Chinese projections use `/zh-cn/` after the deployment base and retain canonical slugs and valid public fragments. Route locale determines the request; language selection does not automatically redirect from browser preferences. All body language annotations, reused summaries, search excerpts and copied definitions must use the same resolved units.

Chinese Concept/Primitive details with current core translations use their own canonical URL and may publish `en`, `zh-CN` and `x-default` alternates. Missing core translations require `noindex`, an English canonical URL and a visible coverage notice. Alternates must target real accessible eligible pages. Other partial prose may fall back with `lang="en"`. Directory eligibility depends on current reviewed navigation/purpose units and correctly annotated names. Home/category directories require every displayed category label and description; the Primitive directory requires every layer label. Knowledge rows in Concept/search directories do not gate the translated directory UI. A category detail requires current reviewed label, description and question; its purpose prose otherwise remains an English fallback with noindex and an English canonical. Application Resources use Chinese chrome while preserving their original edition prose and stating that the body is outside this overlay.

Canonical exports (`dataset.json`, `llms.txt`, dataset version) continue reading canonical collections. Translation edits do not change export shape/version or canonical dataset digest. No localized dataset endpoint is introduced.

## Verification

Run schema generation/drift checks and the applicable suites from [repository verification](../../CONTRIBUTING.md#validation). `tests/translations.test.mjs` exercises public catalog, resolver and Astro adapter behavior using real filesystem fixtures. Production-subpath acceptance includes rendered language, fallback, SEO, search and Copy; unit tests alone do not establish those outcomes. The [Issue 39 acceptance record](../audits/issue-39-translation-acceptance.md) documents the accepted translation scope; future wording or fingerprint changes require a new concrete review.

### Framework and UI behavior

Starlight owns the sole locale configuration: English root (`en`) and Chinese route key `zh-cn` (`zh-CN`). The project keeps native navigation, UI translation, theme controls and Pagefind; a public route middleware filters canonical/alternate/robots metadata without replacing native Head. Shared views generate both locale routes from canonical identities. The language selector preserves q/type and other query parameters, keeps only fragments declared for the destination view, and never saves an automatic language redirect preference. Native documentation uses Starlight association/fallback; an untranslated Chinese documentation fallback is noindexed and canonicalizes to English without advertising a Chinese alternate.

Chinese directories carry translated navigation and purpose text while field-level fallbacks retain explicit English language. Concept/Primitive term headings remain English and their existing `zh` names are `zh-CN`. Speaking Guide prose remains English; Skill Map prose uses maintained `text_languages`, with unannotated prose retaining the original English default even in Chinese chrome. Editorial relation notes retain the owning map scope language because relations have no independent annotation field. Source titles remain original; the known Chinese report title is labelled Chinese and existing English titles stay English. Chinese resource detail shells are noindexed with English canonical links and visibly disclose that body translation is outside this edition.

Field search keeps one result per canonical identity and uses resolved prose alongside English term/aliases, existing Chinese names and related names. Pagefind indexes both HTML locales independently and includes English fallback spans in the Chinese context. Crawler `noindex` does not disable this reader search behavior. Copy always reads the rendered body and presents locale-specific success/failure feedback.

### Sitemap publication

The native `@astrojs/sitemap` integration consumes already built HTML head policy through its public serializer. It omits noindex and non-self-canonical pages and replaces inferred alternate links with the actual `en`, eligible `zh-CN` and `x-default` links emitted by route middleware. A missing or conflicting HTML policy fails the build; the wrapper rethrows native serializer errors instead of accepting a logged failure. Machine endpoints are outside this HTML projection. There is no second locale configuration or manually maintained route inventory.

`scripts/verify-sitemap.mjs` checks every included XML location and alternate against real emitted HTML. L2 also transitions a fixture-owned reviewed core definition to stale and verifies that HTML and sitemap lose eligibility together, while reader routes and Pagefind remain available.

On mobile splash Home pages, native theme and language selects also appear beside the Home navigation because Starlight hides desktop header controls and splash pages have no sidebar menu. These reuse the same native components and destination-fragment policy; desktop keeps one visible pair in the header.
