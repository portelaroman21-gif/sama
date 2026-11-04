/* ============================================================
   Leads (Módulos 10/11/12): formulario → valida → guarda en Postgres
   → envía email (SMTP) → redirige a /gracias/.
   Si falla el guardado o el mail, se registra en submission_errors para
   NO perder el lead. Anti-spam por honeypot (_gotcha), sin CAPTCHA.
   ============================================================ */
import { Router } from "express";
import { query } from "../config/db.js";
import { sendMail } from "../mailer.js";

const router = Router();

const esSpam = (b) => Boolean(b && b._gotcha);
const pick = (b, k) => (b && b[k] != null ? String(b[k]).trim() : "");
// fetch() del cliente manda este header; los POST normales (sin JS) no.
const wantsJson = (req) => req.get("X-Requested-With") === "fetch";
const escH = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const LEAD_COLS = [
  "origen", "nombre", "empresa", "cargo", "email", "telefono",
  "origen_importacion", "volumen", "frecuencia", "destino", "desafio",
  "como_nos_encontraste", "mensaje", "pagina_origen", "idioma",
];

// URLs de la página de gracias por idioma (bilingüe).
const GRACIAS = {
  diagnostico: { es: "/diagnostico-logistico/gracias/", en: "/en/logistics-diagnostic/thank-you/" },
  contacto: { es: "/contacto/gracias/", en: "/en/contact/thank-you/" },
};
const idiomaDe = (b) => (b && b.idioma === "en" ? "en" : "es");

async function saveLead(lead) {
  const vals = LEAD_COLS.map((c) => lead[c] || null);
  const ph = LEAD_COLS.map((_, i) => "$" + (i + 1)).join(",");
  const { rows } = await query(
    `INSERT INTO leads(${LEAD_COLS.join(",")}) VALUES (${ph}) RETURNING id`,
    vals
  );
  return rows[0].id;
}

async function logError(payload, err) {
  try {
    await query("INSERT INTO submission_errors(payload, error) VALUES ($1,$2)", [
      payload,
      String((err && err.message) || err),
    ]);
  } catch {
    /* si hasta esto falla, no hay más que hacer */
  }
}

