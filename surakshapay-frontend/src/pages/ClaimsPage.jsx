import React from 'react';
import Sidebar from '../components/common/Sidebar';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import '../App.css';

const claims = [
  { id: 'TRG-9921', date: 'Wed, Mar 18', type: 'Extreme Heat', value: '46°C', threshold: '>45°C', payout: '₹400', status: 'Settled' },
  { id: 'TRG-8812', date: 'Mon, Mar 12', type: 'Heavy Rain', value: '62mm', threshold: '>50mm', payout: '₹600', status: 'Settled' },
];

const ClaimsPage = () => {
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
              {claims.map(c => (
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
