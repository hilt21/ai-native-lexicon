# 仅新增 YAML 的架构验证

验证日期：2026-10-05（Asia/Shanghai）。

验证基线：`codex/speaking-cards-yaml`，提交 `2368945b1d757585e26c1bbdd9d8c888c6865e69`。

后续进展（2026-10-06）：本报告发现的数量冻结已由 [L2-01 / PR #17](https://github.com/hilt21/ai-native-lexicon/pull/17) 解决。本报告保留原基线的实验与结论；后续系统开发见 [阶段计划](../design/knowledge-system-evolution.md)。

## 目标与结论

近期目标：仅新增符合现有数据契约的 YAML，三类内容自动出现在对应页面，沿用既有布局和交互，保留已有内容、路由和锚点。不验证原始文章、笔记到结构化数据的转换流程。

**页面生成架构支持该方式；当前发布检查尚未完整支持 Concept 和 Primitive 的持续扩充。** 两项测试把集合数量固定为 84 和 42，合法新增数据仍会使 `npm test` 失败，并阻止 GitHub Pages 工作流进入部署。

## 现有生成路径

| 类型 | 数据入口 | 自动展示与关联 |
| --- | --- | --- |
| Concept | `src/data/concepts/*.yaml` | 内容集合扫描；按 term 排序；自动生成详情页、A–Z 索引、所属分类列表、搜索记录和机器导出；根据卡片引用生成反向链接 |
| Primitive | `src/data/primitives/*.yaml` | 内容集合扫描；按 term 排序、按已有 layer 分组；自动生成详情页、目录、搜索记录和机器导出；根据概念及卡片引用生成反向链接 |
| Speaking Card | `src/data/speaking-cards/*.yaml` | 内容集合扫描；按唯一正整数 number 排序；自动追加到卡片页面；编号生成 `#card-XX`；引用产生概念及原语页面的卡片反向链接 |

代码依据：`src/content.config.ts` 的 glob loaders；`src/lib/catalog.ts` 和 `src/lib/speaking-cards.ts` 的集合读取与排序；`src/pages/concepts/[slug].astro`、`src/pages/primitives/[slug].astro` 的 `getStaticPaths()`；`src/pages/speaking-card.astro` 的集合映射。

## 实际验证方法

在 `/private/tmp/lexicon-yaml-audit-eLCMYC/clean` 建立当前工作文件的临时副本，使用 Node 24.19.0 和 `npm ci --offline --no-audit --no-fund` 安装 lockfile 指定的依赖。未修改主工作区的源代码或正式数据。

构建采用生产路径配置：`GITHUB_ACTIONS=true`、`GITHUB_REPOSITORY=hilt21/ai-native-lexicon`、`GITHUB_REPOSITORY_OWNER=hilt21`，包含 `/ai-native-lexicon/` 子路径和 Pagefind 全站搜索。

仅新增三个验证样本，未修改现有记录、页面代码、样式或集合配置：

- `concepts/yaml-audit-concept.yaml`：以 verification 的合法字段为样本，使用唯一 term，引用现有原语及新原语。
- `primitives/yaml-audit-primitive.yaml`：以 view-projection 的合法字段为样本，使用唯一 term，definitions 引用新概念；新概念同时关联该原语，满足回链契约。
- `speaking-cards/card-21.yaml`：使用唯一编号 21，引用新概念、新原语以及已有 verification、view-projection。

样本用于验证技术路径，其内容不作为新增知识入库。

## 命令结果

| 场景 | 数据数量：Concept / Primitive / Card | npm run check | npm test | npm run build |
| --- | --- | --- | --- | --- |
| 基线 | 84 / 42 / 20 | 通过；Astro 0 errors / warnings / hints | 24/24 通过 | 通过；152 页 |
| 三类各新增一条 YAML | 85 / 43 / 21 | 通过；Astro 0 errors / warnings / hints | 22/24 通过；两处固定数量断言失败 | 通过；154 页 |
| 单独新增 Card，引用已有记录 | 84 / 42 / 21 | 通过 | 24/24 通过 | 此隔离场景未单独构建；卡片追加的构建证据来自上一场景 |

明确失败位置：

- `tests/primitives.test.mjs:14`：`assert.equal(records.length, 84)`，新增后实际为 85。
- `tests/primitives.test.mjs:27`：`assert.equal(result.records.length, 42)`，新增后实际为 43。

`.github/workflows/pages.yml` 在构建及部署前执行 `npm test`，因此手动构建成功不能等同于新增数据可通过完整发布流程。

## 页面、布局和功能证据

- 新增概念、原语详情页自动生成；新概念自动进入已有 Verification 分类；目录和检索记录自动增加。
- 浏览器自定义搜索输入 `YAML Audit` 得到两个匹配项；能够从结果进入新概念，并跳转至新原语、新卡片。
- 新原语的定义读取新概念数据；其关联概念列表及两类详情页的 Card 21 回链自动生成。
- Card 21 的锚点可访问，Speaking notes 可以展开，关联链接保留生产子路径。
- Pagefind 全站搜索返回新概念、新原语与包含新卡片的页面结果；浏览器未捕获 error 或 warn。
- 自定义搜索的无结果提示、已有 `context` 查询、清空后恢复全部 128 个条目，均通过实际交互验证。
- 比较新增前后 Concepts、Primitives、Speaking Card、Search 页面，在 1440×900 和 390×844 下均未出现文档横向溢出。卡片网格保持桌面双列（452px / 452px）、移动端单列（343px）。新详情页和展开卡片在移动端亦未出现横向溢出。
- 新增后原有 152 个 HTML 路径全部保留，只增加两个详情页。检查新增构建中 3236 个内部链接及锚点，未发现无效目标。
- `/dataset.json` 中已有概念、原语记录逐条保持不变；原有 20 张卡片的 article HTML 逐条保持不变；应用 `_astro/*.css` 内容保持一致。Pagefind 辅助生成文件未作为样式字节一致性的判断依据。

原始日志及静态检查结果保留于 `/private/tmp/lexicon-yaml-audit-eLCMYC/`：`baseline-{check,test,build}.log`、`expanded-{check,test,build}.log`、`card-only-{check,test}.log`、`artifact-check.json`。临时目录可能被系统清理，本报告保留关键结果。

## 使用边界

- 自动展示发生在重新构建、部署后；添加本地文件不会直接更新已部署的静态网站。
- 新记录必须满足 schema、唯一标识和关系契约。新增文件使用现有分类与层级；添加新的 category 或 layer 仍需修改相关 schema 与展示元数据。
- Primitive 的定义可以独立内联，也可以引用 Concept。若新增 Primitive 引用已有 Concept，已有 Concept 必须包含该 Primitive 的回链；这种情况需要同步编辑关联 YAML，不能保证始终只增加文件。
- 首页精选五个 Concept 是人工指定；新增概念不会自动进入精选区。首页概念总数和分类计数会变化，列表长度和页面高度也会自然增加。
- `/search/`、`/dataset.json`、`/llms.txt` 当前只直接收录 Concept 和 Primitive。Speaking Cards 在卡片页面展示，并由生产 Pagefind 索引；不等同于这三个投影直接支持卡片记录。
- 内容集合支持的递归路径与验证器并不完全一致；本次仅验证三个约定目录中直接放置文件的方式。
- 本次验证为三条代表性合法记录的功能与布局验证，不覆盖任意极长文本、大规模数据量或线上真实部署。

## 最小后续改进建议

将两项固定数量断言替换为能够随合法数据扩充而成立的完整性校验，继续验证字段、标识和关系，避免每次增加内容都修改测试数字。增加代表性的 YAML 新增回归，验证集合发现、页面生成与关联投影。

该改进尚未实施。本次只验证并记录现状，未部署、提交或推送；远期原始资料到三类 YAML 的整理流程另行设计。
