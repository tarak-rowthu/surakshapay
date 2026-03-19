import React from 'react';
import { Home, Shield, FileText, Settings, LogOut, Activity } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import '../../App.css';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Shield size={20} />, label: 'My Policy', path: '/dashboard/policy' },
    { icon: <Activity size={20} />, label: 'Status & Claims', path: '/dashboard/claims' },
    { icon: <FileText size={20} />, label: 'History', path: '/dashboard/history' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="sidebar-wrapper">
      <div style={{ paddingBottom: '2rem' }}>
        <p className="sidebar-label">Partner Menu</p>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `sidebar-menu-item ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
        <button 
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem 1rem',
            color: '#dc2626',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
