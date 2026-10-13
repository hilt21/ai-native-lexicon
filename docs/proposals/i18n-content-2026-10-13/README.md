# I18n content batch 01

Status: draft for editorial review. Based on master `0d504d6222b0d721fa03dac93184068e74d29df9` (PR #52 is merged). This batch prepares content; it does not claim that either language edition is complete or deployed.

## Review entry points

- [Concept English/Chinese comparison](concept-review.md): 28 records, 140 new draft units.
- [Primitive English/Chinese comparison](primitive-review.md): 12 records, 130 new draft units. The two reviewed Harness units remain unchanged.
- [Matt Pocock English overview](skill-maps/mattpocock/map.yaml) and [node candidates](skill-maps/mattpocock/nodes/): 12 complete node candidates.
- [pstack English overview](skill-maps/pstack/map.yaml) and [node candidates](skill-maps/pstack/nodes/): 7 complete node candidates.
- [Fixed English source baseline](english-source-baseline.json): all 105 nodes (31 Matt Pocock, 74 pstack), with source commit, path and SHA-256. 82 have upstream frontmatter descriptions; the remaining 23 do not. Existing official descriptions match the retrieved fixed files exactly. A missing description is left null rather than invented.

The English YAML files are candidate replacements for the corresponding canonical records, not a second live map collection. They preserve IDs, classification, invocation boundaries and source refs. Both source licenses are retained alongside the proposals. Map taxonomy and journey interpretation remain editorial, even when sourced from upstream skills.

## Translation references

Translation source: the current English canonical record, bound by its registered `source_fingerprint`. These are independently drafted translations of repository prose, not official vendor translations of the lexicon. Official pages guide terminology and boundary checks:

| Reference | Relevant terms / records | Role |
| --- | --- | --- |
| [Claude context windows](https://platform.claude.com/docs/zh-CN/build-with-claude/context-windows) | Context, context window, budget, compression | Chinese terminology and input/output capacity distinction |
| [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Selection, compression, isolation, memory architecture | English conceptual reference; Chinese wording is our draft |
| [Claude tool use](https://platform.claude.com/docs/zh-CN/agents-and-tools/tool-use/overview) | Tool, tool calling, selection, capability-tool, execution | Chinese terminology and request/execution distinction |
| [Claude memory tool](https://platform.claude.com/docs/zh-CN/agents-and-tools/tool-use/memory-tool) | Working/long-term memory, memory consolidation, Memory | Chinese terminology; retained information and active context distinction |
| [Claude Skills](https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/overview) | Skill, progressive disclosure, system prompt, instructions | Chinese terminology; reusable files, instructions and staged loading |
| [Claude MCP connector](https://platform.claude.com/docs/zh-CN/agents-and-tools/mcp-connector) | MCP | Chinese terminology; keep the lexicon's protocol scope broader than a specific connector |
| [OpenAI SDK handoffs](https://openai.github.io/openai-agents-python/handoffs/) | Handoff, context handoff | English operational reference; the lexicon's responsibility concept is broader than SDK control transfer |
| [OpenAI SDK guardrails](https://openai.github.io/openai-agents-python/guardrails/) | Guardrail, Permission, Sandbox | Boundary comparison; authorization and containment remain separate engineering concepts |
| [OpenAI SDK tracing](https://openai.github.io/openai-agents-python/tracing/) | Trace, observation, feedback, observation-trace | English reference for observable event records |
| [OpenAI SDK sessions](https://openai.github.io/openai-agents-python/sessions/) | Session, working memory | Implementation comparison; this lexicon does not assume every session provides durable recovery |
| [OpenAI agent evaluation](https://developers.openai.com/api/docs/guides/agent-evals) | Evaluation, verification, verification-evaluation | English reference for traces, cases and quality assessment |

Observed 2026-10-13. Generic engineering definitions and ownership/priority judgments do not acquire vendor endorsement from these references. Preserve canonical qualifications, examples and limits. Use 智能体 for agent, 上下文 for context, 工具调用 for tool calling, 渐进式披露 for progressive disclosure, 追踪 for trace, 验证 for verification and 评估 for evaluation. Keep MCP, RAG, API and Harness where the canonical identity requires them.

## Acceptance and remaining work

Review each new Chinese unit for meaning, terminology, scope and fingerprint. Mark only accepted units `reviewed` with the actual review date. Until then the shared resolver continues to show current English, and published Chinese eligibility is unchanged. Existing reviewed units retain their original date and text.

| Collection | Reviewed/current | Draft | Missing | Total |
| --- | ---: | ---: | ---: | ---: |
| Concepts | 16 | 140 | 270 | 426 |
| Primitives | 2 | 130 | 354 | 486 |

Skill Map candidates are incomplete: 86 node candidates, all journeys and relation-note translations still remain. Before promoting any English candidate, implement a shared locale-edition contract that keeps the accepted original Chinese prose accessible, tracks translation freshness and applies to pages, search and metadata together. Preserve stable map/node/journey IDs and pinned source snapshots. Schema-valid draft files alone do not establish a published English edition.

Complete the remaining Chinese records in further content batches, including vector examples/distinctions and referenced Concept definitions. Follow [translation acceptance](../../design/translation-overlay.md) and [Skill Map provenance rules](../../design/skill-map.md). Publication is a separate step after concrete editorial review.

## Verification

`npm run check` passed with zero errors, warnings and hints. Translation and online-verifier regressions passed 25/25. Both overview candidates and all 19 node candidates pass the existing input schemas and contain English prose. [Validation evidence](validation.json) records preservation of all existing units, canonical knowledge/maps, current resolved text and publication eligibility. Draft counters change as expected. No browser session is claimed for this batch; a production visit would not show these unmerged draft assets. The new PR's commit-specific CI supplies the required full build and projection/browser gates.
