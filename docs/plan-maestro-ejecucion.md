# SAMA Forwarding — Plan de Ejecución por Fases

> Derivado de **`Sama_Forwarding_Plan_Maestro_Ejecucion.docx` (v2.0 definitiva, junio 2026)**.
> Ese documento **prevalece** sobre cualquier brief, spec o versión anterior. Donde había
> contradicciones, este plan ya las resuelve o las marca para confirmar con el cliente.
>
> Fecha del plan: 2026-06-20 · Stack: HTML5 + CSS3 + JS nativo + mini-SSG propio (Node) · Deploy: Railway.

---

## 0. Cómo leer este plan

Cada fase tiene un **estado de ejecución**:

| Tag | Significado |
|-----|-------------|
| **▶ AHORA** | Se ejecuta en esta tanda de trabajo. |
| **🎨 AHORA (solo visual)** | Se maqueta el diseño/visual ahora; la lógica (envío real, backend) queda diferida. |
| **⏸ DIFERIDO — forms** | Documentado, NO se ejecuta ahora (formularios funcionales / backend / panel). |
| **⏸ DIFERIDO — blog** | Documentado, NO se ejecuta ahora (blog público + editor). |
| **⏸ DIFERIDO — SEO** | Documentado, NO se ejecuta ahora (SEO técnico, tracking, performance, migración, QA final). |

### Alcance acordado con el cliente (Carlos), 2026-06-20

1. **Ejecutar ahora:** TODO el sitio **por fases estructuradas**, **excepto** formularios funcionales, blog y SEO técnico.
   → En la práctica: fundaciones, componentes globales, y **todas las páginas públicas salvo el blog**, con el **diseño visual** de la landing de diagnóstico y de contacto incluido (los formularios se maquetan pero **todavía no envían**).
2. **Copy:** se **reemplaza TODO** el copy borrador actual por el **copy aprobado literal** del Plan Maestro. Incluye sumar el 5º servicio (**Agencia Aduanal**) y **eliminar cualquier "28–35 días"**.
3. **Textos que no están en el doc** (10 respuestas de FAQ del Corredor, cuerpos de subpáginas de servicio): se **mantienen los borradores actuales marcados como `BORRADOR`** para revisión del cliente; el resto avanza.
4. **Contacto duplicado** (`info@` vs `avergara@`; dos WhatsApp): se implementa **tal cual el doc**, **centralizado en un único archivo de config**, con comentario marcando la duplicidad para confirmar con el cliente.

> ⚠️ **Un punto de frontera a confirmar:** el cliente dijo "todo excepto **forms**". Interpreto que las páginas
> **Diagnóstico** y **Contacto** se **maquetan visualmente ahora** (porque el pedido original fue "diseño de la
> landing visual"), y solo se difiere la **mecánica del formulario** (validación de envío, endpoint, panel, emails,
> tracking). Si en realidad preferís **no tocar esas dos páginas todavía**, avisame y las saco del lote "AHORA".

---

## 1. Decisiones transversales ya cerradas (no reabrir)

- **Idea única:** "Somos especialistas en el corredor China → Manzanillo → Bajío y controlamos la operación de punta a punta."
- **Mensaje rector** (home + piezas clave): *"No movemos carga. Tomamos decisiones que impactan tu operación."*
- **4 pilares:** Control · Claridad · Criterio · Acompañamiento.
- **Tono:** profesional, claro, seguro, **español de México (es-MX, trato de "tú")**. **Prohibido voseo argentino.** Voz activa.
- **Prohibido en todo el sitio:** carruseles/sliders, precios/tarifas/"Cotizar", urgencia artificial ("últimos cupos", contadores), contadores en cero, stock genérico (barcos/globos), testimonios o números inventados, botones que digan "Enviar"/"Submit", lenguaje commodity ("soluciones integrales", "exporta e importa sin riesgos").
- **Regla de oro:** cada pieza debe responder *"¿esto comunica control, criterio y especialización en el corredor?"*. Si no, no va.

### 1.1 Tiempos del corredor (set único — usar EXACTO en mapa, tabla y FAQ)

