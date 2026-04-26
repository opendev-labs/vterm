import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Menu, X, Rocket } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show navbar in the app shell itself (it has its own header)
    if (location.pathname === '/app') return null;

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link to="/" className="logo">
                    <Terminal size={32} />
                    V<span>Term</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/docs" className={`nav-link ${location.pathname === '/docs' ? 'active' : ''}`}>Documentation</Link>
                    <Link to="/login" className="btn-primary" style={{ padding: '10px 24px', fontSize: '14px', marginLeft: '12px' }}>
                        Launch App <Rocket size={14} style={{ marginLeft: '8px' }} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
