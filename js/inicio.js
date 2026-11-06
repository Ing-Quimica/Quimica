/* =============================================
   MÓDULO INICIO — INGENIERÍA QUÍMICA UNAL
   - Carga dinámica de datos (programa.json, perfil.json, grupos.json)
   - Presentación institucional limpia y profesional
   ============================================= */

const ICONOS_PERFIL = {
  operaciones: '<path d="M7 2h10M12 2v20M8 7h8M8 12h8M8 17h8"/><rect x="6" y="2" width="12" height="20" rx="3"/>',
  termo: '<path d="M12 2a5 5 0 0 1 5 5c0 2.2-1.5 4.1-3 5.5v5.5a2 2 0 0 1-4 0v-5.5C8.5 11.1 7 9.2 7 7a5 5 0 0 1 5-5z"/><circle cx="12" cy="18" r="1"/>',
  reactor: '<rect x="6" y="5" width="12" height="15" rx="4"/><path d="M12 2v3M9 2h6M12 8v6M10 14h4"/><circle cx="12" cy="18" r="1"/>',
  control: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/><path d="M3 12h2M19 12h2M12 3v2M12 19v2"/>'
};

const ICONOS_RUTAS = {
  operaciones: '<rect x="6" y="3" width="12" height="18" rx="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="18" y2="16"/><path d="M12 3V1M12 23v-2"/>',
  termodinamica: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/><circle cx="11.5" cy="17.5" r="2" fill="currentColor"/>',
  reactor: '<path d="M7 3h10v3H7z"/><path d="M8 6v10a4 4 0 0 0 8 0V6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/>',
  bioprocesos: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2A7 7 0 0 1 11 20z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  control: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/>'
};

const icono = (nombre) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_PERFIL[nombre] || ''}</svg>`;
const iconoRuta = (nombre) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_RUTAS[nombre] || ''}</svg>`;

const ICONO_SELLO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/><path d="m9.5 9 1.8 1.8L15 7.2"/></svg>';


/* ---------- Programa ---------- */