| Etapa | Tiempo |
|-------|--------|
| Coordinación y booking en China | 1 a 3 días |
| Tránsito marítimo China–Manzanillo | **21 días** (ruta directa) |
| Arribo y espera en Manzanillo | FCL: 1 día · LCL: 3 a 5 días |
| Despacho aduanal en Manzanillo | 5 días |
| Transporte terrestre al Bajío | 1 día |
| **TOTAL puerta a puerta** | **≈ 28 días** |

> ❌ Eliminar cualquier mención a "28–35 días" (tooltip viejo, está mal).

### 1.2 Servicios — 5 con jerarquía

| Nivel | Servicio | Tratamiento visual |
|-------|----------|--------------------|
| **Core** | Flete Marítimo China–México | Card destacada: mayor tamaño, badge "Servicio core", borde superior primario grueso. |
| **Prioritario** | **Agencia Aduanal** *(NUEVO — falta en el sitio)* | 2ª posición, mismo ancho que el core, **sin badge**, borde superior primario. |
| Complementario | Transporte y Logística | Card estándar. |
| Complementario | Almacenaje y Distribución | Card estándar. |
| Complementario | Seguro de Carga | Card estándar. |

### 1.3 Tokens de marca (un solo archivo, día 1)

| Token | Valor | Uso |
|-------|-------|-----|
| `--azul-profundo` | `#0E76BC` | Color principal, fondos corporativos, acentos. |
| `--azul-overlay` | `#0A4F82` | Overlay 60–70% sobre fotos de hero. |
| `--azul-sama` | `#00AEEF` | Acento: CTAs, labels, numeración, bloques de cierre. |
| `--gris-corp` | `#404041` | Textos secundarios, fondo del footer. |
| `--azul-claro` | `#EAF4FB` | Fondos suaves, CTAs inline del blog. |
| `--footer-bottom` | `#2C2C2A` | Franja inferior del footer (copyright). |
| `--blanco` | `#FFFFFF` | Fondos limpios, texto sobre oscuro. |

> El brief tiene typos en hex (`#04F82`, `#A4F82`, `#00AEFF`): usar **solo** los valores de arriba.
> Tipografía: **Montserrat** self-host woff2 (Black/Bold títulos, SemiBold subtítulos, Regular cuerpo), `font-display: swap`, preload del peso principal.

### 1.4 Datos de contacto (centralizar en `src/content/site.mjs`)

| Dato | Valor oficial |
|------|---------------|
| Teléfono | `33-2153-3756` (link `tel:` en mobile) |
| WhatsApp (contacto) | `+52 33 1466 5908` |
| Email público | `info@samaforwarding.com` |
| Email footer / firmas | `avergara@samaforwarding.com` |
| WhatsApp footer simplificado (landing) | `+52 33 1473 2213` |
| Dirección | Calzada Central 290, Int. 406, Ciudad Granja, Zapopan, Jalisco |
| Horario | Lunes a viernes, 08:30 – 18:30 |

> ⚠️ **Confirmar con el cliente:** dos emails y dos WhatsApp distintos. Se implementa tal cual el doc, centralizado,
> con comentario en el config. Decisión final del cliente antes de lanzar.

---

# FASES

## BLOQUE 0 · Fundaciones técnicas

### F1 — Config central de datos · **▶ AHORA**
- **Qué:** consolidar TODOS los datos de contacto, mensajes de WhatsApp por página, y flags de marca en `src/content/site.mjs` (única fuente). Comentar la duplicidad email/WhatsApp.
- **Delta:** ya existe `site.mjs`; auditarlo contra la tabla 1.4 y completar lo que falte.
- **DoD:** cambiar un dato de contacto en un solo lugar lo cambia en todo el sitio tras `npm run build`.
- **Test:** editar el teléfono en config → build → aparece cambiado en footer, contacto y landing.

### F2 — Tokens de marca · **▶ AHORA**
- **Qué:** verificar `tokens.css` contra la tabla 1.3. Agregar `--footer-bottom` y `--blanco` si faltan.
- **Delta:** tokens ya existen; sumar/renombrar los dos faltantes y revisar usos.
- **DoD:** un solo archivo de tokens; cambiar un color ahí lo cambia en todo el sitio.
- **Test:** cambiar `--azul-sama` temporalmente → todos los CTAs cambian. DevTools → Montserrat carga del propio dominio (no Google CDN).

