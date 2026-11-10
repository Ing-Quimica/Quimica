/* =============================================
   MÓDULO MALLA CURRICULAR
   Datos (carpeta data/malla):
   - componentes.json: componentes y agrupaciones (con sus créditos)
   - plan.json: qué va en cada semestre (códigos o casillas de optativa / libre elección)
   - asignaturas.json: catálogo con créditos, prerrequisitos y agrupación
   Las relaciones se calculan aquí a partir de los códigos: nada está repetido en los datos.
   ============================================= */

const POR_PAGINA = 12;
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const ICONO_WHATSAPP = `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>`;

let hoverCodigoActual = null;

const estado = {
  componentes: [],
  agrupaciones: [],
  plan: [],
  asignaturas: new Map(),   // codigo -> asignatura
  dependientes: new Map(),  // codigo -> códigos que lo piden como prerrequisito
  seleccion: null,          // código de la asignatura abierta en el detalle
  componente: null,         // pestaña activa del catálogo
  agrupacion: null,         // agrupación activa del catálogo
  tipo: 'todas',            // todas | obligatorias | optativas
  pagina: 1,
};

const buscarComponente = (id) => estado.componentes.find((c) => c.id === id);
const buscarAgrupacion = (id) => estado.agrupaciones.find((a) => a.id === id);
const colorDe = (asignatura) => buscarComponente(buscarAgrupacion(asignatura.agrupacion).componente).color;
const creditosTexto = (creditos) => (creditos ?? '—');


/* ---------- Carga ---------- */

function prepararDatos([componentes, plan, asignaturas]) {
  estado.componentes = componentes.componentes;
  estado.agrupaciones = componentes.agrupaciones;
  estado.plan = plan;
  asignaturas.forEach((a) => estado.asignaturas.set(a.codigo, a));

  // Inverso de "prerrequisitos": de qué materias es requisito cada una
  asignaturas.forEach((a) => a.prerrequisitos.forEach((p) => {
    if (!estado.dependientes.has(p)) estado.dependientes.set(p, []);
    estado.dependientes.get(p).push(a.codigo);
  }));

  const totalCreditos = plan.reduce((suma, s) => suma + s.creditos, 0);
  $('#malla-antetitulo').textContent = `${plan.length} semestres · ${totalCreditos} créditos`;
}

/* ---------- Estado del Progreso del Estudiante ---------- */
const estadoProgreso = {
  activo: true,               // Si el sombreado de aprobadas está encendido
  historia: null,             // Objeto historia parseado desde avance-lector.js
  mapaProgreso: new Map(),    // Índice rápido 'cod:...' y 'nom:...' -> registro de materia
  bolsasCumplidas: new Set(), // IDs de bolsas cumplidas en la malla ('b-semestre-pos')
  aprobadasPlan: 0,
  creditosAprobadosPlan: 0,
  totalPlanAsignaturas: 0,
  porcentajePlan: 0,
};

const PRIORIDAD_ESTADO = {
  APROBADA: 4,
  VALIDADA: 4,
  CONVALIDADA: 4,
  'EN CURSO': 3,
  CURSANDO: 3,
  INSCRITA: 3,
  REPROBADA: 2,
  CANCELADA: 1,
};

const normalizarNombre = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const baseCodigo = (c) => String(c || '').toUpperCase().trim().replace(/-[A-Z0-9]+$/, '');

/* Indexa las asignaturas aprobadas / en curso de la historia académica */
function crearIndiceProgreso(historia) {
  estadoProgreso.mapaProgreso.clear();
  if (!historia?.materias?.length) return;

  for (const m of historia.materias) {
    const estadoNorm = (m.estado || '').toUpperCase().trim();
    const registro = {
      ...m,
      estado: estadoNorm,
      prioridad: PRIORIDAD_ESTADO[estadoNorm] || 0,
    };

    const registrar = (clave) => {
      const previo = estadoProgreso.mapaProgreso.get(clave);
      if (!previo || registro.prioridad > previo.prioridad) {
        estadoProgreso.mapaProgreso.set(clave, registro);
      }
    };

    const codExacto = String(m.codigo || '').trim().toUpperCase();
    const codBase = baseCodigo(m.codigo);
    const nomNorm = normalizarNombre(m.nombre);

    if (codExacto) registrar('cod:' + codExacto);
    if (codBase) registrar('cod:' + codBase);
    if (nomNorm) registrar('nom:' + nomNorm);
  }

  calcularBolsasCumplidas(historia);
  actualizarMetricasPlan();
}

