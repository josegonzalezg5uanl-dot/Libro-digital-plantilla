/**
 * ═══════════════════════════════════════════════════════
 * CONFIGURACIÓN DEL QUIZ — CAPÍTULO 1
 * Fundamentos Fisiológicos y Técnicos
 * ═══════════════════════════════════════════════════════
 * ATENCIÓN: Este archivo define variables GLOBALES que lee quiz-engine.js.
 * NO cambiar los nombres de las variables (QUIZ_CAPitulo, QUIZ_Titulo, etc.)
 */

// ── IDENTIFICACIÓN DEL CAPÍTULO ──
var QUIZ_CAPitulo = 'Capítulo 1 – Fundamentos Fisiológicos';

// Título que se muestra en la pantalla de inicio del quiz
var QUIZ_Titulo = 'Quiz — Capítulo 1';
var QUIZ_Subtitulo = 'Fundamentos Fisiológicos y Técnicos';
var QUIZ_Descripcion = 'Pon a prueba lo que aprendiste. Cada error tiene una reflexión que te ayuda a entender por qué te equivocaste.';

// ── ESTADÍSTICAS DEL BANCO DE PREGUNTAS ──
var QUIZ_PreguntasPorPartida = 10;
var QUIZ_TotalPreguntas = 15;
var QUIZ_TiempoPorPregunta = 30;

// ── CLAVE DE INSIGNIAS EN localStorage ──
var QUIZ_BadgesKey = 'ecg_badges_cap1';

// ── LINKS DE NAVEGACIÓN ──
var QUIZ_LinkCapitulo = 'chapter-1.html';
var QUIZ_LinkSiguiente = 'chapter-2.html';
var QUIZ_LinkSiguienteTexto = 'Capítulo 2';

