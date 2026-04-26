import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Terminal as TerminalIcon, Settings, LogOut, X } from 'lucide-react';
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
        <div className="app-shell" style={{ overflow: 'hidden', height: '100vh', background: '#000' }}>
            {/* Settings Sidebar */}
            <div className={`settings-panel ${isSettingsOpen ? 'visible' : ''}`} style={{ background: 'rgba(2, 6, 23, 0.98)' }}>
                <div className="settings-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
                        <Settings size={18} /> Terminal Configuration
                    </h3>
                    <button className="close-settings" onClick={() => setIsSettingsOpen(false)}><X /></button>
                </div>
                <div className="settings-group">
                    <label>Environment Theme</label>
                    <select 
                        value={settings.theme} 
                        onChange={(e) => applySettings({ ...settings, theme: e.target.value })}
                    >
                        <option value="default">VTerm Protocol (Default)</option>
                        <option value="matrix">Matrix Override</option>
                        <option value="dracula">Neon Night</option>
                        <option value="solarized">High Contrast</option>
                    </select>
                </div>
                <div className="settings-group">
                    <label>Buffer Font Size ({settings.fontSize}px)</label>
                    <input 
                        type="range" 
                        min="10" max="24" 
                        value={settings.fontSize} 
                        onChange={(e) => applySettings({ ...settings, fontSize: parseInt(e.target.value) })}
                        style={{ accentColor: 'var(--accent)' }}
                    />
                </div>
                <div className="settings-group">
                    <label>Interface Transparency</label>
                    <input 
                        type="range" 
                        min="50" max="100" 
                        value={settings.opacity} 
                        onChange={(e) => applySettings({ ...settings, opacity: parseInt(e.target.value) })}
                        style={{ accentColor: 'var(--accent)' }}
                    />
                </div>
                <div className="settings-footer">
                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsSettingsOpen(false)}>
                        Synchronize Settings
                    </button>
                </div>
            </div>

            <div id="overlay" style={{ 
                height: '48px',
                background: `rgba(2, 6, 23, ${settings.opacity / 100})`,
                borderBottom: '1px solid var(--border)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="header" style={{ height: '100%', padding: '0 20px' }}>
                    <div className="tabs" style={{ height: '100%', alignItems: 'center' }}>
                        <div className="tab active" style={{ 
                            background: 'rgba(56, 189, 248, 0.1)', 
                            border: '1px solid var(--accent)',
                            borderRadius: '6px',
                            height: '32px',
                            color: 'white'
                        }}>
                            <TerminalIcon size={14} style={{ marginRight: '8px' }} /> 
                            <span className="mono" style={{ fontSize: '12px' }}>root@vterm:~</span>
                        </div>
                        <button 
                            className="header-btn" 
                            style={{ marginLeft: '12px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px' }}
                            onClick={() => window.open(window.location.href, '_blank')}
                        >
                            <TerminalIcon size={16} />
                        </button>
                    </div>
                    <div className="title-container">
                        <div className="title" style={{ marginRight: '24px', letterSpacing: '1px' }}>
                            NODE: <span style={{ color: 'var(--accent)' }}>{mode.toUpperCase()}</span>
                        </div>
                        <button className="header-btn" onClick={() => setIsSettingsOpen(true)} title="Settings">
                            <Settings size={18} />
                        </button>
                        <button className="header-btn logout-btn" onClick={handleLogout} title="Logout" style={{ marginLeft: '16px' }}>
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
