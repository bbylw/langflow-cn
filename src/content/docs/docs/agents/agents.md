---
title: 使用 Langflow Agent
description: 用 Agent 组件搭建 agent Flow：配置模型 provider、指令、工具与结构化输出。
sidebar:
  order: 1
---

Langflow 的 [**Agent** 组件](https://docs.langflow.org/components-agents)是构建 agent Flow 的核心。它把创建 agent 所需的一切都集齐了：多家 LLM provider、tool calling（工具调用）与自定义指令，配置开箱即用，让你专注于应用本身。

## 工作原理

Agent 在 LLM 的基础上引入了 *tool*（工具）——能提供额外上下文、支持自主执行任务的函数，因此比单独的 LLM 更专用、也更强大。

LLM 对一般问题只能给出静态的回答，而 Agent 可以借助集成的上下文和工具给出更相关的回复，甚至直接执行操作。例如，你可以做一个能访问公司文档、代码仓库等资源的 agent，帮团队处理那些需要了解你的产品、客户和代码的任务。

Agent 把 LLM 当作推理引擎：处理输入，决定采取哪些动作来回应请求，然后生成回复。回复可以是常规的文本，也可能是一次操作，比如编辑文件、运行脚本或调用外部 API。

在 agent 场景中，工具是 agent 可以运行的函数，用来完成任务或访问外部资源。函数会被包装成一个 agent 能识别的 `Tool` 对象。Agent 通过工具注册感知工具——通常在初始化时拿到一份可用工具列表。`Tool` 的描述告诉 agent 它能做什么，agent 据此判断该工具是否适合当前请求。

## 在 Flow 中使用 Agent 组件

以下步骤从空白 Flow 创建一条 agent 流程。想用现成示例，可以用 **Simple Agent** 模板，或参考[快速上手](/docs/get-started/quickstart/)。

1. 点 **New Flow** → **Blank Flow**。
2. 向 Flow 添加一个 **Agent** 组件。
3. 配置全局模型 provider：
   1. 点你的头像图标 → **Settings** → **Model Providers**，打开 **Model Providers** 面板。
   2. 在面板中选择一个 provider。
   3. 在 **API Key** 里填入该 provider 的 API key。部分 provider 还需要额外的配置字段，详见其文档。

      key 必须有权限调用你要用的模型，账户也要有足够额度。每个 provider 只能存一个 key，务必确保它能覆盖 *所有* 要在 Langflow 里使用的模型。
   4. 点 **Save**。
   5. 启用要用的具体模型。可用模型取决于 provider 与 key 的权限：生成文本的模型列在 **Language Models** 下，生成 embeddings 的列在 **Embedding Models** 下。

      在全局模型配置中启用后，Flow 里任何模型驱动的组件都可以使用该模型。
4. 在 **Language Model** 下拉框里选择要用的模型。列表里没有的话，先确认它已在模型配置中启用。更多信息见 [Agent 组件参数](#agent-组件参数)。
5. 添加 **Chat Input** 和 **Chat Output** 组件，并连接到 **Agent** 组件。

此时一条基础的 LLM 聊天 Flow 已经可以在 **Playground** 里测试了。但它只会跟 LLM 干聊——要让它真正 agentic，还得加些工具，见后续步骤。

6. 向 Flow 添加 **Web Search**、**URL** 和 **Calculator** 组件。
7. 为这三个组件启用 **Tool Mode**（工具模式），并把工具连到 agent：

   1. 点开 **Web Search** 组件的[头部菜单](/docs/concepts/components/)，启用 **Tool Mode**。
   2. 对 **URL** 和 **Calculator** 重复同样操作。
   3. 把每个工具组件的 **Toolset** 端口连到 **Agent** 组件的 **Tools** 端口。

   **Tool Mode** 通过改造组件的输入把它变成工具：启用后，组件可以接受 **Agent** 的调用请求，把自身的动作作为工具供 agent 使用。此时组件会出现 **Toolset** 端口，连到 **Agent** 的 **Tools** 端口即可授权使用。详见[为 Agent 配置工具](/docs/agents/agent-tools/)。

8. 打开 **Playground**，问 agent：`What tools are you using to answer my questions?`

   agent 应该列出已连接的工具，也可能包含内置工具：

   ```
   I use a combination of my built-in knowledge (up to June 2024) and a set of external tools to answer your questions. Here are the main types of tools I can use:
   Web Search & Content Fetching: I can fetch and summarize content from web pages, including crawling links recursively.
   News Search: I can search for recent news articles using Google News via RSS feeds.
   Calculator: I can perform arithmetic calculations and evaluate mathematical expressions.
   Date & Time: I can provide the current date and time in various time zones.
   These tools help me provide up-to-date information, perform calculations, and retrieve specific data from the internet when needed. If you have a specific question, let me know, and I'll use the most appropriate tool(s) to help!
   ```

9. 想测试某个具体工具，就问一个会用到它的问题，比如 `Summarize today's tech news`。

   为方便调试，**Playground** 会展示 agent 的工具调用、传入的输入，以及 agent 在生成总结前拿到的原始输出。在这个例子里，agent 应调用 **Web Search** 组件并把 **Search Mode** 设为 **News**。

至此，一条使用通用工具的基础 agent Flow 就完成了。可以继续接入其他工具组件，或[把 Langflow 作为 MCP client 使用](https://docs.langflow.org/mcp-client)来支持更复杂的专用任务。多 agent 示例见[将 Agent 用作工具](/docs/agents/agent-tools/)。

## Agent 组件参数

你可以配置 **Agent** 组件使用的 provider 与模型、自定义指令和工具。部分参数在可视化编辑器里默认隐藏；选中组件后，可以在弹出的[组件检查面板](/docs/concepts/components/)里修改全部参数。

### Provider 与模型

用 **Language Model**（`agent_llm`）设置选择 agent 要用的 LLM。

全局模型 provider 的配置方法：

1. 点头像图标 → **Settings** → **Model Providers**，打开 **Model Providers** 面板。
2. 在面板中选择一个 provider。
3. 在 **API Key** 里填入该 provider 的 API key。部分 provider 还需要额外的配置字段，详见其文档。

   key 必须有权限调用你要用的模型，账户也要有足够额度。每个 provider 只能存一个 key，务必确保它能覆盖 *所有* 要用的模型。
4. 点 **Save**。
5. 启用要用的具体模型。可用模型取决于 provider 与 key 的权限：生成文本的模型列在 **Language Models** 下，生成 embeddings 的列在 **Embedding Models** 下。

在全局模型配置中启用后，在 **Agent** 组件的 **Language Model** 字段里选中它即可使用。该字段列出所有已全局配置的语言模型；某 provider 如果没有可用的语言模型就不会出现，比如只提供 embedding 模型的 provider。

要接入其他 provider 或模型，有两种方式：

- 把任意[语言模型组件](https://docs.langflow.org/components-models)连到 **Agent** 组件的 **Language Model** 端口，使用全局列表之外的模型。
- 在 **Models** 面板里配置更多 provider，再从 **Language Model** 下拉框选择。

如果 Flow 需要生成 embeddings，请使用 [embedding 模型组件](https://docs.langflow.org/components-embedding-models)。

### Agent 指令与输入

在 **Agent Instructions**（`system_prompt`）字段里，可以写入希望 **Agent** 组件在每次对话中都遵循的自定义指令。

这些指令叠加在 **Input**（`input_value`）之上。Input 可以直接输入，也可以由其他组件提供，比如 **Chat Input** 组件。

### 工具

Agent 配上合适的工具才能发挥最大价值。

**Agent** 组件可以把任何 Langflow 组件当作工具，包括其他 agent 和 MCP server。接入方法：先在目标组件上启用 **Tool Mode**，再把它连到 **Agent** 组件的 **Tools** 端口。详见[为 Agent 配置工具](/docs/agents/agent-tools/)。

:::tip
要让 agent 使用 MCP server 上的工具，请用 [**MCP Tools** 组件](https://docs.langflow.org/mcp-tools)。
:::

### Agent 记忆

Langflow agent 自带聊天记忆，默认开启：agent 可以检索并引用之前对话的消息，为每个 chat session ID 维护一个滚动上下文窗口。

聊天记忆按 [session ID（`session_id`）](https://docs.langflow.org/session-id)分组。如果同一条 Flow 要服务不同的用户或应用，建议使用自定义 session ID 来隔离各自的记忆。

默认情况下，**Agent** 组件使用 Langflow 安装自带的存储，并且只取回有限条数的聊天消息，可用 **Number of Chat History Messages** 参数调整。

默认聊天记忆不依赖 **Message History** 组件；但要用 Mem0 之类的外部聊天记忆就必须加它。此外，**Message History** 还提供更多排序、过滤和条数限制选项——不过这些能力大多已在 **Agent** 组件里内置并带默认值。

每次 agent 运行时，Langflow 会向 Playground 发送事件：输入消息、每次工具调用及其输入与结果、陆续到达的流式 token，以及最终答案；运行结束后把完整消息写入聊天历史。使用 **Structured Response** 输出时，则不发送事件、也不写入聊天历史。

更多信息见[存储聊天记忆](https://docs.langflow.org/memory#store-chat-memory)与 [**Message History** 组件](https://docs.langflow.org/message-history)。

### 其他参数

**Agent** 组件的可用参数会随所选 provider 与模型变化，包括对额外模式、参数或功能的支持，比如聊天记忆和 temperature。例如：

- **Current Date**（`add_current_date_tool`）：开启（`true`）后，为 agent 添加一个获取当前日期的工具。
- **Handle Parse Errors**（`handle_parsing_errors`）：开启（`true`）后，允许 agent 在解析用户输入时自行修复笔误等错误。
- **Verbose**（`verbose`）：开启（`true`）后，记录详细的日志输出，便于调试与分析。

部分参数在可视化编辑器里默认隐藏；选中组件后，可以在弹出的[组件检查面板](/docs/concepts/components/)里修改全部参数。

## Agent 组件输出

**Agent** 组件有两个输出：

- **Response**（`response`）：以 [Message](/docs/concepts/data-types/) 数据返回 agent 的回复，通常连接到 **Chat Output** 组件。
- **Structured Response**（`structured_response`）：按你定义的 **Output Schema** 把回复整理成结构化的 [Data](/docs/concepts/data-types/)。

配置 **Structured Response** 输出的方法：

1. 在 **Agent** 组件上，点输出端口旁的输出标签，选择 **Structured Response**。
2. 选中 **Agent** 组件打开[组件检查面板](/docs/concepts/components/)，然后点 **Open table**。
3. 点 **+** 为要提取的每个字段加一行，填入 **Name**、**Type**，可选填 **Description** 并打开 **As List** 开关。
4. 把 **Structured Response** 端口连到接受 [JSON](/docs/concepts/data-types/) 输入的下游组件，比如 **Parser** 或 [Data Operations 组件](https://docs.langflow.org/operations)。

**Agent** 组件会用所连的 LLM 提取结构化数据，提取行为由 **Output Format Instructions** 字段控制——修改其中的 prompt 可以改变提取行为，但不会改动 **Output Schema** 里定义的 schema。

两个输出可以同时连接，但各自会触发一次独立的 LLM 调用；如果只需要结构化数据，只连 **Structured Response** 即可。

## 另见

- [**Agent** 与 **MCP Tools** 组件](https://docs.langflow.org/components-agents)
- [为 Agent 配置工具](/docs/agents/agent-tools/)
