import React, { useEffect, useRef, useState } from 'react';
import { Terminal as Xterm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';
import { CanvasAddon } from 'xterm-addon-canvas';
import { io } from 'socket.io-client';
import 'xterm/css/xterm.css';

const THEMES = {
    default: { background: 'transparent', foreground: '#f1f5f9' },
    matrix: { background: 'rgba(0, 20, 0, 0.8)', foreground: '#00ff00', cursor: '#00ff00' },
    dracula: { background: 'rgba(40, 42, 54, 0.8)', foreground: '#f8f8f2', cursor: '#bd93f9' },
    solarized: { background: 'rgba(253, 246, 227, 0.8)', foreground: '#657b83', cursor: '#268bd2' }
};

const Terminal = ({ mode, target, settings }) => {
    const terminalRef = useRef();
    const xtermRef = useRef();
    const socketRef = useRef();
    const fitAddonRef = useRef();

    useEffect(() => {
        const term = new Xterm({
            cursorBlink: true,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: settings.fontSize || 15,
            theme: THEMES[settings.theme] || THEMES.default,
            allowTransparency: true,
            scrollback: 5000
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        
        term.open(terminalRef.current);
        fitAddon.fit();

        try {
            const webglAddon = new WebglAddon();
            term.loadAddon(webglAddon);
        } catch (e) {
            try {
                term.loadAddon(new CanvasAddon());
            } catch (err) {}
        }

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        const socketUrl = (mode === 'local' && target) ? target : window.location.origin;
        const socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            fitAddon.fit();
            socket.emit('resize', { cols: term.cols, rows: term.rows });
        });

        socket.on('output', (data) => {
            term.write(data);
        });

        term.onData((data) => {
            socket.emit('input', data);
        });

        const handleResize = () => {
            if (fitAddonRef.current) {
                fitAddonRef.current.fit();
                socket.emit('resize', { cols: term.cols, rows: term.rows });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            term.dispose();
        };
    }, [mode, target]);

    useEffect(() => {
        if (xtermRef.current) {
            xtermRef.current.options.fontSize = settings.fontSize;
            const theme = THEMES[settings.theme] || THEMES.default;
            xtermRef.current.options.theme = { ...xtermRef.current.options.theme, ...theme };
            if (fitAddonRef.current) fitAddonRef.current.fit();
        }
    }, [settings]);

    return (
        <div ref={terminalRef} className="terminal-container" style={{ position: 'absolute', inset: 0, padding: '12px', background: '#000', overflow: 'hidden' }} />
    );
};

export default Terminal;
