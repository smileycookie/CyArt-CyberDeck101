# CyArt-CyberDeck

![Static Badge](https://img.shields.io/badge/Status-Completed%20-blue)

A robust **Log and Data Monitoring System** designed for seamless security oversight.

---

## 📖 Project Overview

CyArt-CyberDeck is a powerful solution for collecting, aggregating, and monitoring logs and security events from multiple systems. It provides real-time insights at both the server and individual system levels. While built for flexible integration, this project is specifically configured to work with **Wazuh** as its primary SIEM tool.

This repository is your complete guide, with two key sections:

-   **Agent Setup**: Instructions for connecting systems to the central Wazuh server.
-   **Project Installation**: A step-by-step guide to get the backend and frontend up and running.

---

## 🚀 Quick Start

Follow these simple steps to get the CyArt-CyberDeck system running on your machine.

### Agent Setup

Before you begin, ensure your agents are properly configured using the `Requirements.txt` guide.

1.  Install **Tailscale** on your systems.
2.  Connect to your **Wazuh server**.

### Backend Setup

1.  Unzip the `backend` folder.
2.  Navigate to the `src` directory in your terminal.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Launch the backend server:
    ```bash
    node server-minimal.js
    ```

### Frontend Setup

1.  Unzip the `frontend` folder and open it in your terminal.
2.  *Optional but recommended*: Clear any old dependencies.
    ```bash
    rm -rf node_modules package-lock.json .next
    ```
3.  Install the required dependencies:
    ```bash
    npm install
    ```
4.  Start the frontend application:
    ```bash
    npm run dev
    ```

---

## 🛠️ Requirements

To run this project, you will need:

-   **Node.js & npm**: For managing dependencies and running the applications.
-   **Tailscale account**: To establish a secure network connection.
-   **Wazuh server**: The central hub for log and data analysis.

---

## 📂 Repository Structure

The project is organized as follows:

```plaintext
📂 Project Root
├── 📄 Requirements.txt   # 📡 Tailscale & Wazuh connection guide
├── 📄 Readme.txt         # 📜 Detailed backend/frontend setup steps
├── 📁 frontend/          # 🎨 Frontend source code
└── 📁 backend/           # ⚙️ Backend source code
