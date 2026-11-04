/* ============================================================
   build.mjs — mini SSG.
   Combina templates + contenido y escribe las páginas reales
   (todo inline en el HTML). Uso: npm run build

   Genera (lote AHORA del Plan de Ejecución):
   Home · Corredor · Servicios + 5 subpáginas · Nosotros · Casos + 3
   · Diagnóstico (visual) + gracias · Contacto (visual) + gracias · 404
   Diferido (no se genera acá): Blog (queda como stub de wireframe).
   ============================================================ */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { layout, breadcrumb, ctaCierre, esc, waLink } from "./src/templates.mjs";
import { site, industrias, industriasEn } from "./src/content/site.mjs";
import { rutas, rutaDe } from "./src/content/i18n.mjs";
import { home } from "./src/content/home.mjs";
import { corredor } from "./src/content/corredor.mjs";
import { serviciosMeta, serviciosMetaEn, servicios } from "./src/content/servicios.mjs";
import { nosotros } from "./src/content/equipo.mjs";
import { casos, casoBloques, casosMeta, casosMetaEn } from "./src/content/casos.mjs";
import { mapaCorredorHTML } from "./src/mapa-corredor.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "public");
const out = [];
function emit(route, html) {
  const file = route === "/" ? "index.html" : join(route.replace(/^\/|\/$/g, ""), "index.html");
  const abs = join(ROOT, file);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, html);
  out.push(route);
}
// Escribe un archivo en una ruta exacta (para /404.html, que NO es carpeta).
function emitFile(rel, html) {
  const abs = join(ROOT, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, html);
  out.push("/" + rel);
}

// ---- Helpers de marcado ----
// hero() admite fondo de imagen (bg) o video (video), con overlay azul profundo.
const hero = ({ label, h1, apoyo, sin = false, sub = "", bg = "", video = "", short = false }) => {
  const hasMedia = !!(bg || video);
  let media = "";
  if (video) {
    media = `<video class="hero-media" autoplay muted loop playsinline webkit-playsinline preload="auto"${bg ? ` poster="${esc(bg)}"` : ""}><source src="${esc(video)}" type="video/mp4"></video><div class="hero-overlay" aria-hidden="true"></div>`;
  } else if (bg) {
    media = `<img class="hero-media" src="${esc(bg)}" alt="" aria-hidden="true"><div class="hero-overlay" aria-hidden="true"></div>`;
  }
  const cls = "hero" + (sin ? " hero--plain" : "") + (hasMedia ? " hero--media" : "") + (short ? " hero--short" : "");
  return `
    <section class="${cls}">
      ${media}
      <div class="container hero-inner">
        ${label ? `<span class="label label--light">${esc(label)}</span>` : ""}
        <h1>${esc(h1)}</h1>
        ${apoyo ? `<p class="hero-apoyo">${esc(apoyo)}</p>` : ""}
        ${sub}
      </div>
    </section>`;
};

// Íconos SVG por industria (indicadores Home) y por paso del proceso.
const ICO_IND = {
  "Manufactura": '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M4 28V14l8 5V14l8 5V8l8 4v16z"/></svg>',
  "Autopartes": '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><circle cx="16" cy="16" r="6"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3"/></svg>',
  "Electrónica": '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="10" y="10" width="12" height="12" rx="1"/><path d="M14 4v6M18 4v6M14 22v6M18 22v6M4 14h6M4 18h6M22 14h6M22 18h6"/></svg>',
  "Retail": '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M7 10h18l-1.5 16h-15z"/><path d="M11 10a5 5 0 0 1 10 0"/></svg>',
  "Maquila": '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M4 28V12l8 6v-6l8 6V8h8v20z"/><path d="M24 13h2M24 18h2M24 23h2"/></svg>',
  "Construcción": '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M5 28V16a11 11 0 0 1 22 0M3 28h26M16 5v11"/><path d="M9 16a7 7 0 0 1 14 0"/></svg>',
};
const icoInd = (n) => ICO_IND[n] || ICO_IND["Manufactura"];
const ICO_PASO = {
  ruta: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6h14a5 5 0 0 1 0 10H14a5 5 0 0 0 0 10h14"/><circle cx="12" cy="6" r="3"/><circle cx="28" cy="26" r="3"/></svg>',
  radar: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="4"/><path d="M20 20a10 10 0 0 1 10-10M20 20a16 16 0 0 1 16-16"/><circle cx="20" cy="20" r="15"/></svg>',
  check: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="20" r="15"/><path d="M13 20l5 5 9-10"/></svg>',
};
const icoPaso = (k) => ICO_PASO[k] || ICO_PASO.check;

const mapEmbed = (variant, highlight = "") =>
  `<div class="corridor-wrap"><div data-corridor-map data-variant="${variant}"${highlight ? ` data-highlight="${highlight}"` : ""}></div></div>`;

