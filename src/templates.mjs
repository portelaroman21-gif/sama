/* ============================================================
   Templates del mini SSG (Bloque 2) — bilingüe ES/EN.
   Partials INLINE en el HTML (regla SEO: contenido en el HTML inicial).
   `lang` por defecto "es" → las páginas ya existentes no cambian su
   comportamiento hasta que el build les pase lang="en".
   ============================================================ */
import { site, waMensajes, waMensajesEn } from "./content/site.mjs";
import { navItems, ui, rutaDe, counterpart, hreflangDe, OTRO } from "./content/i18n.mjs";

// Escapa texto para atributos/HTML
export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Link de WhatsApp con mensaje precargado (Plan Maestro §4.3 — F23a).
// landing=true usa el WhatsApp del footer simplificado (+52 33 1473 2213).
export function waLink(key = "home", label = "", { landing = false, extraClass = "", lang = "es" } = {}) {
  const num = landing ? site.whatsappLandingNum : site.whatsappNum;
  const msgs = lang === "en" ? waMensajesEn : waMensajes;
  const msg = msgs[key] || msgs.footer;
  const href = "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
  const cls = "wa-link" + (extraClass ? " " + extraClass : "");
  return `<a class="${cls}" href="${href}" target="_blank" rel="noopener" data-wa="${esc(key)}" aria-label="WhatsApp">${label || "WhatsApp"}</a>`;
}

// ---- Banderas + botón selector de idioma (Módulo B) ----
const FLAG = {
  // Bandera de EE.UU. (para pasar a inglés)
  en: '<svg class="flag" viewBox="0 0 20 14" width="20" height="14" aria-hidden="true"><rect width="20" height="14" rx="2" fill="#fff"/><g fill="#b22234"><rect width="20" height="1.55"/><rect width="20" height="1.55" y="3.1"/><rect width="20" height="1.55" y="6.2"/><rect width="20" height="1.55" y="9.3"/><rect width="20" height="1.55" y="12.45"/></g><rect width="9" height="7.75" fill="#3c3b6e"/></svg>',
  // Bandera de México (para volver al español)
  es: '<svg class="flag" viewBox="0 0 21 14" width="21" height="14" aria-hidden="true"><rect width="21" height="14" rx="2" fill="#fff"/><rect width="7" height="14" fill="#006847"/><rect width="7" height="14" x="14" fill="#ce1126"/></svg>',
};
function langBtn(lang, path) {
  const target = OTRO(lang); // idioma al que se cambia
  const href = counterpart(path, lang);
  return `<a class="lang-toggle" href="${href}" hreflang="${target}" lang="${target}" aria-label="${esc(ui.langToggleAria[lang])}">${FLAG[target]}<span>${ui.langToggle[lang]}</span></a>`;
}

// ---- HEADER ----
export function header({ simple = false, lang = "es", path = "/" } = {}) {
  if (simple) {
    return `<header class="site-header site-header--simple">
  <div class="container header-inner">
    <a class="logo" href="${rutaDe("home", lang)}" aria-label="SAMA Forwarding — Inicio">SAMA<span>Forwarding</span></a>
    ${waLink("diagnostico", '<span class="ti">WhatsApp</span>', { landing: true, lang })}
  </div>
</header>`;
  }

  const items = navItems.map((it) => {
    const txt = esc(it.label[lang]);
    if (it.sub) {
      const subs = it.sub.map((s) => `<li><a href="${rutaDe("servicios", lang)}">${esc(s[lang])}</a></li>`).join("");
      return `<li class="has-sub">
        <a href="${rutaDe(it.id, lang)}" aria-haspopup="true" aria-expanded="false">${txt} <span class="caret" aria-hidden="true">▾</span></a>
        <ul class="submenu">${subs}</ul>
      </li>`;
    }
    return `<li><a href="${rutaDe(it.id, lang)}">${txt}</a></li>`;
  }).join("");

  return `<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="logo-img" href="${rutaDe("home", lang)}" aria-label="SAMA Forwarding — Inicio"><img src="/assets/img/logo-color.png" alt="SAMA Forwarding" width="120" height="42"></a>
    <button class="nav-toggle" aria-label="Menú" aria-expanded="false" data-nav-toggle>
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" aria-label="Principal" data-nav>
      <ul class="nav-list">${items}</ul>
      <a class="btn btn--primary nav-cta" href="${rutaDe("diagnostico", lang)}">${esc(ui.ctaHeader[lang])}</a>
      ${langBtn(lang, path)}
    </nav>
  </div>
</header>`;
}

