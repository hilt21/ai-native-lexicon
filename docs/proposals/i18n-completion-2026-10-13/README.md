# Complete i18n content review

Status: remaining content is draft. PR #53 merged after the maintainer approved its concrete first batch. Its 270 Chinese units are being published as reviewed in the separate acceptance follow-up. Newly written wording in this pack is not covered by that approval.

## Review the remaining content

- [Concept comparison](concept-review.md): all 54 remaining records, 270 draft units.
- [Primitive comparison](primitive-review.md): all 30 remaining records, 354 draft units.
- [English map index](english-map-index.md): complete proposed English maps, 105 nodes, 14 journeys and 220 relationships. Follow the file links to full text. The two overviews and 19 node candidates retain their already approved wording; 86 nodes, 14 journeys and two relationship files need new review.
- [English review manifest](english-review-manifest.json): exact original/candidate hashes and record-level approval state. [Validation](validation.json) distinguishes prepared drafts from published translations.

| Collection | Reviewed/current after first-batch acceptance | New draft | Missing | Stale | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Concepts | 156 | 270 | 0 | 0 | 426 |
| Primitives | 132 | 354 | 0 | 0 | 486 |

These are owned translation-unit counts, not strings or percentages of approved prose. Referenced Primitive definitions reuse Concept translations. Draft units remain current English in reader projections until specifically reviewed. No source fingerprints were fabricated or refreshed without the current canonical source.

## Translation and evidence boundaries

The current canonical English record is the source for Chinese wording. The [official terminology reference set](../i18n-content-2026-10-13/README.md#translation-references) guides AI terms. General engineering definitions, ownership and priority judgments are translations of this project's canonical prose, without implied vendor authorship or endorsement. Preserve negative conditions, authority limits, nondeterministic outcomes and the distinction between verification and evaluation.

English Skill Map text translates the existing editorial explanations, retaining exact official descriptions and fixed source refs. Sources are [Matt Pocock dd400c3a](https://github.com/mattpocock/skills/tree/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills) and [pstack df581122](https://github.com/cursor/plugins/tree/df581122cde17e6e27686b5a448bde23e4ad4318/pstack). The [105-node source baseline](../i18n-content-2026-10-13/english-source-baseline.json) records original file hashes and the 82 frontmatter descriptions; 23 playbook records have no description field. This pack retains both MIT notices. Source verification does not accept all editorial wording.

## English edition activation

English candidate files are outside the live loader until review and locale-preservation implementation. Current Chinese maps remain accessible and unchanged. The complete candidate can be validated with:

```sh
node scripts/verify-skill-map-edition.mjs docs/proposals/i18n-completion-2026-10-13/skill-maps
```

It checks full input/reference contracts, immutable snapshots, non-prose structure and absence of Han text. It does not prove fluent English, semantic accuracy or rendered behavior. Regressions demonstrate rejection of deleted relationships, repointed snapshots and untranslated fields.

After accepting concrete English text, use [the locale-edition migration plan](locale-edition-plan.md). Activate pages, search and publication metadata through one shared resolver; do not overwrite the Chinese edition or create independent graph copies. That runtime change requires rendered production-subpath checks and Cloud Browser evidence on the candidate/deployed revision.

## Acceptance

Approve exact units or records from these files. Set only approved Chinese units to `reviewed` using the real review date; preserve previous approvals. New English records need semantic review before canonical activation. Chinese draft completeness, reviewed publication coverage, English content completeness and online verification are separate outcomes.
