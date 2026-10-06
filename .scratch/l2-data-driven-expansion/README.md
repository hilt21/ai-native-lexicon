# L2 开发 tickets

状态（2026-10-06）：维护者已确认拆分粒度，10 张票已发布到 `hilt21/ai-native-lexicon` 的 GitHub Issues。L2-01、L2-02 已合并并关闭；L2-03 至 L2-10 尚待实施。

`issues/` 正文和 `manifest.json` 保留首次发布时的内容、依赖及核验快照，不是实时工作状态。领取开发票前读取 GitHub Issues 的当前状态。

来源为本地 `docs/design/knowledge-system-evolution.md` 的 L2-0 至 L2-4，包含已确认的应用资源模型；每票自包含实施范围及验收，不依赖设计文档先上线。

首次发布基线：远端默认分支为 `master@85df1bc2d3c45dee361f944d5ccd2003c454977f`；当时本地源码为 `codex/speaking-cards-yaml@2368945`。这些提交保留票据规划时的上下文。

## 已完成进度

- L2-01：[#7](https://github.com/hilt21/ai-native-lexicon/issues/7) 由 [PR #17](https://github.com/hilt21/ai-native-lexicon/pull/17) 合并并关闭，合并提交 `4bd1647`。
- L2-02：[#8](https://github.com/hilt21/ai-native-lexicon/issues/8) 由 [PR #18](https://github.com/hilt21/ai-native-lexicon/pull/18) 合并并关闭，合并提交 `446dc95`。
- 下一张票为 L2-03（#9）；其前置 #8 已完成，领取前仍须核实当前状态和目标分支。

## Ticket 映射

| 本地 ID | GitHub | 标题与本地镜像 | Blocked by |
| --- | --- | --- | --- |
| L2-01 | [#7](https://github.com/hilt21/ai-native-lexicon/issues/7) | [合法新增 YAML 可通过发布检查，编辑链接使用正确分支](issues/01-extension-and-edit-branch.md) | 无 |
| L2-02 | [#8](https://github.com/hilt21/ai-native-lexicon/issues/8) | [引入共享内容输入契约与目录读取边界，保持既有页面行为](issues/02-expand-shared-content-boundary.md) | #7 |
| L2-03 | [#9](https://github.com/hilt21/ai-native-lexicon/issues/9) | [Concept 从输入到 CLI、Astro 和 portable schema 使用同一契约](issues/03-migrate-concept-contract.md) | #8 |
| L2-04 | [#10](https://github.com/hilt21/ai-native-lexicon/issues/10) | [Primitive 的定义、引用和 portable schema 统一到共享契约](issues/04-migrate-primitive-contract.md) | #9 |
| L2-05 | [#11](https://github.com/hilt21/ai-native-lexicon/issues/11) | [演讲指南统一共享契约，保留卡片编号、展开与反向关联](issues/05-migrate-speaking-guide-contract.md) | #10 |
| L2-06 | [#12](https://github.com/hilt21/ai-native-lexicon/issues/12) | [删除迁移期旧规则，并将 portable schema 漂移检查接入 CI](issues/06-contract-legacy-rules-and-schema-drift.md) | #11 |
| L2-07 | [#13](https://github.com/hilt21/ai-native-lexicon/issues/13) | [新增分类 YAML 自动产生分类页面、计数与校验词汇](issues/07-category-yaml-to-page.md) | #12 |
| L2-08 | [#14](https://github.com/hilt21/ai-native-lexicon/issues/14) | [新增原语层级 YAML 自动驱动校验、目录分组与锚点](issues/08-layer-yaml-to-page.md) | #13 |
| L2-09 | [#15](https://github.com/hilt21/ai-native-lexicon/issues/15) | [演讲指南进入自定义搜索、dataset 与 llms，导出具有稳定版本](issues/09-speaking-guide-search-and-exports.md) | #14 |
| L2-10 | [#16](https://github.com/hilt21/ai-native-lexicon/issues/16) | [新增内容与分类配置的完整扩充场景可重跑，并更新贡献流程](issues/10-repeatable-extension-integration.md) | #15 |

## 实施顺序与门槛

L2-01 → L2-02 → L2-03 → L2-04 → L2-05 → L2-06 → L2-07 → L2-08 → L2-09 → L2-10。

共享契约按 Expand（02）→ 按类型迁移（03–05）→ Contract（06）推进；分类（07）、层级（08）、卡片投影（09）各自贯通到用户结果；最后（10）验证整条扩充路径。每票都要求对应行为验证及完整仓库检查，不能将验证全部推迟到最后。

作者只维护 YAML；分类/层级的 portable schema 若含生成 enum，生成命令自动更新派生 JSON，不手写第二份词汇表。

首次发布时只有 L2-01（#7）无阻塞且标记 `ready-for-agent`，其余九票具有正文 `Blocked by` 和 GitHub 原生依赖。后续按前序实际完成情况重新核实依赖，再将待领取的下一张票标记 ready；没有自动标签维护任务。

GitHub Issues 为正式工作 tracker；本地 issues/ 文件为首次发布内容镜像，manifest.json 保存当时的编号、URL、数据库 ID、依赖及回读验证信息。首次发布只创建本批票和所需的 ready-for-agent 标签，没有新增父 map issue。
