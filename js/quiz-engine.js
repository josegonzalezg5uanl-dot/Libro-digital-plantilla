/* ==========================================================
   QUIZ ENGINE — Motor unificado para quizzes
   Lee configuración desde: js/quiz-config-N.js
   ========================================================== */

// Fallbacks si no existe configuración global
if (typeof window.DIFF_CONFIG === 'undefined') {
  window.DIFF_CONFIG = {
    suave:   { time: 60, lives: 3, bonus_mult: 1.0 },
    medio:   { time: 30, lives: 3, bonus_mult: 1.5 },
    intenso: { time: 15, lives: 2, bonus_mult: 2.0 }
  };
}
if (typeof window.ENERGY_CONFIG === 'undefined') {
  window.ENERGY_CONFIG = {
    max: 100,
    regenPerCorrect: 15,
    regenPerReflection: 25,
    lowThreshold: 30,
    critThreshold: 15,
    pulseDuration: 600,
    suave:   { loss: 15, recover: 7 },
    medio:   { loss: 20, recover: 10 },
    intenso: { loss: 30, recover: 12 }
  };
}

const diffConfig = window.DIFF_CONFIG;
const energyConfig = window.ENERGY_CONFIG;

// Estado del juego
let state = {
  diff: 'medio',
  questions: [],
  currentIdx: 0,
  points: 0,
  lives: 3,
  streak: 0,
  bestStreak: 0,
  correctCount: 0,
  wrongCount: 0,
  timeLeft: 30,
  timerInterval: null,
  answered: false,
  startTime: null,
  totalTime: 0,
  log: [],
  intentosPorPregunta: {},
  energy: 100,
  energyFinal: 100,
  npcYesCount: 0,
  earnedBadges: [],
  answers: {},
  perfectScore: false
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}
function showEl(id, display = 'block') {
  const el = document.getElementById(id);
  if (el) el.style.display = display;
}
function hideEl(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function isChoiceQuestion(q) {
  return q && ['mcq', 'mini_case', 'image-mcq'].includes(q.type);
}

/* ─────────────────────────────────────────────
   Inicialización
───────────────────────────────────────────── */
function initQuizEngine() {
  const capitulo = window.QUIZ_CAPitulo || window.QUIZ_Titulo || 'Quiz';
  console.info(`[quiz-engine] Motor cargado para: ${capitulo}`);

  // Estado inicial de estadísticas
  const initial = 'medio';
  state.diff = initial;

  if (diffConfig && diffConfig[initial]) {
    const cfg = diffConfig[initial];
    setText('statTime', cfg.time + 's');
    setText('statLives', cfg.lives);
  }

  // Actualizar indicador de envío si existe
  if (typeof updateSendBtnIndicator === 'function') {
    updateSendBtnIndicator();
  }
}

/* ─────────────────────────────────────────────
   Configurar dificultad
───────────────────────────────────────────── */
function setDiff(d) {
  state.diff = d;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
  const btn = document.querySelector(`.diff-btn.${d}`);
  if (btn) btn.classList.add('selected');
  if (diffConfig[d]) {
    setText('statTime', diffConfig[d].time + 's');
    setText('statLives', diffConfig[d].lives);
  }
}

/* ─────────────────────────────────────────────
   Iniciar quiz
───────────────────────────────────────────── */
function startQuiz() {
  const questions = window.QUIZ_Questions || [];
  const perGame = window.QUIZ_PreguntasPorPartida || 10;
  const cfg = diffConfig[state.diff] || diffConfig.medio;

  state.questions = shuffle([...questions]).slice(0, Math.min(perGame, questions.length));
  state.currentIdx = 0;
  state.points = 0;
  state.lives = cfg.lives;
  state.streak = 0;
  state.bestStreak = 0;
  state.correctCount = 0;
  state.wrongCount = 0;
  state.answered = false;
  state.startTime = Date.now();
  state.log = [];
  state.intentosPorPregunta = {};
  state.energy = 100;
  state.energyFinal = 100;
  state.npcYesCount = 0;
  state.earnedBadges = [];
  state.answers = {};
  state.perfectScore = false;

  updateEnergyBar();

  showEl('screen-quiz');
  hideEl('screen-start');
  showEl('quizHud', 'flex');

  renderLives();
  renderQuestion();
}

/* ─────────────────────────────────────────────
   Utilidades
───────────────────────────────────────────── */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ─────────────────────────────────────────────
   Renderizar pregunta
───────────────────────────────────────────── */
function renderQuestion() {
  const q = state.questions[state.currentIdx];
  const cfg = diffConfig[state.diff];

  // Limpiar feedback
  const fp = document.getElementById('feedbackPanel');
  if (fp) {
    fp.className = 'feedback-panel';
    fp.style.display = 'none';
  }
  hideEl('fbCorrectAnswer');
  hideEl('fbWhy');
  hideEl('npcBox');
  hideEl('reflectionResponse');
  hideEl('clinicalBox');
  hideEl('fbReflection');
  hideEl('npcDialog');

  const retryHint = document.getElementById('fbRetryHint');
  if (retryHint) retryHint.style.display = 'none';

  document.querySelectorAll('.npc-opt').forEach(b => {
    b.classList.remove('chosen-correct','chosen-wrong');
    b.disabled = false;
  });

  // Tipo
  const badge = document.getElementById('qTypeBadge');
  if (badge) {
    if (isChoiceQuestion(q)) {
      badge.innerHTML = q.type === 'mini_case'
        ? '<i class="fas fa-stethoscope"></i> Caso clínico'
        : '<i class="fas fa-list"></i> Opción múltiple';
    } else {
      badge.innerHTML = '<i class="fas fa-pencil-alt"></i> Completar espacio';
    }
  }

  // Texto
  setHTML('qText', q.q);

  // Cuerpo
  const body = document.getElementById('qBody');
  if (body) {
    if (isChoiceQuestion(q)) {
      body.innerHTML = `<div class="q-options">${
        Object.entries(q.opts).map(([k,v]) =>
          `<button class="q-opt" onclick="QuizEngine.answerMCQ('${k}',this)" data-key="${k}">
             <span class="opt-letter">${k}</span><span>${v}</span>
           </button>`
        ).join('')
      }</div>`;
    } else {
      body.innerHTML = `
        <div class="fitb-wrap">
          <input class="fitb-input" id="fitbInput" placeholder="Escribe tu respuesta..."
                 onkeydown="if(event.key==='Enter') QuizEngine.answerFITB()"/>
          <button class="fitb-btn" onclick="QuizEngine.answerFITB()">
            <i class="fas fa-check"></i> Responder
          </button>
        </div>`;
      setTimeout(() => document.getElementById('fitbInput')?.focus(), 100);
    }
  }

  updateHUD();

  const btnNext = document.getElementById('btnNext');
  if (btnNext) {
    btnNext.disabled = true;
    btnNext.innerHTML = 'Siguiente pregunta <i class="fas fa-arrow-right"></i>';
  }

  state.answered = false;
  startTimer(cfg.time);
}

/* ─────────────────────────────────────────────
   Temporizador
───────────────────────────────────────────── */
function startTimer(seconds) {
  clearInterval(state.timerInterval);
  state.timeLeft = seconds;
  updateTimerUI();

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      if (!state.answered) timeOut();
    }
  }, 1000);
}

