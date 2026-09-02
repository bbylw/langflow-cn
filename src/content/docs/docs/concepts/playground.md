---
title: Playground
description: 在 Playground 里实时运行 Flow、查看 Agent 逻辑、管理记忆与 session。
sidebar:
  order: 4
---

Playground 是一个动态界面，用来实时检验基于模型的工作流。你可以变换输入、查看记忆、观察行为，边调边改。

## 运行与观察

打开工作流并激活面板。若含 Chat Input，就能发文本或语音开始对话；若无输入框，确认输入组件已（直接或经其它节点）连到模型或 Agent 端口。完整的对话支持需要 Chat Input、一个 Language Model 或 Agent、以及 Chat Output。

- **查看 Agent 逻辑**：含 Agent 时，面板会列出工具与工具结果，展示助手如何选择与调用外部函数。
- **Human-in-the-Loop**：当运行因 Human Input 节点或 Agent 暂停等待人工批准时，选择接受或拒绝以从暂停点继续。
- **查看聊天历史**：侧栏可选择已存对话，展开日志看时间戳、内容与发送者。
- **修改记忆**：可编辑或删除单条已记录条目，也可删除整段对话。这些改动会影响后续回答，因为它们改的是作为默认存储的内部消息表。

## 自定义 session ID

对话以唯一的 `session_id` 归组。默认值是 flow ID，会把一条流程的所有消息塞进同一大段对话。自定义标识能区隔并行用户、跨运行保持上下文、在工作流间传递状态、区分调试活动。生产环境优先用「已验证用户标识」或生成的 UUID，而不是固定值。

```bash title="用 curl 指定 session"
curl -X POST "http://localhost:7860/api/v1/run/$FLOW_ID" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $LANGFLOW_API_KEY" \
  -d '{
    "session_id": "CUSTOM_SESSION_ID",
    "input_value": "message",
    "input_type": "chat",
    "output_type": "chat"
  }'
```

## 分享 Playground

Shareable Playground 的地址形如 `/public_flow/$FLOW_ID`，仅供试用，不适合把流程嵌进产品，桌面版没有此选项。开启后，别人无需安装、无需密钥就能测你某条流程的对话面板。

:::note
默认情况下，用户自定义组件无法从公开 URL 运行，因为公开执行缺少认证、且用的是服务器已安装的组件。把这些组件装到服务器路径上，才能让这类流程公开运行。
:::

## 另见

- [发布与集成](/docs/concepts/publish/)
- [数据类型](/docs/concepts/data-types/)
