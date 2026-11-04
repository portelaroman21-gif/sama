/* ============================================================
   Contenido de Servicios (Plan Maestro §2.3 / §2.4).
   5 servicios CON Agencia Aduanal. Jerarquía:
   - Flete Marítimo = CORE (badge "Servicio core").
   - Agencia Aduanal = PRIORITARIO (2ª posición, sin badge, borde primario).
   - Resto = complementario.
   Resúmenes = COPY EXACTO. Cuerpos de detalle (intro/incluye/faq) = BORRADOR
   pendiente de aprobación del cliente (no están en el documento).
   ============================================================ */

export const serviciosMeta = {
  // SEO (title del doc — condensar a ≤60 en F26/SEO)
  title: "Servicios de Freight Forwarding | China-Manzanillo-Bajío | Sama Forwarding",
  description: "Portafolio de freight forwarding para el corredor China–Manzanillo–Bajío: flete marítimo, agencia aduanal, transporte, almacenaje y seguro de carga.",

  // Sección 1 — Hero
  hero: {
    label: "Servicios",
    // NOTA: el doc lista dos H1 (uno en el bloque SEO, otro en el Hero). Se usa el del Hero.
    h1: "Soluciones logísticas con control operativo en el corredor China-Manzanillo-Bajío",
    subtitulo: "No ofrecemos todos los servicios del mundo. Ofrecemos lo que tu operación necesita para importar desde China a la Zona del Bajío con control en cada etapa",
  },

  // Sección 2 — Grid
  grid: {
    label: "Lo que hacemos",
    titulo: "Un portafolio diseñado para el corredor China-Puerto Manzanillo-Zona del Bajío",
    parrafo: "Cada servicio que ofrecemos existe porque es necesario para operar el corredor con control en cada etapa. No agregamos servicios para parecer más grandes; los ofrecemos porque sin ellos la operación no tiene control de punta a punta.",
  },

  // Sección 3 — CTA de cierre
  cierre: {
    label: "Siguiente paso",
    titulo: "¿Tu operación en el corredor necesita más control?",
    texto: "Contamos con el equipo y la experiencia operativa en el corredor China–Puerto de Manzanillo–Zona del Bajío para analizar tu cadena logística actual y mostrarte con precisión dónde están los puntos de mejora. No empezamos con una cotización, empezamos por entender tu operación.",
    aclaracion: "Sin costo. Sin compromiso. Con el criterio de quien opera este corredor todos los días.",
  },
};

// EN — Copy Deck ES-EN (tal cual). Estructura espejo de serviciosMeta.
export const serviciosMetaEn = {
  title: "Freight Forwarding Services | China–Manzanillo–Bajío | Sama Forwarding",
  description: "Ocean freight, transport, and storage on the China–Manzanillo–Bajío corridor. Operational control at every stage.",
  hero: {
    label: "Services",
    h1: "Logistics solutions with operational control on the China–Manzanillo–Bajío corridor",
    subtitulo: "We don't offer every service in the world. We offer what your operation needs to import from China to the Bajío Region with control at every stage.",
  },
  grid: {
    label: "What we do",
    titulo: "A portfolio built for the China – Port of Manzanillo – Bajío Region corridor",
    parrafo: "Every service we offer exists because it's necessary to operate the corridor with control at every stage. We don't add services to look bigger — we offer them because without them, the operation lacks end-to-end control.",
  },
  cierre: {
    label: "Next step",
    titulo: "Does your operation on the corridor need more control?",
    texto: "We have the team and operational experience on the China – Port of Manzanillo – Bajío Region corridor to analyze your current supply chain and show you precisely where the improvement opportunities are. We don't start with a quote — we start by understanding your operation.",
    aclaracion: "No cost. No obligation. With the expertise of a team that operates this corridor every day.",
  },
};

