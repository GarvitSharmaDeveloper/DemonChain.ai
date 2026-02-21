import React, { useEffect, useState } from 'react';
import { Activity, BarChart3 } from 'lucide-react';
import classNames from 'classnames';
import './DatadogDashboard.css';

interface DatadogDashboardProps {
    isCrisis: boolean;
    severity?: string;
}

const DatadogDashboard: React.FC<DatadogDashboardProps> = ({ isCrisis, severity = 'Critical' }) => {
    const [delayDays, setDelayDays] = useState(0);
    const [riskScore, setRiskScore] = useState(12);
    const [agentCost] = useState('$0.042 / hr');
    const [datadogEventId, setDatadogEventId] = useState<string | null>(null);

    // Chart data: [t, value] array simulating last 10 minutes
    const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        if (isCrisis) {
            // Delay the Datadog spike slightly to match the "hero moment" after Agent connected dots
            const timer = setTimeout(() => {
                const spikeAmount = severity === 'Critical' ? 14 : severity === 'High' ? 8 : 3;
                setDelayDays(spikeAmount);
                setRiskScore(severity === 'Critical' ? 98 : severity === 'High' ? 85 : 65);
                setChartData((prev) => {
                    const newData = [...prev.slice(1), spikeAmount];
                    return newData;
                });
                
                // Try grabbing the ID from localstorage or parent if possible, but for isolated component we'll just check if it was set
                const storedConfig = localStorage.getItem('lastIncident');
                if(storedConfig) {
                    try {
                       const parsed = JSON.parse(storedConfig);
                       if(parsed.datadogEventId) setDatadogEventId(parsed.datadogEventId);
                    } catch(e) {}
                }
            }, 7000); // 7s after "Inject Crisis"
            return () => clearTimeout(timer);
        } else {
            setDelayDays(0);
            setRiskScore(12);
            setChartData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            setDatadogEventId(null);
        }
    }, [isCrisis, severity]);

    // Build SVG path
    const maxVal = 15; // Y axis limit
    const width = 800;
    const height = 200;
    const pointWidth = width / (chartData.length - 1);

    const points = chartData.map((val, i) => {
        const x = i * pointWidth;
        const y = height - (val / maxVal) * height;
        return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
        <div className="dd-dashboard">
            <div className="dd-header">
                <div className="dd-title">
                    <Activity size={24} color="var(--color-indigo)" />
                    <span>Datadog: Incident Command</span>
                </div>
                <div>{isCrisis && <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>⚠️ CRITICAL ALERT</span>}</div>
            </div>

            <div className="dd-grid-top">
                <div className="dd-widget">
                    <div className="widget-title">Global Risk Score</div>
                    <div className={classNames('widget-value', { alert: riskScore > 50 })}>
                        {riskScore}/100
                    </div>
                </div>
                <div className="dd-widget">
                    <div className="widget-title">Predicted Delay</div>
                    <div className={classNames('widget-value', { alert: delayDays > 0 })}>
                        {delayDays} Days
                    </div>
                </div>
                <div className="dd-widget">
                    <div className="widget-title">Agent Compute Cost</div>
                    <div className="widget-value">{agentCost}</div>
                </div>
            </div>

            <div className="dd-chart-container">
                <div className="widget-title">Predicted Shipment Delays (Days)</div>
                <svg className="chart-svg" viewBox={`0 -10 ${width} ${height + 20}`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-indigo)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="var(--color-indigo)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="alertGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-red)" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="var(--color-red)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={areaD} className={classNames('chart-area', { alert: delayDays > 0 })} />
                    <path d={pathD} className={classNames('chart-line', { alert: delayDays > 0 })} />
                </svg>
            </div>

            <div className="dd-widget" style={{ flex: '0 0 auto' }}>
                <div className="widget-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChart3 size={16} /> APM Traces: AgentCore
                </div>
                <div className="dd-apm-list">
                    <div className="apm-row">
                        <span>GET /v1/knowledge-graph/neo4j</span>
                        <span className="apm-status ok">200 OK (45ms)</span>
                    </div>
                    <div className="apm-row">
                        <span>POST /v1/bedrock/predict-delay</span>
                        <span className="apm-status ok">200 OK (1.2s)</span>
                    </div>
                    {isCrisis && (
                        <div className="apm-row slide-down" style={{ borderLeft: '3px solid var(--color-red)' }}>
                            <span>POST /api/v1/events</span>
                            <span className="apm-status error">202 ACCEPTED (Alert Fired)</span>
                        </div>
                    )}
                    {datadogEventId && (
                         <div className="apm-row slide-down" style={{ borderLeft: '3px solid var(--color-green)', marginTop: '4px' }}>
                         <span style={{color: 'var(--color-green)'}}>↳ Live Datadog Event ID:</span>
                         <span className="apm-status" style={{color: 'white', fontFamily: 'monospace'}}>{datadogEventId}</span>
                     </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatadogDashboard;
