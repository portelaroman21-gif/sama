/* ============================================================
   Mapa del Corredor (Módulo 2) — COMPONENTE ESTRELLA.
   SVG dibujado + CSS + JS nativo. NO es Google Maps.

   Estética "tablero de operaciones": tramo marítimo (onda) y
   tramo terrestre (línea) diferenciados, íconos por etapa,
   nodos numerados 01–05.

   - Escritorio: hover/foco muestra el detalle. Touch: tap abre
     panel DEBAJO del mapa (no globito flotante).
   - Teclado: nodos focusables, Enter/Espacio y flechas ←/→.
   - Animación de "dibujado" izq→der UNA sola vez, al entrar en
     pantalla (IntersectionObserver). Respeta prefers-reduced-motion.
   - Textos también en el HTML (lista .cm-seo, oculta) para Google.

   Uso:  <div data-corridor-map data-variant="compact|full|static"></div>
   ============================================================ */
(function () {
  var W = 1100, H = 220, PAD = 110, BASE_Y = 110;

  // Íconos SVG dibujados a medida (no librería). 24x24, currentColor.
  var ICONS = {
    origen:  '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-5h6v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    mar:     '<path d="M3 18c1.5 0 1.5 1.2 3 1.2S7.5 18 9 18s1.5 1.2 3 1.2S13.5 18 15 18M5 15l1-7 6 2 6-3-1 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
    puerto:  '<path d="M12 3v18M8 7h8M5 12a7 7 0 0 0 14 0M5 12H3m16 0h2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    tierra:  '<path d="M1 16h13v-5h3l3 3v2h2M3 16a2 2 0 1 0 4 0M16 16a2 2 0 1 0 4 0M1 11h10M1 8h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
    destino: '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/>'
  };

  function nodeX(i, n) { return PAD + ((W - PAD * 2) / (n - 1)) * i; }

  // Genera el path del tramo entre dos puntos. El marítimo va con onda.
  function segPath(x1, x2, maritimo) {
    if (!maritimo) return "M" + x1 + " " + BASE_Y + " L" + x2 + " " + BASE_Y;
    var mid = (x1 + x2) / 2, q = (x2 - x1) / 4, a = 14;
    return "M" + x1 + " " + BASE_Y +
           " C" + (x1 + q) + " " + (BASE_Y - a) + " " + (mid - q) + " " + (BASE_Y + a) + " " + mid + " " + BASE_Y +
           " C" + (mid + q) + " " + (BASE_Y - a) + " " + (x2 - q) + " " + (BASE_Y + a) + " " + x2 + " " + BASE_Y;
  }

  function build(container) {
    var data = window.SAMA_WAYPOINTS || [];
    if (!data.length) return;
    var variant = container.getAttribute("data-variant") || "full";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var n = data.length;

    // Segmentos (líneas entre nodos). El tramo 01→02→03 es marítimo.
    var segs = "";
    for (var i = 0; i < n - 1; i++) {
      var maritimo = data[i + 1].tramo === "mar" || data[i + 1].tramo === "puerto";
      segs += '<path class="cm-seg ' + (maritimo ? "cm-seg--mar" : "cm-seg--tierra") +
              '" d="' + segPath(nodeX(i, n), nodeX(i + 1, n), maritimo) + '"></path>';
    }

    // Nodos
    var nodes = "";
    data.forEach(function (wp, i) {
      var cx = nodeX(i, n);
      nodes +=
        '<g class="cm-node" tabindex="0" role="button" data-idx="' + i + '"' +
        ' aria-label="Punto ' + wp.n + ': ' + wp.titulo + '">' +
        '<circle class="cm-halo" cx="' + cx + '" cy="' + BASE_Y + '" r="34"></circle>' +
        '<circle class="cm-dot" cx="' + cx + '" cy="' + BASE_Y + '" r="26"></circle>' +
        '<g class="cm-ico" transform="translate(' + (cx - 12) + ',' + (BASE_Y - 12) + ')">' + ICONS[wp.tramo] + '</g>' +
        '<text class="cm-num" x="' + cx + '" y="' + (BASE_Y - 44) + '" text-anchor="middle">' + wp.n + '</text>' +
        '<text class="cm-label" x="' + cx + '" y="' + (BASE_Y + 58) + '" text-anchor="middle">' + wp.titulo + '</text>' +
        '</g>';
    });

    var svg =
      '<svg class="cm-svg' + (reduce ? "" : " cm-anim") + '" viewBox="0 0 ' + W + ' ' + H + '"' +
      ' role="img" aria-label="Mapa del corredor China–Manzanillo–Bajío">' +
        '<defs>' +
          '<linearGradient id="cmGrad" x1="0" y1="0" x2="1" y2="0">' +
            '<stop class="cm-grad-a" offset="0"/>' +
            '<stop class="cm-grad-b" offset="1"/>' +
          '</linearGradient>' +
        '</defs>' +
        segs + nodes +
      '</svg>';

    var panel = '<div class="cm-panel" aria-live="polite"></div>';

    // Contenido SIEMPRE en el HTML para SEO (oculto visualmente)
    var seo = '<ul class="cm-seo">' + data.map(function (wp) {
      return "<li><strong>" + wp.n + " — " + wp.titulo + ":</strong> " + wp.texto +
             (wp.detalle ? " " + wp.detalle : "") + "</li>";
    }).join("") + "</ul>";

    container.innerHTML = svg + panel + seo;
    container.classList.add("cm", "cm--" + variant);

    var panelEl = container.querySelector(".cm-panel");
    var nodeEls = container.querySelectorAll(".cm-node");

    function show(i) {
      var wp = data[i];
      panelEl.innerHTML =
        '<span class="cm-panel-num">' + wp.n + '</span>' +
        '<div class="cm-panel-body"><strong>' + wp.titulo + '</strong>' +
        '<p>' + wp.texto + '</p>' +
        (wp.detalle ? '<p class="cm-panel-detail">' + wp.detalle + '</p>' : '') + '</div>';
      nodeEls.forEach(function (el) { el.classList.remove("is-active"); });
      nodeEls[i].classList.add("is-active");
    }

    nodeEls.forEach(function (node) {
      var idx = +node.getAttribute("data-idx");
      node.addEventListener("mouseenter", function () { show(idx); });
      node.addEventListener("click", function () { show(idx); });
      node.addEventListener("focus", function () { show(idx); });
      node.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(idx); }
        if (e.key === "ArrowRight" && nodeEls[idx + 1]) nodeEls[idx + 1].focus();
        if (e.key === "ArrowLeft" && nodeEls[idx - 1]) nodeEls[idx - 1].focus();
      });
    });

    // Estado inicial: nodo resaltado (data-highlight="03") o el primero.
    var highlight = container.getAttribute("data-highlight");
    var initial = 0;
    if (highlight) {
      for (var k = 0; k < data.length; k++) {
        if (data[k].n === highlight) { initial = k; break; }
      }
    }
    show(initial);

    // Animación de dibujado, una sola vez, al entrar en pantalla.
    var svgEl = container.querySelector(".cm-svg");
    if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { svgEl.classList.add("is-drawn"); io.disconnect(); }
        });
      }, { threshold: 0.35 });
      io.observe(svgEl);
    } else {
      svgEl.classList.add("is-drawn");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-corridor-map]").forEach(build);
  });
})();
