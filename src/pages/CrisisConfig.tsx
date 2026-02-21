import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, Cpu, FileText, CheckCircle2 } from "lucide-react";
import { mockNewsData } from "../data/mockNews";
import NewsArticle from "../components/NewsArticle";
import "./CrisisConfig.css";

interface CrisisConfigProps {
  setIsCrisis: (val: boolean) => void;
  setCrisisConfig: (config: any) => void;
}

const CrisisConfig: React.FC<CrisisConfigProps> = ({
  setIsCrisis,
  setCrisisConfig,
}) => {
  const navigate = useNavigate();
  const reactLocation = useLocation();

  // Get the selected location from the router state, default to Taiwan
  const locationName = reactLocation.state?.location || "Taiwan Warehouse";
  const article = mockNewsData[locationName];

  const [isParsing, setIsParsing] = useState(true);
  const [typedJson, setTypedJson] = useState("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!article) return;

    const fetchAnalysis = async () => {
      try {
        // Call our local backend which calls MiniMax
        const response = await fetch("http://localhost:3001/api/parse-news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleText: article.raw_article_text }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch from backend");
        }

        const data = await response.json();
        setParsedData(data);

        // Start typing animation once we have data
        const finalJsonString = JSON.stringify(data, null, 2);
        let currentIndex = 0;

        const interval = setInterval(() => {
          if (currentIndex <= finalJsonString.length) {
            setTypedJson(finalJsonString.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsParsing(false);
          }
        }, 15);
      } catch (error) {
        console.error("Error calling backend:", error);
        setFetchError(
          "Connection to AI Engine failed. Ensure backend is running.",
        );
        setIsParsing(false);
      }
    };

    fetchAnalysis();
  }, [article]);

  const handleInject = async () => {
    if (!parsedData) return;

    const config = {
      type: parsedData.eventType.split(" - ")[1] || parsedData.eventType,
      severity: parsedData.computedSeverity,
      location: locationName,
      impactAssessment: parsedData.impactAssessment,
    };

    let datadogEventId = null;
    // Log to Datadog via backend
    try {
      const ddRes = await fetch("http://localhost:3001/api/inject-crisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crisisData: config }),
      });
      if (ddRes.ok) {
        const ddData = await ddRes.json();
        datadogEventId = ddData.eventId;
      }
    } catch (e) {
      console.error("Failed to inject crisis to backend:", e);
    }

    const finalConfig = { ...config, datadogEventId };

    setCrisisConfig(finalConfig);
    setIsCrisis(true);
    navigate("/incident");
  };

  if (!article) {
    return (
      <div style={{ color: "white", padding: "2rem" }}>
        Error: News article not found for {locationName}
      </div>
    );
  }

  return (
    <div className="page-layout config-split-layout">
      {/* Left Side: News Article Feed */}
      <div className="left-panel news-feed-panel" style={{ padding: "2rem" }}>
        <div className="panel-header" style={{ marginBottom: "1.5rem" }}>
          <FileText size={20} color="var(--color-indigo)" />
          <h3>Live Global News Ingestion</h3>
        </div>

        <NewsArticle article={article} />
      </div>

      {/* Right Side: AI Parsing Terminal */}
      <div className="right-panel ai-parse-panel">
        <div className="panel-header">
          <Cpu size={20} color="var(--color-green)" />
          <h3>ChainLink LLM Analysis Engine</h3>
          {isParsing ? (
            <div className="status-badge parsing">Processing...</div>
          ) : (
            <div className="status-badge complete">
              {fetchError ? "Error" : "Analysis Complete"}
            </div>
          )}
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <div className="mac-buttons">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="terminal-title">
              agent-core@chainlink:~/parser
            </span>
          </div>
          <div className="terminal-content">
            <div className="log-line">
              <span className="cmd-prompt">&gt;</span> initiating context
              extraction pipeline for article ID: {article.id}...
            </div>
            <div className="log-line">
              <span className="cmd-prompt">&gt;</span> running zero-shot supply
              chain impact analysis...
            </div>
            <div className="log-line">
              <span className="cmd-prompt">&gt;</span> constructing structured
              payload via MiniMax...
            </div>

            {fetchError ? (
              <div
                className="log-line"
                style={{ color: "var(--color-red)", marginTop: "1rem" }}
              >
                {fetchError}
              </div>
            ) : (
              <pre className="json-output">
                {typedJson}
                {isParsing && <span className="typing-cursor"></span>}
              </pre>
            )}

            {!isParsing && !fetchError && parsedData && (
              <div className="log-line success slide-down-fast">
                <CheckCircle2 size={16} /> severity scored as:{" "}
                <strong
                  style={{ color: "var(--color-red)", marginLeft: "4px" }}
                >
                  {parsedData.computedSeverity}
                </strong>
              </div>
            )}
          </div>
        </div>

        <div className="action-footer" style={{ padding: 0 }}>
          <button
            className={`launch-btn ${!isParsing && !fetchError ? "alert-pulse" : ""}`}
            onClick={handleInject}
            disabled={isParsing || !!fetchError}
            style={{
              opacity: isParsing || !!fetchError ? 0.5 : 1,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <AlertTriangle size={20} />
            {isParsing ? "Awaiting AI Analysis..." : "Confirm & Inject Crisis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisConfig;
