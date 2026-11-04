/* Helpers de UI del panel (compartidos entre rutas). */
export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const stripTags = (html = "") =>
  String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export function fmt(d) {
  if (!d) return "—";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(d));
  } catch {
    return "—";
  }
}

export function badge(estado) {
  const map = {
    publicado: ["Publicado", "adm-badge--pub"],
    borrador: ["Borrador", "adm-badge--bor"],
    eliminado: ["Eliminado", "adm-badge--del"],
  };
  const [label, cls] = map[estado] || [estado, ""];
  return `<span class="adm-badge ${cls}">${esc(label)}</span>`;
}

// Shell del panel (sidebar + contenido). `head` permite sumar CSS/JS por página.
export function adminLayout({ title, active = "articulos", user, body, head = "" }) {
  const item = (key, label, href) =>
    `<a class="adm-navlink${active === key ? " is-active" : ""}" href="${href}">${label}</a>`;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${esc(title)} · Panel SAMA</title>
  <link rel="stylesheet" href="/assets/css/admin.css">
  ${head}
</head>
<body class="adm">
  <aside class="adm-side">
    <div class="adm-brand"><a href="/admin/"><img src="/assets/img/logo-color.png" alt="SAMA Forwarding" width="120" height="42"></a></div>
    <nav class="adm-nav">
      ${item("articulos", "Artículos", "/admin/")}
      ${item("categorias", "Categorías", "/admin/categorias")}
      ${item("config", "Configuración", "/admin/configuracion")}
    </nav>
    <div class="adm-user">
      <span>${esc(user?.email || "")}</span>
      <form method="post" action="/admin/logout"><button type="submit" class="adm-logout">Cerrar sesión</button></form>
    </div>
  </aside>
  <main class="adm-main">
    ${body}
  </main>
  <script>document.addEventListener("click",function(e){var t=e.target.closest("[data-confirm]");if(t&&!confirm(t.getAttribute("data-confirm")))e.preventDefault();});</script>
</body>
</html>`;
}
