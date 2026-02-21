import express from 'express';
import { CopilotRuntime, copilotRuntimeNodeExpressEndpoint, LangChainAdapter } from "@copilotkit/runtime";
import fetch from 'node-fetch';

const app = express();
const runtime = new CopilotRuntime();

// We MUST pass exact endpoint /api/copilotkit
const handler = copilotRuntimeNodeExpressEndpoint({
    endpoint: "/api/copilotkit",
    runtime,
    serviceAdapter: new LangChainAdapter({ chainFn: async () => { } })
});

// Since handler works natively with Node HTTP req/res, pass it directly
app.use("/api/copilotkit", handler);

const server = app.listen(3006, async () => {
    try {
        const responseInfo = await fetch('http://localhost:3006/api/copilotkit/info');
        console.log("/info Status:", responseInfo.status);
        console.log("/info Body:", await responseInfo.text());

        const responseRoot = await fetch('http://localhost:3006/api/copilotkit', { method: 'POST', body: '{}' });
        console.log("Root Status:", responseRoot.status);
        console.log("Root Body:", await responseRoot.text());
    } catch (e) {
        console.error(e);
    }
    server.close();
});