// ── BANCO DE PREGUNTAS (copiado íntegro) ──
var QUIZ_Questions = [
  {
    type: 'mcq',
    q: '¿Cuál es el potencial de membrana en reposo de una célula ventricular normal?',
    opts: { A: '+30 mV', B: '–90 mV', C: '0 mV', D: '–70 mV' },
    answer: 'B',
    why_wrong: {
      A: '+30 mV es el potencial máximo que alcanza la célula durante la Fase 0 (despolarización rápida), no el potencial de reposo.',
      C: '0 mV sería una célula sin diferencia de potencial entre el interior y exterior. En reposo, el interior de la célula es más negativo que el exterior.',
      D: '–70 mV corresponde al potencial de reposo de una neurona, no de una célula ventricular cardíaca, que es más negativa (–90 mV).'
    },
    reflection: '¿Por qué crees que el interior de la célula cardíaca es negativo en reposo y no positivo o neutro?',
    reflection_yes: 'Perfecto. La célula mantiene ese gradiente negativo gracias a la bomba Na⁺/K⁺-ATPasa que expulsa 3 Na⁺ por cada 2 K⁺ que entra, generando un exceso de cargas negativas dentro.',
    reflection_partial: 'El truco está en la bomba Na⁺/K⁺-ATPasa: saca más cargas positivas (3 Na⁺) de las que mete (2 K⁺), dejando el interior con carga neta negativa de –90 mV.',
    reflection_no: 'No te preocupes. Regresa a la sección "Potencial de Acción" y enfócate específicamente en el concepto de "potencial de membrana en reposo". La clave es la bomba Na⁺/K⁺.',
    points: 100
  },
  {
    type: 'mcq',
    q: 'Durante la Fase 2 del potencial de acción cardíaco (meseta o plateau), ¿qué ión es el responsable principal?',
    opts: { A: 'Na⁺ (entrada)', B: 'K⁺ (salida)', C: 'Ca²⁺ (entrada)', D: 'Cl⁻ (entrada)' },
    answer: 'C',
    why_wrong: {
      A: 'El Na⁺ es el protagonista de la Fase 0 (despolarización rápida), no de la meseta. En la Fase 2 los canales rápidos de Na⁺ ya están inactivados.',
      B: 'El K⁺ saliente es el responsable de las Fases 1 y 3 (repolarización). En la Fase 2 hay cierta salida de K⁺, pero es el Ca²⁺ entrante el que mantiene el plateau.',
      D: 'El Cl⁻ no tiene un papel protagonista en el potencial de acción cardíaco en ninguna de sus fases.'
    },
    reflection: '¿Recuerdas por qué es tan importante que el Ca²⁺ entre durante la meseta? ¿Qué desencadena esa entrada de calcio?',
    reflection_yes: '¡Exacto! El Ca²⁺ que entra en la Fase 2 desencadena la liberación de más Ca²⁺ desde el retículo sarcoplásmico, lo que provoca la contracción muscular cardíaca.',
    reflection_partial: 'La clave es que el Ca²⁺ entrante en Fase 2 actúa como "disparador" para que el retículo sarcoplásmico libere Ca²⁺ adicional, causando la contracción. Sin meseta, no hay contracción sostenida.',
    reflection_no: 'Revisa la tabla de fases del potencial de acción en el capítulo, específicamente la columna "Ión principal". La Fase 2 es la única con Ca²⁺ como protagonista.',
    points: 100
  },
  {
    type: 'mcq',
    q: '¿Cuál es la función principal del Nodo AV en el sistema de conducción?',
    opts: {
      A: 'Iniciar el impulso eléctrico cardíaco',
      B: 'Distribuir el impulso por los ventrículos',
      C: 'Retrasar el impulso para que las aurículas terminen de contraerse',
      D: 'Conectar la rama derecha con la izquierda del Haz de His'
    },
    answer: 'C',
    why_wrong: {
      A: 'Iniciar el impulso es la función del Nodo Sinusal (SA), el marcapasos natural del corazón. El Nodo AV recibe el impulso, no lo origina.',
      B: 'Distribuir el impulso por los ventrículos es la función de las Fibras de Purkinje, que tienen la mayor velocidad de conducción del sistema.',
      D: 'El Haz de His es el que se divide en rama derecha e izquierda. El Nodo AV está antes de ese punto y tiene una función diferente.'
    },
    reflection: '¿Entiendes por qué es necesario ese retraso de 120-200 ms? ¿Qué pasaría si el impulso llegara a los ventrículos al mismo tiempo que a las aurículas?',
    reflection_yes: 'Correcto. Sin ese retraso, aurículas y ventrículos se contraerían simultáneamente, perdiendo la sincronía que permite un llenado ventricular eficiente.',
    reflection_partial: 'Piénsalo así: las aurículas necesitan tiempo para vaciarse hacia los ventrículos. El retraso del Nodo AV es el "pause" que da tiempo al llenado ventricular antes de que se contraigan.',
    reflection_no: 'Revisa la sección "Nodo Auriculoventricular (AV)" del capítulo. La palabra clave es "retraso fisiológico" y su relación con el intervalo PR en el ECG.',
    points: 100
  },
  {
    type: 'mcq',
    topic: 'tiempo',
    q: 'A la velocidad estándar de 25 mm/s, cada cuadro grande del papel de ECG (5 mm) equivale a:',
    opts: { A: '0.04 segundos', B: '0.12 segundos', C: '0.20 segundos', D: '1.00 segundo' },
    answer: 'C',
    why_wrong: {
      A: '0.04 s corresponde a 1 mm (cuadro pequeño), no a 5 mm. Recuerda: 1 mm = 1/25 s = 0.04 s.',
      B: '0.12 s equivale a 3 cuadros pequeños (3 mm), no a un cuadro grande. Es el valor del intervalo PR mínimo normal, no de un cuadro grande.',
      D: '1.00 segundo equivale a 25 mm (5 cuadros grandes), no a uno solo. A 25 mm/s, 25 mm de papel pasan en 1 segundo.'
    },
    reflection: '¿Cuántos cuadros grandes necesitas contar para estimar una frecuencia cardíaca de 75 lpm?',
    reflection_yes: 'Correcto. A 75 lpm, el intervalo RR es ~0.80 s = 4 cuadros grandes. La regla rápida: 300 ÷ número de cuadros grandes entre R y R.',
    reflection_partial: 'La fórmula es: FC = 300 ÷ cuadros grandes entre dos ondas R. Prueba: si hay 4 cuadros grandes entre R-R → 300/4 = 75 lpm.',
    reflection_no: 'Vuelve a la sección "El Papel de Registro". La relación clave: 1 cuadro grande = 0.20 s. Para calcular FC: FC = 300 ÷ cuadros grandes R-R.',
    points: 100
  },
  {
    type: 'mcq',
    q: 'En el ECG, la despolarización auricular genera:',
    opts: { A: 'El complejo QRS', B: 'La onda T', C: 'La onda P', D: 'El segmento ST' },
    answer: 'C',
    why_wrong: {
      A: 'El complejo QRS representa la despolarización ventricular, no auricular. Es la onda más pronunciada del trazado porque la masa ventricular es mucho mayor.',
      B: 'La onda T representa la repolarización ventricular. Es el proceso opuesto a la despolarización y ocurre después del QRS.',
      D: 'El segmento ST es la línea isoeléctrica entre el fin del QRS y el inicio de la onda T. Representa el período entre despolarización y repolarización ventricular.'
    },
    reflection: '¿Puedes completar la secuencia? Despolarización auricular → __ / Despolarización ventricular → __ / Repolarización ventricular → __',
    reflection_yes: '¡Excelente! Onda P → QRS → Onda T. Esta secuencia es la base de toda la interpretación del ECG.',
    reflection_partial: 'La regla nemotécnica del capítulo: D (Despolarización) → P y QRS / R (Repolarización) → T.',
    reflection_no: 'Regresa a la sección "Despolarización y Repolarización" y memoriza la regla nemotécnica: D → P, QRS / R → T.',
    points: 100
  },
  {
    type: 'mcq',
    q: '¿Qué estructura del sistema de conducción tiene la mayor velocidad de conducción?',
    opts: { A: 'Nodo Sinusal (SA)', B: 'Nodo AV', C: 'Haz de His', D: 'Fibras de Purkinje' },
    answer: 'D',
    why_wrong: {
      A: 'El Nodo SA tiene una velocidad de 1 m/s, que es moderada. Su importancia no es la velocidad sino su automatismo espontáneo a 60-100 lpm.',
      B: 'El Nodo AV es, paradójicamente, el más LENTO del sistema (0.05 m/s). Su lentitud es intencional para crear el retraso fisiológico.',
      C: 'El Haz de His conduce a 2-4 m/s, más rápido que el Nodo AV, pero más lento que las Fibras de Purkinje.'
    },
    reflection: '¿Por qué crees que las Fibras de Purkinje necesitan ser las más rápidas? ¿Qué problema causaría si condujeran lento?',
    reflection_yes: 'Correcto. Si las Purkinje fueran lentas, distintas partes del ventrículo se contraerían en momentos diferentes, generando una contracción desincronizada e ineficiente.',
    reflection_partial: 'La razón es la sincronía: los ventrículos deben contraerse casi simultáneamente para bombear eficientemente. Las Purkinje a 4 m/s logran activar todo el ventrículo en milisegundos.',
    reflection_no: 'Revisa la tabla de velocidades de conducción en la sección "Sistema de Conducción". Ordena las 4 estructuras de más lenta a más rápida.',
    points: 100
  },
  {
    type: 'mcq',
    q: 'Si un vector de despolarización se ALEJA de un electrodo, la deflexión registrada en ese electrodo será:',
    opts: { A: 'Positiva (hacia arriba)', B: 'Negativa (hacia abajo)', C: 'Bifásica', D: 'No se registra nada' },
    answer: 'B',
    why_wrong: {
      A: 'La deflexión positiva ocurre cuando el vector se ACERCA al electrodo. "Se acerca = sube" en el trazo.',
      C: 'La deflexión bifásica ocurre cuando el vector es PERPENDICULAR al electrodo, pasando mitad hacia él y mitad alejándose.',
      D: 'Siempre se registra algo. Un vector que se aleja genera una deflexión negativa, no silencio eléctrico.'
    },
    reflection: '¿Puedes recordar la regla completa? Acercamiento → ___ / Alejamiento → ___ / Perpendicular → ___',
    reflection_yes: 'Excelente: Acercamiento → positiva / Alejamiento → negativa / Perpendicular → bifásica. Esta regla explica por qué cada derivación ve el mismo corazón de forma diferente.',
    reflection_partial: 'La regla completa: vector que SE ACERCA = deflexión positiva ↑ / vector que SE ALEJA = deflexión negativa ↓ / vector PERPENDICULAR = bifásica ↕',
    reflection_no: 'Busca en el capítulo la sección "Deflexión según el electrodo". La regla tiene solo 3 casos y es fundamental para entender las derivaciones.',
    points: 100
  },
  {
    type: 'mcq',
    topic: 'ion',
    q: 'La calibración estándar del ECG es 10 mm/mV. Una deflexión de 5 mm de altura equivale a:',
    opts: { A: '0.1 mV', B: '0.5 mV', C: '1.0 mV', D: '2.0 mV' },
    answer: 'B',
    why_wrong: {
      A: '0.1 mV equivale solo a 1 mm (un cuadro pequeño). Recuerda: 10 mm = 1 mV, por lo que cada mm = 0.1 mV.',
      C: '1.0 mV equivale a 10 mm (dos cuadros grandes). Si la deflexión mide 5 mm, divide entre 10: 5/10 = 0.5 mV, no 1.0 mV.',
      D: '2.0 mV equivale a 20 mm. Una deflexión de 5 mm está muy por debajo de ese valor. Recuerda siempre partir de la regla: 10 mm = 1 mV.'
    },
    reflection: '¿Qué error clínico podrías cometer si el ECG fue grabado a media calibración (5 mm/mV) y no lo notas?',
    reflection_yes: 'Correcto. A media calibración las deflexiones miden la mitad, podrías interpretar voltajes normales como bajos y diagnosticar erróneamente "bajos voltajes" o subestimar una hipertrofia ventricular.',
    reflection_partial: 'A media calibración (5 mm/mV), una onda R de 8 mm en realidad mide 1.6 mV, no 0.8 mV. Siempre verifica la señal de calibración al inicio del trazado.',
    reflection_no: 'Revisa la sección "El Papel de Registro" y el recuadro de advertencia sobre calibración. La clave: busca siempre la señal cuadrada de 10 mm al inicio del ECG.',
    points: 100
  },
  {
    type: 'mcq',
    q: '¿Cuál es la frecuencia de descarga normal del Nodo Sinusal (SA)?',
    opts: { A: '20-40 lpm', B: '40-60 lpm', C: '60-100 lpm', D: '100-150 lpm' },
    answer: 'C',
    why_wrong: {
      A: '20-40 lpm es la frecuencia de escape de las Fibras de Purkinje. Si el SA falla y las Purkinje toman el mando, el ritmo sería tan lento que causaría síntomas.',
      B: '40-60 lpm es la frecuencia de escape del Nodo AV. Si el SA falla, el AV puede ser el marcapasos secundario a esta frecuencia.',
      D: '100-150 lpm sería taquicardia. El SA puede acelerar hasta esas frecuencias, pero no es su rango normal en reposo.'
    },
    reflection: '¿Por qué es importante que el SA tenga la frecuencia más alta de todo el sistema de conducción?',
    reflection_yes: 'Correcto. Al tener la frecuencia más alta, el SA "suprime" el automatismo de las estructuras inferiores, dominando el ritmo. Si el SA falla, el siguiente más rápido toma el control.',
    reflection_partial: 'El principio es: en el corazón, manda quien más rápido dispara. El SA a 60-100 lpm es más rápido que el AV (40-60) y las Purkinje (20-40), por eso siempre domina.',
    reflection_no: 'Revisa la tabla de velocidades y frecuencias de escape del capítulo. El concepto clave es "supresión por sobreestimulación" — el SA al ser el más rápido, suprime a los demás.',
    points: 100
  },
  {
    type: 'mcq',
    q: 'En el contexto del ECG, ¿qué representa la Fase 4 del potencial de acción en las células del Nodo Sinusal (a diferencia de las células ventriculares)?',
    opts: {
      A: 'Reposo absoluto sin actividad eléctrica',
      B: 'Despolarización diastólica espontánea (automatismo)',
      C: 'Repolarización rápida por salida de K⁺',
      D: 'Entrada masiva de Na⁺ para iniciar el siguiente potencial'
    },
    answer: 'B',
    why_wrong: {
      A: 'En células ventriculares sí hay reposo en Fase 4, pero en el Nodo SA no. Las células marcapasos tienen una corriente de despolarización lenta y espontánea que las hace disparar automáticamente.',
      C: 'La repolarización rápida por salida de K⁺ corresponde a la Fase 3, no a la Fase 4.',
      D: 'La entrada masiva de Na⁺ es la Fase 0. La Fase 4 del SA involucra corrientes más lentas (If, o "corriente funny") que generan la despolarización gradual.'
    },
    reflection: '¿Qué consecuencia clínica tendría si las células del Nodo SA perdieran su capacidad de despolarización espontánea?',
    reflection_yes: 'Exacto: se produciría un paro sinusal. El siguiente marcapasos de rescate sería el Nodo AV a 40-60 lpm. Si este también falla, las Purkinje a 20-40 lpm. Si todo falla, paro cardíaco.',
    reflection_partial: 'Sin automatismo del SA, el corazón dependería del próximo marcapasos: el Nodo AV (40-60 lpm). Esto se llama "ritmo nodal de escape" y es una emergencia clínica.',
    reflection_no: 'Vuelve a leer la descripción de Fase 4 en la tabla del capítulo: "Estable (trabajo) o despolarización espontánea (marcapasos)". La diferencia entre células de trabajo y células marcapasos está ahí.',
    points: 120
  },

  // ── PREGUNTAS NUEVAS (set 2) ──────────────────────────────────
  {
    type: 'mcq',
    q: '¿Cuál es el ión responsable de la Fase 0 (despolarización rápida) del potencial de acción en las células ventriculares?',
    opts: { A: 'Potasio (K⁺)', B: 'Calcio (Ca²⁺)', C: 'Sodio (Na⁺)', D: 'Magnesio (Mg²⁺)' },
    answer: 'C',
    why_wrong: {
      A: 'El K⁺ tiene el papel opuesto: su SALIDA genera la repolarización en las Fases 1 y 3. En Fase 0 los canales de K⁺ están cerrados.',
      B: 'El Ca²⁺ es el protagonista de la Fase 2 (meseta/plateau), no de la Fase 0. Su entrada es más lenta y sostenida, no rápida como la del Na⁺.',
      D: 'El Mg²⁺ no tiene un papel directo en las fases del potencial de acción cardíaco. Funciona principalmente como cofactor enzimático.'
    },
    reflection: '¿Puedes relacionar la entrada masiva y rápida de Na⁺ en Fase 0 con lo que se ve en el ECG? ¿Qué onda representa ese momento?',
    reflection_yes: 'Perfecto. La despolarización rápida ventricular (Fase 0 masiva de Na⁺) genera el complejo QRS en el ECG — la onda más prominente del trazado.',
    reflection_partial: 'La Fase 0 de todas las células ventriculares activándose casi simultáneamente produce la deflexión rápida y pronunciada que llamamos complejo QRS.',
    reflection_no: 'Regresa a la tabla de fases del potencial de acción. Fase 0 = Na⁺ entrada = despolarización rápida = origen del QRS. Esa cadena es clave.',
    points: 100
  },
  {
    type: 'mcq',
    q: '¿Qué estructura del sistema de conducción es conocida como el "marcapasos natural" del corazón?',
    opts: {
      A: 'Nodo Auriculoventricular (AV)',
      B: 'Fibras de Purkinje',
      C: 'Haz de His',
      D: 'Nodo Sinusal (SA)'
    },
    answer: 'D',
    why_wrong: {
      A: 'El Nodo AV es el marcapasos SECUNDARIO — si el SA falla, el AV toma el control a 40-60 lpm. Pero en condiciones normales el SA lo suprime.',
      B: 'Las Fibras de Purkinje son el marcapasos TERCIARIO de escape (20-40 lpm). Su papel principal es la conducción rápida, no el inicio del impulso.',
      C: 'El Haz de His es un conductor, no un marcapasos. Su función es transmitir el impulso desde el Nodo AV hacia las ramas y las Purkinje.'
    },
    reflection: '¿Por qué el Nodo SA domina como marcapasos y no el AV o las Purkinje, si todos tienen automatismo?',
    reflection_yes: 'Correcto. El SA tiene la frecuencia espontánea más alta (60-100 lpm), así que siempre llega primero. Los demás no alcanzan a disparar solos porque el SA los "reinicia" antes.',
    reflection_partial: 'Es una competencia de velocidad: el que dispara más rápido domina. SA gana con 60-100 lpm vs AV con 40-60 y Purkinje con 20-40. El ganador suprime a los demás.',
    reflection_no: 'Lee la sección "Nodo Sinusal (SA)" y presta atención a la frase "Su automatismo es el más rápido del sistema, por lo que domina el ritmo cardíaco".',
    points: 100
  },
  {
    type: 'mcq',
    q: 'En un ECG estándar registrado a 25 mm/s, ¿cuánto tiempo representan 3 cuadros grandes consecutivos?',
    opts: { A: '0.12 segundos', B: '0.60 segundos', C: '0.20 segundos', D: '1.00 segundo' },
    answer: 'B',
    why_wrong: {
      A: '0.12 segundos sería 3 cuadros PEQUEÑOS (3 × 0.04 s = 0.12 s), no 3 cuadros grandes. Es un valor que coincide con la duración normal del QRS.',
      C: '0.20 segundos es lo que representa UN solo cuadro grande (5 mm × 0.04 s/mm = 0.20 s). La pregunta pide TRES cuadros grandes.',
      D: '1.00 segundo equivale a 5 cuadros grandes (5 × 0.20 s). Tres cuadros grandes son solo el 60% de ese segundo.'
    },
    reflection: '¿Puedes calcular rápidamente cuántos cuadros grandes hay en un trazado de 6 segundos? ¿Para qué sirve saber eso en la práctica?',
    reflection_yes: 'Excelente: 6 s ÷ 0.20 s = 30 cuadros grandes. Contar los complejos QRS en 6 segundos y multiplicar por 10 es uno de los métodos para calcular la frecuencia cardíaca.',
    reflection_partial: 'En 6 segundos hay 30 cuadros grandes. Si cuentas los QRS en esa franja y multiplicas × 10, obtienes la frecuencia en lpm. Muy útil en ritmos irregulares.',
    reflection_no: 'La clave es: 1 cuadro grande = 0.20 s. Para 3 cuadros grandes: 3 × 0.20 = 0.60 s. Practica con la tabla de escala del capítulo haciendo conversiones.',
    points: 100
  },
  {
    type: 'mcq',
    q: 'Si un vector eléctrico de despolarización se aleja directamente de un electrodo de registro, ¿cómo será la deflexión en el ECG?',
    opts: {
      A: 'Positiva (hacia arriba)',
      B: 'Negativa (hacia abajo)',
      C: 'Isodifásica (bifásica igual hacia arriba y hacia abajo)',
      D: 'Línea isoeléctrica plana, sin deflexión'
    },
    answer: 'B',
    topic: 'vector',
    clinical_consequence: '<strong>⚠️ Error de vector:</strong> Tu electrodo está "mirando" hacia el lado opuesto del vector. Es como intentar ver una película de espaldas a la pantalla. Confundir esto te haría reportar una onda negativa como patológica cuando es solo perspectiva del electrodo.',
    reflection_yes_short: '✅ Entiendo — alejamiento = negativa, como mirar hacia atrás',
    reflection_partial_short: '🤔 Entiendo la regla pero se me complica aplicarla a derivaciones',
    reflection_no_short: '❌ Aún confundo cuándo es positiva o negativa una deflexión',
    why_wrong: {
      A: 'La deflexión positiva ocurre cuando el vector SE ACERCA al electrodo. "Acercamiento = positiva, alejamiento = negativa" es la regla fundamental.',
      C: 'La deflexión bifásica (isodifásica) ocurre cuando el vector es PERPENDICULAR al electrodo, pasando la mitad de su recorrido acercándose y la mitad alejándose.',
      D: 'Siempre habrá alguna deflexión si hay actividad eléctrica. La línea isoeléctrica real ocurre durante períodos de silencio eléctrico (segmentos PR y ST en condiciones normales).'
    },
    reflection: 'Aplicando esta regla: si en la derivación DII el vector cardíaco principal se acerca al electrodo, ¿la onda P será positiva o negativa en DII?',
    reflection_yes: 'Correcto. En DII el vector auricular se aproxima al electrodo positivo, generando una onda P positiva — lo que vemos en ritmo sinusal normal.',
    reflection_partial: 'En DII con ritmo sinusal, el vector auricular viaja hacia el electrodo positivo (se acerca), generando onda P positiva. Por eso DII es la derivación clásica para evaluar el ritmo.',
    reflection_no: 'Revisa la sección "Deflexión según el electrodo" del capítulo. La regla es: ACERCAMIENTO → positiva ↑ / ALEJAMIENTO → negativa ↓ / PERPENDICULAR → bifásica ↕',
    points: 100
  },
  {
    type: 'mcq',
    q: '¿Qué proceso fisiológico está representado por la aparición de la onda T en el trazado del ECG?',
    opts: {
      A: 'Despolarización auricular',
      B: 'Repolarización ventricular',
      C: 'Retraso de la conducción en el Nodo AV',
      D: 'Despolarización ventricular'
    },
    answer: 'B',
    why_wrong: {
      A: 'La despolarización auricular genera la onda P, la primera onda del ciclo cardíaco. La repolarización auricular existe pero queda oculta dentro del QRS.',
      C: 'El retraso en el Nodo AV se refleja en la duración del intervalo PR (de inicio de P al inicio del QRS). No genera una onda visible por sí mismo.',
      D: 'La despolarización ventricular genera el complejo QRS. La onda T viene DESPUÉS y representa el proceso opuesto: la recuperación (repolarización).'
    },
    reflection: '¿Por qué crees que la repolarización auricular no genera una onda visible en el ECG como sí lo hace la repolarización ventricular (onda T)?',
    reflection_yes: 'Exacto: la repolarización auricular es de baja amplitud y ocurre durante el QRS, siendo "tapada" por la gran señal ventricular. Solo se ve en condiciones especiales.',
    reflection_partial: 'La masa auricular es mucho menor que la ventricular, genera menos voltaje. Además, su repolarización ocurre justo cuando el QRS está en curso, enmascarándola completamente.',
    reflection_no: 'Vuelve a la sección "Despolarización y Repolarización" y la regla nemotécnica: R (Repolarización) → T. La onda T siempre es repolarización ventricular.',
    points: 100
  }
];

