# [L2-06] 删除迁移期旧规则，并将 portable schema 漂移检查接入 CI

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-1 / Contract
Ticket kind: 重构收尾
Blocked by: #11

## 问题与结果

三类型迁移完成后，旧字段定义、读取路径和手写 portable schema 仍可能继续漂移。需要收敛唯一权威输入契约。

## 实施范围

- 删除迁移产生的无用规则与重复 reader；无外部契约的临时桥接收回，不顺手重构无关模块。
- 生成三个 committed portable schemas 的确定性脚本；添加只比较而不重写文件的 drift-check。
- 将 drift-check 接入现有 check/CI，保留 cross-record 校验，不用生成成功代替行为一致性。
- 提供公共的无 Astro 依赖 validateCatalog/readCatalog 边界，供脚本与后续治理流程复用。
- 同步当前契约维护说明，解释输入日期、未知字段与目录范围。

## 主要代码位置

- `src/domain/content/`
- `迁移期 src/lib 与 scripts 桥接`
- `schemas/ 三种 schema`
- `schema 生成/校验脚本`
- `package.json`
- `.github/workflows/pages.yml`
- `内容维护文档`

## 验收条件

- [ ] 每种内容的权威字段规则只在共享契约维护，旧重复规则无活动调用。
- [ ] 连续生成得到相同 schema；正常 drift-check 通过且不修改工作区。
- [ ] 手动破坏一个 generated schema 后 check 非零退出并定位漂移文件，恢复后通过。
- [ ] 三类同批样本的字段判断一致，cross-record 负例仍拒绝。
- [ ] 独立 Node 命令可调用共享边界，无 Astro runtime 依赖。
- [ ] check/test/build 均通过，现有页面和正式数据无因收尾而产生的语义变化。

## 迁移说明与非目标

分类、层级词汇仍在后续两个票中迁为独立数据；本票不提前引入通用 registry/plugin 框架。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
