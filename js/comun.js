/* =============================================
   FUNCIONES COMUNES A TODOS LOS MÓDULOS
   - Carga de datos (cada módulo pide solo los JSON que necesita)
   - Barra superior y pie, iguales en todas las páginas
   - Identidad visual oficial: Ingeniería Química · UNAL Medellín
   ============================================= */

const $ = (selector, raiz = document) => raiz.querySelector(selector);
const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

// Escapa texto antes de meterlo en HTML
const esc = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);


/* ---------- Carga de datos ---------- */

const memoriaDatos = new Map();

function cargarDatos(ruta) {
  if (!memoriaDatos.has(ruta)) {
    const peticion = fetch(`data/${ruta}.json`).then((respuesta) => {
      if (!respuesta.ok) throw new Error(`No se pudo cargar data/${ruta}.json (${respuesta.status})`);
      return respuesta.json();
    });
    memoriaDatos.set(ruta, peticion);
  }
  return memoriaDatos.get(ruta);
}

function mostrarErrorDeCarga(contenedor, error) {
  console.error(error);
  contenedor.innerHTML = `
    <div class="aviso">
      <p><strong>No se pudo cargar la información.</strong></p>
      <p>Si abriste el archivo con doble clic, sírvelo con un servidor local:
        <code>python -m http.server</code> y entra a <code>http://localhost:8000</code>.</p>
    </div>`;
}


/* ---------- Escudo oficial / Logo Ingeniería Química ---------- */

function dibujarEscudo() {
  return `<img src="img/logo-quimica.png" alt="Logo de Ingeniería Química · Facultad de Minas" class="barra__escudo-img">`;
}


/* ---------- Barra superior y pie ---------- */