### F3 — Design system (componentes) · **▶ AHORA**
- **Qué:** auditar botones (primario sólido / secundario outline; 4 estados: normal, hover 0.2s, loading "Enviando…"+spinner+disabled, error), cards, grid, labels, jerarquía tipográfica. Íconos **SVG inline a medida**, outlined, 36–40px (no icon fonts, no librerías).
- **DoD:** los 4 estados de botón funcionan y son visibles; cero colores fuera de paleta.
- **Test:** forzar estado loading → spinner + botón deshabilitado.

### F4 — Routing y estructura de URLs · **▶ AHORA**
- **Qué:** una carpeta por página con `index.html`, URLs **minúsculas, sin acentos ("bajio"), con barra final**. **Alinear slugs de servicios al doc** (ver delta). Documentar reglas Apache/nginx (rewrite sin extensión, 404 real, http→https, www→no-www) en `docs/` para el hosting final.
- **Delta (slugs a cambiar):**
  - `transporte-y-logistica` → **`transporte-logistica`**
  - `almacenaje-y-distribucion` → **`almacenaje-distribucion`**
  - `seguro-de-carga` → **`seguro-carga`**
  - (Flete ya coincide. Agencia Aduanal: nueva, ver F12.)
- **DoD:** ninguna URL pública da 404 por estructura; todas con "/" minúsculas sin acentos.
- **Test:** recorrido manual → 200 OK en cada ruta; `/servicios` redirige a `/servicios/`.

---

## BLOQUE 1 · Componentes globales

### F5 — Header (estándar + simplificado) · **▶ AHORA**
- **Qué:** estándar = logo izq (link `/`) + menú *Inicio · Corredor · Servicios · Nosotros · Casos · Blog · Contacto* + CTA "Diagnóstico logístico" (Azul Sama) siempre visible. Sticky sólido al scroll. Mobile = hamburguesa full-screen con CTA visible. Dropdown de Servicios (desktop despliega, mobile subítems). Simplificado (solo `/diagnostico-logistico/` y su gracias) = logo + WhatsApp, sin menú.
- **Delta:** ya existe; verificar dropdown incluye la nueva Agencia Aduanal y el CTA en mobile.
- **DoD:** header estándar en todas menos la landing; CTA visible siempre; sólido al scroll.
- **Test:** 360px → hamburguesa full-screen + CTA; `/diagnostico-logistico/` → header simplificado.

### F6 — Footer (estándar + simplificado) · **▶ AHORA**
- **Qué:** estándar 4 col (gris `#404041`): col1 logo blanco + descripción con keywords + LinkedIn/Facebook; col2 "Sitio"; col3 "Servicios" (**los 5** + link Diagnóstico); col4 "Contacto" (dirección, tel, `avergara@`, WhatsApp precargado + "Respondemos en 24 horas hábiles."). Franja inferior `#2C2C2A`: copyright año-JS + aviso anti-fraude. Simplificado (landing) = email + tel + WhatsApp `1473 2213` + link home + copyright.
- **Copy exacto descripción col1:** *"Especialistas en logística industrial en el corredor China–Manzanillo–Bajío. Operamos importaciones recurrentes para plantas industriales del Bajío."*
- **Copy exacto franja:** *"© [año] Sama Forwarding. Todos los derechos reservados. · Los únicos medios de comunicación oficiales de Sama Forwarding son los que aparecen en este sitio."*
- **Delta:** col3 debe pasar a **5 servicios** (sumar Agencia Aduanal). Logo blanco = **pendiente del cliente** (placeholder).
- **DoD:** año dinámico; todos los links válidos (sin 404); 4→2→1 columnas.
- **Test:** clic en cada link → destino correcto; responsive de columnas.

