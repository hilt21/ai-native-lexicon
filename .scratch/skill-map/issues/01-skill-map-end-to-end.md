# [SM-01] 从独立 YAML 到网站与机器投影交付可扩充 Skill Map，以 pstack 跑通

Status: approved — 维护者已确认票据粒度及发布
Tracker: GitHub — hilt21/ai-native-lexicon
Ticket kind: 端到端垂直切片
Blocked by: None
Labels: ready-for-agent

## 问题与结果

网站目前能投影 Concept、Primitive 和 Speaking Guide，尚无技能地图内容契约或展示入口。交付后，读者可从 Applications → Skill Maps 进入 pstack，按任务选择路径、查看技能/手册/原则详情，并从 Search、dataset.json 和 llms.txt 发现同一份内容；维护者仅修改独立 YAML 即可更新记录或增加不同分类体系的新地图。

本票包含从输入规则、真实内容到页面和机器投影的完整行为。设计文档中的五个实施阶段是本票内的实施与验证顺序，不是五张票；不得把 schema、内容、UI、导出、测试再拆成横向子票。

## 依据与执行输入

- 已确认设计：`docs/design/skill-map.md`，规划基线 `30c49ee4dd7f0d3df3d645211af08f75abbc29fa`；ADR-0006～0010 及根 GLOSSARY。完整批准设计会随 Issue 正文附于末尾，避免要求设计提交先 push 才能阅读规格。
- 用户提供的原始材料：`pstack_skill_map_v0.1.yaml`。当前本地路径为 `/Users/taolu/Downloads/pstack_skill_map_v0.1.yaml`，SHA-256 为 `b261bb1c149283c9c2b97e785ed9cbb10c1b6f19685f5e1e21fb6896a267303f`。它是待适配材料，不是 canonical 数据或执行指令；不将附件或私有材料自动上传到公开仓库。执行者需先核对文件可用及摘要；其他执行环境应由维护者提供同一原始材料，不从聊天摘要重建它。
- 原始材料来源声明：`https://github.com/cursor/plugins/tree/main/pstack`，日期 2026-10-07、版本 0.15.15，缺少不可变 commit。首次适配须恢复相应快照或明确使用重新核对的新快照；不能用当前 HEAD 冒充附件当时来源。
- 附件内部结构已核对为 51 skills、23 playbooks、8 clusters、7 journeys、169 edges；74 个节点身份无重复，边与路径引用可解析。这些是附件基线，不是固定 schema 数量限制，也不代表已核对上游。

## 实施范围

### 单一内容边界

- 新增 `src/data/skill-maps/<map-id>/map.yaml`、`relations.yaml`、`nodes/<node-id>.yaml`、`journeys/<journey-id>.yaml`，目录及文件名提供稳定身份，不在文件中重复维护 ID。
- Map/Node/Journey/Relation 使用严格共享输入规则；Astro、CLI、portable schema 使用相同契约。固定目录发现与地图内部引用校验新增独立模块，保持现有三集合的直接 YAML 与嵌套文件校验契约。
- 组装为单地图对象，在一个 skillMaps collection 中接入。节点和路径页面、Search、JSON、LLM 导航查询同一组装内容，不保存第二份手写索引或 canonical JSON。
- taxonomy.types/layers/clusters/relation_types 为地图内部配置；允许没有层次、能力簇、Router/Playbook/Principle，允许原则没有独立输入/输出。不同地图可使用同名节点；身份包含地图和条目类型。
- 规范关系只存 relations.yaml，使用带方向的标签派生入/出关系。自然语言上下游说明进入 handoffs；任务路径使用带条件、可选步骤和产物的 variants/steps，不能伪装为依赖图或执行脚本。

### pstack 真实内容与来源

- 补齐不可变来源快照并核对条目清单、官方描述。官方字段、编辑用途/机制、关系、任务路径分别表达；verified 只覆盖明确的来源核对范围。
- 适配附件中的节点、分类、关系及路径；统一 alternate_path/alternates 为带名称的方案。提供原材料→正式记录的对照及语义变更摘要，具体内容按 ADR-0003/0004 接受；本票获准执行不等于预先接受全部适配内容。
- 使用 source_refs 定位不可变来源。更新来源新增快照标识，current_sources 指向当前快照；仍被退役记录引用的旧快照留存，旧快照 ID 不改指其他 commit。
- 改名保留稳定 ID；下线置 retired 并提供说明页及已确认替代链接。active 路径不得引用 retired 节点；默认目录/任务/概览排除 retired，搜索命中标记状态，导出保留记录与关系。

### 页面、导航与使用体验

- sidebar 新增 Applications，把 Speaking Cards 移入该组，增加 Skill Maps；首页新增直达 Skill Maps 的入口。保留现有 Speaking Card URL/number/card-XX 锚点。
- 页面覆盖 `/skill-maps/`、`/skill-maps/[map]/`、`/skill-maps/[map]/journeys/[journey]/`、`/skill-maps/[map]/nodes/`、`/skill-maps/[map]/nodes/[node]/`、`/skill-maps/[map]/overview/`。
- 单图以任务选择为主入口，提供指导路径、可搜索/按类型及能力簇筛选的目录、节点详情与整体结构。目录明确区分能力、手册、原则等，不把所有节点称为 skills。
- 复用 Starlight 外壳、paper/ink/acid-green tokens、明暗主题及已有平面目录风格；桌面可并列目录/详情，手机正文优先。目录无结果有清除入口，无关系不渲染空区块，无层次/无路径地图有可用的说明与目录入口。
- 原生链接有独立可分享地址；所有跨路由链接与锚点使用 pathWithBase。无 JavaScript 时正文和路由仍可用，筛选仅为轻量增强。

