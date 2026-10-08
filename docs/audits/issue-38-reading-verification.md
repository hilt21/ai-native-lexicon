# Issue 38 reading verification

Implementation adds optional Concept examples/distinctions, canonical same-type English A–Z navigation, per-definition Copy, related summaries and the existing field-search projection. Dataset shape advances from 1.3.0 to 1.4.0, preserving aliases, all existing arrays/metadata, ordered prose and Concept-reference Primitive definitions. The [accepted four-record evidence pilot](issue-38-evidence-review.md) separately records editorial acceptance and partial evidence judgments.

## TDD and acceptance seams

The approved seam starts at independently authored YAML, crosses `readCatalog`/`validateCatalog`, CLI and Astro production builds, and ends at exported JSON and real Chromium reading/copy/search behavior. No private helper mocks or second definition store were introduced.

Observed red→green steps:

- Public catalog initially rejected the new reading fields as unrecognized; strict optional fields/defaults were added and the independent YAML case passed.
- Catalog initially accepted dangling distinction targets; shared semantic checks now reject unknown/self/repeated targets, including repeated targets with different prose.
- Portable schema initially rejected a legal example as an additional property; generation from the shared contract made legal/nonblank/strict shape decisions agree with CLI/Astro. Cross-record existence/self/target uniqueness remain catalog checks; portable shape validity alone is insufficient.
- An independently built Concept initially omitted its example; details now project example/context and resolve distinction title/link from canonical targets.
- A final keyboard probe found that disabling Copy during clipboard I/O lost focus to the document body; keeping the native button enabled preserves keyboard focus, with a public browser assertion.
- Chromium initially found no Copy action; actual clipboard content now equals the displayed definition. Names distinguish individual Primitive definitions; success and denial use live status feedback, and denial clears previous success.
- Chromium initially found no A–Z navigation; both types now resolve English-title neighbors with slug ties and omit missing boundary links. Related previews use canonical summaries.
- An example-only search initially hid the Harness result; existing field search now projects example context/body and distinction prose with direct match excerpts and labels.
- Rendered keyboard focus initially used the new button's default one-pixel outline; it now uses the shared two-pixel focus token. Native Starlight skip-link fragment/next-tab behavior is preserved.

The existing BFCache test harness twice encountered Chromium's `Page.getNavigationHistory: Not attached to an active page`. It now uses native `history.back()`/`forward()` with URL waits, retaining assertions of actual `pageshow.persisted` for BFCache versus reload. Product restoration code was unchanged.

## Results

Local verification exercised the implementation worktree before its delivery commit; the browser manifest records its base HEAD. Verification used Node 24.19.0 and Chromium with `/ai-native-lexicon` and real Pagefind enabled. Results are execution evidence, not evidence verification or editorial acceptance.

- `npm run check`: 0 errors, 0 warnings, 0 hints; portable-schema drift and complete catalog checks passed.
- `npm test`: 77 passed, 0 failed.
- Production build: 278 pages and a nonempty real Pagefind index; export schema 1.4.0.
- `npm run test:browser`: final production build and browser run after the focus correction passed 184 checks with 0 failures.
- `npm run test:extension`: 13 passed, 0 failed; independent YAML/build, cache, schema drift, identifiers and normalized content-version scenarios passed.
- `npm run test:l2 -- --browser`: all six stages passed, including complete independent YAML/catalog/portable/CLI/build/export/link integrity, invalid inputs, real browser clipboard/search/reading and original-source cleanup. This command includes every normal L2 stage.

The browser result includes the accepted examples/distinctions/source links, exact Concept and inline/referenced/multiple Primitive clipboard bodies, accessible feedback and rejection, first/middle/last neighbors for both types, independent YAML English-title ties, and a Concept edit synchronizing its own/referring detail, clipboard, related preview and canonical export while Primitive YAML stays reference-only. Existing search state/count/empty/Clear, actual BFCache/reload, Pagefind dialog and mixed-language projections pass.

All sixteen changed-detail screenshots were inspected: Context Engineering, Harness, Context Primitive and Verification/Evaluation Primitive, each at 390px/1440px in light/dark. Controls, reading columns, source sections, backlinks, summaries and neighbor links remain readable without horizontal overflow. Keyboard focus, skip links, reduced motion and computed control text/border/focus contrast were checked. Screen-reader and actual 400% zoom sessions remain **unverified**; 320px reflow is not a zoom substitute.

Local reports/screenshots are preserved in `/private/tmp/lexicon-issue38-implementation/`; CI uses its existing browser artifact workflow. Formal pilot records exactly match the accepted append-only payload; prior definitions, summaries, identities, relationships and report-source objects remain unchanged. All Primitive source values remain unverified.