### F7 — Mapa del Corredor (componente estrella) · **▶ AHORA**
- **Qué:** SVG inline + CSS + JS vanilla (prohibido Google Maps/Leaflet/Mapbox). Línea horizontal, 5 círculos 01–05. Desktop hover→tooltip; mobile tap→panel **debajo** del mapa. Animación de dibujo izq→der al entrar en viewport (1 vez/sesión, respeta `prefers-reduced-motion`). Carga no bloqueante (LCP sano). 3 variantes: **compacta** (home), **completa** (Corredor), **estática** (subpáginas servicio). A11y: `aria-label` por waypoint, navegable por teclado (Enter/Space). Texto de tooltips **también en HTML oculto** para SEO.
- **🔴 Copy exacto de waypoints (REEMPLAZAR el actual):**
  - **01 China (Origen):** *"Coordinamos bookings con navieras tier 1 y seguimos la carga desde China hasta el zarpe confirmado. Porque el control operativo no empieza en puerto: empieza en origen."* Puertos: Shanghai, Qingdao, Xiamen, Hong Kong, Ningbo, Shenzhen.
  - **02 Tránsito marítimo:** *"21 días promedio en ruta directa. Monitoreo activo con alertas ante desvíos o demoras. No esperamos que preguntes: te informamos."*
  - **03 Puerto Manzanillo:** *"Presencia operativa activa. Coordinación de transferencia terrestre desde el puerto."*
  - **04 Ruta terrestre:** *"Coordinamos el transporte terrestre con unidades dedicadas a Sama Forwarding. No tercerizamos esta etapa a un transportista desconectado de la operación."*
  - **05 Destino Bajío:** *"Una operación no termina en puerto. Termina cuando la carga es entregada correctamente, la documentación está completa y el cliente tiene visibilidad total del cierre."* Ciudades: Guadalajara, Guanajuato, Querétaro, Aguascalientes, San Luis Potosí, Michoacán, Jalisco.
- **Delta:** existe el componente y el prototipo; **reemplazar `waypoints.js` por este copy exacto**.
- **DoD:** funciona con mouse/touch/teclado; textos en el HTML; animación 1 vez + reduced-motion; no bloquea render. *(El cliente debe aprobar el prototipo — ya está en `/prototipo/mapa/`.)*
- **Test:** Tab+Enter abre panel; tap mobile → panel debajo; view-source muestra microcopies; reduced-motion no anima; PageSpeed: SVG no bloquea render.

---

## BLOQUE 2 · Páginas públicas

### F8 — Reemplazo global de copy aprobado · **▶ AHORA** *(cross-cutting, el problema principal)*
- **Qué:** actualizar los archivos `src/content/*.mjs` con el **copy literal aprobado** del Plan Maestro. Como es un SSG, esto propaga a todas las páginas en el build. Marcar como `// BORRADOR — pendiente aprobación cliente` los textos que NO están en el doc (FAQ del corredor, cuerpos de subpáginas).
- **Alcance del reemplazo:** `site.mjs`, `home.mjs`, `corredor.mjs`, `servicios.mjs` (+Agencia Aduanal), `equipo.mjs`, `casos.mjs`, `waypoints.js`.
- **DoD:** grep de frases prohibidas devuelve 0 ("exporta e importa sin riesgos", "28-35", voseo); cada sección con "COPY EXACTO" coincide literal con el doc.
- **Test:** diff por archivo + recorrido visual de cada página.

### F9 — Home (`/`) · **▶ AHORA**
- **Qué:** 7 secciones en orden de funnel. Copy exacto del doc en cada una:
  1. **Hero** — Label "Freight Forwarding especializado"; H1 *"No movemos carga. Tomamos decisiones que impactan tu operación."*; supporting *"Control operativo en el corredor China – Manzanillo – Zona del Bajío."*; CTA1 "Agendar diagnóstico logístico" → `/diagnostico-logistico/`; CTA2 "Ver cómo trabajamos" → `#proceso`. Overlay azul 60–70%. Eliminar permanentemente "Exporta e importa sin riesgos".
  2. **Indicadores de confianza** — industrias (Manufactura · Autopartes · Electrónica · Retail · Maquila · Construcción) + "+10 años operando el corredor". **Nunca ceros.**
  3. **El corredor (resumen)** + **mapa compacto** (F7). Copy exacto (label/H2/párrafo/refuerzo/CTA suave).
  4. **Servicios con jerarquía** — grid estático, Flete destacado. Copy exacto de las cards.
  5. **Proceso operativo (`#proceso`)** — "Tres pasos. Una operación bajo control." + 3 pasos copy exacto, animación secuencial al scroll.
  6. **Prueba social** — 1 testimonio principal + 1 caso breve + industrias (máx 2 testimonios). Testimonio Manufactura exacto.
  7. **CTA de cierre** — bloque Azul Sama, copy exacto, sin formulario.
