# ========== Agent SDK v2.0 for LLM (HTTP 实际调用版) ==========
import json
import sys
import asyncio

# 尝试导入 requests 和 js 模块
_requests_available = False
try:
    import requests
    _requests_available = True
except ImportError:
    pass

try:
    import js
except ImportError:
    js = None
try:
    from pyodide.http import pyfetch
except ImportError:
    pyfetch = None

# 全局配置
_config = {
    "api_key": "",
    "temperature": 0.7,
    "max_tokens": 1024,
    "stream": True
}

def set_api_key(key):
    """设置 API 密钥"""
    _config["api_key"] = key

def set_config(**kwargs):
    """设置全局配置"""
    _config.update(kwargs)

class LLM:
    """大语言模型客户端（实际 HTTP 调用）"""
    
    def __init__(self, model="gpt-4o-mini", provider=None, system_prompt=None, response_format=None):
        """初始化 LLM 客户端
        
        Args:
            model (str): 模型名称，默认 "gpt-4o-mini"
            provider (str): 模型提供商，默认根据模型名称自动检测
            system_prompt (str, optional): 系统提示词
            response_format (dict, optional): 响应格式设置
        """
        self.model = model
        self.provider = provider or self._detect_provider(model)
        self.system_prompt = system_prompt
        self.response_format = response_format
        self.messages = []
        
        # 响应相关属性
        self.last_response = None
        self.response_id = None
        self.response_object = None
        self.created = None
        self.usage = {}
        self.system_fingerprint = None
        self.tool_calls = []
        self.reasoning_content = None
        
        if system_prompt:
            self.messages.append({"role": "system", "content": system_prompt})
    
    def _detect_provider(self, model):
        """根据模型名称检测提供商
        
        Args:
            model (str): 模型名称
            
        Returns:
            str: 提供商名称
        """
        if "gpt" in model:
            return "openai"
        elif "claude" in model:
            return "anthropic"
        elif "qwen" in model:
            return "alibaba"
        elif "glm" in model:
            return "zhipu"
        return "openai"
    
    def _parse_sse_response(self, response_text):
        """解析 SSE 格式的响应并处理流式输出
        
        Args:
            response_text (str): 完整的 SSE 响应文本
        
        Yields:
            str: 流式返回的文本片段
        """
        import json
        
        # 初始化完整响应内容
        full_content = ""
        
        # 将响应拆分为行
        lines = response_text.split('\n')
        
        # 处理每一行
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # 检查是否是数据行
            if line.startswith('data:'):
                # 提取数据部分
                data_part = line[5:].strip()
                
                # 跳过 [DONE] 标记
                if data_part == '[DONE]':
                    continue
                
                try:
                    # 解析 JSON 数据
                    chunk = json.loads(data_part)
                    
                    # 提取基本响应信息（只需要提取一次）
                    if not self.response_id and "id" in chunk:
                        self.response_id = chunk.get("id")
                        self.response_object = chunk.get("object")
                        self.created = chunk.get("created")
                        if "model" in chunk:
                            self.model = chunk["model"]  # 更新使用的模型
                        self.system_fingerprint = chunk.get("system_fingerprint")
                    
                    # 处理 choices 数组
                    if "choices" in chunk and isinstance(chunk["choices"], list):
                        for i, choice in enumerate(chunk["choices"]):
                            if i == 0:  # 只处理第一个 choice
                                # 检查是否有 delta
                                if "delta" in choice:
                                    delta = choice["delta"]
                                    
                                    # 提取内容片段
                                    if "content" in delta and delta["content"] is not None:
                                        content_chunk = delta["content"]
                                        full_content += content_chunk
                                        
                                        # 直接 yield 内容片段
                                        yield content_chunk
                                
                                # 检查是否有 usage 信息（通常在最后一个 chunk）
                                if "usage" in chunk:
                                    self.usage = chunk["usage"]
                except json.JSONDecodeError:
                    # 如果 JSON 解析失败，跳过该行
                    continue
        
        # 构建完整的 assistant 消息
        if full_content:
            assistant_msg = {"role": "assistant", "content": full_content}
            self.messages.append(assistant_msg)
        
        # 如果没有内容，生成错误信息
        if not full_content:
            error_msg = "请求完成但没有返回有效内容"
            yield error_msg
            self.messages.append({"role": "assistant", "content": error_msg})
    
    def chat(self, message):
        """发送消息并获取回复（同步）
        
        Args:
            message (str): 用户消息内容
            
        Returns:
            str: 模型回复内容
            
        额外属性（请求后可用）：
            self.last_response: 完整的API响应对象
            self.response_id: 响应ID
            self.response_object: 响应对象类型
            self.created: 响应创建时间戳
            self.usage: token使用统计信息
            self.system_fingerprint: 系统指纹
            self.tool_calls: 工具调用列表
            self.reasoning_content: 推理内容
        """
        self.messages.append({"role": "user", "content": message})
        
        # 构建请求数据
        request_data = {
            "model": self.model,
            "messages": self.messages,
            "temperature": _config["temperature"],
            "max_tokens": _config["max_tokens"],
            "stream": False
        }
        
        # 添加响应格式（如果有）
        if self.response_format:
            request_data["response_format"] = self.response_format
        
        # 发送 HTTP 请求
        try:
            # 检查是否在 Pyodide 环境中
            if pyfetch is not None:
                # 在 Pyodide 环境中，使用专门的同步 HTTP 请求实现
                import js
                import json
                
                # 创建 XMLHttpRequest 对象（同步）
                xhr = js.XMLHttpRequest.new()
                xhr.open("POST", "/v1/chat/completions", False)  # 第三个参数设为 False 表示同步请求
                
                # 设置请求头
                xhr.setRequestHeader("Authorization", f"Bearer {_config['api_key']}")
                xhr.setRequestHeader("Content-Type", "application/json")
                
                # 发送请求
                xhr.send(json.dumps(request_data))
                
                # 处理响应
                if xhr.status >= 200 and xhr.status < 300:
                    # 尝试解析 JSON 响应
                    try:
                        response = json.loads(xhr.responseText)
                    except ValueError:
                        # 如果不是 JSON，返回文本
                        response = xhr.responseText
                else:
                    # 处理错误
                    response = {"error": f"HTTP error! status: {xhr.status}, message: {xhr.responseText}"}
            else:
                # 非 Pyodide 环境的常规处理
                loop = asyncio.get_event_loop()
                response = loop.run_until_complete(self.http_post(
                    url="/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {_config['api_key']}",
                        "Content-Type": "application/json"
                    },
                    data=request_data
                ))
        except Exception as e:
            # 捕获并返回异常信息
            response = {"error": str(e)}
        
        # 存储完整响应
        self.last_response = response
        
        # 初始化响应属性
        self.response_id = None
        self.response_object = None
        self.created = None
        self.usage = {}
        self.system_fingerprint = None
        self.tool_calls = []
        self.reasoning_content = None
        
        # 解析响应
        if isinstance(response, dict):
            # 提取基本响应信息
            self.response_id = response.get("id")
            self.response_object = response.get("object")
            self.created = response.get("created")
            if "model" in response:
                self.model = response["model"]  # 更新使用的模型
            self.usage = response.get("usage", {})
            self.system_fingerprint = response.get("system_fingerprint")
            
            # 处理choices数组
            if "choices" in response and isinstance(response["choices"], list):
                for i, choice in enumerate(response["choices"]):
                    # 处理第一个choice作为主要回复
                    if i == 0 and "message" in choice:
                        message_data = choice["message"]
                        
                        # 提取assistant响应内容
                        if "content" in message_data and message_data["content"] is not None:
                            assistant_response = message_data["content"]
                            
                            # 构建完整的assistant消息
                            assistant_msg = {"role": "assistant", "content": assistant_response}
                            
                            # 处理其他消息字段
                            if "name" in message_data:
                                assistant_msg["name"] = message_data["name"]
                            
                            # 处理tool_calls
                            if "tool_calls" in message_data and message_data["tool_calls"]:
                                assistant_msg["tool_calls"] = message_data["tool_calls"]
                                self.tool_calls = message_data["tool_calls"]
                            
                            # 处理tool_call_id
                            if "tool_call_id" in message_data:
                                assistant_msg["tool_call_id"] = message_data["tool_call_id"]
                            
                            # 处理reasoning_content
                            if "reasoning_content" in message_data:
                                assistant_msg["reasoning_content"] = message_data["reasoning_content"]
                                self.reasoning_content = message_data["reasoning_content"]
                            
                            # 添加到消息历史
                            self.messages.append(assistant_msg)
                            
                            return assistant_response
                        
                        # 处理没有content但有finish_reason的情况
                        elif "finish_reason" in choice:
                            error_msg = f"请求完成但没有内容，原因: {choice['finish_reason']}"
                            self.messages.append({"role": "assistant", "content": error_msg})
                            return error_msg
            
            # 处理没有有效choices的情况
            error_msg = f"请求成功但没有返回有效结果: {response}"
            self.messages.append({"role": "assistant", "content": error_msg})
            return error_msg
        else:
            # 处理错误响应
            error_msg = f"请求失败: {response}"
            self.messages.append({"role": "assistant", "content": error_msg})
            return error_msg
    
    async def stream(self, message):
        """流式获取回复
        
        Args:
            message (str): 用户消息内容
            
        Yields:
            str: 流式返回的文本片段
            
        额外属性（请求后可用）：
            self.last_response: 完整的API响应对象
            self.response_id: 响应ID
            self.response_object: 响应对象类型
            self.created: 响应创建时间戳
            self.usage: token使用统计信息
            self.system_fingerprint: 系统指纹
            self.tool_calls: 工具调用列表
            self.reasoning_content: 推理内容
        """
        self.messages.append({"role": "user", "content": message})
        
        # 构建请求数据
        request_data = {
            "model": self.model,
            "messages": self.messages,
            "temperature": _config["temperature"],
            "max_tokens": _config["max_tokens"],
            "stream": True
        }
        
        # 添加响应格式（如果有）
        if self.response_format:
            request_data["response_format"] = self.response_format
        
        # 初始化响应属性
        self.response_id = None
        self.response_object = None
        self.created = None
        self.usage = {}
        self.system_fingerprint = None
        self.tool_calls = []
        self.reasoning_content = None
        
        # 发送 HTTP 请求获取响应
        try:
            # 检查是否在 Pyodide 环境中
            if js is not None:
                # 在 Pyodide 环境中，修改 js window 的变量
                js.window.streamOut = 'true'

            # 检查是否在 Pyodide 环境中
            if pyfetch is not None:
                # 在 Pyodide 环境中，使用 fetch API 处理异步流式响应
                import json
                
                try:
                    # 构建请求头（使用 JavaScript Headers 对象）
                    headers = js.Headers.new()
                    headers.append("Authorization", f"Bearer {_config['api_key']}")
                    headers.append("Content-Type", "application/json")
                    
                    # 发送异步请求（直接传递参数）
                    response = await js.fetch(
                        "/v1/chat/completions",
                        method="POST",
                        headers=headers,
                        body=json.dumps(request_data)
                    )
                    
                    if not response.ok:
                        # 处理错误响应
                        error_msg = f"HTTP error! status: {response.status}"
                        yield error_msg
                        self.messages.append({"role": "assistant", "content": error_msg})
                        self.usage = {}
                        self.tool_calls = []
                        self.reasoning_content = None
                        return
                    
                    # 获取响应体的 ReadableStream
                    reader = response.body.getReader()
                    decoder = js.TextDecoder.new()
                    buffer = ""
                    
                    # 初始化完整响应内容
                    full_content = ""
                    
                    # 循环读取流数据
                    while True:
                        result = await reader.read()
                        if result.done:
                            # 流读取完成
                            break
                        
                        # 解码当前数据块
                        chunk = decoder.decode(result.value, {"stream": True})

                        buffer += chunk
                        
                        # 处理缓冲区中的完整行
                        while "\n" in buffer:
                            line, buffer = buffer.split("\n", 1)
                            line = line.strip()
                            
                            if not line:
                                continue
                            
                            # 检查是否是数据行
                            if line.startswith("data:"):
                                # 提取数据部分
                                data_part = line[5:].strip()
                                
                                # 跳过 [DONE] 标记
                                if data_part == "[DONE]":
                                    continue
                                
                                try:
                                    # 解析 JSON 数据
                                    chunk_data = json.loads(data_part)


                                    
                                    # 提取基本响应信息（只需要提取一次）
                                    if not self.response_id and "id" in chunk_data:
                                        self.response_id = chunk_data.get("id")
                                        self.response_object = chunk_data.get("object")
                                        self.created = chunk_data.get("created")
                                        if "model" in chunk_data:
                                            self.model = chunk_data["model"]  # 更新使用的模型
                                        self.system_fingerprint = chunk_data.get("system_fingerprint")
                                    
                                    # 处理 choices 数组
                                    if "choices" in chunk_data and isinstance(chunk_data["choices"], list):
                                        for i, choice in enumerate(chunk_data["choices"]):
                                            if i == 0:  # 只处理第一个 choice
                                                # 检查是否有 delta
                                                if "delta" in choice:
                                                    delta = choice["delta"]
                                                    
                                                    # 提取内容片段
                                                    if "content" in delta and delta["content"] is not None:
                                                        content_chunk = delta["content"]
                                                        full_content += content_chunk
                                                        
                                                        # 立即 yield 内容片段
                                                        yield content_chunk
                                                
                                                # 检查是否有 usage 信息（通常在最后一个 chunk）
                                                if "usage" in chunk_data:
                                                    self.usage = chunk_data["usage"]
                                except json.JSONDecodeError:
                                    # 如果 JSON 解析失败，跳过该行
                                    continue
                    
                    # 构建完整的 assistant 消息
                    if full_content:
                        assistant_msg = {"role": "assistant", "content": full_content}
                        self.messages.append(assistant_msg)
                    
                    # 如果没有内容，生成错误信息
                    if not full_content:
                        error_msg = "请求完成但没有返回有效内容"
                        yield error_msg
                        self.messages.append({"role": "assistant", "content": error_msg})
                except Exception as e:
                    # 捕获并返回异常信息
                    error_msg = f"请求失败: {str(e)}"
                    yield error_msg
                    self.messages.append({"role": "assistant", "content": error_msg})
                    self.usage = {}
                    self.tool_calls = []
                    self.reasoning_content = None
            else:
                # 非 Pyodide 环境的常规处理
                import json
                
                # 发送请求并获取响应
                response = await self.http_post(
                    url="/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {_config['api_key']}",
                        "Content-Type": "application/json"
                    },
                    data=request_data
                )
                
                # 检查响应类型
                if isinstance(response, dict) and "error" in response:
                    # 处理错误响应
                    error_msg = f"请求失败: {response['error']}"
                    yield error_msg
                    self.messages.append({"role": "assistant", "content": error_msg})
                    self.usage = {}
                    self.tool_calls = []
                    self.reasoning_content = None
                elif hasattr(response, 'iter_lines'):
                    # 流式响应处理
                    full_content = ""
                    
                    # 逐行处理响应
                    for line in response.iter_lines():
                        if line:
                            # 解码行数据
                            line = line.decode('utf-8').strip()
                            
                            # 检查是否是数据行
                            if line.startswith('data:'):
                                # 提取数据部分
                                data_part = line[5:].strip()
                                
                                # 跳过 [DONE] 标记
                                if data_part == '[DONE]':
                                    continue
                                
                                try:
                                    # 解析 JSON 数据
                                    chunk_data = json.loads(data_part)
                                    
                                    # 提取基本响应信息（只需要提取一次）
                                    if not self.response_id and "id" in chunk_data:
                                        self.response_id = chunk_data.get("id")
                                        self.response_object = chunk_data.get("object")
                                        self.created = chunk_data.get("created")
                                        if "model" in chunk_data:
                                            self.model = chunk_data["model"]  # 更新使用的模型
                                        self.system_fingerprint = chunk_data.get("system_fingerprint")
                                    
                                    # 处理 choices 数组
                                    if "choices" in chunk_data and isinstance(chunk_data["choices"], list):
                                        for i, choice in enumerate(chunk_data["choices"]):
                                            if i == 0:  # 只处理第一个 choice
                                                # 检查是否有 delta
                                                if "delta" in choice:
                                                    delta = choice["delta"]
                                                    
                                                    # 提取内容片段
                                                    if "content" in delta and delta["content"] is not None:
                                                        content_chunk = delta["content"]
                                                        full_content += content_chunk
                                                        
                                                        # 立即 yield 内容片段
                                                        yield content_chunk
                                                
                                                # 检查是否有 usage 信息（通常在最后一个 chunk）
                                                if "usage" in chunk_data:
                                                    self.usage = chunk_data["usage"]
                                except json.JSONDecodeError:
                                    # 如果 JSON 解析失败，跳过该行
                                    continue
                    
                    # 构建完整的 assistant 消息
                    if full_content:
                        assistant_msg = {"role": "assistant", "content": full_content}
                        self.messages.append(assistant_msg)
                    
                    # 如果没有内容，生成错误信息
                    if not full_content:
                        error_msg = "请求完成但没有返回有效内容"
                        yield error_msg
                        self.messages.append({"role": "assistant", "content": error_msg})
                else:
                    # 非流式响应处理
                    response_text = response
                    if isinstance(response_text, str):
                        for chunk in self._parse_sse_response(response_text):
                            yield chunk
                    else:
                        # 处理非字符串响应
                        error_msg = f"请求失败: {response_text}"
                        yield error_msg
                        self.messages.append({"role": "assistant", "content": error_msg})
                        self.usage = {}
                        self.tool_calls = []
                        self.reasoning_content = None
        except Exception as e:
            # 捕获并返回异常信息
            error_msg = f"请求失败: {str(e)}"
            yield error_msg
            self.messages.append({"role": "assistant", "content": error_msg})
            self.usage = {}
            self.tool_calls = []
            self.reasoning_content = None
        finally:
            if js is not None:
                js.window.streamOut = 'false'
    
    async def http_get(self, url):
        """发送 HTTP GET 请求
        
        Args:
            url (str): 请求的 URL 地址
            
        Returns:
            dict or str: 响应结果
        """
        # 使用 requests 库（如果可用）
        if _requests_available:
            try:
                response = requests.get(url)
                response.raise_for_status()
                try:
                    return response.json()
                except Exception:
                    return response.text
            except Exception as e:
                return {"error": str(e)}
        
        # 使用 js.fetch（如果在 Pyodide 环境中）
        elif js is not None:
            try:
                # 构建请求头（使用 JavaScript Headers 对象）
                js_headers = js.Headers.new()
                
                # 准备请求选项
                fetch_options = {
                    'method': 'GET',
                    'headers': js_headers
                }
                
                response = await js.fetch(url, fetch_options)
                
                if not response.ok:
                    raise Exception(f"HTTP error! status: {response.status}")
                
                # 尝试解析 JSON 响应
                try:
                    return await response.json()
                except Exception:
                    # 如果不是 JSON，返回文本
                    return await response.text()
            except Exception as e:
                return {"error": str(e)}
        
        # 没有可用的 HTTP 客户端
        else:
            return {"error": "No HTTP client available. Please install requests or run in a Pyodide environment."}
    
    async def http_post(self, url='/api/test/post', headers=None, data=None):
        """发送 HTTP POST 请求
        
        Args:
            url (str): 请求的 URL 地址
            headers (dict, optional): 请求头信息
            data (dict or str, optional): 请求体数据
            
        Returns:
            dict or str or response object: 响应结果，如果是流式请求返回响应对象
        """
        # 检查是否需要流式响应
        stream_requested = False
        if data and isinstance(data, dict) and data.get('stream'):
            stream_requested = True
        
        # 使用 requests 库（如果可用）
        if _requests_available:
            try:
                # 准备请求参数
                req_headers = headers or {}
                req_data = data
                
                if data and isinstance(data, dict):
                    req_data = json.dumps(data)
                    if 'Content-Type' not in req_headers:
                        req_headers['Content-Type'] = 'application/json'
                
                # 发送请求
                response = requests.post(url, headers=req_headers, data=req_data, stream=stream_requested)
                response.raise_for_status()
                
                if stream_requested:
                    # 流式响应处理
                    return response
                else:
                    # 非流式响应处理
                    try:
                        return response.json()
                    except Exception:
                        return response.text
            except Exception as e:
                return {"error": str(e)}
        
        # 使用 pyfetch（Pyodide 推荐的 HTTP 客户端）
        elif pyfetch is not None:
            try:
                options = {
                    'method': 'POST',
                    'headers': headers or {}
                }
                
                if data:
                    if isinstance(data, dict):
                        options['body'] = json.dumps(data)
                        if 'Content-Type' not in options['headers']:
                            options['headers']['Content-Type'] = 'application/json'
                    else:
                        options['body'] = data
                
                response = await pyfetch(url, **options)
                
                if not response.ok:
                    raise Exception(f"HTTP error! status: {response.status}")
                
                if stream_requested:
                    # 返回原始响应对象以便流式处理
                    return response
                else:
                    # 非流式响应处理
                    try:
                        return await response.json()
                    except Exception:
                        # 如果不是 JSON，返回文本
                        return await response.text()
            except Exception as e:
                return {"error": str(e)}
        
        # 使用 js.fetch 作为备用方案（如果 pyfetch 不可用但 js 可用）
        elif js is not None:
            try:
                # 构建请求头（使用 JavaScript Headers 对象）
                js_headers = js.Headers.new()
                
                # 添加传入的请求头
                if headers:
                    for key, value in headers.items():
                        js_headers.append(key, value)
                
                # 准备其他选项
                fetch_options = {
                    'method': 'POST',
                    'headers': js_headers
                }
                
                if data:
                    if isinstance(data, dict):
                        fetch_options['body'] = json.dumps(data)
                        if 'Content-Type' not in headers:
                            js_headers.append('Content-Type', 'application/json')
                    else:
                        fetch_options['body'] = data
                
                response = await js.fetch(url, fetch_options)
                
                if not response.ok:
                    raise Exception(f"HTTP error! status: {response.status}")
                
                if stream_requested:
                    # 返回原始响应对象以便流式处理
                    return response
                else:
                    # 尝试解析 JSON 响应
                    try:
                        return await response.json()
                    except Exception:
                        # 如果不是 JSON，返回文本
                        return await response.text()
            except Exception as e:
                return {"error": str(e)}
        
        # 没有可用的 HTTP 客户端
        else:
            return {"error": "No HTTP client available. Please install requests or run in a Pyodide environment."}


