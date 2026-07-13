const { pingDB } = require('../config/db');

async function requireMongo(_req, res, next) {
  const alive = await pingDB();
  if (!alive) {
    return res.status(503).json({
      error: 'mongodb_unavailable',
      message: 'Please start Mongo DB',
    });
  }
  next();
}

module.exports = { requireMongo };
