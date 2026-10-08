## Problem Statement

网站已经通过 pstack 跑通可扩充的 Skill Map，但读者还无法在同一入口理解 Matt Pocock 的技能体系：不知道应该从哪个技能开始、哪些能力由用户显式启动、哪些由 Agent 在工作中调用，以及如何在澄清、规划、实现、调试和交接之间选择。

用户提供的聚合 YAML 是原始材料，包含 31 个候选 Map Node、7 条 Task Journey 和 52 条候选关系，并描述了 42 个逻辑文件的交付结构。附件的格式检查和 `verified` 声明不能替代证据核验。其输入版本和部分教学解释与当前网站契约、固定提交正文存在差异；直接上线会把过期或不准确的流程建议固化为内容。

本 feature 需要建立第二张真实地图，按照上游仓库和 AI Hero 官方教学资料审校内容，通过已有 Content Projections 发布，并证明 pstack 及既有知识内容的身份和行为保持稳定。

## Solution

新增地图身份 `mattpocock`，显示名为 **Matt Pocock Skills Map**。读者从 Skill Maps 索引选择 pstack 或 Matt Pocock，再通过“选择技能、澄清想法、开发功能、修复难 bug、规划巨大工作、改善架构、交接工作”七类任务进入推荐路径；也能在节点目录按本地图分类查阅技能、查看机制和输入输出、沿关系导航，并定位到固定 commit 的来源。

本次是受审校的内容扩充。复用已有独立 YAML 契约、自动发现、页面外壳、目录交互、Search、dataset 和 LLM 导航。上游技能的调用与运行规则以固定提交正文为准，教学情境和任务选择参考 AI Hero；本地图的分类和组合建议保留编辑解读身份。证据核验与编辑接受分别记录，不宣称网站安装或执行这些技能。

## User Stories

1. As a new visitor, I want to see Matt Pocock alongside pstack in the map index, so that I can choose the ecosystem relevant to my work.
2. As a reader, I want a concise scope and source version on the map entry, so that I know which upstream snapshot it describes.
3. As a first-time skill user, I want to start from my task, so that I do not need to memorize 31 skill names.
4. As a reader unsure where to start, I want an ask-matt entry, so that I can understand the router's purpose and limits.
5. As a developer beginning work in a repository, I want to understand setup prerequisites, so that tracker-dependent workflows are usable.
6. As a developer clarifying an idea, I want the repository and no-repository alternatives explained, so that I can choose grill-with-docs or grill-me.
7. As a developer facing an unanswered design question, I want a conditional prototype detour, so that I can obtain a runnable answer before writing a spec.
8. As a developer with a small agreed change, I want a single-session implementation path, so that I avoid unnecessary planning stages.
9. As a developer with multi-session work, I want the spec-and-tickets path, so that the work can be implemented from self-contained decisions.
10. As a developer choosing an implementation mode, I want sequential implement and whole-spec implement-spec shown as alternatives, so that I do not run both by mistake.
11. As a developer implementing a ticket, I want TDD and review identified as capabilities used during implementation, so that I understand which activities are already included.
12. As a contributor receiving an external request, I want the triage on-ramp explained, so that I prepare raw reports before implementation.
13. As a developer with an agent-ready ticket, I want to avoid redundant triage, so that I preserve the planning already completed.
14. As a developer investigating a difficult bug, I want the reproducible feedback prerequisite explained, so that I do not mistake speculation for diagnosis.
15. As a developer planning a large uncertain effort, I want a decision-first wayfinder path, so that unknowns are settled before ordinary implementation planning.
16. As a developer improving architecture, I want the survey, design vocabulary and return to planning distinguished, so that I understand what the survey produces.
17. As a collaborator changing sessions or environments, I want the handoff path, so that useful context survives the transition.
18. As a collaborator blocked on another person's information, I want the questionnaire alternative, so that I can request the missing decisions asynchronously.
19. As a reader, I want each skill's purpose, use cases, mechanism, inputs and outputs, so that I can decide whether it fits my situation.
20. As a reader, I want user-invoked and model-invoked skills distinguished, so that recommendations do not imply automatic invocation.
21. As a reader, I want incoming and outgoing relationships with contextual notes, so that I can understand supported combinations without treating every link as a dependency.
22. As a reader, I want workflow guidance separated from official descriptions, so that I can distinguish source behavior from editorial synthesis.
23. As a reader, I want source links pinned to commits, so that later upstream changes do not silently alter the evidence I read.
24. As a reader, I want shared node names to remain scoped to their map, so that Matt Pocock's tdd or code-review does not link to pstack's node.
25. As a mobile or keyboard user, I want the existing accessible directory and detail pages, so that I can explore the map on my device.
26. As a reader without JavaScript, I want readable content and working detail links, so that essential information remains available.
27. As a site user, I want global search to find maps, nodes and journeys with their ecosystem, so that similarly named skills are distinguishable.
28. As a dataset consumer, I want the new map in skill_maps with accurate counts and deterministic versions, so that I can consume it without changes to existing arrays.
29. As an LLM navigation consumer, I want the map entry and source status in llms navigation, so that I can discover the new material.
30. As a maintainer, I want independently editable records and map-local taxonomy, so that future source revisions do not require ecosystem-specific code.
31. As a maintainer, I want an auditable inventory and semantic correction record, so that I can review why the accepted content differs from the attachment.
32. As a returning reader, I want existing pstack pages and knowledge links preserved, so that adding another ecosystem does not break my references.
33. As a maintainer, I want removed entries to retain their identity and evidence when retired, so that future updates preserve useful references.
34. As a maintainer, I want official teaching coverage distinguished from repository coverage, so that neither the 27-item teaching catalog nor the 31-item map is misleading.

