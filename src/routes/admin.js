/* ============================================================
   Panel de administración del blog (Módulos A–F).
   admin.js: login/sesión + listado de artículos + monta los sub-routers
   (artículos, categorías, configuración).
   ============================================================ */
import express, { Router } from "express";
import { query } from "../config/db.js";
import { saveUpload } from "../cms/uploads-store.js";
import {
  verifyPassword,
  createSession,
  destroySession,
  requireAuth,
  getUser,
  loginThrottle,
} from "../cms/auth.js";
import { adminLayout, esc, badge, fmt, stripTags } from "../cms/admin-ui.js";
import articulosRouter from "./admin-articulos.js";
import categoriasRouter from "./admin-categorias.js";
import configRouter from "./admin-config.js";

const router = Router();

const clientIp = (req) =>
  (req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "ip").trim();

function loginPage({ error = "" } = {}) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Ingresar · Panel SAMA</title>
  <link rel="stylesheet" href="/assets/css/admin.css">
</head>
<body class="adm adm-login-body">
  <form class="adm-login" method="post" action="/admin/login">
    <img src="/assets/img/logo-color.png" alt="SAMA Forwarding" width="150" height="53">
    <h1>Panel de administración</h1>
    ${error ? `<p class="adm-error">${esc(error)}</p>` : ""}
    <label>Correo
      <input type="email" name="email" autocomplete="username" required value="info@samaforwarding.com">
    </label>
    <label>Contraseña
      <input type="password" name="password" autocomplete="current-password" required autofocus>
    </label>
    <button type="submit" class="adm-btn adm-btn--primary">Ingresar</button>
  </form>
