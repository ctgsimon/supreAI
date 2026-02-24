#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test script for MCP Agent HTTP Service
MCP代理HTTP服务测试脚本
"""

import json
import requests

# API endpoint
# API端点
url = "http://localhost:5000/api/agent/execute"

# Test request data
# 测试请求数据
test_data = {
    "mcp_configs": [
        {
            "name": "map_weather",
            "transport": "sse",
            "url": "https://mcp.map.baidu.com/sse?ak=MNIoKBwbKXvuvYlCu7bLwU6BnLBSe5uo",
            "is_stateful": False
        }
    ],
    "model_name": "deepseek-chat",
    "api_key": "sk-541596b75f97443abf4c1e40a3a6be8c",
    "ext_config": {
        "client_kwargs": {
            "base_url": "https://api.deepseek.com"
        }
    },
    "user_query": "深圳南山区今天的气温如何"
}

# Send POST request
# 发送POST请求
print("Sending request to API...")
try:
    response = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        data=json.dumps(test_data, ensure_ascii=False)
    )
    
    # Print response
    # 打印响应
    print(f"\nStatus Code: {response.status_code}")
    print("Response Headers:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")
    
    print("\nResponse Body:")
    try:
        response_json = response.json()
        print(json.dumps(response_json, indent=4, ensure_ascii=False))
    except json.JSONDecodeError:
        print(response.text)
        
    # Test health check endpoint
    # 测试健康检查端点
    health_url = "http://localhost:5000/health"
    health_response = requests.get(health_url)
    print(f"\nHealth Check Status: {health_response.status_code}")
    print(health_response.json())
    
except Exception as e:
    print(f"Error sending request: {str(e)}")
