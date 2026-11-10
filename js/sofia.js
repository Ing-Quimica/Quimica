/* ==============================================================================
   PORTAL WEB OFICIAL · INGENIERÍA QUÍMICA · UNAL SEDE MEDELLÍN
   Arquitectura de software, maquetación y desarrollo integral por:
   Santiago Escobar Arias · Representante Estudiantil de Sistemas e Informática
   Canales Oficiales e Información de Ingeniería Química:
   María José Collazos · Representante Estudiantil Principal
   Joner Figueroa · Representante Estudiantil Suplente
   Facultad de Minas — Universidad Nacional de Colombia, Sede Medellín
   ============================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURACIÓN Y CONSTANTES OFICIALES DE INGENIERÍA QUÍMICA
  // ==========================================================================

  const SOFIA_CFG = {
    nombre: 'sofIA',
    programa: 'Ingeniería Química',
    facultad: 'Facultad de Minas',
    sede: 'Sede Medellín',
    campus: 'Campus Robledo',
    creditosTotales: 175,
    duracionSemestres: 10,
    planAcuerdo: 'Acuerdo 163 de 2018 del Consejo Académico',
    codigoSIA: '3525 (Plan Vigente)',
    codigoSNIES: '123',
    lema: 'Trabajo y Rectitud',
    añoCreacion: '1973 (Más de 50 años de excelencia)',

    // Creador y Desarrollador Web
    creadorNombre: 'Santiago Escobar Arias',
    creadorRol: 'Representante Estudiantil de Ingeniería de Sistemas e Informática · Arquitecto y Creador del Portal Web',
    creadorWhatsApp: 'https://wa.me/573123772091',
    creadorTelefono: '(+57) 312 377 2091',
    creadorCorreo: 'saescobara@unal.edu.co',
    creadorInstagram: 'https://www.instagram.com/s_escobar__/',
    creadorInstagramUsuario: '@s_escobar__',

    // Representación Estudiantil Oficial de Ingeniería Química
    reprePrincipalNombre: 'María José Collazos',
    reprePrincipalWhatsApp: 'https://wa.me/573024153321',
    reprePrincipalTelefono: '(+57) 302 415 3321',
    reprePrincipalCorreo: 'macollazosm@unal.edu.co',
    reprePrincipalInstagram: 'https://www.instagram.com/majocollazoss/',

    repreSuplenteNombre: 'Joner Figueroa',
    repreSuplenteWhatsApp: 'https://wa.me/57322638014',
    repreSuplenteTelefono: '(+57) 322 638 014',

    repreInstagramOficial: 'https://www.instagram.com/repres_iq1/',
    usuarioInstagramOficial: '@repres_iq1',
    canalWhatsApp: 'https://chat.whatsapp.com/JjnmD2vnn1h5ISKkKza5S6',

    // Recursos Oficiales y Trámites
    driveRecursos: 'https://drive.google.com/drive/folders/0AEk8YJGqI3OvUk9PVA?hl=es',
    tramitesMinasUrl: 'https://minas.medellin.unal.edu.co/estudiantes/gestion-de-asuntos-estudiantiles/gae-solicitudes-estudiantiles',
    asesoriaMinasCorreo: 'asesorestu_med@unal.edu.co',
    asesoriaMinasTelefono: '(+57 604) 430 9653',
    asesoriaMinasUbicacion: 'Campus Robledo, Bloque M4, Medellín',
  };

  // Avatar SVG holográfico de sofIA con estética química / reactores / átomos
  const SOFIA_SVG_AVATAR = `
    <svg viewBox="0 0 44 44" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="sofiaGradGlowQ" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFA875" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#E8743B" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#6B1F3A" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="sofiaGradAtomQ" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F2A65A" />
          <stop offset="50%" stop-color="#E8743B" />
          <stop offset="100%" stop-color="#6B1F3A" />
        </linearGradient>
      </defs>
      <!-- Resplandor exterior -->
      <circle cx="22" cy="22" r="20" fill="url(#sofiaGradGlowQ)" />
      <!-- Matraz / Frasco de laboratorio estilizado -->
      <path d="M19 12V16L13.5 27.5C12.8 28.9 13.8 30.5 15.4 30.5H28.6C30.2 30.5 31.2 28.9 30.5 27.5L25 16V12H19Z" stroke="url(#sofiaGradAtomQ)" stroke-width="2" stroke-linejoin="round" fill="rgba(107, 31, 58, 0.45)"/>
      <line x1="17.5" y1="12" x2="26.5" y2="12" stroke="#F2A65A" stroke-width="2" stroke-linecap="round"/>
      <!-- Burbujas químicas reactivas -->
      <circle cx="20" cy="25" r="1.8" fill="#F2A65A" />
      <circle cx="24" cy="23" r="1.2" fill="#FFA875" />
      <circle cx="22" cy="27" r="1.5" fill="#FFE082" />
      <!-- Órbita electrónica sutil -->
      <ellipse cx="22" cy="22" rx="16" ry="6" stroke="#F2A65A" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.75" transform="rotate(-25 22 22)" />
    </svg>
  `;

  // ==========================================================================
  // 2. ESTRUCTURA DE DATOS E ÍNDICES EN MEMORIA
  // ==========================================================================

  const datosApp = {
    programa: null,
    perfil: null,
    componentes: null,
    plan: null,
    asignaturas: [],
    grupos: [],
    info: null,
  };

  const indices = {
    materiasPorCodigo: new Map(),
    materiasPorNombre: new Map(),
    aliasMaterias: new Map(),
    materiasPorSemestre: new Map(),
    guiasPorId: new Map(),
    calendarioFilas: [],
  };

  function normalizar(texto) {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ==========================================================================
  // 3. CARGA DINÁMICA DE DATOS Y CONSTRUCCIÓN DE ÍNDICES
  // ==========================================================================

  async function cargarDatos() {
    try {
      const [prog, perf, comp, plan, asig, grup, inf] = await Promise.all([
        fetch('data/programa.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/perfil.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/malla/componentes.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/malla/plan.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('data/malla/asignaturas.json').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('data/grupos.json').then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch('data/info.json').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      datosApp.programa = prog;
      datosApp.perfil = perf;
      datosApp.componentes = comp;
      datosApp.plan = plan;
      datosApp.asignaturas = Array.isArray(asig) ? asig : [];
      datosApp.grupos = Array.isArray(grup) ? grup : [];
      datosApp.info = inf;

      construirIndices();
    } catch (e) {
      console.warn('sofIA: Advertencia al cargar datos de Ingeniería Química:', e);
    }
  }

  function construirIndices() {
    indices.materiasPorCodigo.clear();
    indices.materiasPorNombre.clear();
    indices.aliasMaterias.clear();
    indices.materiasPorSemestre.clear();
    indices.guiasPorId.clear();
    indices.calendarioFilas = [];

    // Indexar asignaturas
    datosApp.asignaturas.forEach((asig) => {
      const cod = String(asig.codigo || '').trim().toUpperCase();
      if (cod) indices.materiasPorCodigo.set(cod, asig);

      const nomNorm = normalizar(asig.nombre);
      if (nomNorm) indices.materiasPorNombre.set(nomNorm, asig);

      if (asig.semestre) {
        const sem = parseInt(asig.semestre, 10);
        if (!indices.materiasPorSemestre.has(sem)) {
          indices.materiasPorSemestre.set(sem, []);
        }
        indices.materiasPorSemestre.get(sem).push(asig);
      }
    });

    // Alias y jerga estudiantil de Ingeniería Química UNAL Medellín
    const ALIAS_MATERIAS = [
      [['calculo diferencial', 'diferencial', 'calculo 1', 'calc 1'], 'Cálculo Diferencial'],
      [['calculo integral', 'integral', 'calculo 2', 'calc 2'], 'Cálculo Integral'],
      [['calculo en varias variables', 'varias variables', 'calculo 3', 'calc 3', 'cvv'], 'Cálculo en Varias variables'],
      [['algebra lineal', 'lineal', 'algebra'], 'Álgebra Lineal'],
      [['geometria vectorial y analitica', 'geometria vectorial', 'vectorial', 'geo vec'], 'Geometría Vectorial y Analítica'],
      [['ecuaciones diferenciales', 'diferenciales', 'ed'], 'Ecuaciones Diferenciales'],
      [['metodos numericos', 'numericos'], 'Métodos Numéricos'],
      [['estadistica 1', 'estadistica i', 'probabilidad y estadistica', 'probabilidad'], 'Estadística I'],
      [['matematicas especiales', 'mate especiales', 'especiales'], 'Matemáticas Especiales'],
      [['matematicas discretas', 'discretas'], 'Matemáticas Discretas'],

      [['fisica mecanica', 'mecanica', 'fisica 1'], 'Física Mecánica'],
      [['fisica de electricidad y magnetismo', 'electricidad y magnetismo', 'fisica 2', 'electromagnetismo', 'electri'], 'Física de Electricidad y Magnetismo'],
      [['fisica moderna', 'moderna'], 'Física Moderna'],
      [['fisica de oscilaciones ondas y optica', 'oscilaciones ondas y optica', 'ondas y optica', 'optica', 'fisica 3'], 'Física de Oscilaciones, Ondas y Óptica'],
      [['laboratorio de fisica moderna', 'lab moderna'], 'Laboratorio de Física Moderna'],
      [['mecanica cuantica', 'cuantica'], 'Mecánica Cuántica'],
      [['simulaciones', 'simulacion fisica'], 'Simulaciones'],
      [['fisica de radiaciones', 'radiaciones'], 'Física de Radiaciones'],

      [['quimica general', 'quimica 1'], 'Química General'],
      [['quimica organica', 'organica'], 'Química Orgánica'],
      [['quimica analitica', 'analitica'], 'Química Analítica'],
      [['introduccion a la quimica de materiales', 'quimica de materiales'], 'Introducción a la Química de Materiales'],
      [['bioquimica', 'bioquim'], 'Bioquímica'],
      [['laboratorio de quimica general', 'lab quimica general', 'lab general'], 'Laboratorio de Química General'],
      [['laboratorio de quimica organica', 'lab de organica', 'lab organica'], 'Laboratorio de Química Orgánica'],
      [['laboratorio de quimica analitica', 'lab de analitica', 'lab analitica'], 'Laboratorio de Química Analítica'],
      [['laboratorio de bioquimica', 'lab de bioquimica', 'lab bioquimica'], 'Laboratorio de Bioquímica'],

      [['fundamentos de programacion', 'programacion', 'python', 'intro a la programacion'], 'Fundamentos de Programación'],
      [['biologia general', 'biologia'], 'Biología General'],
      [['ciencias de los materiales', 'ciencia de los materiales', 'materiales'], 'Ciencias de los Materiales'],
      [['biologia celular', 'celular'], 'Biología Celular'],
      [['biologia molecular', 'molecular'], 'Biología Molecular'],
      [['macroeconomia 1', 'macroeconomia', 'macro'], 'Macroeconomía I'],
      [['ecologia general', 'ecologia'], 'Ecología General'],
      [['introduccion a la nanotecnologia quimica', 'nanotecnologia quimica', 'nanotecnologia', 'nano'], 'Introducción a la Nanotecnología Química'],

      [['introduccion a la ingenieria quimica', 'intro a iq', 'intro iq', 'iiq'], 'Introducción a la Ingeniería Química'],
      [['fundamentos de biotecnologia', 'biotecnologia', 'biotec'], 'Fundamentos de Biotecnología'],
      [['introduccion al control de procesos', 'intro al control', 'control de procesos 1'], 'Introducción al Control de Procesos'],
      [['termodinamica general', 'termo general', 'termo 1'], 'Termodinámica General'],
      [['termodinamica del equilibrio de fases para sistemas multicomponentes', 'termodinamica del equilibrio de fases', 'termo de fases', 'termo 2', 'equilibrio de fases'], 'Termodinámica del Equilibrio de Fases para Sistemas Multicomponentes'],
      [['equilibrios en sistemas reactivos y fenomenos de superficie', 'equilibrios en sistemas reactivos', 'sistemas reactivos', 'termo 3', 'fenomenos de superficie'], 'Equilibrios en Sistemas Reactivos y Fenómenos de Superficie'],
      [['laboratorio 1 de ingenieria quimica termodinamica', 'laboratorio 1 de ingenieria quimica', 'lab 1 de iq', 'lab termo', 'laboratorio termodinamica'], 'Laboratorio I de Ingeniería Química, Termodinámica'],

      [['balances de materia y energia', 'balance de materia y energia', 'balance de materia', 'balances', 'bme'], 'Balances de Materia y Energía'],
      [['fenomenos de transporte', 'transporte', 'fenomenos', 'fdt'], 'Fenómenos de Transporte'],
      [['operaciones de transferencia de cantidad de movimiento', 'transferencia de cantidad de movimiento', 'movimiento', 'fluidos iq', 'transferencia de momento'], 'Operaciones de Transferencia de Cantidad de Movimiento'],
      [['operaciones de transferencia de calor', 'transferencia de calor', 'intercambiadores de calor', 'intercambiadores'], 'Operaciones de Transferencia de Calor'],
      [['operaciones de transferencia de masa', 'transferencia de masa', 'operaciones de masa', 'destilacion', 'columnas de destilacion'], 'Operaciones de Transferencia de Masa'],
      [['ingenieria de los reactores quimicos', 'ingenieria de reactores quimicos', 'reactores quimicos', 'reactores', 'cinetica y reactores'], 'Ingeniería de los Reactores Químicos'],
      [['laboratorio 2 de ingenieria quimica', 'lab 2 de iq', 'lab operaciones', 'laboratorio operaciones'], 'Laboratorio II de Ingeniería Química, Operaciones de Transferencia y Control de Procesos'],
      [['ingenieria de procesos', 'diseno de procesos', 'procesos'], 'Ingeniería de Procesos'],

      [['fundamentos de proyectos en ingenieria', 'fundamentos de proyectos', 'fpi'], 'Fundamentos de Proyectos en Ingeniería'],
      [['estructuracion y evaluacion de proyectos de ingenieria', 'formulacion y evaluacion de proyectos', 'evaluacion de proyectos'], 'Estructuración y Evaluación de Proyectos de Ingeniería'],
      [['proyecto integrado de ingenieria', 'proyecto integrado', 'pii'], 'Proyecto Integrado de Ingeniería'],

      [['topicos especiales en termodinamica', 'topicos de termo'], 'Tópicos Especiales en Termodinámica'],
      [['conversion de energia en sistemas termofluidicos', 'conversion de energia', 'termofluidicos'], 'Conversión de Energía en Sistemas Termofluídicos'],
      [['simulacion de procesos quimicos', 'simulacion de procesos', 'aspen', 'aspen plus', 'dwsim'], 'Simulación de Procesos Químicos'],
      [['topicos especiales en operaciones unitarias', 'topicos de operaciones'], 'Tópicos Especiales en Operaciones Unitarias'],
      [['separacion de sistemas multicomponentes', 'separacion multicomponentes'], 'Separación de Sistemas Multicomponentes'],
      [['analisis de plantas industriales', 'plantas industriales', 'diseno de plantas'], 'Análisis de Plantas Industriales'],
      [['laboratorio de control de procesos', 'lab de control'], 'Laboratorio de Control de Procesos'],
      [['la energia en el tratamiento sostenible de aguas', 'tratamiento sostenible de aguas', 'tratamiento de aguas', 'aguas'], 'La Energía en el Tratamiento Sostenible de Aguas'],
      [['estrategias de gestion y gerencia de proyectos en ingenieria', 'gerencia de proyectos', 'estrategias de gestion'], 'Estrategias de Gestión y Gerencia de Proyectos en Ingeniería'],
      [['gestion de proyectos de desarrollo y metodologia general ajustada', 'metodologia general ajustada', 'mga'], 'Gestión de Proyectos de Desarrollo y Metodología General Ajustada'],
      [['proyectos de innovacion y desarrollo', 'innovacion y desarrollo'], 'Proyectos de Innovación y Desarrollo'],
      [['toma de decision para el diseno en ingenieria', 'toma de decisiones'], 'Toma de Decisión para el Diseño en Ingeniería'],
      [['fundamentos de ciclo de vida para ingenieria', 'fundamentos de ciclo de vida', 'ciclo de vida', 'acv'], 'Fundamentos de Ciclo de Vida para Ingeniería'],
      [['investigacion de operaciones 1', 'investigacion de operaciones i', 'io 1'], 'Investigación de Operaciones I'],
      [['teoria administrativa y organizacional', 'teoria administrativa', 'administracion'], 'Teoría Administrativa y Organizacional'],

      [['trabajo de grado', 'tesis', 'grado', 'tg'], 'Trabajo de Grado'],
      [['practica de extension', 'pasantia', 'practica profesional', 'practica empresarial'], 'Práctica de Extensión'],
      [['cursos de posgrado', 'materias de posgrado', 'posgrado como opcion de grado'], 'Cursos de Posgrado'],
    ];

    ALIAS_MATERIAS.forEach(([sinonimos, nombreOficial]) => {
      const nomNorm = normalizar(nombreOficial);
      const asig = indices.materiasPorNombre.get(nomNorm);
      if (asig) {
        sinonimos.forEach((sin) => {
          indices.aliasMaterias.set(normalizar(sin), asig);
        });
      }
    });

    // Indexar guías de info.json
    if (datosApp.info && Array.isArray(datosApp.info.guias)) {
      datosApp.info.guias.forEach((guia) => {
        if (guia.id) indices.guiasPorId.set(guia.id, guia);
        if (guia.id === 'calendario' && Array.isArray(guia.semanas)) {
          guia.semanas.forEach((sem) => {
            indices.calendarioFilas.push({
              evento: sem.evento || sem.titulo || '',
              fecha: sem.fecha || sem.plazo || '',
              grupo: sem.grupo || 'General',
              eventoNorm: normalizar(sem.evento || sem.titulo || ''),
            });
          });
        }
      });
    }
  }

  // ==========================================================================
  // 4. MOTOR DE RESPUESTA EN LENGUAJE NATURAL (PLN)
  // ==========================================================================

  function responderPregunta(consultaOriginal) {
    const pregunta = (consultaOriginal || '').trim();
    const preguntaNorm = normalizar(pregunta);

    if (!preguntaNorm) {
      return {
        texto: 'Por favor escribe tu consulta sobre el programa de Ingeniería Química, la malla curricular, materias, prerrequisitos, capítulos estudiantiles (AIChE), trámites ante la Facultad de Minas o recursos de estudio.',
        chips: ['¿Qué es la malla curricular?', '¿Qué tipo de materias hay?', '¿Por qué estudiar Química?'],
      };
    }

    // ------------------------------------------------------------------------
    // 1. Saludos y Presentación
    // ------------------------------------------------------------------------
    if (/^(hola|buen(as|os)?|saludos|hey|que tal|iniciar|comenzar|hi|hello)$/.test(preguntaNorm) || preguntaNorm.startsWith('hola sofia')) {
      return {
        texto: `¡Hola! Soy **${SOFIA_CFG.nombre}**, tu asistente inteligente del programa de **${SOFIA_CFG.programa}** de la **${SOFIA_CFG.facultad}** (UNAL Medellín).

Pregúntame con total confianza sobre:
- **Malla Curricular y prerrequisitos** de las 71 asignaturas del plan.
- **Tipos de materias** y componentes (Fundamentación, Disciplinar, Libre Elección).
- **¿Por qué estudiar Ingeniería Química?** y trayectoria en la Facultad de Minas.
- **¿Quién es el creador de la web?** (Santiago Escobar Arias).
- **¿Quién es el representante estudiantil?** (María José Collazos y Joner Figueroa).
- **Capítulos y grupos estudiantiles:** AIChE UNAL Medellín (Congreso PROCESA, Chem-E-Car).
- **¿Cómo hacer cambio de carrera / traslados?** ante la Facultad de Minas.
- **Alianzas estratégicas** (ICETEX, Sapiencia, Metro Cívica, software técnico: Aspen Plus, HYSYS, MATLAB).
- **Banco de Recursos / Drive oficial** con talleres de balance, reactores y parciales anteriores.

¿Sobre qué tema te gustaría consultar hoy?`,
        chips: [
          '¿Qué es la malla curricular?',
          '¿Qué tipo de materias hay?',
          '¿Por qué estudiar Química?',
          '¿Quién es el creador de la web?',
          'Contacto de la Representación',
          'Capítulo Estudiantil AIChE',
        ],
      };
    }

    // ------------------------------------------------------------------------
    // 2. ¿Quién es el Creador de la Web? (Requisito clave)
    // ------------------------------------------------------------------------
    if (/creador|quien creo|quien hizo|quien desarrollo|desarrollador|autor|santiago escobar|santiago|quien construyo esta web|quien programo/.test(preguntaNorm)) {
      return {
        texto: `### Creador y Arquitecto de Software de la Plataforma 💻

Este portal web oficial, sus simuladores de avance, la malla curricular interactiva y yo (**${SOFIA_CFG.nombre}**) fuimos creados y desarrollados integralmente por:

👨‍💻 **${SOFIA_CFG.creadorNombre}**
- **Rol:** ${SOFIA_CFG.creadorRol}.
- **Propósito:** Brindar herramientas digitales de vanguardia, transparentes y gratuitas para fortalecer la vida académica, el seguimiento curricular y el bienestar de los estudiantes de la **Facultad de Minas**.
- **Canal de contacto directo:**
  - WhatsApp: [Chat con Santiago Escobar](${SOFIA_CFG.creadorWhatsApp}) \`${SOFIA_CFG.creadorTelefono}\`
  - Correo institucional: \`${SOFIA_CFG.creadorCorreo}\`
  - Instagram: [@s_escobar__](${SOFIA_CFG.creadorInstagram})

El proyecto cuenta con propiedad intelectual y derechos de autor conforme a la Ley 23 de 1982 y normativas de software de la UNAL Medellín.`,
        chips: ['Contacto de la Representación', '¿Qué es la malla curricular?', 'Banco de Recursos en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 3. ¿Quién es la Representación Estudiantil?
    // ------------------------------------------------------------------------
    if (/repre|representante|representacion|maria jose|collazos|joner|figueroa|contacto repre|quien es el representante/.test(preguntaNorm)) {
      return {
        texto: `### Representación Estudiantil · Ingeniería Química 🧪

El programa cuenta con un equipo de representación activo y cercano ante el Comité Asesor y la Facultad de Minas:

👩‍💼 **${SOFIA_CFG.reprePrincipalNombre}** (Representante Principal)
- **WhatsApp de contacto:** [Chat con María José](${SOFIA_CFG.reprePrincipalWhatsApp}) \`${SOFIA_CFG.reprePrincipalTelefono}\`
- **Correo institucional:** \`${SOFIA_CFG.reprePrincipalCorreo}\`
- **Instagram personal:** [Instagram @majocollazoss](${SOFIA_CFG.reprePrincipalInstagram})

👨‍💼 **${SOFIA_CFG.repreSuplenteNombre}** (Representante Suplente)
- **WhatsApp de contacto:** [Chat con Joner Figueroa](${SOFIA_CFG.repreSuplenteWhatsApp}) \`${SOFIA_CFG.repreSuplenteTelefono}\`

📲 **Canales oficiales de la carrera:**
- **Instagram oficial:** [${SOFIA_CFG.usuarioInstagramOficial}](${SOFIA_CFG.repreInstagramOficial})
- **Canal oficial de WhatsApp:** [Canal de WhatsApp Ingeniería Química](${SOFIA_CFG.canalWhatsApp})

Escríbeles para orientación en trámites curriculares, solicitudes ante el Comité Asesor o acompañamiento académico.`,
        chips: ['Canal de WhatsApp IQ', 'Banco de Recursos en Drive', 'Portal Solicitudes SGS'],
      };
    }

    // ------------------------------------------------------------------------
    // 4. ¿Qué es la Malla Curricular?
    // ------------------------------------------------------------------------
    if (/que es la malla|malla curricular|explicar la malla|como funciona la malla|ver la malla|entender la malla/.test(preguntaNorm)) {
      return {
        texto: `La **Malla Curricular de Ingeniería Química** (${SOFIA_CFG.planAcuerdo}, Código SIA **${SOFIA_CFG.codigoSIA}**, SNIES **${SOFIA_CFG.codigoSNIES}**) es la ruta académica oficial de **10 semestres** y **175 créditos**:

- **Semáforo interactivo:** Al hacer clic en cualquier asignatura en la [Malla Curricular](malla.html), se iluminan en **verde bosque** sus prerrequisitos y en **naranja reactivo** las asignaturas que desbloqueas a futuro.
- **Colores por componente:** Vino tinto (\`#6B1F3A\`) para formación disciplinar, verde bosque (\`#2F6B4F\`) para fundamentación y naranja reactivo (\`#B8501E\`) para libre elección.
- **Sombreado de materias aprobadas:** Al cargar tu historia académica en la sección [Mi Avance](avance.html), puedes activar el interruptor *"Sombreado de materias aprobadas"* para ver tu avance reflejado en tiempo real sobre la malla.
- **Banco de materiales:** En la pestaña de Malla tienes acceso directo a la [Carpeta Oficial de Recursos en Google Drive](${SOFIA_CFG.driveRecursos}) con parciales, talleres de balance y reactores.`,
        chips: ['¿Qué tipo de materias hay?', 'Prerrequisitos de Balances de Materia', 'Ver Banco en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 5. ¿Qué tipos de materias hay? (Componentes y Distribución)
    // ------------------------------------------------------------------------
    if (/que tipo de materias|tipos de materias|componentes|agrupaciones|tipologia|creditos del plan|cuantos creditos son|como se dividen las materias/.test(preguntaNorm)) {
      return {
        texto: `En el plan de estudios de **Ingeniería Química** existen **3 componentes de formación** que totalizan **175 créditos**:

1. **Componente de Fundamentación (60 créditos: 40 obligatorios + 20 optativos):**
   - **Matemáticas, Probabilidad y Estadística (31 cr):** Cálculo Diferencial, Integral, Varias Variables, Álgebra Lineal, Geometría Vectorial, Ecuaciones Diferenciales, Métodos Numéricos y Estadística I.
   - **Física (12 cr):** Física Mecánica, Electricidad y Magnetismo o Física Moderna.
   - **Química (9 cr):** Química General, Química Orgánica y optativas químicas.
   - **Laboratorio de Química (2 cr):** Laboratorio de Química General, Orgánica, Analítica o Bioquímica.
   - **Herramientas de Informática (3 cr):** Fundamentos de Programación (Python).
   - **Optativas de Fundamentación (3 cr):** Biología, Materiales o Nanotecnología.

2. **Componente de Formación Disciplinar o Profesional (79 créditos: 67 obligatorios + 12 optativos):**
   - **Herramientas Básicas para IQ (8 cr):** Introducción a la IQ y Balances de Materia y Energía.
   - **Termodinámica (11 cr):** Termodinámica General, Equilibrio de Fases Multicomponentes y Sistemas Reactivos.
   - **Operaciones Unitarias y Diseño (32 cr):** Fenómenos de Transporte, Transferencia de Momento, Calor, Masa, Reactores Químicos, Ingeniería de Procesos y Laboratorios I y II de IQ.
   - **Proyectos en Ingeniería (10 cr):** FPI, Estructuración de Proyectos y Proyecto Integrado.
   - **Optativas Disciplinares (9 cr):** Simulación de Procesos (Aspen/DWSIM), Plantas Industriales, Tratamiento de Aguas.
   - **Optativas de Administración (3 cr):** Gerencia de proyectos, MGA o Teoría Administrativa.
   - **Trabajo de Grado (6 cr):** Pasantía empresarial, investigación o materias de posgrado.

3. **Componente de Libre Elección (36 créditos = ~20% del plan):**
   - Para profundizar en simulación, idiomas, bioingeniería o materias de otras carreras.`,
        chips: ['¿Por qué estudiar Química?', 'Prerrequisitos de Reactores Químicos', 'Ir a Mi Avance'],
      };
    }

    // ------------------------------------------------------------------------
    // 6. ¿Por qué estudiar Ingeniería Química? / Fortalezas únicas
    // ------------------------------------------------------------------------
    if (/por que estudiar quimica|por que estudiar ingenieria quimica|fortalezas|ventajas|campos de accion|perfil del egresado|a que se dedica|por que quimica/.test(preguntaNorm)) {
      return {
        texto: `**¿Por qué estudiar Ingeniería Química en la UNAL Sede Medellín?**

Nuestro programa en la **Facultad de Minas** cuenta con más de **50 años de historia** (fundado en 1973) y Acreditación de Alta Calidad del MEN:

1. **Transformación de la Materia y Energía:**
   El ingeniero químico concibe, diseña y opera procesos industriales donde la materia cambia de composición, estado o energía, integrando fenómenos de transporte, termodinámica y reactores.

2. **Laboratorios y Plantas Piloto en Campus Robledo:**
   Infraestructura única en el país: columnas de destilación piloto, intercambiadores de calor industriales, reactores continuos, laboratorios de bioprocesos y simulación computacional.

3. **Sectores Industriales de Alto Impacto:**
   Los egresados lideran sectores como:
   - Petroquímica, refinación y gas natural.
   - Biotecnología industrial, fermentación y biorefinerías.
   - Industria farmacéutica, cosmética y alimentaria.
   - Polímeros, plásticos sostenibles y nanomateriales.
   - Tratamiento de aguas y valorización de residuos industriales.
   - Hidrógeno verde, bioenergía y transición energética.

4. **Simulación Avanzada e Industria 4.0:**
   Manejo de software industrial líder como **Aspen Plus, Aspen HYSYS, DWSIM, MATLAB y simuladores dinámicos**.

5. **Liderazgo Estudiantil Global:**
   Capítulo internacional **AIChE UNAL Medellín**, organizador del congreso nacional **PROCESA** y competencias internacionales como **Chem-E-Car**.`,
        chips: ['Capítulo Estudiantil AIChE', 'Ver Malla Curricular', '¿Quién es el creador de la web?'],
      };
    }

    // ------------------------------------------------------------------------
    // 7. ¿Cómo hacer cambio de carrera / Traslado de programa?
    // ------------------------------------------------------------------------
    if (/cambio de carrera|traslado|cambiarme de carrera|cambiarme de programa|traslado de programa|pasarme a|homologacion/.test(preguntaNorm)) {
      return {
        texto: `**¿Cómo solicitar Traslado de Programa Curricular (Cambio de carrera)?**

El trámite oficial de traslado se realiza ante el Consejo de la **Facultad de Minas** conforme al Estatuto Estudiantil (**Acuerdo 008 de 2008** del CSU):

1. **Requisitos Normativos Básicos:**
   - Tener la condición de estudiante activo en la UNAL.
   - Contar con un **P.A.P.A. competitivo** (cada comité de carrera evalúa el corte según cupos disponibles).
   - Tener suficiente **cupo de créditos disponibles** en el SIA para culminar el nuevo plan de estudios.
   - Haber cursado al menos el número de créditos exigido en tu programa de origen.

2. **Procedimiento de Radicación:**
   - La convocatoria se abre semestralmente según el Calendario Académico de la sede.
   - Se radica formalmente mediante el **SGS (Sistema de Gestión de Solicitudes)** de la Facultad de Minas:
     🔗 [Portal de Solicitudes GAE Minas](${SOFIA_CFG.tramitesMinasUrl})
   - Seleccionas la solicitud *«Traslado de programa curricular»*, adjuntas tu carta de motivación y soportes.

3. **Asesoría y Acompañamiento:**
   - Si tienes dudas sobre convalidaciones o cupo de créditos, escribe desde tu correo institucional a **Asesoría Estudiantil de Minas**: \`${SOFIA_CFG.asesoriaMinasCorreo}\` (Campus Robledo, Bloque M4).`,
        chips: ['Portal Solicitudes SGS', 'Calendario académico', '¿Qué es el P.A.P.A.?'],
      };
    }

    // ------------------------------------------------------------------------
    // 8. Alianzas Estratégicas y Convenios
    // ------------------------------------------------------------------------
    if (/alianza|alianzas|convenio|convenios|sapiencia|icetex|metro|civica|beneficios de bienestar|becas/.test(preguntaNorm)) {
      return {
        texto: `**Alianzas Estratégicas y Convenios (UNAL Sede Medellín y Facultad de Minas):**

1. **Alianzas de Permanencia y Bienestar:**
   - **ICETEX:** Líneas de crédito tradicionales, condonables y subsidios de sostenimiento.
   - **Sapiencia (Alcaldía de Medellín):** Fondos de Presupuesto Participativo, Fondo EPM y Becas Medellín para matrícula y sostenimiento.
   - **Metro de Medellín (Cívica Estudiante):** Tarifa preferencial con descuento superior al 50% en Metro, Tranvía, Metrocable y Metroplús.
   - **Auxilios de Bienestar UNAL:** Apoyo alimentario, bono de transporte y residencias estudiantiles (gestión en Bloque M4 Robledo / Bloque 11A Volador).

2. **Convenios de Software y Simulación Química:**
   - **Software de Procesos en Salas de Minas:** Licencias oficiales de **Aspen Plus, Aspen HYSYS, MATLAB / Simulink, AutoCAD y DWSIM**.
   - **GitHub Student Developer Pack:** Cuentas Pro, GitHub Copilot gratuito y créditos en la nube (AWS, Azure, DigitalOcean).
   - **Autodesk Educación:** Licencias completas de diseño para estudiantes con correo institucional \`@unal.edu.co\`.
   - **Microsoft 365 & JetBrains:** Paquetería completa gratuita para tu carrera.

Consulta todos los convenios detallados en la sección [Convenios](convenios.html).`,
        chips: ['Ver sección Convenios', 'Auxilios de Bienestar', '¿Quién es el creador de la web?'],
      };
    }

    // ------------------------------------------------------------------------
    // 9. Unidad Compartida / Google Drive de Recursos
    // ------------------------------------------------------------------------
    if (/drive|unidad compartida|banco de recursos|material de estudio|parciales pasados|parciales viejos|talleres|apuntes|libros/.test(preguntaNorm)) {
      return {
        texto: `### Banco Oficial de Materiales · Ingeniería Química 📚

Los talleres de balance de materia y energía, parciales anteriores de fenómenos de transporte, guías de laboratorio de reactores y libros guía están centralizados en el **Google Drive Oficial**:

🔗 **[Abrir Carpeta de Recursos de Ingeniería Química en Google Drive](${SOFIA_CFG.driveRecursos})**

💡 *Recomendación:* Inicia sesión con tu correo institucional (\`@unal.edu.co\`) para tener acceso inmediato a todas las carpetas organizadas por semestre y materia.`,
        chips: ['Ver Malla Curricular', 'Canal de WhatsApp IQ', 'Prerrequisitos de materias'],
      };
    }

    // ------------------------------------------------------------------------
    // 10. Prerrequisitos de materias específicas (Evaluación de alta prioridad)
    // ------------------------------------------------------------------------
    const esConsultaPrereq = /prerrequisit|prerequisit|requisito|que pide|que necesito para ver|para matricular|correquisit|abrir|correr/.test(preguntaNorm);
    const materiaEncontrada = buscarAsignaturaPorTexto(preguntaNorm);

    if (materiaEncontrada && (esConsultaPrereq || preguntaNorm.includes(normalizar(materiaEncontrada.nombre)))) {
      const preCodigos = materiaEncontrada.prerrequisitos || [];
      const correqCodigos = materiaEncontrada.correquisitos || [];

      let detallePrereq = '';
      if (preCodigos.length === 0) {
        detallePrereq = 'No tiene prerrequisitos. La puedes matricular desde tu primer semestre (según tu cupo de créditos y cita del SIA).';
      } else {
        const nombresPre = preCodigos.map((cod) => {
          const preMat = indices.materiasPorCodigo.get(cod);
          return preMat ? `• **${preMat.nombre}** (\`${cod}\`)` : `• Asignatura código \`${cod}\``;
        }).join('\n');
        detallePrereq = `**Prerrequisito(s) necesario(s):**\n${nombresPre}`;
      }

      let detalleCorreq = '';
      if (correqCodigos.length > 0) {
        const nombresCorreq = correqCodigos.map((cod) => {
          const cMat = indices.materiasPorCodigo.get(cod);
          return cMat ? `• **${cMat.nombre}** (\`${cod}\`)` : `• Asignatura código \`${cod}\``;
        }).join('\n');
        detalleCorreq = `\n\n**Correquisito(s) (simultáneos):**\n${nombresCorreq}`;
      }

      const semestreTxt = materiaEncontrada.semestre ? `Semestre sugerido: **${materiaEncontrada.semestre}°**` : 'Asignatura Optativa';
      const obligatoriaTxt = materiaEncontrada.obligatoria ? 'Obligatoria' : 'Optativa';

      const chipsPre = preCodigos
        .map((cod) => indices.materiasPorCodigo.get(cod))
        .filter(Boolean)
        .map((m) => `Prerrequisitos de ${m.nombre}`);

      return {
        texto: `### ${materiaEncontrada.nombre} (\`${materiaEncontrada.codigo}\`)

${detallePrereq}${detalleCorreq}

- **Créditos:** ${materiaEncontrada.creditos}
- **Tipología:** ${obligatoriaTxt} (${materiaEncontrada.agrupacion || 'General'})
- **Nivel:** ${semestreTxt}

Puedes consultar esta asignatura de forma interactiva en la [Malla Curricular](malla.html).`,
        chips: chipsPre.length > 0 ? chipsPre.slice(0, 3) : ['Ver Malla Curricular', 'Banco de Recursos en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 11. Capítulos Estudiantiles y Semilleros (AIChE UNAL Medellín)
    // ------------------------------------------------------------------------
    if (/aiche|capitulo|capitulos|procesa|chem e car|grupos estudiantiles|semillero|semilleros/.test(preguntaNorm)) {
      return {
        texto: `### Capítulo Estudiantil AIChE UNAL Medellín 🔬

En Ingeniería Química, la vida estudiantil y técnica está liderada por el capítulo oficial del **American Institute of Chemical Engineers (AIChE)**:

🌟 **AIChE UNAL Medellín:**
- **Propósito:** Conectar a los estudiantes con la industria química global, potenciar habilidades de simulación de procesos y representar a la UNAL en competencias internacionales.
- **Hitos y actividades principales:**
  - **Congreso Nacional PROCESA:** Evento insignia de innovación química en Colombia.
  - **Competencia Chem-E-Car:** Diseño y construcción de vehículos a escala impulsados por reacciones químicas.
  - Talleres prácticos de simulación en Aspen Plus y DWSIM.
  - Visitas técnicas a refinerías y plantas petroquímicas.
- **Contacto y redes:**
  - Instagram: [@aiche.unmed](https://www.instagram.com/aiche.unmed/)
  - Correo oficial: \`aiche_med@unal.edu.co\``,
        chips: ['Canal de WhatsApp IQ', 'Banco de Recursos en Drive', '¿Por qué estudiar Química?'],
      };
    }

    // ------------------------------------------------------------------------
    // 12. Grupos y Canales de WhatsApp de estudio
    // ------------------------------------------------------------------------
    if (/grupo de whatsapp|grupos de whatsapp|canal de whatsapp|wpp de materias|grupo de estudio|comunidad de wpp/.test(preguntaNorm)) {
      return {
        texto: `### Canales y Comunidades de WhatsApp · Ing. Química 💬

- Contamos con el **[Canal Oficial de WhatsApp de Ingeniería Química](${SOFIA_CFG.canalWhatsApp})**, donde se difunden avisos de matrículas, eventos de AIChE, oportunidades de pasantías y monitorías.
- Si administras el grupo de WhatsApp de alguna materia de Ingeniería Química y deseas que lo vinculemos en la [Malla Curricular](malla.html), contacta a los representantes o al creador del portal para sumarlo directamente a la ficha del curso.`,
        chips: ['Canal de WhatsApp IQ', 'Contacto de la Representación', 'Banco en Drive'],
      };
    }

    // ------------------------------------------------------------------------
    // 13. Materias de último semestre / Décimo semestre en Química
    // ------------------------------------------------------------------------
    if (/ultimo semestre|ultimos semestres|decimo semestre|semestre 10|10 semestre|materias para graduarme|terminar la carrera/.test(preguntaNorm)) {
      return {
        texto: `En el **10° y último semestre** de Ingeniería Química el plan está diseñado para la culminación profesional:

1. **Trabajo de Grado (\`3007440\` - 6 créditos):**
   Modalidades oficiales en la Facultad de Minas:
   - **Práctica de Extensión (\`3010686\`):** Pasantía empresarial en plantas químicas, refinerías (Ecopetrol, Reficar), alimentos (Nutresa), cosméticos o farmacéutica.
   - **Proyecto de Investigación:** En grupos de investigación del Departamento de Procesos y Energía.
   - **Asignaturas de Posgrado (\`3007441\`):** Cursar materias de maestría en la Facultad de Minas.

2. **Créditos de Libre Elección:**
   Completar los **36 créditos** exigidos en tu bolsa curricular.

3. **Requisitos de Grado:**
   - Cumplir la suficiencia en idioma extranjero (Inglés B1/B2 según tu cohorte).
   - Tener aprobados los **175 créditos** del plan.

Monitorea tu avance en tiempo real en [Mi Avance](avance.html).`,
        chips: ['Prerrequisitos de Trabajo de Grado', 'Ir a Mi Avance', 'Ver Malla Curricular'],
      };
    }

    // ------------------------------------------------------------------------
    // 14. Materias por semestre (Semestre 1 al 10)
    // ------------------------------------------------------------------------
    const matchSem = preguntaNorm.match(/semestre\s*([1-9]|10)\b|primer semestre|segundo semestre|tercer semestre|cuarto semestre|quinto semestre|sexto semestre|septimo semestre|octavo semestre|noveno semestre|decimo semestre/);
    if (matchSem) {
      let numSem = 0;
      if (matchSem[1]) {
        numSem = parseInt(matchSem[1], 10);
      } else {
        const ord = matchSem[0];
        if (ord.includes('primer')) numSem = 1;
        else if (ord.includes('segund')) numSem = 2;
        else if (ord.includes('tercer')) numSem = 3;
        else if (ord.includes('cuart')) numSem = 4;
        else if (ord.includes('quint')) numSem = 5;
        else if (ord.includes('sext')) numSem = 6;
        else if (ord.includes('septim')) numSem = 7;
        else if (ord.includes('octav')) numSem = 8;
        else if (ord.includes('noven')) numSem = 9;
        else if (ord.includes('decim')) numSem = 10;
      }

      if (numSem >= 1 && numSem <= 10) {
        const materiasSem = indices.materiasPorSemestre.get(numSem) || [];
        if (materiasSem.length > 0) {
          const listaTxt = materiasSem
            .map((asig) => {
              const preCount = asig.prerrequisitos?.length || 0;
              const preTxt = preCount === 0 ? '_Sin prereq_' : `_${preCount} prerrequisito(s)_`;
              return `• **${asig.nombre}** (\`${asig.codigo}\`, ${asig.creditos} cr) — ${preTxt}`;
            })
            .join('\n');

          const creditosTotal = materiasSem.reduce((acc, m) => acc + (m.creditos || 0), 0);

          return {
            texto: `### Asignaturas sugeridas para Semestre ${numSem}° (${creditosTotal} créditos en la ruta)

${listaTxt}

Puedes explorar sus relaciones en la [Malla Curricular](malla.html).`,
            chips: materiasSem.slice(0, 3).map((m) => `Prerrequisitos de ${m.nombre}`),
          };
        }
      }
    }

    // ------------------------------------------------------------------------
    // 15. Cancelación de materias o cancelación de semestre
    // ------------------------------------------------------------------------
    if (/cancelar|cancelacion|cancelaciones|extemporanea|retirar materia|plazo cancelar|hasta cuando cancelar/.test(preguntaNorm)) {
      return {
        texto: `**Plazos y Condiciones para Cancelar Asignaturas en la Facultad de Minas (Pregrado):**

1. **Semana 3 (Cancelación sin pérdida de créditos):**
   - Es el periodo en el SIA donde puedes retirar asignaturas y los créditos regresan completos a tu bolsa disponible para futuros semestres.

2. **Semana 8 (Cancelación ordinaria con pérdida de créditos):**
   - Puedes cancelar la materia en el SIA hasta esta semana. No afectará tu promedio acumulado, pero esos créditos no se devuelven a tu bolsa.

3. **Cancelación Extemporánea (Por fuerza mayor o enfermedad):**
   - Si superaste la semana 8 y sufriste una calamidad médica, psicológica o laboral comprobable, radicas la solicitud ante el **SGS de la Facultad de Minas**:
     🔗 [Portal Solicitudes SGS Minas](${SOFIA_CFG.tramitesMinasUrl})
   - Adjuntas los certificados médicos avalados por Bienestar Universitario (Bloque M4 / Robledo).`,
        chips: ['Portal Solicitudes SGS', 'Calendario académico', 'Asesoría Estudiantil'],
      };
    }

    // ------------------------------------------------------------------------
    // 16. Consultas del Calendario Académico
    // ------------------------------------------------------------------------
    if (/calendario|fechas|cuando empiezan clases|cuando terminan|semana de induccion|recesos|evaluacion docente/.test(preguntaNorm)) {
      if (indices.calendarioFilas.length > 0) {
        const palabrasClave = preguntaNorm.split(' ').filter((p) => p.length > 3);
        const coincidencias = indices.calendarioFilas.filter((f) =>
          palabrasClave.some((p) => f.eventoNorm.includes(p))
        );

        if (coincidencias.length > 0) {
          const listado = coincidencias
            .slice(0, 5)
            .map((c) => `• **${c.evento}:** ${c.fecha} _(${c.grupo})_`)
            .join('\n');

          return {
            texto: `**Fechas encontradas en el Calendario Académico Oficial:**\n\n${listado}\n\nPuedes revisar todas las fechas en la guía de [Información General](info.html).`,
            chips: ['Cancelar materias', 'Citas del SIA', 'Bolsa de créditos'],
          };
        }
      }

      return {
        texto: `El **Calendario Académico Oficial (2026-2S)** de la UNAL Sede Medellín establece los hitos clave para matrícula, inicio de clases, cancelaciones y cierre de actas.

Consulta la tabla completa de fechas discriminada por semanas en la sección de [Información General](info.html).`,
        chips: ['Plazos para cancelar materias', 'Citas del SIA', 'Bolsa de créditos'],
      };
    }

    // ------------------------------------------------------------------------
    // 17. P.A.P.A., Citas SIA y Bolsa de Créditos
    // ------------------------------------------------------------------------
    if (/papa|promedio|citas sia|dninfoa|bolsa de creditos|cupo de creditos|creditos adicionales|como calcular el papa/.test(preguntaNorm)) {
      return {
        texto: `**Conceptos Clave del Sistema Académico SIA:**

- **P.A.P.A. (Promedio Aritmético Ponderado Acumulado):**
  Se calcula multiplicando la calificación final de cada materia cursada (aprobada o reprobada) por sus créditos, sumando los productos y dividiéndolos entre el total de créditos cursados.
  Determina tu grupo de citación para matrícula, adjudicación de becas y traslados de programa.

- **Citas DNINFOA:**
  Se asignan en 4 grupos de prelación basados en tu P.A.P.A. del periodo anterior y avance de carrera:
  - *Grupo 1:* Estudiantes con mejores promedios y deportistas representativos.
  - *Grupos 2, 3 y 4:* Orden sucesivo de cita para inscripción de asignaturas.

- **Bolsa de Créditos:**
  Recibes un cupo inicial para tu plan (175 créditos en Ingeniería Química). Si mantienes un P.A.P.A. sobresaliente, puedes solicitar créditos adicionales a la Vicedecanatura Académica vía SGS.

Calcula tu proyección en [Mi Avance](avance.html) o lee la guía completa en [Información General](info.html).`,
        chips: ['Ir a Mi Avance', '¿Cómo hacer cambio de carrera?', 'Ver Malla Curricular'],
      };
    }

    // ------------------------------------------------------------------------
    // 18. Horas de Corresponsabilidad
    // ------------------------------------------------------------------------
    if (/corresponsabilidad|horas de corresponsabilidad|servicio social|beneficiarios bienestar/.test(preguntaNorm)) {
      return {
        texto: `**Horas de Corresponsabilidad en la UNAL:**

Si eres beneficiario de apoyos socioeconómicos de Bienestar Universitario (Gestión Alimentaria, Residencias o Bonos de Transporte):
- Debes cumplir entre **20 y 40 horas** por semestre de actividades solidarias en dependencias de la universidad.
- En la Facultad de Minas puedes cumplirlas apoyando laboratorios de reactores, química, salas de cómputo, biblioteca de Robledo o eventos de la facultad.
- El registro y legalización se realiza en el sistema de Bienestar Universitario.`,
        chips: ['Auxilios de Bienestar', 'Información General', 'Contacto Asesoría Minas'],
      };
    }

    // ------------------------------------------------------------------------
    // 19. Salidas y Prácticas de Campo / Laboratorios en Química
    // ------------------------------------------------------------------------
    if (/laboratorio|laboratorios|planta piloto|plantas piloto|visitas tecnicas/.test(preguntaNorm)) {
      return {
        texto: `**Laboratorios y Plantas Piloto en Ingeniería Química:**

En el **Campus Robledo**, el programa cuenta con espacios experimentales de vanguardia:
- **Laboratorio I de IQ (Termodinámica):** Equilibrio líquido-vapor, propiedades de exceso y calorimetría.
- **Laboratorio II de IQ (Transferencia y Control):** Columnas de destilación empacadas, intercambiadores de tubos y coraza, lechos fluidizados y lazos de control automático.
- **Laboratorios de Química:** Química General, Orgánica y Analítica instrumental.
- **Salas de Simulación:** Modelación rigurosa de procesos con Aspen Plus y DWSIM.`,
        chips: ['Prerrequisitos de Laboratorio I de IQ', 'Capítulo Estudiantil AIChE', 'Ver Malla Curricular'],
      };
    }

    // ------------------------------------------------------------------------
    // 20. Fallback Inteligente (Sugerencias Guiadas)
    // ------------------------------------------------------------------------
    return {
      texto: `No encontré una coincidencia exacta para tu consulta, pero estoy lista para orientarte en cualquiera de estos temas clave de **Ingeniería Química**:

- Consulta sobre prerrequisitos de cualquier materia (ej. *Balances de Materia*, *Reactores Químicos*, *Fenómenos de Transporte*, *Termodinámica*).
- Cómo solicitar cambio de carrera o convalidaciones ante la Facultad de Minas.
- Quién es el creador de la plataforma o los representantes de carrera.
- Actividades del capítulo estudiantil **AIChE UNAL Medellín** (Congreso PROCESA).
- Acceso al Google Drive oficial con parciales y memorias de cálculo.

¿Qué te gustaría consultar?`,
      chips: [
        '¿Qué es la malla curricular?',
        '¿Qué tipo de materias hay?',
        '¿Por qué estudiar Química?',
        '¿Quién es el creador de la web?',
        'Contacto de la Representación',
        'Capítulo Estudiantil AIChE',
      ],
    };
  }

  function buscarAsignaturaPorTexto(textoNorm) {
    // 1. Por código numérico directo
    const matchCod = textoNorm.match(/\b(\d{7}|10000\d{2})\b/i);
    if (matchCod) {
      const codigo = matchCod[1].toUpperCase();
      if (indices.materiasPorCodigo.has(codigo)) {
        return indices.materiasPorCodigo.get(codigo);
      }
    }

    // 2. Por nombre oficial de la asignatura (priorizando nombres más largos)
    const nombresOrdenados = Array.from(indices.materiasPorNombre.entries()).sort(
      (a, b) => b[0].length - a[0].length
    );
    for (const [nomNorm, asig] of nombresOrdenados) {
      if (textoNorm.includes(nomNorm)) {
        return asig;
      }
    }

    // 3. Por alias ordenados de mayor a menor longitud
    const aliasOrdenados = Array.from(indices.aliasMaterias.entries()).sort(
      (a, b) => b[0].length - a[0].length
    );

    for (const [alias, asig] of aliasOrdenados) {
      if (alias.length <= 4) {
        const regexAlias = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        if (regexAlias.test(textoNorm)) {
          return asig;
        }
      } else if (textoNorm.includes(alias)) {
        return asig;
      }
    }

    return null;
  }

  // ==========================================================================
  // 5. GENERACIÓN DEL DOM Y ELEMENTOS DE INTERFAZ
  // ==========================================================================

  function crearElementosDOM() {
    if (document.getElementById('sofia-contenedor-global')) return;

    const contenedorGlobal = document.createElement('div');
    contenedorGlobal.id = 'sofia-contenedor-global';
    contenedorGlobal.className = 'sofia-flotante-wrap';

    // 1. Globo de bienvenida (tooltip)
    const globo = document.createElement('div');
    globo.className = 'sofia-globo-bienvenida';
    globo.id = 'sofia-globo';
    globo.setAttribute('role', 'status');
    globo.innerHTML = `
      <span class="sofia-globo-texto">👋 ¿Dudas con materias o trámites? <strong>Pregúntale a sofIA</strong></span>
      <button class="sofia-globo-cerrar" id="sofia-globo-cerrar" type="button" aria-label="Cerrar aviso">✕</button>
    `;

    // 2. Botón flotante circular
    const boton = document.createElement('button');
    boton.className = 'sofia-boton';
    boton.id = 'sofia-btn-toggle';
    boton.type = 'button';
    boton.setAttribute('aria-label', 'Abrir asistente virtual sofIA de Ingeniería Química');
    boton.setAttribute('aria-expanded', 'false');
    boton.innerHTML = `
      <span class="sofia-boton__halo" aria-hidden="true"></span>
      ${SOFIA_SVG_AVATAR}
      <span class="sofia-boton__badge" title="sofIA en línea"></span>
    `;

    // 3. Ventana modal del chat
    const ventana = document.createElement('section');
    ventana.className = 'sofia-ventana';
    ventana.id = 'sofia-ventana';
    ventana.setAttribute('aria-label', 'Ventana del asistente virtual sofIA');
    ventana.setAttribute('aria-hidden', 'true');
    ventana.innerHTML = `
      <header class="sofia-cabecera">
        <div class="sofia-cabecera__info">
          <div class="sofia-cabecera__avatar">
            ${SOFIA_SVG_AVATAR}
          </div>
          <div class="sofia-cabecera__titulos">
            <div class="sofia-cabecera__nombre-fila">
              <span class="sofia-cabecera__nombre">${SOFIA_CFG.nombre}</span>
              <span class="sofia-cabecera__tag">UNAL</span>
            </div>
            <span class="sofia-cabecera__estado">
              <span class="sofia-cabecera__punto" aria-hidden="true"></span>
              En línea · Asistente de Química
            </span>
          </div>
        </div>
        <div class="sofia-cabecera__acciones">
          <button class="sofia-accion-btn" id="sofia-btn-reiniciar" type="button" title="Reiniciar conversación" aria-label="Reiniciar conversación">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
          <button class="sofia-accion-btn" id="sofia-btn-maximizar" type="button" title="Maximizar / Restaurar" aria-label="Maximizar tamaño del chat">
            <svg id="sofia-icono-maximizar" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
          <button class="sofia-accion-btn" id="sofia-btn-cerrar" type="button" title="Cerrar chat" aria-label="Cerrar chat">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      <div class="sofia-cuerpo" id="sofia-cuerpo" role="log" aria-live="polite">
        <div class="sofia-mensajes" id="sofia-mensajes"></div>
      </div>

      <footer class="sofia-pie">
        <form class="sofia-formulario" id="sofia-form">
          <input
            type="text"
            class="sofia-input"
            id="sofia-input"
            placeholder="Pregúntale a sofIA sobre la malla, materias, alianzas..."
            autocomplete="off"
            aria-label="Escribe tu consulta para sofIA"
          />
          <button type="submit" class="sofia-btn-enviar" id="sofia-btn-enviar" aria-label="Enviar mensaje">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
        <span class="sofia-subtexto">sofIA consulta la base oficial del portal de Ingeniería Química UNAL.</span>
      </footer>
    `;

    contenedorGlobal.appendChild(globo);
    contenedorGlobal.appendChild(boton);
    document.body.appendChild(contenedorGlobal);
    document.body.appendChild(ventana);

    vincularEventos();
  }

  // ==========================================================================
  // 6. GESTIÓN DE INTERACCIÓN, MENSAJES Y RENDERIZADO
  // ==========================================================================

  let chatAbierto = false;
  let chatMaximizado = false;

  function abrirSofia() {
    const ventana = document.getElementById('sofia-ventana');
    const boton = document.getElementById('sofia-btn-toggle');
    const input = document.getElementById('sofia-input');
    const globo = document.getElementById('sofia-globo');

    if (!ventana) return;

    chatAbierto = true;
    ventana.classList.add('is-abierta');
    ventana.setAttribute('aria-hidden', 'false');
    if (boton) boton.setAttribute('aria-expanded', 'true');
    if (globo) globo.style.display = 'none';

    sessionStorage.setItem('quimica.sofia.globo_oculto', '1');

    // Mensaje de bienvenida inicial si está vacío
    const contenedorMensajes = document.getElementById('sofia-mensajes');
    if (contenedorMensajes && contenedorMensajes.children.length === 0) {
      enviarRespuestaSofia(
        `¡Hola! Soy **${SOFIA_CFG.nombre}**, asistente virtual inteligente de **${SOFIA_CFG.programa}** en la **${SOFIA_CFG.facultad}** (UNAL Medellín).

¿En qué puedo orientarte hoy? Puedes seleccionar una de las sugerencias de abajo o escribir libremente tu duda.`,
        [
          '¿Qué es la malla curricular?',
          '¿Qué tipo de materias hay?',
          '¿Por qué estudiar Química?',
          '¿Quién es el creador de la web?',
          'Contacto de la Representación',
          'Capítulo Estudiantil AIChE',
        ]
      );
    }

    setTimeout(() => {
      if (input) input.focus();
    }, 200);
  }

  function cerrarSofia() {
    const ventana = document.getElementById('sofia-ventana');
    const boton = document.getElementById('sofia-btn-toggle');

    if (!ventana) return;

    chatAbierto = false;
    ventana.classList.remove('is-abierta');
    ventana.setAttribute('aria-hidden', 'true');
    if (boton) {
      boton.setAttribute('aria-expanded', 'false');
      boton.focus();
    }
  }

  function toggleSofia() {
    if (chatAbierto) {
      cerrarSofia();
    } else {
      abrirSofia();
    }
  }

  function toggleMaximizar() {
    const ventana = document.getElementById('sofia-ventana');
    const icono = document.getElementById('sofia-icono-maximizar');
    if (!ventana) return;

    chatMaximizado = !chatMaximizado;
    ventana.classList.toggle('is-maximizada', chatMaximizado);

    if (icono) {
      icono.innerHTML = chatMaximizado
        ? '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>'
        : '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>';
    }
  }

  function reiniciarChat() {
    const contenedorMensajes = document.getElementById('sofia-mensajes');
    if (contenedorMensajes) contenedorMensajes.innerHTML = '';

    enviarRespuestaSofia(
      `Conversación reiniciada. ¿Qué otra duda sobre **${SOFIA_CFG.programa}** te gustaría consultar?`,
      [
        '¿Qué es la malla curricular?',
        '¿Qué tipo de materias hay?',
        '¿Por qué estudiar Química?',
        '¿Quién es el creador de la web?',
        'Contacto de la Representación',
        'Capítulo Estudiantil AIChE',
      ]
    );
  }

  function scrollAlFinal() {
    const cuerpo = document.getElementById('sofia-cuerpo');
    if (cuerpo) {
      cuerpo.scrollTop = cuerpo.scrollHeight;
    }
  }

  function horaActual() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function procesarMarkdown(texto) {
    if (!texto) return '';

    let html = texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Encabezados markdown
    html = html.replace(/^### (.*$)/gim, '<h4 style="margin:6px 0 4px 0; color:#F2A65A; font-size:14px; font-weight:700;">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 style="margin:8px 0 4px 0; color:#F2A65A; font-size:15px; font-weight:700;">$1</h3>');

    // Negrita e itálica
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Código en línea
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Enlaces markdown [texto](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Listas con viñetas
    const lineas = html.split('\n');
    let enLista = false;
    const resultado = [];

    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      if (/^[•\-*]\s+(.*)/.test(linea)) {
        if (!enLista) {
          resultado.push('<ul>');
          enLista = true;
        }
        resultado.push(`<li>${linea.replace(/^[•\-*]\s+/, '')}</li>`);
      } else {
        if (enLista) {
          resultado.push('</ul>');
          enLista = false;
        }
        if (linea.length > 0) {
          resultado.push(`<p>${linea}</p>`);
        }
      }
    }
    if (enLista) resultado.push('</ul>');

    return resultado.join('');
  }

  function agregarMensajeUsuario(texto) {
    const contenedor = document.getElementById('sofia-mensajes');
    if (!contenedor) return;

    const wrap = document.createElement('div');
    wrap.className = 'sofia-mensaje sofia-mensaje--usuario';
    wrap.innerHTML = `
      <div class="sofia-burbuja">
        <p>${texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
      <span class="sofia-mensaje__hora">${horaActual()}</span>
    `;

    contenedor.appendChild(wrap);
    scrollAlFinal();
  }

  function mostrarIndicadorEscritura() {
    const contenedor = document.getElementById('sofia-mensajes');
    if (!contenedor) return null;

    const wrap = document.createElement('div');
    wrap.className = 'sofia-mensaje sofia-mensaje--sofia sofia-mensaje--escritura';
    wrap.id = 'sofia-escritura';
    wrap.innerHTML = `
      <div class="sofia-burbuja">
        <span class="sofia-punto-ola"></span>
        <span class="sofia-punto-ola"></span>
        <span class="sofia-punto-ola"></span>
      </div>
    `;

    contenedor.appendChild(wrap);
    scrollAlFinal();
    return wrap;
  }

  function removerIndicadorEscritura() {
    const el = document.getElementById('sofia-escritura');
    if (el) el.remove();
  }

  function enviarRespuestaSofia(texto, chips = [], enlaces = []) {
    const contenedor = document.getElementById('sofia-mensajes');
    if (!contenedor) return;

    removerIndicadorEscritura();

    const wrap = document.createElement('div');
    wrap.className = 'sofia-mensaje sofia-mensaje--sofia';

    let chipsHtml = '';
    if (chips && chips.length > 0) {
      const chipsBtns = chips
        .map(
          (c) => `<button type="button" class="sofia-chip" data-chip="${c.replace(/"/g, '&quot;')}">${c}</button>`
        )
        .join('');
      chipsHtml = `<div class="sofia-chips-contenedor">${chipsBtns}</div>`;
    }

    let enlacesHtml = '';
    if (enlaces && enlaces.length > 0) {
      const enlacesCards = enlaces
        .map(
          (e) => `
          <a href="${e.url}" target="_blank" rel="noopener noreferrer" class="sofia-enlace-card">
            <span>${e.titulo}</span>
            <span class="sofia-enlace-card__icono">↗</span>
          </a>
        `
        )
        .join('');
      enlacesHtml = `<div class="sofia-enlaces-contenedor">${enlacesCards}</div>`;
    }

    wrap.innerHTML = `
      <div class="sofia-burbuja">
        ${procesarMarkdown(texto)}
        ${enlacesHtml}
        ${chipsHtml}
      </div>
      <span class="sofia-mensaje__hora">${horaActual()}</span>
    `;

    contenedor.appendChild(wrap);

    // Eventos a los chips
    wrap.querySelectorAll('.sofia-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chipTexto = btn.getAttribute('data-chip');
        if (chipTexto) procesarConsultaUsuario(chipTexto);
      });
    });

    scrollAlFinal();
  }

  function procesarConsultaUsuario(consulta) {
    if (!consulta || !consulta.trim()) return;

    const texto = consulta.trim();
    agregarMensajeUsuario(texto);

    const input = document.getElementById('sofia-input');
    if (input) input.value = '';

    mostrarIndicadorEscritura();

    // Pequeño retardo orgánico simulando procesamiento inteligente
    setTimeout(() => {
      const respuesta = responderPregunta(texto);
      enviarRespuestaSofia(respuesta.texto, respuesta.chips, respuesta.enlaces);
    }, 280);
  }

  // ==========================================================================
  // 7. VINCULACIÓN DE EVENTOS DEL DOM
  // ==========================================================================

  function vincularEventos() {
    const btnToggle = document.getElementById('sofia-btn-toggle');
    const btnCerrar = document.getElementById('sofia-btn-cerrar');
    const btnMaximizar = document.getElementById('sofia-btn-maximizar');
    const btnReiniciar = document.getElementById('sofia-btn-reiniciar');
    const form = document.getElementById('sofia-form');
    const input = document.getElementById('sofia-input');
    const globo = document.getElementById('sofia-globo');
    const globoCerrar = document.getElementById('sofia-globo-cerrar');

    if (btnToggle) btnToggle.addEventListener('click', toggleSofia);
    if (btnCerrar) btnCerrar.addEventListener('click', cerrarSofia);
    if (btnMaximizar) btnMaximizar.addEventListener('click', toggleMaximizar);
    if (btnReiniciar) btnReiniciar.addEventListener('click', reiniciarChat);

    if (globo) {
      globo.addEventListener('click', (e) => {
        if (e.target !== globoCerrar) {
          abrirSofia();
        }
      });
    }

    if (globoCerrar) {
      globoCerrar.addEventListener('click', (e) => {
        e.stopPropagation();
        if (globo) globo.style.display = 'none';
        sessionStorage.setItem('quimica.sofia.globo_oculto', '1');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input && input.value.trim()) {
          procesarConsultaUsuario(input.value);
        }
      });
    }

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatAbierto) {
        cerrarSofia();
      }
    });

    // Ocultar globo si ya fue cerrado en la sesión
    if (sessionStorage.getItem('quimica.sofia.globo_oculto') === '1' && globo) {
      globo.style.display = 'none';
    }
  }

  // ==========================================================================
  // 8. INICIALIZACIÓN Y API PÚBLICA (WINDOW.SOFIA)
  // ==========================================================================

  function moduloSofia() {
    cargarDatos();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', crearElementosDOM);
    } else {
      crearElementosDOM();
    }
  }

  moduloSofia();

  // Exposición controlada en window para integración con otros módulos
  window.sofIA = {
    abrir: abrirSofia,
    cerrar: cerrarSofia,
    preguntar: procesarConsultaUsuario,
    responder: responderPregunta,
    inicializar: cargarDatos,
  };
})();