class Conversation:
    """多轮对话管理"""
    
    def __init__(self, model="gpt-4o-mini", system_prompt=None):
        """初始化对话管理器
        
        Args:
            model (str): 模型名称
            system_prompt (str, optional): 系统提示词
        """
        self.llm = LLM(model=model, system_prompt=system_prompt)
        self.history = []
    
    def chat(self, message):
        """发送消息并获取回复
        
        Args:
            message (str): 用户消息内容
            
        Returns:
            str: 模型回复内容
        """
        response = self.llm.chat(message)
        self.history.append({"user": message, "assistant": response})
        return response
    
    def clear(self):
        """清空对话历史"""
        self.history = []
        self.llm.messages = []


class Tool:
    """工具定义"""
    
    def __init__(self, name, func, description=""):
        """初始化工具
        
        Args:
            name (str): 工具名称
            func (callable): 工具函数
            description (str, optional): 工具描述
        """
        self.name = name
        self.func = func
        self.description = description
    
    def execute(self, *args, **kwargs):
        """执行工具
        
        Args:
            *args: 位置参数
            **kwargs: 关键字参数
            
        Returns:
            工具执行结果
        """
        return self.func(*args, **kwargs)


class Agent:
    """智能代理"""
    
    def __init__(self, model="gpt-4o-mini"):
        """初始化智能代理
        
        Args:
            model (str): 模型名称
        """
        self.model = model
        self.tools = {}
        self.llm = LLM(model=model)
    
    def add_tool(self, tool):
        """添加工具
        
        Args:
            tool (Tool): 工具对象
            
        Returns:
            Agent: 代理对象（支持链式调用）
        """
        self.tools[tool.name] = tool
        return self
    
    def run(self, task):
        """运行任务
        
        Args:
            task (str): 任务描述
            
        Returns:
            str: 任务执行结果
        """
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


