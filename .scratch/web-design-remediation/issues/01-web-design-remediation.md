# [WEB-01] 端到端修复网页审查问题，交付稳定检索、可读地图与语言投影

Status: approved for publication; implementation has not started.
Tracker: GitHub, hilt21/ai-native-lexicon.
Ticket kind: 单张端到端开发票。
Specification: https://github.com/hilt21/ai-native-lexicon/issues/31
Blocked by: None
Publication label: ready-for-agent.

## 问题与交付

读者能使用现有词典，但地图摘要窄栏、历史返回状态不一致、定义搜索漏项、来源缺失和快捷键冲突影响完整阅读流程。本票实现已确认 Spec #31 的 R01-R09，并完成同一生产子路径下的行为、视觉、schema/export 与扩充回归。

完成后，读者能按定义找到概念、从详情检查已有来源、返回筛选结果时继续阅读、在搜索对话框正常输入标点、阅读语言标记正确的中英文内容，并从 Structure 理解真实的有向关系。现有品牌、公开身份、内容正文、来源快照与指导步骤保持。

本票就是整份 change；下列实施顺序是同一票内的可运行检查点。不得再按样式、schema、数据、UI、导出、测试、角色或并行潜力拆成子票。

## 依据与执行输入

- 冻结规格：Spec #31 当前正文，本票末尾附完整快照；发生规格修订时先对照版本，不能靠聊天摘要补需求。
- 代码基线：`codex/skill-maps`、`4d7e90453f818bdbec09efbfee952cc807385d37`。领取时验证该 commit 可获取并检查工作区改动；保留他人变更，不重置工作区。
- 仓库约束：AGENTS.md、GLOSSARY.md、ADR-0006/0008/0009/0010、docs/design/skill-map.md、docs/design/redesign-system.md、docs/exports.md。
- 审查来源：2026-10-07 网页设计 audit，发现对应 F1-F7、R1 和确认的16px grid错位；它是 before 证据，不能作为 after 验收截图。
- spec 当前已 OPEN 且 ready-for-agent；它是规格依据，不是必须“完成/关闭后”才能执行的阻塞票。不得修改或关闭 #31。

## 实施范围

### 页面阅读、交互和目录检索

- R01/R09：五类 Skill Map 单段摘要与两子项 `.page-intro` 容器分离；只重置 `.practice-grid`/`.map-io`/`.map-structure` 直接子项的错误 Markdown sibling margin。
- R02：Map directory 用可见控件作为当前状态，初始/input/change/Clear 共用同步逻辑；pageshow 后下一任务同步历史恢复。保持 active/retired、type/cluster/AND文本规则，无 URL/localStorage 状态扩展。
- R03：Concept 检索保留现有字段，增加 canonical definition 与显式 related Concept slugs/英文中文名；保持其它类型的匹配、目标和排序。显示关联 input 的搜索范围说明，不要求和 Pagefind 同结果。
- R04：有 source 的 Concept 从原数组渲染 Sources，空来源省略；保留 working definition/maturity，不能制造核验徽标。
- R05：删除自定义全局裸 `/` 与 kbd提示，保留 Starlight Cmd/Ctrl+K/dialog、native键盘行为和本地input可达性。
- R07：Structure保留taxonomy顺序与全部有效分组；每组至多3个按ID排序的“示例”和完整active计数。按relation type显示一条真实active→active有向示例，按(from,to)稳定选择；没有边则省略关系示例区。
- R08：新control-border token用于Map query/select/Clear，明暗边界>=3:1；保留装饰line token、字体/焦点/44px控件尺度。

### 语言元数据，从正式记录到页面和机器导出

- R06：Map/Node/Journey 增加可选 `text_languages` 平面路径→language tag字典，允许路径和tag规则严格遵循附录规格；不翻译正文、不检测字符猜语言、不使用map-ID分支、不改字符串为翻译对象。
- CLI/Astro共用路径与edition验证，指向不存在/非prose/引用/日期/URL或越界索引的提示被拒绝且定位记录/字段。不同语言按最小文本元素投影，包括列表、目录、筛选options和Search复用文本。
- 当前pstack的82个 Map/Node/Journey记录只加必要语言提示并升级Map input edition；中文静态UI显式zh-Hans，英文官方描述保持en。
- 输入同时读取未标注1.0.0和新1.1.0；旧edition携带metadata拒绝。Node/Journey共享父Map edition，不另造record版本。
- runtime/portable四schema保持同步；dataset export升级1.2.0，legacy version和既有数组/身份/date语义不变；metadata keys稳定排序，digest涵盖语言值且忽略字典键枚举顺序。llms/source snapshots不变。
- metadata、schema、validator、renderer、export及文档在同一可验证提交/变更单元内完成，不发布只迁移了数据但reader不识别的状态。

### 可重复验证

