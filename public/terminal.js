// Initialize Socket.io
const socket = io();

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

// Focus terminal on click
document.body.addEventListener('click', () => {
    term.focus();
});