### 全站与机器读取

- Search 索引地图、节点、路径，标明类别、所属地图和退役状态；节点查阅、路径反查及关系标签均从内容派生。
- dataset.json 新增独立 skill_maps 数组；保留现有 concepts/primitives/speaking_cards 的字段和公开身份，显式升级导出 schema_version、counts 和文档。
- 哈希包括地图内容及本地图分类。maps/nodes/journeys 按 ID、relations 按 `(from,type,to)`、sources 按 ID、source_refs 按 `(source,path)`、tags/secondary_clusters 按文字排序；对象键递归排序。分类、current_sources、variants/steps、文字输入输出及说明数组保序。排除生成时间、部署位置与派生 URL。
- llms.txt 增加地图导航及来源版本/核对状态，指向完整 dataset；原有章节与链接保留，不手写全部节点的导航。
- 扩充 CONTRIBUTING 与相关 content/export 文档，说明目录结构、生成 schema、更新来源、退休记录与校验命令。

## 明确不在本票范围内

- 实际 knowledge_refs 输入字段、目标映射、跨集合校验、backlink UI 或导出；接口设计继续保留在批准 spec 中，后续独立版本启用。
- mattpocock/compound-engineering 的正式内容整理；它们的不同分类支持用合成扩充夹具验证。
- 可缩放/拖动的完整图、历史版本切换、技能执行引擎、自动上游同步、数据库或客户端框架。
- 宣传图片制作、发布/部署、push/merge；这些动作需要各自任务授权。
- 无关架构重构或旧记录的改名/重编号。

## 验收条件

- [ ] **C1 输入一致**：有效最小地图经 CLI 与 Astro 得到相同组装内容，Map/Node/Journey/Relation portable schema 由共享输入规则生成；schema:check 发现漂移且不写文件。
- [ ] **C2 非法输入**：测试证明 malformed YAML、空白必填字段、未知字段、非 slug、同类型 .yaml/.yml 身份碰撞、缺失 map/relations、非规定嵌套文件、重复分类/引用/关系均被拒绝并定位文件与字段；不静默跳过或覆盖。
- [ ] **C3 引用边界**：悬空节点/来源/current_sources、未定义分类/关系类型、非法 replaced_by、active 路径引用 retired 节点被拒绝；有环关系和跨步骤重复节点通过，不强制关系 DAG。
- [ ] **C4 真实来源**：pstack 的源 commit、版本、核对日期和来源清单/官方描述核对证据可检查；缺失来源不能被标为 verified。适配对照及语义摘要经维护者接受，原始附件数量差异有明确说明，不以固定计数凑内容。
- [ ] **C5 内容投影**：pstack 的地图索引、任务入口、全部路径、全部节点详情与概览都有可访问页面；输入输出、条件/可选步骤、产物、明确方向的关系和来源正确呈现。所有真实记录的页数/索引/导出数量由已接受数据派生。
- [ ] **C6 导航与交互**：sidebar 与首页可达 Skill Maps，原 Speaking Cards 地址仍有效。地图内搜索、类型/能力簇筛选、清除筛选、结果计数和空状态运行正确；直接访问详情不依赖先选目录或浏览器会话。
- [ ] **C7 全站发现**：地图、节点、路径分别能在 Search 命中并定位正确地图；同名节点不串图；llms 的新旧章节/链接正确，部署 BASE_PATH 时包括内部链接及 card 锚点在内均有效。
- [ ] **C8 导出契约**：dataset 的新 schema_version、skill_maps、counts 与文档一致；既有三个数组的字段、日期语义、身份和记录内容不因本票变化；退役记录保留，knowledge_refs 未提前实现。
- [ ] **C9 哈希语义**：改变地图内容或交换指导步骤/分类语义顺序改变 digest；改变 YAML 排版、对象键、文件发现顺序或无顺序关系/source_refs 排列不改变 digest；generated_at/base/site 不参与内容版本。
- [ ] **C10 无代码扩充**：在隔离夹具只新增不同类型/关系分类、无 layers 的第二张地图 YAML，即自动进入 collection、页面、导航索引、Search、JSON、LLM；无需改源码、手写索引或新增 schema 枚举。空节点/空路径集合和原则空输入输出有合理页面。
- [ ] **C11 更新与下线**：夹具模拟上游改名/删文件并取得新来源 commit；原 node URL 不变、retired 说明页存在、旧 source_ref 仍定位旧 commit 有效文件、active 推荐不含 retired。修改同一快照 ID 的 commit 在变更审查中被拒绝；单次形状校验不冒充跨版本核验。
- [ ] **C12 页面可用**：390px 手机与宽屏、明暗主题、键盘操作、焦点、无结果与退役详情均人工/浏览器可核对；无横向溢出，正文可读；无 JavaScript 时路由及内容可用。有真实页面截图，文本线框不作为运行证据。
- [ ] **C13 完整检查**：npm run check、npm test、npm run build、npm run test:extension 与 git diff --check 全部通过；记录来源核验、行为测试与运行环境，尚未执行的发布不宣称已完成。

## 实施落点与可控上下文

优先检查 `src/domain/content/{catalog,read-content,validate-references}.mjs`、`src/lib/{yaml-content-loader,dataset-version}.mjs`、`src/content.config.ts`、`scripts/{content-schemas,validate-catalog}.mjs`；新地图输入、读取、内部引用验证和 loader 按批准设计增加，不改造旧类型为通用资源引擎。页面接入现有 astro.config、首页、Search/JSON/LLM 与样式 token。