function leadMail(lead) {
  const tipo = lead.origen === "diagnostico" ? "Diagnóstico logístico" : "Contacto";
  const esEN = lead.idioma === "en";
  const filas = [
    ["Idioma", esEN ? "EN — el prospecto habla inglés, responder en inglés" : "ES"],
    ["Nombre", lead.nombre],
    ["Empresa", lead.empresa],
    ["Cargo", lead.cargo],
    ["Email", lead.email],
    ["Teléfono / WhatsApp", lead.telefono],
    ["Importa desde", lead.origen_importacion],
    ["Volumen por operación", lead.volumen],
    ["Frecuencia", lead.frecuencia],
    ["Destino de la carga", lead.destino],
    ["Mayor desafío", lead.desafio],
    ["¿Cómo nos encontró?", lead.como_nos_encontraste],
    ["Mensaje / consulta", lead.mensaje],
  ].filter(([, v]) => v);

  const text =
    `Nuevo lead desde la web — ${tipo}\n\n` +
    filas.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nPágina: ${lead.pagina_origen || "-"}`;

  const html =
    `<h2 style="font-family:sans-serif">Nuevo lead desde la web — ${escH(tipo)}</h2>` +
    `<table style="font-family:sans-serif;border-collapse:collapse" cellpadding="6">` +
    filas
      .map(
        ([k, v]) =>
          `<tr><td style="border:1px solid #e2e8f0;background:#f7fafc"><strong>${escH(k)}</strong></td><td style="border:1px solid #e2e8f0">${escH(v)}</td></tr>`
      )
      .join("") +
    `</table><p style="font-family:sans-serif;color:#64748b">Página: ${escH(lead.pagina_origen || "-")}</p>`;

  return {
    subject: `[Web SAMA]${esEN ? "[EN]" : ""} ${tipo} — ${lead.nombre || lead.email || "sin nombre"}`,
    text,
    html,
    replyTo: lead.email || undefined,
  };
}

function finish(req, res, gracias) {
  if (wantsJson(req)) return res.json({ ok: true, redirect: gracias });
  return res.redirect(303, gracias);
}

function fail(req, res, msg) {
  if (wantsJson(req)) return res.status(400).json({ ok: false, error: msg });
  return res.status(400).send(msg);
}

// Guarda + envía; nunca pierde el lead (loguea fallos en submission_errors).
async function procesarLead(req, res, lead, gracias) {
  if (!lead.nombre || !lead.email) return fail(req, res, "Faltan datos obligatorios (nombre y email).");

  let guardado = false;
  let enviado = false;
  try {
    await saveLead(lead);
    guardado = true;
  } catch (e) {
    await logError(lead, e);
  }
  try {
    await sendMail(leadMail(lead));
    enviado = true;
  } catch (e) {
    await logError({ ...lead, _stage: "mail" }, e);
  }

  // Solo se considera perdido si NO se pudo guardar NI enviar.
  if (!guardado && !enviado) {
    return fail(req, res, "No pudimos procesar tu envío en este momento. Por favor escribinos por WhatsApp.");
  }
  return finish(req, res, gracias);
}

// ---- POST /api/leads/diagnostico ----
router.post("/diagnostico", async (req, res) => {
  const b = req.body || {};
  const idioma = idiomaDe(b);
  const gracias = GRACIAS.diagnostico[idioma];
  if (esSpam(b)) return finish(req, res, gracias); // bot: 200 silencioso
  const lead = {
    origen: "diagnostico",
    nombre: pick(b, "f1"),
    empresa: pick(b, "f2"),
    cargo: pick(b, "f3"),
    email: pick(b, "f4"),
    telefono: pick(b, "f5"),
    origen_importacion: pick(b, "f6"),
    volumen: pick(b, "f7"),
    frecuencia: pick(b, "f8"),
    destino: pick(b, "f9"),
    desafio: pick(b, "f10"),
    idioma,
    pagina_origen: idioma === "en" ? "/en/logistics-diagnostic/" : "/diagnostico-logistico/",
  };
  await procesarLead(req, res, lead, gracias);
});

// ---- POST /api/leads/contacto ----
router.post("/contacto", async (req, res) => {
  const b = req.body || {};
  const idioma = idiomaDe(b);
  const gracias = GRACIAS.contacto[idioma];
  if (esSpam(b)) return finish(req, res, gracias);
  const lead = {
    origen: "contacto",
    nombre: pick(b, "cn"),
    empresa: pick(b, "ce"),
    email: pick(b, "cm"),
    telefono: pick(b, "ct"),
    como_nos_encontraste: pick(b, "cf"),
    mensaje: pick(b, "cx"),
    idioma,
    pagina_origen: idioma === "en" ? "/en/contact/" : "/contacto/",
  };
  await procesarLead(req, res, lead, gracias);
});

// ---- POST /api/leads/nurturing (suscripción PDF del blog) ----
router.post("/nurturing", async (req, res) => {
  const b = req.body || {};
  if (esSpam(b)) return finish(req, res, "/");
  const lead = { origen: "nurturing", email: pick(b, "email"), nombre: pick(b, "email"), pagina_origen: pick(b, "pagina") || "/blog/" };
  if (!lead.email) return fail(req, res, "Falta el email.");
  let ok = false;
  try { await saveLead(lead); ok = true; } catch (e) { await logError(lead, e); }
  try { await sendMail(leadMail(lead)); ok = true; } catch (e) { await logError({ ...lead, _stage: "mail" }, e); }
  if (!ok) return fail(req, res, "No pudimos registrar tu email. Intentá de nuevo.");
  return res.json({ ok: true });
});

export default router;