class AgentExecute:
    """Agent 执行接口客户端"""
    
    def __init__(self, base_url="http://localhost:5000"):
        """初始化 Agent 执行接口客户端
        
        Args:
            base_url (str): 接口基础 URL，默认 "http://localhost:5000"
        """
        self.base_url = base_url.rstrip('/')
        self.api_path = "/api/agent/execute"
        self.full_url = f"{self.base_url}{self.api_path}"
        self.last_response = None
    
    def execute(self, user_query, mcp_configs=None, agent_skills=None, model_name=None, api_key=None, ext_config=None):
        """执行 Agent 任务（同步）
        
        Args:
            user_query (str): 用户查询内容
            mcp_configs (list, optional): MCP 配置列表
            agent_skills (list, optional): Agent 技能列表
            model_name (str, optional): 模型名称
            api_key (str, optional): API 密钥
            ext_config (dict, optional): 扩展配置
            
        Returns:
            dict or str: 接口响应结果
        """
        # 构建请求数据
        request_data = {
            "user_query": user_query
        }
        
        # 添加可选参数
        if mcp_configs is not None:
            request_data["mcp_configs"] = mcp_configs
        if agent_skills is not None:
            request_data["agent_skills"] = agent_skills
        if model_name is not None:
            request_data["model_name"] = model_name
        if api_key is not None:
            request_data["api_key"] = api_key
        if ext_config is not None:
            request_data["ext_config"] = ext_config
        
        # 发送 HTTP 请求
        try:
            # 检查是否在 Pyodide 环境中
            if pyfetch is not None:
                # 在 Pyodide 环境中，使用专门的同步 HTTP 请求实现
                import js
                import json
                
                # 创建 XMLHttpRequest 对象（同步）
                xhr = js.XMLHttpRequest.new()
                xhr.open("POST", self.full_url, False)  # 第三个参数设为 False 表示同步请求
                
                # 设置请求头
                xhr.setRequestHeader("Content-Type", "application/json")
                
                # 发送请求
                xhr.send(json.dumps(request_data))
                
                # 处理响应
                if xhr.status >= 200 and xhr.status < 300:
                    # 尝试解析 JSON 响应
                    try:
                        response = json.loads(xhr.responseText)
                        # 提取 result 字段
                        if response['status'] == 'success':
                            response = response["result"]["result"]
                        else:
                            response = response["message"]
                    except ValueError:
                        # 如果不是 JSON，返回文本
                        response = xhr.responseText
                else:
                    # 处理错误
                    response = {"error": f"HTTP error! status: {xhr.status}, message: {xhr.responseText}"}
            else:
                # 非 Pyodide 环境的常规处理
                loop = asyncio.get_event_loop()
                response = loop.run_until_complete(self.http_post(
                    url=self.full_url,
                    headers={
                        "Content-Type": "application/json"
                    },
                    data=request_data
                ))
        except Exception as e:
            # 捕获并返回异常信息
            response = {"error": str(e)}
        
        # 存储完整响应
        self.last_response = response
        
        return response
    
    async def execute_async(self, user_query, mcp_configs=None, agent_skills=None, model_name=None, api_key=None, ext_config=None):
        """执行 Agent 任务（异步）
        
        Args:
            user_query (str): 用户查询内容
            mcp_configs (list, optional): MCP 配置列表
            agent_skills (list, optional): Agent 技能列表
            model_name (str, optional): 模型名称
            api_key (str, optional): API 密钥
            ext_config (dict, optional): 扩展配置
            
        Returns:
            dict or str: 接口响应结果
        """
        # 构建请求数据
        request_data = {
            "user_query": user_query
        }
        
        # 添加可选参数
        if mcp_configs is not None:
            request_data["mcp_configs"] = mcp_configs
        if agent_skills is not None:
            request_data["agent_skills"] = agent_skills
        if model_name is not None:
            request_data["model_name"] = model_name
        if api_key is not None:
            request_data["api_key"] = api_key
        if ext_config is not None:
            request_data["ext_config"] = ext_config
        
        # 发送 HTTP 请求
        try:
            # 使用通用的异步 HTTP POST 方法
            response = await self.http_post(
                url=self.full_url,
                headers={
                    "Content-Type": "application/json"
                },
                data=request_data
            )
        except Exception as e:
            # 捕获并返回异常信息
            response = {"error": str(e)}
        
        # 存储完整响应
        self.last_response = response
        
        return response
    
    async def http_post(self, url, headers=None, data=None):
        """发送 HTTP POST 请求（内部使用）
        
        Args:
            url (str): 请求的 URL 地址
            headers (dict, optional): 请求头信息
            data (dict or str, optional): 请求体数据
            
        Returns:
            dict or str: 响应结果
        """
        # 使用 requests 库（如果可用）
        if _requests_available:
            try:
                # 准备请求参数
                req_headers = headers or {}
                req_data = data
                
                if data and isinstance(data, dict):
                    req_data = json.dumps(data)
                    if 'Content-Type' not in req_headers:
                        req_headers['Content-Type'] = 'application/json'
                
                # 发送请求
                response = requests.post(url, headers=req_headers, data=req_data)
                response.raise_for_status()
                
                # 处理响应
                try:
                    return response.json()
                except Exception:
                    return response.text
            except Exception as e:
                return {"error": str(e)}
        
        # 使用 pyfetch（Pyodide 推荐的 HTTP 客户端）
        elif pyfetch is not None:
            try:
                options = {
                    'method': 'POST',
                    'headers': headers or {}
                }
                
                if data:
                    if isinstance(data, dict):
                        options['body'] = json.dumps(data)
                        if 'Content-Type' not in options['headers']:
                            options['headers']['Content-Type'] = 'application/json'
                    else:
                        options['body'] = data
                
                response = await pyfetch(url, **options)
                
                if not response.ok:
                    raise Exception(f"HTTP error! status: {response.status}")
                
                # 处理响应
                try:
                    return await response.json()
                except Exception:
                    return await response.text()
            except Exception as e:
                return {"error": str(e)}
        
        # 使用 js.fetch 作为备用方案（如果 pyfetch 不可用但 js 可用）
        elif js is not None:
            try:
                # 构建请求头（使用 JavaScript Headers 对象）
                js_headers = js.Headers.new()
                
                # 添加传入的请求头
                if headers:
                    for key, value in headers.items():
                        js_headers.append(key, value)
                
                # 准备其他选项
                fetch_options = {
                    'method': 'POST',
                    'headers': js_headers
                }
                
                if data:
                    if isinstance(data, dict):
                        fetch_options['body'] = json.dumps(data)
                        if 'Content-Type' not in headers:
                            js_headers.append('Content-Type', 'application/json')
                    else:
                        fetch_options['body'] = data
                
                response = await js.fetch(url, fetch_options)
                
                if not response.ok:
                    raise Exception(f"HTTP error! status: {response.status}")
                
                # 处理响应
                try:
                    return await response.json()
                except Exception:
                    return await response.text()
            except Exception as e:
                return {"error": str(e)}
        
        # 没有可用的 HTTP 客户端
        else:
            return {"error": "No HTTP client available. Please install requests or run in a Pyodide environment."}


