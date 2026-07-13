/**
 * Contenido académico del documento explicativo sobre el proceso de
 * desarrollo del sistema CRUD de películas con Angular, Node.js y MongoDB.
 *
 * Cada etapa combina párrafos, fragmentos de código real del repositorio
 * y las capturas de pantalla de la carpeta Fotos/ que evidencian el proceso.
 */

export const portada = {
  titulo: 'SISTEMA CRUD DE PELÍCULAS CON ANGULAR, NODE.JS Y MONGODB',
  asignatura: 'Asignatura: Informática — Bases de Datos',
  autor: 'Miguel Figuera',
  cedula: 'C.I.: 23.558.789',
  lugarFecha: 'La Victoria, julio, 2026',
};

export const introduccion = [
  'El presente documento describe el proceso metodológico seguido para el desarrollo de un sistema de gestión de películas con operaciones CRUD (crear, leer, actualizar y eliminar), elaborado como evaluación del módulo Informática — Bases de Datos del Trayecto III de la Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI), extensión La Victoria. La aplicación integra tres capas tecnológicas claramente diferenciadas: una interfaz de usuario construida con Angular 19 y Tailwind CSS, una interfaz de programación de aplicaciones (API) REST desarrollada con Node.js y Express, y una base de datos documental MongoDB con cinco colecciones pobladas mediante scripts de inicialización.',
  'El trabajo se organizó en ocho etapas consecutivas, documentadas mediante doce capturas de pantalla tomadas durante las sesiones de desarrollo asistido en el editor Cursor. Estas evidencias registran el montaje del monorepo con espacios de trabajo de Yarn, la construcción del backend con su conexión a MongoDB y su enrutador CRUD genérico, la creación de scripts de poblado de datos para Linux y Windows, la implementación del frontend Angular con componentes reutilizables, la orquestación de la ejecución simultánea de ambos servidores, la publicación del código fuente en GitHub, la verificación integral del sistema con pruebas end-to-end de Playwright y, finalmente, la activación del modo oscuro como tema visual de la aplicación.',
  'Este documento se redacta siguiendo las normas de la American Psychological Association en su séptima edición, con la única excepción de que los párrafos del cuerpo se presentan justificados en lugar de alineados a la izquierda, conforme a los lineamientos internos de la asignatura. Cada etapa incluye los fragmentos de código fuente más representativos del repositorio, de modo que el lector pueda comprender tanto las decisiones técnicas tomadas como reproducir el procedimiento completo en un entorno propio.',
];

/**
 * Cada etapa contiene una lista ordenada de bloques:
 *  { tipo: 'p', texto }                     — párrafo del cuerpo
 *  { tipo: 'codigo', titulo, codigo }       — fragmento de código fuente
 *  { tipo: 'captura', archivo }             — captura de Fotos/ (pie de figura en `capturas`)
 */
