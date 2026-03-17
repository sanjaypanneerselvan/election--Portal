import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [loading, setLoading] = useState(false);

    if (!user) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading Secure Identity...</div>;

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), formData);
            setIsEditing(false);
            alert('Profile updated successfully!');
            window.location.reload(); // Refresh to reflect changes from AuthContext
        } catch (err) {
            console.error(err);
            alert('Failed to update profile.');
        }
        setLoading(false);
    };

    return (
        <main className="container animate-in" style={{ maxWidth: '800px', paddingBottom: '100px' }}>
            <header style={{ marginBottom: '60px', textAlign: 'center', paddingTop: '40px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px' }}>Digital Identity</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your electoral credentials and contact information.</p>
            </header>

            <div className="card glass" style={{ padding: '48px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)' }}>
                    <div style={{ 
                        width: '80px', height: '80px', borderRadius: '24px', 
                        background: 'var(--primary)', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        border: '4px solid var(--glass-border)'
                    }}>
                        <User size={40} color="white" />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="btn glass" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Edit3 size={16} /> Edit Profile
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(false)} className="btn glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                            <X size={16} /> Cancel
                        </button>
                    )}
                </div>

                <form onSubmit={handleUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                        <div>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={16} /> Full Name
                            </label>
                            {isEditing ? (
                                <input 
                                    className="input-glass" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required
                                />
                            ) : (
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{user.name}</div>
                            )}
                        </div>

                        <div>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={16} /> Email Address
                            </label>
                            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{user.email}</div>
                            <span className="badge" style={{ marginTop: '8px', fontSize: '0.7rem' }}>Verified Citizen</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                        <div>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={16} /> Mobile Number
                            </label>
                            {isEditing ? (
                                <input 
                                    className="input-glass" 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                    required
                                />
                            ) : (
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'white' }}>{user.phone || 'Not provided'}</div>
                            )}
                        </div>

                        <div>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={16} /> Platform Role
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="badge" style={{ 
                                    background: user.role === 'admin' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: user.role === 'admin' ? '#3b82f6' : '#10b981',
                                    padding: '4px 12px'
                                }}>
                                    {user.role.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={16} /> Registered Address
                        </label>
                        {isEditing ? (
                            <textarea 
                                className="input-glass" 
                                rows="4"
                                value={formData.address} 
                                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                                required
                            ></textarea>
                        ) : (
                            <div style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{user.address}</div>
                        )}
                    </div>

                    {isEditing && (
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} disabled={loading}>
                            {loading ? 'Updating Identity...' : (
                                <> <Save size={20} /> Save Changes </>
                            )}
                        </button>
                    )}
                </form>
            </div>

            <div className="card glass" style={{ marginTop: '32px', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '32px' }}>
                <h4 style={{ color: '#ef4444', marginBottom: '12px' }}>Security Notice</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    To ensure the integrity of the **Tamil Nadu 2026** elections, any change to your registered name or address will be logged and may require verification by an election officer.
                </p>
            </div>
        </main>
    );
};

export default Profile;
