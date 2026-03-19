import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../../App.css'; // Import robust fallback CSS

const Navbar = () => {
  const location = useLocation();
  
  // For hackathon demo purposes, assume logged in if on a dashboard route
  const isLoggedIn = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

  const getLinkClass = (path) => {
    return location.pathname === path ? "nav-item active-nav-item" : "nav-item";
  };

  return (
    <nav className="nav-wrapper" style={{ borderBottom: '1px solid #e2e8f0' }}>
      <div className="nav-content">
        <NavLink to="/" className="nav-logo">
          SurakshaPay
        </NavLink>
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className={getLinkClass('/dashboard')}>Overview</NavLink>
              <NavLink to="/dashboard/policy" className={getLinkClass('/dashboard/policy')}>My Policy</NavLink>
              <NavLink to="/pricing" className={getLinkClass('/pricing')}>Upgrade</NavLink>
              
              <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
              
              {/* User Profile display */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>Rahul Kumar</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Zepto Partner</p>
                </div>
                <div style={{ 
                  width: '38px', height: '38px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)', 
                  color: 'white', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem',
                  boxShadow: '0 2px 4px rgba(59,130,246,0.3)'
                }}>
                  RK
                </div>
              </div>
            </>
          ) : (
            <>
              <a href="/#features" className="nav-item">Features</a>
              <a href="/#how-it-works" className="nav-item">How It Works</a>
              <NavLink to="/pricing" className={getLinkClass('/pricing')}>Pricing</NavLink>
              
              <div style={{ width: '1px', height: '24px', background: '#cbd5e1', margin: '0 0.5rem' }}></div>
              
              <NavLink to="/login" className="nav-item" style={{ fontWeight: 600 }}>Login</NavLink>
              <NavLink to="/onboarding" className="nav-login-btn hover-elevate">Register</NavLink>
            </>
          )}
        </div>
      </div>
      
      {/* Dynamic inline styles for active link visualization */}
      <style dangerouslySetInnerHTML={{__html: `
        .active-nav-item {
          color: #2563eb !important;
          font-weight: 700 !important;
          position: relative;
        }
        .active-nav-item::after {
          content: '';
          position: absolute;
          bottom: -22px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #2563eb;
          border-radius: 3px 3px 0 0;
        }
        .hover-elevate {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hover-elevate:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }
      `}} />
    </nav>
  );
};

export default Navbar;
