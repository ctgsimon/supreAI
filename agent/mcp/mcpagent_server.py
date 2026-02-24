# -*- coding: utf-8 -*-
"""
MCP Agent HTTP Service
MCP代理HTTP服务

This service provides an HTTP API to execute ReAct agent with MCP tools.
该服务提供HTTP API来执行带有MCP工具的ReAct代理。

API Endpoint:
- POST /api/agent/execute
  Request Body: JSON with mcp_configs, model_name, api_key, model_config, user_query, agent_skills
  Response: JSON with execution result

API端点：
- POST /api/agent/execute
  请求体：包含mcp_configs、model_name、api_key、model_config、user_query、agent_skills的JSON
  响应：包含执行结果的JSON
"""

import asyncio
import json
import logging
import time
from typing import Any, List, Dict

# Configure logging
# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Log to console
        logging.FileHandler('mcp_agent_server.log', encoding='utf-8')  # Log to file
    ]
)
logger = logging.getLogger('MCPAgentServer')

from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, ConfigDict

from agentscope.agent import ReActAgent
from agentscope.formatter import DashScopeChatFormatter, OpenAIChatFormatter
from agentscope.mcp import HttpStatelessClient, HttpStatefulClient
from agentscope.message import Msg
from agentscope.model import DashScopeChatModel, OpenAIChatModel
from agentscope.tool import Toolkit, view_text_file

# Create Flask app
# 创建Flask应用
app = Flask(__name__)

# Enable CORS for all routes
# 为所有路由启用CORS
CORS(app)


class AgentResult(BaseModel):
    """A generic result model for agent output.
    用于代理输出的通用结果模型"""

    result: Any
    status: str = "success"

    model_config = ConfigDict(
        json_schema_extra={
            "description": "通用结果模型",
            "properties": {
                "result": {"description": "The result of the agent execution | 代理执行的结果"},
                "status": {"description": "Execution status | 执行状态"}
            }
        }
    )


class MCPConfig(BaseModel):
    """Model for MCP client configuration.
    MCP客户端配置模型"""

    name: str
    transport: str
    url: str
    is_stateful: bool = False

    model_config = ConfigDict(
        json_schema_extra={
            "description": "MCP客户端配置",
            "properties": {
                "name": {"description": "Name of the MCP client | MCP客户端名称"},
                "transport": {"description": "Transport type (sse, streamable_http) | 传输类型"},
                "url": {"description": "URL of the MCP server | MCP服务器URL"},
                "is_stateful": {"description": "Whether the client is stateful | 客户端是否有状态"}
            }
        }
    )


class AgentRequest(BaseModel):
    """Request model for agent execution API.
    代理执行API的请求模型"""

    mcp_configs: List["MCPConfig"] = []
    model_name: str
    api_key: str
    ext_config: Dict[str, Any] = {}
    user_query: str
    agent_skills: List[str] = []

    model_config = ConfigDict(
        json_schema_extra={
            "description": "代理执行请求",
            "properties": {
                "mcp_configs": {"description": "List of MCP client configurations | MCP客户端配置列表"},
                "model_name": {"description": "Name of the LLM model | 大语言模型名称"},
                "api_key": {"description": "API key for the model | 模型API密钥"},
                "ext_config": {"description": "Additional model configuration | 额外的模型配置"},
                "user_query": {"description": "User's query | 用户查询"},
                "agent_skills": {"description": "List of skills for the agent | 代理的技能列表"}
            }
        }
    )

# Resolve forward reference
# 解决前向引用
AgentRequest.model_rebuild()


