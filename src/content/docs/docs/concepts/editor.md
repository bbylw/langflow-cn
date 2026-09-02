---
title: 可视化编辑器
description: Langflow 的工作区、交互手势、Playground 与 Share 菜单概览。
sidebar:
  order: 1
---

Langflow 提供一个可视化工作区，用来构建、评估和分发应用流程（Flow）。每条 Flow 由代表各个步骤的组件拼装而成。你可以连接 Prompt、语言模型、数据源、智能体、MCP 服务器等各类集成，而无需写大量代码。

:::tip
想花几分钟跑通一条 Flow，看[快速上手](/docs/get-started/quickstart/)。
:::

## 工作区

工作区是放置、调整和连接组件的主区域，也是进入 Playground、Share 菜单和 Logs 的入口。常用交互：

- **平移**：选中画布空白处拖动。
- **放置组件**：选中组件即可移动；改变连接关系要调整边或端口。可在 Help 里开启智能对齐参考线。编辑前 Flow 需处于解锁状态。
- **缩放**：滚轮，或在 Canvas controls 里选 Zoom In / Zoom Out / Zoom To 100% / Zoom To Fit。
- **注释**：用 Add Note 在画布上添加便签。
- **快捷键**：打开 Help → Shortcuts。

## Playground

含 Chat Input 的 Flow 可以在这里运行并对话，你可以查看输入输出、调整模型记忆来微调回复。若含 Agent，面板会揭示工具调用与输出，帮助监控决策。详见 [Playground](/docs/concepts/playground/)。

## Share 菜单

分享菜单支持这些集成路径：

- **API access**：Python、JavaScript、curl 的现成代码片段。
- **Export**：把流程作为 JSON 存到本地。
- **MCP Server**：把流程作为工具暴露给兼容 MCP 的客户端。
- **Embed into site**：插入到 HTML、React 或 Angular 页面。
- **Shareable Playground**：让别人用你的 Playground，仅供试用、非生产，桌面版不可用。

## 另见

- [文件管理](/docs/concepts/file-management/)
- [发布与集成](/docs/concepts/publish/)
