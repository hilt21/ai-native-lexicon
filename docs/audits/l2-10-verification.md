# L2 expansion acceptance

Issue #16; base is merged L2-09, `8c82e9193a80c7318682e8a0b306991bf918460d`. Verified on 2026-10-06 using Node 24.19.0 in an isolated checkout with the committed dependency lock.

## Commands and results

- `npm run check`: 0 errors, warnings or hints, schema drift and catalog checks passed.
- `npm test`: 56 passed.
- `npm run build`: 152 formal pages and Pagefind generated.
- `npm run test:extension`: 12 passed.
- `npm run test:l2`: two consecutive successful automatic runs; each removes its temporary project and proves formal YAML/source unchanged.
- `PLAYWRIGHT_CHANNEL=chrome npm run test:l2 -- --browser`: complete expansion plus real browser checks passed at 1440px and 390px. The installed Chrome version and query/navigation results are recorded in [browser-report.json](../../output/playwright/l2-10/browser-report.json).

The default browser command uses Playwright's matching Chromium after `npx playwright install chromium`. That download encountered TLS interruptions in this environment, so the documented installed-Chrome runner was used for actual browser evidence. No assertion was disabled. An initial fixture violated the Concept minimum of two related entries; the material was corrected. The initial browser definition locator assumed a paragraph without its rendered name prefix; it was corrected to check the actual definition paragraph. These were test fixture/locator failures, not product fixes.

## Acceptance evidence

| Requirement | Inspected result |
| --- | --- |
| Empty taxonomy before members | New category route shows `00 concepts`; explicit layer anchor exists with `00 primitives`. Generated portable enums contain both new names. |
| Complete linked records | One new Concept, Primitive and Speaking Guide; all records pass the public Node catalog and generated JSON Schema validators; CLI and Astro check/build succeed. |
| Single canonical source | Concept owns the definition, Primitive references it, Guide references both. Detail pages derive reciprocal links and Guide backlinks. New category/layer contain their first member. |
| Three direct projections | Search indexes title, idea and related English/Chinese names, and asserts the new Concept/Primitive each has its own result. Both names also show their own visible results in the browser. Dataset compares every new field with canonical inputs and dynamic counts; llms links all three under `/ai-native-lexicon`. Original exported records remain identical. |
| Public identity and internal targets | Baseline 152 HTML routes and every existing HTML ID retained among 155 expanded routes, including all five old layer anchors. 3,210 baseline and 3,260 expanded internal navigation links resolve to files and, where present, unique target IDs. |
| Rejection regressions | Unknown category/layer, missing Concept/Primitive references, duplicate Card number/Concept slug and portable-schema drift fail. Drift check leaves the corrupted schema untouched. Existing contract/taxonomy regression suites also pass. |
| Isolation and repeatability | Original records compared byte-for-byte; fixture files removed, complete source digest restored, formal data digest unchanged. The whole temporary project is removed in `finally`, including failed runs. |
| Browser | Both widths exercise guide title/idea, English/Chinese related-name search, no-results/clear, disclosure, search→guide→Concept→Primitive→layer and category→Concept→Guide navigation. No page errors or horizontal overflow. |
| CI | Existing workflow now runs both extension regressions and the complete automatic L2 command before the formal build/deployment. Browser setup remains a documented separate runner. |

Reports: [automatic](../../output/playwright/l2-10/automatic-report.json), [browser](../../output/playwright/l2-10/browser-report.json). Screenshots: [desktop search](../../output/playwright/l2-10/search-1440.png), [mobile search](../../output/playwright/l2-10/search-390.png), [desktop notes](../../output/playwright/l2-10/card-1440.png), [mobile notes](../../output/playwright/l2-10/card-390.png).

Only test tooling, workflow and contributor documentation change. No formal content, runtime module, schema, page or style is changed by this ticket. Existing Linux optional runtime lock entries are retained while adding only the browser-test dependency; the already-used HTML parser is explicitly declared as a test dependency.

This proves the L2 structured-YAML expansion gate. Raw articles/notes, Proposal review/apply, automated editorial acceptance and L3/L4 are still future work. PR merge and issue closure require successful CI on the submitted head.