- 使用已有Node/reader/schema/export/构建HTML测试边界，新增真实浏览器回归而非只有源码正则。
- 利用已有playwright和scripts/verify-l2-browser.mjs的build/serve模式，增加 `npm run test:browser`；接入verify CI，在生产BASE_PATH=/ai-native-lexicon且Pagefind enabled的构建上验收键盘与历史状态。
- 完成附录规定的17模板smoke、changed-layout亮暗截图、320/768/1024 reflow、keyboard/state/lang/reduced-motion与扩充夹具。按数据派生计数，不把审查时74/228/237写成永久限制。
- 提供机器可读 evidence manifest、before/after截图、命令最终exit和保留性比较。Lighthouse及屏幕阅读器条件按规格报告；工具不可用不能假装验证通过或拿320px替代400%zoom。

## 原子验收清单

以下28项均属于本票，不允许仅以“Spec已有验收”替代票内检查。具体语义与阈值以末尾冻结规格为准。

- [ ] **A01**: all five summaries occupy `min(parent available width, --lex-reading-width)` within2 CSS px, with no first-grid-track confinement; verify pstack at390/1024/1440.
- [ ] **A02**: at1024 and1440 the two practice panel top edges and first labels differ by at most1 CSS px. At390, panels stack with existing spacing.
- [ ] **A03**: All concepts/Speaking Cards existing two-child introductions retain their intended layout; normal Markdown paragraphs keep their existing vertical spacing.
- [ ] **A04**: changed templates and representative Concept/Primitive details have one visible H1 and no document horizontal overflow at320/390/768/1024/1440. Screenshots must be captured after entrance animations settle.
- [ ] **A05**: `tdd` + capability gives one matching item on the current fixture; open tdd then Back/Forward/Back. Restored controls, count, visible rows and empty state agree after each traversal.
- [ ] **A06**: repeat with query+type+cluster+retired combinations in a synthetic map, including an empty result before navigation. Exercise both BFCache and a return where the page reloads.
- [ ] **A07**: refresh with browser-restored controls and fresh direct navigation both produce results matching the values actually shown; refresh is not required to preserve a query that the browser did not restore.
- [ ] **A08**: Clear from an empty filtered set restores all eligible active items, removes the empty message and puts focus on Search items.
- [ ] **A09**: custom taxonomy, no clusters, empty collection and retained retired entries work without pstack-specific branches. With JavaScript disabled, content and native links remain browsable; do not claim filtering operates without JavaScript.
- [ ] **A10**: `persistence` returns Harness exactly once; `mcp`, its Chinese name, a related concept slug/name and existing Guide/Primitive/Map query fixtures still resolve the intended records.
- [ ] **A11**: mixed case and surrounding whitespace produce the same matches; multiword queries require every word; unmatched query exposes zero count and empty state; clearing restores the derived total.
- [ ] **A12**: field-search help text is visible and programmatically associated with the input. No promise that catalog and Pagefind produce identical results or stemming/ranking.
- [ ] **A13**: on a production `/ai-native-lexicon/search/` page, open header Search and type `a/b` with real key events. The textbox contains `a/b`, focus stays inside the dialog, and Escape returns focus to the trigger.
- [ ] **A14**: pressing bare `/` while a page link has focus does not move focus or prevent normal input behavior. Cmd/Ctrl+K, dialog Tab traversal, mobile Menu and Speaking Card Enter/Space remain functional.
- [ ] **A15**: MCP and Skill show their maintained sources, once each per array item, with exact canonical title/URL and keyboard reachability.
- [ ] **A16**: an empty-source fixture omits Sources while its definition/practices/relationships still render. Unusual but accepted source URI schemes follow the existing sourceUri contract, not a new renderer-only rule.
- [ ] **A17**: source projection leaves Concept YAML, dataset fields, public slug, maturity and related links unchanged.
- [ ] **A18**: pstack tdd summary/mechanism and Chinese footer have effective zh-Hans; its English official description has effective en. Journey Chinese explanations and English when_to_use examples retain appropriate languages.
- [ ] **A19**: built map listings/search/filter options use the exact annotations of the displayed fields. A new English-only map and a synthetic mixed-language map work without ID-specific conditions; omitted metadata behaves as before.
- [ ] **A20**: runtime and portable schemas agree on valid/invalid tags and metadata structure. Shared assembled validation rejects nonexistent paths, indexes, non-prose targets and1.0.0/metadata mixtures with record/path diagnostics.
- [ ] **A21**: before/after canonical comparison allows only map edition and new annotation dictionaries; prose, identities, relationships, source snapshots and Journey order are identical.
- [ ] **A22**: export exposes1.2.0 and metadata; metadata key reordering leaves dataset_version unchanged, changing a language value changes it. Old unannotated1.0.0 map remains valid and does not acquire artificial empty metadata in its export.
- [ ] **A23**: for every represented type, its example is an actual canonical edge with two active endpoints and its correct outgoing_label/links; count is one per eligible type. Selection is stable under relation-file ordering changes.
- [ ] **A24**: nodes beyond the first3 are reachable through All items; total counts reflect complete active membership, not example counts. Groups preserve taxonomy order and include nodes in their declared secondary clusters.
- [ ] **A25**: empty nodes/edges/layers/clusters, no layers, nodes without layer, custom types, cycles and retired endpoints build without errors or fake content. Zero-edge maps omit examples, not the structure page.
- [ ] **A26**: ordinary links, source distinctions and prose convey the same relationships without JavaScript; examples do not imply execution authorization or force Journey steps to match graph order.
- [ ] **A27**: rendered input/select/Clear border-to-adjacent-background ratios are >=3:1 in light and dark; normal-text labels/placeholders/button text remain >=4.5:1.
- [ ] **A28**: keyboard focus is visible, tabs/select/checkbox/Clear can be used at320/390, and the retired control label retains its effective target. No new glow, shadow or accent family.

