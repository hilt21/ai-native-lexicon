# Skill Map source refresh, 2026-11-12

This report records the initial refresh proposal and the subsequent delegated translation review. The draft counts below describe the initial proposal; the last section records the reviewed candidate.

| Map | Previous snapshot | Proposed snapshot | Active nodes | Journeys | Relations |
| --- | --- | --- | ---: | ---: | ---: |
| Matt Pocock | 1.3.1, `dd400c3a` | [1.3.2, `5863806d`](https://github.com/mattpocock/skills/tree/5863806dd4e15c63174bee4e7515a4256792ecfa/skills) | 31 → 31 | 7 → 7 | 51 → 51 |
| pstack | 0.15.15, `df581122` | [0.15.36, `c742dd61`](https://github.com/cursor/plugins/tree/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack) | 74 → 81 | 7 → 8 | 169 → 172 |

The pstack revision is the latest default-branch commit touching `pstack/` at observation time. The checkout at the default-branch tip has the same pstack subtree. Each active node's primary source path matches the pinned inventory. The existing MIT notices match upstream. New source IDs select the new snapshots; unchanged records retain their previous references. Existing node and journey IDs and old snapshot IDs are preserved. Neither scoped inventory removed a node.

## Matt Pocock

The map retains 27 plugin-distributed skills and four misc utilities. The eight in-progress entries remain outside the public scope, including the newly added [software-factory](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/in-progress/software-factory/SKILL.md). Its exclusion preserves the previous scope, rather than implying it is unavailable upstream.

The proposal revises twelve entries. The main changes are fresh context for research, implementation, review and exploration; evidence for intentionally forced regression failures; tracker resolution and label setup; ordered decision-ticket creation in Wayfinder; and reading the source before Ask Matt recommends skipping a step. Teaching workspace paths and quiz options, grilling facts versus decisions, and the TDD test-seam tradeoff are also updated. No journey or relationship is added because these changes refine the existing steps.

## pstack

The map covers 58 standalone skills and 23 embedded playbooks. The seven additions are:

- Verification: `create-formal-verification-skill`, `maintain-formal-verification-skill`, `statechart`.
- Goal clarification and handoff: `in-your-own-words`, `sharpen`, `ketchup`, `ketchup-video`.

The new **Verify an invariant** journey is editorial guidance. It distinguishes selecting and checking a property, visualizing a TLA+ counterexample when applicable, and maintaining an existing check after the code changes. It does not imply an automatic invocation or a proof outside the checked scope.

The [orchestrate playbook](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/poteto-mode/playbooks/orchestrate.md) delegates with Task, tracks state in Project and subscribes to PR/CI events when supported. It no longer uses the former orch CLI. The program journey reflects the single-owner and independent-verification boundaries. The two old editorial invocation edges to swarm and show-me-your-work are removed from Orchestrate; the capabilities retain their own nodes. Five new edges record the source-supported review, reporting, setup and verification handoffs. Other changes cover harness setup, adversarial review, the current-head PR gate, test evidence, performance measurements and selected engineering principles. The map summarizes reader-facing behavior; it does not mirror each runner setting or upstream script.

## Translation and verification

| Map | Reviewed and current | Draft | Missing or stale |
| --- | ---: | ---: | ---: |
| Matt Pocock | 557 / 794 | 237 | 0 |
| pstack | 772 / 1,270 | 498 | 0 |

The fingerprint binds every field to its complete owner, so an owner change sends even unchanged sibling text back for review. Unchanged owners keep their approved overlays. Draft text does not publish as reviewed; affected Chinese fields use English fallback, and the existing core eligibility rules still apply. The publication gate remains unchanged and rejects the candidate until the maintainer approves the current drafts.

Inventory and exact refreshed official descriptions were compared against the pinned upstream trees. The historical migration tests now test the fixed proposal as a fixture; a separate live check preserves original public IDs and source snapshots. Targeted map tests pass. The cloud shell could not start Chromium: the Playwright archive download was invalid and the installed Chromium could not create its browser socket. Full rendered and interactive verification remains pending in CI and, once a candidate preview is reachable, Cloud Browser.

## Delegated translation review, 2026-11-12

At the maintainer's request to review the drafts and merge only after qualification, reviewed the two pinned editions and promoted 735 current units after corrections. Kept skill names and official English descriptions in their original language. Rechecked retained prose against the current owner and recalculated fingerprints for corrected records. Coverage at this review revision is **794/794 Matt Pocock** and **1,270/1,270 pstack**, with no draft, stale or missing units.

Corrections align quiz option lengths with Teach, distinguish Code Review's two verdicts, replace an outdated premise-testing example, distinguish the TLA+ check from its summarized statechart, and keep independent verification mandatory even when the harness lacks event subscriptions. Autopilot-stack's summary now limits stacking to dependent PRs and leaves landing with the operator. These corrections do not change node or journey IDs, topology or source snapshots.

The 14 targeted map tests passed on the reviewed candidate. Full CI and any rendered browser verification are separate evidence.
