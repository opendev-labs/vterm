import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon, Plus, Settings, LogOut, X, Monitor, ChevronLeft, Sliders, Menu, Search, MoreVertical } from 'lucide-react';
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
        <div className="app-shell" style={{ overflow: 'hidden', height: '100vh', background: '#000', position: 'relative', fontFamily: 'Inter, sans-serif' }}>
            {/* GNOME Settings Modal */}
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
                            background: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px'
                        }}
                        onClick={() => setIsSettingsOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="gnome-dialog"
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                background: '#353535',
                                border: '1px solid #454545',
                                borderRadius: '12px',
                                color: 'white',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                overflow: 'hidden'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ padding: '16px', borderBottom: '1px solid #454545', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '15px' }}>Terminal Preferences</span>
                                <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}><X size={18} /></button>
                            </div>
                            
                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#aaa' }}>Appearance</label>
                                    <select 
                                        value={settings.theme} 
                                        onChange={(e) => applySettings({ ...settings, theme: e.target.value })}
                                        style={{ width: '100%', background: '#454545', border: '1px solid #555', color: 'white', padding: '8px', borderRadius: '6px', outline: 'none' }}
                                    >
                                        <option value="default">VTerm (Default)</option>
                                        <option value="matrix">Matrix</option>
                                        <option value="dracula">Dracula</option>
                                        <option value="solarized">Solarized Light</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#aaa' }}>Text Size ({settings.fontSize}px)</label>
                                    <input 
                                        type="range" min="10" max="24" value={settings.fontSize} 
                                        onChange={(e) => applySettings({ ...settings, fontSize: parseInt(e.target.value) })}
                                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#aaa' }}>Window Opacity</label>
                                    <input 
                                        type="range" min="50" max="100" value={settings.opacity} 
                                        onChange={(e) => applySettings({ ...settings, opacity: parseInt(e.target.value) })}
                                        style={{ width: '100%', accentColor: 'var(--accent)' }}
                                    />
                                </div>

                                <button 
                                    onClick={() => setIsSettingsOpen(false)}
                                    style={{ width: '100%', background: '#38bdf8', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GNOME HeaderBar */}
            <div className="gnome-headerbar" style={{ 
                height: '46px',
                background: '#2d2d2d',
                borderBottom: '1px solid #1a1a1a',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                zIndex: 100
            }}>
                {/* Left Section */}
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <button 
                        onClick={() => navigate('/')}
                        style={{ background: 'none', border: 'none', color: '#eee', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Back"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ width: '1px', height: '24px', background: '#454545', margin: '0 8px' }}></div>
                    <button 
                        style={{ background: 'none', border: 'none', color: '#eee', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => window.open(window.location.href, '_blank')}
                        title="New Tab"
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {/* Center Section (Tabs) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 2 }}>
                    <div style={{ 
                        background: '#353535', 
                        height: '34px', 
                        padding: '0 16px', 
                        borderRadius: '6px 6px 0 0', 
                        border: '1px solid #454545',
                        borderBottom: 'none',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        color: '#eee',
                        fontSize: '13px',
                        minWidth: '160px'
                    }}>
                        <Monitor size={14} color="#38bdf8" />
                        <span className="mono">root@vterm:~</span>
                        <X size={12} style={{ marginLeft: 'auto', cursor: 'pointer', opacity: 0.6 }} />
                    </div>
                </div>

                {/* Right Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flex: 1, gap: '4px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#eee', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Search">
                        <Search size={18} />
                    </button>
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        style={{ background: 'none', border: 'none', color: '#eee', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} 
                        title="Menu"
                    >
                        <Menu size={18} />
                    </button>
                    <div style={{ width: '1px', height: '24px', background: '#454545', margin: '0 4px' }}></div>
                    <button 
                        onClick={handleLogout}
                        style={{ background: 'none', border: 'none', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} 
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Terminal Container */}
            <div style={{ position: 'relative', height: 'calc(100vh - 46px)' }}>
                <Terminal mode={mode} target={target} settings={settings} />
            </div>
        </div>
    );
};

export default AppShell;