</body>
</html>`;
}

// ---- Autenticación (sin sesión) ----
router.get("/login", async (req, res, next) => {
  try {
    if (await getUser(req)) return res.redirect("/admin/");
    res.status(200).send(loginPage());
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const throttle = loginThrottle(clientIp(req));
    if (throttle.blocked) {
      return res.status(429).send(loginPage({ error: "Demasiados intentos. Esperá unos minutos e intentá de nuevo." }));
    }
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const { rows } = await query("SELECT id, password_hash FROM users WHERE email=$1", [email]);
    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      throttle.fail();
      return res.status(401).send(loginPage({ error: "Correo o contraseña incorrectos." }));
    }
    throttle.reset();
    await createSession(res, user.id);
    res.redirect("/admin/");
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    await destroySession(req, res);
    res.redirect("/admin/login");
  } catch (err) {
    next(err);
  }
});

// ---- A partir de acá, todo exige sesión ----
router.use(requireAuth());

// ---- POST /admin/upload — subir imagen (base64) → Postgres → /uploads/:id ----
const MAX_UPLOAD = 6 * 1024 * 1024; // 6 MB
router.post("/upload", express.json({ limit: "9mb" }), async (req, res, next) => {
  try {
    const { filename, mime, data } = req.body || {};
    if (!data || !/^image\/(png|jpe?g|webp|gif|avif)$/i.test(mime || "")) {
      return res.status(400).json({ error: "El archivo debe ser una imagen (PNG, JPG, WebP, GIF o AVIF)." });
    }
    const buf = Buffer.from(String(data), "base64");
    if (!buf.length) return res.status(400).json({ error: "Archivo vacío o corrupto." });
    if (buf.length > MAX_UPLOAD) return res.status(400).json({ error: "La imagen supera 6 MB." });

    // Optimización: convertir a WebP, cap de ancho 1600px y auto-orientar por EXIF.
    // sharp se importa acá (lazy): si no está disponible en el entorno, el
    // server igual arranca y se guarda el original (nunca se pierde el upload).
    let outBuf = buf, outMime = mime, outName = filename;
    try {
      const sharp = (await import("sharp")).default;
      outBuf = await sharp(buf, { animated: /gif|webp/i.test(mime) })
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      outMime = "image/webp";
      outName = (filename || "imagen").replace(/\.[^.]+$/, "") + ".webp";
    } catch (e) {
      console.warn("WebP/sharp no disponible, se guarda el original:", e.message);
    }

    const id = await saveUpload(outBuf, outMime, outName);
    res.json({ url: `/uploads/${id}`, id });
  } catch (err) {
    next(err);
  }
});

// ---- Dashboard: listado de artículos (Módulo C) ----
router.get("/", async (req, res, next) => {
  try {
    const estado = ["publicado", "borrador", "eliminado"].includes(req.query.estado) ? req.query.estado : null;

    const { rows: articles } = await query(
      `SELECT a.id, a.titulo, a.slug, a.estado, a.contenido_html, a.imagen_destacada, a.imagen_alt,
              COALESCE(a.publicado_at, a.created_at) AS fecha,
              COALESCE(
                (SELECT string_agg(c.nombre, ', ' ORDER BY c.nombre)
                   FROM article_categories ac JOIN categories c ON c.id = ac.category_id
                  WHERE ac.article_id = a.id), '—') AS categorias
         FROM articles a
        ${estado ? "WHERE a.estado = $1" : ""}
        ORDER BY fecha DESC`,
      estado ? [estado] : []
    );

    const counts = await query("SELECT estado, COUNT(*)::int AS n FROM articles GROUP BY estado");
    const cmap = Object.fromEntries(counts.rows.map((r) => [r.estado, r.n]));
    const total = Object.values(cmap).reduce((a, b) => a + b, 0);

    const filtro = (key, label, n) =>
      `<a class="adm-filter${(estado || "todos") === key ? " is-active" : ""}" href="/admin/${
        key === "todos" ? "" : "?estado=" + key
      }">${label} <span>${n}</span></a>`;

    const rowsHtml = articles.length
      ? articles
          .map((a) => {
            const thumb = a.imagen_destacada
              ? `<img src="${esc(a.imagen_destacada)}" alt="${esc(a.imagen_alt || "")}" loading="lazy">`
              : `<span class="adm-thumb--empty"></span>`;
            const ex = stripTags(a.contenido_html).slice(0, 110);
            const verWeb =
              a.estado === "publicado"
                ? `<a href="/blog/${esc(a.slug)}/" target="_blank" rel="noopener">Ver</a>`
                : "";
            return `<tr>
        <td class="adm-cell-thumb"><a class="adm-thumb" href="/admin/articulos/${a.id}/editar">${thumb}</a></td>
        <td>
          <a class="adm-art-title" href="/admin/articulos/${a.id}/editar">${esc(a.titulo)}</a>
          <span class="adm-art-ex">${esc(ex)}${ex.length >= 110 ? "…" : ""}</span>
        </td>
        <td>${esc(a.categorias)}</td>
        <td>${badge(a.estado)}</td>
        <td class="adm-cell-date">${fmt(a.fecha)}</td>
        <td class="adm-cell-acc">
          <a href="/admin/articulos/${a.id}/editar">Editar</a>
          ${verWeb}
        </td>
      </tr>`;
          })
          .join("\n")
      : `<tr><td colspan="6" class="adm-empty">No hay artículos${estado ? " en este estado" : ""}.</td></tr>`;

    const body = `
    <header class="adm-head">
      <h1>Artículos</h1>
      <a class="adm-btn adm-btn--primary" href="/admin/articulos/nuevo">+ Nuevo artículo</a>
    </header>
    <div class="adm-filters">
      ${filtro("todos", "Todos", total)}
      ${filtro("publicado", "Publicados", cmap.publicado || 0)}
      ${filtro("borrador", "Borradores", cmap.borrador || 0)}
      ${filtro("eliminado", "Eliminados", cmap.eliminado || 0)}
    </div>
    <div class="adm-tablewrap">
      <table class="adm-table">
        <thead><tr><th></th><th>Título</th><th>Categorías</th><th>Estado</th><th>Fecha</th><th></th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>`;

    res.status(200).send(adminLayout({ title: "Artículos", active: "articulos", user: req.user, body }));
  } catch (err) {
    next(err);
  }
});

// ---- Sub-secciones ----
router.use("/articulos", articulosRouter);
router.use("/categorias", categoriasRouter);
router.use("/configuracion", configRouter);

export default router;
