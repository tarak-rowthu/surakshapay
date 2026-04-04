import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import '../App.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(email && password) {
      try {
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/dashboard');
      } catch (err) {
        setErrorVisible(true);
        setTimeout(() => setErrorVisible(false), 3000);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Toast Error Popup */}
      {errorVisible && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: 'white', padding: '1rem 2rem', borderRadius: '8px', zIndex: 1000, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', animation: 'slideDown 0.3s ease-out' }}>
          <strong>Invalid email or password</strong>
        </div>
      )}

      <div className="auth-card">
        
        <Link to="/" style={{display: 'inline-flex', alignItems: 'center', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '2rem'}}>
          <ArrowLeft size={16} style={{marginRight: '0.5rem'}} /> Back to Home
        </Link>
        
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
          <div style={{background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(59,130,246,0.3)'}}>
             <ShieldCheck size={36} color="white" />
          </div>
        </div>
        
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to view your dynamic policy and payouts.</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{marginBottom: '2rem'}}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary btn-block">
            Sign In to Dashboard
          </button>
          
          <button 
            type="button" 
            onClick={() => { setEmail('tarak@example.com'); setPassword('password123'); }} 
            className="btn-primary btn-block" 
            style={{ marginTop: '1rem', background: '#10b981', color: 'white', border: 'none' }}
          >
            🧪 Demo User Login
          </button>
        </form>
        
        <p style={{textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginTop: '2rem'}}>
          Don't have an account? <Link to="/onboarding" style={{color: '#3b82f6', fontWeight: '600', textDecoration: 'none'}}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
