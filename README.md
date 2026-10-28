# Campus Hub

Panel académico con React, Next.js App Router, TypeScript estricto y Tailwind CSS.
Conserva el diseño de Figma, la fuente Fira Sans local y los SVG originales.

## Ejecutar

Requiere Node.js 22.18+ y npm. Esta versión mínima permite ejecutar las pruebas
sobre TypeScript sin instalar otro ejecutor.

```sh
npm ci
npm run dev
```

Abre http://127.0.0.1:5173. Se conserva el origen anterior para mantener el acceso
a las tareas de localStorage. No cambies a localhost si quieres usar esos mismos datos.

Para producción local:

```sh
npm run build
npm start
```

## Organización y arnés

[AGENTS.md](AGENTS.md) define las convenciones. [docs/architecture.md](docs/architecture.md)
documenta componentes de servidor y cliente, hidratación, tipos y persistencia.

- `src/app/`: layout, página y tema Tailwind.
- `src/components/`: interfaz tipada; DashboardClient coordina la interacción.
- `src/hooks/useTasks.ts`: estado y ciclo de persistencia.
- `src/lib/`: dominio y adaptador de localStorage.
- `src/data/`: ejemplos iniciales.
- `public/assets/`: SVG locales.

## Comportamiento

El botón Agregar tarea y Enter crean tareas pendientes, actualizan el contador y
conservan los datos al recargar cuando localStorage está disponible. El formulario
rechaza títulos vacíos. El buscador filtra títulos y materias. Las tareas nuevas
no tienen materia ni fecha asignadas.

No hay backend ni base de datos. Los indicadores académicos y las actividades son
ejemplos. Inicio enlaza a `/` y Tareas abre la gestión en `/tareas`; Calendario abre `/calendario`; los demás destinos no tienen vistas
definidas. La migración no agrega pantallas ni elementos visuales.

## Verificación

```sh
npm run typecheck
npm test
npm run build
```

Con el servidor activo y Google Chrome instalado:

```sh
npm run test:smoke
```

La prueba usa BASE_URL si está definido; de lo contrario, http://127.0.0.1:5173.
Verifica cinco anchos, imágenes, creación, búsqueda, persistencia, almacenamiento
corrupto y lista vacía. Las capturas se guardan en el directorio temporal del sistema.
No hay script de lint configurado.

Compara manualmente 1440 × 1024 y 390 × 844 con Figma y prueba títulos largos,
navegación con Tab y acceso a todas las tareas desde móvil.

## Gestión de tareas

Las tarjetas permiten editar el título y seleccionar Pendiente, En progreso o
Completada. El contador incluye pendientes y tareas en progreso. La eliminación
requiere confirmación explícita en la tarjeta y puede cancelarse. Las operaciones
conservan materia, fecha, urgencia e identificador de las tareas existentes.
`src/lib/tasks.ts` valida y aplica cambios de forma inmutable; `useTasks` coordina
creación, edición, eliminación y persistencia con la misma clave localStorage.
Durante la hidratación se muestra carga y se desactiva la creación. La lista
vacía y las búsquedas sin resultados muestran mensajes específicos.

## Calendario

El menú Calendario abre una vista mensual con navegación entre meses y acceso a
Hoy. Selecciona un día para ver o crear tareas con fecha de entrega. Puedes
programar tareas sin fecha y cambiar o quitar una fecha existente. Los textos
antiguos como “En 2 días” se conservan sin asignarles una fecha inventada.
