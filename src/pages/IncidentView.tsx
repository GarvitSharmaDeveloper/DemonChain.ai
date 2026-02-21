import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplyChainMap from "../components/SupplyChainMap";
import AgentTerminal from "../components/AgentTerminal";
import DatadogDashboard from "../components/DatadogDashboard";
import NotificationOverlay from "../components/NotificationOverlay";

interface IncidentViewProps {
  isCrisis: boolean;
  config: any;
}

const IncidentView: React.FC<IncidentViewProps> = ({ isCrisis, config }) => {
  const navigate = useNavigate();
  const [showTicketButton, setShowTicketButton] = useState(false);

  // In a real app we'd trigger this off the datadog alert state, but we'll use a timer for the demo
  useEffect(() => {
    if (isCrisis) {
      const timer = setTimeout(() => {
        setShowTicketButton(true);
      }, 10000); // Show "Generate Ticket" button after the main crisis flow finishes
      return () => clearTimeout(timer);
    }
  }, [isCrisis]);

  return (
    <div className="page-layout" style={{ position: "relative" }}>
      {/* Left Side: Supply Chain & Agent Logic */}
      <div className="left-panel">
        <div className="map-container">
          <SupplyChainMap isCrisis={isCrisis} />
        </div>
        <div className="terminal-container">
          {/* We pass config to terminal so it can customize the logs slightly if we want */}
          <AgentTerminal isCrisis={isCrisis} payload={config} />
        </div>
      </div>

      {/* Right Side: Datadog Dashboard */}
      <div className="right-panel">
        <div className="dashboard-container">
          <DatadogDashboard isCrisis={isCrisis} severity={config.severity} />
        </div>

        {/* Absolute positioned hero alert */}
        <NotificationOverlay isCrisis={isCrisis} />
      </div>

      {showTicketButton && (
        <button
          className="crisis-button slide-down"
          style={{ background: "var(--color-indigo)", zIndex: 1000 }}
          onClick={() => navigate("/tickets")}
        >
          🎫 View Generated Incident Ticket
        </button>
      )}
    </div>
  );
};

export default IncidentView;
