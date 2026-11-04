/* ============================================================
   Mensajes de WhatsApp precargados, centralizados (Módulo 11).
   Cada página usa un mensaje distinto. Número oficial único.
   Uso: <a data-wa="home"> ... </a>  → se completa solo al cargar.
   ============================================================ */

window.SAMA_WHATSAPP = {
  numero: "5233146659 08".replace(/\s/g, ""), // +52 33 1466 5908
  mensajes: {
    home:        "Hola Sama, vengo desde la web y quiero más información sobre el corredor China–Manzanillo–Bajío.",
    corredor:    "Hola Sama, me interesa conocer cómo operan el corredor China–Manzanillo–Bajío.",
    servicios:   "Hola Sama, quiero información sobre sus servicios de freight forwarding.",
    diagnostico: "Hola Sama, quiero agendar un diagnóstico logístico de mi operación.",
    contacto:    "Hola Sama, tengo una consulta puntual sobre importación desde China.",
    casos:       "Hola Sama, vi sus casos y quiero hablar sobre mi operación."
  }
};

document.addEventListener("DOMContentLoaded", function () {
  var cfg = window.SAMA_WHATSAPP;
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var key = el.getAttribute("data-wa");
    var msg = cfg.mensajes[key] || cfg.mensajes.home;
    el.setAttribute("href", "https://wa.me/" + cfg.numero + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
    // Hook de medición (se conecta al tracking en Módulo 13)
    el.addEventListener("click", function () {
      if (window.dataLayer) window.dataLayer.push({ event: "whatsapp_click", page: key });
    });
  });
});
