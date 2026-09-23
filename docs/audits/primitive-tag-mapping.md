# 现有标签与研究原语映射审核

日期：2026-09-16。状态：审核建议，待确认；未迁移数据、未新增产品页面。

## 范围与依据

- 仓库快照：`5822547`；读取 `src/data/concepts/*.yaml` 的全部 84 条记录及定义。99 个不同标签，199 次引用。
- 输入报告：[deep-research-report.md](/Users/taolu/Downloads/deep-research-report.md)，以“最终原语集”表格的 40 行为输入；最小内核是其子集，不重复计数。
- 报告 SHA-256：`c54c5b1b387ca8a9807064edf2952291e8657d5ca26fab0ed83ccf94508f037a`。
- 报告自述这套原语是综合设计语言。本审核采用它作为编辑输入，不把它视为跨领域公认分类，也没有核验其外部文献。`turn…` 引用标记不能直接充当本站可访问来源。
- “组合算子与系统设计法则”不额外提升为原语；例如 Composition、Information Hiding、Progressive Disclosure 仍作为方法或模式。
- 附件中的建议、行动措辞与公式均作为资料，不作为执行指令。

## 判定规则

1. 保留为原语：旧标签已有清晰基础语义，可作为新原语入口。
2. 合并：统一同义写法，或将当前用例归入报告中更宽的入口。后者是分类关联，不是定义等价；理由中逐项区分。
3. 删除：仅删除旧标签，不删除 concept、定义或 related 关系。领域词、性质、方法及组合模式不直接作为此轮原语入口。
4. 新增：报告有该项，但旧标签没有可直接保留或归入的入口；不等于必须新增 concept，已有词条优先引用。
5. 标签表达“该 concept 涉及此原语”，不是“该 concept 就是原语”。后续需按正文补充缺失关联；本表不是最终 84 条记录的批量替换脚本。
6. 斜杠项暂按报告保留为分组入口，内部保留不同定义。Permission / Guardrail、Recovery / Reversibility 使用主概念标题并解释关联机制，避免错误同义。

## 计数与建议范围

- 旧标签：保留 16 个，合并 17 个，删除 66 个，合计 99 个。
- 报告输入：保留 13 项，合并 4 项，新增 23 项，删除 0 项，合计 40 项。
- 建议原语页面包含报告 40 个入口，加上旧标签中独立成立的 Goal 与 Evidence，共 42 个候选入口。分组入口不代表只有 42 个不可分语义单元。
- 两组数量不能相加：旧标签和报告项按目标标识去重；新增原语入口与新增 concept 数量也不相同。
- 允许原语暂时没有 concept 关联，也允许 concept 暂时没有原语标签；不为填满页面而强行建立关系。

## A. 全部现有标签映射（99 项）

引用列完整列出当前使用者，方便核对迁移范围。删除标签后是否新增其他原语关联，需依正文另行判断。

