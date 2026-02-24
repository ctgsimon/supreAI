// ==================== 配置和常量 ====================
// 全局变量
export const state = {
    editor: null,
    pyodide: null,
    isRunning: false,
    abortController: null
};

// 统计数据
export let stats = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    sessionTokens: 0,
    responseTime: 0
};

// API Keys (存储在 localStorage)
export const apiKeys = {
    openai: localStorage.getItem('openai_key') || '',
    anthropic: localStorage.getItem('anthropic_key') || '',
    domestic: localStorage.getItem('domestic_key') || ''
};

// 代码模板 - 使用翻译 key
export const templates = [
    {
        id: 'basic-chat',
        titleKey: 'template.basicChat.title',
        descKey: 'template.basicChat.desc',
        tag: 'openai',
        code: `# 基础对话示例
from agent_sdk_http import LLM, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 创建 LLM 客户端
llm = LLM(model="deepseek-chat")

# 发送消息
response = llm.chat("你好，请10个字以内介绍一下你自己")
print(response)

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"响应ID: {llm.response_id}")
print(f"创建时间: {llm.created}")
print(f"Token使用: {llm.usage}")
`
    },
    {
        id: 'stream-chat',
        titleKey: 'template.streamChat.title',
        descKey: 'template.streamChat.desc',
        tag: 'openai',
        code: `# 流式输出示例
from agent_sdk_http import LLM, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

llm = LLM(model="deepseek-chat")

# 流式输出
print("🤖 AI: ", end="")
async for chunk in llm.stream("请介绍一下自己"):
    print(chunk, end="", flush=True)
print()  # 换行

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"响应ID: {llm.response_id}")
print(f"Token使用: {llm.usage}")
`
    },
    {
        id: 'multi-turn',
        titleKey: 'template.multiTurn.title',
        descKey: 'template.multiTurn.desc',
        tag: 'openai',
        code: `# 多轮对话示例
from agent_sdk_http import LLM, Conversation, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 创建对话
conv = Conversation(model="deepseek-chat")

# 第一轮
print("👤 用户: 我叫小明")
response1 = conv.chat("我叫小明")
print(f"🤖 AI: {response1}\\n")

# 查看第一轮响应详情
print("--- 第一轮响应详情 ---")
print(f"Token使用: {conv.llm.usage}")

# 第二轮（AI 会记住上文）
print("\\n👤 用户: 我叫什么名字？")
response2 = conv.chat("我叫什么名字？")
print(f"🤖 AI: {response2}")

# 查看第二轮响应详情
print("\\n--- 第二轮响应详情 ---")
print(f"Token使用: {conv.llm.usage}")
`
    },
    {
        id: 'system-prompt',
        titleKey: 'template.systemPrompt.title',
        descKey: 'template.systemPrompt.desc',
        tag: 'openai',
        code: `# 系统提示词示例
from agent_sdk_http import LLM, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 创建一个专业翻译助手
llm = LLM(
    model="deepseek-chat",
    system_prompt="""你是一位专业的中英文翻译专家。
规则：
1. 中文翻译成英文，英文翻译成中文
2. 保持原文的语气和风格
3. 只输出翻译结果，不要解释"""
)

# 测试翻译
text = "人工智能正在改变我们的生活方式"
print(f"原文: {text}")
print(f"翻译: {llm.chat(text)}")

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"Token使用: {llm.usage}")
`
    },
    {
        id: 'agent-mcp',
        titleKey: 'template.agentMCP.title',
        descKey: 'template.agentMCP.desc',
        tag: 'agent',
        code: `# 函数调用示例
from agent_sdk_http import AgentExecute

# 创建 AgentExecute 实例
agent_client = AgentExecute(base_url="http://localhost:5000")

# 准备 MCP 配置
mcp_configs = [
    {
        "name": "map_weather",
        "transport": "sse",
        "url": "https://mcp.map.baidu.com/sse?ak=MNIoKBwbKXvuvYlCu7bLwU6BnLBSe5uo",
        "is_stateful": False
    }
]

# 准备其他参数
model_name = "deepseek-chat"
api_key = "sk-541596b75f97443abf4c1e40a3a6be8c"
ext_config = {
    "client_kwargs": {
        "base_url": "https://api.deepseek.com"
    }
}
user_query = "深圳南山区今天的气温如何"

# 同步调用
response = agent_client.execute(
    user_query=user_query,
    mcp_configs=mcp_configs,
    model_name=model_name,
    api_key=api_key,
    ext_config=ext_config
)
print(response)
`
    },
    {
        id: 'agent-skill',
        titleKey: 'template.agentSkill.title',
        descKey: 'template.agentSkill.desc',
        tag: 'agent',
        code: `# 函数调用示例
from agent_sdk_http import AgentExecute

# 创建 AgentExecute 实例
agent_client = AgentExecute(base_url="http://localhost:5000")

# 准备 skill 配置
agent_skills = ["code-review-expert"]

# 准备其他参数
model_name = "deepseek-chat"
api_key = "sk-541596b75f97443abf4c1e40a3a6be8c"
ext_config = {
    "client_kwargs": {
        "base_url": "https://api.deepseek.com"
    }
}
user_query = """
def get_user(id):
    user = db.query("SELECT * FROM users WHERE id=" + id)
    return user
"""

# 同步调用
response = agent_client.execute(
    user_query=user_query,
    agent_skills=agent_skills,
    model_name=model_name,
    api_key=api_key,
    ext_config=ext_config
)
print(response)
`
    },
    {
        id: 'function-call',
        titleKey: 'template.functionCall.title',
        descKey: 'template.functionCall.desc',
        tag: 'agent',
        code: `# 函数调用示例
from agent_sdk_http import Agent, Tool, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 定义工具函数
def get_weather(city: str) -> str:
    """获取天气信息"""
    # 模拟天气数据
    weather_data = {
        "北京": "晴天, 25°C",
        "上海": "多云, 28°C", 
        "深圳": "雷阵雨, 30°C"
    }
    return weather_data.get(city, f"{city}: 数据暂无")

def calculate(expression: str) -> str:
    """计算数学表达式"""
    try:
        return str(eval(expression))
    except:
        return "计算错误"

# 创建 Agent 并注册工具
agent = Agent(model="deepseek-chat")
agent.add_tool(Tool("get_weather", get_weather, "获取指定城市的天气"))
agent.add_tool(Tool("calculate", calculate, "计算数学表达式"))

# Agent 会自动选择合适的工具
print(agent.run("北京今天天气怎么样？"))
print(agent.run("计算 123 * 456 + 789"))

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"Token使用: {agent.llm.usage}")
`
    },
    {
        id: 'rag-example',
        titleKey: 'template.rag.title',
        descKey: 'template.rag.desc',
        tag: 'agent',
        code: `# RAG 检索增强生成示例
from agent_sdk_http import LLM, VectorStore, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 模拟知识库
knowledge_base = [
    "Agent SDK 是一个用于构建 AI 应用的 Python 框架。",
    "Agent SDK 支持 OpenAI、Claude、通义千问等多种模型。",
    "Agent SDK 提供了工具调用、多轮对话、RAG 等功能。",
    "使用 Agent SDK 只需几行代码即可创建智能对话机器人。",
]

# 创建向量存储
store = VectorStore()
for doc in knowledge_base:
    store.add(doc)

# 创建 LLM
llm = LLM(model="deepseek-chat")

# RAG 问答
question = "Agent SDK 支持哪些模型？"
print(f"❓ 问题: {question}\\n")

# 检索相关文档
relevant_docs = store.search(question, top_k=2)
print("📄 检索到的相关文档:")
for i, doc in enumerate(relevant_docs):
    print(f"   {i+1}. {doc}")

# 生成回答
context = "\\n".join(relevant_docs)
prompt = f"""基于以下知识回答问题：

知识：
{context}

问题：{question}

回答："""

answer = llm.chat(prompt)
print(f"\\n🤖 回答: {answer}")

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"Token使用: {llm.usage}")
print(f"响应ID: {llm.response_id}")
`
    },
    {
        id: 'claude-example',
        titleKey: 'template.claude.title',
        descKey: 'template.claude.desc',
        tag: 'claude',
        code: `# Claude 模型示例
from agent_sdk_http import LLM, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 使用 Claude 模型
llm = LLM(
    model="claude-3-5-sonnet",
    provider="anthropic"
)

# Claude 擅长长文本和复杂推理
response = llm.chat("""
请分析以下代码的时间复杂度，并解释原因：

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
""")

print(response)

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"Token使用: {llm.usage}")
`
    },
    {
        id: 'qwen-example',
        titleKey: 'template.qwen.title',
        descKey: 'template.qwen.desc',
        tag: 'qwen',
        code: `# 通义千问示例
from agent_sdk_http import LLM, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 使用通义千问
llm = LLM(
    model="qwen-plus",
    provider="alibaba"
)

# 中文能力强
response = llm.chat("用文言文写一篇关于人工智能的短文，100字左右")
print(response)

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"Token使用: {llm.usage}")
`
    },
    {
        id: 'parallel-calls',
        titleKey: 'template.parallel.title',
        descKey: 'template.parallel.desc',
        tag: 'agent',
        code: `# 并行调用示例
from agent_sdk_http import LLM, parallel_run, set_api_key

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

# 定义多个任务
tasks = [
    {"model": "deepseek-chat", "prompt": "用一句话解释什么是机器学习"},
    {"model": "deepseek-chat", "prompt": "用一句话解释什么是深度学习"},
    {"model": "deepseek-chat", "prompt": "用一句话解释什么是神经网络"},
]

# 并行执行
print("⚡ 并行调用 3 个任务...\\n")
results = parallel_run(tasks)

for i, result in enumerate(results):
    print(f"任务 {i+1}: {result}\\n")
`
    },
    {
        id: 'json-mode',
        titleKey: 'template.json.title',
        descKey: 'template.json.desc',
        tag: 'openai',
        code: `# JSON 格式输出示例
from agent_sdk_http import LLM, set_api_key
import json

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

llm = LLM(
    model="deepseek-chat",
    response_format={"type": "json"}
)

# 请求结构化数据
response = llm.chat("""
分析以下句子的情感，返回 JSON 格式：
句子："这个产品真的太棒了，我非常喜欢！"

返回格式：
{
    "sentiment": "positive/negative/neutral",
    "confidence": 0.0-1.0,
    "keywords": ["关键词1", "关键词2"]
}
""")

# 解析 JSON
data = json.loads(response)
print(f"情感: {data['sentiment']}")
print(f"置信度: {data['confidence']}")
print(f"关键词: {data['keywords']}")

# 查看响应详情
print("\\n--- 响应详情 ---")
print(f"Token使用: {llm.usage}")
`
    },
    {
        id: 'http-post',
        titleKey: 'template.http.title',
        descKey: 'template.http.desc',
        tag: 'agent',
        code: `# HTTP POST 请求示例
from agent_sdk_http import LLM, set_api_key
import asyncio

# 设置 API 密钥
set_api_key("sk-jZgZe1dz9KAfFJdXJxTsSyu1ipR3GsyIYS8EUk2pLMWwHvmp")

async def main():
    # 创建 LLM 实例
    llm = LLM(model="deepseek-chat")
    
    # 示例: 发送 POST 请求到 JSONPlaceholder
    url = "https://jsonplaceholder.typicode.com/posts"
    data = {
        "title": "测试标题",
        "body": "这是测试内容",
        "userId": 1
    }
    
    print("正在发送 POST 请求...")
    response = await llm.http_post(url, data=data)
    print(f"响应结果:")
    print(f"状态: {'成功' if 'id' in response else '失败'}")
    print(f"数据: {response}")

# 运行异步函数
if __name__ == "__main__":
    asyncio.run(main())
`
    }
];

templates.length = 6;
// Agent SDK 模拟实现
export let agentSDKCode = '';

/**
 * 加载 Agent SDK Python 代码
 */
export async function loadAgentSDKCode() {
    try {
        const response = await fetch('./py/agent_sdk_http.py');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        agentSDKCode = await response.text();
        return agentSDKCode;
    } catch (error) {
        console.error('加载 Agent SDK 代码失败:', error);
        // 如果加载失败，使用默认的空实现
        agentSDKCode = `# 加载失败的默认实现
print("Agent SDK 加载失败")`;
        return agentSDKCode;
    }
}