# Guía para trabajar en este proyecto

## Contexto y arquitectura
- Este proyecto es una aplicación web para: Gestionar tareas de un estudiante.
- Lee el README, [docs/architecture.md](docs/architecture.md) y el código relacionado antes de cambiar algo.
- Actualiza la arquitectura si cambias la organización o las responsabilidades del sistema.

## Tecnologías a usar
- TypeScript con modo estricto, React y Next.js con App Router.
- Tailwind CSS para los estilos.
- npm como gestor de dependencias; conserva `package-lock.json`.
- Usa las versiones declaradas en `package.json` y el archivo de bloqueo. No actualices versiones principales ni agregues tecnologías sin consultar.
- Almacenamiento: sin base de datos por defecto. Define la persistencia en la arquitectura antes de incorporarla.
- Si adoptas esta guía en un proyecto existente, ajusta el gestor y las convenciones a su configuración real.

## Estándares de código
- Usa componentes y tipos con nombres en PascalCase; funciones y variables en camelCase.
- Define tipos para las props; evita `any` y reutiliza los tipos del dominio.
- Mantén los componentes pequeños y separa la lógica de negocio de la presentación.
- Usa Server Components por defecto. Añade `"use client"` solo cuando necesites estado, eventos o APIs del navegador.
- Mantén secretos y acceso a datos privados en el servidor; no los expongas mediante variables `NEXT_PUBLIC_*`.
- Usa HTML semántico, etiquetas en formularios y estados de foco visibles.
- Usa clases completas de Tailwind: evita construirlas como `bg-${color}-500`; mapea variantes a clases literales.
- Reutiliza los colores, espacios y estilos definidos en el proyecto; conserva su configuración de Tailwind.
- Valida entradas en el servidor para operaciones del servidor y muestra errores comprensibles al usuario.
- Al cambiar comportamiento, agrega o ajusta pruebas si el proyecto ya tiene una suite.

## Cómo trabajar
1. Haz cambios pequeños y sigue las convenciones existentes.
2. Evita dependencias nuevas si lo disponible resuelve la tarea.
3. Revisa los scripts de `package.json`: ejecuta los de lint, pruebas y compilación que existan. No inventes comandos ni resultados.
4. Para cambios visuales, verifica la pantalla en móvil y escritorio, incluidos carga, error y vacío cuando apliquen.
5. Explica qué cambiaste, cómo lo verificaste y qué quedó pendiente.

## Límites
- Pide confirmación antes de borrar datos o modificar producción.
- No incluyas contraseñas ni claves en el código o en tus respuestas.
- Si no pudiste ejecutar una verificación, dilo.
