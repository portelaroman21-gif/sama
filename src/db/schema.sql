-- ============================================================
-- SAMA FORWARDING — Esquema de base de datos (PostgreSQL)
-- Cubre: panel de leads (Módulo 12) y blog editable (Módulo 9).
-- ============================================================

-- ---- Usuarios del panel (login admin) ----
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre        TEXT,
  rol           TEXT NOT NULL DEFAULT 'editor', -- editor | admin
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---- LEADS (Módulo 10 + 12): formularios como tarjetas ----
-- origen distingue los 3 grupos: diagnostico | contacto | nurturing(PDF)
CREATE TABLE IF NOT EXISTS leads (
  id            SERIAL PRIMARY KEY,
  origen        TEXT NOT NULL CHECK (origen IN ('diagnostico','contacto','nurturing')),
  nombre        TEXT NOT NULL,
  empresa       TEXT,
  cargo         TEXT,
  email         TEXT NOT NULL,
  telefono      TEXT,
  -- campos de calificación (diagnóstico)
  origen_importacion TEXT,   -- puerto de origen
  volumen       TEXT,
  frecuencia    TEXT,
  destino       TEXT,
  desafio       TEXT,
  -- contacto
  como_nos_encontraste TEXT,
  mensaje       TEXT,
  -- gestión
  pagina_origen TEXT,
  respondido    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_leads_origen ON leads(origen);
CREATE INDEX IF NOT EXISTS idx_leads_respondido ON leads(respondido);

-- ---- BLOG (Módulo 8/9) ----
CREATE TABLE IF NOT EXISTS categories (
  id        SERIAL PRIMARY KEY,
  nombre    TEXT NOT NULL,
  slug      TEXT UNIQUE NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL -- jerarquía padre/hijo
);

CREATE TABLE IF NOT EXISTS articles (
  id            SERIAL PRIMARY KEY,
  titulo        TEXT NOT NULL,          -- H1
  slug          TEXT UNIQUE NOT NULL,   -- minúsculas, sin acentos, guiones
  descripcion   TEXT,                   -- meta description
  keyword       TEXT,                   -- palabra clave principal (SEO)
  contenido_html TEXT NOT NULL,         -- HTML limpio (Quill), renderizado en server
  imagen_destacada TEXT,                -- 16:9
  imagen_alt    TEXT,                   -- ALT obligatorio
  imagen_caption TEXT,                  -- pie de la imagen destacada
  autor         TEXT NOT NULL DEFAULT 'Andrea Vergara',
  -- soft delete: 'eliminado' NO se borra de la BD, solo se oculta de la web
  estado        TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador','publicado','eliminado')),
  publicado_at  TIMESTAMPTZ,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_articles_estado ON articles(estado);

CREATE TABLE IF NOT EXISTS article_categories (
  article_id  INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id          SERIAL PRIMARY KEY,
  article_id  INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  autor       TEXT,
  email       TEXT,
  cuerpo      TEXT NOT NULL,
  estado      TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aprobado','spam')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---- Log de envíos fallidos (no perder leads, Módulo 12) ----
CREATE TABLE IF NOT EXISTS submission_errors (
  id          SERIAL PRIMARY KEY,
  payload     JSONB,
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---- Sesiones del panel (login httpOnly, Módulo A) ----
-- Se guarda el HASH del token, nunca el token en claro.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- ---- Configuración global (tokens de tipografía, etc. — Módulo F) ----
CREATE TABLE IF NOT EXISTS settings (
  clave TEXT PRIMARY KEY,
  valor TEXT
);

-- ---- Imágenes subidas desde el editor (persisten en Postgres/volumen) ----
CREATE TABLE IF NOT EXISTS uploads (
  id         SERIAL PRIMARY KEY,
  filename   TEXT,
  mime       TEXT NOT NULL,
  bytes      BYTEA NOT NULL,
  size       INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Migraciones idempotentes (para una BD creada con un schema previo).
-- Seguras de correr en cada arranque.
-- ============================================================
ALTER TABLE articles ADD COLUMN IF NOT EXISTS imagen_caption TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
-- Idioma del lead (bilingüe ES/EN): para saber en qué idioma responder.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS idioma TEXT DEFAULT 'es';
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_estado_check;
ALTER TABLE articles ADD CONSTRAINT articles_estado_check
  CHECK (estado IN ('borrador','publicado','eliminado'));
