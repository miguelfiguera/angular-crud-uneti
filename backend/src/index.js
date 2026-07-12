const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectDB } = require('./config/db');
const { createCrudRouter, ALLOWED_COLLECTIONS } = require('./routes/crudRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API Cine UNETI funcionando' });
});

app.get('/api/colecciones', (_req, res) => {
  res.json({ colecciones: ALLOWED_COLLECTIONS });
});

app.use('/api', createCrudRouter());

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor API en http://localhost:${PORT}`);
      console.log(`Colecciones: ${ALLOWED_COLLECTIONS.join(', ')}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
}

start();
