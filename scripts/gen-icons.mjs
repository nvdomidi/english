// Rasterizes the brand SVG into the PNG icons the PWA manifest references.
// Run: node scripts/gen-icons.mjs   (needs sharp installed)
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, '..', 'public');
const std = readFileSync(join(here, 'icon.svg'));
const mask = readFileSync(join(here, 'icon-maskable.svg'));

const jobs = [
  { src: std, size: 192, out: 'pwa-192x192.png' },
  { src: std, size: 512, out: 'pwa-512x512.png' },
  { src: mask, size: 512, out: 'pwa-maskable-512x512.png' },
  // iOS home-screen icon: must be opaque, no alpha, no rounded corners.
  { src: std, size: 180, out: 'apple-touch-icon.png', flatten: true },
  { src: std, size: 32, out: 'favicon-32x32.png' },
];

for (const { src, size, out, flatten } of jobs) {
  let img = sharp(src).resize(size, size);
  if (flatten) img = img.flatten({ background: '#6a4cff' });
  await img.png().toFile(join(pub, out));
  console.log('wrote', out);
}
