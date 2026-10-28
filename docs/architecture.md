# Arquitectura de Campus Hub

Campus Hub gestiona tareas de estudiantes. Usa React 19, Next.js 16 con App Router,
TypeScript estricto, Tailwind CSS 4 y npm. Las versiones exactas están fijadas en
package-lock.json. Esta migración sustituye Vite y los contratos JSDoc por rutas
App Router y tipos TypeScript; no incorpora base de datos.

## Organización

| Ruta | Responsabilidad |
| --- | --- |
| `src/app/layout.tsx` | Layout de servidor, idioma, metadatos, fuentes locales y CSS global. |
| `src/app/tareas/page.tsx` | Página de servidor para la gestión de tareas; marca Tareas como destino activo. |
| `src/components/TasksClient.tsx` | Búsqueda y gestión de tareas en `/tareas`, reutilizando Tasks y useTasks. |
| `src/app/page.tsx` | Página de servidor: compone navegación, paneles estáticos y cliente interactivo. |
| `src/app/globals.css` | Tema Tailwind, tokens y clases de componentes con @apply; reglas específicas del diseño. |
| `src/components/DashboardClient.tsx` | Límite cliente: búsqueda, estado de tareas e indicadores dependientes del estado. |
| `src/components/PageHeader.tsx` | Campo de búsqueda controlado y saludo. |
| `src/components/TaskForm.tsx` | Estado local del formulario, validación y anuncio accesible. |
| `src/components/Tasks.tsx` | Panel y tarjetas de tareas con props tipadas. |
| `src/components/Navigation.tsx` | Navegación y perfil renderizados desde el servidor. |
| `src/components/Dashboard.tsx` | Indicadores y paneles visuales sin estado. |
| `src/components/Visuals.tsx` | Marca, SVG y estados con variantes literales. |
| `src/hooks/useTasks.ts` | Coordina estado cliente, hidratación y persistencia. |
| `src/lib/tasks.ts` | Task, TaskStatus y reglas de validación, creación, búsqueda y conteo. |
| `src/app/materias/page.tsx` | Página de servidor de Materias; marca Materias como destino activo. |
| `src/components/SubjectsClient.tsx` | Límite cliente de `/materias`: coordina useTasks y useSubjects. |
| `src/components/Subjects.tsx` | Formulario, tarjeta y selector de materia con props tipadas. |
| `src/hooks/useSubjects.ts` | Estado, hidratación y persistencia de materias; propaga renombrado y eliminación a las tareas. |
| `src/lib/subjects.ts` | Validación, combinación, resumen y asignación inmutable de materias. |
| `src/lib/subjectStorage.ts` | Adaptador de localStorage de materias tolerante a datos inválidos. |
| `src/lib/taskStorage.ts` | Adaptador de localStorage tolerante a datos inválidos o acceso bloqueado. |
| `src/data/initialTasks.ts` | Datos de ejemplo serializables enviados desde la página. |
| `public/assets/` | SVG originales de Figma. |
| `tests/tasks.test.mjs` | Pruebas de dominio y almacenamiento; Node ejecuta directamente los módulos TypeScript. |
| `tests/subjects.test.mjs` | Pruebas de dominio y almacenamiento de materias. |
| `tests/smoke.mjs` | Prueba Chrome de interfaz, persistencia y adaptación. |

## Servidor y cliente

Layout y página son Server Components. La página pasa datos serializables al
DashboardClient y los paneles de progreso y actividad como slots ReactNode. La
navegación y los paneles estáticos no requieren estado cliente. Los módulos
importados por DashboardClient forman parte de su árbol cliente; no se agrega
`use client` a cada componente de presentación. PageHeader y TaskForm declaran
su interactividad; useTasks solo se utiliza en el cliente.

No hay secretos, endpoints ni mutaciones del servidor. Si se introducen, deberán
validarse entradas y permisos en el servidor. Los tipos TypeScript no sustituyen
la validación de datos externos.

## Persistencia e hidratación

Se conserva la clave `campus-hub-tasks-v1`, sin migraciones ni borrado de tareas.
El servidor y el primer render cliente usan los mismos ejemplos. Tras hidratar,
useTasks recupera localStorage y activa isReady; solo entonces permite el efecto
de guardado. Esto evita divergencias de hidratación y sobrescribir datos guardados
con los ejemplos iniciales. La interfaz expone data-tasks-ready para las pruebas.

Los registros deben satisfacer Task y tener ids únicos. Una lista vacía es válida.
Ante datos ausentes, corruptos o storage bloqueado, se usan los ejemplos. Si falla
el guardado, la sesión sigue funcionando en memoria. No hay sincronización remota.