## Implementation Decisions

1. **内容边界。** Skill Map 是独立策划的 Application Resource；页面、目录、关系列表、Search 和导出是同一份内容的 Content Projections。遵守 ADR-0006 至 ADR-0010，保持 Concept、Primitive、Speaking Guide 和地图契约独立。
2. **身份。** 使用 map ID `mattpocock`，节点 ID 使用经核验的上游技能名称；同名节点依靠地图命名空间隔离。身份不包含来源版本。标题变化不改变 ID；当前尚未公开的候选路径 ID 保留附件命名。
3. **来源基线。** 首次发布固定到 `mattpocock/skills` commit `dd400c3ad65e57c06f05e832e0aac92c7992f34d`，上游插件版本为 `1.3.1`，核对日期为 2026-10-07。实施开始时重新核对该提交和 HEAD；如 HEAD 改变，记录差异，不能悄悄更换已定基线。后续版本使用新快照 ID，保留引用中的旧快照。
4. **覆盖范围。** 纳入固定提交中 engineering、productivity 和 misc 的全部 31 个非 in-progress 技能；其中 27 个属于官方插件清单，另外四个为仓库 misc 工具。排除七个 in-progress 技能和已被移除的 resolving-merge-conflicts。这里的范围不等于向用户保证全部技能同等成熟或在所有插件发行渠道中可安装。
5. **证据优先级。** 库存、字段、名称、调用标记和执行规则核对固定提交；AI Hero 的技能课程、ask-matt 和相关教学页支持使用情境及路径解释。教学页与代码正文不同步时，运行语义采用固定提交正文，审计注明教学差异与观测日期，不将两者无说明地拼接。
6. **输入适配。** 聚合附件拆为独立地图元信息、节点、路径及唯一关系表。地图输入版本使用现有 `1.0.0`；dataset 导出契约仍为 `1.1.0`。附件的 `1.1.0` 不能作为升级输入契约的理由。本次不修改 schema，也不把聚合对象或验证报告加入运行集合。
7. **字段核验。** 每个 active 节点保留可定位的源码引用，核验官方描述是否与上游 frontmatter 完整一致；机制、场景、解决的问题和输入输出逐条审校。调用标签从实际 frontmatter 核对，不能根据标题或插件类别猜测。空白、重复与未知字段遵循现有严格输入规则。
8. **分类。** 初始采用附件的 router / workflow / discipline 三类、Entry / Workflow / Discipline 三层和八个能力簇，作为本地图的编辑分类。教学目录的六个分组和上游目录类别是证据背景，不是全站通用枚举；不移植 pstack 的四层，也不要求其他地图符合这些分类。
9. **用户权限。** 用既有标签和正文说明 user-invoked / model-invoked。ask-matt 推荐后停止，由用户启动推荐入口；用户显式调用的技能不展示为另一个技能可自动触发的能力。设置、审批、交接、PR、复盘等条件说明写在既有机制、步骤理由及 when 字段中，不新增权限模型。
10. **七条任务路径。** 保留 choose-a-skill、clarify-an-idea、build-a-feature、fix-a-hard-bug、plan-a-huge-effort、improve-codebase、handoff-work 七个 ID。覆盖设置前提、仓库/无仓库、原型 detour、单 session/多 session、外部请求、调查与交接差异；步骤必须能说明输入、理由、条件和预期产物。
11. **实施方式二选一。** 多 session 功能开发用两个有名称和选择条件的 variants 区分逐 ticket 的 implement 与整个 task graph 的 implement-spec。不能把两者写成同一必选步骤的并行清单。已决定的小工作可直接进入 implement；不要求所有任务都经过 spec 和 tickets。
12. **能力与阶段。** implement 在内部使用 tdd 并在收口时调用 code-review；教学路径说明这种包含关系，不要求用户在完成 implement 后重复整套 TDD。对外部 issue 的 triage 依据来源和准备状态选用，已经 agent-ready 的票不再次 triage。
13. **已知语义修正。** 附件对 tdd 的“每轮随后重构”必须改为固定提交的 red→green，实现阶段之外由审查负责重构。official_description 可保留来源中的 red-green-refactor 触发词，但机制解释须符合正文。retro 提供环境改进候选供人选择，不宣称自动改代码或应用所有建议；pr 编写 PR 说明，不等同发布、合并或远端授权。
14. **条件交接。** 难 bug 路径以可观测复现为前提；架构 survey 或退回设计是情境分支。diagnosing-bugs 到 retro 或架构改善的编辑建议可以保留，但不能称为该技能的自动收尾调用。wayfinder 的主要产物是决策，之后折叠为 spec；prototype 是可抛弃探索，需要时通过 handoff 返回原讨论。
15. **关系表。** 52 条关系是审校基线，不是完成指标。每条关系核对端点、类型、条件及证据支持范围；语义不足的边删除或改型，审计记录理由。routes_to 表示推荐入口，uses 表示实际调用或明确引用的能力，feeds 表示产物可交接，configures 表示建立配置前提；仅共享词汇的引用需在 note 中说明，不称为运行调用。来源定位存在不等于该边已被官方逐字定义。关系环合法，步骤先后不会自动生成依赖边。
16. **官方与编辑内容。** 官方描述与编辑用途分别呈现。任务 variants、条件和跨技能组合标注为根据来源策划的指导，不称“官方执行流程”。保留支持性的 source_refs；对只由上下文推导的边添加说明或撤去不充分的来源宣称。不得按名称相近补造 Concept/Primitive 关联。
17. **教学证据保存。** 在来源审计中为节点、七条路径和候选关系建立对应矩阵，列出固定源码位置、相关 AI Hero URL、观测日期、支持的陈述及审校结论。网站已有来源投影继续链接 Git 快照；AI Hero 教学证据通过审计追溯，不伪装成 Git 来源，也不新增网页来源字段或复制课程全文。misc 技能无教学页时据实记录，只依据仓库解释。
18. **审计和许可。** 从固定提交重建上游 MIT notice，并保存来源库存、附件 hash、机械校验结果和语义变更摘要。VALIDATION.json 若作为交付产物保留，只是审计辅助，运行数据不信任或消费它；核验状态由真实检查得出。用户未提供的独立辅助文件不从聚合 YAML 臆造为既有证据。
19. **页面与导航。** 复用六种既有投影：地图索引、任务入口、节点目录、节点详情、路径详情、结构概览。沿用 Starlight 外壳、主题、样式 token 和手机/桌面交互。节点引用必须在本地图内解析，跨页面地址应用已有 base-path helper。新增内容不产生 mattpocock 专属组件、导航分支或手写索引。
20. **自动投影。** Search 显示所属地图；dataset 在独立 skill_maps 数组加入地图，数量从组装结果计算，已有数组及身份语义保留。更新内容产生新的 dataset_version，保持既有归一规则和 schema_version；llms 导航增加本地图及当前来源状态。首页和 sidebar 的通用 Skill Maps 入口保持现有行为。
21. **测试可扩充性。** 扩充回归中的合成地图测试从真实基线读取地图数量，断言基线 + 新增记录，不继续硬编码两张地图。保留该测试对任意分类、同名节点、退役内容和 pstack 指定行为的保护；这不是新增测试接口或广泛重构。
22. **文档与长期维护。** 更新显示内容数量和范围的公开介绍，提供本地图入口与来源审计入口；详细记录本地图的31/27范围差异。数据模型、既有知识条目、全站样式、部署配置和自动更新机制保持本 feature 之外。后续更新继续按不可变来源快照及 active/retired 契约办理。

