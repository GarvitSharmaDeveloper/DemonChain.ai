# 🌍 DemonChain.ai (ChainLink)

DemonChain.ai is an autonomous GenAI command center designed to revolutionize global supply chain resilience. By actively scraping and parsing global news streams using advanced LLMs, it detects incoming supply chain disruptions instantly, maps the blast radius, generates actionable mitigation runbooks, and logs critical business alerts directly into Datadog.

## 🚀 The Problem We Solve

Global supply chains are extremely fragile and heavily reliant on manual human monitoring. Enterprise companies often react to geopolitical events, factory fires, or shipping blockades _after_ the damage is done.

DemonChain.ai solves the "reaction latency" problem. By autonomously feeding live unstructured data through advanced language models, our platform detects supply chain threats the second news breaks. It doesn't just alert stakeholders; it actively produces dynamic mitigation strategies (like rerouting cargo or engaging backup suppliers) and ensures enterprise-grade visibility and tracking. It turns a chaotic reactive supply chain into a proactive, resilient one.

## 🛠️ Technology Stack & Integrations

We leveraged a cutting-edge suite of AI, Observability, and Graph technologies to bring this platform to life:

- **Amazon Bedrock (MiniMax & Claude 3 Sonnet):** We utilize AWS Bedrock's powerful and low-latency models to process incoming unstructured news articles. MiniMax is used for fast, structured JSON extraction of incident severity and details, while Anthropic's Claude 3 Sonnet powers the real-time reasoning engine for our mitigation strategies.
- **Datadog (MCP & Events API):** Enterprise-grade observability is built directly into the core loop. Every AI-detected incident triggers a live, tagged event injected directly into the Datadog platform via the Model Context Protocol (MCP) securely using our Datadog API keys, ensuring NOC teams have immediate visibility into supply chain health alongside their infrastructure.
- **Neo4j Graph Database:** To understand the true "blast radius" of a disruption, we utilize Neo4j to map the complex web of interconnected suppliers, warehouses, and transit routes. When an incident occurs at a specific node, the graph instantly identifies downstream dependencies that require mitigation.
- **CopilotKit (SiriSphere):** We integrated CopilotKit to provide an interactive, Siri-like voice AI interface ("SiriSphere"). This allows supply chain incident commanders to use natural voice interactions to ask the AI about the crisis status, affected regions, and recommended next steps, powered seamlessly by our AWS Bedrock backend.
- **React (Vite) & Express.js:** A sleek, high-performance "glassmorphism" dashboard built on React providing the real-time NOC view, supported by a robust Node/Express backend that orchestrates the AI and database connections.

## ⚙️ How It Works

1.  **News Ingestion:** Unstructured news text is intercepted by the platform.
2.  **AI Analysis (Bedrock):** The text is parsed by AWS Bedrock's MiniMax model to extract event type, location, and severity into structured JSON.
3.  **Graph Resolution (Neo4j):** The location node is queried against the Neo4j knowledge graph to determine the interconnected impact radius.
4.  **Mitigation Generation:** Claude 3 Sonnet dynamically formulates a 3-step actionable containment runbook based on the specific incident topology.
5.  **Observability (Datadog):** The confirmed crisis event is logged immediately to the company's Datadog dashboard for centralized alerting.
6.  **Interactive Commander (CopilotKit):** The crisis dashboard goes live, allowing stakeholders to converse with the CopilotKit voice assistant to manage the situation.

## 💻 Running Locally

### Prerequisites

- Node.js (v18+)
- AWS Bedrock Access (MiniMax & Claude 3 Sonnet enabled)
- Datadog API Keys
- Neo4j instance (local or AuraDB)

### Setup

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/GarvitSharmaDeveloper/DemonChain.ai.git
    cd DemonChain.ai
    ```

2.  **Install Dependencies:**
    - For the React Frontend:
      ```bash
      npm install
      ```
    - For the Express Backend:
      ```bash
      cd server
      npm install
      ```

3.  **Environment Variables:**
    Create a `.env` file in the `server` directory with your secure credentials:

    ```env
    AWS_ACCESS_KEY_ID=your_aws_key
    AWS_SECRET_ACCESS_KEY=your_aws_secret
    AWS_REGION=us-east-1
    DATADOG_MCP_API_KEY=your_dd_mcp_key
    DATADOG_MCP_PASSWORD=your_dd_app_password
    NEO4J_URI=bolt://localhost:7687
    NEO4J_USER=neo4j
    NEO4J_PASSWORD=your_password
    ```

4.  **Start the Services:**
    - Terminal 1 (Backend):
      ```bash
      cd server
      node server.js
      ```
    - Terminal 2 (Frontend):
      ```bash
      npm run dev
      ```

5.  **Access the Dashboard:**
    Open `http://localhost:5173` in your browser to start a crisis simulation!