- **Delta:** ajustar copy + asegurar el grid de servicios refleje jerarquía (Flete core).
- **DoD:** 7 secciones en orden; cero contadores en cero; cero copy commodity; testimonios reales.
- **Test:** recorrer orden; CTA2 → `#proceso`; (PageSpeed mobile se valida en F28).

### F10 — Corredor (`/corredor-china-manzanillo-bajio/`) · **▶ AHORA**
- **Qué:** página pillar, **≥1.500 palabras (objetivo 2.000+)**. 7 secciones con copy exacto del doc:
  1. Hero sin CTA (label/H1/subtexto exactos).
  2. "El corredor más estratégico para la industria del Bajío" — 3 párrafos exactos + dato editorial "+40% del tráfico de contenedores de México pasa por Manzanillo".
  3. **Mapa completo** (F7, tooltips extendidos).
  4. Tiempos operativos (5 etapas de §1.1) + copy introductorio exacto.
  5. Riesgos del corredor — 5 cards expandibles (rojo riesgo / verde gestión / azul impacto), 3 col desktop. Copy exacto de los 5 riesgos.
  6. **FAQ (10 preguntas)** — acordeón, **Schema FAQPage JSON-LD**, respuestas en HTML inicial. Preguntas exactas del doc; **respuestas = mantener borradores marcados `BORRADOR`** (no están en el doc).
  7. CTA de cierre — copy exacto.
- **Delta:** página ya existe (~1.695 palabras, schema OK); ajustar copy a literal exacto + dato +40% + riesgos con copy exacto.
- **DoD:** ≥1.500 palabras; tiempos/riesgos/FAQ en HTML inicial; FAQPage válido; índice interno (anclas) en desktop; sin "28-35".
- **Test:** conteo de palabras; Rich Results (FAQ); sin-JS muestra todo; buscar "28-35" → 0.

### F11 — Servicios overview (`/servicios/`) · **▶ AHORA**
- **Qué:** hero (copy exacto) + grid **5 cards** con jerarquía. Copy exacto de las 5 cards (incluida Agencia Aduanal "Prioritario"). Flete = card destacada (badge "Servicio core"). CTA de cierre copy exacto.
- **Delta:** **sumar la card de Agencia Aduanal** (2ª posición) — hoy hay 4.
- **DoD:** 5 cards, jerarquía correcta; el core se identifica en <3s; cada "Ver detalle" → subpágina válida.
- **Test:** mostrar 3s a alguien → debe decir "Flete Marítimo" como principal.

### F12 — Subpáginas de servicio (plantilla única) · **▶ AHORA**
- **Qué:** plantilla única para las 5: hero compacto + breadcrumb, "Qué incluye" (lista check), "Cómo funciona en el corredor" (mapa estático con etapa resaltada), "Para quién es / para quién no", FAQ 3–5 (Schema FAQPage propio, **reescritas** vs corredor), CTA cierre.
- **Delta:** **alinear slugs** (F4), **crear subpágina de Agencia Aduanal**. Cuerpos (600–900 palabras) y FAQ = **mantener borradores `BORRADOR`** (no están en el doc); Flete debe quedar sólida (2ª página SEO).
- **DoD:** 5 subpáginas con plantilla y contenido propio; FAQ no duplican las del corredor.
- **Test:** comparar FAQ subpágina vs corredor → reescritas, no copiadas.

