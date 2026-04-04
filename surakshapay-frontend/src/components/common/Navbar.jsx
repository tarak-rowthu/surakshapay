import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              Suraksha<span className="text-blue-600">Pay</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">About</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {token ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm font-bold text-slate-700">Hi, {user.name?.split(' ')[0]}</span>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:text-blue-600 font-bold transition-colors"
                >
                  <LogIn size={18} /> Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  <UserPlus size={18} /> Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
