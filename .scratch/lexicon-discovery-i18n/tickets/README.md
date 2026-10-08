# 最少票拆分与发布记录

来源：精简为 12 条 user stories 的本地 spec。用户已确认三票粒度与依赖，三票均已发布至 hilt21/ai-native-lexicon，并标记 ready-for-agent。当前规范票据为下表 GitHub Issues；本目录保留经批准正文与发布核对记录。

## 拆分

| 票 | 标题 | Blocked by | 独立交付 |
| --- | --- | --- | --- |
| [#37](https://github.com/hilt21/ai-native-lexicon/issues/37) | 首页与字段搜索：更快找到正确词条 | 无 | 首页词条前移、aliases 输入／导出、类型筛选、匹配解释与搜索恢复 |
| [#38](https://github.com/hilt21/ai-native-lexicon/issues/38) | 词条阅读：示例、区别、复制与证据试点 | 无 | 实际内容字段、详情例子／区别、Copy／A–Z／相关摘要、四记录证据审查 |
| [#39](https://github.com/hilt21/ai-native-lexicon/issues/39) | Astro 双语阅读：English Canonical + Translation Overlay | #37、#38 | en／zh-CN 全链路阅读与搜索、审查／freshness／fallback、SEO 与机器兼容 |

## 为什么是三票

- 01 和 02 都能从 canonical 输入到实际页面与公开验收独立完成，不把 Schema／UI／测试横向拆票。
- 03 跨越稳定的内容字段和发现／阅读交互；01 和 02 分别提供其必要契约，所以这两条是真正的阻塞依赖。
- 不把共享文件冲突当作逻辑依赖。01／02 都会涉及 Concept 输入与导出，先落实者的字段与版本要被后来者保留；Schema 重新生成、版本迁移及合并后的检查属于各票交付。
- 不单列预重构、框架搭建、测试、收尾集成或父 spec 发布票。需要的局部整理在所属纵向票内先完成。
- 两票会把内容编辑／证据审查和全部英文 UI 合成一个更宽的首票；三票已经把这些不同验收目标分开，同时将 i18n 保持为一个完整功能。
- Frontier：01 与 02 可开始；两者完成后开始 03。不改动或关闭任何既有 parent issue。

## 需求覆盖

- User stories 1–4：01。
- User stories 5–9：02。
- User stories 10–11：03。
- User story 12：所有票各自完成本票体验的可访问性验收。
- 03 把已完成的查找、复制、连续阅读和证据体验延伸到当前语言，不重复重建英文功能。

## 本地正文副本

- [01：首页与字段搜索](01-discovery-search.md)
- [02：词条阅读与证据](02-reading-evidence.md)
- [03：Astro 翻译覆盖层](03-astro-translation-overlay.md)

已按依赖顺序发布；#39 的正文引用与 GitHub 原生 blocked-by 均指向 #37、#38，前两票没有阻塞。[发布核对记录](publication.json)保留远端正文、标签与依赖快照。编号顺序只用于稳定对应，不将 #37→#38 伪造为依赖。
