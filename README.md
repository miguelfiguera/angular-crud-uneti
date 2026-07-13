# Cine UNETI — Sistema CRUD con Angular, Node.js y MongoDB

Aplicación full-stack para la evaluación del módulo **Informática · Bases de Datos**. Incluye:

- **Frontend Angular** con Tailwind CSS y componentes estilo **shadcn/ui**
- **Backend Node.js + Express** con operaciones CRUD sobre MongoDB
- **5 colecciones** con mínimo 4 campos y documentos cada una
- **Consulta sencilla**: películas filtradas por género
- Scripts de seed para **Linux (bash)** y **Windows (PowerShell)**

## Descripción del proyecto

El sistema gestiona un catálogo de cine con las siguientes colecciones en MongoDB (`cine_uneti`):

| Colección   | Campos principales                                      |
|-------------|---------------------------------------------------------|
| `peliculas` | titulo, anio, genero, duracionMinutos, calificacion     |
| `directores`| nombre, nacionalidad, peliculasDirigidas, premiosOscar  |
| `generos`   | nombre, descripcion, popularidad, colorHex              |
| `actores`   | nombre, edad, nacionalidad, peliculasDestacadas         |
| `resenas`   | pelicula, autor, calificacion, comentario               |

La interfaz Angular permite **añadir nombres de películas a una lista**, consultarlas, eliminarlas y ejecutar una consulta por género.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior
- [Yarn](https://yarnpkg.com/) 1.x
- [MongoDB](https://www.mongodb.com/) en ejecución (local o Atlas)

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/miguelfiguera/angular-crud-uneti.git
cd angular-crud-uneti
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta la URI de MongoDB si es necesario:

```bash
cp .env.example .env
```

Contenido de `.env`:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=cine_uneti
PORT=3000
```

Para **MongoDB Atlas**, usa tu cadena de conexión:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net
MONGODB_DB=cine_uneti
```

### 3. Instalar dependencias (incluye seed automático)

```bash
yarn install        # equivalente: npm install
```

> Tras `yarn install`, se ejecuta automáticamente el script de seed que crea y pobla la base de datos con las 5 colecciones.

Para ejecutar el seed manualmente:

```bash
yarn seed
```

Scripts por sistema operativo:

- **Linux/macOS:** `bash scripts/seed-db.sh`
- **Windows:** `powershell -ExecutionPolicy Bypass -File scripts/seed-db.ps1`

### 4. Iniciar la aplicación

```bash
yarn start          # equivalente: npm start
```

> Los scripts internos usan `yarn workspace`, por lo que Yarn debe estar instalado aunque se use `npm install` / `npm start`.

Esto levanta en paralelo:

- **API Backend:** http://localhost:3000
- **Frontend Angular:** http://localhost:4200

También puedes iniciarlos por separado:

```bash
yarn start:backend   # solo API
yarn start:frontend  # solo Angular
```

## API REST — Endpoints CRUD

Base URL: `http://localhost:3000/api`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/peliculas` | Listar películas |
| GET | `/api/peliculas/:id` | Obtener película por ID |
| POST | `/api/peliculas` | Crear película |
| PUT | `/api/peliculas/:id` | Actualizar película |
| DELETE | `/api/peliculas/:id` | Eliminar película |
| GET | `/api/peliculas/consulta/genero/:genero` | Consulta por género |

Los mismos endpoints CRUD aplican para: `directores`, `generos`, `actores`, `resenas`.

### Ejemplo — Crear película

```bash
curl -X POST http://localhost:3000/api/peliculas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Inception","anio":2010,"genero":"Ciencia Ficción"}'
```

### Ejemplo — Consulta por género

```bash
curl http://localhost:3000/api/peliculas/consulta/genero/Drama
```

## Estructura del proyecto

```
├── backend/           # API Node.js + Express + MongoDB
│   └── src/
│       ├── config/    # Conexión a MongoDB
│       ├── routes/    # Router CRUD genérico
│       └── seed/      # Script de población de datos
├── frontend/          # Angular + Tailwind + shadcn-style UI
│   └── src/app/
│       ├── components/ui/
│       ├── pages/peliculas/
│       └── services/
├── scripts/
│   ├── seed-db.sh     # Seed Linux
│   ├── seed-db.ps1    # Seed Windows
│   └── run-seed.js    # Ejecutado en postinstall
└── README.md
```

## Tecnologías

- **Frontend:** Angular 19, Tailwind CSS 3, componentes inspirados en shadcn/ui
- **Backend:** Node.js, Express, MongoDB Driver
- **Base de datos:** MongoDB (local o Atlas)

## Licencia

Proyecto académico — UNETI.