### F13 — Nosotros (`/nosotros/`) · **▶ AHORA**
- **Qué:** hero (copy exacto) + **perfil de Andrea Vergara en 1ª persona** (copy exacto, foto 40% / texto 60%) + equipo (3 cards: Andrea, Marisol *(⚠ sin foto → placeholder)*, Joaquín) + historia centrada en el corredor (copy exacto) + **6 valores** (Especialización primero; incluye "Mejora continua") + **CTA excepción → `/corredor-china-manzanillo-bajio/`** (NO al diagnóstico).
- **Delta:** ajustar copy a literal; confirmar 6 valores (toggle a 5 disponible).
- **DoD:** perfil Andrea 1ª persona exacto; 3 cards con frase+cargo; valores aterrizados (6); CTA → Corredor.
- **Test:** botón principal abre `/corredor-china-manzanillo-bajio/`; placeholder de Marisol consistente y marcado.

### F14 — Casos (`/casos/` + 3 individuales) · **▶ AHORA**
- **Qué:** overview (hero copy exacto) + 3 cards (Manufactura, Autopartes, Retail) con copy exacto + 3 páginas individuales (6 bloques c/u, Schema Article). **Sin filtro por industria** (solo con 4+ casos; hoy son 3). Todos anónimos. 2 testimonios se reutilizan en home.
- **Delta:** ya existen; ajustar a copy exacto del doc (contexto/desafío/solución/resultado/testimonio).
- **DoD:** 3 cards + 3 páginas anónimas con testimonio y Schema Article; sin filtro; 2 testimonios en home.
- **Test:** cada `/casos/nombre/` → 200 + Schema Article; sin pills de filtro.

### F15 — Página 404 (`/404.html`) · **▶ AHORA (visual)** · *tracking del 404 → ⏸ DIFERIDO — SEO*
- **Qué:** header/footer estándar + bloque "404" Montserrat 96–120px + "Esta página no existe" + SVG minimalista del corredor + hasta 4 cards de rescate (Inicio · Corredor · Servicios · Diagnóstico) + WhatsApp de rescate. **Status 404 real (no 200)**, `meta robots noindex, follow`.
- **Delta:** existe y ya devuelve 404 real; ajustar copy/cards. El **tracking** (pageview + `document.referrer`) se difiere a F27.
- **DoD:** status 404 real; header/footer + 4 cards + WhatsApp; noindex,follow.
- **Test:** URL inexistente → 404 en headers (no 200).

---

## BLOQUE 2b · Conversión — diseño visual

### F16 — Landing Diagnóstico (`/diagnostico-logistico/`) · **🎨 AHORA (solo visual)**
- **Qué (visual):** layout 2 col 50/50 (hero izq + form der, ambos above-the-fold), mobile apilado. Hero tipográfico (sin imagen, fondo blanco/`#EAF4FB`). **Card del formulario** (blanca, sombra, radius 8px, padding 32px) con los **10 campos en orden** maquetados. "Qué pasa después" (3 pasos). Nota de privacidad. Botón "Agendar diagnóstico" (nunca "Enviar"). Header + footer **simplificados**. Copy exacto del doc.
- **⏸ DIFERIDO a F21 (forms):** validación de envío, estados loading/error reales, submit, redirección a `/gracias/`, eventos de tracking.
- **DoD (de esta fase):** la página se ve completa y correcta; 10 campos en orden; header/footer simplificados; copy exacto. El form **aún no envía** (marcado).
- **Test:** revisión visual desktop/mobile; checklist de los 10 campos y su orden.

### F17 — Contacto (`/contacto/`) · **🎨 AHORA (solo visual)**
- **Qué (visual):** hero breve (H1 "Hablemos sobre tu operación en el corredor") + 2 col: izq datos (tel, WhatsApp `1466 5908`, `info@`, dirección, horario — **nunca ocultos tras el form**), der form 6 campos maquetado. Mapa **Google Maps iframe embed** (sin API key, lazy, 300/200px). CTA suave al diagnóstico (`#EAF4FB`) después del form. Header **estándar**.
- **⏸ DIFERIDO a F22 (forms):** envío del form, thank-you, eventos.
- **DoD (de esta fase):** datos visibles sin form; mapa lazy sin API key; form de 6 campos maquetado (no envía aún).
- **Test:** mapa carga diferido; revisión visual.

