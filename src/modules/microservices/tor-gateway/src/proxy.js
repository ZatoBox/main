const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');

const btcpayProxy = async (req, res, next) => {
  try {
    const btcpayUrl = process.env.BTCPAY_URL;
    const btcpayApiKey = process.env.BTCPAY_API_KEY;

    if (!btcpayUrl || !btcpayApiKey) {
      return res.status(500).json({ error: 'BTCPay configuration missing' });
    }

    const path = req.params.path || '';
    const targetUrl = `${btcpayUrl.replace(/\/$/, '')}/api/v1/${path}`;

    const socksHost = process.env.SOCKS_HOST || '127.0.0.1';
    const socksPort = process.env.SOCKS_PORT || '9050';
    const socksAgent = new SocksProxyAgent(
      `socks5://${socksHost}:${socksPort}`
    );

    const config = {
      method: req.method.toLowerCase(),
      url: targetUrl,
      httpAgent: socksAgent,
      httpsAgent: socksAgent,
      headers: {
        Authorization: `token ${btcpayApiKey}`,
        'Content-Type': 'application/json',
        ...req.headers,
      },
      validateStatus: () => true,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      config.data = req.body;
    }

    if (req.query && Object.keys(req.query).length > 0) {
      config.params = req.query;
    }

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
};

module.exports = { btcpayProxy };