## 同一票内的实施顺序

1. 先锁定before场景与可用测试seam，保存正式记录保留性基线；按S1修摘要/grid和按S2修返回状态，并验证相关行为。
2. 按S3修definition检索、来源和快捷键，再以生产Pagefind dialog复核真实keypress。
3. 按S4原子交付语言数据/schema/validator/render/export/docs，不将其切成“先数据、后reader”的外部发布票。
4. 按S5交付Structure关系示例及控制边界；和语言投影联测。
5. 按S6完成全票浏览器矩阵、CI wiring与全部required commands，生成完整验收证据。

每个检查点按风险运行相关验证；完成票以全部验收为准，不将中间步独立称为功能完成。避免重复无关全量检查；全票结束必须跑规格要求的完整命令。

## 实施落点

- 样式/页面：src/styles/{tokens,custom}.css，SkillMapPage/SkillMapDirectory，src/pages/skill-maps各模板，src/pages/search.astro，src/pages/concepts/[slug].astro。
- 语言契约：src/domain/content/{skill-map-input,read-skill-maps,validate-skill-map-references,skill-map-export}.mjs，src/lib/skill-maps.ts或窄的presentation helper，schemas四SkillMap文件，src/data/skill-maps/pstack的map/nodes/journeys。
- 导出/测试/交付：dataset.json.ts、现有dataset-version机制，Node/schema/extension测试，browser脚本、package scripts、Pages verify job，CONTRIBUTING及design/export文档。

## 单个fresh context的工作方式

初始只读取本票/冻结规格、AGENTS和当步的目标模块；不把32份源代码/测试/文档、82份完整YAML、全部截图和上游技能全文一起注入context。当前可定位核心实现21文件约78.5KB，完整规格约31.2KB；82份可标注记录可由脚本按字段路径提取候选prose、对照前后文本逐项核对，而不是手工重写记录。relations.yaml只读校验，不重新录入169条关系。

按需加载现有测试案例；先创建小的旧edition/新edition/混合语言/空地图/retired夹具，再扩充真实记录。schema由现有命令生成，fixture与截图写文件，终端只返回失败和摘要。当前没有证据要求结构重构或跨发布分期；字节量不是token精确计量或上下文保证。

如果实际执行出现新的硬约束，必须给出具体seam、上下文预算/耗用或迁移依赖证据再重新评估拆票；不得仅因工作较多、文件数或可并行就改变票数。

## 不在本票范围内

Spec #31全部out-of-scope继续有效：不重排首页/换品牌，不加search facets/ranking/pagination/URL state，不改Primitive搜索目标，不引入全图/数据库/前端框架，不加知识映射/自动翻译/来源推断，不改公开身份、正文、关系、步骤、来源快照和法律文本。其余P3优化不是验收条件。

开发执行需要独立授权；本票的起草/发布不授权commit、push、PR、merge或deploy，也不修改父Spec #31。不要把旧audit的check/test/build通过当作本票的新运行结果。

## 交付退出条件

- [ ] R01-R09、A01-A28及保留边界均有当前source证据，无未解释失败。
- [ ] schema:generate后check/test/build/test:extension/test:l2/test:browser按规格完成并有最终exit0，schema没有漂移，diff检查通过。
- [ ] before/after截图、生产子路径/Pagefind、history/key/lang/contrast结果和manifest可复核；可选工具缺口明确标注。
- [ ] 最终交付总结逐项映射需求与diff，记录export/input edition变化以及未授权发布边界。

## 冻结规格快照

以下来自Spec #31，经本地镜像与GitHub正文一致性核对；它是本票的完整行为契约，实施时不需要打开另一个聊天或下载旧截图才能确定要求。

<details>
<summary>Spec #31完整正文</summary>

# Web design audit remediation: executable specification

Status: ready-for-agent (specification only; implementation has not started).
Baseline: `codex/skill-maps`, commit `4d7e90453f818bdbec09efbfee952cc807385d37`.
Date: 2026-10-07, Asia/Shanghai.
Tracker: `hilt21/ai-native-lexicon`, GitHub Issues. The tracker issue is canonical; this file is its working mirror.

## 1. Problem and outcome

读者已经能浏览知识、练习对话和选择技能，但局部布局、检索和状态契约使这些任务变得不可靠：地图摘要被压成窄栏；Back 后筛选结果与控件不一致；按定义搜索无法命中；来源没有展示；后台快捷键干扰模态输入；中文内容缺少语言标记；Structure 无实际关系示例。

本交付修复以上行为，保留已有 editorial field guide 品牌、Astro/Starlight、公开身份和知识类型。实现完成必须同时具备行为回归、生产子路径验证、视觉证据和同步文档；不能用测试数量或源码正则替代用户流程验证。