使用 `tests/{catalog-contract,content-boundary,dataset-version,ui-regressions}.test.mjs` 和 `tests/data-extension.integration.mjs` 的既有模式。一次性 YAML 归一化可以脚本读取、逐项审查差异与写记录；不逐字手写全部节点，也不新增运行时生成器。来源清单及官方描述核对只抽取所需目录/元信息/描述，编辑机制/路径不要求加载全部上游长篇技能正文。

范围冻结为以上首版。在一个 fresh context 中按数据→内容→投影→完整验证顺序实施；前面的中间步骤和局部检查不分别算完成票。若实际执行发现上下文无法可靠容纳、需要独立前置重构或必须迁移旧契约，记录新发现的硬约束后重新审查拆分，不因文件数量、担当角色或并行潜力拆票。

## 已批准规格快照

<details>
<summary>展开完整已批准设计（冻结于 30c49ee）</summary>

# Skill Map 数据与展示设计

状态：已确认。2026-10-07，用户确认完整设计符合共同理解，作为后续实现依据。本文区分设计契约、附件检查结果和未来功能，不构成开发或发布授权。

## 目标与范围

为 AI Native Lexicon 设计可持续更新和扩充的 Skill Map 数据契约、网页导航及页面 UI。pstack 是首张地图，后续增加 mattpocock skills、compound-engineering skills 等体系。

Skill Map 是独立策划的应用资源，网页是内容投影，遵循 ADR-0006。现有 Concept、Primitive、Speaking Guide 的定义与内容身份继续由各自 YAML 记录维护。

本次交付为设计文档与确定的领域术语、架构决策。地图与现有知识及 Speaking Guide 的实际关联、反向展示和跨集合投影扩展留到后续；本次设计须说明其适配边界。功能代码开发、上游自动同步、内容发布和宣传图片制作均不在本次工作范围内。

## 已确认决策

2026-10-07，用户确认 Q1 A、Q2 A、Q3 A：

- 单张地图以任务选择与技能组合为主要入口，整体结构和技能查阅为辅助入口。
- 首版每个技能体系对应一张持续维护的地图，主题路径在地图内部；地图拥有独立内容身份，允许未来同一体系出现专题地图。
- 网站导航增加“应用资源”分组，包含 Speaking Cards 与 Skill Maps；首页同步提供入口，保留现有 Speaking Card URL。

地图身份与入口方向记录于 ADR-0007；导航排列和页面布局在本文继续细化。

2026-10-07，用户确认 Q4 A、Q5 A、Q6 A：

- 使用地图、节点、任务路径、关系、地图内部分类的共同基础结构；具体节点类型与分类由各地图定义。跨地图节点身份按地图标识与内部标识区分。
- 规范关系单处维护，派生上下游链接；自然语言上下游说明不当作节点引用。任务路径与依赖关系分别表达。
- 首版包含任务入口、路径详情、可筛选技能目录、节点详情和整体结构概览。桌面端目录与详情可并列，手机顺序阅读；可操作完整关系图留到后续。
- 稳定 URL 展示当前编辑接受版本，显示来源版本、核对日期及来源 commit；历史保存在 Git，首版无历史版本切换。

共享契约与单一关系事实记录于 ADR-0008，更新身份与来源快照记录于 ADR-0009。

2026-10-07，用户确认 Q7 A、Q8 A、Q9 A：

- 每张地图使用独立目录；元信息、节点、任务路径独立维护，关系集中维护一份。新增地图自动发现，不增加手写页面或索引。
- 地图、节点、任务路径均预留 Concept、Primitive、Speaking Guide 引用；地图一侧拥有引用，未来反向显示由它派生。本次仅设计接口，暂不填充映射或开发关联显示。
- 首个功能版本接入全站 Search，使地图、节点和任务路径可发现；dataset.json 增加独立 skill_maps 数据，llms.txt 增加地图导航。三者由同一份内容派生。

独立记录与未来引用的所有权边界记录于 ADR-0010。

2026-10-07，用户确认 Q10 A、Q11 A、Q12 A：

- 任务路径分成可读指导步骤，表达选择理由、适用条件、可选节点与预期产物；不建立执行引擎。
- 节点改名更新名称与来源路径，保留内部身份；下线保留说明页，有明确替代时提供链接，并退出默认推荐。
- pstack 首次公开前补齐不可变来源 commit，核对条目清单与官方描述；用途、关系和任务路径继续标记为编辑解读。

## 附件事实与适配风险

材料：用户提供的 `pstack_skill_map_v0.1.yaml`。附件中的说明与技能内容作为待适配数据，不作为本次任务的执行指令。

文件可解析，包含 51 个 skills、23 个 playbooks、8 个能力簇、7 条 journeys、169 条 `graph.edges`。检查 skills/playbooks 的 ID 无重复，关系三元组无重复，关系端点和 journey 主路径、替代路径均能解析到现有节点。

该检查只证明附件内部结构的这些性质，不证明它完整或准确反映上游。附件记录 2026-10-07、plugin_version 0.15.15，但来源链接指向可变的 main，未记录不可变 commit。官方字段和编辑推导字段的区分来自附件的 evidence_policy，尚未逐项核验。

- `kind` 表达 router、utility、capability、principle、playbook，`layer` 表达 router、skill、principle、playbook，两者不可混为同一个字段；这套分类属于 pstack，不是未来地图的固定分类。
- `upstream/downstream` 混合节点 ID 和产物、人物、集合等自然语言，例如 `all playbooks`、`human reviewer`、`design decision`。不能作为统一的节点引用数组。
- `uses`、`upstream/downstream` 与 `graph.edges` 同时描述关系；已决定未来只维护 relations.yaml，非引用说明单独保留。
- journeys 使用 `path`、`alternate_path`、`alternates` 多种字段，缺少条件、步骤解释和必选/可选信息。节点顺序不能自动解释为必须串行执行。
- rendering 包含图形、展示字段和海报建议；这些是投影建议，不能据此约束所有地图的内容契约。