### F23a — WhatsApp: links precargados · **▶ AHORA** · *(eventos de click → ⏸ DIFERIDO — SEO/tracking F27)*
- **Qué:** módulo central JS/JSON con los mensajes precargados por página (URL-encoded `%20`). Los botones abren WhatsApp con el texto correcto. Mensajes exactos del doc (home, corredor, servicios, casos, 404, thank-you contacto).
- **Delta:** ya hay helper `waLink`; verificar mensajes exactos del doc y centralización.
- **DoD:** cada botón abre WhatsApp con el mensaje correcto y bien codificado.
- **Test:** probar links en iOS + Android → texto completo y legible.

---

## BLOQUE 3 · Backend + Panel de administración — *⏸ DIFERIDO*

> ⚠️ Cambio de alcance: blog editable + panel de leads requieren backend + BD + login. **Validar comercialmente**
> (presupuesto, hosting, cronograma) antes de cerrar plazo/precio. Hosting debe ejecutar backend + base de datos.

### F18 — Endpoint de formularios + validación server · **⏸ DIFERIDO — forms**
- Endpoint (Node) que recibe POST: (1) valida server-side (espejo del cliente), (2) guarda lead en BD, (3) dispara email al lead + notificación al equipo, (4) redirige a thank-you. Anti-spam honeypot + rate limiting. Log de fallidos + alerta.

### F19 — Panel de leads (admin propio) · **⏸ DIFERIDO — forms**
- Login. Tarjetas por envío (todos los campos + origen + fecha). Estado Respondido/No respondido (filtrable). **3 colecciones separadas:** Diagnóstico · Contacto · Nurturing (lead magnet). *(Pendiente: nº de usuarios, ¿auditoría de cambios?)*

### F20 — Editor de blog en el panel · **⏸ DIFERIDO — blog**
- Editor rich-text (TipTap/Quill), H2/H3, imágenes con **ALT obligatorio**, imagen destacada 16:9, slug editable, categorías padre/hijo, palabra clave SEO, comentarios moderables. **No negociable:** el HTML del artículo llega renderizado del servidor (no JS cliente). *(Pendiente: moderación previa sí/no; estados borrador/publicado/programado.)*

---

## BLOQUE 4 · Conversión — mecánica de formularios — *⏸ DIFERIDO — forms*

### F21 — Formulario de Diagnóstico funcional · **⏸ DIFERIDO — forms**
- Validación HTML5 + JS (email corporativo aviso suave sin bloquear, tel ≥10 díg., "Otro" en cargo abre campo), estados del botón, anti doble-submit, submit al endpoint (F18), thank-you `/diagnostico-logistico/gracias/` (copy exacto), eventos `diagnostico_completado` + LinkedIn + Meta. *(Medir `form_field_drop` desde día 1; si completado <15% el 1er mes, testear variante de 6 campos.)*

### F22 — Formulario de Contacto funcional · **⏸ DIFERIDO — forms**
- Form 6 campos → endpoint (grupo Contacto), thank-you `/contacto/gracias/` (copy exacto, WhatsApp de confirmación), evento `contacto_completado` **separado** de diagnóstico.

---

## BLOQUE 2.7 · Blog público — *⏸ DIFERIDO — blog*

### F24 — Blog overview + artículo · **⏸ DIFERIDO — blog**
- Overview (hero copy exacto, artículo destacado, filtro por categoría JS, grid 3/2, paginación a partir de 9). Artículo (breadcrumb, autor Andrea, ≥800 palabras / 1.200+ pilares, índice si +1.000, CTA inline, 3 relacionados, **Schema Article**, render del servidor). *(El link "Blog" del menú se mantiene; las páginas stub quedan como placeholder.)*

### F25 — Lead magnet + nurturing · **⏸ DIFERIDO — blog**
- PDF "La guía del corredor…" a cambio de email → lista de nurturing separada. *(Pendiente cliente: producir el PDF; si no hay herramienta de email al lanzar, descarga directa sin captura.)*

---

## BLOQUE 5 · SEO · Tracking · Performance · Migración · QA — *⏸ DIFERIDO — SEO*

