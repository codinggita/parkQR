import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Shield } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await login(email, password);
            if (!res.success) setError(res.message);
        } catch (err) {
            setError('Auth system offline');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container animate-in" style={{
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
            <div className="glass card" style={{ padding: '48px', width: '100%', maxWidth: '400px', borderRadius: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ 
                        width: '64px', height: '64px', background: 'var(--primary)', 
                        borderRadius: '16px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', margin: '0 auto 20px'
                    }}>
                        <Shield color="white" size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Enterprise Login</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>ParkSmart Management System</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    <div className="form-field">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                            <Mail size={14} /> Email
                        </label>
                        <input 
                            type="email" 
                            className="form-input" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="admin@parksmart.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
                            <Lock size={14} /> Password
                        </label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center', fontWeight: 600 }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button className="btn btn-primary" style={{ padding: '14px', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                    
                    <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '20px' }}>
                        Version 4.2.0 (Stable) • Gated Security Protocol
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
