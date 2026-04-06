/**
 * js/likert-config-1.js
 * ═════════════════════════════════════════
 * Preguntas de autopercepción — Capítulo 1
 * ═════════════════════════════════════════
 *
 * FUENTE: Extraídas de chapter-1.html
 * NO modificar el texto de las preguntas.
 * Solo cambiar si el autor del contenido lo solicita.
 */

var LIKERT_Items = [
  {
    id: 'cap1_auto_1',
    categoria: 'confianza',
    texto: '¿Qué tan claro tienes las fases del potencial de acción?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  },
  {
    id: 'cap1_auto_2',
    categoria: 'confianza',
    texto: '¿Puedes aplicar la regla de vectores a cualquier derivación?',
    escala: [
      { value: 1, label: 'Totalmente en desacuerdo' },
      { value: 2, label: 'En desacuerdo' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'De acuerdo' },
      { value: 5, label: 'Totalmente de acuerdo' }
    ]
  }
];

/* ─── Datos del capítulo ─── */
var LIKERT_Capitulo      = 'Capítulo 1';
var LIKERT_Titulo        = 'Autopercepción — Capítulo 1';
var LIKERT_Descripcion   = 'Evalúa tu confianza antes y después de estudiar este capítulo.';
var LIKERT_BadgesKey     = 'cap1_likert_badges';