> Nota: el **SEO estructural** (contenido clave en el HTML del servidor, URLs limpias, un H1 por página, HTML semántico)
> ya se respeta por diseño del SSG en las fases AHORA. Lo que se **difiere** es el **módulo SEO completo**: auditoría de
> schema en todas las páginas, sitemap, robots, OG images, tracking, redirects y QA final.

### F26 — SEO técnico · **⏸ DIFERIDO — SEO**
- Title (≤60, condensar los que exceden) + description (120–155) únicos por página. Schema JSON-LD por página (Organization/LocalBusiness, Service, FAQPage, BreadcrumbList, AboutPage, ItemList, Article según corresponda; sintaxis correcta `application/ld+json`). `sitemap.xml` + `robots.txt` regenerados en build. Canonical + Open Graph (OG 1200×630 del corredor, no logo) + alt en español.

### F27 — Tracking y medición · **⏸ DIFERIDO — SEO**
- GTM contenedor único → GA4 + LinkedIn Insight + Meta Pixel. 9 eventos: `diagnostico_completado`, `contacto_completado`, `cta_diagnostico_click`, `whatsapp_click`, `mapa_interaccion`, `scroll_depth` (25/50/75/90), `descarga_guia`, `form_field_drop`, `error_404`. **Configurar antes de lanzar.** *(Accesos los entrega el cliente.)*

### F28 — Performance · **⏸ DIFERIDO — SEO**
- PageSpeed mobile **>75** (piso global). Imágenes WebP/AVIF + srcset + lazy (hero preload). Video hero solo desktop con poster. SVG inline, CSS/JS minificados, JS `defer`. Fuentes preload.

### F29 — Migración y redirects 301 · **⏸ DIFERIDO — SEO**
- Backup FTP del sitio actual **antes de tocar nada**. Exportar URLs indexadas de Search Console. Tabla de 301 (`/home`→`/`, `/post?...`→`/blog/slug/`, etc.). ErrorDocument 404, http→https, www unificado. Monitoreo de 404s reales (3 meses).

### F30 — QA pre-lanzamiento (checklist) · **⏸ DIFERIDO — SEO**
- SEO (crawl Screaming Frog), redirects, formularios (envío ok/fallido, lead al panel, email, validaciones, honeypot, eventos), tracking (9 eventos en DebugView + píxeles), performance (>75), accesibilidad (teclado mapa/acordeones, aria-labels, contraste AA, reduced-motion), contenido (cero lorem/ceros/datos sin confirmar, WhatsApp iOS+Android, año automático), cross-browser/responsive 360–1920px, links (sin 404 internos).

---

## 2. Pendientes del cliente (no frenan lo "AHORA")

- [ ] **Logo en versión blanca** para el footer (placeholder mientras tanto).
- [ ] **Foto de Marisol Carrillo** (Andrea y Joaquín ya tienen) → placeholder consistente marcado.
- [ ] **Confirmar duplicidad** email (`info@` vs `avergara@`) y WhatsApp (`1466 5908` vs `1473 2213`).
- [ ] Aprobar **prototipo del mapa** (`/prototipo/mapa/`).
- [ ] **6 vs 5 valores** (implementado 6 con toggle).
- [ ] Decisiones de blog/backend (diferidas): moderación de comentarios, estados de artículo, herramienta de email, PDF guía, 6 títulos + calendario.
- [ ] Accesos: Search Console, Analytics/GTM, Ads, Meta, hosting/DNS, FTP.
- [ ] Validación comercial del alcance backend+BD.
- [ ] Textos `BORRADOR` a aprobar: **10 respuestas de FAQ del corredor** y **cuerpos de las 5 subpáginas**.

## 3. Orden de ejecución sugerido (lote "AHORA")

```
F1 → F2 → F3 → F4        (fundaciones)
F8                       (reemplazo de copy — habilita el resto)
F5 → F6 → F7 → F23a      (componentes globales + WhatsApp links)
F9 → F10 → F11 → F12     (home, corredor, servicios + subpáginas)
F13 → F14 → F15          (nosotros, casos, 404)
F16 → F17                (diagnóstico + contacto, solo visual)
```

Diferido para después (en este orden cuando se autorice): **F18–F22 (forms)** → **F24–F25 (blog)** → **F26–F30 (SEO)**.
