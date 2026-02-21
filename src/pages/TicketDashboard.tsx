import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Clock, MapPin, AlertCircle, FileText, CheckCircle2, ChevronRight, BriefcaseMedical, Users } from 'lucide-react';
import './TicketDashboard.css';

interface TicketDashboardProps {
    crisisConfig: any;
    setIsCrisis: (val: boolean) => void;
}

const TicketDashboard: React.FC<TicketDashboardProps> = ({ crisisConfig, setIsCrisis }) => {
    const navigate = useNavigate();
    const [mitigationPlan, setMitigationPlan] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    let severityColor = "var(--color-red)";
    if (crisisConfig.severity === "Medium") severityColor = "var(--color-yellow)";
    if (crisisConfig.severity === "Low") severityColor = "var(--color-green)";

    useEffect(() => {
        const generateMitigation = async () => {
            try {
                // Fetch dynamic mitigation from AWS Bedrock backend
                const response = await fetch('http://localhost:3001/api/generate-mitigation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ incidentDetails: crisisConfig })
                });

                if (response.ok) {
                    const data = await response.json();
                    setMitigationPlan(data.mitigationPlan);
                } else {
                    throw new Error("Failed to fetch AWS mitigation");
                }
            } catch (error) {
                console.error(error);
                // Fallback mitigation if API fails
                setMitigationPlan("1. **Reroute Shipments:** Immediately divert incoming vessels to alternative regional hubs.\n2. **Engage Backup Suppliers:** Activate secondary supplier contracts for critical components.\n3. **Notify Stakeholders:** Issue automated alerts to all downstream customers regarding expected delays.");
            } finally {
                setIsGenerating(false);
            }
        };

        generateMitigation();
    }, [crisisConfig]);

    // Parse the markdown bullets returned by Claude into a list
    const parsedMitigationSteps = mitigationPlan
        ? mitigationPlan.split('\n').filter(line => line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('-') || line.trim().startsWith('*')).map(line => {
            // Remove the bullet/number at the start and split by bold markdown if present
            const cleanLine = line.replace(/^(\d+\.|-|\*)\s*/, '').trim();
            const boldMatch = cleanLine.match(/\*\*(.*?)\*\*(.*)/);
            if (boldMatch) {
                return { title: boldMatch[1].replace(/:$/, ''), desc: boldMatch[2].trim(), status: 'pending' };
            }
            return { title: "Mitigation Step", desc: cleanLine, status: 'pending' };
        })
        : [];

    const handleReset = () => {
        setIsCrisis(false);
        navigate('/');
    };

    const delayDays = crisisConfig.severity === 'Critical' ? 14 : crisisConfig.severity === 'High' ? 8 : 3;

    return (
        <div className="page-layout ticket-layout" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="ticket-header-card glass-panel">
                <div className="ticket-header-main">
                    <div>
                        <div className="ticket-id" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            INC-3085
                            {crisisConfig.datadogEventId && (
                                <span style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--color-indigo)', borderRadius: '4px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
                                    Datadog Event: {crisisConfig.datadogEventId}
                                </span>
                            )}
                        </div>
                        <h1 className="ticket-title">Supply Chain Disruption: {crisisConfig.type} at {crisisConfig.location}</h1>
                    </div>
                    <div className="ticket-status badge-red">Open - Critical</div>
                </div>

                <div className="ticket-meta-grid">
                    <div className="meta-item">
                        <span className="meta-label"><MapPin size={14} /> Location</span>
                        <span className="meta-value">{crisisConfig.location}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label"><AlertCircle size={14} /> Impact</span>
                        <span className="meta-value" style={{ color: severityColor }}>{crisisConfig.severity}</span>
                    </div>
                    <div className="meta-item">
                        <span className="meta-label"><Clock size={14} /> Est. Delay</span>
                        <span className="meta-value">{delayDays} Days</span>
                    </div>
                </div>
            </div>

            <div className="ticket-content-grid">
                {/* Left Column: Details */}
                <div className="ticket-main-col">
                    <div className="ticket-section glass-panel">
                        <h2><Users size={18} /> Stakeholders Notified</h2>
                        <div className="stakeholder-list">
                            <div className="stakeholder-tag">Logistics Team (APAC)</div>
                            <div className="stakeholder-tag">Procurement Lead</div>
                            <div className="stakeholder-tag">Executive Comm.</div>
                        </div>
                    </div>

                    <div className="ticket-section glass-panel">
                        <h2><FileText size={18} /> Incident Details</h2>
                        <div className="incident-description">
                            <p><strong>System Detection:</strong> ChainLink Global AI parsed a critical alert regarding a {crisisConfig.type} impacting operations at the {crisisConfig.location}.</p>
                            <p><strong>Impact Assessment:</strong> {crisisConfig.impactAssessment || "Significant delays expected across all outbound freight lines."}</p>
                            <div className="impact-stats">
                                <div className="stat-box">
                                    <span className="stat-val">42</span>
                                    <span className="stat-label">Containers Delayed</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-val">$1.2M</span>
                                    <span className="stat-label">Value at Risk</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-val">+{delayDays}d</span>
                                    <span className="stat-label">Lead Time Added</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Execution */}
                <div className="ticket-sidebar">
                    <div className="ticket-section glass-panel runbook-section">
                        <h2>
                            <BriefcaseMedical size={18} />
                            AI Mitigation Recommended
                            {isGenerating && <span style={{ fontSize: '0.75rem', color: 'var(--color-indigo)', marginLeft: '8px' }}>(Generating via AWS Bedrock...)</span>}
                        </h2>

                        {isGenerating ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <div className="typing-cursor" style={{ margin: '0 auto 1rem auto' }}></div>
                                AI is formulating containment strategy...
                            </div>
                        ) : (
                            <div className="runbook-steps">
                                {parsedMitigationSteps.map((step, idx) => (
                                    <div key={idx} className={`runbook-step ${step.status}`}>
                                        <div className="step-icon">
                                            {step.status === 'completed' ? <CheckCircle2 size={16} /> : <div className="step-circle" />}
                                        </div>
                                        <div className="step-content">
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isGenerating && parsedMitigationSteps.length > 0 && (
                            <button className="execute-runbook-btn alert-pulse" style={{ marginTop: '1.5rem', width: '100%' }}>
                                Execute Recommended Runbook <ChevronRight size={16} />
                            </button>
                        )}
                    </div>

                    <div className="ticket-section glass-panel">
                        <h3>Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                            <button className="secondary-action-btn"><Share2 size={14} /> Share Ticket via Slack</button>
                            <button className="secondary-action-btn" onClick={handleReset} style={{ color: 'var(--color-text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>Close Simulation</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDashboard;
