// Generates all app icons + Play Store art from inline SVG using sharp.
// Run: node scripts/gen-assets.mjs
import sharp from 'sharp';
import { mkdirSync } from 'fs';

const C = {
  bg: '#1c1410',
  bgCard: '#2a1e16',
  amber: '#d99748',
  amberDeep: '#a5652a',
  tea: '#c07a35',
  teaDark: '#8a5a2b',
  cream: '#f4e9dd',
};

// The chai glass mark. Centered in a 1024 box, scaled via `s` around (512,512).
function glass(s = 1, cx = 512, cy = 532) {
  return `
  <g transform="translate(${cx} ${cy}) scale(${s}) translate(-512 -532)">
    <!-- steam -->
    <g fill="none" stroke="${C.cream}" stroke-width="26" stroke-linecap="round" opacity="0.85">
      <path d="M448 240 C 428 208, 452 184, 440 152"/>
      <path d="M524 228 C 504 192, 532 168, 518 128"/>
      <path d="M596 244 C 580 214, 602 190, 592 160"/>
    </g>
    <!-- glass body (tapered cutting-chai glass) -->
    <path d="M368 312 L 656 312 L 622 792 Q 620 820 590 820 L 434 820 Q 404 820 402 792 Z"
          fill="#3d2b1d" stroke="${C.amber}" stroke-width="18"/>
    <!-- tea fill -->
    <path d="M388 396 L 636 396 L 610 780 Q 609 796 590 796 L 434 796 Q 415 796 414 780 Z"
          fill="${C.tea}"/>
    <path d="M388 396 L 636 396 L 630 490 L 394 490 Z" fill="${C.amber}" opacity="0.85"/>
    <!-- glass shine -->
    <path d="M420 340 L 448 340 L 432 780 L 418 780 Z" fill="#ffffff" opacity="0.18"/>
    <!-- rim highlight -->
    <path d="M368 312 L 656 312 L 651 348 L 372 348 Z" fill="#ffffff" opacity="0.12"/>
  </g>`;
}

const roundedBg = `
  <defs>
    <radialGradient id="warm" cx="50%" cy="42%" r="72%">
      <stop offset="0%" stop-color="#43301f"/>
      <stop offset="55%" stop-color="${C.bgCard}"/>
      <stop offset="100%" stop-color="${C.bg}"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#warm)"/>`;

const icons = {
  // Main app icon: full-bleed square (stores round the corners themselves)
  'assets/icon.png': {
    w: 1024, h: 1024,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      ${roundedBg}${glass(1.02)}</svg>`,
  },
  // Adaptive foreground: transparent bg, mark inside the ~66% safe zone
  'assets/android-icon-foreground.png': {
    w: 1024, h: 1024,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      ${glass(0.62)}</svg>`,
  },
  // Adaptive background: warm gradient
  'assets/android-icon-background.png': {
    w: 1024, h: 1024,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      ${roundedBg}</svg>`,
  },
  // Monochrome (themed icons): white silhouette
  'assets/android-icon-monochrome.png': {
    w: 1024, h: 1024,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      <g transform="translate(512 532) scale(0.62) translate(-512 -532)">
        <g fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round">
          <path d="M448 240 C 428 208, 452 184, 440 152"/>
          <path d="M524 228 C 504 192, 532 168, 518 128"/>
          <path d="M596 244 C 580 214, 602 190, 592 160"/>
        </g>
        <path d="M368 312 L 656 312 L 622 792 Q 620 820 590 820 L 434 820 Q 404 820 402 792 Z" fill="#ffffff"/>
      </g></svg>`,
  },
  // Splash icon: mark on transparency (bg color comes from app.json)
  'assets/splash-icon.png': {
    w: 1024, h: 1024,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      ${glass(0.8)}</svg>`,
  },
  'assets/favicon.png': {
    w: 48, h: 48,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
      ${roundedBg}${glass(1.05)}</svg>`,
  },
  // Play Store feature graphic (1024x500)
  'store/feature-graphic.png': {
    w: 1024, h: 500,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
      <defs>
        <radialGradient id="warm2" cx="28%" cy="45%" r="85%">
          <stop offset="0%" stop-color="#43301f"/>
          <stop offset="55%" stop-color="${C.bgCard}"/>
          <stop offset="100%" stop-color="${C.bg}"/>
        </radialGradient>
      </defs>
      <rect width="1024" height="500" fill="url(#warm2)"/>
      <g transform="translate(165 250) scale(0.42) translate(-512 -532)">${glass(1)}</g>
      <text x="330" y="232" font-family="Helvetica, Arial, sans-serif" font-size="62"
            font-weight="bold" fill="${C.cream}">Chai Tapri Tycoon</text>
      <text x="333" y="292" font-family="Helvetica, Arial, sans-serif" font-size="27"
            fill="${C.amber}">Merge stalls · Serve customers · Build your empire</text>
    </svg>`,
  },
};

mkdirSync('store', { recursive: true });
for (const [file, { w, h, svg }] of Object.entries(icons)) {
  await sharp(Buffer.from(svg)).resize(w, h).png().toFile(file);
  console.log('wrote', file);
}
