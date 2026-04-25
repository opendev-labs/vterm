# 📟 WebTerm — Browser Terminal (Pro Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Xterm.js](https://img.shields.io/badge/Terminal-Xterm.js-000000.svg)](https://xtermjs.org/)

**WebTerm** is a high-performance, real-time terminal engine that brings a full Linux/Unix shell directly into your web browser. This isn't just an emulator—it spawns real PTY (Pseudo-Terminal) sessions on the host machine, enabling you to run `vim`, `htop`, `git`, and any other command-line application with perfect fidelity.

---

## 🚀 Key Features

*   **Real Shell Integration**: Powered by `node-pty`, connecting you to actual `bash`, `zsh`, or `powershell` sessions.
*   **Industry-Standard Rendering**: Uses **Xterm.js** for high-performance, GPU-accelerated terminal rendering.
*   **Multi-Tab Metaphor**: Independent terminal sessions per browser tab. Just click **+** to scale your workflow.
*   **State-of-the-Art Aesthetic**: Deep dark theme, **JetBrains Mono** typography, and a refined glassmorphism header.
*   **Responsive Resizing**: Seamlessly fits any window size with automatic PTY column/row synchronization.

---

## 📦 Architecture & Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Xterm.js | Terminal rendering & Input handling |
| **Backend** | Node.js + Express | Web server & API provider |
| **Real-time** | Socket.io | Bi-directional PTY data streaming |
| **Engine** | node-pty | Native shell bindings & PTY management |

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18.x or higher)
- **Build Tools** (for `node-pty` native bindings)
  - *Linux*: `python3`, `make`, `g++`
  - *macOS*: Xcode Command Line Tools
  - *Windows*: Visual Studio Build Tools

### Quick Start
```bash
# Clone the repository
git clone https://github.com/opendev-labs/webterm.git

# Navigate to project
cd webterm

# Install dependencies
npm install

# Start the engine
npm start
```

---

## 🌐 Usage Guide

1.  Start the server using `npm start`.
2.  Open your browser to `http://localhost:4000`.
3.  Click the **+** icon in the header to open multiple independent terminal sessions.
4.  Run any shell command. Everything you can do in your local terminal, you can do here.

---

## 🧪 Validation & Testing

Run the automated diagnostic suite to verify connection and shell logic:

```bash
npm run validate
```

---

## 🐳 Docker Support

Deploy instantly using Docker:

```bash
docker build -t webterm .
docker run -p 4000:4000 webterm
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support the Project

If you find this project useful, consider giving it a star on GitHub!

---
Developed with ❤️ by **[opendev-labs](https://github.com/opendev-labs)**
