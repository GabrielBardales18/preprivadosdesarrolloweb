# Registro de participantes para el taller de Desarrollo Web

## Objetivo
Aplicación web para que una universidad registre a los participantes de su taller de Desarrollo Web. El estudiante llena un formulario con su **nombre completo, correo, teléfono, taller y horario**; la información se envía a una API hecha con Node.js y Express, que valida los datos, los guarda y devuelve la lista de participantes inscritos, la cual se muestra en la misma página.

## Funcionalidades
- Formulario con los cinco campos obligatorios y validación en el navegador (`required`, `type="email"`, `type="tel"`).
- Envío con `fetch` y JSON, sin recargar la página.
- Validación en el servidor: todos los campos completos y correo con formato válido.
- Mensaje de confirmación o de error devuelto por el servidor.
- Lista de participantes inscritos que se actualiza después de cada registro.
- Diseño adaptable a teléfonos con un media query (640 px).

## Tecnologías
- HTML, CSS (Grid y media query) y JavaScript (DOM, eventos y `fetch`).
- Node.js y Express.

## Requisitos
- Node.js 18 o superior (se recomienda la versión LTS).
- Visual Studio Code u otro editor.
- Conexión a internet la primera vez para instalar Express.

## Instalación
1. Clona o descarga el repositorio y abre la carpeta en VS Code con **File → Open Folder**.
2. Abre una terminal con **Terminal → New Terminal**.
3. Instala las dependencias:

```bash
npm install
```

## Inicio
1. Inicia el servidor:

```bash
npm start
```

2. Abre `http://localhost:3000` en el navegador.
3. Para detener el servidor, presiona `Ctrl + C` en la terminal.

### Si PowerShell bloquea npm.ps1
Si aparece un mensaje que dice que la ejecución de scripts está deshabilitada, usa:

```powershell
npm.cmd install
npm.cmd start
```

También puedes cambiar la terminal de VS Code a **Command Prompt** o **Git Bash**.

## Rutas de la API

### `GET /api/inscripciones`
Devuelve en JSON el arreglo de participantes inscritos. Si aún no hay registros, devuelve `[]`.

```json
[
  {
    "id": 1,
    "nombre": "Ana López",
    "correo": "ana.lopez@correo.com",
    "telefono": "5555-1234",
    "taller": "JavaScript",
    "horario": "Tarde"
  }
]
```

### `POST /api/inscripciones`
Recibe en el cuerpo un JSON con `nombre`, `correo`, `telefono`, `taller` y `horario`.

| Estado | Cuándo | Respuesta |
|---|---|---|
| `201 Created` | Los datos son válidos | El registro creado, con su `id` |
| `400 Bad Request` | Falta algún campo o está vacío | `{ "mensaje": "Todos los campos son obligatorios." }` |
| `400 Bad Request` | El correo no tiene formato válido | `{ "mensaje": "El correo no tiene un formato válido." }` |

## Estructura del proyecto
```
registro-taller-estudiante/
├── server.js          # Servidor Express y rutas de la API
├── package.json       # Dependencias y script npm start
├── public/
│   ├── index.html     # Formulario y lista de participantes
│   ├── styles.css     # Estilos, Grid y media query
│   └── app.js         # Envío con fetch y dibujo de la lista
├── README.md
└── bitacora.md        # Bitácora de repaso
```

## Notas
- Los registros se guardan **temporalmente en memoria**: se borran al detener o reiniciar el servidor.
- Para las pruebas se usan datos inventados; no se ingresa información personal real.
