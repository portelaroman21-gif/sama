/* ============================================================
   Blog público — renderizado en el SERVIDOR (Módulos G y H).
   Bilingüe: mismo contenido de artículo (idioma de carga), con el
   "chrome" de la página (hero, breadcrumb, autor, relacionados, fechas)
   en ES o EN según la ruta (/blog/ vs /en/blog/).
   Solo se muestran artículos en estado 'publicado'.
   ============================================================ */
import { layout, esc, breadcrumb } from "../templates.mjs";
import { site } from "../content/site.mjs";
import { query } from "../config/db.js";
import { getTypography, typographyStyleTag } from "./settings.js";

const BLOG_CSS = '<link rel="stylesheet" href="/assets/css/blog.css">';

async function blogHead() {
  return BLOG_CSS + typographyStyleTag(await getTypography());
}

// URLs por idioma (mismo slug; el prefijo /en/ hace de switch de idioma).
const articleUrl = (slug, lang) => (lang === "en" ? `/en/blog/${slug}/` : `/blog/${slug}/`);
const catUrl = (slug, lang) => (lang === "en" ? `/en/blog/categoria/${slug}/` : `/blog/categoria/${slug}/`);

const fmtDate = (d, lang) => {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-MX", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
  } catch {
    return "";
  }
};
const isoAttr = (d) => (d ? ` datetime="${new Date(d).toISOString()}"` : "");
const stripTags = (html = "") => String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const excerpt = (article, n = 160) => {
  const base = article.descripcion || stripTags(article.contenido_html);
  return base.length > n ? base.slice(0, n).trim() + "…" : base;
};

// Strings de UI del blog por idioma.
const T = {
  es: {
    crumbHome: "Inicio", crumbBlog: "Blog",
    heroLabel: "Blog · Recursos", heroH1: "Recursos de logística de importación",
    heroP: "Análisis prácticos del corredor China–Manzanillo–Bajío para equipos de compras, logística y operaciones.",
    chipTodos: "Todos", empty: "Todavía no hay artículos publicados", emptyCat: " en esta categoría",
    titIndex: "Blog · Recursos de logística de importación",
    descIndex: "Guías y análisis sobre importación desde China al Bajío por el corredor Manzanillo: costos, tiempos y control operativo.",
    descCat: (n) => `Artículos de SAMA Forwarding sobre ${n.toLowerCase()}.`,
    autorRol: "Directora General, Sama Forwarding", seguir: "Seguí leyendo",
  },
  en: {
    crumbHome: "Home", crumbBlog: "Blog",
    heroLabel: "Blog · Resources", heroH1: "Import logistics resources",
    heroP: "Practical analysis of the China–Manzanillo–Bajío corridor for procurement, logistics, and operations teams.",
    chipTodos: "All", empty: "There are no published articles yet", emptyCat: " in this category",
    titIndex: "Blog · Import logistics resources",
    descIndex: "Guides and analysis on importing from China to the Bajío via the Manzanillo corridor: costs, timelines, and operational control.",
    descCat: (n) => `SAMA Forwarding articles on ${n.toLowerCase()}.`,
    autorRol: "General Manager, Sama Forwarding", seguir: "Keep reading",
  },
};

// ---- Consultas ----
async function categoriesForArticles(ids) {
  if (!ids.length) return new Map();
  const { rows } = await query(
    `SELECT ac.article_id, c.id, c.nombre, c.slug
       FROM article_categories ac JOIN categories c ON c.id = ac.category_id
      WHERE ac.article_id = ANY($1) ORDER BY c.nombre`,
    [ids]
  );
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.article_id)) map.set(r.article_id, []);
    map.get(r.article_id).push({ id: r.id, nombre: r.nombre, slug: r.slug });
  }
  return map;
}

async function allCategoriesWithCount() {
  const { rows } = await query(
    `SELECT c.id, c.nombre, c.slug, COUNT(a.id)::int AS n
       FROM categories c
       LEFT JOIN article_categories ac ON ac.category_id = c.id
       LEFT JOIN articles a ON a.id = ac.article_id AND a.estado = 'publicado'
      GROUP BY c.id HAVING COUNT(a.id) > 0 ORDER BY c.nombre`
  );
  return rows;
}

