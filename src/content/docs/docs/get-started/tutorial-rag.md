---
title: 教程：做一个向量 RAG 聊天机器人
description: 在 Langflow 里搭建检索增强生成（RAG）聊天机器人，把数据以向量存库并基于它回答问题。
sidebar:
  order: 4
---

这个教程带你在 Langflow 里搭一个检索增强生成（RAG）聊天机器人：把数据以向量存进数据库，再基于这些数据回答问题。

## 前置条件

- 已安装并启动 Langflow。
- 生成 Langflow API key。
- 拿到 OpenAI API key。
- 理解向量检索、向量数据库与 RAG 的基本概念。

## 创建 Vector RAG Flow

点 **New Flow**，选择 **Vector Store RAG** 模板。模板包含两条子流程：

- **Load Data Flow**：读取本地文件、切分成块、对块做嵌入并索引进向量数据库。只在需要加载新数据时运行。
- **Retriever Flow**：接收聊天输入、做嵌入、检索相似的历史块，再用 LLM 生成回答。

把你的 OpenAI API key 填进两个 **OpenAI Embeddings** 组件。（可选）把默认的 Astra DB 向量库换成 Chroma DB 或其它。

两条子流程大致包含的组件：

| Load Data Flow | Retriever Flow |
| --- | --- |
| Read File、Split Text、Embedding Model、Vector Store、Chat Output | Chat Input、Embedding Model、Vector Store、Parser、Prompt、Language Model、Chat Output |

## 加载数据并生成嵌入

有两种方式：可视化编辑器适合「同一个用户既搭建又加载」；API 适合多用户或程序化场景。

**可视化编辑器**

1. 点 **Read File** 组件，选择本地文件并确认。
2. 点向量库组件，选择 **Run component**，处理依赖并写入数据。

**API（Node 18+）**

先 `POST /v2/files/` 上传文件（返回一个 path），再对 `POST /v1/run/{FLOW_ID}` 带上指向该 path 的 tweaks。服务端会完成切分、嵌入与存储。

```js title="上传并运行"
import fs from 'fs/promises';

const fileBuffer = await fs.readFile('FILE_NAME');
const data = new FormData();
data.append('file', new Blob([fileBuffer]), 'FILE_NAME');
const headers = { 'x-api-key': 'LANGFLOW_API_KEY' };

const uploadRes = await fetch('LANGFLOW_SERVER/api/v2/files/', {
  method: 'POST',
  headers,
  body: data,
});
const { path: uploadedPath } = await uploadRes.json();

const payload = {
  input_value: 'Analyze this file',
  output_type: 'chat',
  input_type: 'text',
  tweaks: { FILE_COMPONENT_NAME: { path: uploadedPath } },
};
const runRes = await fetch('LANGFLOW_SERVER/api/v1/run/FLOW_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': 'LANGFLOW_API_KEY' },
  body: JSON.stringify(payload),
});
```

## 在 JavaScript 应用里聊天

需要的值：`LANGFLOW_SERVER_ADDRESS`（默认 `127.0.0.1:7860`）、`FLOW_ID`（UUID 或自定义端点名）、`LANGFLOW_API_KEY`。用官方 JS 客户端：

```js title="聊天脚本"
const { LangflowClient } = require('@datastax/langflow-client');
const client = new LangflowClient({ baseUrl: SERVER, apiKey: API_KEY });

async function sendMessage(message) {
  const response = await client.flow(FLOW_ID).run(message, { session_id: 'user_1' });
  return response.chatOutputText() || 'No response';
}
```

脚本用 `chat` 输入/输出类型在多轮之间保持上下文，`chatOutputText()` 帮你从嵌套 JSON 里取出回复文本。

## 下一步

- 了解[发布与集成](/docs/concepts/publish/)，把这条 Flow 变成 API、站点嵌入或 MCP 工具。
- 复习[数据类型](/docs/concepts/data-types/)，理解组件之间传递的向量与消息。
