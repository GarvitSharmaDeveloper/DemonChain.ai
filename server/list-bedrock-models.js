import {
  BedrockClient,
  ListFoundationModelsCommand,
} from "@aws-sdk/client-bedrock";
import dotenv from "dotenv";
dotenv.config();

const client = new BedrockClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
  },
});

async function listModels() {
  try {
    const command = new ListFoundationModelsCommand({});
    const response = await client.send(command);
    const models = response.modelSummaries.filter(
      (m) =>
        m.providerName.toLowerCase().includes("minimax") ||
        m.modelId.toLowerCase().includes("minimax"),
    );
    console.log("Found MiniMax models:", JSON.stringify(models, null, 2));
  } catch (e) {
    console.error("Error listing models:", e);
  }
}
listModels();
