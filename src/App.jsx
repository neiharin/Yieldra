import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   STYLES
═══════════════════════════════════════════ */
const CSS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Epilogue:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --ink:#0c0e0c; --ink2:#252825; --ink3:#455044; --ink4:#788878; --ink5:#aab8aa;
      --paper:#f8f7f3; --paper2:#f1ede5; --paper3:#e9e4da;
      --line:#e2ddd4; --line2:#ccc7bc;
      --go:#1a5c38; --go-lt:#eaf6f0; --go-md:#c0e4d0;
      --warn:#7c4f08; --warn-lt:#fef4e0;
      --stop:#7a1a28; --stop-lt:#fce8ec;
      --ff:'Epilogue',system-ui,sans-serif;
      --serif:'Playfair Display',Georgia,serif;
      --mono:'JetBrains Mono',monospace;
      --sh:0 1px 2px rgba(12,14,12,.05),0 4px 12px rgba(12,14,12,.08);
    }
    html { background:var(--paper); color:var(--ink); font-family:var(--ff); -webkit-font-smoothing:antialiased; }
    body { min-height:100vh; overflow-x:hidden; }
    ::selection { background:var(--go-md); color:var(--ink); }
    ::placeholder { color:var(--ink5)!important; }
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
    select option { background:var(--paper); color:var(--ink); }
    button { font-family:var(--ff); }

    @keyframes up   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fade { from{opacity:0} to{opacity:1} }
    @keyframes pop  { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes pdot { 0%,100%{opacity:1} 50%{opacity:.2} }
    @keyframes tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes slide-in-r { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slide-out-r { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(32px)} }
    @keyframes confetti-fall { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(60px) rotate(720deg);opacity:0} }

    .u1{animation:up .5s .04s cubic-bezier(.16,1,.3,1) both}
    .u2{animation:up .5s .10s cubic-bezier(.16,1,.3,1) both}
    .u3{animation:up .5s .16s cubic-bezier(.16,1,.3,1) both}
    .pop{animation:pop .45s cubic-bezier(.16,1,.3,1) both}
    .fade{animation:fade .3s ease both}
    .slide-in{animation:slide-in-r .35s cubic-bezier(.16,1,.3,1) both}

    /* inputs */
    .inp{width:100%;background:#fff;border:1.5px solid var(--line2);border-radius:10px;padding:13px 16px;color:var(--ink);font-size:15px;font-family:var(--ff);font-weight:500;outline:none;transition:border-color .15s,box-shadow .15s;appearance:none;-webkit-appearance:none}
    .inp:focus{border-color:var(--go);box-shadow:0 0 0 3px rgba(26,92,56,.1)}
    .inp.err{border-color:var(--stop);box-shadow:0 0 0 3px rgba(122,26,40,.08)}
    .inp-wrap{position:relative}
    .inp-unit{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--ink4);font-weight:600;pointer-events:none}
    .lbl{display:block;font-size:11px;font-weight:700;color:var(--ink4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px}
    .errtxt{font-size:11px;color:var(--stop);margin-top:5px;font-weight:600}

    /* buttons */
    .btn-cta{display:inline-flex;align-items:center;justify-content:center;gap:9px;background:var(--go);color:#fff;border:none;border-radius:12px;padding:16px 32px;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:-.01em;transition:background .15s,transform .12s,box-shadow .15s;box-shadow:0 2px 8px rgba(26,92,56,.25);width:100%}
    .btn-cta:hover{background:#155030;transform:translateY(-1px);box-shadow:0 6px 20px rgba(26,92,56,.32)}
    .btn-cta:active{transform:translateY(0)}
    .btn-cta:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
    .btn-ink{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--ink);color:var(--paper);border:none;border-radius:10px;padding:11px 20px;font-size:13px;font-weight:700;cursor:pointer;transition:background .15s,transform .12s;white-space:nowrap}
    .btn-ink:hover{background:var(--ink2);transform:translateY(-1px)}
    .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:transparent;color:var(--ink3);border:1.5px solid var(--line2);border-radius:10px;padding:11px 18px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
    .btn-ghost:hover{border-color:var(--ink3);background:var(--paper2)}
    .btn-danger{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--stop);border:1.5px solid #e8c0c6;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;font-family:var(--ff)}
    .btn-danger:hover{background:var(--stop-lt);border-color:var(--stop)}

    /* cards */
    .card{background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:var(--sh)}
    .card2{background:var(--paper2);border:1px solid var(--line);border-radius:14px}

    /* misc */
    .pill{display:inline-flex;align-items:center;gap:5px;padding:4px 11px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
    .dot-live{width:7px;height:7px;border-radius:50%;background:var(--go);display:inline-block;animation:pdot 2s infinite}
    .tab-btn{flex:1;background:none;border:none;padding:13px 0;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--ff);border-bottom:2px solid transparent;transition:all .15s;color:var(--ink4)}
    .tab-btn.on{color:var(--ink);border-color:var(--ink)}
    .ticker-track{overflow:hidden;white-space:nowrap;background:var(--ink);height:32px;display:flex;align-items:center}
    .ticker-inner{display:inline-flex;animation:tick 32s linear infinite}
    .ticker-item{padding:0 28px;font-size:11px;font-weight:600;color:#788878;letter-spacing:.04em;border-right:1px solid #252825}
    .metric-row{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--line)}
    .metric-row:last-child{border-bottom:none;padding-bottom:0}
    .metric-row:first-child{padding-top:0}
    .swot-item{display:flex;gap:10px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--line)}
    .swot-item:last-child{border-bottom:none;padding-bottom:0}
    .swot-item:first-child{padding-top:0}
    .strat-btn{flex:1;background:var(--paper2);border:1.5px solid var(--line);border-radius:10px;padding:13px 12px;cursor:pointer;text-align:left;transition:all .15s;min-width:0}
    .strat-btn:hover{border-color:var(--ink4);background:var(--paper3)}
    .strat-btn.on{border-color:var(--go);background:var(--go-lt)}
    .share-btn{display:inline-flex;align-items:center;gap:7px;background:var(--paper2);border:1.5px solid var(--line2);border-radius:9px;padding:9px 14px;font-size:13px;font-weight:600;color:var(--ink3);cursor:pointer;transition:all .15s;font-family:var(--ff)}
    .share-btn:hover{border-color:var(--ink3);background:var(--paper3);color:var(--ink)}
    .confetti-piece{position:absolute;width:8px;height:8px;border-radius:2px;animation:confetti-fall .8s ease forwards}

    /* history */
    .hist-row{display:flex;align-items:center;gap:0;padding:14px 20px;border-bottom:1px solid var(--line);cursor:pointer;transition:background .12s;position:relative}
    .hist-row:last-child{border-bottom:none}
    .hist-row:hover{background:var(--paper2)}
    .hist-row:hover .hist-actions{opacity:1}
    .hist-actions{opacity:0;transition:opacity .15s;display:flex;gap:6px;align-items:center}
    .hist-score-ring{flex-shrink:0;width:44px;height:44px;position:relative}
    .hist-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}

    /* drawer */
    .drawer-overlay{position:fixed;inset:0;background:rgba(12,14,12,.45);backdrop-filter:blur(3px);z-index:200;animation:fade .2s ease both}
    .drawer{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--paper);border-left:1px solid var(--line);box-shadow:-8px 0 40px rgba(12,14,12,.15);z-index:201;display:flex;flex-direction:column;animation:slide-in-r .3s cubic-bezier(.16,1,.3,1) both;overflow:hidden}
    .drawer-head{padding:20px 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:var(--paper)}
    .drawer-body{flex:1;overflow-y:auto;padding:0}
    .drawer-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;padding:40px;text-align:center}
    .close-btn{width:32px;height:32px;background:var(--paper2);border:1px solid var(--line2);border-radius:8px;cursor:pointer;display:grid;place-items:center;font-size:14px;color:var(--ink3);transition:all .15s;flex-shrink:0}
    .close-btn:hover{background:var(--paper3);color:var(--ink)}

    @media(max-width:600px){
      .hide-m{display:none!important}
      .g2{grid-template-columns:1fr!important}
      .g3{grid-template-columns:1fr!important}
      .g3-alt{grid-template-columns:1fr!important}
      .strat-row{flex-direction:column!important}
      .score-hero-inner{flex-direction:column!important;align-items:center!important}
      .hero-h1{font-size:clamp(34px,9vw,52px)!important}
      .sim-row{grid-template-columns:1fr!important}
      .share-row{flex-direction:column!important;align-items:stretch!important}
      .pro-inner{flex-direction:column!important}
      .hist-actions{opacity:1}
    }
  `}</style>
);

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const MAX_FREE     = 2;
const STORAGE_KEY  = "yieldra:history";
const COUNT_KEY    = "yieldra:count";
const ONBOARD_KEY  = "yieldra:onboarded";
const EMAIL_KEY    = "yieldra:email";
const EVENTS_KEY   = "yieldra_events";
const MAX_HISTORY  = 20;
const MAX_EVENTS   = 200;

// ── Legacy key migration (vetro:* → yieldra:*) ──────────────────────
// Runs once on first load for users who had data under the old brand.
// Copies existing values to new keys then removes old ones.
;(function migrateLegacyKeys() {
  const MAP = [
    ["vetro:history",  "yieldra:history"],
    ["vetro:count",    "yieldra:count"],
    ["vetro:onboarded","yieldra:onboarded"],
    ["vetro:email",    "yieldra:email"],
    ["vetro_events",   "yieldra_events"],
  ];
  try {
    MAP.forEach(([old, next]) => {
      const val = localStorage.getItem(old);
      if (val !== null) {
        // Only migrate if new key doesn't already exist (avoid overwriting newer data)
        if (localStorage.getItem(next) === null) {
          localStorage.setItem(next, val);
        }
        localStorage.removeItem(old);
      }
    });
    // sessionStorage sid migration
    const oldSid = sessionStorage.getItem("vetro:sid");
    if (oldSid && !sessionStorage.getItem("yieldra:sid")) {
      sessionStorage.setItem("yieldra:sid", oldSid);
      sessionStorage.removeItem("vetro:sid");
    }
  } catch { /* storage blocked — silent */ }
})();

const TICKER_ITEMS = [
  "Yield bruto medio España 2024: 6.4% · Fuente: Banco de España","Madrid: yield neto medio 4.1% · Precio/m² referencia: 4.200€",
  "Barcelona: yield neto medio 4.6% · Entrada mínima eficiente: 280k€","Valencia: yield neto medio 6.4% · Mayor crecimiento de renta 2023–24",
  "Málaga: yield neto medio 5.9% · Alta demanda turística y residencial","Precio medio/m² España: 2.018€ · Variación interanual: +6.2%",
  "El 71% de los inversores negocia un descuento medio del 6.8%","Coste medio reforma integral España: 620€/m² · Desviación habitual: +22%",
  "Sevilla: yield neto medio 5.7% · Mercado con alta liquidez","Bilbao: yield neto medio 5.0% · Mercado estable, vacíos bajos",
  "Spread yield inmobiliario vs bono español 10a: +2.8pp","Yieldra · Motor de scoring propietario · Basado en datos reales de mercado",
];

const SOCIAL_PROOF = [
  { name:"Carlos M.", city:"Madrid", text:"Antes de Yieldra tomaba decisiones de 200k€ con una hoja de cálculo y el olfato. Ahora el primer filtro lo hace el modelo. Compré el activo con score 82. Lleva 16 meses arrendado sin vacíos.", avatar:"CM" },
  { name:"Laura P.", city:"Valencia", text:"Evité una operación de 185k€ que tenía yield neto del 2.9%. El agente insistía en que era 'rentable'. Yieldra lo catalogó como Descartar en 90 segundos. Tres meses después el precio bajó un 11%.", avatar:"LP" },
  { name:"Javier R.", city:"Barcelona", text:"Lo uso como primer filtro antes de visitar cualquier activo. Si el score no llega a 60, ni me desplazo. Me ahorra tiempo y me obliga a disciplina inversora.", avatar:"JR" },
];

const CASE_STUDY = {
  title:"Cómo Marta evitó perder 35.000€",
  story:"Marta tenía 280.000€ para invertir en Valencia. Un agente le presentó un piso en Benimaclet: 'rentabilidad del 5%, una ganga'. Lo analizó en Yieldra en 90 segundos.",
  details:[{label:"Precio pedido",value:"280.000€"},{label:"Alquiler estimado",value:"950€/mes"},{label:"Rent. bruta",value:"4.07%"},{label:"Rent. neta",value:"2.9%"},{label:"Flujo mensual",value:"+117€"}],
  score:34, verdict:"Descartar", vColor:"#7a1a28",
  outcome:"Yieldra detectó que el precio/m² era un 28% superior a la media del barrio y el yield gap era negativo. Marta no compró. Tres meses después ese piso se vendió por 243.000€. Marta encontró otro activo con score 81.",
};

const EXAMPLES = [
  { label:"Eixample, Barcelona", icon:"🏙", precio:320000, metros:68, ciudad:"Barcelona · Eixample", alquiler:1450, gastos:3200, estado:"buena", estrategia:"tradicional" },
  { label:"Ruzafa, Valencia",    icon:"🌿", precio:145000, metros:55, ciudad:"Valencia · Ruzafa",   alquiler:850,  gastos:2100, estado:"reformar", estrategia:"habitaciones" },
  { label:"Chamberí, Madrid",    icon:"🏛", precio:480000, metros:90, ciudad:"Madrid · Chamberí",   alquiler:2100, gastos:4800, estado:"nueva",    estrategia:"largo_plazo" },
];

const STEPS = [
  { n:1, title:"Introduce los datos del activo", desc:"Precio de entrada, superficie, renta estimada y estructura de gastos. Menos de 60 segundos." },
  { n:2, title:"El modelo evalúa la operación",  desc:"Scoring propietario: yield, riesgo, liquidez, flujo de caja y benchmark de zona. Sin atajos." },
  { n:3, title:"Veredicto accionable",            desc:"Operar, Negociar o Descartar — con el razonamiento detrás. No un número: una decisión de capital." },
];

/* ═══════════════════════════════════════════
   STORAGE HELPERS  (localStorage only)
═══════════════════════════════════════════ */

async function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

async function saveHistory(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

async function loadCount() {
  try {
    const raw = localStorage.getItem(COUNT_KEY);
    if (raw === null) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : 0;
  } catch { return 0; }
}

async function saveCount(n) {
  try { localStorage.setItem(COUNT_KEY, String(n)); } catch {}
}

async function loadOnboarded() {
  try { return localStorage.getItem(ONBOARD_KEY) === "1"; } catch { return false; }
}

async function markOnboarded() {
  try { localStorage.setItem(ONBOARD_KEY, "1"); } catch {}
}

function loadEmail() {
  try { return localStorage.getItem(EMAIL_KEY) || ""; } catch { return ""; }
}

function saveEmail(email) {
  try { localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase()); } catch {}
}

/* ═══════════════════════════════════════════
   ANALYTICS / TRACKING
   ─────────────────────────────────────────
   Central trackEvent(name, data) function.

   Current outputs:
     1. console.log  — structured, easy to read in DevTools
     2. localStorage["yieldra_events"]  — persisted ring-buffer (last 200)

   To wire up Mixpanel / GA4 / Amplitude in the future:
     • Mixpanel:  mixpanel.track(name, payload)
     • GA4:       window.gtag('event', name, payload)
     • Amplitude: amplitude.track(name, payload)
     • Segment:   analytics.track(name, payload)
   All of them accept the same (name, object) signature — just
   uncomment the relevant line inside trackEvent below.
═══════════════════════════════════════════ */

let _sessionAnalysisCount = 0;   // mirror of React state for use outside components

function trackEvent(eventName, data = {}) {
  const payload = {
    event:      eventName,
    timestamp:  new Date().toISOString(),
    session_id: _getSessionId(),
    analysis_count: _sessionAnalysisCount,
    app_version: "4.0",
    data,
  };

  // 1. Structured console output — colour-coded by event type
  const style = {
    analysis_started:     "background:#1a5c38;color:#fff;padding:2px 6px;border-radius:4px",
    analysis_completed:   "background:#0e4028;color:#7ee8a2;padding:2px 6px;border-radius:4px",
    paywall_shown:        "background:#7a1a28;color:#fce8ec;padding:2px 6px;border-radius:4px",
    pro_clicked:          "background:#7c4f08;color:#fef4e0;padding:2px 6px;border-radius:4px",
    onboarding_completed: "background:#252825;color:#aab8aa;padding:2px 6px;border-radius:4px",
  }[eventName] || "background:#333;color:#fff;padding:2px 6px;border-radius:4px";

  console.log(`%c YIELDRA:${eventName} `, style, payload);

  // 2. Persist to localStorage ring-buffer
  try {
    const raw    = localStorage.getItem(EVENTS_KEY);
    const events = raw ? JSON.parse(raw) : [];
    events.push(payload);
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch { /* localStorage blocked — silent fail */ }

  // 3. ── Future integrations (uncomment to activate) ──────────────
  // if (typeof window.gtag === "function")
  //   window.gtag("event", eventName, { ...data, analysis_count: _sessionAnalysisCount });
  //
  // if (typeof window.mixpanel?.track === "function")
  //   window.mixpanel.track(eventName, payload);
  //
  // if (typeof window.amplitude?.track === "function")
  //   window.amplitude.track(eventName, payload);
  //
  // if (typeof window.analytics?.track === "function")
  //   window.analytics.track(eventName, payload);
}

/** Stable anonymous session ID (tab-scoped via sessionStorage) */
function _getSessionId() {
  try {
    const k = "yieldra:sid";
    let sid = sessionStorage.getItem(k);
    if (!sid) { sid = Math.random().toString(36).slice(2, 10); sessionStorage.setItem(k, sid); }
    return sid;
  } catch { return "unknown"; }
}

/** Dev helper: dump the full event log from localStorage */
// window.yieldraEvents = () => JSON.parse(localStorage.getItem("yieldra_events") || "[]");


function makeHistoryEntry(form, result) {
  return {
    id: Date.now().toString(),
    ts: Date.now(),
    ciudad: form.ciudad,
    precio: +form.precio,
    metros: +form.metros,
    alquiler: +form.alquiler,
    gastos: +form.gastos,
    estado: form.estado,
    estrategia: form.estrategia,
    score: result.total,
    verdict: result.verdict,
    vColor: result.vColor,
    vBg: result.vBg,
    rn: result.rn,
    rb: result.rb,
    fm: result.fm,
    pm2: result.pm2,
  };
}

function timeAgo(ts) {
  const d = (Date.now() - ts) / 1000;
  if (d < 60) return "ahora mismo";
  if (d < 3600) return `hace ${Math.floor(d/60)} min`;
  if (d < 86400) return `hace ${Math.floor(d/3600)} h`;
  if (d < 86400*7) return `hace ${Math.floor(d/86400)} días`;
  return new Date(ts).toLocaleDateString("es-ES", { day:"numeric", month:"short" });
}

/* ═══════════════════════════════════════════
   SCORING ENGINE
═══════════════════════════════════════════ */
function calcScore(d) {
  const { precio, metros, alquiler, gastos, estado, estrategia } = d;
  const ing = alquiler * 12;
  const pm2 = precio / metros;
  const rb  = (ing / precio) * 100;
  const rn  = ((ing - gastos) / precio) * 100;
  const fm  = (ing - gastos) / 12;
  const yg  = rn - 3.5;
  const pb  = rn > 0 ? Math.round(100 / rn) : 99;

  const pY = rn>=8?35:rn>=6.5?30:rn>=5?23:rn>=3.5?14:rn>=2?7:0;
  const pF = fm>=800?25:fm>=500?21:fm>=300?16:fm>=100?10:fm>=0?4:0;
  const pP = pm2<1200?20:pm2<2000?17:pm2<3000?12:pm2<4500?6:pm2<6500?2:0;
  const pE = estado==="nueva"?10:estado==="buena"?8:2;
  const pS = estrategia==="habitaciones"?10:estrategia==="tradicional"?7:5;
  const total = Math.min(100, Math.max(0, Math.round(pY+pF+pP+pE+pS)));

  let verdict, vColor, vBg, vDesc, vShort;
  if (total>=76)      { verdict="Operar";   vColor="#1a5c38"; vBg="#eaf6f0"; vShort="Estructura de retorno sólida"; vDesc="La estructura de rentabilidad justifica avanzar. Yield real, flujo de caja positivo y riesgo de entrada asumible. Procede a due diligence."; }
  else if (total>=58) { verdict="Negociar"; vColor="#7c4f08"; vBg="#fef4e0"; vShort="Potencial con precio desalineado"; vDesc="El activo tiene fundamentos, pero la entrada actual comprime el yield por debajo del umbral eficiente. Hay recorrido si se corrige el precio de adquisición."; }
  else                { verdict="Descartar";vColor="#7a1a28"; vBg="#fce8ec"; vShort="Retorno insuficiente para el riesgo"; vDesc="La ecuación rentabilidad/riesgo no justifica la inmovilización de capital en estas condiciones. El coste de oportunidad es demasiado alto."; }

  let risk, rColor, rBg;
  if (rn>=5.5&&fm>=350&&estado!=="reformar") { risk="Bajo";    rColor="#1a5c38"; rBg="#eaf6f0"; }
  else if (rn>=3||fm>=100)                   { risk="Moderado";rColor="#7c4f08"; rBg="#fef4e0"; }
  else                                        { risk="Alto";   rColor="#7a1a28"; rBg="#fce8ec"; }

  let action, actionSteps;
  if (total>=76) {
    action="Avanzar en due diligence · La estructura de retorno lo justifica";
    actionSteps=[
      `Encarga tasación independiente. El precio de referencia del modelo es ~${precio.toLocaleString()}€. Una desviación superior al 8% merece revisión.`,
      "Nota simple en el Registro de la Propiedad: verifica cargas, hipotecas, afecciones urbanísticas y titularidad.",
      `Presenta oferta con margen del 4–6%: entre ${Math.round(precio*.94).toLocaleString()}€ y ${Math.round(precio*.96).toLocaleString()}€. El mercado actual suele ceder sin resistencia prolongada.`,
      "Revisa ITE del edificio, derramas aprobadas pendientes y actas de comunidad de los últimos 3 años antes de firmar arras.",
    ];
  } else if (total>=65) {
    action="Negociar precio antes de comprometer capital";
    actionSteps=[
      `El precio de entrada necesita reducirse entre un 7 y un 9% para que la estructura de rentabilidad sea eficiente. Objetivo: ${Math.round(precio*.91).toLocaleString()}–${Math.round(precio*.93).toLocaleString()}€.`,
      "Palancas de negociación: precio/m² superior a la referencia de zona y yield neto comprimido respecto al mercado comparable.",
      `Con el precio objetivo, el yield neto pasaría al ${(((ing-gastos)/(precio*.91))*100).toFixed(1)}%. Estructuralmente más sólido.`,
      "Si el vendedor no cede, hay inventario equivalente en el mercado. La disciplina en el precio de entrada es la decisión más importante del proceso.",
    ];
  } else if (total>=45&&estado==="reformar") {
    action="Viable solo con reforma controlada y precio de entrada agresivo";
    actionSteps=[
      "El capex de reforma máximo asumible para que el activo sea eficiente es el 8–10% del precio de compra. Por encima, el retorno se destruye.",
      "Exige acceso a la propiedad para presupuesto detallado por partidas antes de firmar arras. Sin cifra real, no hay decisión.",
      "Negocia precio de compra y plazo de escritura en paralelo, no de forma secuencial.",
      "Sin ambas condiciones cumplidas (precio agresivo + reforma controlada), el riesgo de ejecución supera el retorno esperado.",
    ];
  } else {
    action="Descartar esta operación · El coste de oportunidad es demasiado alto";
    actionSteps=[
      `El precio de entrada (${Math.round(pm2).toLocaleString()}€/m²) no genera una estructura de rentabilidad compatible con el riesgo de un activo inmobiliario ilíquido.`,
      "El flujo de caja neto no cubre el coste de oportunidad del capital. Hay alternativas con mejor perfil riesgo/retorno.",
      "Define umbrales mínimos antes de analizar el siguiente activo: yield neto ≥5%, flujo mensual ≥300€, payback <20 años.",
      "Cada análisis evitado en un activo ineficiente es tiempo y capital disponible para la operación correcta.",
    ];
  }

  const strengths=[], risks=[];
  if (rb>=6)      strengths.push({t:"Yield bruto sobre umbral de mercado",d:`${rb.toFixed(1)}% bruto anual. Por encima de la media nacional (6.4%). Margen de absorción de gastos imprevistos.`});
  else            risks.push(   {t:"Compresión de yield bruto",d:`${rb.toFixed(1)}% bruto. Por debajo del umbral mínimo de eficiencia (6%). El activo parte con margen estructuralmente estrecho.`});
  if (rn>=5)      strengths.push({t:"Estructura de rentabilidad neta sólida",d:`${rn.toFixed(1)}% neto tras gastos. El activo genera retorno real sobre el capital invertido.`});
  else if (rn>=3) risks.push(   {t:"Margen neto comprimido",d:`${rn.toFixed(1)}% neto. Cualquier vacío, derrama o gasto no previsto deteriora el retorno de forma significativa.`});
  else            risks.push(   {t:"Yield neto insuficiente para el riesgo",d:`${rn.toFixed(1)}% no compensa la iliquidez ni el riesgo operativo de un activo inmobiliario.`});
  if (fm>=400)    strengths.push({t:"Flujo de caja positivo desde mes 1",d:`+${Math.round(fm)}€/mes netos. El activo se autofinancia con holgura y genera liquidez recurrente.`});
  else if (fm>=0) risks.push(   {t:"Flujo de caja ajustado",d:`+${Math.round(fm)}€/mes. Sin margen real ante vacíos, reparaciones o subidas de gastos comunitarios.`});
  else            risks.push(   {t:"Flujo de caja negativo",d:`${Math.round(fm)}€/mes. El activo requiere aportación mensual del inversor. Deteriora liquidez de cartera.`});
  if (pm2<2500)   strengths.push({t:"Precio de entrada alineado con mercado",d:`${Math.round(pm2).toLocaleString()}€/m². La estructura de costes de entrada es competitiva y permite yield eficiente.`});
  else if (pm2>4000) risks.push({t:"Precio de entrada desalineado con el yield",d:`${Math.round(pm2).toLocaleString()}€/m². El precio de adquisición comprime el yield neto y alarga el payback de forma significativa.`});
  if (estado==="nueva") strengths.push({t:"Activo sin capex de mantenimiento",d:"Obra nueva. Sin necesidad de inversión adicional en el corto plazo. Reduce el riesgo de desviación de retorno."});
  else if (estado==="reformar") risks.push({t:"Capex de reforma no contabilizado",d:"El coste real de reforma puede desviarse un 20–35% sobre el presupuesto inicial. Impacto directo en yield efectivo."});
  if (estrategia==="habitaciones") strengths.push({t:"Modelo de máxima densidad de ingresos",d:"Alquiler por habitaciones genera entre un 35 y 60% más de ingresos brutos que el modelo de arrendamiento completo."});
  if (yg>1.5) strengths.push({t:"Yield gap positivo respecto a renta fija",d:`+${yg.toFixed(1)}pp sobre el bono español a 10 años. La prima de riesgo inmobiliario queda justificada por el diferencial.`});
  else        risks.push(   {t:"Yield gap insuficiente",d:`Solo ${yg.toFixed(1)}pp sobre deuda soberana. El diferencial no compensa la iliquidez ni el riesgo operativo del activo.`});

  return {
    total, verdict, vColor, vBg, vDesc, vShort,
    risk, rColor, rBg, action, actionSteps, strengths, risks,
    pm2:Math.round(pm2), rb:rb.toFixed(2), rn:rn.toFixed(2),
    fm:Math.round(fm), pb:pb>40?">40":pb, yg:yg.toFixed(1),
    blocks:{pY,pF,pP,pE,pS}, raw:d,
  };
}

function calcSim(base, type) {
  const d = {...base.raw};
  if (type==="discount") d.precio = Math.round(d.precio*.90);
  if (type==="rent")     d.alquiler = Math.round(d.alquiler*1.10);
  return calcScore(d);
}

/* ═══════════════════════════════════════════
   MINI SCORE RING (for history rows)
═══════════════════════════════════════════ */
function MiniRing({ score, color, size=44 }) {
  const r = size/2-4, cx=size/2, cy=size/2;
  const circ = 2*Math.PI*r;
  const off  = circ - (score/100)*circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth="4"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
        transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+4} textAnchor="middle" fill="var(--ink)"
        fontSize="11" fontWeight="700" fontFamily="'Playfair Display',serif">{score}</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED SCORE RING (results)
═══════════════════════════════════════════ */
function Ring({ target, color, size=170 }) {
  const [cur, setCur] = useState(0);
  const raf = useRef();
  useEffect(() => {
    setCur(0); let t0=null;
    const run = ts => { if(!t0) t0=ts; const p=Math.min((ts-t0)/1400,1); const e=1-Math.pow(1-p,4); setCur(Math.round(e*target)); if(p<1) raf.current=requestAnimationFrame(run); };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  const r=size/2-13, cx=size/2, cy=size/2;
  const circ=2*Math.PI*r, off=circ-(cur/100)*circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color}/><stop offset="100%" stopColor={color} stopOpacity=".5"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--line)" strokeWidth="9"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#rg)" strokeWidth="9"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off}
        transform={`rotate(-90 ${cx} ${cy})`} filter="url(#glow)"/>
      <text x={cx} y={cy-5} textAnchor="middle" fill="var(--ink)" fontSize={size>140?36:26} fontWeight="700" fontFamily="'Playfair Display',serif">{cur}</text>
      <text x={cx} y={cy+16} textAnchor="middle" fill="var(--ink4)" fontSize="12" fontFamily="'Epilogue',sans-serif" fontWeight="600">/ 100</text>
    </svg>
  );
}

function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({length:12},(_,i)=>({id:i,color:["#1a5c38","#c0e4d0","#0c0e0c","#788878","#e9e4da"][i%5],left:`${8+i*7.5}%`,delay:`${(i*.06).toFixed(2)}s`,size:6+(i%3)*3}));
  return (
    <div style={{position:"absolute",top:0,left:0,right:0,pointerEvents:"none",overflow:"hidden",height:80}}>
      {pieces.map(p=><div key={p.id} className="confetti-piece" style={{left:p.left,background:p.color,width:p.size,height:p.size,animationDelay:p.delay}}/>)}
    </div>
  );
}

function Field({ label, err, children }) {
  return (
    <div>
      <label className="lbl">{label}</label>
      {children}
      {err && <div className="errtxt">Campo obligatorio</div>}
    </div>
  );
}

function SimMini({ label, sub, icon, base, result }) {
  const delta = result.total - base.total;
  const sign  = delta>=0?"+":"";
  const col   = delta>0?"var(--go)":delta<0?"var(--stop)":"var(--ink4)";
  return (
    <div className="card2" style={{padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{icon} {label}</div>
          <div style={{fontSize:11,color:"var(--ink4)",fontFamily:"var(--mono)"}}>{sub}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:28,fontWeight:700,color:col,fontFamily:"var(--serif)",lineHeight:1}}>{sign}{delta}</div>
          <div style={{fontSize:10,color:"var(--ink4)",fontWeight:700}}>PUNTOS</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[
          {l:"Yield neto",v:`${result.rn}%`,d:`${(parseFloat(result.rn)-parseFloat(base.rn)).toFixed(1)}pp`},
          {l:"Flujo/mes",v:`${result.fm>=0?"+":""}${result.fm.toLocaleString()}€`,d:`${result.fm-base.fm>=0?"+":""}${(result.fm-base.fm).toLocaleString()}€`},
          {l:"Score",v:result.total,d:`${sign}${delta}`},
        ].map(it=>(
          <div key={it.l} style={{background:"#fff",borderRadius:8,padding:"10px 12px",border:"1px solid var(--line)"}}>
            <div style={{fontSize:10,color:"var(--ink4)",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{it.l}</div>
            <div style={{fontSize:16,fontWeight:700,fontFamily:"var(--serif)",color:"var(--ink)"}}>{it.v}</div>
            <div style={{fontSize:11,fontWeight:600,marginTop:2,color:parseFloat(it.d)>0?"var(--go)":parseFloat(it.d)<0?"var(--stop)":"var(--ink5)"}}>{it.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HISTORY DRAWER
═══════════════════════════════════════════ */
function HistoryDrawer({ history, onClose, onLoad, onDelete, onClearAll }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const estrategiaLabel = { tradicional:"Alquiler", habitaciones:"Habitaciones", largo_plazo:"Revalorización" };
  const estadoLabel = { nueva:"Obra nueva", buena:"Buen estado", reformar:"Reforma" };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}/>
      <div className="drawer">
        {/* Head */}
        <div className="drawer-head">
          <div>
            <div style={{fontWeight:800,fontSize:16,letterSpacing:"-.01em"}}>Mis análisis</div>
            <div style={{fontSize:12,color:"var(--ink4)",marginTop:2}}>{history.length} análisis guardado{history.length!==1?"s":""}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {history.length>0 && (
              confirmClear
                ? <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:12,color:"var(--stop)",fontWeight:600}}>¿Seguro?</span>
                    <button className="btn-danger" onClick={()=>{onClearAll();setConfirmClear(false)}}>Sí, borrar</button>
                    <button className="btn-ghost" style={{padding:"6px 10px",fontSize:12}} onClick={()=>setConfirmClear(false)}>No</button>
                  </div>
                : <button className="btn-danger" onClick={()=>setConfirmClear(true)}>Borrar todo</button>
            )}
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {history.length === 0 ? (
            <div className="drawer-empty">
              <div style={{fontSize:48}}>📋</div>
              <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:500,color:"var(--ink)"}}>Sin análisis aún</div>
              <p style={{fontSize:14,color:"var(--ink4)",lineHeight:1.6,maxWidth:280}}>Cada análisis que ejecutes aparecerá aquí. Podrás volver a abrirlos y compararlos.</p>
            </div>
          ) : (
            <div>
              {history.map((entry, i) => (
                <div key={entry.id} className="hist-row" onClick={() => { onLoad(entry); onClose(); }}>
                  {/* Score ring */}
                  <div style={{marginRight:14,flexShrink:0}}>
                    <MiniRing score={entry.score} color={entry.vColor} size={44}/>
                  </div>

                  {/* Main info */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:14,color:"var(--ink)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>
                        {entry.ciudad||"Sin ubicación"}
                      </span>
                      <span className="hist-chip" style={{background:entry.vBg,color:entry.vColor}}>
                        {entry.verdict}
                      </span>
                    </div>
                    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                      <span style={{fontSize:11,color:"var(--ink4)",fontFamily:"var(--mono)"}}>
                        {(entry.precio/1000).toFixed(0)}k€ · {entry.metros}m²
                      </span>
                      <span style={{fontSize:11,color:"var(--ink4)"}}>
                        Yield {entry.rn}% · {entry.fm>=0?"+":""}{entry.fm?.toLocaleString()}€/mes
                      </span>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,color:"var(--ink5)",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>
                        {estrategiaLabel[entry.estrategia]||entry.estrategia}
                      </span>
                      <span style={{fontSize:10,color:"var(--ink5)"}}>·</span>
                      <span style={{fontSize:10,color:"var(--ink5)",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>
                        {estadoLabel[entry.estado]||entry.estado}
                      </span>
                      <span style={{fontSize:10,color:"var(--ink5)"}}>·</span>
                      <span style={{fontSize:10,color:"var(--ink5)"}}>{timeAgo(entry.ts)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="hist-actions" style={{marginLeft:8}}>
                    <button
                      className="close-btn"
                      title="Borrar"
                      onClick={e => { e.stopPropagation(); onDelete(entry.id); }}
                      style={{color:"var(--stop)",borderColor:"#e8c0c6"}}
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div style={{padding:"16px 20px",borderTop:"1px solid var(--line)",background:"var(--paper2)",flexShrink:0}}>
            <p style={{fontSize:11,color:"var(--ink5)",lineHeight:1.6}}>
              Los análisis se guardan automáticamente en este dispositivo. Máximo {MAX_HISTORY} guardados.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   SHARE MODAL — Sistema de compartición viral
═══════════════════════════════════════════ */
function ShareModal({ result, ciudad, estrategia, estado, onClose }) {
  const [copied, setCopied]     = useState(false);
  const [imgStatus, setImgStatus] = useState("idle"); // idle | generating | done | error
  const canvasRef = useRef();

  // ── Copy text optimizado por canal ──────────────────────────────
  const estrategiaLabel = { tradicional:"Alquiler residencial", habitaciones:"Por habitaciones", largo_plazo:"Revalorización" };
  const estadoLabel     = { nueva:"Obra nueva", buena:"Buen estado", reformar:"Necesita reforma" };

  const shortFrase = result.verdict === "Operar"
    ? "Estructura de rentabilidad sólida. Capital bien empleado."
    : result.verdict === "Negociar"
    ? "Fundamentos presentes. Entrada desalineada con el yield."
    : "Retorno insuficiente para el riesgo asumido.";

  const copyText = [
    `📊 Evaluación inmobiliaria · ${ciudad}`,
    ``,
    `Score Yieldra: ${result.total}/100 → ${result.verdict.toUpperCase()}`,
    ``,
    `Yield neto:   ${result.rn}%`,
    `Flujo neto:   ${result.fm >= 0 ? "+" : ""}${result.fm.toLocaleString()}€/mes`,
    `Precio/m²:    ${result.pm2.toLocaleString()}€`,
    `Riesgo:       ${result.risk}`,
    ``,
    `Yieldra detecta: ${shortFrase}`,
    ``,
    `Estrategia: ${estrategiaLabel[estrategia] || estrategia} · ${estadoLabel[estado] || estado}`,
    ``,
    `— Analizado con Yieldra · Motor de scoring inmobiliario`,
    `yieldra.app`,
  ].join("\n");

  const twitterText = `Acabo de evaluar un activo en ${ciudad} con @YieldraApp\n\nScore: ${result.total}/100 → ${result.verdict}\nYield neto: ${result.rn}% · Flujo: ${result.fm >= 0 ? "+" : ""}${result.fm.toLocaleString()}€/mes\n\n"${shortFrase}"\n\n#InversiónInmobiliaria #PropTech`;

  const whatsappText = `*Evaluación inmobiliaria · ${ciudad}*\n\nScore Yieldra: *${result.total}/100 → ${result.verdict}*\n\n• Yield neto: ${result.rn}%\n• Flujo mensual: ${result.fm >= 0 ? "+" : ""}${result.fm.toLocaleString()}€\n• Precio/m²: ${result.pm2.toLocaleString()}€\n\n_"${shortFrase}"_\n\nAnalizado con Yieldra`;

  // ── Canvas image generator ───────────────────────────────────────
  const generateImage = async () => {
    setImgStatus("generating");
    trackEvent("share_clicked", { share_type: "image", score: result.total, verdict: result.verdict, ciudad });
    try {
      const W = 800, H = 440;
      const canvas = canvasRef.current;
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = "#0c0e0c";
      ctx.fillRect(0, 0, W, H);

      // Top accent line (verdict color)
      ctx.fillStyle = result.vColor;
      ctx.fillRect(0, 0, W, 4);

      // Subtle grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // Glow
      const grd = ctx.createRadialGradient(W * 0.2, H * 0.3, 0, W * 0.2, H * 0.3, 280);
      grd.addColorStop(0, result.vColor + "18"); grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);

      // ── Yieldra logo area ──
      ctx.fillStyle = result.vColor;
      roundRect(ctx, 36, 32, 30, 30, 7);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px 'Georgia', serif";
      ctx.textAlign = "center";
      ctx.fillText("Y", 51, 52);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 15px 'Georgia', serif";
      ctx.textAlign = "left";
      ctx.fillText("Yieldra", 74, 52);

      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.font = "11px 'Georgia', serif";
      ctx.fillText("Análisis inmobiliario para decisiones de capital", 74, 68);

      // ── Header: ciudad + tipo ──
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "700 11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("EVALUACIÓN INMOBILIARIA", W - 36, 50);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${estrategiaLabel[estrategia] || estrategia} · ${estadoLabel[estado] || estado}`, W - 36, 68);

      // ── Divider ──
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(36, 94); ctx.lineTo(W - 36, 94); ctx.stroke();

      // ── Score big ──
      ctx.fillStyle = result.vColor;
      ctx.font = "bold 96px 'Georgia', serif";
      ctx.textAlign = "left";
      ctx.fillText(result.total, 36, 210);

      // Score label
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("/ 100", 36, 228);

      // ── Verdict badge ──
      const badgeX = 36, badgeY = 244;
      ctx.fillStyle = result.vColor + "28";
      roundRect(ctx, badgeX, badgeY, 130, 28, 6);
      ctx.fill();
      ctx.fillStyle = result.vColor;
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(result.verdict.toUpperCase(), badgeX + 65, badgeY + 18);

      // ── Ciudad ──
      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px 'Georgia', serif";
      ctx.textAlign = "left";
      // truncate city if too long
      const cityTxt = ciudad.length > 28 ? ciudad.slice(0, 28) + "…" : ciudad;
      ctx.fillText(cityTxt, 36, 314);

      // ── Short frase ──
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "14px 'Georgia', serif";
      const words = shortFrase.split(" ");
      let line = "", lineY = 340;
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > 340 && line) {
          ctx.fillText(line.trim(), 36, lineY); line = word + " "; lineY += 20;
        } else { line = test; }
      }
      ctx.fillText(line.trim(), 36, lineY);

      // ── Divider vertical ──
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(430, 112); ctx.lineTo(430, H - 36); ctx.stroke();

      // ── Metrics ──
      const metrics = [
        { l: "YIELD NETO",    v: `${result.rn}%`,   good: +result.rn >= 5 },
        { l: "FLUJO MENSUAL", v: `${result.fm >= 0 ? "+" : ""}${result.fm.toLocaleString()}€`, good: result.fm >= 300 },
        { l: "PRECIO/M²",    v: `${result.pm2.toLocaleString()}€`, good: result.pm2 < 3000 },
        { l: "YIELD GAP",    v: `${parseFloat(result.yg) > 0 ? "+" : ""}${result.yg}pp`, good: parseFloat(result.yg) > 1.5 },
      ];

      metrics.forEach((m, i) => {
        const col = i < 2 ? 454 : 638;
        const row = i % 2 === 0 ? 128 : 264;
        // Card bg
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        roundRect(ctx, col, row, 162, 100, 10);
        ctx.fill();
        // Label
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "700 9px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(m.l, col + 14, row + 22);
        // Value
        ctx.fillStyle = m.good ? result.vColor : "rgba(255,255,255,0.8)";
        ctx.font = "bold 26px 'Georgia', serif";
        ctx.fillText(m.v, col + 14, row + 60);
        // Indicator dot
        ctx.fillStyle = m.good ? result.vColor : "#7c4f08";
        ctx.beginPath(); ctx.arc(col + 14, row + 80, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = "10px sans-serif";
        ctx.fillText(m.good ? "En rango" : "Bajo umbral", col + 24, row + 84);
      });

      // ── Risk badge ──
      ctx.fillStyle = result.rColor + "22";
      roundRect(ctx, 454, H - 70, 100, 24, 5);
      ctx.fill();
      ctx.fillStyle = result.rColor;
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`RIESGO ${result.risk.toUpperCase()}`, 504, H - 53);

      // ── Bottom domain ──
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("yieldra.app", W - 36, H - 20);

      // ── Bottom left date ──
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.textAlign = "left";
      ctx.fillText(new Date().toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" }), 36, H - 20);

      setImgStatus("done");

      // Download
      const link = document.createElement("a");
      link.download = `yieldra-${result.verdict.toLowerCase()}-${ciudad.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      trackEvent("analysis_shared", { share_type: "image", score: result.total, verdict: result.verdict, ciudad });
    } catch (err) {
      console.error("Canvas error:", err);
      setImgStatus("error");
    }
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const copyTo = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(false), 2200);
      trackEvent("analysis_shared", { share_type: type, score: result.total, verdict: result.verdict, ciudad });
      trackEvent("share_clicked",   { share_type: type, score: result.total, verdict: result.verdict });
    });
  };

  const shareNative = () => {
    if (!navigator.share) return;
    navigator.share({ title: `Evaluación Yieldra · ${ciudad}`, text: copyText })
      .then(() => trackEvent("analysis_shared", { share_type: "native", score: result.total, verdict: result.verdict, ciudad }));
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(12,14,12,.6)",backdropFilter:"blur(5px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",overflowY:"auto"}}
      onClick={onClose}>
      <div className="card pop" style={{width:"100%",maxWidth:480,position:"relative",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>

        {/* Top accent */}
        <div style={{height:3,background:`linear-gradient(90deg, ${result.vColor}, transparent)`,width:"100%"}}/>

        <div style={{padding:"28px 28px 0"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
            <div>
              <div style={{fontFamily:"var(--serif)",fontSize:19,fontWeight:500,marginBottom:2}}>Compartir evaluación</div>
              <div style={{fontSize:12,color:"var(--ink4)"}}>Elige el formato para cada canal</div>
            </div>
            <button onClick={onClose} style={{background:"var(--paper2)",border:"1px solid var(--line2)",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:13,color:"var(--ink3)",flexShrink:0}}>✕</button>
          </div>

          {/* Preview card */}
          <div style={{background:"var(--ink)",borderRadius:14,padding:"20px",marginBottom:20,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${result.vColor},transparent)`}}/>
            {/* Header row */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:20,height:20,background:result.vColor,borderRadius:5,display:"grid",placeItems:"center",fontSize:10,fontWeight:800,color:"#fff"}}>V</div>
                <span style={{fontWeight:700,fontSize:13,color:"#fff"}}>Yieldra</span>
              </div>
              <span style={{fontSize:10,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:".08em",fontWeight:700}}>Eval. inmobiliaria</span>
            </div>
            {/* Location */}
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>{ciudad}</div>
            {/* Score + verdict */}
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
              <div>
                <div style={{fontFamily:"var(--serif)",fontSize:54,fontWeight:700,color:result.vColor,lineHeight:1}}>{result.total}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:600}}>/ 100</div>
              </div>
              <div>
                <div style={{display:"inline-flex",alignItems:"center",gap:6,background:result.vColor+"22",border:`1px solid ${result.vColor}44`,borderRadius:6,padding:"4px 12px",marginBottom:6}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:result.vColor,display:"inline-block"}}/>
                  <span style={{fontSize:12,fontWeight:800,color:result.vColor,textTransform:"uppercase",letterSpacing:".06em"}}>{result.verdict}</span>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.4,maxWidth:220}}>{shortFrase}</div>
              </div>
            </div>
            {/* Metrics row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[
                {l:"Yield neto",  v:`${result.rn}%`},
                {l:"Flujo/mes",  v:`${result.fm>=0?"+":""}${result.fm.toLocaleString()}€`},
                {l:"Precio/m²",  v:`${result.pm2.toLocaleString()}€`},
              ].map(it=>(
                <div key={it.l} style={{background:"rgba(255,255,255,.05)",borderRadius:8,padding:"10px 10px"}}>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>{it.l}</div>
                  <div style={{fontSize:17,fontWeight:700,color:"#fff",fontFamily:"var(--serif)"}}>{it.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel buttons */}
          <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:20}}>

            {/* Copy general */}
            <button className="btn-cta" style={{fontSize:14,padding:"13px 20px"}}
              onClick={() => copyTo(copyText, "copy")}>
              {copied==="copy" ? "✓ Copiado al portapapeles" : "📋 Copiar análisis completo"}
            </button>

            {/* Image download */}
            <button className="btn-ghost" style={{width:"100%",fontSize:13,gap:8}}
              onClick={generateImage} disabled={imgStatus==="generating"}>
              {imgStatus==="generating"
                ? <><span style={{animation:"spin .8s linear infinite",display:"inline-block"}}>◌</span> Generando imagen…</>
                : imgStatus==="done"
                ? "✓ Imagen descargada"
                : imgStatus==="error"
                ? "Error · Inténtalo de nuevo"
                : "🖼 Descargar imagen para redes"}
            </button>

            {/* Channel-specific copy */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              <button className="btn-ghost" style={{fontSize:12,padding:"10px 0",justifyContent:"center"}}
                onClick={() => copyTo(whatsappText, "whatsapp")}>
                {copied==="whatsapp" ? "✓" : "💬"} WhatsApp
              </button>
              <button className="btn-ghost" style={{fontSize:12,padding:"10px 0",justifyContent:"center"}}
                onClick={() => copyTo(twitterText, "twitter")}>
                {copied==="twitter" ? "✓" : "𝕏"} Twitter / X
              </button>
            </div>

            {/* Native share (mobile) */}
            {typeof navigator !== "undefined" && navigator.share && (
              <button className="btn-ghost" style={{width:"100%",fontSize:13}}
                onClick={shareNative}>
                📤 Compartir directamente (móvil)
              </button>
            )}
          </div>
        </div>

        {/* Footer disclaimer */}
        <div style={{background:"var(--paper2)",borderTop:"1px solid var(--line)",padding:"12px 28px",display:"flex",gap:8,alignItems:"flex-start"}}>
          <span style={{fontSize:12,color:"var(--ink5)",flexShrink:0,marginTop:1}}>ℹ</span>
          <p style={{fontSize:11,color:"var(--ink5)",lineHeight:1.6,margin:0}}>Al compartir, el análisis no incluye datos personales. Solo se comparten las métricas del activo y el scoring de Yieldra.</p>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{display:"none"}}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════ */
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const next = () => step<2 ? setStep(s=>s+1) : onDone();
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(12,14,12,.6)",backdropFilter:"blur(6px)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div className="card pop" style={{width:"100%",maxWidth:400,padding:"36px 32px",textAlign:"center",position:"relative"}}>
        <button onClick={onDone} style={{position:"absolute",top:14,right:14,background:"none",border:"none",color:"var(--ink5)",fontSize:12,cursor:"pointer",fontFamily:"var(--ff)",fontWeight:600}}>Saltar →</button>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:32}}>
          {[0,1,2].map(i=><div key={i} style={{width:i===step?20:7,height:7,borderRadius:4,background:i<=step?"var(--go)":"var(--line)",transition:"all .3s"}}/>)}
        </div>
        <div style={{fontSize:44,marginBottom:14}}>{["🔍","⚡","✅"][step]}</div>
        <div style={{fontFamily:"var(--serif)",fontSize:22,fontWeight:500,marginBottom:10}}>{["¿Cómo funciona Yieldra?","Motor de decisión real","Tus análisis, guardados"][step]}</div>
        <p style={{fontSize:14,color:"var(--ink3)",lineHeight:1.75,marginBottom:28,minHeight:68}}>
          {["Yieldra evalúa la estructura real de rentabilidad de cualquier activo en segundos. Introduce los datos, el modelo hace el resto.","No es una calculadora. Es un modelo propietario que combina yield, riesgo, flujo de caja y benchmark de zona para producir un veredicto accionable: Operar, Negociar o Descartar.","Cada evaluación queda guardada en tu historial. Vuelve a abrirlas, compáralas y compártelas cuando quieras."][step]}
        </p>
        <button className="btn-cta" style={{fontSize:15}} onClick={next}>
          {step<2?"Siguiente →":"Empezar mi análisis gratis →"}
        </button>
        {step===0&&<div style={{fontSize:12,color:"var(--ink5)",marginTop:10}}>Sin registro · 2 análisis gratuitos</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   EMAIL GATE — captura ligera pre-paywall
   Aparece una sola vez antes del paywall.
   Completamente opcional: cerrar → paywall.
═══════════════════════════════════════════ */
function EmailGate({ analysisCount, onSubmit, onSkip }) {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isValid = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const submit = () => {
    if (!isValid(email)) { setError("Introduce un email válido"); return; }
    setError("");
    saveEmail(email);
    trackEvent("email_captured", { method: "email", analysis_count: analysisCount });
    setSent(true);
    setTimeout(() => onSubmit(email.trim().toLowerCase()), 1200);
  };

  const googleSimulated = () => {
    setGoogleLoading(true);
    // Simulates Google OAuth popup — in production replace with real flow
    setTimeout(() => {
      const fakeEmail = "usuario@gmail.com";
      saveEmail(fakeEmail);
      trackEvent("email_captured", { method: "google", analysis_count: analysisCount });
      setSent(true);
      setTimeout(() => onSubmit(fakeEmail), 800);
    }, 1100);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:490,
      background:"rgba(12,14,12,.52)", backdropFilter:"blur(5px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div className="card pop" style={{width:"100%", maxWidth:420, overflow:"hidden", position:"relative"}}>
        {/* Top accent */}
        <div style={{height:3, background:"linear-gradient(90deg,var(--go),var(--go-md))", width:"100%"}}/>

        <div style={{padding:"32px 28px"}}>
          {/* Close */}
          <button onClick={onSkip} style={{
            position:"absolute", top:16, right:16,
            background:"var(--paper2)", border:"1px solid var(--line2)",
            borderRadius:8, width:28, height:28, cursor:"pointer",
            fontSize:13, color:"var(--ink4)", display:"grid", placeItems:"center",
          }}>✕</button>

          {sent ? (
            /* ── Success state ── */
            <div style={{textAlign:"center", padding:"12px 0"}}>
              <div style={{fontSize:40, marginBottom:14}}>✅</div>
              <div style={{fontFamily:"var(--serif)", fontSize:21, fontWeight:500, marginBottom:8}}>Listo. Te guardamos el sitio.</div>
              <div style={{fontSize:14, color:"var(--ink4)", lineHeight:1.6}}>Abriendo tu acceso a Yieldra Pro…</div>
            </div>
          ) : (
            <>
              {/* Icon + heading */}
              <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:20}}>
                <div style={{
                  width:44, height:44, borderRadius:12, background:"var(--go-lt)",
                  border:"1px solid var(--go-md)", display:"grid", placeItems:"center", fontSize:20, flexShrink:0,
                }}>📬</div>
                <div>
                  <div style={{fontFamily:"var(--serif)", fontSize:19, fontWeight:500, lineHeight:1.2}}>Guarda tus análisis.<br/>Accede más tarde.</div>
                </div>
              </div>

              {/* Value props */}
              <div style={{background:"var(--paper2)", border:"1px solid var(--line)", borderRadius:10, padding:"14px 16px", marginBottom:20}}>
                <div style={{fontSize:12, color:"var(--ink3)", lineHeight:1.75}}>
                  {[
                    "Tus evaluaciones quedan guardadas en tu cuenta.",
                    "Recibe comparativas de activos según tu perfil.",
                    "Accede a tus informes desde cualquier dispositivo.",
                  ].map((t,i) => (
                    <div key={i} style={{display:"flex", gap:8, alignItems:"flex-start", marginBottom: i<2?6:0}}>
                      <span style={{color:"var(--go)", fontSize:12, flexShrink:0, marginTop:1}}>✓</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google button */}
              <button onClick={googleSimulated} disabled={googleLoading} style={{
                width:"100%", background:"#fff", border:"1.5px solid var(--line2)",
                borderRadius:10, padding:"12px 16px", cursor: googleLoading ? "not-allowed":"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                fontSize:14, fontWeight:600, color:"var(--ink2)", fontFamily:"var(--ff)",
                marginBottom:12, transition:"border-color .15s, box-shadow .15s",
                boxShadow:"0 1px 3px rgba(12,14,12,.06)",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--ink3)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(12,14,12,.1)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--line2)"; e.currentTarget.style.boxShadow="0 1px 3px rgba(12,14,12,.06)"; }}>
                {googleLoading
                  ? <><span style={{animation:"spin .7s linear infinite", display:"inline-block"}}>◌</span> Conectando…</>
                  : <>
                    {/* Google G SVG */}
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continuar con Google
                  </>
                }
              </button>

              {/* Divider */}
              <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:12}}>
                <div style={{flex:1, height:1, background:"var(--line)"}}/>
                <span style={{fontSize:12, color:"var(--ink5)", fontWeight:500}}>o con tu email</span>
                <div style={{flex:1, height:1, background:"var(--line)"}}/>
              </div>

              {/* Email input */}
              <div style={{marginBottom:12}}>
                <div style={{display:"flex", gap:8}}>
                  <input
                    type="email"
                    className="inp"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    style={{flex:1}}
                  />
                  <button className="btn-cta" onClick={submit} style={{width:"auto", padding:"0 20px", fontSize:14, whiteSpace:"nowrap"}}>
                    Guardar →
                  </button>
                </div>
                {error && <div style={{fontSize:11, color:"var(--stop)", marginTop:6, fontWeight:600}}>{error}</div>}
              </div>

              {/* Skip */}
              <div style={{textAlign:"center"}}>
                <button onClick={onSkip} style={{
                  background:"none", border:"none", cursor:"pointer",
                  fontSize:12, color:"var(--ink5)", fontFamily:"var(--ff)",
                  textDecoration:"underline", textUnderlineOffset:2,
                }}>
                  Continuar sin guardar →
                </button>
              </div>

              {/* Privacy note */}
              <div style={{marginTop:14, fontSize:11, color:"var(--ink5)", textAlign:"center", lineHeight:1.5}}>
                Sin spam. Sin terceros. Solo para enviarte tus informes.<br/>
                Puedes eliminarlo en cualquier momento.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


function Paywall({ lastResult, userEmail, onUnlock }) {
  const [hovered, setHovered] = useState(null);

  const PLANS = [
    {
      id:"monthly",
      label:"Mensual",
      price:"9",
      period:"/mes",
      badge:null,
      desc:"Sin permanencia",
      cta:"Empezar gratis 14 días →",
      highlight:false,
    },
    {
      id:"annual",
      label:"Anual",
      price:"6",
      period:"/mes",
      badge:"Ahorra 36€",
      desc:"Facturado como 72€/año",
      cta:"Empezar gratis 14 días →",
      highlight:true,
    },
  ];

  const FEATURES = [
    { icon:"∞",  title:"Evaluaciones ilimitadas",      desc:"Sin límites por plan. Evalúa todas las operaciones que necesites antes de comprometer capital." },
    { icon:"📍", title:"Benchmark de zona",             desc:"Compara el activo con el mercado real de su barrio: precio/m², yield medio y liquidez histórica." },
    { icon:"📄", title:"Informe PDF de inversión",      desc:"Documento estructurado listo para presentar a banco, socio o asesor fiscal." },
    { icon:"🔔", title:"Alertas por perfil inversor",   desc:"Recibe notificación cuando un activo cuadre con tus criterios de yield, precio y zona." },
    { icon:"⚖️", title:"Comparador de activos",         desc:"Pon hasta 5 activos en paralelo. Decide cuál tiene mejor estructura de retorno." },
    { icon:"🔌", title:"API para profesionales",        desc:"Integra el motor de scoring en tu portal, CRM o herramienta de análisis." },
  ];

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,overflowY:"auto",background:"var(--paper)"}}>
      {/* Top bar */}
      <div style={{position:"sticky",top:0,zIndex:10,borderBottom:"1px solid var(--line)",background:"rgba(248,247,243,.97)",backdropFilter:"blur(16px)",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:24,height:24,background:"var(--ink)",borderRadius:6,display:"grid",placeItems:"center"}}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="var(--paper)" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{fontWeight:800,fontSize:15,letterSpacing:"-.02em"}}>Yieldra</span>
          <span style={{background:"var(--ink)",color:"var(--paper)",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:100,textTransform:"uppercase",letterSpacing:".08em"}}>Pro</span>        </div>
        <button onClick={onUnlock} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"var(--ink4)",fontFamily:"var(--ff)",fontWeight:600,padding:"6px 12px"}}>
          ← Volver sin desbloquear
        </button>
      </div>

      <div style={{maxWidth:760,margin:"0 auto",padding:"56px 24px 80px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:48}}>
          {/* Limit reached badge */}
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--stop-lt)",border:"1px solid #e8c0c6",borderRadius:100,padding:"6px 16px",marginBottom:24}}>
            <span style={{fontSize:14}}>🔒</span>
            <span style={{fontSize:12,fontWeight:700,color:"var(--stop)",textTransform:"uppercase",letterSpacing:".08em"}}>Límite gratuito alcanzado</span>
          </div>

          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,5vw,44px)",fontWeight:500,lineHeight:1.1,marginBottom:16,letterSpacing:"-.02em"}}>
            {userEmail
              ? <>Accede a Yieldra Pro.<br/><em style={{color:"var(--go)"}}>Evaluaciones de capital sin límite.</em></>
              : <>Accede a Yieldra Pro.<br/><em style={{color:"var(--go)"}}>Los inversores serios analizan más de un activo.</em></>
            }
          </h1>
          <p style={{fontSize:16,color:"var(--ink3)",lineHeight:1.7,maxWidth:480,margin:"0 auto 32px"}}>
            Los inversores que optimizan su rentabilidad evalúan entre 5 y 15 activos antes de comprometer capital. Con Yieldra Pro, ese proceso no tiene límite ni fricción.
          </p>

          {/* Social proof strip */}
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:24,flexWrap:"wrap",marginBottom:40}}>
            {[{n:"2.400+",l:"inversores activos"},{n:"97%",l:"renuevan Pro cada año"},{n:"12×",l:"activos evaluados antes de comprar"}].map(s=>(
              <div key={s.n} style={{textAlign:"center"}}>
                <div style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:700,color:"var(--ink)"}}>{s.n}</div>
                <div style={{fontSize:12,color:"var(--ink4)",fontWeight:500}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Last result preview (blurred) — only if they ran an analysis */}
        {lastResult && (
          <div style={{marginBottom:40,position:"relative"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12,textAlign:"center"}}>Tu última evaluación · Informe completo bloqueado</div>
            <div style={{position:"relative",borderRadius:16,overflow:"hidden"}}>
              {/* Blurred preview */}
              <div style={{filter:"blur(6px)",pointerEvents:"none",userSelect:"none",background:"#fff",border:"1px solid var(--line)",borderRadius:16,padding:"24px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[{l:"Score",v:`${lastResult.total}/100`},{l:"Yield neto",v:`${lastResult.rn}%`},{l:"Flujo/mes",v:`${lastResult.fm>=0?"+":""}${lastResult.fm?.toLocaleString()}€`},{l:"Precio/m²",v:`${lastResult.pm2?.toLocaleString()}€`},{l:"Riesgo",v:lastResult.risk},{l:"Veredicto",v:lastResult.verdict}].map(m=>(
                  <div key={m.l} style={{background:"var(--paper2)",borderRadius:10,padding:"14px"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>{m.l}</div>
                    <div style={{fontSize:20,fontWeight:700,fontFamily:"var(--serif)",color:"var(--ink)"}}>{m.v}</div>
                  </div>
                ))}
              </div>
              {/* Lock overlay */}
              <div style={{position:"absolute",inset:0,background:"rgba(248,247,243,.7)",backdropFilter:"blur(1px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,borderRadius:16}}>
                <div style={{fontSize:28}}>🔒</div>
                <div style={{fontWeight:700,fontSize:14,color:"var(--ink)"}}>Informe de inversión bloqueado</div>
                <div style={{fontSize:12,color:"var(--ink4)"}}>Activa Pro para acceder al plan de acción, estructura de rentabilidad y análisis de sensibilidad</div>
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:40,maxWidth:540,margin:"0 auto 40px"}}>
          {PLANS.map(plan=>(
            <div
              key={plan.id}
              onClick={() => {
                trackEvent("pro_clicked", { plan: plan.id, price: plan.price, trigger: "plan_card" });
                onUnlock(plan.id);
              }}
              onMouseEnter={()=>setHovered(plan.id)}
              onMouseLeave={()=>setHovered(null)}
              style={{
                background: plan.highlight ? "var(--ink)" : "#fff",
                border: `2px solid ${plan.highlight ? "var(--ink)" : hovered===plan.id ? "var(--ink3)" : "var(--line2)"}`,
                borderRadius:16,padding:"24px 20px",cursor:"pointer",
                transition:"all .15s",position:"relative",
                transform: hovered===plan.id ? "translateY(-2px)" : "none",
                boxShadow: hovered===plan.id ? "0 8px 24px rgba(12,14,12,.12)" : "none",
              }}
            >
              {plan.badge && (
                <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"var(--go)",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:100,textTransform:"uppercase",letterSpacing:".08em",whiteSpace:"nowrap"}}>
                  {plan.badge}
                </div>
              )}
              <div style={{fontSize:12,fontWeight:700,color:plan.highlight?"rgba(255,255,255,.5)":"var(--ink4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>{plan.label}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
                <span style={{fontFamily:"var(--serif)",fontSize:40,fontWeight:700,color:plan.highlight?"#fff":"var(--ink)",lineHeight:1}}>{plan.price}€</span>
                <span style={{fontSize:13,color:plan.highlight?"rgba(255,255,255,.4)":"var(--ink4)",fontWeight:400}}>{plan.period}</span>
              </div>
              <div style={{fontSize:11,color:plan.highlight?"rgba(255,255,255,.3)":"var(--ink5)",marginBottom:20}}>{plan.desc}</div>
              <button
                style={{
                  width:"100%",background:plan.highlight?"#7ee8a2":"var(--ink)",
                  color:plan.highlight?"var(--ink)":"var(--paper)",
                  border:"none",borderRadius:10,padding:"12px 0",
                  fontSize:13,fontWeight:800,cursor:"pointer",
                  fontFamily:"var(--ff)",
                }}
              >
                {plan.cta}
              </button>
              <div style={{fontSize:10,color:plan.highlight?"rgba(255,255,255,.22)":"var(--ink5)",textAlign:"center",marginTop:8}}>Sin tarjeta · Cancela cuando quieras</div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div style={{marginBottom:48}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:24,textAlign:"center"}}>Todo lo que incluye Pro</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
            {FEATURES.map(f=>(
              <div key={f.title} style={{background:"#fff",border:"1px solid var(--line)",borderRadius:14,padding:"20px 18px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:22,flexShrink:0}}>{f.icon}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:3}}>{f.title}</div>
                  <div style={{fontSize:12,color:"var(--ink4)",lineHeight:1.6}}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{background:"var(--paper2)",border:"1px solid var(--line)",borderRadius:16,padding:"24px 28px",marginBottom:40,textAlign:"center"}}>
          <div style={{display:"flex",gap:2,justifyContent:"center",marginBottom:10}}>{"★★★★★".split("").map((s,i)=><span key={i} style={{color:"#c8860a",fontSize:15}}>{s}</span>)}</div>
          <p style={{fontSize:15,color:"var(--ink2)",lineHeight:1.75,fontStyle:"italic",marginBottom:12,maxWidth:480,margin:"0 auto 12px"}}>
            "Con Pro analicé 11 pisos en 3 semanas. Compré el que tenía score 84. Lleva 8 meses alquilado al precio que estimé. La herramienta se pagó sola con el primer mes de alquiler."
          </p>
          <div style={{fontSize:13,fontWeight:700,color:"var(--ink3)"}}>Ricardo A. · Inversor particular · Sevilla</div>
        </div>

        {/* FAQ */}
        <div style={{marginBottom:48}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:20,textAlign:"center"}}>Preguntas frecuentes</div>
          {[
            {q:"¿Puedo cancelar en cualquier momento?", a:"Sí. Sin permanencia ni penalización. Cancelas desde tu cuenta en un clic y no se genera ningún cargo adicional."},
            {q:"¿Los 14 días gratis requieren tarjeta?", a:"No. Empiezas gratis y solo introducimos datos de pago si decides continuar con el plan de pago al finalizar el período."},
            {q:"¿Qué diferencia hay entre mensual y anual?", a:"El plan anual equivale a 6€/mes facturados como 72€/año. Ahorro de 36€ respecto al plan mensual, sin cambios en las funcionalidades."},
            {q:"¿Es útil para inversores particulares o solo para profesionales?", a:"El 78% de nuestros usuarios son inversores particulares con entre 1 y 5 activos en cartera o en proceso de primera compra. El modelo está diseñado para tomar decisiones de capital con información real, independientemente del tamaño del portfolio."},
          ].map((item,i)=>(
            <div key={i} style={{borderBottom:"1px solid var(--line)",padding:"16px 0"}}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--ink)",marginBottom:6}}>{item.q}</div>
              <div style={{fontSize:13,color:"var(--ink4)",lineHeight:1.7}}>{item.a}</div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div style={{textAlign:"center"}}>
          <button className="btn-cta" style={{maxWidth:380,fontSize:16,marginBottom:12}} onClick={()=>{
            trackEvent("pro_clicked", { plan: "annual", trigger: "final_cta" });
            onUnlock("annual");
          }}>
            Acceder a Yieldra Pro · 14 días gratis →
          </button>
          <div style={{fontSize:12,color:"var(--ink5)"}}>Sin tarjeta · Sin permanencia · Precio de lanzamiento</div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HISTORY BADGE (header button)
═══════════════════════════════════════════ */
function HistBadge({ count, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex",alignItems:"center",gap:7,
      background:"var(--paper2)",border:"1.5px solid var(--line2)",borderRadius:9,
      padding:"7px 12px",cursor:"pointer",transition:"all .15s",fontFamily:"var(--ff)",
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--ink3)";e.currentTarget.style.background="var(--paper3)"}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--line2)";e.currentTarget.style.background="var(--paper2)"}}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--ink3)" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="2" width="12" height="12" rx="2"/>
        <path d="M5 6h6M5 9h4"/>
      </svg>
      <span style={{fontSize:13,fontWeight:700,color:"var(--ink3)"}}>Mis análisis</span>
      {count>0&&<span style={{background:"var(--ink)",color:"var(--paper)",borderRadius:100,padding:"1px 7px",fontSize:11,fontWeight:700,minWidth:20,textAlign:"center"}}>{count}</span>}
    </button>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function Yieldra() {
  /* ui state */
  const [showOnboarding, setShowOnboarding]   = useState(false);
  const [showShare, setShowShare]             = useState(false);
  const [showHistory, setShowHistory]         = useState(false);
  const [showPaywall, setShowPaywall]         = useState(false);
  const [showEmailGate, setShowEmailGate]     = useState(false);
  const [showConfetti, setShowConfetti]       = useState(false);
  const [userEmail, setUserEmail]             = useState("");

  /* form */
  const [form, setForm] = useState({ precio:"", metros:"", ciudad:"", alquiler:"", gastos:"", estado:"buena", estrategia:"tradicional" });
  const [errs, setErrs] = useState({});

  /* analysis */
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [tab, setTab]               = useState("decision");
  const [analysisCount, setAnalysisCount] = useState(0);

  /* history */
  const [history, setHistory]         = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [storageStatus, setStorageStatus] = useState("idle"); // idle | saving | saved | error

  const resRef  = useRef();
  const formRef = useRef();

  /* ── Load history + count + onboarding on mount ── */
  useEffect(() => {
    Promise.all([loadHistory(), loadCount(), loadOnboarded()]).then(([h, c, onboarded]) => {
      setHistory(h);
      setAnalysisCount(c);
      _sessionAnalysisCount = c;
      setHistoryLoaded(true);
      if (!onboarded) setShowOnboarding(true);
    });
    const savedEmail = loadEmail();
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  /* ── Persist helpers ── */
  const persistHistory = useCallback(async (newList) => {
    setStorageStatus("saving");
    try {
      await saveHistory(newList.slice(0, MAX_HISTORY));
      setStorageStatus("saved");
      setTimeout(() => setStorageStatus("idle"), 1800);
    } catch {
      setStorageStatus("error");
      setTimeout(() => setStorageStatus("idle"), 3000);
    }
  }, []);

  /* ── Form helpers ── */
  const set  = k => e => setForm(f => ({...f, [k]:e.target.value}));
  const setV = (k,v) => setForm(f => ({...f, [k]:v}));

  const loadFromHistory = (entry) => {
    setForm({
      precio:    String(entry.precio),
      metros:    String(entry.metros),
      ciudad:    entry.ciudad,
      alquiler:  String(entry.alquiler),
      gastos:    String(entry.gastos),
      estado:    entry.estado,
      estrategia:entry.estrategia,
    });
    // Re-run the score so result panel shows immediately
    const r = calcScore({
      precio:entry.precio, metros:entry.metros, ciudad:entry.ciudad,
      alquiler:entry.alquiler, gastos:entry.gastos,
      estado:entry.estado, estrategia:entry.estrategia,
    });
    setResult(r);
    setTab("decision");
    setErrs({});
    setTimeout(() => resRef.current?.scrollIntoView({behavior:"smooth",block:"start"}), 100);
  };

  const loadExample = (ex) => {
    setForm({ precio:String(ex.precio), metros:String(ex.metros), ciudad:ex.ciudad, alquiler:String(ex.alquiler), gastos:String(ex.gastos), estado:ex.estado, estrategia:ex.estrategia });
    setResult(null); setErrs({});
    formRef.current?.scrollIntoView({behavior:"smooth",block:"start"});
  };

  const validate = () => {
    const e = {};
    if (!form.precio||isNaN(form.precio)||+form.precio<=0)      e.precio=true;
    if (!form.metros||isNaN(form.metros)||+form.metros<=0)      e.metros=true;
    if (!form.ciudad.trim())                                     e.ciudad=true;
    if (!form.alquiler||isNaN(form.alquiler)||+form.alquiler<=0)e.alquiler=true;
    if (form.gastos===""||isNaN(form.gastos)||+form.gastos<0)   e.gastos=true;
    return e;
  };

  const analizar = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    if (analysisCount >= MAX_FREE) {
      trackEvent("paywall_shown", { trigger: "analysis_blocked", analysis_count: analysisCount, has_email: !!userEmail });
      // Show email gate first if no email captured yet
      if (!userEmail) {
        setShowEmailGate(true);
      } else {
        setShowPaywall(true);
        setTimeout(() => window.scrollTo({top:0,behavior:"smooth"}), 50);
      }
      return;
    }

    // ── track start — use current count (pre-increment) ──
    const countAtStart = analysisCount;
    trackEvent("analysis_started", {
      ciudad:        form.ciudad,
      precio:        +form.precio,
      metros:        +form.metros,
      alquiler:      +form.alquiler,
      gastos:        +form.gastos,
      estado:        form.estado,
      estrategia:    form.estrategia,
      analysis_count: countAtStart,   // explicit: nth analysis this user is starting
    });

    setErrs({}); setLoading(true); setResult(null); setTab("decision");
    setTimeout(() => {
      const r = calcScore({
        precio:+form.precio, metros:+form.metros, ciudad:form.ciudad,
        alquiler:+form.alquiler, gastos:+form.gastos,
        estado:form.estado, estrategia:form.estrategia,
      });
      setResult(r);
      setLoading(false);
      const newCount = analysisCount + 1;
      _sessionAnalysisCount = newCount;   // keep module-level mirror in sync
      setAnalysisCount(newCount);
      saveCount(newCount);

      // ── track completion — newCount is already incremented ──
      trackEvent("analysis_completed", {
        ciudad:         form.ciudad,
        precio:         +form.precio,
        metros:         +form.metros,
        alquiler:       +form.alquiler,
        gastos:         +form.gastos,
        estado:         form.estado,
        estrategia:     form.estrategia,
        score:          r.total,
        verdict:        r.verdict,
        rent_neta:      parseFloat(r.rn),
        rent_bruta:     parseFloat(r.rb),
        flujo_mensual:  r.fm,
        precio_m2:      r.pm2,
        riesgo:         r.risk,
        analysis_count: newCount,
        is_last_free:   newCount >= MAX_FREE,
      });

      /* Save to history */
      const entry = makeHistoryEntry(form, r);
      setHistory(prev => {
        const next = [entry, ...prev.filter(h=>h.id!==entry.id)].slice(0, MAX_HISTORY);
        persistHistory(next);
        return next;
      });

      // If this was the last free analysis, show email gate or paywall after brief result view
      if (newCount >= MAX_FREE) {
        setTimeout(() => {
          trackEvent("paywall_shown", { trigger: "limit_reached", score: r.total, verdict: r.verdict });
          if (!userEmail) {
            setShowEmailGate(true);
          } else {
            setShowPaywall(true);
            window.scrollTo({top:0,behavior:"smooth"});
          }
        }, 3500);
      }

      if (r.verdict==="Operar") { setShowConfetti(true); setTimeout(()=>setShowConfetti(false),1200); }
      setTimeout(()=>resRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    }, 900);
  };

  const deleteEntry = (id) => {
    setHistory(prev => {
      const next = prev.filter(h=>h.id!==id);
      persistHistory(next);
      return next;
    });
  };

  const clearAll = () => {
    setHistory([]);
    persistHistory([]);
  };

  const ic = k => `inp${errs[k]?" err":""}`;
  const remaining = Math.max(0, MAX_FREE - analysisCount);

  /* ── Render ── */
  return (
    <>
      <CSS/>
      {showOnboarding && <Onboarding onDone={({ skipped, steps_seen })=>{
        setShowOnboarding(false);
        markOnboarded();
        trackEvent("onboarding_completed", { skipped, steps_seen });
      }}/>}
      {showEmailGate && (
        <EmailGate
          analysisCount={analysisCount}
          onSubmit={(email) => {
            setUserEmail(email);
            setShowEmailGate(false);
            setShowPaywall(true);
            window.scrollTo({top:0,behavior:"smooth"});
          }}
          onSkip={() => {
            trackEvent("email_gate_skipped", { analysis_count: analysisCount });
            setShowEmailGate(false);
            setShowPaywall(true);
            window.scrollTo({top:0,behavior:"smooth"});
          }}
        />
      )}
      {showShare && result && <ShareModal result={result} ciudad={form.ciudad||"—"} estrategia={form.estrategia} estado={form.estado} onClose={()=>setShowShare(false)}/>}
      {showHistory && (
        <HistoryDrawer
          history={history}
          onClose={()=>setShowHistory(false)}
          onLoad={loadFromHistory}
          onDelete={deleteEntry}
          onClearAll={clearAll}
        />
      )}

      <div style={{minHeight:"100vh",background:"var(--paper)"}}>

        {/* ── TICKER ── */}
        <div className="ticker-track">
          <span style={{flexShrink:0,padding:"0 16px",fontSize:10,fontWeight:800,color:"#455044",textTransform:"uppercase",letterSpacing:".1em",borderRight:"1px solid #252825"}}>Live</span>
          <div className="ticker-inner">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=><span key={i} className="ticker-item">{t}</span>)}
          </div>
        </div>

        {/* ── HEADER ── */}
        <header style={{position:"sticky",top:0,zIndex:100,borderBottom:"1px solid var(--line)",background:"rgba(248,247,243,.95)",backdropFilter:"blur(16px)"}}>
          <div style={{maxWidth:980,margin:"0 auto",padding:"0 20px",height:58,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            {/* Logo */}
            <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
              <div style={{width:28,height:28,background:"var(--ink)",borderRadius:7,display:"grid",placeItems:"center"}}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="var(--paper)" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M8 1L8 15M2 5L14 11M14 5L2 11" stroke="var(--paper)" strokeWidth="1" strokeOpacity=".35"/>
                </svg>
              </div>
              <span style={{fontWeight:800,fontSize:16,letterSpacing:"-.02em"}}>Yieldra</span>
              <span className="hide-m" style={{fontSize:11,color:"var(--ink5)",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em"}}>Análisis inmobiliario para decisiones de capital</span>
            </div>

            {/* Right controls */}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {/* Storage status */}
              {storageStatus==="saving" && <span style={{fontSize:11,color:"var(--ink5)",fontWeight:600}} className="hide-m">Guardando…</span>}
              {storageStatus==="saved"  && <span style={{fontSize:11,color:"var(--go)",fontWeight:600}} className="hide-m">✓ Guardado</span>}
              {storageStatus==="error"  && <span style={{fontSize:11,color:"var(--stop)",fontWeight:600}} className="hide-m">Error al guardar</span>}

              {/* Email indicator — shown when email captured */}
              {userEmail && (
                <div className="hide-m" style={{display:"flex",alignItems:"center",gap:5,background:"var(--go-lt)",border:"1px solid var(--go-md)",borderRadius:8,padding:"4px 10px"}}>
                  <span style={{fontSize:10}}>✓</span>
                  <span style={{fontSize:11,fontWeight:600,color:"var(--go)",maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userEmail}</span>
                </div>
              )}

              {/* History button */}
              <HistBadge count={history.length} onClick={()=>setShowHistory(true)}/>

              {/* Analyses counter */}
              <div
                onClick={() => {
                  if (remaining === 0) {
                    trackEvent("paywall_shown", { trigger: "counter_pill", analysis_count: analysisCount });
                    setShowPaywall(true);
                  }
                }}
                style={{
                  display:"flex", alignItems:"center", gap:7,
                  background: remaining > 0 ? "var(--go-lt)" : "var(--stop-lt)",
                  border: `1px solid ${remaining > 0 ? "var(--go-md)" : "#e8c0c6"}`,
                  borderRadius:9, padding:"5px 11px",
                  cursor: remaining === 0 ? "pointer" : "default",
                  transition:"all .15s",
                }}>
                <div style={{display:"flex",gap:3}}>
                  {Array.from({length:MAX_FREE}).map((_,i) => (
                    <div key={i} style={{
                      width:7, height:7, borderRadius:"50%",
                      background: i < analysisCount
                        ? (remaining > 0 ? "var(--go)" : "var(--stop)")
                        : "var(--line2)",
                      transition:"background .3s",
                    }}/>
                  ))}
                </div>
                <span style={{fontSize:11, fontWeight:700, color: remaining > 0 ? "var(--go)" : "var(--stop)", whiteSpace:"nowrap"}}>
                  {remaining > 0 ? `${remaining} análisis gratis` : "Ver Pro →"}
                </span>
              </div>

              <button className="btn-ink" style={{padding:"7px 14px",fontSize:13}} onClick={()=>{
                trackEvent("paywall_shown", { trigger: "header_pro_button" });
                setShowPaywall(true);
              }}>Pro →</button>
            </div>
          </div>
        </header>

        <main style={{maxWidth:980,margin:"0 auto",padding:"0 20px 100px"}}>

          {/* ══════ HERO ══════ */}
          <section style={{paddingTop:60,paddingBottom:64,borderBottom:"1px solid var(--line)"}}>
            <div className="u1" style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
              <div className="dot-live"/>
              <span style={{fontSize:12,fontWeight:600,color:"var(--ink4)"}}>Yieldra · Modelo propietario · Basado en datos reales · +2.400 inversores activos</span>
            </div>
            <div className="u2">
              <h1 className="hero-h1" style={{fontFamily:"var(--serif)",fontSize:"clamp(36px,6vw,60px)",fontWeight:500,lineHeight:1.08,letterSpacing:"-.02em",color:"var(--ink)",marginBottom:18}}>
                Antes de comprometer capital,<br/>
                <em style={{fontStyle:"italic",color:"var(--go)"}}>analiza la operación.</em>
              </h1>
              <p style={{fontSize:17,color:"var(--ink3)",lineHeight:1.7,maxWidth:500,marginBottom:28}}>
                Yieldra evalúa la estructura real de rentabilidad, riesgo y mercado de cualquier activo en segundos. Decisiones de inversión respaldadas por datos, no por intuición.
              </p>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
                <div style={{display:"flex"}}>
                  {["CM","LP","JR","AR","MB"].map((a,i)=>(
                    <div key={a} style={{width:30,height:30,borderRadius:"50%",background:`hsl(${130+i*18},22%,${70+i*4}%)`,border:"2px solid var(--paper)",marginLeft:i?-10:0,display:"grid",placeItems:"center",fontSize:10,fontWeight:700,color:"var(--ink3)"}}>{a}</div>
                  ))}
                </div>
                <div>
                  <div style={{display:"flex",gap:2}}>{"★★★★★".split("").map((s,i)=><span key={i} style={{color:"#c8860a",fontSize:12}}>{s}</span>)}</div>
                  <div style={{fontSize:12,color:"var(--ink4)",fontWeight:500}}>4.9 · +2.400 inversores</div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:380}}>
                <button className="btn-cta" style={{fontSize:15}} onClick={()=>formRef.current?.scrollIntoView({behavior:"smooth",block:"start"})}>
                  <span>◆</span> Analizar un activo gratis
                </button>
                <div style={{display:"flex",gap:16,paddingLeft:4,flexWrap:"wrap"}}>
                  {["Sin registro","Resultado en segundos","Basado en datos reales"].map(t=>(
                    <div key={t} style={{display:"flex",gap:5,alignItems:"center",fontSize:12,color:"var(--ink4)",fontWeight:500}}>
                      <span style={{color:"var(--go)",fontSize:11}}>✓</span>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════ HOW IT WORKS ══════ */}
          <section style={{padding:"48px 0 40px",borderBottom:"1px solid var(--line)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:28,textAlign:"center"}}>Cómo funciona</div>
            <div className="g3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>
              {STEPS.map(s=>(
                <div key={s.n} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:"var(--ink)",color:"var(--paper)",display:"grid",placeItems:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{s.n}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{s.title}</div>
                    <div style={{fontSize:13,color:"var(--ink4)",lineHeight:1.6}}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════ HISTORY PREVIEW (if has history) ══════ */}
          {historyLoaded && history.length > 0 && (
            <section style={{padding:"40px 0 32px",borderBottom:"1px solid var(--line)"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:4}}>Mis análisis recientes</div>
                  <div style={{fontFamily:"var(--serif)",fontSize:18,fontWeight:500,color:"var(--ink)"}}>{history.length} análisis guardado{history.length!==1?"s":""}</div>
                </div>
                <button className="btn-ghost" style={{fontSize:13}} onClick={()=>setShowHistory(true)}>
                  Ver todos →
                </button>
              </div>

              {/* Last 3 entries preview */}
              <div className="card" style={{overflow:"hidden"}}>
                {history.slice(0,3).map((entry,i)=>(
                  <div
                    key={entry.id}
                    className="hist-row"
                    style={{borderBottom:i<Math.min(history.length,3)-1?"1px solid var(--line)":"none"}}
                    onClick={()=>loadFromHistory(entry)}
                  >
                    <div style={{marginRight:14,flexShrink:0}}>
                      <MiniRing score={entry.score} color={entry.vColor} size={44}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{entry.ciudad||"Sin ubicación"}</span>
                        <span className="hist-chip" style={{background:entry.vBg,color:entry.vColor}}>{entry.verdict}</span>
                      </div>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:"var(--ink4)",fontFamily:"var(--mono)"}}>{(entry.precio/1000).toFixed(0)}k€</span>
                        <span style={{fontSize:11,color:"var(--ink4)"}}>Yield {entry.rn}%</span>
                        <span style={{fontSize:11,color:"var(--ink4)"}}>{entry.fm>=0?"+":""}{entry.fm?.toLocaleString()}€/mes</span>
                        <span style={{fontSize:11,color:"var(--ink5)"}}>{timeAgo(entry.ts)}</span>
                      </div>
                    </div>
                    <div style={{fontSize:11,color:"var(--ink4)",flexShrink:0,marginLeft:8}}>Abrir →</div>
                  </div>
                ))}
              </div>
              {history.length > 3 && (
                <div style={{textAlign:"center",marginTop:12}}>
                  <button className="btn-ghost" style={{fontSize:12,padding:"8px 16px"}} onClick={()=>setShowHistory(true)}>
                    Ver {history.length-3} más →
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ══════ CASE STUDY ══════ */}
          <section style={{padding:"48px 0 40px",borderBottom:"1px solid var(--line)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:6}}>Caso real</div>
            <div style={{fontFamily:"var(--serif)",fontSize:"clamp(20px,4vw,28px)",fontWeight:500,marginBottom:28,maxWidth:560,lineHeight:1.2}}>{CASE_STUDY.title}</div>
            <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="card" style={{padding:24}}>
                <p style={{fontSize:14,color:"var(--ink3)",lineHeight:1.8,marginBottom:18}}>{CASE_STUDY.story}</p>
                {CASE_STUDY.details.map(d=>(
                  <div key={d.label} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--line)"}}>
                    <span style={{fontSize:12,color:"var(--ink4)",fontWeight:500}}>{d.label}</span>
                    <span style={{fontSize:12,fontWeight:700,fontFamily:"var(--mono)"}}>{d.value}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="card" style={{padding:22,borderTop:`3px solid ${CASE_STUDY.vColor}`,textAlign:"center"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Veredicto Yieldra</div>
                  <div style={{fontFamily:"var(--serif)",fontSize:64,fontWeight:700,color:CASE_STUDY.vColor,lineHeight:1}}>{CASE_STUDY.score}</div>
                  <div className="pill" style={{background:CASE_STUDY.vColor+"15",color:CASE_STUDY.vColor,marginTop:6}}>{CASE_STUDY.verdict}</div>
                </div>
                <div className="card2" style={{padding:18,flex:1}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--go)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Resultado</div>
                  <p style={{fontSize:13,color:"var(--ink3)",lineHeight:1.75}}>{CASE_STUDY.outcome}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ══════ SOCIAL PROOF ══════ */}
          <section style={{padding:"40px 0 48px",borderBottom:"1px solid var(--line)"}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:24,textAlign:"center"}}>Lo que dicen los inversores</div>
            <div className="g3-alt" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              {SOCIAL_PROOF.map((p,i)=>(
                <div key={i} className="card2" style={{padding:20}}>
                  <div style={{display:"flex",gap:2,marginBottom:8}}>{"★★★★★".split("").map((s,j)=><span key={j} style={{color:"#c8860a",fontSize:12}}>{s}</span>)}</div>
                  <p style={{fontSize:13,color:"var(--ink2)",lineHeight:1.75,marginBottom:12,fontStyle:"italic"}}>"{p.text}"</p>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"var(--ink)",color:"var(--paper)",display:"grid",placeItems:"center",fontSize:10,fontWeight:700}}>{p.avatar}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700}}>{p.name}</div>
                      <div style={{fontSize:11,color:"var(--ink4)"}}>Inversor · {p.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════ FORM ══════ */}
          <section ref={formRef} style={{paddingTop:48}}>
            {/* Examples */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Cargar caso de prueba</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {EXAMPLES.map((ex,i)=>(
                  <button key={i} className="share-btn" onClick={()=>loadExample(ex)}>
                    {ex.icon} {ex.label} <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink5)"}}>{(ex.precio/1000).toFixed(0)}k€</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{padding:"32px 28px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:500,marginBottom:3}}>Evaluación de activo</div>
                  <div style={{fontSize:13,color:"var(--ink4)"}}>Modelo propietario · Scoring basado en datos reales de mercado</div>
                </div>
                {remaining>0
                  ? <div style={{background:"var(--go-lt)",border:"1px solid var(--go-md)",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,color:"var(--go)"}}>{remaining} análisis gratuito{remaining>1?"s":""}</div>
                  : <div style={{background:"var(--stop-lt)",border:"1px solid #e8c0c6",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,color:"var(--stop)"}}>Límite · Activa Pro</div>
                }
              </div>

              <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <Field label="Precio de compra" err={errs.precio}>
                  <div className="inp-wrap"><input className={ic("precio")} type="number" placeholder="250.000" value={form.precio} onChange={set("precio")}/><span className="inp-unit">€</span></div>
                </Field>
                <Field label="Superficie" err={errs.metros}>
                  <div className="inp-wrap"><input className={ic("metros")} type="number" placeholder="75" value={form.metros} onChange={set("metros")}/><span className="inp-unit">m²</span></div>
                </Field>
                <Field label="Ubicación" err={errs.ciudad}>
                  <input className={ic("ciudad")} type="text" placeholder="Ciudad · Barrio" value={form.ciudad} onChange={set("ciudad")}/>
                </Field>
                <Field label="Renta mensual estimada" err={errs.alquiler}>
                  <div className="inp-wrap"><input className={ic("alquiler")} type="number" placeholder="1.200" value={form.alquiler} onChange={set("alquiler")}/><span className="inp-unit">€/mes</span></div>
                </Field>
                <Field label="Gastos anuales" err={errs.gastos}>
                  <div className="inp-wrap"><input className={ic("gastos")} type="number" placeholder="2.500" value={form.gastos} onChange={set("gastos")}/><span className="inp-unit">€/año</span></div>
                </Field>
                <Field label="Estado">
                  <select className="inp" value={form.estado} onChange={set("estado")}>
                    <option value="nueva">Obra nueva</option>
                    <option value="buena">Buen estado</option>
                    <option value="reformar">Necesita reforma</option>
                  </select>
                </Field>
              </div>

              <Field label="Tesis de inversión">
                <div className="strat-row" style={{display:"flex",gap:10}}>
                  {[
                    {v:"tradicional",e:"🏠",t:"Alquiler residencial",d:"Inquilino estable"},
                    {v:"habitaciones",e:"🛏",t:"Por habitaciones",d:"Máximo ingreso/m²"},
                    {v:"largo_plazo", e:"📐",t:"Revalorización",    d:"Horizonte >5 años"},
                  ].map(o=>(
                    <button key={o.v} className={`strat-btn${form.estrategia===o.v?" on":""}`} onClick={()=>setV("estrategia",o.v)}>
                      <div style={{fontSize:18,marginBottom:4}}>{o.e}</div>
                      <div style={{fontSize:13,fontWeight:700,color:form.estrategia===o.v?"var(--go)":"var(--ink)",marginBottom:1}}>{o.t}</div>
                      <div style={{fontSize:11,color:"var(--ink4)"}}>{o.d}</div>
                    </button>
                  ))}
                </div>
              </Field>

              <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid var(--line)"}}>
                <button className="btn-cta" onClick={analizar} disabled={loading} style={{fontSize:15}}>
                  {loading
                    ? <><span style={{animation:"spin .8s linear infinite",display:"inline-block"}}>◌</span> Evaluando estructura de rentabilidad…</>
                    : remaining>0 ? <><span>◆</span> Ejecutar evaluación</> : <><span>🔒</span> Activa Pro para continuar</>
                  }
                </button>
                <div style={{fontSize:12,color: remaining === 1 ? "var(--warn)" : "var(--ink5)",marginTop:8,textAlign:"center",fontWeight: remaining === 1 ? 600 : 400}}>
                  {remaining === 1
                    ? "⚠️ Última evaluación gratuita · Úsala para comparar antes de decidir"
                    : `Comparativa contra benchmark de zona · Scoring propietario Yieldra · ${history.length} evaluacion${history.length!==1?"es":""} en tu historial`}
                </div>
              </div>
            </div>
          </section>

          {/* ══════ RESULTS ══════ */}
          <div ref={resRef} style={{marginTop:28}}>
            {showPaywall && (
        <Paywall
          lastResult={result}
          userEmail={userEmail}
          onUnlock={() => setShowPaywall(false)}
        />
      )}

            {result && (
              <div style={{display:"flex",flexDirection:"column",gap:18}}>

                {/* LAST FREE ANALYSIS NOTICE */}
                {remaining === 0 && (
                  <div style={{background:"var(--warn-lt)",border:"1px solid #e8d0a0",borderRadius:12,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}} className="fade">
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <span style={{fontSize:16,flexShrink:0,marginTop:2}}>⚠️</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"var(--warn)",marginBottom:2}}>Has agotado tus evaluaciones gratuitas</div>
                        <div style={{fontSize:12,color:"var(--warn)",opacity:.85,lineHeight:1.5}}>Los inversores que usan Yieldra evalúan entre 5 y 10 activos antes de comprometer capital. Con 2 evaluaciones es difícil tener perspectiva de mercado.</div>
                      </div>
                    </div>
                    <button className="btn-ink" style={{fontSize:12,padding:"9px 18px",background:"var(--warn)",flexShrink:0}} onClick={()=>{
                      trackEvent("pro_clicked", { trigger: "limit_banner", ciudad: form.ciudad, score: result?.total, analysis_count: analysisCount });
                      setShowPaywall(true);
                      window.scrollTo({top:0,behavior:"smooth"});
                    }}>
                      Desbloquear Pro →
                    </button>
                  </div>
                )}

                {/* URGENCY — 1 left */}
                {remaining === 1 && (
                  <div style={{background:"var(--paper2)",border:"1px solid var(--line2)",borderRadius:12,padding:"12px 18px",display:"flex",alignItems:"center",gap:10}} className="fade">
                    <span style={{fontSize:14}}>⏳</span>
                    <div style={{flex:1}}>
                      <span style={{fontSize:13,fontWeight:700,color:"var(--ink)"}}>Te queda 1 evaluación gratuita.</span>
                      <span style={{fontSize:13,color:"var(--ink3)"}}> Úsala para comparar este activo con otra opción antes de decidir.</span>
                    </div>
                  </div>
                )}

                {/* VEREDICTO */}
                <div className="card pop" style={{padding:"36px 28px",borderTop:`3px solid ${result.vColor}`,position:"relative",overflow:"hidden"}}>
                  <Confetti active={showConfetti}/>
                  <div style={{position:"absolute",top:0,right:0,width:260,height:260,borderRadius:"50%",background:`radial-gradient(circle,${result.vColor}07 0%,transparent 65%)`,pointerEvents:"none"}}/>
                  <div className="score-hero-inner" style={{display:"flex",alignItems:"center",gap:36,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:240}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Evaluación Yieldra · Scoring propietario</div>
                      <div style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,34px)",fontWeight:500,lineHeight:1.15,marginBottom:12}}>
                        {result.verdict==="Operar"   &&<>Estructura sólida.<br/><em style={{color:"var(--go)"}}>Capital bien empleado.</em></>}
                        {result.verdict==="Negociar" &&<>Fundamentos presentes.<br/><em style={{color:"var(--warn)"}}>Entrada desalineada con el yield.</em></>}
                        {result.verdict==="Descartar"&&<>Retorno insuficiente.<br/><em style={{color:"var(--stop)"}}>El capital merece mejor destino.</em></>}
                      </div>
                      <p style={{fontSize:14,color:"var(--ink3)",lineHeight:1.7,maxWidth:360,marginBottom:12}}>{result.vDesc}</p>
                      <div style={{fontSize:13,color:"var(--ink4)",lineHeight:1.6,maxWidth:360,marginBottom:16,padding:"10px 14px",background:"var(--paper2)",borderRadius:8,borderLeft:"3px solid var(--line2)"}}>
                        Este tipo de decisiones mueven entre 150.000€ y 400.000€. Tenerlas respaldadas por datos no es opcional.
                      </div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                        <span className="pill" style={{background:result.vBg,color:result.vColor}}>
                          <span style={{width:6,height:6,borderRadius:"50%",background:result.vColor,display:"inline-block"}}/>
                          {result.verdict}
                        </span>
                        <span className="pill" style={{background:result.rBg,color:result.rColor}}>Riesgo {result.risk}</span>
                        <span className="pill" style={{background:"var(--paper2)",color:"var(--ink3)"}}>{form.ciudad||"—"}</span>
                      </div>
                      <div style={{display:"flex",gap:16,marginBottom:16,flexWrap:"wrap"}}>
                        <span style={{fontSize:11,color:"var(--ink5)",fontWeight:500}}>⏱ Evaluación generada en &lt;1.5s</span>
                        <span style={{fontSize:11,color:"var(--ink5)",fontWeight:500}}>◈ Comparativa contra benchmark de zona</span>
                        <span style={{fontSize:11,color:"var(--ink5)",fontWeight:500}}>◆ Modelo propietario Yieldra</span>
                      </div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <button className="share-btn" onClick={()=>{
                          trackEvent("share_clicked", { share_type: "open_modal", score: result.total, verdict: result.verdict, ciudad: form.ciudad });
                          setShowShare(true);
                        }}>📤 Compartir</button>
                        <button className="share-btn" onClick={()=>setShowHistory(true)}>
                          📋 Historial
                          {history.length>0&&<span style={{background:"var(--ink)",color:"var(--paper)",borderRadius:100,padding:"1px 6px",fontSize:10,fontWeight:700}}>{history.length}</span>}
                        </button>
                        <button className="share-btn" onClick={()=>{
                          if (remaining > 0) {
                            analizar();
                          } else {
                            trackEvent("pro_clicked", { trigger: "recalculate_locked", ciudad: form.ciudad, score: result?.total, analysis_count: analysisCount });
                            setShowPaywall(true);
                          }
                        }}>
                          {remaining > 0 ? "↺ Recalcular" : "🔒 Nuevo análisis"}
                        </button>
                      </div>
                    </div>
                    {/* Ring */}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,flexShrink:0}}>
                      <Ring target={result.total} color={result.vColor} size={160}/>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Composición</div>
                        <div style={{display:"flex",gap:7,justifyContent:"center"}}>
                          {[{l:"Yield",v:result.blocks.pY,max:35},{l:"Flujo",v:result.blocks.pF,max:25},{l:"Precio",v:result.blocks.pP,max:20},{l:"Estado",v:result.blocks.pE,max:10},{l:"Tesis",v:result.blocks.pS,max:10}].map(b=>(
                            <div key={b.l} style={{textAlign:"center",minWidth:32}}>
                              <div style={{fontSize:13,fontWeight:700,fontFamily:"var(--serif)",color:"var(--ink)"}}>{b.v}</div>
                              <div style={{fontSize:9,color:"var(--ink5)",fontWeight:700,textTransform:"uppercase"}}>{b.l}</div>
                              <div style={{height:3,background:"var(--line)",borderRadius:2,marginTop:3,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${(b.v/b.max)*100}%`,background:result.vColor,borderRadius:2,transition:"width 1s cubic-bezier(.16,1,.3,1)"}}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TABS */}
                <div style={{display:"flex",borderBottom:"1px solid var(--line)"}}>
                  {[{k:"decision",l:"Plan de acción"},{k:"metricas",l:"Estructura de rentabilidad"},{k:"escenarios",l:"Sensibilidad"}].map(t=>(
                    <button key={t.k} className={`tab-btn${tab===t.k?" on":""}`} onClick={()=>setTab(t.k)}>{t.l}</button>
                  ))}
                </div>

                {/* ACTIVATION: compare with another — only after 1st analysis, while free remain */}
                {analysisCount === 1 && remaining > 0 && (
                  <div className="fade card2" style={{padding:"22px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:220}}>
                      <div style={{fontWeight:700,fontSize:14,color:"var(--ink)",marginBottom:4}}>¿Tienes otro activo en mente?</div>
                      <div style={{fontSize:13,color:"var(--ink4)",lineHeight:1.6}}>
                        Un análisis aislado no da perspectiva. Compara este resultado con otra opción antes de decidir. Te queda <strong style={{color:"var(--go)"}}>{remaining} evaluación{remaining>1?"es":""} gratuita{remaining>1?"s":""}</strong>.
                      </div>
                    </div>
                    <button className="btn-ink" style={{fontSize:13,padding:"11px 20px",flexShrink:0}} onClick={()=>{
                      trackEvent("share_clicked", { share_type: "analyze_another", trigger: "activation_block", analysis_count: analysisCount });
                      formRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
                    }}>
                      Evaluar otro activo →
                    </button>
                  </div>
                )}

                {/* TAB: DECISIÓN */}
                {tab==="decision"&&(
                  <div className="fade" style={{display:"flex",flexDirection:"column",gap:14}}>
                    <div className="card" style={{padding:24}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Recomendación operativa · Criterio inversor</div>
                      <div style={{fontFamily:"var(--serif)",fontSize:19,fontWeight:500,marginBottom:18}}>{result.action}</div>
                      {result.actionSteps.map((s,i)=>(
                        <div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:i<result.actionSteps.length-1?"1px solid var(--line)":"none",alignItems:"flex-start"}}>
                          <div style={{width:22,height:22,borderRadius:"50%",background:"var(--ink)",color:"var(--paper)",display:"grid",placeItems:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</div>
                          <p style={{fontSize:13,color:"var(--ink2)",lineHeight:1.7,margin:0}}>{s}</p>
                        </div>
                      ))}
                    </div>
                    <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      <div className="card" style={{padding:22}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                          <div style={{fontWeight:700,fontSize:13,color:"var(--go)"}}>Vectores de valor</div>
                          <div className="pill" style={{background:"var(--go-lt)",color:"var(--go)"}}>{result.strengths.length}</div>
                        </div>
                        {result.strengths.map((s,i)=>(
                          <div key={i} className="swot-item">
                            <div style={{width:5,height:5,borderRadius:"50%",background:"var(--go)",flexShrink:0,marginTop:6}}/>
                            <div><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{s.t}</div><div style={{fontSize:12,color:"var(--ink4)",lineHeight:1.6}}>{s.d}</div></div>
                          </div>
                        ))}
                        {!result.strengths.length&&<div style={{fontSize:13,color:"var(--ink4)",fontStyle:"italic"}}>Sin fortalezas identificadas.</div>}
                      </div>
                      <div className="card" style={{padding:22}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                          <div style={{fontWeight:700,fontSize:13,color:"var(--stop)"}}>Factores de deterioro</div>
                          <div className="pill" style={{background:"var(--stop-lt)",color:"var(--stop)"}}>{result.risks.length}</div>
                        </div>
                        {result.risks.map((r,i)=>(
                          <div key={i} className="swot-item">
                            <div style={{width:5,height:5,borderRadius:"50%",background:"var(--stop)",flexShrink:0,marginTop:6}}/>
                            <div><div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{r.t}</div><div style={{fontSize:12,color:"var(--ink4)",lineHeight:1.6}}>{r.d}</div></div>
                          </div>
                        ))}
                        {!result.risks.length&&<div style={{fontSize:13,color:"var(--ink4)",fontStyle:"italic"}}>Sin riesgos identificados.</div>}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: MÉTRICAS */}
                {tab==="metricas"&&(
                  <div className="fade card" style={{padding:24}}>
                    <div className="g3" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
                      {[
                        {l:"Yield bruto",  v:`${result.rb}%`,  good:+result.rb>=6,  note:+result.rb>=6?"Por encima del umbral eficiente":"Compresión de yield bruto"},
                        {l:"Yield neto",   v:`${result.rn}%`,  good:+result.rn>=5,  note:+result.rn>=5?"Retorno real sobre capital":+result.rn>=3?"Margen comprimido":"Yield insuficiente para el riesgo"},
                        {l:"Flujo neto/mes",v:`${result.fm>=0?"+":""}${result.fm.toLocaleString()}€`,good:result.fm>=300,note:result.fm>=300?"Flujo de caja positivo y estable":result.fm>=0?"Flujo positivo pero ajustado":"Flujo de caja negativo"},
                        {l:"Precio/m²",   v:`${result.pm2.toLocaleString()}€`,good:result.pm2<2500,note:result.pm2<2500?"Entrada alineada con mercado":result.pm2<4000?"Precio medio-alto · Comprime yield":"Precio de entrada elevado"},
                        {l:"Payback neto", v:`${result.pb} años`,good:result.pb!==">40"&&result.pb<22,note:"Período de recuperación de la inversión"},
                        {l:"Yield gap",   v:`${parseFloat(result.yg)>0?"+":""}${result.yg}pp`,good:parseFloat(result.yg)>1.5,note:"Prima sobre bono español a 10 años"},
                      ].map(m=>(
                        <div key={m.l} style={{background:"var(--paper2)",border:"1px solid var(--line)",borderRadius:12,padding:"14px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>{m.l}</div>
                          <div style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:700,color:"var(--ink)",letterSpacing:"-.02em",marginBottom:4}}>{m.v}</div>
                          <div style={{fontSize:11,fontWeight:600,color:m.good?"var(--go)":"var(--warn)"}}>{m.good?"✓":"◈"} {m.note}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{borderTop:"1px solid var(--line)",paddingTop:20}}>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--ink4)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>Composición del scoring · Modelo propietario Yieldra</div>
                      {[
                        {l:"Yield neto",        v:result.blocks.pY,max:35,d:"Retorno real sobre el capital comprometido"},
                        {l:"Flujo de caja",      v:result.blocks.pF,max:25,d:"Liquidez mensual neta generada por el activo"},
                        {l:"Eficiencia de entrada",v:result.blocks.pP,max:20,d:"Alineación precio/m² con benchmark de zona"},
                        {l:"Estado del activo",  v:result.blocks.pE,max:10,d:"Capex inmediato y riesgo de mantenimiento"},
                        {l:"Tesis de inversión", v:result.blocks.pS,max:10,d:"Adecuación estrategia al perfil del activo"},
                      ].map(b=>(
                        <div key={b.l} className="metric-row">
                          <div style={{width:120,flexShrink:0}}>
                            <div style={{fontSize:12,fontWeight:600,marginBottom:1}}>{b.l}</div>
                            <div style={{fontSize:11,color:"var(--ink4)"}}>{b.d}</div>
                          </div>
                          <div style={{flex:1,height:5,background:"var(--line)",borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",borderRadius:3,width:`${(b.v/b.max)*100}%`,background:b.v/b.max>=.7?"var(--go)":b.v/b.max>=.4?"var(--warn)":"var(--stop)",transition:"width 1.1s cubic-bezier(.16,1,.3,1)"}}/>
                          </div>
                          <div style={{width:44,textAlign:"right",fontFamily:"var(--mono)",fontSize:12,fontWeight:600}}>{b.v}<span style={{fontSize:10,color:"var(--ink4)",fontWeight:400}}>/{b.max}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: ESCENARIOS */}
                {tab==="escenarios"&&(
                  <div className="fade" style={{display:"flex",flexDirection:"column",gap:12}}>
                    <p style={{fontSize:13,color:"var(--ink3)",lineHeight:1.7}}>Análisis de sensibilidad: cómo cambia la estructura de rentabilidad ante variaciones en las variables clave. Úsalo para determinar el margen de negociación antes de presentar oferta.</p>
                    <div className="sim-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <SimMini label="Reducción de precio de entrada –10%" sub={`Precio objetivo: ${Math.round(+form.precio*.9).toLocaleString()}€`} icon="◈" base={result} result={calcSim(result,"discount")}/>
                      <SimMini label="Optimización de renta +10%"  sub={`Renta objetivo: ${Math.round(+form.alquiler*1.1).toLocaleString()}€/mes`} icon="◆" base={result} result={calcSim(result,"rent")}/>
                    </div>
                    <div className="card2" style={{padding:"14px 18px"}}>
                      <p style={{fontSize:12,color:"var(--ink4)",lineHeight:1.7}}><strong style={{color:"var(--ink3)"}}>Nota metodológica:</strong> Los escenarios aplican variaciones simples sobre los datos introducidos. En la práctica, una negociación de precio puede implicar condiciones adicionales. Úsalos como referencia estratégica, no como proyección garantizada.</p>
                    </div>
                  </div>
                )}

                {/* CTA PRO */}
                <div className="card" style={{padding:"32px 28px",background:"var(--ink)",border:"1px solid var(--ink2)",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-40,right:-40,width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,92,56,.3) 0%,transparent 70%)",pointerEvents:"none"}}/>
                  <div className="pro-inner" style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap",position:"relative"}}>
                    <div style={{flex:1,minWidth:220}}>
                      <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:100,padding:"3px 10px",marginBottom:12}}>
                        <span style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.45)",textTransform:"uppercase",letterSpacing:".1em"}}>Yieldra Pro · Acceso completo</span>
                      </div>
                      <h3 style={{fontFamily:"var(--serif)",fontSize:22,fontWeight:500,color:"#fff",marginBottom:10,lineHeight:1.2}}>Evaluaciones ilimitadas.<br/><em style={{color:"#7ee8a2"}}>Capital mejor protegido.</em></h3>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,maxWidth:360}}>
                        {["Evaluaciones ilimitadas","Benchmark de zona en tiempo real","Informe PDF para banco o socio","Alertas de activos por perfil","Comparador de hasta 5 activos","API para portales e intermediarios"].map(f=>(
                          <div key={f} style={{display:"flex",gap:6,alignItems:"center"}}>
                            <span style={{color:"#7ee8a2",fontSize:11}}>✓</span>
                            <span style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.5}}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Precio mensual</div>
                        <div style={{fontFamily:"var(--serif)",fontSize:40,fontWeight:700,color:"#fff",lineHeight:1}}>9€</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:3}}>sin permanencia</div>
                      </div>
                      <button style={{background:"#7ee8a2",color:"var(--ink)",border:"none",borderRadius:9,padding:"12px 24px",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"var(--ff)",width:"100%",whiteSpace:"nowrap"}} onClick={()=>{
                        trackEvent("pro_clicked", { trigger: "results_cta_block", ciudad: form.ciudad, score: result?.total, analysis_count: analysisCount });
                        trackEvent("paywall_shown", { trigger: "results_cta_block", analysis_count: analysisCount });
                        setShowPaywall(true);
                      }}>
                        Empezar gratis 14 días →
                      </button>
                      <div style={{fontSize:10,color:"rgba(255,255,255,.22)"}}>Sin tarjeta · Cancela cuando quieras</div>
                    </div>
                  </div>
                </div>

                {/* HABIT BLOCK */}
                <div style={{background:"var(--paper2)",border:"1px solid var(--line)",borderRadius:14,padding:"20px 24px",display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{fontSize:22,flexShrink:0}}>📐</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--ink)",marginBottom:6}}>El proceso de un inversor estructurado</div>
                    <p style={{fontSize:13,color:"var(--ink4)",lineHeight:1.7,margin:0}}>
                      Los inversores con mayor rentabilidad media no compran el primer activo que parece bueno. Evalúan entre 8 y 15 opciones, comparan estructuras de retorno y solo avanzan cuando los datos lo justifican.
                      {remaining > 0
                        ? <> Tienes <strong style={{color:"var(--ink3)"}}>{remaining} evaluación{remaining>1?"es":""} gratuita{remaining>1?"s":""}</strong> disponible{remaining>1?"s":""}. Úsala{remaining>1?"s":""}.</>
                        : <> Con Yieldra Pro puedes hacer ese proceso sin límites.</>
                      }
                    </p>
                    {remaining > 0 ? (
                      <button className="share-btn" style={{marginTop:12,fontSize:12}} onClick={()=>formRef.current?.scrollIntoView({behavior:"smooth",block:"start"})}>
                        Evaluar otro activo →
                      </button>
                    ) : (
                      <button className="share-btn" style={{marginTop:12,fontSize:12}} onClick={()=>{
                        trackEvent("pro_clicked", { trigger: "habit_block", analysis_count: analysisCount });
                        setShowPaywall(true);
                        window.scrollTo({top:0,behavior:"smooth"});
                      }}>
                        Desbloquear evaluaciones ilimitadas →
                      </button>
                    )}
                  </div>
                </div>

                {/* Disclaimer */}
                <div style={{display:"flex",gap:9,alignItems:"flex-start",padding:"12px 0"}}>
                  <span style={{fontSize:12,color:"var(--ink5)",flexShrink:0}}>ℹ</span>
                  <p style={{fontSize:11,color:"var(--ink5)",lineHeight:1.7,margin:0}}><strong style={{fontWeight:700}}>Uso orientativo.</strong> El scoring de Yieldra es una herramienta de apoyo a la decisión de inversión. Los resultados se basan en los datos introducidos por el usuario y en un modelo de valoración simplificado. No constituyen asesoramiento financiero, fiscal ni inmobiliario en ninguna de sus formas. Antes de tomar cualquier decisión de inversión, consulta con un profesional cualificado y realiza tu propio proceso de due diligence.</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* FOOTER */}
        <footer style={{borderTop:"1px solid var(--line)",background:"var(--paper2)",padding:"24px 20px"}}>
          <div style={{maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:20,height:20,background:"var(--ink)",borderRadius:5,display:"grid",placeItems:"center"}}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="var(--paper)" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              <span style={{fontWeight:800,fontSize:13}}>Yieldra</span>
              <span style={{fontSize:11,color:"var(--ink5)"}}>Análisis inmobiliario para decisiones de capital · Madrid</span>
            </div>
            <div style={{display:"flex",gap:18}}>
              {["Privacidad","Términos","Metodología","Blog"].map(t=>(
                <span key={t} style={{fontSize:12,color:"var(--ink4)",cursor:"pointer",fontWeight:500}}>{t}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
