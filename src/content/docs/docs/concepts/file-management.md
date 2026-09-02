---
title: 文件管理
description: 在 Langflow 里集中上传与管理 Flow 用到的资源，含上传上限、运行时加载与存储后端。
sidebar:
  order: 7
---

Langflow 服务器提供一个集中存放 Flow 所用资源的地方，存好之后可在所有 Flow 间复用。

## 入口与操作

- **桌面版**：在 Projects 页打开 My Files。
- **OSS**：使用服务器的 `/files` 端点。
- **API**：文件端点支持程序化操作。

在界面里可一次添加多个资源，再重命名、复制、下载或删除。批量下载会以 zip 返回。

## 上限与在 Flow 里使用

- 默认上传上限 **1024 MB**，可用环境变量 `LANGFLOW_MAX_FILE_SIZE_UPLOAD` 覆盖。
- Read File 等组件可选择已存资源，但只列出该组件接受的类型；其它格式需换组件或先转换。
- 运行时加载需要把文件路径参数暴露为 tweak，上传资源后在请求里传入返回的 path，可传多个。

## 媒体与存储

- **图片**：PNG、JPG/JPEG、GIF、BMP、WebP 可通过 Playground 或 run API 以 base64 发送。
- **视频**：使用相应的 bundle。
- **存储**：默认本地，也支持 AWS S3（需配置桶与 AWS 凭据）。前缀与标签设置作用于对象存储。Google Drive 处理仅通过某些组件提供，且不支持环境变量配置。

## 另见

- [构建 Flows](/docs/concepts/flows/)
- [发布与集成](/docs/concepts/publish/)