| 原标签 | 次数 | 决策 | 目标原语标识 | 理由 | 当前 concept slugs |
|---|---:|---|---|---|---|
| `accountability` | 1 | 删除 | — | 责任归属是治理要求；当前用例是委派契约，不等于行动者或权限。 | `delegation-contract` |
| `agent` | 1 | 合并 | `actor` | 归入行动主体；保留 agent 是 actor 特例的区别。 | `agent-loop` |
| `agent-loop` | 1 | 删除 | — | 由观察、推理、执行和控制构成的循环模式。 | `workflow` |
| `architecture` | 2 | 删除 | — | 领域与结构总称，不能指向单一原语。 | `context-engineering`, `thin-kernel` |
| `attention` | 1 | 合并 | `resource` | 在 context-budget 中指有限注意力资源；不是 Context 的同义词。 | `context-budget` |
| `authorization` | 2 | 合并 | `permission` | 当前两个用例均指允许采取行动的授权范围。 | `bounded-autonomy`, `permission-boundary` |
| `autonomy` | 2 | 删除 | — | 描述自主程度，依赖能力、权限与控制组合。 | `bounded-autonomy`, `progressive-autonomy` |
| `capability` | 3 | 保留为原语 | `capability-tool` | 保留能力侧入口；skill 的能力不应被误称为可执行 tool。 | `mcp`, `skill`, `tool` |
| `checkpoint` | 1 | 删除 | — | 状态快照机制；保留 Checkpoint concept，不将其改称 State。 | `rollback` |
| `checkpoint-resume` | 2 | 删除 | — | 保存状态与恢复执行的组合模式。 | `checkpoint`, `recovery` |
| `compliance` | 1 | 删除 | — | 符合规则的结果或要求，不是规则本身。 | `policy-as-code` |
| `context` | 14 | 保留为原语 | `context` | 直接表示当前可供推理使用的信息。 | `context-budget`, `context-compression`, `context-engineering`, `context-handoff`, `context-hygiene`, `context-isolation`, `context-pruning`, `context-refresh`, `context-selection`, `context-window`, `context`, `handoff`, `load-bearing-facts`, `progressive-disclosure` |
| `context-budget` | 2 | 删除 | — | 资源限额与上下文的组合；迁移时可另按正文标注 Resource、Constraint。 | `budget`, `context-window` |
| `context-compression` | 1 | 删除 | — | 上下文加工方法，保留 concept。 | `context-pruning` |
| `context-hygiene` | 1 | 删除 | — | 上下文维护实践，不是基础信息单元。 | `context-refresh` |
| `context-pruning` | 1 | 删除 | — | 上下文删减操作，不与 Context 定义合并。 | `context-compression` |
| `context-selection` | 1 | 删除 | — | 选择信息的方法，不与信息集合混为一体。 | `context-isolation` |
| `context-window` | 1 | 删除 | — | 模型容量限制；不能直接替换成 Context。 | `context` |
| `contracts` | 1 | 合并 | `interface` | 当前 retrieval-contract 明确约定输入、来源和输出，是接口契约的实例。 | `retrieval-contract` |
| `control` | 1 | 保留为原语 | `control` | 干预与纠偏的基础作用。 | `graceful-intervention` |
| `control-flow` | 1 | 合并 | `flow` | 当前编排用例体现执行控制的流转；作为 Flow 的专门实例关联。 | `orchestration` |
| `control-loop` | 2 | 合并 | `control` | 当前两个用例均有观察后调整动作的控制循环；仅归类，不宣称同义。 | `agent-loop`, `plan-execute-observe` |
| `coordination` | 3 | 删除 | — | 包含所有权、依赖、沟通与冲突规则的组合活动。 | `handoff`, `orchestration`, `parallelism` |
| `cost` | 1 | 合并 | `resource` | 当前 context-budget 指可消耗的成本预算维度。 | `context-budget` |
| `delegation` | 1 | 删除 | — | 任务、行动者、权限和验收的组合机制。 | `delegation-contract` |
| `delegation-contract` | 1 | 删除 | — | 多项原语构成的委派契约，不能简化成一个接口同义词。 | `delegation` |
| `determinism` | 1 | 删除 | — | 执行性质与设计原则，不是独立结构单元。 | `deterministic-shell` |
| `disclosure` | 1 | 删除 | — | 逐步暴露信息的策略，保留 Progressive Disclosure concept。 | `progressive-disclosure` |
| `enforcement` | 1 | 删除 | — | 规则落实机制；不等于 Rule 或 Permission。 | `policy-as-code` |
| `environment` | 1 | 保留为原语 | `boundary-environment` | 保留环境侧入口，定义中区分环境与划分边界。 | `observation` |
| `eval-driven-development` | 1 | 删除 | — | 以评估驱动的开发方法。 | `evaluation` |
| `evaluation` | 2 | 保留为原语 | `verification-evaluation` | 保留质量评估侧入口，不与单次结果验证等同。 | `eval-driven-development`, `golden-trace` |
| `evidence` | 4 | 保留为原语 | `evidence` | 支持或反驳具体主张的信息；报告中多处使用，但未列为独立项。 | `artifact`, `grounding`, `provenance-chain`, `verification` |
| `execution` | 7 | 保留为原语 | `execution` | 表示实际执行及其状态效果。 | `checkpoint-resume`, `delegation`, `idempotent-action`, `parallelism`, `plan-execute-observe`, `tool-calling`, `workflow` |
| `failure-handling` | 4 | 删除 | — | 失败处理领域总称；逐个 concept 分析恢复、控制等关系。 | `fallback`, `recovery`, `retry`, `rollback` |
| `feedback` | 4 | 保留为原语 | `feedback` | 结果信息进入后续判断的基础关系。 | `feedback`, `grounding`, `observation`, `reflection` |
| `goal` | 5 | 保留为原语 | `goal` | 期望结果与满足条件；与系统为何存在的 Purpose 分开。 | `goal`, `planning`, `subtask`, `task`, `termination` |
| `golden-trace` | 1 | 删除 | — | 代表性轨迹样本与评估模式，不是所有 Trace。 | `trace` |
| `governance` | 7 | 删除 | — | 治理领域，涵盖规则、权限、约束等多个原语。 | `approval`, `budget`, `guardrail`, `permission`, `policy-as-code`, `progressive-autonomy`, `termination` |
| `handoff` | 2 | 删除 | — | 信息和责任转移的组合模式。 | `context-handoff`, `load-bearing-facts` |
| `human-in-the-loop` | 1 | 删除 | — | 人工参与模式，尤其当前 human-on-the-loop 不能直接等同它。 | `human-on-the-loop` |
| `idempotent-action` | 1 | 删除 | — | 动作的幂等性质与实现机制。 | `retry` |
| `instruction` | 3 | 删除 | — | 指令可能包含目标、约束和格式要求，不统一并成 Rule。 | `instructions`, `prompt`, `system-prompt` |
| `instructions` | 3 | 删除 | — | 与 instruction 重复且属于复合指令内容；保留词条。 | `prompt`, `skill`, `system-prompt` |
| `intent` | 1 | 删除 | — | 当前是意图式交互主题，不能等同 Purpose、Goal 或 Plan。 | `intent-interface` |
| `interaction` | 1 | 删除 | — | 交互活动总称，不能据名称映射 Interface 或 Affordance。 | `intent-interface` |
| `intervention` | 2 | 删除 | — | 干预过程可能涉及控制、权限、恢复，需按正文分别标注。 | `graceful-intervention`, `human-on-the-loop` |
| `knowledge` | 3 | 删除 | — | 知识领域与内容总称，不等于跨时间保存的 Memory。 | `provenance-chain`, `rag`, `retrieval` |
| `long-term-memory` | 2 | 合并 | `memory` | 持久记忆的专门类型；保留原 concept 的时间范围。 | `forgetting`, `memory-consolidation` |
| `maintenance` | 1 | 删除 | — | 维护活动总称。 | `context-hygiene` |
| `mechanism` | 1 | 删除 | — | 机制泛称，没有可独立定位的原语语义。 | `thin-kernel` |
| `memory` | 5 | 保留为原语 | `memory` | 跨步骤保留、可再取得的信息；仍需区别工作记忆与长期记忆。 | `forgetting`, `long-term-memory`, `memory-architecture`, `memory-consolidation`, `working-memory` |
| `multi-agent` | 3 | 删除 | — | 多主体场景，不把所有场景词机械改成 Actor。 | `coordination`, `orchestration`, `shared-state` |
| `observability` | 2 | 删除 | — | 系统可观察的性质；不能与具体 Observation 或 Trace 合并。 | `harness`, `inspectable-agency` |
| `observation` | 2 | 保留为原语 | `observation-trace` | 保留观察侧入口，与跨事件轨迹分开说明。 | `feedback`, `plan-execute-observe` |
| `operations` | 1 | 删除 | — | 运营或运行领域总称。 | `agent-ready-organization` |
| `orchestration` | 1 | 删除 | — | 多个行动者和步骤的编排模式。 | `coordination` |
| `organization` | 2 | 删除 | — | 当前表示组织设计领域；不能仅凭词面并成 Actor。 | `agent-ready-organization`, `delegation-contract` |
| `oversight` | 1 | 删除 | — | 监督模式，由观察、规则、控制等组合。 | `human-on-the-loop` |
| `ownership` | 1 | 删除 | — | 责任分配关系，不能消减为技术 Permission。 | `handoff` |
| `permission` | 1 | 保留为原语 | `permission` | 明确主体对资源与操作的授权。 | `approval` |
| `permission-boundary` | 2 | 合并 | `permission` | 当前 guardrail、permission 两处指授权限制；保留边界机制的 concept。 | `guardrail`, `permission` |
| `persistence` | 2 | 删除 | — | 保存性质或机制，在两个用例分别服务 State 和 Memory；无单一映射。 | `checkpoint-resume`, `memory-architecture` |
| `planning` | 1 | 删除 | — | 制定计划的过程；报告 Plan 是产物，不能按同义迁移。 | `replanning` |
| `prompt` | 1 | 删除 | — | 输入载体可包含数据与指令，不等于 Context 或 Rule。 | `instructions` |
| `prompting` | 1 | 删除 | — | 组织模型输入的方法。 | `context-engineering` |
| `provenance` | 1 | 删除 | — | 证据来源属性，不等于证据本身。 | `evidence` |
| `quality` | 1 | 删除 | — | 评价维度与目标性质。 | `eval-driven-development` |
| `rag` | 2 | 删除 | — | 检索与生成的组合模式。 | `retrieval-contract`, `retrieval` |
| `readiness` | 1 | 删除 | — | 组织准备程度。 | `agent-ready-organization` |
| `reasoning` | 6 | 保留为原语 | `reasoning` | 在不完整信息下解释和选择的作用。 | `planning`, `reflection`, `replanning`, `routing`, `task-decomposition`, `tool-selection` |
| `recovery` | 2 | 保留为原语 | `recovery` | 恢复进展的机制；与动作可逆性区别说明。 | `checkpoint-resume`, `failure-containment` |
| `regression` | 1 | 删除 | — | 回归风险或测试用途，不能等同 Verification。 | `golden-trace` |
| `relevance` | 1 | 删除 | — | 信息选择的评价属性。 | `context-selection` |
| `reliability` | 3 | 删除 | — | 系统质量属性，依赖多个原语共同实现。 | `failure-containment`, `idempotent-action`, `load-bearing-facts` |
| `retrieval` | 4 | 删除 | — | 查找信息的操作；报告通过 Memory、Context 和 Capability 组合表达。 | `memory-architecture`, `progressive-disclosure`, `rag`, `retrieval-contract` |
| `retry` | 2 | 删除 | — | 重复操作的恢复策略；不将所有重试当成恢复成功。 | `fallback`, `idempotent-action` |
| `rollout` | 1 | 删除 | — | 发布或扩大授权的过程策略。 | `progressive-autonomy` |
| `runtime` | 4 | 删除 | — | 运行环境泛称，不与具体 Harness 控制壳等同。 | `agent-loop`, `deterministic-shell`, `harness`, `thin-kernel` |
| `safety` | 2 | 删除 | — | 安全目标与性质，不等于 Sandbox 或 Constraint。 | `bounded-autonomy`, `failure-containment` |
| `scope` | 1 | 合并 | `boundary-environment` | 当前 task 指工作范围的内外边界；作为 Boundary 实例关联。 | `task` |
| `security` | 1 | 删除 | — | 安全领域总称，不能只缩减为权限。 | `permission-boundary` |
| `shared-state` | 1 | 合并 | `state` | 多个主体共享的状态特例；并发和所有权仍由 concept 解释。 | `state` |
| `state` | 5 | 保留为原语 | `state` | 显式当前事实与进展表示。 | `artifact`, `checkpoint`, `shared-state`, `state`, `working-memory` |
| `subtask` | 1 | 删除 | — | 嵌套工作单元；不是层级本身，保留 concept。 | `task-decomposition` |
| `task` | 2 | 删除 | — | 目标、输入、约束、责任与完成条件的组合。 | `goal`, `subtask` |
| `testing` | 1 | 删除 | — | 检验方法，不能直接等同 Verification 或 Evaluation。 | `eval-driven-development` |
| `tokens` | 1 | 合并 | `resource` | 当前 context-budget 指受限 token 容量与消耗。 | `context-budget` |
| `tool` | 3 | 合并 | `capability-tool` | 归入可调用工具侧，保留 Tool concept 定义。 | `mcp`, `tool-calling`, `tool-selection` |
| `tool-calling` | 1 | 删除 | — | 调用协议与执行过程，不是 Tool 本体。 | `tool` |
| `tool-selection` | 1 | 删除 | — | 在工具中作选择的推理过程。 | `routing` |
| `tooling` | 1 | 合并 | `capability-tool` | 当前 harness 用例指提供工具能力的设施；只关联工具侧。 | `harness` |
| `tools` | 2 | 合并 | `capability-tool` | tool 的复数归一，两个用例均明确涉及外部工具。 | `deterministic-shell`, `permission-boundary` |
| `traceability` | 1 | 删除 | — | 可追溯性质，区别于实际轨迹或证据对象。 | `provenance-chain` |
| `tracing` | 1 | 合并 | `observation-trace` | 当前 golden-trace 明确记录执行轨迹；关联 Trace 侧，不宣称记录过程就是轨迹。 | `golden-trace` |
| `trust` | 2 | 删除 | — | 信任判断与体验目标。 | `context-hygiene`, `inspectable-agency` |
| `ux` | 3 | 删除 | — | 用户体验领域。 | `graceful-intervention`, `inspectable-agency`, `intent-interface` |
| `verification` | 4 | 保留为原语 | `verification-evaluation` | 保留明确要求下的结果验证侧，不抹平 Evaluation 区别。 | `evaluation`, `evidence`, `trace`, `verification` |
| `working-memory` | 1 | 合并 | `memory` | 报告 Memory 包含跨步骤保存；当前 long-term-memory 用例为对照，关联不表示二者相同。 | `long-term-memory` |

