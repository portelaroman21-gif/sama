/* ============================================================
   Mapa interactivo del corredor por etapas (handoff Claude Design).
   COPY del diseño. Cambio aplicado: tránsito marítimo unificado a
   "21 días" (dato único del proyecto), en lugar de "18 – 30 días".
   `titulo` usa \n para el salto de línea del diseño.
   ============================================================ */

// Copys v2: el waypoint 02 dice "21 días promedio en ruta directa" y los
// 4 restantes traen los copys finales del doc. La mini-card al lado del
// punto muestra TITULO + mini.
export const mapaEtapas = [
  {
    num: "01", short: "PUERTO DE ORIGEN", titulo: "Puerto de origen — China", color: "#1a3a63",
    mini: "Coordinamos bookings con navieras tier 1 y seguimos la carga desde China hasta el zarpe confirmado. Porque el control operativo no empieza en puerto: empieza en origen. (Shanghai, Qingdao, Xiamen, Hong Kong, Ningbo, Shenzhen)",
    shortEn: "ORIGIN PORT", tituloEn: "Origin port — China",
    miniEn: "We coordinate bookings with tier-1 shipping lines and track your cargo from China through confirmed departure. Because operational control doesn't start at the port: it starts at origin. (Shanghai, Qingdao, Xiamen, Hong Kong, Ningbo, Shenzhen)",
  },
  {
    num: "02", short: "TRÁNSITO MARÍTIMO", titulo: "Tránsito marítimo", color: "#1f6fb0",
    mini: "21 días promedio en ruta directa. Monitoreo activo con alertas ante desvíos o demoras. No esperamos que preguntes, te informamos.",
    shortEn: "OCEAN TRANSIT", tituloEn: "Ocean transit",
    miniEn: "21 days average on the direct route. Active monitoring with alerts for deviations or delays. We don't wait for you to ask — we keep you informed.",
  },
  {
    num: "03", short: "PUERTO DE MANZANILLO", titulo: "Puerto de Manzanillo", color: "#1f6fb0",
    mini: "Presencia operativa activa. Coordinación de transferencia terrestre desde el puerto.",
    shortEn: "PORT OF MANZANILLO", tituloEn: "Port of Manzanillo",
    miniEn: "Active operational presence. Ground-transfer coordination from the port.",
  },
  {
    num: "04", short: "RUTA TERRESTRE AL BAJÍO", titulo: "Ruta terrestre al Bajío", color: "#d4951f",
    mini: "Coordinamos el transporte terrestre con unidades dedicadas a Sama Forwarding. No tercerizamos esta etapa a un transportista desconectado de la operación.",
    shortEn: "GROUND ROUTE TO THE BAJÍO", tituloEn: "Ground route to the Bajío",
    miniEn: "We coordinate ground transport with units dedicated to Sama Forwarding. We don't outsource this stage to a carrier disconnected from the operation.",
  },
  {
    num: "05", short: "DESTINO FINAL EN EL BAJÍO", titulo: "Destino final — Zona del Bajío", color: "#2f8a52",
    mini: "Para nosotros, una operación no termina en puerto. Termina cuando la carga es entregada correctamente, la documentación está completa y el cliente tiene visibilidad total del cierre operativo. (Guadalajara, Guanajuato, Querétaro, Aguascalientes, San Luis Potosí, Michoacán, Jalisco)",
    shortEn: "FINAL DESTINATION IN THE BAJÍO", tituloEn: "Final destination — Bajío Region",
    miniEn: "For us, an operation doesn't end at the port. It ends when the cargo is correctly delivered, the documentation is complete, and the client has full visibility of the operational close. (Guadalajara, Guanajuato, Querétaro, Aguascalientes, San Luis Potosí, Michoacán, Jalisco)",
  },
];
