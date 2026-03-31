import {
    CopilotRuntime,
    ExperimentalEmptyAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";
import { NextRequest } from "next/server";

// The LangGraph TypeScript agent runs as a separate process on port 8123
// via @langchain/langgraph-cli. This runtime proxies CopilotKit requests
// to it using the LangGraph AG-UI adapter.

const DEPLOYMENT_URL =
    process.env.LANGGRAPH_DEPLOYMENT_URL || "http://localhost:8123";

const serviceAdapter = new ExperimentalEmptyAdapter();

const starterAgent = new LangGraphAgent({
    deploymentUrl: DEPLOYMENT_URL,
    graphId: "starterAgent",
    langsmithApiKey: process.env.LANGSMITH_API_KEY || "",
});

const runtime = new CopilotRuntime({
    agents: {
        starterAgent,
    },
});

export const POST = async (req: NextRequest) => {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
        runtime,
        serviceAdapter,
        endpoint: "/api/copilotkit",
    });

    return handleRequest(req);
};
