import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Shield, ClipboardList, CheckCircle, AlertCircle, RefreshCw, UserPlus, Megaphone } from 'lucide-react';
import { StatCard } from './Dashboard';
import { Link } from 'react-router-dom';
import { useSeeder } from '../hooks/useSeeder';

const AdminDashboard = () => {
    const { seed, syncMasterData } = useSeeder();
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchStats = async () => {
        const snap = await getDocs(collection(db, 'complaints'));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        setStats({
            total: all.length,
            pending: all.filter(c => c.status === 'Pending').length,
            resolved: all.filter(c => c.status === 'Resolved').length
        });

        // Get latest 5 pending for the feed
        const recent = all
            .filter(c => c.status === 'Pending')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        setRecentComplaints(recent);
    };

    useEffect(() => {
        seed();
        fetchStats();
    }, []);

    return (
        <main className="container" style={{ marginTop: '40px' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2><Shield style={{ verticalAlign: 'middle', marginRight: '12px' }} color="var(--primary)" /> Admin Console</h2>
                        <p style={{ color: 'var(--text-muted)' }}>System oversight and platform management hub.</p>
                    </div>
                    <button onClick={fetchStats} className="btn" style={{ background: 'white' }}><RefreshCw size={18} /> Refresh</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    <StatCard title="Total Complaints" value={stats.total} icon={ClipboardList} />
                    <StatCard title="Pending Review" value={stats.pending} icon={AlertCircle} color="#f57c00" />
                    <StatCard title="Resolved Issues" value={stats.resolved} icon={CheckCircle} color="#43a047" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div className="card glass">
                        <h3 style={{ marginBottom: '24px' }}>Administrative Actions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Link to="/admin/candidates" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                                Manage Candidates <UserPlus size={18} />
                            </Link>
                            <Link to="/admin/announcements" className="btn btn-primary" style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                                Broadcast Center <Megaphone size={18} />
                            </Link>
                            <Link to="/complaints" className="btn glass" style={{ justifyContent: 'center' }}>
                                Process Complaints <ClipboardList size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="card glass" style={{ border: '1px solid rgba(255, 62, 62, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <RefreshCw size={24} color="var(--primary)" />
                            <h3 style={{ margin: 0 }}>System Maintenance</h3>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                            Perform a hard reset to clear legacy database entries and force-reload synchronized **Tamil Nadu 2026** election data and photos.
                        </p>
                        <button 
                            onClick={() => {
                                if(window.confirm('Electoral data will be hard-reset. Proceed?')) {
                                    seed(true).then(() => {
                                        alert('TN 2026 Data Synchronized!');
                                        window.location.reload();
                                    });
                                }
                            }}
                            className="btn btn-primary" 
                            style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #000, #334155)' }}
                        >
                            Sync TN 2026 Live Data
                        </button>

                        <button 
                            onClick={async () => {
                                if(window.confirm('This will download and sync 1000+ candidates from the Analytics Portal. Proceed?')) {
                                    setIsSyncing(true);
                                    const count = await syncMasterData();
                                    setIsSyncing(false);
                                    if(count > 0) alert(`Success! ${count} candidates synced.`);
                                }
                            }}
                            className="btn glass" 
                            style={{ width: '100%', justifyContent: 'center', marginTop: '12px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            disabled={isSyncing}
                        >
                            {isSyncing ? 'Synchronizing Dataset...' : 'Master Sync 2021 Data'}
                        </button>
                    </div>
                </div>

                <div className="card glass" style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ClipboardList color="var(--primary)" /> Recent Grievances
                        </h3>
                        <Link to="/complaints" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                            View Master Feed →
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentComplaints.length > 0 ? recentComplaints.map(c => (
                            <div key={c.id} style={{ 
                                display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', 
                                padding: '16px', background: 'rgba(255,255,255,0.02)', 
                                borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' 
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span className="badge" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{c.category}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{c.title}</h4>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        From: {c.userName} — {c.description}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Link to="/complaints" className="btn glass" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                        Review
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '12px' }}>
                                No pending grievances detected.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default AdminDashboard;