## Testing Decisions

**已确认的测试边界：** 用户于 2026-10-07 确认复用现有“独立 YAML → 公共 catalog 读取/校验 → 生产 base 下页面、Search、dataset、llms 导航”的扩充验收入口，覆盖新地图及 pstack 回归；不新增内部接口测试 seam。来源语义核对另作为审计证据，不能用格式测试替代。

- 好测试从公开输入和可见输出验证行为，独立预期来自本 spec 及已核验清单；不检查内部函数调用次数，不按实现重算预期，不用生成出的结果给自己作 expected。
- 在已有公共 catalog 边界证明新地图合法、来源可发布、引用可解析；用现有输入契约、portable schema 和公共校验工具，不发明 mattpocock 专用校验器。
- 以现有“新增第二张地图只需 YAML”的隔离扩充回归为先例，扩展到真实多图基线；在已有测试中观测节点同名隔离、任意分类、退休保留和错误拒绝。不要为了内容扩充增加重复的 schema 单元测试。
- 构建采用生产 `/ai-native-lexicon` base，遍历新地图所有有效节点和路径详情。通过生成 HTML、搜索条目、公开 JSON 和 llms 输出验证可发现性、目标归属和链接，检验失败不接受部分内容上线。
- 检查／测试／扩充回归／L2 验收／构建分别运行现有 `npm run check`、`npm test`、`npm run test:extension`、`npm run test:l2`、`npm run build`。内容变化也需保持 portable-schema drift 为零。
- 在已有页面上进行有代表性的真实浏览器核验：390px 与 1440px、明暗主题、键盘目录筛选、同名技能搜索、空结果与清除、直接访问及无 JS 阅读、map/node/journey 跨页归属。记录截图和浏览器结果，不扩大成新的通用浏览器框架。
- 来源审计检查固定仓库的全部31项、官方插件27项范围、四项misc及七项in-progress排除、全部官方描述、每条来源定位、上游许可；对七条路径和最终每条关系进行人工可检查的语义核对。自动“引用存在”检查不能证明机制解释正确。

