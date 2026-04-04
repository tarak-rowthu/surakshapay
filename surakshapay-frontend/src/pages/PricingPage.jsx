import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { plans } from '../config/plans';
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

      <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3 style={{ margin: '0', fontSize: '1.5rem', color: '#1e293b' }}>{plan.name}</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Full hyper-local cover for daily pros.</p>
            
            <div className="price-value">
              ₹{plan.price}<span>/week</span>
            </div>
            
            <p style={{ fontWeight: '700', color: '#059669', fontSize: '1.1rem', marginBottom: '0' }}>Max Coverage: ₹{plan.coverage.toLocaleString()}</p>

            <ul className="pricing-list">
              {plan.features.map((feature, fIndex) => (
                <li key={fIndex}><Check size={18} color="#059669" /> {feature}</li>
              ))}
            </ul>

            <Link to="/onboarding" className={plan.popular ? "btn-primary" : "btn-outline"} style={!plan.popular ? { color: '#3b82f6', borderColor: '#3b82f6', textAlign: 'center' } : { textAlign: 'center' }}>
              Select {plan.name.split(' ')[0]}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
