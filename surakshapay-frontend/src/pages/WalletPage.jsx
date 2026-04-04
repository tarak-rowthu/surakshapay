import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '../App.css';
import api from '../api/axios';

const WalletPage = () => {
  const [wallet, setWallet] = useState({ balance: 0.00 });
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;
        if (!userId) return;
        const wRes = await api.get(`/api/wallet/${userId}`);
        setWallet(wRes.data);
        const tRes = await api.get(`/api/transactions/${userId}`);
        setTransactions(tRes.data);
      } catch (err) {
        console.error("Failed to load wallet page data", err);
      }
    };
    fetchWallet();
    const interval = setInterval(fetchWallet, 10000);
    return () => clearInterval(interval);
  }, []);

  const addTestFunds = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await api.post('/api/wallet/add', { userId: user.id, amount: 1000 });
      alert("✅ ₹1000 Added to Wallet successfully!");
      
      const wRes = await api.get(`/api/wallet/${user.id}`);
      setWallet(wRes.data);
      const tRes = await api.get(`/api/transactions/${user.id}`);
      setTransactions(tRes.data);
    } catch (err) {
      alert("Failed to add test funds");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <main className="dashboard-main">
        <h1 className="page-title">Digital Wallet & History</h1>
        <p className="page-subtitle">Manage your funds, pay premiums, and receive instant auto-payouts.</p>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div className="chart-card" style={{ flex: '1 1 300px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '50%' }}><Wallet size={32} /></div>
              <div>
                <p style={{ margin: 0, color: '#D1FAE5', fontWeight: '600' }}>Current Balance</p>
                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>₹{wallet.balance}</h2>
              </div>
            </div>
            <button onClick={addTestFunds} style={{ background: 'white', color: '#059669', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <PlusCircle size={20} /> Add Target Demo Funds (₹1000)
            </button>
          </div>
          
          <div className="chart-card" style={{ flex: '2 1 400px' }}>
            <h3 className="card-heading">Transaction Master Ledger</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {transactions.length === 0 ? <p style={{color:'#64748B', textAlign:'center', marginTop:'2rem'}}>No transaction history available.</p> : transactions.map((t) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: t.type === 'CREDIT' ? '#D1FAE5' : '#FEE2E2', color: t.type === 'CREDIT' ? '#10B981' : '#EF4444', padding: '0.75rem', borderRadius: '50%' }}>
                      {t.type === 'CREDIT' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#1E293B', fontSize: '1rem' }}>{t.description}</h4>
                      <p style={{ margin: 0, color: '#64748B', fontSize: '0.85rem' }}>{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <h3 style={{ margin: 0, color: t.type === 'CREDIT' ? '#10B981' : '#EF4444', fontWeight: '800' }}>
                    {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default WalletPage;