function updateTimerUI() {
  const el = document.getElementById('hudTimer');
  if (!el) return;
  el.textContent = state.timeLeft;
  el.className = 'hud-val timer-val';
  if (state.timeLeft <= 5) el.classList.add('danger');
  else if (state.timeLeft <= 10) el.classList.add('warning');
}

function timeOut() {
  const q = state.questions[state.currentIdx];
  state.answered = true;

  document.querySelectorAll('.q-opt').forEach(b => {
    b.disabled = true;
    if (b.dataset.key === q.answer) b.classList.add('correct');
  });
  const fitbInput = document.getElementById('fitbInput');
  if (fitbInput) { fitbInput.disabled = true; fitbInput.classList.add('wrong'); }
  const fitbBtn = document.querySelector('.fitb-btn');
  if (fitbBtn) fitbBtn.disabled = true;

  processAnswer(false, null, q);

  const ca = document.getElementById('fbCorrectAnswer');
  if (ca) {
    ca.style.display = 'block';
    ca.innerHTML = `<strong>⏱️ Tiempo agotado.</strong> La respuesta correcta era: <strong>${
      isChoiceQuestion(q) ? `${q.answer}. ${q.opts[q.answer]}` : q.answer
    }</strong>`;
  }

  const retryHint = document.getElementById('fbRetryHint');
  if (retryHint) retryHint.style.display = 'none';

  const btnNext = document.getElementById('btnNext');
  if (btnNext) {
    btnNext.disabled = false;
    if (state.currentIdx >= state.questions.length - 1) {
      btnNext.innerHTML = '🏁 Ver resultados <i class="fas fa-flag-checkered"></i>';
    }
  }
}

/* ─────────────────────────────────────────────
   Responder MCQ / FITB
───────────────────────────────────────────── */
function answerMCQ(key, btn) {
  if (state.answered) return;

  const q = state.questions[state.currentIdx];
  const correct = key === q.answer;

  // Limpiar selección/estados previos para evitar múltiples opciones marcadas
  document.querySelectorAll('.q-opt').forEach(opt => {
    opt.classList.remove('wrong', 'incorrect', 'selected', 'active', 'correct');
    opt.disabled = false;
  });

  if (btn) btn.classList.add('selected');

  if (correct) {
    clearInterval(state.timerInterval);
    state.answered = true;
    document.querySelectorAll('.q-opt').forEach(b => {
      b.disabled = true;
      if (b.dataset.key === q.answer) b.classList.add('correct');
    });
    processAnswer(true, key, q);
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    processAnswer(false, key, q);
  }
}

