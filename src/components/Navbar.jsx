import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { Vote, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    return (
        <header className="navbar-blur" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Vote size={28} color="white" />
                </div>
                <span className="gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800 }}>TNElection</span>
            </Link>

            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
                            {user.role === 'admin' ? 'Admin Console' : 'Dashboard'}
                        </Link>
                        <Link to="/candidates" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>Candidates</Link>
                        <Link to="/parties" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>Fronts</Link>
                        <Link to="/analytics" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>Deep Analytics</Link>
                        <Link to="/complaints" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>Complaints</Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '24px', paddingLeft: '24px', borderLeft: '1px solid var(--glass-border)' }}>
                        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '24px', paddingLeft: '24px', borderLeft: '1px solid var(--glass-border)', textDecoration: 'none', color: 'inherit' }}>
                            <div className="img-glow" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        </Link>
                            <button onClick={handleLogout} className="btn glass" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                <LogOut size={16} /> Exit
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/awareness" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontWeight: 500 }}>Awareness</Link>
                        <Link to="/login" className="btn glass" style={{ padding: '10px 24px' }}>Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '10px 28px' }}>Join Portal</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