const PAGINAS = [
  {
    id: 'inicio',
    texto: 'Inicio',
    url: 'index.html',
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav__icono"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`
  },
  {
    id: 'malla',
    texto: 'Malla curricular',
    url: 'malla.html',
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav__icono"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>`
  },
  {
    id: 'intercampus',
    texto: 'Rutas Intercampus',
    url: 'intercampus.html',
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav__icono"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/></svg>`
  },
  {
    id: 'convenios',
    texto: 'Convenios',
    url: 'convenios.html',
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav__icono"><path d="m11 17 2 2a1 1 0 0 0 1.4 0l6.6-6.6a2 2 0 0 0 0-2.8l-3.2-3.2a2 2 0 0 0-2.8 0L13 8.4"/><path d="m8 14-2-2a2 2 0 0 1 0-2.8l3.2-3.2a2 2 0 0 1 2.8 0l2 2"/></svg>`
  },
  {
    id: 'info',
    texto: 'Información general',
    url: 'info.html',
    icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav__icono"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  },
];

function pintarBarra() {
  const actual = document.body.dataset.pagina;
  $('#barra').outerHTML = `
    <header class="barra" id="encabezado-barra">
      <div class="barra__progreso" id="barra-progreso" aria-hidden="true"></div>
      <div class="contenedor barra__contenido">
        <a class="barra__marca" href="index.html" aria-label="Ingeniería Química · Inicio">
          <span class="barra__escudo">
            <img src="img/logo-quimica-emblema.png" alt="Emblema de Ingeniería Química" class="barra__escudo-img" width="42" height="42">
          </span>
          <div class="barra__titulos">
            <span class="barra__nombre">Ingeniería Química</span>
            <div class="barra__subfila">
              <span class="barra__facultad">Facultad de Minas</span>
              <span class="barra__separador" aria-hidden="true">·</span>
              <span class="barra__sede">Sede Medellín</span>
            </div>
          </div>
        </a>

        <button class="barra__boton-menu" id="btn-menu" type="button" aria-expanded="false" aria-controls="menu-navegacion" aria-label="Abrir menú de navegación">
          <span class="barra__icono-menu" aria-hidden="true">
            <span class="barra__linea barra__linea--1"></span>
            <span class="barra__linea barra__linea--2"></span>
            <span class="barra__linea barra__linea--3"></span>
          </span>
          <span class="barra__boton-texto">Menú</span>
        </button>

        <nav class="nav" id="menu-navegacion" aria-label="Módulos del portal">
          <div class="nav__glider" id="nav-glider" aria-hidden="true"></div>
          ${PAGINAS.map((p) => {
            const esActivo = p.id === actual;
            return `
              <a href="${p.url}" class="nav__item ${esActivo ? 'nav__item--activo' : ''}" ${esActivo ? 'aria-current="page"' : ''} data-pagina-id="${p.id}">
                <span class="nav__icono-box" aria-hidden="true">${p.icono}</span>
                <span class="nav__etiqueta">${p.texto}</span>
                ${esActivo ? '<span class="nav__filamento" aria-hidden="true"></span>' : ''}
              </a>
            `;
          }).join('')}
        </nav>
      </div>
    </header>`;

  configurarNavegacionInteractiva();
  configurarMenuMovil();
}

function configurarNavegacionInteractiva() {
  const barra = $('#encabezado-barra');
  const nav = $('#menu-navegacion');
  const glider = $('#nav-glider');
  const barraProgreso = $('#barra-progreso');
  if (!barra || !nav || !glider) return;

  const items = $$('.nav__item', nav);
  const itemActivo = items.find((a) => a.getAttribute('aria-current') === 'page') || null;

  function reposicionarGlider(el, suave = true) {
    if (!el || window.innerWidth <= 980) {
      glider.style.opacity = '0';
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const x = elRect.left - navRect.left;
    const y = elRect.top - navRect.top;

    glider.style.transition = suave
      ? 'transform 0.26s cubic-bezier(0.2, 0.85, 0.25, 1.1), width 0.26s cubic-bezier(0.2, 0.85, 0.25, 1.1), height 0.26s cubic-bezier(0.2, 0.85, 0.25, 1.1), opacity 0.18s ease'
      : 'none';
    glider.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    glider.style.width = `${elRect.width}px`;
    glider.style.height = `${elRect.height}px`;
    glider.style.opacity = '1';
  }

  // Inicializar posición tras render
  const initGlider = () => {
    requestAnimationFrame(() => reposicionarGlider(itemActivo, false));
  };
  initGlider();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initGlider);
  }

  // Eventos de interacción sobre cada botón
  items.forEach((item) => {
    item.addEventListener('pointerenter', () => {
      reposicionarGlider(item, true);
    });

    item.addEventListener('focus', () => {
      reposicionarGlider(item, true);
    });

    // Clic con animación y transición
    item.addEventListener('click', (e) => {
      // Si hace clic en la página donde ya está, sube suavemente
      if (item === itemActivo) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Efecto onda expansiva
      const rect = item.getBoundingClientRect();
      const onda = document.createElement('span');
      onda.className = 'nav__onda';
      onda.style.left = `${e.clientX - rect.left}px`;
      onda.style.top = `${e.clientY - rect.top}px`;
      item.appendChild(onda);
      setTimeout(() => onda.remove(), 600);

      // Micro-rebote de botón
      item.classList.remove('is-clic');
      void item.offsetWidth;
      item.classList.add('is-clic');

      // Animación en barra superior
      if (barraProgreso) {
        barraProgreso.classList.remove('is-activada');
        void barraProgreso.offsetWidth;
        barraProgreso.classList.add('is-activada');
      }

      // Acelerar glider al botón seleccionado
      reposicionarGlider(item, true);
    });
  });

  nav.addEventListener('pointerleave', () => {
    reposicionarGlider(itemActivo, true);
  });

  nav.addEventListener('focusout', (e) => {
    if (!nav.contains(e.relatedTarget)) {
      reposicionarGlider(itemActivo, true);
    }
  });

  let timeoutResize;
  window.addEventListener('resize', () => {
    clearTimeout(timeoutResize);
    timeoutResize = setTimeout(() => {
      reposicionarGlider(itemActivo, false);
    }, 100);
  });
}

function configurarMenuMovil() {
  const barra = $('#encabezado-barra');
  const btn = $('#btn-menu');
  const nav = $('#menu-navegacion');
  if (!barra || !btn || !nav) return;

  function toggleMenu(abrir) {
    const estaAbierto = abrir !== undefined ? abrir : !barra.classList.contains('is-menu-abierto');
    barra.classList.toggle('is-menu-abierto', estaAbierto);
    btn.setAttribute('aria-expanded', String(estaAbierto));
    btn.setAttribute('aria-label', estaAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      toggleMenu(false);
    }
  });

  document.addEventListener('click', (e) => {
    if (barra.classList.contains('is-menu-abierto') && !barra.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && barra.classList.contains('is-menu-abierto')) {
      toggleMenu(false);
      btn.focus();
    }
  });
}

