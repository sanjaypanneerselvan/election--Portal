import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Edit2, Trash2, Save, X, Search, Image as ImageIcon } from 'lucide-react';

const CandidateManager = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', party: '', constituency: '', description: '', imageUrl: '' });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'candidates'), (snap) => {
            setCandidates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, 'candidates', editingId), formData);
                setEditingId(null);
            } else {
                await addDoc(collection(db, 'candidates'), formData);
            }
            setFormData({ name: '', party: '', constituency: '', description: '', imageUrl: '' });
        } catch (err) { console.error(err); }
    };

    const handleEdit = (c) => {
        setEditingId(c.id);
        setFormData({ name: c.name, party: c.party, constituency: c.constituency, description: c.description, imageUrl: c.imageUrl });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this candidate?')) {
            await deleteDoc(doc(db, 'candidates', id));
        }
    };

    const filtered = candidates.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.party?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="container animate-in">
            <header style={{ marginBottom: '40px' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Candidate Management</h1>
                <p style={{ color: 'var(--text-muted)' }}>Create, update, and manage official candidate profiles.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px' }}>
                {/* Form Section */}
                <div className="card glass" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        {editingId ? <Edit2 size={24} color="var(--primary)" /> : <UserPlus size={24} color="var(--primary)" />}
                        <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{editingId ? 'Edit Candidate' : 'New Candidate'}</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="form-label">Full Name</label>
                            <input name="name" className="input-glass" value={formData.name} onChange={handleChange} required placeholder="Candidate Name" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="form-label">Political Party</label>
                            <input name="party" className="input-glass" value={formData.party} onChange={handleChange} required placeholder="e.g. DMK, AIADMK" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="form-label">Constituency</label>
                            <input name="constituency" className="input-glass" value={formData.constituency} onChange={handleChange} required placeholder="e.g. Kolathur" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label className="form-label">Profile Image URL</label>
                            <input name="imageUrl" className="input-glass" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label className="form-label">Description</label>
                            <textarea name="description" className="input-glass" value={formData.description} onChange={handleChange} rows="4" placeholder="Brief biography..." required></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                {editingId ? <><Save size={18} /> Update</> : <><UserPlus size={18} /> Add Candidate</>}
                            </button>
                            {editingId && (
                                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', party: '', constituency: '', description: '', imageUrl: '' }); }} className="btn glass" style={{ padding: '0 20px' }}>
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div>
                    <div className="card glass" style={{ marginBottom: '24px', padding: '16px 24px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                className="input-glass" 
                                style={{ paddingLeft: '44px', background: 'transparent', border: 'none' }} 
                                placeholder="Search by name or party..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <AnimatePresence>
                            {filtered.map(c => (
                                <motion.div 
                                    key={c.id} 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card glass" 
                                    style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}
                                >
                                    <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {c.imageUrl ? (
                                            <img 
                                                src={c.imageUrl} 
                                                alt={c.name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(c.name) + '&background=0D8ABC&color=fff&size=128';
                                                }}
                                            />
                                        ) : (
                                            <ImageIcon size={32} color="var(--text-muted)" />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <h3 style={{ margin: 0 }}>{c.name}</h3>
                                            <span className="badge" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', fontSize: '0.7rem' }}>{c.party}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{c.constituency}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(c)} className="btn glass" style={{ padding: '10px' }} title="Edit"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(c.id)} className="btn glass" style={{ padding: '10px', color: '#ef4444' }} title="Delete"><Trash2 size={18} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filtered.length === 0 && !loading && (
                            <div className="card glass text-center" style={{ padding: '40px', opacity: 0.6 }}>
                                No candidates found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CandidateManager;