/* Consulta el estado de una asignatura en el avance del estudiante */
function consultarProgresoMateria(codigo) {
  if (!estadoProgreso.activo || !estadoProgreso.historia) return null;
  const asig = estado.asignaturas.get(codigo);
  const codExacto = String(codigo || '').trim().toUpperCase();
  const codBase = baseCodigo(codigo);
  const nomNorm = asig ? normalizarNombre(asig.nombre) : '';
  const map = estadoProgreso.mapaProgreso;

  return (codExacto ? map.get('cod:' + codExacto) : null)
    ?? (codBase ? map.get('cod:' + codBase) : null)
    ?? (nomNorm ? map.get('nom:' + nomNorm) : null)
    ?? null;
}

/* Calcula qué casillas optativas o de libre elección ya fueron satisfechas */
function calcularBolsasCumplidas(historia) {
  estadoProgreso.bolsasCumplidas.clear();
  if (!historia?.materias) return;

  const creditosPorBolsa = {
    'libre-eleccion': 0,
    'quimica': 0,
    'laboratorio-quimica': 0,
    'fisica': 0,
    'matematicas-probabilidad-estadistica': 0,
    'optativas-fundamentacion': 0,
    'optativas-disciplinares': 0,
    'optativas-administracion': 0,
  };

  for (const m of historia.materias) {
    if (!['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes((m.estado || '').toUpperCase())) continue;
    const tip = (m.tipologia || '').toUpperCase();
    const cr = m.creditos || 0;

    const a = estado.asignaturas.get(m.codigo) || estado.asignaturas.get(baseCodigo(m.codigo));
    if (a && !a.obligatoria && creditosPorBolsa[a.agrupacion] !== undefined) {
      creditosPorBolsa[a.agrupacion] += cr;
    } else if (tip.includes('LIBRE')) {
      creditosPorBolsa['libre-eleccion'] += cr;
    } else if (tip.includes('FUND. OPTATIVA')) {
      creditosPorBolsa['optativas-fundamentacion'] += cr;
    } else if (tip.includes('DISCIPLINAR OPTATIVA')) {
      creditosPorBolsa['optativas-disciplinares'] += cr;
    }
  }

  if (historia.resumen) {
    if (historia.resumen['LIBRE ELECCIÓN']?.aprobados) {
      creditosPorBolsa['libre-eleccion'] = Math.max(creditosPorBolsa['libre-eleccion'], historia.resumen['LIBRE ELECCIÓN'].aprobados);
    }
  }

  const disponibles = { ...creditosPorBolsa };

  for (const s of estado.plan) {
    s.items.forEach((item, pos) => {
      if (item.tipo === 'bolsa') {
        const ag = item.agrupacion;
        let cump = false;
        if (disponibles[ag] >= item.creditos) {
          disponibles[ag] -= item.creditos;
          cump = true;
        } else if (['optativas-fundamentacion', 'fisica', 'quimica', 'laboratorio-quimica', 'matematicas-probabilidad-estadistica'].includes(ag)) {
          if (disponibles['optativas-fundamentacion'] >= item.creditos) {
            disponibles['optativas-fundamentacion'] -= item.creditos;
            cump = true;
          }
        } else if (['optativas-disciplinares', 'optativas-administracion'].includes(ag)) {
          if (disponibles['optativas-disciplinares'] >= item.creditos) {
            disponibles['optativas-disciplinares'] -= item.creditos;
            cump = true;
          }
        }
        if (cump) {
          estadoProgreso.bolsasCumplidas.add(`b-${s.semestre}-${pos}`);
        }
      }
    });
  }
}

/* Calcula el total de asignaturas obligatorias y créditos cumplidos del plan */
function actualizarMetricasPlan() {
  let aprobadas = 0;
  let creditosAprobados = 0;
  let totalAsignaturas = 0;

  for (const semestre of estado.plan) {
    semestre.items.forEach((item, pos) => {
      if (item.tipo === 'asignatura') {
        totalAsignaturas += 1;
        const prog = consultarProgresoMateria(item.codigo);
        if (prog && ['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(prog.estado)) {
          aprobadas += 1;
          creditosAprobados += (estado.asignaturas.get(item.codigo)?.creditos || 0);
        }
      } else if (item.tipo === 'bolsa' && estadoProgreso.bolsasCumplidas.has(`b-${semestre.semestre}-${pos}`)) {
        creditosAprobados += (item.creditos || 0);
      }
    });
  }

  Object.assign(estadoProgreso, {
    aprobadasPlan: aprobadas,
    totalPlanAsignaturas: totalAsignaturas,
    creditosAprobadosPlan: creditosAprobados,
    porcentajePlan: Math.min(100, (creditosAprobados / 175) * 100),
  });
}

/* Carga el progreso desde localStorage 'quimica.avance.v1' */
function cargarProgresoUsuario() {
  let textoHistoria = '';
  let nombreUsuario = '';

  try {
    const guardado = JSON.parse(localStorage.getItem('quimica.avance.v1') || '{}');
    if (guardado.texto) {
      textoHistoria = guardado.texto;
      nombreUsuario = guardado.nombre || '';
    }
  } catch {}

  if (textoHistoria && typeof leerHistoria === 'function') {
    try {
      const historia = leerHistoria(textoHistoria);
      if (historia && (historia.materias?.length || Object.keys(historia.resumen || {}).length)) {
        estadoProgreso.historia = historia;
        if (!nombreUsuario && historia.nombre) nombreUsuario = historia.nombre;
        crearIndiceProgreso(historia);
      }
    } catch (e) {
      console.warn('Error procesando historia en la malla de Química:', e);
    }
  }

  actualizarBannerSesion(nombreUsuario);
}

/* Actualiza el panel superior de sesión o el aviso de invitación */
function actualizarBannerSesion(nombreUsuario) {
  const sesionEl = $('#malla-sesion');
  const invitadoEl = $('#malla-invitado');
  const tieneProgreso = Boolean(estadoProgreso.historia && estadoProgreso.historia.materias?.length);

  if (invitadoEl) invitadoEl.hidden = tieneProgreso;
  if (!sesionEl) return;
  sesionEl.hidden = !tieneProgreso;

  if (tieneProgreso) {
    const nombreEl = $('#malla-usuario-nombre');
    if (nombreEl) nombreEl.textContent = nombreUsuario || estadoProgreso.historia?.nombre || 'Estudiante';

    const resumenEl = $('#malla-resumen-texto');
    if (resumenEl) {
      const pct = (estadoProgreso.historia?.porcentajeSia != null)
        ? Number(estadoProgreso.historia.porcentajeSia).toFixed(1)
        : estadoProgreso.porcentajePlan.toFixed(1);
      resumenEl.textContent = `Has aprobado ${estadoProgreso.aprobadasPlan} asignaturas obligatorias (${estadoProgreso.creditosAprobadosPlan} créditos cumplidos) · ${pct} % de avance general`;
    }
  }
}

/* Control del botón switch para alternar el sombreado */
function iniciarControlesSesion() {
  const btnToggle = $('#btn-toggle-sombreado');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      estadoProgreso.activo = !estadoProgreso.activo;
      btnToggle.classList.toggle('is-activo', estadoProgreso.activo);
      btnToggle.setAttribute('aria-pressed', String(estadoProgreso.activo));
      const label = btnToggle.querySelector('.malla-sesion__btn-toggle-label');
      if (label) label.textContent = estadoProgreso.activo ? 'Sombrear aprobadas' : 'Ver malla limpia';
      pintarMalla();
      pintarLeyenda();
    });
  }
}


