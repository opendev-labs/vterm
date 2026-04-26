import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Cpu, Terminal, BookOpen, ChevronRight } from 'lucide-react';

const Docs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="docs-page">
            <div className="docs-container">
                <header className="docs-header">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="badge" style={{ marginBottom: '16px' }}>Technical Specs</div>
                        <h1>Documentation</h1>
                        <p style={{ fontSize: '20px', color: 'var(--text-muted)', maxWidth: '600px' }}>
                            Everything you need to deploy, configure, and master VTerm in your professional environment.
                        </p>
                    </motion.div>
                </header>

                <section className="docs-section">
                    <h2><Rocket /> Quick Start</h2>
                    <p>Deploy VTerm locally in seconds using Node.js. Minimum requirements: Node 16+ and NPM 7+.</p>
                    <div className="code-block">
                        <pre><code>{`# Clone the repository
git clone https://github.com/opendev-labs/vterm.git

# Enter the directory
cd vterm

# Install dependencies
npm install

# Start the engine
npm start`}</code></pre>
                    </div>
                </section>

                <section className="docs-section">
                    <h2><Cpu /> Local Bridge</h2>
                    <p>The Local Bridge is a game-changer. It allows you to use the premium VTerm Cloud UI while controlling your local hardware via a secure WebSocket tunnel.</p>
                    <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '24px', borderRadius: '16px', borderLeft: '4px solid var(--accent)' }}>
                        <ol style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)' }}>
                            <li style={{ marginBottom: '12px' }}>Start VTerm on your machine (default port 4000).</li>
                            <li style={{ marginBottom: '12px' }}>Go to the Login screen and select <strong>Local Bridge</strong>.</li>
                            <li style={{ marginBottom: '12px' }}>Enter your local IP or <code>localhost</code> and connect instantly.</li>
                        </ol>
                    </div>
                </section>

                <section className="docs-section">
                    <h2><Terminal /> Configuration</h2>
                    <p>Customize the engine behavior using environment variables.</p>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '24px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                                    <th style={{ padding: '16px' }}>Variable</th>
                                    <th style={{ padding: '16px' }}>Description</th>
                                    <th style={{ padding: '16px' }}>Default</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px' }}><code className="mono">PORT</code></td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>Server listening port</td>
                                    <td style={{ padding: '16px' }}>4000</td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px' }}><code className="mono">ADMIN_PASSWORD</code></td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>Access key for Cloud Mode</td>
                                    <td style={{ padding: '16px' }}>vterm123</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};


export default Docs;
