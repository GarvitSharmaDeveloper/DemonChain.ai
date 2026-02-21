import React, { useEffect, useState, useRef } from "react";
import { Terminal, Rss } from "lucide-react";
import classNames from "classnames";
import "./AgentTerminal.css";

interface AgentTerminalProps {
  isCrisis: boolean;
  payload?: any;
}

interface LogEntry {
  id: number;
  time: string;
  text: string;
  type: "normal" | "warning" | "critical" | "info";
}

const AgentTerminal: React.FC<AgentTerminalProps> = ({ isCrisis, payload }) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      text: "AgentCore initialized. Watching global knowledge graphs.",
      type: "info",
    },
    {
      id: 2,
      time: new Date().toLocaleTimeString(),
      text: "Supply chain health nominal. No predicted disruptions.",
      type: "normal",
    },
  ]);
  const [news, setNews] = useState(
    "Global markets steady; Tech giants report Q3 earnings...",
  );
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (text: string, type: LogEntry["type"]) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        text,
        type,
      },
    ]);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  useEffect(() => {
    if (isCrisis) {
      const loc = payload?.location || "Taiwan Warehouse";
      const eventType = payload?.type || "Earthquake";

      setNews(
        `BREAKING: A severe ${eventType.toLowerCase()} has struck near ${loc}, severely damaging industrial hubs.`,
      );

      const sequence = [
        {
          t: 0,
          text: `NEWS EVENT CAPTURED: "${eventType} hits ${loc}"`,
          type: "warning" as const,
        },
        {
          t: 1000,
          text: "CRISIS DETECTED. Querying AWS Bedrock & MiniMax LLM...",
          type: "critical" as const,
        },
        {
          t: 2500,
          text: "Translating global news into structured event data...",
          type: "info" as const,
        },
        {
          t: 4000,
          text: "Analyzing blast radius via Neo4j Graph Database...",
          type: "info" as const,
        },
        {
          t: 5500,
          text: `MATCH FOUND: Node at ${loc} supplies components for NY Apple Store.`,
          type: "warning" as const,
        },
        {
          t: 6500,
          text: `PREDICTION GENERATED: ${payload?.severity === "Critical" ? "14" : payload?.severity === "High" ? "8" : "3"}-day delay imminent for US transit.`,
          type: "critical" as const,
        },
        {
          t: 8000,
          text: "Transmitting payload to Datadog Incident Command...",
          type: "info" as const,
        },
        {
          t: 9000,
          text: "Datadog webhook triggered successfully.",
          type: "normal" as const,
        },
      ];

      const timeouts = sequence.map((item) =>
        setTimeout(() => addLog(item.text, item.type), item.t),
      );

      return () => timeouts.forEach((t) => clearTimeout(t));
    } else {
      setNews("Global markets steady; Tech giants report Q3 earnings...");
      addLog("System reset. Resuming nominal monitoring.", "normal");
    }
  }, [isCrisis]);

  // Idle log simulation
  useEffect(() => {
    if (isCrisis) return;
    const interval = setInterval(() => {
      addLog("Scanning 12,400 supply nodes... OK", "normal");
    }, 5000);
    return () => clearInterval(interval);
  }, [isCrisis]);

  return (
    <div className="terminal-wrapper">
      <div className="terminal-header">
        <div className="terminal-title">
          <Terminal size={18} />
          <span>AgentCore Scout</span>
        </div>
        <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
          STATUS: {isCrisis ? "CRISIS MODE" : "MONITORING"}
        </div>
      </div>

      <div className={classNames("news-ticker", { alert: isCrisis })}>
        <Rss
          size={16}
          className={classNames("news-label", { alert: isCrisis })}
        />
        <span className={classNames("news-label", { alert: isCrisis })}>
          LIVE NEWS:
        </span>
        {/* @ts-expect-error marquee is deprecated */}
        <marquee scrollamount="5">{news}</marquee>
      </div>

      <div className="logs-container">
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            <span className="log-time">[{log.time}]</span>
            <span className={`log-text ${log.type}`}>{log.text}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default AgentTerminal;
