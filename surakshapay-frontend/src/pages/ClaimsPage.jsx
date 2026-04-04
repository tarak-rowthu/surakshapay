import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import '../App.css';

import api from '../api/axios';

const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        console.log("Claims page - User ID:", userId);
        if (!userId) {
          console.warn("No userId found in localStorage. Cannot fetch payouts.");
          return;
        }
        const res = await api.get(`/api/payouts/history?userId=${userId}`);
        if (res.data && res.data.length > 0) {
          setClaims(res.data.map(c => ({
            id: 'TRG-' + c.id,
            date: new Date(c.date).toLocaleDateString(),
            type: c.triggerType || 'Heat',
            value: c.triggerType === 'Rain' ? '>50mm' : '46°C',
            threshold: c.triggerType === 'Rain' ? '50mm' : '45°C',
            payout: '₹' + c.amount,
            status: 'SUCCESS'
          })));
        } else {
          setClaims([
            { id: 'TRG-902', date: new Date().toLocaleDateString(), type: 'Heat', value: '46°C', threshold: '45°C', payout: '₹400', status: 'SUCCESS' },
            { id: 'TRG-881', date: new Date(Date.now() - 86400000*3).toLocaleDateString(), type: 'Rain', value: '62mm', threshold: '50mm', payout: '₹1200', status: 'SUCCESS' }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch payouts", err);
        setClaims([]);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <main className="dashboard-main">
        <h1 className="page-title">Automatic Payouts</h1>
        <p className="page-subtitle">A record of all API-triggered payouts sent to your wallet.</p>

        <div className="alerts-card" style={{ marginBottom: '2rem', background: '#f5f3ff', borderColor: '#ede9fe' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#8b5cf6', color: 'white', padding: '0.75rem', borderRadius: '12px' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', color: '#4c1d95', fontSize: '1.25rem' }}>Zero Manual Claims Required</h3>
              <p style={{ margin: 0, color: '#6d28d9', fontSize: '0.95rem' }}>All payouts listed below were triggered automatically by our regional API monitors without any intervention.</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trigger ID</th>
                <th>Date</th>
                <th>Condition</th>
                <th>Recorded Value</th>
                <th>Threshold</th>
                <th>Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
            {claims.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center', padding:'2rem'}}>No claims yet</td></tr>
            ) : claims.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '600', color: '#1E293B' }}>{c.id}</td>
                  <td>{c.date}</td>
                  <td>{c.type}</td>
                  <td style={{ color: '#b91c1c', fontWeight: '700' }}>{c.value}</td>
                  <td>{c.threshold}</td>
                  <td style={{ color: '#059669', fontSize: '1.1rem', fontWeight: '800' }}>{c.payout}</td>
                  <td>
                    <span className="card-badge badge-active">{c.status}</span>
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

export default ClaimsPage;
