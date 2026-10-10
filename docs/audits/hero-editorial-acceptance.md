# 首页方案 A：最小实验验收记录

2026-10-10，用户明确“最小实验验收通过”，并要求开发前同步 spec 与设计文档。验收基线为本地 `44f4b23`、分支 `codex/hero-editorial-experiment`，尚未推送或发布。本记录汇总事实与证据；后续需求使用 [已验收首页规范](../design/brand/homepage-hero-artwork-plan.md)，共享组件使用 [设计系统](../design/redesign-system.md)。

## 已验收结果

| 项目 | 确认结果与产品提交 | 证据 |
| --- | --- | --- |
| 桌面尺度/位置、北极星 | 宽桌面 330px / 370px 槽、上移 20px，完整姿态与酸绿箭尖；`64fab4f` | [首轮实验](hero-editorial-experiment.md)，其旧手机及暖白 Dark 只作历史对照 |
| Dark 融合 | Dark v3 暗部接近背景，亮部集中在脸、手与独角兽头；`2d9ba6c` | [Dark 对照与轮廓验证](hero-dark-blend-experiment.md) |
| 手机人物 | CTA 后、与文字左边界对齐、满列宽且最大 480px；480/960px 导出；`6444756` | [对齐与素材记录](hero-mobile-alignment.md) |
| 手机页头 | Logo、搜索、两个 44px 原生图标选择器同一行；`26bfc65` | [页头验证](mobile-header-controls.md)；下方最新首屏已包含后续版本号移动 |
| 版本位置 | 两语言/全部宽度移至原生底部导航之后；`44f4b23` | 下方底部截图及最新生产浏览器断言 |

桌面右侧 80% 占幅 / 410–430px 仅讨论，未实施或验收；P2 辅助图形、P3 新微交互没有进入当前结果。没有将首页新资产扩至默认 OG 或 Speaking Guide 图片。

## 当前页面证据

| 页面 | 截图 |
| --- | --- |
| 英文 Light 360px 首屏 | [查看](hero-editorial-acceptance/home-light-360.png) |
| 英文 Dark 390px 首屏 | [查看](hero-editorial-acceptance/home-dark-390.png) |
| 英文 Light 360px 底部 | [查看](hero-editorial-acceptance/footer-en-light-360.png) |
| 中文 Dark 360px 底部 | [查看](hero-editorial-acceptance/footer-zh-dark-360.png) |

截图来自版本号下移时的现有生产子路径浏览器套件；首屏为完整视口，底部为原生导航及版本文字所在容器的截图。手机完整人物的姿态与暗部对照见上述单独实验记录。

## 工程证据与边界

最近一次产品验证在版本号移动时完成：`npm run check` 零错误/警告/hint，91 项单元测试通过，生产构建 575 Astro 页面 / 576 HTML，302 项 full Chromium 浏览器检查通过、零失败。核对英文/中文 × Light/Dark 的首屏与底部、320/360/390/799px 页头同行及目标尺寸、390/1440px 版本位置；保留既有搜索、导航、Auto/系统/重载和严格 BFCache/reload 检查。报告位于本地 `work/home-edition-footer/browser/manifest.json`；此处是该次运行的结果，本次纯文档同步不重跑产品套件。

此前的桌面及手机 Lighthouse 数值保持各实验记录的时间、环境及单次测量限制，不作为当前上线性能或真实用户 INP 的证明。屏幕阅读器、实际 400% 缩放、真机选择菜单及上线后用户任务/品牌效果仍未验证。用户对本地设计的验收与工程验证、线上发布和效果评估分别记录。

原始 BRAND-01 的 PR #47 已合并、#44/#45/#46 已关闭；这些远程事实于本次同步重新核对。新首页实验继续处于本地，Spec #44 以同日补充说明记录当前验收基线，并保留原始正文。
