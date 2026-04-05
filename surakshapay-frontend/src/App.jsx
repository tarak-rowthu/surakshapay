import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://surakshapay-1.onrender.com/api';

function App() {
  const [health, setHealth] = useState('Checking...');
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState({ health: true, users: true, policies: true });
  const [errors, setErrors] = useState({ health: null, users: null, policies: null });

  useEffect(() => {
    // 1. Fetch Health
    axios.get(`${API_BASE_URL}/health`)
      .then(res => {
        setHealth(res.data);
        setLoading(prev => ({ ...prev, health: false }));
      })
      .catch(err => {
        setErrors(prev => ({ ...prev, health: 'Backend Offline' }));
        setLoading(prev => ({ ...prev, health: false }));
      });

    // 2. Fetch Users
    axios.get(`${API_BASE_URL}/users`)
      .then(res => {
        setUsers(res.data);
        setLoading(prev => ({ ...prev, users: false }));
      })
      .catch(err => {
        setErrors(prev => ({ ...prev, users: 'Failed to load users' }));
        setLoading(prev => ({ ...prev, users: false }));
      });

    // 3. Fetch Policies
    axios.get(`${API_BASE_URL}/policies`)
      .then(res => {
        setPolicies(res.data);
        setLoading(prev => ({ ...prev, policies: false }));
      })
      .catch(err => {
        setErrors(prev => ({ ...prev, policies: 'Failed to load policies' }));
        setLoading(prev => ({ ...prev, policies: false }));
      });
  }, []);

  return (
    <div className="demo-container">
      <header className="demo-header">
        <h1>SurakshaPay Full-Stack Demo 🚀</h1>
        <div className={`status-badge ${errors.health ? 'offline' : 'online'}`}>
          {loading.health ? '⌛' : health}
        </div>
      </header>

      <main className="demo-grid">
        {/* Users Section */}
        <section className="demo-card">
          <h2>👥 Users List</h2>
          {loading.users ? <p>Loading users...</p> : 
           errors.users ? <p className="error">{errors.users}</p> : (
            <ul className="demo-list">
              {users.map(user => (
                <li key={user.id} className="list-item">
                  <strong>{user.name}</strong> - {user.email} <br/>
                  <small>📍 {user.city} | Role: {user.role}</small>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Policies Section */}
        <section className="demo-card">
          <h2>🛡️ Policies List</h2>
          {loading.policies ? <p>Loading policies...</p> : 
           errors.policies ? <p className="error">{errors.policies}</p> : (
            <ul className="demo-list">
              {policies.map(policy => (
                <li key={policy.id} className="list-item">
                  <strong>{policy.planType} Plan</strong> <br/>
                  Premium: ${policy.premium} | Coverage: ${policy.coverage} <br/>
                  <span className={`status-tag ${policy.status.toLowerCase()}`}>{policy.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="demo-footer">
        <p>Base URL: <code>{API_BASE_URL}</code></p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .demo-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Inter', system-ui, sans-serif;
          background: #f8fafc;
          min-height: 100vh;
        }
        .demo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .online { background: #dcfce7; color: #166534; }
        .offline { background: #fee2e2; color: #991b1b; }
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .demo-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .demo-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0 0;
        }
        .list-item {
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .list-item:last-child { border-bottom: none; }
        .error { color: #dc2626; font-weight: 500; }
        .status-tag {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 0.5rem;
        }
        .active { background: #dcfce7; color: #166534; }
        .demo-footer {
          margin-top: 3rem;
          text-align: center;
          color: #64748b;
          font-size: 0.875rem;
        }
      `}} />
    </div>
  );
}

export default App;
