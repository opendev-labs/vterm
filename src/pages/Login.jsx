import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cloud, Network, Lock, ArrowRight, Bolt, Terminal as TerminalIcon } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [mode, setMode] = useState('cloud');
    const [password, setPassword] = useState('');
    const [localUrl, setLocalUrl] = useState('http://localhost:4000');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (data.success) {
                onLogin();
                navigate('/app?mode=cloud');
            } else {
                setError('Invalid password. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Is the server running?');
        }
    };

    const handleLocalConnect = () => {
        navigate(`/app?mode=local&target=${encodeURIComponent(localUrl)}`);
    };

    return (
        <div className="login-page">
            <motion.div 
                className="login-card"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ position: 'relative', zIndex: 10 }}
            >
                <div className="logo" style={{ justifyContent: 'center', marginBottom: '32px' }}>
                    <TerminalIcon size={48} color="var(--accent)" />
                </div>
                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Identity Required</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Choose your connection mode to proceed.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                    <div 
                        onClick={() => setMode('cloud')}
                        style={{ 
                            padding: '24px', 
                            borderRadius: '16px', 
                            border: '1px solid',
                            borderColor: mode === 'cloud' ? 'var(--accent)' : 'var(--border)',
                            background: mode === 'cloud' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <Cloud color={mode === 'cloud' ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: '12px' }} />
                        <div style={{ fontSize: '14px', fontWeight: 600, color: mode === 'cloud' ? 'white' : 'var(--text-muted)' }}>Cloud</div>
                    </div>
                    <div 
                        onClick={() => setMode('local')}
                        style={{ 
                            padding: '24px', 
                            borderRadius: '16px', 
                            border: '1px solid',
                            borderColor: mode === 'local' ? 'var(--accent)' : 'var(--border)',
                            background: mode === 'local' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <Network color={mode === 'local' ? 'var(--accent)' : 'var(--text-muted)'} style={{ marginBottom: '12px' }} />
                        <div style={{ fontSize: '14px', fontWeight: 600, color: mode === 'local' ? 'white' : 'var(--text-muted)' }}>Local</div>
                    </div>
                </div>

                {mode === 'cloud' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <input 
                            className="input-field"
                            type="password" 
                            placeholder="Terminal Key" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        {error && <div style={{ color: 'var(--error)', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}
                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogin}>
                            Connect to Terminal <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <input 
                            className="input-field"
                            type="text" 
                            value={localUrl}
                            onChange={(e) => setLocalUrl(e.target.value)}
                            placeholder="Local Bridge URL"
                        />
                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLocalConnect}>
                            Bridge Connection <Bolt size={18} style={{ marginLeft: '10px' }} />
                        </button>
                    </motion.div>
                )}

                <div style={{ marginTop: '48px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Authorized personnel only.
                </div>
            </motion.div>

            {/* Full-page background image for login */}
            <div className="login-background-container" style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                <img 
                    src="/hero-bg-new.png" 
                    alt="Background" 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        opacity: 0.6,
                        filter: 'brightness(0.5)'
                    }} 
                />
                <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'radial-gradient(circle at center, transparent, var(--bg-dark) 90%)' 
                }}></div>
            </div>
        </div>
    );
};


export default Login;
