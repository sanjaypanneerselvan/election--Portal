import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await setDoc(doc(db, 'users', userCred.user.uid), {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                role: 'citizen'
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container"
            style={{ maxWidth: '500px', marginTop: '60px' }}
        >
            <div className="card glass">
                <div className="text-center mb-2">
                    <h2 style={{ marginBottom: '8px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join the smart election platform</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
                            <input name="name" className="input-glass" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email</label>
                            <input name="email" type="email" className="input-glass" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone</label>
                            <input name="phone" className="input-glass" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
                            <input name="password" type="password" className="input-glass" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Address</label>
                        <textarea name="address" className="input-glass" value={formData.address} onChange={handleChange} rows="3" required placeholder="Your full address"></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'} <UserPlus size={18} />
                    </button>
                </form>

                <p className="text-center" style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                </p>
            </div>
        </motion.div>
    );
};

export default Register;