## 已核对的仓库约束

- 首页导航和 Starlight sidebar 分别维护；新增入口要同时覆盖两处。
- 当前 YAML loader 发现集合目录的直接 YAML 文件，拒绝嵌套 YAML；分层数据目录如需采用，必须明确新增读取能力。
- 现有跨集合关系以稳定 slug/number 引用，单侧维护引用，在构建时派生反向链接。未来地图知识关联应遵循相同边界，避免复制定义。
- 搜索、`dataset.json` 和 `llms.txt` 显式汇总现有内容类型；不会自动包含新增地图，需要在开发范围内另行明确扩展程度。
- 跨路由链接与带锚点的跨页链接使用 `pathWithBase`。

## 数据组织提案

以下布局与字段用于收敛设计，尚未作为运行中的 schema 安装。首张地图建议公开标识 `pstack`；附件 dataset_id 是原始材料标识，不直接作为网站记录身份。

```text
src/data/skill-maps/
  pstack/
    map.yaml
    relations.yaml
    nodes/
      how.yaml
      bug-fix.yaml
      principle-prove-it-works.yaml
    journeys/
      understand-system.yaml
      fix-bug.yaml
  mattpocock/
    map.yaml
    relations.yaml
    nodes/...
    journeys/...
```

目录、节点与路径文件名分别提供稳定 map/node/journey ID；文件内容不重复维护同一个 ID。全部标识使用稳定 slug，发现冲突时拒绝构建，不按遍历顺序覆盖。组装后的对象包含完整身份，用于跨记录引用和 JSON 导出。

| 对象 | 必要内容 | 组织边界 |
| --- | --- | --- |
| Map | 名称、摘要、范围、面向读者、来源快照、内部分类 | 分类是地图内的 types/layers/clusters，不能引用词库 taxonomy 冒充共用语义；没有层次的体系可省略 layers |
| Node | 名称、摘要、类型、机制、适用场景、解决问题、输入输出、来源定位 | 单节点只存自身内容及分类归属；不重复保存规范关系 |
| Journey | 任务名称、适用情境、输入、预期产物、带条件的指导步骤 | 路径是编辑策划，不用关系图自动生成，不是执行引擎 |
| Relation | from、to、type，必要的解释与来源定位 | from/to 为本地图节点；首版不表达跨地图调用，后续另行设计 |
| Taxonomy | 本地图类型、可选层次、能力簇、关系类型的标识和解释 | 放在 map.yaml；排序与展示名称由数据提供，新增分类不改页面枚举 |

关系表首版只需要附件实际使用的 uses、routes_to、feeds、governed_by、resumes，定义方向和阅读标签；不因附件预声明额外类型而构造不存在的产物节点。允许引用拓扑含环，uses/feeds 图不被当作可执行 DAG。关系重复按 `(from, type, to)` 拒绝，关系说明不能取代类型与方向。

自然语言输入、输出与交接说明继续是文字。UI 按关系类型和入/出方向显示“使用哪些能力”“被哪些流程使用”“遵循哪些原则”等明确标签，不能将所有入边/出边简化为执行前后顺序。

### 来源与编辑解释

map.yaml 维护不可变来源快照：快照标识、仓库 URL、仓库内根路径、commit、来源版本、观测/核对日期及核验状态。节点、路径与关系按快照标识加相对文件路径定位；网站源码链接由该快照的 commit 与文件路径派生。current_sources 指出地图当前采用哪些快照；仍被退役记录或历史依据引用的旧快照留在 sources 中。更新来源时新增快照标识，不把既有标识的 commit 换成新版本，否则退役页的源码链接可能失效。完整地图历史仍由 Git 保存；保留被引用快照不意味着建立网站历史版本切换。未来多来源专题可使用多个来源条目，不复制快照到所有节点。

沿用 ADR-0002、0005，官方原文、编辑综合与使用示例分别表达；官方描述保持可定位来源，中文机制/用途/任务路径标明编辑解读。类型、关系和路径即使格式有效也不自动得到事实核验标记。当前附件缺失 commit 的事实不能由实现补成已核验。

附件的 kind 与 layer 保留不同语义；skills/playbooks 归一到 nodes。uses 转为关系表中的规范边后不再双写，upstream/downstream 逐项区分明确关系与文字交接，禁止仅因字符串碰巧匹配 ID 而自动判定方向和类型。rendering 的字段清单与图形配置不进入知识内容字段，页面采用共同展示规则。

### 未来知识关联接口（本 feature 不开发）

Map、Node、Journey 均预留同一 knowledge_refs 结构：concepts 使用 filename slug，primitives 使用 filename slug，speaking_guides 使用正整数 number。空关联有效，公开地址由内容类型与稳定身份派生，不存可能失效的 base URL。映射理由及证据如何记录，可在关联功能的具体需求出现后细化，不能靠名称近似补齐引用。

未来启用时：验证目标存在与引用唯一；删除目标前检查入向引用；Concept、Primitive、Speaking Guide 的反向列表从地图引用生成，不新增人工 backlink 字段，也不复制目标定义。本 feature 中不启用这些引用的输入、导出或 UI，避免出现有字段却不检查目标的半实现。接口先保留于本设计，后续启用时升级对应 schema。

## 导航与页面提案

保留 Starlight 外壳与主题控制，sidebar 在 Start、Explore 之后新增 Applications；Speaking Cards 从 Explore 移到 Applications，同组增加 Skill Maps。首版不单独建设 Applications 聚合页。首页保持现有导航风格，增加 Skill Maps 直达入口；应用资源分组下的子入口直接打开对应资源索引。

