import express from "express";
import {
  CopilotRuntime,
  copilotRuntimeNodeExpressEndpoint,
  LangChainAdapter,
} from "@copilotkit/runtime";

const app = express();
const runtime = new CopilotRuntime();

// Approach 1: mount globally, let CopilotKit filter by endpoint
app.use("/api/copilotkit", (req, res, next) => {
  const handler = copilotRuntimeNodeExpressEndpoint({
    endpoint: "/api/copilotkit",
    runtime,
    serviceAdapter: new LangChainAdapter({ chainFn: async () => {} }),
  });
  // the request URL inside this middleware is stripped of /api/copilotkit
  // so we must restore it for the SDK to match!
  const originalUrl = req.originalUrl;
  req.url = originalUrl;
  return handler(req, res, next);
});

const server = app.listen(3002, () => {});
