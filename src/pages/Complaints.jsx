import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Clock, CheckCircle, AlertOctagon, User, ShieldCheck } from 'lucide-react';

const Complaints = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Voter Related');
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const categories = ['Voter Related', 'Booth Issue', 'Misconduct', 'Technical'];

    useEffect(() => {
        if (!user) {
            setAuthLoading(false);
            return;
        }

        const q = user.role === 'admin' 
            ? query(collection(db, 'complaints'))
            : query(collection(db, 'complaints'), where('uid', '==', user.uid));

        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setComplaints(data);
            setAuthLoading(false);
        }, (err) => {
            console.error("Snapshot error:", err);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, [user]);

    const submitComplaint = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Session expired. Please login again.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, 'complaints'), {
                uid: user.uid,
                userName: user.name || user.email || 'Citizen User',
                title,
                category,
                description: desc,
                status: 'Pending',
                remarks: '',
                createdAt: new Date().toISOString()
            });
            setTitle('');
            setDesc('');
            alert('✅ Grievance submitted successfully! We will review it shortly.');
        } catch (err) { 
            console.error("Submission failed:", err);
            alert(`❌ Submission failed: ${err.message}`);
        }
        setLoading(false);
    };

    const updateStatus = async (id, status, remarks) => {
        await updateDoc(doc(db, 'complaints', id), { status, remarks });
    };

    if (authLoading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Connecting to Secure Voting Infrastructure...</div>;

    return (
        <main className="container animate-in" style={{ paddingBottom: '100px' }}>
            <header style={{ marginBottom: '60px', textAlign: 'center', paddingTop: '40px' }}>
                <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px' }}>Grievance Portal</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Secure and transparent electoral issue tracking for the **Tamil Nadu 2026** Assembly Elections.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: user.role === 'admin' ? '1fr' : '450px 1fr', gap: '48px' }}>
                {user.role !== 'admin' && (
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="card glass" style={{ height: 'fit-content', position: 'sticky', top: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                                <Send size={24} color="white" />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>File a Report</h2>
                        </div>

                        <form onSubmit={submitComplaint}>
                            <div style={{ marginBottom: '24px' }}>
                                <label className="form-label">Issue Classification</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {categories.map(cat => (
                                        <div 
                                            key={cat} 
                                            className={`category-chip ${category === cat ? 'active' : ''}`}
                                            onClick={() => setCategory(cat)}
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label className="form-label">Subject</label>
                                <input 
                                    className="input-glass" 
                                    placeholder="Enter a descriptive title"
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label className="form-label">Incident Details</label>
                                <textarea 
                                    className="input-glass" 
                                    rows="6" 
                                    placeholder="Provide specific location, time, and details of the incident..."
                                    value={desc} 
                                    onChange={(e) => setDesc(e.target.value)} 
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem' }} disabled={loading}>
                                {loading ? 'Transmitting Data...' : 'Submit Official Report'}
                            </button>
                        </form>
                    </motion.div>
                )}

                <div className="timeline">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                        <Clock size={28} color="var(--primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
                            {user.role === 'admin' ? 'Master Grievance Feed' : 'My Submission History'}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <AnimatePresence>
                            {complaints.length > 0 ? complaints.map((c, i) => (
                                <motion.div 
                                    key={c.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="timeline-item"
                                    style={{ position: 'relative' }}
                                >
                                    <div className="card glass" style={{ borderLeft: `8px solid ${c.status === 'Resolved' ? '#10b981' : 'var(--primary)'}`, padding: '32px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                    <span className="badge" style={{ 
                                                        background: c.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 133, 0, 0.1)',
                                                        color: c.status === 'Resolved' ? '#10b981' : '#ff8500',
                                                        borderColor: 'currentColor',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        {c.status.toUpperCase()}
                                                    </span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', fontWeight: 800 }}>{c.title}</h3>
                                                <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MessageSquare size={16} /> {c.category}</span>
                                                    {user.role === 'admin' && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700 }}>
                                                            <User size={16} /> {c.userName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 700 }}>REF-ID</div>
                                                <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 900 }}>{c.id.toUpperCase().slice(0, 8)}</div>
                                            </div>
                                        </div>

                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>{c.description}</p>

                                        {c.remarks && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '32px', padding: '24px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#10b981' }}>
                                                    <CheckCircle size={20} />
                                                    <strong style={{ fontSize: '1.1rem' }}>Electoral Resolution</strong>
                                                </div>
                                                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6' }}>{c.remarks}</p>
                                            </motion.div>
                                        )}

                                        {user.role === 'admin' && c.status !== 'Resolved' && (
                                            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--glass-border)' }}>
                                                <label className="form-label">System Resolution Entry</label>
                                                <div style={{ display: 'flex', gap: '16px' }}>
                                                    <input 
                                                        id={`remarks-${c.id}`}
                                                        className="input-glass"
                                                        placeholder="Provide detailed resolution remarks for the citizen..." 
                                                        style={{ flex: 1 }}
                                                    />
                                                    <button 
                                                        onClick={() => updateStatus(c.id, 'Resolved', document.getElementById(`remarks-${c.id}`).value)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0 32px' }}
                                                    >
                                                        Finalize
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="card glass text-center" style={{ padding: '100px 40px', opacity: 0.6 }}>
                                    <AlertOctagon size={64} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
                                    <h3 style={{ color: 'var(--text-muted)', fontSize: '1.5rem' }}>No Reports in Transmission</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>The election monitoring system is currently clear in this sector.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Complaints;
