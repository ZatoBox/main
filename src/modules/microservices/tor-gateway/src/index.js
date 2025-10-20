require('dotenv').config();
const express = require('express');
const { btcpayProxy } = require('./proxy');
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(logger);

app.all('/api/btcpay/:path(*)', btcpayProxy);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Gateway on port ${PORT}`);
});
