import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Overview from './pages/Overview';
import CrisisConfig from './pages/CrisisConfig';
import IncidentView from './pages/IncidentView';
import TicketDashboard from './pages/TicketDashboard';
import './App.css';

function NavHeader({ isCrisis }: { isCrisis: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="demo-nav">
      <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        ChainLink Demo
      </div>
      <div className="nav-controls">
        {location.pathname !== '/' && (
          <button className="nav-btn" onClick={() => navigate(-1)}>← Back</button>
        )}
        {isCrisis && <div className="nav-status alert">ACTIVE INCIDENT</div>}
        {!isCrisis && <div className="nav-status ok">SYSTEM NOMINAL</div>}
      </div>
    </div>
  );
}

function App() {
  const [isCrisis, setIsCrisis] = useState(false);
  const [crisisConfig, setCrisisConfig] = useState({
    type: 'Earthquake',
    severity: 'Critical',
    location: 'Taiwan Warehouse'
  });

  return (
    <BrowserRouter>
      <div className="app-container">
        <NavHeader isCrisis={isCrisis} />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Overview isCrisis={isCrisis} setIsCrisis={setIsCrisis} />} />
            <Route path="/inject" element={<CrisisConfig setCrisisConfig={setCrisisConfig} setIsCrisis={setIsCrisis} />} />
            <Route path="/incident" element={<IncidentView isCrisis={isCrisis} config={crisisConfig} />} />
            <Route path="/tickets" element={<TicketDashboard crisisConfig={crisisConfig} setIsCrisis={setIsCrisis} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