function pintarPrograma(p) {
  $('#portada-cifras').innerHTML = p.cifras
    .map((c) => `<li>${esc(c.valor)}<small>${esc(c.texto)}</small></li>`)
    .join('');

  const acreditacion = p.acreditacion;
  $('#programa-contenido').innerHTML = `
    <!-- BANNER DESTACADO / DÍA DEL INGENIERO QUÍMICO -->
    <div class="iq-evento-banner" id="evento-iq">
      <div class="iq-evento-banner__lado">
        <span class="iq-evento-banner__fecha">19 y 20 de noviembre · Facultad de Minas</span>
        <h3 class="iq-evento-banner__titulo">Día del Ingeniero Químico & PROCESA</h3>
        <p class="iq-evento-banner__texto">Conferencias sobre ingeniería de procesos, biotecnología aplicada, transición energética e inteligencia artificial en la industria química.</p>
        <div class="iq-evento-banner__acciones">
          <a class="iq-evento-banner__btn-primario" href="https://www.instagram.com/aiche.unmed/" target="_blank" rel="noopener noreferrer">
            <span>Conocer en AIChE</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
          <a class="iq-evento-banner__btn-secundario" href="malla.html">Ver Malla 3525</a>
        </div>
      </div>
      <div class="iq-evento-banner__tarjetas">
        <div class="iq-evento-mini-card">
          <span class="iq-evento-mini-card__linea" style="background: var(--naranja)"></span>
          <strong>AIChE</strong>
          <small>Capítulo Estudiantil UNAL</small>
        </div>
        <div class="iq-evento-mini-card">
          <span class="iq-evento-mini-card__linea" style="background: var(--verde)"></span>
          <strong>Semilleros</strong>
          <small>Investigación en Procesos</small>
        </div>
        <div class="iq-evento-mini-card">
          <span class="iq-evento-mini-card__linea" style="background: var(--vino)"></span>
          <strong>Representación</strong>
          <small>Tu voz en la carrera</small>
        </div>
      </div>
    </div>

    <!-- DEFINICIÓN DEL PREGRADO -->
    <div class="seccion-titulo" style="margin-top: 56px;">
      <p class="seccion-titulo__antetitulo">${esc(p.facultad)} · ${esc(p.sede)}</p>
      <h2 id="programa-titulo">Definición del pregrado</h2>
      <p class="seccion-titulo__intro">Ingeniería Química · Transformación rigurosa de materias primas y energía para el progreso industrial y sostenible</p>
    </div>

    <div class="programa__rejilla">
      <div class="programa__texto">
        <span class="programa__lema">Lema de la Facultad: ${esc(p.lema)}</span>
        <div class="programa__parrafos">
          ${p.descripcion.map((parrafo) => `<p>${esc(parrafo)}</p>`).join('')}
        </div>
      </div>
      <ul class="ficha">
        ${p.ficha.map((f) => `
          <li><span class="ficha__etiqueta">${esc(f.etiqueta)}</span><span class="ficha__valor">${esc(f.valor)}</span></li>`).join('')}
      </ul>
    </div>

    <!-- RUTAS Y PILARES CURRICULARES -->
    <div class="rutas-curriculares" id="rutas-curriculares">
      <div class="seccion-titulo seccion-titulo--rutas">
        <p class="seccion-titulo__antetitulo">Campos de profundización y aplicación industrial</p>
        <h3 class="rutas__titulo">Rutas y Pilares Curriculares</h3>
        <p class="seccion-titulo__intro">Cinco núcleos formativos que estructuran las competencias del Ingeniero Químico de la Facultad de Minas:</p>
      </div>

      <div class="rutas__grid">
        ${(p.rutas || []).map((ruta, idx) => `
          <article class="ruta-card" style="--color-ruta: ${ruta.color}">
            <div class="ruta-card__encabezado">
              <span class="ruta-card__numero">0${idx + 1}</span>
              <span class="ruta-card__icono">${iconoRuta(ruta.icono)}</span>
            </div>
            <h4 class="ruta-card__nombre">${esc(ruta.nombre)}</h4>
            <p class="ruta-card__descripcion">${esc(ruta.descripcion)}</p>
            <div class="ruta-card__pie">
              <a href="malla.html" class="ruta-card__enlace" title="Ver materias de ${esc(ruta.nombre)} en la malla">
                <span>Ver en la malla</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </article>`).join('')}
      </div>
    </div>

    <!-- CALIDAD Y ACREDITACIÓN -->
    <div class="acreditacion">
      <div class="acreditacion__cabecera">
        <span class="acreditacion__sello-icono">${ICONO_SELLO}</span>
        <div>
          <span class="acreditacion__antetitulo">Calidad Académica Certificada</span>
          <h3 class="acreditacion__estado">${esc(acreditacion.estado)}</h3>
        </div>
      </div>
      <div class="acreditacion__rejilla">
        ${acreditacion.hitos.map((h, i) => `
          <div class="acreditacion__tarjeta ${String(h.anio).toLowerCase().includes('res') ? 'acreditacion__tarjeta--renovacion' : ''}">
            <div class="acreditacion__tarjeta-encabezado">
              <span class="acreditacion__anio-badge">${esc(h.anio)}</span>
              <span class="acreditacion__hito-tipo">${i === 0 ? 'Creación Oficial' : (i === 1 ? 'Actualización Curricular' : 'Acreditación MEN')}</span>
            </div>
            <p class="acreditacion__texto">${esc(h.texto)}</p>
          </div>`).join('')}
      </div>
      <div class="acreditacion__pie">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="acreditacion__info-icono" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p class="acreditacion__nota">${esc(acreditacion.nota)}</p>
      </div>
    </div>

    <p class="fuentes">Fuentes oficiales:
      ${p.fuentes.map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a>`).join(' · ')}
    </p>`;
}


/* ---------- Perfil del egresado ---------- */

function pintarPerfil(perfil) {
  $('#perfil-contenido').innerHTML = `
    <div class="seccion-titulo">
      <p class="seccion-titulo__antetitulo">Quién sale de aquí</p>
      <h2 id="perfil-titulo">${esc(perfil.titulo)}</h2>
      <p class="seccion-titulo__intro">${esc(perfil.intro)}</p>
    </div>
    <ul class="perfil__tarjetas">
      ${perfil.rasgos.map((r) => `
        <li class="rasgo">
          <span class="rasgo__icono">${icono(r.icono)}</span>
          <h3>${esc(r.titulo)}</h3>
          <p>${esc(r.texto)}</p>
        </li>`).join('')}
    </ul>
    <p class="perfil__fuente">${esc(perfil.fuente)}</p>`;
}


/* ---------- Grupos estudiantiles y semilleros ---------- */

function pintarGrupos(grupos) {
  const elementos = grupos.map((grupo) => {
    const destino = grupo.enlace ? `href="${esc(grupo.enlace)}" target="_blank" rel="noopener noreferrer"` : '';
    const emailBtn = grupo.email ? `
      <a class="grupo__enlace-contacto" href="mailto:${esc(grupo.email)}" title="Correo de ${esc(grupo.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <span>${esc(grupo.email)}</span>
      </a>` : '';

    return `
      <li class="grupo" style="--color: ${esc(grupo.color)};">
        <a class="grupo__enlace" ${destino} aria-label="Conoce más sobre ${esc(grupo.nombre)}" title="Conoce más sobre ${esc(grupo.nombre)}">
          <div class="grupo__logo-wrap">
            <img class="grupo__logo-img" src="${esc(grupo.logo)}" alt="Logo de ${esc(grupo.nombre)}" loading="lazy">
            <span class="grupo__badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Conectar</span>
            </span>
          </div>
        </a>

        <div class="grupo__cuerpo">
          <span class="grupo__tipo">${esc(grupo.tipo)}</span>
          <h3 class="grupo__nombre">${esc(grupo.nombre)}</h3>
          <p class="grupo__descripcion">${esc(grupo.descripcion)}</p>
          <div class="grupo__contactos">
            ${emailBtn}
          </div>
        </div>
      </li>`;
  }).join('');

  $('#grupos-contenido').innerHTML = `
    <div class="seccion-titulo">
      <p class="seccion-titulo__antetitulo">Comunidad, Ciencia y Liderazgo</p>
      <h2 id="grupos-titulo">Capítulo Estudiantil</h2>
      <p class="seccion-titulo__intro">Espacio oficial de formación, desarrollo tecnológico, eventos académicos y vinculación con la industria química global:</p>
    </div>
    <ul class="grupos__lista">${elementos}</ul>`;
}


/* ---------- Carga bajo demanda ---------- */

cargarDatos('programa')
  .then(pintarPrograma)
  .catch((error) => mostrarErrorDeCarga($('#programa-contenido'), error));

const observador = new IntersectionObserver((entradas, obs) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    const seccion = entrada.target;
    const carga = seccion.dataset.carga;

    if (carga === 'perfil') {
      cargarDatos('perfil')
        .then(pintarPerfil)
        .catch((error) => mostrarErrorDeCarga($('#perfil-contenido'), error));
    } else if (carga === 'grupos') {
      cargarDatos('grupos')
        .then(pintarGrupos)
        .catch((error) => mostrarErrorDeCarga($('#grupos-contenido'), error));
    }
    obs.unobserve(seccion);
  });
}, { rootMargin: '250px' });

$$('[data-carga]').forEach((el) => observador.observe(el));
