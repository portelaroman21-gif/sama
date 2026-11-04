/* ============================================================
   Contenido de la página Corredor (Plan Maestro §2.2) — pillar SEO.
   Bilingüe {es, en}. ES: copy aprobado. EN: Copy Deck ES-EN (tal cual);
   el detalle de riesgos (desc/maneja/impacto) va más completo que la
   tabla condensada del deck → traducción fiel, validar con el cliente.
   ============================================================ */

const _es = {
  title: "Corredor China–Manzanillo–Bajío | Control operativo | Sama Forwarding",
  description: "Control operativo en el corredor China–Puerto de Manzanillo–Zona del Bajío: tiempos, riesgos y FAQ para importadores industriales. Tránsito de 21 días.",

  heroLabel: "Nuestro corredor",
  h1: "Control operativo en el corredor China – Puerto de Manzanillo – Zona del Bajío",
  heroSub: "No operamos todos los corredores del mundo. Operamos este. Con el nivel de detalle que solo da el conocimiento acumulado de cada operación, cada aduana, cada naviera y cada kilómetro entre el puerto y el Bajío.",

  porque: {
    h2: "El corredor más estratégico para la industria del Bajío",
    parrafos: [
      "El Puerto de Manzanillo concentra más del 40% del tráfico de contenedores de México. Para las empresas de manufactura, autopartes, electrónica, retail y maquila de la Zona del Bajío, es el principal punto de entrada para importaciones desde Asia, especialmente China. Menos tiempo en tránsito terrestre, menor costo de transferencia y una ruta que en Sama Forwarding conocemos operación por operación.",
      "Operar este corredor no es contratar un flete y esperar. Requiere coordinación de tres frentes simultáneos: el origen en China, el tránsito marítimo y el despacho en Manzanillo. Un error en cualquiera de los tres puntos puede convertirse en días de demora, costos imprevistos e incidencias aduanales. El control operativo es la respuesta a esa complejidad.",
      "Un freight forwarder genérico opera muchos corredores y conoce ninguno en profundidad. En Sama Forwarding operamos este corredor desde hace más de 10 años. Eso significa que conocemos las navieras que son confiables en esta ruta, los tiempos reales de despacho en Manzanillo, los puntos de fricción en aduana y las rutas terrestres más eficientes hasta cada localidad del Bajío. No improvisamos. Construimos operación por operación.",
    ],
  },
  dato: { valor: "+40%", texto: "del tráfico de contenedores de México pasa por Manzanillo." },

  tiemposIntro: {
    h2: "Los tiempos del corredor, y qué hace que se cumplan",
    texto: "La primera pregunta que hace cualquier Gerente de Logística es: ¿cuánto tarda? La respuesta correcta es un número acompañado de los factores que lo afectan y de cómo se gestionan. Eso marca la diferencia entre un operador que promete tiempos y uno que los cumple.",
  },
  tiempos: [
    { etapa: "Coordinación y booking en China", tiempo: "1 a 3 días", gestion: "Booking anticipado con navieras tier 1. Gestión de espacio en temporada alta." },
    { etapa: "Tránsito marítimo China–Manzanillo", tiempo: "21 días", gestion: "Selección de navieras con rutas directas. Monitoreo activo. Alertas ante desvíos." },
    { etapa: "Arribo y espera en Manzanillo", tiempo: "FCL: 1 día · LCL: 3 a 5 días", gestion: "Documentación preparada antes del arribo. Despacho el mismo día." },
    { etapa: "Despacho aduanal en Manzanillo", tiempo: "5 días", gestion: "Clasificación correcta desde origen. Documentación completa." },
    { etapa: "Transporte terrestre al Bajío", tiempo: "1 día", gestion: "Unidades dedicadas. Coordinación inmediata post-liberación." },
  ],
  total: { etapa: "TIEMPO TOTAL DEL CORREDOR", tiempo: "28 días", gestion: "Control operativo en cada etapa reduce variabilidad y protege los tiempos planeados." },

  riesgosIntro: {
    h2: "Los riesgos del corredor y cómo los gestionamos",
    texto: "Operar el corredor China–Manzanillo–Bajío requiere gestionar riesgos en tres frentes simultáneos: el origen, el tránsito y el destino. En cada punto hay variables que pueden convertirse en días de demora, costos imprevistos o incidencias aduanales. El control operativo no es un concepto, es el conjunto de procesos que evita que esas variables se conviertan en problemas para tu operación.",
  },
  riesgos: [
    { riesgo: "Error de clasificación arancelaria", desc: "Una clasificación arancelaria incorrecta en la documentación de origen puede resultar en retención de la carga en aduana, multas, demoras de liberación de varios días y costos adicionales no presupuestados.", maneja: "Revisión de la fracción arancelaria correcta antes de la emisión de documentos en origen. Equipo con conocimiento actualizado de la tarifa y de las regulaciones no arancelarias aplicables al tipo de carga.", impacto: "Liberación en tiempos normales, sin sorpresas en aduana y sin costos adicionales por errores de clasificación que el cliente deba absorber." },
    { riesgo: "Falta de visibilidad en tránsito marítimo", desc: "Sin seguimiento activo, el importador no sabe con certeza cuándo llega su carga ni si hubo desvíos, cambios de naviera o demoras en ruta. La incertidumbre genera problemas en la planificación de inventario y producción.", maneja: "Monitoreo activo del estado de la carga durante el tránsito. Comunicación proactiva al cliente ante cualquier cambio en el itinerario. No se espera a que el cliente pregunte, SamaForwarding informa.", impacto: "Planificación de inventario con datos reales de llegada. Capacidad de anticipar ajustes en la cadena de producción si hay desvíos. Sin incertidumbre en el último tramo del tránsito." },
    { riesgo: "Congestión y demoras en Puerto Manzanillo", desc: "El Puerto de Manzanillo opera con alta congestión en temporadas de importación. Sin coordinación anticipada, la carga puede acumular días de demora en espera de despacho, generando costos de almacenamiento no presupuestados.", maneja: "Documentación preparada antes del arribo de la carga al puerto. Inicio del proceso de despacho el mismo día de arribo. Coordinación anticipada con la aduana y el agente portuario para reducir tiempos de espera.", impacto: "Reducción del tiempo de permanencia en puerto. Control de costos de almacenamiento. Transferencia terrestre coordinada sin esperas post-liberación." },
    { riesgo: "Ruptura en la cadena de custodia terrestre", desc: "Cuando el transporte terrestre es contratado por separado o con un operador desconectado de la operación aduanal, se generan puntos ciegos en la trazabilidad y riesgo de demoras, daños o desvíos no reportados.", maneja: "Coordinación del transporte terrestre con unidades dedicadas a SamaForwarding. No se externaliza esta etapa a un tercero sin coordinación operativa. Trazabilidad continua desde la salida del puerto hasta la entrega en destino.", impacto: "Operación de punta a punta bajo un único responsable operativo. Trazabilidad completa en la etapa terrestre. Entrega documentada en planta o almacén del cliente." },
    { riesgo: "Incumplimiento de regulaciones no arancelarias", desc: "Ciertos tipos de carga requieren permisos, certificaciones o regulaciones específicas (COFEPRIS, SEMARNAT, SAGARPA, NOM’s, etc.) que, si no se gestionan correctamente desde el origen, pueden resultar en retención o rechazo de la carga en aduana.", maneja: "Revisión previa de las regulaciones aplicables al tipo de carga y al país de origen. Gestión anticipada de permisos y certificaciones cuando corresponda. Equipo actualizado en regulaciones de comercio exterior.", impacto: "Llegada al puerto con documentación completa y en regla. Sin retenciones por incumplimiento regulatorio. Certeza jurídica en cada operación." },
  ],

  faqTitulo: "Preguntas frecuentes del Corredor China-Puerto de Manzanillo- Zona del Bajío",
  faq: [
    { q: "¿Cuánto tarda el tránsito marítimo de China a Puerto Manzanillo?", a: "El tránsito marítimo estándar desde los principales puertos de China (Shanghai, Qingdao, Xiamen, Hong Kong, Ningbo, Shenzhen) al Puerto de Manzanillo es de aproximadamente 21 días en ruta directa. El tiempo exacto depende del puerto de origen, la naviera seleccionada y el tipo de servicio (ruta directa o con transbordo). En Sama Forwarding monitoreamos activamente el tránsito y comunicamos cualquier variación antes de que impacte tu planificación de inventario." },
    { q: "¿Cuál es la diferencia entre FCL y LCL para el corredor China–México?", a: "FCL (Full Container Load) es el servicio donde contratas un contenedor completo para tu carga exclusiva. Es más económico por unidad cuando el volumen lo justifica (generalmente a partir de 15–20 CBM) y ofrece mayor control sobre los tiempos. LCL (Less than Container Load) agrupa tu carga con la de otros importadores en un mismo contenedor, es la opción adecuada para volúmenes menores, aunque implica tiempos de consolidación adicionales y mayor complejidad en el despacho. En Sama Forwarding evaluamos cuál conviene más para cada operación según el volumen, la frecuencia y los tiempos requeridos." },
    { q: "¿Qué documentos necesito para importar desde China a México?", a: "Para una importación estándar desde China al Puerto de Manzanillo necesitas: Bill of Lading (emitido por la naviera), Commercial Invoice (factura comercial del proveedor chino), Packing List, Certificado de Origen (cuando aplica para preferencias arancelarias), y la documentación específica según el tipo de carga (permisos COFEPRIS, SAGARPA, SEMARNAT, NOM’s, etc.). En Sama Forwarding revisamos la documentación antes del embarque para evitar retenciones en aduana por documentación incompleta o incorrecta." },
    { q: "¿Cuánto cuesta importar un contenedor de China al Bajío?", a: "El costo de una importación desde China al Bajío depende de múltiples variables: volumen y tipo de carga, puerto de origen en China, naviera y tipo de servicio (FCL/LCL), temporada de importación, valor de la mercancía (que determina los impuestos al comercio exterior), y el destino final en el Bajío. En Sama Forwarding no publicamos tarifas genéricas porque cada operación es diferente, lo que sí ofrecemos es un diagnóstico logístico gratuito donde analizamos tu operación y te presentamos una propuesta con todos los costos involucrados, sin sorpresas." },
    { q: "¿Qué ventajas tiene el Puerto de Manzanillo sobre otros puertos de entrada?", a: "El Puerto de Manzanillo ofrece tres ventajas clave para importadores del Bajío:", items: [
      "<strong>Posición geográfica:</strong> es el puerto más cercano a la Zona del Bajío en distancia terrestre desde la costa del Pacífico, lo que reduce los tiempos y costos de transferencia final.",
      "<strong>Volumen de operación:</strong> concentra más del 40% del tráfico de contenedores de México, lo que implica mayor frecuencia de servicios navieros desde Asia.",
      "<strong>Infraestructura:</strong> cuenta con capacidad para manejar grandes volúmenes de carga con tiempos de despacho competitivos cuando la documentación está en orden.",
    ] },
    { q: "¿Qué es un agente aduanal y por qué es clave en este corredor?", a: "El agente aduanal es el profesional habilitado por el SAT para representar al importador ante la aduana en el proceso de despacho de mercancías. En el corredor China–Manzanillo, el agente aduanal es crítico porque: clasifica la mercancía con la fracción arancelaria correcta, calcula y declara los impuestos al comercio exterior, gestiona el cumplimiento de las regulaciones no arancelarias aplicables y coordina con la aduana el proceso de liberación de la carga." },
    { q: "¿Puedo rastrear mi carga durante el tránsito desde China?", a: "Sí. En Sama Forwarding gestionamos el seguimiento activo de tu carga desde el zarpe en China hasta la entrega en tu planta o almacén. No es solo un link de tracking de la naviera, es seguimiento operativo con comunicación proactiva ante cualquier cambio en el itinerario, desvío o demora. El cliente recibe actualizaciones sin necesidad de pedirlas. Si hay una incidencia en tránsito, te lo comunicamos antes de que llegue a impactar tu planificación." },
    { q: "¿Qué industrias del Bajío importan por el corredor China–Manzanillo?", a: "El corredor China–Manzanillo–Bajío es utilizado principalmente por empresas de manufactura, autopartes, electrónica, retail, construcción y maquila. La Zona del Bajío concentra importantes plantas industriales que importan componentes, materias primas y bienes de capital desde China. En Sama Forwarding tenemos experiencia operando el corredor para todas estas industrias, lo que nos permite entender las necesidades específicas de cada sector en términos de clasificación arancelaria, regulaciones y tiempos de entrega." },
    { q: "¿Qué pasa si mi carga tiene problemas en aduana?", a: "Una incidencia aduanal puede ser: reconocimiento físico de la mercancía, embargo precautorio, observaciones por documentación, o retención por regulaciones no arancelarias. La mayoría de las incidencias se resuelven sin costo adicional para el cliente cuando la documentación fue preparada correctamente desde el origen. Para los casos que requieren gestión adicional, el cliente es informado de inmediato con un plan de acción claro." },
    { q: "¿Con qué navieras trabaja Sama Forwarding en el corredor China–México?", a: "Operamos el corredor China–Manzanillo junto a CMA CGM, Hapag Lloyd, Maersk, Cosco, entre otras." },
  ],

  cierre: {
    titulo: "¿Operas en el corredor China–Manzanillo–Bajío?",
    texto: "Si tu empresa importa desde China o está evaluando hacerlo, analizamos tu operación actual en el corredor sin costo y sin compromiso. Te mostramos con precisión dónde están los puntos de mejora y cómo el control operativo puede impactar directamente tu cadena de suministro.",
  },
};

