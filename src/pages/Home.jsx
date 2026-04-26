import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, FileText, Shield, Zap, Layout, Terminal as TerminalIcon, Cpu, Globe, Lock } from 'lucide-react';

const Home = () => {
    return (
        <div className="landing-page">
            <section className="hero-composite">
                <motion.div 
                    className="hero-content-mid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="badge">v1.0.1 - Live Update</div>
                    <h1>V<span>Term</span></h1>
                    <p>A fast, secure terminal for your browser. Work from anywhere with zero lag.</p>
                    <div className="cta-group">
                        <Link to="/login" className="btn-primary">
                            Launch Terminal <Rocket size={20} style={{ marginLeft: '10px' }} />
                        </Link>
                        <Link to="/docs" className="btn-secondary">Learn More</Link>
                    </div>
                </motion.div>
            </section>

            <section className="features-grid">
                {[
                    { icon: <Zap />, title: "Turbo Speed", desc: "Built on node-pty and xterm.js with GPU acceleration for 60FPS rendering." },
                    { icon: <Lock />, title: "Military Grade", desc: "End-to-end encrypted WebSocket tunnels with enterprise authentication." },
                    { icon: <Globe />, title: "Cloud Native", desc: "Access your production servers from any device, anywhere in the world." },
                    { icon: <Cpu />, title: "Local Bridge", desc: "Seamlessly connect to your local machine with our high-performance bridge." },
                    { icon: <TerminalIcon />, title: "Full CLI Support", desc: "Vim, Tmux, Htop, and Git. Everything works exactly as you expect." },
                    { icon: <Layout />, title: "Multi-Session", desc: "Advanced tab management for complex, multi-server development workflows." }
                ].map((f, i) => (
                    <motion.div 
                        key={i} 
                        className="feature-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                        <div className="icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </motion.div>
                ))}
            </section>


            <section className="bottom-visual-section">
                <motion.div 
                    className="bottom-image-container"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <img src="/hero-bg-new.png" alt="Terminal Footer Background" className="bottom-bg-image" />
                    <div className="bottom-fade-overlay"></div>
                </motion.div>

                <footer style={{ padding: '100px 24px 60px', textAlign: 'center', color: 'var(--text-muted)', position: 'relative', zIndex: 10, background: 'transparent' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: '12px' }}>
                            <TerminalIcon size={24} /> V<span>Term</span>
                        </Link>
                        <p style={{ fontSize: '14px' }}>The Virtual Terminal for Professionals.</p>
                    </div>
                    <p style={{ fontSize: '13px' }}>&copy; 2026 opendev-labs. All systems operational.</p>
                </footer>
            </section>
        </div>
    );
};


export default Home;
