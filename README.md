# 📟 VTerm — Virtual Terminal (Pro Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Xterm.js](https://img.shields.io/badge/Terminal-Xterm.js-000000.svg)](https://xtermjs.org/)

**VTerm** is a high-performance, real-time virtual terminal engine that brings a full Linux/Unix shell directly into your web browser. Built for speed and reliability, it spawns real PTY (Pseudo-Terminal) sessions to enable `vim`, `htop`, `git`, and other terminal-bound applications.

---

## 🚀 Key Features

*   **Real Shell Integration**: Powered by `node-pty`, connecting you to actual `bash` sessions.
*   **Industry-Standard Rendering**: Uses **Xterm.js** for GPU-accelerated terminal rendering.
*   **Multi-Tab Metaphor**: Independent terminal sessions per browser tab. Just click **+** to scale.
*   **Professional Aesthetic**: Deep dark theme, **JetBrains Mono** typography, and refined glassmorphism.

---

## 🚀 Deployment (100% FREE, No Credit Card)

### Deploy to Render.com:
1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Update for VTerm rebranding"
    git push origin main
    ```
2.  **Sign up on [Render.com](https://render.com)** using your GitHub account.
3.  **Create New Web Service**:
    - Connect the `vterm` repository.
    - Set **Environment** to `Docker`.
    - Choose **Free Plan**.

**Your live terminal will be at**: `https://vterm.onrender.com`

---

## 💻 Local Installation

```bash
git clone https://github.com/opendev-labs/vterm.git
cd vterm
npm install
npm start
```

---

## 🧪 Validation & Testing

Run the automated diagnostic suite:
```bash
npm run validate
```

---

## 📄 License

MIT © [opendev-labs](https://github.com/opendev-labs)
