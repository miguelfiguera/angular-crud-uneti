# Pobla la base de datos MongoDB con las 5 colecciones del proyecto.
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

Write-Host "========================================"
Write-Host "  Seed MongoDB - Cine UNETI (Windows)"
Write-Host "========================================"

$MongoUri = if ($env:MONGODB_URI) { $env:MONGODB_URI } else { "mongodb://localhost:27017" }
$DbName = if ($env:MONGODB_DB) { $env:MONGODB_DB } else { "cine_uneti" }

$mongosh = Get-Command mongosh -ErrorAction SilentlyContinue
$mongo = Get-Command mongo -ErrorAction SilentlyContinue

if (-not $mongosh -and -not $mongo) {
    Write-Host "Advertencia: mongosh/mongo no encontrado. Usando seed de Node.js..."
    Set-Location $RootDir
    node backend/src/seed/seed.js
    exit 0
}

$MongoCmd = if ($mongosh) { "mongosh" } else { "mongo" }

Write-Host "Conectando a: $MongoUri / $DbName"

$js = @"
db.peliculas.deleteMany({});
db.directores.deleteMany({});
db.generos.deleteMany({});
db.actores.deleteMany({});
db.resenas.deleteMany({});

db.peliculas.insertMany([
  { titulo: 'El Padrino', anio: 1972, genero: 'Drama', duracionMinutos: 175, calificacion: 9.2 },
  { titulo: 'Pulp Fiction', anio: 1994, genero: 'Crimen', duracionMinutos: 154, calificacion: 8.9 },
  { titulo: 'El Señor de los Anillos', anio: 2001, genero: 'Fantasía', duracionMinutos: 178, calificacion: 8.8 },
  { titulo: 'Matrix', anio: 1999, genero: 'Ciencia Ficción', duracionMinutos: 136, calificacion: 8.7 },
  { titulo: 'Parásitos', anio: 2019, genero: 'Drama', duracionMinutos: 132, calificacion: 8.6 }
]);

db.directores.insertMany([
  { nombre: 'Francis Ford Coppola', nacionalidad: 'Estados Unidos', peliculasDirigidas: 37, premiosOscar: 5 },
  { nombre: 'Quentin Tarantino', nacionalidad: 'Estados Unidos', peliculasDirigidas: 10, premiosOscar: 2 },
  { nombre: 'Peter Jackson', nacionalidad: 'Nueva Zelanda', peliculasDirigidas: 14, premiosOscar: 3 },
  { nombre: 'Lana Wachowski', nacionalidad: 'Estados Unidos', peliculasDirigidas: 8, premiosOscar: 0 },
  { nombre: 'Bong Joon-ho', nacionalidad: 'Corea del Sur', peliculasDirigidas: 7, premiosOscar: 4 }
]);

db.generos.insertMany([
  { nombre: 'Drama', descripcion: 'Historias centradas en conflictos emocionales', popularidad: 95, colorHex: '#6366f1' },
  { nombre: 'Acción', descripcion: 'Escenas dinámicas y secuencias de riesgo', popularidad: 88, colorHex: '#ef4444' },
  { nombre: 'Comedia', descripcion: 'Entretenimiento ligero con humor', popularidad: 82, colorHex: '#f59e0b' },
  { nombre: 'Ciencia Ficción', descripcion: 'Tecnología avanzada y mundos futuristas', popularidad: 79, colorHex: '#06b6d4' },
  { nombre: 'Terror', descripcion: 'Suspenso y miedo como elementos centrales', popularidad: 71, colorHex: '#8b5cf6' }
]);

db.actores.insertMany([
  { nombre: 'Marlon Brando', edad: 80, nacionalidad: 'Estados Unidos', peliculasDestacadas: 45 },
  { nombre: 'John Travolta', edad: 70, nacionalidad: 'Estados Unidos', peliculasDestacadas: 68 },
  { nombre: 'Elijah Wood', edad: 43, nacionalidad: 'Estados Unidos', peliculasDestacadas: 32 },
  { nombre: 'Keanu Reeves', edad: 60, nacionalidad: 'Canadá', peliculasDestacadas: 58 },
  { nombre: 'Song Kang-ho', edad: 58, nacionalidad: 'Corea del Sur', peliculasDestacadas: 28 }
]);

db.resenas.insertMany([
  { pelicula: 'El Padrino', autor: 'Ana García', calificacion: 10, comentario: 'Obra maestra del cine clásico' },
  { pelicula: 'Pulp Fiction', autor: 'Carlos Ruiz', calificacion: 9, comentario: 'Narrativa no lineal brillante' },
  { pelicula: 'Matrix', autor: 'Laura Méndez', calificacion: 9, comentario: 'Revolucionó los efectos visuales' },
  { pelicula: 'Parásitos', autor: 'Miguel Torres', calificacion: 10, comentario: 'Crítica social impecable' },
  { pelicula: 'El Señor de los Anillos', autor: 'Sofía López', calificacion: 9, comentario: 'Adaptación fiel y épica' }
]);

print('Base de datos poblada: ' + db.getName());
print('Colecciones: ' + db.getCollectionNames().join(', '));
"@

$tempFile = [System.IO.Path]::GetTempFileName() + ".js"
Set-Content -Path $tempFile -Value $js -Encoding UTF8

try {
    & $MongoCmd "$MongoUri/$DbName" --file $tempFile
    Write-Host "Seed completado."
} finally {
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}
