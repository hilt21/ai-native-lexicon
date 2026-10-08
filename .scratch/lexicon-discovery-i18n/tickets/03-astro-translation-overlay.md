## What to build

读者能在相同知识记录上切换 English／简体中文，使用本语言的首页、目录、搜索、详情和复制动作；缺失、草稿或过期译文回退当前英文并清楚标注。译者独立维护、审查译文，来源变化只影响真正需要更新的翻译单元。

以已完成的 canonical 字段、英文发现／阅读交互为基线，完整打通 overlay 输入、公共目录解析、Astro／Starlight 静态语言路由、真实页面与搜索、SEO、机器兼容和生产子路径验收。覆盖 user stories 10–11，并将 2–6、8、12 延伸到两种语言。首版仅 en／zh-CN，不承诺全站正文翻译完成。

## Acceptance criteria

- [ ] English Canonical 适用于 Concept／Primitive 正文与 taxonomy 语义；既有 zh 继续提供中文术语名与搜索兼容，来源标题保留原文。Translation Overlay 是独立编辑资产，渲染结果是 Content Projection。
- [ ] 自动发现独立 YAML overlay，以 locale／kind／target_id 唯一定位。输入 schema_version 为 1.0.0；kind 支持 concept／primitive／category／layer，首版 locale 仅 zh-CN；Concept／Primitive 绑定 slug、category 绑定公开 slug、layer 绑定公开 anchor。重复身份、未知 locale、悬空目标和未知字段被公共输入边界拒绝。
- [ ] units 使用 path、translation、source_fingerprint、review_status、reviewed_at。path 唯一且受对应内容契约的白名单约束；translation 是单元要求的文字或完整有序文字数组；draft／reviewed 状态合法，reviewed 有真实 ISO 审查日期，提供的译文不可空白，不照搬英文字符下限。
- [ ] 支持 Concept 的正文、examples 正文与区别说明；Primitive 的正文、inline definition、composition、considerations、distinctions、ownership／priority 的 rationale 与 scope；taxonomy 的展示 label、description、question。禁止翻译改写身份、关系值、优先级枚举、ownership kind、来源 URL 和治理／核验状态。canonical term／zh 不再建立第二份中文名称。
- [ ] 源 fingerprint 绑定目标身份、翻译单元与其定位上下文，使用确定性归一。排版、发现顺序、对象键顺序和无关 metadata 不使译文 stale；被翻译文字变化使相关单元 stale；数组位置依赖覆盖整个拥有数组，增删／重排不能把旧译文附到新成员。
- [ ] 仅 reviewed 且 fingerprint 当前的单元进入发布正文。missing／draft／stale 回退当前英文并提供覆盖／过期提示，stale 由比较派生。自动生成只可产生 draft；reviewed 不意味着知识已核验。
- [ ] 一个共享本地化目录解析边界驱动列表、详情、关系摘要、搜索和 Copy，返回实际语言及覆盖状态，不修改 canonical 输入。Primitive 引用 Concept 定义解析该 Concept 的当前本地化 definition，禁止把它复制到 Primitive overlay；英文 fallback 使用 lang=en，中文使用 lang=zh-CN。
- [ ] Astro 静态预渲染与 Starlight 原生 i18n 只使用一套配置：英文 root locale、lang=en；中文路由键 zh-cn、lang=zh-CN。复用内置 UI 翻译，项目 UI 字典与知识 overlay 分开；不增加 SSR、翻译服务或浏览器语言自动跳转。
- [ ] 保留无 en 前缀的旧英文 URL；中文前缀位于部署 base 之后。语言切换保留身份、有效 fragment 与 q／type；所有路由只含一次 base／locale。生成中文 home、知识列表／详情、category、搜索和 Primitive layer 页面，不复制知识记录或维护手工页面索引。
- [ ] Starlight 说明页使用原生关联／fallback；custom YAML 投影自行执行字段级 fallback。Speaking Guide／Skill Map／Map Node／Task Journey 的中文壳保留原始 edition、最小元素语言注释，并注明正文不在首批覆盖范围；不把混合语言应用资源未经审查改写为英文。
- [ ] 中文搜索使用 resolved 正文，并保留 canonical 英文名、aliases、zh 与既有相关名称；每个 canonical identity 一个结果，结果链接使用当前 locale，状态恢复沿用已完成的搜索契约。真实 Pagefind 验证页面语言、索引、结果目标和英文 fallback，不依赖源码断言。
- [ ] Concept 的中文 summary／definition、Primitive 的中文 summary／scope 都有当前 reviewed 译文时才将该详情作为可索引中文版本；否则 noindex、canonical 指向英文且提示覆盖状态。可索引译文自指 canonical，hreflang 仅指真实可访问、有当前核心译文的页面；英文及 x-default 关系正确。中文目录说明与导航完整翻译、语言标注正确后可索引。
- [ ] 未知记录／locale 正确 404，fallback 不掩盖悬空引用。既有 dataset／llms 仍使用原始 canonical records 和各类型 edition；translation-only 编辑不改变它们或 canonical dataset_version，不新增翻译导出 endpoint。
- [ ] 两个试点 Concept 和至少一个 Primitive 具有经审查的中文核心译文，taxonomy 展示与中文 UI 可用。内容语义与译文接受分别留证；技术测试不替代 Editorial Acceptance 或事实核验。
- [ ] 复用 L2 隔离输入 → 公共目录／CLI → Astro 生产子路径构建 → Pagefind enabled 的真实浏览器完整验收，覆盖 missing／partial／draft／stale、无关 metadata、数组重排、引用定义、非法 overlay 和无 overlay 的兼容场景。
- [ ] 两语言实际页面中的选择器、搜索／Clear／历史恢复、Copy、A–Z、关系链接、lang、canonical／noindex／hreflang 和 export 均符合契约；相关 check／test／build／extension／L2 通过。检查 light／dark、390px／1440px、键盘、reduced-motion、计算对比度、实际 BFCache／reload／400% zoom；不可用的屏幕阅读器等检查明确 unverified。
- [ ] 不启用 knowledge_refs、typed graph、应用资源完整翻译、第三语言、localized dataset、MCP 或新客户端框架。必要的 locale-aware 解析与链接整理作为本票前置工作完成，不单独拆框架票。

## Blocked by

- [#37 — 首页与字段搜索：更快找到正确词条](https://github.com/hilt21/ai-native-lexicon/issues/37)。需要稳定的 aliases／筛选／URL 状态、结果标签与搜索范围契约来实现中文投影。
- [#38 — 词条阅读：示例、区别、复制与证据试点](https://github.com/hilt21/ai-native-lexicon/issues/38)。需要稳定的正文单元、examples／distinguish_from、Copy／A–Z 与来源呈现契约来实现翻译及 freshness。
