#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

console.log(`
\x1b[1;36m📟 VTerm CLI — Professional Bridge
---------------------------------------------\x1b[0m
`);

function startServer() {
    console.log('\x1b[1;32m🚀 Starting VTerm Local Engine...\x1b[0m');
    
    const server = spawn('node', ['server.js'], {
        cwd: rootDir,
        stdio: 'inherit',
        env: {
            ...process.env,
            NODE_ENV: 'production',
            PORT: 4000
        }
    });

    server.on('error', (err) => {
        console.error('\x1b[1;31m[Error] Failed to start server:\x1b[0m', err.message);
    });

    server.on('close', (code) => {
        console.log(`\x1b[1;33m[Process] VTerm exited with code ${code}\x1b[0m`);
    });
}

// Automation: Check for node_modules
if (!fs.existsSync(path.join(rootDir, 'node_modules'))) {
    console.log('\x1b[1;33m[Auto] Dependencies missing. Installing now...\x1b[0m');
    const install = spawn('npm', ['install'], { cwd: rootDir, stdio: 'inherit' });
    
    install.on('close', (code) => {
        if (code === 0) {
            console.log('\x1b[1;32m[Auto] Installation successful.\x1b[0m');
            startServer();
        } else {
            console.error('\x1b[1;31m[Auto] Installation failed. Please run "npm install" manually.\x1b[0m');
        }
    });
} else {
    startServer();
}

console.log(`
\x1b[1;35m🔗 Bridge Information
---------------------------------------------
To connect from vterm.onrender.com:
1. Go to the Login page.
2. Select "Local" mode.
3. Use the URL: http://localhost:4000
4. Click "Bridge Connection".
---------------------------------------------\x1b[0m
`);
