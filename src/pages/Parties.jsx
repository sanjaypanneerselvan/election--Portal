import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartyCard = ({ party }) => (
    <motion.div 
        whileHover={{ y: -12, scale: 1.02 }}
        className="card glass text-center"
        style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}
    >
        {/* Background Accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)', zIndex: -1 }}></div>

        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 32px' }}>
            {/* Leader Image */}
            <div style={{ 
                width: '100%', height: '100%', borderRadius: '50%', 
                overflow: 'hidden', border: '4px solid var(--glass-border)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
            }}>
                <img 
                    src={party.leaderImageUrl || 'https://via.placeholder.com/160'} 
                    alt={party.leaderName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(party.leaderName || party.name) + '&background=0D8ABC&color=fff&size=512';
                    }}
                />
            </div>
            
            {/* Party Logo Overlay */}
            <div style={{ 
                position: 'absolute', bottom: '-10px', right: '-10px',
                background: 'white', width: '64px', height: '64px', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', border: '3px solid var(--glass-border)',
                padding: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
            }}>
                <img src={party.logoUrl} alt={party.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
        </div>

        <h3 className="gradient-text" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{party.name}</h3>
        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {party.leaderName || 'Party Leadership'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px', minHeight: '4.8rem' }}>{party.description}</p>
        
        <Link to={`/candidates?party=${encodeURIComponent(party.name)}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            View Candidates <ArrowRight size={18} />
        </Link>
    </motion.div>
);

const Parties = () => {
    const [parties, setParties] = useState([]);

    useEffect(() => {
        const fetchParties = async () => {
            const snap = await getDocs(collection(db, 'parties'));
            setParties(snap.docs.map(doc => doc.data()));
        };
        fetchParties();
    }, []);

    return (
        <main className="container animate-in">
            <div className="mb-2" style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 className="gradient-text" style={{ fontSize: '3rem' }}>Tamil Nadu Political Fronts</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Analyze the ideologies and leadership of major political alliances for 2026.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px' }}>
                {parties.map(p => (
                    <PartyCard key={p.name} party={p} />
                ))}
            </div>
        </main>
    );
};

export default Parties;
