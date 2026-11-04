/* ============================================================
   Artículos: editor + alta/edición + acciones de estado (Módulos C/D).
   Estados: borrador · publicado · eliminado (soft delete, nunca DELETE).
   ============================================================ */
import { Router } from "express";
import { query } from "../config/db.js";
import { slugify } from "../cms/slug.js";
import { sanitizeHtml } from "../cms/sanitize.js";
import { adminLayout, esc, stripTags } from "../cms/admin-ui.js";

const router = Router();

const QUILL_HEAD = `<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">`;
const EDITOR_SCRIPTS = `
  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
  <script src="/assets/js/admin-editor.js"></script>`;

// ---- Datos auxiliares ----
async function allCategoriesFlat() {
  const { rows } = await query(
    "SELECT id, nombre, slug, parent_id FROM categories ORDER BY nombre"
  );
  const padres = rows.filter((c) => !c.parent_id);
  const out = [];
  for (const p of padres) {
    out.push({ ...p, depth: 0 });
    for (const h of rows.filter((c) => c.parent_id === p.id)) out.push({ ...h, depth: 1 });
  }
  // categorías huérfanas (padre borrado) al final
  for (const c of rows) if (c.parent_id && !padres.some((p) => p.id === c.parent_id)) out.push({ ...c, depth: 1 });
  return out;
}