export const servicios = [
  {
    slug: "flete-maritimo-china-mexico",
    mapaEtapa: "02",
    nombre: "Flete Marítimo China–México",
    nombreEn: "China–Mexico Ocean Freight",
    core: true,
    icono: "mar",
    // Resumen — COPY EXACTO (servicios overview)
    resumen: "Coordinamos el movimiento de tu carga desde los principales puertos de China hasta Manzanillo. LCL y FCL. Seguimiento activo en cada etapa del tránsito.",
    resumenEn: "We coordinate the movement of your cargo from the main ports in China to Manzanillo. LCL and FCL. Active tracking at every stage of transit.",
    // Variante home — COPY EXACTO (home §2.1)
    resumenHome: "Coordinamos el movimiento de tu carga desde los principales puertos de China hasta el Puerto de Manzanillo. LCL y FCL. Seguimiento activo en cada etapa del tránsito.",
    resumenHomeEn: "We coordinate the movement of your cargo from the main ports in China to the Port of Manzanillo. LCL and FCL. Active tracking at every stage of transit.",
    title: "Flete marítimo China México | FCL y LCL a Manzanillo | Sama Forwarding",
    description: "Flete marítimo desde China a México por Manzanillo: bookings con navieras tier 1, tránsito de 21 días y seguimiento de punta a punta hasta el Bajío.",
    // --- BORRADOR (pendiente aprobación cliente) ---
    intro: "El flete marítimo es el corazón de la operación. Coordinamos el embarque de tus contenedores desde los principales puertos de China hasta Manzanillo, con monitoreo activo durante los 21 días de tránsito promedio y un único punto de coordinación para todo el recorrido.",
    incluye: [
      "Reserva de espacio (booking) con navieras tier 1: Maersk, CMA CGM, Hapag Lloyd y Cosco.",
      "Modalidades FCL y LCL según el volumen de tu operación.",
      "Coordinación documental desde el origen en China, antes del zarpe.",
      "Monitoreo activo del tránsito marítimo con alertas ante desvíos.",
      "Seguimiento del arribo, la liberación y la coordinación con el transporte terrestre.",
    ],
    paraQuien: "Empresas industriales del Bajío que importan desde China de forma recurrente y necesitan previsibilidad y seguimiento, más que la tarifa más baja.",
    paraQuienNo: "Operaciones de importación esporádica o de muy bajo volumen, donde un servicio especializado de corredor no aprovecha su valor.",
    faq: [
      { q: "¿Cuánto tarda el tránsito marítimo?", a: "21 días promedio en ruta directa a Manzanillo, sin contar despacho y transporte terrestre." },
      { q: "¿Trabajan FCL y LCL?", a: "Sí, ambas modalidades. Coordinamos la que mejor se ajuste al volumen y la frecuencia de tu operación." },
    ],
  },
  // v2: AGENCIA ADUANAL ELIMINADA — el cliente confirmó que no existe.
  {
    slug: "transporte-logistica",
    mapaEtapa: "04",
    nombre: "Transporte y Logística",
    nombreEn: "Transport & Logistics",
    core: false,
    icono: "tierra",
    resumen: "Movimiento de tu carga desde el puerto hasta tu planta o almacén. Unidades dedicadas, trazabilidad y cumplimiento de tiempos.",
    resumenEn: "Moving your cargo from the port to your plant or warehouse. Dedicated units, traceability, and on-time delivery.",
    resumenHome: "Movimiento de tu carga desde el puerto hasta tu planta o almacén. Unidades dedicadas, trazabilidad y cumplimiento de tiempos de entrega.",
    resumenHomeEn: "Moving your cargo from the port to your plant or warehouse. Dedicated units, traceability, and on-time delivery.",
    title: "Transporte y logística terrestre al Bajío | Sama Forwarding",
    description: "Transporte terrestre dedicado desde el Puerto de Manzanillo hasta tu planta en el Bajío, con trazabilidad durante el traslado y entrega documentada.",
    // --- BORRADOR (pendiente aprobación cliente) ---
    intro: "El tramo terrestre cierra el corredor. Movemos tu carga desde Manzanillo hasta el destino final en el Bajío con unidades dedicadas y trazabilidad durante todo el traslado.",
    incluye: [
      "Unidades dedicadas para el traslado al Bajío.",
      "Trazabilidad durante el transporte terrestre.",
      "Coordinación con la liberación en puerto para evitar tiempos muertos.",
      "Entrega documentada en planta.",
    ],
    paraQuien: "Importadores que ya mueven carga por Manzanillo y necesitan un transporte terrestre confiable y con seguimiento hasta su planta.",
    paraQuienNo: "Entregas fuera del área de influencia del corredor China–Manzanillo–Bajío.",
    faq: [
      { q: "¿A qué ciudades entregan?", a: "Guadalajara, Guanajuato, Querétaro, Aguascalientes, San Luis Potosí, Michoacán y Jalisco." },
    ],
  },
  {
    slug: "almacenaje-distribucion",
    mapaEtapa: "05",
    nombre: "Almacenaje y Distribución",
    nombreEn: "Storage & Distribution",
    core: false,
    icono: "puerto",
    resumen: "Almacenes con circuito cerrado de TV y vigilancia 24hs. Opciones de distribución que reducen costos logísticos en destino final.",
    resumenEn: "Warehouses with closed-circuit CCTV and 24-hour surveillance. Distribution options that reduce logistics costs at the final destination.",
    resumenHome: "Almacenes con circuito cerrado de TV y vigilancia 24 hs. Opciones de distribución que reducen costos logísticos en destino final.",
    resumenHomeEn: "Warehouses with closed-circuit CCTV and 24-hour surveillance. Distribution options that reduce logistics costs at final destination.",
    title: "Almacenaje y distribución en el Bajío | Sama Forwarding",
    description: "Almacenaje con vigilancia 24 hs y distribución para ordenar la recepción de tu mercancía importada desde China según el ritmo de tu operación en el Bajío.",
    // --- BORRADOR (pendiente aprobación cliente) ---
    intro: "No toda la mercancía entra a planta el mismo día que se libera. El almacenaje y la distribución permiten ordenar la recepción según el ritmo real de tu operación.",
    incluye: [
      "Almacenes con circuito cerrado de TV y vigilancia 24 horas.",
      "Distribución coordinada según las necesidades de tu operación.",
      "Integración con el resto del corredor para mantener la visibilidad.",
    ],
    paraQuien: "Empresas que necesitan flexibilidad entre la liberación de la carga y su ingreso a planta o a sus puntos de venta.",
    paraQuienNo: "Operaciones que requieren entrega directa a planta sin etapa intermedia.",
    faq: [],
  },
  {
    slug: "seguro-carga",
    mapaEtapa: "",
    nombre: "Seguro de Carga y Custodia",
    nombreEn: "Cargo Insurance & Cargo Security",
    core: false,
    icono: "destino",
    resumen: "Protegemos la inversión de importadores y exportadores con logística en custodia y seguro de carga en cualquier modalidad.",
    resumenEn: "We protect importers' and exporters' investment across every stage of the operation. Secure transport and cargo security in any modality.",
    resumenHome: "Protegemos la inversión de importadores y exportadores en cada modalidad de la operación. Logística en custodia y seguro de carga.",
    resumenHomeEn: "We protect importers' and exporters' investment across every stage of the operation.",
    title: "Seguro de carga y custodia para importaciones desde China | Sama Forwarding",
    description: "Seguro de carga y logística en custodia para proteger el valor de tu mercancía durante el trayecto marítimo y terrestre del corredor China–Bajío.",
    // --- BORRADOR (pendiente aprobación cliente) ---
    intro: "El comercio internacional tiene riesgos inherentes. El seguro de carga y la logística en custodia protegen el valor de tu mercancía durante el trayecto, para que un imprevisto no se convierta en una pérdida.",
    incluye: [
      "Seguro de carga en cualquier modalidad de la operación.",
      "Logística en custodia para mercancía sensible.",
      "Asesoría sobre el alcance de la cobertura según el tipo de carga.",
      "Integración con el resto de la operación del corredor.",
    ],
    paraQuien: "Importadores y exportadores que quieren proteger el valor de su mercancía durante el tránsito marítimo y terrestre.",
    paraQuienNo: "Quien prefiera asumir el riesgo del trayecto por su cuenta.",
    faq: [],
  },
];