function answerFITB() {
  if (state.answered) return;

  const q = state.questions[state.currentIdx];
  const input = document.getElementById('fitbInput');
  if (!input) return;
  const val = input.value.trim().toLowerCase();
  const alts = (q.alt_answers || []).map(a => a.toLowerCase());
  const correct = val === q.answer.toLowerCase() || alts.includes(val);

  if (correct) {
    clearInterval(state.timerInterval);
    state.answered = true;
    input.disabled = true;
    input.classList.add('correct');
    const btn = document.querySelector('.fitb-btn');
    if (btn) btn.disabled = true;
    processAnswer(true, val, q);
  } else {
    input.classList.add('wrong');
    setTimeout(() => {
      input.classList.remove('wrong');
      input.value = '';
      input.focus();
    }, 900);
    processAnswer(false, val, q);
  }
}

/* ─────────────────────────────────────────────
   Procesar respuesta
───────────────────────────────────────────── */
function processAnswer(correct, given, q) {
  const cfg = diffConfig[state.diff];
  const ecfg = energyConfig[state.diff];
  const timeBonus = Math.floor(state.timeLeft * cfg.bonus_mult);
  let pts = 0;

  if (correct) {
    pts = q.points + timeBonus;
    state.points += pts;
    state.correctCount++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;

    showFeedbackCorrect(pts, q);

    const intentosPrevios = state.intentosPorPregunta[state.currentIdx] || 0;
    if (q.topic) state.answers[q.topic] = true;

    state.log.push({
      qText: q.q.length > 60 ? q.q.substring(0, 60) + '…' : q.q,
      correct: true,
      pts,
      answer: isChoiceQuestion(q) ? `${q.answer}. ${q.opts[q.answer]}` : q.answer,
      intentos: intentosPrevios + 1,
      topic: q.topic || 'general',
      tiempoUsado: cfg.time - state.timeLeft
    });

    if (window.ECGSession) {
      window.ECGSession.logQuizAnswer({
        capitulo: window.QUIZ_CAPitulo || 'Capítulo',
        pregunta_num: state.currentIdx + 1,
        pregunta_texto: q.q,
        respuesta_dada: isChoiceQuestion(q) ? `${given}. ${q.opts[given] || given}` : given,
        fue_correcta: true,
        respuesta_correcta: isChoiceQuestion(q) ? `${q.answer}. ${q.opts[q.answer]}` : q.answer,
        tiempo_seg: cfg.time - state.timeLeft,
        reflexion_elegida: '',
        puntos: pts,
        racha: state.streak
      });
    }

    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
      btnNext.disabled = false;
      if (state.currentIdx >= state.questions.length - 1) {
        btnNext.innerHTML = '🏁 Ver resultados <i class="fas fa-flag-checkered"></i>';
      }
    }
  } else {
    pts = -Math.floor(q.points * 0.3);
    state.points = Math.max(0, state.points + pts);
    state.wrongCount++;
    state.streak = 0;

    state.intentosPorPregunta[state.currentIdx] =
      (state.intentosPorPregunta[state.currentIdx] || 0) + 1;

    state.energy = Math.max(0, state.energy - ecfg.loss);
    updateEnergyBar();

    if (q.clinical_consequence) showClinicalConsequence(q.clinical_consequence);

    showFeedbackWrong(pts, given, q);
    loseLife();

    if (!state.answered) {
      const retryTime = Math.max(15, Math.floor(cfg.time * 0.6));
      startTimer(retryTime);
    }

    if (window.ECGSession) {
      window.ECGSession.logQuizAnswer({
        capitulo: window.QUIZ_CAPitulo || 'Capítulo',
        pregunta_num: state.currentIdx + 1,
        pregunta_texto: q.q,
        respuesta_dada: isChoiceQuestion(q) ? `${given}. ${q.opts[given] || given}` : given,
        fue_correcta: false,
        respuesta_correcta: isChoiceQuestion(q) ? `${q.answer}. ${q.opts[q.answer]}` : q.answer,
        tiempo_seg: cfg.time - state.timeLeft,
        reflexion_elegida: '',
        puntos: pts,
        racha: 0
      });
    }
  }

  updateHUD();
  floatPoints(correct ? `+${pts}` : `${pts}`, correct);
}

