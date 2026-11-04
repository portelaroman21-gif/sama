/* Genera slugs SEO: minúsculas, sin acentos, con guiones (Módulo H). */
export function slugify(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos (marcas combinantes)
    .replace(/[–—/|]+/g, " ") // guiones largos y barras → espacio (no pegar palabras)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
