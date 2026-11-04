/* Pool de PostgreSQL.
   - Neon: usa el driver "serverless" (@neondatabase/serverless) que conecta
     por WebSocket sobre HTTPS (443). Necesario en hosts que bloquean el
     puerto 5432 de salida (p. ej. GoDaddy Node.js Hosting → EACCES 5432).
   - Otros (Railway/local): usa pg normal. Se quitan los query params de la
     URL (sslmode=require pisaba la config SSL en pg reciente) y el SSL se
     maneja explícito. */
import "dotenv/config";
import pgPkg from "pg";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const url = process.env.DATABASE_URL || "";
const isNeon = /neon\.tech/i.test(url);

export const pool = isNeon
  ? new NeonPool({ connectionString: url })
  : new pgPkg.Pool({
      connectionString: url.split("?")[0],
      ssl: /@(localhost|127\.0\.0\.1)/.test(url) ? false : { rejectUnauthorized: false },
    });

console.log(`DB driver: ${isNeon ? "@neondatabase/serverless (WS/443)" : "pg (5432)"}`);

export function query(text, params) {
  return pool.query(text, params);
}
