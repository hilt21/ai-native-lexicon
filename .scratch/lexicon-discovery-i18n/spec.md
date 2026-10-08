## Problem Statement

读者进入 AI Native Lexicon 后，需要先理解 Concept、Primitive、taxonomy 和 Application Resource 等栏目，才容易找到具体知识。首页先展示完整分类，词条样例出现较晚；字段搜索混合多个内容类型，标记不统一，正文命中的结果不一定能解释匹配原因。详情页缺少简单的复制和连续阅读动作。

维护者已有结构化内容和共享验证契约，但证据充实程度有限。2026-10-08 审查基线中，84 个 Concept 有 81 个显式空来源，42 个 Primitive 的来源均为 unverified。这些统计只描述当时的本地 HEAD，不意味着记录错误，也不能代表当前发布版本的全部状态。页面结构合法、编辑接受和证据核验需要继续分别表达。

英文知识正文、中文术语名以及部分混合语言 Application Resource 并存，读者无法稳定地获得中文阅读体验；维护者也缺少与英文正文版本绑定的翻译审查和过期检测。直接复制完整记录作为中文版本，会产生定义、身份和关系的重复维护。

taxonomy 已从 YAML registry 生成 Schema 枚举，本项目不存在需要重新修复的两套独立分类清单。本 spec 改善真实的发现、阅读、证据和语言维护问题。

## Solution

保留 Concept、Primitive、Speaking Guide、Skill Map 的领域边界、canonical YAML 和现有静态 Astro／Starlight 架构，分批交付：

1. 让首页更早展示具体词条，用既有分类页承载完整 taxonomy；统一字段搜索的内容类型、状态、计数和命中解释，复用现有全局 Pagefind 搜索。
2. 提供一个可靠的 Copy definition 动作、同类型 A–Z 连续阅读，以及相关 Concept 的简短摘要；用小批真实内容验证 examples、distinguish_from 和 aliases。
3. 以小批内容补充可定位的公开来源与支持范围，保留未核验状态和编辑综合的边界。
4. 引入面向 Astro 的 English Canonical + Translation Overlay：英文知识正文是语义基准；简体中文译文是独立编辑资产，通过覆盖层解析为 Content Projection。英文 URL、公开身份和机器数据保持兼容，缺失或过期译文明确回退英文。

首版支持 en 与 zh-CN，中文路由前缀使用 zh-cn。首批知识翻译覆盖 Concept、Primitive，以及 category／layer 的展示文字。Speaking Guide 和 Skill Map 保持各自的语言 edition 和现有语言注释；语言切换可显示中文界面，但不得将尚未翻译的应用资源标为中文译本。它们的完整正文翻译和英文迁移不属于首版。

## User Stories

1. As a first-time reader, I want useful definitions and clear browsing options on the homepage, so that I can start exploring without first learning the site's taxonomy.
2. As a reader, I want to find a term using its English name, Chinese name or aliases, so that familiar vocabulary leads me to the right record.
3. As a reader, I want to understand each search result and narrow results to the content type I need, so that I can choose relevant knowledge or application resources.
4. As a reader, I want to resume my search after visiting a result or returning to the page, so that I can continue exploring without repeating my work.
5. As a reader, I want to copy the definition I am reading, so that I can quote or reuse it easily.
6. As a reader, I want to follow nearby and related records with enough context to choose my next step, so that I can build understanding through continuous reading.
7. As a reader, I want practical examples and comparisons of commonly confused concepts, so that I can apply the vocabulary accurately.
8. As a reader, I want to inspect sources and distinguish verified support from uncertainty or editorial synthesis, so that I can judge what a record establishes.
9. As an editor, I want to review proposed content changes against their evidence and limitations before acceptance, so that knowledge improvements remain defensible.
10. As a Chinese-speaking reader, I want to switch languages on the same record and recognize missing or outdated translations, so that I can read available Chinese content without mistaking it for complete or current coverage.
11. As a translator, I want to maintain and review translations independently while identifying changes to their English source, so that I can keep translated prose accurate without altering canonical knowledge.
12. As a reader using a keyboard, assistive technology or a narrow viewport, I want to navigate and read the site comfortably, so that I can use the same discovery and reading features.

## Implementation Decisions

### 1. Baseline and delivery boundaries