class VectorStore:
    """简单的向量存储（模拟）"""
    
    def __init__(self):
        """初始化向量存储"""
        self.documents = []
    
    def add(self, text):
        """添加文档
        
        Args:
            text (str): 文档文本
        """
        self.documents.append(text)
    
    def search(self, query, top_k=2):
        """搜索相关文档
        
        Args:
            query (str): 查询文本
            top_k (int): 返回结果数量
            
        Returns:
            list: 相关文档列表
        """
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
    """并行执行多个任务（模拟）
    
    Args:
        tasks (list): 任务列表，每个任务是包含 model 和 prompt 的字典
        
    Returns:
        list: 任务执行结果列表
    """
    results = []
    for task in tasks:
        llm = LLM(model=task.get("model", "gpt-4o-mini"))
        result = llm.chat(task.get("prompt", ""))
        results.append(result)
    return results


# 注册模块
from types import ModuleType

agent_sdk = ModuleType('agent_sdk_http')
agent_sdk.LLM = LLM
agent_sdk.Conversation = Conversation
agent_sdk.Tool = Tool
agent_sdk.Agent = Agent
agent_sdk.AgentExecute = AgentExecute
agent_sdk.VectorStore = VectorStore
agent_sdk.parallel_run = parallel_run
agent_sdk.set_api_key = set_api_key
agent_sdk.set_config = set_config

