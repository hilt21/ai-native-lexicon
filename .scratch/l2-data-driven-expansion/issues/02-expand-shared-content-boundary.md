# [L2-02] 引入共享内容输入契约与目录读取边界，保持既有页面行为

Status: open — 等待阻塞依赖完成
Tracker: GitHub — hilt21/ai-native-lexicon
Plan slice: L2-1 / Expand
Ticket kind: 独立准备重构
Blocked by: #7

## 问题与结果

Concept 字段在 Astro 中定义，Primitive/Card 分散在 src/lib，验证读取器也各自实现。直接同时切换所有调用方会扩大变更范围，需先建立可供局部迁移的边界。

## 实施范围

- 新增 src/domain/content/ 的三种可序列化输入契约、共享字符串/标识/日期规则及读取接口；明确直接依赖 Zod，更新 npm lockfile。
- 日期输入为合法 ISO 日期字符串；需要 Date 的旧运行时调用方在兼容边界转换。不得以 unrepresentable:any 放宽导出。
- 读取接口只处理约定目录的直接 .yaml/.yml 文件，保留 filename slug 和 Card number 身份；嵌套 YAML 明确报告不支持，避免静默漏检。
- 保留旧生产调用链作为迁移期桥接；本票不接入新搜索、导出、分类或 layer 功能。
- 用合法/非法样本验证新契约，并演示可向临时目录导出 portable schema；正式 portable schema 和生产调用方在后续类型票逐一切换。

## 主要代码位置

- `新 src/domain/content/ 模块`
- `package.json`
- `package-lock.json`
- `新增内容契约/读取单元测试`

## 验收条件

- [ ] 当前所有正式 YAML 可被新输入契约解析，字段语义与身份保持不变。
- [ ] 损坏 YAML、非对象记录、重复 filename slug、重复卡片 number、嵌套 YAML 返回可定位诊断。
- [ ] 日期样本包括有效 ISO 日期、非法日期和非日期值；共享输入契约无 JS Date 输出依赖。
- [ ] 新契约的临时 JSON Schema 导出成功且不把不可表达类型变成任意值。
- [ ] 生产调用链、页面内容和现有导出在本票保持既有行为，完整检查通过。

## 迁移说明与非目标

这是 Expand-Contract 的明确准备重构例外，不与新用户功能混做；随后每个类型独立贯通消费者。公共字段的共用不等于强制应用资源使用同一 schema。

## 共同边界与验证

- 正式数据保持 `src/data/concepts/`、`src/data/primitives/`、`src/data/speaking-cards/`；Concept、Primitive、演讲指南的职责分开，页面和导出是投影。
- 保留 filename slug、Card number/`#card-XX` 以及已公开路由与层级锚点；跨页面链接使用 `pathWithBase`。
- 不引入数据库、客户端框架、通用插件容器或新 Skill Map 契约；不实现 L3/L4。只删除本次迁移产生的重复/无用代码。
- 实施前查看当前 AGENTS.md、依赖票最终实现和目标分支；保留其他人的未提交工作。Ticket 描述不授权推送、默认分支合并或部署。
- 改动后运行 `npm run check`、`npm test`、`npm run build`；生产子路径验证使用适配当前 CI 的配置。必要时以锁文件一致的隔离环境和 Node 24 验证，明确报告测试环境。
- 每个验收项记录实际结果；fixture、静态源码检查或 schema 生成成功不能代替对应的运行验证。阻塞依赖未完成前不开始实现。
