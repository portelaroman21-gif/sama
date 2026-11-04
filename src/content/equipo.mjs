/* ============================================================
   Contenido de Nosotros (Plan Maestro §2.5) — bilingüe {es, en}.
   ES: copy aprobado. EN: Copy Deck ES-EN (tal cual).
   Cargos/frases del equipo (Marisol, Joaquín) NO están en el deck EN →
   traducción fiel, marcar para validación del cliente.
   CTA de cierre = EXCEPCIÓN: lleva a Corredor, NO al diagnóstico.
   ============================================================ */

const _andreaFoto = "/assets/img/equipo/andrea-vergara.jpg";
const _andreaLinkedin = "https://www.linkedin.com/in/andrea-vergara-carrillo-34b5aa399/";

export const nosotros = {
  es: {
    title: "Quiénes somos | Sama Forwarding",
    description: "El equipo detrás del control operativo en el corredor China–Manzanillo–Bajío. Andrea Vergara y un equipo especializado en importación industrial desde China.",

    heroLabel: "¿Quiénes somos?",
    h1: "Simplificamos la complejidad del comercio internacional",
    heroSub: "Somos el equipo detrás del control operativo en el corredor China-Manzanillo y Zona del Bajío. Cada persona en Sama Forwarding existe para que tu operación no dependa del azar.",

    andrea: {
      nombre: "Andrea Vergara",
      cargo: "Directora General, Sama Forwarding",
      frase: "Conectando logística con resultados.",
      foto: _andreaFoto,
      perfil: [
        "Soy especialista en logística industrial con enfoque en el corredor China–Puerto Manzanillo–Zona del Bajío. Trabajo con plantas industriales en Guanajuato, Querétaro, Aguascalientes, San Luis Potosí, Guadalajara y Michoacán, que dependen de importaciones constantes desde Asia y no pueden permitirse la improvisación logística.",
        "Sé lo que pasa cuando un contenedor se retrasa en Manzanillo. El problema no es solamente el costo del retraso, sino la cadena que activa hacia dentro de la empresa: inventario tensionado, producción presionada, incertidumbre interna que escala hacia áreas que no deberían verse afectadas. Esa es la consecuencia real de una logística sin estructura.",
        "No compito por precio, compito por la estabilidad operativa. Diseño operaciones recurrentes para empresas que importan volumen constante, necesitan visibilidad real de su carga y buscan reducir el riesgo logístico de forma sistemática. No trabajo con importaciones ocasionales: me especializo en volumen constante porque ahí es donde una estructura logística tiene impacto real sobre el negocio.",
      ],
    },

    equipoIntro: {
      label: "El equipo",
      h2: "Las personas que operan el corredor",
      parrafo: "Sama Forwarding es el equipo que está detrás de cada operación en el corredor China-Puerto Manzanillo-Zona del Bajío. Cada persona tiene un rol específico y el conocimiento para ejecutarlo con criterio.",
    },
    equipo: [
      { nombre: "Marisol Carrillo", cargo: "Facturación y cobranza", frase: "Orden financiero en cada operación.", foto: "/assets/img/equipo/marisol-carrillo.jpg", tieneFoto: true },
      { nombre: "Andrea Vergara", cargo: "Directora General, Sama Forwarding", frase: "Conectando logística con resultados.", foto: _andreaFoto, tieneFoto: true, esDireccion: true, linkedin: _andreaLinkedin },
      { nombre: "Joaquín Montero", cargo: "Coordinador de operaciones", frase: "Cada embarque bajo control.", foto: "/assets/img/equipo/joaquin-montero.jpg", tieneFoto: true },
    ],

    historia: {
      label: "Nuestra historia",
      h2: "No empezamos con un corredor, empezamos con una convicción",
      parrafosHTML: [
        "Sama Forwarding nació de una convicción clara: que el corredor China–Puerto Manzanillo–Zona del Bajío necesitaba un operador que lo conociera en profundidad, no uno que lo gestionara como una ruta más dentro de decenas de corredores globales.",
        "Hoy, el mercado del freight forwarding en México está dominado por grandes operadores internacionales con presencia en múltiples mercados y una comunicación orientada a grandes corporativos. Frente a eso, Sama Forwarding elige un camino diferente: <strong>un equipo especializado, un corredor específico y un tipo de cliente muy concreto.</strong>",
        "<strong>Trabajamos para las plantas industriales del Bajío que importan de forma recurrente desde Asia, principalmente desde China, y que no pueden permitirse improvisación logística, falta de seguimiento ni pérdida de control operativo en su cadena de suministro.</strong>",
      ],
    },

    valoresIntro: {
      label: "Cómo operamos",
      h2: "Los principios que guían cada decisión en el corredor",
      parrafo: "Los valores de Sama Forwarding no son declaraciones de intención, son los criterios que usamos en cada una de nuestras operaciones y decisiones.",
    },
    valores: [
      { nombre: "Especialización", sub: "No operamos todos los corredores. Operamos este.", copy: "La especialización en el corredor China–Puerto Manzanillo – Zona del Bajío no es una limitación, es la fuente del conocimiento que nos permite operar con criterio. Un operador que intenta cubrir todos los corredores del mundo conoce ninguno en profundidad. Sama Forwarding eligió conocer a este corredor mejor que nadie. Eso significa saber qué navieras son confiables en la ruta, qué aduanas tienen mayor fricción en ciertos momentos del año y cómo anticipar las variables que un generalista no anticipa porque no las ha vivido." },
      { nombre: "Transparencia", sub: "Informamos antes de que preguntes.", copy: "En logística internacional, la información es poder. El importador que no sabe dónde está su carga no puede planificar su producción ni su inventario. En Sama Forwarding la transparencia no es un valor aspiracional, es un proceso operativo: monitoreo activo del tránsito con actualizaciones proactivas al cliente. No esperamos a que el problema ya haya sucedido para informar. Lo informamos cuando lo detectamos, con el plan de acción correspondiente." },
      { nombre: "Confianza", sub: "Se construye operación por operación. No se declara.", copy: "La confianza en logística internacional no se construye con promesas, se construye con operaciones cumplidas, tiempos respetados e incidencias resueltas. Cada operación que Sama Forwarding gestiona en el corredor China– Puerto Manzanillo– Zona del Bajío es una oportunidad de demostrar que el cliente tomó la decisión correcta al confiar su cadena de suministro a este equipo. Esa es la única medida de confianza que importa." },
      { nombre: "Compromiso", sub: "La operación no termina cuando sale el barco.", copy: "El compromiso de Sama Forwarding con la operación del cliente no empieza cuando se firma un contrato ni termina cuando la carga llega al puerto. Empieza en la coordinación del booking en China y termina cuando la carga es entregada en la planta o almacén del cliente con la documentación completa. En el medio hay 28 días de seguimiento activo, coordinación aduanal y transferencia terrestre, y en cada uno de esos días el compromiso operativo es el mismo." },
      { nombre: "Criterio", sub: "La experiencia que se aplica, no que se declara.", copy: "El criterio es el resultado de haber operado el corredor China- Puerto Manzanillo– Zona del Bajío durante años, haber enfrentado las variables que lo afectan y haber desarrollado el juicio para anticiparlas. Cuando Sama Forwarding elige una naviera para una operación específica, elige con criterio." },
    ],

    cierre: {
      label: "El siguiente paso",
      titulo: "Conoce cómo operamos el corredor",
      texto: "El equipo de Sama Forwarding que acabas de conocer opera el corredor China–Puerto Manzanillo–Zona del Bajío con este nivel de detalle en cada etapa. Conoce el proceso, los tiempos reales y cómo gestionamos los riesgos del corredor antes de dar el siguiente paso.",
      cta: { label: "Conoce cómo trabajamos", href: "/corredor-china-manzanillo-bajio/" },
    },
  },

  en: {
    title: "About Us | Sama Forwarding",
    description: "Meet the Sama Forwarding team. Freight Forwarding specialists on the China – Port of Manzanillo – Bajío Region corridor.",

    heroLabel: "Who we are",
    h1: "We simplify the complexity of international trade",
    heroSub: "We're the team behind operational control on the China–Manzanillo and Bajío Region corridor. Every person at Sama Forwarding exists so your operation doesn't depend on chance.",

    andrea: {
      nombre: "Andrea Vergara",
      cargo: "General Manager, Sama Forwarding",
      frase: "Connecting logistics with results.",
      foto: _andreaFoto,
      perfil: [
        "I'm a specialist in industrial logistics focused on the China – Port of Manzanillo – Bajío Region corridor. I work with industrial plants in Guanajuato, Querétaro, Aguascalientes, San Luis Potosí, Guadalajara, and Michoacán that depend on constant imports from Asia and can't afford logistics improvisation.",
        "I know what happens when a container is delayed in Manzanillo. The problem isn't just the cost of the delay — it's the chain reaction inside the company: strained inventory, pressured production, internal uncertainty that spreads to areas that shouldn't be affected. That's the real consequence of logistics without structure.",
        "I don't compete on price — I compete on operational stability. I design recurring operations for companies that import constant volume, need real visibility into their cargo, and are looking to systematically reduce logistics risk. I don't work with occasional imports — I specialize in constant volume, because that's where a logistics structure has real business impact.",
      ],
    },

    equipoIntro: {
      label: "The team",
      h2: "The people who operate the corridor",
      parrafo: "Sama Forwarding is the team behind every operation on the China – Port of Manzanillo – Bajío Region corridor. Each person has a specific role and the knowledge to execute it with expertise.",
    },
    equipo: [
      { nombre: "Marisol Carrillo", cargo: "Billing & Collections", frase: "Financial order in every operation.", foto: "/assets/img/equipo/marisol-carrillo.jpg", tieneFoto: true },
      { nombre: "Andrea Vergara", cargo: "General Manager, Sama Forwarding", frase: "Connecting logistics with results.", foto: _andreaFoto, tieneFoto: true, esDireccion: true, linkedin: _andreaLinkedin },
      { nombre: "Joaquín Montero", cargo: "Operations Coordinator", frase: "Every shipment under control.", foto: "/assets/img/equipo/joaquin-montero.jpg", tieneFoto: true },
    ],

    historia: {
      label: "Our history",
      h2: "We didn't start with a corridor — we started with a conviction",
      parrafosHTML: [
        "Sama Forwarding was born from a clear conviction: that the China – Port of Manzanillo – Bajío Region corridor needed an operator who knew it in depth, not one who would manage it as just another route among dozens of global corridors.",
        "Today, Mexico's freight forwarding market is dominated by large international operators with presence in multiple markets and communication geared toward large corporations. Against that backdrop, Sama Forwarding chooses a different path: <strong>a specialized team, a specific corridor, and a very specific type of client.</strong>",
        "<strong>We work for industrial plants in the Bajío that import recurrently from Asia, mainly from China, and that cannot afford logistics improvisation, lack of tracking, or loss of operational control in their supply chain.</strong>",
      ],
    },

    valoresIntro: {
      label: "How we operate",
      h2: "The principles that guide every decision on the corridor",
      parrafo: "Sama Forwarding's values aren't statements of intent — they're the criteria we use in every operation and decision we make.",
    },
    valores: [
      { nombre: "Specialization", sub: "We don't operate every corridor. We operate this one.", copy: "Specializing in the China – Port of Manzanillo – Bajío Region corridor isn't a limitation — it's the source of the knowledge that lets us operate with expertise. An operator trying to cover every corridor in the world knows none of them in depth. Sama Forwarding chose to know this corridor better than anyone. That means knowing which shipping lines are reliable on the route, which customs points have more friction at certain times of year, and how to anticipate the variables a generalist doesn't anticipate because they haven't lived them." },
      { nombre: "Transparency", sub: "We inform before you ask.", copy: "In international logistics, information is power. An importer who doesn't know where their cargo is can't plan their production or inventory. At Sama Forwarding, transparency isn't an aspirational value — it's an operational process: active transit monitoring with proactive client updates. We don't wait for a problem to happen before informing you. We report it the moment we detect it, along with the corresponding action plan." },
      { nombre: "Trust", sub: "It's built shipment by shipment. It's not declared.", copy: "Trust in international logistics isn't built with promises — it's built with completed operations, respected timelines, and resolved incidents. Every operation Sama Forwarding manages on the China – Port of Manzanillo – Bajío Region corridor is an opportunity to demonstrate that the client made the right decision trusting their supply chain to this team. That's the only measure of trust that matters." },
      { nombre: "Commitment", sub: "The operation doesn't end when the ship departs.", copy: "Sama Forwarding's commitment to the client's operation doesn't start when a contract is signed, and it doesn't end when the cargo reaches the port. It starts with booking coordination in China and ends when the cargo is delivered to the client's plant or warehouse with complete documentation. In between, there are 28 days of active tracking, customs coordination, and ground transfer — and on every one of those days, the operational commitment is the same." },
      { nombre: "Expertise", sub: "Experience that's applied, not just declared.", copy: "Expertise is the result of having operated the China – Port of Manzanillo – Bajío Region corridor for years, having faced the variables that affect it, and having developed the ability to anticipate them. When Sama Forwarding chooses a shipping line for a specific operation, it makes informed decisions." },
    ],

    cierre: {
      label: "The next step",
      titulo: "See how we operate the corridor",
      texto: "The Sama Forwarding team you just met operates the China – Port of Manzanillo – Bajío Region corridor with this level of detail at every stage. Learn the process, the real timelines, and how we manage corridor risks before taking the next step.",
      cta: { label: "See how we work", href: "/en/china-manzanillo-bajio-corridor/" },
    },
  },
};
