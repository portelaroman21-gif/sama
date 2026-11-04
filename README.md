# SAMA Forwarding — Web 2026

Rediseño del sitio de **SAMA Forwarding**, freight forwarder especializado en el corredor
**China → Puerto de Manzanillo → Zona del Bajío**.

> Mensaje rector: *"No movemos carga. Tomamos decisiones que impactan tu operación."*

## Stack

- **Frontend público:** HTML5 + CSS3 + JavaScript nativo. Sin CMS ni frameworks pesados.
  Cada página es una carpeta con `index.html`. URLs en minúsculas, sin acentos, terminadas en `/`.
- **Backend (blog + formularios + panel):** Node.js + Express + PostgreSQL, con login.
- **Deploy:** Railway (servicio web Node + Postgres). Construido **agnóstico del hosting**
  para poder migrar al hosting final del cliente sin reescribir.

## Estructura

```
public/                  Frontend estático (servido por Express)
  assets/css/            tokens.css (design system), base.css, wireframe.css, corridor-map.css
  assets/js/             corridor-map.js (Módulo 2), waypoints.js, whatsapp.js, includes.js
  partials/              header.html, footer.html (wireframe; en prod se inyectan en build/SSR)
  <cada-pagina>/index.html
  404.html  robots.txt
src/
  config/db.js           Pool de PostgreSQL (DATABASE_URL)
  db/schema.sql          Esquema: leads, articles, categories, comments, users
  routes/                leads.js, blog.js, admin.js (stubs por fase)
server.js                Express: estáticos + API + 404 real + healthcheck
scripts/gen-wireframes.mjs  Generador de wireframes de baja fidelidad
```

## Desarrollo local

```bash
npm install
cp .env.example .env       # completar DATABASE_URL si querés probar la BD
npm run dev                # http://localhost:3000
```

Regenerar wireframes tras editar el site map:

```bash
npm run wireframes
```

## Deploy en Railway

1. Crear proyecto en Railway desde este repo de GitHub (deploy automático).
2. Agregar el plugin **PostgreSQL** → Railway inyecta `DATABASE_URL` solo.
3. Inicializar el esquema una vez: `npm run db:init` (o desde la consola de Railway).
4. Healthcheck configurado en `/healthz`.

## Estado / Roadmap por módulos

| Fase | Módulos | Estado |
|------|---------|--------|
| 0 | Estructura, wireframes, deploy base | ✅ este commit |
| 1 | M1 Design System · M2 Mapa del Corredor | tokens listos · mapa en versión base |
| 2 | M3 Home · M4 Corredor · M5 Servicios · M6 Nosotros · M7 Casos | wireframes |
| 3 | M8 Blog · M9 Editor (panel) | stubs backend |
| 4 | M10 Diagnóstico · M11 Contacto/WhatsApp · M12 Panel leads | stubs backend |
| 5 | M13 SEO · M14 Migración/301/404 · M15 Performance | base (robots, 404 real) |

## Reglas de marca duras (no romper)

- Sin carruseles/sliders. Sin precios en ningún lado. Sin urgencia falsa.
- Sin contadores en cero. Sin stock genérico de barcos/globos.
- Botones nunca dicen "Enviar"/"Submit": textos con intención.
- Contacto oficial único: Tel **33-2153-3756** · WhatsApp **+52 33 1466 5908** · **info@samaforwarding.com**
- Tránsito marítimo: **21 días** (unificado en todo el sitio).
- Contenido clave siempre en el HTML del servidor, nunca solo por JavaScript.
