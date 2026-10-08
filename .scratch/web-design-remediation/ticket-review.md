# Web design remediation: minimum-ticket review

Date: 2026-10-07 (Asia/Shanghai).
Approved specification: [GitHub Spec #31](https://github.com/hilt21/ai-native-lexicon/issues/31).
Result: **one candidate development ticket, WEB-01**. No split was required by currently observed hard constraints. The human confirmed this granularity and publication. WEB-01 is published as [GitHub Issue #32](https://github.com/hilt21/ai-native-lexicon/issues/32), OPEN and ready-for-agent; implementation has not started.

## Initial candidate

Start = the entire approved change: R01-R09, A01-A28, current pstack language annotations, input/export edition handling, page projections, test:browser/CI and final production evidence.

S1-S6 are checkpoints inside this candidate, not six tickets. No issue was created solely to represent schema, content, UI, tests, roles, files or potential parallelism.

## Hard-constraint audit

| Hard constraint | Current evidence | Split decision |
| --- | --- | --- |
| Cannot reliably fit one fresh context | Core implementation is21 files/78,492 bytes, spec31,207 bytes, current annotation inputs82 records. The broader32-file source/test/doc inventory is183,324 bytes and83 YAML files (including read-only relations)92,246 bytes, but it need not be read as a single payload. Authoring can preserve existing strings and review only allowed text paths; generated schemas, fixtures, command logs and screenshots remain artifacts. No upstream source re-research/full-skill ingestion is needed. | No demonstrated hard violation. Use progressive disclosure and bounded outputs. These byte counts are not a token count or a guarantee; revisit only with observed budget/seam evidence. |
| Cannot remain independently verifiable | One production build supports exact rendered-HTML, browser-history/dialog/keyboard/geometry/contrast checks. Existing schema/reader/normalization/extension seams cover language annotations and retained identities. All28 acceptance cases can be included in the same ticket. | No split; no partial horizontal ticket is needed. |
| Requires ordering boundary to keep repository valid | Language-aware reader/schema/data/render/export/docs must be valid together. The necessary ordering is within one atomic language checkpoint. CSS/search/history fixes have no separate release prerequisite. | Keep atomic checkpoint inside the ticket; do not publish unsupported data before the reader/schema. |
| Requires isolated prefactoring | Existing SkillMapPage/Directory, input schema, assembled validator, collection readers, presentation helpers and export normalizer are usable extension seams. Nothing requires a behavior-preserving rewrite first. | No preparatory-refactor ticket. |
| Requires expand-contract migration | Input1.1.0 adds optional annotations while continuing to read old unannotated1.0.0 records; dataset1.2.0 preserves existing arrays/fields/IDs and versions the additive shape. No old string representation, route, reader capability or public identity is removed. No external-consumer deployment barrier was found. | This is compatible extension plus annotation, not a demonstrated wide migration requiring separately released Expand/Migrate/Contract tickets. |

A version bump alone does not prove a staged migration. If a concrete consumer/rolling-deployment constraint or required contract removal is discovered, record that evidence and re-run the minimum-ticket audit. Do not invent such a dependency to justify extra tickets.

## Merge pass

Candidate set after hard-constraint audit = {WEB-01}. There are no adjacent or dependency-linked ticket pairs to merge. One ticket contains the whole change and satisfies the currently established constraints; zero tickets cannot deliver it. Therefore one is the minimum positive ticket count supported by current evidence.

The internal S1-S6 ordering does not introduce tracker edges. A language/data checkpoint is an implementation consistency boundary, not necessarily an independently released development ticket.

## Ticket and DAG

| ID | Title | Blocked by | Delivery | Publication label |
| --- | --- | --- | --- | --- |
| WEB-01 | 端到端修复网页审查问题，交付稳定检索、可读地图与语言投影 | None | R01-R09 and28 atomic acceptance cases, schema/export migration compatibility, real production UI evidence, CI/browser suite | ready-for-agent |

DAG: one node, no edges. Spec #31 is the normative input, not an implementation blocker requiring closure. Parent Issue remains unchanged; no additional epic or tracking placeholder is proposed.

## Reviewable artifacts and next step

- [Ticket draft](issues/01-web-design-remediation.md): concrete scope, implementation checkpoints, all28 checkboxes, preservation/out-of-scope constraints and frozen full Spec #31.
- [Publication manifest](tickets-manifest.json): planned count, IDs, blockers, coverage and unpublished status.
- The local spec still mirrors live #31; this turn does not change the specification.

Publication completed after explicit human confirmation: only WEB-01 was created as Issue #32. Its body, OPEN state and ready-for-agent label were read back and verified. Parent #31 body/state/labels were compared before/after and remained identical. No implementation, commit, push or deployment occurred.
