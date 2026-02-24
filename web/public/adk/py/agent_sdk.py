# ========== Agent SDK v2.0 for LLM ==========
import json
import sys
import asyncio
import js

# 尝试导入 requests，如果在 Pyodide 环境中则使用 pyfetch
_requests_available = False
try:
    import requests
    _requests_available = True
except ImportError:
    try:
        from pyodide.http import pyfetch
    except ImportError:
        pass

# 全局配置
_config = {
    "api_keys": {},
    "temperature": 0.7,
    "max_tokens": 1024,
    "stream": True
}

def set_api_key(provider, key):
    _config["api_keys"][provider] = key

def set_config(**kwargs):
    _config.update(kwargs)

class LLM:
    """大语言模型客户端"""
    
    def __init__(self, model="gpt-4o-mini", provider=None, system_prompt=None, response_format=None):
        self.model = model
        self.provider = provider or self._detect_provider(model)
        self.system_prompt = system_prompt
        self.response_format = response_format
        self.messages = []
        
        if system_prompt:
            self.messages.append({"role": "system", "content": system_prompt})
    
    def _detect_provider(self, model):
        if "gpt" in model:
            return "openai"
        elif "claude" in model:
            return "anthropic"
        elif "qwen" in model:
            return "alibaba"
        elif "glm" in model:
            return "zhipu"
        return "openai"
    
    def chat(self, message):
        """发送消息并获取回复"""
        self.messages.append({"role": "user", "content": message})
        
        # 模拟 LLM 响应
        response = self._mock_response(message)
        
        self.messages.append({"role": "assistant", "content": response})
        return response
    
    def stream(self, message):
        """流式获取回复"""
        self.messages.append({"role": "user", "content": message})
        
        response = self._mock_response(message)
        
        # 模拟流式输出
        words = response.split()
        for i, word in enumerate(words):
            yield word + (" " if i < len(words) - 1 else "")
        
        self.messages.append({"role": "assistant", "content": response})
    
    def _mock_response(self, message):
        """模拟响应 - 实际项目中这里调用真实 API"""
        responses = {
            "default": f"收到您的消息：'{message[:50]}...'。这是 {self.model} 的模拟响应。在实际使用中，这里会调用真实的 API 接口。",
            "介绍": f"我是 {self.model}，一个大型语言模型。我可以帮助您完成各种任务，包括回答问题、写作、编程等。",
            "翻译": "Artificial intelligence is changing the way we live.",
            "天气": "根据您的查询，这是一个需要调用外部 API 的功能。",
            "计算": "这需要使用工具来完成计算。",
        }
        
        # 简单关键词匹配
        for key, resp in responses.items():
            if key in message:
                return resp
        
        # 针对特定问题的模拟响应
        if "时间复杂度" in message or "fibonacci" in message.lower():
            return """这段斐波那契代码的时间复杂度是 O(2^n)。

原因分析：
1. 每次调用 fibonacci(n) 会产生两次递归调用
2. 形成一棵二叉递归树
3. 树的深度为 n，节点总数约为 2^n

这是非常低效的实现，可以通过动态规划或记忆化优化到 O(n)。"""
        
        if "文言文" in message:
            return """《论智机》

夫智机者，人之巧思所造也。能辨文识图，通古博今。虽无血肉之躯，却有思辨之能。或问其理，对答如流；或令其书，文采斐然。然机器终非人，不知喜怒哀乐，惟循程序而行。君子善用之，则利济天下；小人滥用之，则祸患无穷。是以用智机者，当慎之又慎也。"""
        
        if "机器学习" in message and "一句话" in message:
            return "机器学习是让计算机从数据中自动学习规律和模式，无需显式编程。"
        
        if "深度学习" in message and "一句话" in message:
            return "深度学习是机器学习的子领域，通过多层神经网络自动学习数据的层次化特征表示。"
        
        if "神经网络" in message and "一句话" in message:
            return "神经网络是一种模仿生物神经系统结构的计算模型，由大量相互连接的节点组成。"
        
        if "JSON" in message or "json" in message:
            return '{"sentiment": "positive", "confidence": 0.95, "keywords": ["太棒了", "非常喜欢"]}'
        
        return responses["default"]

    async def http_get(self):
        # 1. 使用 JavaScript 的 fetch
        response = await js.fetch('/api/test/get')
        data = await response.text()
        print(data)
    
    async def http_post(self, url='/api/test/post', headers=None, data=None):
        """发送HTTP POST请求
        
        Args:
            url (str): 请求的URL地址
            headers (dict, optional): 请求头信息
            data (dict or str, optional): 请求体数据
        
        Returns:
            dict: 响应结果的JSON数据
        """
        try:
            # 使用 JavaScript 的 fetch
            options = {
                'method': 'POST',
                'headers': headers or {}
            }
            
            if data:
                if isinstance(data, dict):
                    options['body'] = json.dumps(data)
                    options['headers']['Content-Type'] = 'application/json'
                else:
                    options['body'] = data
            
            response = await js.fetch(url, **options)
            
            if not response.ok:
                raise Exception(f"HTTP error! status: {response.status}")
            
            # 尝试解析JSON响应
            try:
                return await response.json()
            except Exception:
                # 如果不是JSON，返回文本
                return await response.text()
        except Exception as e:
            # 处理请求异常
            return {"error": str(e)}


