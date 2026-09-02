---
title: 发布与集成
description: 把做好的 Flow 通过 API、站点嵌入、MCP 服务器或 OpenAI 兼容端点对外提供。
sidebar:
  order: 6
---

一条做好的 Flow 可以通过多种方式对外提供能力。

## 用 API 运行 Flow

在 Flow 里打开 **Share → API access**，即可生成 Python、JavaScript、curl 三种片段。片段可指向 v1 的 `/v1/run/$FLOW_ID` 或 v2 的 `POST /api/v2/workflows`。

- **认证**：1.5 及以后大多数端点需要 API key。生成的示例会读 `LANGFLOW_API_KEY` 环境变量，也可用 `x-api-key` header。
- **端点别名**：用 Endpoint Name 给端点起一个可读别名，仅限字母、数字、连字符与下划线。
- **Tweaks**：运行时覆盖组件参数而不改动已存 Flow。在组件 Parameters 里把字段标为 API（存为 `api_editable`）后，它们会出现在生成的片段里。被拒绝的 tweaks 可能返回 `422`，code 为 `TWEAKS_REFUSED`。

## 嵌入到网站

Langflow 能提供 `langflow-chat` 片段把对话嵌进网页。小部件需要 Chat Input 与 Chat Output 组件。从 Share → Embed into site 获取片段。

- 必填属性：`host_url`（必须 HTTPS、结尾不带斜杠）、`flow_id`、`api_key`。
- 可选属性支持会话标识、样式、尺寸、定位与运行时 tweaks。
- React 与 HTML 用普通属性；Angular 需要 custom element schema 并对复杂属性用 JSON 风格绑定。

## 通过 MCP 服务器提供

每个 project 都能把它的 Flow 作为 MCP 工具，通过 `/mcp` 端点暴露；Langflow 也能作为 MCP 客户端去连其它 MCP 服务器。

## 兼容 OpenAI Responses

用 `/api/v1/responses` 端点，现有的 OpenAI 客户端稍加改动即可接入。

## 另见

- [可视化编辑器](/docs/concepts/editor/)
- [Playground](/docs/concepts/playground/)
