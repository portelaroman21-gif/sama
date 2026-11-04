/* ============================================================
   Categorías (Módulo E): CRUD + jerarquía padre/hijo + conteo.
   Alimentan el filtro del blog público.
   ============================================================ */
import { Router } from "express";
import { query } from "../config/db.js";
import { slugify } from "../cms/slug.js";
import { adminLayout, esc } from "../cms/admin-ui.js";

const router = Router();

async function loadCategories() {
  const { rows } = await query(
    `SELECT c.id, c.nombre, c.slug, c.parent_id,
            (SELECT COUNT(*)::int FROM article_categories ac WHERE ac.category_id = c.id) AS n
       FROM categories c
      ORDER BY c.nombre`
  );
  return rows;
}

async function uniqueSlug(base, excludeId = null) {
  const root = base || "categoria";
  let slug = root;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { rows } = await query(
      "SELECT id FROM categories WHERE slug=$1 AND ($2::int IS NULL OR id <> $2)",
      [slug, excludeId]
    );
    if (!rows.length) return slug;
    i += 1;
    slug = `${root}-${i}`;
  }
}

function page({ cats, editing, user, error = "" }) {
  const padres = cats.filter((c) => !c.parent_id);
  const parentOptions = padres
    .filter((p) => !editing || p.id !== editing.id)
    .map((p) => `<option value="${p.id}"${editing && editing.parent_id === p.id ? " selected" : ""}>${esc(p.nombre)}</option>`)
    .join("");

  const nameOf = (id) => cats.find((c) => c.id === id)?.nombre || "—";

  const rowsHtml = cats.length
    ? padres
        .map((p) => {
          const hijos = cats.filter((c) => c.parent_id === p.id);
          const rowHtml = (c, isHijo) => `<tr${isHijo ? ' class="adm-cat-hijo"' : ""}>
        <td>${isHijo ? "↳ " : ""}<strong>${esc(c.nombre)}</strong></td>
        <td><code>/blog/categoria/${esc(c.slug)}/</code></td>
        <td>${isHijo ? esc(nameOf(c.parent_id)) : "—"}</td>
        <td>${c.n}</td>
        <td class="adm-cell-acc">
          <a href="/admin/categorias?edit=${c.id}">Editar</a>
          <form method="post" action="/admin/categorias/${c.id}/eliminar" style="display:inline" data-confirm-form>
            <button type="submit" class="adm-linkbtn adm-linkbtn--danger" data-confirm="¿Eliminar la categoría «${esc(c.nombre)}»? Los artículos no se borran, solo se desasocian.">Eliminar</button>
          </form>
        </td>
      </tr>`;
          return rowHtml(p, false) + hijos.map((h) => rowHtml(h, true)).join("");
        })
        .join("")
    : `<tr><td colspan="5" class="adm-empty">Todavía no hay categorías.</td></tr>`;

  const body = `
    <header class="adm-head"><h1>Categorías</h1></header>
    ${error ? `<div class="adm-error">${esc(error)}</div>` : ""}
    <div class="adm-cat-layout">
      <form class="adm-panel adm-cat-form" method="post" action="/admin/categorias">
        <h2>${editing ? "Editar categoría" : "Nueva categoría"}</h2>
        ${editing ? `<input type="hidden" name="id" value="${editing.id}">` : ""}
        <label class="adm-field">Nombre
          <input type="text" name="nombre" required value="${esc(editing?.nombre || "")}" placeholder="Ej: Logística de importación">
        </label>
        <label class="adm-field">URL (slug) <span class="adm-req">opcional</span>
          <input type="text" name="slug" value="${esc(editing?.slug || "")}" placeholder="se-genera-del-nombre">
        </label>
        <label class="adm-field">Categoría padre
          <select name="parent_id">
            <option value="">— Ninguna (es categoría padre) —</option>
            ${parentOptions}
          </select>
        </label>
        <div class="adm-editor-actions">
          <button type="submit" class="adm-btn adm-btn--primary">${editing ? "Guardar cambios" : "Crear categoría"}</button>
          ${editing ? `<a class="adm-btn" href="/admin/categorias">Cancelar</a>` : ""}
        </div>
      </form>

      <div class="adm-tablewrap adm-cat-table">
        <table class="adm-table">
          <thead><tr><th>Nombre</th><th>URL</th><th>Padre</th><th>Artículos</th><th></th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>`;

  return adminLayout({ title: "Categorías", active: "categorias", user, body });
}

// ---- GET /admin/categorias ----
router.get("/", async (req, res, next) => {
  try {
    const cats = await loadCategories();
    const editing = req.query.edit ? cats.find((c) => c.id === Number(req.query.edit)) : null;
    res.send(page({ cats, editing, user: req.user }));
  } catch (err) {
    next(err);
  }
});

// ---- POST /admin/categorias  (crear / editar) ----
router.post("/", async (req, res, next) => {
  try {
    const id = req.body.id ? Number(req.body.id) : null;
    const nombre = String(req.body.nombre || "").trim();
    const parentId = req.body.parent_id ? Number(req.body.parent_id) : null;
    if (!nombre) {
      const cats = await loadCategories();
      return res.send(page({ cats, editing: id ? cats.find((c) => c.id === id) : null, user: req.user, error: "El nombre es obligatorio." }));
    }
    const slug = await uniqueSlug(slugify(req.body.slug || nombre), id);
    if (id) {
      await query("UPDATE categories SET nombre=$1, slug=$2, parent_id=$3 WHERE id=$4", [nombre, slug, parentId, id]);
    } else {
      await query("INSERT INTO categories(nombre, slug, parent_id) VALUES ($1,$2,$3)", [nombre, slug, parentId]);
    }
    res.redirect("/admin/categorias");
  } catch (err) {
    next(err);
  }
});

// ---- POST /admin/categorias/:id/eliminar  (borrado real; los artículos no se tocan) ----
router.post("/:id/eliminar", async (req, res, next) => {
  try {
    // Al borrar, sus subcategorías quedan sin padre (parent_id → NULL por FK ON DELETE SET NULL).
    await query("DELETE FROM categories WHERE id=$1", [Number(req.params.id)]);
    res.redirect("/admin/categorias");
  } catch (err) {
    next(err);
  }
});

export default router;
