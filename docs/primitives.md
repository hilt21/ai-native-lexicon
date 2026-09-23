# Primitive content

A primitive is a basic unit of understanding or construction within a stated domain and abstraction level. The catalog has 42 entries: 40 groups adapted from the supplied research report, plus Goal and Evidence. This is an editorial design language, not a claim of universal consensus.

## Single source of truth

- Concepts remain in `src/data/concepts/*.yaml`. Their `primitives` array replaces `tags` and may be empty.
- Primitive metadata lives in `src/data/primitives/*.yaml`. Filenames are stable `/primitives/#slug` targets.
- A primitive definition already held by a concept uses a `concept` reference. The page resolves the current definition at build time; do not copy it into another record.
- New meanings use inline `{ name, text }` definitions. A grouped entry can contain several definitions and must explain their differences.
- Concept backlinks derive from concept `primitives` arrays. Primitive `related` references point only to other primitives.

See [the State record](../src/data/primitives/state.yaml) for a referenced definition, [Purpose](../src/data/primitives/purpose.yaml) for an inline definition, and [Capability / Tool](../src/data/primitives/capability-tool.yaml) for a mixed group.

## Fields

| Field | Content |
|---|---|
| `term`, `zh` | English display name and Chinese name |
| `layer` | One of the five layers in `src/content.config.ts` |
| `summary` | A concise orientation for search and machine-readable discovery |
| `definitions` | Nonempty list of `{ concept: slug }` or `{ name, text }`; a referenced concept must link back |
| `scope` | Applicable domain, abstraction level, and conditions |
| `usage` | The design problem this entry helps address |
| `composition.pattern`, `composition.example` | Readable composition notation and a concrete example; notation may include supporting concepts outside the primitive set |
| `considerations` | Engineering and cognitive risks or constraints |
| `distinctions` | Boundaries against nearby meanings, including members of a grouped entry |
| `ownership.kind`, `ownership.rationale` | `llm`, `executor`, or `hybrid`, with concrete responsibility allocation |
| `priority.level`, `priority.scope`, `priority.rationale` | `P0`, `P1`, or `P2`, the scope, and the reason |
| `related` | Zero or more distinct, existing primitive slugs; no self-reference |
| `sources` | Title, section locator, synthesis basis, verification status, and optional HTTP(S) URL |
| `added` | Date in `YYYY-MM-DD` form |

P0 **Core**: explicitly consider in most system designs. P1 **Foundation**: a strong default, explicitly modeled where applicable. P2 **Situational**: becomes important in complex, adaptive, AI, or high-risk systems. Read the level together with its scope: Reasoning and Harness are P0 specifically for the stated AI settings. Goal and Evidence priorities are editorial additions, not report table assignments.

**LLM** favors probabilistic interpretation and reasoning. **Executor** favors code, rules, databases, state machines, and tools. **Hybrid** combines proposals or explanations with mechanisms that constrain, preserve, or commit. Ownership does not transfer human authority, imply all tool results are deterministic, or exclude human reasoning.

The supplied report is located by title and section. Its external references remain `unverified`; internal citation tokens are not source URLs. `report-synthesis` means adapted from the supplied report; `editorial-synthesis` identifies additions based on the existing lexicon. Mark `verified` only after checking a supporting source. Do not infer a term's origin from the report or invent links.

## Projection and compatibility

`/primitives/` renders descriptions, anchor targets, and derived concept backlinks. Concepts link to the relevant anchors. Search includes primitive names (English and Chinese) for linked concepts and standalone primitive results. Both `/dataset.json` and `/llms.txt` expose the new entries. Dataset version `0.2.0` replaces concept `tags` with `primitives`; consumers must resolve primitive definition references against the dataset's concepts.

Keep runtime schema, portable JSON schemas, reference validation, tests, and this guide synchronized. Run:

```sh
npm run check
npm test
npm run build
```

The migration decisions are recorded in [the original audit](./audits/primitive-tag-mapping.md). It is the pre-implementation proposal; current YAML is authoritative for the implemented associations.