/* ─────────────────────────────────────────────
   Feedback
───────────────────────────────────────────── */
function showFeedbackCorrect(pts, q) {
  const fp = document.getElementById('feedbackPanel');
  if (fp) {
    fp.className = 'feedback-panel correct';
    fp.style.display = '';
  }

  const intentos = state.intentosPorPregunta[state.currentIdx] || 0;
  const racha = state.streak;

  let titulo;
  if (intentos === 0 && racha >= 3) titulo = `¡Correcto! 🔥 Racha x${racha} — ¡Imparable!`;
  else if (intentos === 0 && racha > 1) titulo = `¡Correcto! 🔥 Racha de ${racha}`;
  else if (intentos === 0) titulo = '¡Correcto! Perfecto a la primera ⭐';
  else if (intentos === 1) titulo = '¡Correcto! Lo lograste en el 2º intento 💪';
  else titulo = `¡Correcto! Después de ${intentos + 1} intentos 📚`;

  const fbIcon = document.getElementById('fbIcon');
  if (fbIcon) fbIcon.textContent = '✅';
  setText('fbTitle', titulo);

  const fbPoints = document.getElementById('fbPoints');
  if (fbPoints) {
    fbPoints.className = 'points-badge gained';
    fbPoints.textContent = `+${pts} pts de conducción`;
  }
  const fbPts = document.getElementById('fbPts');
  if (fbPts) fbPts.textContent = `+${pts} puntos`;

  const ca = document.getElementById('fbCorrectAnswer');
  if (ca) {
    if (intentos > 0) {
      ca.style.display = 'block';
      ca.innerHTML = `<i class="fas fa-check-circle" style="color:#22c55e"></i>
        <strong>Respuesta consolidada.</strong> Recuerda el razonamiento que te llevó a la respuesta correcta — eso es lo que importa.`;
    } else {
      ca.style.display = 'none';
    }
  }

  hideEl('fbWhy');
  hideEl('npcBox');
  hideEl('clinicalBox');
  hideEl('fbReflection');
}

function showFeedbackWrong(pts, given, q) {
  const fp = document.getElementById('feedbackPanel');
  if (fp) {
    fp.className = 'feedback-panel wrong';
    fp.style.display = '';
  }

  const intentos = state.intentosPorPregunta[state.currentIdx] || 0;

  const fbIcon = document.getElementById('fbIcon');
  if (fbIcon) fbIcon.textContent = '❌';
  const fbTitle = document.getElementById('fbTitle');
  if (fbTitle) {
    fbTitle.textContent = intentos === 1
      ? '⚡ Energía baja — vuelve a intentarlo'
      : `⚡ Intento ${intentos} — cada error cuesta energía`;
  }

  const fbPoints = document.getElementById('fbPoints');
  if (fbPoints) {
    fbPoints.className = 'points-badge lost';
    fbPoints.textContent = `${pts} pts`;
  }
  const fbPts = document.getElementById('fbPts');
  if (fbPts) fbPts.textContent = `${pts} puntos`;

  const whyText = isChoiceQuestion(q) && given && q.why_wrong && q.why_wrong[given]
    ? q.why_wrong[given]
    : (typeof q.why_wrong === 'string' ? q.why_wrong : 'Esa opción no es correcta. Revisa el razonamiento e intenta de nuevo.');
  const why = document.getElementById('fbWhy');
  if (why) {
    why.style.display = 'block';
    setText('fbWhyText', whyText);
  }

  // Quiz 1: NPC Duelo de Reflexión
  if (document.getElementById('npcBox')) {
    showNPCDuel(q);

    let retryHint = document.getElementById('fbRetryHint');
    if (!retryHint && fp) {
      retryHint = document.createElement('div');
      retryHint.id = 'fbRetryHint';
      retryHint.style.cssText = `
        margin-top:12px; padding:10px 14px;
        background:#0d1f12; border:1px dashed #22c55e;
        border-radius:8px; font-size:.84rem;
        color:#86efac; text-align:center;
      `;
      fp.appendChild(retryHint);
    }
    if (retryHint) {
      retryHint.innerHTML = `
        <i class="fas fa-redo" style="margin-right:6px"></i>
        Lee la explicación del Dr. ECG, luego elige otra opción.
        <span style="color:#607080;font-size:.76rem;display:block;margin-top:3px">
          Intento ${intentos} &bull; ${pts} pts &bull; ⚡ Energía: ${state.energy}%
        </span>
      `;
      retryHint.style.display = 'block';
    }
  }

  // Quiz 2: panel de reflexión
  if (document.getElementById('fbReflection')) {
    showReflectionPanel(q);
  }
}

/* ─────────────────────────────────────────────
   Consecuencia clínica
───────────────────────────────────────────── */
function showClinicalConsequence(text) {
  const box = document.getElementById('clinicalBox');
  if (!box) return;
  setHTML('clinicalText', text);
  box.style.display = 'flex';
}

/* ─────────────────────────────────────────────
   Barra de energía
───────────────────────────────────────────── */
function updateEnergyBar() {
  const pct = Math.max(0, Math.min(100, state.energy));
  const fill = document.getElementById('energyFill');
  const pctEl = document.getElementById('energyPct');
  if (!fill) return;
  fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';

  const barContainer = document.querySelector('.energy-track');
  if (barContainer) {
    barContainer.classList.remove('critical', 'low');
    if (pct <= energyConfig.critThreshold) {
      barContainer.classList.add('critical');
      fill.classList.add('pulse');
    } else if (pct <= energyConfig.lowThreshold) {
      barContainer.classList.add('low');
      fill.classList.remove('pulse');
    } else {
      fill.classList.remove('pulse');
    }
  }
}