localStorage pertenece al origen del navegador. Se conserva 127.0.0.1:5173 para
que las tareas creadas con Vite sigan disponibles en ese mismo origen. Cambiar
host, puerto o protocolo implica otro almacenamiento local.

## Reglas y estilos

El dominio no depende de React ni del navegador. TaskForm valida el título y emite
onAdd; useTasks crea una tarea pendiente con UUID. Los títulos se recortan, admiten
hasta 200 caracteres y no pueden estar vacíos. No se inventan materia ni fecha.
El contador incluye todas las tareas no completadas, independientemente del filtro.

Tailwind se integra mediante @tailwindcss/postcss. El tema expone los colores CSS
existentes, las clases semánticas usan @apply y las reglas específicas conservan
las medidas originales. Se importan tema y utilidades sin Preflight para mantener
el reset existente y la geometría de los SVG. El estilo y los breakpoints de Figma
se conservan; no se añaden componentes visuales por la migración.

Mensajes, Ajustes y notificaciones continúan sin flujos
definidos. Progreso, fechas, promedio y actividades son ejemplos.

## Verificación

- `npm run typecheck`: TypeScript estricto.
- `npm test`: reglas y almacenamiento con node:test.
- `npm run build`: compilación y prerender de Next.js.
- `npm run test:smoke`: servidor activo, Chrome instalado; verifica anchos de 320,
  390, 768, 1024 y 1440 px, recursos, creación, búsqueda, persistencia, datos
  corruptos, estado vacío y ausencia de errores de ejecución o hidratación.

## Gestión de tareas

Las tarjetas permiten editar el título y seleccionar Pendiente, En progreso o
Completada. El contador incluye pendientes y tareas en progreso. La eliminación
requiere confirmación explícita en la tarjeta y puede cancelarse. Las operaciones
conservan materia, fecha, urgencia e identificador de las tareas existentes.
`src/lib/tasks.ts` valida y aplica cambios de forma inmutable; `useTasks` coordina
creación, edición, eliminación y persistencia con la misma clave localStorage.
Durante la hidratación se muestra carga y se desactiva la creación. La lista
vacía y las búsquedas sin resultados muestran mensajes específicos.

Inicio (`/`) y Tareas (`/tareas`) usan navegación por rutas. Navigation recibe
el destino activo desde la página de servidor. Ambas vistas comparten el mismo
adaptador de localStorage; cada entrada recupera las tareas tras hidratar.

## Calendario

`/calendario` es una página de servidor que compone Navigation y CalendarClient.
El cliente reutiliza useTasks y presenta un mes de lunes a domingo, navegación
entre meses, botón Hoy y entregas del día seleccionado. Permite crear tareas en
ese día, editar estado/título, eliminar con confirmación y cambiar o quitar fecha.
Las tareas sin fecha se pueden programar desde la misma pantalla.

Task incorpora `dueDate?: string` con formato YYYY-MM-DD validado como fecha real.
Se guarda con la clave existente, sin migrar ni borrar datos. `date` conserva los
textos antiguos; nunca se interpretan como fechas reales. Las tarjetas priorizan
dueDate cuando existe. `src/lib/calendar.ts` contiene validación y cuadrícula mensual;
scheduleTask aplica fechas de forma inmutable. El día actual se obtiene del
navegador después de hidratar, evitando diferencias con el servidor y cambios por UTC.

## Materias

`/materias` es una página de servidor que compone Navigation y SubjectsClient.
Permite crear, renombrar y eliminar materias, ver las tareas de cada una con su
total y pendientes, crear tareas dentro de la materia seleccionada y asignar,
cambiar o quitar la materia de cualquier tarea.

Task conserva `subject?: string`; no se migran tareas. Las materias creadas se
guardan en una clave nueva, `campus-hub-subjects-v1`, como lista de nombres únicos
(máximo 80 caracteres). La lista visible combina esa clave con las materias que
ya usan las tareas, de modo que los datos existentes aparecen sin migración y una
clave ausente o corrupta solo deja las materias derivadas de las tareas.
Los nombres duplicados se rechazan sin distinguir mayúsculas.

Renombrar una materia actualiza las tareas que la usan. Eliminarla requiere
confirmación y deja sus tareas sin materia; nunca borra tareas. useSubjects lee
storage tras hidratar y solo guarda cuando está listo, igual que useTasks.

Materias aparece en la navegación de escritorio. El diseño móvil no incluye su
icono, por lo que la barra inferior se conserva y `/tareas` enlaza a Materias.
