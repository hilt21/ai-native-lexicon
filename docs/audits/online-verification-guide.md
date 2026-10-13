# Online verification and manual acceptance

Spec: [Issue #51](https://github.com/hilt21/ai-native-lexicon/issues/51), [repository copy](../specs/online-verification.md).

## Run the read-only checks

Use the checkout matching the intended deployment. The report records the checkout revision and dirty state; it does not prove which commit is deployed. Drift may indicate an older deployment rather than a regression in current source.

```sh
npm ci
npm run verify:online -- https://hilt21.github.io/ai-native-lexicon/
```

Optional targeted browser smoke, using the project's existing Playwright dependency:

```sh
npx playwright install chromium
npm run verify:online -- https://hilt21.github.io/ai-native-lexicon/ --browser
```

Use `ONLINE_EVIDENCE` to choose a different output directory. `NODE_USE_ENV_PROXY=1` enables Node's environment proxy support when required by your network. `PLAYWRIGHT_CHANNEL` can select an installed compatible Chrome channel. Browser unavailability is reported separately and makes a requested browser run exit nonzero.

`report.json` contains per-request timestamps, final URL, redirect hops, HTTP status, MIME, relevant cache headers, PNG dimensions, failures and source-derived translation inventory. `report.md` gives the review summary. Exit zero covers only the requested automated checks. Human acceptance remains pending. Browser reports include failed requests, page errors and screenshots; computed option colors do not establish native popup rendering.

The HTTP inventory derives every Concept/Primitive in both locales, categories, core directories, map overviews and one node/journey per map, and every single-card share page. It compares current translation coverage, summary/definition text, field language, canonical, noindex and alternate links against the shared resolver. It checks discovered same-site HTML assets and CSS URL dependencies, including hero variants and social images. It does not crawl arbitrary JavaScript imports or every map detail. The browser smoke adds observed lazy Pagefind requests.

The manually dispatched **Verify deployed site** Actions workflow runs the same command and uploads evidence even on failure. It does not deploy, change content or create a recurring monitor. Choose the branch/revision whose content you expect to be deployed.

## Interpret i18n evidence

- `reviewed/current`, `missing`, `draft` and `stale` count registered visible units. They do not measure translation quality or knowledge verification.
- Core translation eligibility is separate from complete prose. A Primitive with translated summary/scope may be indexable while other fields remain English.
- Referenced Primitive definitions reuse the resolved Concept and are checked as rendered definitions. They do not create new owned translation units.
- Taxonomy counts must not be interpreted as whole-site coverage.
- Skill Map annotations are inventoried separately. These original-language editions remain outside the Translation Overlay contract; no English-completeness score is fabricated.
- OG description language detection is a heuristic warning. Mixed-language editions and shared English artwork need editorial decisions before changing metadata policy.

## Manual acceptance session

Copy this table to a new dated audit. Never edit historical evidence into a pass. Keep automated report links and manual session evidence together. For each observed result record tester, timestamp/timezone, target URL, deployment revision if known (otherwise unknown), OS/device, browser/version, assistive technology/version, steps, expected/actual outcome and screenshot/recording reference. Use **unverified**, **blocked**, **failed** or **passed**. Missing evidence keeps the row unverified; network or account restrictions are blocked.

| ID | Minimum session | Passing observation | Initial status |
| --- | --- | --- | --- |
| screen-reader | NVDA + Firefox or VoiceOver + Safari: home landmarks/skip link; theme/language current value and option names; search open/query/close; Concept and Primitive Copy success/failure feedback; English fallback inside Chinese pages | Controls and options named; focus reaches content, stays in search then returns; feedback announced; language behavior documented | unverified |
| browser-400-percent | Desktop browser 1280px-wide window at 100%, then actual browser menu zoom 400%. Visit home, search, long Primitive and one map node in both themes. Record browser zoom UI | No lost content, unusable controls, overlap or unnecessary two-axis page scrolling; native menus readable; dialog closes; focus visible | unverified |
| real-device-selects | Actual iOS/Safari or Android/Chrome: open both home selectors in Light/Dark; read every option and change selection | Native popup labels visible and selection applied. Add another platform if the first reveals platform-specific behavior | unverified |
| linkedin-preview | LinkedIn Post Inspector: production home and one single-card share URL | Intended title, image and card identity appear; save actual preview and fetch time. Do not publish a post | unverified |
| x-preview | X composer: paste the same two URLs and inspect generated previews, without publishing | Intended title/image visible; capture platform result; static OG alone is insufficient | unverified |
| social-cache-refresh | At the next genuine social image change, capture the old preview, deployment time, unchanged/changed image URL and refreshed platform preview | Platform serves expected current image; record elapsed time and refresh action. If no real update occurred, leave unverified | unverified |

A 320px viewport, device scale factor, pinch/page scale or CSS zoom does not count as the actual 400% browser session. Accessibility tree inspection does not count as a screen-reader session. No changes to translations or acceptance flags are authorized by completing these tests.

## Known risk follow-up

The narrow-home native `<select>` uses transparent text for its collapsed icon. The fix gives option rows explicit theme foreground/background without changing labels, selected state or navigation. Validate native popup behavior on an actual device after deployment.

Social images use stable file names, and single-card canonical points to the full guide while `og:url` points to the card. Keep platform identity/cache behavior open until the sessions above are observed. Translation expansion and English Skill Map edition design require separate content work.
