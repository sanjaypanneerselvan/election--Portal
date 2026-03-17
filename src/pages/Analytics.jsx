import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, Filter, LayoutGrid, Map, Users, ArrowUpRight } from 'lucide-react';
import CandidateBioModal from '../components/CandidateBioModal';

const Analytics = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFront, setSelectedFront] = useState('All');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'candidates'), (snap) => {
            setCandidates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Group candidates by constituency
    const matrix = useMemo(() => {
        const grouped = {};
        candidates.forEach(c => {
            if (!grouped[c.constituency]) {
                grouped[c.constituency] = {
                    name: c.constituency,
                    district: c.district,
                    fronts: {}
                };
            }
            // Group by Front (Alliance_Front)
            const front = c.front || 'Independent';
            if (!grouped[c.constituency].fronts[front]) {
                grouped[c.constituency].fronts[front] = [];
            }
            grouped[c.constituency].fronts[front].push(c);
        });
        return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name));
    }, [candidates]);

    const fronts = ['All', 'Secular Progressive Alliance (SPA)', 'National Democratic Alliance (NDA)', 'Amma Makkal Munnettra Kazagam Front (AMMK)', 'Makkal Needhi Maiam Front (MNM)', 'Naam Tamilar Katchi'];

    const filteredMatrix = matrix.filter(row => 
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.district?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="container animate-in">
            <header style={{ marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div className="status-glow" style={{ padding: '8px', background: 'var(--primary)', borderRadius: '12px' }}>
                        <LayoutGrid size={24} color="white" />
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '2.8rem', margin: 0 }}>Battleground 2026</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px' }}>
                    High-density constituency analysis and contestant matrix. Monitor all major fronts across 234 assembly seats.
                </p>
            </header>

            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', marginBottom: '32px' }}>
                <div className="card glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Search size={20} color="var(--text-muted)" />
                    <input 
                        className="input-glass" 
                        style={{ border: 'none', background: 'transparent', padding: '10px 0', fontSize: '1.1rem' }} 
                        placeholder="Search constituency or district..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="card glass" style={{ padding: '4px 8px', display: 'flex', gap: '8px' }}>
                    {['Grid', 'Map'].map(v => (
                        <button key={v} className={`btn ${v === 'Grid' ? 'btn-primary' : 'glass'}`} style={{ padding: '10px 20px' }}>
                            {v === 'Grid' ? <LayoutGrid size={18} /> : <Map size={18} />} {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alliance Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}>
                {fronts.map(f => (
                    <div 
                        key={f} 
                        className={`category-chip ${selectedFront === f ? 'active' : ''}`}
                        onClick={() => setSelectedFront(f)}
                    >
                        {f === 'All' ? 'All Alliances' : f.split('(')[1]?.replace(')', '') || f}
                    </div>
                ))}
            </div>

            {/* Matrix Table */}
            <div className="card glass" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
                <div style={{ overflowX: 'auto', width: '100%' }}>
                    <div style={{ 
                        minWidth: '1000px', // Ensure it doesn't squash too much
                        background: 'rgba(0,0,0,0.2)',
                        display: 'grid', gridTemplateColumns: '250px repeat(5, 1fr)',
                        fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                    <div style={{ padding: '24px' }}>Constituency</div>
                    <div style={{ padding: '24px', color: '#c0392b' }}>SPA (DMK+)</div>
                    <div style={{ padding: '24px', color: '#b2d33c' }}>NDA (AIADMK+)</div>
                    <div style={{ padding: '24px', color: '#fdae61' }}>NTK</div>
                    <div style={{ padding: '24px', color: '#000080' }}>MNM+</div>
                    <div style={{ padding: '24px', color: '#f1c40f' }}>AMMK+</div>
                </div>

                <div style={{ maxHeight: '700px', overflowY: 'auto', minWidth: '1000px' }}>
                    {filteredMatrix.map((row, idx) => (
                        <div key={row.name} style={{ 
                            display: 'grid', gridTemplateColumns: '250px repeat(5, 1fr)',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                        }}>
                            <div style={{ padding: '24px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{row.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.district}</div>
                            </div>
                            
                            {[
                                'Secular Progressive Alliance (SPA)', 
                                'National Democratic Alliance (NDA)', 
                                'Naam Tamilar Katchi',
                                'Makkal Needhi Maiam Front (MNM)',
                                'Amma Makkal Munnettra Kazagam Front (AMMK)'
                            ].map(frontName => (
                                <div key={frontName} style={{ padding: '16px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                    {row.fronts[frontName]?.map(cand => (
                                        <div 
                                            key={cand.id}
                                            onClick={() => setSelectedCandidate(cand)}
                                            style={{ 
                                                cursor: 'pointer', padding: '8px', borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.03)', marginBottom: '8px', 
                                                transition: 'all 0.2s', border: '1px solid transparent'
                                            }}
                                            className="btn-hover-effect"
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = cand.partyColor}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                        >
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {cand.name} <ArrowUpRight size={12} opacity={0.5} />
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: cand.partyColor, opacity: 0.8 }}>{cand.party}</div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {loading && <div className="text-center" style={{ padding: '100px' }}>Synchronizing Battlefield Data...</div>}
            
            <CandidateBioModal 
                candidate={selectedCandidate} 
                onClose={() => setSelectedCandidate(null)} 
            />
        </main>
    );
};

export default Analytics;
