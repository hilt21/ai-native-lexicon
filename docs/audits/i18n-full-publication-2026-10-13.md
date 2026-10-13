# Full i18n publication, 2026-10-13

The maintainer requested review and publication of all i18n content, completing the full release. This explicitly authorizes the concrete remaining review packs from PR #55, their necessary semantic corrections, and the complete reader-language implementation. Baseline: `35896f70d3ab5307962061f21acce7f352ab62fc`. Editorial translation review remains separate from verification of the underlying knowledge and upstream sources.

## Content review and acceptance

Reviewed every remaining unit in the Concept and Primitive side-by-side packs: 54 Concepts / 270 units; 30 Primitives / 354 units, including all ordered vectors. Corrected `contact people` from a noun to an action in Bounded Autonomy; kept delegated agency separate from technical permission in Actor; translated two remaining `canonical` terms consistently in View Projection. Existing approved wording and dates are retained.

Reviewed the complete English map candidates against the original edition: two overviews/taxonomies, 105 nodes, 14 journeys and 220 relations. Corrected the `poteto-help` skill name in Understand System and the distinction between introducing a new API and migrating its callers. Every official description and source license is retained exactly; no source snapshot is repointed. Accepted English canonical prose now feeds pages and exports. This is a content-digest change, not an export-format change.

Reviewed all 20 Speaking Guide Chinese editions: 140 units including complete key-line and case vectors. Corrected the model/harness modifier, schedule versus progress, approved documents versus access permission, and About's translation of agency. Guide numbers, links and English canonical records are unchanged. About has a native associated Chinese document. English share-image assets and existing static share URLs remain the original branded edition and disclose their language on Chinese guide pages.

Skill Maps preserve original Chinese prose as scoped, independently editable assets. Each owner records the original parsed-owner SHA-256 and migration date. Subsequent reviewed Chinese translations of previously English explanatory fields are recorded in this release; source descriptions, real skill names, product names and literal artifact identifiers remain original with accurate language tags. Full-owner fingerprints prevent reordered steps or vectors from acquiring unrelated text. Source records and public topology remain canonical-only.

## Coverage and release gate

| Collection | Records | Current reviewed units |
| --- | ---: | ---: |
| Concepts | 84 | 426/426 |
| Primitives | 42 | 486/486 |
| Categories | 18 | 54/54 |
| Layers | 5 | 5/5 |
| Speaking Guides | 20 | 140/140 |
| Matt Pocock map | 31 nodes, 7 journeys | 794/794 |
| pstack map | 74 nodes, 7 journeys | 1194/1194 |

These counts describe registered translation units, not words. Preserved literal/source units may correctly remain English. Counts must be refreshed from the resolver if content changes.

`npm run verify:i18n` rejects any missing/draft/stale unit before checking all 574 inventoried built language/share pages. Map checks include rendered taxonomy, usage, conditions, journey steps and relation notes rather than only summaries. Page eligibility, actual language, canonical/hreflang and coverage must agree. The release gate is part of Pages CI, separate from fixture suites intentionally testing partial or absent translations. A deliberately drafted unit was rejected even with complete HTML present.

## Verification state

Production-subpath build with Pagefind completed under Node 24.21.0. Types/catalog/portable schemas: zero errors, warnings or hints. Unit regressions: 120/120. Initial complete production browser suite: 314/314, with real Chromium, both languages, narrow/wide layouts, light/dark themes, clipboard, search, native controls and BFCache. Screenshot review prompted completion of remaining English explanatory map fields; Final production build and 574-page rendered release gate passed after all corrections. The final language browser acceptance passed 86 checks, with additional English/Chinese Matt Pocock screenshots at 390/1440 in light/dark. Source snapshot/topology verification against the baseline and all original owner hashes passed; 1,153 Chinese units are byte-identical in their parsed text. The runtime/release verifier review has no remaining findings. [Reviewed file manifest](i18n-full-publication-2026-10-13/review-manifest.json) pins the exact accepted inputs.

Deployment and final post-release HTTP/browser verification remain pending while this branch is under development. No local screenshot proves the deployed revision. Screen-reader, actual 400% zoom and social-platform cache sessions remain outside these automated language checks.