- 实施前以仓库当前发布基线和实际共享契约为准，核对并保留已经完成的 Sources 投影、搜索范围说明、Skill Map inventory 与语言注释；不得用较早分支模板覆盖线上已有功能。
- 按“发现与证据试点 → 阅读与内容字段试点 → i18n”三个可独立验证的阶段交付。每阶段完成自己的验收，不把单阶段完成称为整份 spec 完成。
- 保持现有领域类型、独立记录维护方式、公开 slug、map-scoped ID、Speaking Card number、card 锚点及 layer 锚点。
- 沿用 paper／ink／acid-green 设计系统、Starlight 壳与主题／焦点／跳过链接／reduced-motion。导航保持现有入口，首版不替换为未经验证的 Learn／Explore／Apply。
- taxonomy YAML 仍是分类事实的规范来源；共享输入契约仍定义规则；portable schemas 继续生成并接受只读漂移检查。首页表述收紧为 canonical content，并说明多种派生投影的关系。

### 2. Homepage and search

- 将现有精选 Concept 与 summary 前移到完整分类网格之前；不增加第二套 taxonomy 或复制知识定义。保留查看全部 Concept 与全部 category 的直接链接，首页数量从正式数据派生。
- 字段搜索统一使用六种内容类型：Concept、Primitive、Speaking Guide、Skill Map、Map Node、Task Journey。Map Node 不统一改称 Skill，因为各地图的节点类型由自己的 taxonomy 定义。
- 每个结果展示完整类型文字；地图节点与任务路径展示 owning map；priority、category 和地图内类型作为附属信息，不占用通用内容类型位置。退役状态继续可见。
- 首版增加 All 与六种类型的单选筛选；已有 category／layer／status 展示保留，但不新增横跨全部类型的复杂 facet 系统。
- 搜索状态由 query 和 type 共同决定。q 与 type 写入 URL query 参数；缺失表示空查询与 All，未知 type 回退 All，其他无关参数不由控件删除。初始化、输入、清空、popstate、pageshow／BFCache 恢复都同步输入、选中筛选、可见结果、计数和空状态。
- 延续既有字段匹配范围；完整标题命中优先于标题前缀命中，再显示其他字段匹配。组内以 canonical 标题和稳定身份排序；首版不加入语义搜索、嵌入或新的搜索后端。
- 明确匹配发生在标题、别名、摘要、定义或已有被检索字段中的哪一类。直接正文命中提供一个文本匹配上下文；仅关系名命中说明对应的已存在关系。不得把 related 推断为依赖关系。
- 字段检索按 canonical identity 计数并去重；Pagefind 的页面／片段结果计数是另一统计单位，不要求两者相等。
- 复用现有 header Pagefind 能力并解释两种搜索范围，不创建第三套索引。保留其正常键盘与标点输入行为，项目快捷键仅在非编辑控件、非活动搜索弹窗上下文生效。

### 3. Reading and bounded content changes

- 首版提供 Copy definition 一个动作，复制当前阅读语言中实际展示的定义正文。Primitive 引用 Concept 的定义通过同一个解析结果取得，不重新维护或拼接另一份定义；按钮有可访问名称和明确成功／失败反馈。
- Concept 与 Primitive 详情分别采用同类型 canonical 英文标题的 A–Z 前后导航，slug 作为平局排序。中文页面保留相同记录顺序。边界记录不显示不存在的相邻按钮，不增加第二套“按分类”导航。
- Related Concept 预览展示目标记录的当前语言 summary，继续表达相关性，不渲染未经策划的关系类型。
- Concept 新增可省略的 examples、distinguish_from、aliases。examples 每项使用 context 与 example 表达英文情境和示例正文；distinguish_from 每项使用 target 与 distinction 表达目标 Concept slug 和英文差异说明；aliases 是英文等价称呼列表。默认空集合，既有记录无需补齐。
- examples 不代表已核验的事实；distinguish_from 的目标必须存在、不是自身且不重复，不形成新的通用图关系或手工反向表；aliases 不得为空、重复，或重复自身 term／zh。共享输入、portable schema、引用校验、搜索、详情与文档同步更新。
- 英文与中文 term 的既有契约保留。summary 继续承担短说明，不另增一份 one-line definition；不以代码字符下限替代编辑质量判断。
- 真实内容试点限定为两个 Concept：context-engineering、harness。各自提供至少一个有意义的 example，并在有真实混淆对象时提供一条 distinguish_from。不存在合理对象时记录理由，不为了字段覆盖编造区别。

