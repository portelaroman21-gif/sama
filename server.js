/* ============================================================
   SAMA FORWARDING — Servidor (Node.js + Express)
   - Sirve el frontend estático de /public (cada página = carpeta/index.html)
   - Expone la API del backend (formularios, blog, panel) bajo /api
   - Devuelve 404 REAL (no 200) con la página de rescate
   Agnóstico del hosting: corre igual en Railway o en el host final.
   ============================================================ */
import express from "express";
import compression from "compression";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

import leadsRouter from "./src/routes/leads.js";
import blogRouter from "./src/routes/blog.js";
import adminRouter from "./src/routes/admin.js";
import { ensureDb } from "./src/cms/ensure-db.js";
import { renderBlogIndex, renderArticle } from "./src/cms/blog-render.mjs";
import { getUpload } from "./src/cms/uploads-store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = process.env.PORT || 3000;

const app = express();
app.disable("x-powered-by");

// Seguridad + performance. CSP relajada en wireframe (usa estilos inline).
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
// JSON con límite chico (seguridad) EXCEPTO la subida de imágenes, que usa
// su propio parser de mayor límite en la ruta /admin/upload. Si el global
// corriera ahí, rechazaría cualquier foto > 100 KB con error.
const jsonSmall = express.json({ limit: "100kb" });
app.use((req, res, next) =>
  req.path === "/admin/upload" ? next() : jsonSmall(req, res, next)
);
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Healthcheck para Railway
app.get("/healthz", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ---- API del backend ----
app.use("/api/leads", leadsRouter);   // Módulo 10 y 12: formularios → BD → email
app.use("/api/blog", blogRouter);     // Módulo 8/9: artículos
app.use("/admin", adminRouter);       // Módulo 9/12: panel con login

// ---- Imágenes subidas desde el editor (servidas desde Postgres) ----
app.get("/uploads/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return next();
    const up = await getUpload(id);
    if (!up) return next();
    res.setHeader("Content-Type", up.mime);
    res.setHeader("Cache-Control", "public, max-age=2592000"); // 30 días
    res.send(up.bytes);
  } catch (err) { next(err); }
});

// ---- Blog público: renderizado en el SERVIDOR desde Postgres (Módulos G/H) ----
// Se registra ANTES del estático para que gane sobre cualquier /blog/*.html viejo.
// Orden: índice → categoría → artículo (la ruta de categoría es más específica).
app.get(["/blog", "/blog/"], async (_req, res, next) => {
  try {
    res.type("html").send(await renderBlogIndex({}));
  } catch (err) { next(err); }
});
app.get(["/blog/categoria/:slug", "/blog/categoria/:slug/"], async (req, res, next) => {
  try {
    const html = await renderBlogIndex({ categoriaSlug: req.params.slug });
    if (!html) return next();               // categoría inexistente → 404
    res.type("html").send(html);
  } catch (err) { next(err); }
});
app.get(["/blog/:slug", "/blog/:slug/"], async (req, res, next) => {
  try {
    const html = await renderArticle(req.params.slug);
    if (!html) return next();               // no existe o no está publicado → 404
    res.type("html").send(html);
  } catch (err) { next(err); }
});

// ---- Blog público en inglés (mismo contenido, chrome EN) ----
app.get(["/en/blog", "/en/blog/"], async (_req, res, next) => {
  try {
    res.type("html").send(await renderBlogIndex({ lang: "en" }));
  } catch (err) { next(err); }
});
app.get(["/en/blog/categoria/:slug", "/en/blog/categoria/:slug/"], async (req, res, next) => {
  try {
    const html = await renderBlogIndex({ categoriaSlug: req.params.slug, lang: "en" });
    if (!html) return next();
    res.type("html").send(html);
  } catch (err) { next(err); }
});
app.get(["/en/blog/:slug", "/en/blog/:slug/"], async (req, res, next) => {
  try {
    const html = await renderArticle(req.params.slug, "en");
    if (!html) return next();
    res.type("html").send(html);
  } catch (err) { next(err); }
});

// ---- Frontend estático ----
// extensions:["html"] permite que /servicios/ resuelva a /servicios/index.html
// Cache:
//   - CSS/JS: no-cache + etag. El browser revalida en cada request; si no
//     cambió (etag match), Express devuelve 304 y no se re-baja. Esto evita
//     que un deploy nuevo conviva con CSS/JS viejos cacheados (problema típico
//     de "immutable" sin hash en el nombre del archivo).
//   - Fuentes/imágenes: cache largo (sus contenidos casi nunca cambian).
app.use(express.static(PUBLIC_DIR, {
  extensions: ["html"],
  etag: true,
  lastModified: true,
  setHeaders(res, filePath) {
    if (/\.(css|js)$/.test(filePath)) {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
    } else if (/\.(woff2|webp|avif|svg|png|jpg|mp4)$/.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=2592000"); // 30 días, sin immutable
    }
  },
}));

// ---- 404 real (status 404, no 200) con página de rescate ----
app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) return res.sendFile(path.join(PUBLIC_DIR, "404.html"));
  res.json({ error: "Not found" });
});

// ---- Manejo de errores (evita que una caída de BD cuelgue la request) ----
app.use((err, req, res, _next) => {
  console.error("Error:", err.code || "", err.message || err);
  if (res.headersSent) return;
  res.status(500);
  if (req.accepts("html")) {
    return res.send("<!doctype html><meta charset=utf-8><title>Error</title><h1>Error interno</h1><p>Intentá de nuevo en unos minutos.</p>");
  }
  res.json({ error: "Internal error" });
});

// Aplica schema + seed en el arranque (auto-migra el deploy). No bloquea el
// listen: si la BD no está disponible, el sitio estático igual queda arriba.
ensureDb()
  .then(() => console.log("✓ BD lista (schema + seed)."))
  .catch((e) => console.warn("⚠ BD no disponible al arrancar: code=" + (e.code || "?") + " msg=" + (e.message || "(vacío)")));

app.listen(PORT, () => {
  console.log(`SAMA Forwarding escuchando en http://localhost:${PORT}`);
});
