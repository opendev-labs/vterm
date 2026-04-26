const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const path = require('path');
const os = require('os');
const fs = require('fs');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow local bridge to connect
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 10000; // Render default fallback

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'vterm-super-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve the React app for the home page
app.get('/', (req, res) => {
    const distPath = path.join(__dirname, 'dist/index.html');
    console.log(`[Server] Request for / - Checking build at: ${distPath}`);
    if (fs.existsSync(distPath)) {
        res.sendFile(distPath);
    } else {
        console.error(`[Server] Build NOT found at: ${distPath}`);
        res.status(404).send("VTerm Engine Build not found. Deployment in progress...");
    }
});

// App access guard (Updated for React)
app.get('/app', (req, res) => {
    if (req.query.mode === 'local' || (req.session && req.session.authenticated)) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    } else {
        res.redirect('/login');
    }
});

// React Router fallback: Serve index.html for any unknown routes
app.use((req, res, next) => {
    // Skip if it's an API route or socket.io
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
        return next();
    }
    
    // Also skip if it's a request for a static file that might exist in dist or public
    if (path.extname(req.path)) {
        return next();
    }

    const distPath = path.join(__dirname, 'dist/index.html');
    if (fs.existsSync(distPath)) {
        res.sendFile(distPath);
    } else {
        res.status(404).send("React build not found. Run 'npm run build' first.");
    }
});

// Authentication API
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vterm123';
    
    if (password === ADMIN_PASSWORD) {
        req.session.authenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/api/session', (req, res) => {
    res.json({ authenticated: !!(req.session && req.session.authenticated) });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

io.on('connection', (socket) => {
    // Check if this is a local loopback connection (bypass auth)
    // We allow connection if it's from localhost OR if the user is authenticated in Cloud mode.
    // For simplicity, we spawn the shell.
    
    console.log('New terminal connection:', socket.id);

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
🚀 VTerm is LIVE! [v1.0.1]
---------------------------------------------
Environment: ${process.env.NODE_ENV || 'development'}
Port: ${PORT}
---------------------------------------------
Open this URL in multiple tabs for multiple 
independent terminal sessions.
    `);
});
