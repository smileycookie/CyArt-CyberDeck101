# CyArt-CyberDeck

![Static Badge](https://img.shields.io/badge/Status-Completed%20-blue)

A robust **Log and Data Monitoring System** designed for seamless security oversight.

---

## 📖 Overview

CyArt-CyberDeck is a powerful solution for collecting, aggregating, and monitoring logs and security events from multiple systems.  
It provides real-time insights at both the **server** and **individual system** levels.  
While it supports multiple SIEM integrations, this project is initially configured to work with **Wazuh**.

This repository includes two main setup guides:

1. **Agent Setup Guide** (`Requirements.txt`) – How to install Tailscale and connect to the Wazuh server.  
2. **Project Installation Guide** (`README.md`) – How to unzip files, install dependencies, and run the backend/frontend.

---

## 🚀 Quick Start

### 🔹 Agent Setup
Follow the **Agent Setup Guide** to:

- Install **Tailscale**
- Connect the agent machine to the **Wazuh server**

---

### 🔹 Backend Setup
1. Unzip the `backend` folder.  
2. Open a terminal inside the `src` folder.  
3. Install dependencies:
   ```bash
   npm install

Setp 4: Start the backend:
```bash
node server-minimal.js
```
🔹 Frontend Setup
1. Unzip the frontend folder
2. Open a terminal in the frontend directory.
3. Clean old dependencies:
```bash
   rm -rf node_modules package-lock.json .next
```
4. Install dependencies:
```bash
   npm install
```
5. Run the frontend:
```bash
npm run dev
```
📂 Repository Structure
```bash
├── Requirements.txt       # Tailscale & Wazuh connection guide
├── README.md              # Project overview & backend/frontend setup
├── frontend/              # Frontend application
└── backend/               # Backend application
```






