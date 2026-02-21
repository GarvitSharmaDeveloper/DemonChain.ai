import express from 'express';
import { CopilotRuntime, copilotRuntimeNodeExpressEndpoint, LangChainAdapter } from "@copilotkit/runtime";
import fetch from 'node-fetch'; // assuming node 18+ has fetch natively, or we can use http

const app = express();
const runtime = new CopilotRuntime();

// Test the originalUrl restoration fix
app.use("/api/copilotkit", (req, res, next) => {
    // Restore the stripped URL so the SDK's internal router matches the endpoint name
    req.url = req.originalUrl;

    const handler = copilotRuntimeNodeExpressEndpoint({
        endpoint: "/api/copilotkit",
        runtime,
        serviceAdapter: new LangChainAdapter({ chainFn: async () => { } })
    });
    return handler(req, res, next);
});

const server = app.listen(3003, async () => {
    try {
        const response = await fetch('http://localhost:3003/api/copilotkit/info');
        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (e) {
        console.error(e);
    }
    server.close();
});
