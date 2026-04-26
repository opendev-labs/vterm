#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

console.log(`
\x1b[1;36m📟 VTerm Professional Bridge CLI
\x1b[1;34m---------------------------------------------\x1b[0m
`);

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: 
  vterm          Start the local bridge engine
  vterm --stop   Stop any running VTerm bridge
  vterm --help   Show this help message

Environment:
  PORT           Change the bridge port (default: 4000)
    `);
    process.exit(0);
}

if (args.includes('--stop')) {
    const port = process.env.PORT || 4000;
    try {
        const stdout = execSync(`lsof -i :${port} -t`).toString().trim();
        if (stdout) {
            console.log(`\x1b[1;33m[Stop] Stopping VTerm process (PID ${stdout})...\x1b[0m`);
            execSync(`kill -9 ${stdout}`);
            console.log(`\x1b[1;32m[Stop] Successfully stopped.\x1b[0m`);
        } else {
            console.log(`\x1b[1;34m[Stop] No VTerm bridge found on port ${port}.\x1b[0m`);
        }
    } catch (e) {
        console.log(`\x1b[1;34m[Stop] No active VTerm bridge detected.\x1b[0m`);
    }
    process.exit(0);
}

function startServer() {
    const port = process.env.PORT || 4000;
    
    // Check if port is in use
    try {
        const stdout = execSync(`lsof -i :${port} -t`).toString().trim();
        if (stdout) {
            console.log(`\x1b[1;33m[Bridge] Port ${port} is occupied. Replacing session...\x1b[0m`);
            execSync(`kill -9 ${stdout}`);
        }
    } catch (e) {
        // Port free
    }

    // Ensure build exists
    if (!fs.existsSync(path.join(rootDir, 'dist'))) {
        console.log('\x1b[1;33m[Bridge] First-time setup: Building local assets...\x1b[0m');
        execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
    }

    console.log(`\x1b[1;32m🚀 VTerm Local Engine is initializing on port ${port}...\x1b[0m`);
    
    const server = spawn('node', ['server.js'], {
        cwd: rootDir,
        stdio: 'inherit',
        env: {
            ...process.env,
            NODE_ENV: 'production',
            PORT: port
        }
    });

    server.on('error', (err) => {
        console.error('\x1b[1;31m[Critical] Engine failed to start:\x1b[0m', err.message);
    });

    console.log(`
\x1b[1;35m🔗 Connection Ready
\x1b[1;34m---------------------------------------------
\x1b[0m1. Open: \x1b[1;36mhttps://vterm.onrender.com\x1b[0m
2. Select: \x1b[1;33mLocal Mode\x1b[0m
3. Endpoint: \x1b[1;32mhttp://localhost:${port}\x1b[0m
4. Action: Click \x1b[1;35mBridge Connection\x1b[0m
\x1b[1;34m---------------------------------------------
\x1b[0m\x1b[2mKeep this terminal window open to maintain the bridge.
Press Ctrl+C to disconnect.\x1b[0m
    `);
}

// Check dependencies
if (!fs.existsSync(path.join(rootDir, 'node_modules'))) {
    console.log('\x1b[1;33m[Bridge] Node modules missing. Synchronizing environment...\x1b[0m');
    try {
        execSync('npm install --legacy-peer-deps', { cwd: rootDir, stdio: 'inherit' });
        startServer();
    } catch (e) {
        console.error('\x1b[1;31m[Bridge] Sync failed. Run "npm install" manually.\x1b[0m');
    }
} else {
    startServer();
}
