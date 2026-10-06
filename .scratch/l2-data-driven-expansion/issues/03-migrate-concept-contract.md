# [L2-03] Concept 从输入到 CLI、Astro 和 portable schema 使用同一契约

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-1 / Migrate 1
Ticket kind: 类型贯通切片
Blocked by: #8

## 问题与结果

Concept runtime schema 不 strict、sources 有 default，portable schema 要求 sources 并拒绝未知字段；重复 related 的检查也不一致。需要将一个完整内容路径先迁入共享契约。

## 实施范围

- 将 Concept 的 Astro schema、目录读取、CLI 及生成 concept.schema.json 接到共享输入契约。
- 明确 required/default、未知字段、slug 格式、重复 related/primitives、字段长度和日期接受规则；保留当前所有合法记录。
- 在已统一字段解析的基础上，继续校验相关概念、原语引用和 self-link；不把关系检查放松为只校验字符串。
- 更新生成该类型 portable schema 的入口，用同批样本实际验证 runtime/CLI/JSON Schema 接受结果。
- 在隔离数据中添加新 Concept，检查 A–Z、现有分类、详情页和关联原语链接。

## 主要代码位置

- `src/content.config.ts`
- `src/domain/content/ 的 Concept 契约`
- `scripts/concept-validation.mjs`
- `scripts/validate-concepts.mjs`
- `schemas/concept.schema.json`
- `tests/concepts.test.mjs`

## 验收条件

- [ ] 所有现有 Concept 通过且既有页面、slug、关联和导出字段语义不变。
- [ ] 同批合法/非法样本在 runtime、CLI、portable schema 下得到一致的字段接受结果；不只比 enum 文本。
- [ ] 未知字段、缺少必填字段、重复 related/primitives、非法 slug 和非法日期按明确规则被拒绝。
- [ ] 不存在目标、自引用或缺少必要 Primitive 回链仍被整体检查拒绝。
- [ ] 仅新增合法 Concept 自动产生详情页、目录和分类成员，带部署 base 的内部链接有效。
- [ ] 完整仓库检查通过；另外两类可继续使用迁移期桥接。

## 迁移说明与非目标

可序列化日期契约变更不得静默改变既有机器导出语义；保留旧输出转换直到导出票明确处理兼容性。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
