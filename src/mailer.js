/* Envío de mails.
   - Brevo HTTP API (sobre 443): se usa cuando BREVO_API_KEY está seteada.
     Necesario en hosts que bloquean el puerto SMTP 587 (GoDaddy → EACCES 587).
   - SMTP (nodemailer): fallback si no hay API key (local u otros hosts).
   Todo por variables de entorno, nada hardcodeado. */
import nodemailer from "nodemailer";
import "dotenv/config";

const HOST = process.env.SMTP_HOST || "smtp-mail.outlook.com";
const PORT = Number(process.env.SMTP_PORT || 587);
const USER = process.env.SMTP_USER || "";
const PASS = process.env.SMTP_PASS || "";
const FROM = process.env.MAIL_FROM || USER || "no-reply@samaforwarding.com";
const TO = process.env.MAIL_TO || "info@samaforwarding.com";
const BREVO_API_KEY = process.env.BREVO_API_KEY || "";

export function mailerConfigured() {
  return Boolean(BREVO_API_KEY) || Boolean(USER && PASS);
}
export function mailerInfo() {
  return {
    modo: BREVO_API_KEY ? "Brevo API (HTTP 443)" : "SMTP (587)",
    host: HOST, port: PORT, user: USER || "(sin definir)",
    from: FROM || "(sin definir)", to: TO, configured: mailerConfigured(),
  };
}

// ---- Brevo HTTP API (sobre 443) ----
async function sendViaBrevo({ subject, text, html, replyTo, to }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: FROM, name: "SAMA Forwarding — Web" },
      to: [{ email: to || TO }],
      subject,
      htmlContent: html || `<pre>${text || ""}</pre>`,
      textContent: text || undefined,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo API ${res.status}: ${body.slice(0, 200)}`);
  }
  const j = await res.json().catch(() => ({}));
  return { messageId: j.messageId || "ok" };
}

// ---- SMTP (fallback) ----
let _transport;
function transport() {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: HOST, port: PORT, secure: false, requireTLS: true,
      auth: { user: USER, pass: PASS },
    });
  }
  return _transport;
}

export async function verifyMailer() {
  if (BREVO_API_KEY) {
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": BREVO_API_KEY, accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Brevo API ${res.status}: clave inválida o sin permisos`);
    return true;
  }
  if (!mailerConfigured()) throw new Error("Mail sin configurar (falta BREVO_API_KEY o SMTP_USER/PASS).");
  return transport().verify();
}

export async function sendMail({ subject, text, html, replyTo, to }) {
  if (BREVO_API_KEY) return sendViaBrevo({ subject, text, html, replyTo, to });
  if (!mailerConfigured()) throw new Error("Mail sin configurar (falta BREVO_API_KEY o SMTP_USER/PASS).");
  return transport().sendMail({ from: `"SAMA Forwarding — Web" <${FROM}>`, to: to || TO, subject, text, html, replyTo });
}
