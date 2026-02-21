import express from 'express';
import { CopilotRuntime, copilotRuntimeNodeExpressEndpoint, LangChainAdapter } from "@copilotkit/runtime";
import fetch from 'node-fetch';

const app = express();
const runtime = new CopilotRuntime();

// Do not provide a path prefix to app.use!
app.use((req, res, next) => {
    const handler = copilotRuntimeNodeExpressEndpoint({
        endpoint: "/api/copilotkit",
        runtime,
        serviceAdapter: new LangChainAdapter({ chainFn: async () => {} })
    });
    return handler(req, res, next);
});

const server = app.listen(3004, async () => {
    try {
        const response = await fetch('http://localhost:3004/api/copilotkit/info');
        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (e) {
        console.error(e);
    }
    server.close();
});