function pintarLeyenda() {
  const componentes = estado.componentes
    .map((c) => `<li><span class="leyenda__punto" style="--color: ${c.color}"></span>${esc(c.nombre)}</li>`)
    .join('');

  const progresoLeyenda = (estadoProgreso.activo && estadoProgreso.historia)
    ? `<li><span class="leyenda__punto leyenda__punto--aprobada"></span>Aprobada / Cumplida</li>
       <li><span class="leyenda__punto leyenda__punto--curso"></span>En curso</li>`
    : '';

  $('#leyenda').innerHTML = `
    ${componentes}
    ${progresoLeyenda}
    <li><span class="leyenda__aro" style="--color: #f59e0b"></span>Prerrequisito (te pide)</li>
    <li><span class="leyenda__aro" style="--color: var(--verde)"></span>Te abre (se abre después)</li>`;
}

Promise.all([cargarDatos('malla/componentes'), cargarDatos('malla/plan'), cargarDatos('malla/asignaturas')])
  .then((datos) => {
    prepararDatos(datos);
    cargarProgresoUsuario();
    iniciarControlesSesion();
    pintarLeyenda();
    pintarMalla();
    iniciarCatalogo();
    leerDireccion();
  })
  .catch((error) => mostrarErrorDeCarga($('#malla-rejilla'), error));





/* ---------- Convenciones ---------- */


/* ---------- Malla ---------- */


