const express = require('express');
const cors = require('cors');
const https = require('https');
const app = express();
app.use(cors());
app.use(express.json());
// OpenSearch connection
async function getWazuhAlerts(limit = 50) {
  return new Promise((resolve, reject) => {
    const searchQuery = {
      "query": { "match_all": {} },
      "size": limit,
      "sort": [{ "@timestamp": { "order": "desc" } }]
    };
    const options = {
      hostname: '100.66.240.63',
      port: 9200,
      path: '/wazuh-alerts-4.x-*/_search',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('admin:admin').toString('base64'),
        'Content-Type': 'application/json'
      },
      rejectUnauthorized: false
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.hits && jsonData.hits.hits) {
            const alerts = jsonData.hits.hits.map((hit) => {
              const source = hit._source;
              return {
                id: `real-${hit._id}`,
                timestamp: source['@timestamp'],
                index: hit._index,
                agentId: source.agent?.id || '000',
                agentName: source.agent?.name || 'unknown',
                agentIp: source.agent?.ip || 'unknown',
                ruleId: source.rule?.id || '0000',
                ruleDescription: source.rule?.description || 'Unknown rule',
                ruleLevel: source.rule?.level || 1,
                ruleGroups: source.rule?.groups || [],
                ruleFiredtimes: source.rule?.firedtimes || 1,
                decoderName: source.decoder?.name || 'wazuh',
                location: source.location || 'unknown',
                managerName: source.manager?.name || 'wazuh-server',
                inputType: source.input?.type || 'log',
                fullLog: source.data?.win?.system?.message || source.full_log || `Security event from ${source.agent?.name}`
              };
            });
            resolve(alerts);
          } else {
            resolve([]);
          }
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    req.on('error', (error) => reject(error));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(JSON.stringify(searchQuery));
    req.end();
  });
}
// API Routes
app.get('/api/elasticsearch/alerts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const alerts = await getWazuhAlerts(limit);
    console.log(`:white_check_mark: Served ${alerts.length} real Wazuh alerts`);
    res.json({
      success: true,
      data: alerts,
      message: `Retrieved ${alerts.length} real security alerts from OpenSearch`
    });
  } catch (error) {
    console.error(':x: Failed to fetch alerts:', error.message);
    res.json({
      success: false,
      data: [],
      message: 'Failed to fetch real alerts, using fallback'
    });
  }
});
app.post('/api/field-click', (req, res) => {
  console.log(':bar_chart: Field clicked:', req.body.field);
  res.json({ success: true });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`:rocket: Simple Wazuh API server running on port ${PORT}`);
  console.log(`:satellite_antenna: Connected to OpenSearch at 100.66.240.63:9200`);
});
