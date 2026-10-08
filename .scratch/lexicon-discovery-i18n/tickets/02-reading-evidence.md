## What to build

读者在 Concept／Primitive 详情中理解定义、案例、常见区别和来源限制，复制正在阅读的定义，并沿同类型 A–Z 或相关内容继续阅读。维护者获得四条记录的可审查证据结论。

从新增 canonical 内容及来源，经共享字段／引用校验、正式导出、详情投影到真实阅读动作完整交付。覆盖精简 spec 的 user stories 5–9、12；不依赖首页或字段筛选改版。

## Acceptance criteria

- [ ] 在当前发布基线上保留既有 Sources、相关原语、Speaking Guide backlinks 和完整领域边界。所有引用、公开 slug／number／anchor 和既有可选字段保持兼容。
- [ ] Concept 新增可省略、默认空集合的 examples 与 distinguish_from。examples 使用 context／example；distinguish_from 使用 target／distinction。未知字段、空白正文、悬空目标、自引用和重复目标被拒绝，Node、CLI、portable Schema、Astro 与正式导出一致。
- [ ] context-engineering 与 harness 各有至少一个有意义的例子；存在真实混淆对象时给出区别说明，否则记录理由。详情从 canonical 数据投影，不复制到 Markdown；示例不冒充已核验事实。保留 summary 作为短说明，不新增 one-line definition。
- [ ] Copy definition 复制当前详情实际展示的正文；Primitive 的 Concept 引用定义从该 Concept 取得，不手工维护副本。真实浏览器验证复制内容、可访问名称及成功／失败反馈；剪贴板拒绝不显示成功。
- [ ] Concept 与 Primitive 各自采用同类型 canonical 英文标题的 A–Z 前后导航，slug 作为平局排序；首末边界正确，不同时新增第二套分类顺序导航。
- [ ] Related Concept 预览显示目标 canonical summary；表达相关性，不添加未经策划的依赖／实现关系。
- [ ] 证据试点覆盖 context-engineering、harness、context、verification-evaluation。每条有可定位来源、支持字段、限制、编辑综合说明和核验结果的审查摘要。
- [ ] 使用各类型现有 sources 契约，保留原始报告来源和未核验状态。不把格式通过、来源链接存在、编辑接受或示例表达等同于事实认证；无法核实或仅部分支持时明确限制，可保留 unverified。
- [ ] 内容语义提案与 Editorial Acceptance 分别记录；未经接受的候选内容不冒充正式知识。交付证据明确区分技术结果、内容审查与实际接受；不能以自动 verified 或全库来源覆盖率作为本票门槛。
- [ ] 新字段引起正式 export shape 变化时按兼容性规则递增 schema_version，以 1.1.0 基线可升级为 1.2.0。若另一票已增加 aliases 或升级版本，保留其字段与版本迁移，并更新确定性 normalization，不冻结旧字段集合。
- [ ] 通过 L2 隔离 YAML 扩充与公共目录边界，验证合法／非法输入、旧记录缺省行为、区别目标解析、正式 dataset 与详情内容一致。修改 Concept 定义后，它自己、Primitive 引用及 Copy 同步。
- [ ] 相关 check／test／build／extension／L2 验收通过；生产子路径、Pagefind enabled 条件下检查 Sources、例子、区别、复制、A–Z 和相关链接，以及两主题／宽窄屏、键盘与可访问性。人工语义审查不被自动测试替代。
- [ ] 不引入统一 Evidence／逐句 Claim 系统、typed relations、knowledge_refs、新复制格式或新学习路径类型。相关投影复用现有组件，无需独立重构票。

## Blocked by

None (can start immediately).
