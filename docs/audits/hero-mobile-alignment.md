# 手机端主视觉对齐修正

2026-10-10。用户提供的 [手机截图](hero-mobile-alignment/user-screenshot.png) 显示：文字左对齐，人物以较小固定宽度居中，左右留白较大。本轮沿用现有品牌语言，仅修正单栏对齐与尺寸。源码基线 `674064e`，实现 `6444756`，浏览器断言修正 `446cfe3`；本地分支 `codex/hero-editorial-experiment`，尚未推送或发布。

## 行为与实际页面

50rem 及以下，完整人物沿文字左边界排列，填满可用列，上限 480 CSS px；主 CTA 仍位于人物之前。360 px 视口显示 328 px 人物，390 px 显示 358 px，569 px 显示 480 px。569 px 作为附件相关宽度的参照检查，附件设备像素不被当作精确 CSS 视口证据。

Light v2、Dark v3 的 SVG 姿态、颜色、箭尖与画幅保持原状，只生成适配放大尺寸的 480/960 px WebP。桌面继续使用旧的 340/680 px 图片和尺寸规则，未实施此前讨论的 420 px 桌面方案。素材来源与重建方式见 [手机素材](../design/brand/hero-artwork/mobile/README.md)。

| 视图 | 实际截图 |
| --- | --- |
| 360 px Dark 完整主视觉 | [查看](hero-mobile-alignment/home-en-dark-360-hero.png) |
| 360 px Light 完整主视觉 | [查看](hero-mobile-alignment/home-en-light-360-hero.png) |
| 569 px Dark 完整主视觉 | [查看](hero-mobile-alignment/home-en-dark-569-hero.png) |
| 360 × 800 Dark 首屏 | [查看](hero-mobile-alignment/home-en-dark-360.png) |
| 360 × 800 Light 首屏 | [查看](hero-mobile-alignment/home-en-light-360.png) |

人物放大增加单栏页面的纵向长度；该取舍用于减少横向空白、统一对齐。主 CTA 与说明仍优先完整出现在 360/390 px 首屏，人物随后的完整展示不要求同时进入首屏。

## 验证

- `npm run check`：0 errors、0 warnings、0 hints；schema/catalog 通过。
- `npm test`：91 通过、0 失败。
- 生产配置 `npm run build`：575 Astro 页面，Pagefind 开启；分享图片生成成功。
- `npm run test:browser -- --reuse-build`：302 通过、0 失败，full Chromium、生产 `/ai-native-lexicon`。原有焦点、主题、导航及严格 BFCache/reload 检查通过。测试坐标修正后另对现有品牌检查函数执行 28 项定向复验，全部通过。
- 独立首屏与素材检查：英文/中文 × Light/Dark × 12 视口，共 48 组合通过；320/360/390/430/569/600/768/800 px 均左对齐、按列宽或 480 px 上限展示、无横向溢出；1024/1280/1440/1920 px 的 16 组桌面人物/文字/CTA 坐标与上轮完全相同。
- DPR 2 手机初次只请求 Light 960 px，Auto 切至 Dark 请求对应 960 px；扩大到 1440 px 后切回桌面 Dark 680 px。没有第二套主题状态或布局脚本。
- 两轴审查：Spec 无发现；Standards 发现的测试滚动坐标时点问题已修正，人物与 CTA 在同一滚动位置重新测量。独立隔离重建的四张 WebP 及索引与提交逐字节一致。

手机 Lighthouse 13.5.0 实验室预设测得性能 / 无障碍均为 100，LCP 1223 ms、CLS 0、TBT 43 ms。使用当前 8090 预览；这是单次本地测量，没有同条件手机基线，不据此宣称性能提升或真实用户 INP。

实际几何、图片解码和网络记录见 [布局记录](hero-mobile-alignment/layout-report.json)，精确指标和环境见 [验证摘要](hero-mobile-alignment/verification-summary.json)。完整日志在本地 `work/hero-mobile/`，生产浏览器报告为 `work/hero-mobile/browser/manifest.json`。400% 浏览器缩放及屏幕阅读器会话仍未测量；窄屏回流不替代这些检查。

## 查看与复验

当前本地首页为 `http://127.0.0.1:8090/ai-native-lexicon/`。手机或窄窗下刷新即可查看新布局，通过原生主题控件比较 Light/Dark。预览停止后的生产构建与启动方式沿用 [首轮实验记录](hero-editorial-experiment.md#查看与复验)。
