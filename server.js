const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 4000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('User connected to terminal session:', socket.id);

    // Spawn a real shell for this session
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });

    // Send shell data to client
    ptyProcess.on('data', (data) => {
        socket.emit('output', data);
    });

    // Receive input from client
    socket.on('input', (data) => {
        ptyProcess.write(data);
    });

    // Handle terminal resize
    socket.on('resize', ({ cols, rows }) => {
        ptyProcess.resize(cols, rows);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected. Killing shell.');
        ptyProcess.kill();
    });
});

server.listen(PORT, () => {
    console.log(`
📟 Browser Terminal is LIVE!
---------------------------------------------
Local URL: http://localhost:${PORT}
---------------------------------------------
Open this URL in multiple tabs for multiple 
independent terminal sessions.
    `);
});
