const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'cine_uneti';

let client;
let db;

async function connectDB() {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`Conectado a MongoDB: ${dbName}`);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Base de datos no conectada. Llama a connectDB() primero.');
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = { connectDB, getDB, closeDB, dbName };