| 页面 | 候选稳定路由 | 主要内容 |
| --- | --- | --- |
| 地图索引 | `/skill-maps/` | 自动列出地图的范围、适用任务、来源版本与核对状态；只有 pstack 时也提供正式索引，不跳过层级 |
| 单图任务入口 | `/skill-maps/pstack/` | 地图简介、阅读方式、按任务组织的路径入口、简短结构概览 |
| 任务路径详情 | `/skill-maps/pstack/journeys/fix-bug/` | 适用条件、输入、选择理由、指导步骤、条件分支和预期产物 |
| 节点目录 | `/skill-maps/pstack/nodes/` | 搜索、类型/能力簇筛选、节点摘要；目录涵盖技能、手册、原则，不能把 74 个节点都标为 skills |
| 节点详情 | `/skill-maps/pstack/nodes/how/` | 概述、何时使用、机制、输入输出、关系、所属路径、来源；直接链接可独立阅读 |
| 整体概览 | `/skill-maps/pstack/overview/` | 本地图层次、能力簇、代表节点、带文字标签的结构关系；无强制全图交互 |

这些是页面投影，不增加页面内容副本。地图内“任务 / 条目 / 整体结构”使用普通链接；节点/路径均有独立路由供 Search、分享和机器读取引用，首版不依赖弹窗或浏览器会话才能访问详情。

### 页面线框

单图入口（桌面）：

```text
Starlight navigation  |  Skill Maps › pstack
                     |  pstack Skill Map
Applications         |  能帮助完成什么工作 · 来源版本 · 核对日期
  Speaking Cards     |  [任务]   [条目]   [整体结构]
  Skill Maps         |
                     |  你想完成什么？
                     |  理解系统          修复问题
                     |  选择入口与产物     选择入口与产物
                     |  新增功能          改进性能
                     |  …其余路径由数据提供…
                     |
                     |  如何阅读这套体系
                     |  本地图层次与能力簇 → 查看整体结构
```

节点详情（桌面）：

```text
Skill Maps › pstack › 条目 › how
[任务] [条目] [整体结构]

节点目录 / 筛选          | how · 能力
[搜索] [类型] [能力簇]   | 中文摘要
how ← 当前条目          | 什么时候用 · 解决什么问题
why                     | 工作机制 · 输入 → 输出
architect               | 类型明确的关系链接
…                       | 出现在哪些任务路径
                        | 官方描述与来源 / 编辑解释
```

手机端把目录与详情改为主内容优先，目录入口可返回同图；不让读者先滚过全部节点才能到详情。筛选无结果提供清除筛选入口，节点无关系时省略关系区块，不用空盒子占位；仍能独立阅读有内容的节点。

### 视觉与交互约束

沿用 `src/styles/tokens.css` 的纸色、墨色、酸绿色与暗色主题。目录用现有 CatalogRow 风格的平面分隔行，任务入口使用短标题、适用情境与产物摘要，重点颜色用于当前导航与主要行动，不为每个分类新增任意颜色。官方技能名称保持原文，解释内容沿用附件中文；页面导航与站点现有英文标签一致。

过滤使用原生输入和选择控件、可见标签、结果计数与空状态；文本与类型名称共同表达分类，不仅靠颜色。布局依据可用容器宽度切换，保持可见焦点、键盘可达、减少动态效果及 65ch 左右阅读宽度。结构概览使用可阅读的文本分组，连线不承载唯一信息；JavaScript 未运行时仍显示内容与有效链接。

不引入客户端框架、图数据库或图谱布局依赖；静态内容与路径链接由构建产出，轻量筛选使用现有脚本模式。首版不执行技能、不假设网站访客已经安装某个宿主插件。

## 搜索与机器投影

Search 增加 Map、Node、Journey 三类记录，分别显示资源类别与所属地图，结果链接到各自稳定路由。检索名称、摘要、适用场景、类型与能力簇标签；不把每条关系当成搜索记录。地图内过滤范围始终是本地图，不能因同名节点混入其他地图。

dataset.json 增加独立 skill_maps 数组，每张地图包含组装后的元信息、分类、节点、任务路径、关系。保留既有 concepts、primitives、speaking_cards 的身份与字段，不创建统一 opaque resources 数组。新增导出形状须显式升级 schema_version 并更新 docs/exports.md；dataset_version 的内容哈希包含地图内容及其内部分类，计数从真实组装数据派生，不能使用附件声明数量。

哈希与导出采用确定性归一：maps、nodes、journeys 按身份排序，relations 按 `(from, type, to)` 排序；对象键递归排序。sources 按快照 id 排序，source_refs 按 `(source, path)` 排序，作为无顺序语义的引用集合；secondary_clusters 与 tags 按文字排序。taxonomy 数组、current_sources、variants、steps、inputs/outputs 及说明数组保留编辑顺序，因为影响读者理解或展示。显式 order 值作为内容参与哈希，不能用文件发现顺序替代。digest 不包含 generated_at、部署 base/site、派生 URL、文件路径或原始 YAML 排版；身份本身参与哈希。现有 createDatasetVersion 必须显式扩展这套规则，不假设新增数据会被自动规范化。

llms.txt 增加 Skill Maps 分节，包含地图链接、简述、来源版本/核对状态，并指向完整 dataset；保留既有章节，不把所有 74 个节点硬写入文本导航。公开投影只包含可发布内容，原始附件和私有材料不因参与策划而自动公开。

## 字段契约

所有输入对象采用严格字段检查，未知字段报错；必填文字拒绝空白，引用数组拒绝重复，optional 字段省略时按下面的语义处理。文件身份由路径确定，输入 schema 不要求重复 id。YAML 和导出形状分别使用版本字段，不能把上游 plugin_version 作为本项目 schema_version。

