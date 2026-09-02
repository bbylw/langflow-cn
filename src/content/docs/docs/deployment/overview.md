---
title: Langflow 部署概览
description: 把本地构建的 Flow 发布出去的多种部署方式。
sidebar:
  order: 1
---

本节介绍把本地构建的 Flow 发布给世界的多种方式。

- 若要通过 ngrok 网关自托管本地服务器，参见[部署公开的 Langflow 服务器](https://docs.langflow.org/deployment-public-server)。这种方式借助 [ngrok](https://ngrok.com/docs/getting-started/) 转发流量，把本地 Langflow 服务器分享到互联网，无需部署到云服务商，也无需直接暴露自己的网络。

- 若要构建并部署包含 Flow 文件的 Langflow 容器，参见[将 Langflow 应用容器化](https://docs.langflow.org/develop-application)。这种方式把你的 Flow 和依赖打包成可移植、可复现的 Docker 镜像，便于在不同环境中部署。

- 若要用 Docker 和 Caddy 在远程服务器上部署 Langflow，参见[在远程服务器上部署 Langflow](https://docs.langflow.org/deployment-caddyfile)。这种方式适合用 Docker 容器和 Caddy 反向代理（提供 HTTPS 支持）在远程服务器上托管自己的 Langflow 实例。

- 若要用 Nginx 和自动 SSL 证书部署 Langflow，参见[使用 Nginx 与 Let's Encrypt 部署 Langflow](https://docs.langflow.org/deployment-nginx-ssl)。这种方式以 Nginx 作为反向代理，配合 Let's Encrypt 自动管理 HTTPS 证书，在*不使用* Docker 的情况下实现安全部署。

- 若要在 Kubernetes 上部署 Langflow，参见[Langflow Kubernetes 架构与最佳实践](https://docs.langflow.org/deployment-prod-best-practices)。这种方式可创建具备高可用性、可扩展性和完善编排能力的生产级部署。

- 各云服务商的专属部署指南请参阅其官方文档。Langflow 文档提供了若干示例，例如 [Google Cloud Platform](https://docs.langflow.org/deployment-gcp) 和 [Hugging Face Spaces](https://docs.langflow.org/deployment-hugging-face-spaces)，帮助你快速上手。

## 下一步

- [部署公开的 Langflow 服务器](https://docs.langflow.org/deployment-public-server)：通过 ngrok 把本地 Langflow 服务器分享到互联网。
