/* ============================================================
   Sanitizador del HTML del editor (Quill) — allowlist.
   El contenido lo escribe el admin (confiable), pero igual se limpia:
   - se descartan tags fuera de la lista (se conserva el texto),
   - se quitan atributos no permitidos, on* y javascript:/data:,
   - los <iframe> solo se aceptan de YouTube/Vimeo (video embed).
   Mantiene el HTML limpio y semántico para el SEO del artículo.
   ============================================================ */
const ALLOWED = {
  p: [], br: [], strong: [], b: [], em: [], i: [], u: [], s: [],
  h2: [], h3: [], blockquote: [],
  ul: [], ol: [], li: [],
  a: ["href", "target", "rel"],
  figure: ["class"], figcaption: [],
  img: ["src", "alt", "width", "height", "loading"],
  iframe: ["src", "width", "height", "allow", "allowfullscreen", "loading", "title", "frameborder"],
  hr: [],
};
const VOID = new Set(["br", "img", "hr"]);
const IFRAME_HOSTS = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

function safeUrl(url) {
  const u = String(url || "").trim();
  if (!u) return "";
  if (/^(javascript|data|vbscript):/i.test(u)) return "";
  // Rechaza protocol-relative (//host) y /\host (los navegadores lo normalizan a //host).
  if (/^\/[/\\]/.test(u)) return "";
  if (u.startsWith("/") || u.startsWith("#")) return u; // relativa / ancla
  if (/^https?:\/\//i.test(u) || /^mailto:/i.test(u)) return u;
  return "";
}

function parseAttrs(str) {
  const attrs = {};
  const re = /([a-zA-Z0-9:_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(str))) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? "";
  }
  return attrs;
}

const escAttr = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sanitizeHtml(input) {
  let html = String(input || "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, "");

  return html.replace(
    /<(\/?)([a-zA-Z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/g,
    (_full, slash, rawTag, rawAttrs) => {
      const tag = rawTag.toLowerCase();
      if (!(tag in ALLOWED)) return ""; // markup no permitido → fuera (se conserva el texto)
      if (slash) return VOID.has(tag) ? "" : `</${tag}>`;

      const attrs = parseAttrs(rawAttrs || "");
      const parts = [];
      for (const name of ALLOWED[tag]) {
        if (!(name in attrs)) continue;
        let val = attrs[name];
        if (name === "src") {
          if (tag === "iframe") {
            if (!IFRAME_HOSTS.test(val)) return ""; // iframe de host no permitido → fuera
          } else {
            val = safeUrl(val);
            if (!val) continue;
          }
        } else if (name === "href") {
          val = safeUrl(val);
          if (!val) continue;
        }
        parts.push(`${name}="${escAttr(val)}"`);
      }
      // Endurecer defaults
      if (tag === "a") {
        if (!parts.some((p) => p.startsWith("rel="))) parts.push('rel="noopener"');
      }
      if ((tag === "img" || tag === "iframe") && !parts.some((p) => p.startsWith("loading="))) {
        parts.push('loading="lazy"');
      }
      const open = `<${tag}${parts.length ? " " + parts.join(" ") : ""}>`;
      // iframe necesita cierre explícito aunque venga self-closing
      return tag === "iframe" ? open + "</iframe>" : open;
    }
  ).replace(/<\/iframe>\s*<\/iframe>/gi, "</iframe>"); // evita cierres duplicados
}
