import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useSeeder } from '../hooks/useSeeder';

const Login = () => {
    const { seed, registerAdmin } = useSeeder();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setInfo('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
        setLoading(false);
    };

    const handleAdminSetup = async () => {
        setLoading(true);
        const success = await registerAdmin();
        if (success) {
            setInfo('Admin Created! Use admin@election.com / admin123');
        } else {
            setError('Admin already exists or registration failed.');
        }
        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container"
            style={{ maxWidth: '440px', marginTop: '80px' }}
        >
            <div className="card glass">
                <div className="text-center mb-2">
                    <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <LogIn size={32} color="var(--primary)" />
                    </div>
                    <h2 style={{ marginBottom: '8px' }}>Sign In</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back to the Election Portal</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                {info && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <CheckCircle size={18} /> {info}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="email" 
                                className="input-glass"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '44px' }}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="password" 
                                className="input-glass"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '44px' }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Login'} <LogIn size={18} />
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
                    </p>
                    <div style={{ borderTop: '1px solid var(--glass-border)', pt: '16px', marginTop: '8px' }}>
                        <button 
                            onClick={handleAdminSetup}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Setup System Admin Credentials
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
