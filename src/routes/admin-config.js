/* ============================================================
   Configuración (Módulo F).
   - Cambio de clave del panel (pide la actual, guarda hasheada).
   - Tipografía global por TOKENS CSS: familia/tamaño de encabezados,
     párrafos y descripciones. Se aplica a TODO el blog (nuevos y
     existentes) porque el HTML de los artículos no tiene estilos inline.
   ============================================================ */
import { Router } from "express";
import { query } from "../config/db.js";
import { verifyPassword, hashPassword, createSession } from "../cms/auth.js";
import { adminLayout, esc } from "../cms/admin-ui.js";
import { getSettings, setSetting, TIPO_KEYS, FONT_OPTIONS } from "../cms/settings.js";
import { mailerInfo, verifyMailer, sendMail } from "../mailer.js";

const router = Router();

function fontSelect(name, current) {
  const opts = FONT_OPTIONS.map(
    (o) => `<option value="${esc(o.value)}"${o.value === (current || "") ? " selected" : ""}>${esc(o.label)}</option>`
  ).join("");
  return `<select name="${name}">${opts}</select>`;
}

function mailPanel(mail) {
  const info = mailerInfo();
  const estado = info.configured
    ? '<span style="color:#1a7f43;font-weight:700">configurado ✓</span>'
    : '<span style="color:#b23b3b;font-weight:700">SIN configurar</span>';
  return `
      <form class="adm-panel" method="post" action="/admin/configuracion/mail-test">
        <h2>Envío de mails (formularios)</h2>
        ${mail?.ok ? `<div class="adm-ok">${esc(mail.ok)}</div>` : ""}
        ${mail?.error ? `<div class="adm-error">${esc(mail.error)}</div>` : ""}
        <p class="adm-hint">
          SMTP: ${estado}<br>
          Host: <strong>${esc(info.host)}:${info.port}</strong><br>
          Usuario: <strong>${esc(info.user)}</strong><br>
          Remitente (From): <strong>${esc(info.from)}</strong><br>
          Destino de leads (MAIL_TO): <strong>${esc(info.to)}</strong>
        </p>
        <label class="adm-field">Enviar prueba a <span class="adm-req">(vacío = MAIL_TO)</span>
          <input type="email" name="to" placeholder="tu-mail@ejemplo.com">
        </label>
        <div class="adm-editor-actions">
          <button type="submit" class="adm-btn adm-btn--primary"${info.configured ? "" : " disabled"}>Enviar mail de prueba</button>
        </div>
        ${info.configured ? "" : `<p class="adm-hint">Cargá las variables SMTP_* en Railway y recargá esta página.</p>`}
      </form>`;
}

function page({ user, tipo = {}, error = "", ok = "", mail = null }) {
  const body = `
    <header class="adm-head"><h1>Configuración</h1></header>
    ${error ? `<div class="adm-error">${esc(error)}</div>` : ""}
    ${ok ? `<div class="adm-ok">${esc(ok)}</div>` : ""}
    <div class="adm-config-grid">
      ${mailPanel(mail)}
      <form class="adm-panel" method="post" action="/admin/configuracion/clave" autocomplete="off">
        <h2>Cambiar contraseña</h2>
        <p class="adm-hint">Cuenta: <strong>${esc(user?.email || "")}</strong></p>
        <label class="adm-field">Contraseña actual
          <input type="password" name="actual" required autocomplete="current-password">
        </label>
        <label class="adm-field">Nueva contraseña <span class="adm-req">(mínimo 8 caracteres)</span>
          <input type="password" name="nueva" required minlength="8" autocomplete="new-password">
        </label>
        <label class="adm-field">Repetir nueva contraseña
          <input type="password" name="nueva2" required minlength="8" autocomplete="new-password">
        </label>
        <div class="adm-editor-actions">
          <button type="submit" class="adm-btn adm-btn--primary">Actualizar contraseña</button>
        </div>
      </form>

      <form class="adm-panel" method="post" action="/admin/configuracion/tipografia">
        <h2>Tipografía del blog</h2>
        <p class="adm-hint">Se aplica a <strong>todo el blog</strong> — artículos nuevos y ya publicados (tokens CSS, «Cambiar todo»). Dejá una opción en «Predeterminada» para volver al estilo del sitio.</p>

        <h3 class="adm-subh">Encabezados (H2 / H3)</h3>
        <label class="adm-field">Familia ${fontSelect("tipo_font_head", tipo.tipo_font_head)}</label>
        <div class="adm-field-row">
          <label class="adm-field">Tamaño H2 <input type="text" name="tipo_size_h2" value="${esc(tipo.tipo_size_h2 || "")}" placeholder="ej: 1.8rem"></label>
          <label class="adm-field">Tamaño H3 <input type="text" name="tipo_size_h3" value="${esc(tipo.tipo_size_h3 || "")}" placeholder="ej: 1.35rem"></label>
        </div>

        <h3 class="adm-subh">Párrafos</h3>
        <div class="adm-field-row">
          <label class="adm-field">Familia ${fontSelect("tipo_font_body", tipo.tipo_font_body)}</label>
          <label class="adm-field">Tamaño <input type="text" name="tipo_size_body" value="${esc(tipo.tipo_size_body || "")}" placeholder="ej: 1.08rem"></label>
        </div>

        <h3 class="adm-subh">Descripciones (pies de foto y extractos)</h3>
        <label class="adm-field">Familia ${fontSelect("tipo_font_desc", tipo.tipo_font_desc)}</label>

        <div class="adm-editor-actions">
          <button type="submit" class="adm-btn adm-btn--primary">Guardar y aplicar a todo</button>
          <button type="submit" class="adm-btn" name="reset" value="1">Restaurar predeterminada</button>
        </div>
      </form>
    </div>`;
  return adminLayout({ title: "Configuración", active: "config", user, body });
}

