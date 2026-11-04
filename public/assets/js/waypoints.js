/* ============================================================
   Datos de los 5 waypoints del Mapa del Corredor (Plan Maestro §1.3).
   COPY EXACTO del documento aprobado — no modificar sin autorización.
   SEPARADO del dibujo SVG para reutilizar el componente:
   - versión compacta en Home
   - versión completa en /corredor-china-manzanillo-bajio/
   - versión estática en subpáginas de servicio
   `tramo` define la estética del segmento que LLEGA a ese punto:
   'origen' | 'mar' | 'puerto' | 'tierra' | 'destino'
   ============================================================ */

window.SAMA_WAYPOINTS = [
  {
    n: "01",
    titulo: "China (Origen)",
    tramo: "origen",
    texto: "Coordinamos bookings con navieras tier 1 y seguimos la carga desde China hasta el zarpe confirmado. Porque el control operativo no empieza en puerto: empieza en origen.",
    detalle: "Puertos: Shanghai, Qingdao, Xiamen, Hong Kong, Ningbo, Shenzhen."
  },
  {
    n: "02",
    titulo: "Tránsito marítimo",
    tramo: "mar",
    texto: "21 días promedio en ruta directa. Monitoreo activo con alertas ante desvíos o demoras. No esperamos que preguntes: te informamos.",
    detalle: ""
  },
  {
    n: "03",
    titulo: "Puerto Manzanillo",
    tramo: "puerto",
    texto: "Presencia operativa activa. Coordinación de transferencia terrestre desde el puerto.",
    detalle: "Despacho aduanal, coordinación naviera, tiempos de liberación."
  },
  {
    n: "04",
    titulo: "Ruta terrestre",
    tramo: "tierra",
    texto: "Coordinamos el transporte terrestre con unidades dedicadas a Sama Forwarding. No tercerizamos esta etapa a un transportista desconectado de la operación.",
    detalle: ""
  },
  {
    n: "05",
    titulo: "Destino Bajío",
    tramo: "destino",
    texto: "Una operación no termina en puerto. Termina cuando la carga es entregada correctamente, la documentación está completa y el cliente tiene visibilidad total del cierre.",
    detalle: "Ciudades: Guadalajara, Guanajuato, Querétaro, Aguascalientes, San Luis Potosí, Michoacán, Jalisco."
  }
];