function casillaAsignatura(codigo) {
  const a = estado.asignaturas.get(codigo);
  const wppIndicador = a.whatsapp ? `<span class="materia__wpp-punto" title="Grupo de WhatsApp disponible">💬</span>` : '';

  let claseEstado = '';
  let estadoAria = '';
  let badgeHtml = '';

  if (estadoProgreso.activo) {
    const prog = consultarProgresoMateria(codigo);
    if (prog) {
      if (['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(prog.estado)) {
        claseEstado = ' materia--aprobada';
        estadoAria = ', aprobada';
        const notaTooltip = (prog.nota != null) ? ` · Nota: ${Number(prog.nota).toFixed(1)}` : '';
        badgeHtml = `<span class="materia__tag-aprobada" title="Asignatura aprobada${notaTooltip}">✓</span>`;
      } else if (['EN CURSO', 'CURSANDO', 'INSCRITA'].includes(prog.estado)) {
        claseEstado = ' materia--en-curso';
        estadoAria = ', en curso';
        badgeHtml = `<span class="materia__tag-curso" title="Matriculada este período">En curso</span>`;
      }
    }
  }

  return `
    <li>
      <button class="materia${claseEstado} ${a.whatsapp ? 'materia--con-wpp' : ''}" type="button" data-codigo="${esc(codigo)}" data-agrupacion="${esc(a.agrupacion)}"
        style="--color: ${colorDe(a)}" aria-label="${esc(a.nombre)}, ${a.creditos} créditos${estadoAria}${a.whatsapp ? ', con grupo de WhatsApp' : ''}">
        <span class="materia__nombre">${esc(a.nombre)}</span>
        <span class="materia__cred">${a.creditos}</span>
        <span class="materia__codigo">
          <span class="materia__codigo-num">${esc(a.codigo)}${wppIndicador}</span>
          ${badgeHtml}
        </span>
      </button>
    </li>`;
}

function casillaBolsa(bolsa, semestre, posicion) {
  const agrupacion = buscarAgrupacion(bolsa.agrupacion);
  const color = buscarComponente(agrupacion.componente).color;
  const bolsaId = `b-${semestre}-${posicion}`;
  const estaCumplida = estadoProgreso.activo && estadoProgreso.bolsasCumplidas.has(bolsaId);

  const claseCumplida = estaCumplida ? ' materia--aprobada materia--bolsa-cumplida' : '';
  const textoBolsa = estaCumplida
    ? 'Cumplida'
    : (bolsa.agrupacion === 'libre-eleccion' ? 'a tu elección' : 'ver opciones');
  const badgeHtml = estaCumplida
    ? '<span class="materia__tag-aprobada" title="Casilla cumplida">✓</span>'
    : '';

  return `
    <li>
      <button class="materia materia--bolsa${claseCumplida}" type="button" data-bolsa="${esc(bolsa.agrupacion)}"
        data-id="${bolsaId}" data-agrupacion="${esc(bolsa.agrupacion)}"
        data-creditos="${bolsa.creditos}" data-nombre="${esc(bolsa.nombre)}"
        ${estaCumplida ? 'data-cumplida="true"' : ''}
        style="--color: ${color}" aria-label="${esc(bolsa.nombre)}, ${bolsa.creditos} créditos${estaCumplida ? ', cumplida' : ''}">
        <span class="materia__nombre">${esc(bolsa.nombre)}</span>
        <span class="materia__cred">${bolsa.creditos}</span>
        <span class="materia__codigo">
          <span class="materia__codigo-num">${esc(textoBolsa)}</span>
          ${badgeHtml}
        </span>
      </button>
    </li>`;
}

function pintarMalla() {
  $('#malla-rejilla').innerHTML = `
    <div class="rejilla" id="rejilla">
      ${estado.plan.map((semestre) => `
        <section class="semestre" aria-label="Semestre ${ROMANOS[semestre.semestre - 1]}">
          <div class="semestre__cabeza">
            <h3>Semestre ${ROMANOS[semestre.semestre - 1]}</h3>
            <p>Créditos ${semestre.creditos}</p>
          </div>
          <ul class="semestre__lista">
            ${semestre.items.map((item, i) => item.tipo === 'asignatura'
              ? casillaAsignatura(item.codigo)
              : casillaBolsa(item, semestre.semestre, i)).join('')}
          </ul>
        </section>`).join('')}
    </div>`;

  const rejilla = $('#rejilla');

  rejilla.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.materia');
    if (!boton) return;
    if (boton.dataset.codigo) seleccionar(boton.dataset.codigo);
    else seleccionarBolsa(boton);
  });

  // Al pasar el cursor por encima de cualquier asignatura, marca sus prerrequisitos y lo que te abre
  rejilla.addEventListener('pointerover', (evento) => {
    const boton = evento.target.closest('.materia[data-codigo]');
    if (!boton) return;
    const codigo = boton.dataset.codigo;
    if (codigo === hoverCodigoActual) return;
    hoverCodigoActual = codigo;
    marcarRelaciones(codigo);
  });

  rejilla.addEventListener('pointerout', (evento) => {
    const boton = evento.target.closest('.materia[data-codigo]');
    if (!boton) return;
    const proximoBoton = evento.relatedTarget?.closest?.('.materia[data-codigo]');
    if (proximoBoton) {
      if (proximoBoton.dataset.codigo !== hoverCodigoActual) {
        hoverCodigoActual = proximoBoton.dataset.codigo;
        marcarRelaciones(hoverCodigoActual);
      }
      return;
    }
    // Salió del botón o pasó a un espacio no interactivo
    hoverCodigoActual = null;
    marcarRelaciones(estado.seleccion);
  });

  rejilla.addEventListener('pointerleave', () => {
    hoverCodigoActual = null;
    marcarRelaciones(estado.seleccion);
  });
}

