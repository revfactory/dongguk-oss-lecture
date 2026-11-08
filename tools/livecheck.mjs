// 발표 모드 점검: 실제 키 입력으로 처음부터 끝까지 넘겨 보고 오류·쪽 수·단계 수를 확인한다.
//   node tools/livecheck.mjs --dir deck
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';
const require = createRequire(process.env.HOME + '/.claude/skills/showreel/scripts/package.json');
const { chromium } = require('playwright-core');

const A = process.argv.slice(2); const arg = (k, d) => { const i = A.indexOf('--' + k); return i >= 0 ? A[i + 1] : d; };
const dir = path.resolve(arg('dir', '.'));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
let browser;
for (const t of [{ channel: 'chrome' }, {}]) { try { browser = await chromium.launch({ headless: true, ...t }); break; } catch (e) { } }
const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: 'load' });
await page.waitForTimeout(800);
const total = await page.evaluate(() => DECK.slides.length);
const steps = await page.evaluate(() => DECK.slides.reduce((a, d) => a + (d.steps || 0), 0));
let presses = 0; let lastHash = '';
for (let k = 0; k < total + steps + 5; k++) {
  await page.keyboard.press('ArrowRight'); presses++;
  await page.waitForTimeout(60);
  lastHash = await page.evaluate(() => location.hash);
  if (lastHash === '#' + total) { await page.waitForTimeout(300); break; }
}
const endHash = lastHash;
// 되돌아가기·번호 이동·목차 열고 닫기
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(200);
const backHash = await page.evaluate(() => location.hash);
for (const c of '42') await page.keyboard.press(c); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
const jumpHash = await page.evaluate(() => location.hash);
await page.keyboard.press('o'); await page.waitForTimeout(200); await page.keyboard.press('o');
await page.keyboard.press('Home'); await page.waitForTimeout(200);
const homeHash = await page.evaluate(() => location.hash);
console.log(`쪽 ${total}, 클릭 단계 ${steps}, 끝까지 키 ${presses}번(예상 ${total - 1 + steps})`);
console.log(`마지막 ${endHash}, ← 뒤 ${backHash}, 42 Enter 뒤 ${jumpHash}, Home 뒤 ${homeHash}`);
console.log(errors.length ? '오류:\n  ' + [...new Set(errors)].join('\n  ') : '콘솔 오류 없음');
await browser.close(); server.close();
