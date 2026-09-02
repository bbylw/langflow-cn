<!-- markdownlint-disable MD030 -->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/langflow-ai/langflow/main/docs/static/img/langflow-logo-color-blue-bg.svg">
  <img src="https://raw.githubusercontent.com/langflow-ai/langflow/main/docs/static/img/langflow-logo-color-black-solid.svg" alt="Langflow logo">
</picture>

[![Release Notes](https://img.shields.io/github/release/langflow-ai/langflow?style=flat-square)](https://github.com/langflow-ai/langflow/releases)
[![PyPI - License](https://img.shields.io/badge/license-MIT-orange)](https://opensource.org/licenses/MIT)
[![PyPI - Downloads](https://img.shields.io/pypi/dm/langflow?style=flat-square)](https://pypistats.org/packages/langflow)
[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/langflow-ai.svg?style=social&label=Follow%20%40Langflow)](https://twitter.com/langflow_ai)
[![YouTube Channel](https://img.shields.io/youtube/channel/subscribers/UCn2bInQrjdDYKEEmbpwblLQ?label=Subscribe)](https://www.youtube.com/@Langflow)
[![Discord Server](https://img.shields.io/discord/1116803230643527710?logo=discord&style=social&label=Join)](https://discord.gg/EqksyE2EX9)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/langflow-ai/langflow)

[Langflow](https://langflow.org) 是一个强大的平台，用于构建和部署 AI 驱动的智能体与工作流。它为开发者同时提供可视化创作体验，以及内置的 API 与 MCP 服务——每条工作流都能变成工具，集成到任何框架或技术栈构建的应用中。Langflow 开箱即用，支持所有主流大模型、向量数据库，以及不断增长的 AI 工具库。

## ✨ 核心特性

- **可视化构建界面**，快速上手、快速迭代。
- **源码级访问**，用 Python 自定义任意组件。
- **交互式 Playground**，单步控制，即时测试、打磨你的流程。
- **多智能体编排**，支持对话管理与检索。
- **发布为 API**，或导出为 JSON 用于 Python 应用。
- **发布为 MCP 服务器**，把流程变成 MCP 客户端可用的工具。
- **可观测性**，集成 LangSmith、LangFuse 等。
- **企业就绪**的安全性与可扩展性。

## 🖥️ Langflow 桌面版

Langflow 桌面版是最简单的入门方式。全部依赖内置，无需管理 Python 环境或手动安装包。
支持 Windows 与 macOS。

[📥 下载 Langflow 桌面版](https://www.langflow.org/desktop)

## ⚡️ 快速上手

### 本地安装（推荐）

需要 Python 3.10–3.14 与 [uv](https://docs.astral.sh/uv/getting-started/installation/)（推荐的包管理器）。

#### 安装

在全新目录运行：
```shell
uv pip install langflow -U
```

这会安装最新版 Langflow。更多信息见[安装并运行 Langflow OSS Python 包](https://docs.langflow.org/get-started-installation#install-and-run-the-langflow-oss-python-package)。

#### 运行

启动 Langflow：
```shell
uv run langflow run
```

Langflow 运行在 http://127.0.0.1:7860。

就是这样！可以开始构建了！🎉

## 📦 其他安装方式

### 从源码运行

如果你克隆了本仓库并想参与贡献，在仓库根目录运行：
```shell
make run_cli
```
更多信息见 [DEVELOPMENT.md](https://github.com/langflow-ai/langflow/blob/main/DEVELOPMENT.md)。

### Docker

以默认配置启动 Langflow 容器：
```shell
docker run -p 7860:7860 langflowai/langflow:latest
```

Langflow 运行在 http://localhost:7860/。
配置选项见 [Docker 部署指南](https://docs.langflow.org/deployment-docker)。

## 🛡️ 安全

安全相关信息见我们的[安全政策](https://github.com/langflow-ai/langflow/blob/main/SECURITY.md)。

## 🚀 部署

Langflow 完全开源，可以部署到所有主流云平台。部署方法见 [Langflow 部署指南](https://docs.langflow.org/deployment-overview)。

## ⭐ 保持更新

在 GitHub 上 Star Langflow，第一时间获取新版本通知。

![Star Langflow](https://github.com/user-attachments/assets/03168b17-a11d-4b2a-b0f7-c1cce69e5a2c)

## 👋 参与贡献

我们欢迎所有水平的开发者参与贡献。如果你想贡献，请查看[贡献指南](https://github.com/langflow-ai/langflow/blob/main/CONTRIBUTING.md)，帮助让 Langflow 触达更多人。

---

[![Star History Chart](https://api.star-history.com/svg?repos=langflow-ai/langflow&type=Timeline)](https://star-history.com/#langflow-ai/langflow&Date)

## ❤️ 贡献者

[![langflow contributors](https://contrib.rocks/image?repo=langflow-ai/langflow)](https://github.com/langflow-ai/langflow/graphs/contributors)
