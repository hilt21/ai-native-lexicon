Tracker: [Issue #51](https://github.com/hilt21/ai-native-lexicon/issues/51)

## Problem Statement
PR #49/#50 are merged, but local checks do not establish deployed accessibility, actual 400% zoom, social crawler/cache behavior, resource availability or complete bilingual coverage. Maintainers need reproducible online evidence without rerunning the previous browser suite or claiming human sessions occurred.

## Solution
Deliver a read-only deployment verification command, a full translation coverage inventory, and an explicit manual acceptance checklist. Repair the known narrow-home native-option color inheritance risk. Keep automated, human-verified and unverified results separate.

## User Stories
1. As a maintainer, I want to select an explicit deployed URL, so that I can verify production or a preview without deploying it.
2. As a maintainer, I want the source revision and dirty state recorded, so that expectations are traceable.
3. As a maintainer, I want every Concept and Primitive checked in both locales against the existing resolver, so that coverage, fallback and publication policy stay consistent.
4. As a reader, I want every native theme/language option to remain legible, so that I can choose it in a narrow window.
5. As a maintainer, I want missing, draft, stale and current translation units reported separately, so that coverage is not confused with review or factual verification.
6. As a maintainer, I want Skill Map original-language editions reported separately, so that mixed-language editions are not counted as complete English translations.
7. As a maintainer, I want deployed HTML, discovered same-site assets, CSS dependencies and social images checked for HTTP and MIME errors, so that broken base paths and HTML error responses are detected.
8. As a maintainer, I want OG/Twitter URLs and card-specific metadata checked without JavaScript, so that crawler inputs can be inspected independently of browser rendering.
9. As a maintainer, I want a small optional deployed-browser smoke check for real Pagefind requests and native option styles, so that lazy resource failures are observable.
10. As a reviewer, I want time, final URL, status, relevant headers and failures retained, so that a result is reproducible.
11. As a reviewer, I want network errors and absent browser capability to be explicit failures or unavailable results, so that they cannot become passes.
12. As an accessibility tester, I want concrete screen-reader and actual 400% tasks, so that I can supply evidence without interpreting the entire repository.
13. As a social publisher, I want real platform preview and cache-refresh tasks, so that static metadata success is not presented as platform acceptance.
14. As a maintainer, I want CI artifacts from an explicitly dispatched online check, so that verification is repeatable without affecting deployment.
15. As a reader, I want stable public identities and current translation decisions preserved, so that this verification work does not rewrite content.

## Implementation Decisions
- Reuse validated canonical catalog and translation resolution boundaries. Do not introduce a second translation resolver.
- Main seam: externally served HTML/resources. A local HTTP fixture exercises that same interface for verifier regression tests.
- Default online inventory covers both locales for every Concept/Primitive, category pages, core directories, map editions and one representative node/journey per map, plus all Speaking Card share pages. Asset checks are scoped to discovered references, not a claim of a full web crawl.
- Bound concurrency, request time and asset traversal; fetch only URLs inside the explicit target origin/base. Record redirects, status, MIME and caching headers. Preserve partial reports on failure.
- Compare coverage counters, summary/definition text and language, canonical, robots and alternates with resolver-derived expectations. Report original Skill Map annotations independently from translation coverage.
- Static OG checks establish metadata/image availability only. Fixed image URL caching and mixed-language metadata remain documented risks; this task does not change publication or translation policy.
- Native option foreground/background use existing semantic theme tokens while the collapsed icon-only control remains unchanged.
- Human session rows start unverified. Automated command success never establishes screen-reader, actual zoom, real-device menus or social-cache acceptance.
- Add an optional browser smoke mode and a manual-dispatch CI workflow; do not add recurring monitoring, change deployment, merge automatically or send notifications.

## Testing Decisions
- Assert observable behavior through HTTP fixture responses, including missing/MIME-wrong assets, bad canonical/coverage, rejected redirects and partial network failure. Use the current catalog resolver as prior art for expected localized output.
- Validate the new native-option fix in the browser at the affected homepage widths/themes/locales. This is a targeted regression, not repetition of the already accepted broad local suite.
- Exercise the deployed HTTP inventory against the existing production site and label it as pre-change production evidence.
- When available, run the small browser smoke against production and a fresh production-subpath preview for the changed CSS. Save browser errors, failed requests and screenshots.
- Human checklist requires environment, date, URL/revision, concrete observation and evidence before any row can be marked passed. 320px viewport emulation, DOM attributes and CSS/page scaling do not count as actual 400% browser zoom or screen-reader sessions.
- Acceptance of implementation requires verifier tests, relevant static validation, a report from a real target, documented manual gaps and a reviewable diff. Overall online acceptance remains pending until human sessions complete.

## Out of Scope
Bulk translations, English-canonical migration for Skill Maps, redesigned navigation, social image redesign/versioning, altered SEO policy, real-user performance claims, repetition of the previous local browser suite, automatic deployment and merge.

## Further Notes
Source baseline: master baee378. Existing evidence: PR #49 and #50; homepage release, brand and translation acceptance audits. Concept Chinese overlays currently cover two records; Primitive has one partial overlay. Coverage totals must be derived rather than hard-coded.
The user requested conversion of the agreed minimum retest plan into a spec followed by implementation on 2026-10-13. Test seams preserve that agreed scope. Manual acceptance may remain unverified after development.

