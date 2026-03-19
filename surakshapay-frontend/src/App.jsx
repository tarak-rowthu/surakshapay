import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import UserDashboard from './pages/UserDashboard';
import PolicyManagement from './pages/PolicyManagement';
import ClaimsPage from './pages/ClaimsPage';
import AdminDashboard from './pages/AdminDashboard';

import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is persistent across the top */}
      <Navbar />
      
      <main className="min-h-screen bg-[var(--color-brand-bg)] w-full text-[var(--color-brand-dark)]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/policy" element={<PolicyManagement />} />
          <Route path="/dashboard/claims" element={<ClaimsPage />} />
          <Route path="/dashboard/history" element={<ClaimsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