### map.yaml

| 字段 | 形状与规则 |
| --- | --- |
| schema_version | 当前设计输入契约 `1.0.0`；不是附件的 `0.1.0`，不声称兼容原始 YAML |
| title、summary、scope | 必填文字；scope 说明地图覆盖哪套体系与使用目标 |
| audience | 非空文字数组，说明适用读者 |
| order | 可选非负整数，用于地图索引；缺省同级按稳定 id 排序 |
| sources | 不可变来源快照数组；首版公开地图至少一个，每个 source 有唯一 id、repository、root_path、observed_at、verification_status；version 为可选说明；commit 是可缺省的固定 Git 对象 ID，公开前必须补齐。新 commit 使用新快照 id，旧标识不重新指向新内容 |
| current_sources | 非空且不重复的快照 id 数组，必须解析到 sources；页面头部展示这组当前来源；仍被内容引用的旧快照不得删去 |
| sources[].verified_at | 核验通过时必填日期；verification_status 为 pending 或 verified，verified 只表达已经核对来源清单和官方描述，不覆盖所有编辑解释 |
| taxonomy.types | 本地图节点类型数组；每项唯一 id、label、description |
| taxonomy.layers | 可选层次数组；每项唯一 id、label、description；空数组有效 |
| taxonomy.clusters | 可选能力簇数组；每项唯一 id、label、description；空数组有效 |
| taxonomy.relation_types | 关系类型数组；每项唯一 id、description、outgoing_label、incoming_label，标签以当前节点为主语；空数组有效 |

分类数组顺序就是显示顺序，不再同时维护另一份 cluster_order。一个节点可归入主能力簇与其他能力簇；它属于哪个层次独立于具体类型。所有分类名称只在本地图生效，缺省分组不把数据硬塞进 pstack 分类。

### nodes/<node-id>.yaml

| 字段 | 形状与规则 |
| --- | --- |
| title、summary、type | 必填文字；type 必须存在于本地图 taxonomy.types |
| status | active 或 retired；缺省 active |
| layer、primary_cluster | 可选分类 ID；存在时必须解析到本地图分类 |
| secondary_clusters、tags | 可选唯一数组，缺省空；secondary_clusters 不重复 primary_cluster；tags 是检索文字，不自动映射 Primitive |
| mechanism | active 节点必填文字；编辑解读 |
| when_to_use、solves | active 节点为非空文字数组；编辑解读 |
| inputs、outputs | 文字数组，缺省空；原则等节点可没有独立输入输出，UI 不虚构字段内容 |
| handoffs | 可选文字数组，承载自然语言交接说明，缺省空；不解析成节点关系 |
| source_refs | 来源定位数组，每项 source 指向 map.sources 的 id，path 相对于该来源 root_path；active 节点至少一个；路径不得越出来源根目录 |
| official_description | 可选原始描述；如存在，其来源定位必须能支持该文本，公开前核对准确性与出处 |
| retirement_note、replaced_by | retired 时 retirement_note 必填；replaced_by 可选，指向本地图 active 节点，不能指向自身 |

原则的机制可以描述约束如何影响工作，不强行编造输入/输出。退役说明页只需身份、名称、摘要、退役说明与已知来源，可保留原有内容，不强制为停止使用的条目补写完整操作指导。

### relations.yaml

顶层形状为 `{relations: Relation[]}`，空数组有效。每条 Relation 有 from、to、type；可选 note、source_refs。端点为本地图节点 ID，type 必须在本地图 taxonomy.relation_types 中定义。source_refs 的形状与节点一致；缺少引用的编辑关系仍可公开，但明确显示为编辑综合，不能显示“官方依赖”或“已核验关系”。

若关系涉及 retired 节点，保留在其详情及导出中并显示目标状态，默认 active 结构概览不展示这些边。首次迁移不增删关系来凑数量，原附件的 169 条边作为校对基线。

### journeys/<journey-id>.yaml

| 字段 | 形状与规则 |
| --- | --- |
| title、summary | 必填文字，用任务语言表达 |
| status | active 或 retired；缺省 active；退役路径保留直接地址及说明，退出默认入口 |
| order | 可选非负整数；缺省按稳定 ID 排序 |
| when_to_use、inputs | when_to_use 是非空文字数组；inputs 是文字数组，缺省空 |
| outputs | active 路径为非空文字数组，说明可检查的产物 |
| variants | active 路径至少一个带名称的方案；每项有本路径内唯一 id、title、非空 steps，可选 when，顺序是展示顺序；首项为默认方案 |
| variants[].steps[] | title、why、非空 nodes 引用数组，optional 布尔值缺省 false；可选 when、outputs。节点在本步骤内不得重复，同一节点可在不同步骤再次出现 |
| source_refs | 可选来源定位数组，用于策划依据；没有对应官方流程来源时显示编辑路径，不将用户输入或示例当作官方指令 |
| retirement_note | retired 时必填，仍可保留原 variants |

steps.when 和 variants.when 都是人可读条件，不包含表达式、运行状态或自动决策。optional 表示整个指导步骤可以略过；nodes 表示该步骤涉及的条目，不宣称其中节点必须串行调用。某条路径在调查与设计阶段重复使用 how 是有效内容。所有 active 路径中的引用只能指向 active 节点，包括可选步骤，避免给读者推荐已下线能力。

### 字段级示例

以下均为设计示例，不是已经接受的 pstack 内容，也不是可直接发布的完整数据集。source 示例保留 pending 与缺失 commit，准确表达当前附件尚未补证；正式公开时须满足 Q12 的来源门槛。示例引用的节点与分类须由完整地图提供。

来源条目（嵌入 map.yaml 的 sources）：

