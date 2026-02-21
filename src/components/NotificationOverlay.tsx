import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import './NotificationOverlay.css';

interface NotificationOverlayProps {
    isCrisis: boolean;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ isCrisis }) => {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (isCrisis) {
            // The Datadog hero moment kicks in around 7 seconds, so we show the alert shortly after
            const alertTimer = setTimeout(() => {
                setShowNotification(true);

                // Trigger TTS Audio
                if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(
                        "Warning: Shipment delayed by 14 days due to Taiwan earthquake. Please adjust inventory."
                    );
                    utterance.rate = 0.9;
                    utterance.pitch = 0.8;
                    window.speechSynthesis.speak(utterance);
                }
            }, 8000); // 8s after "Inject Crisis"

            return () => {
                clearTimeout(alertTimer);
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                }
            };
        } else {
            setShowNotification(false);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        }
    }, [isCrisis]);

    const handleAcknowledge = () => {
        setShowNotification(false);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };

    const handleRunbook = () => {
        alert("Executing Runbook: 'Supply Chain Disruption'\n\n1. Alerting Logistics Team (Done)\n2. Re-routing shipments from alternative nodes (In Progress)\n3. Updating NY Apple Store inventory ETA (Done)");
    };

    if (!showNotification) return null;

    return (
        <div className="overlay-container slide-down">
            <div className="fake-notification">
                <div className="icon-container">
                    <ShieldAlert size={24} />
                </div>
                <div className="notification-content">
                    <div className="notification-header">
                        <span className="notification-sender">Datadog Incident Management</span>
                        <span className="notification-time">Just now</span>
                    </div>
                    <div className="notification-title">CRITICAL: Supply Chain Anomaly</div>
                    <div className="notification-body">
                        Risk Score threshold exceeded. 14-day shipment delay predicted for NY Apple Store components. Automatic Slack & PagerDuty alerts triggered.
                    </div>
                    <div className="notification-actions">
                        <button className="action-btn primary" onClick={handleAcknowledge}>Acknowledge</button>
                        <button className="action-btn" onClick={handleRunbook}>View Runbook</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationOverlay;