async def execute_agent(request_data: AgentRequest, request_id: str) -> Dict[str, Any]:
    """Execute the agent with the provided configuration.
    使用提供的配置执行代理"""
    
    logger.info(f"[{request_id}] Initializing agent execution")
    
    # Create toolkit
    # 创建工具包
    logger.info(f"[{request_id}] Creating toolkit")
    toolkit = Toolkit()
    
    # Create and connect MCP clients
    # 创建并连接MCP客户端
    mcp_clients = []
    try:
        logger.info(f"[{request_id}] Creating and connecting MCP clients")
        for mcp_config in request_data.mcp_configs:
            logger.info(f"[{request_id}] Creating MCP client: {mcp_config.name} (type: {'stateful' if mcp_config.is_stateful else 'stateless'}, transport: {mcp_config.transport})")
            
            if mcp_config.is_stateful:
                client = HttpStatefulClient(
                    name=mcp_config.name,
                    transport=mcp_config.transport,
                    url=mcp_config.url,
                )
                logger.info(f"[{request_id}] Connecting stateful client: {mcp_config.name}")
                await client.connect()
                logger.info(f"[{request_id}] Connected to stateful client: {mcp_config.name}")
            else:
                client = HttpStatelessClient(
                    name=mcp_config.name,
                    transport=mcp_config.transport,
                    url=mcp_config.url,
                )
                logger.info(f"[{request_id}] Created stateless client: {mcp_config.name}")
            
            mcp_clients.append((client, mcp_config.is_stateful))
            await toolkit.register_mcp_client(client)
            logger.info(f"[{request_id}] Registered MCP client: {mcp_config.name}")
        
        for skill in request_data.agent_skills:
            logger.info(f"[{request_id}] Registering agent skill: {skill}")
            toolkit.register_agent_skill("./skill/" + skill)

        # Determine model type and formatter based on model name
        # 根据模型名称确定模型类型和格式化器
        logger.info(f"[{request_id}] Determining model type for: {request_data.model_name}")
        if "deepseek" in request_data.model_name.lower() or "openai" in request_data.model_name.lower():
            model_class = OpenAIChatModel
            formatter_class = OpenAIChatFormatter
        elif "qwen" in request_data.model_name.lower() or "dashscope" in request_data.model_name.lower():
            model_class = DashScopeChatModel
            formatter_class = DashScopeChatFormatter
        else:
            # Default to OpenAI compatible
            # 默认使用OpenAI兼容模型
            model_class = OpenAIChatModel
            formatter_class = OpenAIChatFormatter
        
        logger.info(f"[{request_id}] Using model: {model_class.__name__} with formatter: {formatter_class.__name__}")
        
        # Initialize the model
        # 初始化模型
        logger.info(f"[{request_id}] Initializing model: {request_data.model_name}")
        model = model_class(
            model_name=request_data.model_name,
            api_key=request_data.api_key,
            **request_data.ext_config
        )

        logger.info(f"[{request_id}] Model initialized successfully")
        
        # Initialize the agent
        # 初始化代理
        logger.info(f"[{request_id}] Initializing ReActAgent")
        sys_prompt="You're a helpful assistant named Jarvis."
        # 当request_data.agent_skills不为空时，添加技能提示
        if request_data.agent_skills:
            sys_prompt += """

# IMPORTANT
- Don't make any assumptions. All your knowledge about AgentScope library must come from your equipped skills.
            """
            toolkit.register_tool_function(view_text_file)
        logger.info(f"[{request_id}] System prompt: {sys_prompt}")
        agent = ReActAgent(
            name="Jarvis",
            sys_prompt=sys_prompt,
            model=model,
            formatter=formatter_class(),
            toolkit=toolkit,
        )
        logger.info(f"[{request_id}] Agent initialized successfully")
        
        # Run the agent with user query
        # 使用用户查询运行代理
        logger.info(f"[{request_id}] Executing agent with user query: {request_data.user_query[:100]}...")
        start_exec_time = time.time()
        
        res = await agent(
            Msg(
                "user",
                request_data.user_query,
                "user",
            ),
            structured_model=AgentResult,
        )
        
        exec_time = time.time() - start_exec_time
        logger.info(f"[{request_id}] Agent execution completed in {exec_time:.2f}s")
        
        # Get result
        result_data = res.metadata if hasattr(res, 'metadata') else str(res)
        logger.info(f"[{request_id}] Agent execution result: {json.dumps(result_data, ensure_ascii=False)[:200]}...")
        
        return {
            "status": "success",
            "result": result_data,
            "message": "Agent executed successfully"
        }
        
    except Exception as e:
        logger.exception(f"[{request_id}] Agent execution failed with exception:")
        return {
            "status": "error",
            "result": None,
            "message": f"Agent execution failed: {str(e)}"
        }
    finally:
        # Disconnect stateful clients
        # 断开有状态客户端连接
        logger.info(f"[{request_id}] Cleaning up resources")
        for client, is_stateful in mcp_clients:
            if is_stateful:
                try:
                    logger.info(f"[{request_id}] Disconnecting stateful client: {client.name}")
                    await client.close()
                    logger.info(f"[{request_id}] Disconnected from stateful client: {client.name}")
                except Exception as e:
                    logger.warning(f"[{request_id}] Failed to disconnect client: {client.name}, error: {str(e)}")


@app.route('/api/agent/execute', methods=['POST'])
def execute_agent_api():
    """HTTP API endpoint for agent execution.
    代理执行的HTTP API端点"""
    request_id = str(time.time_ns())[:16]  # Generate unique request ID
    start_time = time.time()
    
    # Log request headers
    logger.info(f"[{request_id}] Request received: {request.method} {request.path}")
    logger.info(f"[{request_id}] Request headers: {dict(request.headers)}")
    
    try:
        # Parse request data
        # 解析请求数据
        request_json = request.json
        
        # Mask sensitive data for logging
        # 对敏感数据进行脱敏处理
        if request_json and 'api_key' in request_json:
            masked_json = request_json.copy()
            masked_json['api_key'] = masked_json['api_key'][:4] + '****' + masked_json['api_key'][-4:]
            logger.info(f"[{request_id}] Request body: {json.dumps(masked_json, ensure_ascii=False)}")
        
        request_data = AgentRequest(**request_json)
        
        # Run async execution in event loop
        # 在事件循环中运行异步执行
        logger.info(f"[{request_id}] Starting agent execution")
        result = asyncio.run(execute_agent(request_data, request_id))
        
        end_time = time.time()
        logger.info(f"[{request_id}] Request completed in {end_time - start_time:.2f}s")
        logger.info(f"[{request_id}] Response: {json.dumps(result, ensure_ascii=False)}")
        
        return jsonify(result)
        
    except Exception as e:
        end_time = time.time()
        error_msg = f"Request processing failed: {str(e)}"
        logger.error(f"[{request_id}] Error: {error_msg}")
        logger.error(f"[{request_id}] Request failed in {end_time - start_time:.2f}s")
        
        return jsonify({
            "status": "error",
            "result": None,
            "message": error_msg
        }), 400


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint.
    健康检查端点"""
    request_id = str(time.time_ns())[:16]
    logger.info(f"[{request_id}] Health check requested")
    
    response = jsonify({
        "status": "healthy",
        "service": "MCP Agent HTTP Service",
        "version": "1.0.0"
    })
    
    logger.info(f"[{request_id}] Health check response: {response.get_json()}")
    return response


if __name__ == '__main__':
    # Run the Flask app
    # 运行Flask应用
    host = '0.0.0.0'
    port = 5000
    debug = False
    
    logger.info(f"Starting MCP Agent HTTP Service on {host}:{port}")
    logger.info(f"Debug mode: {debug}")
    logger.info(f"API endpoint: http://{host}:{port}/api/agent/execute")
    logger.info(f"Health check: http://{host}:{port}/health")
    
    app.run(host=host, port=port, debug=debug)
