# [L2-01] 合法新增 YAML 可通过发布检查，编辑链接使用正确分支

Status: open — ready-for-agent
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-0
Ticket kind: 修复切片
Blocked by: 无

## 问题与结果

合法新增 Concept 或 Primitive 后，tests/primitives.test.mjs 的 84/42 数量断言使 npm test 失败。两个编辑链接同时硬编码 main，而当前远端默认分支已核实为 master。

## 实施范围

- 在实施前只读核对目标 master 基线及本地工作区，保留已有未提交文档；不重置或合并分支。
- 将固定集合数量断言改为真实文件发现、非空集合与字段/引用完整性检查，不削弱现有负例。
- 将 astro.config.mjs 与概念详情页的编辑链接共用一个明确内容分支配置，默认对应核实后的 master；保留显式覆盖。
- 在隔离目录添加三类各一条合法记录，证明可构建，不把实验条目加入正式数据。

## 主要代码位置

- `tests/primitives.test.mjs`
- `astro.config.mjs`
- `src/pages/concepts/[slug].astro`
- `相关回归测试`

## 验收条件

- [ ] 基线 npm run check、npm test、npm run build 均通过。
- [ ] 仅新增三类各一条合法 YAML 后，同一组完整命令全部通过，不再出现 85 !== 84 / 43 !== 42。
- [ ] 原有未知引用、重复引用、非法卡片编号等负例仍被拒绝。
- [ ] 生产构建中默认编辑链接使用 /edit/master/；配置另一内容分支时，两处链接一致切换。
- [ ] 原有 slug、number、#card-XX 及内部路径保持不变；实验结束后正式数据无新增。

## 迁移说明与非目标

本票不迁移 schema 或分类；这两项准备工作由后续独立票负责。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
