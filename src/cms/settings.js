/* ============================================================
   Configuración global del blog (tabla settings).
   Tipografía como TOKENS CSS (Módulo F): se guardan las variables y se
   inyectan en el <style> del blog público y del editor. Como el HTML de
   los artículos NO tiene estilos inline, cambiar un token cambia TODOS
   los artículos (nuevos y existentes) automáticamente → eso ES "Cambiar
   todo", sin reprocesar cada artículo.
   ============================================================ */
import { query } from "../config/db.js";

// clave de settings → variable CSS que consume blog.css
export const TIPO_VARS = {
  tipo_font_head: "--blog-font-head",
  tipo_font_body: "--blog-font-body",
  tipo_font_desc: "--blog-font-desc",
  tipo_size_body: "--blog-size-body",
  tipo_size_h2: "--blog-size-h2",
  tipo_size_h3: "--blog-size-h3",
};
export const TIPO_KEYS = Object.keys(TIPO_VARS);

// Opciones de familia tipográfica ofrecidas en el panel.
export const FONT_OPTIONS = [
  { value: "", label: "Predeterminada del sitio (Montserrat)" },
  { value: "Montserrat, system-ui, sans-serif", label: "Montserrat" },
  { value: "system-ui, -apple-system, sans-serif", label: "Sistema (sans-serif)" },
  { value: "Georgia, 'Times New Roman', serif", label: "Georgia (serif)" },
  { value: "'Courier New', monospace", label: "Monoespaciada" },
];

export async function getSettings(prefix = null) {
  const { rows } = prefix
    ? await query("SELECT clave, valor FROM settings WHERE clave LIKE $1", [prefix + "%"])
    : await query("SELECT clave, valor FROM settings");
  const out = {};
  for (const r of rows) out[r.clave] = r.valor;
  return out;
}

export async function setSetting(clave, valor) {
  await query(
    "INSERT INTO settings(clave, valor) VALUES ($1,$2) ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor",
    [clave, valor]
  );
}

// Devuelve solo los tokens con valor (los vacíos usan el fallback del CSS).
export async function getTypography() {
  const s = await getSettings("tipo_");
  const out = {};
  for (const k of TIPO_KEYS) if (s[k]) out[k] = s[k];
  return out;
}

// Evita romper el bloque CSS o inyectar reglas: sin ; { } < > y acotado.
function cssSafe(v) {
  return String(v).replace(/[;{}<>]/g, "").trim().slice(0, 80);
}

// Genera el <style> con las variables definidas (o "" si no hay ninguna).
export function typographyStyleTag(tipo) {
  const decls = Object.entries(tipo)
    .filter(([k, v]) => TIPO_VARS[k] && v)
    .map(([k, v]) => `${TIPO_VARS[k]}:${cssSafe(v)}`);
  return decls.length ? `<style>:root{${decls.join(";")}}</style>` : "";
}