### 4. Evidence pilot and editorial boundaries

- 证据试点覆盖上述两个 Concept，以及 context、verification-evaluation 两个 Primitive；每条形成可定位的来源、支持字段、限制、编辑综合说明和核验结果的审查摘要。
- 使用现有各类型 sources 契约；来源支持范围与核验过程保留在内容审查记录，不把核验理由塞入来源标题，也不把格式通过等同于核验通过。
- 公共来源允许追加；已有报告来源和未核验状态保留。来源暂不可访问、只支持部分陈述或存在不同解释时，明确写出限制，允许保留 unverified，不为通过交付门槛机械改成 verified。
- 缺少公开来源不阻止尚在工作定义阶段的整个词库构建；本阶段完成标准是四条记录有完整、可审查的证据结论，而不是全部变成 verified。
- 内容语义变更和译文审查分别遵循 Editorial Acceptance；实施或自动生成文本不替代维护者对正式知识的接受。本 spec 的发布本身不接受任何拟议内容。

### 5. English Canonical + Translation Overlay

#### Scope, ownership and units

- English Canonical 指首版 Concept／Primitive 知识正文及 taxonomy 语义的英文规范版本；既有 zh 保留为已策划的中文术语名与兼容搜索字段，来源标题保留原文，不机械翻译引文。
- Translation Overlay 是独立编辑的翻译资产，不是自动生成的事实来源。中文渲染结果才是 Content Projection。英文定义、身份、引用关系和证据状态的权威来源继续各自唯一。
- 每个 overlay 以 locale、内容类型和 canonical target ID 唯一定位；Concept／Primitive 使用既有 slug，category 使用公开 slug，layer 使用既有公开 anchor。独立 YAML 记录自动发现，拒绝重复身份和悬空目标，首版 locale 仅允许 zh-CN。overlay 输入契约版本为 1.0.0，明确使用 schema_version、locale、kind、target_id 与 units；kind 仅支持 concept、primitive、category、layer。
- overlay 只允许已注册的可翻译正文单元：Concept 的 summary、definition、why_it_matters、when_to_use、anti_pattern、examples 中的正文、distinguish_from 中的差异说明；Primitive 的正文、inline definition 的文字、composition 说明、considerations、distinctions、ownership／priority 的 rationale 和 scope；taxonomy 的展示 label、description、question。
- canonical term 与既有 zh 提供双语名称；首版 overlay 不另维护一份中文术语名。taxonomy 翻译 label 是展示文字，不能取代 canonical name、category 引用或 layer 引用。
- overlay 禁止改写 slug、category／layer 关系值、map 身份、number、status、priority level、ownership kind、related、primitives、引用定义的 concept、source URL、证据核验状态与时间。
- 使用字段白名单和对应的输入形状，不采用任意 JSON Patch。嵌套正文单元的定位由对应内容契约解释，不由页面作者自行遍历和替换。

#### Review, freshness and fallback

- 每个 unit 使用 path 定位白名单单元，translation 保存译文，source_fingerprint 保存源指纹，review_status 保存 draft／reviewed，reviewed_at 保存 reviewed 单元的真实 ISO 审查日期。同一 overlay 的 path 唯一；translation 为对应单元要求的文字或完整有序文字数组。缺失单元是允许状态，提供的译文不得为空白，不照搬英文正文的字符下限要求中文填充文字。
- fingerprint 针对被翻译的已解析英文单元生成，绑定目标身份、单元位置和原始文字；复用项目的确定性归一约定，不受 YAML 格式、文件发现顺序或对象键顺序影响。
- 同一单元若包含有序数组或依赖数组位置，fingerprint 覆盖整个拥有数组，校验成员数量、顺序和可翻译分支；数组增删／重排使相关单元失效，不允许旧翻译错误附着到新成员。引用值仍从 canonical record 取得。
- 修改无关的 added、来源链接或未翻译字段不会单独使译文 stale；修改被翻译单元或其定位上下文必须使受影响单元 stale。不得用整个 dataset digest 作为每一条译文的 freshness 判断。
- reviewed 且 fingerprint 匹配的单元才用于发布；draft 或 stale 单元回退当前英文，显示可读的覆盖／更新提示。stale 从实际 source 比较派生，不靠维护者手填标志。
- reviewed 表达翻译已审查，不代表英文知识或来源已核验。自动翻译只能生成 draft，不能自动改成 reviewed。
- 所有展示复用一个公共本地化目录解析边界：输入已验证的 canonical catalog、独立 overlays 和请求 locale，输出稳定身份的显示记录、每个单元的实际语言、覆盖／过期状态和 fallback 信息；读取与解析不修改源记录。
- Primitive 引用 Concept 的定义始终解析该 Concept 的本地化 definition，禁止在 Primitive overlay 复制它。fallback 的英文段落使用 lang=en，中文段落使用 lang=zh-CN；列表和复用摘要采用同一单元状态。

