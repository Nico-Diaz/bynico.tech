# bynico.tech · web

Página de bynico.tech: webs y automatizaciones para pymes y emprendedores. Es el destino de todos los enlaces de Instagram (@bynico.tech).

- Sitio estático sin build: `index.html`, `css/site.css`, `js/site.js`.
- Marca: rebrand 2026 del kit en `masters/kitMarca/rebrand` (paleta 16A "Orquídea de noche", logo 29A "b.", Outfit + Inter + JetBrains Mono).
- Diseño: concepto **35A "Bento nocturno"**. Una sola rejilla bento (`.bento`, `grid-template-areas`) de 4 columnas en escritorio y 2 en tableta y móvil. Cada sección es una celda (`.cell` + tono `tone-plum` / `tone-cream` / `tone-orchid` / `tone-lime`).
- El símbolo "b." está en un `<symbol id="b">` dentro de `index.html`. El trazo usa `currentColor` y el punto `--dot`.
- `npm run assets` regenera favicons (+ `.ico`), el manifest y `og.jpg` desde el kit. Las capturas WebP de proyectos están en `assets/img/`.
- `npm run dev` sirve la web en local.
- Deploy: Vercel (`vercel.json`), dominio `bynico.tech`.
