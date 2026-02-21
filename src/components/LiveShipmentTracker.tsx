import React, { useState, useEffect } from "react";
import {
  Package,
  ArrowRight,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./LiveShipmentTracker.css";

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  cargo: string;
  progress: number;
  eta: string;
}

const initialShipments: Shipment[] = [
  {
    id: "SHP-992-NY",
    origin: "Taiwan Warehouse",
    destination: "NY Apple Store",
    cargo: "M4 Microchips, Displays (High Priority)",
    progress: 15,
    eta: "Oct 24, 2026",
  },
  {
    id: "SHP-401-LA",
    origin: "Shenzhen Assembly",
    destination: "Los Angeles Port",
    cargo: "Consumer Electronics, Accessories",
    progress: 68,
    eta: "Oct 15, 2026",
  },
  {
    id: "SHP-128-TX",
    origin: "Seoul Silicon",
    destination: "Austin Fulfillment",
    cargo: "Server Processors",
    progress: 42,
    eta: "Oct 19, 2026",
  },
];

const TRACKER_STEPS = ["Packed", "Departed", "Transit", "Customs", "Delivered"];

const LiveShipmentTracker: React.FC = () => {
  const [shipments, setShipments] = useState(initialShipments);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(["SHP-992-NY"]),
  );

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    // Prevent event from bubbling if there are other clickable elements inside
    e.stopPropagation();
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Minor simulation to make progress bars move slightly over time
  useEffect(() => {
    const interval = setInterval(() => {
      setShipments((prev) =>
        prev.map((s) => ({
          ...s,
          progress: Math.min(100, s.progress + Math.random() * 0.5),
        })),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <h3>
          <Package size={20} color="var(--color-indigo)" /> Live Shipment
          Tracker
        </h3>
        <div className="all-good-badge">All Systems Nominal</div>
      </div>

      <div className="shipment-list">
        {shipments.map((shipment) => {
          const isExpanded = expandedIds.has(shipment.id);
          return (
            <div
              key={shipment.id}
              className={`shipment-card ${isExpanded ? "expanded" : ""}`}
              onClick={(e) => toggleExpand(shipment.id, e)}
            >
              <div
                className="shipment-top-row"
                style={{ marginBottom: isExpanded ? "1rem" : "0" }}
              >
                <div>
                  <div className="shipment-id">{shipment.id}</div>
                  <div className="shipment-cargo">{shipment.cargo}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div className="shipment-status">
                    <TrendingUp
                      size={14}
                      style={{ display: "inline", marginRight: "4px" }}
                    />
                    In Transit
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} color="var(--text-muted)" />
                  ) : (
                    <ChevronDown size={20} color="var(--text-muted)" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="shipment-details slide-down-fast">
                  <div className="routing-info">
                    <div className="routing-node">
                      <span>{shipment.origin}</span>
                    </div>
                    <ArrowRight size={16} className="routing-arrow" />
                    <div className="routing-node" style={{ fontWeight: 600 }}>
                      <span>{shipment.destination}</span>
                    </div>
                  </div>

                  <div className="pizza-tracker">
                    <div className="pizza-tracker-line-bg">
                      <div
                        className="pizza-tracker-line-fill"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                    <div className="pizza-tracker-steps">
                      {TRACKER_STEPS.map((step, index) => {
                        const stepThreshold =
                          (index / (TRACKER_STEPS.length - 1)) * 100;
                        const isCompleted = shipment.progress >= stepThreshold;
                        // Assuming the 'active' step is the one that is currently being progressed towards
                        const isActive =
                          !isCompleted &&
                          shipment.progress >=
                            stepThreshold - 100 / (TRACKER_STEPS.length - 1);

                        return (
                          <div
                            key={step}
                            className={`tracker-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                          >
                            <div className="step-dot">
                              {isCompleted && (
                                <div className="dot-inner-check" />
                              )}
                            </div>
                            <span className="step-label">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="eta-label">
                    <span>
                      Estimated Arrival:{" "}
                      <span style={{ color: "var(--text-primary)" }}>
                        {shipment.eta}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* Explicit spacer to ensure scrollable area pushes past the floating crisis button */}
        <div style={{ height: "120px", width: "100%", flexShrink: 0 }} />
      </div>
    </div>
  );
};

export default LiveShipmentTracker;
