/* ============================================================
   Bilingüe ES/EN (Módulos A–C del doc).
   - Mapa de rutas: cada página conoce su URL en ambos idiomas.
     ES = sin prefijo (URLs actuales). EN = bajo /en/ con slug traducido.
   - Navegación y strings de UI por idioma.
   Los textos de CONTENIDO de cada página viven en src/content/*.mjs.
   ============================================================ */
import { site } from "./site.mjs";

export const rutas = {
  home:            { es: "/",                                 en: "/en/" },
  corredor:        { es: "/corredor-china-manzanillo-bajio/", en: "/en/china-manzanillo-bajio-corridor/" },
  servicios:       { es: "/servicios/",                       en: "/en/services/" },
  nosotros:        { es: "/nosotros/",                        en: "/en/about-us/" },
  casos:           { es: "/casos/",                           en: "/en/cases/" },
  diagnostico:     { es: "/diagnostico-logistico/",           en: "/en/logistics-diagnostic/" },
  contacto:        { es: "/contacto/",                        en: "/en/contact/" },
  blog:            { es: "/blog/",                            en: "/en/blog/" },
  privacidad:      { es: "/aviso-de-privacidad/",             en: "/en/privacy-notice/" },
  diagGracias:     { es: "/diagnostico-logistico/gracias/",   en: "/en/logistics-diagnostic/thank-you/" },
  contactoGracias: { es: "/contacto/gracias/",                en: "/en/contact/thank-you/" },
};

const byPath = {};
for (const [id, m] of Object.entries(rutas)) {
  byPath[m.es] = { id, lang: "es" };
  byPath[m.en] = { id, lang: "en" };
}

export const OTRO = (lang) => (lang === "es" ? "en" : "es");

// URL de una página por id + idioma.
export const rutaDe = (id, lang) => rutas[id]?.[lang] || (lang === "en" ? "/en/" : "/");

// La MISMA página en el otro idioma. Fallback: home del otro idioma (Módulo B.2).
export function counterpart(path, lang) {
  const info = byPath[path];
  if (info) return rutas[info.id][OTRO(lang)];
  // Blog dinámico (artículos y categorías): swap del prefijo /blog/ ↔ /en/blog/.
  if (lang === "es" && path.startsWith("/blog/")) return "/en" + path;
  if (lang === "en" && path.startsWith("/en/blog/")) return path.slice(3);
  return lang === "es" ? "/en/" : "/";
}

// URLs absolutas es/en para el hreflang (null si la ruta no está mapeada).
export function hreflangDe(path) {
  const info = byPath[path];
  if (info) return { es: site.dominio + rutas[info.id].es, en: site.dominio + rutas[info.id].en };
  // Blog dinámico: el mismo artículo/categoría existe en ambos prefijos.
  if (path.startsWith("/en/blog/")) return { es: site.dominio + path.slice(3), en: site.dominio + path };
  if (path.startsWith("/blog/")) return { es: site.dominio + path, en: site.dominio + "/en" + path };
  return null;
}

// Navegación principal. href se resuelve por id+idioma; los ítems del
// submenú de Servicios van todos a /servicios/ (o /en/services/).
export const navItems = [
  { id: "home", label: { es: "Inicio", en: "Home" } },
  {
    id: "corredor",
    label: { es: "Corredor China–Manzanillo - Bajío", en: "China–Manzanillo–Bajío Corridor" },
    short: { es: "Corredor", en: "Corridor" },
  },
  {
    id: "servicios",
    label: { es: "Servicios", en: "Services" },
    sub: [
      { es: "Flete Marítimo China–México", en: "China–Mexico Ocean Freight" },
      { es: "Transporte y Logística", en: "Transport & Logistics" },
      { es: "Almacenaje y Distribución", en: "Storage & Distribution" },
      { es: "Seguro de Carga y Custodia", en: "Cargo Insurance & Cargo Security" },
    ],
  },
  { id: "nosotros", label: { es: "Nosotros", en: "About Us" } },
  { id: "casos", label: { es: "Casos y Resultados", en: "Cases & Results" }, short: { es: "Casos", en: "Cases" } },
  { id: "blog", label: { es: "Blog", en: "Blog" } },
  { id: "contacto", label: { es: "Contacto", en: "Contact" } },
];

// Strings de UI compartidos (header, footer, selector de idioma).
export const ui = {
  ctaHeader: { es: "Diagnóstico Logístico", en: "Logistics Diagnostic" },
  // Label del botón de idioma: muestra el idioma AL QUE se cambia.
  langToggle: { es: "EN", en: "ES" },
  langToggleAria: { es: "View this page in English", en: "Ver esta página en español" },
  footerDesc: {
    es: "Especialistas en logística industrial en el corredor China–Manzanillo–Bajío. Operamos importaciones recurrentes para plantas industriales del Bajío.",
    en: "Industrial logistics specialists on the China–Manzanillo–Bajío corridor. We manage recurring imports for Bajío industrial plants.",
  },
  footerSitio: { es: "Sitio", en: "Site" },
  footerServicios: { es: "Servicios", en: "Services" },
  footerContacto: { es: "Contacto", en: "Contact" },
  footerDiag: { es: "Diagnóstico logístico", en: "Logistics Diagnostic" },
  footerResp: { es: `Respondemos en ${site.respuesta}.`, en: "We respond within 24 business hours." },
  footerDerechos: { es: "Todos los derechos reservados.", en: "All rights reserved." },
  footerCanales: {
    es: "Los únicos medios de comunicación oficiales de Sama Forwarding son los que aparecen en este sitio.",
    en: "The only official communication channels for Sama Forwarding are those listed on this site.",
  },
  avisoPriv: { es: "Aviso de privacidad", en: "Privacy notice" },
  disenoWeb: { es: "Diseño web por Agencia Comunícalo", en: "Web design by Agencia Comunícalo" },
  telLabel: { es: "Tel", en: "Phone" },
};
