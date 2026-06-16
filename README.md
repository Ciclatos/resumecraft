# Carlos CV Builder

Proyecto web para generar versiones profesionales, editables y exportables a PDF del CV de Carlos Díaz.

## Rutas disponibles

- `/cv/base`: CV general para oportunidades de tecnología, IA, automatización, desarrollo web y contenidos digitales.
- `/cv/edteam`: CV adaptado a Asistente de Contenidos en EDteam.
- `/cv/walmart`: CV adaptado a Programador de Pedidos en Walmart.

## Correr el proyecto

```bash
npm install
npm run dev
```

Abre `http://localhost:3000/cv/base`.

## Editar datos base

La información general vive en:

```text
data/profile.ts
```

Ahí puedes actualizar nombre, contacto, enlaces, fotografía, formación e idiomas.

## Crear o editar variantes

Las variantes viven en:

```text
data/variants.ts
```

Para crear una nueva variante:

1. Duplica una entrada dentro del objeto `variants`.
2. Cambia el `slug`, `name`, `headline`, `summary`, `focus`, habilidades, herramientas, experiencia y proyectos.
3. Activa o desactiva el QR con `showQr: true` o `showQr: false`.
4. Entra a `/cv/nuevo-slug`.

## Exportar PDF

Cada CV tiene un botón `Descargar PDF`. El botón abre el diálogo de impresión del navegador.

Configuración recomendada para el resultado más fiel:

- Destino: `Guardar como PDF`.
- Tamaño de papel: `A4`.
- Escala: `90%` a `95%` si el navegador muestra un salto de página.
- Márgenes: `Ninguno`.
- Activar `Gráficos de fondo` para conservar la columna lateral, fondos e íconos.

También puedes usar `Cmd + P` en macOS o `Ctrl + P` en Windows/Linux.

Notas por variante:

- `/cv/walmart` está optimizada para una sola página en PDF.
- `/cv/edteam` usa una versión compacta en impresión y oculta contenido secundario.
- `/cv/base` intenta mantenerse en una página; conserva más proyectos que las variantes específicas.

La vista web puede mostrar más contenido que el PDF. En impresión, `styles/print.css` aplica una hoja A4 exacta, tipografías en puntos y reglas de compactación por variante para priorizar legibilidad.

## Desplegar en Vercel

1. Sube el repositorio a GitHub.
2. En Vercel, importa el repositorio.
3. Usa la configuración automática de Next.js.
4. Ejecuta el despliegue.

Comandos útiles:

```bash
npm run build
vercel --prod
```

## Estructura principal

```text
app/cv/[variant]/page.tsx
components/Resume.tsx
components/Sidebar.tsx
components/Section.tsx
components/QRCode.tsx
styles/print.css
data/profile.ts
data/variants.ts
```

El diseño usa HTML real, texto seleccionable, estilos responsive y reglas `@media print` para exportación limpia a PDF.
