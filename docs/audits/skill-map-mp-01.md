# MP-01 Matt Pocock 来源、语义与适配审计

本记录对应 [Spec #34](https://github.com/hilt21/ai-native-lexicon/issues/34) 与 [MP-01 #35](https://github.com/hilt21/ai-native-lexicon/issues/35)。原始技能正文和附件作为待解释资料，未作为当前 Agent 的执行指令。来源核验、编辑解释、测试结果与最终编辑接受分别表达；来源 verified 只覆盖真实库存与官方字段核对，不认证全部用途和关系。此实现供最终审查，不代表部署、安装技能或远端发布。

## 固定来源与范围

- 固定 [仓库快照](https://github.com/mattpocock/skills/tree/dd400c3ad65e57c06f05e832e0aac92c7992f34d)：`dd400c3ad65e57c06f05e832e0aac92c7992f34d`；[插件 manifest](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/.claude-plugin/plugin.json) 版本 1.3.1。观测和核验日期均为 2026-10-07。
- 38 个 SKILL 文件中，31 个属于 engineering/productivity/misc 并全部纳入。27 项属于插件清单；四项额外 misc 是 git-guardrails-claude-code、migrate-to-shoehorn、scaffold-exercises、setup-pre-commit。31 不意味着所有插件或课程渠道都安装31项。
- 排除七项 in-progress：chief-of-staff、claude-handoff、loop-me、setup-ts-deep-modules、writing-beats、writing-fragments、writing-shape；已移除 resolving-merge-conflicts 不纳入。
- 实施时重新观测 HEAD 为 `5da500e727a5878bcd4d3278dfec741e01917652`，新增 ask-matt 对目标 SKILL 正文的核对要求。固定来源仍用 dd400c3a；该 freshness 记录不是自动同步，也没有把新正文混进旧快照。
- 用户实际提供一份聚合附件，SHA-256 `acd01009dd76651816fed9af35fd90915d0040a02e824e585eb1e8b6ae226ad9`。附件的31节点与固定库存一一对应。七路径与52候选边须语义审校；“42文件”指40个逻辑 YAML 加两个辅助产物的包装说明，未收到这些独立辅助文件，也未把旧 VALIDATION 当成证据。
- [库存/官方字段机械比对](skill-map-mp-01-inventory.json) 包含38条源码路径、正文 hash、调用标记、插件成员和排除状态。31条官方 description 按换行空白归一后完整一致；调用标签均按 frontmatter 确认。每个节点机制、情境、输入输出及全部52边另外逐项审阅，不能用引用存在代替语义判断。

## 适配与已有契约

聚合附件拆为 map.yaml、relations.yaml、31份 node、7份 journey，独立编辑身份由现有目录/文件名提供。原 spec 的1.0.0适配先完成并通过公共链路；用户于2026-10-07明确批准使用 WEB-01 已有的1.1.0输入与逐字段语言元数据。因此最终地图采用1.1.0，中文正文/分类/路径注释为 zh-Hans，英文名称/官方描述及纯英文段落为 en；IDs、引用、日期和来源不加注释。混合中英文字段按正文主语言标注，未拆分或复制 canonical strings。三类/三层/八簇仍是编辑分类，教学六组与上游目录是不同口径，不强求 pstack 共用。

实施基线已包含 WEB-01：支持1.0.0/1.1.0 map 输入，既有 pstack 使用1.1.0，dataset 导出形状已为1.2.0。父 spec 在较早基线写的导出1.1.0不再是当前状态；用户本轮批准的数据适配保留 inherited1.2.0，没有降版或修改 schema/UI。语言注释只使用现有1.1.0可选字段，依靠现有路径/edition校验，并随着后续数组编辑维护索引。一次性的适配过程写出显式 hints，网站不做自动语言检测。

没有新增 runtime、专用页面/分支、manual index、知识引用或第二份关系。pstack、Concept、Primitive、Card canonical 文件与 lockfile 在本票 diff 中保持不变；生产路由、现有关联及 Card anchors 由既有投影继续提供。保留来源快照、active/retired 身份和后续更新审查规则。

## 31项来源与编辑处置

全部官方描述和调用标签已经机械核对；下表记录正文支持边界及实际中文编辑处置，不复制 canonical 节点定义。空 handoffs 保持为空，不从文字重新造边。solves 表达编辑使用目标，不是经过实验的效果保证。user-invoked 入口由用户决定；model-invoked 能力可以由工作流在适用条件下引用。

| Node | 固定正文 | 官方字段结论 | 编辑处置/支持限制 |
| --- | --- | --- | --- |
| ask-matt | [skills/engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) | user-invoked；描述一致 | 补充推荐后停止、用户显式启动与工程配置前提。 |
| code-review | [skills/engineering/code-review/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/code-review/SKILL.md) | model-invoked；描述一致 | 移除混合 verdict，保留 Standards / Spec 两轴发现；固定点与审查边界按正文。 |
| codebase-design | [skills/engineering/codebase-design/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/codebase-design/SKILL.md) | model-invoked；描述一致 | 输出改为共享词汇、设计原则与条件性接口方案，不承诺独立架构 survey。 |
| diagnosing-bugs | [skills/engineering/diagnosing-bugs/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/diagnosing-bugs/SKILL.md) | model-invoked；描述一致 | 先运行可捕获症状的红反馈；flake 采用固定高复现率，回归测试只在正确 seam 上建立，缺失 seam 明记。 |
| domain-modeling | [skills/engineering/domain-modeling/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/domain-modeling/SKILL.md) | model-invoked；描述一致 | ADR 限定为难逆转、意外性与实质 tradeoff 同时存在的决定。 |
| git-guardrails-claude-code | [skills/misc/git-guardrails-claude-code/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/misc/git-guardrails-claude-code/SKILL.md) | model-invoked；描述一致 | 限定 Claude Code 项目/全局 hooks，区分阻止所有 push 与危险命令判断。 |
| grill-me | [skills/productivity/grill-me/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/grill-me/SKILL.md) | user-invoked；描述一致 | 保留无状态 wrapper；无 working directory 情境来自 ask-matt 与教学，不输出本地领域文件。 |
| grill-with-docs | [skills/engineering/grill-with-docs/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/grill-with-docs/SKILL.md) | user-invoked；描述一致 | 明确内部组合 grilling/domain-modeling、选择性 ADR 与共同理解确认。 |
| grilling | [skills/productivity/grilling/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/grilling/SKILL.md) | model-invoked；描述一致 | 明确 ready frontier、推荐、等待真人决定及完成时的共同理解确认。 |
| handoff | [skills/productivity/handoff/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/handoff/SKILL.md) | user-invoked；描述一致 | 明确 OS 临时 Markdown、技能/产物指针及 portability/fork 条件，不把普通 session 变化都当 handoff。 |
| implement | [skills/engineering/implement/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement/SKILL.md) | user-invoked；描述一致 | 明确已确认 seam、where possible TDD、内部 review、当前分支 commit，不附加远端授权。 |
| implement-spec | [skills/engineering/implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement-spec/SKILL.md) | user-invoked；描述一致 | 保留 task graph/worktree/integration 分支/最终审查，明确与逐票 implement 二选一及直接 TDD 调用。 |
| improve-codebase-architecture | [skills/engineering/improve-codebase-architecture/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/improve-codebase-architecture/SKILL.md) | user-invoked；描述一致 | 增加历史热点、survey/deletion test/临时 HTML，等待用户选中后设计；调查不自动改源码。 |
| migrate-to-shoehorn | [skills/misc/migrate-to-shoehorn/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/misc/migrate-to-shoehorn/SKILL.md) | model-invoked；描述一致 | 明确测试限定与 fromPartial/fromExact/fromAny 的不同意图，保留类型检查。 |
| pr | [skills/engineering/pr/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/pr/SKILL.md) | model-invoked；描述一致 | 限定写 PR body，不等于创建/推送/合并；另保留 show-me / Dex Horthy / Humanlayer 来源归属。 |
| prototype | [skills/engineering/prototype/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/prototype/SKILL.md) | model-invoked；描述一致 | 改为代码靠近目标模块/页面；原型结论、throwaway 分支与 issue 指针保留，handoff 是条件分支。 |
| research | [skills/engineering/research/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/research/SKILL.md) | model-invoked；描述一致 | 保留后台 Agent、一手来源与有引用的 repo Markdown；事实供设计决策使用。 |
| retro | [skills/engineering/retro/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/retro/SKILL.md) | user-invoked；描述一致 | 明确读 session 原始记录、当前记录默认与 writing-for-agents；只建议候选供人选择。 |
| scaffold-exercises | [skills/misc/scaffold-exercises/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/misc/scaffold-exercises/SKILL.md) | model-invoked；描述一致 | 限定课程模板、编号/default explainer 和 ai-hero-cli lint，不宣称通用 scaffold。 |
| setup-matt-pocock-skills | [skills/engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/setup-matt-pocock-skills/SKILL.md) | user-invoked；描述一致 | 先探索、确认 tracker 草稿，single-context 默认、triage 条件配置；输出项目文档而非安装技能。 |
| setup-pre-commit | [skills/misc/setup-pre-commit/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/misc/setup-pre-commit/SKILL.md) | model-invoked；描述一致 | 尊重包管理器与 formatter，类型检查/测试只接已有 scripts，smoke check 后提交。 |
| tdd | [skills/engineering/tdd/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/tdd/SKILL.md) | model-invoked；描述一致 | 改为已确认 seam 的 red→green 单片；重构归审查；独立预期不由实现重算。 |
| teach | [skills/productivity/teach/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/teach/SKILL.md) | user-invoked；描述一致 | 增加 mission/可信资料、引用式交互 HTML、reference 与持久学习 workspace；不保证掌握。 |
| to-questionnaire | [skills/productivity/to-questionnaire/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/to-questionnaire/SKILL.md) | user-invoked；描述一致 | 明确收件人/结果访谈、当前目录文件与回答空位；读者分发，收到答案再回原流程。 |
| to-spec | [skills/engineering/to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/to-spec/SKILL.md) | user-invoked；描述一致 | 保留需求综合但补充代码探索与测试 seam 的用户确认，再发布 agent-ready spec。 |
| to-tickets | [skills/engineering/to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/to-tickets/SKILL.md) | user-invoked；描述一致 | 明确 demoable 单context vertical tracer bullets、prefactor先做及宽重构例外；批准granularity/blocking后发布，生成票无需triage。 |
| triage | [skills/engineering/triage/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/triage/SKILL.md) | user-invoked；描述一致 | 限定原始外部输入、先建议并等维护者方向，再验证与条件性 grilling 与多种结果，外部 PR 自动发现默认 off。 |
| wait-what | [skills/productivity/wait-what/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/wait-what/SKILL.md) | user-invoked；描述一致 | 保留重新解释并标明源码 STE 写作指令，不冒称 verified compliance。 |
| wayfinder | [skills/engineering/wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/wayfinder/SKILL.md) | user-invoked；描述一致 | 决策图默认、每 session 一张非研究票、研究可并行及真实 HITL；Notes 可覆盖默认。 |
| wizard | [skills/engineering/wizard/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/wizard/SKILL.md) | model-invoked；描述一致 | 改为生成与静态验证，人执行；采集配置属于后续人运行结果。 |
| writing-for-agents | [skills/productivity/writing-for-agents/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/writing-for-agents/SKILL.md) | model-invoked；描述一致 | 输出指导或当前任务编辑结果，强调完成条件/渐进披露/指针/pruning，而非自动全量生成。 |

## 全部52候选边的最终处置

最终51条：保留51、删除1、改型0、新增0。编号保持附件顺序。每条最终边补充了实际支持范围/条件；源码链接是可检查依据，关系本身仍为编辑解读。routes_to 是推荐，feeds 是产物交接，uses 是实际调用或明确参考，configures 是项目前提。引用词汇的 uses 特别限制为条件参考。prototype/handoff 的合法环保留，图不是执行 DAG。

| # | 附件候选 | 最终处置 | 支持范围与限制 | 固定依据 |
| --- | --- | --- | --- | --- |
| 1 | ask-matt → setup-matt-pocock-skills (routes_to) | 保留，补充条件/依据 | 首次工程流程且项目配置缺失时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 2 | ask-matt → grill-with-docs (routes_to) | 保留，补充条件/依据 | 有 working directory 且设计仍未清晰时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 3 | ask-matt → triage (routes_to) | 保留，补充条件/依据 | 原始外部请求尚未准备好；不包括 to-tickets 生成的票时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 4 | ask-matt → improve-codebase-architecture (routes_to) | 保留，补充条件/依据 | 希望调查架构或维护机会时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 5 | ask-matt → to-spec (routes_to) | 保留，补充条件/依据 | 决定已清晰且需要多 session 规格时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 6 | ask-matt → to-tickets (routes_to) | 保留，补充条件/依据 | 已有 spec 且需要自包含执行票据时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 7 | ask-matt → implement (routes_to) | 保留，补充条件/依据 | 小而明确的工作或一张 agent-ready 票时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 8 | ask-matt → implement-spec (routes_to) | 保留，补充条件/依据 | 选择整图编排，与逐票 implement 二选一时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 9 | ask-matt → wayfinder (routes_to) | 保留，补充条件/依据 | 工作太大且前往目标的路线尚不清晰时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 10 | ask-matt → retro (routes_to) | 保留，补充条件/依据 | 用户希望回看 session 的环境摩擦，原记录仍可查时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 11 | ask-matt → grill-me (routes_to) | 保留，补充条件/依据 | 没有 working directory，需要无状态澄清时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 12 | ask-matt → handoff (routes_to) | 保留，补充条件/依据 | 需要新 harness、新目录、交给同事或阶段中分出侧任务时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 13 | ask-matt → teach (routes_to) | 保留，补充条件/依据 | 需要在教学 workspace 跨 session 学习时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 14 | ask-matt → to-questionnaire (routes_to) | 保留，补充条件/依据 | 缺失信息由另一位利益相关者掌握时推荐此入口，推荐后停止；用户决定是否显式启动。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 15 | setup-matt-pocock-skills → triage (configures) | 保留，补充条件/依据 | 建立 tracker、标签与领域文档等项目前提，不代表安装技能或自动调用后续入口。 | [engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/setup-matt-pocock-skills/SKILL.md) |
| 16 | setup-matt-pocock-skills → to-spec (configures) | 保留，补充条件/依据 | 建立 tracker、标签与领域文档等项目前提，不代表安装技能或自动调用后续入口。 | [engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/setup-matt-pocock-skills/SKILL.md) |
| 17 | setup-matt-pocock-skills → to-tickets (configures) | 保留，补充条件/依据 | 建立 tracker、标签与领域文档等项目前提，不代表安装技能或自动调用后续入口。 | [engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/setup-matt-pocock-skills/SKILL.md) |
| 18 | setup-matt-pocock-skills → implement-spec (configures) | 保留，补充条件/依据 | 建立 tracker、标签与领域文档等项目前提，不代表安装技能或自动调用后续入口。 | [engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/setup-matt-pocock-skills/SKILL.md)、[engineering/implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement-spec/SKILL.md) |
| 19 | grill-with-docs → grilling (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/grill-with-docs/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/grill-with-docs/SKILL.md) |
| 20 | grill-with-docs → domain-modeling (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/grill-with-docs/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/grill-with-docs/SKILL.md) |
| 21 | grill-me → grilling (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [productivity/grill-me/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/grill-me/SKILL.md) |
| 22 | triage → grilling (uses) | 保留，补充条件/依据 | 只有验证及处理方向确定后，仍需 fleshing out 的请求才内部调用 grilling。 | [engineering/triage/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/triage/SKILL.md) |
| 23 | improve-codebase-architecture → codebase-design (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/improve-codebase-architecture/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/improve-codebase-architecture/SKILL.md) |
| 24 | improve-codebase-architecture → grilling (uses) | 保留，补充条件/依据 | 先等待用户选择候选，再内部调用 grilling 深入该方向；不自动选择或重构所有候选。 | [engineering/improve-codebase-architecture/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/improve-codebase-architecture/SKILL.md) |
| 25 | to-spec → to-tickets (feeds) | 保留，补充条件/依据 | 适用条件下，前一阶段的产物供用户选择下一入口；不是自动启动用户技能。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 26 | to-tickets → implement (feeds) | 保留，补充条件/依据 | 已批准的自包含票据供用户逐票实施；与整图 implement-spec 二选一。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 27 | to-tickets → implement-spec (feeds) | 保留，补充条件/依据 | 已批准的票据图供用户整图编排；与逐票 implement 二选一。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 28 | triage → implement (feeds) | 保留，补充条件/依据 | 只在外部输入已形成 agent-ready brief 后交接实施；to-tickets 已准备的票不重复 triage。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 29 | implement → tdd (uses) | 保留，补充条件/依据 | 固定正文要求尽可能在事先约定的 seam 上使用 TDD；不是事后重复的独立阶段。 | [engineering/implement/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement/SKILL.md) |
| 30 | implement → code-review (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/implement/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement/SKILL.md) |
| 31 | implement-spec → tdd (uses) | 保留，补充条件/依据 | 各 implementer 直接调用 model-invoked 的 TDD；编排者没有自动调用 user-invoked 的 implement。 | [engineering/implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement-spec/SKILL.md) |
| 32 | implement-spec → code-review (uses) | 保留，补充条件/依据 | 所有票据合入 integration branch 后做一次全图审查，不要求再重复每票独立审查。 | [engineering/implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement-spec/SKILL.md) |
| 33 | implement → pr (feeds) | 保留，补充条件/依据 | 需要 PR 交付时，代码与验证证据供 Agent 编写 PR body；此关系不授予远端发布或合并权限。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 34 | implement-spec → pr (feeds) | 保留，补充条件/依据 | integration branch 与统一 review 的证据可用于 PR body；是否创建或合并由任务授权决定。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 35 | implement → retro (feeds) | 保留，补充条件/依据 | 实施记录可供用户复盘环境；retro 输出候选，不自动应用建议。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 36 | implement-spec → retro (feeds) | 保留，补充条件/依据 | 整图实施的 session 证据可供用户复盘环境；不是编排者自动应用建议。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 37 | wayfinder → research (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/wayfinder/SKILL.md) |
| 38 | wayfinder → prototype (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/wayfinder/SKILL.md) |
| 39 | wayfinder → grilling (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/wayfinder/SKILL.md) |
| 40 | wayfinder → to-spec (feeds) | 保留，补充条件/依据 | 当决策地图清晰后，由用户启动 to-spec 折叠决策；不是跳过规格直接交付代码。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 41 | diagnosing-bugs → tdd (uses) | 删除 | diagnosing-bugs 与 ask-matt 均未规定调用 tdd；相似回归方法不证明 uses。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 42 | diagnosing-bugs → retro (feeds) | 保留，补充条件/依据 | 修复后由用户选择在同一 session 复盘；这是 ask-matt 的条件性教学建议，不是自动收尾调用。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 43 | diagnosing-bugs → improve-codebase-architecture (feeds) | 保留，补充条件/依据 | 仅当缺少可观察和锁定行为的 seam 时，由用户选择架构 survey；不是自动重构。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 44 | retro → writing-for-agents (uses) | 保留，补充条件/依据 | 固定正文实际调用或明确引用此能力；能力的适用条件继续以对应技能正文为准。 | [engineering/retro/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/retro/SKILL.md) |
| 45 | prototype → handoff (feeds) | 保留，补充条件/依据 | 仅当跨目录、新 harness、交给同事或阶段中分出的侧任务需要 portability 时，交接原型问题、结论及来源指针；普通返回讨论不需要 handoff。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 46 | handoff → prototype (feeds) | 保留，补充条件/依据 | 只有需要 portable context 的 prototype detour 才经 handoff；独立原型源码要求代码靠近相关模块或页面。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 47 | prototype → grill-with-docs (feeds) | 保留，补充条件/依据 | 原型回答设计问题后，可将结论（必要时经 handoff）带回原讨论；不自动调用用户入口。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 48 | research → grill-with-docs (feeds) | 保留，补充条件/依据 | 带引用的研究结果供原讨论继续澄清；研究不能代替需求决策，不自动调用用户入口。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 49 | to-questionnaire → grill-with-docs (feeds) | 保留，补充条件/依据 | 取得外部回答后，用户可选择继续设计讨论；问卷不是自动发送或自动启动讨论。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 50 | to-questionnaire → to-spec (feeds) | 保留，补充条件/依据 | 取得回答且决策足够清晰后，可作为规格输入；用户显式启动 to-spec。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 51 | improve-codebase-architecture → grill-with-docs (feeds) | 保留，补充条件/依据 | 用户选中 survey 候选后，将它作为新的 idea 带回主流程；不自动实施全部建议。 | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md) |
| 52 | tdd → codebase-design (uses) | 保留，补充条件/依据 | 明确引用同一套 seam/deep-module 词汇；仅当公共测试界面的形状还需讨论时查阅，不是每片都运行的阶段。 | [engineering/tdd/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/tdd/SKILL.md) |

## 七条路径的来源与分支

路径ID保留。多session实现拆成两条明确二选一的 variants：multi-session-sequential 与 multi-session-orchestrated。single-session 只适用于已明确的小工作；incoming-request 只用于原始外部请求。TDD/review 在 implement/implement-spec 内部，不追加重复人工阶段。难bug路径撤去 tdd 必经步骤，diagnosing-bugs 自己做条件回归。配置、repo/no-repo、prototype 往返、用户复盘、PR body 和外部问卷接收等条件均写在既有 when/why/outputs 字段。

| Journey ID | 分支 | 固定依据 |
| --- | --- | --- |
| build-a-feature | multi-session-sequential / multi-session-orchestrated / single-session / incoming-request | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/setup-matt-pocock-skills/SKILL.md)、[engineering/to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/to-spec/SKILL.md)、[engineering/to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/to-tickets/SKILL.md)、[engineering/implement/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement/SKILL.md)、[engineering/implement-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/implement-spec/SKILL.md) |
| choose-a-skill | standard | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/setup-matt-pocock-skills/SKILL.md) |
| clarify-an-idea | in-repo / no-repo | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[engineering/grill-with-docs/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/grill-with-docs/SKILL.md)、[productivity/grill-me/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/grill-me/SKILL.md)、[engineering/prototype/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/prototype/SKILL.md)、[productivity/handoff/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/handoff/SKILL.md)、[engineering/to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/to-spec/SKILL.md) |
| fix-a-hard-bug | standard | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[engineering/diagnosing-bugs/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/diagnosing-bugs/SKILL.md)、[engineering/code-review/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/code-review/SKILL.md)、[engineering/retro/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/retro/SKILL.md)、[engineering/improve-codebase-architecture/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/improve-codebase-architecture/SKILL.md) |
| handoff-work | agent-handoff / human-questionnaire | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[productivity/handoff/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/handoff/SKILL.md)、[productivity/to-questionnaire/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/productivity/to-questionnaire/SKILL.md) |
| improve-codebase | standard | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[engineering/improve-codebase-architecture/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/improve-codebase-architecture/SKILL.md)、[engineering/codebase-design/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/codebase-design/SKILL.md) |
| plan-a-huge-effort | standard | [engineering/ask-matt/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/ask-matt/SKILL.md)、[engineering/wayfinder/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/wayfinder/SKILL.md)、[engineering/to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/to-spec/SKILL.md)、[engineering/to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/to-tickets/SKILL.md) |

