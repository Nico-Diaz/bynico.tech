// Prepara los assets de la web a partir del kit de marca (rebrand 2026: paleta 16A, logo 29A, tipografía 30A):
// favicons (+ .ico), manifest e imagen OG (1200×630). Las capturas WebP de proyectos ya están en assets/img.
// Uso: npm run assets
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');

const KIT = 'C:/Users/ndiaz/Documents/workspace/GitHub/masters/kitMarca/rebrand';
const WEB = path.resolve(__dirname, '..');
const FAV = `${KIT}/logo/favicon`;
const FONTS = `${KIT}/tipografia/fuentes`;
const C = { berenjena: '#1A1023', ciruela: '#2C1C3A', crema: '#FBF5F0', orq: '#C15897', lavanda: '#B9A9C4', lima: '#D9F26B' };

// Logo 29A centrado en (x,y)
const simbolo = (x, y, s, fg, ac) => `<g transform="translate(${x} ${y}) scale(${s}) translate(-9 46)">
  <path d="M-140 -230 V130" stroke="${fg}" stroke-width="74" stroke-linecap="round"/>
  <circle cx="-40" cy="30" r="100" fill="none" stroke="${fg}" stroke-width="74"/>
  <circle cx="150" cy="128" r="46" fill="${ac}"/></g>`;

// ICO con imágenes PNG dentro (válido en todos los navegadores actuales)
function ico(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let off = head.length;
  pngs.forEach(({ size, buf }, i) => {
    const e = 6 + i * 16;
    head.writeUInt8(size >= 256 ? 0 : size, e); head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(buf.length, e + 8); head.writeUInt32LE(off, e + 12);
    off += buf.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => p.buf)]);
}

(async () => {
  // 1. Favicons del rebrand (símbolo 29A sobre berenjena)
  fs.copyFileSync(`${FAV}/favicon.svg`, `${WEB}/favicon.svg`);
  for (const s of [16, 32, 48]) fs.copyFileSync(`${FAV}/favicon-${s}.png`, `${WEB}/favicon-${s}.png`);
  fs.copyFileSync(`${FAV}/favicon-180.png`, `${WEB}/apple-touch-icon.png`);
  fs.copyFileSync(`${FAV}/favicon-192.png`, `${WEB}/icon-192.png`);
  fs.copyFileSync(`${FAV}/favicon-512.png`, `${WEB}/icon-512.png`);
  fs.writeFileSync(`${WEB}/favicon.ico`, ico([16, 32, 48].map((size) => ({ size, buf: fs.readFileSync(`${FAV}/favicon-${size}.png`) }))));

  // 2. Manifest
  const mf = JSON.parse(fs.readFileSync(`${WEB}/site.webmanifest`, 'utf8'));
  mf.theme_color = C.berenjena; mf.background_color = C.berenjena;
  fs.writeFileSync(`${WEB}/site.webmanifest`, JSON.stringify(mf, null, 2) + '\n');

  // 3. Imagen OG: celdas bento con el titular, la «b.» y el contacto
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.berenjena}"/>
  <rect x="40" y="40" width="760" height="550" rx="36" fill="${C.ciruela}"/>
  <rect x="824" y="40" width="336" height="300" rx="36" fill="${C.orq}"/>${simbolo(992, 180, 0.5, C.berenjena, C.crema)}
  <rect x="824" y="364" width="336" height="226" rx="36" fill="${C.lima}"/>
  <text x="864" y="452" font-family="Outfit" font-weight="700" font-size="44" fill="${C.berenjena}">Escríbeme</text>
  <text x="864" y="500" font-family="Inter" font-weight="500" font-size="22" fill="${C.berenjena}">Webs · software</text>
  <text x="864" y="530" font-family="Inter" font-weight="500" font-size="22" fill="${C.berenjena}">automatización · video</text>
  ${simbolo(96, 116, 0.11, C.crema, C.orq)}
  <text x="128" y="128" font-family="Outfit" font-weight="700" font-size="30" fill="${C.crema}">bynico<tspan fill="${C.orq}">.</tspan><tspan font-weight="400" fill="${C.lavanda}">tech</tspan></text>
  <text font-family="Outfit" font-weight="700" font-size="84" fill="${C.crema}" letter-spacing="-1.6">
    <tspan x="80" y="300">Ideas <tspan fill="${C.orq}">reales.</tspan></tspan>
    <tspan x="80" y="390">Soluciones</tspan>
    <tspan x="80" y="480"><tspan fill="${C.orq}">digitales.</tspan></tspan>
  </text>
  <text x="80" y="546" font-family="JetBrains Mono" font-weight="500" font-size="20" fill="${C.lavanda}" letter-spacing="4">TECNOLOGÍA CON CRITERIO.</text>
</svg>`;
  const fontFiles = fs.readdirSync(FONTS).filter((f) => f.endsWith('.ttf')).map((f) => `${FONTS}/${f}`);
  const png = new Resvg(og, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
  await sharp(png).jpeg({ quality: 88 }).toFile(`${WEB}/og.jpg`);

  console.log('Assets del rebrand listos');
})();
