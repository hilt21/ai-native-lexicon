## What to build

读者从首页更早看到具体 Concept，并能用英文名称、中文术语或 aliases 查找内容，按类型筛选并理解命中原因；访问结果后返回时能继续原来的查询。

这是一条从 canonical 内容输入、公共目录验证、机器投影到首页／搜索和真实浏览器验收的完整路径。保留现有全局 Pagefind 与 Sources 展示。覆盖精简 spec 的 user stories 1–4、12。

## Acceptance criteria

- [ ] 实施前核对当前发布基线，不用较早模板覆盖已完成的 Sources、搜索范围说明、Skill Map inventory 或语言注释。保持现有领域类型、公开 slug／number／anchor、Starlight 壳及 paper／ink／acid-green 设计系统。
- [ ] 首页精选 Concept 及 canonical summary 位于完整分类网格之前，保留全部概念／分类入口。数量从正式数据派生，不新增 collection ontology 或复制定义。首页将来源承诺限定为 canonical content，taxonomy 枚举继续从 YAML registry 生成。
- [ ] Concept 支持可省略、默认空集合的英文 aliases；空白、重复及重复自身 term／zh 的值被拒绝。Node、CLI、portable Schema、Astro、搜索和正式 dataset 对新增字段的契约一致，未使用该字段的旧记录保持合法。
- [ ] 字段搜索明确展示 Concept、Primitive、Speaking Guide、Skill Map、Map Node、Task Journey 六种内容类型；地图内容显示 owning map，退役状态保留。priority、category 和地图内类型作为附属信息，不代替通用类型标签。
- [ ] All 与六种类型单选筛选、结果行、计数和空状态使用同一状态。q／type 写入 URL；未知 type 回退 All；输入、Clear、初始化、popstate、真实 BFCache／reload 恢复一致，其他无关参数保留。
- [ ] 保持既有检索字段，并加入 aliases；canonical 英文名称与既有 zh 可搜索。完整标题命中优先于前缀，再显示其他字段匹配，组内按 canonical 标题和稳定身份确定性排序。
- [ ] 结果说明命中的字段；直接正文命中有一段匹配上下文，既有关系名命中有相应说明。不得把 related 推断为依赖关系。按 canonical identity 去重，计数等于实际可见记录。
- [ ] 保留现有 header Pagefind，不创建第三套索引；字段检索与全文检索的范围和计数单位说明准确。项目快捷键不干扰编辑控件、Pagefind 弹窗或正常标点输入。
- [ ] aliases 的正式 export shape 变化按兼容性规则升级 schema_version；以现行 1.1.0 为基线可升级为 1.2.0。若另一票已扩展字段或升级版本，保留其字段、重新生成共享 Schema 并按同一规则递增，不回退或静默覆盖。
- [ ] 复用 L2 隔离扩充主验收边界：独立 YAML → readCatalog／validateCatalog → CLI／Astro 生产子路径构建 → Pagefind enabled 的真实浏览器。混合六类型夹具验证 aliases、排序、命中上下文、筛选、空结果、Clear、URL 与历史恢复。
- [ ] 相关 check／test／build／extension／L2 验收通过；检查 390px／1440px 与 light／dark 截图、键盘焦点、跳过链接、reduced-motion 和实际对比度。400% zoom 与屏幕阅读器检查按能力完成，缺失项明确 unverified。
- [ ] 不改变顶级 IA，不加入复杂 facets、语义搜索、typed relations、knowledge_refs、额外机器接口或客户端框架。所需共享搜索记录整理在本票内先完成，无需单独预重构票。

## Blocked by

None (can start immediately).