async function uniqueSlug(base, excludeId = null) {
  const root = base || "articulo";
  let slug = root;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { rows } = await query(
      "SELECT id FROM articles WHERE slug=$1 AND ($2::int IS NULL OR id <> $2)",
      [slug, excludeId]
    );
    if (!rows.length) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

async function setCategories(articleId, catIds) {
  await query("DELETE FROM article_categories WHERE article_id=$1", [articleId]);
  for (const cid of catIds) {
    await query(
      "INSERT INTO article_categories(article_id, category_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [articleId, cid]
    );
  }
}

function readForm(b = {}) {
  return {
    titulo: String(b.titulo || "").trim(),
    slug: slugify(b.slug || ""),
    descripcion: String(b.descripcion || "").trim(),
    keyword: String(b.keyword || "").trim(),
    imagen: String(b.imagen_destacada || "").trim(),
    alt: String(b.imagen_alt || "").trim(),
    caption: String(b.imagen_caption || "").trim(),
    contenido: sanitizeHtml(b.contenido_html || ""),
    categorias: [].concat(b.categorias || []).filter(Boolean).map(Number).filter(Number.isFinite),
    accion: String(b.accion || "guardar"),
  };
}

function validate(d) {
  const e = [];
  if (!d.titulo) e.push("El título es obligatorio.");
  if (d.accion === "publicar") {
    if (!stripTags(d.contenido)) e.push("No se puede publicar un artículo sin contenido.");
    if (d.imagen && !d.alt) e.push("La imagen destacada necesita texto ALT antes de publicar.");
  }
  return e;
}

// ---- Vista del editor ----
function editorPage({ art = {}, cats = [], selected = [], user, errors = [], ok = false, isNew = false }) {
  const sel = new Set(selected.map(Number));
  const catInputs = cats.length
    ? cats
        .map(
          (c) => `<label class="adm-check${c.depth ? " adm-check--hijo" : ""}">
        <input type="checkbox" name="categorias" value="${c.id}"${sel.has(c.id) ? " checked" : ""}>
        <span>${esc(c.nombre)}</span></label>`
        )
        .join("")
    : `<p class="adm-hint">No hay categorías. Creá algunas en <a href="/admin/categorias">Categorías</a>.</p>`;

  const estado = art.estado || "borrador";
  const isDraftLike = isNew || estado === "borrador";
  // Botón de guardar: su etiqueta y estilo dependen del estado actual.
  const saveClass = estado === "publicado" ? "adm-btn adm-btn--primary" : "adm-btn";
  const saveLabel = isDraftLike ? "Guardar borrador" : "Guardar cambios";
  const acciones = [`<button class="${saveClass}" name="accion" value="guardar" type="submit">${saveLabel}</button>`];
  if (estado !== "publicado")
    acciones.push(`<button class="adm-btn adm-btn--primary" name="accion" value="publicar" type="submit">Publicar</button>`);
  else
    acciones.push(`<button class="adm-btn" name="accion" value="despublicar" type="submit">Despublicar</button>`);
  if (estado === "eliminado")
    acciones.push(`<button class="adm-btn" name="accion" value="restaurar" type="submit">Restaurar</button>`);
  if (!isNew && estado !== "eliminado")
    acciones.push(`<button class="adm-btn adm-btn--danger" name="accion" value="eliminar" type="submit" data-confirm="¿Eliminar este artículo? Se oculta de la web pero queda guardado.">Eliminar</button>`);

  const verWeb =
    estado === "publicado" && art.slug
      ? `<a class="adm-verweb" href="/blog/${esc(art.slug)}/" target="_blank" rel="noopener">Ver en la web ↗</a>`
      : "";

  const alerts =
    (errors.length ? `<div class="adm-error">${errors.map(esc).join("<br>")}</div>` : "") +
    (ok ? `<div class="adm-ok">Guardado.</div>` : "");

  const body = `
  <form class="adm-editor" method="post" action="${isNew ? "/admin/articulos" : `/admin/articulos/${art.id}`}" data-editor>
    <header class="adm-head adm-head--editor">
      <div><a class="adm-back" href="/admin/">← Artículos</a><h1>${isNew ? "Nuevo artículo" : "Editar artículo"}</h1></div>
      <div class="adm-editor-actions">${verWeb}${acciones.join("")}</div>
    </header>
    ${alerts}
    <div class="adm-editor-grid">
      <div class="adm-editor-main">
        <input class="adm-titulo" type="text" name="titulo" placeholder="Título del artículo (H1)" value="${esc(art.titulo || "")}" data-titulo required>
        <div class="adm-quill-wrap">
          <div id="editor"></div>
        </div>
        <input type="hidden" name="contenido_html" data-contenido>
        <template data-contenido-inicial>${art.contenido_html || ""}</template>
      </div>

      <aside class="adm-editor-side">
        <div class="adm-panel">
          <h2>Estado</h2>
          <p class="adm-estado-row">${
            { publicado: "🟢 Publicado", borrador: "🟡 Borrador", eliminado: "🔴 Eliminado" }[estado] || estado
          }</p>
        </div>
        <div class="adm-panel">
          <h2>Categorías</h2>
          <div class="adm-checks">${catInputs}</div>
        </div>
        <div class="adm-panel">
          <h2>SEO</h2>
          <label class="adm-field">URL (slug)
            <span class="adm-slug"><em>/blog/</em><input type="text" name="slug" value="${esc(art.slug || "")}" data-slug placeholder="se-genera-del-titulo">/</span>
          </label>
          <label class="adm-field">Palabra clave
            <input type="text" name="keyword" value="${esc(art.keyword || "")}" placeholder="ej: corredor manzanillo bajío">
          </label>
          <label class="adm-field">Meta descripción
            <textarea name="descripcion" rows="3" maxlength="180" placeholder="Resumen para Google (máx. 160-180 caracteres)">${esc(art.descripcion || "")}</textarea>
          </label>
        </div>
        <div class="adm-panel">
          <h2>Imagen destacada</h2>
          <label class="adm-field">URL de la imagen
            <input type="text" name="imagen_destacada" value="${esc(art.imagen_destacada || "")}" placeholder="/assets/img/... o https://...">
          </label>
          <label class="adm-field">Texto ALT <span class="adm-req">(obligatorio para publicar)</span>
            <input type="text" name="imagen_alt" value="${esc(art.imagen_alt || "")}" placeholder="Describe la imagen">
          </label>
          <label class="adm-field">Pie de foto
            <input type="text" name="imagen_caption" value="${esc(art.imagen_caption || "")}" placeholder="Opcional">
          </label>
        </div>
      </aside>
    </div>
  </form>
  ${EDITOR_SCRIPTS}`;

  return adminLayout({
    title: isNew ? "Nuevo artículo" : "Editar artículo",
    active: "articulos",
    user,
    head: QUILL_HEAD,
    body,
  });
}

// ---- GET /admin/articulos/nuevo ----
router.get("/nuevo", async (req, res, next) => {
  try {
    res.send(editorPage({ cats: await allCategoriesFlat(), user: req.user, isNew: true }));
  } catch (err) {
    next(err);
  }
});

// ---- POST /admin/articulos  (crear) ----
router.post("/", async (req, res, next) => {
  try {
    const d = readForm(req.body);
    const errors = validate(d);
    if (errors.length) {
      return res.send(
        editorPage({
          art: {
            titulo: d.titulo, slug: d.slug, descripcion: d.descripcion, keyword: d.keyword,
            imagen_destacada: d.imagen, imagen_alt: d.alt, imagen_caption: d.caption,
            contenido_html: d.contenido, estado: "borrador",
          },
          cats: await allCategoriesFlat(), selected: d.categorias, user: req.user, errors, isNew: true,
        })
      );
    }
    const slug = await uniqueSlug(d.slug || slugify(d.titulo));
    const estado = d.accion === "publicar" ? "publicado" : "borrador";
    const { rows } = await query(
      `INSERT INTO articles
         (titulo, slug, descripcion, keyword, contenido_html, imagen_destacada, imagen_alt, imagen_caption, estado, publicado_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, CASE WHEN $9='publicado' THEN now() ELSE NULL END)
       RETURNING id`,
      [d.titulo, slug, d.descripcion, d.keyword, d.contenido, d.imagen, d.alt, d.caption, estado]
    );
    await setCategories(rows[0].id, d.categorias);
    res.redirect(`/admin/articulos/${rows[0].id}/editar?ok=1`);
  } catch (err) {
    next(err);
  }
});

// ---- GET /admin/articulos/:id/editar ----
router.get("/:id/editar", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await query("SELECT * FROM articles WHERE id=$1", [id]);
    if (!rows.length) return next();
    const selected = (
      await query("SELECT category_id FROM article_categories WHERE article_id=$1", [id])
    ).rows.map((r) => r.category_id);
    res.send(
      editorPage({
        art: rows[0],
        cats: await allCategoriesFlat(),
        selected,
        user: req.user,
        ok: req.query.ok === "1",
      })
    );
  } catch (err) {
    next(err);
  }
});

