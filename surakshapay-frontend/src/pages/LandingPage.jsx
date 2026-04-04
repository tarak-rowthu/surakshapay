import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { 
  ShieldCheck, Zap, CloudRain, Sun, Wind, 
  ArrowRight, CheckCircle2, Globe, Clock, 
  Shield, CreditCard
} from 'lucide-react';
import '../App.css'; 

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            
            {/* HERO SECTION */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-blue-100 animate-fade-in">
                        <Zap size={14} fill="currentColor" /> Next-Gen Parametric Insurance
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9] animate-slide-up">
                        No Claims.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pure Payouts.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium animate-fade-in delay-100">
                        The world's first AI-driven insurance for delivery partners. 
                        Get automatic wallet credits triggered by real-time weather data. 
                        If the weather stops you, SurakshaPay pays you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-200">
                        <button
                            onClick={() => navigate("/register")}
                            className="group px-8 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95"
                        >
                            Get Protected Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-blue-600 transition-all active:scale-95"
                        >
                            Log in to Wallet
                        </button>
                    </div>

                    <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-slate-400 font-bold text-sm tracking-widest uppercase">
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                           <ShieldCheck size={24} className="text-blue-600" /> SECURED BY SURAKSHA
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                           <Globe size={24} className="text-indigo-600" /> GLOBAL PARAMETRIC NETWORK
                        </div>
                        <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                           <CreditCard size={24} className="text-emerald-600" /> INSTANT SETTLEMENT
                        </div>
                    </div>
                </div>
            </header>

            {/* FEATURES SECTION */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Programmable Protection</h2>
                        <p className="text-lg text-slate-500 font-medium">Built on real-time environmental data feeds.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Rain Shield', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Automatic triggers when rainfall exceeds 50mm, validated by IMD grid data.' },
                            { title: 'Heat Sentry', icon: Sun, color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Protection against extreme heatwaves (40°C+) that disrupt delivery windows.' },
                            { title: 'Pollution Guard', icon: Wind, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Innovative AQI-based compensation for hazardous air quality conditions.' }
                        ].map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="group p-8 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all">
                                    <div className={`${feature.bg} ${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-black mb-4">{feature.title}</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-slate-500 font-medium">Protect your earnings for less than a cup of chai per day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {[
                            { name: 'Basic', price: '5', coverage: '2,000', features: ['Standard Support', 'Rain/Heat Alerts'] },
                            { name: 'Standard', price: '15', coverage: '10,000', features: ['Priority Support', 'Multi-factor Alerts'] },
                            { name: 'Plus', price: '25', coverage: '25,000', features: ['Wallet Auto-Sync', 'Advanced Analytics'] },
                            { name: 'Premium', price: '50', coverage: '50,000', features: ['Instant Verification', 'Family Protection'] },
                            { 
                                name: 'Pro', price: '99', coverage: 'Max', 
                                features: ['AI Risk Scoring', 'Priority Payouts', 'Instant Settlement', 'All Risk Factors'],
                                highlight: true 
                            }
                        ].map((plan, idx) => (
                            <div key={idx} className={`bg-white rounded-[32px] p-8 border ${plan.highlight ? 'border-blue-600 ring-4 ring-blue-50 shadow-2xl relative' : 'border-slate-200'}`}>
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Most Popular
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-lg font-black mb-1">{plan.name}</h3>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-3xl font-black italic">₹{plan.price}</span>
                                        <span className="text-slate-400 font-bold text-xs">/week</span>
                                    </div>
                                </div>
                                <div className="mb-6 py-3 border-y border-slate-50 text-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Coverage</span>
                                    <div className="text-xl font-black text-blue-600">₹{plan.coverage}</div>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-slate-500">
                                            <CheckCircle2 className="text-blue-600 shrink-0" size={12} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => navigate('/register')}
                                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${plan.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-900 text-white hover:bg-black'}`}
                                >
                                    Activate
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 bg-blue-600 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to earn without boundaries?</h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">Join 5,000+ delivery partners who are already protected by SurakshaPay's parametric intelligence.</p>
                    <button 
                        onClick={() => navigate('/register')}
                        className="px-12 py-6 bg-white text-blue-600 rounded-3xl font-black text-2xl hover:bg-blue-50 transition-all shadow-2xl active:scale-95"
                    >
                        Sign Up Now
                    </button>
                 </div>
            </section>

            <footer className="py-12 bg-slate-900 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <ShieldCheck size={20} className="text-blue-500" />
                    <span className="font-black tracking-tighter">SurakshaPay</span>
                </div>
                <p className="text-slate-500 text-sm font-bold">© 2026 SurakshaPay Technologies. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