export const etapas = [
  {
    numero: 1,
    titulo: 'Montaje del Monorepo y Configuración del Entorno',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La primera etapa consistió en verificar las herramientas del entorno de desarrollo y montar la estructura general del proyecto. Se comprobó la disponibilidad de Node.js v25.2.0 y Yarn 1.22.22 en el equipo de trabajo, y se constató que el espacio de trabajo se encontraba vacío. A partir de allí se definió el plan de construcción en cuatro frentes: un backend Node.js con Express y MongoDB con operaciones CRUD sobre cinco colecciones, un frontend Angular con Tailwind CSS y componentes de estilo shadcn/ui, scripts de poblado de datos (seed) para Linux y Windows, y un archivo README con las instrucciones de ejecución.',
      },
      {
        tipo: 'p',
        texto:
          'El andamiaje del frontend se generó con Angular CLI en su versión 19, mediante el comando npx @angular/cli@19 new frontend con las opciones --style=css, --routing=true, --ssr=false, --skip-git y --package-manager=yarn, lo que produjo una aplicación moderna basada en componentes standalone. Paralelamente se creó el archivo package.json de la raíz, que declara los espacios de trabajo (workspaces) backend y frontend de Yarn, y define los scripts de orquestación del proyecto completo.',
      },
      {
        tipo: 'codigo',
        titulo: 'package.json (raíz del monorepo)',
        codigo: `{
  "name": "cine-uneti",
  "version": "1.0.0",
  "private": true,
  "description": "Sistema CRUD de películas con Angular, Node.js y MongoDB",
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "install:all": "yarn install",
    "postinstall": "node scripts/run-seed.js",
    "start": "concurrently -n api,web -c blue,green \\
      \\"yarn workspace backend start\\" \\"yarn workspace frontend start\\"",
    "start:backend": "yarn workspace backend start",
    "start:frontend": "yarn workspace frontend start",
    "seed": "node scripts/run-seed.js"
  },
  "devDependencies": { "concurrently": "^9.1.2" },
  "engines": { "node": ">=18" }
}`,
      },
      {
        tipo: 'p',
        texto:
          'La configuración sensible se externalizó en variables de entorno. El archivo .env.example documenta los tres valores necesarios para ejecutar el sistema: la URI de conexión a MongoDB, el nombre de la base de datos y el puerto de la API. La figura 1 muestra este momento inicial del proceso: la verificación de versiones, la lista de tareas planificadas, la ejecución de Angular CLI y la edición de los package.json de la raíz y del backend.',
      },
      {
        tipo: 'codigo',
        titulo: '.env.example',
        codigo: `MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=cine_uneti
PORT=3000`,
      },
      { tipo: 'captura', archivo: '1.png' },
    ],
  },
  {
    numero: 2,
    titulo: 'Backend Node.js: Conexión a MongoDB, Seed y API CRUD',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La segunda etapa construyó la capa de datos y la API REST. El módulo backend/src/config/db.js encapsula la conexión a MongoDB con el patrón de instancia única: la función connectDB() abre el cliente una sola vez, verifica la disponibilidad del servidor con el comando ping y expone la base de datos mediante getDB(). Los valores de conexión provienen de las variables de entorno definidas en la etapa anterior, con valores por defecto para el entorno local.',
      },
      {
        tipo: 'codigo',
        titulo: 'backend/src/config/db.js (fragmento)',
        codigo: `const { MongoClient } = require('mongodb');

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
  console.log(\`Conectado a MongoDB: \${dbName}\`);
  return db;
}`,
      },
      {
        tipo: 'p',
        texto:
          'El poblado inicial de la base de datos se definió en backend/src/seed/seed.js, que inserta documentos en las cinco colecciones exigidas por la evaluación: peliculas (título, año, género, duración y calificación), directores, generos, actores y resenas, cada una con al menos cuatro campos y cinco documentos. El script elimina los datos previos con deleteMany y los reinserta con insertMany, de modo que la operación sea repetible sin duplicar registros.',
      },
      {
        tipo: 'p',
        texto:
          'La pieza central de la API es el enrutador CRUD genérico de backend/src/routes/crudRouter.js. En lugar de escribir cinco juegos de rutas casi idénticos, se definió un único conjunto de rutas parametrizado por el nombre de la colección. El método router.param valida que la colección solicitada pertenezca a la lista blanca ALLOWED_COLLECTIONS y rechaza cualquier otra con un error 400, lo que evita el acceso arbitrario a colecciones de la base de datos. Sobre esa base se implementaron las operaciones GET (listar y obtener por identificador), POST (crear), PUT (actualizar) y DELETE (eliminar), además de la consulta sencilla requerida: filtrar películas por género.',
      },
      {
        tipo: 'codigo',
        titulo: 'backend/src/routes/crudRouter.js (fragmento)',
        codigo: `const ALLOWED_COLLECTIONS =
  ['peliculas', 'directores', 'generos', 'actores', 'resenas'];

function createCrudRouter() {
  const router = express.Router({ mergeParams: true });

  router.param('collection', (req, res, next, collection) => {
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return res.status(400).json({
        error: \`Colección no permitida. Use: \${ALLOWED_COLLECTIONS.join(', ')}\`,
      });
    }
    req.collectionName = collection;
    next();
  });

  // READ - Consulta sencilla: películas por género
  router.get('/:collection/consulta/genero/:genero', async (req, res) => {
    const pattern = buildSpanishInsensitivePattern(req.params.genero);
    const docs = await getDB()
      .collection('peliculas')
      .find({ genero: { $regex: pattern, $options: 'i' } })
      .toArray();
    res.json({ genero: req.params.genero, total: docs.length, peliculas: docs });
  });

  // CREATE
  router.post('/:collection', async (req, res) => {
    const result = await getDB()
      .collection(req.collectionName)
      .insertOne(req.body);
    const created = await getDB()
      .collection(req.collectionName)
      .findOne({ _id: result.insertedId });
    res.status(201).json(created);
  });
  // ... GET por id, PUT y DELETE siguen el mismo patrón
  return router;
}`,
      },
      {
        tipo: 'p',
        texto:
          'Finalmente, backend/src/index.js integra las piezas: habilita CORS para permitir las peticiones desde el frontend en el puerto 4200, registra el middleware express.json() para interpretar cuerpos JSON, expone el punto de verificación /api/health y monta el enrutador CRUD bajo el prefijo /api. La figura 2 documenta la escritura de estos archivos durante la sesión de desarrollo.',
      },
      { tipo: 'captura', archivo: '2.png' },
    ],
  },
  {
    numero: 3,
    titulo: 'Scripts de Seed Multiplataforma e Integración de Tailwind CSS',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La tercera etapa resolvió dos necesidades de infraestructura. La primera fue garantizar que la base de datos pudiera poblarse en cualquier sistema operativo: se escribieron scripts/seed-db.sh para Linux y macOS (bash) y scripts/seed-db.ps1 para Windows (PowerShell), ambos con la misma lógica de localizar la raíz del proyecto y ejecutar el seed de Node.js. Sobre ellos se creó scripts/run-seed.js, un orquestador que detecta el sistema operativo en tiempo de ejecución, invoca el script correspondiente y, si este falla, recurre directamente al seed de Node.js como mecanismo de respaldo.',
      },
      {
        tipo: 'codigo',
        titulo: 'scripts/run-seed.js (fragmento)',
        codigo: `const rootDir = path.join(__dirname, '..');
const isWindows = process.platform === 'win32';

if (process.env.SKIP_SEED === '1') {
  console.log('SKIP_SEED=1 — seed omitido.\\n');
  process.exit(0);
}

if (isWindows) {
  const psScript = path.join(__dirname, 'seed-db.ps1');
  const result = spawnSync(
    'powershell',
    ['-ExecutionPolicy', 'Bypass', '-File', psScript],
    { cwd: rootDir, stdio: 'inherit' }
  );
  if (result.status !== 0) runNodeSeed();
} else {
  const shScript = path.join(__dirname, 'seed-db.sh');
  fs.chmodSync(shScript, '755');
  const result = spawnSync('bash', [shScript], { cwd: rootDir, stdio: 'inherit' });
  if (result.status !== 0) runNodeSeed();
}`,
      },
      {
        tipo: 'p',
        texto:
          'Este orquestador se registró como script postinstall del package.json raíz, de manera que al ejecutar yarn install la base de datos quede creada y poblada automáticamente con las cinco colecciones, sin pasos manuales adicionales. Si MongoDB no está activo en ese momento, el proceso lo advierte y continúa sin interrumpir la instalación; el usuario puede completar el poblado más tarde con yarn seed.',
      },
      {
        tipo: 'p',
        texto:
          'La segunda necesidad fue integrar Tailwind CSS en el proyecto Angular. Durante la instalación se detectó que Tailwind v4 cambió su modelo de configuración y presentaba fricciones con Angular 19, por lo que se tomó la decisión técnica de fijar la versión 3 (tailwindcss@3) junto con PostCSS y Autoprefixer, generando los archivos tailwind.config.js y postcss.config.js tradicionales. La figura 3 muestra la escritura de los tres scripts de seed y el momento exacto de esa corrección de versiones.',
      },
      { tipo: 'captura', archivo: '3.png' },
    ],
  },
  {
    numero: 4,
    titulo: 'Frontend Angular: Componentes UI y Página de Películas',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La cuarta etapa construyó la interfaz de usuario. Siguiendo la filosofía de shadcn/ui, se crearon componentes de interfaz propios y reutilizables en frontend/src/app/components/ui/: un botón (ui-button), un campo de texto (ui-input) que implementa la interfaz ControlValueAccessor de Angular para integrarse con los formularios reactivos, y una familia de tarjetas (ui-card, con encabezado, título, descripción y contenido). Todos son componentes standalone estilizados con clases utilitarias de Tailwind, lo que evita dependencias de bibliotecas de componentes externas.',
      },
      {
        tipo: 'p',
        texto:
          'La comunicación con la API se concentró en el servicio frontend/src/app/services/pelicula.service.ts, que define la interfaz TypeScript Pelicula y expone métodos Observable para cada operación CRUD y para la consulta por género. El servicio incluye además un manejo de errores específico: cuando la API responde 503 porque MongoDB no está disponible, se lanza el error tipado MongoUnavailableError, que la interfaz traduce en un aviso claro para el usuario en lugar de un fallo genérico.',
      },
      {
        tipo: 'codigo',
        titulo: 'frontend/src/app/services/pelicula.service.ts (fragmento)',
        codigo: `export interface Pelicula {
  _id?: string;
  titulo: string;
  anio?: number;
  genero?: string;
  duracionMinutos?: number;
  calificacion?: number;
}

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  private readonly baseUrl = \`\${environment.apiUrl}/peliculas\`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  crear(pelicula: Partial<Pelicula>): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.baseUrl, pelicula)
      .pipe(catchError(this.handleError));
  }

  eliminar(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(\`\${this.baseUrl}/\${id}\`)
      .pipe(catchError(this.handleError));
  }

  consultarPorGenero(genero: string) {
    return this.http.get(
      \`\${this.baseUrl}/consulta/genero/\${encodeURIComponent(genero)}\`
    ).pipe(catchError(this.handleError));
  }
}`,
      },
      {
        tipo: 'p',
        texto:
          'La página principal, frontend/src/app/pages/peliculas/peliculas.component.ts, consume ese servicio mediante formularios reactivos: un FormGroup con validadores exige un título de al menos dos caracteres y precarga el año actual y el género Drama. Desde esta vista el usuario puede añadir películas a la lista, verlas con sus datos del seed, eliminarlas y ejecutar la consulta por género contra MongoDB. La figura 4 registra la creación de los componentes de interfaz y de esta página.',
      },
      {
        tipo: 'codigo',
        titulo: 'frontend/src/app/pages/peliculas/peliculas.component.ts (fragmento)',
        codigo: `export class PeliculasComponent implements OnInit {
  form!: FormGroup;
  peliculas: Pelicula[] = [];
  generoConsulta = 'Drama';

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      anio: [new Date().getFullYear()],
      genero: ['Drama'],
    });
    this.cargarPeliculas();
  }

  agregarPelicula(): void {
    if (this.form.invalid || this.mongoUnavailable) return;
    const { titulo, anio, genero } = this.form.value;
    this.peliculaService.crear({ titulo, anio, genero }).subscribe({
      next: () => {
        this.mensaje = \`"\${titulo}" añadida correctamente.\`;
        this.cargarPeliculas();
      },
      error: (err) => this.handleError(err),
    });
  }
}`,
      },
      { tipo: 'captura', archivo: '6.png' },
      {
        tipo: 'p',
        texto:
          'Para cerrar la etapa se ajustaron los archivos globales del frontend: el componente raíz app.component.ts se convirtió a plantilla en línea con un encabezado de aplicación, el index.html se tradujo al español (atributo lang="es" y título "Cine UNETI — Catálogo de Películas") y se completó el .gitignore con las carpetas de artefactos (node_modules/, dist/, .angular/) y el archivo .env, para que las credenciales nunca se versionen. Estos cambios se aprecian en la figura 5.',
      },
      { tipo: 'captura', archivo: '7.png' },
    ],
  },
  {
    numero: 5,
    titulo: 'Orquestación de la Ejecución y Arquitectura de Tres Capas',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La quinta etapa consolidó la experiencia de ejecución del sistema. Gracias a la herramienta concurrently, el comando yarn start ejecutado desde la raíz del monorepo levanta en paralelo los dos procesos con etiquetas de color distinguibles en la terminal: api (backend Node.js en http://localhost:3000) y web (Angular en http://localhost:4200). La figura 6 muestra el resumen final del montaje, con las cinco colecciones, las funcionalidades implementadas y la guía de ejecución en cuatro pasos.',
      },
      { tipo: 'captura', archivo: '5.png' },
      {
        tipo: 'p',
        texto:
          'En esta fase se documentó además una aclaración conceptual importante para la asignatura: ¿era necesario Express si ya se usaba Angular? La respuesta es afirmativa, porque Angular no forma parte del servidor: corre en el navegador y solo consume la API por HTTP. Express es quien atiende esas peticiones y gestiona la conexión con la base de datos; sin él (o un equivalente como Fastify o NestJS), no habría servidor que ejecutara las operaciones CRUD contra MongoDB. El sistema queda así organizado en tres capas independientes: Angular como interfaz, Express como API y MongoDB como almacén de datos, comunicadas por HTTP y por el controlador oficial de MongoDB, respectivamente.',
      },
      {
        tipo: 'p',
        texto:
          'El comportamiento de la API puede verificarse directamente con peticiones HTTP. Los siguientes ejemplos, incluidos también en el README del repositorio, crean una película y ejecutan la consulta sencilla por género.',
      },
      {
        tipo: 'codigo',
        titulo: 'Verificación de la API con curl',
        codigo: `# Crear película
curl -X POST http://localhost:3000/api/peliculas \\
  -H "Content-Type: application/json" \\
  -d '{"titulo":"Inception","anio":2010,"genero":"Ciencia Ficción"}'

# Consulta sencilla por género
curl http://localhost:3000/api/peliculas/consulta/genero/Drama`,
      },
      { tipo: 'captura', archivo: '4.png' },
    ],
  },
  {
    numero: 6,
    titulo: 'Publicación del Repositorio en GitHub',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La sexta etapa publicó el código fuente en GitHub para respaldar el trabajo y hacerlo accesible a la evaluación docente. Con la interfaz de línea de comandos gh se verificó primero el estado de la autenticación (gh auth status), comprobando que la cuenta miguelfiguera contaba con credenciales válidas y permisos suficientes. La figura 8 documenta esta verificación previa.',
      },
      { tipo: 'captura', archivo: '8.png' },
      {
        tipo: 'p',
        texto:
          'Confirmada la autenticación, se inicializó el repositorio local con git init, se prepararon los archivos con git add y se creó el commit inicial "Proyecto CRUD Angular + Node.js + MongoDB para UNETI", que abarcó 52 archivos entre backend, frontend, scripts de seed, README y las capturas del proceso. El repositorio remoto se creó con visibilidad pública bajo el nombre angular-crud-uneti y la rama principal main quedó enlazada al remoto. El archivo .env no se subió por estar excluido en .gitignore, práctica correcta de manejo de secretos. La figura 9 muestra la secuencia completa y la dirección final del repositorio.',
      },
      {
        tipo: 'codigo',
        titulo: 'Secuencia de publicación en GitHub',
        codigo: `gh --version && gh auth status
git init
git add .
git commit -m "Proyecto CRUD Angular + Node.js + MongoDB para UNETI."
# rama main enlazada al remoto y código publicado
gh repo view miguelfiguera/angular-crud-uneti \\
  --json url,visibility,defaultBranchRef
# → https://github.com/miguelfiguera/angular-crud-uneti (público, main)`,
      },
      { tipo: 'captura', archivo: '9.png' },
    ],
  },
  {
    numero: 7,
    titulo: 'Verificación End-to-End con Playwright',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La séptima etapa validó el funcionamiento integral del sistema mediante un script de pruebas end-to-end escrito con Playwright (scripts/e2e-test.cjs). Antes de las pruebas se preparó el entorno: se inició MongoDB en localhost:27017, se ejecutó el seed que creó las cinco colecciones con cinco documentos cada una, y se levantó la aplicación completa con yarn start. El script ejerce primero la API con fetch —verificación de salud, listado de películas, consulta por género y creación de registros— y luego automatiza el navegador Chromium para probar la interfaz real: carga de la página, visualización de las películas del seed, adición y eliminación de una película y ejecución de la consulta por género desde el formulario.',
      },
      {
        tipo: 'codigo',
        titulo: 'scripts/e2e-test.cjs (fragmento)',
        codigo: `const { chromium } = require('playwright');

const API = 'http://localhost:3000';
const APP = 'http://localhost:4200';
const TEST_MOVIE = \`Test Película E2E \${Date.now()}\`;

async function run() {
  const results = [];
  const pass = (name, detail = '') => results.push({ name, ok: true, detail });
  const fail = (name, detail = '') => results.push({ name, ok: false, detail });

  // --- Pruebas de API ---
  const health = await fetch(\`\${API}/api/health\`).then((r) => r.json());
  if (health.status === 'ok') pass('API health check', health.message);

  const peliculas = await fetch(\`\${API}/api/peliculas\`).then((r) => r.json());
  if (Array.isArray(peliculas) && peliculas.length >= 5) {
    pass('API listar películas', \`\${peliculas.length} películas en MongoDB\`);
  }

  const res = await fetch(\`\${API}/api/peliculas/consulta/genero/Drama\`)
    .then((r) => r.json());
  if (res.total >= 1 && Array.isArray(res.peliculas)) {
    pass('API consulta por género', \`\${res.total} película(s) Drama\`);
  }
  // ... luego Chromium abre http://localhost:4200 y prueba la interfaz
}`,
      },
      { tipo: 'captura', archivo: '10.png' },
      {
        tipo: 'p',
        texto:
          'El resultado fue de nueve pruebas superadas de nueve ejecutadas: cuatro contra la API y cinco contra el frontend. Como verificación adicional se consultó MongoDB directamente con mongosh, confirmando el conteo de documentos por colección: peliculas, directores, generos, actores y resenas con cinco documentos cada una. La figura 11 recoge la tabla completa de resultados y el estado final del sistema en ejecución.',
      },
      { tipo: 'captura', archivo: '11.png' },
    ],
  },
  {
    numero: 8,
    titulo: 'Modo Oscuro por Defecto y Cierre del Proyecto',
    bloques: [
      {
        tipo: 'p',
        texto:
          'La octava y última etapa incorporó el modo oscuro como tema visual de la aplicación. En el index.html se añadió la clase dark al elemento raíz y la metaetiqueta color-scheme, junto con un script en línea que aplica el tema antes del primer renderizado para evitar el destello de pantalla clara al cargar. Se creó además un servicio de tema que persistía la preferencia del usuario en localStorage, con un botón alternador en el encabezado; en la revisión final del proyecto se decidió fijar el modo oscuro como único tema de la interfaz.',
      },
      {
        tipo: 'codigo',
        titulo: 'frontend/src/index.html (estado final)',
        codigo: `<!doctype html>
<html lang="es" class="dark">
<head>
  <meta charset="utf-8">
  <title>Cine UNETI - Catálogo de Películas</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`,
      },
      {
        tipo: 'p',
        texto:
          'El ajuste implicó también refinar las variables CSS del tema oscuro en styles.css —elevando ligeramente la luminosidad de las tarjetas para mantener el contraste— y añadir variantes dark: de Tailwind a las alertas de éxito y de error de la página de películas, de modo que los mensajes conserven legibilidad en ambos esquemas de color. Tras compilar el frontend con yarn build y verificar el resultado en el navegador, el cambio se registró en el historial del repositorio con el commit "dark mode only", cerrando así el ciclo de desarrollo del sistema. La figura 12 documenta estos últimos ajustes.',
      },
      { tipo: 'captura', archivo: '12.png' },
    ],
  },
];

