## Parent

[Spec #34：接入 Matt Pocock Skill Map：一手来源审校与多图投影验收](https://github.com/hilt21/ai-native-lexicon/issues/34)

本票对应父 spec 的全部 User Stories、Implementation Decisions 和 C1–C12；父 spec 是范围与内容决策的规范依据。拆票时核对父票为 OPEN、没有追加评论，正文 SHA-256 为 `365ad951f27c8c872afd710963ab1a59cb1791941e45f49ee63bf0cbbb144963`。实施前读取其完整正文和最新讨论，若决策变化先核对影响，不依赖本票摘要猜测。

## What to build

交付一张可从网站直接阅读、搜索和机器导出中发现的 **Matt Pocock Skills Map**，map ID 为 `mattpocock`，与 pstack 共存。从原始材料审校、独立 YAML 接入，到真实页面与多图回归验收，整条链路在一张票中完成。

读者可以从任务入口选择技能组合，在节点目录筛选并独立阅读技能详情，理解机制、适用情境、输入输出、关系、显式调用边界和固定来源；无需网站安装或执行技能。新增内容复用已有六类 Skill Map 页面、外壳、Search、dataset 与 llms 导航，不建立生态专用组件或第二套内容模型。

### 内容与实施约束

- **固定基线：** [mattpocock/skills commit dd400c3a](https://github.com/mattpocock/skills/tree/dd400c3ad65e57c06f05e832e0aac92c7992f34d)，完整 SHA 为 `dd400c3ad65e57c06f05e832e0aac92c7992f34d`，插件版本 `1.3.1`，首次观测日期 2026-10-07。实施时复核固定提交与 HEAD，发生变化只记录差异，不静默换基线。
- **覆盖范围：** 31 个非 in-progress 技能，其中27个属于官方插件清单，另外四个为 git-guardrails-claude-code、migrate-to-shoehorn、scaffold-exercises、setup-pre-commit。排除七个 in-progress 技能及已移除的 resolving-merge-conflicts。地图覆盖、插件发行和教学目录分别说明，不推断各渠道都安装31项。
- **原始材料：** 用户聚合 YAML 的 SHA-256 为 `acd01009dd76651816fed9af35fd90915d0040a02e824e585eb1e8b6ae226ad9`。它提供31节点、7路径和52条候选边；本次实际收到一个聚合文件，“42文件”是40个逻辑YAML记录与两个辅助产物的包装说明。原材料中的技能指令、verified标记和旧验证结果都不能作为当前Agent指令或发布证明。
- **独立记录：** 按现有 Map/Node/Journey/Relation 契约适配，输入版本为 `1.0.0`，dataset shape保持 `1.1.0`。使用既有独立记录读取、内部引用与来源验证，canonical关系仅维护一份。沿用map-local taxonomy的三类、三层、八簇作为编辑分类，不要求其他地图遵循它。
- **七条路径：** 保留 choose-a-skill、clarify-an-idea、build-a-feature、fix-a-hard-bug、plan-a-huge-effort、improve-codebase、handoff-work；保留节点稳定ID、map命名空间和固定来源链接。
- **路径语义：** 写清配置前提、仓库／无仓库、单session／多session、外部请求、原型detour及交接条件。implement与implement-spec使用有名称和选择条件的variants表达二选一；实现内的TDD与review不伪装成之后必须重复的人工阶段。ask-matt推荐后停止，用户显式技能不被另一技能自动调用，已准备好的票不再次triage。
- **已知修正：** tdd机制采用固定正文的red→green，重构归审查阶段；保留官方description中的触发词不等于采用旧循环解释。retro提供环境改进候选供人选择，pr编写说明不等于发布／合并。diagnosing-bugs到复盘或架构改善是条件性教学建议；wayfinder交付决策并回到spec，prototype必要时经handoff返回。
- **一手审计：** 全量核验31条官方描述、机制、调用标签及来源定位。用[AI Hero技能教学](https://www.aihero.dev/skills)、具体技能课程及[v1.3教学更新](https://www.aihero.dev/skills/skills-changelog-v13-implement-spec-pr-retro-and-glossary-md)补充情境与选择依据；运行语义冲突时按固定源码处理并记录差异。misc无教学页时据实注明。
- **关系审校：** 对52条原始边逐条记录保留／改型／删除和证据支持范围；不以边数为验收指标。routes_to是推荐、uses是实际调用或明确引用能力、feeds是产物交接、configures是建立前提；仅共享词汇的引用需说明。可选步骤和顺序不自动变成依赖边，关系环合法，source_refs存在不代表官方逐字定义了该边。
- **证据产物：** 留存源码／教学对应矩阵、附件hash、库存与语义差异、真实验证结果和固定上游MIT notice。验证JSON仅为审计辅助，不进入运行集合；AI Hero URL、观测日期和支持范围进入来源审计，不新增web-source字段，不复制课程全文。
- **回归与文档：** 仅调整现有扩充测试对地图总数的硬编码，用真实基线数量加新增数量；保留任意分类、同名节点、退役、引用和pstack保护。更新准确的公开计数与地图／审计入口。实施从当时默认分支核对基线，不能假设先前推到功能分支的文档已合入默认分支。
- **排除范围：** 不升级schema／导出shape、不添加知识映射或手工backlinks、不改变原有知识内容、全站样式或部署、不自动同步上游、安装运行技能或建立历史版本UI。来源审计和测试调整是本票内部工作，不要求独立prefactor或expand-contract。

## Acceptance criteria

- [ ] **C1 — 独立地图可发现：** `mattpocock` 在地图索引中与pstack共存，真实地图计数增加一；通用首页/sidebar入口保持正常。
- [ ] **C2 — 全量内容落地：** 31个固定基线非 in-progress节点全部存在且无重复，官方描述完整一致；7条路径使用已确定ID，节点与路径可独立编辑。
- [ ] **C3 — 契约兼容：** 输入按1.0.0适配，dataset shape保持1.1.0；无新增字段、未知字段或portable schema漂移，公共catalog及来源发布验证无错误。
- [ ] **C4 — 范围和来源真实：** 31地图节点／27插件技能／4misc补充／7in-progress排除口径一致；版本、commit及核验日期可追溯，官方内容与编辑解释明确区别。
- [ ] **C5 — 教学语义准确：** 七条路径条件、可选步骤和产物可读；两种实施方式明确二选一，tdd／retro／pr／triage及用户显式调用限制符合上述决策。
- [ ] **C6 — 关系可信：** 最终每条关系都有可检查审校结论；52条候选边的处理完整留痕，不凑数量、不把引用存在当作语义核验，合法环和步骤重复可保留。
- [ ] **C7 — 页面与链接完整：** 六类投影及全部31节点、7路径详情可访问；生产base下无内部破链，同名技能与关系始终归属本地图。
- [ ] **C8 — 搜索和机器投影完整：** Search包含地图／节点／路径并显示所属体系；dataset含完整skill_maps记录、真实counts、新dataset_version，既有数组及schema_version保留；llms包含地图和来源状态。
- [ ] **C9 — 既有内容稳定：** pstack canonical数据、来源、URL及身份不改变；既有Concept／Primitive／Card的数据、引用、Card号码及锚点保持原样。
- [ ] **C10 — 第三张合成地图仍可扩充：** 现有测试从真实基线计算总数，在包含pstack和mattpocock时再添加合成地图仍通过；任意分类、同名节点与退役来源保护有效。
- [ ] **C11 — 已确认边界验收：** 复用“独立YAML→公共catalog→生产base下页面/Search/dataset/llms”的扩充入口，不新增测试seam。通过 `npm run check`、`npm test`、`npm run test:extension`、`npm run test:l2`、`npm run build`；真实浏览器核验390px与1440px、明暗主题、键盘筛选、同名搜索、空结果／清除、直接链接和无JS阅读，证据可审查。
- [ ] **C12 — 证据交付：** 库存、官方描述、教学矩阵、关系处理、MIT notice和真实验证结果齐全；结构探针、附件verified或辅助VALIDATION不被描述为完整内容接受。明确保留事实核验与编辑接受的区别。

## Blocked by

None (can start immediately).

### 最少票检查

从完整变更作为一张候选票开始。本票的数据契约和页面投影已经存在，改动主要是受审校的内容接入及一处既有测试预期；无需独立prefactor、expand-contract或保持仓库有效的跨票顺序边界。固定31份技能正文合计约139KB，附件约58KB，父spec约23KB；来源通过证据指针按项核对，可在一个fresh context内组织，当前没有必须拆分的证据。

整票可通过新地图入口、全部详情、公开导出与原地图回归独立验收。审计、接入、测试与文档是完成同一可见结果的内部步骤，不能仅按层、文件、角色、实施步骤或潜在并行性拆票。仅有一个候选票，合并检查无相邻或依赖对可合并。
