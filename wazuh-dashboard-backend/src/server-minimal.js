require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios');
const https = require('https');
const app = express();
const server = http.createServer(app);
app.use(cors({ origin: "*" }));
app.use(express.json());
const io = new Server(server, { cors: { origin: "*" } });
const WAZUH_API = 'https://100.66.240.63:55000';
const auth = { username: 'wazuh-wui', password: 'wazuh-wui' };
let token = null;
let cachedAgents = [];
let cachedLogs = [];
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});
async function getToken() {
  try {
    const response = await axiosInstance.post(`${WAZUH_API}/security/user/authenticate`, {}, { auth });
    token = response.data.data.token;
    console.log('Token refreshed');
  } catch (error) {
    console.error('Auth failed:', error.message);
  }
}
async function fetchAllAgents() {
  try {
    if (!token) await getToken();
    const response = await axiosInstance.get(`${WAZUH_API}/agents?pretty=true&limit=1000`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    cachedAgents = response.data.data.affected_items;
    return cachedAgents;
  } catch (error) {
    console.error('Fetch agents failed:', error.message);
    return cachedAgents;
  }
}
async function fetchLogs() {
  try {
    // Try Elasticsearch first
    const response = await axiosInstance.get('https://100.66.240.63:9200/wazuh-alerts-*/_search', {
      auth: { username: 'admin', password: 'admin' },
      params: { size: 50, sort: '@timestamp:desc' }
    });
    const hits = response.data.hits.hits;
    const logs = hits.map(hit => ({
      id: hit._id,
      timestamp: hit._source['@timestamp'],
      level: hit._source.rule?.level >= 7 ? 'HIGH' : 'MEDIUM',
      message: hit._source.rule?.description || 'Security alert',
      agentName: hit._source.agent?.name || 'wazuh-server',
      agentId: hit._source.agent?.id || '000',
      agentIp: hit._source.agent?.ip || 'N/A',
      location: hit._source.location || 'unknown',
      ruleId: hit._source.rule?.id || 'N/A',
      decoder: hit._source.decoder?.name || 'wazuh',
      full_log: hit._source.full_log || '',
      manager: hit._source.manager?.name || 'wazuh-server',
      input_type: hit._source.input?.type || 'log',
      rule_level: hit._source.rule?.level,
      rule_groups: hit._source.rule?.groups || [],
      rule_description: hit._source.rule?.description
    }));
    cachedLogs = logs;
    return logs;
  } catch (error) {
    // Return sample logs if Elasticsearch fails
    if (cachedLogs.length > 0) return cachedLogs;
    return [
      {
        id: 'sample-1',
        timestamp: new Date().toISOString(),
        level: 'HIGH',
        message: 'SSH authentication failure',
        agentName: 'web-server-01',
        agentId: '001',
        agentIp: '192.168.1.10',
        location: '/var/log/auth.log',
        ruleId: '5710',
        decoder: 'sshd',
        full_log: 'Failed password for invalid user admin',
        manager: 'wazuh-server',
        input_type: 'log',
        rule_level: 5,
        rule_groups: ['authentication_failed', 'sshd'],
        rule_description: 'SSH authentication failure'
      }
    ];
  }
}
io.on('connection', async (socket) => {
  console.log('Client connected');
  const agents = await fetchAllAgents();
  const logs = await fetchLogs();
  socket.emit('agents:initial', agents);
  socket.emit('logs:initial', logs);
  const interval = setInterval(async () => {
    const updatedAgents = await fetchAllAgents();
    const updatedLogs = await fetchLogs();
    socket.emit('agents:update', updatedAgents);
    socket.emit('logs:update', updatedLogs);
  }, 30000);
  socket.on('disconnect', () => clearInterval(interval));
});
// Essential API endpoints
app.post("/api/field-click", (req, res) => {
  const { field, data, timestamp, agentCount } = req.body;
  console.log(`:mag: FIELD CLICKED: ${field.toUpperCase()}`);
  console.log(`:alarm_clock: Timestamp: ${timestamp}`);
  console.log(`:busts_in_silhouette: Agent Count: ${agentCount}`);
  res.json({ success: true });
});
app.post("/api/agent/restart", async (req, res) => {
  const { agentId } = req.body;
  try {
    if (!token) await getToken();
    await axiosInstance.put(`${WAZUH_API}/agents/restart`, {
      agents_list: [agentId]
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    res.json({ success: true, message: "Agent restart initiated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
setInterval(getToken, 14 * 60 * 1000);
server.listen(3000, '0.0.0.0', async () => {
  console.log('Minimal Wazuh backend running on port 3000');
  getToken();
});
