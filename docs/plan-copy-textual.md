# Plan — Copy textual + assets (desde "Copia de Copy y paginas restantes.docx")

> Objetivo: dejar **TODOS los copys TEXTUALES** a los del documento del cliente, + integrar imágenes/logo/video.
> **NO se toca el MAPA** (lo hace el cliente aparte) — aunque el doc trae copy de mapa, se ignora por pedido expreso.
> Hex con typos del doc (#04F82, #A4F82, #00AEFF) → se usan los **correctos** ya establecidos
> (`--azul-profundo #0A4F82`, `--azul-sama #00AEEF`). Puntuación: se respeta literal la del doc.
> Estado: **EJECUTADO** (2026-06-22). Decisiones de §0 resueltas y aplicadas. Mapa NO tocado (lo hace el cliente).

---

## 0. DECISIONES (resueltas con el cliente — 2026-06-22)

1. **Agencia Aduanal → EXISTE en Servicios, FUERA del Home.** El grid del Home muestra 4 servicios (sin Agencia); la página Servicios muestra 5 (con Agencia, card #2). El menú puede listarla (lleva a `/servicios/`).
2. **Subpáginas de servicio → ELIMINAR las 5.** Los ítems del submenú de Servicios apuntan todos a `/servicios/`.
3. **Blog → SE MAQUETA el frontend estático ahora** (overview + plantilla de artículo) con el copy del doc. El editor/backend y los artículos reales siguen siendo otra fase.
4. **Fotos de equipo:** `image0.jpeg` (mujer) = **Marisol Carrillo**; `Image (2).jpg` (hombre) = **Joaquín Montero**. Andrea conserva su foto actual.

**Menores (asumo y aplico, corregime si no):**
- **Voseo "escribinos"** (nota del form de Contacto, línea del doc): el doc lo trae así, pero rompe la regla es-MX. → **Lo corrijo a "escríbenos"** salvo que pidas dejarlo textual.
- **Menú**: "Corredor" pasa a label largo "Corredor China–Manzanillo - Bajío" (puede apretar el header en desktop). Lo implemento como pide; si queda apretado, aviso.
- **Logo color del header**: el zip trae solo el **logo BLANCO** (footer). El de **color** (header) figura como "Enviar" → queda pendiente; mientras tanto sigue el texto provisional.
- **Mapa**: NO se toca (incluye sus copys nuevos).

---

## 1. Assets del zip → destino en el repo
| Asset | Destino | Uso |
|---|---|---|
| `Logo SamaForwarding - BLANCO.png` | `/assets/img/logo-blanco.png` | Logo del footer (reemplaza texto "SAMA Forwarding" en footer). |
| `Hero - Pagina Corredor.jpg` | `/assets/img/hero-corredor.jpg` | Fondo del hero de Corredor (overlay #0A4F82 60-70%). |
| `Hero - Página Servicios.jpg` | `/assets/img/hero-servicios.jpg` | Fondo del hero de Servicios (overlay #0A4F82 60-70%). |
| `bucle carlitos.mp4` | `/assets/video/hero-home.mp4` | Video de fondo del hero Home (loop, mute, overlay #0A4F82 60-70%). |
| `image0.jpeg` (mujer) | `/assets/img/equipo/…` | Foto de equipo (¿Marisol/Andrea? — ver §0.4). |
| `Image (2).jpg` (hombre) | `/assets/img/equipo/…` | Foto de equipo (¿Joaquín? — ver §0.4). |

*(El logo color del header queda pendiente de envío del cliente.)*

---

## 2. MENÚ (header + footer)
- Inicio · **Corredor China–Manzanillo - Bajío** · Servicios · Nosotros · **Casos y Resultados** · **Blog / Recursos** · Contacto.
- Submenú de Servicios: mantiene el listado de nombres, pero **todos los ítems apuntan a `/servicios/`** (ver §0.2).

## 3. HOME (`/`)
**Sec 1 — Hero**
- Logo color real (pendiente envío).
- Label: **"Freight Forwarder especializado"** (cambia "Forwarding"→"Forwarder").
- H1: **"No movemos carga. Tomamos decisiones que impactan tu operación"** (sin punto final).
- CTA primario "Agendar diagnóstico logístico" → `/diagnostico-logistico/`; secundario "Ver cómo trabajamos" → `#proceso`.
- **Video de fondo** `hero-home.mp4`: loop silencioso, overlay #0A4F82 60-70%, texto blanco. (Imagen estática de respaldo en mobile/conexiones lentas.)

**Sec 2 — Indicadores**
- "+10 años" → **"+11 Años"** (más grande, **contador animado** que sube a 11 al entrar en viewport) + "Operando el corredor" (más chico).
- Cambiar "Industrias que confían…" → **"Trabajamos con:"** + Manufactura, Autopartes, Electrónica, Retail, Maquila, Construcción, **cada una con ícono SVG**, con **animación dinámica al scrollear** (no carrusel).

**Sec 3 — Corredor (resumen)** (label y H2 OK)
- Arriba del mapa: *"No operamos todos los corredores del mundo. Operamos este. Y lo hacemos con el nivel de cada detalle que solo da el conocimiento acumulado de cada operación, cada naviera y cada kilómetro entre el puerto y el Bajío"*.
- Abajo del mapa: *"Conocemos los tiempos reales de tránsito, las navieras más confiables para la ruta y las carreteras más eficientes hacia la Zona del Bajío. Eso no se improvisa. Se construye operación por operación"*.

**Sec 4 — Servicios**
- Label "Un portafolio con un centro claro" → **"Servicios"** (estilo label normal, sin jerarquía de H2).
- **Agencia Aduanal: ver §0.1** (el doc dice quitarla del Home).
- Último card título → **"Seguro de carga y custodia"**.
- Primer card (Flete): **sin** badge "Servicio core"; en su lugar **fondo color principal** para diferenciarlo.
- Íconos SVG inline en cada card.

**Sec 5 — Proceso (`#proceso`)** — copy nuevo (más largo) en los 3 pasos:
- 01 "Planificamos tu operación desde China hasta el Bajío." → *"Analizamos tu cadena logística, definimos la ruta óptima en el corredor y coordinamos el booking con las navieras. Tu tomas decisiones con información real, no estimaciones."*
- 02 "Seguimiento y visibilidad en cada etapa del tránsito." → *"Monitoreamos el estado de tu carga desde el zarpe en China hasta el arribo a Manzanillo. Te informamos proactivamente, no esperamos a que preguntes."*
- 03 "Entrega en tu planta o almacén." → *"Transferimos la carga a tu destino final en el Bajío. Operación cerrada, entrega documentada."*
- Línea/progresión visual conectando los 3 pasos; ícono SVG propio por paso (ruta / radar / checkmark).

**Sec 6 — Prueba social:** *"Luego los armo bien"* → **NO se toca** (pendiente del cliente).

**Sec 7 — CTA cierre**
- Agregar label **"Siguiente paso"**.
- Mensaje WhatsApp → *"Hola,somos: Importamos desde China y me interesa conocer más sobre: ¿Podemos hablar?"* (literal del doc; es una plantilla con espacios para completar).

## 4. CORREDOR (`/corredor-china-manzanillo-bajio/`)
- **Quitar índice lateral** (TOC).
- H1 más chico; **fondo con foto** `hero-corredor.jpg` + overlay #0A4F82 60-70%.
- H2 "El corredor más estratégico para la industria del Bajío" (**sin punto**).
- 3 párrafos "por qué importa" → texto literal del doc, **a 2 columnas (solo desktop)**.
- Tiempos: H2 "Los tiempos del corredor, y qué hace que se cumplan" + intro. En la tabla: Tránsito marítimo = **"21 días"** (sin "(ruta directa)"); TOTAL = **"28 días"** (sin "≈/aprox").
- Riesgos: H2 "Los riesgos del corredor y cómo los gestionamos" + intro nuevo. **5 cards expandibles** con **texto ampliado** (riesgo / cómo lo gestiona Sama / impacto), código de color rojo/verde/azul, 3 columnas desktop apiladas mobile. (Copy literal del doc para los 5.)
- FAQ: H2 "Preguntas frecuentes del Corredor China-Puerto de Manzanillo- Zona del Bajío" + **10 respuestas AHORA APROBADAS** (reemplazan los borradores; texto literal del doc). Pregunta 10 con wording "…en el corredor China–México?".
- CTA cierre: H2 "¿Operas en el corredor China–Manzanillo–Bajío?" + párrafo + CTA primario "Agendar diagnóstico logístico gratuito" + WhatsApp ("Hola, leí sobre el corredor…").

## 5. SERVICIOS (`/servicios/`)
- Hero: label "Servicios", H1 "Soluciones logísticas con control operativo en el corredor China-Manzanillo-Bajío", subtítulo literal; **fondo foto** `hero-servicios.jpg` + overlay #0A4F82 60-70%. Sin CTA.
- Grid: label "Lo que hacemos" + H2 + párrafo (literal). Cards con íconos SVG 36-40px Azul Sama. Descripciones **literales** del doc (incluye "Seguro de carga y custodia"). Agencia Aduanal: **ver §0.1**.
- CTA cierre: label "Siguiente paso", H2, párrafo, aclaración, CTA primario + WhatsApp ("Hola, estuve revisando los servicios…").
- **Eliminar las 5 subpáginas** y apuntar menú a `/servicios/` (ver §0.2).

## 6. NOSOTROS (`/nosotros/`)
- Label "¿Quiénes somos?", H1 "Simplificamos la complejidad del comercio internacional.", subtítulo literal.
- **Quitar la sección dedicada de Andrea al inicio.** Equipo en **3 tarjetas en fila**, con **Andrea al medio** (con su descripción larga, literal del doc), Marisol (izq) y Joaquín (der) con frase + cargo. Asignar fotos del zip (ver §0.4).
- Sección "El equipo": label "El equipo", H2 "Las personas que operan el corredor", párrafo (literal).
- Historia: label "Nuestra historia", H2 "No empezamos con un corredor, empezamos con una convicción", **3 párrafos** (literal, reemplaza el actual).
- **Valores → 5** (se quita "Mejora continua"): label "Cómo operamos.", H2 "Los principios que guían cada decisión en el corredor.", párrafo. Cada valor con **título + subtítulo operativo + copy largo** (literal): Especialización, Transparencia, Confianza, Compromiso, Criterio. Grid 5 cards, ícono arriba, borde superior primario 2px, hover; Especialización primero.
- CTA cierre (excepción): label "El siguiente paso", H2 "Conoce cómo operamos el corredor", párrafo, CTA "Conoce cómo trabajamos" → `/corredor-china-manzanillo-bajio/`.

## 7. CASOS (`/casos/`)
- SEO: title/meta/canonical/schema (ItemList + BreadcrumbList)/OG/breadcrumb por el doc.
- Hero: label "Evidencia operativa", H1 "El corredor China- Puerto Manzanillo- Zona del Bajío en operaciones reales", párrafo (literal).
- Agregar **H2 "Encuentra el caso que se parece a tu operación."** + **filtro por industria** (pills JS): Todos + solo industrias con casos reales (hoy: Manufactura, Autopartes, Retail). *(Reemplaza la decisión previa de "sin filtro".)*
- Cards: *"Luego vemos las cards"* → no se reestructuran ahora.
- CTA cierre (modificar): label "Siguiente paso", H2 "¿Tu planta importa desde China vía Manzanillo?", párrafo, CTA primario "Agendar diagnóstico logístico" + WhatsApp ("Hola, leí los casos…").

## 8. DIAGNÓSTICO (`/diagnostico-logistico/`) — *solo visual (form no envía aún)*
- SEO por el doc (title, meta, canonical, schema Service+ContactPage, robots index,follow, OG).
- Hero tipográfico (fondo blanco/#EAF4FB), 2 columnas desktop (hero 50% / form 50% above-the-fold). Label/H1/subtítulo + 3 bullets (literal).
- **Form 10 campos** con labels, placeholders y opciones **literales** del doc (ajustes vs actual: Cargo agrega "Director de operaciones"; labels visibles distintos por campo; placeholders; opciones de selects exactas). Botón "Agendar diagnóstico" + estados. Nota de privacidad (literal).
- "Qué pasa después": H3 + 3 pasos con texto nuevo + íconos.
- Gracias: H1 "Tu diagnóstico está en proceso" + 3 párrafos (literal) + CTAs. *(Notas "Verificar con Andrea" quedan como están.)*

## 9. CONTACTO (`/contacto/`) — *solo visual (form no envía aún)*
- SEO por el doc.
- Hero tipográfico (#EAF4FB), label "Contacto directo", H1 "Hablemos sobre tu operación en el corredor", subtítulo (literal).
- Izq: H2 "Encuéntranos." + párrafo + datos con íconos SVG (tel, WhatsApp, email, dirección, horario "Lunes a viernes. 08:30 a.m. a 06:30 p.m.").
- Der: card "Envíanos un mensaje" + subtítulo + **6 campos** (literal; mensaje = textarea "Tu consulta", 5 líneas). Botón "Enviar mensaje" + estados. Nota (con "escríbenos", ver §0).
- Mapa Google embed (300/200px, interactivo, lazy, link "Ver en Google Maps"). *(Nota del doc: "requiere API key". El iframe simple `output=embed` NO requiere key; uso ese salvo que prefieran Maps JS API.)*
- CTA suave: label "¿Prefieres ir más en profundidad?", H2, párrafo, CTA "Realiza un diagnóstico logístico gratuito" (bg #EAF4FB, 2 col).
- Gracias: H1 "Recibimos tu mensaje" + párrafos + WhatsApp ("Hola, acabo de enviar un formulario…") + CTA "Ver el corredor".

## 10. BLOG (`/blog/`) — **ver §0.3 (¿entra ahora?)**
- Si entra: overview (hero, artículo destacado, filtro por categorías JS, grid, lead magnet) + plantilla de artículo, con el copy literal del doc. *(El contenido editorial real y el editor/backend siguen siendo otra fase.)*

## 11. MAPA — **NO SE TOCA** (lo hace el cliente aparte).

---

## Orden de ejecución (tras aprobación)
1. Resolver §0 (4 contradicciones). 2. Copiar assets (§1). 3. Tokens/CSS de overlays + video. 4. Menú + footer (logo blanco). 5. Home → Corredor → Servicios (+borrar subpáginas) → Nosotros → Casos → Diagnóstico → Contacto. 6. (Blog si entra). 7. Build + verificación (copy textual, sin "ruta directa", total "28 días", etc.) + deploy.
