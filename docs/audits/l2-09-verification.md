# L2-09 verification

Issue: #15. Parent: merged L2-08, `331df3d21d21d70c8ee0b06402745e8449cdebac`.

## Automated evidence

Node 24.19.0, unchanged lockfile, isolated source checkout on 2026-10-06:

- `npm run check`: 0 errors, warnings or hints, including schema drift and complete catalog references.
- `npm test`: 56 passed; version tests cover JSON Date semantics, object-key/collection order, no input mutation, build timestamp exclusion and semantic changes in each content/config type.
- `npm run build`: 152 production-base pages plus Pagefind.
- `npm run test:extension`: 12 passed. New Card YAML appears in custom search, dataset and llms; repeated builds keep the digest and change the timestamp; changed guide content and category semantics change the digest.
- Original Concept/Primitive export arrays and every field are identical to the prior export. Actual formal counts are 84 Concepts, 42 Primitives, 20 Cards.
- Additional related-name assertion checks the Chinese display names from referenced records, so a slug-only index cannot pass. Its targeted projection integration is rerun after the assertion is added.

The version and new-Card projection seams ran red before green. Hashing includes only normalized content and taxonomy, never build/site/base variables or invented governance records. Legacy `version` remains `0.2.0`; export shape is `schema_version=1.0.0`. See [exports](../exports.md).

## Real browser evidence

Chrome loaded an isolated production-base fixture adding only Card 27 (`L2 Projection Guide`), with `Quasar signal demonstrates projection coverage.` as its idea and Context/State references. The fixture is not formal data.

| Check | Desktop 1440 × 960 | Mobile/touch 390 × 844 |
| --- | --- | --- |
| Title / core idea | Each finds the new guide as one matching row | Each finds the new guide as one matching row |
| Related names | Context and State find guide plus existing kinds | Context, State, 上下文 and 状态 find the guide |
| No results / clear | No-match hint appears; native Backspace clearing restores all 147 rows | No-match hint appears; native clearing restores all 147 rows |
| Card result | Native result click reaches `/ai-native-lexicon/speaking-card/#card-27` | Same path/anchor, target title visible |
| Notes | Native disclosure clicked, `details.open=true` | Native disclosure clicked, `details.open=true` |
| Overflow | Document width 1425–1440, never wider than viewport | Document width exactly 390 |

Legacy Concept/Primitive result kinds remain visible for their searches. Screenshots: [desktop search](../../output/playwright/l2-09/search-desktop.png), [mobile search](../../output/playwright/l2-09/search-mobile.png).

Browser automation's empty fill did not dispatch a native input event; clearing was therefore tested using actual Backspace events, without changing product logic for the tool. Both viewports restored the full result set.

No new framework, vector search, Skill Map or governance pipeline is introduced. Existing row styling, card numbers, notes and page anchors remain. Delivery requires successful CI, merge and Issue closure before L2-10 starts.
