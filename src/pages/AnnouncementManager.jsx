import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Trash2, Send, AlertTriangle, Info, Newspaper, X } from 'lucide-react';

const AnnouncementManager = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('News');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsubscribe;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'announcements'), {
                title,
                content,
                type,
                createdAt: new Date().toISOString()
            });
            setTitle('');
            setContent('');
            setType('News');
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this announcement?')) {
            await deleteDoc(doc(db, 'announcements', id));
        }
    };

    const getIcon = (t) => {
        switch(t) {
            case 'Alert': return <AlertTriangle size={20} color="#ef4444" />;
            case 'Update': return <Info size={20} color="var(--primary)" />;
            default: return <Newspaper size={20} color="#3b82f6" />;
        }
    };

    return (
        <main className="container animate-in">
            <header style={{ marginBottom: '40px' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Announcement Center</h1>
                <p style={{ color: 'var(--text-muted)' }}>Broadcast official updates and alerts to all platform users.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '450px 1fr', gap: '48px' }}>
                {/* Post Section */}
                <div className="card glass" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                        <Megaphone size={28} color="var(--primary)" />
                        <h2 style={{ margin: 0, fontSize: '1.6rem' }}>Broadcast Update</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label className="form-label">Classification</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {['News', 'Update', 'Alert'].map(t => (
                                    <div 
                                        key={t} 
                                        className={`category-chip ${type === t ? 'active' : ''}`}
                                        onClick={() => setType(t)}
                                        style={{ flex: 1, textAlign: 'center' }}
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label className="form-label">Headline</label>
                            <input className="input-glass" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Main heading..." required />
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label className="form-label">Detailed Content</label>
                            <textarea className="input-glass" rows="6" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Announcement details..." required></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                            <Send size={18} /> {loading ? 'Transmitting...' : 'Post Announcement'}
                        </button>
                    </form>
                </div>

                {/* Feed Section */}
                <div>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.4rem' }}>Current Broadcasts</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <AnimatePresence>
                            {announcements.map(a => (
                                <motion.div 
                                    key={a.id} 
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card glass" 
                                    style={{ padding: '24px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {getIcon(a.type)}
                                            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em', color: a.type === 'Alert' ? '#ef4444' : 'var(--text-muted)' }}>
                                                {a.type}
                                            </span>
                                        </div>
                                        <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Remove">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{a.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{a.content}</p>
                                    <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(a.createdAt).toLocaleString()}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {announcements.length === 0 && (
                            <div className="card glass text-center" style={{ padding: '40px', opacity: 0.6 }}>
                                No active announcements.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AnnouncementManager;
