# [L2-10] 新增内容与分类配置的完整扩充场景可重跑，并更新贡献流程

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-4
Ticket kind: 整体用户场景验收
Blocked by: #15

## 问题与结果

此前新增 YAML 验证是临时实验，不能自动防止未来更改再次冻结数量、遗漏投影或破坏公共标识。需要一个可重跑的真实扩充场景作为 L2 门槛。

## 实施范围

- 在隔离临时项目内新增一个 category、一个 layer、一个 Concept、一个 Primitive 和一张 Card，形成合法跨类型关系；不编辑页面代码。
- 先验证空分类/层级，再添加成员内容，贯通共享契约、portable schema、CLI、构建、目录、详情、关系、搜索和导出；生成的 JSON 属于派生输出，不手改 enum。
- 运行生产子路径构建，检查 baseline public routes/anchors 仍存在及内部链接可解析；不固定整个当前集合总数。
- 真实浏览器在 1440px 和 390px 验证搜索、卡片展开、关联导航和无横向溢出；保存可检查证据。
- 接入适合现有 CI 的自动部分；浏览器若需要另行 runner，文档明确命令和实际验证，不以源码 regex 代替运行证据。
- 更新 CONTRIBUTING/README，说明记录扩充、分类/层级增加、应用资源与投影区别、身份保护及 required checks。

## 主要代码位置

- `新增隔离扩充集成验证脚本/测试`
- `package.json 与现有 CI 的必要入口`
- `CONTRIBUTING.md`
- `README.md`
- `按需新增或更新验证说明`

## 验收条件

- [ ] 一条可重复命令在隔离目录完成全场景，第二次运行成功且不污染正式 YAML。
- [ ] 所有新记录/配置都被既定投影自动发现，关系与回链来自 canonical 引用。
- [ ] 基线 slug、卡片 number/#card-XX、类别 URL、五个旧 layer anchor 保留，内部链接检查无缺失目标。
- [ ] 非法引用、重复标识、schema 漂移和未知分类/layer 的相关回归仍失败。
- [ ] 生产 base 下三个直接投影一致，浏览器交互和两个宽度的布局验证有结果与证据。
- [ ] 文档中的新增流程不要求同步编辑多个词汇枚举，不承诺任意新内容类型无需实现 schema。
- [ ] npm run check、npm test、npm run build 全通过，记录完成 L2 门槛而不是声称 L3/L4 已实现。

## 迁移说明与非目标

本票集成已有切片，不重新实现业务模块；不得顺势创建后台、定时任务、Proposal/apply 或新资源 schema。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
