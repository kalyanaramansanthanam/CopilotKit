"""
Agent Server for LangGraph (FastAPI)

FastAPI server that hosts the LangGraph agent backend.
The Next.js CopilotKit runtime proxies requests here via AG-UI protocol.
"""

import os
import warnings
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from copilotkit import LangGraphAGUIAgent
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from agents.src.agent import graph

load_dotenv()

app = FastAPI(title="LangGraph (FastAPI) Agent Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

add_langgraph_fastapi_endpoint(
    app=app,
    agent=LangGraphAGUIAgent(
        name="sample_agent",
        description="A LangGraph agent with weather tools, proverbs state, and human-in-the-loop support.",
        graph=graph,
    ),
    path="/",
)


@app.get("/health")
async def health():
    return {"status": "ok"}


def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        "agent_server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )


warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")
if __name__ == "__main__":
    main()
