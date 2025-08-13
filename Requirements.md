# Agent Setup for Tailscale VPN and Wazuh Server Integration

This guide explains how to connect an agent machine to a **Tailscale VPN** and then link it to a **Wazuh server** for monitoring and management.

---

## 🛠️ Prerequisites

- A machine (agent) running a compatible Linux distribution (e.g., Debian/Ubuntu on ARM64)
- Access to the internet
- A valid **Tailscale Auth Key**
- Wazuh server with a static Tailscale IP

---

## 1️⃣ Connect the Agent to Tailscale VPN

Use the command below to install and authenticate Tailscale on your agent:


=> curl -fsSL https://tailscale.com/install.sh | sh && \
=> sudo tailscale up --auth-key=tskey-auth-k2ZVCQWNoQ11CNTRL-zdeevBjQwsUa6CWuCDhMtU7MLwYocmDxg

🔒 Note: Ensure your auth key is active and valid. Rotate it if necessary from your Tailscale dashboard.


2️⃣ Install and Connect Wazuh Agent

Run the following command to download and install the Wazuh Agent package, and automatically configure it to connect to the Wazuh Manager over Tailscale:

Step 2: Install and Configure Wazuh Agent

🔧 For Ubuntu / Kali Linux

=>  wget https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.12.0-1_arm64.deb
    sudo WAZUH_MANAGER='100.66.240.63' dpkg -i ./wazuh-agent_4.12.0-1_arm64.deb

=>  sudo systemctl daemon-reload
=>  sudo systemctl enable wazuh-agent
=>  sudo systemctl start wazuh-agent


🪟 For Windows

Run the following PowerShell command:


=>  Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-4.12.0-1.msi -OutFile $env:tmp \wazuh-agent
    msiexec.exe /i $env:tmp\wazuh-agent /q WAZUH_MANAGER='100.66.240.63'

=>  NET START WazuhSvc


🍎 For macOS

=>  curl -so wazuh-agent.pkg https://packages.wazuh.com/4.x/macos/wazuh-agent-4.12.0-1.intel64.pkg
    echo "WAZUH_MANAGER='100.66.240.63'" > /tmp/wazuh_envs
    sudo installer -pkg ./wazuh-agent.pkg -target /

=>  sudo /Library/Ossec/bin/wazuh-control start

✅ These command installs the agent and sets 100.66.240.63 (Wazuh Server's Tailscale IP) as the manager.


Step 3: Verify Connection to Wazuh Server

Open your browser and go to the following Tailscale IP address of the Wazuh server:

=>  https://100.66.240.63

✅ If successful, you should see the Wazuh dashboard/login screen.



Notes:

=> Make sure the machine running the Wazuh server is also connected to the same Tailscale network.

=> For help with Tailscale authentication or key renewal, refer to the Tailscale documentation.