// ---- POST /admin/articulos/:id  (actualizar + acciones de estado) ----
router.post("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cur = await query("SELECT estado FROM articles WHERE id=$1", [id]);
    if (!cur.rows.length) return next();
    const d = readForm(req.body);

    let estado = cur.rows[0].estado;
    if (d.accion === "publicar") estado = "publicado";
    else if (d.accion === "despublicar") estado = "borrador";
    else if (d.accion === "restaurar") estado = "borrador";
    else if (d.accion === "eliminar") estado = "eliminado";

    const errors = validate({ ...d, accion: estado === "publicado" ? "publicar" : d.accion });
    if (errors.length && d.accion !== "eliminar") {
      const selected = (
        await query("SELECT category_id FROM article_categories WHERE article_id=$1", [id])
      ).rows.map((r) => r.category_id);
      return res.send(
        editorPage({
          art: {
            id, titulo: d.titulo, slug: d.slug, descripcion: d.descripcion, keyword: d.keyword,
            imagen_destacada: d.imagen, imagen_alt: d.alt, imagen_caption: d.caption,
            contenido_html: d.contenido, estado: cur.rows[0].estado,
          },
          cats: await allCategoriesFlat(), selected: d.categorias.length ? d.categorias : selected,
          user: req.user, errors,
        })
      );
    }

    const slug = await uniqueSlug(d.slug || slugify(d.titulo), id);
    await query(
      `UPDATE articles SET
         titulo=$1, slug=$2, descripcion=$3, keyword=$4, contenido_html=$5,
         imagen_destacada=$6, imagen_alt=$7, imagen_caption=$8, estado=$9,
         publicado_at = CASE WHEN $9='publicado' AND publicado_at IS NULL THEN now() ELSE publicado_at END,
         deleted_at   = CASE WHEN $9='eliminado' THEN now() ELSE NULL END,
         updated_at = now()
       WHERE id=$10`,
      [d.titulo, slug, d.descripcion, d.keyword, d.contenido, d.imagen, d.alt, d.caption, estado, id]
    );
    await setCategories(id, d.categorias);

    if (d.accion === "eliminar") return res.redirect("/admin/?estado=eliminado");
    res.redirect(`/admin/articulos/${id}/editar?ok=1`);
  } catch (err) {
    next(err);
  }
});

export default router;
