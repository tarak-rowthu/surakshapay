import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import { User, Bell, Shield, Lock, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [rainToggle, setRainToggle] = useState(true);
  const [heatToggle, setHeatToggle] = useState(true);
  const [pollutionToggle, setPollutionToggle] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <main className="dashboard-main">
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">Manage your personal profile, notifications, and security preferences.</p>

        <div className="settings-grid">
          
          {/* A. Profile Settings */}
          <div className="kpi-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="settings-section-title">
              <User size={20} color="#3b82f6" /> Profile Details
            </h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" defaultValue="Rahul Kumar" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" defaultValue="rahul.kumar@partner.zepto.in" />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" defaultValue="+91 98765 43210" />
            </div>
            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#3b82f6', borderColor: '#3b82f6', marginTop: 'auto' }}>
              <Save size={18} /> Save Profile
            </button>
          </div>

          {/* B. Notification Settings */}
          <div className="kpi-card">
            <h3 className="settings-section-title">
              <Bell size={20} color="#f59e0b" /> Alert Preferences
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Select which active parametric hazards should ping your mobile device.</p>
            
            <div className="toggle-wrapper">
              <span className="toggle-label">🌧️ Heavy Rain Alerts</span>
              <div className={`toggle-switch ${rainToggle ? 'active' : ''}`} onClick={() => setRainToggle(!rainToggle)}></div>
            </div>
            <div className="toggle-wrapper">
              <span className="toggle-label">☀️ Extreme Heat Alerts</span>
              <div className={`toggle-switch ${heatToggle ? 'active' : ''}`} onClick={() => setHeatToggle(!heatToggle)}></div>
            </div>
            <div className="toggle-wrapper">
              <span className="toggle-label">🌫️ Severe Pollution Alerts</span>
              <div className={`toggle-switch ${pollutionToggle ? 'active' : ''}`} onClick={() => setPollutionToggle(!pollutionToggle)}></div>
            </div>
          </div>

          {/* C. Policy Settings */}
          <div className="kpi-card">
            <h3 className="settings-section-title">
              <Shield size={20} color="#10b981" /> Current Plan
            </h3>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Active Subscription</span>
                <strong style={{ color: '#1e293b' }}>Comprehensive</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Weekly Deduction</span>
                <strong style={{ color: '#10b981' }}>₹15/week</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Max Coverage Limit</span>
                <strong style={{ color: '#3b82f6' }}>₹10,000</strong>
              </div>
            </div>
            <button onClick={() => navigate('/pricing')} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Change Plan
            </button>
          </div>

          {/* D. Security */}
          <div className="kpi-card">
            <h3 className="settings-section-title">
              <Lock size={20} color="#64748b" /> Security & Access
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Manage your account security parameters and active sessions.</p>
            
            <button className="btn-outline" style={{ display: 'block', width: '100%', color: '#1e293b', borderColor: '#cbd5e1', marginBottom: '1rem' }}>
              Change Password
            </button>
            <button className="btn-outline" style={{ display: 'block', width: '100%', color: '#1e293b', borderColor: '#cbd5e1', marginBottom: '2rem' }}>
              Enable Two-Factor (2FA)
            </button>
            
            <hr style={{ borderTop: '1px solid #e2e8f0', borderBottom: 'none', marginBottom: '1.5rem' }} />

            <button onClick={() => navigate('/login')} style={{ width: '100%', background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}>
              Sign Out Securely
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