Audit 是问题证据，不是逐项照抄的实现要求。下文明确选择具体方案；未进入本规格的设计建议不构成实施任务。

## 2. Source of truth and scope

依据：2026-10-07 的《AI Native Lexicon 网页设计审查》，F1-F7、R1，以及 practice-grid 第二格继承16px margin 的确认观察。审计时 check/test/build 通过不代表问题已修复。审计基线数据为84 Concepts、42 Primitives、20 Speaking Cards、1 Map、74 active Map Nodes；新增内容后测试必须从数据派生计数，不能依赖这些数字永远不变。

必须遵循 `AGENTS.md`、`GLOSSARY.md`、ADR-0006/0008/0009/0010、`docs/design/skill-map.md`、`docs/design/redesign-system.md`、`docs/exports.md`。

| Requirement | Audit | 本轮确定的结果 |
| --- | --- | --- |
| R01 | F1 | 五类地图单段摘要使用独立阅读样式 |
| R02 | F2 | 输入、列表、计数、空态在历史恢复后同步 |
| R03 | F3 | Concept definition/related names加入目录检索；解释两个搜索范围 |
| R04 | F4 | Concept Sources从已有canonical数组投影 |
| R05 | F5 | 删除自定义裸 `/` 全局快捷键及提示；保留Starlight快捷键 |
| R06 | F6 | 中文段落有明确语言元数据，按文本位置渲染lang |
| R07 | F7 | Structure从canonical relations显示真实、定向关系示例 |
| R08 | R1 | 筛选控件边界双主题达到3:1；不加深装饰分隔线 |
| R09 | P3确认错位 | UI grid直接子项不继承Markdown的额外top margin |

R06需要有限的schema/export扩展。其它要求是现有内容投影与交互修复，不改canonical正文、关系或排序。

## 3. User stories

1. As a map reader, I want readable summaries, so that I can understand an item without reading a narrow column.
2. As a mobile reader, I want summaries and controls to fit the screen, so that I can browse without horizontal scrolling.
3. As a directory user, I want query, type and cluster filters to work together, so that I can find relevant items.
4. As a directory user, I want Back and Forward to show results matching the visible controls, so that I can resume browsing reliably.
5. As a returning visitor, I want restored form values to agree with counts and results, so that refresh does not create contradictory information.
6. As a directory user, I want a clear no-results state and a working reset, so that I can recover from an overly narrow search.
7. As a reader of older material, I want retired items excluded by default and available on request, so that I can distinguish current guidance from retained history.
8. As a concept reader, I want to find a term by words in its definition, so that I can search before knowing its name.
9. As a concept reader, I want searches to include explicitly related names, so that I can follow known relationships.
10. As a search user, I want the two search scopes explained, so that I can understand why their results differ.
11. As a search user, I want empty, whitespace and multiword queries to behave consistently, so that searching is predictable.
12. As a concept reader, I want maintained sources linked from the detail page, so that I can inspect its editorial basis.
13. As a concept reader, I want unsourced working definitions to remain clearly presented, so that absent evidence is not disguised.
14. As a keyboard user, I want punctuation to remain normal input in a search dialog, so that shortcuts do not consume my text.
15. As a keyboard user, I want existing search, menu and disclosure controls to remain operable, so that fixing one shortcut does not break navigation.
16. As a screen-reader user, I want Chinese and English prose identified correctly, so that my reader can select the appropriate voice.
17. As a map author, I want to annotate a text's language without changing its identity or wording, so that multilingual maps share the same templates.
18. As a map reader, I want concrete relationship examples with direction and labels, so that I can understand how entries relate.
19. As a reader of a sparse map, I want useful structure navigation without invented relationships, so that empty groups and isolated nodes remain valid.
20. As a low-vision user, I want clearly identifiable filter controls in both themes, so that I can see where to enter or select values.
21. As a detail reader, I want adjacent panels aligned, so that the layout does not imply an unintended hierarchy.
22. As a consumer of the dataset, I want language metadata versioned and deterministic, so that I can recognize the new export contract without losing existing records.

## 4. Architecture and preservation contracts

- Concepts/Primitives/Speaking Guides/Skill Maps stay separate canonical types. Pages derive data from existing content collections and the shared readers.
- No route, slug, card number, `#card-XX`, category/layer anchor, primary-nav label or form field identity changes. Internal links use `pathWithBase`/`mapLink`.
- Keep paper/ink/acid-green, display typography, system fonts, spacing/focus tokens, theme switch, skip links, native details/select/input semantics and reduced-motion support.
- No new browser framework, database, graph-layout library, state store, translation service or search backend.
- No node/journey creation, deletion, retirement, new knowledge_refs, changed snapshot targets or rewritten source description. Language annotations are the only canonical data addition.
- Existing tests may be extended; new regressions use page/reader/schema/export boundaries, not private function mocks or new source-regex-only assertions.
- Do not change existing source snapshots, `current_sources`, node relation direction or Journey order to satisfy a UI test.

