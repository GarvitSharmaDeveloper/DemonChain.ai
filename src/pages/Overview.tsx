import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplyChainMap from "../components/SupplyChainMap";
import LiveShipmentTracker from "../components/LiveShipmentTracker";
import { X, Play } from "lucide-react";

interface OverviewProps {
  isCrisis?: boolean;
  setIsCrisis: (val: boolean) => void;
}

const Overview: React.FC<OverviewProps> = ({ setIsCrisis }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Taiwan Warehouse");

  // Ensure we are in a healthy state on overview
  React.useEffect(() => {
    setIsCrisis(false);
  }, [setIsCrisis]);

  const handleLaunch = () => {
    navigate("/inject", { state: { location: selectedLocation } });
  };

  return (
    <div className="page-layout" style={{ position: "relative" }}>
      {/* Left Side: Healthy Map */}
      <div className="left-panel">
        <div
          className="page-header"
          style={{
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "1.5rem",
            flexShrink: 0,
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
            Global Supply Chain Topology
          </h2>
          <p style={{ fontSize: "0.9rem" }}>
            Status: Healthy. No predicted disruptions.
          </p>
        </div>
        <div className="map-container" style={{ flex: "1" }}>
          <SupplyChainMap isCrisis={false} />
        </div>
      </div>

      {/* Right Side: Live Shipment Tracker */}
      <div className="right-panel">
        <LiveShipmentTracker />
      </div>

      {/* Absolute positioning for the inject crisis button, matching IncidentView styles */}
      <button
        className="crisis-button slide-down"
        style={{
          marginLeft: "30px",
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          background: "var(--color-indigo)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
          padding: "1rem 2rem",
          fontSize: "1.1rem",
        }}
        onClick={() => setShowModal(true)}
      >
        ⚙️ Configure & Inject Crisis
      </button>

      {/* Location Selection Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content slide-up">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">Select Crisis Location</h2>
            <p className="modal-subtitle">
              Choose a region to simulate an AI-detected supply chain
              disruption.
            </p>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label>Originating Node</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="styled-select"
              >
                <option value="Taiwan Warehouse">
                  Taiwan Warehouse (Critical)
                </option>
                <option value="India Port">India Port (Medium)</option>
                <option value="Singapore Hub">Singapore Hub (Low)</option>
              </select>
            </div>

            <button
              className="launch-btn alert-pulse"
              onClick={handleLaunch}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Play size={20} />
              Launch Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
