---
title: 构建 Flows
description: Flow 是什么、如何创建、运行、在项目里管理，以及它的执行图与存储。
sidebar:
  order: 2
---

Flow 描述一个应用过程：接收输入、处理输入、返回输出。它由组件拼装而成，每个组件是一个配置好的步骤。Langflow 里的 Flow 是**完全可序列化**的，因此能存到本地文件系统再读回。

## 创建 Flow

在 Projects 里，有四种创建方式：

- **空白**：选一个 project → New Flow → Blank Flow。
- **模板**：选一个 project → New Flow → 挑一个预设。
- **复制**：找到目标 Flow → More → Duplicate。
- **导入**：用导入/导出功能。

模板是现成的 Flow，可作为新作品的起点。有的很小，有的很复杂并包含嵌套 Flow。例如 **Basic Prompting** 把聊天文本加预设指令发给一个 LLM；**Vector Store RAG** 含两条嵌套 Flow，共同组成一个 RAG 聊天机器人。

## 添加组件与运行

把组件从 Core components 或 Bundles 拖进工作区，配置参数并连接。连接叫边（edge）或端口（port），承载带类型的数据。原型就绪后在 Playground 里测试；更完整的应用则通过 Langflow API 调用。

### Flow 执行图

运行一条 Flow 时，Langflow 会依据组件与连线构建一个**有向无环图（DAG）**并排序执行。构图阶段调用每个组件的 build 做校验与准备，之后按依赖顺序逐个运行，把输出传给依赖它的下游组件。

## 在项目中管理 Flow

Projects 是启动后的落地页，用来组织 Flow 与项目的 MCP 服务器。project 是归类相关 Flow 的文件夹，默认是 Starter Project。

- **编辑详情**：More → Edit details，改名称与描述后保存。
- **版本快照**：在编辑器侧栏的 Version History 里 Save 当前状态、查看只读版本、Restore 回滚。自动保存只保持草稿最新，不会新增版本条目；已保存的版本才是明确的回滚点。
- **锁定**：Edit details 里开启 Lock Flow 可防止修改。
- **移动**：把 Flow 从列表拖到目标 project 名上。
- **删除**：More → Delete。

## 存储与日志

默认情况下，Flow 与执行记录存放在 Langflow 的数据库里。执行与应用日志存放在配置文件夹中。

## 另见

- [组件](/docs/concepts/components/)
- [发布与集成](/docs/concepts/publish/)