## 5. Detailed implementation contracts

### R01/R09: summaries and grid alignment

Owned surfaces: Skill Maps directory; Map Tasks; Structure; Journey; Node. Keep `.page-intro` for its existing two-child index introductions. Introduce one shared single-paragraph class for map summaries and use it on all five surfaces.

Single-paragraph contract: ordinary block text, width limited by the existing reading measure and available parent width; no internal grid tracks, no fixed narrow width and no hidden content. This change does not remove the node's local directory or alter its breakpoint.

Only reset direct-child block-start margins in UI grids whose siblings must align: `.practice-grid`, `.map-io`, `.map-structure`. Do not reset all Markdown descendant margins. Preserve padding, borders, normal paragraph/list spacing, existing mobile collapse and text order.

Acceptance:

- A01: all five summaries occupy `min(parent available width, --lex-reading-width)` within2 CSS px, with no first-grid-track confinement; verify pstack at390/1024/1440.
- A02: at1024 and1440 the two practice panel top edges and first labels differ by at most1 CSS px. At390, panels stack with existing spacing.
- A03: All concepts/Speaking Cards existing two-child introductions retain their intended layout; normal Markdown paragraphs keep their existing vertical spacing.
- A04: changed templates and representative Concept/Primitive details have one visible H1 and no document horizontal overflow at320/390/768/1024/1440. Screenshots must be captured after entrance animations settle.

### R02: directory state restoration

Canonical state for this slice is the actual directory form controls: query, type, optional cluster, Include retired. Do not add URL state or persistent storage. Fresh navigation uses the current defaults. If the browser restores controls, those controls are authoritative.

Use a single update path for initial render, input/change and Clear. On `pageshow`, schedule another synchronization in the next task so history-restored form values are read after browser restoration. This applies to BFCache and non-BFCache returns. Do not rely only on the script's first execution. Scope listeners and selectors to the directory; initialization must not duplicate listeners.

Existing match semantics stay: lowercase/trim/whitespace-separated AND terms over existing indexed text; selected type AND selected cluster; default active-only; Include retired expands eligibility. Cluster matches either primary or secondary membership. Missing cluster taxonomy/control means no cluster predicate.

Clear resets query/type/cluster/retired, immediately updates list/count/empty state and focuses Search items. No automatic focus or scroll reset on history restoration.

Acceptance:

- A05: `tdd` + capability gives one matching item on the current fixture; open tdd then Back/Forward/Back. Restored controls, count, visible rows and empty state agree after each traversal.
- A06: repeat with query+type+cluster+retired combinations in a synthetic map, including an empty result before navigation. Exercise both BFCache and a return where the page reloads.
- A07: refresh with browser-restored controls and fresh direct navigation both produce results matching the values actually shown; refresh is not required to preserve a query that the browser did not restore.
- A08: Clear from an empty filtered set restores all eligible active items, removes the empty message and puts focus on Search items.
- A09: custom taxonomy, no clusters, empty collection and retained retired entries work without pstack-specific branches. With JavaScript disabled, content and native links remain browsable; do not claim filtering operates without JavaScript.

### R03/R05: catalog search and keyboard behavior

Keep the existing local field search, matching rule and result ordering. Extend only the Concept indexed text: retain term/zh/category/summary/primitive slugs+names; add canonical definition, related Concept slugs and their English/Chinese names. Resolve names through the already loaded collections. No manual search index or copied definitions.

Other record kinds keep their present matching fields and targets. Primitive direct-to-detail navigation, type facets, ranking and query persistence remain separate product changes.

Keep both existing Search entry labels and routes. Add visible helper text by the catalog input, connected by `aria-describedby`:

> This catalog matches record fields, including concept definitions and linked terms. Header Search, when available, searches full page text.

Delete the custom document-level `/` listener and its `<kbd>/</kbd>` hint. Do not substitute another bespoke shortcut or settings panel. Keep Starlight's Cmd/Ctrl+K and its dialog behavior unchanged. The catalog input remains reachable via label, Tab and pointer in builds without Pagefind.

Acceptance:

- A10: `persistence` returns Harness exactly once; `mcp`, its Chinese name, a related concept slug/name and existing Guide/Primitive/Map query fixtures still resolve the intended records.
- A11: mixed case and surrounding whitespace produce the same matches; multiword queries require every word; unmatched query exposes zero count and empty state; clearing restores the derived total.
- A12: field-search help text is visible and programmatically associated with the input. No promise that catalog and Pagefind produce identical results or stemming/ranking.
- A13: on a production `/ai-native-lexicon/search/` page, open header Search and type `a/b` with real key events. The textbox contains `a/b`, focus stays inside the dialog, and Escape returns focus to the trigger.
- A14: pressing bare `/` while a page link has focus does not move focus or prevent normal input behavior. Cmd/Ctrl+K, dialog Tab traversal, mobile Menu and Speaking Card Enter/Space remain functional.

### R04: Concept Sources projection

Render a `Sources` section after the practice content and before relationship projections when `concept.data.sources.length > 0`. Each source is a native link with canonical title as text and canonical URL as href; preserve array order. Do not rewrite URLs, open a new browsing context by default or fetch source pages at build time.

