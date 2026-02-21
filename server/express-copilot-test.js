import express from "express";
import {
  CopilotRuntime,
  copilotRuntimeNodeExpressEndpoint,
  LangChainAdapter,
} from "@copilotkit/runtime";
const app = express();

const runtime = new CopilotRuntime();
const handler = copilotRuntimeNodeExpressEndpoint({
  endpoint: "/api/copilotkit",
  runtime,
  serviceAdapter: new LangChainAdapter({ chainFn: async () => {} }),
});

// Test 1: use with full path
app.use("/api/copilotkit", handler);

const server = app.listen(3002, () => {
  console.log("Listening on 3002");
});
