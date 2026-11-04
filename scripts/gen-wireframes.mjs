/* ============================================================
   Generador de wireframes de baja fidelidad.
   Produce un index.html por página con las secciones que pide
   cada módulo del documento. Re-ejecutable: `node scripts/gen-wireframes.mjs`
   OJO: sobrescribe los wireframes. Cuando se maquete el diseño
   real, dejar de usar este generador para esas páginas.
   ============================================================ */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

function page({ file, title, desc, url, simpleHeader = false, sections = [], notes = [] }) {
  const headerInc = simpleHeader
    ? `<header class="wf-block" style="background:#fff;border:0;border-bottom:1px solid #dde5ec;padding:.8rem var(--container-pad);min-height:auto;"><div class="container" style="display:flex;justify-content:space-between;align-items:center;"><span class="wf-tag">LOGO SAMA</span><a data-wa="diagnostico">WhatsApp</a></div></header>`
    : `<div data-include="/partials/header.html"></div>`;

  const secHtml = sections.map(s => `
    <section class="section">
      <div class="container">
        <div class="${s.hero ? "wf-hero" : "wf-block"}">
          <span class="wf-tag">${s.tag}</span>
          <p class="wf-note">${s.note}</p>
        </div>
        ${s.map ? `<div data-corridor-map data-variant="${s.map}" style="margin-top:1.5rem;"></div>` : ""}
      </div>
    </section>`).join("");

  const notesHtml = notes.length
    ? `<div class="container"><div class="wf-banner">⚠ ${notes.join(" · ")}</div></div>` : "";

  const footerInc = simpleHeader ? "" : `<div data-include="/partials/footer.html"></div>`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="preload" href="/assets/fonts/montserrat-regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/fonts.css">
  <link rel="stylesheet" href="/assets/css/tokens.css">
  <link rel="stylesheet" href="/assets/css/base.css">
  <link rel="stylesheet" href="/assets/css/corridor-map.css">
  <link rel="stylesheet" href="/assets/css/wireframe.css">
</head>
<body>
  <div class="wf-pageinfo"><strong>WIREFRAME</strong> <span>${title.split("—")[0].trim()}</span> <code>${url}</code></div>
  ${headerInc}
  <main>
    ${notesHtml}
    ${secHtml}
  </main>
  ${footerInc}
  <script defer src="/assets/js/waypoints.js"></script>
  <script defer src="/assets/js/corridor-map.js"></script>
  <script defer src="/assets/js/whatsapp.js"></script>
  <script defer src="/assets/js/includes.js"></script>
</body>
</html>
`;
}

const PAGES = [
  { file: "index.html", url: "/", title: "SAMA Forwarding — Especialistas corredor China–Manzanillo–Bajío",
    desc: "Freight forwarding especializado en el corredor China → Manzanillo → Bajío. Control operativo punta a punta.",
    sections: [
      { tag: "1. Hero", hero: true, note: "Label 'Freight Forwarding especializado' + título 'No movemos carga. Tomamos decisiones que impactan tu operación' + CTA 'Agendar diagnóstico' / 'Ver cómo trabajamos'. Foto real con capa azul." },
      { tag: "2. Indicadores de confianza", note: "+10 años operando el corredor + industrias (Manufactura, Autopartes, Electrónica, Retail, Maquila, Construcción). NUNCA números en cero." },
      { tag: "3. El corredor (resumen)", note: "Mapa del Corredor versión compacta (Módulo 2) + texto de refuerzo. ↓", map: "compact" },
      { tag: "4. Servicios con jerarquía", note: "Grilla FIJA (no carrusel). Flete Marítimo = card destacada más grande." },
      { tag: "5. Proceso operativo", note: "'Tres pasos. Una operación bajo control.' 3 pasos conectados con animación al scroll." },
      { tag: "6. Prueba social", note: "Máx 2 testimonios reales + 1 caso breve (de los 3 casos del Módulo 7)." },
      { tag: "7. CTA de cierre", note: "Bloque azul '¿Tu operación necesita más control?' + botón diagnóstico + WhatsApp. SIN formulario." },
    ] },

  { file: "corredor-china-manzanillo-bajio/index.html", url: "/corredor-china-manzanillo-bajio/",
    title: "Corredor China–Manzanillo–Bajío — SAMA Forwarding",
    desc: "Control operativo en el corredor China–Puerto de Manzanillo–Zona del Bajío. Tiempos, riesgos y FAQ de importadores.",
    notes: ["Página pillar SEO: mín. 1.500 palabras (objetivo 2.000+). Tiempos/Riesgos/FAQ deben ir en el HTML, no por JS."],
    sections: [
      { tag: "1. Hero (sin botón)", hero: true, note: "Título 'Control operativo en el corredor China – Puerto de Manzanillo – Zona del Bajío'. Foto del puerto con capa azul." },
      { tag: "2. Por qué este corredor importa", note: "3 párrafos editoriales + dato '+40% del tráfico de contenedores de México pasa por Manzanillo'." },
      { tag: "3. Mapa interactivo del corredor", note: "Versión COMPLETA del Módulo 2. ↓ (render abajo)", map: "full" },
      { tag: "4. Tiempos operativos", note: "Línea de tiempo 5 etapas (booking, tránsito 21 días, arribo, despacho, transporte terrestre). En HTML." },
      { tag: "5. Riesgos del corredor", note: "5 tarjetas expandibles (<details>) color: rojo=riesgo / verde=cómo lo maneja Sama / azul=impacto." },
      { tag: "6. FAQ de importadores", note: "Acordeón 10 preguntas (<details>). Schema FAQPage. Navieras nombrables." },
      { tag: "7. CTA de cierre", note: "Igual que la home." },
    ] },

  { file: "servicios/index.html", url: "/servicios/", title: "Servicios — SAMA Forwarding",
    desc: "Portafolio de servicios de freight forwarding. Flete Marítimo China–México como servicio core.",
    sections: [
      { tag: "1. Hero", hero: true, note: "Título + subtítulo, sin botón, sin listar servicios en cabecera." },
      { tag: "2. Grilla de servicios (FIJA)", note: "4 servicios visibles a la vez (sin Agencia Aduanal). Íconos SVG a medida. Flete Marítimo destacado (badge 'Servicio core')." },
      { tag: "3. CTA de cierre", note: "Al diagnóstico + WhatsApp." },
    ] },

  ...["flete-maritimo-china-mexico","transporte-y-logistica","almacenaje-y-distribucion","seguro-de-carga"].map((slug, i) => ({
    file: `servicios/${slug}/index.html`, url: `/servicios/${slug}/`,
    title: `${slug.replace(/-/g," ")} — SAMA Forwarding`,
    desc: `Servicio de ${slug.replace(/-/g," ")} dentro del corredor China–Manzanillo–Bajío.`,
    notes: i === 0 ? ["Subpágina CORE (Flete Marítimo): debe existir desde el día 1."] : [],
    sections: [
      { tag: "Hero compacto + breadcrumb", hero: true, note: `Servicios / ${slug.replace(/-/g," ")}` },
      { tag: "Qué incluye", note: "Lista de capacidades del servicio." },
      { tag: "Cómo opera en el corredor", note: "Mapa del Corredor versión ESTÁTICA (Módulo 2)." },
      { tag: "Para quién es / para quién no", note: "Filtro de encaje." },
      { tag: "Mini-FAQ propia", note: "Acordeón corto." },
      { tag: "CTA de cierre", note: "Al diagnóstico + WhatsApp." },
    ] })),

  { file: "nosotros/index.html", url: "/nosotros/", title: "Nosotros — SAMA Forwarding",
    desc: "Quiénes somos: Andrea Vergara, el equipo, la historia del corredor y nuestros valores.",
    notes: ["EXCEPCIÓN: el CTA principal lleva a /corredor-..., NO al diagnóstico.", "Pendiente: foto de Marisol · decidir valores 5 vs 6."],
    sections: [
      { tag: "1. Hero", hero: true, note: "Humaniza la marca. En B2B las personas compran a personas." },
      { tag: "2. Perfil de Andrea Vergara", note: "Directora General, en primera persona. Activo de confianza más fuerte." },
      { tag: "3. El equipo", note: "Cards: Andrea, Marisol (falta foto), Joaquín. Frase corta ANTES de foto/descripción." },
      { tag: "4. Historia centrada en el corredor", note: "+10 años operando UN solo corredor." },
      { tag: "5. Valores", note: "Especialización, Transparencia, Confianza, Compromiso, Criterio (+ Mejora continua si va 6)." },
      { tag: "6. CTA → Corredor", note: "'Conoce cómo trabajamos'. NO al diagnóstico (excepción única)." },
    ] },

  { file: "casos/index.html", url: "/casos/", title: "Casos y resultados — SAMA Forwarding",
    desc: "Casos reales anónimos de importadores del Bajío que operan el corredor China–Manzanillo.",
    notes: ["3 casos reales anónimos. Filtro por industria NO se implementa todavía (son menos de 4)."],
    sections: [
      { tag: "1. Hero", hero: true, note: "La evidencia / prueba social." },
      { tag: "2. Grilla de casos (3 cards)", note: "Manufactura · Autopartes · Retail. Cada card linkea a su URL propia. SIN filtro de industria." },
      { tag: "3. CTA de cierre", note: "Punto de mayor conversión del sitio." },
    ] },

  ...[
    ["manufactura-control-importaciones","Mayor control sobre importaciones recurrentes desde China"],
    ["autopartes-coordinacion-logistica","Mejor coordinación logística para abastecimiento de producción"],
    ["retail-temporadas-alta-demanda","Importaciones más organizadas para temporadas de alta demanda"],
  ].map(([slug, titulo]) => ({
    file: `casos/${slug}/index.html`, url: `/casos/${slug}/`,
    title: `${titulo} — Caso SAMA Forwarding`,
    desc: `${titulo}. Caso real anónimo del corredor China–Manzanillo–Bajío.`,
    sections: [
      { tag: "1. Encabezado", hero: true, note: `Industria + título: '${titulo}' + contexto.` },
      { tag: "2. Contexto de la empresa", note: "Anónimo." },
      { tag: "3. El desafío", note: "Bloque clave, con el lenguaje real del gerente." },
      { tag: "4. Cómo se construyó la operación", note: "Decisiones con criterio, no lista de servicios." },
      { tag: "5. El resultado", note: "Dato destacado." },
      { tag: "6. CTA de cierre + testimonio", note: "Testimonio aprobado (se reutiliza en Home)." },
    ] })),

  { file: "diagnostico-logistico/index.html", url: "/diagnostico-logistico/", simpleHeader: true,
    title: "Diagnóstico Logístico — SAMA Forwarding",
    desc: "Analizamos tu operación de importación desde China, gratis y sin compromiso. Te respondemos en 24 hs hábiles.",
    notes: ["PROHIBIDO publicar sin el tracking configurado.", "Header simplificado: logo + WhatsApp, sin menú."],
    sections: [
      { tag: "Layout 50/50 — Izquierda: oferta de valor", hero: true, note: "'Analizamos tu operación gratis y sin compromiso'. Header simplificado." },
      { tag: "Derecha: formulario de calificación (10 campos)", note: "Card blanca con sombra (elemento dominante). 1.Nombre 2.Empresa 3.Cargo 4.Email corp 5.Tel 6.Origen 7.Volumen 8.Frecuencia 9.Destino 10.Desafío(opcional). Botón 'Agendar diagnóstico'." },
      { tag: "Bloque 'Qué pasa después' (3 pasos)", note: "Revisamos tu operación → te contactamos en 24 hs hábiles → te mostramos puntos de mejora." },
    ] },

  { file: "diagnostico-logistico/gracias/index.html", url: "/diagnostico-logistico/gracias/", simpleHeader: true,
    title: "Gracias — Diagnóstico Logístico — SAMA Forwarding",
    desc: "Recibimos tu solicitud de diagnóstico. Te contactamos en 24 hs hábiles.",
    sections: [
      { tag: "Confirmación", hero: true, note: "Dispara evento de conversión (diagnóstico). Sin formulario." },
      { tag: "Botones de continuidad", note: "'Conoce el corredor' y 'Ver casos'." },
    ] },

  { file: "contacto/index.html", url: "/contacto/", title: "Contacto — SAMA Forwarding",
    desc: "Conversemos sobre tu operación. Tel 33-2153-3756 · WhatsApp +52 33 1466 5908 · info@samaforwarding.com",
    sections: [
      { tag: "1. Hero breve", hero: true, note: "Baja fricción." },
      { tag: "2. Bloque 2 columnas", note: "Izq: datos de contacto SIEMPRE visibles (tel, WhatsApp, email, Zapopan, L–V 8:30–18:30). Der: formulario corto 6 campos." },
      { tag: "3. Mapa de ubicación", note: "Google Maps Embed (iframe, sin API key), carga diferida." },
      { tag: "4. CTA suave al diagnóstico", note: "Después del formulario." },
    ] },

  { file: "contacto/gracias/index.html", url: "/contacto/gracias/", title: "Gracias — Contacto — SAMA Forwarding",
    desc: "Recibimos tu mensaje. Te respondemos a la brevedad.",
    sections: [
      { tag: "Confirmación", hero: true, note: "Evento de conversión SEPARADO del de diagnóstico." },
    ] },

  { file: "blog/index.html", url: "/blog/", title: "Blog — SAMA Forwarding",
    desc: "Contenido sobre importación desde China, el corredor Manzanillo–Bajío y logística internacional.",
    notes: ["Contenido del artículo SIEMPRE en HTML del servidor, no por JS. Backend Node + BD (Módulo 9)."],
    sections: [
      { tag: "1. Hero tipográfico + artículo destacado", hero: true, note: "Card grande, elegido por relevancia (no por fecha)." },
      { tag: "2. Filtro por categoría (pills)", note: "Sin recargar la página. Categorías padre/hijo (Módulo 9)." },
      { tag: "3. Grilla de artículos", note: "3 col escritorio / 2 celular. Card: img 16:9, categoría, título, descripción, autor/fecha/lectura." },
      { tag: "4. Recurso descargable (lead magnet)", note: "PDF 'Guía del corredor' a cambio de email → lista nurturing separada." },
    ] },

  { file: "blog/articulo-ejemplo/index.html", url: "/blog/articulo-ejemplo/", title: "Título del artículo — Blog SAMA Forwarding",
    desc: "Artículo de ejemplo (plantilla). Cuerpo mínimo 800 palabras, autoría de Andrea.",
    sections: [
      { tag: "Breadcrumb + título + autor (Andrea) + imagen", hero: true, note: "H1 = título. Imagen principal con ALT." },
      { tag: "Cuerpo del artículo", note: "Mín 800 palabras (1.200+ pilares). Subtítulos H2/H3 + índice si supera 1.000 palabras. CTA inline contextual." },
      { tag: "Cierre", note: "3 artículos relacionados + firma de Andrea + CTA al diagnóstico." },
    ] },
];

// Estas rutas ya son páginas REALES (las maneja build.mjs). No las pisamos
// con wireframes. El generador solo cubre lo que sigue pendiente (Bloques 3–4).
const OWNED_BY_BUILD = (f) =>
  f === "index.html" || f === "404.html" ||
  /^(corredor-|servicios\/|nosotros\/|casos\/|diagnostico-logistico\/|contacto\/|blog\/|aviso-de-privacidad\/)/.test(f);

let count = 0, skipped = 0;
for (const p of PAGES) {
  if (OWNED_BY_BUILD(p.file)) { skipped++; continue; }
  const out = join(ROOT, p.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(p));
  count++;
}

// 404 (status 404 real lo maneja el server; acá el contenido)
const notFound = page({
  file: "404.html", url: "/404.html", title: "Página no encontrada — SAMA Forwarding",
  desc: "Esta página no existe.",
  sections: [
    { tag: "404 — Esta página no existe", hero: true, note: "Ilustración SVG minimalista del corredor (no astronautas)." },
    { tag: "Tarjetas de rescate (máx 4)", note: "Inicio · Corredor · Servicios · Diagnóstico + WhatsApp. meta robots noindex,follow." },
  ],
});
writeFileSync(join(ROOT, "404.html"), notFound);
count++;

console.log(`✓ ${count} wireframes generados en /public (${skipped} rutas omitidas: ya son páginas reales de build.mjs)`);
