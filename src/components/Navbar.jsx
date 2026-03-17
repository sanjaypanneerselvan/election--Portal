import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { Vote, LogOut, LayoutDashboard, Users, Flag, BarChart2, MessageSquare, Home, X, Menu, ShieldCheck, User } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const handleLogout = async () => {
        setSidebarOpen(false);
        await auth.signOut();
        navigate('/login');
    };

    const navLinks = user ? [
        { to: user.role === 'admin' ? '/admin' : '/dashboard', label: user.role === 'admin' ? 'Admin Console' : 'Dashboard', Icon: LayoutDashboard },
        { to: '/candidates', label: 'Candidates', Icon: Users },
        { to: '/parties', label: 'Political Fronts', Icon: Flag },
        { to: '/analytics', label: 'Deep Analytics', Icon: BarChart2 },
        { to: '/complaints', label: 'Report Center', Icon: MessageSquare },
    ] : [
        { to: '/awareness', label: 'Voter Awareness', Icon: Home },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* ===== TOP NAVBAR ===== */}
            <header style={{
                height: '66px', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0 5%',
                position: 'sticky', top: 0, zIndex: 900,
                background: 'rgba(2, 6, 23, 0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.07)'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #ff3e3e, #7c0000)', padding: '8px', borderRadius: '10px' }}>
                        <Vote size={24} color="white" />
                    </div>
                    <span style={{
                        fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.5px',
                        background: 'linear-gradient(135deg, #fff 40%, #ff3e3e)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>TNElection</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to} to={to}
                            style={{
                                textDecoration: 'none',
                                color: isActive(to) ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: isActive(to) ? 700 : 500,
                                fontSize: '0.92rem',
                                transition: 'color 0.2s',
                                borderBottom: isActive(to) ? '2px solid var(--primary)' : 'none',
                                paddingBottom: '2px'
                            }}
                        >
                            {label}
                        </Link>
                    ))}

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: '8px', paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                            <Link to="/profile" style={{ textDecoration: 'none' }}>
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '50%',
                                    background: 'var(--primary)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontWeight: 800, fontSize: '1rem'
                                }}>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </Link>
                            <button onClick={handleLogout} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(255,62,62,0.1)', border: '1px solid rgba(255,62,62,0.25)',
                                color: '#ff6b6b', borderRadius: '10px', padding: '8px 16px',
                                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s'
                            }}>
                                <LogOut size={14} /> Exit
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '12px', marginLeft: '8px' }}>
                            <Link to="/login" style={{
                                textDecoration: 'none', padding: '8px 20px', borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.15)', color: 'white',
                                fontWeight: 600, fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)'
                            }}>Login</Link>
                            <Link to="/register" style={{
                                textDecoration: 'none', padding: '8px 20px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #ff3e3e, #7c0000)',
                                color: 'white', fontWeight: 700, fontSize: '0.9rem'
                            }}>Join Portal</Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Hamburger */}
                <button
                    className="hamburger-btn"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open Menu"
                    style={{
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px', padding: '8px 10px', cursor: 'pointer',
                        display: 'none', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}
                >
                    <Menu size={22} />
                </button>
            </header>

            {/* ===== SIDEBAR OVERLAY ===== */}
            <div
                onClick={() => setSidebarOpen(false)}
                style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(4px)',
                    opacity: sidebarOpen ? 1 : 0,
                    visibility: sidebarOpen ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease'
                }}
            />

            {/* ===== SIDEBAR DRAWER ===== */}
            <aside style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1001,
                width: '280px',
                background: 'linear-gradient(180deg, #0c0f2e 0%, #040715 100%)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', flexDirection: 'column',
                padding: '0',
                boxShadow: sidebarOpen ? '10px 0 40px rgba(0,0,0,0.6)' : 'none'
            }}>
                {/* Sidebar Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,62,62,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'linear-gradient(135deg, #ff3e3e, #7c0000)', padding: '7px', borderRadius: '8px' }}>
                            <Vote size={20} color="white" />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>TNElection</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} style={{
                        background: 'rgba(255,255,255,0.07)', border: 'none',
                        borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'white'
                    }}>
                        <X size={18} />
                    </button>
                </div>

                {/* User Profile Strip */}
                {user && (
                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                            background: 'rgba(255,62,62,0.04)', cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, #ff3e3e, #7c0000)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: '1.2rem', color: 'white'
                            }}>
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name || 'Citizen'}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.email}
                                </div>
                            </div>
                            <div style={{
                                marginLeft: 'auto', flexShrink: 0,
                                padding: '3px 8px', borderRadius: '6px',
                                background: user.role === 'admin' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)',
                                color: user.role === 'admin' ? '#60a5fa' : '#34d399',
                                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em'
                            }}>
                                {user.role}
                            </div>
                        </div>
                    </Link>
                )}

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', padding: '8px 10px', marginBottom: '4px' }}>
                        Navigation
                    </div>
                    {navLinks.map(({ to, label, Icon }) => (
                        <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '13px 12px', borderRadius: '12px', marginBottom: '4px',
                                background: isActive(to) ? 'linear-gradient(135deg, rgba(255,62,62,0.2), rgba(124,0,0,0.1))' : 'transparent',
                                border: isActive(to) ? '1px solid rgba(255,62,62,0.2)' : '1px solid transparent',
                                color: isActive(to) ? '#ff6b6b' : 'rgba(255,255,255,0.7)',
                                transition: 'all 0.2s',
                                fontWeight: isActive(to) ? 700 : 500,
                            }}>
                                <Icon size={18} style={{ flexShrink: 0, opacity: isActive(to) ? 1 : 0.6 }} />
                                <span style={{ fontSize: '0.92rem' }}>{label}</span>
                                {isActive(to) && (
                                    <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#ff3e3e' }} />
                                )}
                            </div>
                        </Link>
                    ))}

                    {/* Profile Link (mobile-only) */}
                    {user && (
                        <Link to="/profile" style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '13px 12px', borderRadius: '12px', marginBottom: '4px',
                                background: isActive('/profile') ? 'linear-gradient(135deg, rgba(255,62,62,0.2), rgba(124,0,0,0.1))' : 'transparent',
                                border: '1px solid transparent',
                                color: isActive('/profile') ? '#ff6b6b' : 'rgba(255,255,255,0.7)',
                                fontWeight: isActive('/profile') ? 700 : 500, transition: 'all 0.2s',
                            }}>
                                <User size={18} style={{ flexShrink: 0, opacity: 0.7 }} />
                                <span style={{ fontSize: '0.92rem' }}>My Profile</span>
                            </div>
                        </Link>
                    )}
                </nav>

                {/* Footer / Logout */}
                {user ? (
                    <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <button onClick={handleLogout} style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '14px', borderRadius: '14px', cursor: 'pointer',
                            background: 'rgba(255,62,62,0.08)', border: '1px solid rgba(255,62,62,0.2)',
                            color: '#ff6b6b', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s'
                        }}>
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                ) : (
                    <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/login" style={{
                            textDecoration: 'none', textAlign: 'center', padding: '13px',
                            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', fontWeight: 600, fontSize: '0.92rem',
                            background: 'rgba(255,255,255,0.05)'
                        }}>Login</Link>
                        <Link to="/register" style={{
                            textDecoration: 'none', textAlign: 'center', padding: '13px',
                            borderRadius: '12px', color: 'white', fontWeight: 700, fontSize: '0.92rem',
                            background: 'linear-gradient(135deg, #ff3e3e, #7c0000)'
                        }}>Join Portal</Link>
                    </div>
                )}

                {/* Branding at bottom */}
                <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={12} color="rgba(255,255,255,0.25)" />
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>
                            Tamil Nadu Election Commission Portal 2026
                        </span>
                    </div>
                </div>
            </aside>

            {/* Responsive CSS */}
            <style>{`
                .desktop-nav {
                    display: flex;
                    align-items: center;
                    gap: 28px;
                }
                .hamburger-btn {
                    display: none !important;
                }

                @media (max-width: 992px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .hamburger-btn {
                        display: flex !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Navbar;
