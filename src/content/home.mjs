/* ============================================================
   Contenido de la Home (Plan Maestro §2.1). 7 secciones de funnel.
   Bilingüe: home.es (COPY aprobado) / home.en (Copy Deck ES-EN, TAL CUAL).
   ============================================================ */

export const home = {
  es: {
    title: "Freight Forwarding China–México | Sama Forwarding",
    description: "Freight forwarding especializado en el corredor China–Manzanillo–Bajío. Controlamos tu importación de punta a punta. Agenda un diagnóstico sin costo.",

    hero: {
      label: "Freight Forwarder especializado",
      h1: "No movemos carga. Tomamos decisiones que impactan tu operación",
      apoyo: "Control operativo en el corredor China – Manzanillo – Zona del Bajío",
      ctaPrimario: { label: "Agendar diagnóstico logístico", href: "/diagnostico-logistico/" },
      ctaSecundario: { label: "Ver cómo trabajamos", href: "#proceso" },
      video: "/assets/video/hero-home.mp4",
      poster: "/assets/img/hero-home-poster.jpg",
    },
    indicadores: { aniosValor: 11, anios: "Años", sub: "Operando el corredor", texto: "Trabajamos con:" },
    corredorResumen: {
      label: "Nuestro corredor",
      titulo: "Control operativo en el corredor China–Manzanillo–Bajío",
      texto: "No operamos todos los corredores del mundo. Operamos este. Y lo hacemos con el nivel de cada detalle que solo da el conocimiento acumulado de cada operación, cada naviera y cada kilómetro entre el puerto y el Bajío",
    },
    servLabel: "Servicios",
    proceso: {
      label: "Cómo trabajamos",
      titulo: "Tres pasos. Una operación bajo control",
      subtitulo: "Desde el origen en China hasta tu planta en el Bajío, sin intermediarios desconectados, sin sorpresas ni desvíos no comunicados",
      pasos: [
        { n: "01", icono: "ruta", titulo: "Planificamos tu operación desde China hasta el Bajío", texto: "Analizamos tu cadena logística, definimos la ruta óptima en el corredor y coordinamos el booking con las navieras. Tu tomas decisiones con información real, no estimaciones." },
        { n: "02", icono: "radar", titulo: "Seguimiento y visibilidad en cada etapa del tránsito", texto: "Monitoreamos el estado de tu carga desde el zarpe en China hasta el arribo a Manzanillo. Te informamos proactivamente, no esperamos a que preguntes." },
        { n: "03", icono: "check", titulo: "Entrega en tu planta o almacén", texto: "Transferimos la carga a tu destino final en el Bajío. Operación cerrada, entrega documentada." },
      ],
    },
    pruebaSocial: { titulo: "Operaciones reales, resultados reales", verMas: "Ver más casos" },
    cierre: {
      label: "Siguiente paso",
      titulo: "¿Tu operación en el corredor necesita más control?",
      texto: "Analizamos tu cadena logística actual del corredor China–Manzanillo–Bajío y te mostramos con precisión dónde están los puntos de mejora. Sin costo. Sin compromiso. Con el criterio de quien opera este corredor todos los días.",
    },
  },

  en: {
    title: "Freight Forwarding China–Mexico | Operational Control Manzanillo–Bajío | Sama Forwarding",
    description: "We manage imports from China to the Bajío with full operational control. Ocean freight and ground transportation. China–Manzanillo corridor.",

    hero: {
      label: "Specialized Freight Forwarder",
      h1: "We don't just move cargo. We make decisions that impact your operation",
      apoyo: "Operational control on the China – Manzanillo – Bajío Region corridor",
      ctaPrimario: { label: "Schedule a logistics diagnostic", href: "/en/logistics-diagnostic/" },
      ctaSecundario: { label: "See how we work", href: "#proceso" },
      video: "/assets/video/hero-home.mp4",
      poster: "/assets/img/hero-home-poster.jpg",
    },
    indicadores: { aniosValor: 11, anios: "Years", sub: "Operating the corridor", texto: "We work with:" },
    corredorResumen: {
      label: "Our corridor",
      titulo: "Operational control across the China–Manzanillo–Bajío corridor",
      texto: "We don't operate every corridor in the world. We operate this one. And we do it with the level of detail that only comes from accumulated knowledge of every operation, every shipping line, and every kilometer between the port and the Bajío",
    },
    servLabel: "Services",
    proceso: {
      label: "How we work",
      titulo: "Three steps. One operation under control",
      subtitulo: "From origin in China to your plant in the Bajío, with no disconnected intermediaries, no surprises, and no unreported deviations",
      pasos: [
        { n: "01", icono: "ruta", titulo: "We plan your operation from China to the Bajío", texto: "We analyze your supply chain, define the optimal route on the corridor, and coordinate booking with shipping lines. You make decisions with real information, not estimates." },
        { n: "02", icono: "radar", titulo: "Tracking and visibility at every stage of transit", texto: "We monitor your cargo status from departure in China to arrival in Manzanillo. We inform you proactively — we don't wait for you to ask." },
        { n: "03", icono: "check", titulo: "Delivery to your plant or warehouse", texto: "We transfer the cargo to your final destination in the Bajío. End-to-end operation with documented delivery." },
      ],
    },
    pruebaSocial: { titulo: "Real operations, real results", verMas: "See more cases" },
    cierre: {
      label: "Next step",
      titulo: "Does your operation on the corridor need more control?",
      texto: "We analyze your current supply chain on the China–Manzanillo–Bajío corridor and show you precisely where the improvement opportunities are. No cost. No obligation. With the expertise of a team that operates this corridor every day.",
    },
  },
};