/* ─────────────────────────────────────────────
   NPC — Quiz 1
───────────────────────────────────────────── */
function showNPCDuel(q) {
  const box = document.getElementById('npcBox');
  if (!box) return;
  setText('npcQuestion', q.reflection);
  hideEl('reflectionResponse');

  const optsEl = document.getElementById('npcOpts');
  const npcOptions = [
    { type: 'yes',     text: q.reflection_yes_short     || '✅ Entiendo — el error tiene sentido ahora' },
    { type: 'partial', text: q.reflection_partial_short  || '🤔 Entendí algo, pero necesito repasar' },
    { type: 'no',      text: q.reflection_no_short       || '❌ No lo veo aún, necesito más contexto' }
  ];

  if (optsEl) {
    optsEl.innerHTML = npcOptions.map((o, i) =>
      `<button class="npc-opt" onclick="answerNPC('${o.type}',this,${i})">${o.text}</button>`
    ).join('');
  }

  box.style.display = 'flex';
}

function answerNPC(type, btn, idx) {
  document.querySelectorAll('.npc-opt').forEach(b => b.disabled = true);
  if (btn) btn.classList.add(type === 'yes' ? 'chosen-correct' : 'chosen-wrong');

  const q = state.questions[state.currentIdx];
  const res = document.getElementById('reflectionResponse');

  const msgs = {
    yes:     { text: q.reflection_yes,     bg: '#0d2e1a', border: '#22c55e', recover: true  },
    partial: { text: q.reflection_partial, bg: '#1a1200', border: '#f97316', recover: false },
    no:      { text: q.reflection_no,      bg: '#1a0a0a', border: '#ef4444', recover: false }
  };
  const m = msgs[type];

  if (res) {
    res.style.cssText = `display:block;background:${m.bg};border-left:3px solid ${m.border};
      border-radius:0 8px 8px 0;padding:10px 14px;margin-top:10px;
      font-size:.85rem;color:#c8d8e8;line-height:1.6`;
    res.textContent = m.text;
  }

  if (type === 'yes') {
    const ecfg = energyConfig[state.diff];
    const recover = ecfg.recover;
    const prev = state.energy;
    state.energy = Math.min(100, state.energy + recover);
    state.npcYesCount++;
    updateEnergyBar();
    if (state.energy > prev) showPotionToast(recover);
  }

  if (window.ECGSession) {
    const s = JSON.parse(sessionStorage.getItem('ecg_session') || '{}');
    if (s.quizEvents && s.quizEvents.length > 0) {
      const labels = { yes: 'Sí entendí', partial: 'Más o menos', no: 'No lo veo' };
      for (let i = s.quizEvents.length - 1; i >= 0; i--) {
        if (s.quizEvents[i].pregunta_num === state.currentIdx + 1) {
          s.quizEvents[i].reflexion_elegida = labels[type] || type;
          break;
        }
      }
      sessionStorage.setItem('ecg_session', JSON.stringify(s));
    }
  }
}

function answerReflection(type, btn) { answerNPC(type, btn, 0); }

/* ─────────────────────────────────────────────
   NPC — Quiz 2
───────────────────────────────────────────── */
function showReflectionPanel(q) {
  const reflectionBox = document.getElementById('fbReflection');
  if (!reflectionBox) return;
  reflectionBox.style.display = 'block';
  setText('fbReflectionQ', q.reflection);

  const npcOpts = document.getElementById('npcOpts');
  if (npcOpts) {
    const yesText = q.reflection_yes_short || '✅ Entiendo — el error tiene sentido ahora';
    const partialText = q.reflection_partial_short || '🤔 Entendí algo, pero necesito repasar';
    const noText = q.reflection_no_short || '❌ No lo veo aún, necesito más contexto';
    npcOpts.innerHTML = `
      <button class="npc-btn" onclick="selectNPCOption('yes')">${yesText}</button>
      <button class="npc-btn" onclick="selectNPCOption('partial')">${partialText}</button>
      <button class="npc-btn" onclick="selectNPCOption('no')">${noText}</button>
    `;
  }
}

function selectNPCOption(option) {
  const q = state.questions[state.currentIdx];
  const dialog = document.getElementById('npcDialog');

  document.querySelectorAll('.npc-btn').forEach(b => b.disabled = true);

  let response = '';
  if (option === 'yes' && q.reflection_yes) {
    response = q.reflection_yes;
    state.npcYesCount++;

    const ecfg = energyConfig[state.diff];
    state.energy = Math.min(100, state.energy + ecfg.recover);
    updateEnergyBar();
    showPotionToast(ecfg.recover);
  } else if (option === 'partial' && q.reflection_partial) {
    response = q.reflection_partial;
  } else if (option === 'no' && q.reflection_no) {
    response = q.reflection_no;
  }

  if (dialog && response) {
    dialog.innerHTML = `<strong>Dr. ECG responde:</strong><br>${response}`;
    dialog.classList.add('show');
  }
}