```yaml
id: pstack-upstream
repository: https://github.com/cursor/plugins
root_path: pstack
version: 0.15.15
observed_at: '2026-10-07'
verification_status: pending
```

how.yaml：

```yaml
title: how
summary: 理解系统的结构、职责和调用关系。
type: capability
status: active
layer: skill
primary_cluster: understanding-context
mechanism: 阅读相关实现并组织成系统解释；这是地图的编辑摘要。
when_to_use:
  - 修改之前需要弄清某个子系统如何工作。
solves:
  - 只看到局部代码，无法判断职责和依赖。
inputs:
  - 明确的系统或子系统问题。
outputs:
  - 可核对的结构与调用关系说明。
source_refs:
  - source: pstack-upstream
    path: skills/how/SKILL.md
```

relations.yaml 中的两条示例：

```yaml
relations:
  - from: bug-fix
    to: how
    type: uses
    note: 修复流程使用系统理解能力。
  - from: bug-fix
    to: principle-prove-it-works
    type: governed_by
    note: 修复结果需要可核对的验证依据。
```

fix-bug.yaml 中的简化指导示例：

```yaml
title: 我想修复问题
summary: 从理解问题到形成修复与验证依据。
when_to_use:
  - 已有错误报告或回归现象。
inputs:
  - 错误报告与复现线索。
outputs:
  - 根因解释、修复结果与验证依据。
variants:
  - id: standard
    title: 常规修复
    steps:
      - title: 明确修复入口
        why: 先确定需要处理的问题和上下文。
        nodes: [poteto-mode, bug-fix]
      - title: 理解系统和原因
        why: 用代码与历史依据缩小问题范围。
        nodes: [how, why]
      - title: 评估结构变化
        why: 跨越模块边界的修复需要先确定结构。
        when: 修复涉及模块职责或接口变化时。
        optional: true
        nodes: [architect]
```

未来关联接口示例（仅设计，首版不写入节点文件）：

```yaml
knowledge_refs:
  concepts: []
  primitives: []
  speaking_guides: []
```

speaking_guides 的非空条目是正整数，如 4，而不是 card-04、文件名或 URL。实际目标映射必须在后续工作中逐项接受，不从示例建立关系。

## 读取、校验与投影边界

