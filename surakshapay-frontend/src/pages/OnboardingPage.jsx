import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { plans } from '../config/plans';
import '../App.css';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [zone, setZone] = useState('');
  const [locationsData, setLocationsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [authConflict, setAuthConflict] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    planType: 'Standard',
    premium: 15,
    coverage: 10000
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/api/locations');
        console.log("API Response for /api/locations:", res.data);
        const data = res.data;
        if (Object.keys(data).length > 0) {
          setLocationsData(data);
          const firstCity = Object.keys(data)[0];
          setCity(firstCity);
          setZone(data[firstCity][0] || '');
          console.log("Selected city:", firstCity, "Locations:", data[firstCity]);
        }
      } catch (err) {
        console.error("API failed, using fallback:", err);
        const fallback = {
          "Chennai": ["Velachery", "T Nagar", "Anna Nagar", "Adyar", "OMR"],
          "Bangalore": ["Koramangala", "Indiranagar", "Whitefield", "BTM Layout", "Electronic City"],
          "Hyderabad": ["Madhapur", "Gachibowli", "Hitech City", "Banjara Hills", "Kukatpally"]
        };
        setLocationsData(fallback);
        const firstCity = Object.keys(fallback)[0];
        setCity(firstCity);
        setZone(fallback[firstCity][0] || '');
        console.log("Selected city (fallback):", firstCity, "Locations:", fallback[firstCity]);
      }
    };
    fetchLocations();
  }, []);

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    const newZone = locationsData[newCity]?.[0] || '';
    setZone(newZone);
    console.log("Selected city:", newCity, "Locations:", locationsData[newCity]);
  };

  const handleNext = () => setStep(step + 1);

  const handleFinish = async (e) => {
    if (e) e.preventDefault();
    if(!name || !email || !password) {
      alert("Please fill name, email and password first.");
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      // 1. Consolidated Registration (User + Wallet + Policy)
      await api.post('/api/auth/register', { 
        name, 
        email, 
        password, 
        city, 
        location: zone,
        planType: selectedPlan.planType,
        premium: selectedPlan.premium,
        coverage: selectedPlan.coverage
      });
      
      // 2. Login to get token
      const loginRes = await api.post('/api/auth/login', { email, password });
      
      console.log("Login success:", loginRes.data);
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data));
      
      console.log("Navigating to dashboard...");
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setAuthConflict(true);
      } else {
        const errorMsg = err.response?.data?.message || err.message;
        alert(`Registration failed: ${errorMsg}\n\nMake sure your Spring Boot backend is running on http://localhost:8080!`);
      }
    } finally {
      setLoading(false);
    }
  };

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
                <h2 className="auth-title" style={{textAlign:'left', margin:0}}>Create your profile</h2>
                <p style={{color:'#64748b', margin:0, fontSize:'0.9rem'}}>Basic details to start earning confidently.</p>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">City</label>
              <select className="form-select" value={city} onChange={handleCityChange}>
                {Object.keys(locationsData).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <select className="form-select" value={zone} onChange={e => setZone(e.target.value)}>
                {locationsData[city]?.map(z => <option key={z} value={z}>{z}</option>)}
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
                <span style={{color:'#64748b', fontWeight:'600'}}>Select Plan</span>
                <div style={{display:'flex', gap:'8px', flexWrap: 'wrap'}}>
                   {plans.map((plan, index) => (
                     <button 
                       key={index}
                       onClick={() => setSelectedPlan({planType: plan.name, premium: plan.price, coverage: plan.coverage})} 
                       style={{
                         padding:'4px 12px', 
                         borderRadius:'4px', 
                         border:'1px solid #e2e8f0', 
                         background: selectedPlan.premium === plan.price ? '#dbeafe' : 'white', 
                         cursor:'pointer',
                         fontWeight: '600'
                       }}
                     >
                       ₹{plan.price}
                     </button>
                   ))}
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                <span style={{color:'#64748b', fontWeight:'600'}}>Weekly Premium</span>
                <span style={{color:'#1e3a8a', fontSize:'1.5rem', fontWeight:'800'}}>₹{selectedPlan.premium}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                <span style={{color:'#64748b', fontWeight:'600'}}>Max Coverage</span>
                <span style={{color:'#059669', fontSize:'1.25rem', fontWeight:'800'}}>₹{selectedPlan.coverage.toLocaleString()}</span>
              </div>
              <hr style={{borderTop:'1px solid #e2e8f0', borderBottom:'none', margin:'1rem 0'}}/>
              <ul style={{color:'#475569', fontSize:'0.875rem', paddingLeft:'1.5rem', margin:0}}>
                <li style={{marginBottom:'0.5rem'}}>Covers Rainfall &gt; 50mm</li>
                <li style={{marginBottom:'0.5rem'}}>Covers Heat &gt; 45°C</li>
                <li>Instant UPI Payouts</li>
              </ul>
            </div>
            
            {authConflict && (
              <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #f87171' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#991b1b', fontWeight: 'bold' }}>Account already exists. Please login.</p>
                <button onClick={() => navigate('/login')} className="btn-primary" style={{ background: '#ef4444', width: '100%', padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  👉 Go to Login
                </button>
              </div>
            )}
            
            <button onClick={handleFinish} disabled={loading} className="btn-primary btn-block">
               {loading ? 'Activating...' : 'Activate & Go to Dashboard'} <ShieldCheck size={18} style={{display:'inline', verticalAlign:'text-bottom', marginLeft:'0.5rem'}}/>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingPage;
