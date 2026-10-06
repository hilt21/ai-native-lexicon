# [L2-09] 演讲指南进入自定义搜索、dataset 与 llms，导出具有稳定版本

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-3
Ticket kind: 内容到投影切片
Blocked by: #14

## 问题与结果

Speaking Cards 页面和 Pagefind 可以显示卡片，但 /search/、/dataset.json、/llms.txt 只直接收录 Concepts/Primitives，机器内容版本也与生成时点未明确分开。

## 实施范围

- 从 canonical Card 集合生成自定义搜索结果，搜索 title、coreIdea 和关联的概念/原语名称，跳到 /speaking-card/#card-XX。
- dataset 保留现有 concepts、primitives 顶层数组和既有字段语义，追加 speaking_cards；不要改为含不透明 payload 的统一数组。
- 增加明确 schema_version、dataset_version 与 counts；兼容当前 version 元数据，文档说明区别。
- dataset_version 由规范化正式内容及 taxonomy 稳定摘要生成，排除 generated_at 等构建时变量；当前无公开治理记录则不虚构它们。
- llms 追加演讲指南的标题、coreIdea 与 canonical anchor 链接，保留既有两类章节和部署 base。
- 同步导出使用说明，表达 Application Resource 类别，仍保留具体 Speaking Card 契约。

## 主要代码位置

- `src/pages/search.astro`
- `src/pages/dataset.json.ts`
- `src/pages/llms.txt.ts`
- `可复用 CatalogRow 或小型 Card 搜索行`
- `投影与版本回归测试`
- `README.md / 导出说明`

## 验收条件

- [ ] 只新增一张 Card YAML，即出现在三个直接投影，无手工索引。
- [ ] 自定义搜索按标题、核心观点及关联名称找到卡片；清空、无结果提示和现有两类搜索仍正常。
- [ ] 卡片结果及 llms 链接携带正确 base 和 #card-XX，真实浏览器可定位并展开卡片。
- [ ] dataset 原有顶层数组和记录字段语义保留，speaking_cards 的 number/关系完整，counts 等于当前集合结果。
- [ ] 相同内容重复构建的 dataset_version 一致；内容或 taxonomy 的语义变化改变版本；生成时间变化不改变版本。
- [ ] generated_at、schema_version、dataset_version 和旧 version 的语义有明确说明；schema 漂移及完整检查通过。
- [ ] 受检桌面/移动搜索列表无新增横向溢出。

## 迁移说明与非目标

不实施 Skill Map、语义向量搜索、MCP 或治理流水线；生产 Pagefind 不替代三个直接投影的卡片支持。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
