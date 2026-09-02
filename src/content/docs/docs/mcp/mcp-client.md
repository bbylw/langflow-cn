---
title: 将 Langflow 用作 MCP 客户端
description: 用 MCP Tools 组件连接 MCP 服务器，让 Agent 调用外部工具与项目 Flow。
sidebar:
  order: 2
---

Langflow 同时以 MCP 服务器和 MCP 客户端两种角色集成 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)。

本页介绍如何把 Langflow 用作 MCP 客户端：通过 **MCP Tools** 组件连接并使用 MCP 服务器。

关于把 Langflow 用作 MCP 服务器，见[将 Langflow 用作 MCP 服务器](/docs/mcp/mcp-server/)。

## 使用 MCP Tools 组件

**MCP Tools** 组件连接到 MCP 服务器，让 [Langflow Agent](/docs/agents/agents/) 在响应用户提问时能调用该服务器的工具。

先注册 MCP 服务器，再从 **MCP** 侧边栏添加 **MCP Tools**，步骤见下文[连接非 Langflow MCP 服务器](#连接非-langflow-mcp-服务器)。

按要访问的服务器类型，组件有两种模式：

- [连接非 Langflow MCP 服务器](#连接非-langflow-mcp-服务器)：用 JSON 配置文件、服务器启动命令或 HTTP/SSE URL，访问外部非 Langflow MCP 服务器提供的工具。
- [连接 Langflow MCP 服务器](#连接-langflow-mcp-服务器)：把 [Langflow project](/docs/concepts/flows/) 中的 Flow 当作 MCP 工具使用。

### 连接非 Langflow MCP 服务器

:::tip
`uvx` 随 Langflow 包中的 `uv` 一起提供。

要用 `npx` 启动服务器命令，需先安装 LTS 版本的 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)。如果 Langflow 跑在 Docker 里，要在容器镜像内安装 Node.js 并重新构建，运行时才能使用基于 `npx` 的 MCP 服务器。详见 [Package management](https://docs.langflow.org/develop-application#package-management)。

Langflow 中 `npx` MCP 服务器的示例见 [Connect an Astra DB MCP server to Langflow](https://docs.langflow.org/mcp-component-astra)。
:::

从 Langflow 1.9.x 起，**MCP Tools** 组件不再列在 **Agents** 分类下供直接拖拽。向 Flow 添加 MCP 工具的步骤：

1. 注册 MCP 服务器。打开 **Settings** → **MCP Servers** 点 **Add MCP Server**，或在 Flow 编辑器左侧边栏点 **MCP**，再点 **Add MCP Server**。

2. 配置并保存服务器。填好连接信息后点 **Save**。

3. 在 **MCP** 侧边栏把新服务器拖到画布上，画布上会出现该服务器对应的 **MCP Tools** 组件。

然后在 **MCP Tools** 组件的 **MCP Server** 字段选择已注册的服务器。

新服务器在 **Settings** > **MCP Servers** 或 **MCP** 侧边栏 > **Add MCP Server** 中注册，支持以下连接类型：

- **JSON**：把 MCP 服务器的 JSON 配置对象粘进输入框，包含要用到的必需与可选参数，点 **Add Server**。

- **STDIO**：填 MCP 服务器的 **Name**、**Command**，以及它用到的 **Arguments** 和 **Environment Variables**，点 **Add Server**。例如启动 [Fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch) 服务器：**Command** 填 `uvx`，第一个 **Argument** 填 `mcp-server-fetch`。

- **HTTP/SSE**：填 MCP 服务器的 **Name**、**URL**，以及它用到的 **Headers** 和 **Environment Variables**，点 **Add Server**。Langflow MCP 服务器的默认 URL 是 `http://localhost:7860/api/v1/mcp/project/PROJECT_ID/streamable` 或 `http://localhost:7860/api/v1/mcp/streamable`，详见[连接 Langflow MCP 服务器](#连接-langflow-mcp-服务器)。

1. 为 MCP 服务器配置 Headers：在 **Headers** 字段以键值对逐条填写。Header 值可以填[全局变量](https://docs.langflow.org/configuration-global-variables)名，详见[在 MCP 服务器 Header 中使用全局变量](#在-mcp-服务器-header-中使用全局变量)。

   如果这个服务器嵌套在一条作为 MCP 服务器运行的 Langflow Flow 里，可以在运行时把传入请求的 `x-api-key` 或 `Authorization` header 直接透传给它，详见[向嵌套 MCP 服务器透传 x-api-key](#向嵌套-mcp-服务器透传-x-api-key)。

2. 要在服务器命令中使用环境变量，在 **Env** 字段以键值对逐条填写。

3. 在 **Tool** 字段选择该组件要用的工具；留空则允许访问该 MCP 服务器提供的全部工具。

   选定具体工具后，可能还需配置该工具专属的字段，见所用 MCP 服务器的文档。

此时 **MCP Tools** 组件已能提供连接服务器上的工具，但还没有人使用它。下面把工具交给 [**Agent** 组件](https://docs.langflow.org/components-agents)，让 agent 在响应中使用它：

4. 在组件的 header 菜单（见[组件菜单](/docs/concepts/components/)）里启用 **Tool mode**。

5. 把 **MCP Tools** 组件的 **Toolset** 端口连到 **Agent** 组件的 **Tools** 端口。

   如果 Flow 里还没有 **Agent**，同时给它接上 **Chat Input** 和 **Chat Output** 组件。

6. 测试 Flow，确认 MCP 服务器已连接、agent 会使用所选工具。打开 **Playground**，输入一条会用到该工具的 prompt。

   例如用 `mcp-server-fetch` 的 `fetch` 工具时，可以让 agent 总结最近的科技新闻：agent 会调用 MCP 服务器的 `fetch` 函数并返回结果。

7. 要让 agent 能用更多工具，重复以上步骤，接入不同服务器或工具的组件。

### 连接 Langflow MCP 服务器

每个 Langflow project 都运行一个独立的 MCP 服务器，把 project 里的 Flow 暴露为 MCP 工具。关于 project MCP 服务器、把 Flow 暴露为工具等，见[将 Langflow 用作 MCP 服务器](/docs/mcp/mcp-server/)。

Langflow MCP 服务器支持 **streamable HTTP** 传输，并以 **Server-Sent Events (SSE)** 作为回退。

要用「Flow 即工具」，先把 Langflow MCP 端点注册为服务器，再从 **MCP** 侧边栏添加 **MCP Tools** 组件：

1. 注册 Langflow MCP 服务器。打开 **Settings** > **MCP Servers** 或 Flow 侧边栏的 **MCP** 区，点 **Add MCP Server**，选 **HTTP/SSE** 模式。

2. 在 **MCP URL** 字段填 Langflow 服务器的 MCP 端点：

   - project 专属服务器：`http://localhost:7860/api/v1/mcp/project/PROJECT_ID/streamable`

   - 全局 MCP 服务器：`http://localhost:7860/api/v1/mcp/streamable`

   - Langflow Desktop 默认：`http://localhost:7868/`

   目标服务器上所有可用的 Flow 都视为工具。认证与 project URL 见[将 Langflow 用作 MCP 服务器](/docs/mcp/mcp-server/)。

3. 保存服务器。连接成功后服务器会被存储，并在 **MCP** 侧边栏显示为一块磁贴。

4. 向 Flow 添加 **MCP Tools** 组件。

5. 在组件的 header 菜单里启用 **Tool Mode**。

6. 把 **MCP Tools** 组件的 **Toolset** 端口连到 **Agent** 组件的 **Tools** 端口。

7. 如果 Flow 里还没有，给 **Agent** 组件接上 **Chat Input** 和 **Chat Output** 组件。

8. 测试 Flow，确认 agent 会用你的 Flow 回答问题。打开 **Playground**，输入一条会用到所接 Flow 的 prompt。

9. 要让 agent 能用更多工具，重复以上步骤，接入不同服务器或工具的组件。

## MCP Tools 参数

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `mcp_server` | String | 输入参数。要连接的 MCP 服务器。 |
| `tool` | String | 输入参数。要执行的连接服务器上的特定工具。留空则可访问全部工具。 |
| `use_cache` | Boolean | 输入参数。缓存 MCP 服务器与工具以提升性能。默认 `false`。 |
| `verify_ssl` | Boolean | 输入参数。为 HTTPS 连接启用 SSL 证书校验。默认 `true`。 |
| `response` | Table | 输出参数。包含所执行工具响应的 [Table](/docs/concepts/data-types/#table)。 |

## 管理已连接的 MCP 服务器

要管理供 Flow 使用的 MCP 服务器连接，在可视化编辑器打开 **MCP** 区点 **Manage Servers**，或点头像图标选 **Settings**，再点 **MCP Servers**。

新增 MCP 服务器：点 **Add MCP Server** 完成注册，再在 **MCP Tools** 组件上选用，见[连接非 Langflow MCP 服务器](#连接非-langflow-mcp-服务器)。

点 **More** 可编辑或删除某个 MCP 服务器连接。

如果 Langflow 服务器管理员锁定了 MCP 服务器管理，添加或修改服务器时会收到锁定提示。详见[锁定 MCP 服务器管理](/docs/mcp/mcp-server/#将-mcp-服务器管理限制为超级用户)。

## 通过 API 修改 MCP 服务器环境变量

通过 [Langflow API](https://docs.langflow.org/api-reference-api-examples) 运行 Flow 时，可以用 tweak 在运行时修改 MCP 服务器的环境变量。

任何支持 `tweaks` 参数的 Langflow API 请求都可以带 tweaks，比如对 `/run` 或 `/webhook` 端点的 POST 请求。详见[发布与集成](/docs/concepts/publish/)。

用 tweaks 修改 **MCP Tools** 组件的环境变量：

1. 打开包含 **MCP Tools** 组件的 Flow。

2. 找到 **MCP Tools** 组件的唯一 ID：点组件上的 **Controls**，ID 会显示在 **Controls** 面板中，如 `MCPTools-Bzahc`。

3. 向 Langflow 服务器的 `/run` 端点发 POST 请求，并在 tweaks 中带上 **MCP Tools** 组件的配置。

以下示例展示 `env` 对象嵌在 tweaks 载荷 `mcp_server` 之下的请求结构：

   ```python
   import requests
   import os

   LANGFLOW_SERVER_ADDRESS = "http://localhost:7860"
   FLOW_ID = "your-flow-id"
   LANGFLOW_API_KEY = os.getenv("LANGFLOW_API_KEY")
   MCP_TOOLS_COMPONENT_ID = "MCPTools-Bzahc"

   url = f"{LANGFLOW_SERVER_ADDRESS}/api/v1/run/{FLOW_ID}?stream=false"
   headers = {
       "Content-Type": "application/json",
       "x-api-key": LANGFLOW_API_KEY
   }

   payload = {
       "output_type": "chat",
       "input_type": "chat",
       "input_value": "What sales data is available to me?",
       "tweaks": {
           MCP_TOOLS_COMPONENT_ID: {
               "mcp_server": {
                   "env": {
                       "API_URL": "https://api.example.com",
                       "API_KEY": "your-mcp-server-api-key",
                       "ENVIRONMENT": "production"
                   }
               }
           }
       }
   }

   response = requests.post(url, json=payload, headers=headers)
   print(response.json())
   ```

   ```typescript
   const LANGFLOW_SERVER_ADDRESS = "http://localhost:7860";
   const FLOW_ID = "your-flow-id";
   const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY || "";
   const MCP_TOOLS_COMPONENT_ID = "MCPTools-Bzahc";

   const url = `${LANGFLOW_SERVER_ADDRESS}/api/v1/run/${FLOW_ID}?stream=false`;
   const response = await fetch(url, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "x-api-key": LANGFLOW_API_KEY,
     },
     body: JSON.stringify({
       output_type: "chat",
       input_type: "chat",
       input_value: "What sales data is available to me?",
       tweaks: {
         [MCP_TOOLS_COMPONENT_ID]: {
           mcp_server: {
             env: {
               API_URL: "https://api.example.com",
               API_KEY: "your-mcp-server-api-key",
               ENVIRONMENT: "production",
             },
           },
         },
       },
     }),
   });
   const data = await response.json();
   console.log(data);
   ```

   ```bash
   curl --request POST \
     --url "http://LANGFLOW_SERVER_ADDRESS/api/v1/run/FLOW_ID?stream=false" \
     --header "Content-Type: application/json" \
     --header "x-api-key: LANGFLOW_API_KEY" \
     --data '{
       "output_type": "chat",
       "input_type": "chat",
       "input_value": "What sales data is available to me?",
       "tweaks": {
         "MCP_TOOLS_COMPONENT_ID": {
           "mcp_server": {
             "env": {
               "API_URL": "https://api.example.com",
               "API_KEY": "your-mcp-server-api-key",
               "ENVIRONMENT": "production"
             }
           }
         }
       }
     }'
   ```

把 `MCP_TOOLS_COMPONENT_ID`、`LANGFLOW_API_KEY`、`LANGFLOW_SERVER_ADDRESS` 和 `FLOW_ID` 换成你 Langflow 部署中的实际值。

Langflow 不会自动发现或暴露 MCP 服务器接受哪些环境变量。要知道你的 MCP 服务器接受什么，请查阅其文档。例如 [Astra DB MCP 服务器](https://github.com/datastax/astra-db-mcp)需要 `ASTRA_DB_APPLICATION_TOKEN` 和 `ASTRA_DB_API_ENDPOINT`，另有可选的 `ASTRA_DB_KEYSPACE`，见其仓库文档。

## 在 MCP 服务器 Header 中使用全局变量

MCP 服务器的 Header 值可以使用[全局变量](https://docs.langflow.org/configuration-global-variables)，安全地存储和引用 API key、认证令牌等敏感值。这特别适合需要在运行时传入用户级凭据的部署场景。

把全局变量名填进 Header 值，Langflow 会在发起 MCP 服务器请求前把它解析为实际值。Langflow 只把令牌值传给你的服务器，不会代你的 MCP 服务器校验令牌。

例如，创建名为 `TEST_BEARER_TOKEN` 的全局变量用于 MCP 服务器 bearer 认证：

1. 点头像图标选 **Settings**，再点 **Global Variables**，打开 **Global Variables** 面板。

2. 创建一个 **Credential** 类型的全局变量，名为 `TEST_BEARER_TOKEN`。

3. 在 **Value** 字段填 MCP 服务器的 bearer token 值。值必须带 `Bearer` 前缀加空格，如 `Bearer eyJhbG...`。

4. 点 **Save Variable**。

5. 要管理 Langflow 客户端的 MCP 服务器连接，点 **MCP servers** 再点 **Manage Servers**，或点头像图标选 **Settings**，再点 **MCP Servers**。

6. 点 **Add MCP Server**。

7. 填写：

   - **Name**：`test-mcp-server`

   - **Streamable HTTP/SSE URL**：你的 MCP 服务器 URL，如 `http://127.0.0.1:8000/mcp`。

   - **Headers**：key 填字面量字符串 `Authorization`；value 填 `TEST_BEARER_TOKEN`，即你的全局变量名。

8. 点 **Create Server**。

   连接成功后，Langflow 会显示该服务器暴露的工具数量。

服务器和全局变量建好后，即可用 **MCP Tools** 组件连接该服务器：

9. 向 Flow 添加 **MCP Tools** 组件。

10. 在 **MCP Tools** 组件上确认 **MCP Server** 选的是刚建的服务器。MCP 服务器配置里已包含之前设置的 Headers，组件无需再配置；组件向 MCP 服务器发请求时会自动解析全局变量 `TEST_BEARER_TOKEN`。

11. 可选：要在组件上覆盖或追加 Header，点开组件，在[组件检查面板](/docs/concepts/components/)中查看 **Headers** 参数并添加键值。组件里配置的 Header 优先于 MCP 服务器设置里配置的 Header。

12. 测试 Flow，确认 agent 会用你的服务器回答问题。打开 **Playground**，输入一条会用到所接工具的 prompt。

    Langflow 会在向 MCP 服务器发请求前把 `TEST_BEARER_TOKEN` 解析为实际值；服务器收到的 `Authorization` header 就是解析后的令牌值。

## 向嵌套 MCP 服务器透传 x-api-key

当 Langflow 作为 MCP 服务器运行，且 Flow 中的 **MCP Tools** 组件要调用外部服务器时，可以在运行时把外层客户端的 `x-api-key` 或 `Authorization` header 转发下去。

在嵌套服务器的 Headers 配置里，把 key 和 value 设为同一个 header 名，如 key 填 `x-api-key`、value 也填 `x-api-key`。Langflow 会从传入请求中读取同名 header，并在调用嵌套服务器前替换进去。

如果传入请求没有包含所配置的 header，则原样透传字面量字符串。

## 另见

- [Langflow MCP Client](https://docs.langflow.org/langflow-mcp-client)
- [将 Langflow 用作 MCP 服务器](/docs/mcp/mcp-server/)
- [在 MCP Tools 组件中使用 DataStax Astra DB MCP 服务器](https://docs.langflow.org/mcp-component-astra)
