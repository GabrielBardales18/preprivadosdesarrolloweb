# Bitácora de repaso de Desarrollo Web

Completa una ficha por tema con tus palabras. No copies párrafos de los sitios consultados.

## Actividades del repaso

### Flujo web
Términos:
- TypeScript
- Express

Actividad: Imagina que Ana completa el formulario y presiona Registrar.

- ¿Qué presenta los campos?
  El HTML crea los campos del formulario.
- ¿Qué evita que el navegador recargue la página?
  JavaScript escucha el evento submit del formulario y llama a event.preventDefault() que cancela el envío tradicional.
- ¿Qué componente recibe el JSON?
  El servidor (backend): Node.js con Express. Express recibe la solicitud HTTP en la ruta que corresponde, lee el JSON y valida los datos.
- ¿Qué parte puede guardar el registro?
  El backend. El servidor, después de validar los datos, puede guardarlos en una base de datos o en un archivo, luego responde con código HTTP y un JSON.

### HTML guiado
- ¿Qué hacen name, type y required?
  - name: es la clave con la que se envía el valor.
  - type: define el tipo de dato.
  - required: hace el campo obligatorio y el navegador no deja enviarlo vacío.
- Dos etiquetas semánticas y para qué sirven:
  - `<nav>` contiene los enlaces de navegación principales.
  - `<section>` agrupa un bloque de contenido que trata un mismo tema.

### Práctica HTML
- ¿Qué información ya aparece en el HTML y qué falta para guardar el registro?
  El HTML ya presenta el formulario. Falta que JavaScript lea los campos y conecte el envío con el servidor.
- ¿Cuándo usarías type="email" y cuándo type="tel"?
  email es para correos y valida que tengan un formato básico (con @). tel es para teléfonos. No valida el formato, pero abre el teclado numérico en el celular.

---

## HTML
- Resumen propio (2–3 frases):
  HTML define la estructura y el contenido de la página: títulos, párrafos, formularios y listas. En el proyecto lo usé para crear el formulario de inscripción y la lista de participantes. Usar etiquetas semánticas como `<main>`, `<header>` y `<section>` hace que la página sea más clara y accesible.
- Dos términos clave y su explicación:
  - `label` con `for`: el atributo `for` debe tener el mismo valor que el `id` del campo; así, al hacer clic en el texto se activa el campo y los lectores de pantalla saben qué describe.
  - `placeholder`: texto de ejemplo en gris que aparece dentro del campo mientras está vacío; orienta al usuario pero no reemplaza al `label`.
- Ejemplo de código explicado:
  ```html
  <label for="correo">Correo electrónico</label>
  <input id="correo" name="correo" type="email" required placeholder="Ej. maria.lopez@correo.com">
  ```
  El `label` se conecta al campo por `for="correo"` e `id="correo"`. `name` es la clave con la que se lee el valor, `type="email"` exige un formato con @ y `required` impide enviar el formulario vacío.
- Pregunta que podría aparecer en el examen:
  ¿Para qué sirve que el atributo `for` de un `label` coincida con el `id` de un `input`?

## CSS
- Resumen propio (2–3 frases):
  CSS controla la apariencia de la página: colores, tamaños, espacios y la forma en que se ordenan los elementos. Con Grid o Flexbox se acomodan los elementos sin cálculos manuales, y con media queries la página se adapta a pantallas pequeñas.
- Dos términos clave y su explicación:
  - Modelo de caja: `padding` es el espacio dentro del borde y `margin` es el espacio fuera del borde, que separa el elemento de los demás.
  - Media query: regla que aplica estilos solo cuando se cumple una condición, por ejemplo cuando la ventana mide 640 px o menos.
- Ejemplo de código explicado:
  ```css
  form { display: grid; gap: .65rem; }

  @media (max-width: 640px) {
    .encabezado { text-align: center; }
    .panel { padding: 1rem; }
  }
  ```
  `display: grid` coloca los campos del formulario uno debajo de otro y `gap` deja el mismo espacio entre ellos. Cuando la pantalla mide 640 px o menos, el encabezado se centra y las tarjetas tienen menos relleno.
- Pregunta que podría aparecer en el examen:
  ¿Cuál es la diferencia entre `padding` y `margin`?

## JavaScript y DOM
- Resumen propio (2–3 frases):
  JavaScript agrega comportamiento a la página. Con el DOM puede buscar elementos del HTML, leer sus valores y cambiar su contenido sin recargar. Los eventos permiten ejecutar código cuando el usuario hace algo, como enviar un formulario.
