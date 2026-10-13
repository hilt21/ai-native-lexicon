# Verification implementation follow-up

Scope: PR #52's verifier and agent guidance. No site UI, content, translation status or publication policy changed in this follow-up.

## Agent guidance first

Applied Matt Pocock's [writing-for-agents](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/writing-for-agents/SKILL.md) at the repository's pinned source snapshot. The root guide selects local/cloud rules before development. Branch documents disclose browser capabilities, preview access, CI and evidence boundaries; the existing online guide owns manual acceptance. Relative documentation links were checked. Guidance was committed before verifier changes.

## Reproduced failures and fixes

| Failure | Change | Regression evidence |
| --- | --- | --- |
| Relative resources resolved against the pre-redirect URL | Use each response's final URL for HTML and CSS references; recognize served CSS by MIME | Redirected page and redirected stylesheet lead to the correct nested asset |
| Parent language and substring matching hid a child's conflicting language | Match complete text and effective language of all nonblank descendant text | Conflicting child language fails; inherited language and same-language inline markup pass |
| Summary language check ignored nested overrides | Apply the same descendant language check to summary/definition elements | Wrong summary language fails even when another correct copy exists |
| Page risks were absent from the Markdown summary | Group risks with affected URLs without changing pass/fail policy | Summary retains language and share-identity risks and the affected URLs |

The four failing regression cases were observed before the implementation fix. The complete verifier suite then passed 15/15 tests. General field matching still cannot establish location when identical content appears elsewhere; this limitation is documented in the guide.

## Validation

- `npm run check`: 151 files, zero errors, warnings or hints; catalog validation passed.
- `npm test`: 105 passed; one brand-share image test could not launch the absent Chromium executable. This is an environment block, not an all-tests pass. The PR's new remote CI run is the full build/browser gate; consult its commit-specific result.
- Production HTTP run: 2026-10-13 03:04:11–03:04:53 UTC (11:04:11–11:04:53 Asia/Shanghai), target `https://hilt21.github.io/ai-native-lexicon/`. All 334 pages and 51 discovered assets passed; 150 pages retained one or more risk observations. No new browser session was run for these verifier-only changes.
- The HTTP run recorded local source `b41bbf4c9522fa14585b349f183a880dd1841ad5`, dirty while testing the fix. Tested `scripts/verify-online.mjs` SHA-256: `93210556fecc31b43f62035ec5050048f11ea8e58b6ed0471f62fd068677b6fe`. This identifies the implementation tested before publication; the checkout does not prove the deployed commit.

Earlier Cloud Browser observations remain in the [dated session](cloud-browser-2026-10-13.md). Screen reader, actual 400% zoom, device-native menus and platform preview/cache acceptance remain open under the [manual checklist](online-verification-guide.md#manual-acceptance-session).
