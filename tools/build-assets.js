// Prepara los assets de la web a partir del kit de marca:
// favicons, logo, capturas de proyectos (WebP) e imagen OG (1200×630).
// Uso: npm run assets
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');

const KIT = 'C:/Users/ndiaz/Documents/workspace/GitHub/masters/kitMarca';
const WEB = path.resolve(__dirname, '..');
const IMG = `${WEB}/assets/img`;
const FONTS = `${KIT}/tipografia/fuentes/estaticas`;
const CAPT = `${KIT}/redes/instagram/proyectos/capturas`;

fs.mkdirSync(IMG, { recursive: true });

// 1. Favicons → raíz de la web
const FAV = `${KIT}/aplicaciones/favicon`;
for (const f of fs.readdirSync(FAV)) {
  if (f === 'head.html') continue;
  fs.copyFileSync(`${FAV}/${f}`, `${WEB}/${f}`);
}

// 2. Logo
fs.copyFileSync(`${KIT}/logo/horizontal/bynico-logo-horizontal-sobre-oscuro.svg`, `${IMG}/logo-oscuro.svg`);

(async () => {
  // 3. Capturas de proyectos
  for (const p of ['menui', 'almacen', 'mobula']) {
    await sharp(`${CAPT}/${p}-desk.png`).resize(1200).webp({ quality: 78 }).toFile(`${IMG}/${p}-desk.webp`);
    await sharp(`${CAPT}/${p}-movil.png`).resize(480).webp({ quality: 78 }).toFile(`${IMG}/${p}-movil.webp`);
  }

  // 4. Imagen OG
  const bodoni = "'Bodoni Moda 28pt', 'Bodoni Moda'";
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0F1B2D"/>
  <text x="1130" y="700" font-family="${bodoni}" font-style="italic" font-size="820" fill="#1A2940" text-anchor="end">n</text>
  <circle cx="1150" cy="640" r="40" fill="#1A2940"/>
  <text x="80" y="110" font-family="Manrope" font-weight="700" font-size="30" fill="#FAFAF7">bynico<tspan fill="#8FB39A">.</tspan><tspan font-family="JetBrains Mono" font-weight="400" fill="#8FB39A">tech</tspan></text>
  <text font-family="${bodoni}" font-size="88" fill="#FAFAF7">
    <tspan x="80" y="300">Webs que venden.</tspan>
    <tspan x="80" y="400" font-style="italic" fill="#D8C3A5">Procesos que se</tspan>
    <tspan x="80" y="500" font-style="italic" fill="#D8C3A5">hacen solos.</tspan>
  </text>
  <text x="80" y="570" font-family="Manrope" font-size="26" fill="#8A96A8">Webs y automatizaciones para pymes · en remoto</text>
</svg>`;
  const fontFiles = fs.readdirSync(FONTS).map((f) => `${FONTS}/${f}`);
  const png = new Resvg(og, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Manrope' } }).render().asPng();
  await sharp(png).jpeg({ quality: 88 }).toFile(`${WEB}/og.jpg`);

  console.log('Assets listos en', IMG);
})();