## B. 研究报告原语输入映射（40 项）

标识是建议的 `/primitives/#标识` 锚点，不改动现有 concept slug。“已有 concept”只在语义覆盖范围内复用；“—”表示尚无可直接覆盖该定义的词条。

| 编号 | 报告原始输入 | 决策 | 建议入口 / 标识 | 汇入的旧标签 | 已有 concept 可复用范围 | 理由与边界 |
|---:|---|---|---|---|---|---|
| 01 | Purpose 目的 | 新增 | 目的 / `purpose` | — | — | 与 goal 的期望结果不同；不直接复用 Goal 定义。 |
| 02 | Stakeholder 利益相关者 | 新增 | 利益相关者 / `stakeholder` | — | — | 补充受影响与承担外部性的主体，不限于执行者。 |
| 03 | Actor / Agent 行动者 | 合并 | 行动者 / `actor` | `agent` | — | agent 归入 Actor；组织或人只有承担行动主体角色时才关联。 |
| 04 | Boundary / Environment 边界与环境 | 保留为原语 | 边界与环境 / `boundary-environment` | `environment`, `scope` | — | 复用 environment 标签入口；边界是划分，环境是外部条件，分段定义。 |
| 05 | Constraint 约束 | 新增 | 约束 / `constraint` | — | — | 限制可行空间；不从 safety、compliance 等泛标签推导。 |
| 06 | Invariant 不变量 | 新增 | 不变量 / `invariant` | — | — | 持续成立的性质；区别于一般约束和检查动作。 |
| 07 | Success Criterion 成功判据 | 新增 | 成功判据 / `success-criterion` | — | — | 判定完成的条件；区别于 Goal 与 Verification。 |
| 08 | Entity 实体 | 新增 | 实体 / `entity` | — | — | 具有稳定身份的对象；不把所有名词默认关联为实体。 |
| 09 | Relation 关系 | 新增 | 关系 / `relation` | — | — | 带语义的连接；不同于协调这一组合活动。 |
| 10 | Interface 接口 | 合并 | 接口 / `interface` | `contracts` | — | contracts 的当前用例可关联；Intent Interface 不是通用接口定义。 |
| 11 | Module 模块 | 新增 | 模块 / `module` | — | — | 接口与隐藏内部决策的边界；Thin Kernel 仅是关联案例。 |
| 12 | Hierarchy 层级 | 新增 | 层级 / `hierarchy` | — | — | 嵌套结构；Subtask 是案例，不是同义定义。 |
| 13 | State 状态 | 保留为原语 | 状态 / `state` | `shared-state`, `state` | state | 可复用现有定义的核心；补充通用系统范围时不另建重复词条。 |
| 14 | Event 事件 | 新增 | 事件 / `event` | — | — | 发生的事实，与其观察记录或解释分开。 |
| 15 | Rule / Policy 规则与策略 | 新增 | 规则与策略 / `rule-policy` | — | — | 分清规则与策略范围；Instructions 和 Policy as Code 不直接充当定义。 |
| 16 | Flow 流 | 合并 | 流 / `flow` | `control-flow` | — | control-flow 是当前可归类实例；不把所有 workflow 都视为同义。 |
| 17 | Buffer / Queue 缓冲与队列 | 新增 | 缓冲与队列 / `buffer-queue` | — | — | 共用暂存入口，队列是具体组织方式而非所有缓冲。 |
| 18 | Delay 延迟 | 新增 | 延迟 / `delay` | — | — | 时间滞后；不同于 Resource 中的可用时间预算。 |
| 19 | Resource 资源 | 合并 | 资源 / `resource` | `attention`, `cost`, `tokens` | — | 归纳 attention、cost、tokens；Budget 是资源限额，不是资源本体。 |
| 20 | Capability / Tool 能力与工具 | 保留为原语 | 能力与工具 / `capability-tool` | `capability`, `tool`, `tooling`, `tools` | tool（工具侧） | 能力不必表现为工具；Tool 定义只能覆盖工具侧，Skill 不强制可执行。 |
| 21 | View / Projection 视图与投影 | 新增 | 视图与投影 / `view-projection` | — | — | 派生表示；不要复制底层记录。 |
| 22 | Model 模型 | 新增 | 模型 / `model` | — | — | 此处是对现实的简化表示，不直接等同 LLM 模型。 |
| 23 | Context 上下文 | 保留为原语 | 上下文 / `context` | `context` | context | 复用当前可访问信息语义；对人或组织的扩展需注明范围。 |
| 24 | Memory 记忆 | 保留为原语 | 记忆 / `memory` | `long-term-memory`, `memory`, `working-memory` | — | 存在同名 tag，但无 memory.yaml；用工作记忆和长期记忆作子类型案例。 |
| 25 | Affordance / Signifier 可行动性与提示 | 新增 | 可行动性与提示 / `affordance-signifier` | — | — | 可采取的行动与提示线索必须分开解释，不能视为同义。 |
| 26 | Variety / Uncertainty 多样性与不确定性 | 新增 | 多样性与不确定性 / `variety-uncertainty` | — | — | 可能状态范围与对状态的未知并非同一个量，不直接互换。 |
| 27 | Feedback 反馈 | 保留为原语 | 反馈 / `feedback` | `feedback` | feedback | 可复用结果信息影响后续决定的定义。 |
| 28 | Control 控制 | 保留为原语 | 控制 / `control` | `control`, `control-loop` | — | 存在 tag，无独立 concept；须补明确控制对象与反馈关系。 |
| 29 | Adaptation / Learning 适应与学习 | 新增 | 适应与学习 / `adaptation-learning` | — | — | 经验引起改变的分组；不把 Reflection 自动等同学习发生。 |
| 30 | Emergence 涌现 | 新增 | 涌现 / `emergence` | — | — | 按报告作为复杂系统分析原语；不是可调用组件，限定情境。 |
| 31 | Reasoning 推理 | 保留为原语 | 推理 / `reasoning` | `reasoning` | — | 存在 tag，无独立 concept；报告的 LLM 归属不是普遍排他定义。 |
| 32 | Plan 计划 | 新增 | 计划 / `plan` | — | — | Planning 是过程，Plan 是可检查产物；保留两个含义。 |
| 33 | Execution 执行 | 保留为原语 | 执行 / `execution` | `execution` | — | 存在 tag，无独立 concept；说明实际动作，不把函数执行都保证为成功状态变化。 |
| 34 | Observation / Trace 观察与轨迹 | 保留为原语 | 观察与轨迹 / `observation-trace` | `observation`, `tracing` | observation、trace | 分别引用两个已有定义；单次观察与关联事件轨迹不可互换。 |
| 35 | Verification / Evaluation 验证与评估 | 保留为原语 | 验证与评估 / `verification-evaluation` | `evaluation`, `verification` | verification、evaluation | 分别引用已有定义；质量评分不能替代特定任务结果验证。 |
| 36 | Permission / Guardrail 权限与护栏 | 保留为原语 | 权限（护栏为关联机制） / `permission` | `authorization`, `permission`, `permission-boundary` | permission；guardrail 为关联 | 报告定义主体是授权；Guardrail 还可约束输入和输出，不能作为权限同义词。 |
| 37 | Sandbox 沙箱 | 新增 | 沙箱 / `sandbox` | — | — | 隔离执行环境；不把所有安全控制都归入沙箱。 |
| 38 | Session 会话 | 新增 | 会话 / `session` | — | — | 报告采用可持久恢复的任务会话语义；不宣称所有 session 都是事件日志。 |
| 39 | Harness 驾驭层 | 新增 | 驾驭层 / `harness` | — | harness | 无同名 tag，但已有 concept 可复用；runtime 不是其同义词。限定 AI 运行层。 |
| 40 | Recovery / Reversibility 恢复与可逆性 | 保留为原语 | 恢复（含可逆性讨论） / `recovery` | `recovery` | recovery；rollback 为关联 | 恢复可通过补偿、重试或换路完成，可逆性不保证也非必要同义。 |

