/* Include liviano de partials — SOLO etapa wireframe.
   En producción, header/footer se inyectan en build/SSR (contenido en HTML inicial).
   Uso: <div data-include="/partials/header.html"></div>  */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-include]").forEach(function (el) {
    fetch(el.getAttribute("data-include"))
      .then(function (r) { return r.text(); })
      .then(function (html) {
        el.outerHTML = html;
        // re-inicializa WhatsApp tras inyectar el footer
        if (window.SAMA_WHATSAPP) document.dispatchEvent(new Event("partials:loaded"));
      })
      .catch(function () {});
  });
});
