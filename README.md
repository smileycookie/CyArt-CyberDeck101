"# CyArt-CyberDeck" 
Project Name

Log and Data Monitoring System

Requirements:
Ability to collect and aggregate logs from various systems connected to a central server.
Display logs and security events at both the server level and for individual systems.
Integration with multiple SIEM tools, with the project initially using Wazuh.
📖 Overview This project consists of a backend and frontend system for [brief purpose: e.g., Log Analysis and Security Monitoring using Wazuh].

There are two setup guides included in the repository:

Agent Setup Guide (Requirements.txt) – How to install Tailscale and connect to the Wazuh server.

Project Installation Guide (README.md)– How to unzip files, install dependencies, and run the backend/frontend.

🚀 Quick Start<<<<<

Agent Setup
Follow Agent Setup Guide to:

Install Tailscale Connect to the Wazuh server

Backend Setup
Unzip the backend folder. Open a terminal inside the src folder.

Install dependencies:

npm install

Start the backend:

node server-minimal.js

Frontend Setup
Unzip the frontend folder. Open a terminal in the frontend directory.

Install dependencies:

npm install

Run the frontend:

npm run dev

🛠 Requirements <<<<<

Node.js & npm

Tailscale account

Access to Wazuh server

📂 Repository Structure

├── Requirements.txt # Tailscale & Wazuh connection guide

├── Readme.txt # Detailed backend/frontend setup steps

├── frontend/

└── backend/