## C. 来自旧标签的额外原语输入（2 项）

| 原标签 / 输入 | 决策 | 目标 | 已有 concept | 理由 |
|---|---|---|---|---|
| goal / Goal 目标 | 保留为原语 | `goal` | `goal` | Purpose 说明为什么存在，Goal 说明希望实现什么结果。二者相关但不合并定义。 |
| evidence / Evidence 证据 | 保留为原语 | `evidence` | `evidence` | Observation 提供观察信息，Evidence 表示信息对特定主张的支持关系，Verification 使用证据判断；三者不能互换。 |

## D. 后续关联的具体样例（建议，尚未写入数据）

下表展示为什么不能只做字符串替换。新增关联依据当前 definition，不表示迁移所有词条时沿用同一模板。

| Concept | 旧标签处理结果 | 按正文建议的原语关联 | 依据 |
|---|---|---|---|
| `budget` | governance、context-budget 均删除 | Resource、Constraint | 定义明确限制时间、token、金额等资源。 |
| `harness` | tooling 归入 Capability / Tool；runtime、observability 删除 | Harness、Context、Capability / Tool、Permission、Observation / Trace | 定义明确列举这些运行职责；保留自关联以标明它也是原语。 |
| `planning` | reasoning、goal 保留 | Reasoning、Goal、Plan | 定义明确提出动作与依赖，产物是可修订计划。 |
| `permission-boundary` | authorization、tools 合并；security 删除 | Permission、Capability / Tool、Boundary / Environment | 定义说明资源操作授权与边界；Boundary 按具体语义补充。 |
| `provenance-chain` | evidence 保留；traceability、knowledge 删除 | Evidence、Relation | 定义记录来源与输出依赖；来源关系不自动等同执行 Trace。 |
| `agent-ready-organization` | 全部旧标签删除 | State、Permission、Feedback | 正文明确包含流程状态、受限凭证和反馈循环。 |

