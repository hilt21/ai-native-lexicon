# Cloud Browser verification, 2026-10-13

Follow-up to [Issue #51](https://github.com/hilt21/ai-native-lexicon/issues/51) and [draft PR #52](https://github.com/hilt21/ai-native-lexicon/pull/52), requested explicitly by the user. Session observations were made around 10:42–10:46 Asia/Shanghai using Cloud Browser Chrome at a 1363px CSS viewport. No scripts or CSS were injected into the website.

## Version boundary

The interactive target was the **existing production site**, `https://hilt21.github.io/ai-native-lexicon/`. PR #52 was still open and unmerged, with no independent preview URL identified in its record. These Cloud Browser observations do not prove the PR's new native-option CSS is deployed.

Separately, GitHub Actions [run 38336501702](https://github.com/hilt21/ai-native-lexicon/actions/runs/38336501702) completed successfully for implementation commit `1534e7a8c259814c8f48966bbab41d38fbdfbc5f`: browser installation, type/catalog/schema validation, tests, extension regressions, L2, full build, and production-browser behavior. The existing browser seam includes the new native-option color regression. Browser artifacts were uploaded; deployment was skipped. This resolves the implementation build/browser gate in CI while preserving the local Chromium limitation as historical evidence.

## Observed with Cloud Browser

| Check | Observation | Status |
| --- | --- | --- |
| Production Pagefind | Open Search, enter `harness`; 53 results appeared, including Concept and Primitive targets | passed |
| Search focus restoration | Press Escape; active DOM element returned to the Search button | passed |
| Theme and language | Select Dark, switch English to 简体中文; resulting page has `lang=zh-CN`, theme `dark`, translated navigation and the rendered dark hero | passed |
| Desktop horizontal overflow | Home, Harness Primitive and Matt Pocock overview: document width 1348px within a 1363px viewport; initial English home also fit | passed in this desktop session only |
| Chinese definition Copy | Context Engineering shows 8/8; clicking Copy displays 定义已复制。 and the real clipboard contains the complete rendered Chinese definition | passed |
| Partial translation | Harness Primitive displays 2/10, 8 missing; its referenced Concept definition is Chinese and annotated `zh-CN` | confirmed |
| Skill Map language boundary | Chinese Matt Pocock overview shows the original-language notice; switching to English changes chrome/route while Chinese prose and Chinese OG description remain, with `og:locale=en` | confirmed existing coverage limitation |
| Console inspection | Captured buffer contains 23 extension-origin metadata errors and no site-origin error/warning entries | observed; not an exhaustive network capture |

Screenshots were visually inspected. An early dark-home capture caught the entrance animation; it was replaced by the settled page capture. No rendering failure was inferred from that transient frame.

- [Pagefind results](cloud-browser-2026-10-13/search.jpg)
- [Settled Chinese dark homepage](cloud-browser-2026-10-13/zh-dark.jpg)
- [Chinese Copy feedback](cloud-browser-2026-10-13/copy.jpg)
- [Captured console entries](cloud-browser-2026-10-13/console.json)

The original Auto theme setting was restored before ending the session. No post, merge or deployment was performed.

## Unverified / blocked

| Item | Concrete limitation | Next verification |
| --- | --- | --- |
| Actual 400% browser zoom | Ctrl+plus did not change viewport or device scale. Cloud Browser rejected navigation to Chrome settings because only HTTP(S) URLs are allowed. No workaround was attempted | Actual desktop browser zoom session with visible 400% setting |
| Mobile layout and native popup rendering | This session provided a fixed desktop viewport. Clicking the native selector did not expose its popup in the captured page screenshot | Real mobile browser; retain distinction from computed-style CI assertions |
| Screen-reader announcements | AX/DOM and visible feedback were observed; no assistive-technology audio session was available | NVDA/Firefox or VoiceOver/Safari session |
| LinkedIn preview | Post Inspector accepted the public home URL submission, then navigated to `/post-inspector/login`; no preview was returned | Authenticated Inspector session; do not infer success from static OG metadata |
| X preview and social-cache refresh | Not performed; no authenticated X preview or genuine before/after image update observed | Platform preview and next actual image-update observation |
| PR patch on deployed site | PR was unmerged; production remains an earlier version | After an authorized deployment, run online smoke and native popup checks |

These results supplement, rather than replace, [the HTTP inventory](online-verification-2026-10-13.md) and [manual acceptance guide](online-verification-guide.md). Human screen-reader, zoom and platform-cache acceptance remains open.
