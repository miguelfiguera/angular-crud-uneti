const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'cine_uneti';

const seedData = {
  peliculas: [
    { titulo: 'El Padrino', anio: 1972, genero: 'Drama', duracionMinutos: 175, calificacion: 9.2 },
    { titulo: 'Pulp Fiction', anio: 1994, genero: 'Crimen', duracionMinutos: 154, calificacion: 8.9 },
    { titulo: 'El Señor de los Anillos', anio: 2001, genero: 'Fantasía', duracionMinutos: 178, calificacion: 8.8 },
    { titulo: 'Matrix', anio: 1999, genero: 'Ciencia Ficción', duracionMinutos: 136, calificacion: 8.7 },
    { titulo: 'Parásitos', anio: 2019, genero: 'Drama', duracionMinutos: 132, calificacion: 8.6 },
  ],
  directores: [
    { nombre: 'Francis Ford Coppola', nacionalidad: 'Estados Unidos', peliculasDirigidas: 37, premiosOscar: 5 },
    { nombre: 'Quentin Tarantino', nacionalidad: 'Estados Unidos', peliculasDirigidas: 10, premiosOscar: 2 },
    { nombre: 'Peter Jackson', nacionalidad: 'Nueva Zelanda', peliculasDirigidas: 14, premiosOscar: 3 },
    { nombre: 'Lana Wachowski', nacionalidad: 'Estados Unidos', peliculasDirigidas: 8, premiosOscar: 0 },
    { nombre: 'Bong Joon-ho', nacionalidad: 'Corea del Sur', peliculasDirigidas: 7, premiosOscar: 4 },
  ],
  generos: [
    { nombre: 'Drama', descripcion: 'Historias centradas en conflictos emocionales', popularidad: 95, colorHex: '#6366f1' },
    { nombre: 'Acción', descripcion: 'Escenas dinámicas y secuencias de riesgo', popularidad: 88, colorHex: '#ef4444' },
    { nombre: 'Comedia', descripcion: 'Entretenimiento ligero con humor', popularidad: 82, colorHex: '#f59e0b' },
    { nombre: 'Ciencia Ficción', descripcion: 'Tecnología avanzada y mundos futuristas', popularidad: 79, colorHex: '#06b6d4' },
    { nombre: 'Terror', descripcion: 'Suspenso y miedo como elementos centrales', popularidad: 71, colorHex: '#8b5cf6' },
  ],
  actores: [
    { nombre: 'Marlon Brando', edad: 80, nacionalidad: 'Estados Unidos', peliculasDestacadas: 45 },
    { nombre: 'John Travolta', edad: 70, nacionalidad: 'Estados Unidos', peliculasDestacadas: 68 },
    { nombre: 'Elijah Wood', edad: 43, nacionalidad: 'Estados Unidos', peliculasDestacadas: 32 },
    { nombre: 'Keanu Reeves', edad: 60, nacionalidad: 'Canadá', peliculasDestacadas: 58 },
    { nombre: 'Song Kang-ho', edad: 58, nacionalidad: 'Corea del Sur', peliculasDestacadas: 28 },
  ],
  resenas: [
    { pelicula: 'El Padrino', autor: 'Ana García', calificacion: 10, comentario: 'Obra maestra del cine clásico' },
    { pelicula: 'Pulp Fiction', autor: 'Carlos Ruiz', calificacion: 9, comentario: 'Narrativa no lineal brillante' },
    { pelicula: 'Matrix', autor: 'Laura Méndez', calificacion: 9, comentario: 'Revolucionó los efectos visuales' },
    { pelicula: 'Parásitos', autor: 'Miguel Torres', calificacion: 10, comentario: 'Crítica social impecable' },
    { pelicula: 'El Señor de los Anillos', autor: 'Sofía López', calificacion: 9, comentario: 'Adaptación fiel y épica' },
  ],
};

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
