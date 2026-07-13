const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectDB, isDBConnected, pingDB } = require('./config/db');
const { createCrudRouter, ALLOWED_COLLECTIONS } = require('./routes/crudRouter');
const { requireMongo } = require('./middleware/requireMongo');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  const alive = await pingDB();
  if (alive) {
    return res.json({ status: 'ok', message: 'API Cine UNETI funcionando', mongodb: true });
  }
  return res.status(503).json({
    status: 'degraded',
    message: 'Please start Mongo DB',
    mongodb: false,
  });
});

app.get('/api/colecciones', requireMongo, (_req, res) => {
  res.json({ colecciones: ALLOWED_COLLECTIONS });
});

app.use('/api', requireMongo, createCrudRouter());

async function start() {
  try {
    await connectDB();
  } catch (error) {
    console.warn('MongoDB no disponible:', error.message);
    console.warn('El servidor iniciará. Inicia MongoDB y recarga la aplicación.');
  }

  app.listen(PORT, () => {
    console.log(`Servidor API en http://localhost:${PORT}`);
    if (isDBConnected()) {
      console.log(`Colecciones: ${ALLOWED_COLLECTIONS.join(', ')}`);
    } else {
      console.log('Esperando conexión a MongoDB...');
    }
  });
}

start();
