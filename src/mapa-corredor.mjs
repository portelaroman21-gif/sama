/* ============================================================
   Mapa interactivo del corredor por etapas.
   Reimplementación nativa (HTML/CSS/JS) del handoff de Claude Design
   "Corredor Logistico Interactivo.dc.html". Versión INTEGRADA: sin el
   wordmark interno ni la franja oscura (los aporta el header/footer del
   sitio). Etapa 1 renderizada en el HTML; datos de las 5 etapas en JSON
   para el JS; lista SEO oculta con todo el texto.
   ============================================================ */
import { esc } from "./templates.mjs";
import { mapaEtapas } from "./content/mapa.mjs";

const IMG = "/assets/img/mapa";

// Posiciones de las 5 insignias numéricas sobre el mapa (del diseño).
const BADGE_POS = [
  { left: "29.5%", top: "56%" },
  { left: "40%", top: "72%" },
  { left: "60%", top: "73%" },
  { left: "66.3%", top: "62%" },
  { left: "71.8%", top: "52%" },
];

// SVG de rutas + puerto + barco + camión (verbatim del diseño).
const ROUTES_SVG = `<svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid meet" class="mc-routes" aria-hidden="true">
      <path id="mcSeaRoute" d="M356,302 C460,360 565,402 660,394 C690,391 710,386 720,381" fill="none" stroke="#1f6fb0" stroke-width="5" stroke-linecap="round" stroke-dasharray="0.5 14"/>
      <path id="mcLandRoute" d="M720,381 C760,350 800,312 835,289 C845,282 855,276 861,271" fill="none" stroke="#d4951f" stroke-width="5" stroke-linecap="round" stroke-dasharray="0.5 14"/>
      <g transform="translate(690,352)"><g transform="scale(0.085) translate(-256,-256)">
        <rect x="115.96" y="73.965" transform="matrix(-0.8257 -0.5641 0.5641 -0.8257 165.0827 317.5566)" fill="#F17A00" width="31.281" height="118.619"/>
        <rect x="115.963" y="171.91" transform="matrix(-0.8257 -0.5641 0.5641 -0.8257 109.8386 496.3763)" fill="#F17A00" width="31.281" height="118.619"/>
        <rect x="115.968" y="269.858" transform="matrix(-0.8257 -0.5641 0.5641 -0.8257 54.5938 675.2025)" fill="#F17A00" width="31.281" height="118.619"/>
        <rect x="115.966" y="367.805" transform="matrix(-0.8257 -0.5641 0.5641 -0.8257 -0.6614 854.0239)" fill="#F17A00" width="31.281" height="118.619"/>
        <rect x="98.151" y="166.616" fill="#FEDF77" width="66.911" height="31.282"/>
        <rect x="98.151" y="264.558" fill="#FEDF77" width="66.911" height="31.282"/>
        <rect x="98.151" y="362.501" fill="#FEDF77" width="66.911" height="31.282"/>
        <polygon fill="#FF9500" points="180.704,79.094 117.127,79.094 149.423,99.947 149.423,460.446 131.606,460.446 121.177,473.865 131.606,491.728 180.704,491.728 "/>
        <polygon fill="#FFC222" points="113.789,460.446 113.789,99.947 137.618,79.094 82.507,79.094 82.507,491.728 131.606,491.728 131.606,460.446 "/>
        <rect x="58.559" y="35.913" fill="#FFC222" width="31.282" height="48.393"/>
        <rect x="117.129" y="35.913" fill="#FFC222" width="31.282" height="48.393"/>
        <rect x="175.688" y="35.913" fill="#FFC222" width="31.282" height="48.393"/>
        <rect x="292.816" y="35.913" fill="#FF9500" width="31.282" height="48.393"/>
        <rect x="351.386" y="35.913" fill="#FF9500" width="31.282" height="48.393"/>
        <rect x="409.945" y="35.913" fill="#FF9500" width="31.282" height="48.393"/>
        <polygon fill="#9D9D9D" points="411.945,167.178 411.945,84.306 380.663,84.306 380.663,167.178 323.743,243.99 348.877,262.614 396.304,198.611 443.732,262.614 468.865,243.99 "/>
        <polygon fill="#D4D4D4" points="511.433,236.188 488.407,236.188 470.744,309.692 488.407,383.197 511.433,383.197 "/>
        <polygon fill="#EDEDED" points="465.382,236.188 447.717,309.692 465.382,383.197 488.407,383.197 488.407,236.188 "/>
        <polygon fill="#D4D4D4" points="465.382,236.188 442.356,236.188 424.692,309.692 442.356,383.197 465.382,383.197 "/>
        <polygon fill="#EDEDED" points="419.33,236.188 401.666,309.692 419.33,383.197 442.356,383.197 442.356,236.188 "/>
        <polygon fill="#D4D4D4" points="419.33,236.188 396.304,236.188 378.64,309.692 396.304,383.197 419.33,383.197 "/>
        <polygon fill="#EDEDED" points="373.279,236.188 355.615,309.692 373.279,383.197 396.304,383.197 396.304,236.188 "/>
        <polygon fill="#D4D4D4" points="373.279,236.188 350.252,236.188 332.589,309.692 350.252,383.197 373.279,383.197 "/>
        <polygon fill="#EDEDED" points="327.227,236.188 309.563,309.692 327.227,383.197 350.252,383.197 350.252,236.188 "/>
        <polygon fill="#D4D4D4" points="327.227,236.188 304.201,236.188 286.537,309.692 304.201,383.197 327.227,383.197 "/>
        <rect x="281.18" y="236.186" fill="#EDEDED" width="23.023" height="147.013"/>
        <polygon fill="#FF9500" points="265.536,35.913 248.948,35.913 238.854,60.109 249.613,84.306 265.536,84.306 "/>
        <polygon fill="#FFC222" points="234.254,35.913 234.254,84.306 249.613,84.306 248.948,35.913 "/>
        <polygon fill="#FFC222" points="470.345,20.272 249.613,20.272 239.185,35.913 249.613,51.554 451.401,51.554 460.347,68.666 249.613,68.666 239.185,84.306 249.613,99.947 512,99.947 "/>
        <polygon fill="#FEDF77" points="31.282,68.666 31.282,51.554 249.613,51.554 249.613,20.272 0,20.272 0,99.947 249.613,99.947 249.613,68.666 "/>
      </g></g>
      <g class="mc-ship"><g transform="scale(0.085) translate(-256,-256)">
        <path fill="#8C6D50" d="M194.778,222.099h-66.781c-9.217,0-16.584-7.473-16.584-16.695v-66.781c0-9.223,7.367-16.695,16.584-16.695h66.781c9.217,0,16.695,7.473,16.695,16.695v66.781C211.473,214.628,203.995,222.099,194.778,222.099z"/>
        <path fill="#8C6D50" d="M261.559,222.099h-66.781c-9.217,0-16.584-7.473-16.584-16.695V105.232c0-9.223,7.367-16.695,16.584-16.695h66.781c9.217,0,16.695,7.473,16.695,16.695v100.172C278.255,214.628,270.776,222.099,261.559,222.099z"/>
        <path fill="#765B43" d="M261.559,88.536h-66.781h-0.001v133.563h0.001h66.781c9.217,0,16.695-7.473,16.695-16.695V105.232C278.255,96.009,270.776,88.536,261.559,88.536z"/>
        <path fill="#E2E7EC" d="M294.95,188.709H94.606c-27.619,0-50.086,22.468-50.086,50.086v100.172c0,9.223,7.478,16.695,16.695,16.695h242.083l41.738-83.477v-33.391C345.036,211.176,322.569,188.709,294.95,188.709z"/>
        <path fill="#CCD5E0" d="M294.95,188.709H194.777v166.954h108.521l41.738-83.477v-33.391C345.036,211.176,322.569,188.709,294.95,188.709z"/>
        <path fill="#78A8E2" d="M508.838,262.425c-3.141-4.353-8.174-6.934-13.543-6.934H328.341c-6.956,0-13.185,4.315-15.63,10.831l-20.978,55.951H16.694c-5.369,0-10.402,2.581-13.543,6.934s-3.989,9.95-2.294,15.038l37.196,111.591H453.51l57.62-178.372C512.827,272.376,511.979,266.778,508.838,262.425z"/>
        <path fill="#6B96C8" d="M495.294,255.49H328.341c-6.956,0-13.185,4.315-15.63,10.831l-20.978,55.951h-96.957v133.563H453.51l57.62-178.372c1.695-5.087,0.848-10.685-2.294-15.038C505.695,258.071,500.664,255.49,495.294,255.49z"/>
        <path fill="#8C6D50" d="M161.387,289.05h-33.391c-9.217,0-16.695-7.473-16.695-16.695s7.478-16.695,16.695-16.695h33.391c9.217,0,16.695,7.473,16.695,16.695S170.604,289.05,161.387,289.05z"/>
        <path fill="#765B43" d="M261.559,289.05h-33.391c-9.217,0-16.695-7.473-16.695-16.695s7.478-16.695,16.695-16.695h33.391c9.217,0,16.695,7.473,16.695,16.695S270.776,289.05,261.559,289.05z"/>
        <path fill="#A7E2E2" d="M511.876,473.198c-1.113,9.238-9.461,15.694-18.586,14.581c-23.709-2.783-46.304-12.243-65.002-26.824c-48.194,37.732-118.759,37.732-166.954,0c-19.589,15.248-42.629,24.375-66.559,27.158c-5.565,0.779-11.242,1.113-16.918,1.113c-29.717,0-59.324-9.461-83.477-28.271c-18.809,14.692-41.516,24.153-65.446,26.935c-9.126,1.002-17.473-5.454-18.476-14.692c-1.112-9.127,5.454-17.363,14.582-18.476c21.704-2.56,42.072-12.466,57.542-27.826c6.234-6.233,17.364-6.344,23.597,0c23.262,23.262,57.097,32.278,88.597,27.269c20.369-3.228,39.736-12.243,54.76-27.269c6.457-6.567,17.029-6.567,23.597,0c38.176,38.177,105.181,38.177,143.356,0c6.457-6.567,17.029-6.567,23.597,0c15.359,15.36,35.617,25.154,57.208,27.826C506.424,455.723,512.99,464.071,511.876,473.198z"/>
        <path fill="#537DAF" d="M403.47,355.831h-33.391c-9.217,0-16.695-7.473-16.695-16.695c0-9.223,7.478-16.695,16.695-16.695h33.391c9.217,0,16.695,7.473,16.695,16.695C420.165,348.359,412.687,355.831,403.47,355.831z"/>
        <path fill="#E8C870" d="M61.215,88.536c-19.043,0-36.716-9.462-47.281-25.303c-5.12-7.674-3.043-18.038,4.63-23.152c7.663-5.109,18.032-3.049,23.152,4.63c4.424,6.63,11.532,10.435,19.5,10.435s15.076-3.804,19.5-10.435c10.565-15.842,28.239-21.964,47.281-21.964s36.716,6.123,47.281,21.964c5.12,7.674,3.043,18.038-4.63,23.152c-7.674,5.103-18.032,3.043-23.152-4.63c-4.424-6.63-11.532-10.435-19.5-10.435s-15.076,3.804-19.5,10.435C97.932,79.075,80.258,88.536,61.215,88.536z"/>
        <path fill="#8AC8C8" d="M511.876,473.198c-1.113,9.238-9.461,15.694-18.586,14.581c-23.709-2.783-46.304-12.243-65.002-26.824c-48.194,37.732-118.759,37.732-166.954,0c-19.589,15.248-42.629,24.375-66.559,27.158v-33.947c20.369-3.228,39.736-12.243,54.76-27.269c6.457-6.567,17.029-6.567,23.597,0c38.176,38.177,105.181,38.177,143.356,0c6.457-6.567,17.029-6.567,23.597,0c15.359,15.36,35.617,25.154,57.208,27.826C506.424,455.723,512.99,464.071,511.876,473.198z"/>
      </g><animateMotion dur="7s" repeatCount="indefinite" rotate="0" keyPoints="0;1" keyTimes="0;1"><mpath href="#mcSeaRoute"/></animateMotion></g>
      <g class="mc-truck"><g transform="scale(0.072) translate(-256,-256)">
        <rect y="92.126" fill="#AEADB3" width="361.993" height="291.216"/>
        <rect x="254.098" y="92.126" fill="#8B8892" width="107.895" height="291.216"/>
        <path fill="#0082D2" d="M512,299.001v84.341H0V281.048h361.993V178.744h49.292c25.247,0,45.781,20.544,45.781,45.781v37.682h18.13C495.489,262.207,512,278.707,512,299.001z"/>
        <path fill="#005C94" d="M512,299.001v84.341H254.109V281.048h107.884V178.744h49.292c25.247,0,45.781,20.544,45.781,45.781v37.682h18.13C495.489,262.207,512,278.707,512,299.001z"/>
        <path fill="#AEADB3" d="M134.322,367.667c0,16.929-13.721,30.66-30.66,30.66c-16.929,0-30.649-13.731-30.649-30.66c0-16.929,13.721-30.649,30.649-30.649C120.602,337.018,134.322,350.738,134.322,367.667z"/>
        <path fill="#8B8892" d="M134.322,367.667c0,16.929-13.721,30.66-30.66,30.66v-61.309C120.602,337.018,134.322,350.738,134.322,367.667z"/>
        <path fill="#2B292C" d="M155.859,367.155c-0.272-28.528-23.627-51.685-52.197-51.685c-28.601,0-51.988,23.24-52.186,51.748l-0.01,0.449c0,28.789,23.418,52.207,52.197,52.207c28.789,0,52.207-23.418,52.207-52.207L155.859,367.155z M103.662,388.525c-11.422,0-20.732-9.248-20.847-20.649l0.01-0.303c0.042-11.443,9.394-20.753,20.837-20.753c11.453,0,20.806,9.311,20.847,20.753v0.084c0.01,0.073,0.01,0.136,0.01,0.199C124.416,379.266,115.105,388.525,103.662,388.525z"/>
        <path fill="#17171A" d="M155.87,367.667c0,28.789-23.418,52.207-52.207,52.207v-31.349c11.443,0,20.753-9.259,20.858-20.67c0-0.063,0-0.125-0.01-0.199v-0.084c-0.042-11.443-9.394-20.753-20.847-20.753v-31.35c28.57,0,51.925,23.157,52.197,51.685L155.87,367.667z"/>
        <path fill="#AEADB3" d="M440.85,367.667c0,16.929-13.721,30.66-30.66,30.66c-16.929,0-30.649-13.731-30.649-30.66c0-16.929,13.721-30.649,30.649-30.649C427.13,337.018,440.85,350.738,440.85,367.667z"/>
        <path fill="#8B8892" d="M440.85,367.667c0,16.929-13.721,30.66-30.66,30.66v-61.309C427.13,337.018,440.85,350.738,440.85,367.667z"/>
        <path fill="#2B292C" d="M462.387,367.155c-0.272-28.528-23.627-51.685-52.197-51.685c-28.601,0-51.988,23.24-52.186,51.748l-0.01,0.449c0,28.789,23.418,52.207,52.197,52.207c28.789,0,52.207-23.418,52.207-52.207L462.387,367.155z M410.19,388.525c-11.422,0-20.732-9.248-20.847-20.649l0.01-0.303c0.042-11.443,9.394-20.753,20.837-20.753c11.453,0,20.806,9.311,20.847,20.753v0.084c0.01,0.073,0.01,0.136,0.01,0.199C430.944,379.266,421.633,388.525,410.19,388.525z"/>
        <path fill="#17171A" d="M462.398,367.667c0,28.789-23.418,52.207-52.207,52.207v-31.349c11.443,0,20.753-9.259,20.858-20.67c0-0.063,0-0.125-0.01-0.199v-0.084c-0.042-11.443-9.394-20.753-20.847-20.753v-31.35c28.57,0,51.925,23.157,52.197,51.685L462.398,367.667z"/>
        <path fill="#C8C6CD" d="M383.054,263.796h47.994v-36.352c0-11.92-9.663-21.582-21.582-21.582h-26.412L383.054,263.796L383.054,263.796z"/>
      </g><animateMotion dur="5.2s" repeatCount="indefinite" rotate="0" keyPoints="0;1" keyTimes="0;1"><mpath href="#mcLandRoute"/></animateMotion></g>
    </svg>`;

