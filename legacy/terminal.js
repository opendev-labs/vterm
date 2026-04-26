// Initialize Socket.io with dynamic targeting
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode') || 'cloud';
const target = urlParams.get('target');

let socket;

async function initTerminal() {
    // Session check for Cloud mode
    if (mode === 'cloud') {
        try {
            const res = await fetch('/api/session');
            const data = await res.json();
            if (!data.authenticated) {
                window.location.href = '/login.html';
                return;
            }
        } catch (e) {
            console.error("Auth check failed:", e);
            window.location.href = '/login.html';
            return;
        }
    }

    // Connect socket based on mode
    if (mode === 'local' && target) {
        console.log('Connecting to Local Bridge:', target);
        socket = io(target, { 
            transports: ['websocket'],
            upgrade: false
        });
    } else {
        console.log('Connecting to VTerm Cloud...');
        socket = io({
            transports: ['websocket'],
            upgrade: false
        });
    }

    setupSocketHandlers();
    initVFX();
    loadSettings();
}

// --- Settings Logic ---
let currentSettings = {
    theme: 'default',
    fontSize: 15,
    opacity: 80
};

const THEMES = {
    default: { background: 'transparent', foreground: '#f1f5f9' },
    matrix: { background: 'rgba(0, 20, 0, 0.8)', foreground: '#00ff00', cursor: '#00ff00' },
    dracula: { background: 'rgba(40, 42, 54, 0.8)', foreground: '#f8f8f2', cursor: '#bd93f9' },
    solarized: { background: 'rgba(253, 246, 227, 0.8)', foreground: '#657b83', cursor: '#268bd2' }
};

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('visible');
}

function applySettings() {
    currentSettings.theme = document.getElementById('setting-theme').value;
    currentSettings.fontSize = parseInt(document.getElementById('setting-font-size').value);
    currentSettings.opacity = parseInt(document.getElementById('setting-opacity').value);

    document.getElementById('font-size-val').innerText = currentSettings.fontSize;

    // Apply to Terminal
    if (term) {
        term.options.fontSize = currentSettings.fontSize;
        const theme = THEMES[currentSettings.theme] || THEMES.default;
        term.options.theme = { ...term.options.theme, ...theme };
        fitAddon.fit();
    }

    // Apply UI Opacity
    document.getElementById('overlay').style.background = `rgba(30, 41, 59, ${currentSettings.opacity / 100})`;
}

function saveSettings() {
    localStorage.setItem('vterm_settings', JSON.stringify(currentSettings));
    toggleSettings();
}

function loadSettings() {
    const saved = localStorage.getItem('vterm_settings');
    if (saved) {
        currentSettings = JSON.parse(saved);
        document.getElementById('setting-theme').value = currentSettings.theme;
        document.getElementById('setting-font-size').value = currentSettings.fontSize;
        document.getElementById('setting-opacity').value = currentSettings.opacity;
        applySettings();
    }
}

function setupSocketHandlers() {
    if (!socket) return;

// Initialize Xterm.js
// Note: Global names depend on the CDN version. Typically they are on the window object.
const Terminal = window.Terminal;
const FitAddon = window.FitAddon.FitAddon;

const term = new Terminal({
    cursorBlink: true,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 15,
    lineHeight: 1.2,
    theme: {
        background: 'transparent',
        foreground: '#f1f5f9',
        cursor: '#3b82f6',
        selection: 'rgba(59, 130, 246, 0.3)',
        black: '#0f172a',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#f1f5f9',
        brightBlack: '#475569',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff'
    },
    allowTransparency: true
});

const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

// Open terminal in container
term.open(document.getElementById('terminal-container'));

// Function to handle resizing
function resizeTerminal() {
    fitAddon.fit();
    socket.emit('resize', { cols: term.cols, rows: term.rows });
}

// Initial fit
setTimeout(resizeTerminal, 100);

// Handle window resizing
window.addEventListener('resize', resizeTerminal);

    // Frontend -> Backend
    term.onData(data => {
        socket.emit('input', data);
    });

    // Backend -> Frontend
    socket.on('output', data => {
        term.write(data);
    });

    // Connection status
    socket.on('connect', () => {
        console.log('Connected to terminal engine.');
        resizeTerminal();
    });

    socket.on('disconnect', () => {
        term.write('\r\n\x1b[1;31m[System] Disconnected from shell engine.\x1b[0m\r\n');
    });

    socket.on('connect_error', (err) => {
        term.write(`\r\n\x1b[1;31m[Error] Failed to connect: ${err.message}\x1b[0m\r\n`);
        if (mode === 'local') {
            term.write('\x1b[1;33m[Tip] Ensure your local VTerm backend is running on port 4000.\x1b[0m\r\n');
        }
    });
}

// Focus terminal on click
document.body.addEventListener('click', () => {
    if (term) term.focus();
});

// Start the app
initTerminal();