### Acceptance criteria

| ID | 可观察完成条件 |
| --- | --- |
| C1 | `mattpocock` 作为独立地图出现在索引；pstack 保持原身份，地图计数按真实内容增加一。 |
| C2 | 固定基线的31个非 in-progress节点全部存在且无重复，官方描述与固定提交一致；7条路径保留稳定ID。 |
| C3 | 原附件schema版本差异被明确适配为输入1.0.0，无新schema字段、导出shape升级或portable drift。 |
| C4 | 31项、27项与七项in-progress的覆盖口径在范围说明及审计中一致；来源commit、版本和真实核验日期可追溯。 |
| C5 | 七条路径的选择条件、可选步骤及输出可阅读；实施方式为明确二选一，tdd/retro/pr/triage语义符合本spec。 |
| C6 | 全部最终关系逐条完成依据审校；52条原始边的保留／改型／删除有记录，关系环不会被错误拒绝。 |
| C7 | 六种投影及全部31个节点、7条路径详情可访问；同名技能和关系始终解析至所属地图，无生产base破链。 |
| C8 | Search 可检索新地图、节点、路径并显示所有者；dataset新增完整记录、准确counts与新digest，既有数组和导出版本稳定；llms包含新入口。 |
| C9 | pstack 的canonical内容、来源、页面身份和已存URL不因扩充而改变；Concept/Primitive/Card身份及关联保持原样。 |
| C10 | 合成地图扩充测试采用基线数量加新增数量，在包含pstack和mattpocock的环境仍通过，既有退休及引用保护保留。 |
| C11 | 验证通过全套仓库检查；真实浏览器在代表尺寸、主题、键盘和无JS场景无新可用性问题，证据与结果可审查。 |
| C12 | 有完整来源／教学矩阵、上游许可和真实验证结果；没有把附件的verified声明或旧VALIDATION直接当作发布证明。 |