function pintarPie() {
  $('#pie').outerHTML = `
    <footer class="pie">
      <div class="pie__marca-central">
        <div class="pie__escudo">
          <img src="img/logo-quimica.png" alt="Logo de Ingeniería Química" class="pie__escudo-img">
        </div>

        <div class="pie__pildoras-carrera">
          <a class="pie__pildora pie__pildora--ig" href="https://www.instagram.com/repres_iq1/" target="_blank" rel="noopener noreferrer" title="Instagram de la Representación de Ingeniería Química">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            <span>@repres_iq1</span>
          </a>
          <a class="pie__pildora pie__pildora--wpp" href="https://chat.whatsapp.com/JjnmD2vnn1h5ISKkKza5S6" target="_blank" rel="noopener noreferrer" title="Canal oficial de WhatsApp de Ingeniería Química">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>
            <span>Canal WhatsApp IQ</span>
          </a>
        </div>

        <p class="pie__titulo-carrera"><strong>Ingeniería Química</strong> · Facultad de Minas · Universidad Nacional de Colombia, Sede Medellín</p>
      </div>

      <!-- DOS TARJETAS: REPRESENTACIÓN Y MARCA DE AGUA DEL CREADOR -->
      <div class="pie__tarjetas-grid">
        <!-- TARJETA 1: REPRESENTACIÓN ESTUDIANTIL -->
        <div class="pie__tarjeta pie__tarjeta--representacion">
          <span class="pie__tarjeta-sub">REPRESENTACIÓN ESTUDIANTIL · ING. QUÍMICA</span>
          <div class="pie__repre-bloque">
            <p class="pie__tarjeta-nombre"><strong>María José Collazos</strong> · Representante Principal</p>
            <div class="pie__tarjeta-enlaces">
              <a class="pie__enlace-contacto pie__enlace-contacto--wpp" href="https://wa.me/573024153321" target="_blank" rel="noopener noreferrer" title="WhatsApp de María José Collazos">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>
                <span>(+57) 302 415 3321</span>
              </a>
              <a class="pie__enlace-contacto pie__enlace-contacto--ig" href="https://www.instagram.com/majocollazoss/" target="_blank" rel="noopener noreferrer" title="Instagram personal de la representante">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                <span>@majocollazoss</span>
              </a>
            </div>
            <div class="pie__tarjeta-enlaces pie__tarjeta-enlaces--segunda">
              <a class="pie__enlace-contacto pie__enlace-contacto--correo" href="mailto:macollazosm@unal.edu.co" title="Correo institucional de la representante">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span>macollazosm@unal.edu.co</span>
              </a>
            </div>
          </div>

          <div class="pie__repre-divisor" aria-hidden="true"></div>

          <div class="pie__repre-bloque">
            <p class="pie__tarjeta-nombre"><strong>Joner Figueroa</strong> · Representante Suplente</p>
            <div class="pie__tarjeta-enlaces">
              <a class="pie__enlace-contacto pie__enlace-contacto--wpp" href="https://wa.me/57322638014" target="_blank" rel="noopener noreferrer" title="WhatsApp del representante suplente">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.07 7.71C8.89 7.71 8.6 7.78 8.36 8.04C8.11 8.3 7.41 8.96 7.41 10.3C7.41 11.63 8.38 12.92 8.52 13.1C8.66 13.29 10.42 16 13.12 17.17C15.36 18.14 15.82 17.95 16.31 17.9C16.8 17.86 17.88 17.26 18.11 16.63C18.33 16 18.33 15.46 18.26 15.35C18.2 15.24 18.01 15.18 17.73 15.04C17.45 14.9 16.08 14.23 15.83 14.13C15.57 14.04 15.39 13.99 15.2 14.27C15.02 14.55 14.49 15.18 14.33 15.36C14.17 15.55 14.01 15.57 13.73 15.43C13.45 15.29 12.27 14.9 10.87 13.65C9.78 12.68 9.05 11.48 8.84 11.12C8.63 10.76 8.82 10.56 8.96 10.42C9.09 10.29 9.25 10.08 9.39 9.92C9.53 9.76 9.58 9.64 9.67 9.46C9.76 9.27 9.72 9.11 9.65 8.97C9.58 8.83 9.07 7.58 8.86 7.07C8.66 6.58 8.45 6.64 8.3 6.63C8.15 6.63 7.97 6.63 7.78 6.63"/></svg>
                <span>(+57) 322 638 014</span>
              </a>
            </div>
          </div>
        </div>

        <!-- TARJETA 2: CREACIÓN Y DESARROLLO WEB (MARCA DE AGUA) -->
        <div class="pie__tarjeta pie__tarjeta--desarrollo">
          <span class="pie__tarjeta-sub">CREACIÓN Y DESARROLLO WEB</span>
          <p class="pie__tarjeta-nombre">Iniciativa y plataforma desarrollada por <strong>Santiago Escobar Arias</strong> · Representante de Sistemas</p>
          <div class="pie__tarjeta-enlaces pie__tarjeta-enlaces--iconos">
            <a class="pie__enlace-icono pie__enlace-icono--ig" href="https://www.instagram.com/s_escobar__/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Santiago Escobar (@s_escobar__)" title="Instagram @s_escobar__">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a class="pie__enlace-icono pie__enlace-icono--correo" href="mailto:saescobara@unal.edu.co" aria-label="Correo institucional de Santiago Escobar (saescobara@unal.edu.co)" title="Correo saescobara@unal.edu.co">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>`;
}


