import React, { useState, useEffect } from 'react';
import ParkingHome from './pages/ParkingHome';
import SpotListing from './pages/SpotListing';
import UserDashboard from './pages/UserDashboard';
import VisitorEntry from './pages/VisitorEntry';
import GuardScanner from './pages/GuardScanner';
import AdminPanel from './pages/AdminPanel';
import './index.css';

function App() {
  const [page, setPage] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Artificial "Top Level" loading effect
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const navigate = (to) => {
    setLoading(true);
    setTimeout(() => {
      setPage(to);
      setLoading(false);
      window.scrollTo(0, 0);
    }, 400);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--brand-navy)', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pulse" style={{ width: 40, height: 40, margin: '0 auto 20px' }}></div>
          <div style={{ letterSpacing: '4px', fontWeight: 800, fontSize: '10px', opacity: 0.5 }}>PARK.AI SYSTEM BOOTING</div>
        </div>
      </div>
    );
  }

  // Unified App Shell for "Top Level" Experience
  const AppShell = ({ children, hideNav = false }) => (
    <div className="top-level-app" style={{ display: 'flex', height: '100vh' }}>
      {!hideNav && (
        <aside className="main-sidebar card" style={{ width: '280px', borderRadius: 0, border: 'none', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '32px 24px', background: 'var(--white)' }}>
          <div className="logo" style={{ marginBottom: '40px', fontWeight: 900, cursor: 'pointer' }} onClick={() => navigate('home')}>
            PARK<span style={{ color: 'var(--ai-teal)' }}>.AI</span>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <div className={`nav-item ${page === 'home' ? 'active' : ''}`} onClick={() => navigate('home')}>🏠 Discovery</div>
            <div className={`nav-item ${page === 'search' ? 'active' : ''}`} onClick={() => navigate('search')}>🔍 Spot Finder</div>
            <div className={`nav-item ${page === 'analytics' ? 'active' : ''}`} onClick={() => navigate('analytics')}>📈 Live System</div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '16px 0' }}></div>
            <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', fontWeight: 700, paddingLeft: '16px', marginBottom: '8px' }}>MANAGEMENT</div>
            <div className={`nav-item ${page === 'visitor' ? 'active' : ''}`} onClick={() => navigate('visitor')}>👤 Visitor Entry</div>
            <div className={`nav-item ${page === 'guard' ? 'active' : ''}`} onClick={() => navigate('guard')}>🛂 Guard Scan</div>
          </nav>

          <button className="btn btn-primary" onClick={() => navigate('dashboard')} style={{ marginTop: 'auto' }}>
            MY DASHBOARD
          </button>
        </aside>
      )}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );

  return (
    <div className="App">
      {page === 'home' && (
        <div className="fade-in">
          <ParkingHome />
          <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-warm)', borderTop: '1px solid var(--border)' }}>
             <h2 style={{ marginBottom: '32px' }}>Explore the Ecosystem</h2>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button className="btn btn-primary" style={{ padding: '0 40px' }} onClick={() => navigate('search')}>Find a Spot</button>
                <button className="btn card" style={{ padding: '0 40px' }} onClick={() => navigate('visitor')}>Access Portal</button>
             </div>
          </div>
        </div>
      )}

      {page === 'search' && <AppShell><SpotListing /></AppShell>}
      {page === 'analytics' && <AppShell><AdminPanel /></AppShell>}
      {page === 'visitor' && <AppShell><VisitorEntry /></AppShell>}
      {page === 'guard' && <AppShell><GuardScanner /></AppShell>}
      {page === 'dashboard' && <UserDashboard />}

      {/* Persistence AI Trigger */}
      <button 
        className="btn btn-teal pill" 
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000, height: '48px', padding: '0 24px', boxShadow: '0 10px 20px rgba(0,212,170,0.3)', border: 'none' }}
      >
        🪄 AI ASSISTANT
      </button>

      {/* Responsive Guard (Mobile) */}
      <nav className="mobile-nav glass" style={{ borderTop: '1px solid var(--border)' }}>
        <div onClick={() => navigate('home')}>🏠</div>
        <div onClick={() => navigate('visitor')}>👤</div>
        <div onClick={() => navigate('guard')}>🛂</div>
        <div onClick={() => navigate('analytics')}>📈</div>
      </nav>
    </div>
  );
}

export default App;
