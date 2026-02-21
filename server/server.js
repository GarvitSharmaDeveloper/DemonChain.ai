import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { client, v1 } from "@datadog/datadog-api-client";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// CopilotKit Server Setup
import {
  CopilotRuntime,
  copilotRuntimeNodeExpressEndpoint,
  LangChainAdapter,
} from "@copilotkit/runtime";
import { ChatBedrockConverse } from "@langchain/aws";

// Initialize Datadog API Client
const configuration = client.createConfiguration({
  authMethods: {
    apiKeyAuth: process.env.DATADOG_MCP_API_KEY || "",
    appKeyAuth: process.env.DATADOG_MCP_PASSWORD || "", // Using password as APP key for this demo based on provided env fields
  },
});

const eventsApi = new v1.EventsApi(configuration);

app.post("/api/parse-news", async (req, res) => {
  try {
    const { articleText } = req.body;

    // Call MiniMax API for real analysis
    const systemPrompt = `You are an expert supply chain analyst AI. Analyze the given news article text.
Extract the incident and predict its supply chain impact.
Return ONLY a strictly valid JSON object with the following schema:
{
  "eventType": "<Category> - <Specific Event>",
  "impactAssessment": "<2-3 sentence summary of damages and supply chain impact>",
  "computedSeverity": "<Low|Medium|High|Critical>",
  "predictedDelayDays": <Integer estimating delay>
}`;

    const response = await bedrockClient.send(
      new InvokeModelCommand({
        modelId: "minimax.minimax-m2.1",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Article text: ${articleText}` },
          ],
          temperature: 0.1,
        }),
      }),
    );

    const data = JSON.parse(new TextDecoder().decode(response.body));
    const content = data.choices[0].message.content;

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (e) {
      // fallback extraction if wrapped in markdown
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse JSON from MiniMax response");
      }
    }

    console.log("MiniMax analysis complete:", parsedResponse);
    res.json(parsedResponse);
  } catch (error) {
    console.error("MiniMax integration error:", error);
    res.status(500).json({ error: "Failed to parse news via MiniMax API" });
  }
});

app.post("/api/inject-crisis", async (req, res) => {
  try {
    const { crisisData } = req.body;
    console.log("Injecting crisis into Datadog:", crisisData);

    const params = {
      body: {
        title: `[CRISIS ALERT] ${crisisData.type} detected at ${crisisData.location}`,
        text: `ChainLink AI detected a new disruption.\n\nSeverity: **${crisisData.severity}**\n\nImpact Assessment:\n${crisisData.impactAssessment || "Investigating impact..."}`,
        alertType: crisisData.severity === "Critical" ? "error" : "warning",
        tags: [
          "source:chainlink-ai",
          `location:${crisisData.location.replace(/\s+/g, "-").toLowerCase()}`,
          `severity:${crisisData.severity.toLowerCase()}`,
        ],
        sourceTypeName: "ChainLink Simulator",
      },
    };

    const data = await eventsApi.createEvent(params);
    console.log("Datadog event created:", data);

    res.json({
      success: true,
      eventId: data.event?.id,
      message: "Datadog event created successfully.",
    });
  } catch (error) {
    console.error("Error creating Datadog event:", error);
    res.status(500).json({ error: "Failed to inject crisis to Datadog" });
  }
});

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// Initialize AWS Bedrock Client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
  },
});

app.post("/api/generate-mitigation", async (req, res) => {
  try {
    const { incidentDetails } = req.body;
    console.log(
      "Generating mitigation strategy via AWS Bedrock for:",
      incidentDetails.type,
    );

    if (!process.env.AWS_ACCESS_KEY_ID) {
      console.warn("AWS config missing, returning mock mitigation");
      return res.json({
        mitigationPlan:
          "1. **Reroute Shipments:** Immediately divert incoming vessels to alternative regional hubs.\n2. **Engage Backup Suppliers:** Activate secondary supplier contracts for critical components.\n3. **Notify Stakeholders:** Issue automated alerts to all downstream customers regarding expected delays.",
      });
    }

    const prompt = `You are an expert supply chain analyst for ChainLink. An automated system has detected a critical supply chain disruption.
Incident Type: ${incidentDetails.type}
Severity: ${incidentDetails.severity}
Location: ${incidentDetails.location}
Initial Assessment: ${incidentDetails.impactAssessment}

Based strictly on this data, provide 3 actionable mitigation steps a supply chain manager can take immediately. Format as a simple markdown bulleted list. Keep it concise, no intro or outro text.`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    res.json({ mitigationPlan: responseBody.content[0].text });
  } catch (error) {
    console.error("AWS Bedrock integration error:", error);
    res.status(500).json({ error: "Failed to generate mitigation" });
  }
});

// Configure the AWS Bedrock Model for CopilotKit using Langchain
const bedrockCopilotModel = new ChatBedrockConverse({
  model: "anthropic.claude-3-sonnet-20240229-v1:0",
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
  },
});

// Mount the CopilotKit endpoint
app.use("/api/copilotkit", (req, res, next) => {
  const runtime = new CopilotRuntime();
  const handler = copilotRuntimeNodeExpressEndpoint({
    endpoint: "/",
    runtime,
    serviceAdapter: new LangChainAdapter({
      chainFn: async ({ messages }) => {
        return bedrockCopilotModel.stream(messages);
      },
    }),
  });
  return handler(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