// ── INSIGNIAS ESPECÍFICAS DE ESTE CAPÍTULO ──
var QUIZ_Badges = [
  {
    id: 'maestro_iones',
    icon: '⚡',
    name: 'Maestro de Iones',
    desc: 'Respondiste todas las preguntas sobre fases del potencial de acción correctamente a la primera.',
    check: function(s) { return s.log.filter(function(l) { return l.topic === 'ion'; }).every(function(l) { return l.intentos === 1; }); }
  },
  {
    id: 'reloj_precision',
    icon: '⏱️',
    name: 'Reloj de Precisión',
    desc: 'Respondiste preguntas de tiempo/intervalos en menos de 10 segundos.',
    check: function(s) { return s.log.filter(function(l) { return l.topic === 'tiempo'; }).some(function(l) { return l.tiempoUsado < 10; }); }
  },
  {
    id: 'maestro_vectores',
    icon: '🧭',
    name: 'Maestro de Vectores',
    desc: 'Respondiste todas las preguntas sobre vectores correctamente a la primera.',
    check: function(s) { return s.log.filter(function(l) { return l.topic === 'vector'; }).every(function(l) { return l.intentos === 1; }); }
  },
  {
    id: 'primer_intento',
    icon: '🌟',
    name: 'Primer Intento',
    desc: 'Respondiste 5 preguntas seguidas correctas a la primera.',
    check: function(s) {
      var max = 0, cur = 0;
      s.log.forEach(function(l) {
        if (l.intentos === 1) { cur++; max = Math.max(max, cur); }
        else cur = 0;
      });
      return max >= 5;
    }
  },
  {
    id: 'energia_plena',
    icon: '💪',
    name: 'Energía Plena',
    desc: 'Terminaste el quiz con más del 80% de energía.',
    check: function(s) { return s.energyFinal >= 80; }
  },
  {
    id: 'reflexivo',
    icon: '🧠',
    name: 'Reflexivo',
    desc: 'Usaste el Duelo de Reflexión y respondiste "Sí entendí" al menos 3 veces.',
    check: function(s) { return (s.npcYesCount || 0) >= 3; }
  }
];
