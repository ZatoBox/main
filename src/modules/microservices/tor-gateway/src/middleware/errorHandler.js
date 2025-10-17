const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  res.status(500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { errorHandler };