// Marca en la malla la materia elegida o sobre la que está el cursor, sus prerrequisitos y las materias que abre
function marcarRelaciones(codigo) {
  const rejilla = $('#rejilla');
  if (!rejilla) return;
  rejilla.classList.toggle('hay-seleccion', Boolean(codigo));
  $$('.materia', rejilla).forEach((boton) => boton.classList.remove('es-seleccion', 'es-prerreq', 'es-dependiente'));
  if (!codigo) return;

  const asignatura = estado.asignaturas.get(codigo);
  if (!asignatura) return;

  const marcar = (cod, clase) => $$(`.materia[data-codigo="${CSS.escape(cod)}"]`, rejilla).forEach((b) => b.classList.add(clase));
  marcar(codigo, 'es-seleccion');
  asignatura.prerrequisitos.forEach((p) => marcar(p, 'es-prerreq'));
  (estado.dependientes.get(codigo) || []).forEach((d) => marcar(d, 'es-dependiente'));
}


/* ---------- Detalle ---------- */

const fichaMateria = (codigo, clase = '') => {
  const a = estado.asignaturas.get(codigo);
  return `
    <li><button class="ficha-materia ${clase}" type="button" data-ir="${esc(codigo)}" style="--color: ${colorDe(a)}">
      ${esc(a.nombre)} <small>${esc(a.codigo)}</small>
    </button></li>`;
};

function textoAvance(requisito) {
  const nombre = requisito.componente === 'fundamentacion' ? 'Fundamentación' : 'Formación Disciplinar o Profesional';
  return `${requisito.porcentaje} % de avance en el componente de ${nombre}`;
}

function pintarDetalle(contenidoHtml, color) {
  const detalle = $('#detalle');
  detalle.style.setProperty('--color', color);
  detalle.innerHTML = `<button class="detalle__cerrar" type="button" aria-label="Cerrar detalle">✕</button>${contenidoHtml}`;
  detalle.hidden = false;
  document.body.classList.add('con-detalle');
}

function cerrarDetalle() {
  estado.seleccion = null;
  hoverCodigoActual = null;
  $('#detalle').hidden = true;
  document.body.classList.remove('con-detalle');
  if ($('#rejilla')) marcarRelaciones(null);
  guardarDireccion();
}

