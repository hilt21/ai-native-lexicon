# SM-01 pstack 来源核对与适配说明

本记录报告来源核验与适配变化，供 PR 的编辑审查；不把来源核验等同于全部编辑解释已经得到事实认证。

## 固定来源

- 仓库：cursor/plugins，根目录 pstack。
- 固定 commit：`df581122cde17e6e27686b5a448bde23e4ad4318`。
- [来源目录](https://github.com/cursor/plugins/tree/df581122cde17e6e27686b5a448bde23e4ad4318/pstack)，插件元信息版本 0.15.15。
- 核对日期：2026-10-07；比较用户提供 YAML 与此快照中的目录清单、SKILL.md frontmatter description、playbook 文件清单及原始路径。
- 用户附件 SHA-256：`b261bb1c149283c9c2b97e785ed9cbb10c1b6f19685f5e1e21fb6896a267303f`。原附件保留本地，未提交到公开仓库。
- 上游 MIT 许可与版权声明保留在 `src/data/skill-maps/pstack/SOURCE-LICENSE.txt`；官方描述保留上游出处，不将它们误称为本站原创定义。

## 核对结果与变更

51 个技能目录和 23 个操作手册文件与附件一一对应，未发现缺失或新增。全部官方描述逐项对照固定来源；26 条原字段存在删节、措辞或引号差异，现替换为来源的完整 description。其余 25 条规范化空白后相同。

替换的条目：

- `figure-it-out`
- `how`
- `why`
- `recall`
- `teach`
- `architect`
- `arena`
- `interrogate`
- `blast-radius`
- `tdd`
- `technical-writing`
- `benchmark-checklist`
- `create-verification-skill`
- `maintain-verification-skill`
- `show-me-your-work`
- `swarm`
- `make-bot-ui`
- `correct`
- `reflect`
- `automate-me`
- `principle-build-the-lever`
- `principle-explain-the-number`
- `principle-never-block-on-the-human`
- `principle-prove-it-works`
- `principle-sequence-verifiable-units`
- `principle-test-behavior-not-implementation`

## 编辑内容适配

- skills 与 playbooks 归一为 74 个节点，保留各自类型、层次与原始 ID；4 个层次和 8 个能力簇属于 pstack 本地图。
- 原 169 条唯一 graph.edges 迁移到单一 relations.yaml，端点及关系方向保留。规范关系不是官方调用依赖认证；所有这类关系显示为编辑解读。
- upstream/downstream 中的节点名称不再维护第二份连接；没有生成新的边来凑覆盖。18 处非节点对象交接说明保留为文字，其中 verification 等抽象对象没有虚构成节点。
- 7 条主路径保留原节点成员，按指导阶段重新分组；1 条性能替代路线、2 条项目组织替代路线统一为命名 variants。新增选择理由、文字条件和可选标记，避免把有序清单误称为必选串行调用。
- 源码链接固定到 commit，sources/current_sources 分离，为未来保留退役条目的旧来源依据提供契约。
- 未增加 Concept/Primitive/Speaking Guide 映射或 backlink；没有添加尚无目标校验的 knowledge_refs 字段。

以上用途、机制、分类关系与任务路径仍属于编辑综合。适配提案随 PR 提交给维护者审查，PR 合并前不部署到正式站点。

## 实际验证

锁文件一致的隔离检出，Node 24.19.0；未更改包版本或 lockfile。原检出的依赖加载停滞不作为代码失败证据。

- npm run check：77 个 Astro 文件，0 errors / 0 warnings / 0 hints；schema 漂移与完整 catalog 校验通过。
- npm test：64/64。
- npm run build：静态 Skill Map 路由成功产出。
- npm run test:extension：13/13，包含只新增第二张地图 YAML、独立分类、同名节点和下线地址/导出保留。
- npm run test:l2：全部检查通过，保留既有内容、地址与扩充行为。
- Playwright CLI + 已安装 Chrome：六类页面 × 390/1440px × light/dark 共 24 组合，HTTP 200、单 h1/main、无横向溢出；原则类型筛选显示 24 matching items。

[任务入口桌面截图](assets/skill-map-tasks-desktop.png) / [节点详情手机截图](assets/skill-map-node-mobile.png)。截图来自实际静态构建页面，不是设计线框。

CI 与独立代码审查结果在 PR 中另行记录，不用本地验证冒充远端通过。

## 独立审查与修复

Standards 轴发现来源 URL 的 HTTP(S)/URI 约束在便携 schema 中丢失；Spec 轴发现文字 trim 造成便携/运行时不一致、watcher 并发覆盖，以及可选 layer 节点在概览缺失。均已修正：地图采用无转换的严格文字与共享 URI 规则，刷新串行并先解析完整快照后替换、监听空目录变化，概览保留未分层条目。未改动既有三类数据的文字规则。

回归先证明便携接受非法值、旧快照覆盖新快照；修复后地图输入 8 项及 loader 2 项通过。类型检查 79 文件为 0/0/0，第二张地图完整投影回归通过，并验证配置层次时缺省 layer 的节点仍可发现。另验证筛选无结果、清除恢复 74、键盘导航及禁用 JavaScript 的独立详情阅读。

独立复核：Standards 0 项未解决发现，Spec 0 项未解决发现；地图输入与 loader 共 10/10。语义修复后仅重跑相关回归与类型检查，完整远端 CI 将验证最终 PR head。

C2 最后复核补齐 union 输入的叶子字段诊断：未知 node/journey 字段及 mechanism 类型错误现在保留文件与字段信息。回归先失败后通过，地图输入与 loader 合计 11/11；Spec 轴只读复核确认关闭，未发现新增问题。
