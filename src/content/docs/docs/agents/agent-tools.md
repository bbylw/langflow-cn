---
title: 为 Agent 配置工具
description: 给 Agent 附加工具：Tool Mode、编辑工具动作、人工审批、自定义组件与将 Flow 或其他 Agent 用作工具。
sidebar:
  order: 2
---

默认情况下，[Langflow agent](https://docs.langflow.org/agents) 只具备其基础 LLM 的内置能力。

给 agent 附加工具，可以接入额外的、有针对性的能力，做出面向特定领域的 agent：能查公司知识库的客服 agent、能取股价的金融 agent、能用高级数学函数解方程的数学辅导 agent，等等。

## 附加工具

把工具接到 agent 的方法：将任意组件的 **Tool** 输出连到 **Agent** 组件的 **Tools** 输入。

部分组件默认就提供 **Tool** 输出；其余组件需要先在[组件头部菜单](/docs/concepts/components/#组件头部菜单)里启用 **Tool Mode**，再连到 agent。

一个 agent 可以连接多个工具，每个工具也可以有多个可供 agent 调用的动作（函数）。

运行 Flow 时，agent 会自行判断何时调用某个工具——前提是它认为该工具有助于回应用户的 prompt。

### 编辑工具动作

组件被接为工具后，它可供调用的动作（函数）列在该工具组件的 **Actions** 列表里。你可以修改每个动作的标签、描述与启用状态，帮助 agent 理解工具的用法，避免它调用无关或多余的动作。

:::tip
如果 agent 的某个工具用得不对，试着编辑动作元数据来澄清工具用途，并禁用不必要的动作。也可以用 **Prompt Template** 组件向 agent 传递额外的指令或示例。
:::

点工具组件上的 **Edit Tool Actions** 即可查看并编辑动作。每个动作包含以下信息：

- **Enabled**：勾选框，决定该动作是否对 agent 可用。勾选即启用，取消勾选即禁用。
- **Name**：动作的人类可读名称，如 `Fetch Content`，不可修改。
- **Description**：动作用途的人类可读描述，如 `Fetch content from web pages recursively`。双击该行打开编辑面板即可修改，点击字段外或关闭对话框时自动保存。
- **Slug**：动作的编码名称，通常与 Name 相同但采用 snake case，如 `fetch_content`。编辑方式同上。

部分动作允许为输入提供固定值。通常留空，让 agent 自己提供；只有在调试 agent 行为、或用例确实需要固定输入时才用固定值。

## 为工具开启人工审批

**Agent** 组件可以在调用受控工具前暂停，创建一个有状态的检查点，等人工决策后再继续。这是给 Flow 加 [Human-in-the-Loop](https://docs.langflow.org/human-in-the-loop) 的一种方式。

例如，你的 agent 负责起草 Python 代码，其中一个工具会提交 Git——只需给提交工具单独开启 **Requires approval**。agent 尝试调用该工具时 Flow 运行暂停，不需要在画布上添加分支节点。

1. 在启用 **Tool Mode** 的前提下，把工具组件连到 **Agent** 组件的 **Tools** 端口。
2. 打开 agent 的工具菜单，为 Git 提交工具开启 **Requires approval**。
3. agent 尝试调用该工具时，运行暂停，直到有人在 **Playground** 里选择 **Approve** 或 **Reject**。

决策结果会存入聊天历史，重新加载 session 时显示的是已裁决的结果，不会再次询问。

## 将 Agent 用作工具

要搭建多 agent Flow，可以把另一个 **Agent** 组件设为 **Tool Mode**，作为主 **Agent** 组件的工具接入。

以 **Simple Agent** 模板为例，试着再加一个 agent：

1. 基于 **Simple Agent** 模板创建一条 Flow。
2. 向 Flow 添加第二个 **Agent** 组件。
3. 给两个 **Agent** 组件都填入 **OpenAI API Key**。
4. 在第二个 **Agent** 组件上把模型改为 `gpt-4.1`，然后启用 **Tool Mode**。
5. 点 **Edit Tool Actions** [编辑工具动作](#编辑工具动作)：把动作的 slug 改为 `Agent-gpt-41`，描述设为 `Use the gpt-4.1 model for complex problem solving`。这等于告诉主 agent：这个工具背后是 `gpt-4.1` 模型，适合需要更大上下文窗口的任务，比如大规模抓取和搜索。

   类似地，你可以把多个面向特定任务或领域训练的专用模型 agent 接到主 agent 上，主 agent 按需调用各自的专长来回答问题。也可以通过启用/禁用工具来控制可用工具集。

6. 把新 agent 的 **Toolset** 端口连到原 agent 的 **Tools** 端口。

## 将自定义组件用作工具

Agent 也可以用[自定义组件](https://docs.langflow.org/components-custom-components)作工具。

1. 在 **Core components** 或 **Bundles** 菜单里点 **New Custom Component**，把自定义组件加进 agent Flow。
2. 在 **Code** 面板里输入 Python 代码创建自定义组件。

   如果还没有现成代码，可以先拿下面这个 Text Analyzer 示例练手，再写自己的：

   ```python title="Text Analyzer 自定义组件"
   from langflow.custom import Component
   from langflow.io import MessageTextInput, Output
   from langflow.schema import Data
   import re


   class TextAnalyzerComponent(Component):
       display_name = "Text Analyzer"
       description = "Analyzes and transforms input text."
       documentation: str = "http://docs.langflow.org/components/custom"
       icon = "chart-bar"
       name = "TextAnalyzerComponent"

       inputs = [
           MessageTextInput(
               name="input_text",
               display_name="Input Text",
               info="Enter text to analyze",
               value="Hello, World!",
               tool_mode=True,
           ),
       ]

       outputs = [
           Output(display_name="Analysis Result", name="output", method="analyze_text"),
       ]

       def analyze_text(self) -> Data:
           text = self.input_text
           # Perform text analysis
           word_count = len(text.split())
           char_count = len(text)
           sentence_count = len(re.findall(r'\w+[.!?]', text))

           # Transform text
           reversed_text = text[::-1]
           uppercase_text = text.upper()

           analysis_result = {
               "original_text": text,
               "word_count": word_count,
               "character_count": char_count,
               "sentence_count": sentence_count,
               "reversed_text": reversed_text,
               "uppercase_text": uppercase_text
           }

           data = Data(value=analysis_result)
           self.status = data
           return data
   ```

3. 在自定义组件上启用 **Tool Mode**。
4. 把自定义组件的工具输出连到 **Agent** 组件的 **Tools** 输入。
5. 打开 **Playground**，指示 agent：`Use the text analyzer on this text: "Agents really are thinking machines!"`

   按这条指令，agent 应调用 `analyze_text` 动作并返回结果，例如：

   ```
   gpt-4o
   Finished
   0.6s
   Here is the analysis of the text "Agents really are thinking machines!":
   Original Text: Agents really are thinking machines!
   Word Count: 5
   Character Count: 36
   Sentence Count: 1
   Reversed Text: !senihcam gnikniht era yllaer stnegA
   Uppercase Text: AGENTS REALLY ARE THINKING MACHINES!
   ```

## 把任意组件变成工具

如果目标组件没有 **Tool Mode** 按钮，可以在它的某个输入上加 `tool_mode=True`，再把新出现的 **Toolset** 输出连到 agent 的 **Tools** 输入。

Langflow 支持为以下数据类型的输入启用 **Tool Mode**：

- `DataInput`
- `DataFrameInput`
- `PromptInput`
- `MessageTextInput`
- `MultilineInput`
- `DropdownInput`

例如，上文[自定义组件](#将自定义组件用作工具)就给 `MessageTextInput` 输入加了 `tool_mode=True`，使它可以被当作工具：

```python
inputs = [
    MessageTextInput(
        name="input_text",
        display_name="Input Text",
        info="Enter text to analyze",
        value="Hello, World!",
        tool_mode=True,
    ),
]
```

## 将 Flow 用作工具

Agent 可以用 [**Run Flow** 组件](https://docs.langflow.org/run-flow)把你的其他 Flow 当作工具。

1. 向 Flow 添加 **Run Flow** 组件。
2. 选择要让 agent 当工具用的 Flow。
3. 启用 **Tool Mode**，所选 Flow 会变成 **Run Flow** 组件里的一个[动作](#编辑工具动作)。
4. 把 **Run Flow** 组件的 **Tool** 输出连到 **Agent** 组件的 **Tools** 输入。
5. 打开 **Playground**，问 agent：`What tools are you using to answer my questions?` 回复里应该能看到你的 Flow 已列为可用工具。
6. 再问一个明确要用这条 Flow 才能回答的问题，返回的答案就来自这条 Flow。

## 另见

- [Human-in-the-Loop](https://docs.langflow.org/human-in-the-loop)
- [Agent 组件](https://docs.langflow.org/components-agents)
- [把 Langflow 用作 MCP client](https://docs.langflow.org/mcp-client)
- [把 Langflow 用作 MCP server](https://docs.langflow.org/mcp-server)