export const conclusion = [
  'El desarrollo del sistema CRUD de películas permitió aplicar de manera integrada los contenidos del módulo Informática — Bases de Datos: el diseño de una base de datos documental con cinco colecciones en MongoDB, la construcción de una API REST con Node.js y Express que expone las operaciones de creación, lectura, actualización y eliminación, y el consumo de esos servicios desde una interfaz Angular con formularios reactivos y componentes reutilizables. Las ocho etapas descritas —montaje del monorepo, backend, scripts de seed, frontend, orquestación, publicación, verificación y tematización— conforman un procedimiento sistemático y replicable para proyectos de similar naturaleza.',
  'Desde el punto de vista técnico, el proyecto dejó aprendizajes concretos: la separación en tres capas (interfaz, API y datos) clarifica responsabilidades y facilita el mantenimiento; el enrutador CRUD genérico con lista blanca de colecciones evita la duplicación de código sin sacrificar seguridad; los scripts de seed multiplataforma con ejecución automática tras la instalación reducen la fricción de puesta en marcha; y las pruebas end-to-end con Playwright, con nueve verificaciones superadas, aportan evidencia objetiva de que el sistema funciona de extremo a extremo. Las doce capturas de pantalla conservadas durante el proceso constituyen la evidencia verificable de cada fase, mientras que el repositorio público en GitHub garantiza la reproducibilidad y permanencia del producto final.',
];

