/* ============================================================
   site.js — interacciones globales (Bloque 2).
   - Menú hamburguesa (móvil)
   - Dropdown de Servicios accesible por teclado
   - Año del copyright automático
   - WhatsApp: ya viene resuelto desde el server (links inline)
   Sin dependencias.
   ============================================================ */
(function () {
  // Año automático
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Menú móvil
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.classList.toggle("nav-open", open);
    });
    // Cerrar al navegar
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Dropdown accesible: toggle de aria-expanded con foco
  document.querySelectorAll(".has-sub > a").forEach(function (a) {
    a.addEventListener("focus", function () { a.setAttribute("aria-expanded", "true"); });
    a.closest(".has-sub").addEventListener("focusout", function (e) {
      if (!e.currentTarget.contains(e.relatedTarget)) a.setAttribute("aria-expanded", "false");
    });
  });
})();

/* ============================================================
   Interacciones de copy textual (F): contador, reveal, filtro casos.
   ============================================================ */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Contador animado (sube a data-count) al entrar en viewport, una vez.
  function animarContador(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce) { el.textContent = String(target); return; }
    var dur = 1100, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = String(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Observer genérico para contador + reveal.
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      if (el.hasAttribute("data-count")) animarContador(el);
      if (el.hasAttribute("data-reveal")) el.classList.add("is-revealed");
      io.unobserve(el);
    });
  }, { threshold: 0.3 }) : null;

  document.querySelectorAll("[data-count], [data-reveal]").forEach(function (el) {
    if (io) io.observe(el);
    else { if (el.hasAttribute("data-count")) el.textContent = el.getAttribute("data-count"); el.classList.add("is-revealed"); }
  });

  // Guard: el contador NUNCA debe quedar en 0. Si a los 3s no llegó al
  // target (observer no disparó, etc.), se fuerza el valor final.
  setTimeout(function () {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var t = el.getAttribute("data-count");
      if (el.textContent.trim() !== t) el.textContent = t;
    });
  }, 3000);

  // Fallback de autoplay del video de hero (iOS suele ignorar el atributo).
  function forzarVideo() {
    document.querySelectorAll("video.hero-media").forEach(function (v) {
      v.muted = true;
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
    });
  }
  forzarVideo();
  // Reintento tras el primer toque/scroll (iOS a veces requiere gesto).
  ["touchstart", "scroll", "click"].forEach(function (ev) {
    window.addEventListener(ev, forzarVideo, { once: true, passive: true });
  });

  // Filtro de casos por categoría (pills, sin recarga).
  var filtro = document.querySelector("[data-caso-filtro]");
  var grid = document.querySelector("[data-caso-grid]");
  var vacio = document.querySelector("[data-caso-empty]");
  if (filtro && grid) {
    filtro.addEventListener("click", function (e) {
      var btn = e.target.closest(".pill");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      filtro.querySelectorAll(".pill").forEach(function (p) { p.classList.toggle("is-active", p === btn); });
      var visibles = 0;
      grid.querySelectorAll(".caso-card").forEach(function (card) {
        var match = f === "todos" || card.getAttribute("data-categoria") === f;
        card.classList.toggle("is-hidden", !match);
        if (match) visibles++;
      });
      if (vacio) vacio.hidden = visibles > 0;
    });
  }
})();

/* Flip cards en touch: click alterna .is-flipped (en desktop ya flipean por hover). */
(function () {
  document.addEventListener("click", function (e) {
    var f = e.target.closest("[data-flip]");
    if (f) f.classList.toggle("is-flipped");
  });
})();

/* Envío de formularios de leads (contacto / diagnóstico) por fetch al backend.
   Si no hay JS, el form hace un POST normal y el server redirige a /gracias/. */
(function () {
  var forms = document.querySelectorAll("[data-lead-form]");
  if (!forms.length) return;
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof form.reportValidity === "function" && !form.reportValidity()) return;
      var errBox = form.querySelector("[data-form-error]");
      var btn = form.querySelector('button[type="submit"]');
      var btnTxt = btn ? btn.textContent : "";
      if (errBox) { errBox.hidden = true; errBox.textContent = ""; }
      if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }
      var gracias = form.getAttribute("data-gracias") || "/";
      fetch(form.action, {
        method: "POST",
        headers: { "X-Requested-With": "fetch" },
        body: new URLSearchParams(new FormData(form)),
      })
        .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }); })
        .then(function (data) {
          if (data && data.ok) { window.location.href = data.redirect || gracias; return; }
          throw new Error((data && data.error) || "No pudimos enviar el formulario.");
        })
        .catch(function (err) {
          if (errBox) { errBox.textContent = err.message + " Si el problema persiste, escribinos por WhatsApp."; errBox.hidden = false; }
          if (btn) { btn.disabled = false; btn.textContent = btnTxt; }
        });
    });
  });
})();
