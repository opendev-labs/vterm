# 📟 WebTerm — Browser Terminal (Pro Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Xterm.js](https://img.shields.io/badge/Terminal-Xterm.js-000000.svg)](https://xtermjs.org/)

**WebTerm** is a high-performance, real-time terminal engine that brings a full Linux/Unix shell directly into your web browser. Unlike serverless platforms (like Vercel), WebTerm uses persistent PTY sessions to enable `vim`, `htop`, `git`, and real-time streaming.

---

## 🚀 Key Features

*   **Real Shell Integration**: Powered by `node-pty`, connecting you to actual `bash` sessions.
*   **Industry-Standard Rendering**: Uses **Xterm.js** for high-performance rendering.
*   **Multi-Tab Architecture**: Independent terminal sessions per browser tab.
*   **State-of-the-Art Aesthetic**: Deep dark theme, **JetBrains Mono** typography.

---

## 🚀 Deployment (100% FREE, No Credit Card)

WebTerm requires a persistent environment (VM/Container) to run `node-pty`. **Render.com** is the recommended free provider.

### Deploy to Render.com:
1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Optimize for Render deployment"
    git push origin main
    ```
2.  **Sign up on [Render.com](https://render.com)** using your GitHub account.
3.  **Create New Web Service**:
    - Dashboard → **New +** → **Web Service**.
    - Connect the `webterm` repository.
4.  **Configuration**:
    - **Name**: `webterm`
    - **Environment**: `Docker`
    - **Plan**: `Free`
5.  **Create**: Click **Create Web Service**.

**Your live terminal will be at**: `https://webterm.onrender.com`

---

## 💻 Local Installation

```bash
git clone https://github.com/opendev-labs/webterm.git
cd webterm
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