export const referencias = [
  'American Psychological Association. (2020). Publication Manual of the American Psychological Association (7ma ed.). https://doi.org/10.1037/0000165-000',
  'Angular Team. (2025). Angular Documentation. https://angular.dev/',
  'Express Team. (2025). Express - Node.js web application framework. https://expressjs.com/',
  'Figuera, M. (2026). angular-crud-uneti [Código fuente]. GitHub. https://github.com/miguelfiguera/angular-crud-uneti',
  'Microsoft. (2025). Playwright: Fast and reliable end-to-end testing. https://playwright.dev/',
  'MongoDB, Inc. (2025). MongoDB Manual. https://www.mongodb.com/docs/manual/',
  'OpenJS Foundation. (2025). Node.js Documentation. https://nodejs.org/docs/',
  'Tailwind Labs. (2025). Tailwind CSS Documentation. https://tailwindcss.com/docs',
];

export const anexos = [
  {
    titulo: 'Anexo A. Repositorio del código fuente',
    parrafos: [
      'El código fuente completo del sistema —backend, frontend, scripts de seed, pruebas end-to-end y el generador del presente documento— se encuentra publicado con visibilidad pública en el siguiente repositorio de GitHub. Para reproducir el proyecto basta con clonarlo, disponer de Node.js 18 o superior, Yarn y una instancia de MongoDB, y ejecutar yarn install seguido de yarn start.',
      'URL: https://github.com/miguelfiguera/angular-crud-uneti',
    ],
  },
  {
    titulo: 'Anexo B. Estructura del proyecto',
    parrafos: [
      'La siguiente estructura resume la organización de carpetas del monorepo, con la separación entre la API, la interfaz y los scripts de apoyo descrita a lo largo del documento.',
    ],
    codigo: `├── backend/            # API Node.js + Express + MongoDB
│   └── src/
│       ├── config/     # Conexión a MongoDB (db.js)
│       ├── routes/     # Router CRUD genérico
│       └── seed/       # Poblado de las 5 colecciones
├── frontend/           # Angular 19 + Tailwind CSS
│   └── src/app/
│       ├── components/ui/   # button, input, card (estilo shadcn)
│       ├── pages/peliculas/ # página CRUD principal
│       └── services/        # PeliculaService (HttpClient)
├── scripts/
│   ├── seed-db.sh      # Seed Linux/macOS
│   ├── seed-db.ps1     # Seed Windows
│   ├── run-seed.js     # Orquestador postinstall
│   └── e2e-test.cjs    # Pruebas end-to-end (Playwright)
├── docs/               # Este documento y su generador
├── Fotos/              # Capturas del proceso (1.png … 12.png)
└── README.md           # Instrucciones de ejecución`,
  },
];

