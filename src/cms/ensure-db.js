/* ============================================================
   Arranque de la BD del blog.
   - Aplica schema.sql (idempotente) en cada boot → auto-migra el deploy.
   - Siembra el usuario admin inicial (info@samaforwarding.com / admin123).
     ⚠ "admin123" es SOLO desarrollo. Cambiarla desde Configuración antes de prod.
   - Siembra 1 artículo de ejemplo si el blog está vacío (para verificar la web).
   Todo es seguro de correr varias veces (ON CONFLICT / chequeos previos).
   ============================================================ */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "../config/db.js";
import { hashPassword } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "..", "db", "schema.sql");

const ADMIN_EMAIL = "info@samaforwarding.com";
const ADMIN_PASS_DEV = "admin123"; // solo dev — se cambia en Configuración

export async function ensureDb() {
  const sql = readFileSync(schemaPath, "utf8");
  await query(sql);
  await seedAdmin();
  await seedSample();
}

async function seedAdmin() {
  const { rows } = await query("SELECT id FROM users WHERE email=$1", [ADMIN_EMAIL]);
  if (rows.length) return;
  await query(
    "INSERT INTO users(email, password_hash, nombre, rol) VALUES ($1,$2,$3,'admin')",
    [ADMIN_EMAIL, hashPassword(ADMIN_PASS_DEV), "Sama Forwarding"]
  );
  console.log(`✓ Usuario admin sembrado: ${ADMIN_EMAIL} (clave dev: ${ADMIN_PASS_DEV})`);
}

async function seedSample() {
  const { rows } = await query("SELECT COUNT(*)::int AS n FROM articles");
  if (rows[0].n > 0) return;

  const cat = await query(
    `INSERT INTO categories(nombre, slug) VALUES ($1,$2)
       ON CONFLICT (slug) DO UPDATE SET nombre = EXCLUDED.nombre
     RETURNING id`,
    ["Logística de importación", "logistica-de-importacion"]
  );
  const catId = cat.rows[0].id;

  const contenido = `
<h2>Por qué el corredor China–Manzanillo–Bajío cambia tu operación</h2>
<p>Importar desde China al Bajío no es solo mover un contenedor: es una cadena de decisiones donde cada día y cada trámite impacta tu costo total. En SAMA operamos este corredor de punta a punta, con un tránsito marítimo de <strong>21 días</strong> y un promedio puerta a puerta de <strong>≈ 28 días</strong>.</p>
<h3>Los tres puntos donde se pierde tiempo</h3>
<p>La mayoría de las demoras no ocurren en el mar, sino en tierra: la coordinación en origen, el despacho en Manzanillo y el last mile al Bajío. Un forwarder que controla los tres evita los sobrecostos de almacenaje y las paradas de planta.</p>
<p>Este es un artículo de ejemplo sembrado automáticamente para verificar el blog. Se puede editar o eliminar desde el panel de administración.</p>`.trim();

  const art = await query(
    `INSERT INTO articles
       (titulo, slug, descripcion, keyword, contenido_html, imagen_destacada, imagen_alt, imagen_caption, estado, publicado_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'publicado', now())
     RETURNING id`,
    [
      "El corredor China–Manzanillo–Bajío, explicado",
      "corredor-china-manzanillo-bajio-explicado",
      "Cómo funciona el corredor de importación China–Manzanillo–Bajío y dónde se gana (o se pierde) tiempo y dinero en cada etapa.",
      "corredor china manzanillo bajío",
      contenido,
      "/assets/img/hero-corredor.jpg",
      "Mapa del corredor logístico China–Manzanillo–Bajío",
      "Ruta marítima y terrestre del corredor operado por SAMA Forwarding.",
    ]
  );

  await query(
    "INSERT INTO article_categories(article_id, category_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [art.rows[0].id, catId]
  );
  console.log("✓ Artículo de ejemplo sembrado.");
}