## AI Hero 教学矩阵

以下27页与官方目录由来源探索逐页打开，统一观测日期2026-10-07；正文对应矩阵用于补充使用情境，不把网页冒充 Git 快照。源码与简短教学宣传不同时，以固定目标正文为准，特别是 tdd 的 red→green、prototype 保留原型来源、to-spec 确认测试 seam。四项misc在这27项教学目录中没有单独页面，按固定仓库审校，不据此声称互联网不存在任何其他页面。

| Node / live primary page | Teaching support / limit |
| --- | --- |
| [ask-matt](https://www.aihero.dev/skills-ask-matt) | Router recommends then stops; only own manually maintained set. Notes target SKILL body outranks router; live issue/freshness discussion is mutable, not pinned behavior. |
| [setup-matt-pocock-skills](https://www.aihero.dev/skills-setup-matt-pocock-skills) | Repo-local docs/agents config, existing steering block, confirm before writing; not global installation. |
| [grill-with-docs](https://www.aihero.dev/skills-grill-with-docs) | Stateful single-session interview; inline domain terms, selective ADR; no-repo wrapper/large-foggy-map alternatives. |
| [to-spec](https://www.aihero.dev/skills-to-spec) | Already-agreed conversation → tracker spec; page's simplified no-new-decisions slogan must not hide fixed body's test-seam check. |
| [to-tickets](https://www.aihero.dev/skills-to-tickets) | Tracer bullets, blocking graph, fresh-session input; ready tickets skip triage; expand-contract exception. |
| [implement](https://www.aihero.dev/skills-implement) | User-only, current-branch commit; agreed same-thread small work is valid context case; no automatic branch/close/PR lifecycle. |
| [code-review](https://www.aihero.dev/skills-code-review) | Standards and Spec independent; no blended verdict; fixed point supplied, empty/bad diff rejected. |
| [retro](https://www.aihero.dev/skills-retro) | Proposes environmental improvements by severity, only user chooses changes; code verdict belongs to review. |
| [wayfinder](https://www.aihero.dev/skills-wayfinder) | Too big AND route unclear; planning decision map default; source's explicit Notes override limits blanket no-execution wording. |
| [prototype](https://www.aihero.dev/skills-prototype) | Question selects logic HTML vs UI variations; header says delete but body/source preserve branch as primary evidence. Use body nuance. |
| [research](https://www.aihero.dev/skills-research) | Background primary-source reading, one cited repo file; finding facts is different from choosing decisions. |
| [improve-codebase-architecture](https://www.aihero.dev/skills-improve-codebase-architecture) | Survey/report/pick/grill; no code rewrite in survey; candidate-selection prerequisite. |
| [diagnosing-bugs](https://www.aihero.dev/skills-diagnosing-bugs) | One already-red command before theory, six phases; wrong seam flagged; user may start architecture survey. Distinguishes diagnosis from planned TDD. |
| [triage](https://www.aihero.dev/skills-triage) | Raw incoming reports, recommend/wait, verify before brief; external PR flag off by default; generated tickets already ready. |
| [wizard](https://www.aihero.dev/skills-wizard) | Agent generates/static-checks script, human runs manual procedure; ephemeral by default. |
| [implement-spec](https://www.aihero.dev/skills-implement-spec) | Whole graph/worktrees/integration review vs per-ticket implement; draft lifecycle conditional on tracker/user. |
| [grill-me](https://www.aihero.dev/skills-grill-me) | Stateless conversation/no workspace; fixed router recommends docs wrapper when working directory exists. |
| [handoff](https://www.aihero.dev/skills-handoff) | Portability/fork, not ordinary compression; OS-temp output and conditional phase-boundary choice. |
| [to-questionnaire](https://www.aihero.dev/skills-to-questionnaire) | Interview sender/needed knowledge, draft for one external person; received answers return to original thinking. |
| [teach](https://www.aihero.dev/skills-teach) | Stateful mission/trusted sources/HTML lessons and retained records; not a passing explanation. |
| [wait-what](https://www.aihero.dev/skills-wait-what) | User indicates lost understanding; re-pitch with context/domain vocabulary. Fixed body specifies STE wording, no verified-compliance guarantee. |
| [writing-for-agents](https://www.aihero.dev/skills-writing-for-agents) | Reference for agent docs and pointers; context/human loads and pruning, not content research. |
| [pr](https://www.aihero.dev/skills-pr) | PR body shape only; Summary/Evidence/Merge Danger; never push/open/merge or resolve feedback. |
| [codebase-design](https://www.aihero.dev/skills-codebase-design) | Reference vocabulary, no standalone required process/artifact; survey separate. Optional deeper design pattern in source remains accessible. |
| [domain-modeling](https://www.aihero.dev/skills-domain-modeling) | Actively changes vocabulary, inline glossary and selective ADR, different from passively borrowing terms. |
| [grilling](https://www.aihero.dev/skills-grilling) | Ready-frontier rounds, human decisions, environmental facts researched; reusable wrappers own persistence. |
| [tdd](https://www.aihero.dev/skills-tdd) | Body explicitly red→green, refactoring at review; live title/catalog still say red-green-refactor. Preserve title only as teaching discrepancy, not operating rule. |

[Official catalog](https://www.aihero.dev/skills) has 27 skills across six teaching groups. Its short prototype and TDD teasers lag the nuanced bodies. Six teaching groups differ intentionally from the map's editorial 3 types/3 layers/8 clusters; do not treat them as a contradiction or global taxonomy requirement.



七路径的教学依据按相同节点页追溯：choose-a-skill→ask-matt/setup；clarify-an-idea→grill-with-docs/grill-me/prototype/handoff/to-spec；build-a-feature→ask-matt/to-spec/to-tickets/implement/implement-spec/pr/retro/triage；fix-a-hard-bug→diagnosing-bugs/retro/improve-codebase-architecture；plan-a-huge-effort→wayfinder/to-spec/to-tickets；improve-codebase→improve-codebase-architecture/codebase-design；handoff-work→handoff/to-questionnaire。关系的教学情境同样从端点页及 ask-matt 页读取，实际调用细节只取上表固定正文。

另核对 [v1.3教学更新](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md) 的版本背景；网页观测日期不等同不可变更新时间。

## 许可与接受边界

从固定快照直接保留 [完整 MIT notice](../../src/data/skill-maps/mattpocock/SOURCE-LICENSE.txt)，Copyright (c) 2026 Matt Pocock。上游 pr 元数据另注明其 show-me 来源为 Dex Horthy / Humanlayer，参见 [固定pr](https://github.com/mattpocock/skills/blob/dd400c3ad65e57c06f05e832e0aac92c7992f34d/skills/engineering/pr/SKILL.md) 与 [注明的show-me来源](https://github.com/humanlayer/skills/blob/main/plugins/show-me/skills/show-me/SKILL.md)。本报告不把上游内容误称为本站原创，也不镜像 AI Hero 文章全文。

## 实际验证

2026-10-07，Node 24.19.0、lockfile 一致的独立检出；没有修改依赖、schema、UI、部署配置或既有 canonical 数据。验证沿用户已确认的独立 YAML → 公共 catalog → 生产 base 页面/Search/dataset/llms 边界完成。

| 检查 | 实际结果 |
| --- | --- |
| TDD red | 既有扩充入口先因公共 catalog 缺少 mattpocock 失败，node:test exit 1。 |
| TDD green / 最终受影响回归 | 原入口新增本图后通过；最终1.1.0语言注释和语义修正后再次通过1/1。覆盖31节点、7路径全部详情、六种投影、Search、llms、export版本和基线+合成地图计数。 |
| npm run check | portable schema无漂移；84个Astro文件0 errors / 0 warnings / 0 hints；84 Concepts、42 Primitives、20 Cards、2 Maps公共catalog及来源校验通过。 |
| npm test | 74/74通过。 |
| npm run test:extension | 13/13通过，保留任意分类、同名节点隔离、退休页/来源与既有pstack路径保护。随后对最终语言注释及内容修正只重复受影响的地图投影回归。 |
| npm run test:l2 | 既有五组验收全部PASS：公共路由/链接、空分类/层、完整扩充投影、非法输入/只读drift拒绝、独立清理与原内容稳定。 |
| npm run build | 生产 `/ai-native-lexicon` base，278静态页面、Pagefind索引正常，exit 0。 |
| 基线/导出核对 | [公共catalog及digest证据](skill-map-mp-01-parity.json)：既有三集合和pstack组装数据与Git基线深等；新图使dataset digest变化，导出shape保持1.2.0，counts为84/42/20/2。 |
| 来源复核 | 独立来源审查复核38正文hash、31官方描述/调用标记及MIT完整字节一致；六组语义发现全部修正并复核关闭，无未解决语义发现。 |

[真实浏览器结果](skill-map-mp-01-browser.json)：Chrome 154.0.8037.98，六种页面 × 390/1440px × light/dark共24组合，每页单h1/main，页面宽度不超过viewport。另验证31节点目录、名称筛选/所属地图、无结果/清除/键盘焦点、逐字段语言及固定来源、实施方式二选一、全站Search同名隔离/空结果恢复，以及禁用JavaScript的任务/节点/路径直接阅读与导航。最终语义修正后复核通过。

[任务入口桌面截图](assets/skill-map-mp-01-tasks-desktop.png) / [节点详情手机截图](assets/skill-map-mp-01-node-mobile.png)。这些是实际生产base静态页面的浏览器截图，不是设计稿。历史L2输出的测试副产物已恢复，当前证据只保存在本票审计资料中。

本记录报告本地验证与来源审校，不能代替远端CI、最终Standards/Spec代码审查、维护者编辑接受或部署状态；未推送、未创建PR、未修改Issue，也未安装或执行上游技能。
