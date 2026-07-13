const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const { seedData } = require('./seedData');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'cine_uneti';

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    for (const [collectionName, documents] of Object.entries(seedData)) {
      const collection = db.collection(collectionName);
      await collection.deleteMany({});
      const result = await collection.insertMany(documents);
      console.log(`  ✓ ${collectionName}: ${result.insertedCount} documentos insertados`);
    }

    console.log(`\nBase de datos "${dbName}" poblada correctamente.`);
    console.log('Colecciones: peliculas, directores, generos, actores, resenas');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed, seedData };
