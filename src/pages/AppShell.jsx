import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon, Plus, Settings, LogOut, X, Monitor, ChevronLeft, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from '../components/Terminal';

const AppShell = ({ mode: propMode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    
    const mode = propMode || query.get('mode') || 'cloud';
    const target = query.get('target');

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('vterm_settings');
        return saved ? JSON.parse(saved) : {
            theme: 'default',
            fontSize: 15,
            opacity: 85
        };
    });

    const applySettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('vterm_settings', JSON.stringify(newSettings));
    };

    const handleLogout = async () => {
        await fetch('/api/logout');
        window.location.href = '/login';
    };

    return (
        <div className="app-shell" style={{ overflow: 'hidden', height: '100vh', background: '#000', position: 'relative' }}>
            {/* Settings Modal Overlay */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="settings-modal-overlay"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 2000,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px'
                        }}
                        onClick={() => setIsSettingsOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="settings-modal-card"
                            style={{
                                width: '100%',
                                maxWidth: '440px',
                                background: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid var(--accent)',
                                borderRadius: '24px',
                                padding: '40px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px var(--accent-glow)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="settings-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                                    <Sliders size={24} color="var(--accent)" /> Preferences
                                </h2>
                                <button 
                                    onClick={() => setIsSettingsOpen(false)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'white' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="settings-content">
                                <div className="settings-group" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Visual Environment</label>
                                    <select 
                                        value={settings.theme} 
                                        onChange={(e) => applySettings({ ...settings, theme: e.target.value })}
                                        className="input-field"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <option value="default">VTerm Protocol (Default)</option>
                                        <option value="matrix">Matrix Override</option>
                                        <option value="dracula">Neon Night</option>
                                        <option value="solarized">High Contrast</option>
                                    </select>
                                </div>
                                <div className="settings-group" style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Buffer Font Size ({settings.fontSize}px)</label>
                                    <input 
                                        type="range" 
                                        min="10" max="24" 
                                        value={settings.fontSize} 
                                        onChange={(e) => applySettings({ ...settings, fontSize: parseInt(e.target.value) })}
                                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                                    />
                                </div>
                                <div className="settings-group" style={{ marginBottom: '32px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>UI Opacity ({settings.opacity}%)</label>
                                    <input 
                                        type="range" 
                                        min="50" max="100" 
                                        value={settings.opacity} 
                                        onChange={(e) => applySettings({ ...settings, opacity: parseInt(e.target.value) })}
                                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                                    />
                                </div>
                                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsSettingsOpen(false)}>
                                    Save & Synchronize
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div id="overlay" style={{ 
                height: '48px',
                background: `rgba(2, 6, 23, ${settings.opacity / 100})`,
                borderBottom: '1px solid var(--border)',
                backdropFilter: 'blur(10px)',
                zIndex: 100
            }}>
                <div className="header" style={{ height: '100%', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                            className="header-btn" 
                            onClick={() => navigate('/')}
                            style={{ padding: '6px', marginRight: '4px' }}
                            title="Back to Home"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="tabs" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="tab active" style={{ 
                                background: 'rgba(56, 189, 248, 0.1)', 
                                border: '1px solid var(--accent)',
                                borderRadius: '6px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 12px',
                                color: 'white'
                            }}>
                                <Monitor size={14} style={{ marginRight: '8px' }} /> 
                                <span className="mono" style={{ fontSize: '12px' }}>root@vterm:~</span>
                            </div>
                            <button 
                                className="header-btn" 
                                style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px' }}
                                onClick={() => window.open(window.location.href, '_blank')}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="title-container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="title" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            MODE: <span style={{ color: 'var(--accent)' }}>{mode.toUpperCase()}</span>
                        </div>
                        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                        <button className="header-btn" onClick={() => setIsSettingsOpen(true)} title="Settings">
                            <Settings size={18} />
                        </button>
                        <button className="header-btn logout-btn" onClick={handleLogout} title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ position: 'relative', height: 'calc(100vh - 48px)' }}>
                <Terminal mode={mode} target={target} settings={settings} />
            </div>
        </div>
    );
};

export default AppShell;
