const path = require("path");
const { DatabaseSync } = require("node:sqlite");

// Abre registro_taller.db junto a este archivo, o lo crea si aún no existe.
// DB_ARCHIVO permite usar otra base, por ejemplo para pruebas.
const archivo = process.env.DB_ARCHIVO || path.join(__dirname, "registro_taller.db");
const db = new DatabaseSync(archivo);

// Crea la tabla al iniciar si todavía no existe.
db.exec(
  "CREATE TABLE IF NOT EXISTS inscripciones (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "nombre TEXT NOT NULL, " +
    "correo TEXT NOT NULL, " +
    "telefono TEXT NOT NULL, " +
    "taller TEXT NOT NULL, " +
    "horario TEXT NOT NULL, " +
    "modalidad TEXT NOT NULL, " +
    "nivel_experiencia TEXT NOT NULL, " +
    "fecha_registro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP" +
  ")"
);

module.exports = db;