sys.modules['agent_sdk_http'] = agent_sdk

# 使用示例：如何调用异步的 http_post 方法
"""
import asyncio

async def example():
    # 设置 API 密钥
    set_api_key("your-api-key-here")
    
    llm = LLM()
    
    # 同步聊天
    response = llm.chat("你好，请介绍一下自己")
    print("同步响应:", response)
    
    # 流式聊天
    print("\n流式响应:")
    for chunk in llm.stream("请解释什么是人工智能"):
        print(chunk, end="", flush=True)

# 使用示例：如何调用 Agent 执行接口
async def agent_execute_example():
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
    agent_skills = ["code-review-expert"]
    model_name = "deepseek-chat"
    api_key = "sk-541596b75f97443abf4c1e40a3a6be8c"
    ext_config = {
        "client_kwargs": {
            "base_url": "https://api.deepseek.com"
        }
    }
    user_query = "深圳南山区今天的气温如何"
    
    # 同步调用
    print("\n同步调用 Agent 接口:")
    response = agent_client.execute(
        user_query=user_query,
        mcp_configs=mcp_configs,
        agent_skills=agent_skills,
        model_name=model_name,
        api_key=api_key,
        ext_config=ext_config
    )
    print("响应结果:", response)
    
    # 异步调用
    print("\n异步调用 Agent 接口:")
    async_response = await agent_client.execute_async(
        user_query=user_query,
        mcp_configs=mcp_configs,
        agent_skills=agent_skills,
        model_name=model_name,
        api_key=api_key,
        ext_config=ext_config
    )
    print("异步响应结果:", async_response)

# 运行异步函数
if __name__ == "__main__":
    asyncio.run(agent_execute_example())
"""
