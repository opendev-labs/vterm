# 📟 VTerm — The Enterprise Virtual Terminal Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Production Ready](https://img.shields.io/badge/Status-Production--Ready-success.svg)](https://vterm.onrender.com)
[![Xterm.js](https://img.shields.io/badge/Engine-Xterm.js%20v5-000000.svg)](https://xtermjs.org/)

**VTerm** is the industry-standard, high-performance virtual terminal engine designed for modern engineering teams. It bridges the gap between local power and cloud accessibility, offering a zero-latency Linux shell experience directly in any web browser.

---

## 🚀 Key Features

*   **Real Shell Integration**: Powered by `node-pty`, connecting you to actual `bash` sessions.
*   **Industry-Standard Rendering**: Uses **Xterm.js** for GPU-accelerated terminal rendering.
*   **Multi-Tab Metaphor**: Independent terminal sessions per browser tab. Just click **+** to scale.
*   **Professional Aesthetic**: Deep dark theme, **JetBrains Mono** typography, and refined glassmorphism.
*   **Local Bridge Mode**: Use the VTerm UI (hosted on Render) to securely connect to a terminal instance running on your own local machine.

---

## 🔗 Local Bridge (Use VTerm UI with your Local Machine)

VTerm allows you to use its professional UI to access your local machine's terminal without complex SSH setups.

1.  **Run VTerm Locally**:
    ```bash
    git clone https://github.com/opendev-labs/vterm.git
    cd vterm && npm install && npm start
    ```
2.  **Open VTerm Cloud**: Visit `https://vterm.onrender.com`.
3.  **Select Local Bridge**: In the login screen, choose **Local Bridge**.
4.  **Connect**: Ensure the URL is `http://localhost:4000` and click **Connect**.
5.  **Result**: You are now controlling your local machine via the premium VTerm interface!

---

## 🚀 Deployment (High-Performance Cloud)

### Deploy to Render.com:
VTerm is optimized for [Render](https://render.com) using Docker for maximum performance and security.

1.  **Push Latest Changes**:
    ```bash
    git add .
    git commit -m "🚀 Finalize performance optimizations"
    git push origin main
    ```
2.  **Create Web Service**:
    - Connect your GitHub repository.
    - Ensure the **Environment** is set to `Docker`.
    - Render will automatically use the `Dockerfile` and `render.yaml`.

**Live Terminal Instance**: `https://vterm.onrender.com`

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