const PILLS = [
  ['<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>', { es: "Visibilidad en todo el corredor", en: "Visibility across the entire corridor" }],
  ['<path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 17 0z"/>', { es: "Comunicación proactiva y transparente", en: "Proactive, transparent communication" }],
  ['<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/>', { es: "Seguridad operativa", en: "Operational security" }],
  ['<circle cx="8" cy="9" r="2.4"/><circle cx="16" cy="9" r="2.4"/><path d="M3.5 18c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"/><path d="M12.5 18c0-2.5 2-4 4.5-4s4 1.5 4 4"/>', { es: "Coordinación con expertos", en: "Coordination with experts" }],
];

export function mapaCorredorHTML({ titulo = true, pills = true, bleed = false, lang = "es" } = {}) {
  const en = lang === "en";
  const L = (e, f) => (en ? e[f + "En"] || e[f] : e[f]); // campo por idioma
  const T = {
    etapa: en ? "Stage" : "Etapa",
    mexico: en ? "MEXICO" : "MÉXICO",
    h2: en ? "LOGISTICS CORRIDOR" : "CORREDOR LOGÍSTICO",
    tagline: en ? "One integrated flow. Visibility at every stage." : "Un flujo integrado. Visibilidad en cada etapa.",
  };

  const pillsHTML = PILLS.map(([p, t]) => `
        <div class="mc-pill">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1f6fb0" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>
          <span>${esc(t[lang])}</span>
        </div>`).join("");

  const badges = mapaEtapas.map((e, i) => `
      <button class="mc-badge${i === 0 ? " is-sel" : ""}" type="button" data-stage="${i}" aria-label="${T.etapa} ${e.num}: ${esc(L(e, "short"))}" style="left:${BADGE_POS[i].left}; top:${BADGE_POS[i].top}; background:${e.color};">${e.num}
        <span class="mc-ring" style="border-color:${e.color};"></span>
      </button>`).join("");

  // Mini-cards al lado del punto: 01-02 a la derecha del punto;
  // 03-04-05 a la izquierda del punto (que están más al borde derecho).
  const SIDE = ["right", "right", "left", "left", "left"];
  const minicards = mapaEtapas.map((e, i) => `
      <div class="mc-minicard mc-mini--${SIDE[i]}" data-mini="${i}" style="left:${BADGE_POS[i].left}; top:${BADGE_POS[i].top}; --mc-color:${e.color};">
        <div class="mc-mini-head"><span class="mc-mini-num">${e.num}</span><h4 class="mc-mini-titulo">${esc(L(e, "titulo"))}</h4></div>
        <p>${esc(L(e, "mini"))}</p>
      </div>`).join("");

  const tabs = mapaEtapas.map((e, i) => `
      <button class="mc-tab${i === 0 ? " is-active" : ""}" type="button" data-stage="${i}" style="--tab-color:${e.color};" aria-label="${T.etapa} ${e.num}: ${esc(L(e, "short"))}">
        <span class="mc-tab-num">${e.num}</span>
        <span class="mc-tab-short">${esc(L(e, "short"))}</span>
      </button>`).join("");

  // Lista SEO oculta con todo el texto de las 5 etapas.
  const seo = `<ul class="mc-seo">` + mapaEtapas.map((e) =>
    `<li><strong>${e.num} — ${esc(L(e, "titulo"))}:</strong> ${esc(L(e, "mini"))}</li>`
  ).join("") + `</ul>`;

  const dataJSON = JSON.stringify(mapaEtapas.map((e) => ({
    num: e.num, titulo: L(e, "titulo"), mini: L(e, "mini"), color: e.color,
  })));

  const head = (titulo || pills) ? `<div class="mc-head">
      ${titulo ? `<div class="mc-title-block">
        <h2 class="mc-h2">${T.h2} <span>CHINA – MANZANILLO – BAJÍO</span></h2>
        <p class="mc-tagline"><span class="mc-dash"></span> ${esc(T.tagline)}</p>
      </div>` : ""}
      ${pills ? `<div class="mc-pills">${pillsHTML}</div>` : ""}
    </div>` : "";

  return `<div class="mc${bleed ? " mc--bleed" : ""}" data-mapa-corredor>
  <div class="mc-wrap">
    ${head}
    <div class="mc-map">
      <img src="${IMG}/china-map.svg" alt="" aria-hidden="true" class="mc-china">
      <img src="${IMG}/mexico-map.svg" alt="" aria-hidden="true" class="mc-mexico">
      ${ROUTES_SVG}

      <div class="mc-flag mc-flag--cn"><img src="${IMG}/china-flag.png" alt=""><span>CHINA</span></div>
      <div class="mc-flag mc-flag--mx"><img src="${IMG}/mexico-flag.webp" alt=""><span>${T.mexico}</span></div>

      <div class="mc-manzanillo">MANZANILLO</div>

      ${badges}
      ${minicards}
    </div>

    <div class="mc-tabs">${tabs}</div>

    ${seo}
    <script type="application/json" data-mapa-data>${dataJSON}</script>
  </div>
  </div>`;
}
