---
title: 组件
description: 组件是构建 Flow 的零件，本页讲添加与配置、端口与颜色、自定义、版本与分组。
sidebar:
  order: 3
---

组件是构建 Flow 的主要零件，每个组件面向某一任务或某一服务。

## 添加与配置

从面板把节点拖进工作区即可放置：

- **Core components**：按角色分组的基础节点（输入/输出、数据等），处理通用行为或多 provider 能力。
- **Bundles**：按服务商分组的集成节点。
- **Legacy**：已弃用的节点，默认隐藏。

放置后设置参数并连接端口。选中节点会打开右侧检视面板，展示包括高级项在内的全部参数。

## 组件头部菜单

选中节点后可见：

- **Code**：编辑节点的底层 Python。
- **Freeze**：停止该节点及其上游节点的重跑。
- **Tool Mode**：把该节点作为工具供 Agent 使用。

Delete、Duplicate 等在 Show More 下。

:::caution
冻结会连带冻结上游节点。适合期望稳定结果、无需重复计算的场景，保存的结果会在后续运行里复用。
:::

## 端口与颜色

节点边缘的小圆点是端口，接收或发出带类型的数据。类型可由所连字段或端口颜色推断；把兼容端口相连即可传递数据。悬停端口看详情，点击可搜索兼容组件。类型不匹配时用 Type Convert 转换。

端口颜色标识数据种类：

| 数据类型 | 颜色 |
| --- | --- |
| JSON | 红 |
| Table | 粉 |
| Embeddings | 翡翠绿 |
| LanguageModel | 品红 |
| Memory | 橙 |
| Message | 靛蓝 |
| Tool | 青 |
| 未知或多类型 | 灰 |

## 自定义组件

所有节点都继承自 `Component` 基类。一个文本切分器示例可以继承父切分类，定义 `chunk_size`、`chunk_overlap` 等整数输入字段，以及 `build_text_splitter` 等方法，用配置好的分隔符构建对象，再把切分结果传给下游。

```python title="自定义组件示意"
class MySplitter(Component):
    inputs = [
        IntInput(name="chunk_size", value=1000),
        DataInput(name="data_input", required=True),
    ]

    def build(self):
        return RecursiveCharacterTextSplitter(chunk_size=self.chunk_size)
```

## 组件版本与分组

添加节点时会在 Flow 里创建一份「分离副本」，保留放置时的版本，不会自动跟随后续升级。编辑时应用会标记过时副本：**Update ready** 表示预计无破坏性变更；**Update available** 表示可能断开输入输出。可单个 Update，或 Review 后批量更新（更新前可先备份）。

多个节点可用 Shift 框选或 Ctrl/Cmd 逐个选中后 **Group**，合并成一个共享名称、代码与设置的单节点，还能另存为自定义节点。

## 另见

- [数据类型](/docs/concepts/data-types/)
- [构建 Flows](/docs/concepts/flows/)
