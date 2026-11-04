/* ============================================================
   Autenticación del panel (Módulo A).
   - Claves hasheadas con scrypt (node:crypto, sin libs externas).
   - Sesión persistente: token aleatorio en cookie httpOnly; en la BD
     se guarda SOLO el hash del token (si se filtra la tabla, no sirve).
   - Rate limiting en memoria para frenar fuerza bruta en el login.
   ============================================================ */
import crypto from "node:crypto";
import { query } from "../config/db.js";

const SCRYPT_KEYLEN = 64;
const SESSION_DAYS = 30;
export const SESSION_COOKIE = "sama_sid";

// ---- Hash de contraseña (scrypt$salt$hash) ----
export function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(plain), salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  try {
    const [scheme, salt, hash] = String(stored).split("$");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const test = crypto.scryptSync(String(plain), salt, SCRYPT_KEYLEN).toString("hex");
    const a = Buffer.from(hash, "hex");
    const b = Buffer.from(test, "hex");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ---- Cookies (sin cookie-parser) ----
export function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie;
  if (!raw) return out;
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    if (!k) continue;
    out[k] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");

// ---- Sesiones ----
export async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400 * 1000);
  await query(
    "INSERT INTO sessions(token_hash, user_id, expires_at) VALUES ($1,$2,$3)",
    [sha256(token), userId, expires]
  );
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`
  );
}

export async function destroySession(req, res) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (token) {
    await query("DELETE FROM sessions WHERE token_hash=$1", [sha256(token)]).catch(() => {});
  }
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}

export async function getUser(req) {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;
  const { rows } = await query(
    `SELECT u.id, u.email, u.nombre, u.rol
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [sha256(token)]
  );
  return rows[0] || null;
}

// Middleware: exige sesión válida; si no, manda al login.
export function requireAuth() {
  return async (req, res, next) => {
    try {
      const user = await getUser(req);
      if (!user) return res.redirect("/admin/login");
      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
}

// ---- Rate limiting del login (en memoria por IP) ----
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;

export function loginThrottle(ip) {
  const now = Date.now();
  // Purga entradas cuya ventana ya venció (evita que el Map crezca sin límite).
  if (attempts.size > 500) {
    for (const [k, v] of attempts) if (now - v.first > WINDOW_MS) attempts.delete(k);
  }
  const rec = attempts.get(ip) || { count: 0, first: now };
  if (now - rec.first > WINDOW_MS) {
    rec.count = 0;
    rec.first = now;
  }
  attempts.set(ip, rec);
  return {
    blocked: rec.count >= MAX_FAILS,
    fail() { rec.count += 1; },
    reset() { attempts.delete(ip); },
  };
}