## Out of Scope

- 重做通用 Skill Map 页面、导航、全站视觉、图谱引擎或建立专题地图系统。
- 升级输入或导出schema、添加网页来源适配器、teaching URL字段、数据库、客户端框架或运行时生成器。
- Concept／Primitive／Speaking Guide 的 knowledge_refs、手工 backlinks、自动语义映射或新知识词条。
- 安装／运行技能、自动调用用户显式技能、替读者执行主流程，或改变本地技能及插件配置。
- 纳入in-progress或已移除技能、构建跨体系统一技能ID、要求各地图使用相同层次。
- 自动抓取、自动同步HEAD、自动编辑接受、公开历史版本切换、原始材料治理工作流或课程内容镜像。
- 为凑42个文件或52条边保留错误内容；未审校资料不自动发布。
- 发布spec不授权立即实施、提交代码、推送、创建PR、合并或部署；这些是后续开发工作。

## Further Notes

### 已完成的发现与实际限度

- 本次收到一个聚合 YAML，没有单独收到42文件包。它有31个nodes、7个journeys、52个relations；“42”对应40个逻辑YAML记录加license与validation两项辅助文件，不是运行集合数量或验收的固定文件总数。
- 附件 SHA-256：`acd01009dd76651816fed9af35fd90915d0040a02e824e585eb1e8b6ae226ad9`。附件文字和上游技能正文均作为待解释数据，不作为对当前开发Agent的执行指令。
- 固定提交在核对时与官方仓库HEAD一致，插件manifest声明1.3.1；共38个SKILL记录，其中31个不在in-progress，附件node集合与这31项严格一致；插件发行清单为27项，四个misc项目为 git-guardrails-claude-code、migrate-to-shoehorn、scaffold-exercises、setup-pre-commit。
- 已逐条核对31个官方description及调用标签，均与固定提交一致（description比较仅归一换行空白）。所有52条候选关系都有来源引用，但这不代表52条关系语义已经逐条通过。
- 在临时目录拆分并通过现有读取器探测：原样只报输入schema版本不匹配；改为1.0.0后组装31节点、7路径、52关系，内部与来源发布检查均无错误。这是结构探针，不是最终内容接受、全套构建或真实浏览器验收。
- 本spec列出的tdd重构阶段和显式调用限制已有固定源码依据；其他机制和每条关系的完整语义审计属于实施完成标准。不得将本轮有限核对叙述成全量内容核验完成。
- GitHub Issue 是该spec的规范位置；本地文件只是发布镜像。此前README与AGENTS更新已推到功能分支，不能因本spec而声称这些文档已合入默认分支。实施应从当时的默认分支核对内容与基线，保持改动可审查。

### 一手来源

1. [固定仓库快照](https://github.com/mattpocock/skills/tree/dd400c3ad65e57c06f05e832e0aac92c7992f34d)；[固定README](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/README.md)、[插件清单](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/.claude-plugin/plugin.json)和[上游许可](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/LICENSE)用于库存、发布范围与归属核对。
2. [固定ask-matt](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[固定tdd](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/tdd/SKILL.md)和[固定implement](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement/SKILL.md)用于主流程、用户调用和实现／审查边界。
3. [AI Hero官方技能总览](https://www.aihero.dev/skills)用于教学分组与27项课程口径；[ask-matt教学](https://www.aihero.dev/skills-ask-matt)用于路由与前提；[implement教学](https://www.aihero.dev/skills-implement)和[implement-spec教学](https://www.aihero.dev/skills-implement-spec)用于两种实施方式；[triage教学](https://www.aihero.dev/skills-triage)用于外部输入；[v1.3教学更新](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md)用于新版边界背景。网页内容观测于2026-10-07，不能声称具有Git快照式不可变性。
4. 后续审计按待接受内容补充对应的具体技能教学页，并注明没有官方教学页的项目。课程页与仓库库存数量不同，是范围差异，不以任意一方的计数覆盖另一方。