- Dos términos clave y su explicación:
  - `addEventListener`: asocia una función a un evento; la función se ejecuta solo cuando ese evento ocurre, por ejemplo `"submit"`.
  - `preventDefault()`: cancela la acción automática del navegador; en un formulario evita que la página se recargue para que JavaScript procese los datos.
- Ejemplo de código explicado:
  ```js
  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const datos = new FormData(formulario);
    console.log(datos.get("nombre"));
  });
  ```
  Cuando se envía el formulario se cancela la recarga, `FormData` lee todos los campos usando su `name` y se muestra el nombre en la consola.
- Pregunta que podría aparecer en el examen:
  ¿Qué pasa si no se usa `preventDefault()` en el evento `submit` de un formulario?

## Node.js, Express y API
- Resumen propio (2–3 frases):
  Node.js permite ejecutar JavaScript en el servidor y Express facilita crear rutas que responden a solicitudes HTTP. Una API recibe y devuelve datos en formato JSON. En el proyecto, el navegador envía la inscripción y el servidor la valida, la guarda y responde con un código de estado.
- Dos términos clave y su explicación:
  - `req.body`: objeto con los datos que el cliente envía en el cuerpo de la solicitud; Express lo llena gracias a `express.json()`.
  - Código de estado: número que indica el resultado de la solicitud; `201` significa que el registro se creó y `400` que los datos no son válidos.
- Ejemplo de ruta o solicitud explicado:
  ```js
  app.post("/api/inscripciones", (req, res) => {
    const { nombre, correo, telefono, taller, horario } = req.body;
    // ...validaciones...
    inscripciones.push(nuevaInscripcion);
    res.status(201).json(nuevaInscripcion);
  });
  ```
  La ruta extrae los cinco datos de `req.body`, revisa que estén completos y que el correo sea válido (si no, responde `400`), agrega la inscripción al arreglo y responde `201` con el registro creado.
- Pregunta que podría aparecer en el examen:
  ¿Qué código de estado debe devolver una API cuando crea un recurso y cuál cuando los datos enviados son inválidos?

## SQL
- Resumen propio (2–3 frases):
  SQL es el lenguaje para trabajar con bases de datos relacionales, donde la información se guarda en tablas con filas y columnas. A diferencia del arreglo del proyecto, que se borra al reiniciar el servidor, una base de datos guarda los registros de forma permanente.
- Explica SELECT, INSERT, UPDATE y DELETE:
  - `SELECT`: consulta registros. Ejemplo: `SELECT * FROM inscripciones;`
  - `INSERT`: agrega un registro nuevo. Ejemplo: `INSERT INTO inscripciones (nombre, correo) VALUES ('Ana', 'ana@correo.com');`
  - `UPDATE`: modifica registros existentes. Ejemplo: `UPDATE inscripciones SET horario = 'Noche' WHERE id = 1;`
  - `DELETE`: elimina registros. Ejemplo: `DELETE FROM inscripciones WHERE id = 1;`
  En `UPDATE` y `DELETE` el `WHERE` es importante: sin él se modifican o borran todas las filas.
- ¿Qué son una clave primaria y una clave foránea?
  La clave primaria identifica cada fila de forma única y no se repite, como el `id` de una inscripción. La clave foránea es una columna que guarda la clave primaria de otra tabla para relacionarlas; por ejemplo, `taller_id` en `inscripciones` apuntaría al `id` de una tabla `talleres`.
- Pregunta que podría aparecer en el examen:
  ¿Qué pasa si ejecutas un `DELETE` sin `WHERE`?

## Git y GitHub
- Resumen propio (2–3 frases):
  Git es un sistema de control de versiones que guarda el historial de cambios de un proyecto en la computadora. GitHub es un sitio donde se sube ese repositorio para tener una copia en línea, compartirlo y trabajar en equipo.
- Explica add, commit y push:
  - `git add`: selecciona los archivos modificados que se van a incluir en el siguiente commit.
  - `git commit -m "mensaje"`: guarda una versión del proyecto con un mensaje que describe el cambio.
  - `git push`: sube los commits locales al repositorio remoto en GitHub.
- Diferencia entre Git y GitHub:
  Git es la herramienta que se instala y funciona en la computadora, incluso sin internet. GitHub es un servicio en línea que aloja repositorios de Git.
- Pregunta que podría aparecer en el examen:
  ¿Por qué no se sube la carpeta `node_modules` al repositorio y cómo se evita?
  Porque se puede regenerar con `npm install` y pesa mucho; se excluye agregándola a `.gitignore`.
