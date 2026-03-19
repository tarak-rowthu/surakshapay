import React from 'react';
import Sidebar from '../components/common/Sidebar';
import { DownloadCloud } from 'lucide-react';
import '../App.css';

const policies = [
  { id: 'POL-1082-99', type: 'Comprehensive', coverage: '₹10,000', start: '2026-03-15', end: '2026-03-22', status: 'Active' },
  { id: 'POL-1055-32', type: 'Rain Only', coverage: '₹4,000', start: '2026-02-14', end: '2026-02-21', status: 'Expired' },
];

const PolicyManagement = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <main className="dashboard-main">
        <h1 className="page-title">My Policies</h1>
        <p className="page-subtitle">Manage your active protection plans and view historical coverage.</p>

        <div className="chart-card" style={{ marginBottom: '2rem' }}>
          <h3 className="card-heading">Current Active Policy</h3>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Policy Number</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>POL-1082-99</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Next Billing</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>Mar 22, 2026</p>
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Documents</p>
              <button style={{ background: '#EFF6FF', color: '#3B82F6', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DownloadCloud size={16} /> Download PDF
              </button>
            </div>
          </div>
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
                  <td style={{ fontWeight: '600', color: '#1E3A8A' }}>{p.id}</td>
                  <td>{p.type}</td>
                  <td style={{ fontWeight: '700' }}>{p.coverage}</td>
                  <td>{p.start}</td>
                  <td>{p.end}</td>
                  <td>
                    <span className={`card-badge ${p.status === 'Active' ? 'badge-active' : ''}`} style={p.status === 'Expired' ? {background:'#F1F5F9', color:'#64748B'} : {}}>
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
