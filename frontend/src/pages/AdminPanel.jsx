import React, { useState, useEffect } from 'react';
import ParkingGrid from '../components/ParkingGrid';
import NotificationList from '../components/NotificationList';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import socket from '../utils/socket';
import { LayoutDashboard, Shield, BarChart3, Settings, MapPin } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('monitor');
  const [activeGate, setActiveGate] = useState('Gate A');
  const [toasts, setToasts] = useState([]);

  // Multi-Gate Definition
  const gates = ['Gate A', 'Gate B', 'Main Entrance'];

  useEffect(() => {
    // 1. Listen for real-time security events
    socket.on('visitor-entered', (data) => addToast(`${data.visitor} entered at ${data.slot}`, 'success'));
    socket.on('visitor-overstayed', (data) => addToast(`SECURITY ALERT: Overstay at ${data.slotId}`, 'error'));
    socket.on('visitor-exited', (data) => addToast(`${data.visitor} cleared the gate`, 'primary'));

    return () => {
        socket.off('visitor-entered');
        socket.off('visitor-overstayed');
        socket.off('visitor-exited');
    };
  }, []);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return (
    <div className="admin-saas-container animate-in">
      {/* Toast Manager */}
      <div className="toast-container">
        {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type} animate-in`}>
                {t.message}
            </div>
        ))}
      </div>

      {/* SaaS Header & Gate Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Command Center</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time monitoring & AI automation</p>
        </div>
        
        <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
            {gates.map(g => (
                <button 
                   key={g} 
                   onClick={() => setActiveGate(g)}
                   style={{
                       padding: '8px 16px',
                       background: activeGate === g ? 'var(--primary)' : 'transparent',
                       color: activeGate === g ? 'white' : 'var(--text-main)',
                       border: 'none',
                       borderRadius: '8px',
                       fontSize: '0.8rem',
                       fontWeight: 700,
                       cursor: 'pointer',
                       transition: 'all 0.2s'
                   }}
                >
                    <MapPin size={14} style={{ marginRight: '4px' }} /> {g}
                </button>
            ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
         <Tab title="Live Monitor" icon={<Shield size={18} />} active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} />
         <Tab title="Analytics" icon={<BarChart3 size={18} />} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
         <Tab title="Control Tower" icon={<LayoutDashboard size={18} />} active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
         <Tab title="Settings" icon={<Settings size={18} />} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'monitor' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <div className="glass" style={{ padding: '24px' }}>
                    <ParkingGrid gate={activeGate} />
                </div>
                <div className="glass" style={{ padding: '24px' }}>
                    <NotificationList />
                </div>
            </div>
        )}
        
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        
        {activeTab === 'logs' && (
            <div className="tab-content animate-in">
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '32px' }}>
                    {/* Security Feed */}
                    <div className="glass" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Master Security Logs</h2>
                            <button className="btn" style={{ fontSize: '0.7rem' }}>Download Log Archive</button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <th style={{ padding: '12px' }}>EVENT TYPE</th>
                                        <th style={{ padding: '12px' }}>SOURCE</th>
                                        <th style={{ padding: '12px' }}>DESCRIPTION</th>
                                        <th style={{ padding: '12px' }}>TIMESTAMP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <LogEntry type="ENTRY" source="GATE-A" msg="Guest Visit Registered: John Doe" time="10:22 AM" />
                                    <LogEntry type="ANOMALY" source="GATE-B" msg="Potential Piggybacking Detected: MH-01-V-888" time="10:45 AM" isWarning />
                                    <LogEntry type="OVERSTAY" source="SLOT-C4" msg="Security Alert: Slot C4 exceeded 4h limit" time="11:15 AM" isError />
                                    <LogEntry type="EXIT" source="MAIN-E" msg="VIP Exit Verified" time="11:30 AM" />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Anomaly Monitor */}
                    <div className="glass" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px' }}>AI Anomalies</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <AnomalyCard title="Double Scan" desc="Multiple access requests for Token X-99" count={2} />
                            <AnomalyCard title="Rapid Exit" desc="Vehicle exited < 120s from entry" count={5} />
                            <div style={{ padding: '16px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>Scan Accuracy: 99.4%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <style>{`
        .tab-btn {
            padding: 12px 12px 12px 0;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: var(--text-muted);
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
            font-weight: 600;
        }
        .tab-btn.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }
        .toast-container {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .toast {
            padding: 16px 24px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-left: 6px solid var(--primary);
            font-weight: 700;
            min-width: 300px;
        }
        .toast-success { border-left-color: var(--success); }
        .toast-error { border-left-color: var(--error); background: #fef2f2; color: #991b1b; }
      `}</style>
    </div>
  );
};

const LogEntry = ({ type, source, msg, time, isWarning, isError }) => (
    <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
        <td style={{ padding: '12px' }}>
            <span style={{ 
                padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                background: isError ? 'var(--error)' : (isWarning ? '#F59E0B' : 'var(--primary)'),
                color: 'white'
            }}>{type}</span>
        </td>
        <td style={{ padding: '12px', fontWeight: 700 }}>{source}</td>
        <td style={{ padding: '12px' }}>{msg}</td>
        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{time}</td>
    </tr>
);

const AnomalyCard = ({ title, desc, count }) => (
    <div className="glass" style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{title}</span>
            <span style={{ color: 'var(--error)', fontWeight: 800, fontSize: '0.85rem' }}>{count}</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
    </div>
);

const Tab = ({ title, icon, active, onClick }) => (
    <div className={`tab-btn ${active ? 'active' : ''}`} onClick={onClick}>
        {icon}
        {title}
    </div>
);

export default AdminPanel;
