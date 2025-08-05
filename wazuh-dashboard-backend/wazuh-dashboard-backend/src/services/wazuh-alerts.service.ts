import https from 'https';

class WazuhAlertsService {
  private baseUrl = 'https://100.66.240.63:55000';
  private token: string | null = null;

  async authenticate() {
    try {
      const response = await this.makeRequest('/security/user/authenticate', 'GET', {
        'Authorization': 'Basic ' + Buffer.from('wazuh:wazuh').toString('base64')
      });
      
      if (response.data && response.data.token) {
        this.token = response.data.token;
        console.log('✅ Wazuh API authenticated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Wazuh API authentication failed:', error.message);
      return false;
    }
  }

  async getRecentAlerts(limit = 50) {
    try {
      if (!this.token) {
        await this.authenticate();
      }

      // Get recent events from Wazuh API
      const response = await this.makeRequest('/events', 'GET', {
        'Authorization': `Bearer ${this.token}`
      });

      if (response.data && response.data.affected_items) {
        const alerts = response.data.affected_items.slice(0, limit).map((event: any, index: number) => ({
          id: `wazuh-${event.id || index}`,
          timestamp: event.timestamp || new Date().toISOString(),
          index: `wazuh-alerts-4.x-${new Date().toISOString().split('T')[0]}`,
          agentId: event.agent_id || '000',
          agentName: event.agent_name || 'wazuh-server',
          agentIp: event.agent_ip || '100.108.179.83',
          ruleId: event.rule_id || '1001',
          ruleDescription: event.rule_description || event.description || 'Wazuh server event',
          ruleLevel: event.rule_level || 2,
          ruleGroups: event.rule_groups || ['wazuh'],
          ruleFiredtimes: event.rule_firedtimes || 1,
          decoderName: event.decoder_name || 'wazuh',
          location: event.location || '/var/log/wazuh.log',
          managerName: 'wazuh-server',
          inputType: 'log',
          fullLog: event.full_log || `[${event.timestamp}] ${event.description || 'Wazuh event'}`
        }));

        console.log(`✅ Fetched ${alerts.length} real Wazuh alerts`);
        return alerts;
      }

      return [];
    } catch (error) {
      console.error('❌ Failed to fetch Wazuh alerts:', error.message);
      return [];
    }
  }

  private makeRequest(endpoint: string, method: string, headers: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '100.66.240.63',
        port: 55000,
        path: endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        rejectUnauthorized: false
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
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
      
      req.end();
    });
  }
}

export default new WazuhAlertsService();