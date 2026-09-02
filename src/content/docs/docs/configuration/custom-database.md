---
title: 配置外部 PostgreSQL 数据库
description: 把 Langflow 默认的 SQLite 数据库替换为外部 PostgreSQL，适用于本地与容器化环境。
sidebar:
  order: 3
---

Langflow 默认使用 [SQLite](https://www.sqlite.org/docs.html) 数据库，也可以配置为 PostgreSQL。

本指南介绍如何在本地和容器化环境中，把默认的 SQLite 连接字符串 `sqlite:///./langflow.db` 替换为 PostgreSQL，为 Langflow 接入外部数据库。

:::note[SQLite 路径要使用绝对路径]
如果把 `LANGFLOW_DATABASE_URL` 设为 SQLite 连接字符串，请使用**绝对**路径，例如 `sqlite:////absolute/path/to/langflow.db`（注意开头有四个斜杠），Windows 下为 `sqlite:///C:/path/to/langflow.db`。

`sqlite:///./langflow.db` 这类相对路径是相对于启动 Langflow 时所在目录解析的：从不同目录启动，就会指向不同的数据库文件（Flow 可能看起来「消失」了）；相对路径中如果包含尚不存在的子目录，启动时会直接失败，因为 SQLite 不会创建中间目录。
:::

这种配置下，Langflow 的全部结构化应用数据——包括 Flow、消息历史和日志——改由 PostgreSQL 管理。PostgreSQL 对并发用户的支持更稳健，数据完整性特性更完善，扩展性更好，因此更适合生产环境。以 PostgreSQL 作为数据库，Langflow 能更高效地支撑多用户和更大的负载。

## 前置条件

- 一个 [PostgreSQL](https://www.pgadmin.org/download/) 数据库，版本 15 或更高

## 将 Langflow 连接到本地 PostgreSQL 数据库

1. 如果 Langflow 正在运行，用 <kbd>Ctrl+C</kbd> 停止。
2. 找到 PostgreSQL 数据库的连接字符串，格式为 `postgresql://user:password@host:port/dbname`。

   连接字符串中的主机名取决于 PostgreSQL 的运行方式：

   - 直接在本机运行 PostgreSQL，用 `localhost`。
   - 在 Docker Compose 中运行，用服务名，如 `postgres`。
   - 用 `docker run` 在单独容器中运行，用容器的 IP 地址或网络别名。
   - 使用云托管 PostgreSQL，服务商会提供包含用户名和密码的连接字符串。

3. 编辑或创建 Langflow `.env` 文件：

   ```bash
   touch .env
   ```

   可以用 Langflow 仓库中的 [`.env.example`](https://github.com/langflow-ai/langflow/blob/main/.env.example) 文件作为模板。

4. 在 `.env` 文件中把 `LANGFLOW_DATABASE_URL` 设为你的 PostgreSQL 连接字符串：

   ```text
   LANGFLOW_DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

   Langflow 通过 [SQLAlchemy](https://www.sqlalchemy.org/) 和 [psycopg](https://www.psycopg.org/) 驱动把 SSL 参数直接传给 PostgreSQL 连接。

   :::caution[PostgreSQL 驱动兼容性]
   Langflow 要求使用 `psycopg2-binary` 或 `psycopg[binary]` 作为 PostgreSQL 驱动。`asyncpg` 驱动对时区处理的要求更严格，与 Langflow 当前的数据库模式不兼容。
   :::

   支持以下 SSL 模式：

   - **`sslmode=require`**：要求 SSL 连接，但不验证服务器证书。安全性最低，但对多数场景可以接受。

     ```bash
     LANGFLOW_DATABASE_URL="postgresql://user:password@localhost:5432/dbname?sslmode=require"
     ```

   - **`sslmode=verify-ca`**：要求 SSL，并对照证书颁发机构（CA）验证服务器证书。把证书路径加入连接字符串：

     ```bash
     LANGFLOW_DATABASE_URL="postgresql://user@localhost:5432/dbname?sslmode=verify-ca&sslcert=/path/to/client.crt&sslkey=/path/to/client.key&sslrootcert=/path/to/ca.crt"
     ```

   - **`sslmode=verify-full`**：要求 SSL，验证服务器证书，并核对请求主机名与证书主机名。本例中的 `db.example.com` 必须与服务器证书的 CN 一致。安全性最高。

     ```bash
     LANGFLOW_DATABASE_URL="postgresql://user@db.example.com:5432/dbname?sslmode=verify-full&sslcert=/path/to/client.crt&sslkey=/path/to/client.key&sslrootcert=/path/to/ca.crt"
     ```

     不要把 Langflow 环境变量 [`LANGFLOW_SSL_CERT_FILE`](https://docs.langflow.org/environment-variables#server) 和 [`LANGFLOW_SSL_KEY_FILE`](https://docs.langflow.org/environment-variables#server) 用于 PostgreSQL 证书：这两个变量用于给 Langflow 服务器启用 HTTPS，与 PostgreSQL 数据库连接无关。

     有关 PostgreSQL 中 SSL 证书管理的更多信息，见 [PostgreSQL 文档](https://www.postgresql.org/docs/9.1/ssl-tcp.html)。

5. 保存修改，然后用 `.env` 文件启动 Langflow：

   ```bash
   uv run langflow run --env-file .env
   ```

   可选的连接池和超时设置见[配置外部内存](https://docs.langflow.org/memory#configure-external-memory)。

6. 在 Langflow 中运行任意 Flow，产生访问流量。
7. 检查 PostgreSQL 数据库的表和活动，确认运行 Flow 后新建了表、产生了流量。

## 用 docker-compose.yml 部署 Langflow 与 PostgreSQL 容器

把 Langflow 和 PostgreSQL 容器放到同一个 Docker 网络中启动，能保证服务间正常连通。示例见 Langflow 仓库中的 [`docker-compose.yml`](https://github.com/langflow-ai/langflow/blob/main/docker_example/docker-compose.yml) 文件。

示例 `docker-compose.yml` 还为 Langflow 和 PostgreSQL 数据配置了持久化卷。持久化卷把容器内的目录映射到宿主机存储，数据因此在容器重启后仍然保留。

Docker Compose 会为 `docker-compose.yml` 中定义的所有服务创建一个隔离网络，服务之间可以用服务名当主机名互相访问，比如数据库 URL 中的 `postgres`。反之，如果用 `docker run` 单独启动 PostgreSQL，它会与 Langflow 容器处于不同网络，Langflow 就无法用服务名连接 PostgreSQL。

要用示例 Docker Compose 文件启动 Langflow 和 PostgreSQL 服务，进入 `langflow/docker_example` 目录后运行 `docker-compose up`。如果用的是自己的 `docker-compose.yml`，请在该文件所在目录运行 `docker-compose up`。

## 用共享 PostgreSQL 数据库部署多个 Langflow 实例

要让多个 Langflow 实例共享同一个 PostgreSQL 数据库，在 `docker-compose.yml` 中加入多个 Langflow 服务即可。

本示例让 `docker-compose.yml` 从 Langflow 的 `.env` 文件读取变量值，这样部署变量只需要维护一个文件，不必在多个文件之间来回复制。

1. 在 `.env` 文件中填入 PostgreSQL 数据库的值：

   ```text
   POSTGRES_USER=langflow
   POSTGRES_PASSWORD=your_secure_password
   POSTGRES_DB=langflow
   POSTGRES_HOST=postgres
   POSTGRES_PORT=5432
   LANGFLOW_CONFIG_DIR=app/langflow
   LANGFLOW_PORT_1=7860
   LANGFLOW_PORT_2=7861
   LANGFLOW_HOST=0.0.0.0
   ```

   可选的连接池和超时设置见[配置外部内存](https://docs.langflow.org/memory#configure-external-memory)。

2. 在 `docker-compose.yml` 中引用这些变量。例如：

   ```yaml
   services:
     postgres:
       # Pinned to a specific Debian base (trixie) so the postgres:16 tag does
       # not silently roll its OS, which triggers a glibc collation mismatch
       # warning on existing volumes. See https://github.com/langflow-ai/langflow/issues/9608
       image: postgres:16-trixie
       environment:
         - POSTGRES_USER=${POSTGRES_USER}
         - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
         - POSTGRES_DB=${POSTGRES_DB}
       ports:
         - "${POSTGRES_PORT}:5432"
       volumes:
         - langflow-postgres:/var/lib/postgresql/data
     langflow-1:
       image: langflowai/langflow:latest
       pull_policy: always
       ports:
         - "${LANGFLOW_PORT_1}:7860"
       depends_on:
         - postgres
       environment:
         - LANGFLOW_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
         - LANGFLOW_CONFIG_DIR=${LANGFLOW_CONFIG_DIR}
         - LANGFLOW_HOST=${LANGFLOW_HOST}
         - PORT=7860
       volumes:
         - langflow-data-1:/app/langflow
     langflow-2:
       image: langflowai/langflow:latest
       pull_policy: always
       ports:
         - "${LANGFLOW_PORT_2}:7860"
       depends_on:
         - postgres
       environment:
         - LANGFLOW_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
         - LANGFLOW_CONFIG_DIR=${LANGFLOW_CONFIG_DIR}
         - LANGFLOW_HOST=${LANGFLOW_HOST}
         - PORT=7860
       volumes:
         - langflow-data-2:/app/langflow
   volumes:
     langflow-postgres:
     langflow-data-1:
     langflow-data-2:
   ```

3. 用 `docker-compose up` 部署该文件。第一个 Langflow 实例在 `http://localhost:7860`，第二个在 `http://localhost:7861`。
4. 要确认两个实例用的是同一个数据库，用 `docker exec` 在 PostgreSQL 容器里启动 `psql`。容器名可能不同。

   ```bash
   docker exec -it docker-test-postgres-1 psql -U langflow -d langflow
   ```

5. 查询数据库的活动连接：

   ```sql
   langflow=# SELECT * FROM pg_stat_activity WHERE datname = 'langflow';
   ```

6. 检查查询结果中有多个 `client_addr` 不同的连接，例如 `172.21.0.3` 和 `172.21.0.4`。每个 Langflow 实例都在 Docker 网络中自己的容器里运行，来源 IP 不同即说明两个实例都连接着 PostgreSQL 数据库。
7. 输入 `quit` 退出 `psql`。

## 另见

- [Langflow 企业级数据库管理员指南](https://docs.langflow.org/enterprise-database-guide)
- [内存管理选项](https://docs.langflow.org/memory)
- [日志](https://docs.langflow.org/logging)
