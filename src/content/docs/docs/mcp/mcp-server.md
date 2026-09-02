---
title: 将 Langflow 用作 MCP 服务器
description: 把项目 Flow 暴露为 MCP 工具，配置认证、连接客户端并用 MCP Inspector 调试。
sidebar:
  order: 1
---

Langflow 同时以 MCP 服务器和 MCP 客户端两种角色集成 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)。

本页介绍如何把 Langflow 用作 MCP 服务器，将你的 Flow 暴露为[工具](https://modelcontextprotocol.io/docs/concepts/tools)，供 [MCP 客户端](https://modelcontextprotocol.io/clients)在生成响应时调用。

Langflow MCP 服务器支持 **streamable HTTP** 传输，并以 **Server-Sent Events (SSE)** 作为回退。project MCP 服务器的默认配置使用 streamable HTTP，URL 路径为 `/streamable`。若只想提供 streamable HTTP，见[禁用旧版 MCP SSE 传输](#禁用旧版-mcp-sse-传输)。

关于把 Langflow 用作 MCP 客户端、在 Flow 中管理 MCP 服务器连接，见[将 Langflow 用作 MCP 客户端](/docs/mcp/mcp-client/)。

## 前置条件

- 一个 [Langflow project](/docs/concepts/flows/)，其中至少有一条 Flow 包含 [**Chat Output** 组件](https://docs.langflow.org/chat-input-and-output)。要把 Flow 用作 MCP 工具，**Chat Output** 组件是必需的。
- 若想用 MCP Inspector[测试调试 Flow](#用-mcp-inspector-测试调试-flow)，电脑上需安装任意 LTS 版本的 [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)。
- 若想[部署公开的 Langflow 服务器](https://docs.langflow.org/deployment-public-server)，需安装 [ngrok](https://ngrok.com/docs/getting-started/#1-install-ngrok) 并配置 [ngrok authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)。

## 将 Flow 作为 MCP 工具提供

创建 Langflow project 时，Langflow 会自动把该 project 加入 MCP 服务器配置，使其中的 Flow 可作为 MCP 工具使用。

如果 Langflow 服务器启用了认证（`AUTO_LOGIN=false`），project 的 MCP 服务器会自动配置 API key 认证，并生成一个专用于访问该 project Flow 的新 API key。详见 [MCP 服务器认证](#mcp-服务器认证)。

### 关闭新项目的自动 MCP 服务器配置

要禁用新 project 的自动 MCP 服务器配置，把环境变量 `LANGFLOW_ADD_PROJECTS_TO_MCP_SERVERS` 设为 `false`。更多信息见 [MCP 服务器环境变量](#mcp-服务器环境变量)。

### 选择性启用或禁用 project 的 MCP 服务器

无论是否开启自动配置，都可以选择哪些 project 对外暴露为 MCP 工具：

1. 在 [Projects](/docs/concepts/flows/) 页面点击 **MCP Server** 标签页；或在编辑 Flow 时点 **Share**，选择 **MCP Server**。

   **Flows/Tools** 区域列出当前在此 MCP 服务器上作为工具提供的 Flow。

2. 点击 **Edit Tools**，勾选要暴露为工具的 Flow；取消第一列的复选框可阻止某条 Flow 被用作工具。

3. 关闭 **MCP Server Tools** 对话框保存更改。

### 编辑 Flow 工具的名称与描述

工具名称与描述帮助 MCP 客户端判断你的 Flow 提供哪些操作、何时使用。建议为所有对外提供的工具起清晰、有描述性的名称和描述。

编辑 Langflow MCP 服务器上 Flow 工具的名称与描述：

1. 在 [Projects](/docs/concepts/flows/) 页面点击 **MCP Server** 标签页；或在编辑 Flow 时点 **Share**，选择 **MCP Server**。

2. 点击 **Edit Tools**。

3. 点击要编辑的 **Tool** 或 **Description**：

   - **Tool name**：起一个能说明该 Flow 作为 agent 工具时做什么的名字。

   - **Tool description**：完整、准确地描述 Flow 执行的具体操作。

4. 关闭 **MCP Server Tools** 对话框保存更改。

#### 工具名称与描述的重要性

MCP 客户端根据工具名称与描述来决定生成响应时使用哪些操作。

MCP 客户端把你的 Langflow project 视为一个 MCP 服务器，所有启用的 Flow 都列为它的工具，名称和描述含糊会导致 agent 选错工具或选择不一致。

例如，Flow 的默认工具名就是 Flow ID，如 `adbbf8c7-0a34-493b-90ea-5e8b42f78b66`，这对 agent 毫无信息量，看不出 Flow 的类型和用途。

配置 project 的 MCP 服务器时，务必给 Flow 起清晰的名称和描述，为 agent 提供足够上下文。可以把它们理解为函数名和代码注释：用明确的语句描述 Flow 解决的问题。

**示例：工具名称与描述的作用**

假设你基于 **Document Q&A** 模板创建一条用 LLM 聊简历的 Flow，并这样命名：

- **Tool name**：`document_qa_for_resume`

- **Tool description**：`A flow for analyzing Emily's resume.`

把 Langflow MCP 服务器接入 Cursor 后，你可以问它 `What job experience does Emily have?`。借助工具名和描述提供的上下文，agent 会决定使用 `document_qa_for_resume` 工具来回答 Emily 的简历问题，必要时会先请求授权再调用。

如果问的是别人的简历，如 `What job experience does Alex have?`，agent 能判断 `document_qa_for_resume` 与本请求无关——因为描述写明只针对 Emily 的简历——于是改用其他可用工具，或告知无法访问 Alex 的信息。例如：

```
I notice you're asking about Alex's job experience.
Based on the available tools, I can see there is a Document QA for Resume flow that's designed for analyzing resumes.
However, the description mentions it's for "Emily's resume" not Alex's. I don't have access to Alex's resume or job experience information.
```

### 配置工具执行超时

工具执行超时有三种设置途径：MCP Tools 组件的超时设置、全局环境变量、Langflow 默认回退值。实际生效的超时按以下顺序解析：

1. **组件级超时**：直接在 Flow 中 MCP Tools 组件的 advanced settings 里填 **Tool Execution Timeout (seconds)**。设为 `0` 表示不覆盖，回退到全局设置。

2. **全局超时**：环境变量 `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT`，默认 180 秒。

3. 若 `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT` 和 `LANGFLOW_MCP_SERVER_TIMEOUT` 都未配置，Langflow 默认 180 秒。

要支持超过 180 秒的工具调用：把 `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT` 设为更大的值以提升全局上限，或在特定 MCP Tools 组件上单独把 **Tool Execution Timeout (seconds)** 调大，只对该组件生效。

若 `LANGFLOW_MCP_SERVER_TIMEOUT` 的值大于 `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT`，以服务器超时为准，成为工具调用的实际上限。

## 连接客户端到你的 Langflow MCP 服务器

Langflow 提供自动安装和代码片段，帮你把 Langflow MCP 服务器部署到本地 MCP 客户端。

### 方式一：JSON 配置

JSON 方式可把 Langflow MCP 服务器接入任何本地或远程 MCP 客户端，适用于任何 [MCP 兼容客户端](https://modelcontextprotocol.io/clients)。

1. 安装任意 [MCP 兼容客户端](https://modelcontextprotocol.io/clients)。

   以下以 Cursor 为例，其他客户端流程基本相同，仅文件名等细节略有差异。

2. 在客户端的 UI 或配置文件中新增 MCP 服务器。

   例如在 Cursor 中，进入 **Cursor Settings**，选择 **MCP**，点 **Add New Global MCP Server** 打开全局 `mcp.json` 配置文件。

3. 建议：先为 MCP 服务器[配置认证](#mcp-服务器认证)。

4. 在 Langflow 的 **Projects** 页面点击 **MCP Server** 标签页。

5. 切到 **JSON** 标签，复制对应操作系统的代码片段，粘贴到客户端的 MCP 配置文件。例如：

   ```json
   {
     "mcpServers": {
       "PROJECT_NAME": {
         "command": "uvx",
         "args": [
           "mcp-proxy",
           "--transport",
           "streamablehttp",
           "http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable"
         ]
       }
     }
   }
   ```

   **MCP Server** 标签页会自动填好 `LANGFLOW_SERVER_ADDRESS` 和 `PROJECT_ID`。

   Langflow 服务器默认地址是 `http://localhost:7860`；如果用的是[公开部署的 Langflow 服务器](https://docs.langflow.org/deployment-public-server)，地址会自动带上。

   如果 Langflow 服务器需要认证，必须在配置中包含 Langflow API key 或 OAuth 设置，详见 [MCP 服务器认证](#mcp-服务器认证)。

6. 要随 MCP 服务器命令传入其他环境变量，添加一个 `env` 对象，以键值对填写。例如：

   ```json
   {
     "mcpServers": {
       "PROJECT_NAME": {
         "command": "uvx",
         "args": [
           "mcp-proxy",
           "--transport",
           "streamablehttp",
           "http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable"
         ],
         "env": {
           "KEY": "VALUE"
         }
       }
     }
   }
   ```

   :::caution
   不要把 API key 放进 `env` 对象——这些变量专供 `mcp-proxy` 进程使用。API key 应放在 `args` 里，示例见 [MCP 服务器认证](#mcp-服务器认证)。
   :::

7. 保存并关闭客户端的 MCP 配置文件。

8. 确认 Langflow MCP 服务器出现在客户端的 MCP 服务器列表中；必要时重启客户端使配置生效。

### 方式二：自动安装

:::note
自动安装只支持特定的 MCP 客户端，且要求客户端装在本机，Langflow 才能写入其配置文件。客户端不受支持、远程安装，或需要传入额外环境变量时，请用 **JSON** 方式。
:::

1. 在 Langflow 服务器所在电脑上安装 [Cursor](https://docs.cursor.com/get-started/installation)、[Claude](https://claude.ai/download) 或 [Windsurf](https://windsurf.com/download/editor)。

2. 建议：先为 MCP 服务器[配置认证](#mcp-服务器认证)。

3. 在 Langflow 的 **Projects** 页面点击 **MCP Server** 标签页。

4. 在 **Auto install** 标签里找到你的 MCP 客户端，点 **Add**。

   Langflow 会把该 project 的 MCP 服务器自动写入本地 Cursor、Claude 或 Windsurf 客户端的配置文件。例如 Cursor 会写入 `mcp.json`。

   即使所选客户端未安装，Langflow 也会尝试写入配置。装完后请在客户端的可用 MCP 服务器列表中确认。

客户端连上你的 Langflow project MCP 服务器后，Flow 就注册为工具。Cursor 根据查询决定何时调用工具，并在必要时请求权限。更多信息见所用客户端的 MCP 文档，如 [Cursor 的 MCP 文档](https://docs.cursor.com/context/model-context-protocol)。

## MCP 服务器认证

每个 Langflow project 都有独立的 MCP 服务器和独立的认证设置。

新建 project 时，Langflow 会按 Langflow 服务器的认证设置自动配置该 project 的 MCP 服务器：启用认证（`AUTO_LOGIN=false`）时自动采用 API key 认证，并生成一个用于访问该 project Flow 的新 API key。

配置入口：Langflow 的 **Projects** 页面 → **MCP Server** 标签页 → **Edit Auth**，可选认证方式：

- API key
- OAuth
- None

### API key

用 Langflow API key 认证时，project 的 **JSON** 代码片段和 **Auto install** 配置会在 `args` 数组中自动带上 `--headers` 和 `x-api-key` 参数（streamable 传输）。点 **Generate API key** 自动插入新 key，或手动把 `YOUR_API_KEY` 换成已有的 Langflow API key。

添加 API key 时，要在 `args` 里用三个独立条目：`"--headers"`、`"x-api-key"` 和你的 key 值。例如：

```json
{
  "mcpServers": {
    "PROJECT_NAME": {
      "command": "uvx",
      "args": [
        "mcp-proxy",
        "--transport",
        "streamablehttp",
        "--headers",
        "x-api-key",
        "YOUR_API_KEY",
        "http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable"
      ]
    }
  }
}
```

### OAuth

启用 OAuth 后，Langflow 会为该 project 自动启动一个 [MCP Composer](https://pypi.org/project/mcp-composer) 实例，在 MCP 客户端与服务器上的 `mcp-proxy` 之间建立安全的客户端侧代理。

OAuth 集成让 Langflow MCP 服务器能通过任何符合 OAuth 2.0 的服务认证用户和应用：用户或应用连接 MCP 服务器时被重定向到所选 OAuth 提供方完成认证，认证成功后即可把 Flow 作为 MCP 工具访问。

在 Langflow 里配置 OAuth 前，先在外部 OAuth 2.0 服务商处建好 OAuth 应用：把 Langflow 服务器注册为 OAuth client，并拿到配置所需的值。下表说明各项要求，以 [GitHub OAuth](https://github.com/settings/developers) 为例，实际请使用你自己部署的值，详见 OAuth 提供商的文档。

| 字段 | 说明 | 来源 | 示例 |
| --- | --- | --- | --- |
| **Host** | OAuth 服务器主机 | MCP Composer 默认值。 | `localhost` |
| **Port** | OAuth 服务器端口 | MCP Composer 默认值。 | `9000` |
| **Server URL** | 完整的 OAuth 服务器 URL | 由 MCP Composer 默认的 OAuth host 和 port 组合而成。 | `http://localhost:9000` |
| **Callback URL** | 你服务器上的 OAuth 回调 URL | 注册 OAuth 应用时自定义的完整 URL，必须与在 OAuth 提供商处登记的完全一致。 | `http://localhost:9000/auth/idaas/callback` |
| **Client ID** | OAuth 客户端标识 | 来自 OAuth 提供商。 | `Ov23li9vx2grVL61qjb` |
| **Client Secret** | OAuth 客户端密钥 | 来自 OAuth 提供商。 | `1234567890abcdef1234567890abcdef12345678` |
| **Authorization URL** | OAuth 授权端点 | 来自 OAuth 提供商。 | `https://github.com/login/oauth/authorize` |
| **Token URL** | 获取刷新令牌的 OAuth 端点 | 来自 OAuth 提供商。 | `https://github.com/login/oauth/access_token` |
| **MCP Scope** | MCP 操作的 scope | 自定义。Langflow 1.6 起 `user` 是唯一可用值。 | `user` |
| **Provider Scope** | OAuth 提供商 scope | 自定义。Langflow 1.6 起 `openid` 是唯一可用值。 | `openid` |

配置 OAuth 认证：

1. 认证类型选 **OAuth**。

2. 用你 OAuth 部署的实际值填写各项设置，全部必填。

   OAuth 凭据会加密后安全存入 Langflow 数据库。

3. 点 **Save**。

   MCP 服务器的 **JSON** 片段和 **Auto install** 配置会自动更新为 OAuth 设置，启用后的新连接自动使用；已有连接需手动更新，见下一步。

4. 如果此前已在 MCP 客户端装过该 Langflow MCP 服务器，启用 OAuth 后必须更新客户端配置以使用新的 OAuth 设置。更新方式取决于当初的安装方式：

   - **Auto install**：用 **JSON** 标签里更新后的片段手动改客户端配置文件，或按[自动安装](#方式二自动安装)步骤重装一次。

   - **JSON 方式**：复制 **JSON** 标签里更新后的片段，替换原有配置。

   - **新连接**：两种方式均可，OAuth 设置自动带上。

启用 OAuth 并更新客户端配置后，客户端每次向服务器认证都会弹出 OAuth 回调窗口，认证成功会返回 `Authentication complete. You may close this window.`。若客户端没有弹出 OAuth 窗口，重启客户端以获取更新后的配置。

### 无认证

:::caution
不配置认证时，MCP 服务器成为任何人都能无需凭据访问的公开端点。仅当 Langflow 运行在可信环境中才使用此选项。
:::

## 外部部署 MCP 服务器

要把 Langflow MCP 服务器部署到外部，见[部署公开的 Langflow 服务器](https://docs.langflow.org/deployment-public-server)。

## 用 MCP Inspector 测试调试 Flow

:::note
MCP Inspector 要求电脑上安装任意 LTS 版本的 Node.js。
:::

[MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) 是常用的 MCP 服务器测试调试工具，可用来监控 Flow，观察它们如何被 MCP 服务器消费。

1. 安装并启动 MCP Inspector：

   ```bash
   npx @modelcontextprotocol/inspector
   ```

   配置细节（如指定代理端口）见 [MCP Inspector GitHub 项目](https://github.com/modelcontextprotocol/inspector)。

2. 用浏览器打开 MCP Inspector UI，默认地址 `http://localhost:6274`。

3. 在 Inspector UI 中填入 Langflow project MCP 服务器的连接信息，按服务器的认证方式选择：

   - **API key**：Transport Type 选 `STDIO`，Command 填 `uvx`，Arguments 填以下参数（空格分隔），并把 `YOUR_API_KEY`、`LANGFLOW_SERVER_ADDRESS`、`PROJECT_ID` 换成你的 Langflow MCP 服务器对应的值：

     ```bash
     mcp-proxy --headers x-api-key YOUR_API_KEY http://LANGFLOW_SERVER_ADDRESS/api/v1/mcp/project/PROJECT_ID/streamable
     ```

   - **OAuth**：Transport Type 选 `STDIO`，Command 填 `uvx`，Arguments 填以下参数（空格分隔），并把 `--sse-url` 的值换成你的 OAuth 服务器 URL：

     ```bash
     mcp-composer --mode stdio --sse-url http://localhost:9000/sse --disable-composer-tools --client_auth_type oauth
     ```

   - **None**：Transport Type 选 `SSE`，URL 填 Langflow MCP 服务器的端点，例如：

     ```
     http://localhost:7860/api/v1/mcp/project/d359cbd4-6fa2-4002-9d53-fa05c645319c/streamable
     ```

4. 点 **Connect**。

   连接成功后，**Tools** 标签页会显示 project 的 Flow。在这里可以查看 Flow 如何被 MCP 注册为工具，并用自定义输入值测试工具。

5. 要退出 MCP Inspector，在启动它的终端窗口按 Control+C。

## 禁用旧版 MCP SSE 传输

设 `LANGFLOW_MCP_SSE_ENABLED=false` 可让旧版 SSE 传输及其 message 端点返回 `404`，streamable HTTP 不受影响。

## 将 MCP 服务器管理限制为超级用户

要禁止非超级用户编辑 MCP 服务器连接，设 `LANGFLOW_MCP_SERVERS_LOCKED=true`。

设为 `true` 后，非超级用户仍能使用已配置好的 MCP 服务器，但无法在 UI 或 API 中配置 MCP 服务器连接；超级用户保留完整权限。

锁定用户的 MCP 服务器配置不会关闭 Langflow 内置的、用于把 Flow 暴露为 MCP 工具的 MCP 服务器。

## MCP 服务器环境变量

以下环境变量控制 Langflow project MCP 服务器的相关行为：

| 变量 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `LANGFLOW_MCP_SERVER_ENABLED` | Boolean | `True` | 是否为每个 Langflow project 初始化 MCP 服务器。`false` 时不初始化。 |
| `LANGFLOW_MCP_SSE_ENABLED` | Boolean | `True` | 是否提供旧版 SSE 传输。`false` 时 SSE 及其 message 端点返回 `404`，streamable HTTP 不受影响。见[禁用旧版 MCP SSE 传输](#禁用旧版-mcp-sse-传输)。 |
| `LANGFLOW_MCP_SERVER_ENABLE_PROGRESS_NOTIFICATIONS` | Boolean | `False` | `true` 时 Langflow MCP 服务器发送进度通知。 |
| `LANGFLOW_SKIP_MCP_AUTO_INIT` | Boolean | `False` | `true` 时启动阶段跳过后台 MCP 服务器自动初始化。适用于离线、防火墙内或 CI 主机，避免启动时等待出站 MCP 连接。 |
| `LANGFLOW_MCP_COMPOSER_ENABLED` | Boolean | `True` | 是否启动 MCP Composer 服务。 |
| `LANGFLOW_MCP_SERVER_TIMEOUT` | Integer | `20` | MCP 连接建立与工具执行的超时（秒）。见[配置工具执行超时](#配置工具执行超时)。 |
| `LANGFLOW_MCP_TOOL_EXECUTION_TIMEOUT` | Integer | `180` | MCP 工具调用的全局超时（秒）。见[配置工具执行超时](#配置工具执行超时)。 |
| `LANGFLOW_MCP_MAX_SESSIONS_PER_SERVER` | Integer | `10` | 每个唯一服务器保留的最大 MCP session 数。 |
| `LANGFLOW_ADD_PROJECTS_TO_MCP_SERVERS` | Boolean | `True` | 是否自动把新建 project 加入用户的 MCP 服务器配置。`false` 时需手动添加到 MCP 服务器。 |
| `LANGFLOW_MCP_SERVERS_LOCKED` | Boolean | `False` | `true` 时非超级用户不能通过 UI 或 API 添加、编辑、删除 MCP 服务器连接，超级用户保留完整权限。见[将 MCP 服务器管理限制为超级用户](#将-mcp-服务器管理限制为超级用户)。 |
| `LANGFLOW_MCP_SERVER_ALLOWED_PACKAGES` | String | 未设置 | 允许 MCP `npx`/`uvx` stdio 服务器下载运行的包名白名单（逗号分隔）。单租户场景保持未设置；空值会禁止所有包运行器。 |
| `LANGFLOW_MCP_SERVER_ENV_ALLOWLIST` | String | 未设置 | 允许 MCP stdio 配置设置的环境变量名白名单（逗号分隔）。单租户场景保持未设置（生产环境预检会对未设置发出警告）；空值会禁止所有租户提供的环境变量。 |
| `LANGFLOW_MCP_SERVER_INTERPRETER_HARDENING` | Boolean | `False` | `true` 时阻止租户控制的 Python、Node.js 和 shell MCP 入口。包包装器与经过认证的内部 Langflow MCP 服务器不受影响。 |
| `LANGFLOW_MCP_SERVER_DOCKER_HARDENING` | Boolean | `False` | `true` 时对 MCP `docker` stdio 服务器应用严格的参数策略，防止租户挂载宿主文件系统或使用特权标志。 |

## 故障排查

MCP 服务器与客户端的排障建议见 [Troubleshoot Langflow: MCP issues](https://docs.langflow.org/troubleshoot#mcp)。

## 另见

- [将 Langflow 用作 MCP 客户端](/docs/mcp/mcp-client/)
- [使用 DataStax Astra DB MCP 服务器](https://docs.langflow.org/mcp-component-astra)
- [MCP 服务器环境变量](https://docs.langflow.org/environment-variables#mcp)
