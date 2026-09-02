---
title: Langflow CLI
description: Langflow 命令行界面参考：调用方式与优先级规则，以及各命令的全部选项。
sidebar:
  order: 1
---

Langflow 命令行界面（CLI）是管理和运行 Langflow 服务器的主要接口。

CLI 在[安装 Langflow 包](https://docs.langflow.org/get-started-installation)时自动安装，Langflow Desktop 不包含 CLI。

## 如何使用 CLI

根据安装方式和运行环境，CLI 有多种调用方式。

推荐在安装了 Langflow 的虚拟环境中用 `uv run` 运行。例如，在默认端口启动 Langflow：

```bash
uv run langflow run
```

如果 Langflow 已全局安装或加入了 PATH，可以直接用 `langflow` 命令：

```bash
langflow run
```

## 优先级

CLI 选项的优先级高于终端或主 `.env` 文件中设置的[环境变量](https://docs.langflow.org/environment-variables)。

例如，环境变量定义为 `LANGFLOW_PORT=7860` 时，用 `--port 7880` 运行 CLI，Langflow 会使用端口 `7880`，因为 CLI 选项覆盖环境变量。

布尔环境变量同理。例如 `.env` 文件中设置了 `LANGFLOW_REMOVE_API_KEYS=True`，运行时可以用 `--no-remove-api-keys` 把它改为 `False`。

## Langflow CLI 选项

所有 Langflow CLI 命令都支持用选项修改命令行为或设置环境变量。

选项赋值可用以下任一写法：

- `--option value`
- `--option=value`

含空格的值必须加引号：

- `--option 'Value with Spaces'`
- `--option="Value with Spaces"`

### 布尔选项

布尔选项用于开启和关闭设置，有 true（开启）和 false（关闭）两种形式：

- 开启（true）：`--option`
- 关闭（false）：`--no-option`

下面以 `REMOVE_API_KEYS` 为例对比两种形式。

**True**

`--remove-api-keys` 等价于在 `.env` 中设置 `LANGFLOW_REMOVE_API_KEYS=True`：

```bash
uv run langflow run --remove-api-keys
```

**False**

`--no-remove-api-keys` 等价于 `.env` 中的 `LANGFLOW_REMOVE_API_KEYS=False`：

```bash
uv run langflow run --no-remove-api-keys
```

后文的命令参考中，布尔选项的默认值会同时给出 CLI 标志和等价的布尔值，例如 "`--option` (true)"、"`--no-option` (false)"。

### 通用选项

以下选项适用于所有 Langflow CLI 命令：

- `--version`、`-v`：显示版本号后退出。
- `--install-completion`：为当前 shell 安装自动补全。
- `--show-completion`：显示自动补全配置文件的位置（如已安装）。
- `--help`：打印命令用法、选项和参数说明。

## CLI 命令

以下小节介绍各个 CLI 命令，以及每个命令除[通用选项](#通用选项)外可用的其他选项。

### langflow

不带任何参数运行 CLI，会打印可用的选项和命令列表。

**uv（推荐）**

```bash
uv run langflow
```

**直接运行**

```bash
langflow
```

### langflow api-key

创建 Langflow API key。

必须以 superuser 身份才能用 CLI 创建 API key。详见 [Langflow API keys](https://docs.langflow.org/api-keys-and-authentication#langflow-api-keys)。

**uv（推荐）**

```bash
uv run langflow api-key
```

**直接运行**

```bash
langflow api-key
```

#### 选项

| 选项 | 默认值 | 类型 | 说明 |
| --- | --- | --- | --- |
| `--log-level` | `error` | 字符串 | 日志级别，可为 `debug`、`info`、`warning`、`error` 或 `critical`。 |

### langflow copy-db

把 Langflow 数据库文件从缓存目录复制到当前 Langflow 安装目录（即包含 `__main__.py` 的目录）。运行 `which langflow` 可以找到复制目标目录。

缓存目录中如果存在以下文件，就会被复制：

- `langflow.db`：Langflow 主数据库，存放在用户缓存目录
- `langflow-pre.db`：预发布数据库（如存在）

**uv（推荐）**

```bash
uv run langflow copy-db
```

**直接运行**

```bash
langflow copy-db
```

### langflow migration

用 [Alembic](https://alembic.sqlalchemy.org/en/latest/)（SQLAlchemy 的数据库迁移工具）管理 Langflow 数据库模式（schema）变更。

`migration` 命令有两种模式：

- **测试模式（默认）**：检查迁移能否安全应用，但不实际执行迁移。用于在执行迁移前预览将对数据库模式做出的变更。
- **修复模式**：实际应用迁移，更新数据库模式。

:::caution
`langflow migration --fix` 是可能删除数据的破坏性操作。务必先运行 `langflow migration` 预览变更。
:::

**uv（推荐）**

1. 运行测试模式：

   ```bash
   uv run langflow migration
   ```

2. 检查测试返回的变更，确认可以安全迁移。
3. 运行修复模式应用变更：

   ```bash
   uv run langflow migration --fix
   ```

**全局安装**

1. 运行测试模式：

   ```bash
   langflow migration
   ```

2. 检查测试返回的变更，确认可以安全迁移。
3. 运行修复模式应用变更：

   ```bash
   langflow migration --fix
   ```

### langflow run

启动 Langflow 服务器。

**uv（推荐）**

```bash
uv run langflow run [OPTIONS]
```

**直接运行**

```bash
langflow run [OPTIONS]
```

#### 选项

该命令支持部分常用且不含敏感信息的配置项，其余选项须在 `.env` 文件或终端中设置。完整的 Langflow 配置项见 [Langflow 环境变量](https://docs.langflow.org/environment-variables)。

| 选项 | 默认值 | 类型 | 说明 |
| --- | --- | --- | --- |
| `--auto-saving` | `--auto-saving`（true） | 布尔 | 是否在可视化编辑器中启用 Flow 自动保存。用 `--no-auto-saving` 关闭 Flow 自动保存。 |
| `--auto-saving-interval` | `1000` | 整数 | Flow 自动保存的间隔，单位毫秒。 |
| `--backend-only` | `--no-backend-only`（false） | 布尔 | 是否只运行 Langflow 后端服务（不含前端）。省略该选项或用 `--no-backend-only` 可同时启动前端与后端。参见[以无头模式启动 Langflow](#以无头模式启动-langflow)。 |
| `--cache` | `async` | 字符串 | 使用的[缓存存储](https://docs.langflow.org/memory)类型，可为 `async`、`redis`、`memory` 或 `disk`。 |
| `--components-path` | 未设置 | 字符串 | 自定义组件所在目录的路径。 |
| `--dev` | `--no-dev`（false） | 布尔 | 是否以开发模式运行（可能包含 bug）。 |
| `--env-file` | 未设置 | 字符串 | 存放 Langflow 环境变量的 `.env` 文件路径。参见[用指定的 .env 文件启动 Langflow](#用指定的-env-文件启动-langflow)。 |
| `--frontend-path` | 未设置 | 字符串 | 包含构建产物的前端目录路径。仅在[向 Langflow 代码库贡献](https://docs.langflow.org/contributing-how-to-contribute)或开发包含自定义前端代码的 Langflow 镜像时使用。 |
| `--health-check-max-retries` | `5` | 整数 | Langflow 服务器健康检查的最大重试次数。 |
| `--host` | `localhost` | 字符串 | Langflow 服务器运行的主机。 |
| `--log-file` | `logs/langflow.log` | 字符串 | Langflow 日志文件的路径。 |
| `--log-level` | `critical` | 字符串 | 日志级别，可为 `debug`、`info`、`warning`、`error` 或 `critical`。 |
| `--log-rotation` | 未设置 | 字符串 | 日志轮转间隔，可按时长或文件大小设置。 |
| `--max-file-size-upload` | `1024` | 整数 | 文件上传大小上限，单位 MB。 |
| `--open-browser` | `--no-open-browser`（false） | 布尔 | 是否在启动时打开系统浏览器。用 `--open-browser` 可在 Langflow 启动时打开系统默认浏览器。 |
| `--port` | `7860` | 整数 | Langflow 服务器运行的端口。若指定端口被占用，服务器会自动选择空闲端口。 |
| `--remove-api-keys` | `--no-remove-api-keys`（false） | 布尔 | 是否从保存到 Langflow 数据库的 Flow 中移除 API key 和令牌。 |
| `--ssl-cert-file-path` | 未设置 | 字符串 | 本机 SSL 证书文件路径，用于 SSL 加密连接。 |
| `--ssl-key-file-path` | 未设置 | 字符串 | 本机 SSL 密钥文件路径，用于 SSL 加密连接。 |
| `--worker-timeout` | `300` | 整数 | Langflow 服务器 worker 超时时间，单位秒。 |
| `--workers` | `1` | 整数 | Langflow 服务器 worker 进程数。 |

#### 用指定的 .env 文件启动 Langflow

`--env-file` 选项让 Langflow 按指定 `.env` 文件中的配置启动。命令后追加的其他选项若与 `.env` 文件中的变量重复，则以 CLI 选项为准。

省略 `--env-file`，或文件未包含全部所需变量时，Langflow 对缺失的变量使用默认值。

**uv（推荐）**

```bash
uv run langflow run --env-file PATH/TO/LANGFLOW/.env
```

**直接运行**

```bash
langflow run --env-file PATH/TO/LANGFLOW/.env
```

#### 以无头模式启动 Langflow

`--backend-only` 选项只启动 Langflow 后端服务。这种无头模式没有前端（可视化编辑器），只能通过 Langflow API 和 CLI 以编程方式访问服务器。

**uv（推荐）**

```bash
uv run langflow run --backend-only
```

**直接运行**

```bash
langflow run --backend-only
```

### langflow superuser

用给定的用户名和密码创建 superuser 账户。

**uv（推荐）**

```bash
uv run langflow superuser --username [NAME] --password [PASSWORD] [OPTIONS]
```

**直接运行**

```bash
langflow superuser --username [NAME] --password [PASSWORD] [OPTIONS]
```

#### 选项

| 选项 | 默认值 | 类型 | 说明 |
| --- | --- | --- | --- |
| `--log-level` | `error` | 字符串 | 日志级别，可为 `debug`、`info`、`warning`、`error` 或 `critical`。 |

该命令的 `--username` 和 `--password` 不是可选参数，也没有默认值，缺少任一参数命令都会失败。详见 [`LANGFLOW_SUPERUSER` 与 `LANGFLOW_SUPERUSER_PASSWORD`](https://docs.langflow.org/api-keys-and-authentication#langflow-superuser)。

#### 禁用 CLI 创建 superuser

`langflow superuser` 命令受 [`LANGFLOW_ENABLE_SUPERUSER_CLI`](https://docs.langflow.org/api-keys-and-authentication#langflow-enable-superuser-cli) 环境变量控制：

- **`LANGFLOW_ENABLE_SUPERUSER_CLI=True`（默认）**：`langflow superuser` 命令可用，创建 superuser 不受限制。
- **`LANGFLOW_ENABLE_SUPERUSER_CLI=False`（推荐）**：禁用 `langflow superuser` 命令。为防止未经授权创建 superuser，出于安全考虑推荐此设置，生产环境尤其如此。

要禁用 `langflow superuser` 命令，须在 Langflow 的 `.env` 文件中设置 `LANGFLOW_ENABLE_SUPERUSER_CLI=False`，然后[用该 `.env` 文件启动 Langflow](#用指定的-env-文件启动-langflow)。

## 下一步

- [Langflow 部署概览](/docs/deployment/overview/)