/* ─────────────────────────────────────────────
   Toast de recuperación
───────────────────────────────────────────── */
function showPotionToast(amount) {
  const t = document.createElement('div');
  t.className = 'potion-toast';
  t.innerHTML = `🦪 <span>+${amount}% Energía recuperada — ¡La reflexión te cura!</span>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ─────────────────────────────────────────────
   Siguiente pregunta
───────────────────────────────────────────── */
function nextQuestion() {
  state.currentIdx++;
  if (state.currentIdx >= state.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

/* ─────────────────────────────────────────────
   Vidas
───────────────────────────────────────────── */
function loseLife() {
  state.lives--;
  renderLives();
  if (state.lives <= 0) {
    clearInterval(state.timerInterval);
    state.answered = true;
    document.querySelectorAll('.q-opt').forEach(b => b.disabled = true);
    const fitbBtn = document.querySelector('.fitb-btn');
    if (fitbBtn) fitbBtn.disabled = true;
    setTimeout(showGameOver, 1800);
  }
}

function renderLives() {
  const total = diffConfig[state.diff].lives;
  const el = document.getElementById('hudLives');
  if (!el) return;
  let html = '';
  for (let i = 0; i < total; i++) {
    html += `<span class="life${i >= state.lives ? ' lost' : ''}">❤️</span>`;
  }
  el.innerHTML = html;
}

/* ─────────────────────────────────────────────
   HUD
───────────────────────────────────────────── */
function updateHUD() {
  setText('hudPoints', state.points);

  const streakEl = document.getElementById('hudStreak');
  if (streakEl) {
    streakEl.textContent = state.streak;
    if (state.streak > 0) {
      streakEl.classList.add('active');
      setTimeout(() => streakEl.classList.remove('active'), 600);
    }
  }

  const total = state.questions.length || 1;
  const done = state.currentIdx;
  const prog = document.getElementById('hudProgFill');
  if (prog) prog.style.width = `${(done/total)*100}%`;
  const label = document.getElementById('hudProgLabel');
  if (label) label.textContent = `Pregunta ${done+1} de ${total}`;
}

/* ─────────────────────────────────────────────
   Puntos flotantes
───────────────────────────────────────────── */
function floatPoints(text, isGood) {
  const el = document.createElement('div');
  el.className = 'float-points floating-points';
  el.textContent = text;
  el.style.color = isGood ? '#22c55e' : '#ef4444';

  const card = document.querySelector('.q-card');
  if (card) {
    const rect = card.getBoundingClientRect();
    el.style.left = rect.left + rect.width / 2 + 'px';
    el.style.top = rect.top + 50 + 'px';
  } else {
    el.style.left = '50%';
    el.style.top = '80px';
  }

  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

/* ─────────────────────────────────────────────
   Game Over
───────────────────────────────────────────── */
function showGameOver() {
  hideEl('screen-quiz');
  hideEl('quizHud');
  showEl('screen-gameover');
  setText('goPoints', state.points + ' pts');
  setText('gameOverScore', state.points);

  const energyPct = Math.max(0, Math.min(100, state.energy));
  const goEnergy = document.getElementById('gameOverEnergy');
  const goEnergyLabel = document.getElementById('gameOverEnergyLabel');
  if (goEnergy) goEnergy.style.width = energyPct + '%';
  if (goEnergyLabel) goEnergyLabel.textContent = `Energía final: ${energyPct}%`;

  state.totalTime = Math.floor((Date.now() - state.startTime) / 1000);
}

/* ─────────────────────────────────────────────
   Insignias
───────────────────────────────────────────── */
function loadEarnedBadges() {
  const key = window.QUIZ_BadgesKey || 'ecg_badges';
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function saveEarnedBadges(ids) {
  const key = window.QUIZ_BadgesKey || 'ecg_badges';
  localStorage.setItem(key, JSON.stringify(ids));
}

function checkBadges() {
  state.energyFinal = state.energy;
  const badges = window.QUIZ_Badges || [];
  const earned = badges.filter(b => {
    try { return b.check(state); } catch { return false; }
  });
  state.earnedBadges = earned.map(b => b.id);

  const prev = loadEarnedBadges();
  const merged = [...new Set([...prev, ...state.earnedBadges])];
  saveEarnedBadges(merged);
  return earned;
}

/* ─────────────────────────────────────────────
   Resultados
───────────────────────────────────────────── */
function showResult() {
  clearInterval(state.timerInterval);
  state.totalTime = Math.floor((Date.now() - state.startTime) / 1000);
  state.energyFinal = state.energy;
  const pct = Math.round(state.correctCount / state.questions.length * 100);

  hideEl('screen-quiz');
  hideEl('quizHud');
  showEl('screen-result');

  // Mensaje (quiz-1)
  let icon, title, sub;
  const eng = state.energyFinal;
  if      (pct >= 90 && eng >= 80) { icon='🏆'; title='¡Maestro de Conducción!'; sub='Dominaste el capítulo con alta energía y precisión.'; }
  else if (pct >= 90)              { icon='🎯'; title='¡Gran dominio!'; sub='Acertaste casi todo, aunque el potencial de acción quedó bajo.'; }
  else if (pct >= 70 && eng >= 60) { icon='📚'; title='¡Buen ritmo!'; sub='Buen manejo, con espacio para mejorar la eficiencia.'; }
  else if (pct >= 70)              { icon='💪'; title='¡Resististe!'; sub='Acertaste la mayoría, pero los errores te costaron energía.'; }
  else if (pct >= 50)              { icon='📡'; title='Señal débil'; sub='Necesitas repasar los conceptos clave del capítulo.'; }
  else                             { icon='🔋'; title='Potencial bajo'; sub='El capítulo necesita otro repaso completo antes del siguiente quiz.'; }

  if (document.getElementById('resultIcon')) setText('resultIcon', icon);
  if (document.getElementById('resultTitle')) setText('resultTitle', title);
  if (document.getElementById('resultSub')) setText('resultSub', sub);

  setText('resultScore', state.points);
  setText('resultScoreBig', state.points);

  // Barra de energía (quiz-1)
  const engPct = Math.round(state.energyFinal);
  const resultEnergyBar = document.getElementById('resultEnergyBar');
  if (resultEnergyBar) {
    resultEnergyBar.style.width = engPct + '%';
    resultEnergyBar.style.background =
      engPct > 60 ? 'linear-gradient(90deg,#22c55e,#84cc16)'
      : engPct > 30 ? 'linear-gradient(90deg,#f97316,#fbbf24)'
      : 'linear-gradient(90deg,#ef4444,#f97316)';
    setText('resultEnergyPct', `Potencial de Acción restante: ${engPct}%`);
  }

  // Barra de energía (quiz-2)
  const resultEnergyFill = document.getElementById('resultEnergyFill');
  if (resultEnergyFill) {
    resultEnergyFill.style.width = engPct + '%';
    setText('resultEnergyLabel', `Energía final: ${engPct}%`);
  }

  // Insignias
  state.perfectScore = state.correctCount === state.questions.length;
  const earned = checkBadges();
  renderBadges(earned);

  // Stats
  const totalIntentosFallidos = Object.values(state.intentosPorPregunta)
    .reduce((acc, v) => acc + v, 0);
  setText('rCorrect', state.correctCount);
  setText('rWrong', totalIntentosFallidos);
  setText('rStreak', state.bestStreak);
  setText('rTime', state.totalTime + 's');

  setText('statCorrectas', state.correctCount);
  setText('statErroneas', state.wrongCount);
  setText('statRacha', state.bestStreak);
  setText('statTiempo', state.totalTime + 's');

  renderBreakdown();
}

function renderBadges(earned) {
  const gridQuiz1 = document.getElementById('resultBadgesGrid');
  const gridQuiz2 = document.getElementById('badgesGrid');

  if (gridQuiz1) {
    if (earned.length === 0) {
      gridQuiz1.innerHTML = `<p style="color:#607080;font-size:.85rem">No ganaste insignias esta partida. ¡Sigue practicando!</p>`;
    } else {
      gridQuiz1.innerHTML = earned.map(b =>
        `<div class="badge-chip earned">
          <span class="badge-icon">${b.icon}</span>
          <div><div class="badge-name">${b.name}</div>
          <div style="font-size:.7rem;color:#a78bfa;margin-top:1px">${b.desc}</div></div>
        </div>`
      ).join('');
    }
    showEl('resultBadges');
  }

  if (gridQuiz2) {
    if (earned.length > 0) {
      showEl('resultBadges');
      gridQuiz2.innerHTML = earned.map(b => `
        <div class="badge-chip earned">
          <span class="badge-icon">${b.icon}</span>
          <span class="badge-name">${b.name}</span>
        </div>
      `).join('');
    }
  }
}

function renderBreakdown() {
  const bdQuiz1 = document.getElementById('resultBreakdown');
  if (bdQuiz1) {
    bdQuiz1.innerHTML = state.log.map(l => {
      const intentos = l.intentos || 1;
      const badge = intentos === 1
        ? `<span style="font-size:.72rem;color:#22c55e;margin-left:6px">✨ 1er intento</span>`
        : `<span style="font-size:.72rem;color:#f97316;margin-left:6px">⚠️ ${intentos} intentos</span>`;
      return `
      <div class="rb-row">
        <span class="rb-icon">✅</span>
        <span class="rb-text"><strong>${l.qText}</strong>${badge}<br/>
          <span style="color:#607080;font-size:.8rem">Respuesta correcta: ${l.answer}</span>
        </span>
        <span class="rb-pts pos">+${l.pts}</span>
      </div>`;
    }).join('');
  }

  const bdQuiz2 = document.getElementById('breakdownList');
  if (bdQuiz2) {
    bdQuiz2.innerHTML = state.log.map((log, i) => `
      <div class="rb-row">
        <div class="rb-status ${log.correct ? 'correct' : 'wrong'}">
          ${log.correct ? '✓' : '✗'}
        </div>
        <div class="rb-q">${log.qText}</div>
        <div class="rb-pts">${log.correct ? '+' : ''}${log.pts} pts</div>
      </div>
    `).join('');
  }
}

/* ─────────────────────────────────────────────
   Ficha de personaje (quiz-1)
───────────────────────────────────────────── */
function showCharacterSheet() {
  if (document.getElementById('char-modal-overlay')) return;

  const allEarned = loadEarnedBadges();
  const id = window.ECGSession ? window.ECGSession.getIdentity() : { nombre: 'Estudiante', matricula: '' };
  const nivel = allEarned.length >= 5 ? 'Especialista ECG'
               : allEarned.length >= 3 ? 'Residente Cardíaco'
               : allEarned.length >= 1 ? 'Interno Aprendiz' : 'Novato';
  const engColor = state.energyFinal >= 80 ? 'linear-gradient(90deg,#22c55e,#84cc16)'
                  : state.energyFinal >= 40 ? 'linear-gradient(90deg,#f97316,#fbbf24)'
                  : 'linear-gradient(90deg,#ef4444,#f97316)';

  const overlay = document.createElement('div');
  overlay.id = 'char-modal-overlay';
  overlay.className = 'char-modal-overlay';
  overlay.innerHTML = `
    <div class="char-modal">
      <div class="char-header">
        <div class="char-avatar">🧑‍⚕️</div>
        <div class="char-name">${id.nombre || 'Estudiante'}</div>
        ${id.matricula ? `<div style="color:#607080;font-size:.82rem;margin-bottom:6px">${id.matricula}</div>` : ''}
        <span class="char-level">🎮 ${nivel}</span>
      </div>

      <div class="char-energy-section">
        <div class="char-energy-label">⚡ Potencial de Acción (esta partida)</div>
        <div class="char-energy-bar">
          <div class="char-energy-fill" style="width:${state.energyFinal}%;background:${engColor}"></div>
        </div>
        <div style="font-size:.78rem;color:#607080;margin-top:4px">${Math.round(state.energyFinal)}% restante</div>
      </div>

      <div class="char-stats-grid">
        <div class="char-stat">
          <span class="char-stat-num">${state.correctCount || 0}</span>
          <span class="char-stat-label">Respuestas correctas</span>
        </div>
        <div class="char-stat">
          <span class="char-stat-num">${state.bestStreak || 0}</span>
          <span class="char-stat-label">Mejor racha</span>
        </div>
        <div class="char-stat">
          <span class="char-stat-num">${state.points || 0}</span>
          <span class="char-stat-label">Puntos de conducción</span>
        </div>
        <div class="char-stat">
          <span class="char-stat-num">${state.npcYesCount || 0}</span>
          <span class="char-stat-label">Reflexiones superadas</span>
        </div>
      </div>

      <div class="char-badges-title">🏅 Insignias desbloqueadas (acumuladas)</div>
      <div class="badges-grid">
        ${(window.QUIZ_Badges || []).map(b => {
          const ok = allEarned.includes(b.id);
          return `<div class="badge-chip ${ok ? 'earned' : ''}">
            <span class="badge-icon">${b.icon}</span>
            <div>
              <div class="badge-name">${b.name}</div>
              ${ok
                ? `<div style="font-size:.68rem;color:#86efac">✅ Desbloqueada</div>`
                : `<div class="badge-locked">${b.desc.substring(0,45)}…</div>`
              }
            </div>
          </div>`;
        }).join('')}
      </div>

      <button class="char-close-btn" onclick="document.getElementById('char-modal-overlay').remove()">
        <i class="fas fa-times"></i> Cerrar Ficha
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

/* ─────────────────────────────────────────────
   Reiniciar / exportar
───────────────────────────────────────────── */
function restartQuiz() {
  hideEl('screen-gameover');
  hideEl('screen-result');
  showEl('screen-start');
  hideEl('quizHud');
}

function exportarCSV() {
  if (window.ECGSession) {
    window.ECGSession.exportCSV();
  } else {
    alert('No hay datos de sesión guardados. Asegúrate de identificarte en la portada primero.');
  }
}

window.QuizEngine = {
  init: initQuizEngine,
  setDiff,
  startQuiz,
  answerMCQ,
  answerFITB,
  answerNPC,
  answerReflection,
  nextQuestion,
  showCharacterSheet,
  restartQuiz,
  exportarCSV
};

document.addEventListener('DOMContentLoaded', initQuizEngine);

