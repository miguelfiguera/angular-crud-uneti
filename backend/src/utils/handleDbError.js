const { isMongoError } = require('../config/db');

function handleDbError(error, res) {
  if (isMongoError(error)) {
    return res.status(503).json({
      error: 'mongodb_unavailable',
      message: 'Please start Mongo DB',
    });
  }
  return res.status(500).json({ error: error.message });
}

module.exports = { handleDbError };