const _en = {
  title: "China–Manzanillo–Bajío Corridor | Import Operational Control | Sama Forwarding",
  description: "We operate the China–Port of Manzanillo–Bajío Region corridor with operational control at every stage. Ocean freight, monitoring, and final delivery.",

  heroLabel: "Our corridor",
  h1: "Operational control on the China – Port of Manzanillo – Bajío Region corridor",
  heroSub: "We don't operate every corridor in the world. We operate this one. With the level of detail that only comes from accumulated knowledge of every operation, every customs process, every shipping line, and every kilometer between the port and the Bajío.",

  porque: {
    h2: "The most strategic corridor for Bajío industry",
    parrafos: [
      "The Port of Manzanillo handles more than 40% of Mexico's container traffic. For manufacturing, auto parts, electronics, retail, and maquila companies in the Bajío Region, it's the main entry point for imports from Asia, especially China. Less ground-transit time, lower transfer costs, and a route Sama Forwarding knows inside and out.",
      "Operating this corridor isn't about booking a freight and waiting. It requires coordinating three fronts simultaneously: origin in China, ocean transit, and customs clearance in Manzanillo. An error at any one of these three points can turn into days of delay, unexpected costs, and customs incidents. Operational control is the answer to that complexity.",
      "A generic freight forwarder operates many corridors and knows none of them in depth. At Sama Forwarding, we've operated this corridor for over 10 years. That means we know which shipping lines are reliable on this route, the real clearance times in Manzanillo, the friction points in customs, and the most efficient ground routes to every locality in the Bajío. We don't improvise. We build, shipment by shipment.",
    ],
  },
  dato: { valor: "+40%", texto: "of Mexico's container traffic passes through Manzanillo." },

  tiemposIntro: {
    h2: "Corridor timelines, and what makes them happen",
    texto: "The first question any Logistics Manager asks is: how long does it take? The right answer is a number paired with the factors that affect it and how they're managed. That's exactly what separates an operator who promises timelines from one who delivers them.",
  },
  tiempos: [
    { etapa: "Coordination and booking in China", tiempo: "1–3 days", gestion: "Advance booking with tier-1 shipping lines. Advance space management during peak season." },
    { etapa: "Ocean transit China–Manzanillo", tiempo: "21 days", gestion: "Selection of shipping lines with direct routes. Active monitoring. Alerts for deviations." },
    { etapa: "Arrival and wait in Manzanillo", tiempo: "FCL: 1 day · LCL: 3–5 days", gestion: "Documentation prepared before arrival. Clearance started same-day." },
    { etapa: "Customs clearance in Manzanillo", tiempo: "5 days", gestion: "Correct classification from origin. Complete documentation." },
    { etapa: "Ground transport to the Bajío", tiempo: "1 day", gestion: "Dedicated units. Immediate coordination post-release." },
  ],
  total: { etapa: "TOTAL CORRIDOR TIME", tiempo: "28 days", gestion: "Operational control at every stage reduces variability and protects planned timelines." },

  riesgosIntro: {
    h2: "Corridor risks and how we manage them",
    texto: "Operating the China–Manzanillo–Bajío corridor requires managing risk on three simultaneous fronts: origin, transit, and destination. At each point there are variables that can turn into days of delay, unexpected costs, or customs incidents. Operational control isn't a concept — it's the set of processes that keeps those variables from becoming problems for your operation.",
  },
  riesgos: [
    { riesgo: "Tariff classification error", desc: "An incorrect tariff classification in the origin documentation can result in the cargo being held at customs, fines, release delays of several days, and unbudgeted additional costs.", maneja: "Review of the correct tariff code before issuing origin documents. A team with up-to-date knowledge of the tariff schedule and the non-tariff regulations applicable to the cargo type.", impacto: "Release within normal timelines, with no customs surprises and no additional costs from classification errors that the client has to absorb." },
    { riesgo: "Lack of visibility during ocean transit", desc: "Without active tracking, the importer doesn't know for certain when their cargo will arrive or whether there were deviations, carrier changes, or route delays. That uncertainty creates problems for inventory and production planning.", maneja: "Active monitoring of cargo status during transit. Proactive communication to the client on any change in the itinerary. We don't wait for the client to ask — Sama Forwarding informs.", impacto: "Inventory planning with real arrival data. The ability to anticipate adjustments in the production chain if there are deviations. No uncertainty in the final transit leg." },
    { riesgo: "Congestion and delays at Port Manzanillo", desc: "The Port of Manzanillo operates with high congestion during import seasons. Without advance coordination, cargo can accumulate days of delay waiting for clearance, generating unbudgeted storage costs.", maneja: "Documentation prepared before the cargo arrives at the port. Clearance process started the same day of arrival. Advance coordination with customs and the port agent to reduce waiting times.", impacto: "Reduced port dwell time. Storage cost control. Ground transfer coordinated with no post-release waiting." },
    { riesgo: "Break in the ground custody chain", desc: "When ground transport is contracted separately or with an operator disconnected from the customs operation, blind spots appear in traceability and there's a risk of delays, damage, or unreported deviations.", maneja: "Ground transport coordinated with units dedicated to Sama Forwarding. This stage is not outsourced to a third party without operational coordination. Continuous traceability from port departure to final delivery.", impacto: "End-to-end operation under a single operational owner. Full traceability in the ground leg. Documented delivery at the client's plant or warehouse." },
    { riesgo: "Non-compliance with non-tariff regulations", desc: "Certain cargo types require permits, certifications, or specific regulations (COFEPRIS, SEMARNAT, SAGARPA, NOMs, etc.) that, if not managed correctly from origin, can result in the cargo being held or rejected at customs.", maneja: "Advance review of the regulations applicable to the cargo type and country of origin. Advance management of permits and certifications when applicable. A team up to date on foreign-trade regulations.", impacto: "Arrival at the port with complete, compliant documentation. No holds for regulatory non-compliance. Legal certainty in every operation." },
  ],

  faqTitulo: "Frequently asked questions — China–Port of Manzanillo–Bajío Region corridor",
  faq: [
    { q: "How long does ocean transit from China to Port Manzanillo take?", a: "Standard ocean transit from the main Chinese ports (Shanghai, Qingdao, Xiamen, Hong Kong, Ningbo, Shenzhen) to the Port of Manzanillo is approximately 21 days on a direct route. The exact time depends on the origin port, the selected shipping line, and the service type (direct route or transshipment). At Sama Forwarding, we actively monitor transit and communicate any variation before it impacts your inventory planning." },
    { q: "What's the difference between FCL and LCL for the China–Mexico corridor?", a: "FCL (Full Container Load) is the service where you book a full container exclusively for your cargo. It's more cost-effective per unit when volume justifies it (generally from 15–20 CBM) and offers greater control over timelines. LCL (Less than Container Load) groups your cargo with other importers' in the same container — the right option for smaller volumes, though it involves additional consolidation time and greater clearance complexity. At Sama Forwarding, we assess which option is best for each operation based on volume, frequency, and required timelines." },
    { q: "What documents do I need to import from China to Mexico?", a: "For a standard import from China to the Port of Manzanillo you need: Bill of Lading (issued by the shipping line), Commercial Invoice (from the Chinese supplier), Packing List, Certificate of Origin (when applicable for tariff preferences), and cargo-specific documentation (COFEPRIS, SAGARPA, SEMARNAT, NOM permits, etc.). At Sama Forwarding, we review documentation before shipment to avoid customs holds due to incomplete or incorrect paperwork." },
    { q: "How much does it cost to import a container from China to the Bajío?", a: "The cost of importing from China to the Bajío depends on multiple variables: cargo volume and type, origin port in China, shipping line and service type (FCL/LCL), import season, merchandise value (which determines foreign-trade taxes), and final destination in the Bajío. At Sama Forwarding we don't publish generic rates because every operation is different — what we do offer is a free logistics diagnostic where we analyze your operation and present a proposal with all costs involved, no surprises." },
    { q: "What advantages does the Port of Manzanillo offer over other entry ports?", a: "The Port of Manzanillo offers three key advantages for Bajío importers:", items: [
      "<strong>Geographic position:</strong> the closest port to the Bajío Region by ground distance from the Pacific coast, which reduces final-transfer times and costs.",
      "<strong>Operating volume:</strong> it handles more than 40% of Mexico's container traffic, meaning higher frequency of shipping services from Asia.",
      "<strong>Infrastructure:</strong> capacity to handle large cargo volumes with competitive clearance times when documentation is in order.",
    ] },
    { q: "What is a customs broker and why is it key on this corridor?", a: "The customs broker is the professional authorized by Mexico's tax authority (SAT) to represent the importer before customs during the clearance process. On the China–Manzanillo corridor, the customs broker is critical because they classify the merchandise under the correct tariff code, calculate and declare foreign-trade taxes, manage compliance with applicable non-tariff regulations, and coordinate cargo release with customs." },
    { q: "Can I track my cargo during transit from China?", a: "Yes. At Sama Forwarding we manage active tracking of your cargo from departure in China through delivery at your plant or warehouse. It's not just a shipping-line tracking link — it's operational tracking with proactive communication on any itinerary change, deviation, or delay. The client receives updates without needing to ask. If there's a transit incident, we tell you before it impacts your planning." },
    { q: "Which industries in the Bajío import via the China–Manzanillo corridor?", a: "The China–Manzanillo–Bajío corridor is used primarily by companies in manufacturing, auto parts, electronics, retail, construction, and maquila. The Bajío Region is home to major industrial plants that import components, raw materials, and capital goods from China. At Sama Forwarding we have experience operating the corridor for all these industries, which lets us understand each sector's specific needs in terms of tariff classification, regulations, and delivery timelines." },
    { q: "What happens if my cargo has customs problems?", a: "A customs incident can be: physical inspection of the merchandise, precautionary embargo, documentation observations, or a hold due to non-tariff regulations. Most incidents are resolved at no additional cost to the client when documentation was prepared correctly from origin. For cases requiring additional handling, the client is informed immediately with a clear action plan." },
    { q: "Which shipping lines does Sama Forwarding work with on the China–Mexico corridor?", a: "We operate the China–Manzanillo corridor with CMA CGM, Hapag Lloyd, Maersk, Cosco, among others." },
  ],

  cierre: {
    titulo: "Do you operate on the China–Manzanillo–Bajío corridor?",
    texto: "If your company imports from China or is considering it, we'll analyze your current operation on the corridor at no cost and no obligation. We'll show you precisely where the improvement opportunities are and how operational control can directly impact your supply chain.",
  },
};

export const corredor = { es: _es, en: _en };
