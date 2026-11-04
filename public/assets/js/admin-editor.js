/* ============================================================
   Editor de artículos (cliente) — Quill 2 + blots propios.
   - Encabezados H2/H3, negrita, cursiva, subrayado, listas, cita, link.
   - Imagen (URL + ALT obligatorio + caption), Video (embed YouTube/Vimeo),
     Separador (hr). Cada uno genera su HTML semántico real.
   - Autogenera el slug del título; sincroniza el HTML al enviar; exige ALT
     en la imagen destacada antes de publicar.
   ============================================================ */
(function () {
  if (typeof Quill === "undefined") return;
  var BlockEmbed = Quill.import("blots/block/embed");

  // ---- Imagen como <figure class="rt-img"><img alt><figcaption> ----
  function ImageFigure() {}
  ImageFigure = class extends BlockEmbed {
    static create(v) {
      var node = super.create();
      node.setAttribute("class", "rt-img");
      var img = document.createElement("img");
      img.setAttribute("src", (v && v.src) || "");
      img.setAttribute("alt", (v && v.alt) || "");
      img.setAttribute("loading", "lazy");
      node.appendChild(img);
      if (v && v.caption) {
        var fc = document.createElement("figcaption");
        fc.textContent = v.caption;
        node.appendChild(fc);
      }
      return node;
    }
    static value(node) {
      var img = node.querySelector("img");
      var fc = node.querySelector("figcaption");
      return {
        src: img ? img.getAttribute("src") : "",
        alt: img ? img.getAttribute("alt") : "",
        caption: fc ? fc.textContent : "",
      };
    }
  };
  ImageFigure.blotName = "imgfig";
  ImageFigure.tagName = "FIGURE";
  ImageFigure.className = "rt-img";

  // ---- Video como <figure class="rt-video"><iframe> ----
  var VideoFigure = class extends BlockEmbed {
    static create(v) {
      var node = super.create();
      node.setAttribute("class", "rt-video");
      var ifr = document.createElement("iframe");
      ifr.setAttribute("src", typeof v === "string" ? v : (v && v.src) || "");
      ifr.setAttribute("frameborder", "0");
      ifr.setAttribute("allowfullscreen", "");
      ifr.setAttribute("loading", "lazy");
      ifr.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      node.appendChild(ifr);
      return node;
    }
    static value(node) {
      var i = node.querySelector("iframe");
      return { src: i ? i.getAttribute("src") : "" };
    }
  };
  VideoFigure.blotName = "vidfig";
  VideoFigure.tagName = "FIGURE";
  VideoFigure.className = "rt-video";

  // ---- Separador <hr> ----
  var HrBlot = class extends BlockEmbed {};
  HrBlot.blotName = "hr";
  HrBlot.tagName = "HR";

  Quill.register(ImageFigure, true);
  Quill.register(VideoFigure, true);
  Quill.register(HrBlot, true);

  var icons = Quill.import("ui/icons");
  icons["hr"] = '<svg viewbox="0 0 18 18"><line class="ql-stroke" x1="3" y1="9" x2="15" y2="9"></line></svg>';

  // ---- Modal propio (reemplaza el prompt() nativo del navegador) ----
  // Devuelve una promesa con {campos} o null si se cancela. Valida requeridos.
  function openModal(opts) {
    return new Promise(function (resolve) {
      var overlay = document.createElement("div");
      overlay.className = "adm-modal";
      var card = document.createElement("div");
      card.className = "adm-modal-card";
      var h = document.createElement("h3");
      h.textContent = opts.title;
      card.appendChild(h);

      var inputs = {};
      (opts.fields || []).forEach(function (f) {
        var lab = document.createElement("label");
        lab.className = "adm-modal-field";
        lab.appendChild(document.createTextNode(f.label + (f.required ? " *" : "")));
        var input = document.createElement("input");
        if (f.type === "file") {
          input.type = "file";
          input.accept = "image/*";
        } else {
          input.type = "text";
          input.value = f.value || "";
          if (f.placeholder) input.placeholder = f.placeholder;
        }
        lab.appendChild(input);
        if (f.hint) {
          var hint = document.createElement("span");
          hint.className = "adm-modal-hint";
          hint.textContent = f.hint;
          lab.appendChild(hint);
        }
        card.appendChild(lab);
        inputs[f.name] = input;
      });

      var err = document.createElement("p");
      err.className = "adm-modal-err";
      err.style.display = "none";
      card.appendChild(err);

      var actions = document.createElement("div");
      actions.className = "adm-modal-actions";
      var cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "adm-btn";
      cancel.textContent = "Cancelar";
      var ok = document.createElement("button");
      ok.type = "button";
      ok.className = "adm-btn adm-btn--primary";
      ok.textContent = opts.okLabel || "Insertar";
      actions.appendChild(cancel);
      actions.appendChild(ok);
      card.appendChild(actions);

      overlay.appendChild(card);
      document.body.appendChild(overlay);
      var firstField = (opts.fields || [])[0];
      if (firstField) inputs[firstField.name].focus();

      function close(val) {
        document.removeEventListener("keydown", onKey);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        resolve(val);
      }
      function submit() {
        var out = {};
        var flds = opts.fields || [];
        for (var i = 0; i < flds.length; i++) {
          var f = flds[i];
          if (f.type === "file") {
            out[f.name] = inputs[f.name].files && inputs[f.name].files[0] ? inputs[f.name].files[0] : null;
            if (f.required && !out[f.name]) { err.textContent = "Elegí un archivo: " + f.label; err.style.display = "block"; return; }
            continue;
          }
          var val = inputs[f.name].value.trim();
          if (f.required && !val) {
            err.textContent = "Completá: " + f.label;
            err.style.display = "block";
            inputs[f.name].focus();
            return;
          }
          if (f.validate) {
            var msg = f.validate(val);
            if (msg) { err.textContent = msg; err.style.display = "block"; inputs[f.name].focus(); return; }
          }
          out[f.name] = val;
        }
        // onSubmit async (p. ej. subir la imagen antes de cerrar el modal).
        if (opts.onSubmit) {
          err.style.display = "none";
          ok.disabled = true;
          var okTxt = ok.textContent;
          ok.textContent = "Procesando…";
          Promise.resolve().then(function () { return opts.onSubmit(out); })
            .then(function (result) { close(result); })
            .catch(function (e) {
              err.textContent = (e && e.message) || "Error";
              err.style.display = "block";
              ok.disabled = false;
              ok.textContent = okTxt;
            });
          return;
        }
        close(out);
      }
      ok.addEventListener("click", submit);
      cancel.addEventListener("click", function () { close(null); });
      overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(null); });
      function onKey(e) {
        if (e.key === "Escape") close(null);
        else if (e.key === "Enter") { e.preventDefault(); submit(); }
      }
      document.addEventListener("keydown", onKey);
    });
  }

  // Sube una imagen (base64) al panel y devuelve su URL /uploads/:id.
  function uploadImage(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0) { reject(new Error("El archivo debe ser una imagen.")); return; }
      if (file.size > 6 * 1024 * 1024) { reject(new Error("La imagen supera 6 MB. Reducila e intentá de nuevo.")); return; }
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error("No se pudo leer el archivo.")); };
      reader.onload = function () {
        var data = String(reader.result).split(",")[1];
        fetch("/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
          body: JSON.stringify({ filename: file.name, mime: file.type, data: data }),
        })
          .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.url) throw new Error(j.error || "No se pudo subir la imagen."); return j.url; }); })
          .then(resolve)
          .catch(function () { reject(new Error("No se pudo subir la imagen. Probá de nuevo.")); });
      };
      reader.readAsDataURL(file);
    });
  }

  // ---- Handlers de la toolbar ----
  function imageHandler() {
    var quill = this.quill;
    var range = quill.getSelection(true);
    openModal({
      title: "Insertar imagen",
      okLabel: "Insertar imagen",
      fields: [
        { name: "file", label: "Subir imagen desde tu equipo", type: "file" },
        { name: "src", label: "… o pegar una URL", placeholder: "https://… o /assets/img/…" },
        { name: "alt", label: "Texto ALT (obligatorio para SEO)", required: true, placeholder: "Describí la imagen" },
        { name: "caption", label: "Pie de foto (opcional)", placeholder: "Texto debajo de la imagen" },
      ],
      onSubmit: function (v) {
        var p = v.file ? uploadImage(v.file) : Promise.resolve((v.src || "").trim());
        return p.then(function (url) {
          if (!url) throw new Error("Subí una imagen o pegá una URL.");
          return { src: url, alt: v.alt, caption: v.caption || "" };
        });
      },
    }).then(function (v) {
      if (!v) return;
      quill.insertEmbed(range.index, "imgfig", { src: v.src, alt: v.alt, caption: v.caption }, Quill.sources.USER);
      quill.setSelection(range.index + 1, Quill.sources.SILENT);
    });
  }

  function toEmbed(url) {
    var m;
    if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/))) return "https://www.youtube.com/embed/" + m[1];
    if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return "https://player.vimeo.com/video/" + m[1];
    if (/youtube\.com\/embed\/|player\.vimeo\.com\/video\//.test(url)) return url;
    return null;
  }
  function videoHandler() {
    var quill = this.quill;
    var range = quill.getSelection(true);
    openModal({
      title: "Insertar video",
      okLabel: "Insertar video",
      fields: [
        {
          name: "url",
          label: "Link de YouTube o Vimeo",
          required: true,
          placeholder: "https://www.youtube.com/watch?v=…",
          validate: function (val) { return toEmbed(val) ? "" : "Solo se aceptan links de YouTube o Vimeo."; },
        },
      ],
    }).then(function (v) {
      if (!v) return;
      quill.insertEmbed(range.index, "vidfig", { src: toEmbed(v.url) }, Quill.sources.USER);
      quill.setSelection(range.index + 1, Quill.sources.SILENT);
    });
  }

  function hrHandler() {
    var range = this.quill.getSelection(true);
    this.quill.insertEmbed(range.index, "hr", true, Quill.sources.USER);
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
  }

  // ---- Init ----
  var mount = document.getElementById("editor");
  if (!mount) return;
  var quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Escribí el contenido del artículo…",
    modules: {
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link"],
          ["image", "video", "hr"],
        ],
        handlers: { image: imageHandler, video: videoHandler, hr: hrHandler },
      },
    },
  });

  // Carga el contenido existente (edición)
  var tpl = document.querySelector("[data-contenido-inicial]");
  var initialHtml = tpl ? (tpl.innerHTML || "").trim() : "";
  if (initialHtml) {
    quill.clipboard.dangerouslyPasteHTML(initialHtml, "silent");
  }

  // ---- Slug automático desde el título ----
  function slugify(s) {
    return String(s || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[–—/|]+/g, " ")
      .toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim()
      .replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  }
  var titulo = document.querySelector("[data-titulo]");
  var slug = document.querySelector("[data-slug]");
  if (titulo && slug) {
    var slugTouched = slug.value.trim() !== "";
    slug.addEventListener("input", function () { slugTouched = true; });
    slug.addEventListener("blur", function () { slug.value = slugify(slug.value); });
    titulo.addEventListener("input", function () {
      if (!slugTouched) slug.value = slugify(titulo.value);
    });
  }

  // ---- Subir la imagen destacada desde el equipo ----
  var imgDest = document.querySelector("[name=imagen_destacada]");
  if (imgDest) {
    var upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "adm-btn adm-upload-btn";
    upBtn.textContent = "📁 Subir imagen";
    var fileIn = document.createElement("input");
    fileIn.type = "file";
    fileIn.accept = "image/*";
    fileIn.style.display = "none";
    imgDest.insertAdjacentElement("afterend", upBtn);
    upBtn.insertAdjacentElement("afterend", fileIn);
    upBtn.addEventListener("click", function () { fileIn.click(); });
    fileIn.addEventListener("change", function () {
      if (!fileIn.files || !fileIn.files[0]) return;
      var prev = upBtn.textContent;
      upBtn.disabled = true;
      upBtn.textContent = "Subiendo…";
      uploadImage(fileIn.files[0]).then(function (url) {
        imgDest.value = url;
        upBtn.textContent = "✓ Imagen subida";
        setTimeout(function () { upBtn.textContent = prev; upBtn.disabled = false; }, 1800);
      }).catch(function (e) {
        alert(e.message || "No se pudo subir la imagen.");
        upBtn.textContent = prev;
        upBtn.disabled = false;
      });
      fileIn.value = "";
    });
  }

  // ---- Sincroniza HTML + valida al enviar ----
  var form = document.querySelector("[data-editor]");
  var hidden = document.querySelector("[data-contenido]");
  if (form && hidden) {
    form.addEventListener("submit", function (e) {
      hidden.value = quill.root.innerHTML;
      var btn = e.submitter;
      if (btn && btn.value === "publicar") {
        var img = form.querySelector("[name=imagen_destacada]");
        var alt = form.querySelector("[name=imagen_alt]");
        if (img && img.value.trim() && alt && !alt.value.trim()) {
          e.preventDefault();
          alert("La imagen destacada necesita texto ALT antes de publicar.");
        }
      }
    });
  }
})();