When sources is empty, omit the section. Do not invent a verified badge, “no evidence” warning or empty box. Maintain Working definition and the existing maturity semantics.

Acceptance:

- A15: MCP and Skill show their maintained sources, once each per array item, with exact canonical title/URL and keyboard reachability.
- A16: an empty-source fixture omits Sources while its definition/practices/relationships still render. Unusual but accepted source URI schemes follow the existing sourceUri contract, not a new renderer-only rule.
- A17: source projection leaves Concept YAML, dataset fields, public slug, maturity and related links unchanged.

### R06: explicit language metadata (isolated contract slice)

Decision: add optional `text_languages` to Map, Node and Journey records. It is a flat dictionary from an existing prose-field path to a language tag. It annotates the current string; it does not replace strings with translation objects, introduce locale routes or infer language from a script/character detector.

Why this seam: the current records contain Chinese summary/mechanism text alongside English official_description, task phrases and taxonomy descriptions. One map-wide Chinese wrapper would mislabel existing English prose and future maps. A per-text hint gives a bounded reusable contract without copying content into a presentation sidecar.

Contract:

- Supported tags use the restricted BCP47 form: lowercase2-3-letter language, optional Titlecase4-letter script, optional uppercase2-letter or3-digit region. Examples: `en`, `zh-Hans`, `en-US`, `pt-BR`. Reject empty tags, underscores, noncanonical casing and invalid shapes; no full registry/translation service is introduced.
- Paths use ordinary named fields and zero-based array indexes. Examples: `summary`, `official_description`, `when_to_use.0`, `variants.0.steps.2.why`, `taxonomy.layers.0.description`. No wildcard, default language or path traversal.
- Map allowlist: title/summary/scope/audience strings and taxonomy type/layer/cluster label+description and relation-type outgoing_label/incoming_label/description.
- Node allowlist: title/summary/mechanism/retirement_note/official_description, when_to_use/solves/inputs/outputs/handoffs/tags strings.
- Journey allowlist: title/summary/retirement_note, when_to_use/inputs/outputs strings, variant title/when and step title/why/when/outputs strings.
- Each path must resolve to an existing nonempty string on that exact record. Paths into IDs, references, `sources`, dates, URLs or `text_languages` are rejected. Array bounds and optional-field presence are checked after parsing. Keys refer to current editorial array order and must be maintained with text reordering.
- Omitted metadata remains omitted; an empty dictionary is valid. A missing hint inherits document `en`; it must not cause heuristic Chinese annotation. Imported content with other languages must be explicitly annotated by its editor.
- Render `lang` on the smallest element containing the indicated text. Do not place a field's lang on a surrounding section with differently annotated descendants. Shared literal Chinese UI labels/explanations use `lang="zh-Hans"`; literal English UI uses/inherits `en`.
- Map metadata also governs that map's text wherever reused: directory listings, Tasks, Structure, filters/options, search-result summaries and provenance scope. Node/Journey text uses its own metadata wherever projected. Keep titles/compound labels semantically intact; separate spans where a composite label mixes languages.
- In current pstack data, annotate every Chinese full prose field, including nested Journey explanations and taxonomy labels/descriptions. English full prose defaults to en or is explicitly tagged en. Do not translate or rewrite any original string. Short proper names/commands embedded in prose do not require per-word language objects.
- Do not add language fields to relations/source snapshots. Relation-note language is outside this audited defect slice; preserve current note behavior rather than guessing.

Versioning and compatibility:

- New language-aware maps use Map input `schema_version: 1.1.0`; keep reading unannotated1.0.0 maps.
- A1.0.0 map with `text_languages` on itself/nodes/journeys is rejected with an actionable version error. Node/Journey metadata share the owning map's edition; do not add independent record version fields.
- Regenerate all four portable Skill Map schemas. Map schema accepts both editions with metadata edition constraints; Node/Journey schemas validate metadata structure. CLI/Astro share assembled path/version checks through the existing reader/validator boundary. Relation schema remains unchanged in shape.
- `/dataset.json` export `schema_version` becomes1.2.0 when metadata is published. Legacy `version: 0.2.0`, counts, existing arrays and date/identity semantics remain. Optional metadata exports at the same record positions; no derived lang HTML attributes are exported.
- `normalizeSkillMaps` orders metadata dictionary keys deterministically; `dataset_version` includes annotation values and ignores metadata key enumeration order. Existing unordered sets and ordered taxonomy/variants/steps semantics remain.
- `llms.txt` content/targets stay unchanged by language hints. Update exports, contribution, field contract and tests in the same slice. No source snapshot ID/commit is changed.

Acceptance:

