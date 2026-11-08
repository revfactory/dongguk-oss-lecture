// 덱 점검 도구: 최종 화면에서 작은 글자, 화면 밖으로 나간 글자, 잘린 글자, 서로 겹친 글자를 찾는다.
//   node tools/audit.mjs --dir deck [--min 22] [--match p1c,p1d]
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';
const require = createRequire(process.env.HOME + '/.claude/skills/showreel/scripts/package.json');
const { chromium } = require('playwright-core');

const A = process.argv.slice(2); const arg = (k, d) => { const i = A.indexOf('--' + k); return i >= 0 ? A[i + 1] : d; };
const dir = path.resolve(arg('dir', '.'));
const MIN = parseFloat(arg('min', '22'));
const match = arg('match');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
let browser;
for (const t of [{ channel: 'chrome' }, {}]) { try { browser = await chromium.launch({ headless: true, ...t }); break; } catch (e) { } }
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await page.goto(`http://127.0.0.1:${server.address().port}/index.html?capture`, { waitUntil: 'load' });
await page.waitForFunction(() => window.__deckReady === true, null, { timeout: 60000 });
const ids = await page.evaluate(() => DECK.slides.map(d => d.id || ''));
const list = ids.map((id, i) => i).filter(i => !match || match.split(',').some(m => ids[i].startsWith(m)));

let total = 0;
for (const i of list) {
  await page.evaluate(i => DECK.show(i, 99), i);
  const r = await page.evaluate(MIN => {
    const root = DECK.slides.find(d => d.el.classList.contains('on')).el;
    const vis = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < 0.05) return false; } return true; };
    const items = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const tn = walker.currentNode; const txt = tn.textContent.trim(); if (!txt) continue;
      const el = tn.parentElement; if (seen.has(el)) continue; seen.add(el);
      if (!vis(el)) continue;
      const range = document.createRange(); range.selectNodeContents(tn); const rb = range.getBoundingClientRect();
      if (rb.width < 1 || rb.height < 1) continue;
      let fs = parseFloat(getComputedStyle(el).fontSize);
      if (el instanceof SVGElement) { const m = el.getScreenCTM(); if (m) fs *= Math.hypot(m.a, m.b); }
      else { const b = el.getBoundingClientRect(); if (el.offsetHeight > 0 && b.height > 0) fs *= b.height / el.offsetHeight; else if (el.offsetWidth > 0) fs *= b.width / el.offsetWidth; }
      items.push({ el, txt: txt.slice(0, 40), fs: Math.round(fs * 10) / 10, x: rb.left, y: rb.top, w: rb.width, h: rb.height });
    }
    const out = { small: [], off: [], clip: [], overlap: [] };
    for (const it of items) {
      if (it.fs < MIN) out.small.push(`${it.fs}px "${it.txt}"`);
      if (it.x < -2 || it.y < -2 || it.x + it.w > 1922 || it.y + it.h > 1082) out.off.push(`"${it.txt}" @${Math.round(it.x)},${Math.round(it.y)} ${Math.round(it.w)}×${Math.round(it.h)}`);
      for (let e = it.el; e && e !== root; e = e.parentElement) {
        const c = getComputedStyle(e);
        if ((c.overflow !== 'visible' || c.overflowX !== 'visible') && !(e instanceof SVGElement)) {
          const b = e.getBoundingClientRect();
          if (it.x + it.w > b.right + 2 || it.y + it.h > b.bottom + 2 || it.x < b.left - 2) { out.clip.push(`"${it.txt}" 잘림(${e.className || e.tagName})`); }
          break;
        }
      }
    }
    for (let a = 0; a < items.length; a++) for (let b = a + 1; b < items.length; b++) {
      const p = items[a], q = items[b];
      if (p.el.contains(q.el) || q.el.contains(p.el)) continue;
      const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y);
      if (ix > 4 && iy > 4 && ix * iy > 0.15 * Math.min(p.w * p.h, q.w * q.h)) out.overlap.push(`"${p.txt}" ↔ "${q.txt}"`);
    }
    return out;
  }, MIN);
  const n = r.small.length + r.off.length + r.clip.length + r.overlap.length;
  if (!n) continue;
  total += n;
  console.log(`\n[${i + 1}] ${ids[i]}`);
  if (r.small.length) console.log('  작은 글자: ' + r.small.join(' | '));
  if (r.off.length) console.log('  화면 밖: ' + r.off.join(' | '));
  if (r.clip.length) console.log('  잘림: ' + r.clip.join(' | '));
  if (r.overlap.length) console.log('  겹침: ' + r.overlap.join(' | '));
}
console.log(`\n점검 ${list.length}장, 항목 ${total}개`);
await browser.close(); server.close();
