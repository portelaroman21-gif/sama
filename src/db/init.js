/* Aplica schema.sql contra la BD apuntada por DATABASE_URL.
   Uso: npm run db:init  */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sql = readFileSync(path.join(__dirname, "schema.sql"), "utf8");

try {
  await pool.query(sql);
  console.log("✓ Esquema aplicado correctamente.");
} catch (err) {
  console.error("✗ Error aplicando el esquema:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
