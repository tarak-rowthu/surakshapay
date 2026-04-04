import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { DownloadCloud } from 'lucide-react';
import '../App.css';

import api from '../api/axios';

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        if (!userId) return;
        const res = await api.get(`/api/policy/get?userId=${userId}`);
        setPolicies(res.data);
      } catch (err) {
        console.error("Failed to fetch policies");
      }
    };
    fetchPolicies();

    const fetchPlans = async () => {
      try {
        const res = await api.get('/api/policy/plans');
        const descriptions = {
          'Basic': 'Essential protection against minor weather disruptions. Best for part-time riders.',
          'Standard': 'Balanced coverage covering most common regional weather events.',
          'Plus': 'Enhanced protection with higher limits for full-time workers.',
          'Premium': 'Maximum protection for severe disruptions and high continuous earnings.'
        };
        setPlans(res.data.map(p => ({
           name: p.planType,
           premium: p.premium,
           coverage: p.coverage,
           description: descriptions[p.planType] || 'Standard parametric protection plan.'
        })));
      } catch (err) {
        console.error("Failed to fetch plans");
      }
    };
    fetchPlans();
  }, []);

  const handleBuyPolicy = async (plan) => {
    setBuying(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || 1;
      const requestPayload = {
        userId,
        location: user.location || user.city || 'Chennai',
        planType: plan.name,
        premium: plan.premium,
        coverage: plan.coverage
      };
      console.log("Activating plan for userId:", userId);
      console.log("API request payload:", requestPayload);
      
      const activateRes = await api.post('/api/policy/activate', requestPayload);
      console.log("API response:", activateRes.data);
      
      // Refresh policies
      const res = await api.get(`/api/policy/get?userId=${userId}`);
      setPolicies(res.data);
      alert(`✅ Plan Activated Successfully!\n₹${plan.premium} plan is now active`);
    } catch (err) {
      alert("❌ Failed to activate plan. Try again.");
    } finally {
      setBuying(false);
    }
  };

  const activePolicy = policies.find(p => p.status === 'ACTIVE');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <main className="dashboard-main">
        <h1 className="page-title">My Policies</h1>
        <p className="page-subtitle">Manage your active protection plans and view historical coverage.</p>

        {activePolicy && (
        <div className="chart-card" style={{ marginBottom: '2rem' }}>
          <h3 className="card-heading">Current Active Policy</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Policy Number</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>POL-{activePolicy.id}</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Premium</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>₹{activePolicy.premium}</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Start Date</p>
              <p style={{ fontSize: '1.0rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>{activePolicy.startDate ? new Date(activePolicy.startDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>End Date</p>
              <p style={{ fontSize: '1.0rem', fontWeight: '700', color: '#1E293B', margin: 0 }}>{activePolicy.endDate ? new Date(activePolicy.endDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Documents</p>
              <button style={{ background: '#EFF6FF', color: '#3B82F6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DownloadCloud size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
        )}

        <h3 className="card-heading" style={{ marginTop: activePolicy ? '3rem' : '0' }}>Available Upgrade Plans</h3>
        <p style={{ color: '#64748B', marginBottom: '2rem' }}>Choose a protection plan that fits your earning goals. AI validates local weather triggers instantly.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {plans.map((plan, idx) => {
            const isCurrent = activePolicy?.planType === plan.name;
            return (
            <div key={idx} className="chart-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: isCurrent ? '2px solid #10B981' : '1px solid #E2E8F0', backgroundColor: isCurrent ? '#F0FDF4' : '#FFFFFF' }}>
              {isCurrent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#10B981', color: 'white', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem' }}>CURRENT PLAN</div>}
              <h4 style={{ fontSize: '1.25rem', margin: isCurrent ? '1.5rem 0 0.5rem 0' : '0 0 0.5rem 0', color: '#1E293B' }}>{plan.name} Plan</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748B', minHeight: '40px', marginBottom: '1.5rem' }}>{plan.description}</p>
              
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B', fontWeight: '600' }}>Weekly Premium</span>
                  <span style={{ fontWeight: '800', color: '#1E293B' }}>₹{plan.premium}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B', fontWeight: '600' }}>Max Coverage</span>
                  <span style={{ fontWeight: '800', color: '#10B981' }}>₹{plan.coverage.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                disabled={activePolicy?.planType === plan.name || buying}
                onClick={() => handleBuyPolicy(plan)}
                style={{ 
                   marginTop: 'auto', 
                   width: '100%', 
                   padding: '0.85rem', 
                   borderRadius: '8px', 
                   fontWeight: '700', 
                   border: 'none', 
                   cursor: activePolicy?.planType === plan.name ? 'not-allowed' : 'pointer',
                   background: activePolicy?.planType === plan.name ? '#E2E8F0' : '#1E3A8A',
                   color: activePolicy?.planType === plan.name ? '#94A3B8' : 'white',
                   transition: 'background 0.2s'
                }}
              >
                {activePolicy?.planType === plan.name ? 'Current Plan' : (buying ? 'Activating...' : 'Activate Plan')}
              </button>
            </div>
          )})}
        </div>

        <h3 className="card-heading" style={{ marginTop: '3rem' }}>Policy History</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Type</th>
                <th>Max Coverage</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '600', color: '#1E3A8A' }}>POL-{p.id}</td>
                  <td>{p.planType}</td>
                  <td style={{ fontWeight: '700' }}>₹{p.coverage}</td>
                  <td>{p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{p.endDate ? new Date(p.endDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`card-badge ${p.status === 'ACTIVE' ? 'badge-active' : ''}`} style={p.status !== 'ACTIVE' ? {background:'#F1F5F9', color:'#64748B'} : {}}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default PolicyManagement;
