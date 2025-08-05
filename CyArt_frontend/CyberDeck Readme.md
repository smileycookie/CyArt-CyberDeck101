\# CyArt Dashboard - Setup Instructions

\## 📁 Frontend Configuration

1\. Open the terminal and navigate to the frontend directory:

=\> cd CyArt_frontend/frontend.

2\. Remove the existing node_modules folder (optional but recommended if
reinstalling):

=\> rm -rf node_modules

3\. Install the required dependencies:

=\> npm install

🔧 Backend Configuration

1\. Open the terminal and navigate to the backend directory:

=\> cd Wazuh-dashboard-backend/src

🚀 Running the Application

1\. Start the Backend In the Wazuh-dashboard-backend/src directory, run:

=\> node server-minimal.js

2\. Start the Frontend In a new terminal window/tab, navigate to the
CyArt_frontend/frontend directory and run:

=\> npm run dev

3\. Open the Dashboard After running the frontend, the terminal will
show local and network URLs (http://0.0.0.0:3002,
http://localhost:3002).

=\> Copy and paste the URL into your browser to open the CyArt
dashboard.

Notes: \> Ensure Node.js is installed on your system. \> For best
results, use modern browsers like Chrome or Firefox.