地图读取器只识别规定形状：直接子目录下 map.yaml、relations.yaml、nodes/*.{yaml,yml}、journeys/*.{yaml,yml}。根目录若存在地图文件但缺失清单，应报错；不静默跳过损坏地图，也不递归收集任意嵌套文件。nodes/journeys 目录需存在，可为空；无节点的地图显示说明与空目录，不伪造工作流。没有路径时显示条目与整体结构入口，不从关系图自动生成路径。

读取器组装统一对象 `{id, ...map, nodes, journeys, relations}`，nodes 与 journeys 注入文件 ID。Astro collection、CLI 校验和导出共享输入规则、读取及关系验证；不把 Astro 页面里的临时组装结果变成 CLI 的另一套实现。组装对象是构建产物，不落地第二份 canonical JSON。

建议新增地图领域输入与读取模块，而不是放宽现有三类记录的嵌套目录限制：map/node/journey/relation 输入规则、固定目录读取、地图内部引用校验各自负责明确边界。schema:generate/schema:check 管理对应便携 schema；未来知识映射启用时，再扩展跨集合验证层。没有实际跨地图调用需求时，不增加通用 graph API 或资源注册框架。

建议的最小实现落点（尚未创建）：

| 位置 | 职责 |
| --- | --- |
| `src/domain/content/skill-map-input.mjs` | Map/Node/Journey/Relation 输入规则以及导出 schema 所需定义 |
| `src/domain/content/read-skill-maps.mjs` | 固定目录发现与读取，路径身份注入，组装为单地图对象 |
| `src/domain/content/validate-skill-map-references.mjs` | 地图内部分类、来源、关系、路径与替代引用验证 |
| `src/lib/skill-map-loader.mjs`、`src/content.config.ts` | Astro 接入同一读取器，一个 skillMaps collection 以每张地图为记录；节点/路径路由读取组装对象，不再建内容副本 |
| `src/lib/skill-maps.ts` | 查询地图、节点、路径与派生关系的页面接口；返回既有数据，不维护手写索引 |
| `src/pages/skill-maps/` | 上文六种页面投影与动态路由；共用现有外壳、token 和可复用展示组件 |
| 现有 schema/catalog 脚本、Search/JSON/LLM 投影与导航 | 扩展新类型的检查和输出，保留现有契约 |

单地图 collection 不意味着单 YAML 文件，也不要求将所有节点合并维护；它是独立记录组装后的构建表示。

| 校验层 | 拒绝什么 | 允许什么 |
| --- | --- | --- |
| 文件与身份 | 非 slug、重复扩展名身份、缺失 map/relations、读取错误、非规定嵌套 YAML | 同一节点 ID 出现在不同地图；节点与路径身份分别按类型区分 |
| 输入字段 | 未知字段、空白必填内容、非法状态、重复分类/引用 | 原则输入输出为空；没有层次或能力簇的地图 |
| 本地图引用 | 悬空端点、未定义类型/分类/来源、悬空 current_sources、重复关系、非法替代目标 | 关系含环；同节点在路径不同步骤重复出现；退役记录保留旧来源快照 |
| 路径有效性 | active 路径引用 retired 节点、空方案/步骤、同方案 ID 重复 | 有文字条件的可选步骤；多个带名称的方案 |
| 公开来源基线 | pending 来源、缺失不可变 commit 或 verified_at、未核对官方内容就标 verified | 已核对来源之上的编辑关系和编辑路径，继续明确其性质 |

公开来源基线是内容接受与发布前的人工作业条件，schema 的形状检查不能证明核验已实际发生。开发用夹具可以使用 pending 来源；不得借此把未核验 pstack 正式公开。页面源码链接固定到来源 commit，而不是 main；没有源码依据的编辑关系显示编辑说明，不能制造源码定位。

## 更新、退役与扩充流程

### 首次 pstack 适配

1. 保存用户附件为本地原始材料，核对确切来源版本与 commit；如果无法恢复该附件对应 commit，应明确以新取得的快照重新核对，不冒充原快照。
2. 对照不可变来源核对技能/手册清单和官方描述，完成来源基线；51/23 是附件数量，不是永远固定的 schema 限制。
3. 将两类条目归一为节点，迁移 8 个能力簇和实际层次；迁移 169 条边并逐项确认关系语义，不直接拼接 upstream/downstream。
4. 把 7 条路径及其替代路线整理成 variants/steps，补充选择理由与文字条件；输出对照表说明保留、改写与遗漏内容，供编辑接受。
5. 审查并接受内容，完成输入/引用校验、页面与导出验证。图片投影的布局配置留在后续工作，不能作为这次入库成功条件。

### 更新来源或内容

比较来源快照的新增、变化与删除，按 ADR-0003/0004 形成可审查的内容提案。新增 sources 快照条目，更新 current_sources 与受影响节点、路径、关系共同接受；仍引用旧快照的记录保留其原 source_refs，只有明确依据新版本重写的记录才改用新快照。不可覆盖既有快照 id 的 commit；未来更新审查须比较现有 Git 基线来检查这条跨版本不变量，单次 schema 校验不能证明它。完整旧地图在 Git 中保留，不从远端自动覆盖编辑策划。

改名保留 node ID，仅更新名称与来源定位。删除上游技能时先将节点置为 retired，写明原因并调整 active 路径；旧地址仍可直接访问。关系指向退役节点时显式显示状态，默认目录、任务推荐和结构概览只展示 active 内容；目录可切换“包含已下线条目”，Search 的退役命中单独标记，不与当前推荐混淆。导出保留退役记录与关系，不让机器消费者丢失引用。

不物理删除已公开地图、节点或路径记录来代表下线。真正需要更换身份或合并/拆分时，另作明确内容迁移与引用审查，不用自动改写猜测等价关系。replaced_by 只表达维护者确认的单一替代对象，多候选可写在退役说明，不建立自动重定向链。

### 新增地图

在 skill-maps 下创建新目录，填写地图元信息和适合该体系的分类，增加节点、关系与任务路径，完成来源与编辑接受。新分类和新关系类型只修改该地图数据；页面、导航索引、Search 与导出在下一次构建时自动发现，不为 mattpocock 或 compound-engineering 添加条件分支。新地图可以没有 Router、Playbook 或 Principle，不需要补造节点以匹配 pstack。

### 未来知识映射

未来为 map/node/journey 启用 knowledge_refs 的独立 schema 版本后，在编辑审查中添加具体目标；引用验证读取既有 canonical 集合，反向展示与导出由同一引用派生。节点机制或摘要可以表达其使用方式，Concept/Primitive 的定义只链接原记录。Speaking Guide 的历史 number 与 card-XX 地址不变化。

## 实施顺序与验收标准

下表是未来开发工作的边界与验收，当前没有执行功能实现或测试。

| 阶段 | 交付 | 最小可信验收 |
| --- | --- | --- |
| 1 内容契约 | 输入规则、独立读取、组装、portable schema、内部引用验证 | 有效最小地图、无层次地图、不同地图同名节点通过；悬空引用、重复身份、未知字段、active 路径引用 retired 节点被拒绝 |
| 2 pstack 内容适配 | 固定来源、节点/关系/路径、适配对照 | 来源清单及官方描述核对完成；归一结果与编辑接受记录可检查；数量由真实数据派生 |
| 3 页面与导航 | 索引、任务入口、路径、目录、详情、概览、两个导航入口 | 单页直达、返回导航、筛选与清除、节点状态可读；手机与桌面无溢出；旧 Speaking Card 地址有效 |
| 4 搜索与导出 | Search、skill_maps JSON、llms 分节、版本/计数/哈希文档 | 地图/节点/路径可检索；既有导出字段保留；真实数量一致；改变地图字段改变 digest，格式/遍历顺序不改变 digest |
| 5 扩充与部署验证 | 新图夹具、下线夹具、子路径与键盘验证 | 仅新增 YAML 就出现第二张不同分类地图；同名节点不串图；下线链接保留且源码指向仍有效的旧 commit；BASE_PATH 下所有内部链接正确 |

未来功能修改后按 AGENTS.md 执行 npm run check、npm test、npm run build；同时扩展并运行 npm run test:extension，覆盖本功能承诺的数据扩充行为。portable schema 新增/改动时运行 schema:generate，check 保持只读。

重点 UI 检查覆盖 390px 手机与宽屏、明暗主题、键盘导航、焦点、无结果状态、退役详情，以及 JavaScript 未执行时的正文与路由。截图用于检查真实渲染，不把本文件的文本线框当作运行验证证据。

## 完成状态与剩余边界

Q1–Q12 的关键选择及完整设计均已由用户确认；数据身份与关系、导航、页面线框、来源/更新边界、扩充流程和验收均已记录。本稿的具体字段与路由作为后续实现依据，设计阶段已结束。

当前只修改设计文档、领域术语与 ADR；没有创建 Skill Map canonical 数据、修改运行 schema、实现页面或执行发布。附件通过结构检查，但 Q12 的上游来源基线尚未完成；这个事实不妨碍完成本次设计，也不能据此声称 pstack 已可发布。

</details>
