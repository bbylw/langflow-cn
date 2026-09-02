---
title: 快速上手
description: 跑通第一个模板 Flow，并通过 API 从外部应用调用它。
sidebar:
  order: 3
---

这份指南带你跑通第一个模板 Flow，并通过 API 调用它。

## 前置条件

- 已安装并启动 Langflow。
- 准备好所需 provider 的凭据，例如 OpenAI API key。
- 创建你自己的 Langflow API key：在用户设置的密钥管理器里新建、命名、复制并妥善保管。
- 在命令行示例前，把凭据设为环境变量 `LANGFLOW_API_KEY`。请求里也可以用 header 或 query 传，但环境变量更安全。

## 运行 Simple Agent 模板

1. 点 **New Flow**，加载 **Simple Agent** 模板。这个预设把一个带对话端口的 **Agent**、一个计算器和一个网页内容工具连在一起。
2. 用 Agent 的 provider 选择器（或打开全局模型配置）选一个服务。
3. 填入 provider 凭据，保存，并启用你需要的模型。
4. 在 Agent 里选一个已启用的语言模型。
5. 打开 **Playground** 运行这条流程。
6. 先问一个简单的算术，比如「4 加 4 等于几」，触发计算器；再问一个时事问题，触发网页工具去抓取并总结内容。面板会展示推理过程、选用的工具与工具动作。

:::caution
每个 provider 只存一个 key，所以这个 key 要能覆盖你选的所有文本与嵌入模型，且有可用额度。
:::

## 从外部应用调用你的 Flow

Langflow 既是编辑器也是可执行服务，可以用 Python、JavaScript 或 HTTP 调用一条 Flow。本地测试用开发服务器，生产环境请用稳定部署。默认本地地址是 `localhost:7860`。

1. 编辑 Flow 时打开 **Share** → **API access**。
2. 复制生成的代码片段，它已包含服务器、Flow 标识与 API key 的占位符。换到你自己的服务器或 Flow 前，替换这些占位符。示例路径形如 `/api/v1/run/FLOW_ID`。
3. 一个基础对话请求体大致如下：

   ```json title="请求体"
   {
     "output_type": "chat",
     "input_type": "chat",
     "input_value": "hello world!"
   }
   ```

4. 把凭据作为 `x-api-key` 传进去。成功响应是 JSON，包含 session、message、component、耗时与相关元数据。

:::tip
用 tweaks 临时覆盖：tweaks 是请求体里附加的字段，只对本次运行生效，不会改动已保存的 Flow。先在组件的 Parameters 里把要暴露的字段标记为 API，再用刷新后的片段调用。
:::

## 下一步

- 继续了解[构建 Flows](/docs/concepts/flows/) 与 [Playground](/docs/concepts/playground/)。
- 动手做一个完整应用：[教程：RAG 聊天机器人](/docs/get-started/tutorial-rag/)。