// ---- Helpers de Schema.org (F26 — SEO técnico estático) ----
const D = site.dominio;
const direccionSchema = {
  "@type": "PostalAddress",
  streetAddress: "Calzada Central 290, Interior 406, Ciudad Granja",
  addressLocality: "Zapopan", addressRegion: "Jalisco",
  postalCode: "45010", addressCountry: "MX",
};
const ORG = {
  "@context": "https://schema.org", "@type": "Organization",
  name: site.nombre, url: D, logo: D + "/assets/img/logo.png",
  email: site.email, telephone: site.tel, address: direccionSchema,
};
const LOCALBIZ = {
  "@context": "https://schema.org", "@type": "LocalBusiness",
  name: site.nombre, url: D, image: D + "/assets/img/og-default.jpg",
  telephone: site.tel, email: site.email, address: direccionSchema,
  openingHours: "Mo-Fr 08:30-18:00", areaServed: "Zona del Bajío, México",
};
const aboutSchema = { "@context": "https://schema.org", "@type": "AboutPage", name: "Quiénes somos — " + site.nombre, url: D + "/nosotros/" };
function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem", position: i + 1, name: it.label,
      ...(it.href ? { item: D + it.href } : {}),
    })),
  };
}
function serviceSchema(name, description, serviceType, url) {
  return {
    "@context": "https://schema.org", "@type": "Service",
    name, description, serviceType,
    provider: { "@type": "Organization", name: site.nombre },
    areaServed: "Zona del Bajío, México",
    ...(url ? { url: D + url } : {}),
  };
}
function faqSchema(faq) {
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Íconos SVG inline a medida (outlined ~40px) por servicio — Design System.
const ICONOS = {
  mar: '<svg class="serv-ico" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 26l2-7h24l2 7"/><path d="M14 19V9h7l5 6"/><path d="M20 9v10"/><path d="M5 30c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/></svg>',
  aduana: '<svg class="serv-ico" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="6" width="22" height="28" rx="2"/><path d="M14 13h12M14 19h12M14 25h7"/><circle cx="27" cy="28" r="4"/></svg>',
  tierra: '<svg class="serv-ico" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h17v14H4z"/><path d="M21 17h7l4 5v4h-11z"/><circle cx="12" cy="28" r="3"/><circle cx="27" cy="28" r="3"/></svg>',
  puerto: '<svg class="serv-ico" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="18" width="11" height="8"/><rect x="18" y="18" width="11" height="8"/><rect x="12" y="26" width="11" height="8"/><path d="M6 34h28"/></svg>',
  destino: '<svg class="serv-ico" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 34V16l9-5 9 5v18"/><path d="M24 34V22l8 4v8"/><path d="M6 34h28"/><path d="M11 20h4M11 25h4"/></svg>',
};
const servIcon = (k) => ICONOS[k] || ICONOS.puerto;

// Card de servicio reutilizable (home + overview).
// v2: las subpáginas se eliminaron — TODAS las cards van a /servicios/.
// El Flete (core) se diferencia con fondo color principal, sin badge.
function servCard(s, { home = false, lang = "es" } = {}) {
  const cls = s.core ? " serv-card--core" : (s.prioritario ? " serv-card--prio" : "");
  const en = lang === "en";
  const nombre = en ? (s.nombreEn || s.nombre) : s.nombre;
  const txt = en
    ? (home ? (s.resumenHomeEn || s.resumenEn || s.resumen) : (s.resumenEn || s.resumen))
    : (home ? (s.resumenHome || s.resumen) : s.resumen);
  return `
        <a class="serv-card${cls}" href="${rutaDe("servicios", lang)}">
          <span class="serv-card-ico">${servIcon(s.icono)}</span>
          <h3>${esc(nombre)}</h3>
          <p>${esc(txt)}</p>
        </a>`;
}

// ============================================================
// HOME (Plan Maestro §2.1) — 7 secciones de funnel
// ============================================================
function buildHome(lang = "es") {
  const h = home[lang];
  const en = lang === "en";
  const indsList = en ? industriasEn : industrias;
  // El ícono se mapea por posición (industrias ES es la clave del set de íconos).
  const inds = indsList.map((name, i) => `<li><span class="ind-ico" aria-hidden="true">${icoInd(industrias[i])}</span>${esc(name)}</li>`).join("");
  // v2: Agencia Aduanal eliminada del sitio. Quedan 4 servicios.
  const servCards = servicios.map((s) => servCard(s, { home: true, lang })).join("");
  const pasos = h.proceso.pasos.map((p) => `
          <li class="paso paso--proc">
            <span class="paso-ico" aria-hidden="true">${icoPaso(p.icono)}</span>
            <span class="paso-num">${p.n}</span>
            <h3>${esc(p.titulo)}</h3>
            <p>${esc(p.texto)}</p>
          </li>`).join("");
  // Prueba social: los 3 testimonios reales (Manufactura, Autopartes, Retail).
  const tests = casos.slice(0, 3).map((c) => {
    const cita = en ? (c.testimonio.citaEn || c.testimonio.cita) : c.testimonio.cita;
    const autor = en ? (c.testimonio.autorEn || c.testimonio.autor) : c.testimonio.autor;
    return `
          <figure class="testi">
            <blockquote>“${esc(cita)}”</blockquote>
            <figcaption>— ${esc(autor)}</figcaption>
          </figure>`;
  }).join("");

  const main = `${hero({
    label: h.hero.label, h1: h.hero.h1, apoyo: h.hero.apoyo, video: h.hero.video, bg: h.hero.poster,
    sub: `<div class="hero-actions">
          <a class="btn btn--primary" href="${h.hero.ctaPrimario.href}">${esc(h.hero.ctaPrimario.label)}</a>
          <a class="btn btn--secondary btn--on-dark" href="${h.hero.ctaSecundario.href}">${esc(h.hero.ctaSecundario.label)}</a>
        </div>`,
  })}

    <section class="section indicadores">
      <div class="container">
        <p class="ind-contador">
          <span class="ind-num" data-count="${h.indicadores.aniosValor}">${h.indicadores.aniosValor}</span>
          <span class="ind-anios">${esc(h.indicadores.anios)}</span>
          <span class="ind-sub">${esc(h.indicadores.sub)}</span>
        </p>
        <p class="text-muted ind-trabajamos">${esc(h.indicadores.texto)}</p>
        <ul class="ind-list" data-reveal>${inds}</ul>
      </div>
    </section>

    <section class="section section--soft" id="corredor">
      <div class="container">
        <span class="label">${esc(h.corredorResumen.label)}</span>
        <h2>${esc(h.corredorResumen.titulo)}</h2>
        <p class="lead">${esc(h.corredorResumen.texto)}</p>
      </div>
      ${mapaCorredorHTML({ titulo: false, pills: false, bleed: true, lang })}
    </section>

    <section class="section">
      <div class="container">
        <span class="label">${esc(h.servLabel)}</span>
        <div class="serv-grid">${servCards}</div>
      </div>
    </section>

    <section class="section section--soft" id="proceso">
      <div class="container">
        <span class="label">${esc(h.proceso.label)}</span>
        <h2>${esc(h.proceso.titulo)}</h2>
        <p class="lead">${esc(h.proceso.subtitulo)}</p>
        <ol class="proceso">${pasos}</ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>${esc(h.pruebaSocial.titulo)}</h2>
        <div class="testi-grid">${tests}</div>
        <p class="center"><a class="btn btn--secondary" href="${rutaDe("casos", lang)}">${esc(h.pruebaSocial.verMas)}</a></p>
      </div>
    </section>

    ${ctaCierre({ label: h.cierre.label, titulo: h.cierre.titulo, texto: h.cierre.texto, waKey: "home", lang })}`;

  emit(rutas.home[lang], layout({
    title: h.title, description: h.description, canonical: rutas.home[lang], useMapaCorredor: true,
    schema: [ORG, LOCALBIZ],
    bodyClass: "page-home", main, lang,
  }));
}

// ============================================================
// CORREDOR (Plan Maestro §2.2) — pillar SEO
// ============================================================
function buildCorredor(lang = "es") {
  const en = lang === "en";
  const c = corredor[lang];
  const base = rutas.corredor[lang];
  const rLbl = {
    riesgo: en ? "⚠ Risk" : "⚠ Riesgo",
    maneja: en ? "✓ How Sama Forwarding manages it" : "✓ Cómo lo gestiona SamaForwarding",
    impacto: en ? "→ Impact for the client" : "→ Impacto para el cliente",
  };
  const parrafos = c.porque.parrafos.map((p) => `<p>${esc(p)}</p>`).join("");
  // Tiempos: cards tipo flip (frente = etapa + tiempo; dorso = cómo lo gestiona).
  const tiemposCards = [...c.tiempos, c.total].map((t, i, arr) => {
    const total = i === arr.length - 1;
    return `
          <div class="flip${total ? " flip--total" : ""}" tabindex="0" data-flip>
            <div class="flip-inner">
              <div class="flip-front">
                <span class="flip-etapa">${esc(t.etapa)}</span>
                <span class="flip-tiempo">${esc(t.tiempo)}</span>
              </div>
              <div class="flip-back"><p>${esc(t.gestion)}</p></div>
            </div>
          </div>`;
  }).join("");
  // Riesgos: tabla de 3 columnas con color (Riesgo / Gestión Sama / Impacto).
  const riesgosTabla = `<div class="riesgo-tabla">` + c.riesgos.map((r) => `
        <div class="rt-row">
          <div class="rt-cell rt-rojo"><span class="rt-lbl">${rLbl.riesgo}</span><h3 class="rt-titulo">${esc(r.riesgo)}</h3><p>${esc(r.desc)}</p></div>
          <div class="rt-cell rt-verde"><span class="rt-lbl">${rLbl.maneja}</span><p>${esc(r.maneja)}</p></div>
          <div class="rt-cell rt-azul"><span class="rt-lbl">${rLbl.impacto}</span><p>${esc(r.impacto)}</p></div>
        </div>`).join("") + `</div>`;
  // v2 C.5: si el FAQ trae .items, los renderizamos como lista (con HTML inline).
  const faq = c.faq.map((f) => {
    const itemsHTML = f.items
      ? `<ul class="faq-items">${f.items.map((it) => `<li>${it}</li>`).join("")}</ul>`
      : "";
    return `
        <details class="faq-item">
          <summary>${esc(f.q)}</summary>
          <div class="faq-body"><p>${esc(f.a)}</p>${itemsHTML}</div></details>`;
  }).join("");

  const migas = [{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: en ? "Corridor" : "Corredor" }];
  // Schema: Service + FAQPage + BreadcrumbList (respuestas en el HTML inicial)
  const schema = [
    serviceSchema(en ? "Operational control of the China–Manzanillo–Bajío corridor" : "Control operativo del corredor China–Manzanillo–Bajío", c.description, "Freight forwarding", base),
    faqSchema(c.faq),
    breadcrumbSchema(migas),
  ];

  const main = `${breadcrumb(migas)}
    ${hero({ label: c.heroLabel, h1: c.h1, apoyo: c.heroSub, bg: "/assets/img/hero-corredor.jpg", short: true })}

    <section id="por-que" class="section">
      <div class="container narrow">
        <h2>${esc(c.porque.h2)}</h2>
        <div class="porque-cols">${parrafos}</div>
        <p class="dato"><span class="dato-valor">${esc(c.dato.valor)}</span> ${esc(c.dato.texto)}</p>
      </div>
    </section>

    <section id="recorrido" class="section section--soft">
      ${mapaCorredorHTML({ titulo: false, pills: false, bleed: true, lang })}
    </section>

    <section id="tiempos" class="section">
      <div class="container">
        <h2>${esc(c.tiemposIntro.h2)}</h2>
        <p class="lead">${esc(c.tiemposIntro.texto)}</p>
        <div class="flip-grid">${tiemposCards}</div>
      </div>
    </section>

    <section id="riesgos" class="section section--soft">
      <div class="container">
        <h2>${esc(c.riesgosIntro.h2)}</h2>
        <p class="lead">${esc(c.riesgosIntro.texto)}</p>
        ${riesgosTabla}
      </div>
    </section>

    <section id="faq" class="section">
      <div class="container narrow">
        <h2>${esc(c.faqTitulo)}</h2>
        <div class="faq">${faq}</div>
      </div>
    </section>

    ${ctaCierre({ titulo: c.cierre.titulo, texto: c.cierre.texto, waKey: "corredor", lang })}`;

  emit(base, layout({
    title: c.title, description: c.description,
    canonical: base, useMapaCorredor: true, schema,
    bodyClass: "page-corredor", main, lang,
  }));
}

// ============================================================
// SERVICIOS (Plan Maestro §2.3 / §2.4) — overview + 5 subpáginas
// ============================================================
function buildServicios(lang = "es") {
  const en = lang === "en";
  const m = en ? serviciosMetaEn : serviciosMeta;
  const cards = servicios.map((s) => {
    const coreCls = s.core ? " flip--serv-core" : "";
    const nombre = en ? (s.nombreEn || s.nombre) : s.nombre;
    const resumen = en ? (s.resumenEn || s.resumen) : s.resumen;
    return `
        <div class="flip flip--serv${coreCls}" tabindex="0" data-flip>
          <div class="flip-inner">
            <div class="flip-front">
              <span class="serv-card-ico">${servIcon(s.icono)}</span>
              <h3>${esc(nombre)}</h3>
            </div>
            <div class="flip-back"><p>${esc(resumen)}</p></div>
          </div>
        </div>`;
  }).join("");

  const migasOv = [{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: m.hero.label }];
  const main = `${breadcrumb(migasOv)}
    ${hero({ label: m.hero.label, h1: m.hero.h1, apoyo: m.hero.subtitulo, bg: "/assets/img/hero-servicios.jpg", short: true })}
    <section class="section">
      <div class="container">
        <span class="label">${esc(m.grid.label)}</span>
        <h2>${esc(m.grid.titulo)}</h2>
        <p class="lead">${esc(m.grid.parrafo)}</p>
        <div class="serv-grid--flip">${cards}</div>
      </div>
    </section>
    ${ctaCierre({ label: m.cierre.label, titulo: m.cierre.titulo, texto: m.cierre.texto + " " + m.cierre.aclaracion, waKey: "servicios", lang })}`;

  emit(rutas.servicios[lang], layout({
    title: m.title, description: m.description, canonical: rutas.servicios[lang],
    schema: [serviceSchema(en ? "Freight forwarding services China–Manzanillo–Bajío" : "Servicios de freight forwarding China–Manzanillo–Bajío", m.description, "Freight forwarding", rutas.servicios[lang]), breadcrumbSchema(migasOv)],
    bodyClass: "page-servicios", main, lang,
  }));
}

// ============================================================
// NOSOTROS (Plan Maestro §2.5)
// ============================================================
function buildNosotros(lang = "es") {
  const en = lang === "en";
  const n = nosotros[lang];
  const foto = (m) => `<div class="team-foto${m.tieneFoto ? "" : " team-foto--pendiente"}"${m.tieneFoto ? ` style="background-image:url('${m.foto}')"` : ""}>${m.tieneFoto ? "" : '<span>Foto pendiente</span>'}</div>`;
  // v2 E.3/R.1: solo Andrea tiene LinkedIn (con link real). Marisol y Joaquín, sin botón.
  const linkedin = (m) => m.linkedin
    ? `<a class="team-li" href="${m.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn de ${esc(m.nombre)}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21H9z"/></svg> LinkedIn</a>`
    : "";
  // Orden visual unificado en las 3 tarjetas:
  // foto → nombre → cargo → frase → (perfil largo solo Andrea) → LinkedIn (solo Andrea).
  const team = n.equipo.map((m) => {
    if (m.esDireccion) {
      const perfil = n.andrea.perfil.map((p) => `<p>${esc(p)}</p>`).join("");
      return `
        <article class="team-card team-card--dir">
          ${foto(m)}
          <h3>${esc(m.nombre)}</h3>
          <p class="team-cargo">${esc(m.cargo)}</p>
          <p class="team-frase">“${esc(m.frase)}”</p>
          <div class="team-perfil">${perfil}</div>
          ${linkedin(m)}
        </article>`;
    }
    return `
        <article class="team-card">
          ${foto(m)}
          <h3>${esc(m.nombre)}</h3>
          <p class="team-cargo">${esc(m.cargo)}</p>
          <p class="team-frase">“${esc(m.frase)}”</p>
          ${linkedin(m)}
        </article>`;
  }).join("");
  // v2 N.4: historia con bold parcial (HTML inline, no escape).
  const historia = (n.historia.parrafosHTML || n.historia.parrafos || []).map((p) => `<p>${p}</p>`).join("");
  // Valores: cards tipo flip (frente = título + subtítulo; dorso = copy).
  const valores = n.valores.map((v) => `
          <div class="flip valor-flip" tabindex="0" data-flip>
            <div class="flip-inner">
              <div class="flip-front">
                <h3>${esc(v.nombre)}</h3>
                <p class="valor-sub">${esc(v.sub)}</p>
              </div>
              <div class="flip-back"><p>${esc(v.copy)}</p></div>
            </div>
          </div>`).join("");

  const migas = [{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: en ? "About Us" : "Nosotros" }];
  const main = `${breadcrumb(migas)}
    ${hero({ label: n.heroLabel, h1: n.h1, apoyo: n.heroSub, bg: "/assets/img/hero-nosotros.jpg", short: true })}

    <section class="section">
      <div class="container">
        <div class="team-grid team-grid--3">${team}</div>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container">
        <span class="label">${esc(n.historia.label)}</span>
        <h2>${esc(n.historia.h2)}</h2>
        ${historia}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <span class="label">${esc(n.valoresIntro.label)}</span>
        <h2>${esc(n.valoresIntro.h2)}</h2>
        <p class="lead">${esc(n.valoresIntro.parrafo)}</p>
        <div class="valores--flip">${valores}</div>
      </div>
    </section>

    <section class="cta-cierre">
      <div class="container cta-inner">
        <span class="label label--light">${esc(n.cierre.label)}</span>
        <h2>${esc(n.cierre.titulo)}</h2>
        <p>${esc(n.cierre.texto)}</p>
        <div class="cta-actions">
          <a class="btn btn--primary" href="${n.cierre.cta.href}">${esc(n.cierre.cta.label)}</a>
        </div>
      </div>
    </section>`;

  emit(rutas.nosotros[lang], layout({
    title: n.title, description: n.description, canonical: rutas.nosotros[lang],
    schema: [ORG, aboutSchema, breadcrumbSchema(migas)],
    bodyClass: "page-nosotros", main, lang,
  }));
}

// ============================================================
// CASOS (Plan Maestro §2.6) — overview + 3 individuales
// ============================================================
function buildCasos(lang = "es") {
  const en = lang === "en";
  const meta = en ? casosMetaEn : casosMeta;
  const base = rutas.casos[lang]; // /casos/ o /en/cases/
  const F = (c, f) => (en ? c[f + "En"] || c[f] : c[f]);
  const cardOf = (c) => (en ? c.cardEn || c.card : c.card);
  const readMore = en ? "Read full case →" : "Leer caso completo →";
  const resultadoLbl = en ? "Result:" : "Resultado:";

  const cards = casos.map((c) => `
        <a class="caso-card" href="${base}${c.slug}/" data-categoria="${esc(F(c, "categoria"))}">
          <span class="label">${esc(F(c, "industria"))}</span>
          <h3>${esc(F(c, "titulo"))}</h3>
          <p class="caso-card-ctx">${esc(cardOf(c).contexto)}</p>
          <p class="caso-card-res"><strong>${resultadoLbl}</strong> ${esc(cardOf(c).resultado)}</p>
          <span class="serv-card-link">${readMore}</span>
        </a>`).join("");
  // Filtro: categorías fijas del cliente (las vacías quedan visibles).
  const pills = meta.filtroCategorias.map((cat, i) =>
    `<button class="pill${i === 0 ? " is-active" : ""}" type="button" data-filter="${i === 0 ? "todos" : esc(cat)}">${esc(cat)}</button>`).join("");

  const migasOv = [{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: en ? "Cases" : "Casos" }];
  const itemList = {
    "@context": "https://schema.org", "@type": "ItemList",
    itemListElement: casos.map((c, i) => ({
      "@type": "ListItem", position: i + 1, url: D + `${base}${c.slug}/`, name: F(c, "titulo"),
    })),
  };
  const emptyMsg = en
    ? "We don't have published cases in this industry yet. We'll add more soon."
    : "Todavía no tenemos casos publicados en esta industria. Muy pronto sumaremos más.";
  const main = `${breadcrumb(migasOv)}
    ${hero({ label: meta.hero.label, h1: meta.hero.h1, apoyo: meta.hero.parrafo, bg: "/assets/img/casos-hero.jpg", short: true })}
    <section class="section">
      <div class="container">
        <span class="label">${esc(meta.filtroH2)}</span>
        <div class="filtro-pills" data-caso-filtro>${pills}</div>
        <div class="caso-grid" data-caso-grid>${cards}</div>
        <p class="caso-empty" data-caso-empty hidden>${emptyMsg}</p>
      </div>
    </section>
    ${ctaCierre({ label: meta.cierre.label, titulo: meta.cierre.titulo, texto: meta.cierre.texto, waKey: "casos", lang })}`;

  emit(base, layout({
    title: meta.title, description: meta.description,
    canonical: base, schema: [itemList, breadcrumbSchema(migasOv)],
    bodyClass: "page-casos", main, lang,
  }));

  // Casos individuales (Schema Article)
  for (const c of casos) {
    const industria = F(c, "industria");
    const titulo = F(c, "titulo");
    const bloques = casoBloques.map((b) => `
        <section class="caso-bloque">
          <h2>${esc(en ? b.labelEn : b.label)}</h2>
          <p>${esc(en ? c[b.key + "En"] || c[b.key] : c[b.key])}</p>
        </section>`).join("");

    const migas = [{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: en ? "Cases" : "Casos", href: base }, { label: industria }];
    const schema = [
      {
        "@context": "https://schema.org", "@type": "Article",
        headline: titulo, articleSection: industria, url: D + `${base}${c.slug}/`,
        publisher: { "@type": "Organization", name: site.nombre },
      },
      breadcrumbSchema(migas),
    ];

    const cita = en ? (c.testimonio.citaEn || c.testimonio.cita) : c.testimonio.cita;
    const autor = en ? (c.testimonio.autorEn || c.testimonio.autor) : c.testimonio.autor;
    const main = `${breadcrumb(migas)}
    ${hero({ label: industria, h1: titulo, sin: true })}
    <article class="container narrow caso-detalle">
      <p class="caso-chips"><span class="chip">${esc(industria)}</span></p>
      ${bloques}
      <figure class="testi testi--big">
        <blockquote>“${esc(cita)}”</blockquote>
        <figcaption>— ${esc(autor)}</figcaption>
      </figure>
    </article>
    ${ctaCierre({ waKey: "casos", lang })}`;

    emit(`${base}${c.slug}/`, layout({
      title: `${titulo} | ${en ? "Cases" : "Casos"} | ${site.nombre}`,
      description: cardOf(c).contexto,
      canonical: `${base}${c.slug}/`, schema, bodyClass: "page-caso", main, lang,
    }));
  }
}

// ============================================================
// DIAGNÓSTICO (Plan Maestro §4.1) — F16: SOLO VISUAL (form no envía)
// ============================================================
// Campos del diagnóstico — copy textual del doc (labels, placeholders, opciones).
const DIAG_CAMPOS = [
  { tipo: "text", label: "Nombre completo", ph: "Nombre y apellido", req: true, labelEn: "Full name", phEn: "First and last name" },
  { tipo: "text", label: "Empresa", ph: "Nombre de la empresa", req: true, labelEn: "Company", phEn: "Company name" },
  { tipo: "select", label: "Cargo", req: true, opciones: ["Gerente de logística", "Gerente de compras", "Gerente de operaciones", "Director de operaciones", "CEO", "Dueño", "Otro"], labelEn: "Title", opcionesEn: ["Logistics Manager", "Purchasing Manager", "Operations Manager", "Director of Operations", "CEO", "Owner", "Other"] },
  { tipo: "email", label: "Email corporativo", ph: "tuempresa@.com", req: true, ayuda: "Preferimos emails corporativos.", labelEn: "Corporate email", phEn: "yourcompany@.com", ayudaEn: "We prefer corporate emails." },
  { tipo: "tel", label: "Teléfono o WhatsApp", ph: "+52", req: true, labelEn: "Phone or WhatsApp", phEn: "+52" },
  { tipo: "select", label: "¿Desde dónde importas actualmente?", req: true, opciones: ["Shanghai", "Qingdao", "Xiamen", "Hong Kong", "Ningbo", "Shenzen", "Otro"], labelEn: "Where do you currently import from?", opcionesEn: ["Shanghai", "Qingdao", "Xiamen", "Hong Kong", "Ningbo", "Shenzhen", "Other"] },
  { tipo: "select", label: "¿Cuántos contenedores mueves por operación?", req: true, opciones: ["1 a 2 contenedores", "3 a 5 contenedores", "6 a 10 contenedores", "Más de 10 contenedores", "Importamos por kilo o CBM (L)"], labelEn: "How many containers do you move per shipment?", opcionesEn: ["1–2 containers", "3–5 containers", "6–10 containers", "More than 10 containers", "We import by kilo or CBM (LCL)"] },
  { tipo: "select", label: "¿Con qué frecuencia importas?", req: true, opciones: ["Semanal", "Mensual", "Bimestral", "Semestral", "Esporádico (menos de 2 veces por año)"], labelEn: "How often do you import?", opcionesEn: ["Weekly", "Monthly", "Bimonthly", "Semiannual", "Sporadic (fewer than twice a year)"] },
  { tipo: "select", label: "¿A dónde llega tu carga?", req: true, opciones: ["Guadalajara", "León", "Querétaro", "Aguascalientes", "San Luis Potosí", "Otro"], labelEn: "Where does your cargo arrive?", opcionesEn: ["Guadalajara", "León", "Querétaro", "Aguascalientes", "San Luis Potosí", "Other"] },
  { tipo: "textarea", label: "¿Cuál es tu mayor desafío logístico hoy?", ph: "Cuéntanos brevemente cuál es el principal problema que tiene tu operación de importación hoy", req: false, labelEn: "What's your biggest logistics challenge today?", phEn: "Briefly tell us the main problem with your import operation today" },
];

function campoHTML(c, i, lang = "es") {
  const en = lang === "en";
  const id = "f" + i;
  const label = en ? (c.labelEn || c.label) : c.label;
  const phTxt = en ? (c.phEn || c.ph) : c.ph;
  const opciones = en ? (c.opcionesEn || c.opciones) : c.opciones;
  const ayudaTxt = en ? (c.ayudaEn || c.ayuda) : c.ayuda;
  const reqAttr = c.req ? " required" : "";
  const ph = phTxt ? ` placeholder="${esc(phTxt)}"` : "";
  const reqMark = c.req ? ' <span class="req" aria-hidden="true">*</span>' : ` <span class="opt">(${en ? "optional" : "opcional"})</span>`;
  const selectPh = en ? "Select an option" : "Selecciona una opción";
  let control;
  if (c.tipo === "select") {
    const opts = [`<option value="" disabled selected>${selectPh}</option>`,
      ...opciones.map((o) => `<option>${esc(o)}</option>`)].join("");
    control = `<select id="${id}" name="${id}"${reqAttr}>${opts}</select>`;
  } else if (c.tipo === "textarea") {
    control = `<textarea id="${id}" name="${id}" rows="4"${ph}${reqAttr}></textarea>`;
  } else {
    control = `<input type="${c.tipo}" id="${id}" name="${id}"${ph}${reqAttr}>`;
  }
  const ayuda = ayudaTxt ? `<small class="campo-ayuda">${esc(ayudaTxt)}</small>` : "";
  return `<div class="campo">
        <label for="${id}">${esc(label)}${reqMark}</label>
        ${control}
        ${ayuda}
      </div>`;
}

function buildDiagnostico(lang = "es") {
  const en = lang === "en";
  const base = rutas.diagnostico[lang];
  const graciasUrl = rutas.diagGracias[lang];
  const campos = DIAG_CAMPOS.map((c, i) => campoHTML(c, i + 1, lang)).join("");
  const t = en
    ? {
        label: "Free logistics diagnostic",
        h1: "We analyze your operation on the China – Port of Manzanillo – Bajío Region corridor",
        sub: "We show you precisely where the improvement opportunities are in your import flow. No cost. No obligation. With the expertise of a team that operates this corridor every day.",
        bullets: ["We identify the friction points in your current operation.", "We assess whether your import flow can be more stable and predictable.", "We show you how operational control throughout the China–Manzanillo–Bajío corridor directly impacts your production chain."],
        pasosH3: "What happens after you submit the form",
        pasos: ["We review your operation before calling you — we arrive at the conversation having already analyzed your current logistics flow.", "We'll contact you within 24 business hours to schedule the diagnostic conversation.", "In the conversation, we'll show you precisely where the improvement opportunities are and what impact they have on your operation."],
        boton: "Schedule diagnostic",
        privacidad: "Your information is confidential and will not be shared with third parties. We only use it to prepare your diagnostic.",
        title: "Free Logistics Diagnostic | China – Port of Manzanillo – Bajío Region | Sama Forwarding",
        desc: "We analyze your import operation on the China – Port of Manzanillo – Bajío Region corridor and show you precisely where the improvement opportunities are. No cost. No obligation.",
        gLabel: "Diagnostic received", gH1: "Your diagnostic is in progress",
        gLead: "We received your information. Before contacting you, we'll review your operation so we can arrive at the conversation with a concrete analysis of your current logistics flow.",
        gP2: "We'll contact you within 24 business hours to schedule the diagnostic conversation.",
        gSuave: "In the meantime, if you'd like to better understand the corridor behind your import operation:",
        gCta1: "Learn about the China–Manzanillo–Bajío corridor", gCta2: "See cases from Bajío companies",
        gTitle: "Thank you | Logistics Diagnostic | Sama Forwarding", gDesc: "We received your logistics diagnostic request. We'll contact you within 24 business hours.",
      }
    : {
        label: "Diagnóstico logístico gratuito",
        h1: "Analizamos tu operación en el corredor China-Puerto Manzanillo-Zona del Bajío",
        sub: "Te mostramos con precisión dónde están los puntos de mejora en tu flujo de importación. Sin costo. Sin compromiso. Con el criterio de quien opera este corredor todos los días.",
        bullets: ["Identificamos los puntos de fricción en tu operación actual.", "Evaluamos si tu flujo de importación puede ser más estable y anticipado.", "Te mostramos cómo el control operativo en el corredor impacta directamente tu cadena de producción."],
        pasosH3: "Qué pasa después de que completas el formulario",
        pasos: ["Revisamos tu operación antes de llamarte, llegamos a la conversación ya habiendo analizado tu flujo logístico actual.", "Te contactaremos en 24 horas hábiles para agendar la conversación de diagnóstico.", "En la conversación te mostramos con precisión dónde están los puntos de mejora y qué impacto tienen en tu operación."],
        boton: "Agendar diagnóstico",
        privacidad: "Tu información es confidencial y no será compartida con terceros. Solo la usamos para preparar tu diagnóstico.",
        title: "Diagnóstico logístico gratuito | China–Manzanillo–Bajío | Sama Forwarding",
        desc: "Analizamos tu operación de importación en el corredor China–Manzanillo–Bajío sin costo. Te mostramos dónde están los puntos de mejora. Agenda tu diagnóstico.",
        gLabel: "Diagnóstico recibido", gH1: "Tu diagnóstico está en proceso",
        gLead: "Recibimos tu información. Antes de contactarte vamos a revisar tu operación para llegar a la conversación con un análisis concreto de tu flujo logístico actual.",
        gP2: "Te contactaremos en 24 horas hábiles para agendar la conversación de diagnóstico.",
        gSuave: "Mientras tanto, si quieres entender mejor el corredor que opera tu importación:",
        gCta1: "Conoce el corredor China–Manzanillo–Bajío", gCta2: "Ver casos de empresas del Bajío",
        gTitle: "Gracias | Diagnóstico logístico | Sama Forwarding", gDesc: "Recibimos tu solicitud de diagnóstico logístico. Te contactaremos en 24 horas hábiles.",
      };

  const schema = [
    serviceSchema(t.label, t.desc, en ? "Logistics diagnostic" : "Diagnóstico logístico", base),
    { "@context": "https://schema.org", "@type": "ContactPage", name: t.label, url: D + base },
  ];

  const main = `
    <section class="diag">
      <div class="container diag-grid">
        <div class="diag-hero">
          <span class="label">${esc(t.label)}</span>
          <h1>${esc(t.h1)}</h1>
          <p class="diag-sub">${esc(t.sub)}</p>
          <ul class="diag-bullets">${t.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
          <div class="diag-pasos">
            <h3>${esc(t.pasosH3)}</h3>
            <ol class="proceso proceso--mini">
              ${t.pasos.map((p, i) => `<li class="paso"><span class="paso-num">0${i + 1}</span><p>${esc(p)}</p></li>`).join("")}
            </ol>
          </div>
        </div>

        <div class="diag-form-wrap">
          <form class="diag-form" action="/api/leads/diagnostico" method="post" data-lead-form data-gracias="${graciasUrl}" novalidate>
            <div class="campos">${campos}</div>
            <input type="hidden" name="idioma" value="${lang}">
            <div class="hp-field" aria-hidden="true"><label>No completar<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
            <p class="form-error" data-form-error hidden></p>
            <button type="submit" class="btn btn--primary btn--block">${esc(t.boton)}</button>
            <p class="diag-privacidad">${esc(t.privacidad)}</p>
          </form>
        </div>
      </div>
    </section>`;

  emit(base, layout({
    title: t.title, description: t.desc, canonical: base,
    schema, bodyClass: "page-diagnostico", main, lang,
  }));

  const mainGracias = `
    <section class="section gracias gracias--hero">
      <div class="container narrow center">
        <div class="gracias-check" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="28"/><path d="M20 33l8 8 16-18"/></svg>
        </div>
        <span class="label label--light">${esc(t.gLabel)}</span>
        <h1>${esc(t.gH1)}</h1>
        <p class="lead">${esc(t.gLead)}</p>
        <p>${esc(t.gP2)}</p>
      </div>
    </section>
    <section class="section gracias-suave">
      <div class="container narrow center">
        <p class="lead">${esc(t.gSuave)}</p>
        <div class="cta-actions">
          <a class="btn btn--secondary" href="${rutaDe("corredor", lang)}">${esc(t.gCta1)}</a>
          <a class="btn btn--secondary" href="${rutaDe("casos", lang)}">${esc(t.gCta2)}</a>
        </div>
      </div>
    </section>`;

  emit(graciasUrl, layout({
    title: t.gTitle, description: t.gDesc, canonical: graciasUrl,
    head: '<meta name="robots" content="noindex, follow">',
    bodyClass: "page-gracias", main: mainGracias, lang,
  }));
}

// ============================================================
// CONTACTO (Plan Maestro §4.2) — F17: SOLO VISUAL (form no envía)
// ============================================================
function buildContacto(lang = "es") {
  const en = lang === "en";
  const base = rutas.contacto[lang];
  const graciasUrl = rutas.contactoGracias[lang];
  const telDigits = site.tel.replace(/[^0-9]/g, "");
  const migas = [{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: en ? "Contact" : "Contacto" }];
  const schema = [
    LOCALBIZ,
    { "@context": "https://schema.org", "@type": "ContactPage", name: (en ? "Contact — " : "Contacto — ") + site.nombre, url: D + base },
    breadcrumbSchema(migas),
  ];
  const t = en
    ? {
        heroLabel: "Direct contact", h1: "Let's talk about your operation on the corridor",
        heroSub: "Contact us and tell us what your import operation needs. We'll respond within 24 business hours.",
        datosH2: "Find us", datosP: "We're a company with an active operational presence on the corridor. These are the direct channels to reach the team.",
        telLbl: "Phone", emailLbl: "Email", dirLbl: "Address", horarioLbl: "Hours",
        horario: "Monday to Friday, 8:30 a.m. to 6:00 p.m.", verMapa: "View on Google Maps",
        formTitle: "Send us a message", formSub: "Briefly tell us what you need and we'll respond within 24 business hours.",
        fNombre: "Full name", phNombre: "First and last name", fEmpresa: "Company", phEmpresa: "Company name",
        fEmail: "Email", phEmail: "you@company.com", fTel: "Phone or WhatsApp",
        fComo: "How did you find us?", comoOpts: ["Google search", "LinkedIn", "Referral from a contact", "I'm already a client", "Other"],
        fConsulta: "Your inquiry", phConsulta: "Briefly tell us what you need. If you import from China to the Bajío and want to learn more about our service, you can also describe your operation to us.",
        boton: "Send message", nota: "We'll respond within 24 business hours. If your inquiry is urgent, message us directly on WhatsApp.",
        selPh: "Select an option", opt: "(optional)",
        ctaLabel: "Want to go deeper?", ctaH2: "If you import from China to the Bajío, we can analyze your entire operation",
        ctaP: "The free logistics diagnostic goes beyond a simple inquiry. We analyze your current import flow on the corridor and show you precisely where the improvement opportunities are, before any sales conversation.",
        ctaBtn: "Get a free logistics diagnostic",
        title: "Contact | Sama Forwarding — Freight Forwarding China – Port of Manzanillo – Bajío Region",
        desc: "Contact Sama Forwarding, specialists in freight forwarding on the China – Port of Manzanillo – Bajío Region corridor. Phone, email, WhatsApp, and direct contact form.",
        gLabel: "Message received", gH1: "We received your message",
        gLead: "We'll respond within 24 business hours. If your inquiry is urgent, you can message us directly on WhatsApp.",
        gWa: "Message us on WhatsApp now", gSuave: "While you wait for our response, you can learn how we operate the China – Port of Manzanillo – Bajío Region corridor.",
        gCta: "See the corridor", gCrumb: "Thank you",
        gTitle: "Thank you | Contact | Sama Forwarding", gDesc: "We received your message. We'll respond within 24 business hours.",
      }
    : {
        heroLabel: "Contacto directo", h1: "Hablemos sobre tu operación en el corredor",
        heroSub: "Contáctanos y cuéntanos qué necesita tu operación de importación. Te responderemos en menos de 24 horas hábiles.",
        datosH2: "Encuéntranos", datosP: "Somos una empresa con presencia operativa activa en el corredor. Estos son los canales directos para hablar con el equipo.",
        telLbl: "Teléfono", emailLbl: "Email", dirLbl: "Dirección", horarioLbl: "Horario",
        horario: "Lunes a viernes. 08:30 a.m. a 06:00 p.m.", verMapa: "Ver en Google Maps",
        formTitle: "Envíanos un mensaje", formSub: "Cuéntanos brevemente qué necesitas y te responderemos en 24 horas hábiles.",
        fNombre: "Nombre completo", phNombre: "Nombre y apellido", fEmpresa: "Empresa", phEmpresa: "Nombre de la empresa",
        fEmail: "Email", phEmail: "tu@empresa.com", fTel: "Teléfono o WhatsApp",
        fComo: "¿Cómo nos encontraste?", comoOpts: ["Búsqueda de Google", "LinkedIn", "Recomendación de un contacto", "Ya soy cliente", "Otro"],
        fConsulta: "Tu consulta", phConsulta: "Cuéntanos brevemente qué necesitas. Si importas desde China al Bajío y quieres conocer más sobre nuestro servicio, también puedes describirnos tu operación.",
        boton: "Enviar mensaje", nota: "Te responderemos en 24 horas hábiles. Si tu consulta es urgente, escríbenos directamente por WhatsApp.",
        selPh: "Selecciona una opción", opt: "(opcional)",
        ctaLabel: "¿Prefieres ir más en profundidad?", ctaH2: "Si importas desde China al Bajío, podemos analizar tu operación completa",
        ctaP: "El diagnóstico logístico gratuito va más allá de una consulta. Analizamos tu flujo de importación actual en el corredor y te mostramos con precisión dónde están los puntos de mejora, antes de cualquier conversación comercial.",
        ctaBtn: "Realiza un diagnóstico logístico gratuito",
        title: "Contacto | Sama Forwarding – Freight Forwarding China–Manzanillo–Bajío",
        desc: "Contacta a Sama Forwarding. Teléfono, WhatsApp, email y oficina en Zapopan, Jalisco. Respondemos en 24 horas hábiles.",
        gLabel: "Mensaje recibido", gH1: "Recibimos tu mensaje",
        gLead: "Te responderemos en 24 horas hábiles. Si tu consulta es urgente, puedes escribirnos directamente por WhatsApp.",
        gWa: "Escribir por WhatsApp ahora", gSuave: "Mientras esperas nuestra respuesta, puedes conocer cómo operamos el corredor China–Puerto de Manzanillo– Zona del Bajío.",
        gCta: "Ver el corredor", gCrumb: "Gracias",
        gTitle: "Gracias | Contacto | Sama Forwarding", gDesc: "Recibimos tu mensaje. Te responderemos en 24 horas hábiles.",
      };

  const comoOpts = t.comoOpts.map((o) => `<option>${esc(o)}</option>`).join("");
  const main = `${breadcrumb(migas)}
    ${hero({ label: t.heroLabel, h1: t.h1, apoyo: t.heroSub, sin: true })}

    <section class="section">
      <div class="container grid grid-2 contacto-grid">
        <div class="contacto-izq">
          <h2>${esc(t.datosH2)}</h2>
          <p class="lead">${esc(t.datosP)}</p>
          <ul class="datos-list">
            <li><strong>${esc(t.telLbl)}:</strong> <a href="tel:${telDigits}">${esc(site.tel)}</a></li>
            <li><strong>WhatsApp:</strong> ${waLink("contacto", site.whatsapp, { lang })}</li>
            <li><strong>${esc(t.emailLbl)}:</strong> <a href="mailto:${site.email}">${esc(site.email)}</a></li>
            <li><strong>${esc(t.dirLbl)}:</strong> ${esc(site.direccion)}</li>
            <li><strong>${esc(t.horarioLbl)}:</strong> ${esc(t.horario)}</li>
          </ul>
          <div class="mapa-embed mapa-embed--col">
            <iframe title="Sama Forwarding — Zapopan, Jalisco" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=20.6597,-103.4475&t=&z=15&ie=UTF8&iwloc=&output=embed" allowfullscreen></iframe>
          </div>
          <p class="center"><a href="https://www.google.com/maps/search/?api=1&query=Calzada+Central+290+Ciudad+Granja+Zapopan+Jalisco" target="_blank" rel="noopener">${esc(t.verMapa)}</a></p>
        </div>
        <div class="contacto-form-wrap">
          <h3>${esc(t.formTitle)}</h3>
          <p class="form-sub">${esc(t.formSub)}</p>
          <form class="contacto-form" action="/api/leads/contacto" method="post" data-lead-form data-gracias="${graciasUrl}" novalidate>
            <div class="campo"><label for="cn">${esc(t.fNombre)} <span class="req">*</span></label><input type="text" id="cn" name="cn" placeholder="${esc(t.phNombre)}" required></div>
            <div class="campo"><label for="ce">${esc(t.fEmpresa)} <span class="req">*</span></label><input type="text" id="ce" name="ce" placeholder="${esc(t.phEmpresa)}" required></div>
            <div class="campo"><label for="cm">${esc(t.fEmail)} <span class="req">*</span></label><input type="email" id="cm" name="cm" placeholder="${esc(t.phEmail)}" required></div>
            <div class="campo"><label for="ct">${esc(t.fTel)} <span class="req">*</span></label><input type="tel" id="ct" name="ct" placeholder="+52" required></div>
            <div class="campo"><label for="cf">${esc(t.fComo)} <span class="opt">${esc(t.opt)}</span></label>
              <select id="cf" name="cf"><option value="" disabled selected>${esc(t.selPh)}</option>${comoOpts}</select>
            </div>
            <div class="campo"><label for="cx">${esc(t.fConsulta)} <span class="req">*</span></label><textarea id="cx" name="cx" rows="5" placeholder="${esc(t.phConsulta)}" required></textarea></div>
            <input type="hidden" name="idioma" value="${lang}">
            <div class="hp-field" aria-hidden="true"><label>No completar<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
            <p class="form-error" data-form-error hidden></p>
            <button type="submit" class="btn btn--primary btn--block">${esc(t.boton)}</button>
            <p class="campo-ayuda">${esc(t.nota)}</p>
          </form>
        </div>
      </div>
    </section>

    <section class="cta-suave">
      <div class="container grid grid-2 cta-suave-grid">
        <div>
          <span class="label">${esc(t.ctaLabel)}</span>
          <h2>${esc(t.ctaH2)}</h2>
          <p>${esc(t.ctaP)}</p>
        </div>
        <div class="cta-suave-action">
          <a class="btn btn--primary" href="${rutaDe("diagnostico", lang)}">${esc(t.ctaBtn)}</a>
        </div>
      </div>
    </section>`;

  emit(base, layout({
    title: t.title, description: t.desc,
    canonical: base, schema, bodyClass: "page-contacto", main, lang,
  }));

  const mainGracias = `${breadcrumb([{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: en ? "Contact" : "Contacto", href: base }, { label: t.gCrumb }])}
    <section class="section gracias gracias--hero">
      <div class="container narrow center">
        <div class="gracias-check" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="28"/><path d="M20 33l8 8 16-18"/></svg>
        </div>
        <span class="label label--light">${esc(t.gLabel)}</span>
        <h1>${esc(t.gH1)}</h1>
        <p class="lead">${esc(t.gLead)}</p>
        <div class="cta-actions">
          ${waLink("contactoGracias", t.gWa, { extraClass: "btn btn--primary", lang })}
        </div>
      </div>
    </section>
    <section class="section gracias-suave">
      <div class="container narrow center">
        <p class="lead">${esc(t.gSuave)}</p>
        <div class="cta-actions">
          <a class="btn btn--secondary" href="${rutaDe("corredor", lang)}">${esc(t.gCta)}</a>
        </div>
      </div>
    </section>`;

  emit(graciasUrl, layout({
    title: t.gTitle, description: t.gDesc, canonical: graciasUrl,
    head: '<meta name="robots" content="noindex, follow">',
    bodyClass: "page-gracias", main: mainGracias, lang,
  }));
}

// ============================================================
// 404 (Plan Maestro §2.8) — F15
// ============================================================
function build404(lang = "es") {
  const en = lang === "en";
  const cards = [
    { t: en ? "Go to homepage" : "Ir al inicio", h: rutaDe("home", lang) },
    { t: en ? "Learn about the corridor" : "Conocer el corredor", h: rutaDe("corredor", lang) },
    { t: en ? "See our services" : "Ver los servicios", h: rutaDe("servicios", lang) },
    { t: en ? "Schedule a logistics diagnostic" : "Agendar diagnóstico", h: rutaDe("diagnostico", lang) },
  ].map((c) => `<a class="error-card" href="${c.h}">${esc(c.t)} →</a>`).join("");

  // Ilustración SVG minimalista del corredor (sin astronautas/robots, §2.8).
  const ilustracion = `
        <svg class="error-ilus" viewBox="0 0 360 96" role="img" aria-label="Diagrama del corredor China–Manzanillo–Bajío" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path class="e-mar" d="M28 58 C53 42 78 74 103 58 S153 42 178 58" stroke-width="3"/>
          <path class="e-tierra" d="M178 58 H320" stroke-width="3" stroke-dasharray="2 9"/>
          <circle class="e-origen" cx="28" cy="58" r="7"/>
          <circle class="e-puerto" cx="178" cy="58" r="9"/>
          <path class="e-destino" d="M320 58c0-9 14-9 14 0 0 7-7 13-7 13s-7-6-7-13z" stroke-width="3"/>
          <text class="e-cap" x="28" y="84" text-anchor="middle">China</text>
          <text class="e-cap" x="178" y="84" text-anchor="middle">Manzanillo</text>
          <text class="e-cap" x="327" y="84" text-anchor="middle">Bajío</text>
        </svg>`;

  const main = `
    <section class="section error-404">
      <div class="container narrow center">
        ${ilustracion}
        <p class="error-num">404</p>
        <h1>${en ? "This page doesn't exist" : "Esta página no existe"}</h1>
        <p class="lead">${en
          ? "The URL you're looking for isn't available. It may have moved, or the link you used may be outdated. From here you can go directly to where you need to be."
          : "La página que buscabas no está disponible. Te dejamos algunas rutas para seguir."}</p>
        <div class="error-cards">${cards}</div>
        <p class="error-wa">${waLink("error404", en ? "Can't find what you're looking for? Message us on WhatsApp" : "¿Necesitas ayuda? Escríbenos por WhatsApp", { lang })}</p>
      </div>
    </section>`;

  const html = layout({
    title: en ? "Page not found (404) | Sama Forwarding" : "Página no encontrada (404) | Sama Forwarding",
    description: en
      ? "The page you're looking for doesn't exist. Go back to the homepage or learn about the China–Manzanillo–Bajío corridor."
      : "La página que buscas no existe. Vuelve al inicio o conoce el corredor China–Manzanillo–Bajío.",
    canonical: en ? "/en/404.html" : "/404.html",
    head: '<meta name="robots" content="noindex, follow">',
    bodyClass: "page-404", main, lang,
  });
  emitFile(en ? "en/404.html" : "404.html", html);
}

// ============================================================
// AVISO DE PRIVACIDAD — texto legal DEFINITIVO (LFPDPPP).
// ============================================================
function buildPrivacidad(lang = "es") {
  const en = lang === "en";
  const migas = [{ label: en ? "Home" : "Inicio", href: rutaDe("home", lang) }, { label: en ? "Privacy notice" : "Aviso de privacidad" }];

  const cuerpoEn = `
      <h2>Data controller</h2>
      <p>SAMA FORWARDING, S.A. de C.V., domiciled at Avenida Calzada Central No. 290, Interior 406, Colonia Ciudad Granja, C.P. 45010, Zapopan, Jalisco, Mexico, is responsible for the processing and protection of the personal data you provide through this website, in accordance with Mexico's Federal Law on the Protection of Personal Data Held by Private Parties and other applicable provisions.</p>

      <h2>Personal data we collect</h2>
      <p>Through our contact and logistics diagnostic forms, we may request the following personal data:</p>
      <ul>
        <li>Full name.</li>
        <li>Company.</li>
        <li>Job title.</li>
        <li>Email address.</li>
        <li>Phone number.</li>
        <li>Information related to your international trade, logistics, or import operations that you voluntarily choose to share.</li>
      </ul>
      <p>We do not collect sensitive personal data through this website.</p>
      <p>By voluntarily providing your personal data through this website, you agree to its processing as set out in this Privacy Notice.</p>

      <h2>Purposes of processing</h2>
      <p>The personal data we collect will be used exclusively for the following purposes:</p>
      <ul>
        <li>Responding to your information requests.</li>
        <li>Contacting you regarding our services.</li>
        <li>Preparing logistics diagnostics and business proposals when you request them.</li>
        <li>Following up on quotes, operations, and contracted services.</li>
        <li>Maintaining communication related to our services.</li>
      </ul>
      <p>Your personal data will not be used for purposes other than those described here without your consent, when such consent is legally required.</p>

      <h2>Transfer of personal data</h2>
      <p>SAMA FORWARDING, S.A. de C.V. does not sell, rent, or trade its users' personal data.</p>
      <p>Data may only be shared where there is a legal obligation or where indispensable for providing the requested service, under appropriate confidentiality measures.</p>

      <h2>Security measures</h2>
      <p>We implement reasonable administrative, technical, and organizational measures to protect your personal information against loss, misuse, unauthorized access, alteration, or disclosure.</p>

      <h2>ARCO Rights</h2>
      <p>You may exercise your rights of Access, Rectification, Cancellation, or Objection (ARCO) at any time, as well as revoke consent given for the processing of your personal data, by sending a request to: <a href="mailto:info@samaforwarding.com">info@samaforwarding.com</a></p>
      <p>The request must include, at minimum:</p>
      <ul>
        <li>Your full name.</li>
        <li>A means by which to communicate the response to you.</li>
        <li>A clear description of the right you wish to exercise.</li>
        <li>The information necessary to verify your identity or, where applicable, your legal representation.</li>
      </ul>`;

  const cuerpoEs = `
      <h2>Responsable del tratamiento de los datos personales</h2>
      <p>SAMA FORWARDING, S.A. de C.V., con domicilio en Avenida Calzada Central No. 290, Interior 406, Colonia Ciudad Granja, C.P. 45010, Zapopan, Jalisco, México, es responsable del tratamiento y protección de los datos personales que nos proporciones a través de este sitio web, de conformidad con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y demás disposiciones aplicables.</p>

      <h2>Datos personales que recabamos</h2>
      <p>A través de nuestros formularios de contacto y diagnóstico logístico podremos solicitar los siguientes datos personales:</p>
      <ul>
        <li>Nombre completo.</li>
        <li>Empresa.</li>
        <li>Cargo.</li>
        <li>Correo electrónico.</li>
        <li>Número telefónico.</li>
        <li>Información relacionada con tus operaciones de comercio internacional, logística o importación que voluntariamente decidas compartir.</li>
      </ul>
      <p>No recabamos datos personales sensibles mediante este sitio web.</p>
      <p>Al proporcionar voluntariamente tus datos personales a través de este sitio web, aceptas su tratamiento conforme a lo establecido en el presente Aviso de Privacidad.</p>

      <h2>Finalidades del tratamiento</h2>
      <p>Los datos personales que recabamos serán utilizados exclusivamente para las siguientes finalidades:</p>
      <ul>
        <li>Dar respuesta a tus solicitudes de información.</li>
        <li>Contactarte respecto de nuestros servicios.</li>
        <li>Elaborar diagnósticos logísticos y propuestas comerciales cuando así lo solicites.</li>
        <li>Dar seguimiento a cotizaciones, operaciones y servicios contratados.</li>
        <li>Mantener comunicación relacionada con nuestros servicios.</li>
      </ul>
      <p>Tus datos personales no serán utilizados para finalidades distintas a las aquí descritas sin tu consentimiento, cuando éste sea legalmente requerido.</p>

      <h2>Transferencia de datos personales</h2>
      <p>SAMA FORWARDING, S.A. de C.V. no vende, renta ni comercializa los datos personales de sus usuarios.</p>
      <p>Únicamente podrán ser compartidos cuando exista una obligación legal o cuando sea indispensable para la prestación del servicio solicitado, bajo las medidas de confidencialidad correspondientes.</p>

      <h2>Medidas de seguridad</h2>
      <p>Implementamos medidas administrativas, técnicas y organizacionales razonables para proteger tu información personal contra pérdida, uso indebido, acceso no autorizado, alteración o divulgación.</p>

      <h2>Derechos ARCO</h2>
      <p>Podrás ejercer en cualquier momento tus derechos de Acceso, Rectificación, Cancelación u Oposición (ARCO), así como revocar el consentimiento otorgado para el tratamiento de tus datos personales, enviando una solicitud al correo electrónico: <a href="mailto:info@samaforwarding.com">info@samaforwarding.com</a></p>
      <p>La solicitud deberá contener, al menos:</p>
      <ul>
        <li>Tu nombre completo.</li>
        <li>Un medio para comunicarte la respuesta.</li>
        <li>Una descripción clara del derecho que deseas ejercer.</li>
        <li>La información necesaria para acreditar tu identidad o, en su caso, la representación legal.</li>
      </ul>`;

  const cuerpo = en ? cuerpoEn : cuerpoEs;
  const main = `${breadcrumb(migas)}
    ${hero({ label: "Legal", h1: en ? "Privacy Notice" : "Aviso de Privacidad", sin: true })}
    <section class="section"><div class="container narrow legal">
      ${cuerpo}
    </div></section>`;

  emit(rutas.privacidad[lang], layout({
    title: (en ? "Privacy Notice | " : "Aviso de privacidad | ") + site.nombre,
    description: en
      ? "Privacy Notice of SAMA FORWARDING, S.A. de C.V. in accordance with Mexico's Federal Law on the Protection of Personal Data Held by Private Parties."
      : "Aviso de privacidad de SAMA FORWARDING, S.A. de C.V. conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
    canonical: rutas.privacidad[lang],
    schema: breadcrumbSchema(migas),
    bodyClass: "page-legal", main, lang,
  }));
}

// ============================================================
// BLOG (frontend estático) — overview + plantilla de artículo.
// Contenido editorial real + editor/backend = fase posterior.
// ============================================================
const BLOG_CATS = [
  "Corredor China-Manzanillo- Zona del Bajío", "Logística internacional",
  "Comercio Exterior", "Industria del Bajío", "Operación y criterio",
  "Guías y recursos descargables",
];

function buildBlog() {
  const migas = [{ label: "Inicio", href: "/" }, { label: "Blog" }];
  const pills = `<button class="pill is-active" type="button">Todos</button>` +
    BLOG_CATS.map((c) => `<button class="pill" type="button">${esc(c)}</button>`).join("");

  const main = `${breadcrumb(migas)}
    ${hero({ label: "Recursos y conocimiento", h1: "Lo que necesitas saber del corredor China–Manzanillo–Bajío", apoyo: "Artículos sobre logística industrial, tiempos del corredor, operación aduanal y gestión de importaciones recurrentes para plantas industriales del Bajío.", sin: true, sub: '<p class="blog-autoria">Escrito por quien opera el corredor todos los días.</p>' })}

    <section class="section">
      <div class="container">
        <div class="filtro-pills">${pills}</div>
        <p class="blog-pronto">Estamos preparando los primeros artículos del corredor. Muy pronto vas a encontrar aquí guías y análisis operativos.</p>
      </div>
    </section>

    <section class="section section--soft">
      <div class="container grid grid-2 leadmagnet">
        <div class="leadmagnet-mock" aria-hidden="true"><span>PDF</span></div>
        <div>
          <h2>La guía del corredor China-Puerto Manzanillo- Zona del Bajío</h2>
          <p>Tiempos reales de tránsito, puntos críticos del corredor, checklist de documentación y claves operativas para importadores del Bajío.</p>
          <form class="leadmagnet-form" action="#" novalidate>
            <input type="email" name="email" placeholder="tu@empresa.com" required aria-label="Email">
            <button type="submit" class="btn btn--primary">Descargar guía gratuita</button>
          </form>
          <p class="campo-ayuda">Sin spam. Te enviamos contenido relevante sobre el corredor cuando hay algo que vale la pena compartir.</p>
        </div>
      </div>
    </section>`;

  emit("/blog/", layout({
    title: "Blog | Logística industrial y corredor China-Manzanillo- Bajío | Sama Forwarding",
    description: "Artículos sobre logística industrial, importaciones desde China vía Puerto Manzanillo y gestión del corredor para empresas del Bajío. Contenido de Sama Forwarding.",
    canonical: "/blog/",
    schema: [{ "@context": "https://schema.org", "@type": "Blog", name: "Blog — " + site.nombre, url: D + "/blog/" }, breadcrumbSchema(migas)],
    bodyClass: "page-blog", main,
  }));

  // Plantilla de artículo (estructura; contenido real pendiente).
  const migasA = [{ label: "Inicio", href: "/" }, { label: "Blog", href: "/blog/" }, { label: "Artículo de ejemplo" }];
  const mainArt = `${breadcrumb(migasA)}
    ${hero({ label: "Corredor China-Manzanillo- Bajío", h1: "Título del artículo con la palabra clave principal", apoyo: "Estructura de artículo de ejemplo. El contenido editorial real lo produce Sama Forwarding.", sin: true })}
    <article class="container narrow blog-articulo">
      <p class="blog-meta"><strong>Andrea Vergara</strong> · Fecha de publicación · 6 min de lectura</p>
      <div class="blog-img" aria-hidden="true"></div>
      <p><em>Artículo de ejemplo — muestra la estructura (encabezados, párrafos, CTA inline, relacionados y firma). Pendiente el contenido real y el editor del panel.</em></p>
      <h2>Subtítulo con keyword secundaria</h2>
      <p>Párrafo de ejemplo. Los artículos tienen mínimo 800 palabras (1.200+ para pilares del corredor), párrafos cortos y términos técnicos explicados en su primera mención.</p>
      <h2>Otro subtítulo de navegación</h2>
      <p>Párrafo de ejemplo. Las listas y subtítulos hacen el contenido escaneable para el ICP.</p>
      <aside class="cta-inline">
        <h3>¿Tu operación necesita más control en el corredor?</h3>
        <p>Analizamos tu flujo de importación sin costo y sin compromiso.</p>
        <a class="btn btn--primary" href="/diagnostico-logistico/">Agendar diagnóstico logístico</a>
      </aside>
      <p class="blog-firma"><strong>Realizado por Sama Forwarding.</strong></p>
    </article>
    ${ctaCierre({ waKey: "home" })}`;

  emit("/blog/articulo-ejemplo/", layout({
    title: "Título del artículo | Sama Forwarding",
    description: "Artículo de ejemplo (estructura) del blog de Sama Forwarding sobre el corredor China–Manzanillo–Bajío.",
    canonical: "/blog/articulo-ejemplo/",
    head: '<meta name="robots" content="noindex, follow">',
    schema: [{ "@context": "https://schema.org", "@type": "Article", headline: "Título del artículo con la palabra clave principal", author: { "@type": "Person", name: "Andrea Vergara" }, publisher: { "@type": "Organization", name: site.nombre } }, breadcrumbSchema(migasA)],
    bodyClass: "page-blog-articulo", main: mainArt,
  }));
}

// ---- Run ----
buildHome("es");
buildHome("en"); // Home en inglés (Módulo bilingüe) — /en/
buildCorredor("es");
buildCorredor("en"); // /en/china-manzanillo-bajio-corridor/
buildServicios("es");
buildServicios("en"); // /en/services/
buildNosotros("es");
buildNosotros("en"); // /en/about-us/
buildCasos("es");
buildCasos("en"); // /en/cases/ + casos individuales
buildDiagnostico("es");
buildDiagnostico("en"); // /en/logistics-diagnostic/ (+ thank-you)
buildContacto("es");
buildContacto("en"); // /en/contact/ (+ thank-you)
// El blog ya NO se genera estático: se renderiza en el servidor desde Postgres
// (ver src/cms/blog-render.mjs + rutas /blog en server.js). buildBlog() quedó
// deshabilitado a propósito para no pisar el blog dinámico con HTML viejo.
buildPrivacidad("es");
buildPrivacidad("en"); // /en/privacy-notice/
build404("es");
build404("en"); // /en/404.html

// ---- sitemap.xml + robots.txt (F26 — SEO técnico estático) ----
// Indexables = todo lo emitido salvo gracias (noindex) y la 404.
const indexables = out.filter((r) => !r.includes("/gracias/") && r !== "/404.html");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexables.map((r) => `  <url><loc>${site.dominio}${r}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(ROOT, "sitemap.xml"), sitemap);

const robots = `User-agent: *
Allow: /
Disallow: /prototipo/
Disallow: /diagnostico-logistico/gracias/
Disallow: /contacto/gracias/

Sitemap: ${site.dominio}/sitemap.xml
`;
writeFileSync(join(ROOT, "robots.txt"), robots);

console.log(`✓ ${out.length} páginas reales generadas:`);
out.forEach((r) => console.log("  " + r));
console.log(`✓ sitemap.xml (${indexables.length} URLs) + robots.txt`);