async function loadTipo() {
  const s = await getSettings("tipo_");
  const out = {};
  for (const k of TIPO_KEYS) out[k] = s[k] || "";
  return out;
}

// ---- GET /admin/configuracion ----
router.get("/", async (req, res, next) => {
  try {
    res.send(page({ user: req.user, tipo: await loadTipo() }));
  } catch (err) {
    next(err);
  }
});

// ---- POST /admin/configuracion/clave ----
router.post("/clave", async (req, res, next) => {
  try {
    const actual = String(req.body.actual || "");
    const nueva = String(req.body.nueva || "");
    const nueva2 = String(req.body.nueva2 || "");
    const tipo = await loadTipo();

    const { rows } = await query("SELECT password_hash FROM users WHERE id=$1", [req.user.id]);
    if (!rows.length || !verifyPassword(actual, rows[0].password_hash)) {
      return res.send(page({ user: req.user, tipo, error: "La contraseña actual no es correcta." }));
    }
    if (nueva.length < 8) return res.send(page({ user: req.user, tipo, error: "La nueva contraseña debe tener al menos 8 caracteres." }));
    if (nueva !== nueva2) return res.send(page({ user: req.user, tipo, error: "Las contraseñas nuevas no coinciden." }));

    await query("UPDATE users SET password_hash=$1 WHERE id=$2", [hashPassword(nueva), req.user.id]);
    // Invalida TODAS las sesiones del usuario y renueva la actual (defensa
    // en profundidad: si se cambia la clave por sospecha, las viejas caen).
    await query("DELETE FROM sessions WHERE user_id=$1", [req.user.id]);
    await createSession(res, req.user.id);
    res.send(page({ user: req.user, tipo, ok: "Contraseña actualizada. Se cerraron las demás sesiones." }));
  } catch (err) {
    next(err);
  }
});

// ---- POST /admin/configuracion/mail-test ----
router.post("/mail-test", async (req, res, next) => {
  try {
    const to = String(req.body.to || "").trim() || undefined;
    let mail;
    try {
      await verifyMailer(); // valida credenciales/conexión SMTP
      const r = await sendMail({
        to,
        subject: "[Prueba] SMTP · SAMA Forwarding Web",
        text: "Envío de prueba desde el panel de SAMA Forwarding. Si lo recibís, el SMTP está funcionando.",
        html: "<p>Envío de prueba desde el panel de <strong>SAMA Forwarding</strong>.</p><p>Si lo recibís, el SMTP está funcionando. ✅</p>",
      });
      mail = { ok: `Mail de prueba enviado a ${to || mailerInfo().to} (id: ${r.messageId || "ok"}).` };
    } catch (e) {
      mail = { error: `No se pudo enviar: ${e.message}` };
    }
    res.send(page({ user: req.user, tipo: await loadTipo(), mail }));
  } catch (err) {
    next(err);
  }
});

// ---- POST /admin/configuracion/tipografia ----
router.post("/tipografia", async (req, res, next) => {
  try {
    const reset = req.body.reset === "1";
    for (const k of TIPO_KEYS) {
      const val = reset ? "" : String(req.body[k] || "").trim();
      await setSetting(k, val);
    }
    res.send(page({
      user: req.user,
      tipo: await loadTipo(),
      ok: reset ? "Tipografía restaurada a la del sitio." : "Tipografía guardada y aplicada a todo el blog.",
    }));
  } catch (err) {
    next(err);
  }
});

export default router;
