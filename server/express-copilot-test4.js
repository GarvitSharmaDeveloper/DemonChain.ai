import express from "express";
import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  LangChainAdapter,
} from "@copilotkit/runtime";
import fetch from "node-fetch";

const app = express();
const runtime = new CopilotRuntime();

const handler = copilotRuntimeNodeHttpEndpoint({
  endpoint: "/api/copilotkit",
  runtime,
  serviceAdapter: new LangChainAdapter({ chainFn: async () => {} }),
});

// Since handler works natively with Node HTTP req/res, pass it directly
app.all("/api/copilotkit*", (req, res, next) => {
  // we use `req.originalUrl` hack if needed, or pass req directly
  return handler(req, res, next);
});

const server = app.listen(3005, async () => {
  try {
    const response = await fetch("http://localhost:3005/api/copilotkit/info");
    console.log("Status:", response.status);
    console.log("Body:", await response.text());
  } catch (e) {
    console.error(e);
  }
  server.close();
});
