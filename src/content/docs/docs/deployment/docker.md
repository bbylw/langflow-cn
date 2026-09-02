---
title: 在 Docker 上部署 Langflow
description: 用 Docker 与 Docker Compose 运行、定制和升级 Langflow，包括从源码构建镜像。
sidebar:
  order: 2
---

:::tip
本文所有命令都可以用 Podman 代替 Docker。更多信息参见 [Podman 文档](https://podman.io/docs)。
:::

用 Docker 容器运行应用可以保证在不同系统上行为一致，并消除依赖冲突。

Langflow 发布 base、default、extended 三种应用镜像，内置的 provider 各不相同。部署前请先阅读[选择 Langflow Docker 镜像](https://docs.langflow.org/deployment/docker-image-profiles)，了解规范的镜像标签、组成、版本锁定、迁移与回滚指引。

本指南演示用 [Docker](https://docs.docker.com/) 和 [Docker Compose](https://docs.docker.com/compose/) 运行 Langflow 的几种方式：

- [快速开始](https://docs.langflow.org/deployment-docker#quickstart)：以默认值启动一个 Langflow 容器。
- [使用 Docker Compose](https://docs.langflow.org/deployment-docker#docker-compose)：用持久化的 PostgreSQL 数据库和可配置的环境变量运行 Langflow。
- [自定义 Docker Compose 文件](https://docs.langflow.org/deployment-docker#customize)：在官方 Langflow 镜像之上构建自定义镜像，打包 Flow 或加入自己的代码。
- [从源码构建并运行 Docker 镜像](https://docs.langflow.org/deployment-docker#build-from-source)：从本地克隆的仓库构建 Docker 镜像，或启动前后端均支持热重载的完整开发环境。
- [升级 Langflow Docker 镜像](https://docs.langflow.org/deployment-docker#upgrade-the-langflow-docker-image)：升级到新镜像，且不丢失数据库或 Flow。
- [Docker 镜像默认值](https://docs.langflow.org/deployment-docker#docker-image-security-defaults)：Langflow 镜像内置的环境变量及其覆盖方式。

## 快速开始

在系统上安装并启动 Docker 后，运行以下命令：

```bash
docker run -p 7860:7860 \
  -e LANGFLOW_AUTO_LOGIN=false \
  -e LANGFLOW_SUPERUSER_PASSWORD=SUPERUSER_PASSWORD \
  langflowai/langflow:latest
```

官方 Docker 镜像默认设置 `LANGFLOW_AUTO_LOGIN=false`。

把 `SUPERUSER_PASSWORD` 替换为 Langflow 超级管理员（superuser）的强密码。

更多信息参见 [Docker 镜像默认值](https://docs.langflow.org/deployment-docker#docker-image-security-defaults)。

然后通过 `http://localhost:7860/` 访问 Langflow。

该命令启动的是一个预构建 Docker 镜像，并为本地开发启用了自动登录。若要更灵活地控制配置，参见[使用 Docker Compose](https://docs.langflow.org/deployment-docker#docker-compose)。

## 使用 Docker Compose

Docker Compose 让你对配置有更多控制，例如设置环境变量、用持久化的 PostgreSQL 数据库代替默认的 SQLite 数据库，以及引入自定义依赖。

Langflow 仓库在 `docker_example/docker-compose.yml` 提供了一个开箱即用的 Compose 文件，它会从 Docker Hub 拉取最新的 Langflow 镜像，并通过 PostgreSQL 提供持久化卷存储。

1. 克隆 Langflow 仓库：

   ```bash
   git clone https://github.com/langflow-ai/langflow.git
   ```

2. 进入 `docker_example` 目录：

   ```bash
   cd langflow/docker_example
   ```

3. 运行 Docker Compose 文件：

   ```bash
   docker compose up
   ```

4. 通过 `http://localhost:7860/` 访问 Langflow。

## 自定义 Docker Compose 文件

根据部署需求自定义 Docker Compose 文件。

### 配置环境变量

用 `.env` 文件配置容器的数据库凭据。

1. 在 `docker-compose.yml` 所在目录创建一个包含数据库凭据的 `.env` 文件：

   ```
   # Database credentials
   POSTGRES_USER=myuser
   POSTGRES_PASSWORD=mypassword
   POSTGRES_DB=langflow
   # Langflow configuration
   LANGFLOW_DATABASE_URL=postgresql://myuser:mypassword@postgres:5432/langflow
   LANGFLOW_CONFIG_DIR=/app/langflow
   LANGFLOW_SUPERUSER_PASSWORD=SUPERUSER_PASSWORD
   ```

   把 `SUPERUSER_PASSWORD` 替换为 Langflow 超级管理员的强密码。

2. 编辑 `docker-compose.yml`，把 `langflow` 和 `postgres` 两个服务的硬编码值替换为变量引用：

   ```yaml
   services:
     langflow:
       environment:
         - LANGFLOW_DATABASE_URL=${LANGFLOW_DATABASE_URL}
         - LANGFLOW_CONFIG_DIR=${LANGFLOW_CONFIG_DIR}
         - LANGFLOW_SUPERUSER_PASSWORD=${LANGFLOW_SUPERUSER_PASSWORD}
     postgres:
       environment:
         - POSTGRES_USER=${POSTGRES_USER}
         - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
         - POSTGRES_DB=${POSTGRES_DB}
   ```

配置好变量引用后，Docker Compose 会在启动时从 `.env` 文件读取这些值。

可用环境变量的完整列表参见 [Langflow 环境变量](https://docs.langflow.org/environment-variables)。

### 将 Flow 打包进镜像

把 Flow 的 JSON 直接嵌入 Docker 镜像。适用于把特定 Flow 作为独立容器分发，或部署到 Kubernetes 等环境。

1. 创建项目目录并进入：

   ```bash
   mkdir langflow-custom && cd langflow-custom
   ```

2. 把 Flow 的 JSON 文件放入该目录。可以下载示例，也可以使用你自己的：

   ```bash
   # Download an example flow
   wget https://raw.githubusercontent.com/langflow-ai/langflow-helm-charts/refs/heads/main/examples/flows/basic-prompting-hello-world.json
   # Or copy your own flow file
   cp /path/to/your/flow.json .
   ```

3. 创建 `Dockerfile`：

   ```dockerfile
   FROM langflowai/langflow:latest
   RUN mkdir /app/flows
   COPY ./*.json /app/flows/
   ENV LANGFLOW_LOAD_FLOWS_PATH=/app/flows
   ```

4. 构建、测试镜像，并（可选）推送：

   ```bash
   docker build -t myuser/langflow-custom:1.0.0 .
   docker run -p 7860:7860 -e LANGFLOW_AUTO_LOGIN=true myuser/langflow-custom:1.0.0
   docker push myuser/langflow-custom:1.0.0 # optional
   ```

Kubernetes 部署参见[在 Kubernetes 上部署 Langflow 生产环境](https://docs.langflow.org/deployment-kubernetes-prod)。

### 添加自定义代码或依赖

向预构建镜像的安装目录中打入自定义代码。适用于需要添加自定义 Python 包、替换内置组件，或在不进行[完整源码构建](https://docs.langflow.org/deployment-docker#build-from-source)的情况下做针对性修改的场景。

本示例替换内置的 **Message History** 组件，同样的模式适用于任何组件或文件。

1. 为你的自定义 Langflow 创建一个目录：

   ```bash
   mkdir langflow-custom && cd langflow-custom
   ```

2. 创建与组件路径对应的目录结构：

   ```bash
   mkdir -p src/lfx/src/lfx/components/models_and_agents
   ```

3. 把修改后的 `memory.py` 文件放入该目录。

4. 创建 `Dockerfile`：

   ```dockerfile
   FROM langflowai/langflow:latest
   WORKDIR /app
   COPY src/lfx/src/lfx/components/models_and_agents/memory.py /tmp/memory.py
   RUN python -c "import site; print(site.getsitepackages()[0])" > /tmp/site_packages.txt
   RUN SITE_PACKAGES=$(cat /tmp/site_packages.txt) && \
     mkdir -p "$SITE_PACKAGES/lfx/components/models_and_agents" && \
     cp /tmp/memory.py "$SITE_PACKAGES/lfx/components/models_and_agents/"
   RUN SITE_PACKAGES=$(cat /tmp/site_packages.txt) && \
     find "$SITE_PACKAGES" -name "*.pyc" -delete && \
     find "$SITE_PACKAGES" -name "__pycache__" -type d -exec rm -rf {} +
   EXPOSE 7860
   CMD ["python", "-m", "langflow", "run", "--host", "0.0.0.0", "--port", "7860"]
   ```

5. 构建并运行镜像：

   ```bash
   docker build -t myuser/langflow-custom:1.0.0 .
   docker run -p 7860:7860 -e LANGFLOW_AUTO_LOGIN=true myuser/langflow-custom:1.0.0
   ```

## 从源码构建并运行 Docker 镜像

:::tip
`make docker_build` 和 `make lfx_docker_build` 默认使用 Podman。如果安装的是 Docker，请在命令行传入别名 `DOCKER=docker`：

```bash
make docker_build DOCKER=docker
```
:::

如果已克隆 Langflow 仓库，想在 Docker 容器内构建并运行本地修改，运行：

```bash
make docker_build
```

该命令构建 `docker/build_and_push.Dockerfile`，并将结果标记为 `langflow:<version>`。

构建完成后运行镜像：

```bash
docker run -p 7860:7860 \
  -e LANGFLOW_SUPERUSER_PASSWORD=SUPERUSER_PASSWORD \
  langflow:VERSION
```

替换以下内容：

- `SUPERUSER_PASSWORD`：Langflow 超级管理员的强密码
- `VERSION`：仓库根目录 `pyproject.toml` 中的版本号

镜像设置了 `LANGFLOW_AUTO_LOGIN=false`，因此必须提供超级管理员密码，除非你设置 `LANGFLOW_AUTO_LOGIN=true`。更多信息参见 [Docker 镜像默认值](https://docs.langflow.org/deployment-docker#docker-image-security-defaults)。

若只需构建 LFX executor CLI 镜像而非完整的 Langflow 应用，运行：

```bash
make lfx_docker_build
```

该命令构建 `src/lfx/docker/Dockerfile`，并将结果标记为 `lfx:latest`，产物是一个仅包含 `lfx` CLI 工具的轻量 Alpine 镜像，不含前端和 Langflow UI。

构建上下文是仓库根目录，而不是 `src/lfx/`。Dockerfile 会从 `pyproject.toml`、`uv.lock`、`src/lfx/` 和 `src/sdk/` 复制文件，因此整个工作区都会发送给守护进程。根目录的 `.dockerignore` 能部分缓解这一问题，但首次构建会比预期的小型 CLI 镜像要慢。

### 编写基于源码的自定义 Dockerfile

编写基于源码的 Dockerfile 时，必须复制 `uv sync` 所需工作区成员的清单文件（`pyproject.toml`、`README.md`，以及存在的 `uv.lock`），以便在源码可用之前解析依赖。工作区成员定义在根 `pyproject.toml` 的 `[tool.uv.workspace]` 中。像 `src/langflow-stepflow` 这类首次仅依赖同步用不到的成员，则无需复制其清单。完整源码随后通过 `COPY ./src` 复制，会在第二次 `uv sync` 之前把先前省略的成员带入镜像。

1. 把所有清单文件复制进 Dockerfile，需包含以下内容：

   ```dockerfile
   COPY ./uv.lock /app/uv.lock
   COPY ./README.md /app/README.md
   COPY ./pyproject.toml /app/pyproject.toml
   COPY ./src/backend/base/README.md /app/src/backend/base/README.md
   COPY ./src/backend/base/pyproject.toml /app/src/backend/base/pyproject.toml
   COPY ./src/lfx/README.md /app/src/lfx/README.md
   COPY ./src/lfx/pyproject.toml /app/src/lfx/pyproject.toml
   COPY ./src/sdk/README.md /app/src/sdk/README.md
   COPY ./src/sdk/pyproject.toml /app/src/sdk/pyproject.toml
   COPY ./src/bundles /app/src/bundles
   ```

2. 安装依赖并复制源码，需包含以下内容：

   ```dockerfile
   RUN --mount=type=cache,target=/root/.cache/uv \
     uv sync --frozen --no-install-project --no-editable --extra postgresql --no-group dev
   COPY ./src /app/src
   RUN --mount=type=cache,target=/root/.cache/uv \
     uv sync --frozen --no-editable --extra postgresql --no-group dev
   ```

第一次 `uv sync` 只在源码复制之前安装依赖，让 Docker 能缓存该层。第二次 `uv sync` 从复制进来的源码安装项目包（`langflow`、`lfx`）。两次调用缺一不可：省略第二次会得到一个依赖齐全但缺少项目包的容器，运行时会失败。

受支持的源码构建使用 [`docker/build_and_push.Dockerfile`](https://github.com/langflow-ai/langflow/blob/main/docker/build_and_push.Dockerfile)。构建其 `base` 目标得到不含 bundle 的应用，`full` 得到常规精选发行版，`full-bundles` 得到扩展的 provider 清单。

### 用 `make dcdev_up` 启动开发环境

`make dcdev_up` 使用 [`docker/dev.docker-compose.yml`](https://github.com/langflow-ai/langflow/blob/main/docker/dev.docker-compose.yml) 从源码启动完整的开发环境。适合想在容器内开发 Langflow 代码库的场景。

构建 Langflow dcdev 镜像：

```bash
make dcdev_up
```

后端和 Langflow UI 通过 `http://localhost:7860/` 访问，前端开发服务器通过 `http://localhost:3000/` 访问。

默认设置以下环境变量：

| 变量 | 默认值 | 说明 |
|---|---|---|
| `LANGFLOW_DATABASE_URL` | `postgresql://langflow:langflow@postgres:5432/langflow` | PostgreSQL 连接字符串 |
| `LANGFLOW_SUPERUSER` | `langflow` | 初始管理员用户名 |
| `LANGFLOW_CONFIG_DIR` | `/var/lib/langflow` | Langflow 配置与数据目录 |

`LANGFLOW_SUPERUSER_PASSWORD` 未在 compose 文件中设置。默认 `LANGFLOW_AUTO_LOGIN=true` 时，Langflow 会为自动登录账户生成一个随机的引导密码。若设置 `LANGFLOW_AUTO_LOGIN=false`，则必须在启动前把 `LANGFLOW_SUPERUSER_PASSWORD` 设为强密码，旧值 `langflow` 不再允许使用。

要覆盖这些值，直接编辑 `docker/dev.docker-compose.yml`。

`docker/dev.docker-compose.yml` 的 `environment:` 块使用字面值，例如 `- LANGFLOW_SUPERUSER=langflow`。Docker Compose v2 赋予 `environment:` 块字面值高于 shell 导出变量和 `env_file:` 的优先级，因此无论是 `export LANGFLOW_SUPERUSER=myadmin` 还是 `.env` 文件都无法覆盖它们。请改为直接编辑该文件。

## 升级 Langflow Docker 镜像

要在不丢失数据库或 Flow 的情况下升级 Langflow Docker 部署，请按以下步骤操作：

1. 把数据保存在持久化卷上，这样升级 Langflow 时只需替换容器镜像。为 Langflow 数据和数据库使用 Docker 卷或绑定挂载，使其在容器之外持久化。例如，下面的 Docker Compose 文件为 Langflow 数据使用绑定挂载（宿主机上的 `./langflow-data`），为 PostgreSQL 数据库使用命名卷（`langflow-postgres`）：

   ```yaml
   services:
     langflow:
       image: langflowai/langflow:1.11.0
       environment:
         - LANGFLOW_CONFIG_DIR=/app/langflow
         - LANGFLOW_SUPERUSER_PASSWORD=${LANGFLOW_SUPERUSER_PASSWORD}
       volumes:
         - ./langflow-data:/app/langflow
     postgres:
       # Pinned to a specific Debian base (trixie) so the postgres:16 tag does
       # not silently roll its OS, which triggers a glibc collation mismatch
       # warning on existing volumes. See https://github.com/langflow-ai/langflow/issues/9608
       image: postgres:16-trixie
       volumes:
         - langflow-postgres:/var/lib/postgresql/data
   volumes:
     langflow-postgres:
   ```

   更多示例参见 [Docker Compose 配置](https://docs.langflow.org/deployment-docker#docker-compose) 和 [docker_example compose 文件](https://github.com/langflow-ai/langflow/blob/main/docker_example/docker-compose.yml)。

2. 拉取新镜像，并更新 `docker-compose.yml` 或 `docker run` 命令中的镜像标签。

   使用 Docker Compose 时，在 compose 文件中设置镜像，例如 `image: langflowai/langflow:1.11.0`，然后拉取：

   ```bash
   docker compose pull
   ```

   使用 `docker run` 时，拉取镜像：

   ```bash
   docker pull langflowai/langflow:1.11.0
   ```

3. 重启容器。相同的卷会重新挂载，数据库和 Flow 得以保留。

   使用 Docker Compose：

   ```bash
   docker compose up -d
   ```

   使用 `docker run` 时，使用相同的卷挂载和新的镜像标签：

   ```bash
   docker run -p 7860:7860 \
     -v langflow-data:/app/langflow \
     -e LANGFLOW_SUPERUSER_PASSWORD=SUPERUSER_PASSWORD \
     langflowai/langflow:1.11.0
   ```

   把 `SUPERUSER_PASSWORD` 替换为 Langflow 超级管理员的强密码。

这种方式让持久化卷与 Langflow 容器分离，因此升级 Langflow 应用时不会丢失数据。

如果需要升级到基于某个 Langflow 版本的自定义镜像，例如为了在 `1.8.0` 中加入 `uv`，先从官方镜像构建一个派生镜像，然后按上述相同步骤操作。在 compose 文件或 `docker run` 中设置自定义镜像，然后拉取并重启。

关于为 `1.8.0` 镜像添加 `uv` 的最小 Dockerfile，参见[发布说明](https://docs.langflow.org/release-notes)（「Docker image no longer includes uv or uvx」）。

## Docker 镜像默认值

自 Langflow 1.11.x 起，官方 Langflow Docker 镜像在构建镜像时即设置 `LANGFLOW_AUTO_LOGIN=false`。非 Docker 安装的 Langflow 应用默认值仍为 `true`。

由于自动登录被禁用，除非显式设置 `LANGFLOW_AUTO_LOGIN=true`，否则必须设置 `LANGFLOW_SUPERUSER_PASSWORD`（可选设置 `LANGFLOW_SUPERUSER`）。

```bash
docker run -p 7860:7860 \
  -e LANGFLOW_AUTO_LOGIN=true \
  -e LANGFLOW_SUPERUSER_PASSWORD=SUPERUSER_PASSWORD \
  langflowai/langflow:latest
```

更多信息参见[面向不可信用户的组件加固](https://docs.langflow.org/api-keys-and-authentication#multi-tenant-component-hardening)和[屏蔽自定义组件](https://docs.langflow.org/deployment-block-custom-components)。

## 下一步

- [将 Langflow 应用容器化](https://docs.langflow.org/develop-application)：把 Flow 与依赖打包成可移植、可复现的 Docker 镜像。
- [选择 Langflow 镜像](https://docs.langflow.org/deployment/docker-image-profiles)：了解各镜像变体、标签与版本锁定建议。