/** Pies de figura para cada captura de Fotos/. El número de figura se asigna
 *  automáticamente según el orden de aparición en las etapas. */
export const capturas = {
  '1.png': {
    descripcion:
      'Montaje inicial del monorepo: verificación de herramientas, plan de trabajo, creación del frontend con Angular CLI 19 y edición de los package.json.',
    width: 918,
    height: 991,
  },
  '2.png': {
    descripcion:
      'Construcción del backend: conexión a MongoDB (db.js), seed de las cinco colecciones, enrutador CRUD genérico e index.js de Express.',
    width: 921,
    height: 1096,
  },
  '3.png': {
    descripcion:
      'Scripts de seed para Linux (bash) y Windows (PowerShell), orquestador run-seed.js e integración de Tailwind CSS 3 en Angular.',
    width: 921,
    height: 1096,
  },
  '4.png': {
    descripcion:
      'Aclaración de la arquitectura de tres capas (Angular, Express, MongoDB) y verificación de la autenticación de GitHub CLI.',
    width: 921,
    height: 1096,
  },
  '5.png': {
    descripcion:
      'Resumen del sistema montado: tecnologías por capa, cinco colecciones de MongoDB, funcionalidades y guía de ejecución con yarn start.',
    width: 921,
    height: 1096,
  },
  '6.png': {
    descripcion:
      'Creación de los componentes de interfaz ui-button, ui-input (ControlValueAccessor) y ui-card, y de la página de películas.',
    width: 921,
    height: 1096,
  },
  '7.png': {
    descripcion:
      'Ajustes globales del frontend: componente raíz con plantilla en línea, index.html en español y .gitignore con node_modules, dist y .env.',
    width: 921,
    height: 1096,
  },
  '8.png': {
    descripcion:
      'Verificación de gh auth status y del estado del proyecto antes de crear el repositorio remoto en GitHub.',
    width: 929,
    height: 1042,
  },
  '9.png': {
    descripcion:
      'Publicación del repositorio angular-crud-uneti: git init, commit inicial con 52 archivos y rama main enlazada al remoto público.',
    width: 929,
    height: 1042,
  },
  '10.png': {
    descripcion:
      'Script de pruebas end-to-end e2e-test.cjs con Playwright y ejecución con el navegador Chromium instalado.',
    width: 917,
    height: 1100,
  },
  '11.png': {
    descripcion:
      'Resultados de la verificación: nueve pruebas superadas de nueve, y conteo de documentos por colección confirmado con mongosh.',
    width: 917,
    height: 1100,
  },
  '12.png': {
    descripcion:
      'Implementación del modo oscuro: variables CSS del tema, variantes dark: en las alertas y compilación final con yarn build.',
    width: 932,
    height: 1088,
  },
};

/** Índice del documento (páginas verificadas sobre el PDF generado). */
export const indice = [
  { label: 'Introducción', page: 3 },
  { label: 'Etapa 1. Montaje del Monorepo y Configuración del Entorno', page: 5 },
  { label: 'Etapa 2. Backend Node.js: Conexión a MongoDB, Seed y API CRUD', page: 8 },
  { label: 'Etapa 3. Scripts de Seed Multiplataforma e Integración de Tailwind CSS', page: 12 },
  { label: 'Etapa 4. Frontend Angular: Componentes UI y Página de Películas', page: 15 },
  { label: 'Etapa 5. Orquestación de la Ejecución y Arquitectura de Tres Capas', page: 20 },
  { label: 'Etapa 6. Publicación del Repositorio en GitHub', page: 24 },
  { label: 'Etapa 7. Verificación End-to-End con Playwright', page: 28 },
  { label: 'Etapa 8. Modo Oscuro por Defecto y Cierre del Proyecto', page: 32 },
  { label: 'Conclusión', page: 34 },
  { label: 'Referencias', page: 35 },
  { label: 'Anexos', page: 36 },
];
