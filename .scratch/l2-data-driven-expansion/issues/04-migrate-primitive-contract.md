# [L2-04] Primitive 的定义、引用和 portable schema 统一到共享契约

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-1 / Migrate 2
Ticket kind: 类型贯通切片
Blocked by: #9

## 问题与结果

Primitive 当前已有较严格 schema，但 Date、HTTP(S) refine、空白字段和跨集合引用需要在共享契约与 portable schema 中共同验证。

## 实施范围

- 将 Primitive 的 Astro、CLI、JSON Schema 生成和现有 src/lib schema 接到共享输入契约。
- 保留 inline definition 与 referenced Concept 两种语义，不复制 referenced Concept 的正文成为第二份定义。
- 继续严格校验 ownership、priority、sources、HTTP(S) URL、非空白文本、重复/自引用和 Concept 回链。
- 用一个新 Primitive 与引用它的新 Concept 共同验证定义解析、目录分组、详情与回链。

## 主要代码位置

- `src/lib/primitive-schema.mjs`
- `src/domain/content/ 的 Primitive 契约`
- `scripts/primitive-validation.mjs`
- `schemas/primitive.schema.json`
- `tests/primitives.test.mjs`
- `Primitive 详情相关消费者`

## 验收条件

- [ ] 全部已有 Primitive 可解析，原有 slug、定义内容及 layer anchor 保留。
- [ ] 三种字段校验路径对合法/非法 Primitive 样本一致，HTTP(S) 与非空白规则不能在导出时丢失。
- [ ] 新增 inline Primitive 能显示；新增引用定义的 Primitive 能读取对应 Concept 的 canonical 定义。
- [ ] 引用定义缺少 Concept 回链、目标不存在、重复相关原语或自引用被拒绝。
- [ ] 临时新增记录出现在正确 layer，详情链接和关联均带正确 base。
- [ ] 完整检查通过，Concept 已切换的路径无回归。

## 迁移说明与非目标

本票不将 layer 配置迁至 YAML；保持既有词汇，后续层级票单独贯通配置到页面。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
