import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Flag, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const CandidateCard = ({ candidate }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card glass"
        style={{ padding: 0, overflow: 'hidden' }}
    >
        <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
            <img 
                src={candidate.imageUrl} 
                alt={candidate.name} 
                className="img-glow"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderBottom: '1px solid var(--glass-border)' }} 
                onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(candidate.name) + '&background=0D8ABC&color=fff&size=512';
                }}
            />
            <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <span className="badge" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>{candidate.constituency}</span>
            </div>
        </div>
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                <Flag size={16} /> {candidate.party}
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', fontWeight: 800 }}>{candidate.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px', minHeight: '4.8rem' }}>{candidate.description}</p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Candidate Profile</button>
        </div>
    </motion.div>
);

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [partyFilter, setPartyFilter] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchCandidates = async () => {
            const snap = await getDocs(collection(db, 'candidates'));
            const data = snap.docs.map(doc => doc.data());
            setCandidates(data);
            
            const params = new URLSearchParams(location.search);
            const party = params.get('party');
            if (party) setPartyFilter(party);
        };
        fetchCandidates();
    }, [location]);

    useEffect(() => {
        let result = candidates;
        if (search) {
            result = result.filter(c => 
                c.name.toLowerCase().includes(search.toLowerCase()) || 
                c.constituency.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (partyFilter) {
            result = result.filter(c => c.party === partyFilter);
        }
        setFiltered(result);
    }, [search, partyFilter, candidates]);

    return (
        <main className="container animate-in">
            <div className="mb-2" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="gradient-text" style={{ fontSize: '3rem' }}>Candidate Directory</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Meet the leaders shaping the future of Tamil Nadu in 2026.</p>
            </div>

            <div className="card glass mb-2" style={{ padding: '32px', marginBottom: '60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={22} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            style={{ width: '100%', padding: '16px 16px 16px 50px', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
                            placeholder="Enter Name or constituency..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)', appearance: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
                        value={partyFilter}
                        onChange={(e) => setPartyFilter(e.target.value)}
                    >
                        <option value="" style={{ color: '#000' }}>All Major Political Parties</option>
                        <option value="DMK" style={{ color: '#000' }}>DMK - Dravida Munnetra Kazhagam</option>
                        <option value="AIADMK" style={{ color: '#000' }}>AIADMK - All India ADMK</option>
                        <option value="TVK" style={{ color: '#000' }}>TVK - Tamilaga Vettri Kazhagam</option>
                        <option value="BJP" style={{ color: '#000' }}>BJP - Bharatiya Janata Party</option>
                        <option value="NTK" style={{ color: '#000' }}>NTK - Naam Tamilar Katchi</option>
                    </select>
                    <button className="btn btn-primary" style={{ padding: '16px 32px' }}>
                        <Filter size={20} /> Apply
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '40px' }}>
                <AnimatePresence>
                    {filtered.map((c, i) => (
                        <CandidateCard key={c.name} candidate={c} />
                    ))}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default Candidates;
