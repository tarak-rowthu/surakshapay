import React from 'react';
import { Home, Shield, FileText, Settings, LogOut, Activity, LayoutDashboard, History, CreditCard } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Demo User';
  
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
    { icon: <Shield size={20} />, label: 'Policy Detail', path: '/dashboard/policy' },
    { icon: <CreditCard size={20} />, label: 'Wallet & Payouts', path: '/dashboard/wallet' },
    { icon: <Activity size={20} />, label: 'Active Alerts', path: '/dashboard/claims' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 flex flex-col border-r border-slate-800 shadow-2xl z-50 transition-all hidden lg:flex">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
            S
        </div>
        <div>
            <h2 className="text-xl font-black text-white tracking-tighter">Suraksha<span className="text-blue-500">Pay</span></h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Insurance</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-xl bg-slate-800/30">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20">
                {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-black text-white truncate">{userName}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Verified Active</p>
            </div>
        </div>
        <button 
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-bold text-sm group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Logout System</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
