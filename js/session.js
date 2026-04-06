/**
 * =====================================================
 * SESSION.JS — Módulo global de sesión del estudiante
 * Guía de Electrocardiografía
 * =====================================================
 *
 * Responsabilidades:
 *   1. Guardar/leer identidad del alumno (nombre + matrícula)
 *   2. Registrar eventos de quiz (respuestas)
 *   3. Registrar eventos de autopercepción (Likert)
 *   4. Generar y descargar el CSV de aprovechamiento
 *
 * Almacenamiento: sessionStorage (dura mientras el navegador esté abierto)
 * Clave principal: 'ecg_session'
 * =====================================================
 */

(function () {
  'use strict';

  // ── Claves de almacenamiento ───────────────────────
  const KEY_SESSION  = 'ecg_session';
  const KEY_IDENTITY = 'ecg_identity';

  // ── Estructura de sesión vacía ─────────────────────
  function emptySession() {
    return {
      identity: { nombre: '', matricula: '' },
      startTime: new Date().toISOString(),
      quizEvents: [],      // respuestas de quiz
      likertEvents: []     // respuestas de autopercepción
    };
  }

  // ── Cargar sesión ──────────────────────────────────
  function loadSession() {
    try {
      const raw = sessionStorage.getItem(KEY_SESSION);
      return raw ? JSON.parse(raw) : emptySession();
    } catch { return emptySession(); }
  }

  // ── Guardar sesión ─────────────────────────────────
  function saveSession(s) {
    sessionStorage.setItem(KEY_SESSION, JSON.stringify(s));
  }

  // ── Cargar identidad persistente (localStorage) ───
  function loadIdentity() {
    try {
      const raw = localStorage.getItem(KEY_IDENTITY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  // ── Guardar identidad persistente ─────────────────
  function saveIdentity(nombre, matricula) {
    const id = { nombre, matricula };
    localStorage.setItem(KEY_IDENTITY, JSON.stringify(id));
    const s = loadSession();
    s.identity = id;
    saveSession(s);
  }

  // ── ¿Ya está identificado? ─────────────────────────
  function isIdentified() {
    const id = loadIdentity();
    return id && id.nombre && id.nombre.trim() !== '' && id.nombre !== 'Anónimo';
  }

  // ── Obtener identidad actual ───────────────────────
  function getIdentity() {
    const s = loadSession();
    if (s.identity && s.identity.nombre) return s.identity;
    const id = loadIdentity();
    if (id) { s.identity = id; saveSession(s); return id; }
    return { nombre: 'Anónimo', matricula: '' };
  }

  // ── Registrar respuesta de quiz ────────────────────
  function logQuizAnswer({
    capitulo, pregunta_num, pregunta_texto,
    respuesta_dada, fue_correcta, respuesta_correcta,
    tiempo_seg, reflexion_elegida, puntos, racha
  }) {
    const s = loadSession();
    s.quizEvents.push({
      tipo: 'quiz',
      timestamp: new Date().toISOString(),
      capitulo,
      pregunta_num,
      pregunta_texto: (pregunta_texto || '').substring(0, 80),
      respuesta_dada:      respuesta_dada     || '',
      fue_correcta:        fue_correcta ? 'SI' : 'NO',
      respuesta_correcta:  respuesta_correcta || '',
      tiempo_seg:          tiempo_seg         || 0,
      reflexion_elegida:   reflexion_elegida  || '',
      puntos:              puntos             || 0,
      racha:               racha              || 0
    });
    saveSession(s);
  }

  // ── Registrar autopercepción Likert ───────────────
  function logLikert({ capitulo, concepto, nivel_num, nivel_texto }) {
    const s = loadSession();
    s.likertEvents.push({
      tipo: 'autopercepcion',
      timestamp: new Date().toISOString(),
      capitulo,
      concepto,
      nivel_num,
      nivel_texto
    });
    saveSession(s);
  }

  // ── Calcular aprovechamiento por capítulo ──────────
  function calcAprovechamiento() {
    const s = loadSession();
    const caps = {};

    s.quizEvents.forEach(e => {
      const c = e.capitulo || 'General';
      if (!caps[c]) caps[c] = { correctas: 0, total: 0, puntos: 0, puntos_max: 0 };
      caps[c].total++;
      if (e.fue_correcta === 'SI') caps[c].correctas++;
      caps[c].puntos     += parseInt(e.puntos) || 0;
      caps[c].puntos_max += 100; // base por pregunta
    });

    return Object.entries(caps).map(([cap, d]) => ({
      capitulo:        cap,
      correctas:       d.correctas,
      total:           d.total,
      pct_correctas:   d.total ? Math.round(d.correctas / d.total * 100) : 0,
      puntos:          d.puntos,
      pct_ponderado:   d.puntos_max ? Math.round(d.puntos / d.puntos_max * 100) : 0
    }));
  }

  // ── Generar y descargar CSV ────────────────────────
  function exportCSV() {
    const s    = loadSession();
    const id   = getIdentity();
    const rows = [];

    // ── Encabezado ──
    rows.push([
      'Nombre', 'Matricula', 'Fecha_Inicio', 'Tipo',
      'Timestamp', 'Capitulo', 'Concepto_Pregunta',
      'Respuesta_Dada', 'Correcta', 'Respuesta_Correcta',
      'Tiempo_seg', 'Reflexion', 'Puntos', 'Racha',
      'Nivel_Likert', 'Nivel_Texto'
    ].join(','));

    const esc = v => `"${String(v || '').replace(/"/g, '""')}"`;
    const fmt = iso => iso ? iso.replace('T', ' ').substring(0, 19) : '';

    // ── Filas de Quiz ──
    s.quizEvents.forEach(e => {
      rows.push([
        esc(id.nombre),
        esc(id.matricula),
        esc(fmt(s.startTime)),
        'Quiz',
        esc(fmt(e.timestamp)),
        esc(e.capitulo),
        esc(e.pregunta_texto),
        esc(e.respuesta_dada),
        esc(e.fue_correcta),
        esc(e.respuesta_correcta),
        e.tiempo_seg,
        esc(e.reflexion_elegida),
        e.puntos,
        e.racha,
        '',
        ''
      ].join(','));
    });

    // ── Filas de Autopercepción ──
    s.likertEvents.forEach(e => {
      rows.push([
        esc(id.nombre),
        esc(id.matricula),
        esc(fmt(s.startTime)),
        'Autopercepcion',
        esc(fmt(e.timestamp)),
        esc(e.capitulo),
        esc(e.concepto),
        '', '', '', '', '', '', '',
        e.nivel_num,
        esc(e.nivel_texto)
      ].join(','));
    });

    // ── Filas de resumen por capítulo ──
    rows.push(''); // línea vacía
    rows.push('"--- RESUMEN DE APROVECHAMIENTO ---"');
    rows.push([
      '"Capitulo"','"Correctas"','"Total"',
      '"% Aciertos"','"Puntos"','"% Ponderado"'
    ].join(','));

    calcAprovechamiento().forEach(r => {
      rows.push([
        esc(r.capitulo),
        r.correctas,
        r.total,
        r.pct_correctas + '%',
        r.puntos,
        r.pct_ponderado + '%'
      ].join(','));
    });

    // ── Descargar ──
    const now      = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const filename = `ECG_${id.matricula || id.nombre}_${now}.csv`;
    const blob     = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url      = URL.createObjectURL(blob);
    const a        = document.createElement('a');
    a.href         = url;
    a.download     = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Limpiar sesión ────────────────────────────────
  function clearSession() {
    sessionStorage.removeItem(KEY_SESSION);
  }

  // ── Mostrar badge de identidad en el header ───────
  function renderIdentityBadge() {
    const id = getIdentity();
    if (!id || !id.nombre) return;

    // Buscar si ya existe
    if (document.getElementById('session-badge')) return;

    const badge = document.createElement('div');
    badge.id    = 'session-badge';
    badge.style.cssText = `
      display:flex; align-items:center; gap:6px;
      background:#0d2137; border:1px solid #1e3a5f;
      border-radius:20px; padding:4px 12px 4px 8px;
      font-size:.78rem; color:#c8d8e8; cursor:pointer;
      transition:border-color .2s; flex-shrink:0;
    `;
    badge.innerHTML = `
      <span style="font-size:.9rem">👤</span>
      <span id="badge-name">${id.nombre}</span>
      ${id.matricula ? `<span style="color:#607080">·</span><span style="color:#60c8ff">${id.matricula}</span>` : ''}
    `;
    badge.title = 'Clic para cambiar identificación';
    badge.addEventListener('click', () => showIdentityModal(true));
    badge.addEventListener('mouseenter', () => badge.style.borderColor = '#1976d2');
    badge.addEventListener('mouseleave', () => badge.style.borderColor = '#1e3a5f');

    // Insertar en header-right
    const hr = document.querySelector('.header-right');
    if (hr) hr.insertBefore(badge, hr.firstChild);
  }

  // ── Modal de identificación ───────────────────────
  function showIdentityModal(isUpdate = false) {
    if (document.getElementById('identity-modal')) return;

    const existing = loadIdentity();
    const modal    = document.createElement('div');
    modal.id       = 'identity-modal';
    modal.style.cssText = `
      position:fixed; inset:0; z-index:20000;
      display:flex; align-items:center; justify-content:center;
    `;
    modal.innerHTML = `
      <div style="position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px)"></div>
      <div style="
        position:relative; z-index:1;
        background:#0f1b2d; border:1px solid #1e3a5f;
        border-radius:16px; padding:32px 28px 24px;
        width:92%; max-width:420px;
        box-shadow:0 20px 60px rgba(0,0,0,.5);
        animation:lk-pop .25s ease;
      ">
        <div style="text-align:center; margin-bottom:20px">
          <div style="font-size:2.5rem;margin-bottom:8px">👤</div>
          <h2 style="color:#e0e6f0;font-size:1.2rem;margin-bottom:4px">
            ${isUpdate ? 'Actualizar identificación' : '¡Bienvenido/a!'}
          </h2>
          <p style="color:#8899aa;font-size:.85rem;line-height:1.5">
            ${isUpdate
              ? 'Puedes actualizar tus datos de identificación.'
              : 'Ingresa tus datos para que tu progreso quede registrado en el libro.'}
          </p>
        </div>

        <div style="margin-bottom:14px">
          <label style="display:block;color:#60c8ff;font-size:.78rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">
            Nombre completo *
          </label>
          <input id="id-nombre" type="text"
            value="${existing ? existing.nombre : ''}"
            placeholder="Ej. Ana García López"
            style="width:100%;background:#0d1f35;border:2px solid #1e3a5f;
                   border-radius:8px;padding:10px 14px;color:#e0e6f0;
                   font-family:inherit;font-size:.95rem;outline:none;box-sizing:border-box;
                   transition:border-color .2s"
            onfocus="this.style.borderColor='#1976d2'"
            onblur="this.style.borderColor='#1e3a5f'"
          />
        </div>

        <div style="margin-bottom:22px">
          <label style="display:block;color:#60c8ff;font-size:.78rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">
            Matrícula / ID
          </label>
          <input id="id-matricula" type="text"
            value="${existing ? existing.matricula : ''}"
            placeholder="Ej. 20230145"
            style="width:100%;background:#0d1f35;border:2px solid #1e3a5f;
                   border-radius:8px;padding:10px 14px;color:#e0e6f0;
                   font-family:inherit;font-size:.95rem;outline:none;box-sizing:border-box;
                   transition:border-color .2s"
            onfocus="this.style.borderColor='#1976d2'"
            onblur="this.style.borderColor='#1e3a5f'"
          />
        </div>

        <div id="id-error" style="display:none;color:#ef4444;font-size:.82rem;
             margin-bottom:10px;padding:8px 12px;background:#2a0a0a;border-radius:6px">
          Por favor ingresa al menos tu nombre.
        </div>

        <button onclick="window.ECGSession.confirmIdentity(${isUpdate})"
          style="width:100%;padding:12px;background:#1976d2;border:none;color:#fff;
                 border-radius:8px;font-size:.95rem;font-weight:700;cursor:pointer;
                 font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;
                 transition:background .2s"
          onmouseover="this.style.background='#1565c0'"
          onmouseout="this.style.background='#1976d2'">
          <i class="fas fa-check"></i>
          ${isUpdate ? 'Actualizar' : 'Comenzar sesión'}
        </button>

        ${isUpdate ? `
        <button onclick="document.getElementById('identity-modal').remove()"
          style="width:100%;margin-top:8px;padding:9px;background:transparent;
                 border:1px solid #1e3a5f;color:#607080;border-radius:8px;
                 font-family:inherit;font-size:.85rem;cursor:pointer">
          Cancelar
        </button>` : ''}
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('id-nombre')?.focus(), 100);

    // Enter para confirmar
    modal.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') window.ECGSession.confirmIdentity(isUpdate);
      });
    });
  }

  function confirmIdentity(isUpdate) {
    const nombre    = (document.getElementById('id-nombre')?.value    || '').trim();
    const matricula = (document.getElementById('id-matricula')?.value || '').trim();

    if (!nombre) {
      document.getElementById('id-error').style.display = 'block';
      return;
    }

    saveIdentity(nombre, matricula);
    document.getElementById('identity-modal')?.remove();

    // Actualizar badge si existe
    const badgeName = document.getElementById('badge-name');
    if (badgeName) {
      badgeName.textContent = nombre;
      const badge = document.getElementById('session-badge');
      if (badge && matricula) {
        badge.innerHTML = `
          <span style="font-size:.9rem">👤</span>
          <span id="badge-name">${nombre}</span>
          <span style="color:#607080">·</span>
          <span style="color:#60c8ff">${matricula}</span>
        `;
      }
    } else {
      renderIdentityBadge();
    }

    if (!isUpdate) {
      // Disparar evento para que la página reaccione
      document.dispatchEvent(new CustomEvent('ecg:identified', { detail: { nombre, matricula } }));
    }
  }

  // ── Inicialización automática ─────────────────────
  function init() {
    // Sincronizar identidad guardada a sesión
    const id = loadIdentity();
    if (id && id.nombre) {
      const s = loadSession();
      s.identity = id;
      saveSession(s);
    }

    // Renderizar badge si ya está identificado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (isIdentified()) renderIdentityBadge();
        else if (window.location.pathname.includes('index.html') ||
                 window.location.pathname === '/' ||
                 window.location.pathname.endsWith('/')) {
          // En portada: mostrar modal si no está identificado
          setTimeout(() => showIdentityModal(false), 600);
        }
        // En otros archivos: solo mostrar badge si ya está identificado
        if (isIdentified()) renderIdentityBadge();
      });
    } else {
      if (isIdentified()) renderIdentityBadge();
      else if (window.location.pathname.includes('index.html') ||
               window.location.pathname === '/' ||
               window.location.pathname.endsWith('/')) {
        setTimeout(() => showIdentityModal(false), 600);
      }
    }
  }

  // ── API pública ────────────────────────────────────
  window.ECGSession = {
    isIdentified,
    getIdentity,
    saveIdentity,
    logQuizAnswer,
    logLikert,
    calcAprovechamiento,
    exportCSV,
    clearSession,
    showIdentityModal,
    confirmIdentity,
    renderIdentityBadge
  };

  init();

})();
