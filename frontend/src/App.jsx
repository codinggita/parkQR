import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import VisitorEntry from './pages/VisitorEntry';
import GuardScanner from './pages/GuardScanner';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotificationBell from './components/NotificationBell';
import { LogOut, LayoutDashboard, UserPlus, ScanLine, ShieldAlert } from 'lucide-react';
import './index.css';

const AppContent = () => {
    const { user, logout, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
    };

    if (loading) return <div className="spinner-full"><div className="spinner"></div></div>;

    if (!user) return <LoginPage />;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18}/>, roles: ['admin', 'guard'] },
        { id: 'visitors', label: 'Visitors', icon: <UserPlus size={18}/>, roles: ['admin', 'guard'] },
        { id: 'scanner', label: 'Terminal', icon: <ScanLine size={18}/>, roles: ['admin', 'guard'] },
        { id: 'admin', label: 'Control Center', icon: <ShieldAlert size={18}/>, roles: ['admin'] },
    ];

    const filteredNav = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="brand-ident">
                    <div className="brand-dot"></div>
                    ParkSmart AI
                </div>

                <nav className="nav-group">
                    {filteredNav.map((item) => (
                        <div 
                            key={item.id}
                            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.icon}
                            {item.label}
                        </div>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="glass" style={{ padding: '16px', borderRadius: '12px', fontSize: '0.75rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Secure Node</div>
                        <div style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{user.name}</div>
                    </div>
                    <button onClick={logout} className="btn" style={{ 
                        background: 'rgba(239, 68, 68, 0.05)', 
                        color: 'var(--error)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        justifyContent: 'center'
                    }}>
                        <LogOut size={16} /> Terminate
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>
                        {navItems.find(i => i.id === activeTab)?.label}
                    </h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={toggleTheme} className="btn" style={{ background: 'transparent', padding: '8px' }}>
                             {isDarkMode ? '🌙' : '☀️'}
                        </button>
                        <NotificationBell onClick={() => setActiveTab('admin')} />
                        <div className="glass" style={{ padding: '8px 16px', fontSize: '0.875rem', fontWeight: 700, border: '1px solid var(--primary)' }}>
                            <span style={{ color: 'var(--primary)', marginRight: '8px' }}>●</span>
                            ONLINE
                        </div>
                    </div>
                </header>

                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'visitors' && <VisitorEntry />}
                {activeTab === 'scanner' && <GuardScanner />}
                {activeTab === 'admin' && <AdminPanel />}
            </main>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
       <AppContent />
    </AuthProvider>
  );
}

export default App;
