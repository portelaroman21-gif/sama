/* Almacenamiento de imágenes subidas desde el editor.
   Se guardan en Postgres (bytea) → persisten en el volumen de la BD, sin
   depender del filesystem efímero de Railway. Se sirven por /uploads/:id. */
import { query } from "../config/db.js";

export async function saveUpload(buf, mime, filename) {
  const { rows } = await query(
    "INSERT INTO uploads(filename, mime, bytes, size) VALUES ($1,$2,$3,$4) RETURNING id",
    [filename || null, mime, buf, buf.length]
  );
  return rows[0].id;
}

export async function getUpload(id) {
  const { rows } = await query("SELECT mime, bytes FROM uploads WHERE id=$1", [id]);
  return rows[0] || null;
}
