/* UI 부품 — GitHub 화면 요소를 화면 크기로 키워 쓰기 위한 조각들.
 * 모든 함수는 만든 요소(또는 요소 묶음)를 돌려준다. 등장 애니메이션은 슬라이드의 build 에서 A(el, 'up', 0.3) 처럼 건다.
 * 좌표는 1920×1080 기준 px. */
(function () {
  'use strict';
  const { h, s, css } = DECK;

  /* ---------- 아이콘(24×24 선 아이콘, 직접 그림) ---------- */
  const I = {
    check: '<path d="M4.5 12.5l4.8 4.8L19.5 7"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    dot: '<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>',
    branch: '<circle cx="6" cy="5" r="2.3"/><circle cx="6" cy="19" r="2.3"/><circle cx="18" cy="6.5" r="2.3"/><path d="M6 7.3v9.4M18 8.8c0 4.2-4.5 4.6-11.4 7.6"/>',
    merge: '<circle cx="6" cy="5" r="2.3"/><circle cx="6" cy="19" r="2.3"/><circle cx="18" cy="15" r="2.3"/><path d="M6 7.3v9.4M6.6 7.4c.8 4.6 4.6 7.4 9.1 7.6"/>',
    pr: '<circle cx="6" cy="5" r="2.3"/><circle cx="6" cy="19" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="M6 7.3v9.4M18 16.7V9.5a3 3 0 0 0-3-3h-4.5M12.8 3.8L10.3 6.4l2.5 2.6"/>',
    issue: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="1.9" fill="currentColor"/>',
    closed: '<circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.3l2.6 2.6 5-5"/>',
    commit: '<circle cx="12" cy="12" r="3.4"/><path d="M2.5 12h6.1M15.4 12h6.1"/>',
    folder: '<path d="M3 7.2A2.2 2.2 0 0 1 5.2 5h3.9l2.2 2.3h7.5A2.2 2.2 0 0 1 21 9.5v8.3a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 17.8z"/>',
    file: '<path d="M6.5 3h7.6L19 7.9V21H6.5z"/><path d="M14 3v5h5"/>',
    doc: '<path d="M6.5 3h7.6L19 7.9V21H6.5z"/><path d="M14 3v5h5M9.5 12.5h6M9.5 16.5h6"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.6"/><path d="M15.8 15.8l4.9 4.9"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1"/><circle cx="12" cy="12" r="6.4"/>',
    play: '<path d="M8 5.2v13.6L18.8 12z"/>',
    flask: '<path d="M9 3h6M10 3v6.2L4.9 18.1A2 2 0 0 0 6.6 21h10.8a2 2 0 0 0 1.7-2.9L14 9.2V3M7.4 15h9.2"/>',
    shield: '<path d="M12 2.8l7.6 3v6.1c0 4.6-3.2 8-7.6 9.3-4.4-1.3-7.6-4.7-7.6-9.3V5.8z"/><path d="M8.6 12.1l2.4 2.4 4.6-4.6"/>',
    key: '<circle cx="8" cy="15.5" r="4.2"/><path d="M11 12.5l9-9M16.5 7l2.6 2.6M14 9.5l2 2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.1 3.4 3.1 14.6 0 18M12 3c-3.1 3.4-3.1 14.6 0 18"/>',
    user: '<circle cx="12" cy="8" r="3.9"/><path d="M4.4 20.6c1.2-4 4.2-6.1 7.6-6.1s6.4 2.1 7.6 6.1"/>',
    users: '<circle cx="9" cy="8.4" r="3.4"/><path d="M2.6 19.8c.9-3.5 3.4-5.4 6.4-5.4s5.5 1.9 6.4 5.4"/><circle cx="17.3" cy="9" r="2.7"/><path d="M16.8 14.3c2.5.3 4.2 1.9 4.9 4.8"/>',
    chat: '<path d="M4 5h16v11.2H9.4L4 20.2z"/>',
    dots3: '<circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/>',
    bot: '<rect x="4.5" y="8" width="15" height="11.5" rx="3.4"/><circle cx="9.4" cy="13.6" r="1.4" fill="currentColor"/><circle cx="14.6" cy="13.6" r="1.4" fill="currentColor"/><path d="M12 8V4.6M2.6 12.6v3.4M21.4 12.6v3.4"/><circle cx="12" cy="3.6" r="1.1" fill="currentColor"/>',
    term: '<rect x="2.8" y="4.5" width="18.4" height="15" rx="2.6"/><path d="M7 10l3 2.6L7 15.2M12.6 15.2h4.6"/>',
    lock: '<rect x="5" y="10.6" width="14" height="10" rx="2.2"/><path d="M8.2 10.6V7.8a3.8 3.8 0 0 1 7.6 0v2.8"/>',
    tag: '<path d="M3.2 12.2V4.2h8l9.6 9.6-8 8z"/><circle cx="7.6" cy="8.6" r="1.5"/>',
    eye: '<path d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    link: '<path d="M10 14a4.4 4.4 0 0 0 6.3 0l3.1-3.1a4.4 4.4 0 0 0-6.3-6.3l-1.1 1.1M14 10a4.4 4.4 0 0 0-6.3 0l-3.1 3.1a4.4 4.4 0 0 0 6.3 6.3l1.1-1.1"/>',
    book: '<path d="M5 4.2h11.2A2.8 2.8 0 0 1 19 7v13.8H7.8A2.8 2.8 0 0 1 5 18z"/><path d="M5 18a2.8 2.8 0 0 1 2.8-2.8H19"/>',
    trash: '<path d="M4 7h16M9.2 7V4h5.6v3M6.4 7l1 13.4h9.2l1-13.4"/>',
    download: '<path d="M12 3.8v11.4M7 10.4l5 5 5-5M4 20.2h16"/>',
    upload: '<path d="M12 15.6V4.2M7 9.2l5-5 5 5M4 20.2h16"/>',
    bug: '<rect x="7" y="7.6" width="10" height="12.6" rx="5"/><path d="M9.2 7.8a2.8 2.8 0 0 1 5.6 0M2.8 13.6H7M17 13.6h4.2M4 8.4l3 2M20 8.4l-3 2M4 19.4l3-1.8M20 19.4l-3-1.8M12 11.6v8.4"/>',
    bulb: '<path d="M9 18.2h6M10.2 21h3.6M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.3h5c0-.9.4-1.7 1.1-2.3A6 6 0 0 0 12 3z"/>',
    cloud: '<path d="M7 18.5a4.6 4.6 0 0 1-.6-9.1 6.1 6.1 0 0 1 11.6 1.6 3.8 3.8 0 0 1-.5 7.5z"/>',
    arrow: '<path d="M4 12h15.4M13.4 6l6 6-6 6"/>',
    warn: '<path d="M12 3.5l9.6 16.6H2.4z"/><path d="M12 10v4.6M12 17.4v.3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.6 2.2"/>',
    star: '<path d="M12 3.4l2.7 5.6 6.1.8-4.5 4.2 1.2 6.1L12 17.1l-5.5 3 1.2-6.1-4.5-4.2 6.1-.8z"/>',
    laptop: '<rect x="4.6" y="5" width="14.8" height="10.4" rx="1.6"/><path d="M2.4 19.2h19.2"/>',
    server: '<rect x="4" y="3.8" width="16" height="7.2" rx="2"/><rect x="4" y="13" width="16" height="7.2" rx="2"/><circle cx="8" cy="7.4" r="1" fill="currentColor"/><circle cx="8" cy="16.6" r="1" fill="currentColor"/>',
    code: '<path d="M8.4 7L3.4 12l5 5M15.6 7l5 5-5 5M13.6 4.4l-3.2 15.2"/>',
    pen: '<path d="M4 20l4.2-1 11.2-11.2-3.2-3.2L5 15.8z"/><path d="M14.2 6.6l3.2 3.2"/>',
    refresh: '<path d="M19.6 10.6A8 8 0 0 0 5.4 7L4 8.6M4 4v4.6h4.6M4.4 13.4A8 8 0 0 0 18.6 17l1.4-1.6M20 20v-4.6h-4.6"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    megaphone: '<path d="M4 9.6v4.8h3.2l7.6 4.4V5.2L7.2 9.6z"/><path d="M17.6 9.4a3.4 3.4 0 0 1 0 5.2"/>',
    hat: '<path d="M2 9.2l10-5 10 5-10 5z"/><path d="M6 11.2v5c3.2 2.6 8.8 2.6 12 0v-5M22 9.2v5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    skip: '<circle cx="12" cy="12" r="8.6"/><path d="M8 12h8"/>',
    wrench: '<path d="M14.6 5.4a4.2 4.2 0 0 0-5.5 5.5l-5.6 5.6 4 4 5.6-5.6a4.2 4.2 0 0 0 5.5-5.5l-2.6 2.6-2.6-.5-.5-2.6z"/>',
    package: '<path d="M3.6 7.4L12 3l8.4 4.4v9.2L12 21l-8.4-4.4z"/><path d="M3.6 7.4L12 12l8.4-4.6M12 12v9"/>',
    tree: '<rect x="9" y="3" width="6" height="4.4" rx="1"/><rect x="3" y="16.6" width="6" height="4.4" rx="1"/><rect x="15" y="16.6" width="6" height="4.4" rx="1"/><path d="M12 7.4v4.8M6 16.6v-4.4h12v4.4"/>',
    flag: '<path d="M5 21V3.6M5 4.4h12l-2.4 3.8L17 12H5"/>',
    kanban: '<rect x="3" y="4" width="5" height="16" rx="1.2"/><rect x="9.5" y="4" width="5" height="10.5" rx="1.2"/><rect x="16" y="4" width="5" height="13" rx="1.2"/>',
    sparkle: '<path d="M12 3.4l1.9 5.4 5.4 1.9-5.4 1.9L12 18l-1.9-5.4L4.7 10.7l5.4-1.9z"/><path d="M18.4 15.6l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    heart: '<path d="M12 20s-7.6-4.6-7.6-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.6 2.6C19.6 15.4 12 20 12 20z"/>',
    hand: '<path d="M8 12.6V5.4a1.6 1.6 0 0 1 3.2 0V11M11.2 10.4V4a1.6 1.6 0 0 1 3.2 0v6.4M14.4 10.6V5.6a1.6 1.6 0 0 1 3.2 0v8c0 4.2-2.6 7-6.4 7-2.6 0-4.2-1.4-5.4-3.4L3.6 13a1.5 1.5 0 0 1 2.4-1.8L8 13.6"/>',
    target: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    equal: '<path d="M5 9h14M5 15h14"/>',
    neq: '<path d="M5 9h14M5 15h14M16 4.4L8 19.6"/>',
    coffee: '<path d="M4.4 9h12v6.2a4.6 4.6 0 0 1-4.6 4.6H9a4.6 4.6 0 0 1-4.6-4.6z"/><path d="M16.4 10.6h1.4a2.6 2.6 0 0 1 0 5.2h-1.6M8 3.6v2.4M12 3.6v2.4"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.6 11a6.4 6.4 0 0 0 12.8 0M12 17.4V21"/>',
    graph: '<path d="M4 20V4M4 20h16"/><path d="M7.4 15.4l3.6-4.4 3.4 2.6 4.6-6"/>',
    sign: '<path d="M3.6 17.6c2.6-.2 3.6-6.6 5.4-6.6 1.6 0 .6 4.8 2.2 4.8 1.4 0 2-2.6 3.2-2.6s1 2.2 2.4 2.2c.8 0 1.6-.6 3.6-1.6"/><path d="M3.6 21h16.8"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2.2 5-5 2.2 2.2-5z"/>',
    gamepad: '<path d="M7 7.6h10a4.6 4.6 0 0 1 4.4 5.8l-1 3.6a2.6 2.6 0 0 1-4.4 1.1l-2-2.1h-4l-2 2.1a2.6 2.6 0 0 1-4.4-1.1l-1-3.6A4.6 4.6 0 0 1 7 7.6z"/><path d="M8 10.6v3M6.5 12.1h3"/><circle cx="16" cy="11.4" r=".9" fill="currentColor"/><circle cx="17.4" cy="13.2" r=".9" fill="currentColor"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.4" y="9.4" width="5.2" height="5.2" rx=".8"/><path d="M9.4 2.8V6M14.6 2.8V6M9.4 18v3.2M14.6 18v3.2M2.8 9.4H6M2.8 14.6H6M18 9.4h3.2M18 14.6h3.2"/>',
  };
  function icon(name, size = 48, color, sw = 2) {
    const el = document.createElement('span');
    el.className = 'ico';
    el.style.width = el.style.height = size + 'px';
    if (color) el.style.color = color;
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[name] || I.dot}</svg>`;
    return el;
  }
  /* 둥근 바탕 위 아이콘 */
  function badge(parent, name, o = {}) {
    const size = o.size || 96, b = h('span', 'badge', parent);
    css(b, { width: size + 'px', height: size + 'px', background: o.bg || 'var(--green)', color: o.fg || '#fff', borderRadius: o.square ? (size * .28) + 'px' : '50%' });
    b.appendChild(icon(name, size * (o.k || .5), null, o.sw || 2.2));
    if (o.x != null) place(b, o.x, o.y);
    return b;
  }

  /* ---------- 배치 ---------- */
  function place(el, x, y, w, hh) {
    el.classList.add('abs');
    css(el, { left: x + 'px', top: y + 'px' });
    if (w != null) el.style.width = w + 'px';
    if (hh != null) el.style.height = hh + 'px';
    return el;
  }
  function box(parent, x, y, w, hh, cls = '', html) { return place(h('div', cls, parent, html), x, y, w, hh); }
  function text(parent, cls, html, x, y, w) { const e = h('div', cls, parent, html); place(e, x, y, w); return e; }

  /* 제목 묶음: kicker(작은 머리말) + 제목. 왼쪽 위 기본 위치 */
  function title(parent, kicker, html, o = {}) {
    const x = o.x ?? 120, y = o.y ?? 96, w = o.w ?? 1680;
    const wrap = place(h('div', 'ttl', parent), x, y, w);
    const k = kicker ? h('div', 'k', wrap, kicker) : null;
    const t = h('div', o.cls || 'h1', wrap, html);
    if (k) css(t, { marginTop: (o.gap ?? 26) + 'px' });
    if (o.align) css(wrap, { textAlign: o.align });
    return { wrap, k, t };
  }

  /* ---------- 창 ---------- */
  function win(parent, o = {}) {
    const w = h('div', 'win' + (o.dark ? ' dark' : '') + (o.nobar ? ' nobar' : ''), parent);
    place(w, o.x || 0, o.y || 0, o.w || 800, o.h || 500);
    let bar = null;
    if (!o.nobar) {
      bar = h('div', 'win-bar', w);
      h('div', 'win-dots', bar, '<i></i><i></i><i></i>');
      if (o.title) h('span', '', bar, o.title);
      if (o.right) { const r = h('span', '', bar, o.right); css(r, { marginLeft: 'auto' }); }
    }
    const body = h('div', 'win-body', w);
    if (o.pad != null) css(body, { padding: o.pad + 'px' });
    return { el: w, bar, body };
  }

  /* ---------- 라벨 칩 ---------- */
  const LABEL = {
    bug: ['#FDE1E1', '#B42323'], documentation: ['#DCE6FF', '#1E4FD0'], 'good first issue': ['#D5F2E6', '#0B7A54'],
    enhancement: ['#E6E0FF', '#5B3FD6'], question: ['#FDEFD3', '#9A6200'], 'help wanted': ['#D3F1F3', '#0B7F87'],
  };
  function chip(parent, txt, o = {}) {
    const c = h('span', 'chip' + (o.size ? ' ' + o.size : ''), parent);
    const pal = LABEL[txt] || null;
    css(c, { background: o.bg || (pal ? pal[0] : '#EEF0F5'), color: o.fg || (pal ? pal[1] : 'var(--ink)') });
    if (o.icon) c.appendChild(icon(o.icon, o.size === 'xl' ? 50 : o.size === 'lg' ? 34 : 26, null, 2.4));
    if (o.dot) { const d = h('i', '', c); css(d, { width: '14px', height: '14px', borderRadius: '50%', background: 'currentColor', display: 'block' }); }
    h('span', '', c, txt);
    if (o.x != null) place(c, o.x, o.y);
    return c;
  }
  function btn(parent, txt, kind = '', o = {}) {
    const b = h('span', 'btn ' + kind, parent);
    if (o.icon) b.appendChild(icon(o.icon, o.is || 34, null, 2.4));
    h('span', '', b, txt);
    if (o.x != null) place(b, o.x, o.y);
    if (o.scale) css(b, { transform: `scale(${o.scale})` });
    return b;
  }

  /* ---------- Diff ---------- */
  /* lines: [['+', '코드'], ['-', '코드'], [' ', '코드'], ['@', '@@ hunk @@']]  각 줄 요소를 돌려줌 */
  function diff(parent, lines, o = {}) {
    const d = h('div', 'diff', parent);
    if (o.size) css(d, { fontSize: o.size + 'px' });
    let ln = o.start || 1;
    const rows = lines.map(([sg, code]) => {
      const r = h('div', 'ln' + (sg === '+' ? ' add' : sg === '-' ? ' del' : sg === '@' ? ' hunk' : ''), d);
      if (o.rowH) css(r, { height: o.rowH + 'px' });
      if (o.gutter !== false) h('span', 'g', r, sg === '@' ? '' : String(sg === '-' ? ln : ln++));
      h('span', 's', r, sg === '@' || sg === ' ' ? '' : sg);
      const c = h('span', 'c', r); c.textContent = code;
      return r;
    });
    if (o.x != null) place(d, o.x, o.y, o.w);
    return { el: d, rows };
  }

  /* ---------- 터미널 ---------- */
  /* lines: ['$ git status', '> 출력', 'ok 통과', 'er 실패'] — 접두어로 종류 구분 */
  function term(parent, lines, o = {}) {
    const t = h('div', 'term', parent);
    if (o.size) css(t, { fontSize: o.size + 'px' });
    const rows = lines.map(L => {
      const r = h('div', 'ln', t);
      if (L.startsWith('$ ')) { h('span', 'p', r, o.prompt || '$'); const c = h('span', 'cmd', r); c.textContent = L.slice(2); r.cmd = c; }
      else if (L.startsWith('ok ')) { const c = h('span', 'ok', r); c.textContent = L.slice(3); r.cmd = c; }
      else if (L.startsWith('er ')) { const c = h('span', 'er', r); c.textContent = L.slice(3); r.cmd = c; }
      else { const c = h('span', 'o', r); c.textContent = L.replace(/^> ?/, ''); r.cmd = c; }
      return r;
    });
    if (o.x != null) place(t, o.x, o.y, o.w);
    return { el: t, rows };
  }

  /* ---------- 카드 ---------- */
  function card(parent, o = {}) {
    const c = h('div', 'card', parent);
    place(c, o.x || 0, o.y || 0, o.w, o.h);
    if (o.bg) css(c, { background: o.bg });
    if (o.pad != null) css(c, { padding: o.pad + 'px' });
    return c;
  }

  /* ---------- 상태 아이콘(검사 결과) ---------- */
  const ST = { ok: ['check', 'var(--green)'], fail: ['x', 'var(--red)'], skip: ['skip', '#9AA0B4'], run: ['refresh', 'var(--amber)'], wait: ['clock', '#9AA0B4'] };
  function status(parent, kind = 'ok', size = 44) {
    const [n, c] = ST[kind] || ST.ok;
    const b = h('span', 'badge st-' + kind, parent);
    css(b, { width: size + 'px', height: size + 'px', background: kind === 'skip' || kind === 'wait' ? 'transparent' : c, color: kind === 'skip' || kind === 'wait' ? c : '#fff', border: kind === 'skip' || kind === 'wait' ? `3px solid ${c}` : 'none' });
    b.appendChild(icon(kind === 'skip' ? 'minus' : kind === 'wait' ? 'dot' : n, size * .62, null, 3));
    return b;
  }

  /* ---------- 커밋 그래프 ---------- */
  /* spec: { x, y, w, h, r, lanes: { main: {y, color} }, nodes: [{id, x, lane, color?, label?, ring?}], edges: [[from, to, color?]] } */
  function graph(parent, spec) {
    const svg = s('svg', { width: spec.w, height: spec.h, viewBox: `0 0 ${spec.w} ${spec.h}`, style: 'overflow:visible' }, parent);
    place(svg, spec.x || 0, spec.y || 0);
    const r = spec.r || 18, sw = spec.sw || 8;
    const N = {}; spec.nodes.forEach(n => N[n.id] = n);
    const Y = n => (spec.lanes[n.lane] || { y: n.lane }).y;
    const edges = (spec.edges || []).map(([a, b, col]) => {
      const A = N[a], B = N[b];
      const ya = Y(A), yb = Y(B);
      let d;
      if (ya === yb) d = `M${A.x} ${ya} L${B.x} ${yb}`;
      else { const mx = (A.x + B.x) / 2; d = `M${A.x} ${ya} C ${mx} ${ya}, ${mx} ${yb}, ${B.x} ${yb}`; }
      const color = col || (spec.lanes[ya === yb ? A.lane : (spec.lanes[B.lane] && B.lane !== 'main' ? B.lane : A.lane)] || {}).color || '#999';
      return s('path', { d, fill: 'none', stroke: color, 'stroke-width': sw, 'stroke-linecap': 'round', pathLength: 1 }, svg);
    });
    const nodes = {}, labels = {};
    spec.nodes.forEach(n => {
      const col = n.color || (spec.lanes[n.lane] || {}).color || '#999';
      const g = s('g', {}, svg);
      s('circle', { cx: n.x, cy: Y(n), r: n.r || r, fill: n.ring ? (spec.bg || '#fff') : col, stroke: col, 'stroke-width': n.ring ? sw * .8 : 0 }, g);
      css(g, { transformBox: 'fill-box', transformOrigin: 'center' });
      nodes[n.id] = g;
      if (n.label) {
        const t = s('text', { x: n.x, y: Y(n) + (n.ly ?? -(r + 22)), 'text-anchor': 'middle', fill: n.lc || col, 'font-family': 'JetBrains Mono, Pretendard', 'font-size': n.ls || 26, 'font-weight': 700 }, svg);
        t.textContent = n.label; labels[n.id] = t;
      }
    });
    return { svg, edges, nodes, labels };
  }

  /* ---------- 화살표(선) ---------- */
  function arrow(parent, pts, o = {}) {
    const W = o.W || 1920, H = o.H || 1080;
    const svg = o.svg || s('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none' }, parent);
    let d;
    if (typeof pts === 'string') d = pts;
    else if (o.curve && pts.length === 2) { const [[x1, y1], [x2, y2]] = pts; const mx = (x1 + x2) / 2; d = o.curve === 'v' ? `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}` : `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`; }
    else d = 'M' + pts.map(p => p.join(' ')).join(' L');
    const col = o.color || 'currentColor', sw = o.sw || 5;
    const path = s('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }, svg);
    if (o.dash) path.setAttribute('stroke-dasharray', o.dash);
    let head = null;
    if (o.head !== false) {
      // 끝점 방향으로 화살촉
      const tmp = path.getTotalLength ? null : null;
      const P = typeof pts === 'string' ? null : pts;
      let x2, y2, ang;
      if (P) { [x2, y2] = P[P.length - 1]; const [xa, ya] = o.curve ? (o.curve === 'v' ? [x2, y2 - 10] : [x2 - 10, y2]) : P[P.length - 2]; ang = Math.atan2(y2 - ya, x2 - xa); }
      else { x2 = o.hx; y2 = o.hy; ang = o.ha || 0; }
      const L = o.hl || 22;
      head = s('path', { d: `M${x2 - L * Math.cos(ang - .5)} ${y2 - L * Math.sin(ang - .5)} L${x2} ${y2} L${x2 - L * Math.cos(ang + .5)} ${y2 - L * Math.sin(ang + .5)}`, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    }
    return { svg, path, head };
  }

  /* ---------- 폴더 트리 ---------- */
  /* items: ['my-project/', '  src/', '    a.ts'] 앞 공백 2칸 = 한 단계. 끝 / = 폴더. o.hi = {이름: 색} */
  function tree(parent, items, o = {}) {
    const t = h('div', 'tree', parent);
    const fs = o.size || 30, rowH = o.rowH || Math.round(fs * 1.75);
    css(t, { fontFamily: 'var(--mono)', fontSize: fs + 'px', color: o.color || 'inherit' });
    const rows = items.map(L => {
      const lvl = (L.match(/^ */)[0].length) / 2, name = L.trim(), isDir = name.endsWith('/');
      const r = h('div', 'trow', t);
      css(r, { display: 'flex', alignItems: 'center', gap: '14px', height: rowH + 'px', paddingLeft: (lvl * fs * 1.25 + 12) + 'px', paddingRight: '18px', borderRadius: '10px', whiteSpace: 'nowrap' });
      const ic = icon(isDir ? 'folder' : 'file', fs * 1.05, isDir ? (o.dirColor || '#5B8DEF') : (o.fileColor || '#9AA0B4'), 2.2);
      r.appendChild(ic);
      const nm = h('span', '', r); nm.textContent = isDir ? name.slice(0, -1) : name;
      const hi = o.hi && (o.hi[name] || o.hi[name.replace(/\/$/, '')]);
      if (hi) { css(r, { background: hi + '22', boxShadow: `inset 0 0 0 2.5px ${hi}` }); css(nm, { color: hi, fontWeight: 700 }); ic.style.color = hi; }
      r.name = name;
      return r;
    });
    if (o.x != null) place(t, o.x, o.y, o.w);
    return { el: t, rows };
  }

  /* ---------- 말풍선 ---------- */
  function bubble(parent, html, o = {}) {
    const b = h('div', 'bubble', parent, html);
    css(b, { position: 'absolute', background: o.bg || '#fff', color: o.fg || 'var(--ink)', borderRadius: (o.r || 30) + 'px', padding: o.pad || '30px 38px', fontSize: (o.size || 34) + 'px', fontWeight: o.weight || 600, lineHeight: 1.45, letterSpacing: '-.015em', boxShadow: o.shadow || '0 20px 40px -20px rgba(15,27,61,.35), 0 0 0 1.5px rgba(15,27,61,.06)' });
    if (o.tail) {
      const tl = h('i', '', b);
      const side = o.tail; // 'bl' | 'br' | 'tl' | 'tr'
      css(tl, { position: 'absolute', width: '30px', height: '30px', background: o.bg || '#fff', transform: 'rotate(45deg)', [side[0] === 'b' ? 'bottom' : 'top']: '-12px', [side[1] === 'l' ? 'left' : 'right']: '48px', borderRadius: '4px' });
    }
    if (o.x != null) place(b, o.x, o.y, o.w);
    return b;
  }

  /* ---------- 토글 ---------- */
  function toggle(parent, on = true, o = {}) {
    const w = o.w || 88, hh = w * .56;
    const t = h('span', 'toggle', parent);
    css(t, { display: 'inline-block', position: 'relative', width: w + 'px', height: hh + 'px', borderRadius: hh + 'px', background: on ? (o.color || 'var(--green)') : '#CBD0DC', flex: 'none' });
    const k = h('i', '', t);
    css(k, { position: 'absolute', top: (hh * .1) + 'px', left: on ? (w - hh * .9) + 'px' : (hh * .1) + 'px', width: (hh * .8) + 'px', height: (hh * .8) + 'px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)' });
    t.knob = k; t.on = on; t.dims = { w, hh };
    return t;
  }
  function setToggle(t, p, color) { // p 0(off)→1(on)
    const { w, hh } = t.dims;
    css(t.knob, { left: DECK.lerp(hh * .1, w - hh * .9, p) + 'px' });
    css(t, { background: p > .5 ? (color || 'var(--green)') : '#CBD0DC' });
  }

  /* ---------- 아바타 ---------- */
  function avatar(parent, letter, color = 'var(--blue)', size = 56) {
    const a = h('span', 'badge', parent);
    css(a, { width: size + 'px', height: size + 'px', background: color, color: '#fff', fontWeight: 800, fontSize: (size * .42) + 'px' });
    a.textContent = letter;
    return a;
  }

  /* ---------- 큰 번호 ---------- */
  function num(parent, n, o = {}) {
    const size = o.size || 84;
    const b = h('span', 'numb', parent, String(n));
    css(b, { width: size + 'px', height: size + 'px', background: o.bg || 'var(--green)', fontSize: (size * .56) + 'px', color: o.fg || '#fff' });
    if (o.x != null) place(b, o.x, o.y);
    return b;
  }

  /* ---------- 이미지 ---------- */
  function img(parent, src, o = {}) {
    const im = h('img', 'img', parent);
    im.src = src; im.alt = '';
    place(im, o.x || 0, o.y || 0, o.w, o.h);
    css(im, { objectFit: o.fit || 'cover', display: 'block' });
    if (o.mask) css(im, { WebkitMaskImage: o.mask, maskImage: o.mask });
    return im;
  }

  /* ---------- 항목 줄(아이콘 + 문장) ---------- */
  /* items: [{icon, text, color}] 또는 문자열. 세로로 쌓음. 돌려주는 rows 에 애니메이션을 건다 */
  function items(parent, list, o = {}) {
    const wrap = place(h('div', 'items', parent), o.x ?? 120, o.y ?? 420, o.w ?? 860);
    const gap = o.gap ?? 34, isz = o.isz ?? 76;
    const rows = list.map((it, i) => {
      const L = typeof it === 'string' ? { text: it } : it;
      const r = h('div', 'it', wrap);
      css(r, { display: 'flex', alignItems: 'center', gap: '30px', marginBottom: gap + 'px' });
      if (o.kind === 'num') r.appendChild(num(null, L.n ?? i + 1, { size: isz, bg: L.color || o.color }));
      else if (o.kind === 'check') r.appendChild(status(null, L.st || 'ok', isz * .7));
      else if (o.kind !== 'none') r.appendChild(badge(null, L.icon || 'check', { size: isz, bg: L.bg || (L.color || o.color || 'var(--green)'), fg: L.fg || '#fff', square: o.square }));
      const tx = h('div', o.cls || 'b1', r, L.text);
      if (o.tw) css(tx, { maxWidth: o.tw + 'px' });
      return r;
    });
    return { el: wrap, rows };
  }

  /* ---------- 숫자 셀 ---------- */
  function stat(parent, value, label, o = {}) {
    const w = place(h('div', 'stat', parent), o.x || 0, o.y || 0, o.w);
    const v = h('div', 'numf', w, value);
    css(v, { fontSize: (o.size || 220) + 'px', lineHeight: .9, color: o.color || 'var(--fg)', letterSpacing: '-.01em' });
    const l = label ? h('div', o.lcls || 'b2', w, label) : null;
    if (l) css(l, { marginTop: '18px' });
    return { el: w, v, l };
  }


  /* ---------- Part 표지(세 Part 공통) ---------- */
  /* o: { n: '1', label: 'PART 1', title, chapters: ['1A …'], color, img: 'img/part1_collab_cut.png' } */
  function partCover(el, A, o) {
    css(el, { background: o.color });
    const circ = box(el, 820, -40, 1160, 1160); css(circ, { borderRadius: '50%', background: 'rgba(255,255,255,.96)' });
    A(circ, 'iris', 0.05, { dur: 0.9 });
    const ib = o.imgBox || { x: 720, y: 150, w: 1300, h: 732 }; // 그림마다 인물 위치가 달라 필요하면 따로 정한다
    const im = img(el, o.img, { x: ib.x, y: ib.y, w: ib.w, h: ib.h, fit: 'contain' });
    A(im, 'zoom', 0.35, { dur: 1.0, from: 1.12 });
    const lab = text(el, '', o.label, 120, 104); css(lab, { fontSize: '36px', fontWeight: 850, color: '#fff', letterSpacing: '.02em' });
    A(lab, 'right', 0.1);
    const big = text(el, 'numf', o.n, 106, 150); css(big, { fontSize: '400px', lineHeight: 1, color: '#fff' });
    A(big, 'slam', 0.2, { dur: 0.6, from: 1.6 });
    const tt = text(el, '', o.title, 120, 560, 720); css(tt, { fontSize: '80px', fontWeight: 880, letterSpacing: '-.04em', lineHeight: 1.12, color: '#fff' });
    A(tt, 'chars', 0.45, { each: 0.03 });
    if (o.time) { const tm = text(el, 'mono', o.time, 120, 770); css(tm, { fontSize: '30px', color: 'rgba(255,255,255,.9)', fontWeight: 500 }); A(tm, 'fade', 0.8); }
    const chs = box(el, 120, 830, 680); css(chs, { fontSize: '28px', fontWeight: 650, lineHeight: 1.55, color: 'rgba(255,255,255,.88)' });
    chs.innerHTML = (o.chapters || []).map(c => `<span class="w">${c}</span>`).join('<span style="opacity:.5">  ·  </span>');
    A(chs, 'up', 0.9, { d: 24 });
    return { circ, im, big, tt };
  }

  /* ---------- 쉬는 시간(10분 카운트다운: 라이브에서만 줄어든다) ---------- */
  function breakCover(el, A, o) {
    const im = img(el, 'img/break_desk.jpg', { x: 640, y: 80, w: 1400, h: 788, mask: 'radial-gradient(ellipse 60% 66% at 62% 50%, #000 55%, transparent 82%)' });
    A(im, 'zoom', 0.2, { dur: 1.1, from: 1.06 });
    const k = text(el, 'k', '쉬는 시간', 120, 150); A(k, 'right', 0);
    const clock = text(el, 'numf', '10:00', 110, 200); css(clock, { fontSize: '300px', lineHeight: 1, color: 'var(--ink)' });
    A(clock, 'slam', 0.15, { dur: 0.6, from: 1.5 });
    const tt = text(el, 'h2', o.title || '10분 쉬고 이어 갑니다', 120, 540, 760); A(tt, 'chars', 0.4, { each: 0.03 });
    const nx = box(el, 120, 720, 700);
    nx.innerHTML = `<div class="cap" style="font-size:28px">${o.resume} 다시 시작</div><div class="h4" style="margin-top:10px">${o.next}</div>`;
    A(nx, 'up', 0.8);
    return { clock, update(t, S) { const left = S.final ? 600 : Math.max(0, 600 - t); clock.textContent = `${Math.floor(left / 60)}:${String(Math.floor(left % 60)).padStart(2, '0')}`; } };
  }

  window.UI = { icon, badge, place, box, text, title, win, chip, btn, diff, term, card, status, graph, arrow, tree, bubble, toggle, setToggle, avatar, num, img, items, stat, partCover, breakCover, LABEL, ICONS: I };
})();
