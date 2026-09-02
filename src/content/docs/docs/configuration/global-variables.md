---
title: 全局变量
description: 创建与管理全局变量，在所有 Flow 中复用凭据和通用值，支持从环境变量读取或存入 Kubernetes Secret。
sidebar:
  order: 2
---

全局变量用来在所有 Flow 中存储和复用凭据与通用值。全局变量通常供 Flow 中的组件使用，任何带全局变量图标的输入字段都可以选用。

相比之下，[环境变量](https://docs.langflow.org/environment-variables)（如 `LANGFLOW_PORT`、`LANGFLOW_LOG_LEVEL`）一般用于配置 Langflow 运行方式这类更全局的设置。不过，Langflow 也能从环境变量读取全局变量。

Langflow 把全局变量存在内部数据库中，并用密钥加密其值。

## 创建全局变量

创建新全局变量的步骤如下。

1. 在 Langflow 顶栏点击个人资料图标，选择 **Settings**。
2. 点击 **Global Variables**。
3. 点击 **Add New**。
4. 在 **Create Variable** 对话框的 **Variable Name** 中输入变量名。
5. 可选：为全局变量选择 **Type**，可选 **Generic**（默认）和 **Credential**。

   Langflow 对 **Generic** 和 **Credential** 类型的全局变量都会加密，区别在于 **Generic** 变量在可视化编辑器中不遮蔽显示，而 **Credential** 变量会遮蔽。**Session ID** 字段不接受 **Credential**（遮蔽）变量。

6. 输入全局变量的 **Value**。
7. 可选：用 **Apply To Fields** 菜单选择一个或多个字段，让 Langflow 自动把全局变量应用到这些字段。例如选择 **OpenAI API Key** 后，Langflow 会自动把该变量应用到所有 **OpenAI API Key** 字段。
8. 点击 **Save Variable**。

之后，任何显示 **Globe** 图标的文本输入字段都可以选用这个全局变量。

## 编辑全局变量

1. 在 Langflow 顶栏点击个人资料图标，选择 **Settings**。
2. 点击 **Global Variables**。
3. 点击要编辑的全局变量。
4. 在 **Update Variable** 对话框中可编辑以下字段：**Variable Name**、**Value** 和 **Apply To Fields**。
5. 点击 **Update Variable**。

## 删除全局变量

删除全局变量会把值从数据库中永久删除，引用该全局变量的 Flow 会因此失败。

1. 在 Langflow 顶栏点击个人资料图标，选择 **Settings**。
2. 点击 **Global Variables**。
3. 勾选要删除的全局变量旁的复选框。
4. 点击 **Delete**。

该全局变量随即从数据库中删除。

## 从环境变量添加自定义全局变量

Langflow 可以从运行环境中读取自定义全局变量。Langflow 如何检测和应用环境变量，见 [Langflow 环境变量](https://docs.langflow.org/environment-variables)。

只要检测到匹配的环境变量，Langflow 就会依据 [`constants.py`](https://github.com/langflow-ai/langflow/blob/main/src/lfx/src/lfx/services/settings/constants.py) 自动生成全局变量。例如在运行环境中设置了 `OPENAI_API_KEY`，Langflow 就会用该值自动生成一个全局变量。

还可以在 `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT` 中声明更多变量。例如 `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=WATSONX_PROJECT_ID,WATSONX_API_KEY` 会在 Langflow 数据库中创建名为 `WATSONX_PROJECT_ID` 和 `WATSONX_API_KEY` 的全局变量，之后可以在组件设置中按需使用。

**本地安装**

本地安装的 Langflow，在 Langflow `.env` 文件中设置 `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT`：

1. 创建或编辑 Langflow `.env` 文件。
2. 按如下方式添加 `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT` 环境变量。变量列表可以写成不带空格的逗号分隔字符串，也可以写成 JSON 列表：

   ```text
   # 方式一：逗号分隔字符串（不含空格）
   LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=VARIABLE1,VARIABLE2
   # 方式二：JSON 列表格式
   LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT=["VARIABLE1", "VARIABLE2"]
   ```

   把 `VARIABLE1,VARIABLE2` 替换为你想让 Langflow 从环境中读取的变量，例如 `CUSTOM_API_KEY,INTERNAL_SERVICE_URL` 或 `["CUSTOM_API_KEY", "INTERNAL_SERVICE_URL"]`。

3. 保存并关闭文件。
4. 用该 `.env` 文件启动 Langflow：

   ```bash
   uv run langflow run --env-file .env
   ```

   也可以直接在命令行中设置环境变量：

   ```bash
   VARIABLE1="VALUE1" VARIABLE2="VALUE2" uv run langflow run --env-file .env
   ```

   命令行变量会覆盖 `.env` 文件中的同名变量。请按自己的环境选择最合适的方式，把环境变量暴露给 Langflow。

5. 确认 Langflow 已成功从环境中读取全局变量：

   1. 在 Langflow 顶栏点击个人资料图标，选择 **Settings**。
   2. 点击 **Global Variables**，确认这些环境变量已出现在 **Global Variables** 列表中。

**Docker**

使用 Docker 时，有两种设置 `LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT` 的方式：

- 在命令行中：

  ```bash
  docker run -it --rm \
    -p 7860:7860 \
    -e LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT="VARIABLE1,VARIABLE2" \
    -e VARIABLE1="VALUE1" \
    -e VARIABLE2="VALUE2" \
    langflowai/langflow:latest
  ```

- 在 `.env` 文件中：

  ```bash
  docker run -it --rm \
    -p 7860:7860 \
    --env-file .env \
    -e VARIABLE1="VALUE1" \
    -e VARIABLE2="VALUE2" \
    langflowai/langflow:latest
  ```

`LANGFLOW_VARIABLES_TO_GET_FROM_ENVIRONMENT` 中只写变量名。你需要确保这些环境变量已在 Docker 环境中定义，例如用 `-e` 参数或其他方式。

启动 Langflow 后，进入 Langflow **Settings** 确认变量已创建。

从环境读取的全局变量只有 **Name** 和 **Value** 取自环境。若要配置 **Apply To Fields** 等其他选项，可以在 Langflow **Settings** 中编辑这些变量。

从环境读取的全局变量会被指定为 **Credential** 类型，其值在可视化编辑器中遮蔽显示。不过，Langflow 对存入数据库的*所有*全局变量都会自动加密。

## 把全局变量存入 Kubernetes Secret

默认情况下，Langflow 把全局变量加密后存放在自己的 `langflow.db` 数据库中。在 Kubernetes 中运行 Langflow 时，可以改为把全局变量存入 [Kubernetes Secret](https://kubernetes.io/docs/concepts/configuration/secret/)，让敏感凭据完全不进入 Langflow 数据库。

启用 Kubernetes Secret 后，每个用户的全局变量存放在 `langflow` 命名空间下一个专属的 `Opaque` Secret 中，以该用户的 UUID 命名。凭据类变量在 Secret 键名中带 `credential_` 前缀。

### 前置条件

- Langflow 运行在 Kubernetes 集群内。参见 [Kubernetes 部署](https://docs.langflow.org/deployment-kubernetes-dev)。

### 授予 Langflow 管理 Kubernetes Secret 的权限

:::tip
如果用 [Langflow Helm chart](https://github.com/langflow-ai/langflow-helm-charts) 部署，chart 会自动创建 `ServiceAccount`。跳过下面清单中的 `ServiceAccount` 部分，把 `RoleBinding` 的 `subjects[0].name` 设为 Helm 生成的 `ServiceAccount` 名称即可。运行 `kubectl get serviceaccount -n langflow` 可查看该名称。
:::

1. 为 `ServiceAccount`、`Role` 和 `RoleBinding` 资源创建清单文件，保存为 `langflow-rbac.yaml`：

   ```yaml
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: langflow
     namespace: langflow
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     name: langflow-secret-manager
     namespace: langflow
   rules:
     - apiGroups: [""]
       resources: ["secrets"]
       verbs: ["get", "create", "update", "patch", "delete"]
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: langflow-secret-manager
     namespace: langflow
   subjects:
     - kind: ServiceAccount
       name: langflow
       namespace: langflow
   roleRef:
     kind: Role
     name: langflow-secret-manager
     apiGroup: rbac.authorization.k8s.io
   ```

2. 把资源应用到集群：

   ```bash
   kubectl apply -f langflow-rbac.yaml
   ```

3. 在 Deployment 中设置 `serviceAccountName` 和 `LANGFLOW_VARIABLE_STORE` 环境变量：

   ```yaml
   spec:
     serviceAccountName: langflow
     containers:
       - name: langflow
         image: langflowai/langflow:latest
         env:
           - name: LANGFLOW_VARIABLE_STORE
             value: "kubernetes"
   ```

4. 应用更新后的 Deployment，并确认 pod 找到了 service account：

   ```bash
   kubectl apply -f langflow-deployment.yaml
   kubectl describe pod -n langflow -l app.kubernetes.io/name=langflow | grep "Service Account"
   ```

5. 登录 Langflow，进入 **Settings** > **Global Variables**，创建一个全局变量。
6. 确认 Langflow 已创建对应的 Kubernetes Secret：

   ```bash
   kubectl get secrets -n langflow
   ```

   输出中应包含一个以用户 UUID 命名的 Secret。

7. 检查该 Secret 的键，确认变量已存入（把 **YOUR_USER_ID** 替换为用户 UUID）：

   ```bash
   kubectl get secret uuid-YOUR_USER_ID -n langflow -o jsonpath='{.data}' | python3 -m json.tool
   ```

   Credential 类型变量带 `credential_` 前缀，Generic 类型变量直接以变量名作为键。

   :::caution
   不要用 `kubectl` 直接读取或修改 Secret 值。在 Langflow 之外编辑 Secret 可能导致变量无法读取。
   :::

## 禁止从环境读取全局变量

如果想明确阻止 Langflow 从环境读取全局变量，在 `.env` 文件中设置 `LANGFLOW_STORE_ENVIRONMENT_VARIABLES=False`。

## 全局变量缺失时回退到环境变量

如果想为全局变量自动设置回退值，在 `.env` 文件中设置 `LANGFLOW_FALLBACK_TO_ENV_VAR=True`。启用后，找不到某个全局变量时，Langflow 会尝试使用同名的环境变量作为备选。

例如，假设 Langflow 的 `.env` 配置如下，且 Flow 中有一个组件需要 `WATSONX_API_KEY` 全局变量：

```text
LANGFLOW_FALLBACK_TO_ENV_VAR=True

WATSONX_PROJECT_ID=your_project_id

WATSONX_API_KEY=your_api_key
```

运行 Flow 时，如果不存在名为 `WATSONX_API_KEY` 的全局变量，Langflow 会查找名为 `WATSONX_API_KEY` 的环境变量。本例中，Langflow 使用 `.env` 中的 `WATSONX_API_KEY` 值来运行 Flow。

## 下一步

- [环境变量](https://docs.langflow.org/environment-variables)
