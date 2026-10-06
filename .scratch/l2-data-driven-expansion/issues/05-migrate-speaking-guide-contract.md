# [L2-05] 演讲指南统一共享契约，保留卡片编号、展开与反向关联

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-1 / Migrate 3
Ticket kind: 类型贯通切片
Blocked by: #10

## 问题与结果

现有 Speaking Card 内容属于应用资源中的演讲指南，页面为投影。读取器、Astro 与 portable schema 需统一，同时保留独立策划内容和编号身份。

## 实施范围

- 将 getSpeakingCards、脚本读取器和 Astro 使用的 schema 接到同一 Speaking Card 输入契约。
- 统一正整数 number、非空文本、notes 数组、未知字段及引用规则；Card references 可为空。
- 保持按 number 排序、#card-XX 锚点和现有组件，不重命名正式文件、不引入 Skill Map schema。
- 移除重复文件发现逻辑，统一直接 .yaml/.yml 发现；生成对应 portable schema。
- 新增一张卡片引用已有 Concept/Primitive，验证页面及这两类详情页的构建时反向链接。

## 主要代码位置

- `src/lib/speaking-card-schema.mjs`
- `src/lib/speaking-cards.ts`
- `scripts/read-speaking-cards.mjs`
- `scripts/validate-speaking-cards.mjs`
- `src/content.config.ts`
- `schemas/speaking-card.schema.json`
- `tests/speaking-cards.test.mjs`

## 验收条件

- [ ] 原有卡片内容、number、排序和所有 #card-XX 链接保持稳定。
- [ ] runtime/CLI/portable schema 的字段样本验证一致；损坏 YAML、重复 number、非法 notes 被拒绝。
- [ ] 不存在或重复 Concept/Primitive 引用被拒绝，空关系合法。
- [ ] 仅新增 Card YAML 即自动出现新卡片及对应两类详情页的回链，无手工索引改动。
- [ ] 真实浏览器中 notes 可展开、关联可跳转，桌面/移动均无新增横向溢出。
- [ ] 完整检查通过；三种生产内容路径均已使用共享契约。

## 迁移说明与非目标

应用资源是领域类别，不新增通用 payload 容器，也不将 Card 的原创讲解内容改成纯页面配置。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
