# Arquitectura: Next.js y Tailwind CSS

Esta es la estructura propuesta para una aplicación pequeña con App Router.
Adapta las rutas al proyecto real y mantén el documento actualizado.

## Organización

| Ruta | Responsabilidad |
| --- | --- |
| `src/app/layout.tsx` | Layout raíz y carga del CSS global. |
| `src/app/page.tsx` | Página de inicio. Cada ruta adicional vive en su carpeta dentro de `app/`. |
| `src/app/globals.css` | Entrada de Tailwind y estilos globales del proyecto. |
| `src/components/` | Componentes de interfaz reutilizables. |
| `src/lib/` | Lógica del dominio, utilidades y acceso a datos del servidor, separados por responsabilidad. |
| `public/` | Imágenes y otros archivos públicos. |

Si el proyecto usa `app/` en la raíz, conserva esa estructura; no lo muevas
a `src/` solo para coincidir con esta guía. Crea carpetas cuando las necesites.

## Flujo principal

1. Next.js resuelve la URL y renderiza el layout y la página correspondientes.
2. Los Server Components obtienen los datos necesarios del servidor, si los hay.
3. Los Client Components manejan las interacciones que requieren el navegador.
4. Tailwind aplica los estilos a partir de las clases usadas en los componentes.

Ejemplo: una página de catálogo obtiene los productos en el servidor y pasa
datos serializables a un componente cliente que permite filtrarlos.

## Límites entre partes

- Las páginas componen la vista; la lógica de negocio reutilizable vive en `src/lib/`.
- Los módulos que leen secretos o datos privados son exclusivos del servidor.
  Protégelos con `server-only` cuando corresponda; no los importes desde componentes cliente.
- Las props que cruzan del servidor al cliente deben ser serializables por React.
- Añade Route Handlers o Server Actions solo cuando necesites endpoints o mutaciones;
  valida entradas y permisos en el servidor.
- No hay persistencia definida inicialmente. Si la aplicación guarda datos,
  documenta aquí el almacenamiento y su flujo antes de implementarlos.

## Decisiones y motivos

- App Router permite organizar las rutas con sus layouts y páginas.
- Server Components por defecto mantienen la obtención de datos en el servidor
  y reservan el JavaScript del cliente para la interacción necesaria.
- Tailwind concentra los estilos habituales en clases de utilidad; las reglas
  globales y los valores compartidos viven en la configuración CSS del proyecto.
- No se incluyen bibliotecas de estado, componentes ni base de datos hasta que
  haya una necesidad concreta.
