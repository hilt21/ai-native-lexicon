# 手机首页页头切换控件实验

2026-10-10，基线 `527da98`，本地分支 `codex/hero-editorial-experiment`，尚未发布。用户要求主题和语言切换与第一行 Logo、搜索同行。

## 实现与取舍

首页在小于 50rem 的视口直接显示原生 Header 中的主题、语言选择器，移除正文中的重复控件。收起状态使用图标，打开后保留完整原生选项与可访问名称；主题仍提供 Light / Dark / Auto，语言仍提供 English / 简体中文。手机字标宽度为 `clamp(120px, 38vw, 180px)`；搜索和两个选择器复用 44px 控件尺寸。页头没有新增高度，497px 实际预览中仍为 56px。

图标节省横向空间，但收起状态不再显示语言名称。桌面文字选择器、普通阅读页的原生菜单、首页版本号及其他布局不在本轮改动范围内。实现只调整 CSS 和控件位置，没有新的主题状态或客户端逻辑；见 [当前界面契约](../design/redesign-system.md)。

| 360 × 844 实际页面 | 截图 |
| --- | --- |
| Light | [查看](mobile-header-controls/home-light-360.png) |
| Dark | [查看](mobile-header-controls/home-dark-360.png) |

## 验证

- `npm run check`：0 errors / warnings / hints；`npm test`：91 通过、0 失败。
- 生产子路径构建：575 Astro 页面、576 HTML，Pagefind 与分享图片生成成功。
- `WEB_EVIDENCE=work/hero-controls-analysis/browser npm run test:browser -- --reuse-build`：302 通过、0 失败，Chromium 153.0.8010.12。英文/中文 × Light/Dark × 320/360/390/799px 的页头同行、无重叠、字标至少 120px、三个控件至少 44px、可访问名称和焦点断言通过；原有搜索、导航、严格 BFCache/reload 检查通过。
- 原生主题及语言往返保留 query 和有效 fragment；Auto 跟随系统并在重载后保留。桌面恢复完整语言文字。新增手机检查结束后恢复桌面视口，避免污染后续测试。
- 独立 360→320→360 双主题复验：CTA 文字、颜色和不透明度正常，见 [测量记录](mobile-header-controls/measurements.json)。图标与纸色的计算对比度为 Light 8.98、Dark 10.85；CTA 文字为 15.02。实际预览中原生选择器可打开并显示当前选项。
- 初次截图集合中一张英文 Dark 360px 图片未绘制 CTA 文案，390px 及独立同尺寸复验正常；上表使用独立复验截图。没有据此修改无关页面代码，也未把一次截图异常当作已确认的产品缺陷。

完整报告位于本地 `work/hero-controls-analysis/browser/manifest.json`。屏幕阅读器会话、实际 400% 缩放与真机 iOS/Android 选择菜单未验证；窄屏浏览器检查不替代这些会话。

本地预览：[首页](http://127.0.0.1:8090/ai-native-lexicon/)。
