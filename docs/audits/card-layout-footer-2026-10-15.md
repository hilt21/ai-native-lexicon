# Speaking Card alignment and page-end publication notes

The maintainer reported displaced dark-theme card icons and overlapping Chinese card text, and requested that translation coverage and original-image language notices move to the bottom across reader pages.

## Reproduction and change

Cloud Browser reproduced the current production Chinese Speaking Cards page in dark mode. The visible dark icon inherited `margin-top: 16px` from Starlight's Markdown sibling spacing, although its icon wrapper was 24px high. The image-language paragraph occupied y=789.984–813.781 while the related-entry counts occupied y=797.781–814.781, confirming an overlap caused by the latter's negative top margin. These are browser observations, not a screen-reader or actual 400% session. [Observed metrics](card-layout-footer-2026-10-15/cloud-browser-before.json).

ResourceIcon now resets image margin in both themes. Card headings use separate icon/text columns, centering the icon on the first text line while retaining a hanging indent for wrapped titles. Counts use positive spacing below sharing actions. IDs, heading language, links, downloads and expandable notes remain intact.

LocalizedPage passes resolver-derived coverage to the shared Footer. Coverage no longer precedes the content or repeats inside individual cards. The Speaking Cards page sums all guide units into one page-end report and shows the image-language notice once. Existing coverage on home/category/Primitive/Concept/map views uses the same footer region. This region is excluded from Pagefind and styled as restrained metadata; native footer navigation and edition metadata remain available. Publication eligibility, translations and source fingerprints are unchanged.

## Verification boundaries

- Workspace type/catalog/schema checks passed with zero errors, warnings or hints.
- Workspace unit run: 119/120 pass. The social-image renderer cannot launch the missing Chromium executable; this is an environment block, not a complete pass.
- The build emitted reader HTML before its final social-image generation step failed for missing Chromium. All 574 generated reader/share pages then passed the shared i18n publication verifier against the workspace root-base target `https://example.github.io/`; six representative Chinese routes independently confirmed exactly one coverage report in the footer and no per-card reports. This is rendered HTML evidence, not a complete build or production-subpath browser pass. Use commit-specific CI for those gates.
- Added behavior assertions cover all card icon offsets/first-line alignment and non-overlapping sharing/counts/notes rows at 390/1440 widths in both languages/themes, one aggregate Chinese footer notice, no per-card notices and no horizontal overflow. Representative home/category/Concept/Primitive/map pages require coverage outside the main Markdown reading content. The CI artifact includes eight card-page screenshots.
- Cloud Browser before-change production observation is complete. Candidate Cloud Browser verification is **blocked**: the isolated static preview supervisor returned `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`. Supervisor status was inspected; no application code or managed infrastructure was changed to work around the failure. The supported preview workflow requires recording this as unavailable.
- A Cloud Browser screenshot was inspected, but the returned screenshot file did not synchronize into this workspace; no unavailable screenshot link is presented. The user attachment is not redistributed: automatic approval review rejected its public upload, so it is excluded from the PR.

No production deployment or merge is claimed. Passing remote browser CI verifies the candidate build; it does not complete deployed Cloud Browser, real-device, assistive-technology or social-platform acceptance.
