import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { 
  Shield, Wallet, TrendingUp, Sun, CloudRain, Wind, Clock, ArrowUpRight, Activity, Sparkles, MapPin, ChevronRight, History, Calculator, ArrowRightLeft, CheckCircle2, AlertCircle
} from 'lucide-react';
import TriggerPipeline from '../components/dashboard/TriggerPipeline';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount || 0);
};

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || localStorage.getItem('userId');
  
  const [data, setData] = useState({
    riskScore: 0,
    riskLevel: 'Calculating...',
    totalPayout: 0,
    balance: 0,
    payouts: [],
    alerts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineError, setPipelineError] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!userId) {
        setIsLoading(false);
        return;
    }
    try {
      const response = await api.get(`/api/dashboard?userId=${userId}`);
      setData(response.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to sync clinical data. Please check your connection.");
      toast.error("Failed to sync dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, [userId]);

  const triggerAlert = async (type) => {
    setIsTriggering(true);
    setPipelineError(false);
    setPipelineStep(1); // Triggered
    
    try {
      // Step 2: Risk Assessment (Eligibility)
      await new Promise(r => setTimeout(r, 800));
      setPipelineStep(2);
      
      const response = await api.post('/api/trigger', {
        userId: userId,
        triggerType: type
      });
      
      if (response.data.status === 'REJECTED') {
         setPipelineError(true);
         toast.error(response.data.message || "Risk below threshold", {
            icon: '⚠️',
            style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: '800' }
         });
         return;
      }

      // Step 3: Payout Calculation
      await new Promise(r => setTimeout(r, 800));
      setPipelineStep(3);
      
      // Step 4: Transfer
      await new Promise(r => setTimeout(r, 800));
      setPipelineStep(4);
      
      // Step 5: Completed
      await new Promise(r => setTimeout(r, 800));
      setPipelineStep(5);

      toast.success(`${type} payout processed! ₹${response.data.amount.toFixed(2)} added to wallet`, {
        icon: '⚡',
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontWeight: '800' }
      });
      
      setTimeout(() => {
        setPipelineStep(0);
        fetchDashboardData();
      }, 2000);
    } catch (err) {
      setPipelineError(true);
      toast.error("Network disruption during report");
    } finally {
      setIsTriggering(false);
    }
  };

  if (isLoading) return (
    <div className="flex h-screen bg-slate-950 items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            {Shield && <Shield size={20} className="text-blue-500 animate-pulse" />}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen bg-white items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={40} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Telemetry Disrupted</h2>
        <p className="text-slate-500 font-medium leading-relaxed">{error}</p>
        <button 
          onClick={() => { setError(null); fetchDashboardData(); }}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl"
        >
          Re-establish Connection
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden p-6 lg:p-10 scroll-smooth">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* TOP SECTION: HERO & STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* PIPELINE UI (Full width above stats if active) */}
            {(isTriggering || pipelineStep > 0) && (
              <div className="lg:col-span-12 animate-fade-in">
                <TriggerPipeline currentStep={pipelineStep} isError={pipelineError} />
              </div>
            )}
            
            {/* HERO GRADIENT CARD */}
            <div className="lg:col-span-8 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-600 to-emerald-500 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl shadow-blue-200">
                <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest leading-none border border-white/30">
                            <Sparkles size={12} /> AI Protection Active
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight">
                            Status: Secured, <br />
                            {user.name?.split(' ')[0] || 'Partner'}.
                        </h1>
                        <div className="flex items-center gap-3 text-white/80 font-bold">
                            <MapPin size={20} className="text-emerald-300" />
                            <span className="text-lg">{user.city || 'Bangalore'}, India</span>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] text-center min-w-[180px] shadow-xl group hover:scale-105 transition-transform duration-500">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">AI Risk Index</div>
                        <div className="text-7xl font-black mb-2 tracking-tighter tabular-nums drop-shadow-lg">{data.riskScore}</div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            data.riskLevel?.toLowerCase() === 'high' ? 'bg-rose-500/30 text-rose-100' : 'bg-emerald-500/30 text-emerald-100'
                        }`}>
                            {data.riskLevel} Risk
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK STATS CARDS */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                {/* BALANCE CARD */}
                <div className="flex-1 bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl flex flex-col justify-between group hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                            <Wallet size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-black uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            Live
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Available Wallet</div>
                        <div className="text-4xl font-black tracking-tighter">{formatCurrency(data.balance)}</div>
                    </div>
                </div>

                {/* PAYOUT CARD */}
                <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                        <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <ArrowUpRight size={24} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Payouts</div>
                        <div className="text-4xl font-black tracking-tighter text-slate-900">{formatCurrency(data.totalPayout)}</div>
                    </div>
                </div>
            </div>
          </div>

          {/* MIDDLE SECTION: TRIGGERS & ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* TRIGGERS GRID */}
            <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Activity className="text-blue-600" /> Condition Triggers
                    </h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Simulate Live Events</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                        onClick={() => triggerAlert('HEAT')} 
                        disabled={isTriggering}
                        className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <Sun size={24} />
                        </div>
                        <span className="font-black text-sm uppercase tracking-tighter">Heatwave</span>
                    </button>
                    <button 
                        onClick={() => triggerAlert('RAIN')} 
                        disabled={isTriggering}
                        className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <CloudRain size={24} />
                        </div>
                        <span className="font-black text-sm uppercase tracking-tighter">Downpour</span>
                    </button>
                    <button 
                        onClick={() => triggerAlert('POLLUTION')} 
                        disabled={isTriggering}
                        className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-500/50 transition-all flex flex-col items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <Wind size={24} />
                        </div>
                        <span className="font-black text-sm uppercase tracking-tighter">Pollution</span>
                    </button>
                </div>

                <div className="bg-blue-600/5 border border-blue-600/20 rounded-[1.5rem] p-6">
                    <div className="flex gap-4 items-start">
                        <AlertCircle className="text-blue-600 shrink-0" />
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">Policy Parameter Guard</h4>
                            <p className="text-xs text-blue-700/80 mt-1 leading-relaxed">System automatically detects breach of thresholds. Manual reporting triggers AI verification flow.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIVE FEED */}
            <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black tracking-tight">Intelligence Log</h2>
                    <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">Live Stream</div>
                </div>
                <div className="space-y-4">
                    {data.alerts && data.alerts.length > 0 ? data.alerts.map((alert, idx) => (
                        <div key={idx} className="flex gap-4 items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                                alert.type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                            }`}>
                                {alert.type === 'SUCCESS' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                    {alert.message}
                                </p>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    )) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <Activity className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold text-sm">Waiting for incoming telemetry...</p>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* BOTTOM SECTION: PAYOUT HISTORY */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-8 lg:p-10 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Payout History</h2>
                    <p className="text-sm text-slate-400 font-bold italic mt-1">Verified parametric settlements through AI Audit</p>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                    Download Report
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-10 py-6">Reference Date</th>
                            <th className="px-10 py-6">Event Type</th>
                            <th className="px-10 py-6 text-right">Settlement Amount</th>
                            <th className="px-10 py-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-600">
                        {data.payouts && data.payouts.length > 0 ? data.payouts.map((p) => (
                            <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        {new Date(p.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        p.triggerType === 'HEAT' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                        p.triggerType === 'RAIN' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
                                    }`}>
                                        {p.triggerType}
                                    </span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <div className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {formatCurrency(p.amount)}
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex items-center justify-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-tighter">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        {p.status}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-6 bg-slate-50 rounded-full">
                                            <History size={32} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No payouts discovered yet</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
