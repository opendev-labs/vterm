const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 4000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('User connected to terminal session:', socket.id);

    // Spawn a real shell for this session
    const shell = process.env.SHELL || (os.platform() === 'win32' ? 'powershell.exe' : 'bash');
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME || process.cwd(),
        env: process.env
    });

    // Send shell data to client
    // Support both .on('data') and .onData()
    if (typeof ptyProcess.onData === 'function') {
        ptyProcess.onData((data) => socket.emit('output', data));
    } else {
        ptyProcess.on('data', (data) => socket.emit('output', data));
    }

    // Receive input from client
    socket.on('input', (data) => {
        ptyProcess.write(data);
    });

    // Handle terminal resize
    socket.on('resize', (size) => {
        const { cols, rows } = size || { cols: 80, rows: 30 };
        ptyProcess.resize(cols, rows);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected. Killing shell.');
        try {
            ptyProcess.kill();
        } catch (e) {
            console.error('Error killing process:', e);
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 WebTerm is LIVE!
---------------------------------------------
Environment: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
---------------------------------------------
Open this URL in multiple tabs for multiple 
independent terminal sessions.
    `);
});
