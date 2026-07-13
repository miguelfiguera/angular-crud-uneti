const { MongoClient } = require('mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'cine_uneti';

let client;
let db;
let isConnected = false;

async function connectDB() {
  if (isConnected && db) return db;

  client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
  await client.connect();
  await client.db(dbName).command({ ping: 1 });
  db = client.db(dbName);
  isConnected = true;
  console.log(`Conectado a MongoDB: ${dbName}`);
  return db;
}

function getDB() {
  if (!isConnected || !db) {
    throw new Error('MongoDB no conectada');
  }
  return db;
}

function isDBConnected() {
  return isConnected && db !== null;
}

async function pingDB() {
  if (!isConnected || !db) return false;
  try {
    await db.command({ ping: 1 });
    return true;
  } catch {
    isConnected = false;
    db = null;
    if (client) {
      try {
        await client.close();
      } catch {
        /* ignore */
      }
      client = null;
    }
    return false;
  }
}

function isMongoError(error) {
  if (!error) return false;
  const msg = `${error.message || ''} ${error.name || ''}`;
  return /Mongo|ECONNREFUSED|ENOTFOUND|network/i.test(msg);
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    isConnected = false;
  }
}

module.exports = { connectDB, getDB, closeDB, isDBConnected, pingDB, isMongoError, dbName };