// ---- LISTADO /blog/ (opcionalmente filtrado por categoría) ----
export async function renderBlogIndex({ categoriaSlug = null, lang = "es" } = {}) {
  const t = T[lang] || T.es;
  let cat = null;
  if (categoriaSlug) {
    const r = await query("SELECT id, nombre, slug FROM categories WHERE slug=$1", [categoriaSlug]);
    if (!r.rows.length) return null;
    cat = r.rows[0];
  }

  const { rows: articles } = categoriaSlug
    ? await query(
        `SELECT a.id, a.titulo, a.slug, a.descripcion, a.contenido_html, a.imagen_destacada, a.imagen_alt, a.publicado_at
           FROM articles a JOIN article_categories ac ON ac.article_id = a.id
          WHERE a.estado = 'publicado' AND ac.category_id = $1 ORDER BY a.publicado_at DESC`,
        [cat.id]
      )
    : await query(
        `SELECT id, titulo, slug, descripcion, contenido_html, imagen_destacada, imagen_alt, publicado_at
           FROM articles WHERE estado = 'publicado' ORDER BY publicado_at DESC`
      );

  const catMap = await categoriesForArticles(articles.map((a) => a.id));
  const cats = await allCategoriesWithCount();

  const chips =
    `<a class="blog-chip${categoriaSlug ? "" : " is-active"}" href="${lang === "en" ? "/en/blog/" : "/blog/"}">${esc(t.chipTodos)}</a>` +
    cats.map((c) => `<a class="blog-chip${c.slug === categoriaSlug ? " is-active" : ""}" href="${catUrl(c.slug, lang)}">${esc(c.nombre)} <span>${c.n}</span></a>`).join("");

  const cards = articles.length
    ? articles.map((a) => {
        const acats = catMap.get(a.id) || [];
        const catLabel = acats.length ? `<span class="blog-card-cat">${esc(acats[0].nombre)}</span>` : "";
        const img = a.imagen_destacada
          ? `<img src="${esc(a.imagen_destacada)}" alt="${esc(a.imagen_alt || a.titulo)}" loading="lazy" width="400" height="225">`
          : "";
        return `<article class="blog-card">
      <a class="blog-card-media" href="${articleUrl(a.slug, lang)}">${img}</a>
      <div class="blog-card-body">
        ${catLabel}
        <h2 class="blog-card-title"><a href="${articleUrl(a.slug, lang)}">${esc(a.titulo)}</a></h2>
        <p class="blog-card-excerpt">${esc(excerpt(a))}</p>
        <p class="blog-card-meta"><time${isoAttr(a.publicado_at)}>${fmtDate(a.publicado_at, lang)}</time></p>
      </div>
    </article>`;
      }).join("\n")
    : `<p class="blog-empty">${esc(t.empty)}${cat ? esc(t.emptyCat) : ""}.</p>`;

  const titulo = cat ? `Blog — ${cat.nombre}` : t.titIndex;
  const desc = cat ? t.descCat(cat.nombre) : t.descIndex;
  const canonical = cat ? catUrl(cat.slug, lang) : lang === "en" ? "/en/blog/" : "/blog/";

  const main = `
  ${breadcrumb(
    cat
      ? [{ label: t.crumbHome, href: lang === "en" ? "/en/" : "/" }, { label: t.crumbBlog, href: lang === "en" ? "/en/blog/" : "/blog/" }, { label: cat.nombre }]
      : [{ label: t.crumbHome, href: lang === "en" ? "/en/" : "/" }, { label: t.crumbBlog }]
  )}
  <section class="blog-hero">
    <div class="container">
      <span class="label">${esc(t.heroLabel)}</span>
      <h1>${cat ? esc(cat.nombre) : esc(t.heroH1)}</h1>
      <p>${esc(t.heroP)}</p>
    </div>
  </section>
  <section class="blog-list-wrap">
    <div class="container">
      <nav class="blog-chips" aria-label="${lang === "en" ? "Blog categories" : "Categorías del blog"}">${chips}</nav>
      <div class="blog-grid">${cards}</div>
    </div>
  </section>`;

  return layout({
    title: `${titulo} · SAMA Forwarding`,
    description: desc,
    canonical,
    bodyClass: "page-blog",
    head: await blogHead(),
    main,
    lang,
  });
}

