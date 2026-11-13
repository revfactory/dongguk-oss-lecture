/* 1C Issue — 원본 p.22~p.32 + 쉬는 시간 */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, noise } = DECK;
  const U = UI;
  const CH = '1C Issue';

  /* 이 장에서만 쓰는 스타일 */
  const st = document.createElement('style');
  st.textContent = `
  .p1c-row { position:absolute; display:flex; align-items:center; gap:22px; background:#fff; border-radius:18px; padding:0 28px;
    box-shadow:0 0 0 1.5px rgba(15,27,61,.08), 0 14px 30px -18px rgba(15,27,61,.3); font-size:30px; font-weight:680; letter-spacing:-.02em; color:var(--ink); white-space:nowrap; }
  .p1c-row .nm { font-family:var(--mono); color:var(--muted); font-size:26px; font-weight:500; margin-left:auto; }
  .p1c-fl { font-size:24px; font-weight:800; color:var(--muted); margin:0 0 10px; letter-spacing:.01em; }
  .p1c-fd { background:#F5F6F9; border:2px solid #E3E6EE; border-radius:14px; padding:12px 20px; font-size:30px; font-weight:620; color:var(--ink); min-height:60px; letter-spacing:-.02em; }
  .p1c-md { font-variant-ligatures:none; font-family:var(--mono); font-size:27px; line-height:48px; white-space:pre; color:#3A4766; position:absolute; left:34px; }
  .p1c-md.hd { color:var(--ink); font-weight:700; }
  .p1c-md.cm { color:#9AA0B4; }
  .p1c-kcard { position:absolute; background:#fff; border-radius:14px; padding:16px 18px; box-shadow:0 0 0 1.5px rgba(15,27,61,.09), 0 10px 20px -14px rgba(15,27,61,.35); }
  .p1c-kcard .kt { font-size:25px; font-weight:720; letter-spacing:-.02em; color:var(--ink); line-height:1.3; }
  .p1c-kcard .km { display:flex; align-items:center; gap:10px; margin-top:12px; font-family:var(--mono); font-size:24px; color:var(--muted); }
  .p1c-bub { position:absolute; background:#fff; border-radius:22px; padding:22px 30px 24px; box-shadow:0 0 0 1.5px rgba(15,27,61,.08), 0 18px 34px -22px rgba(15,27,61,.35); }
  .p1c-bub .bh { display:flex; align-items:center; gap:14px; font-size:24px; font-weight:750; color:var(--muted); margin-bottom:10px; }
  .p1c-bub .bb { font-size:31px; font-weight:600; line-height:1.42; letter-spacing:-.02em; color:var(--ink); }
  `;
  document.head.appendChild(st);

  /* 이슈 한 줄(목록용) */
  function row(parent, o) {
    const r = h('div', 'p1c-row', parent);
    U.place(r, o.x, o.y, o.w, o.h || 76);
    r.appendChild(U.icon(o.closed ? 'closed' : 'issue', 36, o.closed ? 'var(--violet)' : 'var(--green)', 2.4));
    const t = h('span', '', r); t.textContent = o.title;
    if (o.chips) o.chips.forEach(c => { const cp = U.chip(r, c[0], { bg: c[1], fg: c[2], icon: c[3] }); css(cp, { height: '40px', fontSize: '24px', padding: '0 16px' }); r.chips = (r.chips || []).concat(cp); });
    const n = h('span', 'nm', r); n.textContent = o.num;
    return r;
  }

  /* ───────── p.22 Issue는 문제와 제안의 기록 (장 여는 화면) ───────── */
  slide({
    id: 'p1c-open', part: 'p1', chap: CH, title: 'Issue는 문제와 제안의 기록', theme: 'ink', cls: 'dots',
    notes: '버그(빨강)·제안(파랑)·진행 상태(초록)가 모두 Issue에 남는다. 코드를 바꾸는 제안은 Issue가 아니라 PR에서 한다는 점을 먼저 짚는다.',
    build(el, A) {
      const T = U.title(el, 'Chapter 1C · Issue', '<span class="hl">Issue</span>는<br>문제와 제안의 기록', { y: 130, w: 900 });
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.035 });
      const cards = [
        ['bug', 'var(--red)', '빈 입력에서 오류가 납니다', ['bug']],
        ['bulb', 'var(--blue)', '설치 문서에 예시를 더하면 좋겠습니다', ['documentation']],
        ['check', 'var(--green)', '담당자 지정 · 논의 3건 · 진행 중', ['good first issue']],
      ];
      this.cards = cards.map((c, i) => {
        const cd = U.card(el, { x: 1040, y: 150 + i * 178, w: 760, h: 150, pad: 0 });
        css(cd, { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 34px', background: '#18264D' });
        cd.appendChild(U.badge(null, c[0], { size: 84, bg: c[1] }));
        const tx = h('div', '', cd); css(tx, { flex: 1 });
        const t1 = h('div', '', tx, c[2]); css(t1, { fontSize: '32px', fontWeight: 760, letterSpacing: '-.025em', color: '#EEF1F8' });
        const lb = h('div', '', tx); css(lb, { marginTop: '12px', display: 'flex', gap: '10px' });
        c[3].forEach(l => { const cp = U.chip(lb, l); css(cp, { height: '38px', fontSize: '24px' }); });
        A(cd, 'tilt', 0.45 + i * 0.16, { r: i % 2 ? -7 : 7, d: 160, dur: 0.8, ease: ease.heavy });
        return cd;
      });
      const items = [
        ['var(--red)', '버그와 개선 제안을 남깁니다'],
        ['var(--blue)', '논의와 진행 상태를 공유합니다'],
        ['var(--violet)', '코드 변경은 <span class="hv">PR</span>에서 제안합니다'],
      ];
      items.forEach((it, i) => {
        const b = U.box(el, 120 + i * 570, 760, 530);
        css(b, { display: 'flex', gap: '22px', alignItems: 'flex-start' });
        const d = h('i', '', b); css(d, { width: '22px', height: '22px', borderRadius: '50%', background: it[0], flex: 'none', marginTop: '14px' });
        const t = h('div', '', b, it[1]); css(t, { fontSize: '40px', fontWeight: 700, lineHeight: 1.35, letterSpacing: '-.025em' });
        if (i === 2) { const ic = U.icon('pr', 44, '#B3A2FF', 2.4); css(ic, { marginTop: '6px' }); b.appendChild(ic); }
        A(b, 'up', 1.0 + i * 0.12);
      });
      const ln = U.box(el, 120, 720, 1680, 2); css(ln, { background: 'rgba(255,255,255,.14)' }); A(ln, 'grow', 0.9, { dur: 0.8 });
    },
    render(t) {
      this.cards.forEach((c, i) => css(c, { translate: `${noise(t * 0.35, i * 3) * 6}px ${noise(t * 0.4, i * 7 + 1) * 8}px` }));
    },
  });

  /* ───────── p.23 좋은 버그 리포트의 조건 ───────── */
  slide({
    id: 'p1c-bug-report', part: 'p1', chap: CH, title: '좋은 버그 리포트의 조건', theme: 'white',
    notes: '오른쪽 양식이 제목 → 환경 → 재현 순서로 채워진다. 마지막 두 줄에서 "확인한 사실"과 "추측"을 나눠 적는 습관을 강조.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', '좋은 버그 리포트의<br>조건', { w: 760 });
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const L = [
        ['문제가 드러나는 제목을 적습니다', 'var(--green)'],
        ['환경과 재현 절차를 제공합니다', 'var(--blue)'],
        ['확인한 사실과 추측을 구분합니다', 'var(--teal)'],
      ];
      const its = U.items(el, L.map((l, i) => ({ text: l[0], color: l[1] })), { x: 120, y: 480, w: 740, kind: 'num', isz: 70, gap: 46, cls: 'h4' });
      its.rows.forEach((r, i) => { css(r.lastChild, { fontSize: '38px', fontWeight: 700 }); A(r, 'up', 0.45 + i * 0.12); });

      const W = U.win(el, { x: 900, y: 104, w: 900, h: 850, title: 'New issue · 버그 리포트' });
      A(W.el, 'left', 0.25, { d: 140, dur: 0.8 });
      const b = W.body; css(b, { padding: '30px 38px' });
      const sec = (label, y, color) => {
        const wrap = U.box(b, 38, y, 824);
        const lb = h('div', 'p1c-fl', wrap, label);
        css(lb, { color });
        return wrap;
      };
      const s1 = sec('제목', 30, 'var(--green)');
      const f1 = h('div', 'p1c-fd', s1); const f1t = h('span', '', f1); f1t.textContent = 'normalize_title("")에서 IndexError 발생';
      css(f1, { borderColor: 'var(--green)' });
      const s2 = sec('환경', 150, 'var(--blue)');
      const f2 = h('div', 'p1c-fd', s2); const f2t = h('span', '', f2); f2t.textContent = 'Python 3 · 표준 unittest · main 브랜치';
      const s3 = sec('재현 절차', 270, 'var(--blue)');
      const f3 = h('div', 'p1c-fd', s3); css(f3, { lineHeight: 1.6 });
      const steps = ['1. normalize_title("")을 호출합니다', '2. IndexError가 발생합니다', '3. 공백만 있는 입력도 같습니다'].map(x => { const d = h('div', '', f3); d.textContent = x; return d; });
      const s4 = sec('확인한 내용', 520, 'var(--teal)');
      const facts = [
        ['확인한 사실', 'var(--green-l)', 'var(--green-d)', '빈 문자열에서 매번 재현됩니다'],
        ['추측', 'var(--amber-l)', '#8A5A00', '첫 글자를 읽는 코드가 원인일 수 있습니다'],
      ].map((f, i) => {
        const r = h('div', '', s4); css(r, { display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '16px' });
        const cp = U.chip(r, f[0], { bg: f[1], fg: f[2] }); css(cp, { minWidth: '150px', justifyContent: 'center', fontSize: '25px' });
        const tx = h('span', '', r, f[3]); css(tx, { fontSize: '30px', fontWeight: 620, letterSpacing: '-.02em' });
        return r;
      });
      [s1, s2, s3, s4].forEach((x, i) => A(x, 'up', 0.55 + i * 0.12, { d: 30 }));
      A(f1t, 'type', 0.85, { cps: 46 });
      A(f2t, 'type', 1.55, { cps: 46 });
      steps.forEach((d, i) => A(d, 'type', 2.05 + i * 0.5, { cps: 50 }));
      facts.forEach((r, i) => A(r, 'left', 3.4 + i * 0.18, { d: 50 }));
      const btn = U.btn(b, 'Submit new issue', 'green', { x: 38, y: 690 }); css(btn, { height: '62px', fontSize: '26px' });
      A(btn, 'pop', 3.9);
    },
  });

  /* ───────── p.24 재현 절차와 최소 예제 ───────── */
  slide({
    id: 'p1c-minimal', part: 'p1', chap: CH, title: '재현 절차와 최소 예제', theme: 'white',
    notes: '프로젝트 전체에서 오류와 관계있는 파일만 남겨 최소 예제를 만든다. 남긴 것만으로 누구나 같은 오류를 볼 수 있어야 한다. 15개·3개는 도식의 타일 수다.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', '재현 절차와 최소 예제');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const icons = ['file', 'doc', 'code', 'folder', 'gear', 'doc', 'file', 'code', 'package', 'file', 'globe', 'term', 'doc', 'gear', 'file'];
      const keep = { 2: 0, 7: 1, 11: 2 };
      const tw = 100, th = 116, g = 16, X0 = 120, Y0 = 330;
      const target = [[892, 398], [1008, 398], [950, 530]];
      // 프로젝트 전체 영역을 판으로 깔아 타일이 빠진 뒤에도 자리가 보이게 한다
      const pan = U.box(el, 100, 310, 620, 420); css(pan, { background: '#EEF1F7', borderRadius: '26px', boxShadow: 'inset 0 0 0 2px rgba(15,27,61,.08)' }); A(pan, 'fade', 0.1);
      this.tiles = icons.map((ic, i) => {
        const c = i % 5, r = Math.floor(i / 5);
        const k = keep[i];
        const tl = U.box(el, X0 + c * (tw + g), Y0 + r * (th + g), tw, th);
        css(tl, { background: '#fff', borderRadius: '16px', boxShadow: '0 0 0 1.5px rgba(15,27,61,.09), 0 10px 20px -14px rgba(15,27,61,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        tl.appendChild(U.icon(ic, 50, k != null ? 'var(--blue)' : '#A6ACBD', 2));
        tl.k = k; tl.i = i; tl.x0 = X0 + c * (tw + g); tl.y0 = Y0 + r * (th + g);
        if (k != null) { tl.dx = target[k][0] - tl.x0; tl.dy = target[k][1] - tl.y0; }
        return tl;
      });
      const l1 = U.text(el, 'cap', '프로젝트 전체 <b style="color:var(--ink)">15개</b> 파일', 120, 744); css(l1, { fontSize: '28px' }); A(l1, 'fade', 0.5);
      const ar1 = U.arrow(el, [[712, 520], [850, 520]], { color: 'var(--green)', sw: 6 });
      A(ar1.path, 'draw', 1.4, { dur: 0.4 }); A(ar1.head, 'fade', 1.75, { dur: 0.2 });
      const mb = U.box(el, 872, 378, 256, 290);
      css(mb, { border: '4px dashed var(--blue)', borderRadius: '24px', background: 'rgba(47,107,255,.05)' });
      A(mb, 'pop', 1.3, { from: 0.8 });
      const l2 = U.text(el, 'cap', '최소 예제 3개', 852, 690, 296); css(l2, { fontSize: '28px', textAlign: 'center', color: 'var(--blue)', fontWeight: 800 }); A(l2, 'fade', 1.6);
      const ar2 = U.arrow(el, [[1146, 520], [1232, 520]], { color: 'var(--green)', sw: 6 });
      A(ar2.path, 'draw', 2.3, { dur: 0.35 }); A(ar2.head, 'fade', 2.6, { dur: 0.2 });
      const W = U.win(el, { x: 1250, y: 368, w: 550, h: 310, dark: true, title: 'python' });
      A(W.el, 'zoom', 2.35, { from: 1.1, dur: 0.6 });
      const tm = U.term(W.body, ['$ python', '> >>> normalize_title("")', 'er IndexError:', 'er string index out of range'], { size: 27 });
      css(tm.el, { padding: '22px 28px' });
      tm.rows.forEach((r, i) => A(r.cmd, 'type', 2.7 + i * 0.35, { cps: 60 }));
      const L = ['누구나 같은 결과를 확인하게 적습니다', '문제와 무관한 코드는 덜어냅니다', '실행 가능한 입력과 명령을 남깁니다'];
      L.forEach((txt, i) => {
        const b = U.box(el, 120 + i * 570, 812, 520); css(b, { display: 'flex', gap: '18px', alignItems: 'flex-start' });
        const sti = U.status(b, 'ok', 44); css(sti, { marginTop: '4px' });
        const t = h('div', '', b, txt); css(t, { fontSize: '34px', fontWeight: 700, lineHeight: 1.35, letterSpacing: '-.025em' });
        A(b, 'up', 0.4 + i * 0.1);
      });
    },
    render(t) {
      this.tiles.forEach(tl => {
        const pin = prog(t, 0.15 + tl.i * 0.03, 0.45, ease.pop);
        if (tl.k == null) {
          const q = prog(t, 1.0 + (tl.i % 5) * 0.04, 0.55, ease.inOutCubic);
          css(tl, { opacity: clamp(pin * 3) * lerp(1, 0.4, q), transform: `translate3d(0,${q * 14}px,0) scale(${lerp(0.4, 1, pin) * lerp(1, 0.9, q)})` });
        } else {
          const q = prog(t, 1.55 + tl.k * 0.12, 0.75, ease.swift);
          css(tl, { opacity: clamp(pin * 3), transform: `translate3d(${tl.dx * q}px,${tl.dy * q - Math.sin(q * Math.PI) * 60}px,0) scale(${lerp(0.4, 1, pin)})`, zIndex: 3 });
        }
      });
    },
  });

  /* ───────── p.25 새 이슈를 만들기 전 검색 ───────── */
  slide({
    id: 'p1c-search', part: 'p1', chap: CH, title: '새 이슈를 만들기 전 검색', theme: 'white',
    notes: '검색어가 입력되면 관계없는 이슈가 빠지고 열린 이슈 1건, 닫힌 이슈 2건이 남는다. 닫힌 이슈에서는 해결한 PR과 버전을, 열린 같은 이슈에는 댓글로 정보를 보탠다.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', '새 이슈를 만들기 전 <span class="hl">검색</span>');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const bar = U.box(el, 120, 292, 1680, 96);
      css(bar, { background: '#fff', borderRadius: '48px', boxShadow: '0 0 0 3px var(--ink), 0 18px 36px -24px rgba(15,27,61,.4)', display: 'flex', alignItems: 'center', gap: '22px', padding: '0 40px' });
      bar.appendChild(U.icon('search', 46, 'var(--ink)', 2.4));
      const q = h('span', 'mono', bar); q.textContent = 'is:issue IndexError'; css(q, { fontSize: '38px', fontWeight: 600 });
      const cnt = h('span', '', bar); css(cnt, { marginLeft: 'auto', fontSize: '28px', fontWeight: 700, color: 'var(--muted)' });
      this.cnt = cnt;
      A(bar, 'wipe', 0.3, { dur: 0.6 });
      A(q, 'type', 0.75, { cps: 22 });
      const data = [
        ['#41', '빈 문자열 입력 시 IndexError', 0, 1],
        ['#38', 'README 설치 명령 오타', 0, 0],
        ['#35', '다크 모드 색상 대비 개선', 0, 0],
        ['#29', '공백만 있는 제목에서 IndexError', 1, 1],
        ['#22', '테스트 실행 방법 문서화', 1, 0],
        ['#17', 'IndexError 오류 메시지 개선', 1, 1],
      ];
      let slot = 0;
      this.rows = data.map((d, i) => {
        const chips = d[0] === '#41' ? [['같은 문제 → 댓글로 보완', 'var(--green-l)', 'var(--green-d)', 'chat']]
          : d[0] === '#29' ? [['PR #30 병합', 'var(--violet-l)', '#5B3FD6', 'merge'], ['v1.2.1', '#EEF0F5', 'var(--ink)', 'tag']] : null;
        const r = row(el, { x: 120, y: 0, w: 1040, h: 76, num: d[0], title: d[1], closed: !!d[2], chips });
        r.i = i; r.match = !!d[3]; r.slot = d[3] ? slot++ : -1;
        (r.chips || []).forEach((c, j) => A(c, 'pop', 2.35 + j * 0.1));
        return r;
      });
      const S = [
        ['열린 이슈와 닫힌 이슈를 찾습니다', 'var(--green)'],
        ['관련 PR과 해결 버전을 확인합니다', 'var(--violet)'],
        ['같은 문제라면 정보를 보완합니다', 'var(--blue)'],
      ];
      S.forEach((x, i) => {
        const c = U.card(el, { x: 1220, y: 430 + i * 178, w: 580, h: 156, pad: 0 });
        css(c, { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 32px' });
        c.appendChild(U.num(null, i + 1, { size: 60, bg: x[1] }));
        const tx = h('div', '', c, x[0]); css(tx, { fontSize: '34px', fontWeight: 720, lineHeight: 1.32, letterSpacing: '-.025em' });
        A(c, 'left', 2.0 + i * 0.14, { d: 80 });
      });
    },
    render(t) {
      const q = prog(t, 1.75, 0.6, ease.swift);
      this.rows.forEach(r => {
        const pin = prog(t, 0.45 + r.i * 0.06, 0.5);
        const y0 = 430 + r.i * 88, y1 = 430 + Math.max(0, r.slot) * 88;
        if (r.match) css(r, { top: lerp(y0, y1, q) + 'px', opacity: clamp(pin * 2), transform: `translate3d(${(1 - pin) * 50}px,0,0)` });
        else css(r, { top: y0 + 'px', opacity: clamp(pin * 2) * (1 - q), transform: `translate3d(${(1 - pin) * 50 - q * 40}px,0,0) scale(${1 - q * 0.08})` });
      });
      const typed = t > 0.75;
      this.cnt.textContent = !typed ? '' : q > 0.5 ? '결과 3건' : '결과 6건';
      css(this.cnt, { color: q > 0.5 ? 'var(--green-d)' : 'var(--muted)' });
    },
  });

  /* ───────── p.26 Issue Template과 Issue Form ───────── */
  slide({
    id: 'p1c-template-form', part: 'p1', chap: CH, title: 'Issue Template과 Issue Form', theme: 'white', cls: 'dots',
    notes: 'Template(.md)은 자유롭게 적되 형식을 안내하고, Form(.yml)은 칸마다 입력을 받으며 필수 항목을 비우면 제출되지 않는다. 왼쪽 제목들이 오른쪽 입력 칸으로 옮겨 가는 것을 보여 준다.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', 'Issue Template과 Issue Form');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.025 });
      const L = U.win(el, { x: 120, y: 284, w: 720, h: 500, title: 'bug_report.md' });
      const R = U.win(el, { x: 1080, y: 284, w: 720, h: 500, title: 'bug_report.yml → 입력 폼' });
      A(L.el, 'up', 0.3, { d: 60 }); A(R.el, 'up', 0.45, { d: 60 });
      const md = [
        ['hd', '## 무엇이 문제인가요?'],
        ['cm', '<!-- 예상과 다른 동작 -->'],
        ['', ''],
        ['hd', '## 재현 방법'],
        ['', '1.'],
        ['', '2.'],
        ['hd', '## 실행 환경'],
      ];
      this.mdH = [];
      md.forEach((m, i) => {
        const d = h('div', 'p1c-md ' + m[0], L.body); d.textContent = m[1]; css(d, { top: (26 + i * 50) + 'px' });
        A(d, 'right', 0.55 + i * 0.05, { d: 30 });
        if (m[0] === 'hd') this.mdH.push({ y: 284 + 56 + 26 + i * 50, txt: m[1].replace('## ', '') });
      });
      // 오른쪽 폼
      const fields = [
        { y: 20, label: '무엇이 문제인가요? *', kind: 'input' },
        { y: 128, label: '재현 방법 *', kind: 'area' },
        { y: 320, label: '실행 환경', kind: 'select' },
      ];
      this.fl = []; this.fb = [];
      fields.forEach((f, i) => {
        const lb = U.text(R.body, 'p1c-fl', f.label, 34, f.y); css(lb, { fontSize: '25px', color: 'var(--ink)' });
        const fb = U.box(R.body, 34, f.y + 42, 652, f.kind === 'area' ? 96 : 60);
        css(fb, { background: '#F5F6F9', border: '2px solid #E3E6EE', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: '26px', fontWeight: 600, color: 'var(--muted)' });
        if (f.kind === 'area') { css(fb, { borderColor: 'var(--red)', background: '#FFF7F7' }); const er = U.text(R.body, '', '필수 항목입니다', 34, f.y + 144); css(er, { fontSize: '24px', fontWeight: 700, color: 'var(--red)' }); this.er = er; }
        if (f.kind === 'select') { fb.innerHTML = '<span>Python 3</span>'; const cv = U.icon('arrow', 30, 'var(--muted)', 2.4); css(cv, { marginLeft: 'auto', transform: 'rotate(90deg)' }); fb.appendChild(cv); }
        this.fl.push(lb); this.fb.push(fb);
        this.er && f.kind === 'area' && A(this.er, 'fade', 2.3);
      });
      // 날아가는 제목(왼쪽 → 오른쪽)
      this.fly = this.mdH.map((m, i) => {
        const f = U.text(el, 'mono', m.txt, 154, m.y); css(f, { fontSize: '27px', fontWeight: 700, color: 'var(--green-d)', background: 'var(--green-l)', borderRadius: '10px', padding: '2px 12px', whiteSpace: 'nowrap', zIndex: 5 });
        f.x0 = 154; f.y0 = m.y - 2; f.x1 = 1080 + 34 - 12; f.y1 = 284 + 56 + fields[i].y - 4;
        return f;
      });
      const ar = U.arrow(el, [[870, 534], [1050, 534]], { color: 'var(--green)', sw: 7 });
      A(ar.path, 'draw', 0.95, { dur: 0.4 }); A(ar.head, 'fade', 1.3, { dur: 0.2 });
      const c1 = U.text(el, 'h4', 'Template은 작성 형식을 안내합니다', 120, 802, 720); css(c1, { textAlign: 'center', fontSize: '36px' });
      const c2 = U.text(el, 'h4', 'Form은 필요한 입력을 받습니다', 1080, 802, 720); css(c2, { textAlign: 'center', fontSize: '36px' });
      A(c1, 'up', 0.7); A(c2, 'up', 2.0);
      const bn = U.box(el, 560, 880, 800, 72); css(bn, { background: 'var(--ink)', color: '#fff', borderRadius: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '32px', fontWeight: 750 });
      bn.appendChild(U.icon('check', 34, 'var(--mint)', 3)); h('span', '', bn, '재현 정보와 검증 근거를 채웁니다');
      A(bn, 'pop', 2.5, { from: 0.7 });
    },
    render(t) {
      this.fly.forEach((f, i) => {
        const q = prog(t, 1.05 + i * 0.22, 0.75, ease.swift);
        const arrive = prog(t, 1.05 + i * 0.22 + 0.7, 0.2, ease.linear);
        css(f, { left: lerp(f.x0, f.x1, q) + 'px', top: (lerp(f.y0, f.y1, q) - Math.sin(q * Math.PI) * 50) + 'px', opacity: q <= 0 ? 0 : 1 - arrive });
        css(this.fl[i], { opacity: arrive });
        css(this.fb[i], { opacity: prog(t, 1.05 + i * 0.22 + 0.6, 0.3), transform: `scaleX(${lerp(0.6, 1, prog(t, 1.05 + i * 0.22 + 0.6, 0.4))})`, transformOrigin: '0 50%' });
      });
    },
  });

  /* ───────── p.27 Label이 알려주는 정보 ───────── */
  slide({
    id: 'p1c-labels', part: 'p1', chap: CH, title: 'Label이 알려주는 정보', theme: 'white',
    notes: '라벨 세 개만 알아도 이슈 목록을 읽을 수 있다. good first issue는 첫 기여에 맞게 범위를 좁혀 둔 이슈라는 표시.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', 'Label이 <span class="hb">알려주는 정보</span>');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const R = [
        ['bug', 'bug', '예상과 다른 동작'],
        ['documentation', 'doc', '문서 보완'],
        ['good first issue', 'sparkle', '첫 기여에 적합'],
      ];
      R.forEach((r, i) => {
        const y = 330 + i * 200;
        const cp = U.chip(el, r[0], { size: 'xl', icon: r[1], x: 120, y });
        css(cp, { boxShadow: '0 16px 30px -18px rgba(15,27,61,.35)' });
        A(cp, 'stamp', 0.4 + i * 0.22, { dur: 0.5, r: i % 2 ? 10 : -10, from: 1.8 });
        const ln = U.box(el, 120, y + 47, 1000, 0);
        // 점선 이음선: 칩 끝에서 정의까지
        const lineX = [380, 640, 690][i];
        const dl = U.box(el, lineX, y + 46, 900 - lineX, 4); css(dl, { backgroundImage: 'linear-gradient(90deg, #C9CEDA 50%, transparent 50%)', backgroundSize: '18px 4px' });
        A(dl, 'grow', 0.7 + i * 0.22, { dur: 0.5 });
        const df = U.text(el, '', r[2], 930, y + 6, 870); css(df, { fontSize: '72px', fontWeight: 860, letterSpacing: '-.04em', color: 'var(--ink)', whiteSpace: 'nowrap' });
        A(df, 'chars', 0.85 + i * 0.22, { each: 0.04 });
      });
    },
  });

  /* ───────── p.28 good first issue를 고를 때 ───────── */
  slide({
    id: 'p1c-gfi', part: 'p1', chap: CH, title: 'good first issue를 고를 때', theme: 'white', cls: 'dots',
    notes: '가운데 이슈 하나에서 세 가지를 확인한다: 범위와 완료 조건, 내 컴퓨터에서 실행 환경을 준비할 수 있는지, 이미 진행 중인 PR이 있는지.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', '<span class="hl">good first issue</span>를 고를 때');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.025 });
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible' }, el);
      const C = [960, 560];
      const ends = [[560, 560], [1360, 380], [1360, 760]];
      this.lines = ends.map((e, i) => {
        const p = s('path', { d: `M${C[0]} ${C[1]} L${e[0]} ${e[1]}`, stroke: ['var(--green)', 'var(--blue)', 'var(--violet)'][i], 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, svg);
        A(p, 'draw', 0.75 + i * 0.12, { dur: 0.5 });
        return p;
      });
      this.pulses = ends.map((e, i) => s('circle', { cx: C[0], cy: C[1], r: 9, fill: ['var(--green)', 'var(--blue)', 'var(--violet)'][i] }, svg));
      this.C = C; this.ends = ends;
      // 가운데 이슈 카드
      const cc = U.card(el, { x: 700, y: 430, w: 520, h: 260, pad: 34 });
      css(cc, { boxShadow: '0 0 0 4px var(--green), 0 30px 60px -24px rgba(15,27,61,.4)', zIndex: 2 });
      const top = h('div', '', cc); css(top, { display: 'flex', alignItems: 'center', gap: '14px' });
      top.appendChild(U.icon('issue', 40, 'var(--green)', 2.4));
      const nm = h('span', 'mono', top, '#38 · Open'); css(nm, { fontSize: '26px', color: 'var(--muted)' });
      const tt = h('div', '', cc, 'README 설치 명령 수정'); css(tt, { fontSize: '38px', fontWeight: 800, letterSpacing: '-.03em', marginTop: '16px' });
      const lb = h('div', '', cc); css(lb, { display: 'flex', gap: '10px', marginTop: '20px' });
      U.chip(lb, 'good first issue'); U.chip(lb, 'documentation');
      A(cc, 'pop', 0.3, { from: 0.7, dur: 0.6 });
      // 위성 카드 3개
      const sat = [
        { x: 120, y: 450, w: 440, color: 'var(--green)', txt: '범위와 완료 조건을 읽습니다' },
        { x: 1360, y: 250, w: 440, color: 'var(--blue)', txt: '실행 환경을 준비할 수 있는지 봅니다' },
        { x: 1360, y: 640, w: 440, color: 'var(--violet)', txt: '진행 중인 PR이 있는지 확인합니다' },
      ];
      sat.forEach((o, i) => {
        const c = U.card(el, { x: o.x, y: o.y, w: o.w, h: 240, pad: 30 });
        css(c, { borderTop: `8px solid ${o.color}` });
        const vis = h('div', '', c); css(vis, { height: '82px', display: 'flex', alignItems: 'center', gap: '14px' });
        if (i === 0) {
          [['plus', 'var(--green)'], ['minus', 'var(--red)'], ['pen', 'var(--blue)']].forEach(x => { const b = U.badge(vis, x[0], { size: 60, bg: '#F2F4F8', fg: x[1], square: true }); });
          const f = h('span', 'mono', vis, 'README.md'); css(f, { fontSize: '24px', color: 'var(--muted)', marginLeft: '6px' });
        } else if (i === 1) {
          const tb = h('div', 'mono', vis, '>_  설치 · 실행 · 테스트'); css(tb, { background: '#0E1530', color: 'var(--mint)', borderRadius: '12px', padding: '14px 20px', fontSize: '24px', fontWeight: 600, width: '100%' });
        } else {
          const pr = h('div', '', vis); css(pr, { display: 'flex', alignItems: 'center', gap: '12px', background: '#F4F1FF', borderRadius: '12px', padding: '12px 18px', width: '100%' });
          pr.appendChild(U.icon('pr', 34, 'var(--violet)', 2.4));
          const pt = h('span', '', pr, 'PR #42 · Open'); css(pt, { fontSize: '26px', fontWeight: 750 });
          const cm = U.icon('chat', 28, 'var(--muted)', 2.2); css(cm, { marginLeft: 'auto' }); pr.appendChild(cm);
          h('span', 'mono', pr, '4').style.cssText = 'font-size:24px;color:var(--muted)';
        }
        const tx = h('div', '', c, o.txt); css(tx, { fontSize: '33px', fontWeight: 760, lineHeight: 1.3, letterSpacing: '-.025em', marginTop: '14px' });
        A(c, i === 0 ? 'right' : 'left', 1.05 + i * 0.14, { d: 70 });
      });
    },
    render(t) {
      this.pulses.forEach((p, i) => {
        const u = ((t - 1.6 - i * 0.5) % 2.4 + 2.4) % 2.4 / 1.6;
        const on = t > 1.6 && u < 1;
        const q = ease.inOutCubic(clamp(u));
        p.setAttribute('cx', lerp(this.C[0], this.ends[i][0], q));
        p.setAttribute('cy', lerp(this.C[1], this.ends[i][1], q));
        p.style.opacity = on ? Math.sin(clamp(u) * Math.PI) : 0;
      });
    },
  });

  /* ───────── p.29 Assignee와 작업 의사 확인 ───────── */
  slide({
    id: 'p1c-assignee', part: 'p1', chap: CH, title: 'Assignee와 작업 의사 확인', theme: 'white',
    notes: '이슈 오른쪽 사이드바의 Assignees와 최근 댓글부터 본다. 담당자가 있으면 작업 의사를 댓글로 묻고, 프로젝트가 정한 참여 방식(예: 먼저 댓글로 요청)을 따른다.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', 'Assignee와 작업 의사 확인');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const W = U.win(el, { x: 120, y: 292, w: 720, h: 660, title: 'Issue #41 · 사이드바' });
      A(W.el, 'right', 0.25, { d: 100, dur: 0.8 });
      const b = W.body;
      const sec = (y, label) => { const l = U.text(b, 'p1c-fl', label, 40, y); css(l, { fontSize: '25px' }); const ln = U.box(b, 40, y - 18, 640, 2); css(ln, { background: '#ECEEF3' }); return l; };
      sec(34, 'Assignees');
      const asg = U.box(b, 40, 80, 600); css(asg, { display: 'flex', alignItems: 'center', gap: '16px' });
      const av = U.avatar(asg, 'K', 'var(--blue)', 60); const an = h('span', '', asg, 'kim'); css(an, { fontSize: '32px', fontWeight: 750 });
      A(av, 'pop', 0.9); A(an, 'right', 1.0, { d: 20 });
      this.ring = U.box(b, 22, 18, 676, 140); css(this.ring, { border: '4px solid var(--green)', borderRadius: '18px' });
      A(this.ring, 'pop', 1.25, { from: 1.15, dur: 0.45 });
      sec(198, 'Labels'); const lc = U.chip(b, 'good first issue', { x: 40, y: 240 });
      sec(326, 'Projects'); const pj = U.text(b, '', '할 일 → <b>진행 중</b>', 40, 368); css(pj, { fontSize: '30px', fontWeight: 600 });
      sec(452, '최근 댓글');
      const cm = U.box(b, 40, 494, 640); css(cm, { background: '#F5F6F9', borderRadius: '16px', padding: '18px 22px' });
      const ch = h('div', '', cm); css(ch, { fontSize: '24px', fontWeight: 700, color: 'var(--muted)' }); ch.textContent = 'kim · 2일 전';
      const cb = h('div', '', cm); css(cb, { fontSize: '30px', fontWeight: 650, marginTop: '6px' }); cb.textContent = '이번 주에 이 이슈를 작업하겠습니다';
      A([lc, pj], 'fade', 0.7, { each: 0.1 });
      A(cm, 'up', 1.45, { d: 30 }); A(cb, 'type', 1.7, { cps: 40 });
      const its = U.items(el, [
        { icon: 'users', text: '담당자와 최근 댓글을 확인합니다', color: 'var(--green)' },
        { icon: 'doc', text: '중복 작업 여부를 살펴봅니다', color: 'var(--blue)' },
        { icon: 'shield', text: '프로젝트의 참여 정책을 따릅니다', color: 'var(--ink)' },
      ], { x: 940, y: 316, w: 860, isz: 88, gap: 40, cls: 'b1' });
      its.rows.forEach((r, i) => { css(r.lastChild, { fontWeight: 720 }); A(r, 'left', 0.5 + i * 0.15, { d: 80 }); });
      // 중복 작업 도식
      const dg = U.box(el, 940, 752, 860, 190);
      css(dg, { background: '#FFF6E6', borderRadius: '24px', boxShadow: '0 0 0 2px #F5D9A3' });
      const a1 = U.avatar(dg, 'K', 'var(--blue)', 64); U.place(a1, 40, 30);
      const a2 = U.avatar(dg, 'Y', 'var(--green)', 64); U.place(a2, 40, 104);
      const dsvg = s('svg', { width: 860, height: 190, style: 'position:absolute;left:0;top:0' }, dg);
      [62, 136].forEach(y => { const p = s('path', { d: `M120 ${y} C 200 ${y}, 200 95, 262 95`, stroke: '#C98A1A', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '1 1', pathLength: 1 }, dsvg); A(p, 'draw', 2.0, { dur: 0.5 }); });
      const dc = U.badge(dg, 'doc', { size: 76, bg: '#fff', fg: 'var(--ink)', square: true }); U.place(dc, 266, 57);
      const wn = U.badge(dg, 'warn', { size: 44, bg: 'var(--amber)', fg: '#fff' }); U.place(wn, 322, 40);
      const dt = U.text(dg, '', '같은 이슈를 두 사람이 따로 고치면<br>한쪽 작업이 쓰이지 못합니다', 390, 44, 440); css(dt, { fontSize: '29px', fontWeight: 700, lineHeight: 1.4, color: '#7A4E00' });
      A(dg, 'up', 1.8, { d: 40 }); A(wn, 'stamp', 2.4); A(dt, 'fade', 2.3);
    },
  });

  /* ───────── p.30 Issue 댓글로 협의하는 방법 ───────── */
  slide({
    id: 'p1c-comment', part: 'p1', chap: CH, title: 'Issue 댓글로 협의하는 방법', theme: 'white',
    notes: '오른쪽은 같은 이슈에 남기는 댓글 세 개의 예. 확인한 결과 → 구체적인 질문 → 제안할 범위와 이유 순서로 쓰면 유지보수자가 바로 답할 수 있다.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', 'Issue 댓글로<br>협의하는 방법', { w: 760 });
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.035 });
      const G = [
        ['var(--green)', '확인한 결과를 먼저 적습니다', 'main 브랜치에서 빈 문자열로 재현했습니다. 공백만 있는 입력도 같은 오류가 납니다.'],
        ['var(--blue)', '모르는 점은 구체적으로 묻습니다', '빈 입력이면 빈 문자열을 돌려주는 것이 기대 동작이 맞을까요?'],
        ['var(--ink)', '제안한 범위와 이유를 설명합니다', 'normalize_title과 테스트만 고치겠습니다. 다른 함수는 동작이 달라질 수 있어 이번 범위에서 뺍니다.'],
      ];
      this.left = G.map((g, i) => {
        const b = U.box(el, 120, 420 + i * 132, 740); css(b, { display: 'flex', alignItems: 'center', gap: '22px' });
        const d = h('i', '', b); css(d, { width: '26px', height: '26px', borderRadius: '50%', background: g[0], flex: 'none' });
        const t = h('div', '', b, g[1]); css(t, { fontSize: '38px', fontWeight: 750, letterSpacing: '-.025em' });
        A(b, 'up', 0.45 + i * 0.1);
        return b;
      });
      const ln = U.box(el, 942, 130, 4, 680); css(ln, { background: '#E3E6EE' }); A(ln, 'grow', 0.5, { axis: 'y', origin: '50% 0%', dur: 1.2 });
      const ys = [120, 360, 590];
      this.bubs = G.map((g, i) => {
        const av = U.avatar(el, 'Y', g[0], 64); U.place(av, 912, ys[i] + 20); A(av, 'pop', 0.9 + i * 0.55);
        const bb = h('div', 'p1c-bub', el); U.place(bb, 1000, ys[i], 800);
        css(bb, { borderLeft: `8px solid ${g[0]}` });
        const hd = h('div', 'bh', bb); h('span', '', hd, 'you'); const dt = h('span', '', hd, '· 방금'); css(dt, { fontWeight: 500 });
        const body = h('div', 'bb', bb, g[2]);
        A(bb, 'left', 1.0 + i * 0.55, { d: 60 });
        return bb;
      });
      const cp = U.box(el, 1000, 846, 800, 92); css(cp, { background: '#fff', borderRadius: '18px', boxShadow: '0 0 0 2px #E3E6EE', display: 'flex', alignItems: 'center', padding: '0 14px 0 28px', gap: '16px' });
      const ph = h('span', '', cp, '댓글을 남겨 주세요'); css(ph, { fontSize: '28px', color: '#A6ACBD', fontWeight: 550 });
      const bt = U.btn(cp, 'Comment', 'green'); css(bt, { marginLeft: 'auto', height: '62px', fontSize: '26px' });
      A(cp, 'up', 2.5, { d: 30 });
    },
    render(t) {
      this.left.forEach((b, i) => {
        const on = prog(t, 1.0 + i * 0.55, 0.3);
        const nx = prog(t, 1.0 + (i + 1) * 0.55, 0.3);
        const act = i < 2 ? on * (1 - nx) : on;
        css(b.lastChild, { color: act > 0.5 && t < 3.0 ? 'var(--ink)' : 'var(--ink)', opacity: t < 3.0 ? lerp(0.45, 1, act) : 1 });
      });
    },
  });

  /* ───────── p.31 Projects와 Milestone ───────── */
  slide({
    id: 'p1c-projects', part: 'p1', chap: CH, title: 'Projects와 Milestone', theme: 'white',
    notes: 'Projects 보드에서 카드가 할 일 → 진행 중 → 검토 중으로 옮겨 간다. Milestone은 v1.3에 들어갈 이슈와 PR을 묶어 진행률을 보여 준다.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', 'Projects와 Milestone');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const S = [
        ['var(--green)', 'Projects는 작업 상태를 모아 봅니다'],
        ['var(--blue)', 'Milestone은 관련 이슈와 PR을 묶습니다'],
        ['var(--ink)', '담당자와 진행 상태를 공유합니다'],
      ];
      S.forEach((x, i) => {
        const b = U.box(el, 120 + i * 572, 294, 540); css(b, { borderLeft: `6px solid ${x[0]}`, paddingLeft: '22px', fontSize: '32px', fontWeight: 720, lineHeight: 1.35, letterSpacing: '-.025em' });
        b.innerHTML = x[1]; A(b, 'up', 0.35 + i * 0.1);
      });
      const K = U.win(el, { x: 120, y: 420, w: 1110, h: 534, title: 'Projects · 보드' });
      A(K.el, 'up', 0.5, { d: 60 });
      const cols = ['할 일', '진행 중', '검토 중'];
      this.colX = cols.map((c, i) => 28 + i * 360);
      this.cnt = cols.map((c, i) => {
        const col = U.box(K.body, 28 + i * 360, 22, 336, 450); css(col, { background: '#F4F5F8', borderRadius: '16px' });
        const hd = U.text(col, '', c, 20, 16); css(hd, { fontSize: '27px', fontWeight: 800 });
        const n = U.text(col, 'mono', '', 296, 18); css(n, { fontSize: '24px', color: 'var(--muted)' });
        return n;
      });
      const cards = [
        [0, 0, 'README 설치 예시 보완', '#38', 'P'],
        [0, 1, '테스트 명령 문서화', '#22', 'L'],
        [1, 0, 'Label 정리', '#44', 'K'],
        [2, 0, '다크 모드 대비 개선', '#35', 'J'],
      ];
      const mk = (parent, x, y, title, num, who, col) => {
        const c = h('div', 'p1c-kcard', parent); U.place(c, x, y, 296);
        h('div', 'kt', c, title);
        const m = h('div', 'km', c); h('span', '', m, num); const av = U.avatar(m, who, col || 'var(--blue)', 34); css(av, { marginLeft: 'auto', fontSize: '17px' });
        return c;
      };
      cards.forEach((c, i) => { const e = mk(K.body, 48 + c[0] * 360, 92 + c[1] * 132, c[2], c[3], c[4]); A(e, 'up', 0.8 + i * 0.07, { d: 30 }); });
      this.mover = mk(K.body, 48, 92 + 2 * 132, '빈 입력 IndexError', '#41', 'Y', 'var(--green)');
      css(this.mover, { boxShadow: '0 0 0 3px var(--green), 0 20px 30px -16px rgba(15,27,61,.45)', zIndex: 3 });
      this.base = [[48, 92 + 2 * 132], [48 + 360, 92 + 1 * 132], [48 + 720, 92 + 1 * 132]];
      // Milestone
      const M = U.win(el, { x: 1290, y: 420, w: 510, h: 534, title: 'Milestone' });
      A(M.el, 'up', 0.65, { d: 60 });
      const mt = U.text(M.body, '', 'v1.3', 34, 26); css(mt, { fontSize: '44px', fontWeight: 880 });
      const pc = U.text(M.body, 'mono', '4 / 5 완료', 300, 40); css(pc, { fontSize: '26px', color: 'var(--muted)' });
      const pb = U.box(M.body, 34, 100, 440, 16); css(pb, { background: '#ECEEF3', borderRadius: '8px', overflow: 'hidden' });
      const pf = U.box(pb, 0, 0, 352, 16); css(pf, { background: 'var(--green)', borderRadius: '8px' });
      A(pf, 'grow', 1.2, { dur: 1.0, ease: ease.outCubic });
      const list = [['ok', '#38 README 보완'], ['ok', '#35 대비 개선'], ['ok', '#30 IndexError 수정'], ['ok', '#22 테스트 문서'], ['wait', '#41 빈 입력 처리']];
      list.forEach((l, i) => {
        const r = U.box(M.body, 34, 146 + i * 62, 440); css(r, { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '27px', fontWeight: 650 });
        r.appendChild(U.status(null, l[0], 36)); h('span', '', r, l[1]);
        A(r, 'right', 1.0 + i * 0.08, { d: 30 });
      });
    },
    render(t, S) {
      // 카드 이동 주기: 할 일 → 진행 중 → 검토 중 (6초), 마지막 상태는 검토 중
      let pos;
      if (S.final) pos = 2;
      else {
        const u = t < 1.6 ? 0 : ((t - 1.6) % 6.4);
        pos = u < 1.2 ? 0 : u < 2.0 ? (u - 1.2) / 0.8 : u < 3.4 ? 1 : u < 4.2 ? 1 + (u - 3.4) / 0.8 : u < 5.9 ? 2 : 2 + (u - 5.9) / 0.5;
      }
      const seg = Math.min(1, Math.floor(pos)), f = pos >= 2 ? Math.min(1, pos - 2) : ease.swift(pos - seg);
      let x, y, op = 1;
      if (pos >= 2) { [x, y] = this.base[2]; op = 1 - f; if (f > 0) { [x, y] = this.base[2]; } }
      else { x = lerp(this.base[seg][0], this.base[seg + 1][0], f); y = lerp(this.base[seg][1], this.base[seg + 1][1], f) - Math.sin(f * Math.PI) * 40; }
      if (pos >= 2 && pos > 2.4) op = 0;
      const pin = prog(t, 1.0, 0.5);
      css(this.mover, { left: x + 'px', top: y + 'px', opacity: Math.min(op, pin) + (pos > 2.45 ? 0 : 0), transform: `rotate(${(pos % 1 > 0 && pos < 2) ? Math.sin((pos % 1) * Math.PI) * 3 : 0}deg)` });
      const col = pos < 0.5 ? 0 : pos < 1.5 ? 1 : 2;
      const n = [2, 1, 1]; n[col] += 1;
      this.cnt.forEach((c, i) => c.textContent = n[i]);
    },
  });

  /* ───────── p.32 완료 조건을 적는 방법 ───────── */
  slide({
    id: 'p1c-done', part: 'p1', chap: CH, title: '완료 조건을 적는 방법', theme: 'white', cls: 'dots',
    notes: '완료 조건은 "언제 끝났다고 할지"를 미리 정하는 문장이다. 정상 입력과 빈 입력의 기대 결과, 확인할 명령까지 적어 두면 리뷰와 테스트가 같은 기준을 쓴다.',
    build(el, A) {
      const T = U.title(el, '1C · Issue', '완료 조건을 적는 방법');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const rows = [
        ['변경 후 동작을<br>구체적으로 정합니다', 'var(--green)'],
        ['정상 입력과 경계 입력을<br>확인합니다', 'var(--blue)'],
        ['검증할 명령과 결과를<br>적습니다', 'var(--ink)'],
      ];
      const Y = [292, 506, 720];
      rows.forEach((r, i) => {
        const bg = U.box(el, 120, Y[i], 1680, 196); css(bg, { background: '#fff', borderRadius: '26px', boxShadow: '0 0 0 1.5px rgba(15,27,61,.07), 0 18px 36px -26px rgba(15,27,61,.35)' });
        A(bg, 'wipe', 0.35 + i * 0.3, { dur: 0.6 });
        const nb = U.num(el, i + 1, { size: 64, bg: r[1], x: 156, y: Y[i] + 66 });
        const lt = U.text(el, '', r[0], 252, Y[i] + 46, 520); css(lt, { fontSize: '36px', fontWeight: 760, lineHeight: 1.3, letterSpacing: '-.025em' });
        A(nb, 'pop', 0.5 + i * 0.3); A(lt, 'up', 0.55 + i * 0.3, { d: 24 });
      });
      // 1행: 기대 동작
      const r1 = U.box(el, 820, Y[0] + 50, 940, 96); css(r1, { display: 'flex', alignItems: 'center', gap: '22px' });
      const cb = U.status(r1, 'ok', 56); const r1t = h('span', '', r1, '빈 입력이면 빈 문자열을 반환합니다'); css(r1t, { fontSize: '44px', fontWeight: 840, letterSpacing: '-.035em' });
      A(r1, 'right', 0.75, { d: 40 }); A(cb, 'stamp', 1.2);
      // 2행: 정상 입력 / 빈 입력
      const io = [
        ['정상 입력', 'normalize_title("hello world")', '"Hello world"', ''],
        ['빈 입력', 'normalize_title("")', '""', '빈 문자열 반환'],
      ];
      io.forEach((x, i) => {
        const c = U.box(el, 820 + i * 480, Y[1] + 22, 456, 152); css(c, { background: '#F5F6F9', borderRadius: '18px', padding: '16px 22px' });
        const hd = h('div', '', c); css(hd, { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '25px', fontWeight: 800, color: 'var(--muted)' });
        h('span', '', hd, x[0]); const sti = U.status(hd, 'ok', 32); css(sti, { marginLeft: 'auto' });
        const cl = h('div', 'mono', c); cl.textContent = x[1]; css(cl, { fontSize: '24px', fontWeight: 600, marginTop: '10px', whiteSpace: 'nowrap', letterSpacing: '-.03em' });
        const out = h('div', 'mono', c); out.innerHTML = `→ <b style="color:var(--green-d)">${x[2]}</b>` + (x[3] ? `<span style="font-family:var(--sans);font-weight:700;color:var(--green-d);margin-left:14px">${x[3]}</span>` : ''); css(out, { fontSize: '26px', marginTop: '8px' });
        A(c, 'up', 1.05 + i * 0.15, { d: 30 }); A(sti, 'stamp', 1.5 + i * 0.15);
      });
      // 3행: 명령
      const tb = U.box(el, 820, Y[2] + 30, 940, 136); css(tb, { background: '#0E1530', borderRadius: '18px', padding: '18px 28px' });
      const tm = U.term(tb, ['$ python -m unittest discover -s tests -v', 'ok OK'], { size: 28 });
      A(tb, 'up', 1.6, { d: 30 }); tm.rows.forEach((r, i) => A(r.cmd, 'type', 1.85 + i * 1.05, { cps: 48 }));
    },
  });

  /* ───────── 쉬는 시간 ───────── */
  slide({
    id: 'p1c-break', part: 'p1', chap: '쉬는 시간', title: '쉬는 시간 (10분)', theme: 'paper',
    notes: '10분 휴식. Pull Request부터 다시 시작. 카운트다운은 이 화면에 들어온 순간부터 줄어든다.',
    build(el, A) { this.b = UI.breakCover(el, A, { resume: '10분 뒤', next: 'Pull Request부터 이어서' }); },
    render(t, S) { this.b.update(t, S); },
  });
})();
