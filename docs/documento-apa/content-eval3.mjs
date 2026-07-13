/**
 * Contenido de la Evaluación 3 — Bases de Datos (documento puntual de entrega).
 * Conserva las cinco capturas del borrador original (mongosh / yarn mongo-test)
 * y añade el enlace del repositorio, las instrucciones del README y los
 * comandos para visualizar el clúster y las colecciones.
 */

export const portada = {
  titulo: 'EVALUACIÓN 3 — BASES DE DATOS',
  subtitulo: 'Proyecto: Cine UNETI — Sistema CRUD con Angular, Node.js y MongoDB',
  asignatura: 'Asignatura: Informática — Bases de Datos',
  autor: 'Miguel Figuera',
  cedula: 'C.I.: 23.558.789',
  lugarFecha: 'La Victoria, julio, 2026',
};

/**
 * Secciones del documento. Bloques admitidos:
 *  { tipo: 'p', texto }
 *  { tipo: 'codigo', titulo, codigo }
 *  { tipo: 'captura', archivo }   — imagen de assets/eval3/ (pie en `capturas`)
 *  { tipo: 'lista', items }       — lista con viñetas
 */
export const secciones = [
  {
    titulo: '1. Enlace del Repositorio de GitHub',
    bloques: [
      {
        tipo: 'p',
        texto:
          'El código fuente completo del proyecto se encuentra publicado en GitHub con visibilidad pública, de modo que puede consultarse y clonarse sin autenticación. El repositorio contiene el backend Node.js con Express, el frontend Angular, los scripts de poblado de la base de datos y el archivo README.md con la documentación de ejecución.',
      },
      {
        tipo: 'codigo',
        titulo: 'Repositorio público',
        codigo: `https://github.com/miguelfiguera/angular-crud-uneti
Visibilidad: público  ·  Rama principal: main`,
      },
    ],
  },
  {
    titulo: '2. Descripción del Proyecto',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Cine UNETI es un sistema CRUD full-stack para la gestión de un catálogo de películas. La interfaz fue construida con Angular 19 y Tailwind CSS; la API REST con Node.js y Express; y la persistencia con MongoDB, en la base de datos cine_uneti, que contiene cinco colecciones con al menos cuatro campos cada una: peliculas (título, año, género, duración y calificación), directores, generos, actores y resenas. Desde la interfaz es posible añadir películas a la lista, consultarlas, eliminarlas y ejecutar una consulta sencilla por género que se resuelve directamente en MongoDB.',
      },
    ],
  },
  {
    titulo: '3. Instrucciones de Ejecución (README.md)',
    bloques: [
      {
        tipo: 'p',
        texto:
          'El README.md del repositorio documenta la descripción del proyecto y el procedimiento completo de puesta en marcha: clonación del repositorio, configuración de las variables de entorno, instalación de dependencias (que ejecuta automáticamente el seed de la base de datos) y arranque simultáneo de la API y del frontend. El proyecto usa Yarn como gestor de paquetes; los comandos npm install y npm start equivalen a yarn install y yarn start.',
      },
      {
        tipo: 'codigo',
        titulo: 'Puesta en marcha del proyecto',
        codigo: `# 1. Clonar el repositorio
git clone https://github.com/miguelfiguera/angular-crud-uneti.git
cd angular-crud-uneti

# 2. Configurar variables de entorno
cp .env.example .env
#    MONGODB_URI=mongodb://localhost:27017
#    MONGODB_DB=cine_uneti
#    PORT=3000

# 3. Instalar dependencias (ejecuta el seed automáticamente)
yarn install        # equivalente: npm install

# 4. Iniciar API (localhost:3000) y frontend (localhost:4200)
yarn start          # equivalente: npm start

# Poblar la base de datos manualmente si hiciera falta
yarn seed`,
      },
    ],
  },
  {
    titulo: '4. Comandos para Visualizar el Clúster y las Colecciones',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Para tomar las capturas exigidas por la evaluación —donde se vean la conexión y las cinco colecciones— pueden usarse dos vías. La primera es MongoDB Compass (o la vista Collections del clúster en Atlas): basta con conectarse con la cadena de conexión y abrir la base de datos cine_uneti, donde las cinco colecciones aparecen en el panel izquierdo con sus documentos.',
      },
      {
        tipo: 'codigo',
        titulo: 'Conexión en MongoDB Compass / Atlas',
        codigo: `# Cadena de conexión local (Compass → New Connection)
mongodb://localhost:27017

# Con MongoDB Atlas, usar la URI del clúster:
mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net

# Luego: base de datos cine_uneti → se listan las 5 colecciones
# (peliculas, directores, generos, actores, resenas)`,
      },
      {
        tipo: 'p',
        texto:
          'La segunda vía es la terminal con mongosh, que fue la utilizada en este trabajo. Los siguientes comandos muestran la conexión activa, el nombre de la base de datos, la lista de colecciones, el conteo de documentos por colección y las estadísticas generales.',
      },
      {
        tipo: 'codigo',
        titulo: 'Comandos de verificación en mongosh',
        codigo: `mongosh "mongodb://localhost:27017/cine_uneti"

db.getMongo()             // conexión activa al clúster
db.getName()              // → cine_uneti
db.getCollectionNames()   // → las 5 colecciones
db.getCollectionInfos()   // detalle de cada colección
db.peliculas.countDocuments()
db.peliculas.find()       // documentos de la colección
db.stats()                // resumen: 5 colecciones, objetos, tamaños

// Conteo de todas las colecciones en una sola línea:
mongosh cine_uneti --quiet --eval "
  print('Base de datos: ' + db.getName());
  db.getCollectionNames().forEach(c =>
    print(c + ': ' + db[c].countDocuments() + ' documentos'));"`,
      },
      {
        tipo: 'p',
        texto:
          'Todo lo anterior quedó automatizado en el script scripts/mongo-test.sh del repositorio, registrado como yarn mongo-test, que ejecuta en secuencia los comandos nativos de mongosh sobre las cinco colecciones e imprime cada comando junto a su salida. Las capturas de la sección siguiente corresponden a esa ejecución.',
      },
      {
        tipo: 'codigo',
        titulo: 'Script del repositorio',
        codigo: `yarn mongo-test     # ejecuta bash scripts/mongo-test.sh

# El script recorre las 5 colecciones y ejecuta:
#   db.getMongo(), db.getName(), db.getCollectionNames(),
#   db.getCollectionInfos(), countDocuments(), findOne(),
#   find() y db.stats()`,
      },
    ],
  },
  {
    titulo: '5. Capturas de MongoDB — Conexión y Colecciones',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Las siguientes capturas de pantalla evidencian la conexión al servidor de MongoDB y la existencia de las cinco colecciones con sus documentos, con la salida nativa de mongosh generada por yarn mongo-test.',
      },
      { tipo: 'captura', archivo: 'image1.png' },
      { tipo: 'captura', archivo: 'image2.png' },
      { tipo: 'captura', archivo: 'image3.png' },
      { tipo: 'captura', archivo: 'image4.png' },
      { tipo: 'captura', archivo: 'image5.png' },
    ],
  },
  {
    titulo: '6. Colecciones Verificadas',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La verificación con mongosh confirmó la base de datos cine_uneti con sus cinco colecciones pobladas y los siguientes conteos de documentos al momento de la captura:',
      },
      {
        tipo: 'lista',
        items: [
          'peliculas — 23 documentos',
          'directores — 7 documentos',
          'generos — 6 documentos',
          'actores — 5 documentos',
          'resenas — 8 documentos',
        ],
      },
    ],
  },
  {
    titulo: '7. Ponderación',
    bloques: [
      {
        tipo: 'p',
        texto:
          'Esta entrega corresponde al 40% de la calificación final de la asignatura, equivalente a 8 puntos. La rúbrica de evaluación se encuentra disponible en la plataforma Unetieduca.',
      },
    ],
  },
];