// ---- ARTÍCULO /blog/:slug/ ----
export async function renderArticle(slug, lang = "es") {
  const t = T[lang] || T.es;
  const r = await query(
    `SELECT id, titulo, slug, descripcion, keyword, contenido_html, imagen_destacada, imagen_alt, imagen_caption, autor, publicado_at, updated_at
       FROM articles WHERE slug = $1 AND estado = 'publicado'`,
    [slug]
  );
  if (!r.rows.length) return null;
  const a = r.rows[0];

  const catMap = await categoriesForArticles([a.id]);
  const acats = catMap.get(a.id) || [];

  const { rows: related } = await query(
    `SELECT titulo, slug, imagen_destacada, imagen_alt, publicado_at
       FROM articles WHERE estado = 'publicado' AND id <> $1 ORDER BY publicado_at DESC LIMIT 3`,
    [a.id]
  );

  const url = `${site.dominio}${articleUrl(a.slug, lang)}`;
  const img = a.imagen_destacada ? `${site.dominio}${a.imagen_destacada}` : `${site.dominio}/assets/img/og-default.jpg`;
  const catLinks = acats.map((c) => `<a href="${catUrl(c.slug, lang)}" rel="category">${esc(c.nombre)}</a>`).join("");

  const figura = a.imagen_destacada
    ? `<figure class="art-hero-media">
        <img src="${esc(a.imagen_destacada)}" alt="${esc(a.imagen_alt || a.titulo)}" width="1200" height="675">
        ${a.imagen_caption ? `<figcaption>${esc(a.imagen_caption)}</figcaption>` : ""}
      </figure>`
    : "";

  const relatedHtml = related.length
    ? `<aside class="art-related">
        <h2>${esc(t.seguir)}</h2>
        <div class="blog-grid blog-grid--related">
          ${related.map((rel) => `<article class="blog-card">
            <a class="blog-card-media" href="${articleUrl(rel.slug, lang)}">${rel.imagen_destacada ? `<img src="${esc(rel.imagen_destacada)}" alt="${esc(rel.imagen_alt || rel.titulo)}" loading="lazy" width="400" height="225">` : ""}</a>
            <div class="blog-card-body">
              <h3 class="blog-card-title"><a href="${articleUrl(rel.slug, lang)}">${esc(rel.titulo)}</a></h3>
            </div>
          </article>`).join("")}
        </div>
      </aside>`
    : "";

  const main = `
  ${breadcrumb([
    { label: t.crumbHome, href: lang === "en" ? "/en/" : "/" },
    { label: t.crumbBlog, href: lang === "en" ? "/en/blog/" : "/blog/" },
    { label: a.titulo },
  ])}
  <article class="art">
    <div class="container art-container">
      <header class="art-head">
        ${acats.length ? `<p class="art-cats">${catLinks}</p>` : ""}
        <h1>${esc(a.titulo)}</h1>
        <div class="art-author">
          <img class="art-author-foto" src="/assets/img/equipo/andrea-vergara.jpg" alt="Andrea Vergara" width="52" height="52" loading="lazy">
          <div class="art-author-meta">
            <span class="art-author-name">${esc(a.autor || "Andrea Vergara")}</span>
            <span class="art-author-role">${esc(t.autorRol)}</span>
            <time class="art-author-date"${isoAttr(a.publicado_at)}>${fmtDate(a.publicado_at, lang)}</time>
          </div>
        </div>
      </header>
      ${figura}
      <div class="art-body rt">
        ${a.contenido_html || ""}
      </div>
      ${relatedHtml}
    </div>
  </article>`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.titulo,
    description: a.descripcion || excerpt(a),
    image: [img],
    author: { "@type": "Person", name: a.autor || "Andrea Vergara" },
    publisher: { "@type": "Organization", name: "SAMA Forwarding", logo: { "@type": "ImageObject", url: `${site.dominio}/assets/img/logo-color.png` } },
    datePublished: a.publicado_at ? new Date(a.publicado_at).toISOString() : undefined,
    dateModified: a.updated_at ? new Date(a.updated_at).toISOString() : undefined,
    mainEntityOfPage: url,
    inLanguage: lang,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.crumbHome, item: `${site.dominio}${lang === "en" ? "/en/" : "/"}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.dominio}${lang === "en" ? "/en/blog/" : "/blog/"}` },
      { "@type": "ListItem", position: 3, name: a.titulo, item: url },
    ],
  };

  return layout({
    title: `${a.titulo} · SAMA Forwarding`,
    description: a.descripcion || excerpt(a),
    canonical: articleUrl(a.slug, lang),
    bodyClass: "page-articulo",
    head: await blogHead(),
    schema: [articleSchema, breadcrumbSchema],
    main,
    lang,
  });
}
