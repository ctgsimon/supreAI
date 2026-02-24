# agentrun_deploy.py
import asyncio
import os
from agentscope_runtime.engine.deployers.agentrun_deployer import (
    AgentRunDeployManager,
    OSSConfig,
    AgentRunConfig,
)
from agent_app import app  # 导入已配置的 app

async def deploy_to_agentrun():
    """将 AgentApp 部署到阿里云 AgentRun 服务"""

    # 配置 OSS 和 AgentRun
    deployer = AgentRunDeployManager(
        oss_config=OSSConfig(
            access_key_id="LTAI5tMdwA8WWzhCfNdjxYbZ",
            access_key_secret="ylYfwFpFS8VL7gXAHHvSo9IrBbYbQg",
            region="cn-shenzhen",
            bucket_name="wqc-agent",
        ),
        agentrun_config=AgentRunConfig(
            access_key_id="LTAI5tMdwA8WWzhCfNdjxYbZ",
            access_key_secret="ylYfwFpFS8VL7gXAHHvSo9IrBbYbQg",
            region_id="cn-shenzhen",
        ),
    )

    # 执行部署
    result = await app.deploy(
        deployer,
        endpoint_path="/process",
        requirements=["agentscope", "fastapi", "uvicorn"],
        environment={
            "PYTHONPATH": "/code",
        },
        deploy_name="agent-app-example",
        project_dir=".",  # 当前项目目录
        cmd="python -m uvicorn app:app --host 0.0.0.0 --port 8080",
    )

    print(f"✅ 部署到 AgentRun：{result['url']}")
    print(f"📍 AgentRun ID：{result.get('agentrun_id', 'N/A')}")
    print(f"📦 制品 URL：{result.get('artifact_url', 'N/A')}")
    return result

if __name__ == "__main__":
    asyncio.run(deploy_to_agentrun())