- A18: pstack tdd summary/mechanism and Chinese footer have effective zh-Hans; its English official description has effective en. Journey Chinese explanations and English when_to_use examples retain appropriate languages.
- A19: built map listings/search/filter options use the exact annotations of the displayed fields. A new English-only map and a synthetic mixed-language map work without ID-specific conditions; omitted metadata behaves as before.
- A20: runtime and portable schemas agree on valid/invalid tags and metadata structure. Shared assembled validation rejects nonexistent paths, indexes, non-prose targets and1.0.0/metadata mixtures with record/path diagnostics.
- A21: before/after canonical comparison allows only map edition and new annotation dictionaries; prose, identities, relationships, source snapshots and Journey order are identical.
- A22: export exposes1.2.0 and metadata; metadata key reordering leaves dataset_version unchanged, changing a language value changes it. Old unannotated1.0.0 map remains valid and does not acquire artificial empty metadata in its export.

### R07: deterministic Structure projection

Keep layer/type/cluster group identity and editorial order. Where layers exist, group by layer; otherwise group by type. Preserve an Other items group for active nodes without a layer. Include configured empty groups with zero count and navigation; do not invent representative nodes for them.

Replace repeated full lists in overview with total active counts and at most3 example nodes per group, selected by stable node-ID codepoint order. Label these as `Examples`/`示例`, not recommendations or rankings. Link each group to the existing All items page; filtering by URL is not part of this slice. Full active membership remains in All items. Use the same bounded treatment for clusters, including primary and secondary membership.

Add a `Relationship examples` section. Traverse relation_types in taxonomy order; for each type with at least one active-to-active edge, show exactly one edge, chosen by codepoint order of `(from,to)`. Render source-node link, that type's outgoing_label and target-node link in that direction. Optionally show the existing edge note; never reverse, transitive-expand or infer a connection. Retired-endpoint edges remain accessible in retained details/export but are not overview examples. Empty types are omitted; no eligible edges means the whole examples section is omitted.

Keep a concise explanation that relationships are editorial guidance and do not represent a mandatory executable order. Reuse taxonomy/source explanations; no pstack branches, hand-authored node lists, canvas or graph layout dependency.

Acceptance:

- A23: for every represented type, its example is an actual canonical edge with two active endpoints and its correct outgoing_label/links; count is one per eligible type. Selection is stable under relation-file ordering changes.
- A24: nodes beyond the first3 are reachable through All items; total counts reflect complete active membership, not example counts. Groups preserve taxonomy order and include nodes in their declared secondary clusters.
- A25: empty nodes/edges/layers/clusters, no layers, nodes without layer, custom types, cycles and retired endpoints build without errors or fake content. Zero-edge maps omit examples, not the structure page.
- A26: ordinary links, source distinctions and prose convey the same relationships without JavaScript; examples do not imply execution authorization or force Journey steps to match graph order.

### R08: identifiable controls

Add a semantic `--lex-control-border` token for map query/select/Clear controls, using the existing muted color family; choose values with contrast >=3:1 against the paper surface in both themes. Keep `--lex-line` for decorative content divisions. Retain control radius, >=44px height, label text and focus behavior.

Acceptance:

- A27: rendered input/select/Clear border-to-adjacent-background ratios are >=3:1 in light and dark; normal-text labels/placeholders/button text remain >=4.5:1.
- A28: keyboard focus is visible, tabs/select/checkbox/Clear can be used at320/390, and the retired control label retains its effective target. No new glow, shadow or accent family.

## 6. Implementation surface and dependencies

| Slice | Responsibility and concrete surfaces | Depends on |
| --- | --- | --- |
| S1 | R01/R09: `src/styles/custom.css`; five Skill Map page templates; Concept/Primitive practice-grid layout. Rendered geometry regression and screenshots. | none |
| S2 | R02: `src/components/SkillMapDirectory.astro`; browser history tests. No content/export changes. | none |
| S3 | R03/R05: `src/pages/search.astro`; existing collection lookup; matching/docs/help text and production dialog tests. R04: `src/pages/concepts/[slug].astro`, source projection tests. | none |
| S4 | R06: `src/domain/content/skill-map-input.mjs`, shared reference/path validation and reader, `skill-map-export.mjs`, `src/lib/skill-maps.ts` or a small presentation helper, all Map projections and search, pstack language annotations, four schemas, dataset version, contribution/design/export docs and data-extension tests. | S1/S3 reduce projection conflicts |
| S5 | R07/R08: Structure template/presentation selection, taxonomy-driven groups, tokens/control styles and overview/contrast tests. | S1; integrate with S4 language rendering |
| S6 | Combined production browser verification, preservation comparison and evidence manifest; CI wiring for the new behavior suite. | S1-S5 |

S1-S5 are separate runnable slices. Complete and verify each before accumulating later edits; S4 must include its schema, export, metadata, projections and tests atomically. This order is an implementation dependency guide, not automatically published tickets. No commits/pushes/PR/merge/deploy are authorized by this specification document.

## 7. Testing and evidence strategy

### Test seams

1. Existing Node tests for portable/runtime schema parity, assembled validation, normalization, export shape and fixture integrity. No private parser mocks.
2. Production-built HTML for actual Sources content, exact hrefs, examples/counts, metadata rendering and no-JS projection completeness.
3. Real browser against production preview for history, native input/select/change, keypresses, modal focus, reduced motion, geometry and computed colors. A source regex or `fill` alone cannot prove Slash is not swallowed.
4. Existing `npm run test:extension` plus a language/empty/retired/custom-taxonomy fixture for automatic discovery. No production content modified just to construct a test.

