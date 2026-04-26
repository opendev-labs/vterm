#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

console.log(`
\x1b[1;36m📟 VTerm CLI — Professional Bridge
---------------------------------------------\x1b[0m
`);

function startServer() {
    // Automation: Check if port 4000 is in use
    try {
        const stdout = execSync('lsof -i :4000 -t').toString().trim();
        if (stdout) {
            console.log(`\x1b[1;33m[Auto] Port 4000 is in use by PID ${stdout}. Clearing port...\x1b[0m`);
            execSync(`kill -9 ${stdout}`);
        }
    } catch (e) {
        // Port is free or lsof failed, ignore
    }

    // Automation: Check if dist exists
    if (!fs.existsSync(path.join(rootDir, 'dist'))) {
        console.log('\x1b[1;33m[Auto] React build missing. Building app now...\x1b[0m');
        execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
    }

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
        if (code !== 0 && code !== null) {
            console.log(`\x1b[1;31m[Process] VTerm exited with error code ${code}\x1b[0m`);
        }
    });
}

// Automation: Check for node_modules
if (!fs.existsSync(path.join(rootDir, 'node_modules'))) {
    console.log('\x1b[1;33m[Auto] Dependencies missing. Installing now...\x1b[0m');
    try {
        execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
        console.log('\x1b[1;32m[Auto] Installation successful.\x1b[0m');
        startServer();
    } catch (e) {
        console.error('\x1b[1;31m[Auto] Installation failed. Please run "npm install" manually.\x1b[0m');
    }
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
