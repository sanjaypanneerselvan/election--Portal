import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, Shield, Zap } from 'lucide-react';

const Awareness = () => {
    return (
        <main className="container" style={{ marginTop: '40px' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card glass text-center" 
                style={{ background: 'linear-gradient(135deg, var(--primary), #880e4f)', color: 'white', padding: '80px 40px', border: 'none', borderRadius: '32px' }}
            >
                <h2 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '16px' }}>Power of Your Vote</h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>Participating in the 2026 Elections ensures your voice is at the heart of our democracy.</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px', marginTop: '40px' }}>
                <div className="card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <Shield size={28} color="var(--primary)" />
                        </div>
                        <h3>Democratic Rights</h3>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-muted)' }}>
                        <li>• Voting is a constitutional right for every citizen over 18.</li>
                        <li>• It allows you to choose leaders who reflect your values.</li>
                        <li>• Every vote contributes to a collective mandate.</li>
                    </ul>
                </div>

                <div className="card glass">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <Zap size={28} color="var(--primary)" />
                        </div>
                        <h3>Voting Process</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>01</span>
                            <p>Verify your details in the Electoral Roll online.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>02</span>
                            <p>Locate your designated Polling Station.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>03</span>
                            <p>Bring valid photo identification on election day.</p>
                        </div>
                    </div>
                </div>

                <div className="card glass text-center">
                    <div style={{ marginBottom: '24px' }}>
                        <CheckCircle size={64} color="#43a047" style={{ margin: '0 auto' }} />
                    </div>
                    <h3 style={{ marginBottom: '16px' }}>Cast a Conscious Vote</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Evaluate candidates based on their track record, vision, and plans for the constituency rather than hearsay.</p>
                    <button className="btn btn-primary mt-2">Learn More</button>
                </div>
            </div>
        </main>
    );
};

export default Awareness;