/** Pies de figura de las capturas (assets/eval3/). */
export const capturas = {
  'image1.png': {
    descripcion:
      'Conteo de documentos de las cinco colecciones de cine_uneti con mongosh --eval en una sola línea.',
    width: 894,
    height: 175,
  },
  'image2.png': {
    descripcion:
      'Ejecución de yarn mongo-test: conexión con db.getMongo(), base de datos activa con db.getName() y colecciones con db.getCollectionNames() y db.getCollectionInfos().',
    width: 1125,
    height: 1057,
  },
  'image3.png': {
    descripcion:
      'Información detallada de las colecciones con db.getCollectionInfos().',
    width: 1278,
    height: 1058,
  },
  'image4.png': {
    descripcion:
      'Conteo y documentos de las colecciones (countDocuments, findOne y find).',
    width: 982,
    height: 876,
  },
  'image5.png': {
    descripcion:
      'Resumen db.stats() de cine_uneti: 5 colecciones y 49 objetos, cierre de yarn mongo-test.',
    width: 454,
    height: 278,
  },
};

/** Índice del documento (páginas verificadas sobre el PDF generado). */
export const indice = [
  { label: '1. Enlace del Repositorio de GitHub', page: 3 },
  { label: '2. Descripción del Proyecto', page: 3 },
  { label: '3. Instrucciones de Ejecución (README.md)', page: 3 },
  { label: '4. Comandos para Visualizar el Clúster y las Colecciones', page: 4 },
  { label: '5. Capturas de MongoDB — Conexión y Colecciones', page: 5 },
  { label: '6. Colecciones Verificadas', page: 9 },
  { label: '7. Ponderación', page: 9 },
];
