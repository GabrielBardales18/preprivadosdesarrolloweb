const formulario = document.querySelector("#formulario-registro");
const lista = document.querySelector("#lista-inscripciones");
const mensaje = document.querySelector("#mensaje");

async function cargarInscripciones() {
  // TODO: Solicita GET /api/inscripciones con fetch().
  const respuesta = await fetch("/api/inscripciones");
  const inscripciones = await respuesta.json();

  // TODO: Limpia la lista y dibuja cada registro recibido.
  lista.innerHTML = "";

  if (inscripciones.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "vacio";
    vacio.textContent = "Aún no hay inscripciones.";
    lista.append(vacio);
    return;
  }

  // Usa textContent para mostrar los datos.
  for (const inscripcion of inscripciones) {
    const item = document.createElement("li");
    item.textContent = `${inscripcion.nombre} · ${inscripcion.taller} · ${inscripcion.horario}`;
    lista.append(item);
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const datos = new FormData(formulario);
  console.log(datos.get("nombre"));

  // TODO 3: Envía los cinco datos como JSON con POST /api/inscripciones.
  // Object.fromEntries convierte el FormData en un objeto { nombre: ..., correo: ..., ... }
  const respuesta = await fetch("/api/inscripciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(datos))
  });
  const resultado = await respuesta.json();

  // TODO 4: Muestra confirmación o el mensaje de error del servidor.
  if (!respuesta.ok) {
    mensaje.textContent = resultado.mensaje;
    return;
  }
  mensaje.textContent = `¡Listo, ${resultado.nombre}! Tu inscripción quedó registrada.`;

  // TODO 5: Si se guardó, limpia el formulario y vuelve a cargar la lista.
  formulario.reset();
  await cargarInscripciones();
});

cargarInscripciones();
