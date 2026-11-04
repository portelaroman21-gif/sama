# Plan — Bloque 2: Frontend real (Módulos 3–7)

Pasar de wireframe a maquetación HTML/CSS/JS con contenido real.

## Decisiones tomadas
- **Copy largo no incluido en el doc:** lo redacta Claude como *borrador para revisión* del cliente/PM,
  respetando tono de marca, datos confirmados y reglas (sin precios, sin urgencia falsa, sin inventar).
- **Templating:** build script propio sin dependencias (mini SSG). Partials inline en el HTML (regla SEO).
- **Valores (Nosotros):** se implementan **6** (brief de marca) con toggle fácil a 5.

## Arquitectura (mini SSG)
```
src/
  content/        Datos de contenido (una fuente por dominio)
    site.mjs      contactos, nav, marca, copy global
    home.mjs      secciones de la home
    corredor.mjs  intro, tiempos, riesgos, faq
    servicios.mjs 4 servicios + plantilla de detalle
    equipo.mjs    Andrea (perfil 1ª persona), Marisol, Joaquín, valores, historia
    casos.mjs     3 casos (card + cuerpo 6 bloques + testimonio)
  templates.mjs   layout, header (estándar/simplificado), footer, cta, breadcrumb, helpers
build.mjs         combina templates + content → escribe public/<route>/index.html (todo inline)
public/assets/css/components.css   estilos reales de componentes
```
`npm run build` regenera las páginas reales del Bloque 2.
Las páginas de Bloques 3–4 (diagnóstico, contacto, blog, gracias) siguen en wireframe hasta su bloque.

## Páginas y criterio de listo (del documento)
1. **M3 Home** — 7 secciones en orden (hero→indicadores→corredor compact→servicios→proceso→prueba social→CTA). Cero contadores en cero.
2. **M4 Corredor** ⭐ — pillar SEO 1.500+ palabras: hero→3 párrafos+dato +40%→mapa full→tiempos 5 etapas→5 riesgos `<details>`→FAQ 10 preguntas `<details>`+Schema FAQPage→CTA. Índice interno. Todo en HTML.
3. **M5 Servicios** — general (grid fijo 4, Flete core) + subpágina Flete Marítimo (día 1). Sin Agencia Aduanal.
4. **M6 Nosotros** — Andrea 1ª persona, 3 cards (frase antes de foto), historia, 6 valores, CTA→Corredor (excepción).
5. **M7 Casos** — general (3 cards, sin filtro <4) + 3 páginas individuales anónimas con testimonio. 2 testimonios reusados en Home.
6. **M5 subpáginas 1.5** — Transporte, Almacenaje, Seguro (misma plantilla).

## Transversal
- Mapa del corredor (Fase 1) integrado: Home compact · Corredor full · servicios static.
- Imágenes: placeholders estilizados hasta que lleguen fotos reales / logo blanco / OG 1200×630.
- SEO básico por página (title/description/H1 únicos, breadcrumbs). SEO técnico completo = Bloque 5.
- Formularios = Bloque 4: los CTA apuntan a /diagnostico-logistico/ (sigue wireframe).
- Accesibilidad: acordeones y mapa por teclado; respetar prefers-reduced-motion.

## Pendientes que no frenan
Fotos reales, video hero, logo blanco footer, OG images, foto de Marisol → placeholders, swap sin retrabajo.

## Secuencia (milestones)
1. Fundación (SSG + header/footer/CSS reales).
2. Home + Corredor (máximo valor SEO/conversión).
3. Servicios (general + Flete core).
4. Nosotros + Casos.
5. 3 subpáginas de servicio restantes.
