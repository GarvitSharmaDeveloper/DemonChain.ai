import express from "express";
import {
  CopilotRuntime,
  copilotRuntimeNodeExpressEndpoint,
  LangChainAdapter,
} from "@copilotkit/runtime";
import fetch from "node-fetch";

const app = express();
const runtime = new CopilotRuntime();

// Express will strip /api/copilotkit, so req.url inside handler is "/"
app.use("/api/copilotkit", (req, res, next) => {
  const handler = copilotRuntimeNodeExpressEndpoint({
    endpoint: "/", // Matches the stripped req.url
    runtime,
    serviceAdapter: new LangChainAdapter({ chainFn: async () => {} }),
  });
  return handler(req, res, next);
});

const server = app.listen(3008, async () => {
  try {
    const responseRoot = await fetch("http://localhost:3008/api/copilotkit", {
      method: "POST",
      body: "{}",
    });
    console.log("Root Status:", responseRoot.status);
    console.log("Root Body:", await responseRoot.text());
  } catch (e) {
    console.error(e);
  }
  server.close();
});
