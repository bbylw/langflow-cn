// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://langflow.ndjp.net",
  trailingSlash: "never",
  compressHTML: true,
  prefetch: { defaultStrategy: "viewport" },
  // /docs goes straight into the first doc page - no separate docs landing.
  redirects: {
    "/docs": "/docs/get-started/about",
  },
  image: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.simpleicons.org" }],
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
    starlight({
      title: "Langflow",
      description: "Langflow 中文文档：安装、快速上手与核心概念。",
      logo: {
        src: "./src/assets/docs-logo.svg",
        alt: "Langflow",
        replacesTitle: false,
      },
      defaultLocale: "root",
      locales: { root: { label: "中文", lang: "zh-CN" } },
      // lastUpdated is disabled: this project has no .git repository, so
      // Starlight's per-page `git log` spawn (visible console flashes on
      // Windows when the dev server runs detached) cannot produce real dates.
      lastUpdated: false,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/langflow-ai/langflow",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/EqksyE2EX9",
        },
        {
          icon: "twitter",
          label: "X",
          href: "https://twitter.com/langflow_ai",
        },
        {
          icon: "youtube",
          label: "YouTube",
          href: "https://www.youtube.com/@Langflow",
        },
      ],
      head: [
        {
          tag: "link",
          attrs: { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        },
      ],
      customCss: ["./src/styles/starlight.css"],
      // Content lives under src/content/docs/docs/* so URLs read /docs/* while
      // the marketing landing keeps the site root (/).
      // Note: Starlight 0.42 does not render per-item `icon` in the sidebar, so
      // items are label-only here (icons appear on cards and the hero instead).
      sidebar: [
        {
          label: "入门",
          items: [
            { label: "关于 Langflow", slug: "docs/get-started/about" },
            { label: "安装", slug: "docs/get-started/installation" },
            { label: "快速上手", slug: "docs/get-started/quickstart" },
            {
              label: "教程：RAG 聊天机器人",
              slug: "docs/get-started/tutorial-rag",
            },
          ],
        },
        {
          label: "核心概念",
          items: [
            { label: "可视化编辑器", slug: "docs/concepts/editor" },
            { label: "构建 Flows", slug: "docs/concepts/flows" },
            { label: "组件", slug: "docs/concepts/components" },
            { label: "Playground", slug: "docs/concepts/playground" },
            { label: "数据类型", slug: "docs/concepts/data-types" },
            { label: "发布与集成", slug: "docs/concepts/publish" },
            { label: "文件管理", slug: "docs/concepts/file-management" },
          ],
        },
        {
          label: "智能体",
          items: [
            { label: "使用 Langflow Agent", slug: "docs/agents/agents" },
            { label: "为 Agent 配置工具", slug: "docs/agents/agent-tools" },
          ],
        },
        {
          label: "MCP",
          items: [
            { label: "MCP 服务器", slug: "docs/mcp/mcp-server" },
            { label: "MCP 客户端", slug: "docs/mcp/mcp-client" },
          ],
        },
        {
          label: "配置",
          items: [
            { label: "Langflow CLI", slug: "docs/configuration/cli" },
            { label: "全局变量", slug: "docs/configuration/global-variables" },
            {
              label: "外部 PostgreSQL 数据库",
              slug: "docs/configuration/custom-database",
            },
          ],
        },
        {
          label: "部署",
          items: [
            { label: "部署概览", slug: "docs/deployment/overview" },
            { label: "Docker 部署", slug: "docs/deployment/docker" },
          ],
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      assetsInlineLimit: 4096,
    },
  },
});
