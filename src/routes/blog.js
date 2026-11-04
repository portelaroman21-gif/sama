/* Rutas del blog (Módulo 8/9).
   El HTML del artículo se renderiza en el SERVIDOR (no por JS) por SEO.
   STUB inicial. */
import { Router } from "express";
// import { query } from "../config/db.js";

const router = Router();

// GET /api/blog — listado de artículos publicados (para la grilla)
router.get("/", async (_req, res) => {
  // TODO Fase 3: SELECT articles WHERE estado='publicado' ORDER BY publicado_at DESC
  res.json({ ok: true, articles: [], todo: "implementar en Fase 3 (Módulo 8)" });
});

// GET /api/blog/:slug — artículo individual
router.get("/:slug", async (req, res) => {
  // TODO Fase 3: SELECT por slug; 404 si no existe o es borrador.
  res.status(501).json({ ok: false, slug: req.params.slug, todo: "implementar en Fase 3" });
});

export default router;
