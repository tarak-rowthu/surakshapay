import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import '../App.css';

const PricingPage = () => {
  return (
    <div className="pricing-wrapper">
      <div className="pricing-header">
        <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Transparent Pricing</h1>
        <p className="page-subtitle" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Choose a coverage plan that fits your delivery schedule. No hidden fees. Cancel anytime.
        </p>
      </div>

      <div className="pricing-grid">
        
        {/* Basic Plan */}
        <div className="pricing-card">
          <h3 style={{ margin: '0', fontSize: '1.5rem', color: '#1e293b' }}>Basic Guard</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Essential protection for part-time riders.</p>
          
          <div className="price-value">
            ₹7<span>/week</span>
          </div>
          
          <p style={{ fontWeight: '700', color: '#059669', fontSize: '1.1rem', marginBottom: '0' }}>Max Coverage: ₹4,000</p>

          <ul className="pricing-list">
            <li><Check size={18} color="#059669" /> Rainfall &gt; 65mm Trigger</li>
            <li><Check size={18} color="#059669" /> Heat &gt; 48°C Trigger</li>
            <li><Check size={18} color="#059669" /> Instant UPI Payout</li>
            <li className="disabled"><X size={18} /> Severe AQI Protection</li>
            <li className="disabled"><X size={18} /> N95 Mask Subsidy</li>
            <li className="disabled"><X size={18} /> Zero Deductible</li>
          </ul>

          <Link to="/onboarding" className="btn-outline" style={{ color: '#3b82f6', borderColor: '#3b82f6', textAlign: 'center' }}>
            Select Basic
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="pricing-card popular">
          <div className="popular-badge">Most Popular</div>
          <h3 style={{ margin: '0', fontSize: '1.5rem', color: '#1e293b' }}>Comprehensive</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Full hyper-local cover for daily pros.</p>
          
          <div className="price-value">
            ₹15<span>/week</span>
          </div>

          <p style={{ fontWeight: '700', color: '#059669', fontSize: '1.1rem', marginBottom: '0' }}>Max Coverage: ₹10,000</p>

          <ul className="pricing-list">
            <li><Check size={18} color="#059669" /> Rainfall &gt; 50mm Trigger</li>
            <li><Check size={18} color="#059669" /> Heat &gt; 45°C Trigger</li>
            <li><Check size={18} color="#059669" /> Instant UPI Payout</li>
            <li><Check size={18} color="#059669" /> Severe AQI Protection (&gt;400)</li>
            <li><Check size={18} color="#059669" /> N95 Mask Subsidy included</li>
            <li><Check size={18} color="#059669" /> Zero Deductible</li>
          </ul>

          <Link to="/onboarding" className="btn-primary" style={{ textAlign: 'center' }}>
            Select Premium
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;
