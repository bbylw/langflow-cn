// Single source of truth for marketing-page taxonomies.
// Imported by index.astro / components.astro so port colors, groups and
// integration slugs stay consistent instead of drifting across pages.

export interface Integration {
  slug: string;
  name: string;
}

export interface Port {
  name: string;
  color: string;
  desc?: string;
}

// Slugs verified against cdn.simpleicons.org. Monochrome mid-gray (#85868D)
// reads on both light and dark canvases.
export const integrations: Integration[] = [
  { slug: "anthropic", name: "Anthropic" },
  { slug: "googlegemini", name: "Google Gemini" },
  { slug: "ollama", name: "Ollama" },
  { slug: "huggingface", name: "Hugging Face" },
  { slug: "mistralai", name: "Mistral" },
  { slug: "langchain", name: "LangChain" },
  { slug: "qdrant", name: "Qdrant" },
  { slug: "supabase", name: "Supabase" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "googlecloud", name: "Google Cloud" },
];

export const ports: Port[] = [
  { name: "Message", color: "#6366F1", desc: "对话消息" },
  { name: "Tool", color: "#06B6D4", desc: "工具调用" },
  { name: "Table", color: "#EC4899", desc: "表格数据" },
  { name: "JSON", color: "#F43F5E", desc: "结构化数据" },
  { name: "Embeddings", color: "#10B981", desc: "向量嵌入" },
];

export interface ComponentGroup {
  name: string;
  icon: string;
  items: string[];
}

export const componentGroups: ComponentGroup[] = [
  { name: "输入与输出", icon: "ph-chat-centered", items: ["Chat Input", "Chat Output", "Text Input", "Data Input"] },
  { name: "数据与检索", icon: "ph-database", items: ["Astra DB", "PgVector", "Pinecone", "Qdrant", "Recursive Splitter", "Parser"] },
  { name: "模型", icon: "ph-brain", items: ["OpenAI", "Anthropic", "Ollama", "Hugging Face", "Azure OpenAI"] },
  { name: "智能体与逻辑", icon: "ph-flow-arrow", items: ["Agent", "Tool Calling Agent", "Sequential Agent", "Loop", "Filter", "If-Else"] },
  { name: "工具与集成", icon: "ph-wrench", items: ["API Request", "Calculator", "Python Code", "MCP Server", "MCP Client"] },
  { name: "记忆与状态", icon: "ph-clock-counter-clockwise", items: ["Chat Memory", "Buffer Memory", "Vector Store Retriever"] },
];
