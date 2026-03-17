import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Shield, Landmark, User, MapPin, Calendar, Award } from 'lucide-react';

const CandidateBioModal = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose} style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="card glass"
                    style={{ 
                        width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto',
                        padding: 0, border: '1px solid rgba(255,255,255,0.1)', position: 'relative'
                    }}
                >
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '24px', right: '24px', background: 'var(--glass)',
                        border: 'none', color: 'white', cursor: 'pointer', padding: '8px', borderRadius: '50%',
                        zIndex: 10
                    }}>
                        <X size={24} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr' }}>
                        {/* Sidebar - Profile Photo */}
                        <div style={{ 
                            background: 'rgba(255,255,255,0.03)', padding: '40px', 
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            borderRight: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ 
                                width: '220px', height: '220px', borderRadius: '24px', 
                                overflow: 'hidden', border: `4px solid ${candidate.partyColor || 'var(--primary)'}`,
                                marginBottom: '32px', boxShadow: `0 0 30px ${candidate.partyColor || 'var(--primary)'}44`
                            }}>
                                <img 
                                    src={candidate.imageUrl || 'https://via.placeholder.com/220'} 
                                    alt={candidate.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(candidate.name) + '&background=0D8ABC&color=fff&size=512';
                                    }}
                                />
                            </div>
                            <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '8px' }}>{candidate.name}</h2>
                            <span className="badge" style={{ 
                                borderColor: candidate.partyColor || 'var(--primary)', 
                                color: candidate.partyColor || 'var(--primary)',
                                padding: '6px 16px', fontSize: '0.9rem'
                            }}>
                                {candidate.party}
                            </span>
                            
                            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                                    <MapPin size={18} /> <span>{candidate.constituency}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                                    <Calendar size={18} /> <span>Age: {candidate.age || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                                    <User size={18} /> <span>{candidate.gender || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div style={{ padding: '48px' }}>
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <Landmark size={24} color="var(--primary)" />
                                    <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Electoral Bio</h3>
                                </div>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                                    {candidate.description}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                                <div className="card glass" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>Alliance Front</h4>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{candidate.front || 'Independent'}</p>
                                </div>
                                <div className="card glass" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>District</h4>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{candidate.district || 'Unassigned'}</p>
                                </div>
                            </div>

                            <div style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Shield size={22} color="#10b981" />
                                        <h3 style={{ margin: 0 }}>Official Documentation</h3>
                                    </div>
                                    <a 
                                        href={candidate.affidavitUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn glass" 
                                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                    >
                                        View Affidavit <ExternalLink size={16} />
                                    </a>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                                    Candidate affidavits contain comprehensive details on assets, liabilities, and legal history as filed with the Election Commission of India.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CandidateBioModal;
