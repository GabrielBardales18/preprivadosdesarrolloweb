const formulario = document.querySelector("#formulario-registro");
const lista = document.querySelector("#lista-inscripciones");
const mensaje = document.querySelector("#mensaje");
const botonEnviar = document.querySelector("#boton-enviar");
const botonCancelar = document.querySelector("#boton-cancelar");

// Guarda el id de la inscripción que se está editando; null significa "crear nueva".
let idEnEdicion = null;

// Muestra un mensaje de confirmación o de error debajo del formulario.
function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.classList.toggle("error", esError);
}

// SQLite guarda la fecha en UTC con el formato "AAAA-MM-DD HH:MM:SS".
function formatearFecha(fecha) {
  const valor = new Date(fecha.replace(" ", "T") + "Z");
  return Number.isNaN(valor.getTime()) ? fecha : valor.toLocaleString("es-GT");
}

// ---------- GET: mostrar registros ----------
async function cargarInscripciones() {
  const respuesta = await fetch("/api/inscripciones");
  const filas = await respuesta.json();
  lista.replaceChildren();

  if (filas.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "vacio";
    vacio.textContent = "Aún no hay inscripciones.";
    lista.append(vacio);
    return;
  }

  filas.forEach((fila) => {
    const item = document.createElement("li");
    item.className = "inscripcion";
    if (fila.id === idEnEdicion) item.classList.add("en-edicion");

    const datos = document.createElement("div");
    datos.className = "inscripcion-datos";

    const nombre = document.createElement("p");
    nombre.className = "inscripcion-nombre";
    nombre.textContent = fila.nombre;

    const contacto = document.createElement("p");
    contacto.className = "inscripcion-detalle";
    contacto.textContent = fila.correo + " · " + fila.telefono;

    const taller = document.createElement("p");
    taller.className = "inscripcion-detalle";
    taller.textContent =
      fila.taller + " · " + fila.horario + " · " + fila.modalidad + " · Nivel " + fila.nivel_experiencia;

    const fecha = document.createElement("p");
    fecha.className = "inscripcion-detalle";
    fecha.textContent = "Registrado: " + formatearFecha(fila.fecha_registro);

    datos.append(nombre, contacto, taller, fecha);

    const acciones = document.createElement("div");
    acciones.className = "inscripcion-acciones";

    const editar = document.createElement("button");
    editar.type = "button";
    editar.className = "boton-secundario boton-pequeno";
    editar.textContent = "Editar";
    editar.addEventListener("click", () => prepararEdicion(fila));

    const borrar = document.createElement("button");
    borrar.type = "button";
    borrar.className = "boton-peligro boton-pequeno";
    borrar.textContent = "Eliminar";
    borrar.addEventListener("click", () => eliminarInscripcion(fila));

    acciones.append(editar, borrar);
    item.append(datos, acciones);
    lista.append(item);
  });
}

// ---------- Edición: cargar la fila en el formulario ----------
function prepararEdicion(fila) {
  idEnEdicion = fila.id;
  Object.entries(fila).forEach(([campo, valor]) => {
    const control = formulario.elements.namedItem(campo);
    if (control) control.value = valor;
  });
  botonEnviar.textContent = "Guardar cambios";
  botonCancelar.hidden = false;
  mostrarMensaje("Editando la inscripción de " + fila.nombre + ".");
  cargarInscripciones();
  formulario.scrollIntoView({ behavior: "smooth", block: "start" });
}

function salirDeEdicion() {
  idEnEdicion = null;
  formulario.reset();
  botonEnviar.textContent = "Registrar inscripción";
  botonCancelar.hidden = true;
}

botonCancelar.addEventListener("click", () => {
  salirDeEdicion();
  mostrarMensaje("");
  cargarInscripciones();
});

// ---------- DELETE: eliminar y refrescar ----------
async function eliminarInscripcion(fila) {
  if (!confirm("¿Eliminar la inscripción de " + fila.nombre + "?")) return;

  try {
    const respuesta = await fetch("/api/inscripciones/" + fila.id, { method: "DELETE" });
    const resultado = await respuesta.json();
    mostrarMensaje(resultado.mensaje || resultado.error, !respuesta.ok);

    if (respuesta.ok) {
      if (fila.id === idEnEdicion) salirDeEdicion();
      await cargarInscripciones();
      await cargarReportes();
    }
  } catch {
    mostrarMensaje("No se pudo conectar con el servidor.", true);
  }
}

// ---------- POST o PUT: enviar el formulario ----------
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (!formulario.reportValidity()) return;

  const datos = Object.fromEntries(new FormData(formulario));
  const metodo = idEnEdicion ? "PUT" : "POST";
  const ruta = idEnEdicion ? "/api/inscripciones/" + idEnEdicion : "/api/inscripciones";

  try {
    const respuesta = await fetch(ruta, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    const resultado = await respuesta.json();
    mostrarMensaje(resultado.mensaje || resultado.error, !respuesta.ok);

    // Si hubo error, se conservan los datos para corregirlos.
    if (respuesta.ok) {
      salirDeEdicion();
      await cargarInscripciones();
      await cargarReportes();
    }
  } catch {
    mostrarMensaje("No se pudo conectar con el servidor.", true);
  }
});

// ---------- Reportes ----------
// Dibuja una barra por cada fila; "campo" es la columna agrupada (taller, horario...).
function dibujarBarras(selector, filas, campo) {
  const contenedor = document.querySelector(selector);
  contenedor.replaceChildren();
  const mayor = Math.max(...filas.map((fila) => Number(fila.cantidad)), 1);

  filas.forEach((fila) => {
    const item = document.createElement("li");

    const etiqueta = document.createElement("p");
    etiqueta.textContent = fila[campo] + ": " + fila.cantidad;

    const fondo = document.createElement("div");
    fondo.className = "barra-fondo";
    const barra = document.createElement("div");
    barra.className = "barra";
    barra.style.width = (Number(fila.cantidad) / mayor) * 100 + "%";

    fondo.append(barra);
    item.append(etiqueta, fondo);
    contenedor.append(item);
  });
}

async function cargarReportes() {
  const respuesta = await fetch("/api/reportes/resumen");
  const datos = await respuesta.json();

  document.querySelector("#total").textContent = datos.total;
  document.querySelector("#reportes-vacio").hidden = datos.total > 0;

  dibujarBarras("#reporte-talleres", datos.porTaller, "taller");
  dibujarBarras("#reporte-horarios", datos.porHorario, "horario");
  dibujarBarras("#reporte-modalidades", datos.porModalidad, "modalidad");
  dibujarBarras("#reporte-niveles", datos.porNivel, "nivel_experiencia");
}

cargarInscripciones();
cargarReportes();
