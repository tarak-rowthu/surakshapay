import React from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import '../App.css';

const AdminDashboard = () => {
  return (
    <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      
      {/* Dark Theme Navbar */}
      <nav style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>SurakshaPay <span style={{ color: '#60a5fa' }}>Console</span></div>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: '600' }}>Exit Console</Link>
      </nav>

      <div style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Control Center</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem' }}>Live monitoring of all active delivery partner nodes.</p>

        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#94a3b8' }}>
              <span style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '0.875rem' }}>Active Partners</span>
              <Users size={20} />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>14,289</div>
          </div>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#94a3b8' }}>
              <span style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '0.875rem' }}>Live Risks</span>
              <AlertTriangle size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>32</div>
          </div>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#94a3b8' }}>
              <span style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '0.875rem' }}>Total Pools</span>
              <ShieldCheck size={20} color="#10b981" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>₹1.4M</div>
          </div>
        </div>

        {/* Heatmap Mockup Container */}
        <div style={{ background: '#1e293b', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>Live Geo-Risk Engine</h3>
          <div style={{ height: '400px', background: 'radial-gradient(circle at 50% 50%, #1e3a8a 0%, #0f172a 100%)', borderRadius: '12px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            
            <Activity size={100} color="#3b82f6" style={{ opacity: 0.2 }} />
            
            {/* Blips */}
            <div style={{ position: 'absolute', top: '30%', left: '40%', width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 20px 5px rgba(239, 68, 68, 0.5)', animation: 'pulse 2s infinite' }}></div>
            <div style={{ position: 'absolute', top: '60%', right: '30%', width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%', boxShadow: '0 0 20px 5px rgba(245, 158, 11, 0.5)' }}></div>
            <div style={{ position: 'absolute', top: '45%', left: '60%', width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px 2px rgba(59, 130, 246, 0.5)' }}></div>
            
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem', color: '#94a3b8' }}>Real-time IMD Sync: Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
