import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Users, AlertTriangle, Disc } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AnalyticsDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.token) return;
            try {
                const res = await fetch('http://localhost:5000/api/analytics', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch (e) {
                console.error("Analytics fetch failed");
            } finally { setLoading(false); }
        };
        fetchData();
    }, [user?.token]);

    const exportToCSV = () => {
        const headers = ["Date", "Visitors"];
        const rows = data.dailyStats.map(s => `${s._id},${s.count}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "parking_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading || !data) return <div className="spinner-full"><div className="spinner"></div></div>;

    return (
        <div className="analytics-view animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ margin: 0, fontWeight: 900 }}>AI Performance Engine</h2>
                <button className="btn" onClick={exportToCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white' }}>
                    <Users size={16} /> Export Intelligence (.CSV)
                </button>
            </div>

            <div className="dashboard-grid">
                <div className="glass stat-card">
                    <div className="stat-label">System Prediction</div>
                    <div className="stat-value" style={{ color: 'var(--primary)' }}>{data.occupancy.prediction}% Load</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.05)', marginTop: '8px', borderRadius: '4px' }}>
                        <div style={{ width: `${data.occupancy.prediction}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>Expect high volume in 2.5 hours</p>
                </div>
                <div className="glass stat-card">
                    <div className="stat-label">Peak Intensity</div>
                    <div className="stat-value">{data.kpis.peakHour}:00 HR</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '8px' }}>↑ 12% from last week</p>
                </div>
                <div className="glass stat-card">
                    <div className="stat-label">Active Footfall</div>
                    <div className="stat-value">{data.kpis.totalVisitorsToday}</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>Security verified visits</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '32px' }}>
                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Velocity Trend</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.dailyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Activity Stream</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {data.timeline.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ 
                                    width: '12px', height: '12px', borderRadius: '50%', 
                                    background: item.type === 'ENTRY' ? 'var(--success)' : 'var(--error)', 
                                    marginTop: '4px', flexShrink: 0 
                                }}></div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.message}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
