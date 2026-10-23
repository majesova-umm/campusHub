# Harness mínimo para Next.js y Tailwind CSS

Variante documental del [harness mínimo](../minimal/README.md), preparada para
TypeScript, React, Next.js con App Router y Tailwind CSS. Contiene instrucciones
para el asistente y una propuesta de arquitectura; no incluye una aplicación.

## Cómo usarlo

1. Copia `AGENTS.md` a la raíz de tu aplicación y `docs/architecture.md` a su
   carpeta `docs/`. Si ya existen, fusiona el contenido manualmente.
2. Completa el propósito del proyecto y ajusta la arquitectura a sus rutas reales.
3. Confirma las versiones, el gestor de dependencias y los scripts en `package.json`.
   La guía propone npm; adáptala si el proyecto ya usa otro gestor.
4. Pide una tarea pequeña y revisa tanto el resultado como las verificaciones.

El instalador de la raíz sigue usando `template/`; esta variante se copia manualmente.

## Ejercicio

Pide: «Crea una página de catálogo con tarjetas y un filtro por nombre.
Usa datos de ejemplo, sigue `AGENTS.md` y conserva la obtención de datos en el
servidor. Lleva al cliente solo la interacción del filtro».

Comprueba que el filtro funciona, que el contenido se adapta a móvil y que
el asistente reporta las verificaciones que realmente pudo ejecutar.

## Referencias

- [Instalación de Next.js](https://nextjs.org/docs/app/getting-started/installation).
- [Server y Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
- [Tailwind CSS con Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

Consulta la guía correspondiente a la versión instalada antes de cambiar
la configuración; la integración de Tailwind varía entre versiones principales.
