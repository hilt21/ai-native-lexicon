# [L2-07] 新增分类 YAML 自动产生分类页面、计数与校验词汇

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-2 / 分类
Ticket kind: 配置到页面切片
Blocked by: #12

## 问题与结果

分类 enum、验证器、portable schema 与 catalog metadata 重复维护；首页和分类页还写死 08/Eight，空分类会失败。

## 实施范围

- 新增 src/data/taxonomy/categories/*.yaml，使用 name、slug、code、description、question、order，迁移现有分类元数据。
- 保留现有 name 引用和 public slug；同一 registry 同时服务 shared schema、CLI、portable schema 与分类路由。
- 按显式 order 展示，修正首页/分类页计数及 grid 编号；不将序号当 public identity。
- 允许已配置空分类生成稳定路由并显示 0 条目，调整 tests/concepts.test.mjs 的每组非空假设；未知类别仍非法。
- 更新类别增加流程，并将新类别相关 JSON Schema 通过生成流程同步：作者只维护 YAML；运行生成命令产生派生 JSON，不手写第二份类别 enum。

## 主要代码位置

- `新 src/data/taxonomy/categories/`
- `taxonomy 契约与 reader`
- `src/lib/catalog.ts`
- `src/content.config.ts`
- `scripts/concept-validation.mjs`
- `src/pages/index.astro`
- `src/pages/categories/`
- `src/components/CategoryGrid.astro`
- `schemas/concept.schema.json`
- `tests/concepts.test.mjs`

## 验收条件

- [ ] 迁移后所有既有类别 URL、名称引用和显示顺序保持稳定。
- [ ] 只增加一份合法类别 YAML，并运行约定生成/构建命令，不改源码或手写第二份 enum，即出现新分类路由、grid 项及准确计数，schema/CLI 认可该类别。
- [ ] 尚无成员时 check/test/build 通过并显示 0；随后新增该类别 Concept，列表与计数自动变化。
- [ ] 重复 name/slug/order、非法 slug、缺少必要元数据得到明确诊断；不存在类别的内容被拒绝。
- [ ] 分类超过 9 个的编号不出现 010 这类错误填充，计数不再写死 08/Eight。
- [ ] base 下分类与概念链接有效，完整检查及 schema drift-check 通过。

## 迁移说明与非目标

新增或调整分类仍需编辑审查；不迁移全部 Concept 的 category 为新 ID，也不引入分类别名/重命名治理。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
