const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Opciones permitidas en cada select. Deben coincidir con las de index.html.
const OPCIONES = {
  taller: ["HTML y CSS", "JavaScript", "Node.js y Express"],
  horario: ["Mañana", "Tarde", "Noche"],
  modalidad: ["Presencial", "Virtual"],
  nivel_experiencia: ["Inicial", "Intermedio", "Avanzado"]
};

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_TELEFONO = /^[0-9+\-\s]{8,15}$/;

// Limpia y valida los datos que llegan en req.body.
// Devuelve { error } si algo está mal, o { datos } si todo es válido.
function validarInscripcion(cuerpo) {
  const texto = (valor) => (typeof valor === "string" ? valor.trim() : "");

  const datos = {
    nombre: texto(cuerpo.nombre),
    correo: texto(cuerpo.correo),
    telefono: texto(cuerpo.telefono),
    taller: texto(cuerpo.taller),
    horario: texto(cuerpo.horario),
    modalidad: texto(cuerpo.modalidad),
    nivel_experiencia: texto(cuerpo.nivel_experiencia)
  };

  if (Object.values(datos).some((valor) => !valor)) {
    return { error: "Completa todos los campos." };
  }
  if (datos.nombre.length < 2 || datos.nombre.length > 80) {
    return { error: "El nombre debe tener entre 2 y 80 caracteres." };
  }
  if (datos.correo.length > 100 || !FORMATO_CORREO.test(datos.correo)) {
    return { error: "Escribe un correo válido." };
  }
  if (!FORMATO_TELEFONO.test(datos.telefono)) {
    return { error: "El teléfono debe tener entre 8 y 15 caracteres: números, espacios, + o -." };
  }
  for (const [campo, permitidas] of Object.entries(OPCIONES)) {
    if (!permitidas.includes(datos[campo])) {
      return { error: `El valor elegido en "${campo}" no es válido.` };
    }
  }

  return { datos };
}

// Convierte el :id de la ruta en número y comprueba que sea válido.
function leerId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id >= 1 ? id : null;
}

// GET: devuelve todas las inscripciones guardadas en la base.
app.get("/api/inscripciones", (req, res) => {
  const filas = db.prepare(
    "SELECT id, nombre, correo, telefono, taller, horario, " +
    "modalidad, nivel_experiencia, fecha_registro " +
    "FROM inscripciones ORDER BY id DESC"
  ).all();
  res.json(filas);
});

// POST: valida y guarda una inscripción nueva.
app.post("/api/inscripciones", (req, res) => {
  const { error, datos } = validarInscripcion(req.body ?? {});
  if (error) {
    return res.status(400).json({ error });
  }

  // Sentencia preparada: los ? se reemplazan de forma segura por los valores.
  const resultado = db.prepare(
    "INSERT INTO inscripciones " +
    "(nombre, correo, telefono, taller, horario, modalidad, nivel_experiencia) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    datos.nombre, datos.correo, datos.telefono, datos.taller,
    datos.horario, datos.modalidad, datos.nivel_experiencia
  );

  res.status(201).json({
    mensaje: "Inscripción guardada.",
    id: Number(resultado.lastInsertRowid)
  });
});

// PUT: valida y actualiza la inscripción indicada por su id.
app.put("/api/inscripciones/:id", (req, res) => {
  const id = leerId(req);
  if (!id) {
    return res.status(400).json({ error: "Id inválido." });
  }

  const { error, datos } = validarInscripcion(req.body ?? {});
  if (error) {
    return res.status(400).json({ error });
  }

  const resultado = db.prepare(
    "UPDATE inscripciones SET nombre = ?, correo = ?, telefono = ?, taller = ?, " +
    "horario = ?, modalidad = ?, nivel_experiencia = ? WHERE id = ?"
  ).run(
    datos.nombre, datos.correo, datos.telefono, datos.taller,
    datos.horario, datos.modalidad, datos.nivel_experiencia, id
  );

  if (resultado.changes === 0) {
    return res.status(404).json({ error: "No se encontró la inscripción." });
  }
  res.json({ mensaje: "Inscripción actualizada." });
});

// DELETE: elimina la inscripción indicada; responde 404 si no existe.
app.delete("/api/inscripciones/:id", (req, res) => {
  const id = leerId(req);
  if (!id) {
    return res.status(400).json({ error: "Id inválido." });
  }

  const resultado = db.prepare("DELETE FROM inscripciones WHERE id = ?").run(id);

  if (resultado.changes === 0) {
    return res.status(404).json({ error: "No se encontró la inscripción." });
  }
  res.json({ mensaje: "Inscripción eliminada." });
});

// GET: conteos calculados en la base para los reportes visuales.
app.get("/api/reportes/resumen", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) AS total FROM inscripciones").get().total;

  const porTaller = db.prepare(
    "SELECT taller, COUNT(*) AS cantidad FROM inscripciones " +
    "GROUP BY taller ORDER BY cantidad DESC"
  ).all();

  const porHorario = db.prepare(
    "SELECT horario, COUNT(*) AS cantidad FROM inscripciones " +
    "GROUP BY horario ORDER BY horario"
  ).all();

  const porModalidad = db.prepare(
    "SELECT modalidad, COUNT(*) AS cantidad FROM inscripciones " +
    "GROUP BY modalidad ORDER BY cantidad DESC"
  ).all();

  const porNivel = db.prepare(
    "SELECT nivel_experiencia, COUNT(*) AS cantidad FROM inscripciones " +
    "GROUP BY nivel_experiencia ORDER BY cantidad DESC"
  ).all();

  res.json({ total, porTaller, porHorario, porModalidad, porNivel });
});

app.listen(PORT, () => {
  console.log(`Servidor disponible en http://localhost:${PORT}`);
});
