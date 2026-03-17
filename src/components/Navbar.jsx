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
        <header className="navbar-blur" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%', position: 'sticky', top: 0, zIndex: 1000 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1001 }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Vote size={28} color="white" />
                </div>
                <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>TNElection</span>
            </Link>

            {/* Hamburger for Mobile */}
            <button 
                className="btn glass hide-desktop" 
                onClick={() => setIsOpen(!isOpen)}
                style={{ padding: '8px', zIndex: 1001 }}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Navigation Links */}
            <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
                {user ? (
                    <>
                        <Link onClick={() => setIsOpen(false)} to={user.role === 'admin' ? '/admin' : '/dashboard'} className="nav-link">
                            {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                        </Link>
                        <Link onClick={() => setIsOpen(false)} to="/candidates" className="nav-link text-muted">Candidates</Link>
                        <Link onClick={() => setIsOpen(false)} to="/parties" className="nav-link text-muted">Fronts</Link>
                        <Link onClick={() => setIsOpen(false)} to="/analytics" className="nav-link text-muted">Analysis</Link>
                        <Link onClick={() => setIsOpen(false)} to="/complaints" className="nav-link text-muted">Alerts</Link>
                        
                        <div className="nav-profile-section">
                            <Link onClick={() => setIsOpen(false)} to="/profile" className="profile-link">
                                <div className="img-glow" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </Link>
                            <button onClick={handleLogout} className="btn glass logout-btn">
                                <LogOut size={16} /> Exit
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link onClick={() => setIsOpen(false)} to="/awareness" className="nav-link text-muted">Awareness</Link>
                        <Link onClick={() => setIsOpen(false)} to="/login" className="btn glass nav-auth-btn">Login</Link>
                        <Link onClick={() => setIsOpen(false)} to="/register" className="btn btn-primary nav-auth-btn">Join Portal</Link>
                    </>
                )}
            </nav>

            <style>{`
                .nav-menu { display: flex; gap: 32px; alignItems: center; transition: var(--transition); }
                .nav-link { text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.95rem; transition: var(--transition); }
                .nav-link.text-muted { color: var(--text-muted); font-weight: 500; }
                .nav-link:hover { color: var(--primary); }
                .nav-profile-section { display: flex; alignItems: center; gap: 16px; margin-left: 24px; padding-left: 24px; border-left: 1px solid var(--glass-border); }
                .hide-desktop { display: none; }

                @media (max-width: 992px) {
                    .hide-desktop { display: flex; }
                    .nav-menu {
                        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                        background: var(--bg-dark);
                        flex-direction: column; justify-content: center;
                        padding: 100px 40px; gap: 24px;
                        transform: translateY(-100%);
                        opacity: 0; visibility: hidden;
                    }
                    .nav-menu.active { 
                        transform: translateY(0); 
                        opacity: 1; visibility: visible; 
                    }
                    .nav-link { font-size: 1.5rem; width: 100%; text-align: center; }
                    .nav-profile-section { 
                        flex-direction: column; width: 100%; 
                        margin: 20px 0 0 0; padding: 20px 0 0 0; 
                        border-left: none; border-top: 1px solid var(--glass-border); 
                    }
                    .logout-btn { width: 100%; justify-content: center; padding: 16px; }
                    .nav-auth-btn { width: 100%; justify-content: center; }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