#### Astro／Starlight integration and routes

- 使用 Astro 的静态预渲染和 Starlight 原生 i18n 配置。英文作为 Starlight root locale，语言标签为 en；中文 locale 路由键为 zh-cn，语言标签为 zh-CN。只维护一套 locale 配置，不让 Astro 与 Starlight 默认语言各自漂移。[Starlight root locale 官方说明](https://starlight.astro.build/guides/i18n/#use-a-root-locale)
- 现有英文 URL 没有新增 en 前缀；中文 URL 在部署 base 之后加入 zh-cn。相同记录保持相同 slug、layer／card fragment，语言切换保留有效的锚点以及 q／type 查询条件。
- 自定义 Astro 页面通过共享视图和统一本地化解析结果生成两种静态路由，不为中文手工复制定义、维护页面列表或再建 Markdown 知识记录。中文 home、Concept／Primitive 列表与详情、category、搜索、Primitive layer 投影必须可直接访问。
- Starlight 管理的说明页使用其原生语言关联与 fallback；custom YAML 页面自行实现上述字段级 fallback，不假定配置 docs locale 后就会自动翻译 YAML 页面。自定义页面通过当前路由的语言上下文使用 Starlight 壳与翻译字符串。[Starlight custom pages 官方说明](https://starlight.astro.build/guides/pages/#custom-pages)
- Starlight 内置 UI 翻译继续复用；项目导航、类型标签、复制反馈、证据／翻译提示和搜索说明通过独立 UI translation dictionary 提供，不从知识正文反推界面字符串。
- 内部路由链接继续基于 pathWithBase／mapLink 的职责扩展 locale-aware 路由解析；先解析记录身份与语言，再只应用一次部署 base。禁止裸根路径、双重 locale 前缀和双重 base。
- GitHub Pages 继续为静态站点，无需 SSR、服务端语言协商或浏览器 Accept-Language 自动跳转。请求 locale 由 URL 决定，读者显式选择语言；不建立额外的持久化自动跳转状态。[Astro 静态语言上下文官方说明](https://docs.astro.build/en/guides/internationalization/#browser-language-detection)
- 为所有知识目标生成中文路径，即使单元缺失也可明确回退英文。Speaking Guide／Skill Map 及其 Map Node／Task Journey 提供中文壳的对应稳定路径，但保留原始 edition 文字和最小元素语言注释，并注明正文尚未纳入翻译覆盖；不能把既有中文策划内容未经审查改成 English Canonical。
- 不存在的记录和不支持的 locale 返回适当的 404；英文 fallback 只针对存在的记录，不能掩盖悬空引用。

#### Search, SEO and machine consumers

- 字段检索在当前 locale 中使用 resolved 正文，并保留 canonical 英文名称、英文 aliases、既有 zh 和已支持的相关名称作为查询入口；每个 canonical identity 只有一个结果，链接始终指向当前语言投影。
- Pagefind 基于正确的页面语言生成索引，中文入口不默认混入英文页面的第二份记录。中文页面中的实际英文 fallback 仍保持 lang=en；英文命中可通过该语言的页面上下文解释。用实际生产构建验证，不靠源码配置推断。
- 英文页面保留 canonical URL。中文 Concept 只有 summary 和 definition 均有当前 reviewed 译文，Primitive 只有 summary 和 scope 均有当前 reviewed 译文时，才作为可索引的中文详情页；否则 noindex、canonical 指向英文对应页，并显示覆盖状态。
- 可索引译文使用自身 canonical，en／zh-CN／x-default hreflang 指向真实可访问的对应页面；不发布指向不存在或无当前核心译文的 hreflang。其他局部 fallback 保留英文 lang 与提示，不强迫全记录必须翻译完成。
- 中文目录页在导航／用途说明已完整翻译、显示名语言已标注的条件下可索引；它们不以“全部词条均有中文正文”为承诺。
- 既有 dataset 与 llms 继续读取原始 canonical records，保留各类型的原始语言 edition，不应用中文 resolved overlay。新增可选 Concept 字段随正式 dataset 输出，基于现行 1.1.0 将导出 schema_version 升级到 1.2.0；若实施基线已有较新版本，按同样的兼容性规则递增并记录迁移，不退回旧版本。translation-only 编辑不改变 canonical 内容或 canonical dataset_version。
- 首版不发布新的 localized dataset／translation endpoint。未来需要机器消费 overlays 时，另行设计独立翻译版本与 provenance 契约，不把 resolved 中文记录混入现有 canonical 数组。

### 6. Acceptance deliverables

- 发现阶段：首批词条前移，六种类型筛选与命中上下文可用，URL／清空／恢复状态一致，existing Pagefind 与 Sources 投影保留，证据试点的四条审查摘要可检查。
- 阅读阶段：两个真实 Concept 的新增字段通过全部契约，Copy definition、A–Z 邻接和相关摘要可操作，引用与旧身份无回归。
- i18n 阶段：两个试点 Concept 和至少一个 Primitive 有经审查的中文核心译文，taxonomy 展示译文与中文 UI 可用；无译文、部分译文、draft、stale、有序数组变化和 referenced definition 等场景都有可检查的正确结果。
- 试点内容语义与译文各自有可定位的审查／接受记录；有未核验来源仍如实保留，不把交付描述成全库事实认证或全站中文翻译完成。
- 对项目实际支持的命令执行 check、test、build、extension 与 L2 验收，并在 production subpath、Pagefind enabled 条件下执行浏览器验收；新增 browser 命令时必须同步贡献指南和 CI，不假设尚不存在的命令已可使用。

## Testing Decisions

### Proposed primary acceptance seam

优先复用现有 L2 隔离扩充场景：从独立 YAML 输入开始，经公共 readCatalog／validateCatalog 边界、CLI 校验与 Astro 生产构建，检查公开 HTML、URL、搜索、复制、语言切换和 canonical exports。它是整个功能的主验收边界，测试外部行为，不为每个内部 helper 建一套独立 mock。

该验收边界检查功能的外部行为；测试通过不替代内容或译文的语义接受。

### Required scenarios

1. **Canonical integrity**：既有 record 数量由夹具计算，不冻结历史总数；旧 slug／number／anchor 和 inbound links 保留。新增 taxonomy YAML 后生成 enum 一致；修改已提交 Schema 会被只读检查拒绝。
2. **Inputs and projections**：examples、distinguish_from、aliases 在 Node、CLI、portable Schema 和 Astro 中接受／拒绝一致。缺省字段保持既有行为；悬空区别目标、自引用、重复 aliases 与未知字段被拒绝。
3. **Search journey**：六种结果混合夹具、精确标题优先、正文命中说明、单类型筛选、零结果、Clear、URL 初始化、popstate、真实 BFCache／reload恢复均在实际页面验证。计数必须等于可见 canonical records。
4. **Reading journey**：实际复制结果与当前显示定义相同；剪贴板拒绝不显示成功。A–Z 导航在两种语言中相邻身份一致；首末边界正确；相关摘要与详情使用同一 canonical 目标。
5. **Overlay boundary**：通过公共目录输入验证 duplicate key、未知 locale、悬空 target、非法字段、空白正文和 malformed fingerprint；无翻译输入时 canonical catalog 正常，draft 不进入可发布正文。
6. **Freshness and fallback**：只修改一个英文单元使对应译文 stale并回退；无关 metadata 变化不使它失效；YAML 排版不影响 fingerprint；有序数组成员增删／重排不能把翻译附到错误对象。缺失、部分、draft、stale 状态使用真实 HTML 和提示验证。
7. **Cross-record definition**：修改一个 Concept 英文／中文定义后，它自己的页面、Primitive 引用定义、相关摘要和 Copy 结果同步；Primitive 不含手工定义副本。
8. **Locale routing**：en 无前缀，zh-cn 位于部署 base 之后；所有内部链接只含一次 base／locale；语言切换保留身份、fragment 和有效搜索状态。未知目标 404，混合语言应用资源保留原始文本、edition 和 lang 提示。
9. **Rendered language and search**：真实页面 html lang、局部 fallback lang、UI 语言一致；实际 Pagefind 查询验证语言索引与返回链接，不能只断言 i18n 配置对象。两种搜索的计数单位与范围说明正确。
10. **SEO and exports**：完整核心译文、部分译文与无译文的 canonical／noindex／hreflang 按规则输出；translation-only 编辑不改变 canonical export 和 dataset_version；optional 知识字段带来的 export shape 变化有版本及兼容性测试。
11. **Perception and accessibility**：至少检查 390px、1440px，light／dark，键盘焦点、跳过链接、native controls、提示 live region、reduced-motion 和计算对比度；检查实际 BFCache、reload 和 400% zoom。缺少屏幕阅读器或其他环境能力时明确记录 unverified，不用窄屏重排替代 zoom。
12. **Editorial quality**：对四条证据试点逐条检查支持范围和限制，对两条 Concept 新内容与中文试点进行人工语义审查。测试通过不作为事实核验或译文准确性的证明。

Prior art：现有 content-boundary／Concept／Primitive contract 一致性测试、taxonomy tests、独立 YAML extension regressions、dataset-version tests，以及 L2 production-subpath 的真实浏览器场景。只有存在不能通过公共边界定位的缺陷时，补充少量下层测试；不得把 helper 实现细节、固定历史记录数或源码字符串断言作为交付依据。

## Out of Scope

- 重建 taxonomy registry、移除生成式 enum、立即迁移 category_id 或替换现有公开身份。
- 将所有 related 自动升级为 typed relations，或启用 Skill Map knowledge_refs。
- 全库一次性补齐证据、自动 verified、统一全部 Evidence 契约或引入逐句独立 Claim 系统。
- 将 Skill Map／Speaking Guide 的既有混合语言策划内容整体改写成英文，或承诺首版全站正文翻译完整。
- Learn／Explore／Apply 顶级 IA 重构、新的 collection ontology、复杂多维 search facets、语义搜索和排名学习系统。
- 同时加入 Copy Markdown／JSON／link 多动作、两套 Previous／Next 顺序、独立 one-line definition 或泛化内容版本管理。
- graph、taxonomy／单记录 JSON、localized machine exports、MCP、grounded Ask Lexicon。
- 新数据库、客户端框架、SSR adapter、翻译 SaaS、实时自动翻译或浏览器语言自动跳转。
- 发布 spec 等同于批准内容、推送代码、合并 PR 或生产部署。

## Further Notes

- 依据 2026-10-08 的网站对比核实报告。本地审查基线为 commit 4d7e90453f818bdbec09efbfee952cc807385d37；线上已包含较新投影。上述统计是基线观察，实施前重新读取当前 formal data，不能拿它们冻结测试数量。
- 本 spec 保持 ADR-0001 的本词库优先与薄内核、ADR-0002 的编辑接受／证据核验／争议区分、ADR-0005 的证据支持范围及初期不建逐句 Claim、ADR-0006 的 Application Resource／Content Projection 边界，以及 ADR-0010 的未来 knowledge_refs 边界。
- English Canonical + Translation Overlay 是本轮新增的明确方案。English Canonical 不意味着原本单语言之外的术语名、引用原文或应用资源会自动变成英文。翻译资产需要自己的编辑审查，其页面可从 canonical record 与 overlay 共同派生。
- 框架依据为当前查阅的 [Astro i18n](https://docs.astro.build/en/guides/internationalization/)、[Starlight i18n](https://starlight.astro.build/guides/i18n/) 与 [Starlight custom pages](https://starlight.astro.build/guides/pages/)。这是针对本项目的设计选择，不声称框架会自动完成 YAML 字段翻译、freshness 或语义审查。具体实现以仓库所用 Astro／Starlight 版本验证。
- 发布目标为 GitHub Issues：hilt21/ai-native-lexicon，triage label 为 ready-for-agent。该标签表示实现需求已明确，不表示证据或译文已被自动接受。
