---
title: 安装 Langflow
description: 用桌面版、Docker 或 Python 包（uv）安装并启动 Langflow。
sidebar:
  order: 2
---

Langflow 提供多种安装方式，按你的场景选一种即可。

## 桌面版（推荐，零配置）

Langflow Desktop 是独立应用，帮你省去依赖管理和升级的麻烦。注意桌面版有少数功能不可用，例如 Shareable Playground 与 Voice Mode。

**macOS（需 macOS 13 及以上）**

1. 打开 [Langflow Desktop 页面](https://www.langflow.org/desktop)。
2. 点击 **Download Langflow**，填写联系信息后下载。
3. 挂载并安装应用。
4. 打开应用，按[快速上手](/docs/get-started/quickstart/)创建第一个 Flow。

**Windows**

1. 打开 [Langflow Desktop 页面](https://www.langflow.org/desktop)。
2. 点击 **Download Langflow**，填写联系信息后下载。
3. 在文件资源管理器进入「下载」目录。
4. 双击 `.msi` 文件，按安装向导完成。
5. 打开应用，按[快速上手](/docs/get-started/quickstart/)创建第一个 Flow。

:::caution
Windows 安装可能需要 C++ 编译器。若遇到「C++ Build Tools Required!」错误，按屏幕提示安装 Microsoft C++ Build Tools，或安装 Microsoft Visual Studio。
:::

## Docker

官方镜像让你在隔离容器里运行 Langflow。

1. 安装并启动 Docker。
2. 拉取并运行最新镜像：

   ```bash title="启动 Langflow 容器"
   docker run -p 7860:7860 \
     -e LANGFLOW_AUTO_LOGIN=false \
     -e LANGFLOW_SUPERUSER_PASSWORD=SUPERUSER_PASSWORD \
     langflowai/langflow:latest
   ```

   官方镜像默认 `LANGFLOW_AUTO_LOGIN=false`。请把 `SUPERUSER_PASSWORD` 换成一个强密码。

3. 浏览器打开 `http://localhost:7860/` 进入 Langflow。
4. 按[快速上手](/docs/get-started/quickstart/)创建第一个 Flow。

## Python 包（uv）

**前置条件**

- Python 3.10 至 3.14
- [uv](https://docs.astral.sh/uv/)（包与环境管理器）
- 最低硬件：双核 CPU、2 GB 内存；推荐多核 CPU、至少 4 GB 内存
- 浏览器：推荐 Chrome，非必须

**第一步：创建虚拟环境**

Linux / macOS：

```bash
uv venv langflow-env
source langflow-env/bin/activate
```

Windows：

```powershell
uv venv langflow-env
langflow-env\Scripts\activate
```

退出环境用 `deactivate`。

**第二步：安装 Langflow**

```bash
uv pip install langflow
```

这会装上可运行的应用以及精选的各家 provider 扩展。若只要 UI 与 API、不需要 provider 扩展，可装精简包 `langflow-base`。两个包都通过 `langflow` 命令运行。

**第三步：启动并验证**

```bash
uv run langflow run
```

首次启动可能需要几分钟。浏览器打开 `http://127.0.0.1:7860` 确认本地实例已运行。

**版本管理**

```bash
uv pip install langflow -U                 # 升级到最新（先备份数据）
uv pip install langflow==1.4.22            # 安装指定版本
uv pip install langflow --force-reinstall  # 连同依赖强制重装
```

## 下一步

- [快速上手](/docs/get-started/quickstart/)：几分钟构建并运行第一个 Flow。
- [构建 Flows](/docs/concepts/flows/)：了解流程的构造方式。
