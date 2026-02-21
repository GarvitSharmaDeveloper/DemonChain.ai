import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import dotenv from "dotenv";
dotenv.config();

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    sessionToken: process.env.AWS_SESSION_TOKEN || undefined,
  },
});

async function testMinimax() {
  try {
    const payload = {
      messages: [{ role: "user", content: "Say hello!" }],
    };

    const command = new InvokeModelCommand({
      modelId: "minimax.minimax-m2.1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload),
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    console.log("Success! MiniMax responded:", responseBody);
  } catch (e) {
    console.error("Test failed:", e);
  }
}
testMinimax();
