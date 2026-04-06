/**
 * =====================================================
 *  LIKERT ENGINE — Lógica compartida de autopercepción
 * =====================================================
 *  Requiere HTML con filas que tengan data-item-id
 *  y opciones con data-value.
 *
 *  Ejemplo:
 *  <div class="likert-row" data-item-id="concepto_1">
 *    <button class="likert-option" data-value="1">😰</button>
 *    <button class="likert-option" data-value="2">😕</button>
 *  </div>
 */

(function () {
  'use strict';

  const state = {
    respuestas: {}
  };

  const LABELS = window.LIKERT_Labels || window.LIKERT_LABELS || ['1', '2', '3', '4', '5'];

  // ─── GUARDAR EN SESSION ───
  function guardarRespuestas() {
    if (typeof window.ECGSession !== 'undefined' && window.ECGSession.logLikert) {
      // Compatibilidad con el logLikert actual (recibe un objeto)
      if (window.ECGSession.logLikert.length === 1) {
        Object.entries(state.respuestas).forEach(([itemId, valor]) => {
          const idx = Math.max(0, Math.min(LABELS.length - 1, (valor - 1)));
          window.ECGSession.logLikert({
            capitulo: window.LIKERT_Capitulo || document.title || 'Autopercepción',
            concepto: itemId,
            nivel_num: valor,
            nivel_texto: LABELS[idx] || String(valor)
          });
        });
      } else {
        window.ECGSession.logLikert(state.respuestas, window.LIKERT_Capitulo);
      }
    }
    // También persistir en localStorage si es necesario
    var key = window.LIKERT_BadgesKey || 'likert_respuestas';
    localStorage.setItem(key, JSON.stringify(state.respuestas));
    mostrarGuardado();
  }

  // ─── EXPORTAR CSV ───
  function exportarCSV() {
    if (typeof window.ECGSession === 'undefined' || !window.ECGSession.exportCSV) {
      return;
    }
    if (window.ECGSession.isIdentified && !window.ECGSession.isIdentified()) {
      if (confirm('No tienes una identidad registrada. ¿Deseas identificarte primero?')) {
        window.ECGSession.showIdentityModal(false);
        document.addEventListener('ecg:identified', function once() {
          document.removeEventListener('ecg:identified', once);
          setTimeout(function() { window.ECGSession.exportCSV(); }, 300);
        });
      }
      return;
    }
    window.ECGSession.exportCSV();
  }

  // ─── CARGAR RESPUESTAS GUARDADAS ───
  function cargarGuardadas() {
    var key = window.LIKERT_BadgesKey || 'likert_respuestas';
    var guardadas = localStorage.getItem(key);
    if (!guardadas) return;

    var datos = JSON.parse(guardadas);

    // Re-marcar las opciones guardadas
    Object.keys(datos).forEach(function(itemId) {
      var fila = document.querySelector('[data-item-id="' + itemId + '"]');
      if (!fila) return;
      var valor = datos[itemId];

      fila.querySelectorAll('.likert-option, .opcion-likert, [data-value]').forEach(function(opt) {
        opt.classList.remove('selected', 'active', 'checked', 'highlighted');
      });

      var opcion = fila.querySelector('[data-value="' + valor + '"]');
      if (opcion) opcion.classList.add('selected');
    });

    // Restaurar estado
    state.respuestas = datos;
  }

  // ─── RESETEAR ───
  function resetear() {
    if (!confirm('¿Deseas reiniciar tus respuestas?')) return;
    state.respuestas = {};
    document.querySelectorAll('.likert-option.selected, .opcion-likert.selected, [data-value].selected').forEach(function(o) {
      o.classList.remove('selected');
    });
    var key = window.LIKERT_BadgesKey || 'likert_respuestas';
    localStorage.removeItem(key);
    ocultarGuardado();
  }

  // ─── CALCULAR PROMEDIO ───
  function calcularPromedio() {
    var vals = Object.values(state.respuestas);
    if (vals.length === 0) return 0;
    var suma = vals.reduce(function(a, b) { return a + b; }, 0);
    return (suma / vals.length).toFixed(1);
  }

  // ─── Mostrar resultados ───
  function mostrarResultados() {
    var panel = document.getElementById('likert-resultados');
    if (!panel) return;

    var totalRespondidas = Object.keys(state.respuestas).length;
    var totalItems = Array.isArray(window.LIKERT_Items) ? window.LIKERT_Items.length : totalRespondidas;
    var promedio = calcularPromedio();
    var porcentaje = totalItems ? Math.round((totalRespondidas / totalItems) * 100) : 0;

    var promedioEl = document.getElementById('likert-promedio');
    var totalEl = document.getElementById('likert-total');
    var totalPreguntasEl = document.getElementById('likert-total-preguntas');

    if (promedioEl && totalEl && totalPreguntasEl) {
      promedioEl.textContent = promedio;
      totalEl.textContent = totalRespondidas;
      totalPreguntasEl.textContent = totalItems;
    } else {
      panel.innerHTML = '' +
        '<div class="likert-results-card">' +
        '<h3>Resumen de autopercepción</h3>' +
        '<p><strong>Respondidas:</strong> ' + totalRespondidas + ' de ' + totalItems + '</p>' +
        '<p><strong>Promedio:</strong> ' + promedio + '</p>' +
        '<p><strong>Completitud:</strong> ' + porcentaje + '%</p>' +
        '</div>';
    }

    panel.style.display = 'block';
    panel.classList.add('visible');
  }

  // ─── Indicador de guardado ───
  var guardadoTimeout = null;

  function mostrarGuardado() {
    var actions = document.querySelector('.likert-actions');
    if (!actions) return;

    var badge = document.getElementById('likert-guardado');
    if (!badge) {
      badge = document.createElement('span');
      badge.id = 'likert-guardado';
      badge.className = 'likert-guardado';
      badge.textContent = '✅ Guardado';
      actions.appendChild(badge);
    }

    badge.classList.add('visible');

    if (guardadoTimeout) {
      clearTimeout(guardadoTimeout);
    }
    guardadoTimeout = setTimeout(function() {
      badge.classList.remove('visible');
    }, 2000);
  }

  function ocultarGuardado() {
    var badge = document.getElementById('likert-guardado');
    if (badge) {
      badge.classList.remove('visible');
    }
  }

  // ─── Manejo de clic en opciones ───
  function handleOptionClick(element) {
    var grupo = element.closest('.likert-row, .likert-question, .pregunta-item, [data-item-id]');
    if (!grupo) return;

    grupo.querySelectorAll('.likert-option, .opcion-likert, [data-value]')
      .forEach(function(opt) {
        opt.classList.remove('selected', 'active', 'checked', 'highlighted');
        opt.disabled = false;
      });

    element.classList.add('selected');

    var itemId = grupo.getAttribute('data-item-id');
    var value = parseInt(element.getAttribute('data-value') || element.dataset.value, 10);
    if (!itemId || Number.isNaN(value)) return;

    state.respuestas[itemId] = value;
    guardarRespuestas();
  }

  function bindOptionClicks() {
    document.addEventListener('click', function(e) {
      var target = e.target.closest('.likert-option, .opcion-likert, [data-value]');
      if (!target) return;
      if (!target.closest('[data-item-id]')) return;
      handleOptionClick(target);
    });
  }

  // ─── Render por defecto ───
  function renderItems() {
    if (typeof window.LIKERT_RenderItems === 'function') {
      window.LIKERT_RenderItems();
      return;
    }

    if (!Array.isArray(window.LIKERT_Items)) return;

    var container = document.getElementById('likert-container');
    if (!container) return;

    var descripcion = document.getElementById('likert-descripcion');
    if (descripcion && window.LIKERT_Descripcion) {
      descripcion.textContent = window.LIKERT_Descripcion;
    }

    var titulo = document.getElementById('likert-titulo');
    if (titulo && window.LIKERT_Titulo) {
      titulo.textContent = window.LIKERT_Titulo;
    }

    container.innerHTML = window.LIKERT_Items.map(function(item, index) {
      var escala = Array.isArray(item.escala) && item.escala.length
        ? item.escala
        : [1, 2, 3, 4, 5].map(function(val) {
            return { value: val, label: String(val) };
          });

      var opciones = escala.map(function(opt) {
        return '<button type="button" class="likert-option" data-value="' + opt.value + '">' + opt.label + '</button>';
      }).join('');

      return '' +
        '<div class="likert-row" data-item-id="' + item.id + '">' +
          '<div class="likert-texto">' + item.texto + '</div>' +
          '<div class="likert-escala">' + opciones + '</div>' +
        '</div>';
    }).join('');
  }

  // ─── INIT ───
  function init() {
    renderItems();
    bindOptionClicks();
    cargarGuardadas();
  }

  // ─── EXPORTAR ───
  window.LikertEngine = {
    init: init,
    guardar: guardarRespuestas,
    exportarCSV: exportarCSV,
    resetear: resetear,
    mostrarResultados: mostrarResultados,
    getPromedio: calcularPromedio,
    getRespuestas: function() { return state.respuestas; },
    getRespuestasCount: function() { return Object.keys(state.respuestas).length; }
  };

  // Auto-init si el contenedor existe
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
