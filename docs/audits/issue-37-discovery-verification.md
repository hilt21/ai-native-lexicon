# Issue 37 discovery verification

Date: 2026-10-08. Implementation starts from integration checkpoint `5315b70`, based on published `master` `3c0a533`. Scope: [Issue 37](https://github.com/hilt21/ai-native-lexicon/issues/37), stories 1–4 and 12. Reading/evidence and translation tickets remain separate.

## Delivered behavior

- The existing curated Concept examples and their canonical summaries precede the full category grid. Both complete browsing entrances survive. The homepage source promise applies to canonical content, and describes generated taxonomy enums.
- Optional Concept aliases default to an empty array. Shared Node/CLI/Astro inputs reject blank, normalized duplicate and own-term/zh aliases. Standard portable JSON Schema represents string/array shape and exact uniqueness; sibling-name and normalized comparisons require the public catalog validation boundary. Formal knowledge YAML is unchanged.
- Field search shows six explicit kinds, map ownership and retained status, preserves the earlier searchable fields and adds aliases. It ranks complete canonical titles, then title prefixes, then other fields, with deterministic title/identity ordering. Matched field labels and prose excerpts explain results; related names do not imply dependency.
- Native query/type/Clear controls, result order, count and empty state share URL state, preserving unrelated parameters. Actual BFCache, reload, empty return and native same-document popstate were exercised. Header Pagefind and canonical source/language projections survive.
- Dataset shape advances from `1.2.0` to `1.3.0`; previous Skill Map language metadata remains exported. CI includes the real-browser L2 expansion and uploads its evidence.

## Validation

| Boundary | Result |
| --- | --- |
| `npm run check` | Passed; generated schemas match, 86 checked files, no errors/warnings/hints. |
| `npm test` | 76 passed. |
| Production `npm run build` | Passed with `/ai-native-lexicon` and Pagefind enabled; 278 pages. |
| `npm run test:l2 -- --browser` | All six stages passed. Independent YAML proves aliases, six kinds, title/prefix/other-field ranking, match labels, retained nodes, real Pagefind queries and preserved public routes/anchors at 390px and 1440px. Original source/data bytes unchanged. |
| `npm run test:extension` | 12/13 passed in the full run. The remaining case failed copying a dependency with `ENOSPC`, before behavior assertions; its focused unchanged rerun passed. CI must run the complete suite before merge. |
| `npm run test:browser` | 141 checks passed in a byte-identical clean-cache snapshot, including the final scope-language regression. Main-worktree run passed 140 checks before that extra assertion was added. |

Node `24.19.0`, repository-pinned Playwright/Chromium. The public-catalog alias tracer, homepage order tracer, search state/context tracer and keyboard-focus tracer each failed before their corresponding implementation. Full failing/passing transcripts are retained as local execution evidence.

Homepage/search screenshots were inspected at 390px and 1440px in both light and dark themes. Native controls, visible focus, skip links, reduced motion, computed contrast, Pagefind punctuation/dialog focus, source links and map language annotations were checked. Screen-reader and actual 400% browser zoom sessions remain **unverified**; narrow reflow is not a substitute.

Fresh evidence is generated under `work/web-browser/` and `output/playwright/l2-10/`, or the configured `WEB_EVIDENCE` directory, and uploaded by CI. Previously committed L2 screenshot snapshots are historical; this change preserves them rather than replacing binary artifacts. GitHub Issues remain the live ticket state.
