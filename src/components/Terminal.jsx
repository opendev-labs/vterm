import React, { useEffect, useRef, useState } from 'react';
import { Terminal as Xterm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
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
        // Initialize Xterm.js
        const term = new Xterm({
            cursorBlink: true,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: settings.fontSize || 15,
            theme: THEMES[settings.theme] || THEMES.default,
            allowTransparency: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Initialize Socket.io
        const socketUrl = (mode === 'local' && target) ? target : window.location.origin;
        const socket = io(socketUrl, {
            transports: ['websocket'],
            upgrade: false
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to terminal engine.');
            fitAddon.fit();
            socket.emit('resize', { cols: term.cols, rows: term.rows });
        });

        socket.on('output', (data) => {
            term.write(data);
        });

        socket.on('connect_error', (err) => {
            term.write(`\r\n\x1b[1;31m[Error] Failed to connect: ${err.message}\x1b[0m\r\n`);
        });

        term.onData((data) => {
            socket.emit('input', data);
        });

        const handleResize = () => {
            fitAddon.fit();
            socket.emit('resize', { cols: term.cols, rows: term.rows });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            term.dispose();
        };
    }, [mode, target]); // Re-connect only if mode/target change

    // Handle settings updates without re-mounting
    useEffect(() => {
        if (xtermRef.current) {
            xtermRef.current.options.fontSize = settings.fontSize;
            const theme = THEMES[settings.theme] || THEMES.default;
            xtermRef.current.options.theme = { ...xtermRef.current.options.theme, ...theme };
            if (fitAddonRef.current) fitAddonRef.current.fit();
        }
    }, [settings]);

    return (
        <div 
            ref={terminalRef} 
            style={{ 
                position: 'absolute', 
                top: '44px', 
                left: 0, 
                right: 0, 
                bottom: 0, 
                padding: '12px',
                background: '#000'
            }} 
        />
    );
};

export default Terminal;