class Conversation:
    """多轮对话管理"""
    
    def __init__(self, model="gpt-4o-mini", system_prompt=None):
        self.llm = LLM(model=model, system_prompt=system_prompt)
        self.history = []
    
    def chat(self, message):
        response = self.llm.chat(message)
        self.history.append({"user": message, "assistant": response})
        return response
    
    def clear(self):
        self.history = []
        self.llm.messages = []


class Tool:
    """工具定义"""
    
    def __init__(self, name, func, description=""):
        self.name = name
        self.func = func
        self.description = description
    
    def execute(self, *args, **kwargs):
        return self.func(*args, **kwargs)


class Agent:
    """智能代理"""
    
    def __init__(self, model="gpt-4o-mini"):
        self.model = model
        self.tools = {}
        self.llm = LLM(model=model)
    
    def add_tool(self, tool):
        self.tools[tool.name] = tool
        return self
    
    def run(self, task):
        print(f"🤖 Agent 收到任务: {task}")
        print(f"   可用工具: {list(self.tools.keys())}")
        
        # 简单的工具匹配逻辑
        for name, tool in self.tools.items():
            if name in task or tool.description in task:
                # 提取参数
                if "天气" in task:
                    for city in ["北京", "上海", "深圳", "广州"]:
                        if city in task:
                            result = tool.execute(city)
                            print(f"   调用工具: {name}({city})")
                            return f"🔧 {result}"
                
                if "计算" in task:
                    import re
                    nums = re.findall(r'[\d+\-*/().]+', task)
                    if nums:
                        expr = ''.join(nums)
                        result = tool.execute(expr)
                        print(f"   调用工具: {name}({expr})")
                        return f"🔧 计算结果: {result}"
        
        # 没有匹配的工具，使用 LLM
        return self.llm.chat(task)


class VectorStore:
    """简单的向量存储（模拟）"""
    
    def __init__(self):
        self.documents = []
    
    def add(self, text):
        self.documents.append(text)
    
    def search(self, query, top_k=2):
        # 简单的关键词匹配（实际应该用向量相似度）
        scored = []
        query_words = set(query.lower().split())
        
        for doc in self.documents:
            doc_words = set(doc.lower().split())
            score = len(query_words & doc_words)
            scored.append((score, doc))
        
        scored.sort(reverse=True, key=lambda x: x[0])
        return [doc for _, doc in scored[:top_k]]


def parallel_run(tasks):
    """并行执行多个任务（模拟）"""
    results = []
    for task in tasks:
        llm = LLM(model=task.get("model", "gpt-4o-mini"))
        result = llm.chat(task.get("prompt", ""))
        results.append(result)
    return results


# 注册模块
from types import ModuleType

agent_sdk = ModuleType('agent_sdk')
agent_sdk.LLM = LLM
agent_sdk.Conversation = Conversation
agent_sdk.Tool = Tool
agent_sdk.Agent = Agent
agent_sdk.VectorStore = VectorStore
agent_sdk.parallel_run = parallel_run
agent_sdk.set_api_key = set_api_key
agent_sdk.set_config = set_config

sys.modules['agent_sdk'] = agent_sdk

# 使用示例：如何调用异步的http_post方法
"""
import asyncio

async def example():
    llm = LLM()
    
    # 定义请求参数
    url = "https://api.example.com/endpoint"
    headers = {"Authorization": "Bearer token123"}
    data = {"key1": "value1", "key2": "value2"}
    
    # 调用异步方法
    response = await llm.http_post(url, headers=headers, data=data)
    print(response)

# 运行异步函数
if __name__ == "__main__":
    asyncio.run(example())
"""