/* ---------- Mensaje de bienvenida / Creador de la Web ---------- */

function mostrarMensajeAutor() {
  if (sessionStorage.getItem('mensaje_autor_cerrado') === '1') return;

  const toast = document.createElement('aside');
  toast.className = 'toast-autor';
  toast.id = 'toast-autor';
  toast.setAttribute('aria-label', 'Mensaje del creador del portal');
  toast.innerHTML = `
    <div class="toast-autor__tarjeta">
      <button class="toast-autor__cerrar" id="toast-autor-cerrar" type="button" aria-label="Cerrar mensaje">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="toast-autor__cabecera">
        <div class="toast-autor__avatar" aria-hidden="true">
          <img src="img/logo-quimica.png" alt="Logo de Ingeniería Química" class="toast-autor__avatar-img">
        </div>
        <div class="toast-autor__titulos">
          <span class="toast-autor__nombre">Santiago Escobar Arias</span>
          <span class="toast-autor__cargo">REPRESENTANTE DE SISTEMAS · CREADOR DE LA WEB</span>
        </div>
      </div>

      <p class="toast-autor__mensaje">
        ¡Hola! Desarrollé este portal con el propósito de apoyar, guiar y facilitar la vida universitaria de todos los estudiantes de <strong>Ingeniería Química</strong>. Cuentan con mi total respaldo desde la representación estudiantil de Sistemas para seguir construyendo herramientas digitales que fortalezcan nuestra vida académica en la Facultad de Minas.
      </p>

      <div class="toast-autor__fila-inferior">
        <div class="toast-autor__pildoras">
          <a class="toast-autor__pildora toast-autor__pildora--ig toast-autor__pildora--icono-solo" href="https://www.instagram.com/s_escobar__/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Santiago Escobar (@s_escobar__)" title="Instagram @s_escobar__">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          <a class="toast-autor__pildora toast-autor__pildora--correo toast-autor__pildora--icono-solo" href="mailto:saescobara@unal.edu.co" aria-label="Correo institucional de Santiago Escobar (saescobara@unal.edu.co)" title="Correo saescobara@unal.edu.co">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </a>
        </div>

        <button class="toast-autor__btn-ok" id="toast-autor-ok" type="button">¡ENTENDIDO!</button>
      </div>
    </div>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('is-visible');
  }, 800);

  function cerrarToast() {
    toast.classList.remove('is-visible');
    toast.classList.add('is-hiding');
    sessionStorage.setItem('mensaje_autor_cerrado', '1');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  $('#toast-autor-cerrar')?.addEventListener('click', cerrarToast);
  $('#toast-autor-ok')?.addEventListener('click', cerrarToast);
}

pintarBarra();
pintarPie();
mostrarMensajeAutor();
