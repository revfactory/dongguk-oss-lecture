// 덱 캡처·PDF 도구.
//   node tools/shoot.mjs --dir deck --out qa/shots [--slides 1-10,15] [--times 0.35,99] [--scale 0.5]
//   node tools/shoot.mjs --dir deck --out qa/k0 --stepped --step 0   (단계가 있는 장의 첫 상태)
//   node tools/shoot.mjs --dir deck --pdf out/deck.pdf
// 로컬 HTTP 서버로 덱 폴더를 열고(폰트·이미지 로딩이 file:// 정책에 기대지 않게), 시스템 Chrome 으로 그린다.
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';
const require = createRequire(process.env.HOME + '/.claude/skills/showreel/scripts/package.json');
const { chromium } = require('playwright-core');

const A = process.argv.slice(2); const arg = (k, d) => { const i = A.indexOf('--' + k); return i >= 0 ? A[i + 1] : d; };
const dir = path.resolve(arg('dir', '.'));
const out = arg('out'); const pdf = arg('pdf');
const scale = parseFloat(arg('scale', '0.5'));
const times = arg('times', '99').split(',').map(Number);
const sel = arg('slides', 'all');
const match = arg('match');
const stpArg = arg('step'); // 단계 수를 지정하면 그 단계까지만 보인 상태로 그린다(예: --step 0)
const stepped = A.includes('--stepped'); // 단계가 있는 장만 고른다

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/index.html`;

let browser;
for (const t of [{ channel: 'chrome' }, {}]) { try { browser = await chromium.launch({ headless: true, ...t }); break; } catch (e) { } }
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: pdf ? 1 : scale });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));

if (pdf) {
  await page.goto(base + '?print', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__deckReady === true, null, { timeout: 120000 });
  await page.waitForTimeout(500);
  await page.pdf({ path: pdf, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  console.log('PDF:', pdf);
} else {
  fs.mkdirSync(out, { recursive: true });
  await page.goto(base + '?capture', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__deckReady === true, null, { timeout: 60000 });
  await page.evaluate(() => Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))));
  const n = await page.evaluate(() => DECK.slides.length);
  let list = [];
  if (match) { const ids = await page.evaluate(() => DECK.slides.map(d => d.id || '')); ids.forEach((id, i) => { if (match.split(',').some(m => id.startsWith(m))) list.push(i); }); }
  else if (sel === 'all') list = [...Array(n).keys()];
  else sel.split(',').forEach(tok => { const [a, b] = tok.split('-').map(Number); for (let i = a; i <= (b || a); i++) list.push(i - 1); });
  if (stepped) { const st = await page.evaluate(() => DECK.slides.map(d => d.steps || 0)); list = list.filter(i => st[i] > 0); }
  for (const i of list) {
    for (const t of times) {
      const info = await page.evaluate(([i, t, k]) => DECK.show(i, t, k), [i, t, stpArg == null ? null : Number(stpArg)]);
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const f = path.join(out, `s${String(i + 1).padStart(3, '0')}_${(info.id || '').replace(/[^a-z0-9_-]/gi, '')}${stpArg == null ? '' : '_k' + stpArg}_${t === 99 ? 'end' : 't' + String(t).replace('.', '_')}.png`);
      await page.screenshot({ path: f });
    }
  }
  console.log(`캡처 ${list.length}장 × ${times.length}시각 → ${out} (전체 ${n}장)`);
}
if (errors.length) { console.log('콘솔 오류/경고:'); [...new Set(errors)].slice(0, 30).forEach(e => console.log('  ' + e)); }
await browser.close(); server.close();
