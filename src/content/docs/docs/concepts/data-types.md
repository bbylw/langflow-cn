---
title: 数据类型
description: Langflow 端口在组件之间传递的数据类型：JSON、Table、Message、Embeddings、Tool 等。
sidebar:
  order: 5
---

端口决定了每个节点能进出什么信息。连线要匹配兼容的端口类型，颜色会给出提示；不匹配时用 Type Convert 节点桥接。

| 类型 | 主要用途 |
| --- | --- |
| JSON | 键值对象 |
| Table | 表格行列 |
| Embeddings | 向量数据 |
| LanguageModel | LLM 对象 |
| Memory | 聊天记忆连接 |
| Message | 聊天文本对象 |
| Tool | 智能体工具 |
| 灰 | 多种类型 |

## JSON

由 Data 更名。存键值数据与一个选定的主字符串字段，适合档案、设置、类 API 载荷。默认主字段是 `text`。它是经过校验的对象，不是普通字典。

```text
primary = "text"
record = {"primary": "hello", "name": "A", "age": 1}
```

## Table

由 DataFrame 更名。表示行列，兼容 pandas，可接受 JSON 列表、字典或 DataFrame，提供 `to_data_list()`、`add_row()`、`to_lc_documents()`、`to_message()` 等方法。

## Message

在 JSON 基础上扩展出对话常用字段：`text`、`sender`（User 或 Language Model）、`sender_name`、`session_id`、`flow_id`、`timestamp`、`files`、`content_blocks`、`category`（message / error / warning / info）。输入/输出节点可以从更简单的输入构建完整消息。

## Embeddings / LanguageModel / Tool

- **Embeddings**：承载向量数据，配合向量库与嵌入模型使用，底层来自 LangChain。
- **LanguageModel**：代表一个 LangChain 聊天模型实例，常是 provider 专属类，如 `ChatOpenAI`、`ChatAnthropic`。
- **Tool**：可调用能力，功能上是 LangChain 的 `StructuredTool`。一个 Agent 端口可接多个工具。

## 查看数据类型

用 **Inspect output** 查看节点结果，帮助调试畸形或被转换的数据。例如把 Chat Input 连到 Type Convert，输入示例文本，运行后切换转换器的输出，即可分别查看 Message、JSON、Table 形态。

## 另见

- [组件](/docs/concepts/components/)
- [Playground](/docs/concepts/playground/)
