import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { ShieldCheck, Zap, AlertTriangle, TrendingUp, CloudRain, Sun, Wind, BellRing } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../App.css';

const initialData = [
  { name: 'Mon', earnings: 1200, protected: 1200 },
  { name: 'Tue', earnings: 1500, protected: 1500 },
  { name: 'Wed', earnings: 400, protected: 1800, payout: 1400 },
  { name: 'Thu', earnings: 1300, protected: 1300 },
  { name: 'Fri', earnings: 1600, protected: 1600 },
  { name: 'Sat', earnings: 2100, protected: 2100 },
  { name: 'Sun', earnings: 2400, protected: 2400 },
];

const UserDashboard = () => {
  const [demoTriggered, setDemoTriggered] = useState(false);
  const [totalPayouts, setTotalPayouts] = useState("2,440");
  const [chartData, setChartData] = useState(initialData);

  // Simulate Hackathon Demo Flow
  useEffect(() => {
    const timer = setTimeout(() => {
      setDemoTriggered(true);
      setTotalPayouts("2,840"); // Simulate +400 payout
      
      // Update chart dynamically
      const newData = [...initialData];
      newData[3] = { ...newData[3], protected: 1700, payout: 400 }; // Boost Thu line
      setChartData(newData);
    }, 4500); // Triggers exactly 4.5 seconds after mounting the dashboard

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Interactive Hackathon Toast Notification */}
      {demoTriggered && (
        <div className="demo-toast">
          <div className="demo-toast-icon">🔥</div>
          <div className="demo-toast-content">
            <h4>Live: Extreme Heat Triggered</h4>
            <p>Koromangala hit 46°C. <span>+₹400 Payout Credited via UPI.</span></p>
          </div>
        </div>
      )}

      <Sidebar />
      
      <main className="dashboard-main">
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 className="page-title">Overview</h1>
            <p className="page-subtitle">Real-time data for your current week</p>
          </div>
          <div className="card-badge badge-active" style={{ fontSize: '1rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', animation: 'pulse 2s infinite' }}></div>
            Policy Active
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="kpi-grid">
          {/* Card 1: Protected Earnings */}
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Protected Earnings</span>
              <div className="kpi-icon-wrapper kpi-icon-blue"><ShieldCheck size={24} /></div>
            </div>
            <h2 className="kpi-value">₹8,500</h2>
            <p className="kpi-subtext">This week limit: ₹10,000</p>
          </div>

          {/* Card 2: Total Payouts (Interactive) */}
          <div className="kpi-card" style={demoTriggered ? { borderColor: '#10b981', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' } : {}}>
            <div className="kpi-header">
              <span className="kpi-label">Total Payouts</span>
              <div className="kpi-icon-wrapper kpi-icon-green"><TrendingUp size={24} /></div>
            </div>
            <h2 className={`kpi-value ${demoTriggered ? 'value-updated' : ''}`}>₹{totalPayouts}</h2>
            <p className="kpi-subtext">+12% from last week</p>
          </div>

          {/* Card 3: Risk Score */}
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">AI Risk Score</span>
              <div className="kpi-icon-wrapper kpi-icon-orange"><AlertTriangle size={24} /></div>
            </div>
            <h2 className="kpi-value">68<span>/ 100</span></h2>
            <p className="kpi-subtext">Moderate Risk Profile</p>
          </div>

          {/* Card 4: Weekly Premium */}
          <div className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">Weekly Premium</span>
              <div className="kpi-icon-wrapper kpi-icon-blue"><Zap size={24} /></div>
            </div>
            <h2 className="kpi-value">₹15</h2>
            <p className="kpi-subtext">Auto-deducted every Monday</p>
          </div>
        </div>

        {/* Content Split: Chart and Alerts */}
        <div className="dashboard-content-grid">
          
          {/* Main Chart */}
          <div className="chart-card">
            <h3 className="card-heading">Earnings & Protection Trend</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProtected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="protected" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorProtected)" />
                  <Area type="monotone" dataKey="earnings" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Alerts Column */}
          <div className="alerts-card">
            <h3 className="card-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Live AI Alerts
              <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#64748b' }}><BellRing size={12} style={{ display: 'inline', marginRight: '4px' }}/> Syncing IMD Data</span>
            </h3>
            
            {demoTriggered && (
              <div className="alert-item alert-red" style={{ animation: 'slideInRight 0.3s ease-out', borderLeft: '4px solid #ef4444' }}>
                <div className="alert-icon"><Sun /></div>
                <div className="alert-content">
                  <h4>Extreme Heat Payout</h4>
                  <p>Temperature crossed 45°C. Automatic ₹400 payout processed instantly to wallet.</p>
                  <small>Just Now</small>
                </div>
              </div>
            )}

            {/* Yellow Rain Alert */}
            <div className="alert-item alert-yellow">
              <div className="alert-icon"><CloudRain /></div>
              <div className="alert-content">
                <h4>Heavy Rain Approaching</h4>
                <p>Parametric trigger might be hit in Koramangala (prob: 85%). Threshold &gt;50mm.</p>
                <small>12 mins ago</small>
              </div>
            </div>

            {/* Orange Pollution Alert */}
            <div className="alert-item alert-orange">
              <div className="alert-icon"><Wind /></div>
              <div className="alert-content">
                <h4>Severe AQI Detected</h4>
                <p>AQI level is 420. Mask subsidy of ₹100 credited to your active wallet.</p>
                <small>Mon, 9:00 AM</small>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
