# Ingeniería Química · UNAL Medellín

Sitio web oficial del programa de Ingeniería Química de la Facultad de Minas, Universidad Nacional de Colombia, Sede Medellín. Integra la paleta de identidad *"Vino, bosque y naranja"*, tipografías modernas (*Space Grotesk* + *Plus Jakarta Sans*), la malla curricular completa del **Plan 3525 (175 créditos)**, grupos y capítulos estudiantiles (AIChE, KIMERA, GRIEQUI, Semillero de Procesos y Bioprocesos), convenios, rutas intercampus e información general universitaria.

## Módulos del sitio

| Página | Contenido |
| --- | --- |
| `index.html` | Landing page con identidad visual propia de la carrera: simulador/telemetría de proceso químico interactivo, animaciones de reactores y columnas, hitos históricos (fundado en 1973, SNIES 123), evento destacado "Día del Ingeniero Químico & PROCESA", perfil del egresado y capítulo AIChE |
| `malla.html` | Malla curricular interactiva del Plan 3525 (175 créditos distribuidos en 10 semestres): prerrequisitos y dependencias coloreadas, banco de recursos drive y catálogo filtrado por componentes y agrupaciones |
| `intercampus.html` | Rutas intercampus (Robledo ➔ El Volador, El Volador ➔ Robledo, Río ➔ El Volador), cálculo de próxima salida en tiempo real, guía explicativa y láminas oficiales |
| `info.html` | Información general y guía estudiantil (P.A.P.A., bolsa de 175 créditos SIA, horas de corresponsabilidad, citas SIA, simulador interactivo y preguntas frecuentes) |
| `convenios.html` | Convenios de la UNAL (Kiro AWS, Coursera, MATLAB, Microsoft 365) y beneficios para estudiantes (Autodesk, GitHub, JetBrains, Spotify): lista interactiva con pasos de activación |

## Arquitectura de datos (`data/`)

Los datos viven en `data/` en formato JSON, completamente desacoplados de la lógica de presentación:

```
data/
  programa.json          Ficha del programa (175 créditos, Plan 3525), hitos y acreditación
  perfil.json            Perfil del ingeniero químico egresado (operaciones, reactores, termo, control)
  grupos.json            Capítulo AIChE, Grupo KIMERA, GRIEQUI y Semillero de Procesos
  intercampus.json       Rutas, franjas horarias y conexiones intercampus
  convenios/
    indice.json          Índice de convenios y software de ingeniería
    <id>.json            Pasos de activación para cada herramienta
  info.json              Guía estudiantil, PAPA, bolsa de 175 cr, corresponsabilidad, FAQs y glosario
  malla/
    componentes.json     Componentes (Fundamentación, Disciplinar, Libre Elección)
    plan.json            Organización por semestre del Plan 3525 (175 créditos totales)
    asignaturas.json     Catálogo completo: códigos, créditos, agrupación y prerrequisitos
```

## Representación y Desarrollo

- **Representante Estudiantil:** María José Collazos · Instagram [@majocollazoss](https://www.instagram.com/majocollazoss/) / [@repres_iq1](https://www.instagram.com/repres_iq1/)
- **Capítulo Estudiantil:** AIChE UNAL Medellín · [@aiche.unmed](https://www.instagram.com/aiche.unmed/)
- **Creación y Desarrollo Web:** Santiago Escobar Arias · Representante de Sistemas ([saescobara@unal.edu.co](mailto:saescobara@unal.edu.co)) · **Colaboración:** Angely Pérez Cardona ([@_angely_perez](https://www.instagram.com/_angely_perez/))

## Ver el sitio en local

Los datos se consultan asíncronamente con `fetch`, por lo que se recomienda usar un servidor local:

```bash
python -m http.server 8000
# Abrir en el navegador: http://localhost:8000
```
