/* DECK 엔진 — 1920×1080 모션 슬라이드.
 * 원칙(showreel 엔진과 같다): 화면은 시간 t의 순수 함수다. render(t, s)는 이전 프레임 상태에 기대지 않는다.
 * 그래서 캡처·PDF 에서 임의 시각(최종 상태)을 바로 그릴 수 있다.
 *
 * 슬라이드 정의
 *   DECK.slide({ id, part, chap, theme, title, notes, steps,
 *                build(el, A) { ... },      // DOM 만들기. A(el, preset, start, opts) 로 등장 애니메이션 등록
 *                render(t, s) { ... } })    // 선택: 계속 움직이는 요소. s.at(k) = k번째 단계 시작 후 경과 초(0 = 입장)
 *
 * 키: → Space PageDown Enter 클릭 = 다음(단계 → 슬라이드), ← PageUp = 이전, Home/End, 숫자+Enter = 이동,
 *     F 전체 화면, O 목차, N 발표자 메모, P 발표자 창, R 다시 재생, B 화면 가리기, H 하단 진행 표시 숨김
 * URL: #27 (27쪽), ?print (PDF 용 전체 나열), ?capture (캡처 도구가 DECK.show(i, t) 로 그림)
 */
(function () {
  'use strict';
  const W = 1920, H = 1080;
  const Q = new URLSearchParams(location.search);
  const MODE = Q.has('print') ? 'print' : Q.has('capture') ? 'capture' : 'live';
  const FINAL = 99;

  /* ---------- 수학·이징 ---------- */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
    const dx = t => (3 * ax * t + 2 * bx) * t + cx;
    return x => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = sx(t) - x; if (Math.abs(e) < 1e-5) break; const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
      return sy(clamp(t));
    };
  }
  const ease = {
    linear: x => x,
    inQuad: x => x * x, outQuad: x => 1 - (1 - x) * (1 - x),
    inOutQuad: x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    outCubic: x => 1 - Math.pow(1 - x, 3), inCubic: x => x * x * x,
    inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    outQuart: x => 1 - Math.pow(1 - x, 4), outQuint: x => 1 - Math.pow(1 - x, 5),
    outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x), inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
    inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
    outBack: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    outElastic: x => x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI / 3)) + 1,
    snap: bezier(0.16, 1, 0.3, 1),
    swift: bezier(0.83, 0, 0.17, 1),
    exit: bezier(0.7, 0, 0.84, 0),
    pop: bezier(0.34, 1.56, 0.64, 1),
    heavy: bezier(0.2, 1.25, 0.35, 1),
  };
  const prog = (t, start, dur, e = ease.snap) => e(clamp((t - start) / Math.max(1e-6, dur)));
  function kf(t, frames) {
    if (t <= frames[0][0]) return frames[0][1];
    for (let i = 1; i < frames.length; i++) {
      const [t1, v1, e] = frames[i], [t0, v0] = frames[i - 1];
      if (t <= t1) return lerp(v0, v1, (e || ease.inOutCubic)((t - t0) / (t1 - t0)));
    }
    return frames[frames.length - 1][1];
  }
  function spring(t, t0 = 0, f = 2.2, z = 0.42) {
    const x = t - t0; if (x <= 0) return 0;
    const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
  }
  const rand = (i, salt = 0) => { const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return x - Math.floor(x); };
  function noise(t, seed = 0) {
    const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
    return lerp(rand(i, seed) * 2 - 1, rand(i + 1, seed) * 2 - 1, u);
  }
  const stagger = (t, start, each, dur, i, e = ease.snap) => prog(t, start + i * each, dur, e);
  function count(p, to, o = {}) {
    const from = o.from || 0, d = o.decimals || 0, v = lerp(from, to, p);
    return v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  /* ---------- DOM ---------- */
  function css(el, o) { if (!el) return el; for (const k in o) { const v = o[k]; if (k.startsWith('--')) el.style.setProperty(k, v); else el.style[k] = v; } return el; }
  function h(tag, cls, parent, html) {
    const e = document.createElement(tag || 'div');
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  const SVGNS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  /* 글자 나누기: 어절은 줄바꿈이 어절 사이에서만 일어나도록 nowrap 묶음으로, 글자는 inline-block.
   * mask: 글자마다 overflow 를 가린 상자에 넣는다(받침·윗점 여백 포함). */
  function split(el, mode = 'char', o = {}) {
    const out = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            const word = document.createElement('span'); word.className = 'w';
            const units = mode === 'word' ? [tok] : [...tok];
            units.forEach(u => {
              const c = document.createElement('span'); c.className = 'ch'; c.textContent = u;
              if (o.mask) { const m = document.createElement('span'); m.className = 'mk'; m.appendChild(c); word.appendChild(m); }
              else word.appendChild(c);
              out.push(c);
            });
            frag.appendChild(word);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('nosplit')) walk(n);
      });
    };
    walk(el);
    return out;
  }

  /* ---------- 등장 프리셋: p(0→1) 에 따라 스타일 ---------- */
  const T3 = (x, y, sc = 1, r = 0) => `translate3d(${x}px,${y}px,0) scale(${sc}) rotate(${r}deg)`;
  const PRESET = {
    fade: (el, p) => css(el, { opacity: p }),
    up: (el, p, o) => css(el, { opacity: clamp(p * 1.6), transform: T3(0, (1 - p) * (o.d ?? 48)) }),
    down: (el, p, o) => css(el, { opacity: clamp(p * 1.6), transform: T3(0, -(1 - p) * (o.d ?? 48)) }),
    left: (el, p, o) => css(el, { opacity: clamp(p * 1.6), transform: T3((1 - p) * (o.d ?? 90), 0) }),   // 오른쪽에서 왼쪽으로 들어옴
    right: (el, p, o) => css(el, { opacity: clamp(p * 1.6), transform: T3(-(1 - p) * (o.d ?? 90), 0) }),
    upb: (el, p, o) => css(el, { opacity: clamp(p * 1.4), transform: T3(0, (1 - p) * (o.d ?? 70)), filter: p < 1 ? `blur(${(1 - p) * 10}px)` : 'none' }),
    pop: (el, p, o) => css(el, { opacity: clamp(p * 3), transform: T3(0, 0, lerp(o.from ?? .4, 1, p)) }),
    zoom: (el, p, o) => css(el, { opacity: clamp(p * 1.5), transform: T3(0, 0, lerp(o.from ?? 1.25, 1, p)), filter: p < 1 ? `blur(${(1 - p) * 14}px)` : 'none' }),
    slam: (el, p, o) => css(el, { opacity: clamp(p * 4), transform: T3(0, 0, lerp(o.from ?? 1.9, 1, p)), filter: p < 1 ? `blur(${(1 - p) * 22}px)` : 'none' }),
    wipe: (el, p, o) => { const d = o.dir || 'r'; const q = (1 - p) * 100;
      const ins = d === 'r' ? `inset(0 ${q}% 0 0)` : d === 'l' ? `inset(0 0 0 ${q}%)` : d === 'd' ? `inset(0 0 ${q}% 0)` : `inset(${q}% 0 0 0)`;
      css(el, { clipPath: p >= 1 ? 'none' : ins, opacity: p > 0 ? 1 : 0 }); },
    iris: (el, p) => css(el, { clipPath: p >= 1 ? 'none' : `circle(${p * 75}% at 50% 50%)`, opacity: p > 0 ? 1 : 0 }),
    flip: (el, p, o) => css(el, { opacity: clamp(p * 2), transform: `perspective(1200px) rotateX(${(1 - p) * (o.deg ?? -80)}deg)`, transformOrigin: o.origin || '50% 0%' }),
    flipY: (el, p, o) => css(el, { opacity: clamp(p * 2), transform: `perspective(1400px) rotateY(${(1 - p) * (o.deg ?? 70)}deg)`, transformOrigin: o.origin || '0% 50%' }),
    grow: (el, p, o) => css(el, { transform: o.axis === 'y' ? `scaleY(${p})` : `scaleX(${p})`, transformOrigin: o.origin || (o.axis === 'y' ? '50% 100%' : '0% 50%'), opacity: p > 0 ? 1 : 0 }),
    draw: (el, p) => { css(el, { strokeDasharray: '1 1', strokeDashoffset: 1 - p, opacity: p > 0 ? 1 : 0 }); },
    stamp: (el, p, o) => css(el, { opacity: clamp(p * 3), transform: T3(0, 0, lerp(o.from ?? 2.4, 1, p), (1 - p) * (o.r ?? -18)) }),
    tilt: (el, p, o) => css(el, { opacity: clamp(p * 2), transform: T3((1 - p) * (o.dx ?? 0), (1 - p) * (o.d ?? 120), 1, (1 - p) * (o.r ?? 8)) }),
    /* 글자 단위: el 은 split 된 컨테이너. o.each 간격, o.sub 하위 프리셋 */
    chars: (el, p, o, lt) => {
      const cs = el.__chars || (el.__chars = split(el, 'char', { mask: o.mask !== false }));
      const each = o.each ?? 0.035, dur = o.dur ?? 0.6;
      cs.forEach((c, i) => {
        const q = prog(lt, i * each, dur, o.ease || ease.snap);
        if (o.mask === false) css(c, { opacity: clamp(q * 2), transform: T3(0, (1 - q) * (o.d ?? 40), 1) });
        else css(c, { transform: T3(0, (1 - q) * 118, 1), opacity: q > 0 ? 1 : 0 });
      });
    },
    /* 단어 단위 무게 있는 착지(가변 굵기와 함께) */
    words: (el, p, o, lt) => {
      const ws = el.__words || (el.__words = split(el, 'word', { mask: false }));
      const each = o.each ?? 0.08, dur = o.dur ?? 0.7;
      ws.forEach((c, i) => {
        const q = prog(lt, i * each, dur, ease.snap);
        css(c, { opacity: clamp(q * 2), transform: T3(0, (1 - q) * (o.d ?? 36), 1), filter: q < 1 ? `blur(${(1 - q) * 6}px)` : 'none' });
      });
    },
    /* 타자: el.dataset.full 을 p 만큼 */
    type: (el, p, o, lt) => {
      if (el.__full == null) { el.__full = el.textContent; }
      const full = el.__full, n = Math.round(full.length * p);
      const typing = p > 0 && p < 1;
      el.textContent = full.slice(0, n);
      if (o.caret !== false && (typing || (p >= 1 && o.hold && Math.floor(lt * 2.2) % 2 === 0))) el.textContent += '▌';
      css(el, { opacity: p > 0 || o.show ? 1 : 0 });
    },
    count: (el, p, o) => { el.textContent = (o.prefix || '') + count(p, o.to, o) + (o.suffix || ''); },
    none: () => {},
  };

  /* ---------- 상태 ---------- */
  const slides = [];
  const parts = [];
  let cur = -1, step = 0, enterAt = 0, stepAt = [0], prev = -1, prevAt = 0, prevDir = 1;
  let root, stage, chrome, notesEl, overviewEl, blackEl, jumpBuf = '', jumpTimer = 0;
  const bc = ('BroadcastChannel' in window) ? new BroadcastChannel('deck-sync') : null;

  function slide(def) { def.index = slides.length; slides.push(def); return def; }
  function part(def) { parts.push(def); return def; }

  function build(def) {
    const el = h('section', 'slide theme-' + (def.theme || 'paper') + (def.cls ? ' ' + def.cls : ''), stage);
    el.dataset.id = def.id || ('s' + def.index);
    def.el = el; def.anims = [];
    const A = (target, preset, start = 0, o = {}) => {
      const list = Array.isArray(target) ? target : [target];
      list.forEach((t, i) => def.anims.push({ el: t, preset, start: start + (o.each && !['chars', 'words'].includes(preset) ? i * o.each : 0), o }));
      return list[0];
    };
    def.A = A;
    try { def.build && def.build.call(def, el, A); }
    catch (e) { console.error('[deck] build 실패', def.id, e); h('div', 'err', el, '슬라이드 오류: ' + def.id + ' — ' + e.message); }
  }

  function renderSlide(def, t, stp, stTimes) {
    const at = k => (k === 0 ? t : (k <= stp ? stTimes[k] : -1e9));
    const S = { step: stp, at, t, final: t >= FINAL - 1 };
    for (const a of def.anims) {
      const k = a.o.step || 0;
      const lt = at(k) - a.start;
      const dur = a.o.dur ?? (a.preset === 'type' ? Math.max(0.4, (a.el.__full ?? a.el.textContent).length * (a.o.cps ? 1 / a.o.cps : 0.028)) : 0.7);
      const p = prog(lt, 0, dur, a.o.ease || (a.preset === 'pop' || a.preset === 'stamp' ? ease.pop : a.preset === 'type' || a.preset === 'draw' || a.preset === 'count' ? (a.o.ease || ease.outCubic) : ease.snap));
      if (a.preset === 'type' && a.o.ease == null) { const pl = clamp(lt / dur); PRESET.type(a.el, pl, a.o, lt); continue; }
      (PRESET[a.preset] || PRESET.fade)(a.el, p, a.o, lt);
    }
    if (def.render) { try { def.render.call(def, t, S); } catch (e) { console.error('[deck] render 실패', def.id, e); } }
  }

  /* ---------- 하단 진행 표시(커밋 그래프) ---------- */
  function buildChrome() {
    chrome = h('div', 'chrome', stage);
    const svg = s('svg', { class: 'rail', viewBox: `0 0 ${W} 60`, width: W, height: 60 }, chrome);
    const x0 = 120, x1 = 1630, n = slides.length;
    const X = i => x0 + (x1 - x0) * (n > 1 ? i / (n - 1) : 0);
    s('line', { x1: x0, x2: x1, y1: 30, y2: 30, class: 'rail-main' }, svg);
    // Part 구간은 가지(위로 살짝 갈라졌다 합쳐짐)
    parts.forEach((p, k) => {
      const a = slides.findIndex(d => d.part === p.key), b = slides.length - 1 - [...slides].reverse().findIndex(d => d.part === p.key);
      if (a < 0) return;
      const xa = X(a), xb = X(b);
      s('path', { d: `M${xa - 10} 30 C ${xa} 30, ${xa} 14, ${xa + 14} 14 L ${xb - 14} 14 C ${xb} 14, ${xb} 30, ${xb + 10} 30`, class: 'rail-branch', style: `stroke:${p.color}` }, svg);
    });
    chrome.dots = slides.map((d, i) => {
      const pp = parts.find(p => p.key === d.part);
      const y = pp ? 14 : 30;
      return s('circle', { cx: X(i), cy: y, r: 2.6, class: 'rail-dot', style: pp ? `fill:${pp.color}` : '' }, svg);
    });
    chrome.cur = s('circle', { cx: 0, cy: 30, r: 9, class: 'rail-cur' }, svg);
    chrome.label = h('div', 'rail-label', chrome);
    chrome.num = h('div', 'rail-num', chrome);
    chrome.X = X;
  }
  function updateChrome() {
    if (!chrome) return;
    const d = slides[cur]; if (!d) return;
    const pp = parts.find(p => p.key === d.part);
    chrome.cur.setAttribute('cx', chrome.X(cur));
    chrome.cur.setAttribute('cy', pp ? 14 : 30);
    chrome.cur.style.stroke = pp ? pp.color : '';
    chrome.dots.forEach((c, i) => c.classList.toggle('done', i <= cur));
    chrome.label.textContent = (pp ? pp.label : '') + (d.chap ? (pp ? '  ·  ' : '') + d.chap : '');
    chrome.num.innerHTML = `<b>${String(cur + 1).padStart(3, '0')}</b> / ${String(slides.length).padStart(3, '0')}`;
    root.dataset.theme = d.theme || 'paper';
    chrome.style.display = d.noChrome ? 'none' : '';
  }

  /* ---------- 이동 ---------- */
  function now() { return performance.now() / 1000; }
  function go(i, o = {}) {
    i = clamp(i | 0, 0, slides.length - 1);
    if (i === cur && !o.force) return;
    const dir = i > cur ? 1 : -1;
    if (cur >= 0 && MODE === 'live' && !o.instant) { prev = cur; prevAt = now(); prevDir = dir; }
    cur = i;
    const d = slides[cur];
    const fin = o.final ?? (dir < 0);   // 뒤로 갈 때는 최종 상태로
    step = fin ? (d.steps || 0) : 0;
    enterAt = now() - (fin ? FINAL : 0);
    stepAt = [0]; for (let k = 1; k <= (d.steps || 0); k++) stepAt[k] = fin ? FINAL : -1e9;
    slides.forEach((sd, k) => { sd.el.classList.toggle('on', k === cur); sd.el.classList.toggle('off', k === prev && k !== cur); });
    if (MODE === 'live') { history.replaceState(null, '', '#' + (cur + 1)); }
    updateChrome(); updateNotes(); sync();
  }
  function next() {
    const d = slides[cur];
    if (step < (d.steps || 0)) { step++; stepAt[step] = now() - enterAt; sync(); updateNotes(); return; }
    go(cur + 1);
  }
  function back() { go(cur - 1); }
  function replay() { const d = slides[cur]; step = 0; enterAt = now(); stepAt = [0]; for (let k = 1; k <= (d.steps || 0); k++) stepAt[k] = -1e9; }

  function frame() {
    const t = now() - enterAt;
    const d = slides[cur];
    renderSlide(d, t, step, stepAt);
    // 전환: 들어오는 쪽은 짧게 떠오르고, 나가는 쪽은 진행 방향으로 밀리며 사라진다
    const tp = now() - prevAt;
    if (prev >= 0 && prev !== cur) {
      const pd = slides[prev];
      const e = prog(tp, 0, 0.42, ease.swift);
      if (e >= 1) { pd.el.classList.remove('off'); css(pd.el, { opacity: '', transform: '', clipPath: '' }); prev = -1; css(d.el, { opacity: '', transform: '', clipPath: '' }); }
      else {
        const sameTheme = (pd.theme || 'paper') === (d.theme || 'paper');
        if (sameTheme) {
          css(pd.el, { opacity: 1 - e, transform: `translate3d(${-prevDir * 120 * e}px,0,0)` });
          css(d.el, { opacity: clamp(e * 1.6), transform: `translate3d(${prevDir * 60 * (1 - e)}px,0,0)`, clipPath: 'none' });
        } else {
          // 바탕이 바뀌면 새 화면이 진행 방향에서 쓸고 들어온다
          css(pd.el, { opacity: 1, transform: `translate3d(${-prevDir * 240 * e}px,0,0)` });
          css(d.el, { opacity: 1, transform: 'none', clipPath: prevDir > 0 ? `inset(0 0 0 ${(1 - e) * 100}%)` : `inset(0 ${(1 - e) * 100}% 0 0)` });
        }
      }
    }
    if (MODE === 'live') requestAnimationFrame(frame);
  }

  /* ---------- 발표자 메모·목차·발표자 창 ---------- */
  function updateNotes() {
    if (!notesEl) return;
    const d = slides[cur], nx = slides[cur + 1];
    notesEl.innerHTML = `<div class="nt-h">${cur + 1}. ${d.title || ''}${d.steps ? ` <span>단계 ${step}/${d.steps}</span>` : ''}</div>` +
      `<div class="nt-b">${(d.notes || '').replace(/\n/g, '<br>')}</div>` +
      (nx ? `<div class="nt-n">다음 → ${cur + 2}. ${nx.title || ''}</div>` : '');
  }
  function buildOverview() {
    overviewEl = h('div', 'overview', document.body);
    const groups = [];
    slides.forEach((d, i) => {
      let g = groups[groups.length - 1];
      const key = (d.part || '') + '|' + (d.chap || '');
      if (!g || g.key !== key) { g = { key, part: d.part, chap: d.chap, items: [] }; groups.push(g); }
      g.items.push(i);
    });
    groups.forEach(g => {
      const pp = parts.find(p => p.key === g.part);
      const box = h('div', 'ov-g', overviewEl);
      h('div', 'ov-h', box, (pp ? pp.label : '오프닝·마무리') + (g.chap ? ' · ' + g.chap : '')).style.color = pp ? pp.color : '';
      g.items.forEach(i => {
        const it = h('button', 'ov-i', box, `<b>${i + 1}</b> ${slides[i].title || slides[i].id}`);
        it.onclick = () => { toggleOverview(false); go(i, { final: false }); };
      });
    });
  }
  function toggleOverview(v) { overviewEl.classList.toggle('show', v ?? !overviewEl.classList.contains('show')); }
  function sync() { if (bc && MODE === 'live') bc.postMessage({ type: 'state', i: cur, step, n: slides.length, title: slides[cur].title, notes: slides[cur].notes || '', steps: slides[cur].steps || 0, next: slides[cur + 1] ? slides[cur + 1].title : '' }); }

  /* ---------- 배치·입력 ---------- */
  function fit() {
    const k = Math.min(window.innerWidth / W, window.innerHeight / H);
    css(stage, { transform: `translate(-50%,-50%) scale(${k})` });
  }
  function keys(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (/^[0-9]$/.test(k)) { jumpBuf += k; clearTimeout(jumpTimer); jumpTimer = setTimeout(() => jumpBuf = '', 1500); return; }
    if (k === 'Enter' && jumpBuf) { go(parseInt(jumpBuf, 10) - 1, { final: false }); jumpBuf = ''; e.preventDefault(); return; }
    if (['ArrowRight', ' ', 'PageDown', 'Enter', 'ArrowDown'].includes(k)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'ArrowUp', 'Backspace'].includes(k)) { e.preventDefault(); back(); }
    else if (k === 'Home') go(0); else if (k === 'End') go(slides.length - 1);
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
    else if (k === 'o' || k === 'O' || k === 'Escape') toggleOverview(k === 'Escape' ? false : undefined);
    else if (k === 'n' || k === 'N') { notesEl.classList.toggle('show'); updateNotes(); }
    else if (k === 'r' || k === 'R') replay();
    else if (k === 'b' || k === 'B' || k === '.') blackEl.classList.toggle('show');
    else if (k === 'h' || k === 'H') root.classList.toggle('nochrome');
    else if (k === 'p' || k === 'P') { window.open('presenter.html', 'deck-presenter', 'width=1280,height=800'); setTimeout(sync, 800); }
  }

  /* ---------- 시작 ---------- */
  async function start() {
    root = document.getElementById('deck');
    root.classList.add('mode-' + MODE);
    if (MODE === 'print') {
      document.documentElement.classList.add('print');
      for (const d of slides) {
        const page = h('div', 'page', root);
        stage = h('div', 'stage', page);
        build(d);
        d.el.classList.add('on');
        const fin = Array.from({ length: (d.steps || 0) + 1 }, () => FINAL); fin[0] = 0;
        renderSlide(d, FINAL, d.steps || 0, fin);
        if (!d.noChrome) {
          const f = h('div', 'pfoot', stage);
          const pp = parts.find(p => p.key === d.part);
          f.innerHTML = `<span>${pp ? pp.label : ''}${d.chap ? (pp ? '  ·  ' : '') + d.chap : ''}</span><b>${d.index + 1}</b>`;
          f.classList.add('theme-' + (d.theme || 'paper'));
        }
      }
      await document.fonts.ready;
      await Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; })));
      window.__deckReady = true;
      return;
    }
    stage = h('div', 'stage', root);
    slides.forEach(build);
    buildChrome();
    blackEl = h('div', 'blackout', stage);
    notesEl = h('div', 'notes', document.body);
    buildOverview();
    fit(); window.addEventListener('resize', fit);
    await document.fonts.ready;
    if (MODE === 'capture') { window.__deckReady = true; return; }
    document.addEventListener('keydown', keys);
    stage.addEventListener('click', e => { if (e.target.closest('a,button')) return; next(); });
    stage.addEventListener('contextmenu', e => { e.preventDefault(); back(); });
    if (bc) bc.onmessage = m => { const d = m.data; if (d.type === 'cmd') { if (d.cmd === 'next') next(); else if (d.cmd === 'back') back(); else if (d.cmd === 'go') go(d.i, { final: false }); else if (d.cmd === 'hello') sync(); } };
    const hi = parseInt((location.hash || '#1').slice(1), 10);
    go((isNaN(hi) ? 1 : hi) - 1, { instant: true, final: false, force: true });
    requestAnimationFrame(frame);
  }

  /* 캡처 도구용: i번째 슬라이드를 시각 t, 단계 stp 로 그린다(단계 시작은 stepEvery 초 간격) */
  function show(i, t = FINAL, stp = null, stepEvery = 1.2) {
    cur = i; const d = slides[i];
    const n = stp == null ? (t >= FINAL - 1 ? (d.steps || 0) : 0) : stp;
    slides.forEach((sd, k) => { sd.el.classList.toggle('on', k === i); sd.el.classList.remove('off'); css(sd.el, { opacity: '', transform: '', clipPath: '' }); });
    const st = [0]; for (let k = 1; k <= (d.steps || 0); k++) st[k] = k <= n ? (t >= FINAL - 1 ? FINAL : Math.max(0, t - (n - k + 1) * stepEvery)) : -1e9;
    renderSlide(d, t, n, st);
    updateChrome();
    return { id: d.id, steps: d.steps || 0, title: d.title };
  }

  window.DECK = {
    W, H, MODE, FINAL, slide, part, slides, parts, start, show, go,
    ease, prog, kf, spring, clamp, lerp, rand, noise, stagger, count, css, h, s, split, bezier, PRESET,
  };
})();
