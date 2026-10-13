# Online verification implementation, 2026-10-13

Spec: [#51](https://github.com/hilt21/ai-native-lexicon/issues/51). Source baseline: `baee378`; the run used a dirty feature checkout. This is pre-change production evidence from `https://hilt21.github.io/ai-native-lexicon/`, not proof that the new option CSS has been deployed.

## Results

| Evidence | Result |
| --- | --- |
| New HTTP-boundary regression tests | 10 passed: coverage/canonical drift, missing assets, wrong MIME, external redirect, base-path escape, partial network failure, inventory boundaries and quoted SVG CSS URL parsing |
| `npm run check` | 0 errors, warnings or hints; shared catalog and portable schemas validated |
| Production HTTP/HTML inventory | 334 pages and 51 discovered assets passed; no final HTTP, MIME, publication-policy or resolver-projection failures |
| Optional browser smoke | unavailable: no compatible Chromium binary; Playwright download did not complete successfully |
| Fresh production-subpath build | failed in the existing brand image generation hook because Chromium is absent; HTML generation is not reported as a complete build or browser pass |
| Screen reader, actual 400% zoom, real-device native popup, LinkedIn/X preview and cache refresh | unverified; see manual guide |

Full request metadata, coverage and failures: [Compressed JSON evidence](online-verification-2026-10-13/report.json.gz). [Automated summary](online-verification-2026-10-13/report.md). The JSON timestamps are emitted by the execution environment clock. Requests alone do not prove the deployed source revision.

The first resource scan falsely interpreted an embedded SVG filter fragment as a network URL. The CSS extractor was corrected to consume quoted data URLs atomically, covered by a regression, and the full online inventory was rerun. The committed report is that final run, not the superseded false failure.

## Coverage

| Collection | Records | Core translated | Current reviewed units | Missing units |
| --- | ---: | ---: | ---: | ---: |
| Concepts | 84 | 2 | 16/426 | 410 |
| Primitives | 42 | 1 | 2/486 | 484 |
| Categories | 18 | 18 | 54/54 | 0 |
| Layers | 5 | 5 | 5/5 | 0 |

No draft or stale units were observed. Counts come from the shared resolver; referenced Concept definitions in Primitives reuse their owning definitions. Skill Maps retain their original mixed-language editions and remain outside the Translation Overlay contract.

## Delivered changes and remaining gate

The command and manually dispatched workflow produce repeatable deployment evidence. Native option rows now receive semantic foreground/background colors. A focused regression was added to the existing production-browser seam and the optional online smoke, but its actual browser result is pending. Existing broad local browser acceptance was not rerun or claimed.

Before merging, require the existing CI build/browser gate to pass. After deployment run the new online smoke, then complete [the manual sessions](online-verification-guide.md). Stable social image cache URLs, single-card identity behavior and mixed-language metadata remain explicit follow-ups. This change does not translate content, change SEO policy, deploy or merge itself.
