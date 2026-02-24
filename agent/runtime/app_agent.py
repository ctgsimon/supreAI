# -*- coding: utf-8 -*-
import os

from agentscope.agent import ReActAgent
from agentscope.formatter import DashScopeChatFormatter
from agentscope.model import DashScopeChatModel, OpenAIChatModel
from agentscope.pipeline import stream_printing_messages
from agentscope.tool import Toolkit, execute_python_code

from agentscope_runtime.adapters.agentscope.memory import (
    AgentScopeSessionHistoryMemory,
)
from agentscope_runtime.engine.app import AgentApp
from agentscope_runtime.engine.schemas.agent_schemas import AgentRequest
from agentscope_runtime.engine.services.agent_state import (
    InMemoryStateService,
)
from agentscope_runtime.engine.services.session_history import (
    InMemorySessionHistoryService,
)

# Create AgentApp instance
agent_app = AgentApp(
    app_name="MyAssistant",
    app_description="A helpful assistant agent",
)


@agent_app.init
async def init_func(self):
    """Initialize services."""
    self.state_service = InMemoryStateService()
    self.session_service = InMemorySessionHistoryService()

    await self.state_service.start()
    await self.session_service.start()


@agent_app.shutdown
async def shutdown_func(self):
    """Cleanup services."""
    await self.state_service.stop()
    await self.session_service.stop()


@agent_app.query(framework="agentscope")
async def query_func(
    self,
    msgs,
    request: AgentRequest = None,
    **kwargs,
):
    """Process user queries."""
    session_id = request.session_id
    user_id = request.user_id

    # Load state if exists
    state = await self.state_service.export_state(
        session_id=session_id,
        user_id=user_id,
    )

    # Create toolkit with Python execution
    toolkit = Toolkit()
    toolkit.register_tool_function(execute_python_code)

    # Create agent
    agent = ReActAgent(
        name="MyAssistant",
        model=OpenAIChatModel(
            model_name="deepseek-chat",
            api_key="sk-541596b75f97443abf4c1e40a3a6be8c",
            client_kwargs={"base_url": "https://api.deepseek.com"},
            enable_thinking=True,
            stream=True,
        ),
        sys_prompt="You're a helpful assistant.",
        toolkit=toolkit,
        memory=AgentScopeSessionHistoryMemory(
            service=self.session_service,
            session_id=session_id,
            user_id=user_id,
        ),
        formatter=DashScopeChatFormatter(),
    )
    agent.set_console_output_enabled(False)

    # Load state if available
    if state:
        agent.load_state_dict(state)

    # Process query and stream response
    async for msg, last in stream_printing_messages(
        agents=[agent],
        coroutine_task=agent(msgs),
    ):
        yield msg, last

    # Save state
    state = agent.state_dict()
    await self.state_service.save_state(
        user_id=user_id,
        session_id=session_id,
        state=state,
    )


if __name__ == "__main__":
    agent_app.run()