function seleccionar(codigo, { desplazar = false } = {}) {
  const a = estado.asignaturas.get(codigo);
  if (!a) return;
  estado.seleccion = codigo;

  const agrupacion = buscarAgrupacion(a.agrupacion);
  const componente = buscarComponente(agrupacion.componente);
  const dependientes = estado.dependientes.get(codigo) || [];
  const semestre = a.semestre ? `Semestre ${ROMANOS[a.semestre - 1]}` : 'Optativa · sin semestre fijo';

  const bloqueWhatsapp = a.whatsapp ? `
    <div class="detalle__bloque detalle__bloque--whatsapp">
      <h4>Comunidad de WhatsApp</h4>
      <a class="detalle__whatsapp-boton" href="${esc(a.whatsapp)}" target="_blank" rel="noopener noreferrer">
        ${ICONO_WHATSAPP}
        <span>Unirse al grupo de WhatsApp</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>` : '';

  pintarDetalle(`
    <div class="detalle__cabeza">
      <p class="detalle__codigo">Código ${esc(a.codigo)}</p>
      <h3>${esc(a.nombre)}</h3>
      <ul class="etiquetas">
        <li class="etiqueta etiqueta--cred">${creditosTexto(a.creditos)} ${a.creditos === 1 ? 'crédito' : 'créditos'}</li>
        <li class="etiqueta etiqueta--comp">${esc(componente.nombre)}</li>
        <li class="etiqueta">${esc(agrupacion.nombre)}</li>
        <li class="etiqueta">${a.obligatoria ? 'Obligatoria' : 'Optativa'}</li>
        <li class="etiqueta">${esc(semestre)}</li>
        ${a.whatsapp ? `<li class="etiqueta etiqueta--wpp"><a href="${esc(a.whatsapp)}" target="_blank" rel="noopener noreferrer" title="Abrir grupo de WhatsApp">${ICONO_WHATSAPP} WhatsApp</a></li>` : ''}
      </ul>
    </div>
    <div class="detalle__cuerpo">
      ${bloqueWhatsapp}
      <div class="detalle__bloque">
        <h4>Prerrequisitos</h4>
        ${a.prerrequisitos.length
          ? `<ul class="fichas">${a.prerrequisitos.map((p) => fichaMateria(p, 'ficha-materia--prerreq')).join('')}</ul>`
          : '<p class="detalle__vacio">No tiene prerrequisitos.</p>'}
        ${a.requisitosAvance ? `<ul class="detalle__avance">${a.requisitosAvance.map((r) => `<li>${esc(textoAvance(r))}</li>`).join('')}</ul>` : ''}
      </div>
      <div class="detalle__bloque">
        <h4>Es prerrequisito de</h4>
        ${dependientes.length
          ? `<ul class="fichas">${dependientes.map((d) => fichaMateria(d)).join('')}</ul>`
          : '<p class="detalle__vacio">No es prerrequisito de otra asignatura.</p>'}
      </div>
      ${a.porConfirmar ? `<p class="detalle__confirmar"><strong>Dato por confirmar.</strong> ${esc(a.porConfirmar)}</p>` : ''}
    </div>`, colorDe(a));

  marcarRelaciones(codigo);
  if (desplazar) {
    $(`.materia[data-codigo="${CSS.escape(codigo)}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }
  guardarDireccion();
}

// Casilla de "Optativa de…" o "Libre elección": explica de qué se trata y lleva a la lista de opciones
function seleccionarBolsa(boton) {
  const agrupacion = buscarAgrupacion(boton.dataset.bolsa);
  const componente = buscarComponente(agrupacion.componente);
  const esLibre = agrupacion.id === 'libre-eleccion';

  estado.seleccion = null;
  marcarRelaciones(null);
  $$('.materia--bolsa.es-seleccion').forEach((b) => b.classList.remove('es-seleccion'));
  boton.classList.add('es-seleccion');

  pintarDetalle(`
    <div class="detalle__cabeza">
      <p class="detalle__codigo">Casilla de la malla</p>
      <h3>${esc(boton.dataset.nombre)}</h3>
      <ul class="etiquetas">
        <li class="etiqueta etiqueta--cred">${esc(boton.dataset.creditos)} créditos</li>
        <li class="etiqueta etiqueta--comp">${esc(componente.nombre)}</li>
        ${esLibre ? '' : `<li class="etiqueta">${esc(agrupacion.nombre)}</li>`}
      </ul>
    </div>
    <div class="detalle__cuerpo">
      <p class="detalle__vacio">${esLibre
        ? 'Esta casilla corresponde al componente de libre elección: no tiene una asignatura fija en la malla.'
        : `Aquí se cursa una optativa de la agrupación «${esc(agrupacion.nombre)}». El programa exige ${agrupacion.exigidos} créditos en total en esta agrupación; la lista con sus prerrequisitos está más abajo.`}</p>
      ${esLibre ? '' : '<button class="detalle__boton" type="button" data-ver-opciones>Ver las opciones</button>'}
    </div>`, componente.color);

  $('#detalle').dataset.bolsa = boton.dataset.bolsa;
  guardarDireccion();
}

$('#detalle').addEventListener('click', (evento) => {

  if (evento.target.closest('.detalle__cerrar')) return cerrarDetalle();

  const ir = evento.target.closest('[data-ir]');
  if (ir) return seleccionar(ir.dataset.ir, { desplazar: true });

  if (evento.target.closest('[data-ver-opciones]')) {
    const agrupacion = buscarAgrupacion($('#detalle').dataset.bolsa);
    estado.componente = agrupacion.componente;
    estado.agrupacion = agrupacion.id;
    estado.tipo = 'optativas';
    estado.pagina = 1;
    pintarCatalogo();
    $('#asignaturas').scrollIntoView({ behavior: 'smooth' });
    guardarDireccion();
  }
});


document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    if (!$('#detalle').hidden) cerrarDetalle();
  }
});


/* ---------- Catálogo por componente (paginado) ---------- */

function iniciarCatalogo() {
  estado.componente = estado.componentes[0].id;
  estado.agrupacion = null;

  $('#pestanas').setAttribute('role', 'tablist');
  $('#pestanas').addEventListener('click', (evento) => {
    const pestana = evento.target.closest('[data-componente]');
    if (!pestana) return;
    estado.componente = pestana.dataset.componente;
    estado.agrupacion = null;
    estado.tipo = 'todas';
    estado.pagina = 1;
    pintarCatalogo();
    guardarDireccion();
  });

  $('#agrupaciones').addEventListener('click', (evento) => {
    const pildora = evento.target.closest('[data-agrupacion]');
    if (!pildora) return;
    estado.agrupacion = pildora.dataset.agrupacion;
    estado.tipo = 'todas';
    estado.pagina = 1;
    pintarCatalogo();
    guardarDireccion();
  });

  $('#resumen-agrupacion').addEventListener('click', (evento) => {
    const filtro = evento.target.closest('[data-tipo]');
    if (!filtro) return;
    estado.tipo = filtro.dataset.tipo;
    estado.pagina = 1;
    pintarCatalogo();
    guardarDireccion();
  });

  $('#catalogo').addEventListener('click', (evento) => {
    const tarjeta = evento.target.closest('[data-codigo]');
    if (tarjeta) seleccionar(tarjeta.dataset.codigo);
  });

  $('#paginacion').addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-pagina]');
    if (!boton || boton.disabled) return;
    estado.pagina = Number(boton.dataset.pagina);
    pintarCatalogo();
    $('#asignaturas-titulo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    guardarDireccion();
  });

  pintarCatalogo();
}

// Obligatorias primero (por semestre) y luego las optativas por nombre
function ordenar(a, b) {
  if (a.obligatoria !== b.obligatoria) return a.obligatoria ? -1 : 1;
  if (a.obligatoria) return (a.semestre ?? 99) - (b.semestre ?? 99) || a.nombre.localeCompare(b.nombre, 'es');
  return a.nombre.localeCompare(b.nombre, 'es');
}

function pintarCatalogo() {
  // Pestañas de componente
  $('#pestanas').innerHTML = estado.componentes.map((c) => `
    <button class="pestana" type="button" role="tab" data-componente="${esc(c.id)}"
      aria-selected="${c.id === estado.componente}" style="--color: ${c.color}">${esc(c.nombre)}</button>`).join('');

  // Agrupaciones del componente elegido
  const delComponente = estado.agrupaciones.filter((a) => a.componente === estado.componente);
  if (!delComponente.some((a) => a.id === estado.agrupacion)) estado.agrupacion = delComponente[0].id;
  $('#agrupaciones').innerHTML = delComponente.length > 1
    ? delComponente.map((a) => `
        <button class="pildora" type="button" data-agrupacion="${esc(a.id)}"
          aria-pressed="${a.id === estado.agrupacion}">${esc(a.nombre)}</button>`).join('')
    : '';

  const agrupacion = buscarAgrupacion(estado.agrupacion);
  const todas = [...estado.asignaturas.values()].filter((a) => a.agrupacion === agrupacion.id).sort(ordenar);
  const hayAmbas = todas.some((a) => a.obligatoria) && todas.some((a) => !a.obligatoria);
  if (!hayAmbas) estado.tipo = 'todas';
  const filtradas = todas.filter((a) =>
    estado.tipo === 'todas' || (estado.tipo === 'obligatorias' ? a.obligatoria : !a.obligatoria));

  // Resumen de créditos de la agrupación (los números del programa curricular)
  const filtro = hayAmbas ? `
    <span class="filtro" role="group" aria-label="Tipo de asignatura">
      ${[['todas', 'Todas'], ['obligatorias', 'Obligatorias'], ['optativas', 'Optativas']].map(([id, texto]) =>
        `<button type="button" data-tipo="${id}" aria-pressed="${estado.tipo === id}">${texto}</button>`).join('')}
    </span>` : '';
  $('#resumen-agrupacion').innerHTML = agrupacion.exigidos === undefined ? '' : `
    <div class="resumen">
      <span><strong>${esc(agrupacion.nombre)}</strong> · créditos exigidos: <strong>${agrupacion.exigidos}</strong></span>
      <span class="resumen__oblig">Obligatorios: ${agrupacion.obligatorios}</span>
      <span class="resumen__optat">Optativos: ${agrupacion.optativos}</span>
      ${filtro}
    </div>`;

  // Página actual
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  estado.pagina = Math.min(Math.max(1, estado.pagina), totalPaginas);
  const inicio = (estado.pagina - 1) * POR_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + POR_PAGINA);

  $('#catalogo').innerHTML = agrupacion.id === 'libre-eleccion'
    ? `<li class="catalogo__vacio">El componente de libre elección no tiene asignaturas fijas: se cursa en las casillas «Libre elección» de la malla.</li>`
    : visibles.map((a) => {
        const prog = estadoProgreso.activo ? consultarProgresoMateria(a.codigo) : null;
        const esAprobada = prog && ['APROBADA', 'VALIDADA', 'CONVALIDADA'].includes(prog.estado);
        const esEnCurso = prog && ['EN CURSO', 'CURSANDO', 'INSCRITA'].includes(prog.estado);
        const claseTarjeta = esAprobada ? ' tarjeta tarjeta--aprobada' : (esEnCurso ? ' tarjeta tarjeta--en-curso' : ' tarjeta');
        const badgeEstado = esAprobada
          ? `<span class="tarjeta__estado-badge" style="background:var(--verde, #2F6B4F); color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:4px;">✓ APROBADA ${prog.nota != null ? Number(prog.nota).toFixed(1) : ''}</span>`
          : (esEnCurso ? `<span class="tarjeta__estado-badge" style="background:var(--naranja, #E8743B); color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:4px;">▶ EN CURSO</span>` : '');

        return `
        <li>
          <button class="${claseTarjeta}" type="button" data-codigo="${esc(a.codigo)}" style="--color: ${colorDe(a)}">
            <span class="tarjeta__nombre">${esc(a.nombre)}</span>
            <span class="tarjeta__pie">
              <span>${badgeEstado}<span class="tarjeta__tipo">${a.obligatoria ? 'Obligatoria' : 'Optativa'}</span> · ${esc(a.codigo)}${a.whatsapp ? ' · <span class="tarjeta__wpp" title="Tiene grupo de WhatsApp">💬 WhatsApp</span>' : ''}</span>
              <span class="tarjeta__cred" title="Créditos">${creditosTexto(a.creditos)}</span>
            </span>
          </button>
        </li>`;
      }).join('');

  pintarPaginacion(totalPaginas, filtradas.length, inicio, visibles.length);
}

// 1 … 4 5 [6] 7 8 … 12
function paginasVisibles(actual, total) {
  const conjunto = new Set([1, total, actual - 1, actual, actual + 1]);
  const ordenadas = [...conjunto].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const salida = [];
  ordenadas.forEach((n, i) => {
    const hueco = i ? n - ordenadas[i - 1] : 1;
    if (hueco === 2) salida.push(n - 1);     // si falta una sola página, se muestra en vez de "…"
    else if (hueco > 2) salida.push('…');
    salida.push(n);
  });
  return salida;
}

function pintarPaginacion(total, cantidad, inicio, enPagina) {
  const nav = $('#paginacion');
  if (!cantidad || estado.agrupacion === 'libre-eleccion') { nav.innerHTML = ''; return; }

  const info = `<p class="pag__info">Mostrando ${inicio + 1}–${inicio + enPagina} de ${cantidad} asignaturas</p>`;
  if (total === 1) { nav.innerHTML = info; return; }

  nav.innerHTML = `
    <button class="pag__boton" type="button" data-pagina="${estado.pagina - 1}" ${estado.pagina === 1 ? 'disabled' : ''} aria-label="Página anterior">‹</button>
    ${paginasVisibles(estado.pagina, total).map((n) => n === '…'
      ? '<span class="pag__puntos" aria-hidden="true">…</span>'
      : `<button class="pag__boton" type="button" data-pagina="${n}" ${n === estado.pagina ? 'aria-current="page"' : ''} aria-label="Página ${n}">${n}</button>`).join('')}
    <button class="pag__boton" type="button" data-pagina="${estado.pagina + 1}" ${estado.pagina === total ? 'disabled' : ''} aria-label="Página siguiente">›</button>
    ${info}`;
}


/* ---------- Dirección (para compartir el estado de la página) ---------- */

function guardarDireccion() {
  const parametros = new URLSearchParams();
  if (estado.seleccion) parametros.set('materia', estado.seleccion);
  parametros.set('componente', estado.componente);
  parametros.set('agrupacion', estado.agrupacion);
  if (estado.tipo !== 'todas') parametros.set('tipo', estado.tipo);
  if (estado.pagina > 1) parametros.set('pagina', estado.pagina);
  history.replaceState(null, '', `#${parametros}`);
}

function leerDireccion() {
  const parametros = new URLSearchParams(location.hash.slice(1));
  const agrupacion = buscarAgrupacion(parametros.get('agrupacion'));
  if (agrupacion) {
    estado.componente = agrupacion.componente;
    estado.agrupacion = agrupacion.id;
    estado.tipo = ['obligatorias', 'optativas'].includes(parametros.get('tipo')) ? parametros.get('tipo') : 'todas';
    estado.pagina = Number(parametros.get('pagina')) || 1;
    pintarCatalogo();
  }
  const materia = parametros.get('materia');
  if (materia && estado.asignaturas.has(materia)) seleccionar(materia, { desplazar: true });
}
