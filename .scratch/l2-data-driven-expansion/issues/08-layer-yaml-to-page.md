# [L2-08] 新增原语层级 YAML 自动驱动校验、目录分组与锚点

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-2 / 层级
Ticket kind: 配置到页面切片
Blocked by: #13

## 问题与结果

primitiveLayers 在 schema 中固定，layer anchor 由显示名称推导。需要让新增层级只修改数据，同时固定既有公共锚点。

## 实施范围

- 新增 src/data/taxonomy/layers/*.yaml，字段为 name、anchor、order，复用类别票中必要的读取模式。
- 显式保存现有五个 layer-* anchor，不根据名称重新计算；name 仍作为现有 Primitive 引用。
- 让 shared Primitive schema、portable schema、目录导航、分组及详情返回链接读取 registry。
- 允许配置空层级显示 0 条目；新增其成员时自动呈现。
- 维持 ownership、priority 等既有规则，不扩张为配置所有 UI 文案。

## 主要代码位置

- `新 src/data/taxonomy/layers/`
- `src/domain/content/ taxonomy 与 Primitive 契约`
- `src/lib/primitive-schema.mjs`
- `src/lib/primitive-presentation.ts`
- `src/pages/primitives.astro`
- `src/pages/primitives/[slug].astro`
- `schemas/primitive.schema.json`
- `相关验证/页面测试`

## 验收条件

- [ ] 五个既有 layer-purpose-governance、layer-structure-representation、layer-dynamics-control、layer-cognition-action、layer-runtime-trust 锚点原样保留。
- [ ] 只新增合法 layer YAML，运行约定的派生 schema 生成/构建命令，不改源码或手写 enum 即可出现目录导航、章节和被 schema 认可的层级。
- [ ] 空层级合法并显示 0；新增成员 Primitive 自动进入该层级。
- [ ] 重复 name/anchor/order、非法 anchor 和未知 layer 被拒绝。
- [ ] Primitive 自身 filename slug anchor 不与 layer anchor 混淆，详情返回导航在部署 base 下正确。
- [ ] 完整检查和 schema drift-check 通过；分类功能无回归。

## 迁移说明与非目标

不新增 Skill Map 内容类型，不改变 Primitive priority 或 ownership 分类。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