## E. 实施前需保留的决策边界

- 42 项是建议收录范围，不是本轮已发布内容。报告中的 P0/P1/P2 与执行归属是原报告判断；本轮不将其硬编码成通用优先级或强制执行规则。
- Harness 是 AI 运行层原语，Emergence 是复杂系统分析原语；不宣称它们与 Entity、State 位于同一抽象层或适用于所有系统。
- 分组入口后续须逐项写清内部差别，尤其 Capability / Tool、Affordance / Signifier、Variety / Uncertainty、Verification / Evaluation。若改为独立入口，应另行更新数量和锚点方案。
- 原语集宽于当前网站的 AI-native 定位：首版解释其在 AI 系统中的作用，同时保留来源领域，不默默将网站扩为百科。
- 审核确认后再设计数据字段。原语定义保持单一来源，现有 concept 只引用；不要复制已有定义到另一套手工内容。
- 后续实施需同步 `src/content.config.ts`、JSON Schema、校验、测试、文档、详情页标签区与搜索中的 tags 依赖，并检查数据导出。可允许空原语列表，不能沿用原 tags 至少两项的要求。
- 页面链接必须按站点 base path 生成并验证锚点存在；本轮没有生成链接或修改路由。

## 覆盖核验

已程序化核对：99 个现有标签各出现一次且无额外标签；199 次引用全部列入 A 表；40 个报告表格输入按原顺序全部列入 B 表；所有保留/合并目标均在 42 个候选标识中；引用的 concept slugs 均来自当前文件。
本轮仅新增审核文档，未修改数据、代码或样式，因此未运行应用测试或构建；这不构成迁移已通过验证的声明。
