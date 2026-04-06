// ============================================================
//  GUÍA DE ECG — JavaScript Principal
// ============================================================

// ------ TEMA OSCURO/CLARO -----------------------------------
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function applyTheme(dark) {
  if (dark) {
    body.classList.add('dark');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    body.classList.remove('dark');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
}

const savedTheme = localStorage.getItem('ecg-theme');
applyTheme(savedTheme === 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('ecg-theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

// ------ SIDEBAR TOGGLE (MÓVIL) ------------------------------
const menuToggle = document.getElementById('menuToggle');
const sidebar    = document.getElementById('sidebar');
const overlay    = document.getElementById('overlay');

function openSidebar()  {
  sidebar?.classList.add('open');
  overlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar?.classList.remove('open');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}

menuToggle?.addEventListener('click', () => {
  sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay?.addEventListener('click', closeSidebar);

// ------ MARCAR LINK ACTIVO EN SIDEBAR ----------------------
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

// ------ BÚSQUEDA -------------------------------------------
const searchIndex = [
  { title: 'Inicio', url: 'index.html',
    content: 'Guía de Electrocardiografía libro digital medicina ECG' },
  { title: 'Cap. 1 – Fundamentos Fisiológicos',  url: 'chapter-1.html',
    content: 'potencial de acción cardíaco despolarización repolarización nodo sinusal AV His Purkinje vectores cardíacos papel registro velocidad amplitud electrofisiología' },
  { title: 'Cap. 2 – Anatomía de las Derivaciones', url: 'chapter-2.html',
    content: 'plano frontal horizontal bipolares I II III unipolares aVR aVL aVF precordiales V1 V2 V3 V4 V5 V6 triángulo Einthoven hexaxial Bailey electrodos' },
  { title: 'Cap. 3 – Componentes del Trazado Normal', url: 'chapter-3.html',
    content: 'onda P complejo QRS onda T intervalo PR QT segmento ST auricular ventricular repolarización conducción isoeléctrica morfología normal' },
  { title: 'Cap. 4 – Metodología de Interpretación', url: 'chapter-4.html',
    content: 'frecuencia cardíaca ritmo sinusal eje eléctrico regla 300 1500 morfología sistemática bradicardia taquicardia análisis QRS frontal' },
  { title: 'Cap. 5 – Patologías Básicas y Patrones', url: 'chapter-5.html',
    content: 'hipertrofia auricular ventricular bloqueo rama derecha BRD izquierda BRI arritmia fibrilación flutter extrasístoles isquemia lesión infarto IAMCEST ST elevación descenso onda Q potasio calcio electrolitos' },
  { title: 'Cap. 6 – Talleres de Práctica', url: 'chapter-6.html',
    content: 'talleres práctica trazos reales algoritmos urgencias IAMCEST decisión rápida ejercicios casos clínicos quiz' },
];

const searchInput   = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput?.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) { searchResults?.classList.remove('visible'); return; }

  const hits = searchIndex.filter(item =>
    item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q)
  );

  if (!hits.length) {
    searchResults.innerHTML = '<div class="search-result-item"><span class="sr-title">Sin resultados</span></div>';
  } else {
    searchResults.innerHTML = hits.map(h => {
      const idx = h.content.toLowerCase().indexOf(q);
      const snippet = idx >= 0
        ? '…' + h.content.substring(Math.max(0, idx - 20), idx + 60) + '…'
        : h.content.substring(0, 80) + '…';
      return `<div class="search-result-item" onclick="location.href='${h.url}'">
                <div class="sr-title">${h.title}</div>
                <div class="sr-snippet">${snippet}</div>
              </div>`;
    }).join('');
  }
  searchResults?.classList.add('visible');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-box')) searchResults?.classList.remove('visible');
});

// ------ TOC ACTIVO AL HACER SCROLL -------------------------
function initTOC() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (!tocLinks.length) return;

  const headings = Array.from(document.querySelectorAll('.chapter-content h2, .chapter-content h3'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.toc-list a[href="#${id}"]`);
        active?.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(h => observer.observe(h));
}
initTOC();

// ------ PROGRESS BAR DE LECTURA ----------------------------
function initReadingProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 60px; left: 0; height: 3px;
    background: var(--accent); z-index: 2000; width: 0%;
    transition: width .1s linear;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const docH  = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = pct + '%';
  });
}
initReadingProgress();

// ------ LIGHTBOX PARA IMÁGENES ----------------------------
function initLightbox() {
  // Crear overlay si no existe
  if (!document.getElementById('lightboxOverlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'lightboxOverlay';
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-close" id="lightboxClose"><i class="fas fa-times"></i></button>
      <img id="lightboxImg" src="" alt=""/>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.closest('.lightbox-close')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Asignar click a todas las imágenes de capítulo
  document.querySelectorAll('.chapter-img').forEach(img => {
    img.addEventListener('click', () => {
      const overlay = document.getElementById('lightboxOverlay');
      const lbImg   = document.getElementById('lightboxImg');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}
initLightbox();

// ------ COPY CODE BLOCKS -----------------------------------
document.querySelectorAll('pre code').forEach(block => {
  const btn = document.createElement('button');
  btn.textContent = 'Copiar';
  btn.style.cssText = `
    position: absolute; top: 8px; right: 8px;
    background: var(--primary); color: #fff; border: none;
    border-radius: 4px; padding: 3px 10px; font-size: .75rem;
    cursor: pointer; opacity: .8;
  `;
  block.parentElement.style.position = 'relative';
  block.parentElement.appendChild(btn);
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(block.textContent).then(() => {
      btn.textContent = '¡Copiado!';
      setTimeout(() => btn.textContent = 'Copiar', 2000);
    });
  });
});

// ============================================================
//  ENVÍO DE SESIÓN — Modal global (header)
// ============================================================

/* ── Inyectar el modal en el DOM al cargar ── */
(function injectSendModal() {
  const tpl = document.createElement('div');
  tpl.innerHTML = `
    <div class="send-modal-overlay" id="sendModalOverlay" onclick="closeSendModalOnBg(event)">
      <div class="send-modal" role="dialog" aria-modal="true" aria-labelledby="sendModalTitle">

        <div class="send-modal-header">
          <div class="send-modal-icon">📤</div>
          <div style="flex:1">
            <div class="send-modal-title" id="sendModalTitle">Enviar sesión al profesor</div>
            <div class="send-modal-sub">Se enviará tu actividad de esta sesión</div>
          </div>
          <button onclick="closeSendModal()" title="Cerrar" style="
            background:none; border:none; cursor:pointer;
            color:#607080; font-size:1.3rem; line-height:1;
            padding:4px 6px; border-radius:6px;
            transition:all .15s; align-self:flex-start;
          " onmouseover="this.style.background='#1e2d40';this.style.color='#e0e6f0'"
             onmouseout="this.style.background='none';this.style.color='#607080'">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Resumen de la sesión -->
        <div class="send-session-summary" id="sendSummary">
          <div class="send-stat">
            <span class="send-stat-num" id="sendStatQuiz">—</span>
            <span class="send-stat-label">Respuestas de quiz</span>
          </div>
          <div class="send-stat">
            <span class="send-stat-num" id="sendStatLikert">—</span>
            <span class="send-stat-label">Autopercep. registradas</span>
          </div>
          <div class="send-stat">
            <span class="send-stat-num" id="sendStatName">—</span>
            <span class="send-stat-label">Estudiante</span>
          </div>
          <div class="send-stat">
            <span class="send-stat-num" id="sendStatTime">—</span>
            <span class="send-stat-label">Inicio de sesión</span>
          </div>
        </div>

        <!-- Estado / resultado del envío -->
        <div class="send-status" id="sendStatus"></div>

        <!-- Botón de envío -->
        <button class="send-btn-primary" id="sendBtn" onclick="submitSession()">
          <i class="fas fa-paper-plane"></i> Enviar mi sesión
        </button>
        <button class="send-btn-secondary" onclick="closeSendModal()">
          <i class="fas fa-times"></i> Cancelar
        </button>

        <!-- Nota informativa -->
        <p style="font-size:.72rem;color:#3a4a5a;text-align:center;margin-top:14px;line-height:1.5">
          🔒 Solo se envían datos de actividad académica (respuestas, tiempos, reflexiones).<br/>
          No se comparten datos personales más allá del nombre y matrícula que proporcionaste.
        </p>
      </div>
    </div>
  `;
  document.body.appendChild(tpl.firstElementChild);
})();

/* ── Actualizar indicador del botón según sesión activa ── */
function updateSendBtnIndicator() {
  const btn = document.getElementById('btnSendSession');
  if (!btn) return;
  try {
    const s = JSON.parse(sessionStorage.getItem('ecg_session') || '{}');
    const hasData = (s.quizEvents && s.quizEvents.length > 0) ||
                    (s.likertEvents && s.likertEvents.length > 0);
    btn.classList.toggle('has-data', !!hasData);
  } catch(e) {}
}

/* ── Abrir modal ── */
function openSendModal() {
  // Poblar resumen
  try {
    const s = JSON.parse(sessionStorage.getItem('ecg_session') || '{}');
    const quizN   = (s.quizEvents   || []).length;
    const likertN = (s.likertEvents || []).length;
    // session.js guarda la clave como 'identity' (no 'identidad')
    const id      = s.identity || s.identidad || {};
    // Si la sesión no tiene nombre, leer directamente de localStorage
    const nombre  = id.nombre || JSON.parse(localStorage.getItem('ecg_identity') || '{}').nombre || 'Anónimo';
    const start   = s.startTime ? new Date(s.startTime).toLocaleTimeString('es-MX', {hour:'2-digit',minute:'2-digit'}) : '—';
    document.getElementById('sendStatQuiz').textContent   = quizN;
    document.getElementById('sendStatLikert').textContent = likertN;
    document.getElementById('sendStatName').textContent   = nombre.split(' ')[0];
    document.getElementById('sendStatTime').textContent   = start;
  } catch(e) {}

  // Limpiar estado anterior
  const statusEl = document.getElementById('sendStatus');
  statusEl.className = 'send-status';
  statusEl.textContent = '';
  document.getElementById('sendBtn').disabled = false;
  document.getElementById('sendBtn').innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mi sesión';

  document.getElementById('sendModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Cerrar modal ── */
window.closeSendModal = function() {
  document.getElementById('sendModalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
window.closeSendModalOnBg = function(e) {
  if (e.target === document.getElementById('sendModalOverlay')) closeSendModal();
}

/* ── Enviar sesión ── */
window.submitSession = async function() {
  const btn      = document.getElementById('sendBtn');
  const statusEl = document.getElementById('sendStatus');

  // Verificar que hay datos
  let sessionData;
  try {
    sessionData = JSON.parse(sessionStorage.getItem('ecg_session') || '{}');
  } catch(e) { sessionData = {}; }

  const quizN   = (sessionData.quizEvents   || []).length;
  const likertN = (sessionData.likertEvents || []).length;

  if (quizN === 0 && likertN === 0) {
    statusEl.className   = 'send-status error';
    statusEl.textContent = '⚠️ No hay actividad registrada en esta sesión. Responde al menos una pregunta del quiz o completa una autopercepción primero.';
    return;
  }

  // Verificar identidad — session.js usa 'identity', compatibilizar con ambas variantes
  const identidad = sessionData.identity || sessionData.identidad
                    || JSON.parse(localStorage.getItem('ecg_identity') || '{}');
  if (!identidad.nombre || identidad.nombre.trim() === '' || identidad.nombre === 'Anónimo') {
    statusEl.className   = 'send-status error';
    statusEl.textContent = '⚠️ Necesitas identificarte primero. Ve a la portada y haz clic en el botón de identificación para ingresar tu nombre y matrícula.';
    return;
  }

  // Estado: enviando
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando…';
  statusEl.className   = 'send-status loading';
  statusEl.textContent = '📡 Conectando con el servidor…';

  // Construir payload
  const payload = {
    timestamp:   new Date().toISOString(),
    nombre:      identidad.nombre      || '',
    matricula:   identidad.matricula   || '',
    inicio:      sessionData.startTime || '',
    quizEvents:  sessionData.quizEvents   || [],
    likertEvents:sessionData.likertEvents || [],
    resumen:     window.calcResumenEnvio ? window.calcResumenEnvio(sessionData) : []
  };

  // — INTENTO DE ENVÍO — Google Sheets via Apps Script
  // IMPORTANTE: Reemplazar con tu URL real de Google Apps Script
  const ENDPOINT = window.ECG_GOOGLE_SHEETS_ENDPOINT || 'https://script.google.com/macros/s/AKfycbxbcSMnuqUjYjr3Ockrp6M8VlDyYngZUoYEpvNyxqNF3ewnJe99PpCSzdfu785c9RxWZw/exec';

  try {
    // Google Apps Script requiere text/plain para evitar preflight CORS
    const res = await fetch(ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(payload)
    });

    const resJson = await res.json().catch(() => ({}));
    if (res.ok && resJson.ok) {
      const fq = resJson.filas_quiz   || 0;
      const fl = resJson.filas_likert || 0;
      statusEl.className   = 'send-status success';
      statusEl.textContent = `✅ ¡Sesión enviada! Se registraron ${fq} respuesta(s) de quiz y ${fl} autopercepción(es) en Google Sheets.`;
      btn.innerHTML = '<i class="fas fa-check"></i> Enviado';
      // Marcar como enviado en sessionStorage
      try {
        const s = JSON.parse(sessionStorage.getItem('ecg_session') || '{}');
        s._sent = new Date().toISOString();
        sessionStorage.setItem('ecg_session', JSON.stringify(s));
      } catch(e) {}
    } else {
      throw new Error('HTTP ' + res.status);
    }
  } catch(err) {
    statusEl.className   = 'send-status error';
    statusEl.textContent = '❌ No se pudo enviar (sin conexión o endpoint no configurado). Contacta al profesor para configurar el destino de envío.';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-redo"></i> Reintentar';
  }
}

/* ── Calcular resumen para el payload ── */
window.calcResumenEnvio = function(s) {
  const caps = {};
  (s.quizEvents || []).forEach(e => {
    if (!caps[e.capitulo]) caps[e.capitulo] = { correctas: 0, total: 0, puntos: 0 };
    caps[e.capitulo].total++;
    if (e.fue_correcta === 'SI') caps[e.capitulo].correctas++;
    caps[e.capitulo].puntos += (e.puntos || 0);
  });
  return Object.entries(caps).map(([cap, d]) => ({
    capitulo: cap,
    correctas: d.correctas,
    total: d.total,
    pct: Math.round(d.correctas / d.total * 100) + '%',
    puntos: d.puntos
  }));
}

/* ── Init: actualizar indicador al cargar ── */
document.addEventListener('DOMContentLoaded', updateSendBtnIndicator);
// También actualizar cada vez que se regrese a la pestaña
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateSendBtnIndicator();
});