Add a repository-owned executable browser suite using already installed `playwright`, following the local build/serve pattern in `scripts/verify-l2-browser.mjs`. Expose `npm run test:browser`; wire it into the verify job with Chromium installed after npm ci. Reuse a production build with Pagefind enabled and `BASE_PATH=/ai-native-lexicon`; do not let this suite silently substitute dev config or disable Pagefind for A13/A14. Browser execution is a future implementation task, not work performed while writing this spec.

UI automation setup must follow the user's chosen browser/tool policy during implementation. The spec's `test:browser` is an implementation/CI seam; it is not permission to replace the user's active browser or make production writes.

### Required matrix

| Evidence | Minimum coverage |
| --- | --- |
| Responsive full smoke | all17 audited template families at390/1440; one visible H1, no horizontal overflow, primary controls reachable |
| Changed-layout screenshots | five summary surfaces, Concept/Primitive practice panels and Structure at390/1024/1440 in light/dark |
| Reflow stress | Search, Map directory, Node, Journey, Cards at320/768/1024; manually confirm320 does not substitute for400%zoom |
| Keyboard | dialog Slash/Tab/Escape/focus return, Starlight shortcut, mobile Menu Enter/Escape, Card Enter/Space, splash skip link |
| State | active/retired/custom types/no clusters, zero results/Clear, initial/reload/Back/Forward with and without BFCache |
| Language | static Chinese UI plus map/node/journey/compound search text and English official description; mixed-language synthetic map |
| Motion/themes | reduced-motion disables entrance/smooth scrolling; both themes; restore temporary browser settings |

Keep screenshots and a machine-readable evidence manifest recording build commit, environment/base, route, viewport, theme, expected/actual result and failures. Report failed checks as failures, not completed coverage. Do not use the old audit screenshots as after-change evidence.

### Required repository commands

Run `npm run schema:generate` in S4, then `npm run check`, `npm test`, `npm run build`. For Skill Map/template/language changes also run `npm run test:extension`; keep existing `npm run test:l2` CI validation. Run the new `npm run test:browser` against the production subpath build with Pagefind enabled. Record final process exit and summary for every required command; a still-running process is not a pass.

For documentation-only preparation of this spec, validate paths, requirements and publication text; no site rebuild is required.

### Performance and assistive-technology boundary

Preserve the existing static runtime and dependencies except test tooling already present. Do not introduce continuous JS work, automatic scrolling or larger media for these fixes. Record built HTML/assets before/after and explain material growth; language metadata is expected to increase export size, not add a client framework.

During S6 run Lighthouse on production home/Search/Map directory in a consistent local environment; save reports/settings without treating one lab score as field INP/LCP/CLS. Perform a screen-reader spot check for tdd and fix-bug if the implementation environment supports one. If unavailable, mark those checks explicitly unverified; do not claim full WCAG/CWV certification. R06 rendered-lang assertions and R08 computed contrast remain mandatory automated acceptance, independent of optional assistive tooling availability.

## 8. Out of scope and deferred audit suggestions

- Homepage section reordering, new application-entry module, copy voice overhaul, serif/font replacement, new logo/photography, motion redesign, blanket anti-slop text rewriting.
- New global search type facets, ranking/stemming, pagination, remote search, URL query persistence or saved filters; primitive Search result destination change.
- Full interactive graph, graph database, manual overview relations/representative lists, new cross-map navigation.
- Knowledge mappings/backlinks, data renumbering, new maturity semantics, new source evidence or automatic fact verification.
- Automatic multilingual inference/translation, locale routes, map-wide language defaults, a general translation-content system, relation-note localization outside existing audited scope.
- Changes to legal text, primary nav names, form identities, public URLs, snapshots, licensing or upstream source content.
- Implementing all P3 opportunities, creating individual task tickets during `/to-spec`, or running implementation/commit/push/merge/deployment now.

Deferred suggestions remain in the audit report and do not block this release. R09 is included because it has a concrete verified root cause and narrow acceptance; other visual preferences stay deferred.

## 9. Definition of done and handoff

Implementation is complete only when:

- R01-R09 and A01-A28 pass with current-source evidence; failure/empty/restoration cases are covered.
- Required repository/production browser commands complete with exit0, and generated schemas have no drift.
- Every changed route remains independently accessible with deployment base and stable identity.
- Language migration changes only annotations and the deliberate editions; canonical prose, relations, source targets and Journey order are preserved. Export1.2.0 and input compatibility are documented and tested.
- Changed templates have accepted before/after screenshots and no unresolved clipping, contradictory state, missing sources or swallowed dialog input.
- Reviewer can map every substantive diff to one requirement, and follow-up work has not silently entered the change.
- Final report separates completed mandatory acceptance, optional checks not available, and deferred product work. Data/schema green alone is insufficient.

Next workflow: use this specification as the contract for `/to-tickets`, selecting the minimum useful ticket count from actual dependencies. S1-S6 are implementation slices, not a requirement to create six issues. Implementation requires a separate explicit execution request.


</details>
