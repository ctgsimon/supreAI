# -*- coding: utf-8 -*-
"""
Demo showcasing ReAct agent with MCP tools using different transports.
演示使用不同传输方式的ReAct代理与MCP工具

This example demonstrates:
- Registering MCP tools with different transports (sse and streamable_http)
这个示例演示了：
- 注册使用不同传输方式（sse和streamable_http）的MCP工具
- Using a ReAct agent with registered MCP tools
- 使用已注册MCP工具的ReAct代理
- Getting structured output from the agent
- 从代理获取结构化输出

Before running this demo, please execute:
    python mcp_servers.py
在运行此演示之前，请执行：
    python mcp_servers.py
"""

import asyncio
import json
import os

from pydantic import BaseModel, Field

from agentscope.agent import ReActAgent
from agentscope.formatter import DashScopeChatFormatter, OpenAIChatFormatter
from agentscope.mcp import HttpStatelessClient, HttpStatefulClient
from agentscope.message import Msg
from agentscope.model import DashScopeChatModel, OpenAIChatModel
from agentscope.tool import Toolkit


class StrResult(BaseModel):
    """A simple string result model for structured output.
    用于结构化输出的简单字符串结果模型"""

    result: str = Field(description="The result of the weather | 天气情况")


async def main() -> None:
    """The main entry of the MCP example.
    MCP示例的主入口"""

    toolkit = Toolkit()

    # Create a stateless MCP client to connect to the StreamableHTTP MCP server
    # 创建一个无状态的MCP客户端来连接StreamableHTTP MCP服务器
    # note you can also use the stateful client
    # 注意：你也可以使用有状态客户端
    map_weather_mcp_client = HttpStatelessClient(
        name="map_weather",
        transport="sse",
        url="https://mcp.map.baidu.com/sse?ak=MNIoKBwbKXvuvYlCu7bLwU6BnLBSe5uo",
    )

    # Register the MCP clients to the toolkit
    # 将MCP客户端注册到工具包
    await toolkit.register_mcp_client(map_weather_mcp_client)

    # Initialize the agent
    # 初始化代理
    agent = ReActAgent(
        name="Jarvis",
        sys_prompt="You're a helpful assistant named Jarvis.",
        model=OpenAIChatModel(
            model_name="deepseek-chat",
            api_key="sk-541596b75f97443abf4c1e40a3a6be8c",
            client_kwargs={"base_url": "https://api.deepseek.com"}
        ),
        formatter=OpenAIChatFormatter(),
        toolkit=toolkit,
    )

    # Run the agent with a calculation task
    # 使用计算任务运行代理
    res = await agent(
        Msg(
            "user",
            "深圳南山区今天的气温如何",
            "user",
        ),
        structured_model=StrResult,
    )

    print(
        "Structured Output:\n"
        "```\n"
        f"{json.dumps(res.metadata, indent=4, ensure_ascii=False)}\n"
        "```",
    )


asyncio.run(main())
