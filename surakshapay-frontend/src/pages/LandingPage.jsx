import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import robust fallback CSS

const LandingPage = () => {
  return (
    <div style={{ background: 'var(--gradient-blue)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">AI-Powered Insurance<br/>for Delivery Partners</h1>
        <p className="hero-subtitle">
          Earn without fear. Get automatic payouts instantly credited to your wallet based on real-time weather triggers like extreme rain or heat. No manual claims required.
        </p>
        <div className="hero-buttons">
          <Link to="/onboarding" className="btn-primary">Get Protected</Link>
          <a href="#features" className="btn-outline">Learn More</a>
        </div>
      </section>

      {/* Cards Section */}
      <div id="features">
        <h2 className="section-title">Precision Protection Parameters</h2>
        <div className="cards-grid">
          {/* Card 1 */}
          <div className="feature-card">
            <div className="card-icon">🌧️</div>
            <h3 className="card-title">Rainfall Protection</h3>
            <p className="card-desc">Automatic payouts triggered when local IMD stations report rainfall &gt;50mm during your peak hours.</p>
            <span className="card-badge badge-active">Active</span>
          </div>
          {/* Card 2 */}
          <div className="feature-card">
            <div className="card-icon">☀️</div>
            <h3 className="card-title">Heat Protection</h3>
            <p className="card-desc">Delivery is hard in extreme heat. Receive a health hazard payout if afternoon temperatures cross &gt;45°C.</p>
            <span className="card-badge badge-active">Active</span>
          </div>
          {/* Card 3 */}
          <div className="feature-card">
            <div className="card-icon">🌫️</div>
            <h3 className="card-title">Pollution Protection</h3>
            <p className="card-desc">In select metro areas, severe AQI triggers a medical hazard payout or covers the cost of N95 masks.</p>
            <span className="card-badge badge-active">Protected</span>
          </div>
          {/* Card 4 */}
          <div className="feature-card">
            <div className="card-icon">⚡</div>
            <h3 className="card-title">Instant Payout</h3>
            <p className="card-desc">No clunky claim forms. No waiting periods. API triggers send the insured amount directly to your bank.</p>
            <span className="card-badge badge-active">Protected</span>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="dashboard-wrapper">
        <h2 className="section-title">Live Dynamic Dashboard</h2>
        <div className="dashboard-card">
          <div className="dashboard-header">
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#1E293B' }}>Your Policy Status</h3>
              <p style={{ color: '#64748B', margin: 0 }}>Comprehensive Coverage • Koramangala Zone</p>
            </div>
            <span className="card-badge badge-active" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>✅ Active</span>
          </div>

          <div className="dash-grid">
            <div className="dash-metrics-grid" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="dashboard-metric">
                <p style={{ margin: '0 0 0.25rem 0', color: '#64748B', fontSize: '0.875rem', fontWeight: '600' }}>Weekly Premium</p>
                <h4 style={{ margin: 0, fontSize: '2rem', color: '#1E3A8A' }}>₹15<span style={{fontSize:'1rem', color:'#94A3B8'}}>/wk</span></h4>
              </div>
              <div className="dashboard-metric">
                <p style={{ margin: '0 0 0.25rem 0', color: '#64748B', fontSize: '0.875rem', fontWeight: '600' }}>Max Coverage</p>
                <h4 style={{ margin: 0, fontSize: '2rem', color: '#059669' }}>₹10,000</h4>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#1E293B', fontSize: '1.1rem' }}>Live Alert Monitoring</h4>
              <div className="alert-item alert-yellow">
                <span style={{fontSize:'1.2rem'}}>🌧️</span> 
                <div>
                  <div style={{fontWeight:'700'}}>Heavy Rain Warning</div>
                  <div style={{fontSize:'0.8rem', opacity:0.8}}>Currently 34mm/hr. Trigger at 50mm.</div>
                </div>
              </div>
              <div className="alert-item alert-red">
                <span style={{fontSize:'1.2rem'}}>☀️</span> 
                <div>
                  <div style={{fontWeight:'700'}}>Heat Triggered</div>
                  <div style={{fontSize:'0.8rem', opacity:0.8}}>46.1°C detected. ₹400 payout issued.</div>
                </div>
              </div>
              <div className="alert-item alert-orange">
                <span style={{fontSize:'1.2rem'}}>🌫️</span> 
                <div>
                  <div style={{fontWeight:'700'}}>AQI Alert</div>
                  <div style={{fontSize:'0.8rem', opacity:0.8}}>AQI reached 420. Medical payout initiated.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
