/* ============================================================
   Mapa interactivo del corredor — interactividad nativa.
   El texto de cada etapa sale en una MINI-CARD al lado del punto
   (no en un panel debajo del mapa). Disparadores: insignias 01-05,
   tabs debajo, ciudades de China/Bajío y callout marítimo.
   Datos embebidos en JSON (script[data-mapa-data]).
   ============================================================ */
(function () {
  function initMapa(root) {
    var dataEl = root.querySelector("[data-mapa-data]");
    if (!dataEl) return;
    var etapas;
    try { etapas = JSON.parse(dataEl.textContent); } catch (e) { return; }

    var tabs = root.querySelectorAll(".mc-tab");
    var badges = root.querySelectorAll(".mc-badge");
    var minicards = root.querySelectorAll(".mc-minicard");

    function closeMinis(except) {
      minicards.forEach(function (m) { if (m !== except) m.classList.remove("is-open"); });
    }

    function selectStage(i, openMini) {
      tabs.forEach(function (t) { t.classList.toggle("is-active", +t.getAttribute("data-stage") === i); });
      badges.forEach(function (b) { b.classList.toggle("is-sel", +b.getAttribute("data-stage") === i); });
      if (openMini) {
        var card = root.querySelector('.mc-minicard[data-mini="' + i + '"]');
        var willOpen = card && !card.classList.contains("is-open");
        closeMinis(willOpen ? card : null);
        if (card) card.classList.toggle("is-open", willOpen);
      } else {
        closeMinis(null);
      }
    }

    // Cualquier elemento con data-stage abre su mini-card al lado del punto.
    root.addEventListener("click", function (ev) {
      var el = ev.target.closest("[data-stage]");
      if (!el || !root.contains(el)) return;
      var i = parseInt(el.getAttribute("data-stage"), 10);
      if (!isNaN(i)) selectStage(i, true);
    });

    // Cerrar al hacer click fuera del mapa o con Escape.
    document.addEventListener("click", function (ev) {
      if (!root.contains(ev.target)) closeMinis(null);
    });
    root.addEventListener("keydown", function (ev) { if (ev.key === "Escape") closeMinis(null); });

    // Respeta prefers-reduced-motion: pausa SMIL (barco/camión).
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var svg = root.querySelector(".mc-routes");
      if (svg && svg.pauseAnimations) { try { svg.pauseAnimations(); } catch (e) {} }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-mapa-corredor]").forEach(initMapa);
  });
})();
