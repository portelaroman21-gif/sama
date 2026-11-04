/* ============================================================
   Contenido global del sitio — FUENTE ÚNICA DE DATOS (F1).
   Todos los datos de contacto, navegación y mensajes de WhatsApp
   salen de acá. Cambiar un valor lo cambia en TODO el sitio.

   ⚠️ DUPLICIDAD A CONFIRMAR CON EL CLIENTE (Plan Maestro §2.1):
   - Dos emails:   info@samaforwarding.com (público)  vs  avergara@samaforwarding.com (footer/firmas)
   - Dos WhatsApp: +52 33 1466 5908 (contacto)         vs  +52 33 1473 2213 (footer simplificado/landing)
   Se respeta tal cual el brief, centralizado acá. Confirmar antes de lanzar.
   ============================================================ */

export const site = {
  nombre: "SAMA Forwarding",
  dominio: "https://www.samaforwarding.com",

  // ---- Contacto ----
  tel: "33-2153-3756",                       // link tel: clickeable en mobile

  whatsapp: "+52 33 1466 5908",              // WhatsApp de contacto
  whatsappNum: "",                           // solo dígitos — se deriva abajo

  // Email único (v2): info@ en todo el sitio (footer + contacto)
  email: "info@samaforwarding.com",
  emailFooter: "info@samaforwarding.com",

  // WhatsApp del footer simplificado (solo landing de diagnóstico)
  whatsappLanding: "+52 33 1473 2213",

  direccion: "Calzada Central 290, Interior 406, Ciudad Granja, Zapopan, Jalisco",
  direccionCorta: "Zapopan, Jalisco",
  horario: "Lunes a viernes, 08:30 – 18:00",
  respuesta: "24 horas hábiles",

  transito: "21 días",                       // tránsito marítimo (set único §2.3)
  puertaAPuerta: "≈ 28 días",                // total puerta a puerta (§2.3)

  // Mensaje rector (obligatorio en home y piezas clave)
  rector: "No movemos carga. Tomamos decisiones que impactan tu operación.",
};

// Solo dígitos para los links wa.me (se derivan de los valores de arriba).
site.whatsappNum = site.whatsapp.replace(/[^0-9]/g, "");          // 523314665908
site.whatsappLandingNum = site.whatsappLanding.replace(/[^0-9]/g, ""); // 523314732213

// ---- Mensajes de WhatsApp precargados por página (Plan Maestro §4.3) ----
// Se codifican con encodeURIComponent en waLink(). Texto literal del doc.
export const waMensajes = {
  home: "Hola. Importamos desde China y me interesa conocer más sobre: ",
  corredor: "Hola, leí sobre el corredor China–Manzanillo–Bajío en su sitio y me interesa el diagnóstico logístico. ¿Podemos hablar?",
  servicios: "Hola, estuve revisando los servicios de Sama Forwarding. Importamos desde China al Bajío y me interesa saber si tienen experiencia con: ",
  casos: "Hola, leí los casos en el sitio de Sama Forwarding. Tenemos una operación de importación desde China al Bajío y me interesa evaluar el flujo logístico actual. ¿Podemos hablar?",
  contactoGracias: "Hola, acabo de enviar un formulario de contacto en su sitio. Quería confirmar la recepción.",
  error404: "Hola, he llegado a una página de error en su sitio y no encuentro la información que buscaba. ¿Me puedes ayudar?",
  // Genérico para footer / diagnóstico (no especificado literal en el doc)
  diagnostico: "Hola, importamos desde China al Bajío y me interesa el diagnóstico logístico. ¿Podemos hablar?",
  footer: "Hola, importamos desde China al Bajío y quiero más información sobre Sama Forwarding.",
};

// Versión EN de los mensajes precargados (Módulo D/E del doc bilingüe).
export const waMensajesEn = {
  home: "Hello. We import from China and I'd like to learn more about: ",
  corredor: "Hello, I read about the China–Manzanillo–Bajío corridor on your site and I'm interested in the logistics diagnostic. Can we talk?",
  servicios: "Hello, I was looking at Sama Forwarding's services. We import from China to the Bajío and I'd like to know if you have experience with: ",
  casos: "Hello, I read the cases on Sama Forwarding's site. We run an import operation from China to the Bajío and I'd like to assess our current logistics flow. Can we talk?",
  contactoGracias: "Hello, I just submitted a contact form on your site. I wanted to confirm you received it.",
  error404: "Hello, I landed on an error page on your site and can't find the information I was looking for. Can you help me?",
  diagnostico: "Hello, we import from China to the Bajío and I'm interested in the logistics diagnostic. Can we talk?",
  footer: "Hello, we import from China to the Bajío and would like more information about Sama Forwarding.",
};

// Navegación principal (header estándar).
// Ronda v2: subpáginas de servicio ELIMINADAS — los ítems del submenú
// listan los nombres pero TODOS van a /servicios/. Agencia Aduanal se
// quita del listado ("no existe").
export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Corredor China–Manzanillo - Bajío", short: "Corredor", href: "/corredor-china-manzanillo-bajio/" },
  {
    label: "Servicios", href: "/servicios/",
    sub: [
      { label: "Flete Marítimo China–México", href: "/servicios/" },
      { label: "Transporte y Logística", href: "/servicios/" },
      { label: "Almacenaje y Distribución", href: "/servicios/" },
      { label: "Seguro de Carga y Custodia", href: "/servicios/" },
    ],
  },
  { label: "Nosotros", href: "/nosotros/" },
  { label: "Casos y Resultados", short: "Casos", href: "/casos/" },
  // "Blog / Recursos" OCULTO del menú y footer (la página /blog/ sigue existiendo).
  { label: "Contacto", href: "/contacto/" },
];

// Industrias atendidas (indicadores de confianza — Plan Maestro §2.1 Home)
export const industrias = [
  "Manufactura", "Autopartes", "Electrónica", "Retail", "Maquila", "Construcción",
];

// EN — mismos íconos (se mapean por índice/posición en el build).
export const industriasEn = [
  "Manufacturing", "Auto parts", "Electronics", "Retail", "Maquila", "Construction",
];
