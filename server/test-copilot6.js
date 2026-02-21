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

// PASS WITHOUT PREFIX, so req.url remains completely intact for Hono to check!
app.use(handler);

const server = app.listen(3007, async () => {
    try {
        const responseInfo = await fetch('http://localhost:3007/api/copilotkit/info');
        console.log("/info Status:", responseInfo.status);
        console.log("/info Body:", await responseInfo.text());

        const responseRoot = await fetch('http://localhost:3007/api/copilotkit', { method: 'POST', body: '{}' });
        console.log("Root Status:", responseRoot.status);
        console.log("Root Body:", await responseRoot.text());

        // Also verify other routes 404 naturally
        const responseOther = await fetch('http://localhost:3007/other-route');
        console.log("Other Status:", responseOther.status);
    } catch (e) {
        console.error(e);
    }
    server.close();
});
