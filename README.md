# Langflow 中文文档站（langflow-cn）

基于 `Astro 7 + Starlight + Tailwind 4` 的 Langflow 中文文档与营销落地站，部署目标 `https://langflow.ndjp.net`。

## 结构

```text
src/
├── pages/            # 营销页：index（首页）/ install / components / 404
├── layouts/Layout.astro  # 营销页壳（SEO、主题、跳链）
├── components/       # Header / Footer
├── data/site.ts      # 集成、端口、组件分组单一数据源
├── content/docs/docs/# 文档正文（URL 为 /docs/*）
├── assets/           # logo（画布插画为 FlowShot.astro 纯 SVG，无位图）
└── styles/           # global.css（营销）/ starlight.css（文档主题）
public/               # favicon.svg|ico / og.png / robots.txt
scripts/gen-favicon.mjs # 从 SVG 生成多尺寸 favicon.ico
```

文档侧栏在 `astro.config.mjs` 定义：入门 / 核心概念 / 智能体 / MCP / 配置 / 部署，共 20 篇。

## 命令

| 命令 | 说明 |
| :--- | :--- |
| `bun install` | 安装依赖 |
| `bun run dev` | 本地开发 `localhost:4321` |
| `bun run build` | 生产构建到 `dist/`（含 sitemap） |
| `bun run preview` | 本地预览构建产物 |
| `bun run check` | Astro 类型检查 |
| `bun run favicon` | 重新生成 `public/favicon.ico` |

## 约定

- 营销页用 `Layout + Header + <main id="main-content"> + Footer`，装饰图标加 `aria-hidden="true"`。
- 分类数据只改 `src/data/site.ts`，不要在页面里硬编码第二份。
- 图片走 `astro:assets` 的 `Image`，首屏 `eager + webp`，折叠下方 `lazy + webp`。
- 站内互链用相对路径（如 `/docs/concepts/flows`），不要链到 `docs.langflow.org`。
- 文档只需 `title / description` frontmatter，侧栏顺序由 `astro.config.mjs` 集中管理。