// ---- FOOTER estándar (Plan Maestro §1.2 — 4 columnas) ----
export function footer(lang = "es") {
  const sitio = navItems.map((n) => `<li><a href="${rutaDe(n.id, lang)}">${esc(n.label[lang])}</a></li>`).join("");
  const servItem = navItems.find((n) => n.id === "servicios");
  const servicios = (servItem?.sub || [])
    .map((s) => `<li><a href="${rutaDe("servicios", lang)}">${esc(s[lang])}</a></li>`).join("");

  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-col footer-brand">
      <a class="logo-img logo-img--footer" href="${rutaDe("home", lang)}" aria-label="SAMA Forwarding — Inicio"><img src="/assets/img/logo-blanco.png" alt="SAMA Forwarding" width="165" height="58" loading="lazy"></a>
      <p>${esc(ui.footerDesc[lang])}</p>
      <div class="footer-soc">
        <a href="https://www.linkedin.com/company/sama-forwarding/" target="_blank" aria-label="LinkedIn de SAMA Forwarding" rel="noopener">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.3 1.57-2.3 3.2V21H9z"/></svg>
        </a>
        <a href="https://www.instagram.com/samaforwarding/" target="_blank" aria-label="Instagram de SAMA Forwarding" rel="noopener">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.36.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.36.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77.55-.55 1.11-.89 1.77-1.15.64-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm5.4-.6a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1zM12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-col">
      <h3>${esc(ui.footerSitio[lang])}</h3>
      <ul class="footer-list">${sitio}</ul>
    </div>
    <div class="footer-col">
      <h3>${esc(ui.footerServicios[lang])}</h3>
      <ul class="footer-list">${servicios}<li><a href="${rutaDe("diagnostico", lang)}">${esc(ui.footerDiag[lang])}</a></li></ul>
    </div>
    <div class="footer-col footer-contacto-col">
      <h3>${esc(ui.footerContacto[lang])}</h3>
      <address class="footer-contacto">
        <p>${esc(site.direccion)}</p>
        <p>${esc(ui.telLabel[lang])}: <a href="tel:${site.tel.replace(/[^0-9]/g, "")}">${site.tel}</a></p>
        <p><a href="mailto:${site.emailFooter}">${site.emailFooter}</a></p>
        <p class="footer-resp">${esc(ui.footerResp[lang])}</p>
      </address>
      ${waLink("footer", '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zM12.04 20.15h-.01a8.22 8.22 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1.01 2.54.12.16 1.74 2.65 4.21 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg>', { extraClass: "wa-link--ico", lang })}
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <p>© <span data-year>2026</span> ${esc(site.nombre)}. ${esc(ui.footerDerechos[lang])} · ${esc(ui.footerCanales[lang])} · <a href="${rutaDe("privacidad", lang)}">${esc(ui.avisoPriv[lang])}</a> · <strong><a href="https://mktcomunicalo.com" target="_blank" rel="noopener">${esc(ui.disenoWeb[lang])}</a></strong></p>
    </div>
  </div>
</footer>`;
}

// ---- FOOTER simplificado (solo landing de diagnóstico y su gracias) ----
export function footerSimple(lang = "es") {
  return `<footer class="site-footer site-footer--simple">
  <div class="container footer-simple-inner">
    <a class="logo-img" href="${rutaDe("home", lang)}" aria-label="SAMA Forwarding — Inicio"><img src="/assets/img/logo-blanco.png" alt="SAMA Forwarding" width="120" height="42" loading="lazy"></a>
    <p class="footer-simple-data">
      <a href="mailto:${site.emailFooter}">${site.emailFooter}</a>
      · <a href="tel:${site.tel.replace(/[^0-9]/g, "")}">${site.tel}</a>
      · ${waLink("diagnostico", site.whatsappLanding, { landing: true, lang })}
    </p>
    <p class="footer-simple-legal">© <span data-year>2026</span> ${esc(site.nombre)}.</p>
  </div>
</footer>`;
}

// ---- BREADCRUMB ----
export function breadcrumb(items = []) {
  const li = items.map((it, i) => {
    const last = i === items.length - 1;
    return last
      ? `<li aria-current="page">${esc(it.label)}</li>`
      : `<li><a href="${it.href}">${esc(it.label)}</a></li>`;
  }).join("");
  return `<nav class="breadcrumb" aria-label="Migas de pan"><div class="container"><ol>${li}</ol></div></nav>`;
}

// ---- CTA de cierre (reutilizable, bilingüe) ----
export function ctaCierre({
  label = "",
  titulo = "¿Tu operación en el corredor necesita más control?",
  texto = "Analizamos tu operación de importación desde China, sin costo y sin compromiso.",
  waKey = "home",
  lang = "es",
} = {}) {
  const btnDiag = lang === "en" ? "Schedule a logistics diagnostic" : "Agendar diagnóstico logístico";
  const btnWa = lang === "en" ? "Send a WhatsApp message" : "Enviar WhatsApp";
  return `<section class="cta-cierre">
  <div class="container cta-inner">
    ${label ? `<span class="label label--light">${esc(label)}</span>` : ""}
    <h2>${esc(titulo)}</h2>
    <p>${esc(texto)}</p>
    <div class="cta-actions">
      <a class="btn btn--primary" href="${rutaDe("diagnostico", lang)}">${btnDiag}</a>
      ${waLink(waKey, btnWa, { lang })}
    </div>
  </div>
</section>`;
}

// ---- LAYOUT (documento completo) ----
export function layout({
  title, description, canonical = "/", bodyClass = "",
  simpleHeader = false, simpleFooter = false, useMap = false, useMapaCorredor = false,
  ogImage = "/assets/img/og-default.jpg",
  schema = "", head = "", main = "", lang = "es",
}) {
  const scripts = (useMap
    ? `<script defer src="/assets/js/waypoints.js"></script>
  <script defer src="/assets/js/corridor-map.js"></script>`
    : "") + (useMapaCorredor
    ? `\n  <script defer src="/assets/js/mapa-corredor.js"></script>`
    : "");

  // hreflang cruzado (Módulo C.2). Solo si la ruta está en el mapa bilingüe.
  const alt = hreflangDe(canonical);
  const hreflang = alt
    ? `\n  <link rel="alternate" hreflang="es" href="${alt.es}">
  <link rel="alternate" hreflang="en" href="${alt.en}">
  <link rel="alternate" hreflang="x-default" href="${alt.es}">`
    : "";

  return `<!doctype html>
<html lang="${lang}">
<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-9S5P0XV7KZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-9S5P0XV7KZ');
  </script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${site.dominio}${canonical}">${hreflang}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:locale" content="${lang === "en" ? "en_US" : "es_MX"}">
  <meta property="og:url" content="${site.dominio}${canonical}">
  <meta property="og:image" content="${site.dominio}${ogImage}">
  <link rel="preload" href="/assets/fonts/montserrat-regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/fonts.css">
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/components.css">
  ${useMap ? '<link rel="stylesheet" href="/assets/css/corridor-map.css">' : ""}
  ${useMapaCorredor ? '<link rel="stylesheet" href="/assets/css/mapa-corredor.css">' : ""}
  ${head}
  ${(Array.isArray(schema) ? schema : (schema ? [schema] : []))
    .map((s) => `<script type="application/ld+json">${typeof s === "string" ? s : JSON.stringify(s)}</script>`)
    .join("\n  ")}
</head>
<body class="${bodyClass}">
  ${header({ simple: simpleHeader, lang, path: canonical })}
  <main id="contenido">
${main}
  </main>
  ${simpleFooter ? footerSimple(lang) : footer(lang)}
  <script defer src="/assets/js/site.js"></script>
  ${scripts}
</body>
</html>`;
}
