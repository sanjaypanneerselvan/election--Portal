import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Users, Flag, MessageSquare, CheckCircle, ArrowRight, Megaphone, AlertTriangle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSeeder } from '../hooks/useSeeder';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card glass" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <Icon size={48} style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{title}</h3>
        <h2 style={{ fontSize: '2.5rem', color: color || 'var(--primary)' }}>{value}</h2>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { seed } = useSeeder();
    const [stats, setStats] = useState({ candidates: 0, parties: 0, solved: 0 });
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        seed(); // Auto-seed on first load if empty
        const fetchStats = async () => {
            const c = await getDocs(collection(db, 'candidates'));
            const p = await getDocs(collection(db, 'parties'));
            const s = await getDocs(query(collection(db, 'complaints'), where('status', '==', 'Resolved')));
            setStats({ candidates: c.size, parties: p.size, solved: s.size });
        };
        fetchStats();

        // Real-time Announcements
        const qAnn = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3));
        const unsub = onSnapshot(qAnn, (snap) => {
            setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return unsub;
    }, []);

    return (
        <main className="container animate-in">
            <header className="hero-section" style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '24px' }}>
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="gradient-text" style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)', marginBottom: '16px', lineHeight: 1.1 }}>Tamil Nadu 2026</h1>
                    <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 36px' }}>
                        The official digital gateway for the 2026 Assembly Elections. Transparency, Democracy, and Innovation at your fingertips.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/candidates" className="btn btn-primary">
                            Explore Candidates <Users size={18} />
                        </Link>
                        <Link to="/awareness" className="btn glass">
                            Voter Rights <CheckCircle size={18} />
                        </Link>
                    </div>
                </motion.div>
            </header>

            {announcements.length > 0 && (
                <section style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <Megaphone size={22} color="var(--primary)" />
                        <h2 style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}>Official Broadcasts</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {announcements.map(a => (
                            <div key={a.id} className="card glass" style={{ padding: '20px', borderLeft: `4px solid ${a.type === 'Alert' ? '#ef4444' : 'var(--primary)'}` }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                                    {a.type === 'Alert' ? <AlertTriangle size={16} color="#ef4444" /> : <Calendar size={16} color="var(--text-muted)" />}
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: a.type === 'Alert' ? '#ef4444' : 'var(--text-muted)' }}>
                                        {a.type} • {new Date(a.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{a.title}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: '1.55' }}>{a.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="stats-grid">
                <StatCard title="Constituency Leaders" value={stats.candidates} icon={Users} color="var(--primary)" />
                <StatCard title="Registered Fronts" value={stats.parties} icon={Flag} color="var(--accent)" />
                <StatCard title="Issues Resolved" value={stats.solved} icon={CheckCircle} color="#10b981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '40px' }}>
                <Link to="/parties" className="card glass" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ marginBottom: '10px', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>Tamil Nadu Political Alliances</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Deep dive into alliances, performance, and the 2026 manifesto.</p>
                        </div>
                        <ArrowRight size={24} color="var(--primary)" style={{ flexShrink: 0, marginLeft: '12px' }} />
                    </div>
                </Link>
                <Link to="/complaints" className="card glass" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ marginBottom: '10px', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>Citizen Report Center</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Found an election irregularity? Report it instantly.</p>
                        </div>
                        <ArrowRight size={24} color="var(--primary)" style={{ flexShrink: 0, marginLeft: '12px' }} />
                    </div>
                </Link>
            </div>
        </main>
    );
};

export default Dashboard;
export { StatCard };
