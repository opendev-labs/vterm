#!/usr/bin/env node

/**
 * VTerm Lightning Bridge
 * Use this to quickly start a local terminal instance.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const os = require('os');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = 4000;

console.log(`
\x1b[1;34m📟 VTerm Lightning Bridge — Initializing...\x1b[0m
---------------------------------------------
`);

io.on('connection', (socket) => {
    const shell = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : 'bash');
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME || process.cwd(),
        env: process.env
    });

    ptyProcess.onData((data) => socket.emit('output', data));
    socket.on('input', (data) => ptyProcess.write(data));
    socket.on('resize', (size) => ptyProcess.resize(size.cols, size.rows));

    socket.on('disconnect', () => ptyProcess.kill());
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`
\x1b[1;32m✅ Bridge is LIVE and Accelerated!\x1b[0m
---------------------------------------------
Target: \x1b[1;36mhttp://localhost:${PORT}\x1b[0m
Cloud UI: \x1b[1;35mhttps://vterm.onrender.com\x1b[0m

\x1b[1;33mAction:\x1b[0m Open the Cloud UI, select "Local Bridge", 
and connect to the target above.
---------------------------------------------
    `);
});
