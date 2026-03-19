import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import '../App.css';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleFinish = () => navigate('/dashboard');

  return (
    <div className="auth-wrapper">
      <div className="auth-card wide">
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <Link to="/" style={{color: '#1e3a8a', fontWeight: '800', textDecoration: 'none', fontSize: '1.25rem'}}>
            SurakshaPay
          </Link>
          <span style={{color: '#64748b', fontSize: '0.875rem', fontWeight: '600'}}>Step {step} of 3</span>
        </div>

        <div className="progress-container">
          <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {step === 1 && (
          <div>
            <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom: '1.5rem'}}>
              <div style={{padding:'0.75rem', background:'#eff6ff', color:'#3b82f6', borderRadius:'12px'}}><MapPin size={24}/></div>
              <div>
                <h2 className="auth-title" style={{textAlign:'left', margin:0}}>Where do you deliver?</h2>
                <p style={{color:'#64748b', margin:0, fontSize:'0.9rem'}}>This helps us monitor the correct weather stations.</p>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">City</label>
              <select className="form-select">
                <option>Bengaluru</option>
                <option>Mumbai</option>
                <option>Delhi NCR</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Zone</label>
              <select className="form-select" defaultValue="Koramangala">
                <option>Indiranagar</option>
                <option>Koramangala</option>
                <option>Whitefield</option>
              </select>
            </div>
            <button onClick={handleNext} className="btn-primary btn-block" style={{marginTop:'2rem'}}>Continue <ArrowRight size={18} style={{display:'inline', verticalAlign:'text-bottom', marginLeft:'0.5rem'}}/></button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom: '1.5rem'}}>
              <div style={{padding:'0.75rem', background:'#eff6ff', color:'#3b82f6', borderRadius:'12px'}}><Clock size={24}/></div>
              <div>
                <h2 className="auth-title" style={{textAlign:'left', margin:0}}>Working Hours</h2>
                <p style={{color:'#64748b', margin:0, fontSize:'0.9rem'}}>We only charge for the time you're actually working.</p>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="time" className="form-input" defaultValue="09:00" />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input type="time" className="form-input" defaultValue="18:00" />
            </div>
            <button onClick={handleNext} className="btn-primary btn-block" style={{marginTop:'2rem'}}>Calculate AI Premium <ArrowRight size={18} style={{display:'inline', verticalAlign:'text-bottom', marginLeft:'0.5rem'}}/></button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom: '1.5rem'}}>
              <div style={{padding:'0.75rem', background:'#dcfce7', color:'#059669', borderRadius:'12px'}}><ShieldCheck size={24}/></div>
              <div>
                <h2 className="auth-title" style={{textAlign:'left', margin:0}}>Your Custom Policy</h2>
                <p style={{color:'#64748b', margin:0, fontSize:'0.9rem'}}>Based on Koramangala's historical weather data.</p>
              </div>
            </div>
            
            <div style={{background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px', padding:'1.5rem', marginBottom:'2rem'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                <span style={{color:'#64748b', fontWeight:'600'}}>Weekly Premium</span>
                <span style={{color:'#1e3a8a', fontSize:'1.5rem', fontWeight:'800'}}>₹15</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                <span style={{color:'#64748b', fontWeight:'600'}}>Max Coverage</span>
                <span style={{color:'#059669', fontSize:'1.25rem', fontWeight:'800'}}>₹10,000</span>
              </div>
              <hr style={{borderTop:'1px solid #e2e8f0', borderBottom:'none', margin:'1rem 0'}}/>
              <ul style={{color:'#475569', fontSize:'0.875rem', paddingLeft:'1.5rem', margin:0}}>
                <li style={{marginBottom:'0.5rem'}}>Covers Rainfall &gt; 50mm</li>
                <li style={{marginBottom:'0.5rem'}}>Covers Heat &gt; 45°C</li>
                <li>Instant UPI Payouts</li>
              </ul>
            </div>
            <button onClick={handleFinish} className="btn-primary btn-block">Activate & Go to Dashboard <ShieldCheck size={18} style={{display:'inline', verticalAlign:'text-bottom', marginLeft:'0.5rem'}}/></button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingPage;
