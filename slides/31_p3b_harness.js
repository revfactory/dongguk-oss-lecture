/* PART 3 · 3B 하네스와 기여 절차 — 원본 p.78~p.88
 * 예제 하나(normalize_title 의 빈 입력 IndexError)를 처음부터 끝까지 따라간다.
 * 화면의 함수·테스트·출력은 설명용 예시 코드다(Python 3.13 표준 unittest 로 실제 실행해 확인한 출력). */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, count, noise } = DECK;
  const U = UI;
  const PART = 'p3', CHAP = '하네스와 기여 절차';
  const VIO = '#7C5CFF', VIO_L = '#B3A2FF';

  /* ---------- 이 파일 전용 스타일 ---------- */
  const st = document.createElement('style');
  st.textContent = `
  .p3b-code { font-family: var(--mono); font-size: 27px; line-height: 1; color: #1F2A4A; }
  .p3b-code .r { display: flex; align-items: center; height: 46px; white-space: pre; padding-right: 20px; }
  .p3b-code .g { width: 58px; text-align: right; padding-right: 20px; color: #A3A9BC; font-size: 22px; flex: none; }
  .win.dark .p3b-code { color: #DCE3F5; } .win.dark .p3b-code .g { color: #4F5B80; }
  .p3b-code .kw { color: #7C5CFF; font-weight: 700; } .win.dark .p3b-code .kw { color: #B3A2FF; }
  .p3b-code .fn { color: #1E4FD0; font-weight: 700; } .win.dark .p3b-code .fn { color: #7FA4FF; }
  .p3b-code .str { color: #0B8A5F; } .win.dark .p3b-code .str { color: #4BE3A6; }
  .p3b-code .cm { color: #8A90A6; }
  .p3b-trk { display: flex; align-items: center; gap: 0; }
  .p3b-trk .nd { display: flex; align-items: center; gap: 14px; height: 60px; padding: 0 26px 0 10px; border-radius: 30px; font-size: 27px; font-weight: 750; white-space: nowrap; }
  .p3b-trk .nd .n { width: 42px; height: 42px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 22px; font-weight: 700; }
  .p3b-trk .ln { flex: 1; height: 4px; border-radius: 2px; margin: 0 10px; }
  .p3b-panel { position: absolute; border-radius: 26px; padding: 34px 40px; }
  .theme-night .p3b-panel { background: #121A33; box-shadow: 0 0 0 1.5px rgba(255,255,255,.08); }
  .theme-white .p3b-panel { background: #fff; box-shadow: 0 0 0 1.5px rgba(15,27,61,.08), 0 24px 48px -28px rgba(15,27,61,.28); }
  .p3b-ph { font-size: 34px; font-weight: 800; letter-spacing: -.025em; line-height: 1.25; display: flex; align-items: center; gap: 18px; }
  .p3b-row { display: flex; align-items: center; gap: 18px; font-size: 28px; font-weight: 600; }
  `;
  document.head.appendChild(st);

  /* ---------- 작은 부품 ---------- */
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function hl(line) {
    // 문자열 → 키워드 → 함수 이름 순서로 칠한다(문자열 안은 다시 칠하지 않음)
    const parts = line.split(/("[^"]*")/);
    return parts.map((p, i) => {
      if (i % 2 === 1) return `<span class="str">${esc(p)}</span>`;
      let e = esc(p);
      if (/^\s*#/.test(p)) return `<span class="cm">${e}</span>`;
      e = e.replace(/\b(def|return|if|not|import|from|class)\b/g, '<span class="kw">$1</span>');
      e = e.replace(/\b(normalize_title|assertEqual|strip|upper)\b/g, '<span class="fn">$1</span>');
      return e;
    }).join('');
  }
  /* 코드 창: lines 배열, o.mark = {줄번호: 배경색} */
  function codeWin(el, o) {
    const w = U.win(el, { x: o.x, y: o.y, w: o.w, h: o.h, title: o.title, dark: o.dark });
    const box = h('div', 'p3b-code', w.body); css(box, { paddingTop: '18px' });
    if (o.size) css(box, { fontSize: o.size + 'px' });
    const rows = o.lines.map((L, i) => {
      const r = h('div', 'r', box);
      if (o.rowH) css(r, { height: o.rowH + 'px' });
      h('span', 'g', r, String(i + 1));
      h('span', 'c', r, hl(L));
      if (o.mark && o.mark[i + 1]) css(r, { background: o.mark[i + 1] });
      return r;
    });
    return { win: w, rows };
  }
  /* 5단계 진행 표시(p.81~85 공통, 같은 자리) */
  const STEPS = ['읽기', '분석', '계획', '테스트', '구현·검증'];
  function tracker(el, A, cur, dark) {
    const wrap = U.box(el, 120, 58, 1680, 60, 'p3b-trk');
    const nodes = [];
    STEPS.forEach((nm, i) => {
      const done = i < cur, on = i === cur;
      const nd = h('div', 'nd', wrap);
      const n = h('span', 'n', nd, done ? '' : String(i + 1));
      if (done) n.appendChild(U.icon('check', 26, null, 3));
      h('span', '', nd, nm);
      const base = dark ? 'rgba(255,255,255,.07)' : 'rgba(15,27,61,.06)';
      css(nd, { background: on ? VIO : base, color: on ? '#fff' : done ? (dark ? VIO_L : VIO) : (dark ? '#56628A' : '#A3A9BC') });
      css(n, { background: on ? '#fff' : done ? VIO : 'transparent', color: on ? VIO : '#fff', border: (on || done) ? 'none' : `2.5px solid ${dark ? '#3A4670' : '#C9CDD9'}` });
      if (!done && !on) css(n, { color: dark ? '#56628A' : '#A3A9BC' });
      nodes.push(nd);
      if (i < STEPS.length - 1) {
        const ln = h('div', 'ln', wrap);
        css(ln, { background: i < cur ? VIO : (dark ? 'rgba(255,255,255,.12)' : 'rgba(15,27,61,.12)') });
      }
    });
    A(wrap, 'fade', 0, { dur: 0.3 });
    A(nodes[cur], 'pop', 0.15, { from: 0.7, dur: 0.5 });
    return { wrap, nodes };
  }
  function head(el, A, kicker, html, y = 96, cls = 'h2') {
    const T = U.title(el, kicker, html, { y, cls });
    A(T.k, 'right', 0.05); A(T.t, 'chars', 0.12, { each: 0.022 });
    return T;
  }

  /* =========================================================
   * p.78 하네스 엔지니어링의 구성 — 가운데 에이전트, 네 모서리 구성 요소
   * ========================================================= */
  slide({
    id: 'p3b-harness', part: PART, chap: CHAP, theme: 'night', cls: 'dots',
    title: '하네스 엔지니어링의 구성',
    notes: '하네스는 에이전트가 일하는 조건 전체입니다. 지침, 도구·권한·실행 환경, 테스트와 완료 조건, 실행 기록과 사람의 검토 네 가지를 함께 설계합니다. 이번 장은 normalize_title 빈 입력 오류 예제 하나로 이 네 가지를 차례로 적용합니다.',
    build(el, A) {
      head(el, A, CHAP, '하네스 엔지니어링의 구성');
      const cx = 960, cy = 640;
      // 가운데 에이전트
      const core = U.box(el, cx - 170, cy - 120, 340, 240);
      css(core, { borderRadius: '36px', background: VIO, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 0 0 14px rgba(124,92,255,.18), 0 30px 80px -20px rgba(124,92,255,.6)' });
      core.appendChild(U.icon('bot', 96, '#fff', 1.8));
      const cl = h('div', '', core, '에이전트'); css(cl, { fontSize: '36px', fontWeight: 850, color: '#fff' });
      A(core, 'pop', 0.25, { from: 0.5, dur: 0.6 });
      this.core = core;
      // 네 모서리 카드
      const C = [
        { x: 120, y: 330, icon: 'doc', c: '#12B07A', t: '요구사항과<br>프로젝트 지침', ax: 700, ay: 415, bx: cx - 170, by: cy - 60 },
        { x: 1220, y: 330, icon: 'gear', c: '#2F6BFF', t: '도구·권한·<br>실행 환경', ax: 1220, ay: 415, bx: cx + 170, by: cy - 60 },
        { x: 120, y: 735, icon: 'check', c: '#12A6B0', t: '테스트와<br>완료 조건', ax: 700, ay: 820, bx: cx - 170, by: cy + 60 },
        { x: 1220, y: 735, icon: 'branch', c: '#F5A524', t: '실행 기록과<br>사람의 검토', ax: 1220, ay: 820, bx: cx + 170, by: cy + 60 },
      ];
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible' }, el);
      el.insertBefore(svg, core);
      this.paths = [];
      C.forEach((c, i) => {
        const card = U.box(el, c.x, c.y, 580, 170);
        css(card, { borderRadius: '28px', background: '#121A33', boxShadow: `0 0 0 2px ${c.c}55`, display: 'flex', alignItems: 'center', gap: '28px', padding: '0 36px' });
        card.appendChild(U.badge(null, c.icon, { size: 96, bg: c.c, square: true, k: .52 }));
        const t = h('div', '', card, c.t); css(t, { fontSize: '40px', fontWeight: 800, lineHeight: 1.22, letterSpacing: '-.03em', color: '#fff' });
        A(card, i % 2 ? 'left' : 'right', 0.55 + i * 0.12, { d: 70 });
        const mx = (c.ax + c.bx) / 2;
        const p = s('path', { d: `M${c.ax} ${c.ay} C ${mx} ${c.ay}, ${mx} ${c.by}, ${c.bx} ${c.by}`, fill: 'none', stroke: c.c, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1 }, svg);
        A(p, 'draw', 0.75 + i * 0.12, { dur: 0.6 });
        this.paths.push(p);
      });
      // 선을 따라 흐르는 점
      this.dots = C.map(c => s('circle', { r: 9, fill: c.c, opacity: 0 }, svg));
      const cap = U.text(el, 'b3', '에이전트가 일하는 조건을 네 가지로 나누어 설계합니다', 120, 925, 1680);
      css(cap, { textAlign: 'center', color: '#9AA6C6' }); A(cap, 'fade', 1.5);
    },
    render(t) {
      this.paths.forEach((p, i) => {
        const L = p.getTotalLength ? p.getTotalLength() : 0;
        if (!L || t < 1.6) { this.dots[i].setAttribute('opacity', 0); return; }
        const q = ((t - 1.6) * 0.45 + i * 0.25) % 1;
        const pt = p.getPointAtLength(L * q);
        this.dots[i].setAttribute('cx', pt.x); this.dots[i].setAttribute('cy', pt.y);
        this.dots[i].setAttribute('opacity', Math.sin(q * Math.PI) * 0.9);
      });
      css(this.core, { boxShadow: `0 0 0 ${14 + Math.sin(t * 2.2) * 4}px rgba(124,92,255,.18), 0 30px 80px -20px rgba(124,92,255,.6)` });
    },
  });

  /* =========================================================
   * p.79 수정 범위와 금지할 변경 — 폴더 트리에서 두 파일만 켜진다
   * ========================================================= */
  slide({
    id: 'p3b-scope', part: PART, chap: CHAP, theme: 'white',
    title: '수정 범위와 금지할 변경',
    notes: '에이전트에게 고칠 범위를 파일 단위로 정해 줍니다. 오른쪽 트리는 설명용 예시 저장소입니다. normalize_title이 있는 파일과 테스트 파일 두 개만 수정하고, API·의존성·폴더 구조는 그대로 둡니다. 범위가 넓어져야 하면 먼저 사람에게 확인하게 합니다.',
    build(el, A) {
      head(el, A, CHAP, '수정 범위와<br>금지할 변경', 96, 'h1');
      const L = [
        { icon: 'check', color: 'var(--green)', text: '<code>normalize_title</code>과 테스트만 수정' },
        { icon: 'equal', color: 'var(--blue)', text: '내부 공백과 나머지 대소문자 유지' },
        { icon: 'lock', color: '#3A4766', text: 'API·의존성·폴더 구조 유지' },
        { icon: 'chat', color: 'var(--amber)', text: '범위가 넓어지면 먼저 확인' },
      ];
      const it = U.items(el, L, { x: 120, y: 470, w: 900, isz: 76, gap: 40, square: true });
      it.rows.forEach((r, i) => A(r, 'up', 0.6 + i * 0.1, { d: 40 }));
      // 트리
      const W = U.win(el, { x: 1080, y: 150, w: 720, h: 790, title: 'title-tools' });
      const tr = U.tree(W.body, ['title-tools/', '  api/', '    routes.py', '  tests/', '    test_titles.py', '    test_cli.py', '  cli.py', '  text_utils.py', '  pyproject.toml', '  README.md'],
        { size: 30, rowH: 62, hi: { 'test_titles.py': '#12B07A', 'text_utils.py': '#12B07A' } });
      U.place(tr.el, 26, 30, 668);
      this.rows = tr.rows;
      tr.rows.forEach((r, i) => A(r, 'right', 0.3 + i * 0.05, { d: 30, dur: 0.5 }));
      // 잠금 표시(API·의존성·구조)
      this.locks = [];
      tr.rows.forEach((r, i) => {
        const keep = ['api/', 'pyproject.toml', 'title-tools/'].includes(r.name);
        if (!keep) return;
        const lk = U.icon('lock', 34, '#3A4766', 2.4);
        css(lk, { marginLeft: 'auto' }); r.appendChild(lk);
        A(lk, 'stamp', 1.45 + this.locks.length * 0.1, { dur: 0.45 });
        this.locks.push(lk);
      });
      const hiRows = tr.rows.filter(r => ['test_titles.py', 'text_utils.py'].includes(r.name));
      hiRows.forEach(r => { const pen = U.icon('pen', 32, '#12B07A', 2.4); css(pen, { marginLeft: 'auto' }); r.appendChild(pen); A(pen, 'stamp', 1.25, { dur: 0.45 }); });
    },
    render(t) {
      // 수정 대상이 아닌 파일은 1.2초 뒤 흐려진다
      const p = prog(t, 1.1, 0.5, ease.outCubic);
      this.rows.forEach(r => {
        const target = ['test_titles.py', 'text_utils.py'].includes(r.name);
        if (!target && !r.name.endsWith('/')) css(r, { filter: `opacity(${lerp(1, 0.38, p)})` });
      });
    },
  });

  /* =========================================================
   * p.80 실행 환경과 검증 명령 — 터미널 하나 + 기록 카드
   * ========================================================= */
  slide({
    id: 'p3b-verify', part: PART, chap: CHAP, theme: 'night', cls: 'dots',
    title: '실행 환경과 검증 명령',
    notes: '검증 명령을 하나로 정해 지침에 적습니다. 화면의 출력은 설명용 예시 코드로 실제 실행한 결과입니다(아직 회귀 테스트를 넣기 전이라 기존 테스트 1개만 돕니다). 명령과 종료 결과를 기록하고, 실행하지 못한 검사는 통과로 적지 않고 따로 표시합니다.',
    build(el, A) {
      const T = head(el, A, CHAP, '실행 환경과 검증 명령');
      const sub = U.text(el, 'b2', 'Python 3와 표준 <code>unittest</code> 사용', 120, 300); A(sub, 'up', 0.35);
      // 터미널
      const W = U.win(el, { x: 120, y: 390, w: 1060, h: 440, title: 'terminal', dark: true });
      const tm = U.term(W.body, [
        '$ python -m unittest discover -s tests -v',
        '> test_normal (test_titles.TitleTest.test_normal) ... ok',
        '> ',
        '> ' + '-'.repeat(40),
        '> Ran 1 test in 0.000s',
        '> ',
        'ok OK',
      ], { size: 28 });
      U.place(tm.el, 36, 34, 1000);
      A(tm.rows[0].cmd, 'type', 0.6, { cps: 40 });
      A(tm.rows[0], 'fade', 0.55, { dur: 0.1 });
      tm.rows.slice(1).forEach((r, i) => A(r, 'fade', 1.75 + i * 0.07, { dur: 0.15 }));
      this.caret = h('span', '', tm.rows[0], '▌'); css(this.caret, { color: '#4BE3A6', opacity: 0 });
      // 기록 카드
      const card = U.box(el, 1230, 390, 570, 440, 'p3b-panel'); css(card, { padding: '30px 38px' });
      const ch = h('div', 'p3b-ph', card); css(ch, { fontSize: '32px' }); ch.appendChild(U.icon('doc', 38, VIO_L)); h('span', '', ch, '검증 기록');
      const rows = [
        ['실행한 명령', '<code style="font-size:23px">python -m unittest<br>discover -s tests -v</code>'],
        ['종료 결과', '<span style="color:#4BE3A6;font-weight:800">종료 코드 0 · OK</span>'],
        ['미실행 검사', '<span style="color:#F5A524;font-weight:800">따로 표시</span>'],
      ];
      rows.forEach((r, i) => {
        const b = h('div', '', card); css(b, { marginTop: i ? '14px' : '18px', paddingTop: i ? '12px' : 0, borderTop: i ? '1.5px solid rgba(255,255,255,.1)' : 'none' });
        const k = h('div', '', b, r[0]); css(k, { fontSize: '26px', color: '#9AA6C6', fontWeight: 650 });
        const v = h('div', '', b, r[1]); css(v, { fontSize: '29px', fontWeight: 700, marginTop: '6px', lineHeight: 1.3 });
        A(b, 'up', 2.3 + i * 0.15, { d: 26 });
      });
      A(card, 'left', 0.5, { d: 80 });
      [['doc', '#7C5CFF', '명령과 종료 결과를 기록', 120], ['skip', '#F5A524', '미실행 검사는 따로 표시', 980]].forEach(([ic, col, tx, x], i) => {
        const f = U.box(el, x, 862, 820, 76);
        css(f, { display: 'flex', alignItems: 'center', gap: '22px', fontSize: '36px', fontWeight: 780, color: '#E6EAF5', letterSpacing: '-.02em' });
        f.appendChild(U.badge(null, ic, { size: 64, bg: col, square: true, k: .55 })); h('span', '', f, tx);
        A(f, 'up', 2.7 + i * 0.12, { d: 30 });
      });
    },
    render(t) { css(this.caret, { opacity: t > 1.7 && t < 2.2 && Math.floor(t * 3) % 2 === 0 ? 1 : 0 }); },
  });

  /* =========================================================
   * p.81 읽기부터 시작하는 저장소 분석 (단계 1)
   * ========================================================= */
  slide({
    id: 'p3b-read', part: PART, chap: CHAP, theme: 'white',
    title: '읽기부터 시작하는 저장소 분석',
    notes: '예제 1단계. 처음에는 읽기만 합니다. README와 CONTRIBUTING, 함수가 쓰이는 곳과 테스트, 기존 변경과 Issue 상태를 확인합니다. 오른쪽 터미널은 설명용 예시이며 마지막 git status로 수정한 파일이 없다는 것을 확인합니다.',
    build(el, A) {
      tracker(el, A, 0, false);
      head(el, A, '1단계 · 읽기', '읽기부터 시작하는<br>저장소 분석', 160);
      const L = [
        { icon: 'book', color: 'var(--green)', text: 'README와 기여 규칙부터 읽기' },
        { icon: 'search', color: 'var(--blue)', text: '함수의 호출 위치와 테스트 찾기' },
        { icon: 'link', color: 'var(--teal)', text: '기존 변경과 Issue 상태 확인' },
        { icon: 'ban', color: 'var(--red)', text: '조사 단계에서는<br>파일을 수정하지 않기' },
      ];
      const it = U.items(el, L, { x: 120, y: 470, w: 820, isz: 70, gap: 34, cls: 'b1' });
      it.rows.forEach((r, i) => A(r, 'up', 0.5 + i * 0.1, { d: 40 }));
      const W = U.win(el, { x: 960, y: 330, w: 840, h: 600, title: 'title-tools — 읽기 전용', dark: true });
      const tm = U.term(W.body, [
        '$ grep -rn "normalize_title" .',
        '> ./text_utils.py:1:def normalize_title(title):',
        '> ./cli.py:8:    print(normalize_title(name))',
        '> ./tests/test_titles.py:2:from text_utils ...',
        '$ git log --oneline -3 -- text_utils.py',
        '> 3f2a91c docs: explain title rules',
        '$ git status',
        'ok nothing to commit, working tree clean',
      ], { size: 24 });
      U.place(tm.el, 30, 26, 790);
      const tms = [0.7, 1.55, 2.2];
      [0, 4, 6].forEach((ri, k) => { A(tm.rows[ri], 'fade', tms[k] - 0.05, { dur: 0.1 }); A(tm.rows[ri].cmd, 'type', tms[k], { cps: 48 }); });
      [1, 2, 3].forEach((ri, k) => A(tm.rows[ri], 'fade', 1.35 + k * 0.05, { dur: 0.12 }));
      A(tm.rows[5], 'fade', 2.05, { dur: 0.12 });
      A(tm.rows[7], 'fade', 2.55, { dur: 0.12 });
      const badge = U.box(el, 1440, 850, 330, 64);
      css(badge, { borderRadius: '32px', background: '#12B07A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '28px', fontWeight: 800 });
      badge.appendChild(U.icon('lock', 32, '#fff', 2.4)); h('span', '', badge, '수정한 파일 0개');
      A(badge, 'stamp', 2.8, { dur: 0.5, from: 1.8, r: -8 });
    },
  });

  /* =========================================================
   * p.82 Issue 분석 요청 예시 (단계 2) — 말풍선 + 오류 위치
   * ========================================================= */
  slide({
    id: 'p3b-ask', part: PART, chap: CHAP, theme: 'night', cls: 'dots',
    title: 'Issue 분석 요청 예시',
    notes: '예제 2단계. 에이전트에게 분석만 요청합니다. 오류 위치와 근거 파일을 먼저 받고, 수정은 아직 하지 않게 마지막 줄로 막습니다. 오른쪽 코드와 오류는 설명용 예시 코드입니다. 빈 문자열에서 title[0]을 읽는 3번째 줄이 IndexError의 위치입니다.',
    build(el, A) {
      tracker(el, A, 1, true);
      head(el, A, '2단계 · 분석', 'Issue 분석 요청 예시', 160);
      // 사용자 아바타 + 말풍선
      const av = U.avatar(el, '나', '#12B07A', 72); U.place(av, 120, 380); A(av, 'pop', 0.4);
      const lines = ['<code>normalize_title</code>의 빈 입력 오류 분석', '<code>IndexError</code>가 나는 위치를 확인', '함수와 테스트 파일의 근거 제시', '<b style="color:#EF4B4B">아직 파일을 수정하지 마세요</b>'];
      const bub = U.bubble(el, '', { x: 220, y: 370, w: 760, size: 36, bg: '#fff', fg: '#0F1B3D', pad: '40px 46px', tail: 'tl', r: 34 });
      css(bub.querySelector('i'), { left: '-10px', top: '30px' });
      this.ls = lines.map((t, i) => { const d = h('div', '', bub, t); css(d, { marginTop: i ? '18px' : 0, fontWeight: 650 }); d.querySelectorAll('code').forEach(c => css(c, { padding: '0 .14em', marginRight: '.08em' })); return d; });
      A(bub, 'pop', 0.5, { from: 0.85, dur: 0.5 });
      this.ls.forEach((d, i) => A(d, 'words', 0.75 + i * 0.32, { each: 0.05 }));
      const who = U.text(el, 'cap', '에이전트에게 보내는 요청', 220, 322); css(who, { color: '#9AA6C6', fontSize: '26px' }); A(who, 'fade', 0.5);
      // 코드 + 오류
      const cw = codeWin(el, { x: 1040, y: 350, w: 760, h: 250, title: 'text_utils.py', dark: true, size: 26,
        lines: ['def normalize_title(title):', '    title = title.strip()', '    return title[0].upper() + title[1:]'] });
      A(cw.win.el, 'left', 0.9, { d: 70 });
      this.errRow = cw.rows[2];
      const err = U.box(el, 1040, 630, 760, 280);
      css(err, { borderRadius: '22px', background: 'rgba(239,75,75,.12)', boxShadow: 'inset 0 0 0 2px rgba(239,75,75,.55)', padding: '30px 36px', fontFamily: 'var(--mono)' });
      err.innerHTML = '<div style="display:flex;align-items:center;gap:16px;color:#FF8A8A;font-size:30px;font-weight:700"><span class="p3b-ex"></span>IndexError</div>' +
        '<div style="color:#DCE3F5;font-size:25px;margin-top:16px;line-height:1.55">string index out of range<br><span style="color:#9AA6C6">File "text_utils.py", line 3,<br>in normalize_title</span></div>';
      const ex = err.querySelector('.p3b-ex'); ex.appendChild(U.status(null, 'fail', 44));
      A(err, 'up', 2.3, { d: 40 });
      this.arrow = U.arrow(el, [[1420, 600], [1420, 628]], { color: '#EF4B4B', sw: 4, hl: 14 });
      A(this.arrow.path, 'draw', 2.2, { dur: 0.3 }); A(this.arrow.head, 'fade', 2.4, { dur: 0.2 });
    },
    render(t) {
      const p = prog(t, 2.05, 0.4, ease.outCubic);
      const pulse = t > 2.45 ? 0.5 + 0.5 * Math.sin((t - 2.45) * 4) : 1;
      css(this.errRow, { background: `rgba(239,75,75,${0.32 * p * lerp(0.6, 1, pulse)})`, boxShadow: p > 0 ? `inset 6px 0 0 rgba(239,75,75,${p})` : 'none' });
    },
  });

  /* =========================================================
   * p.83 수정 계획 검토 요청 (단계 3) — 흐름도 + 계획 카드
   * ========================================================= */
  slide({
    id: 'p3b-plan', part: PART, chap: CHAP, theme: 'white',
    title: '수정 계획 검토 요청',
    notes: '예제 3단계. 바로 구현하지 않고 계획을 먼저 받습니다. 빈 문자열을 확인하는 분기를 넣고, 비어 있지 않으면 첫 글자만 처리하고 나머지는 그대로 둡니다. 사람이 이 분기를 확인한 뒤에 구현으로 넘어갑니다.',
    build(el, A) {
      tracker(el, A, 2, false);
      head(el, A, '3단계 · 계획', '수정 계획 검토 요청', 160);
      // 흐름도
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible' }, el);
      const node = (x, y, w, hh, html, o = {}) => {
        const b = U.box(el, x, y, w, hh);
        css(b, { borderRadius: o.r ?? '20px', background: o.bg || '#fff', color: o.fg || 'var(--ink)', boxShadow: o.sh || '0 0 0 2px rgba(15,27,61,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: (o.fs || 28) + 'px', fontWeight: 700, lineHeight: 1.3, padding: '0 20px' });
        b.innerHTML = html; return b;
      };
      const n1 = node(300, 340, 420, 84, '<code>title.strip()</code>');
      const dia = U.box(el, 435, 495, 150, 150);
      const dIn = U.box(dia, 0, 0, 150, 150); css(dIn, { transform: 'rotate(45deg)', borderRadius: '22px', background: VIO, boxShadow: '0 20px 40px -16px rgba(124,92,255,.6)' });
      const dl = node(380, 520, 260, 100, '비어 있나?', { bg: 'transparent', sh: 'none', fg: '#fff', fs: 32 });
      const n2 = node(120, 760, 340, 110, '<code>return ""</code>', { bg: '#D5F2E6', sh: '0 0 0 2.5px #12B07A' });
      const n3 = node(540, 760, 400, 110, '첫 글자만 대문자<br>나머지는 그대로', { bg: '#DCE6FF', sh: '0 0 0 2.5px #2F6BFF' });
      const e1 = s('path', { d: 'M510 424 L510 462', stroke: '#0F1B3D', 'stroke-width': 4, fill: 'none', pathLength: 1 }, svg);
      const e2 = s('path', { d: 'M404 570 C 290 570, 290 640, 290 752', stroke: '#12B07A', 'stroke-width': 5, fill: 'none', pathLength: 1, 'stroke-linecap': 'round' }, svg);
      const e3 = s('path', { d: 'M616 570 C 740 570, 740 640, 740 752', stroke: '#2F6BFF', 'stroke-width': 5, fill: 'none', pathLength: 1, 'stroke-linecap': 'round' }, svg);
      const y1 = U.text(el, 'cap', '예', 248, 636); css(y1, { color: '#0B8A5F', fontSize: '28px', fontWeight: 800 });
      const y2 = U.text(el, 'cap', '아니오', 756, 636); css(y2, { color: '#1E4FD0', fontSize: '28px', fontWeight: 800 });
      A(n1, 'up', 0.45, { d: 30 }); A(e1, 'draw', 0.75, { dur: 0.25 });
      A([dia, dl], 'pop', 0.9, { from: 0.4, dur: 0.5 });
      A(e2, 'draw', 1.3, { dur: 0.45 }); A(e3, 'draw', 1.3, { dur: 0.45 });
      A([y1, y2], 'fade', 1.5, { dur: 0.3 });
      A(n2, 'up', 1.65, { d: 30 }); A(n3, 'up', 1.75, { d: 30 });
      // 검토 표시
      const rv = U.box(el, 650, 452, 250, 64);
      css(rv, { borderRadius: '32px', background: '#0F1B3D', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 24px', fontSize: '27px', fontWeight: 800, whiteSpace: 'nowrap' });
      rv.appendChild(U.icon('pen', 30, '#4BE3A6', 2.4)); h('span', '', rv, '사람이 검토');
      A(rv, 'stamp', 2.4, { dur: 0.5, from: 1.8, r: 6 });
      // 계획 카드
      const card = U.box(el, 1020, 330, 780, 600, 'p3b-panel');
      const ch = h('div', 'p3b-ph', card); ch.appendChild(U.icon('bot', 44, VIO)); h('span', '', ch, '에이전트가 제안한 계획');
      const sec = (label, color, lines, top) => {
        const b = h('div', '', card); css(b, { marginTop: top + 'px' });
        const l = h('div', '', b, label); css(l, { fontSize: '26px', fontWeight: 800, color });
        const rows = lines.map(t => { const r = h('div', 'p3b-row', b); css(r, { marginTop: '14px', fontSize: '32px' }); r.appendChild(U.icon('dot', 24, color)); h('span', '', r, t); return r; });
        return { b, rows };
      };
      const a = sec('수정', '#1E4FD0', ['빈 문자열 확인 분기를 제안', '첫 글자 처리와 나머지 문자열 유지'], 34);
      const b = sec('확인', '#0B8A5F', ['회귀 테스트와 기존 테스트 확인'], 34);
      const last = h('div', '', card, '구현 전에 계획을 검토하겠습니다');
      css(last, { marginTop: '40px', padding: '22px 28px', borderRadius: '18px', background: '#F1EEFF', color: '#5B3FD6', fontSize: '32px', fontWeight: 800 });
      A(card, 'left', 0.5, { d: 80 });
      [...a.rows, ...b.rows].forEach((r, i) => A(r, 'up', 1.0 + i * 0.15, { d: 24 }));
      A(last, 'wipe', 2.1, { dur: 0.5 });
    },
  });

  /* =========================================================
   * p.84 회귀 테스트 작성 요청 (단계 4) — 클릭하면 빨강이 초록으로 뒤집힌다
   * ========================================================= */
  slide({
    id: 'p3b-test', part: PART, chap: CHAP, theme: 'night', cls: 'dots', steps: 1,
    title: '회귀 테스트 작성 요청',
    notes: '예제 4단계. 수정하기 전에 실패하는 테스트를 먼저 만듭니다. 처음 화면은 수정 전 결과(빈 문자열·공백 입력에서 IndexError, ERROR 2개)입니다. 클릭하면 수정 후 결과로 바뀝니다. 테스트 코드와 출력은 설명용 예시 코드이며 Python 3.13에서 실제로 실행한 결과입니다.',
    build(el, A) {
      tracker(el, A, 3, true);
      head(el, A, '4단계 · 테스트', '회귀 테스트 작성 요청', 160);
      const cw = codeWin(el, { x: 120, y: 330, w: 860, h: 600, title: 'tests/test_titles.py', dark: true, size: 24, rowH: 39,
        lines: ['import unittest', 'from text_utils import normalize_title', '', 'class TitleTest(unittest.TestCase):', '    def test_empty(self):', '        self.assertEqual(normalize_title(""), "")', '', '    def test_spaces(self):', '        self.assertEqual(normalize_title("   "), "")', '', '    def test_normal(self):', '        result = normalize_title("hello  World")', '        self.assertEqual(result, "Hello  World")'] });
      A(cw.win.el, 'right', 0.4, { d: 70 });
      cw.rows.forEach((r, i) => A(r, 'fade', 0.6 + i * 0.04, { dur: 0.2 }));
      // 새로 추가한 테스트 줄 표시
      [4, 5, 7, 8].forEach(i => css(cw.rows[i], { background: 'rgba(124,92,255,.14)' }));
      // 결과 패널
      const P = U.box(el, 1030, 330, 770, 360, 'p3b-panel'); css(P, { padding: '28px 40px' });
      const hd = h('div', 'p3b-ph', P); this.hdIcon = U.icon('term', 42, '#9AA6C6'); hd.appendChild(this.hdIcon);
      const hdT = h('span', '', hd, '실행 결과'); css(hdT, { fontSize: '30px' });
      this.tests = [['test_empty', 1], ['test_normal', 0], ['test_spaces', 1]].map(([nm, flips], i) => {
        const r = h('div', 'p3b-row', P); css(r, { marginTop: i ? '10px' : '20px', height: '54px', fontFamily: 'var(--mono)', fontSize: '29px' });
        const holder = h('span', '', r); css(holder, { position: 'relative', width: '46px', height: '46px', flex: 'none' });
        const bad = U.status(holder, flips ? 'fail' : 'ok', 46); const good = U.status(holder, 'ok', 46);
        css(bad, { position: 'absolute', left: 0, top: 0 }); css(good, { position: 'absolute', left: 0, top: 0, opacity: 0 });
        h('span', '', r, nm);
        const res = h('span', '', r, flips ? 'ERROR' : 'ok'); css(res, { marginLeft: 'auto', fontWeight: 800, color: flips ? '#FF8A8A' : '#4BE3A6' });
        A(r, 'right', 1.0 + i * 0.12, { d: 30 });
        return { r, bad, good, res, flips };
      });
      this.sum = h('div', '', P, 'FAILED (errors=2)');
      css(this.sum, { marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '30px', fontWeight: 800, color: '#FF8A8A' });
      A(this.sum, 'fade', 1.5);
      // 수정 전 / 수정 후 설명
      const cols = U.box(el, 1030, 712, 770, 236); css(cols, { display: 'flex', flexDirection: 'column', gap: '14px' });
      const mk = (label, color, lines) => {
        const c = h('div', '', cols); css(c, { flex: 1, display: 'flex', alignItems: 'center', gap: '24px', borderRadius: '22px', padding: '0 28px', background: color + '1f', boxShadow: `inset 0 0 0 2px ${color}88` });
        const l = h('div', '', c, label); css(l, { fontSize: '28px', fontWeight: 850, color, width: '96px', flex: 'none' });
        const tx = h('div', '', c); lines.forEach(t => { const d = h('div', '', tx, t); css(d, { fontSize: '28px', fontWeight: 650, lineHeight: 1.42, color: '#E6EAF5' }); });
        return c;
      };
      this.before = mk('수정 전', '#EF4B4B', ['빈 문자열과 공백 입력을 테스트', '수정 전 <code>IndexError</code>를 확인']);
      this.after = mk('수정 후', '#12B07A', ['수정 후 빈 문자열 반환을 확인', '기존 정상 입력 동작도 검증']);
      A(this.before, 'up', 1.7, { d: 30 }); A(this.after, 'up', 1.8, { d: 30 });
    },
    render(t, S) {
      const a1 = S.at(1);
      this.tests.forEach((x, i) => {
        if (!x.flips) return;
        const p = prog(a1, 0.15 + i * 0.18, 0.5, ease.inOutCubic);
        const half = p < 0.5;
        const sc = Math.abs(1 - 2 * p);
        css(x.bad, { opacity: half ? 1 : 0, transform: `scaleX(${half ? sc : 0})` });
        css(x.good, { opacity: half ? 0 : 1, transform: `scaleX(${half ? 0 : sc})` });
        x.res.textContent = p >= 0.5 ? 'ok' : 'ERROR';
        css(x.res, { color: p >= 0.5 ? '#4BE3A6' : '#FF8A8A' });
      });
      const ps = prog(a1, 0.6, 0.4, ease.outCubic);
      this.sum.textContent = ps >= 0.5 ? 'Ran 3 tests · OK' : 'FAILED (errors=2)';
      css(this.sum, { color: ps >= 0.5 ? '#4BE3A6' : '#FF8A8A' });
      const pa = prog(a1, 0.7, 0.5, ease.outCubic);
      css(this.before, { filter: `opacity(${lerp(1, 0.45, pa)})` });
      css(this.after, { boxShadow: `inset 0 0 0 ${lerp(2, 4, pa)}px #12B07A${pa > 0 ? 'ff' : '88'}`, background: pa > 0 ? 'rgba(18,176,122,.22)' : '#12B07A1f' });
      if (S.at(1) < 0) css(this.after, { filter: 'opacity(.55)' }); else css(this.after, { filter: 'none' });
    },
  });

  /* =========================================================
   * p.85 구현과 검증 결과 확인 (단계 5) — Diff + 통과·실패·미실행 집계
   * ========================================================= */
  slide({
    id: 'p3b-impl', part: PART, chap: CHAP, theme: 'white',
    title: '구현과 검증 결과 확인',
    notes: '예제 5단계. 에이전트의 "끝났다"는 말보다 실제 Diff와 실행 기록을 봅니다. 왼쪽은 설명용 예시 코드의 실제 변경(두 줄 추가)입니다. 결과는 통과·실패·미실행으로 나누어 적습니다. 미실행 항목(예: 로컬에서 돌리지 못한 전체 CI)은 통과로 세지 않습니다. 완료 조건을 채우면 PR을 준비합니다.',
    build(el, A) {
      tracker(el, A, 4, false);
      head(el, A, '5단계 · 구현·검증', '구현과 <span class="hl">검증 결과 확인</span>', 160);
      const W = U.win(el, { x: 120, y: 330, w: 900, h: 330, title: 'text_utils.py  +2 −0' });
      const df = U.diff(W.body, [['@', '@@ -1,3 +1,5 @@'], [' ', 'def normalize_title(title):'], [' ', '    title = title.strip()'], ['+', '    if not title:'], ['+', '        return ""'], [' ', '    return title[0].upper() + title[1:]']], { size: 25, rowH: 44 });
      U.place(df.el, 0, 10, 900);
      A(W.el, 'right', 0.4, { d: 70 });
      df.rows.forEach((r, i) => A(r, r.classList.contains('add') ? 'wipe' : 'fade', 0.7 + i * 0.08, { dur: 0.35 }));
      // 확인 항목 4개
      const L = ['실제 Diff와 변경 이유를 확인', '실행한 명령과 결과를 확인', '실패·미실행 항목을 구분', '완료 조건을 충족하면 PR 준비'];
      const it = U.items(el, L.map(t => ({ text: t, st: 'ok' })), { x: 120, y: 700, w: 900, kind: 'check', isz: 64, gap: 14, cls: 'b2' });
      it.rows.forEach((r, i) => { css(r.lastChild, { color: 'var(--ink)', fontWeight: 650 }); A(r, 'up', 1.2 + i * 0.1, { d: 26 }); });
      // 집계 패널
      const P = U.box(el, 1070, 330, 730, 600, 'p3b-panel');
      const hd = h('div', 'p3b-ph', P); hd.appendChild(U.icon('term', 42, VIO)); h('span', '', hd, '검증 결과');
      const cmd = h('div', 'mono', P, '$ python -m unittest discover -s tests -v');
      css(cmd, { fontSize: '22px', color: 'var(--ink2)', marginTop: '14px', fontWeight: 500 });
      const cols = h('div', '', P); css(cols, { display: 'flex', gap: '16px', marginTop: '26px' });
      const T = [['통과', 3, 'ok', '#12B07A', 'test_empty<br>test_spaces<br>test_normal'], ['실패', 0, 'fail', '#EF4B4B', '없음'], ['미실행', 1, 'skip', '#9AA0B4', '전체 CI<br>(PR에서 확인)']];
      this.nums = T.map(([lab, n, kind, col, det], i) => {
        const c = h('div', '', cols); css(c, { flex: 1, borderRadius: '20px', padding: '22px 20px', background: col + '14', boxShadow: `inset 0 0 0 2px ${col}55`, height: '322px' });
        const top = h('div', 'p3b-row', c); top.appendChild(U.status(null, kind, 40)); const lb = h('span', '', top, lab); css(lb, { fontSize: '28px', fontWeight: 800, color: col === '#9AA0B4' ? '#6B7390' : col });
        const nEl = h('div', 'numf', c, '0'); css(nEl, { fontSize: '104px', lineHeight: 1, marginTop: '16px', color: col === '#9AA0B4' ? '#6B7390' : col });
        const d = h('div', '', c, det); css(d, { fontSize: '22px', fontWeight: 600, color: 'var(--ink2)', marginTop: '12px', lineHeight: 1.4, fontFamily: i === 0 ? 'var(--mono)' : 'var(--sans)' });
        A(c, 'flip', 1.4 + i * 0.12, { dur: 0.6 });
        return { nEl, n };
      });
      const pr = U.btn(P, 'PR 준비', 'green', { icon: 'pr' });
      css(pr, { position: 'absolute', left: '40px', bottom: '34px' });
      const prn = h('span', '', P, '완료 조건 충족'); css(prn, { position: 'absolute', left: '292px', bottom: '56px', fontSize: '26px', fontWeight: 700, color: '#0B8A5F' });
      A(pr, 'stamp', 2.6, { dur: 0.5, from: 1.6, r: -6 }); A(prn, 'right', 2.8, { d: 30 });
      A(P, 'left', 0.55, { d: 80 });
    },
    render(t) { this.nums.forEach((x, i) => { x.nEl.textContent = String(Math.round(x.n * prog(t, 1.7 + i * 0.12, 0.5, ease.outCubic))); }); },
  });

  /* =========================================================
   * p.86 서로 다른 역할의 에이전트 — 세 역할 + 사람의 최종 판단
   * ========================================================= */
  slide({
    id: 'p3b-roles', part: PART, chap: CHAP, theme: 'night', cls: 'dots',
    title: '서로 다른 역할의 에이전트',
    notes: '한 에이전트에게 모든 일을 맡기지 않고 분석·구현·검토를 나눕니다. 검토 역할은 구현한 쪽이 놓친 반례와 회귀 위험을 찾습니다. 세 결과는 모두 사람에게 모이고, 최종 판단은 사람이 합니다.',
    build(el, A) {
      head(el, A, CHAP, '서로 다른 역할의 에이전트');
      const R = [
        { x: 120, c: '#12B07A', icon: 'doc', k: '분석', t: '문제와 근거를 확인' },
        { x: 690, c: '#2F6BFF', icon: 'code', k: '구현', t: '합의한 범위를 수정' },
        { x: 1260, c: '#12A6B0', icon: 'search', k: '검토', t: '반례와 회귀 위험 확인' },
      ];
      this.cards = R.map((r, i) => {
        const c = U.box(el, r.x, 330, 540, 330);
        css(c, { borderRadius: '30px', background: '#121A33', boxShadow: `0 0 0 2px ${r.c}66`, padding: '40px 42px', overflow: 'hidden' });
        const top = U.box(c, 0, 0, 540, 10); css(top, { background: r.c });
        c.appendChild(U.badge(null, r.icon, { size: 92, bg: r.c, square: true, k: .5 }));
        const k = h('div', '', c, r.k); css(k, { fontSize: '56px', fontWeight: 880, color: '#fff', marginTop: '26px', letterSpacing: '-.03em' });
        const t = h('div', '', c, r.t); css(t, { fontSize: '36px', fontWeight: 650, color: '#C9D1E6', marginTop: '10px' });
        A(c, 'flip', 0.45 + i * 0.15, { dur: 0.7 });
        return c;
      });
      // 넘겨주는 화살표
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none' }, el);
      this.hand = [[660, 495, 690], [1230, 495, 1260]].map(([x1, y, x2], i) => {
        const p = s('path', { d: `M${x1 - 8} ${y} L${x2 + 2} ${y}`, stroke: '#fff', 'stroke-width': 4, fill: 'none', pathLength: 1 }, svg);
        A(p, 'draw', 1.1 + i * 0.15, { dur: 0.3 });
        return p;
      });
      // 사람
      const hm = U.box(el, 120, 760, 1680, 150);
      css(hm, { borderRadius: '30px', background: '#fff', color: '#0F1B3D', display: 'flex', alignItems: 'center', gap: '30px', padding: '0 46px' });
      hm.appendChild(U.badge(null, 'user', { size: 92, bg: '#0F1B3D', k: .52 }));
      const ht = h('div', '', hm, '최종 판단은 <span style="color:#7C5CFF">사람</span>이 수행'); css(ht, { fontSize: '52px', fontWeight: 880, letterSpacing: '-.035em' });
      const hs = h('div', '', hm, '승인 · Merge'); css(hs, { marginLeft: 'auto', fontSize: '30px', fontWeight: 750, color: '#7B8299' });
      A(hm, 'up', 1.6, { d: 60 });
      this.down = R.map((r, i) => {
        const x = r.x + 270;
        const p = s('path', { d: `M${x} 668 L${x} 752`, stroke: r.c, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', pathLength: 1 }, svg);
        A(p, 'draw', 1.9 + i * 0.08, { dur: 0.3 });
        return p;
      });
      this.pk = s('circle', { r: 12, fill: '#4BE3A6', opacity: 0 }, svg);
    },
    render(t) {
      // 작업 묶음이 분석 → 구현 → 검토 → 사람으로 이동한다(3초 주기)
      if (t < 2.3) { this.pk.setAttribute('opacity', 0); return; }
      const q = ((t - 2.3) / 3.2) % 1;
      let x, y;
      if (q < 0.25) { x = lerp(390, 960, q / 0.25); y = 495; }
      else if (q < 0.5) { x = lerp(960, 1530, (q - 0.25) / 0.25); y = 495; }
      else if (q < 0.75) { x = 1530; y = lerp(495, 760, (q - 0.5) / 0.25); }
      else { x = lerp(1530, 960, (q - 0.75) / 0.25); y = 760; }
      this.pk.setAttribute('cx', x); this.pk.setAttribute('cy', y);
      this.pk.setAttribute('opacity', q > 0.92 ? (1 - q) / 0.08 : 0.95);
      this.cards.forEach((c, i) => {
        const on = (i === 0 && q < 0.12) || (i === 1 && q >= 0.2 && q < 0.37) || (i === 2 && q >= 0.45 && q < 0.62);
        css(c, { transform: on ? 'translateY(-6px)' : 'none' });
      });
    },
  });

  /* =========================================================
   * p.87 병렬 작업과 Git Worktree — 갈라졌다가 테스트로 모인다
   * ========================================================= */
  slide({
    id: 'p3b-worktree', part: PART, chap: CHAP, theme: 'white',
    title: '병렬 작업과 Git Worktree',
    notes: 'git worktree는 저장소 하나에 작업 폴더를 여러 개 붙입니다. 폴더마다 다른 브랜치를 쓰므로 에이전트 두 개가 서로의 파일을 덮어쓰지 않습니다. 같은 파일을 동시에 고쳐야 하면 먼저 조율하고, 합친 뒤에는 테스트를 다시 돌립니다. 폴더·브랜치 이름은 설명용 예시입니다.',
    build(el, A) {
      head(el, A, CHAP, '병렬 작업과 <span class="hb">Git Worktree</span>');
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible' }, el);
      // 저장소
      const repo = U.box(el, 120, 520, 230, 200);
      css(repo, { borderRadius: '30px', background: '#0F1B3D', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' });
      repo.appendChild(U.icon('package', 72, '#fff', 1.8)); const rl = h('div', '', repo, '저장소'); css(rl, { fontSize: '32px', fontWeight: 850 });
      A(repo, 'pop', 0.4, { from: 0.6 });
      const wt = (y, col, path, br) => {
        const c = U.box(el, 470, y, 480, 170);
        css(c, { borderRadius: '26px', background: '#fff', boxShadow: `0 0 0 2.5px ${col}, 0 24px 40px -24px rgba(15,27,61,.35)`, padding: '24px 30px' });
        const r1 = h('div', 'p3b-row', c); r1.appendChild(U.icon('folder', 40, col, 2.2)); const p = h('span', 'mono', r1, path); css(p, { fontSize: '30px', fontWeight: 700 });
        const r2 = h('div', 'p3b-row', c); css(r2, { marginTop: '16px' }); r2.appendChild(U.icon('branch', 36, col, 2.2)); const b = h('span', 'mono', r2, br); css(b, { fontSize: '26px', color: col, fontWeight: 700 });
        return c;
      };
      const w1 = wt(350, '#12B07A', '../wt-fix', 'fix/empty-title');
      const w2 = wt(720, '#2F6BFF', '../wt-docs', 'docs/title-guide');
      A(w1, 'left', 1.0, { d: 60 }); A(w2, 'left', 1.12, { d: 60 });
      const e1 = s('path', { d: 'M350 590 C 410 590, 410 435, 464 435', stroke: '#12B07A', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', pathLength: 1 }, svg);
      const e2 = s('path', { d: 'M350 650 C 410 650, 410 805, 464 805', stroke: '#2F6BFF', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', pathLength: 1 }, svg);
      A(e1, 'draw', 0.7, { dur: 0.4 }); A(e2, 'draw', 0.8, { dur: 0.4 });
      // 통합 후 테스트
      const ts = U.box(el, 1060, 520, 250, 200);
      css(ts, { borderRadius: '30px', background: '#D5F2E6', boxShadow: '0 0 0 2.5px #12B07A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' });
      this.tsIcon = U.status(ts, 'ok', 76);
      const tl = h('div', '', ts, '통합 후<br>다시 테스트'); css(tl, { fontSize: '28px', fontWeight: 850, lineHeight: 1.25, color: '#0B6B4A' });
      const e3 = s('path', { d: 'M956 435 C 1010 435, 1010 590, 1054 590', stroke: '#12B07A', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', pathLength: 1 }, svg);
      const e4 = s('path', { d: 'M956 805 C 1010 805, 1010 650, 1054 650', stroke: '#2F6BFF', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', pathLength: 1 }, svg);
      A(e3, 'draw', 1.6, { dur: 0.4 }); A(e4, 'draw', 1.7, { dur: 0.4 });
      A(ts, 'pop', 2.05, { from: 0.6 }); A(this.tsIcon, 'stamp', 2.3, { dur: 0.45 });
      // 명령
      const cmd = U.box(el, 120, 920, 1190);
      cmd.innerHTML = '<code style="font-size:24px">git worktree add -b fix/empty-title ../wt-fix</code>';
      A(cmd, 'fade', 1.4);
      // 오른쪽 항목
      const L = [
        { icon: 'folder', color: 'var(--green)', text: '같은 저장소의<br>작업 폴더를 분리' },
        { icon: 'branch', color: 'var(--blue)', text: '각 작업에<br>다른 브랜치를 사용' },
        { icon: 'doc', color: 'var(--amber)', text: '같은 파일의<br>동시 수정은 조율' },
        { icon: 'gear', color: 'var(--teal)', text: '통합 뒤에는<br>다시 테스트' },
      ];
      const it = U.items(el, L, { x: 1380, y: 300, w: 440, isz: 64, gap: 34, cls: 'b2', square: true });
      it.rows.forEach((r, i) => { css(r.lastChild, { color: 'var(--ink)', fontWeight: 700, fontSize: '32px', lineHeight: 1.3 }); A(r, 'left', 0.5 + i * 0.1, { d: 40 }); });
    },
  });

  /* =========================================================
   * p.88 권한과 비밀정보 관리 — 네 칸: 접근 범위 · Secret · 외부 통신 · 사람 검토
   * ========================================================= */
  slide({
    id: 'p3b-secrets', part: PART, chap: CHAP, theme: 'night', cls: 'dots',
    title: '권한과 비밀정보 관리',
    notes: '에이전트에게는 필요한 저장소만 열어 줍니다. API Key는 코드나 지침 파일에 적지 않고 Secret에 넣습니다(예: Claude Code GitHub Actions의 ANTHROPIC_API_KEY). 외부 통신과 실행 명령은 허용 목록으로 제한하고, 변경 기록과 PR은 사람이 검토합니다. 저장소 이름과 허용 목록은 설명용 예시입니다.',
    build(el, A) {
      head(el, A, CHAP, '권한과 <span class="hl">비밀정보 관리</span>');
      const panel = (x, y, icon, col, title) => {
        const p = U.box(el, x, y, 820, y < 600 ? 330 : 310, 'p3b-panel'); css(p, { padding: '28px 38px' });
        const hd = h('div', 'p3b-ph', p); hd.appendChild(U.badge(null, icon, { size: 60, bg: col, square: true, k: .54 }));
        const tt = h('span', '', hd, title); css(tt, { fontSize: '34px' });
        return p;
      };
      // 1. 저장소 접근
      const p1 = panel(120, 280, 'users', '#12B07A', '저장소 접근은 필요한 범위만 허용');
      this.tg = [['title-tools', 1], ['payments-api', 0], ['infra-config', 0]].map(([nm, on], i) => {
        const r = h('div', 'p3b-row', p1); css(r, { marginTop: i ? '10px' : '22px', fontFamily: 'var(--mono)', fontSize: '28px', height: '50px' });
        const tg = U.toggle(r, true, { w: 76 }); const n = h('span', '', r, nm); css(n, { color: on ? '#fff' : '#7F8AAD' });
        return { tg, on };
      });
      // 2. Secret
      const p2 = panel(980, 280, 'key', '#F5A524', 'API Key는 Secret으로 관리');
      const sr = h('div', '', p2); css(sr, { marginTop: '26px', borderRadius: '16px', background: 'rgba(255,255,255,.05)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.1)', padding: '20px 26px' });
      const sn = h('div', 'mono', sr, 'ANTHROPIC_API_KEY'); css(sn, { fontSize: '27px', fontWeight: 700, color: '#F5A524' });
      const sv = h('div', 'p3b-row', sr); css(sv, { marginTop: '12px' });
      sv.appendChild(U.icon('lock', 32, '#9AA6C6', 2.4));
      this.sval = h('span', 'mono', sv, ''); css(this.sval, { fontSize: '30px', color: '#DCE3F5', letterSpacing: '.08em' });
      const where = h('div', '', p2, '코드·지침 파일에 적지 않습니다'); css(where, { marginTop: '18px', fontSize: '26px', color: '#9AA6C6', fontWeight: 600 });
      // 3. 외부 통신과 명령
      const p3 = panel(120, 640, 'globe', '#2F6BFF', '외부 통신과 실행 명령을 제한');
      const al = h('div', '', p3); css(al, { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '26px' });
      this.allow = [['pypi.org', 'ok'], ['github.com', 'ok'], ['그 밖의 주소', 'fail'], ['python -m unittest', 'ok'], ['그 밖의 명령', 'fail']].map(([t, k], i) => {
        const c = h('span', 'p3b-row', al); css(c, { height: '52px', padding: '0 18px 0 8px', borderRadius: '26px', background: k === 'ok' ? 'rgba(18,176,122,.15)' : 'rgba(239,75,75,.14)', fontSize: '25px', fontFamily: i % 3 === 2 || i === 4 ? 'var(--sans)' : 'var(--mono)', gap: '10px' });
        c.appendChild(U.status(null, k, 36)); h('span', '', c, t);
        A(c, 'pop', 1.3 + i * 0.08, { from: 0.6 });
        return c;
      });
      // 4. 사람 검토
      const p4 = panel(980, 640, 'branch', '#7C5CFF', '변경 기록과 PR을 사람이 검토');
      const pr = h('div', 'p3b-row', p4); css(pr, { marginTop: '26px', fontSize: '28px' });
      pr.appendChild(U.icon('pr', 40, '#4BE3A6', 2.2)); const prt = h('span', '', pr, 'fix: 빈 입력 처리'); css(prt, { fontWeight: 750 });
      const rv = h('div', 'p3b-row', p4); css(rv, { marginTop: '18px' });
      rv.appendChild(U.avatar(null, '나', '#12B07A', 50));
      const rb = U.btn(rv, '검토 후 승인', 'green', { icon: 'check', is: 28 }); css(rb, { height: '58px', fontSize: '26px', padding: '0 24px' });
      const rn = h('span', '', rv, 'Merge 전 필수'); css(rn, { fontSize: '25px', color: '#9AA6C6', fontWeight: 650 });
      A(rb, 'stamp', 2.2, { dur: 0.45, from: 1.6 });
      [p1, p2, p3, p4].forEach((p, i) => A(p, 'up', 0.4 + i * 0.12, { d: 50 }));
    },
    render(t) {
      // 필요 없는 저장소 토글이 꺼진다
      this.tg.forEach((x, i) => { const p = x.on ? 1 : 1 - prog(t, 1.1 + i * 0.2, 0.35, ease.inOutCubic); U.setToggle(x.tg, p); });
      // Secret 값: 입력 자리 → 가려진 값
      const full = '●●●●●●●●●●●●●●●●';
      const n = Math.round(full.length * prog(t, 1.2, 0.8, ease.linear));
      this.sval.textContent = n > 0 ? full.slice(0, n) : '';
    },
  });
})();
