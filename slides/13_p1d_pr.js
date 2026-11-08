/* Part 1 · Chapter 1D — Pull Request·리뷰·CI (원본 p.33~p.46)
 * 아트 디렉션: 장을 여는 첫 장만 잉크 바탕, 나머지는 흰 바탕. Diff 줄이 줄 단위로 밀려 들어오고, 검사 상태가 돌다가 체크로 바뀐다. */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, count, noise } = DECK;
  const U = UI;
  const CH = '1D Pull Request·리뷰·CI';

  /* ---------- 이 장에서만 쓰는 스타일 ---------- */
  const st = document.createElement('style');
  st.textContent = `
  .p1d-state { display:inline-flex; align-items:center; gap:10px; height:50px; padding:0 22px 0 16px; border-radius:25px; font-weight:750; font-size:26px; color:#fff; white-space:nowrap; }
  .p1d-lab { font-size:24px; font-weight:750; color:#7B8299; letter-spacing:0; }
  .p1d-field { position:absolute; border:2.5px solid #D7DBE5; border-radius:14px; background:#fff; }
  .p1d-file { position:absolute; display:flex; align-items:center; gap:14px; height:60px; padding:0 20px; border-radius:12px; font-family:var(--mono); font-size:26px; font-weight:500; white-space:nowrap; }
  .p1d-file .n { flex:1; } .p1d-file .a { color:var(--green-d); font-weight:700; } .p1d-file .d { color:#C93434; font-weight:700; }
  .p1d-mk { display:inline-flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%; background:var(--ink); color:#fff; font-family:var(--num); font-size:28px; flex:none; }
  .p1d-mk.g { background:var(--green); } .p1d-mk.b { background:var(--blue); } .p1d-mk.r { background:var(--red); } .p1d-mk.a { background:var(--amber); }
  .p1d-row { position:absolute; display:flex; align-items:center; gap:22px; }
  .p1d-cap { font-size:34px; font-weight:650; letter-spacing:-.02em; line-height:1.4; color:var(--ink); }
  .p1d-stack { position:relative; display:inline-block; flex:none; }
  .p1d-stack > * { position:absolute; left:0; top:0; }
  .p1d-log { font-family:var(--mono); font-size:25px; line-height:1; color:#C9D1E6; }
  .p1d-log .ln { height:50px; display:flex; align-items:center; padding:0 26px; white-space:pre; }
  .p1d-log .ln.er { color:#FF9A9A; } .p1d-log .ln.ok { color:var(--mint); } .p1d-log .ln.dim { color:#7F8AAD; }
  .p1d-ring { position:absolute; border-radius:22px; border:5px solid var(--blue); pointer-events:none; }
  `;
  document.head.appendChild(st);

  /* ---------- 조각 ---------- */
  const STATE = {
    draft: ['Draft', '#6E7781', 'pr'], open: ['Open', 'var(--green)', 'pr'], merged: ['Merged', 'var(--violet)', 'merge'],
    issue: ['Open', 'var(--green)', 'issue'], closed: ['Closed', 'var(--violet)', 'closed'],
  };
  function state(parent, kind, x, y) {
    const [t, c, ic] = STATE[kind];
    const b = h('span', 'p1d-state', parent); css(b, { background: c });
    b.appendChild(U.icon(ic, 30, '#fff', 2.4)); h('span', '', b, t);
    if (x != null) U.place(b, x, y);
    return b;
  }
  function ttl(el, A, html, o = {}) {
    const T = U.title(el, o.k || null, html, { cls: o.cls || 'h2', y: o.y ?? 92, x: o.x, w: o.w, align: o.align });
    if (T.k) A(T.k, 'right', 0);
    A(T.t, 'chars', 0.05, { each: 0.022, dur: 0.55 });
    return T;
  }
  function file(parent, name, add, del, x, y, w, o = {}) {
    const r = h('div', 'p1d-file', parent);
    U.place(r, x, y, w);
    const ic = U.icon(o.icon || 'file', 30, o.ic || '#8A90A6', 2.2); r.appendChild(ic);
    const n = h('span', 'n', r); n.textContent = name;
    if (add != null) { const a = h('span', 'a', r, '+' + add); }
    if (del != null) { const d = h('span', 'd', r, '−' + del); }
    if (o.bg) css(r, { background: o.bg });
    return r;
  }
  /* 상태 아이콘 두 개를 겹쳐 두고 시각에 따라 바꾼다 */
  function swap(parent, from, to, size = 44) {
    const w = h('span', 'p1d-stack', parent); css(w, { width: size + 'px', height: size + 'px' });
    const a = U.status(w, from, size), b = U.status(w, to, size);
    return {
      el: w, a, b,
      set(p, t = 0) { // p: 0 = from, 1 = to
        css(a, { opacity: 1 - clamp(p * 3), transform: from === 'run' ? `rotate(${t * 300}deg)` : 'none' });
        css(b, { opacity: clamp(p * 3), transform: `scale(${p >= 1 ? 1 : lerp(1.8, 1, clamp(p))})` });
      },
    };
  }
  function mk(parent, n, cls = '') { const m = h('span', 'p1d-mk ' + cls, parent, String(n)); return m; }
  function sentence(parent, html, x, y, w, size = 34) {
    const e = U.text(parent, 'p1d-cap', html, x, y, w); css(e, { fontSize: size + 'px' }); return e;
  }

  /* 1. Pull Request의 의미 (p.33) — 장 여는 화면 */
  slide({
    id: 'p1d-pr-meaning', part: 'p1', chap: CH, title: 'Pull Request의 의미', theme: 'ink', cls: 'dots',
    notes: 'PR은 변경을 합치자는 제안입니다. 오른쪽 카드처럼 설명, Diff, 검사 결과가 한곳에 모이고, 검토한 사람이 반영 여부를 정합니다. "PR = 코드 업로드"가 아니라는 점을 강조합니다.',
    build(el, A) {
      const T = U.title(el, 'Chapter 1D · Pull Request·리뷰·CI', 'Pull Request의 의미', { cls: 'h1' });
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const big = U.text(el, '', 'PR은 변경을<br><span class="hl">합치자는 제안</span>입니다', 120, 340, 860);
      css(big, { fontSize: '84px', fontWeight: 860, letterSpacing: '-.04em', lineHeight: 1.16, color: '#fff' });
      A(big, 'chars', 0.4, { each: 0.03 });
      const L = U.items(el, [{ text: '설명과 Diff와 검사 결과를 모읍니다', icon: 'doc' }, { text: '검토 후 반영 여부를 결정합니다', icon: 'eye' }], { x: 120, y: 620, w: 860, isz: 64, cls: 'b1', color: 'var(--green)', gap: 30 });
      L.rows.forEach((r, i) => A(r, 'up', 1.0 + i * 0.12));
      // 오른쪽: PR 카드
      const W = U.win(el, { x: 1040, y: 280, w: 760, h: 620, title: 'Pull request #13' });
      css(W.el, { background: '#fff', color: 'var(--ink)' });
      A(W.el, 'flipY', 0.5, { dur: 0.8 });
      const b = W.body;
      const sb = state(b, 'open', 30, 26);
      const tt = U.text(b, '', 'docs: README 설치 명령 수정', 200, 30, 520); css(tt, { fontSize: '30px', fontWeight: 800, whiteSpace: 'nowrap' });
      const l1 = U.text(b, 'p1d-lab', '설명', 32, 106); const d1 = U.text(b, '', '설치 명령이 현재 버전과 달라 고칩니다', 32, 138, 700); css(d1, { fontSize: '27px', fontWeight: 550 });
      const l2 = U.text(b, 'p1d-lab', 'Diff', 32, 204);
      const D = U.diff(b, [['-', 'python setup.py install'], ['+', 'pip install .']], { x: 22, y: 238, w: 716, size: 25, rowH: 50 });
      const l3 = U.text(b, 'p1d-lab', '검사 결과', 32, 360);
      const chk = U.box(b, 30, 396, 700); css(chk, { display: 'flex', gap: '26px' });
      const stamps = ['build', 'test', 'lint'].map(n => { const c = h('span', '', chk); css(c, { display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--mono)', fontSize: '26px', fontWeight: 600 }); const s1 = U.status(c, 'ok', 38); h('span', '', c, n); return s1; });
      const foot = U.box(b, 0, 470, 760, 94); css(foot, { borderTop: '1.5px solid rgba(15,27,61,.08)', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 30px' });
      foot.appendChild(U.avatar(null, 'R', 'var(--blue)', 50));
      const ft = h('span', '', foot, '리뷰어가 검토하고 반영을 결정'); css(ft, { fontSize: '25px', fontWeight: 650, flex: 1 });
      this.mb = U.btn(foot, 'Merge', 'green', { icon: 'merge', is: 28 }); css(this.mb, { height: '58px', fontSize: '26px', padding: '0 24px' });
      A(sb, 'pop', 0.85); A(tt, 'up', 0.9, { d: 20 });
      [l1, d1, l2].forEach((e, i) => A(e, 'up', 1.0 + i * 0.08, { d: 20 }));
      A(D.rows, 'left', 1.25, { each: 0.12, d: 60 });
      A(l3, 'up', 1.45, { d: 20 });
      A(stamps, 'stamp', 1.55, { each: 0.12, dur: 0.45 });
      A(foot, 'up', 1.9, { d: 20 });
    },
    render(t) { const p = 0.5 + 0.5 * Math.sin(t * 2.4); css(this.mb, { boxShadow: t > 2.3 ? `0 0 0 ${4 + p * 6}px rgba(18,176,122,${0.25 - p * 0.15})` : 'none' }); },
  });

  /* 2. PR을 만들기 전 확인 (p.34) — 3단 카드, 카드마다 확인 도장 */
  slide({
    id: 'p1d-before-pr', part: 'p1', chap: CH, title: 'PR을 만들기 전 확인', theme: 'white',
    notes: 'PR을 열기 전 세 가지를 스스로 확인합니다. 변경한 파일과 목적, 프로젝트가 요구하는 검사와 테스트, PR 템플릿과 기여 규칙. 세 카드 아래 도장이 찍히는 순서대로 설명합니다.',
    build(el, A) {
      ttl(el, A, 'PR을 만들기 전 확인');
      const C = [
        ['doc', '변경 파일과 목적을 확인합니다', 'var(--green)'],
        ['play', '요구된 검사와 테스트를 실행합니다', 'var(--blue)'],
        ['users', '템플릿과 기여 규칙을 따릅니다', 'var(--violet)'],
      ];
      this.stamps = [];
      C.forEach((c, i) => {
        const x = 120 + i * 570;
        const cd = U.card(el, { x, y: 240, w: 540, h: 660, pad: 0 });
        A(cd, 'up', 0.25 + i * 0.14, { d: 70 });
        const n = U.num(cd, i + 1, { size: 64, bg: c[2], x: 40, y: 40 });
        const bd = U.badge(cd, c[0], { size: 64, bg: 'transparent', fg: c[2], x: 436, y: 40, k: .7 });
        const tx = U.text(cd, '', c[1], 40, 136, 460); css(tx, { fontSize: '38px', fontWeight: 780, letterSpacing: '-.03em', lineHeight: 1.3 });
        A(n, 'pop', 0.5 + i * 0.14); A(bd, 'pop', 0.55 + i * 0.14);
        const vis = U.box(cd, 30, 290, 480, 250); css(vis, { borderRadius: '18px', overflow: 'hidden' });
        if (i === 0) {
          css(vis, { background: '#F6F7FA' });
          const f1 = file(vis, 'README.md', 3, 1, 10, 20, 460);
          const f2 = file(vis, 'docs/setup.md', 12, 2, 10, 86, 460);
          const pg = U.text(vis, '', '목적: 설치 명령 수정', 30, 168); css(pg, { fontSize: '26px', fontWeight: 700, color: 'var(--green-d)', background: 'var(--green-l)', padding: '8px 18px', borderRadius: '12px' });
          A([f1, f2, pg], 'left', 0.8, { each: 0.1, d: 40 });
        } else if (i === 1) {
          css(vis, { background: '#0E1530' });
          const tm = U.term(vis, ['$ python -m unittest', 'ok Ran 12 tests', 'ok OK', '$ git status', '> nothing to commit'], { x: 26, y: 18, size: 25 });
          tm.rows.forEach(r => css(r, { lineHeight: '44px' }));
          A(tm.rows, 'right', 0.9, { each: 0.12, d: 30 });
        } else {
          css(vis, { background: '#F6F7FA' });
          const L = ['관련 Issue', '변경 이유', '검증 방법'];
          L.forEach((t, k) => {
            const r = U.box(vis, 26, 22 + k * 72, 430, 60); css(r, { display: 'flex', alignItems: 'center', gap: '16px' });
            const sw = h('span', '', r); css(sw, { width: '40px', height: '40px', borderRadius: '10px', background: 'var(--violet)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' });
            sw.appendChild(U.icon('check', 28, '#fff', 3));
            const tt = h('span', '', r, t); css(tt, { fontSize: '30px', fontWeight: 650 });
            A(r, 'left', 1.0 + k * 0.1, { d: 40 });
          });
          const cg = U.text(vis, 'mono', 'CONTRIBUTING.md', 26, 240); css(cg, { display: 'none' });
        }
        const done = U.box(cd, 40, 568, 460, 60); css(done, { display: 'flex', alignItems: 'center', gap: '14px' });
        const sm = U.status(done, 'ok', 52); const dt = h('span', '', done, '확인 완료'); css(dt, { fontSize: '30px', fontWeight: 800, color: 'var(--green-d)' });
        A(sm, 'stamp', 1.45 + i * 0.22, { dur: 0.45 }); A(dt, 'fade', 1.55 + i * 0.22);
      });
    },
  });

  /* 3. Base와 Head의 관계 (p.35) — 비교 막대 + Head → PR → Base 도식 */
  slide({
    id: 'p1d-base-head', part: 'p1', chap: CH, title: 'Base와 Head의 관계', theme: 'white',
    notes: 'PR 화면 위쪽의 비교 막대를 크게 키운 화면입니다. Base는 변경을 반영할 대상(main), Head는 변경을 담은 브랜치(fix/readme)입니다. Fork에서 PR을 만들 때는 브랜치뿐 아니라 저장소도 함께 고릅니다.',
    build(el, A) {
      ttl(el, A, 'Base와 Head의 관계');
      // 비교 막대
      const bar = U.box(el, 120, 236, 1680, 110); css(bar, { background: '#F6F7FA', borderRadius: '20px', boxShadow: 'inset 0 0 0 2px #E1E4EC', display: 'flex', alignItems: 'center', gap: '14px', padding: '0 28px' });
      A(bar, 'wipe', 0.3, { dur: 0.6 });
      const mono = (txt, bg, fg) => { const c = h('span', '', bar); css(c, { fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 600, background: bg, color: fg, padding: '12px 18px', borderRadius: '12px', whiteSpace: 'nowrap' }); c.innerHTML = txt; return c; };
      const c1 = mono('base repository: <b>upstream/project</b>', '#fff', 'var(--ink)');
      const c2 = mono('base: <b>main</b>', 'var(--blue-l)', 'var(--blue-d)');
      const ar = h('span', '', bar); ar.appendChild(U.icon('arrow', 40, '#7B8299', 2.6)); css(ar, { transform: 'scaleX(-1)', display: 'inline-flex' });
      const c3 = mono('head repository: <b>me/project</b>', '#fff', 'var(--ink)');
      const c4 = mono('compare: <b>fix/readme</b>', 'var(--green-l)', 'var(--green-d)');
      [c1, c2, ar, c3, c4].forEach((c, i) => A(c, 'pop', 0.55 + i * 0.08, { from: 0.7 }));
      const cl = U.text(el, '', '<span class="hb">저장소</span>와 <span class="hl">브랜치</span>를 함께 확인합니다', 120, 372, 1680);
      css(cl, { fontSize: '38px', fontWeight: 760, textAlign: 'center', letterSpacing: '-.025em' });
      A(cl, 'up', 1.0, { d: 24 });
      // 도식
      const side = (x, name, br, col, colL, sent, ic) => {
        const cd = U.card(el, { x, y: 470, w: 520, h: 430, pad: 0 });
        css(cd, { boxShadow: `0 0 0 3px ${col}, 0 24px 48px -24px rgba(15,27,61,.28)` });
        const ib = U.badge(cd, ic, { size: 80, bg: colL, fg: col, x: 40, y: 40, square: true, k: .55 });
        const nm = U.text(cd, '', name, 140, 30); css(nm, { fontSize: '80px', fontWeight: 900, color: col, letterSpacing: '-.04em', lineHeight: 1.1 });
        const bc = U.chip(cd, br, { size: 'lg', bg: colL, fg: col, icon: 'branch', x: 40, y: 160 }); css(bc, { fontFamily: 'var(--mono)' });
        const sx = U.text(cd, '', sent, 40, 262, 450); css(sx, { fontSize: '38px', fontWeight: 720, lineHeight: 1.35, letterSpacing: '-.025em' });
        return { cd, ib, nm, bc, sx };
      };
      const B = side(120, 'Base', 'main', 'var(--blue)', 'var(--blue-l)', '<b>Base</b>는 변경을 반영할 대상입니다', 'package');
      const Hd = side(1280, 'Head', 'fix/readme', 'var(--green)', 'var(--green-l)', '<b>Head</b>는 변경을 담은 브랜치입니다', 'laptop');
      A(B.cd, 'up', 1.15, { d: 60 }); A(Hd.cd, 'up', 1.05, { d: 60 });
      [Hd.sx, B.sx].forEach((e, i) => A(e, 'up', 1.4 + i * 0.1, { d: 20 }));
      const pr = U.card(el, { x: 800, y: 560, w: 320, h: 250, pad: 0 });
      const pi = U.badge(pr, 'pr', { size: 96, bg: 'var(--ink)', x: 112, y: 36 });
      const pt = U.text(pr, '', 'Pull Request', 0, 156, 320); css(pt, { textAlign: 'center', fontSize: '32px', fontWeight: 800 });
      A(pr, 'pop', 1.3, { from: 0.6 });
      const a1 = U.arrow(el, [[1268, 685], [1134, 685]], { color: 'var(--green)', sw: 7 });
      const a2 = U.arrow(el, [[790, 685], [656, 685]], { color: 'var(--blue)', sw: 7 });
      A(a1.path, 'draw', 1.55, { dur: 0.4 }); A(a1.head, 'fade', 1.85, { dur: 0.2 });
      A(a2.path, 'draw', 1.85, { dur: 0.4 }); A(a2.head, 'fade', 2.15, { dur: 0.2 });
      this.dot = U.box(el, 0, 0, 22, 22); css(this.dot, { borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 0 6px rgba(18,176,122,.22)' });
    },
    render(t, S) {
      const T0 = 2.5; if (t < T0) { css(this.dot, { opacity: 0 }); return; }
      const u = ((t - T0) % 2.6) / 2.6; // Head → Base 로 흐르는 변경
      const x = u < 0.5 ? lerp(1268, 800, u / 0.5) : lerp(1120, 640, (u - 0.5) / 0.5);
      const vis = (u > 0.48 && u < 0.52) ? 0 : 1;
      css(this.dot, { opacity: vis * (u < 0.92 ? 1 : (1 - u) / 0.08), left: (x - 11) + 'px', top: (685 - 11) + 'px', background: u < 0.5 ? 'var(--green)' : 'var(--blue)' });
    },
  });

  /* 4. Draft PR과 검토 가능한 PR (p.36) — 왼쪽 Draft, 가운데 버튼 클릭, 오른쪽이 켜짐 */
  slide({
    id: 'p1d-draft', part: 'p1', chap: CH, title: 'Draft PR과 검토 가능한 PR', theme: 'white',
    notes: '작업 중인 변경은 Draft로 먼저 공유해 방향을 확인받을 수 있습니다. Draft 상태에서는 Merge할 수 없고, 준비되면 Ready for review 버튼으로 검토 요청 상태로 바꿉니다.',
    build(el, A) {
      ttl(el, A, 'Draft PR과 검토 가능한 PR');
      // 왼쪽: Draft
      const L = U.win(el, { x: 120, y: 236, w: 640, h: 520, title: 'Pull request #13' });
      A(L.el, 'up', 0.3, { d: 60 });
      state(L.body, 'draft', 30, 28);
      const lt = U.text(L.body, '', 'docs: README 설치 명령 수정', 30, 100, 580); css(lt, { fontSize: '30px', fontWeight: 800 });
      const ed = U.box(L.body, 30, 160, 580, 150); css(ed, { background: '#F6F7FA', borderRadius: '14px', padding: '20px 24px', fontFamily: 'var(--mono)', fontSize: '25px', lineHeight: 1.7 });
      const e1 = h('div', '', ed, '- [x] 설치 명령 수정'); const e2 = h('div', '', ed, '- [ ] 문서 링크 확인');
      this.caret = h('span', '', e2, '▌'); css(this.caret, { color: 'var(--blue)', marginLeft: '6px' });
      const mbx = U.box(L.body, 30, 336, 580, 110); css(mbx, { border: '2px dashed #C9CEDA', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 22px' });
      mbx.appendChild(U.icon('ban', 40, '#9AA0B4', 2.4));
      const mt = h('span', '', mbx, 'Draft는 Merge할 수 없음'); css(mt, { fontSize: '26px', fontWeight: 700, color: '#7B8299', flex: 1 });
      const mb = U.btn(mbx, 'Merge', '', { icon: 'merge', is: 26 }); css(mb, { height: '56px', fontSize: '24px', padding: '0 20px', opacity: .4 });
      // 가운데: 버튼
      const arr = U.arrow(el, [[790, 470], [1130, 470]], { color: '#C9CEDA', sw: 6 });
      A(arr.path, 'draw', 0.9, { dur: 0.5 }); A(arr.head, 'fade', 1.3);
      this.rb = U.btn(el, 'Ready for review', 'green', { x: 812, y: 372 }); css(this.rb, { fontSize: '27px', height: '66px', padding: '0 24px' });
      A(this.rb, 'pop', 1.0);
      this.cur = U.box(el, 0, 0, 56, 56); this.cur.appendChild(U.icon('hand', 56, 'var(--ink)', 2));
      // 오른쪽: 검토 가능
      const R = U.win(el, { x: 1160, y: 236, w: 640, h: 520, title: 'Pull request #13' });
      this.R = R.el;
      this.ro = state(R.body, 'open', 30, 28);
      const rt = U.text(R.body, '', 'docs: README 설치 명령 수정', 30, 100, 580); css(rt, { fontSize: '30px', fontWeight: 800 });
      const rv = U.box(R.body, 30, 166, 580, 60); css(rv, { display: 'flex', alignItems: 'center', gap: '12px' });
      const rl = h('span', 'p1d-lab', rv, 'Reviewers'); css(rl, { marginRight: '8px', fontSize: '26px' });
      rv.appendChild(U.avatar(null, 'K', 'var(--blue)', 50)); rv.appendChild(U.avatar(null, 'J', 'var(--violet)', 50));
      const cks = U.box(R.body, 30, 246, 580, 200);
      this.rch = ['build', 'test', 'lint'].map((n, k) => { const r = h('div', '', cks); css(r, { display: 'flex', alignItems: 'center', gap: '14px', height: '60px', fontFamily: 'var(--mono)', fontSize: '26px', fontWeight: 600 }); const s1 = U.status(r, 'ok', 40); h('span', '', r, n); return s1; });
      // 캡션
      const caps = ['작업 중에는 Draft로 공유합니다', 'Draft는 Merge할 수 없습니다', '준비되면 Ready for review로 전환합니다'];
      caps.forEach((c, i) => {
        const r = U.box(el, 120 + i * 570, 800, 540, 110); css(r, { display: 'flex', alignItems: 'center', gap: '18px', background: i === 2 ? 'var(--green-l)' : '#F2F3F7', borderRadius: '20px', padding: '0 26px' });
        mk(r, i + 1, i === 2 ? 'g' : '');
        const tx = h('span', 'p1d-cap', r, c); css(tx, { fontSize: '30px' });
        A(r, 'up', 0.7 + i * 0.12, { d: 30 });
      });
    },
    render(t, S) {
      const C = 1.9; // 클릭 시각
      const pIn = prog(t, 1.25, 0.6, ease.snap), pOut = prog(t, C + 0.35, 0.4, ease.exit);
      const press = t > C && t < C + 0.18 ? 0.92 : 1;
      css(this.cur, { left: lerp(1060, 990, pIn) + 'px', top: lerp(560, 410, pIn) + 'px', opacity: clamp(pIn * 2) * (1 - pOut), transform: `scale(${press})` });
      css(this.rb, { transform: `scale(${press})`, boxShadow: t > C && t < C + 0.6 ? `0 0 0 ${(t - C) * 40}px rgba(18,176,122,${0.35 - (t - C) * 0.55})` : 'none' });
      const on = prog(t, C + 0.1, 0.5, ease.snap);
      css(this.R, { opacity: lerp(0.35, 1, on), filter: on < 1 ? `grayscale(${1 - on})` : 'none', transform: `translate3d(0,${(1 - clamp(prog(t, 0.45, 0.7))) * 60}px,0)` });
      css(this.ro, { transform: `scale(${on > 0 && on < 1 ? lerp(1.4, 1, on) : 1})` });
      this.rch.forEach((c, k) => { const q = prog(t, C + 0.4 + k * 0.15, 0.4, ease.pop); css(c, { transform: `scale(${q})` }); });
      css(this.caret, { opacity: t < C && Math.floor(t * 2.4) % 2 === 0 ? 1 : 0 });
    },
  });

  /* 5. PR 제목과 본문 (p.37) — 거대한 작성 폼 + 오른쪽 주석 */
  slide({
    id: 'p1d-title-body', part: 'p1', chap: CH, title: 'PR 제목과 본문', theme: 'white', cls: 'dots',
    notes: '제목만 보고도 무엇을 해결했는지 알 수 있어야 합니다. 본문에는 변경 이유와 결과, 검증 방법과 관련 이슈를 남깁니다. 리뷰어가 코드를 열기 전에 읽는 글입니다.',
    build(el, A) {
      ttl(el, A, 'PR 제목과 본문');
      const W = U.win(el, { x: 120, y: 226, w: 1060, h: 700, title: 'Open a pull request' });
      A(W.el, 'up', 0.25, { d: 60 });
      const b = W.body;
      const lt = U.text(b, 'p1d-lab', '제목', 36, 26); css(lt, { fontSize: '26px' });
      const tf = U.box(b, 30, 64, 1000, 82, 'p1d-field');
      const tv = U.text(tf, '', 'docs: README의 설치 명령 수정', 24, 18, 950); css(tv, { fontSize: '36px', fontWeight: 750, whiteSpace: 'nowrap' });
      A(tv, 'type', 0.7, { cps: 30 });
      this.tf = tf;
      const lb = U.text(b, 'p1d-lab', '본문', 36, 168); css(lb, { fontSize: '26px' });
      const bf = U.box(b, 30, 206, 1000, 424, 'p1d-field');
      const lines = [
        ['## 변경 이유', 'h'], ['README의 설치 명령이 현재 버전과 다릅니다', ''],
        ['## 결과', 'h'], ['새 환경에서 설치가 끝까지 진행됩니다', ''],
        ['## 검증', 'h'], ['- [x] 새 가상환경에서 설치 명령 실행', ''], ['관련 이슈: #12', 'i'],
      ];
      this.bl = lines.map((L, i) => {
        const r = U.text(bf, 'mono', '', 26, 18 + i * 56, 950); r.textContent = L[0];
        css(r, { fontSize: '26px', fontWeight: L[1] === 'h' ? 700 : 500, color: L[1] === 'h' ? 'var(--blue-d)' : L[1] === 'i' ? 'var(--green-d)' : 'var(--ink)', whiteSpace: 'nowrap' });
        A(r, 'left', 1.3 + i * 0.07, { d: 40 });
        return r;
      });
      // 주석
      const notes = [
        ['warn', '제목은 해결한 문제를 드러냅니다', 'var(--amber)', 290 + 56 + 64 + 41 - 56],
        ['doc', '본문은 변경 이유와 결과를 설명합니다', 'var(--blue)', 0],
        ['check', '검증 방법과 관련 이슈를 남깁니다', 'var(--green)', 0],
      ];
      const ys = [250, 470, 690];
      const tgt = [[1150, 226 + 56 + 105], [1150, 226 + 56 + 206 + 18 + 56 * 1.5 + 25], [1150, 226 + 56 + 206 + 18 + 56 * 5.5 + 25]];
      notes.forEach((n, i) => {
        const c = U.card(el, { x: 1260, y: ys[i], w: 540, h: 180, pad: 0 });
        const bd = U.badge(c, n[0], { size: 64, bg: n[2], x: 30, y: 30 });
        const tx = U.text(c, '', n[1], 112, 30, 400); css(tx, { fontSize: '34px', fontWeight: 760, lineHeight: 1.35, letterSpacing: '-.025em' });
        A(c, 'left', 0.9 + i * 0.25, { d: 60 });
        const ar = U.arrow(el, [[1252, ys[i] + 62], tgt[i]], { color: n[2], sw: 4, curve: 'h', head: false });
        A(ar.path, 'draw', 1.15 + i * 0.25, { dur: 0.45 });
        const dt = U.box(el, tgt[i][0] - 9, tgt[i][1] - 9, 18, 18); css(dt, { borderRadius: '50%', background: n[2] });
        A(dt, 'pop', 1.5 + i * 0.25);
      });
    },
    render(t) { const p = prog(t, 0.7, 0.3); css(this.tf, { borderColor: p > 0 && t < 2.2 ? 'var(--blue)' : '#D7DBE5' }); },
  });

  /* 6. PR과 Issue 연결 (p.38) — Closes #12 를 쓰면 이슈가 연결되고, Merge 하면 닫힌다 */
  slide({
    id: 'p1d-link-issue', part: 'p1', chap: CH, title: 'PR과 Issue 연결', theme: 'white', steps: 1,
    notes: 'PR 본문에 Closes #12처럼 종료 키워드를 쓰면 Issue #12가 연결됩니다(클릭하면 Merge). 기본 브랜치로 Merge될 때 이슈가 자동으로 닫힙니다. "#12 참고"처럼 번호만 쓰면 참조만 남고 닫히지 않습니다.',
    build(el, A) {
      ttl(el, A, 'PR과 Issue 연결');
      // 이슈 카드
      const I = U.card(el, { x: 120, y: 236, w: 600, h: 330, pad: 0 });
      A(I, 'up', 0.3, { d: 50 });
      const ih = U.text(I, '', 'Issue #12', 36, 34); css(ih, { fontSize: '44px', fontWeight: 880, letterSpacing: '-.03em' });
      this.iOpen = state(I, 'issue', 360, 36); this.iClosed = state(I, 'closed', 360, 36);
      const it = U.text(I, '', 'README의 설치 명령이 실패합니다', 36, 118, 540); css(it, { fontSize: '32px', fontWeight: 650 });
      U.chip(I, 'documentation', { x: 36, y: 190 });
      const ref = U.box(I, 0, 262, 600, 68); css(ref, { borderTop: '1.5px solid rgba(15,27,61,.08)', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 36px', fontSize: '24px', fontWeight: 650, color: '#7B8299' });
      ref.appendChild(U.icon('link', 30, 'var(--green)', 2.4)); const rt = h('span', '', ref, 'PR #13이 이 이슈를 닫습니다'); this.ref = ref;
      // PR 카드
      const P = U.win(el, { x: 1080, y: 236, w: 720, h: 330, title: 'Pull request #13' });
      A(P.el, 'up', 0.4, { d: 50 });
      this.pOpen = state(P.body, 'open', 30, 22); this.pMerged = state(P.body, 'merged', 30, 22);
      const tgt = U.chip(P.body, 'base: main', { bg: 'var(--blue-l)', fg: 'var(--blue-d)', icon: 'branch', x: 250, y: 26 }); css(tgt, { fontFamily: 'var(--mono)' });
      const bf = U.box(P.body, 30, 100, 660, 92, 'p1d-field'); css(bf, { borderColor: 'var(--green)' });
      const kw = U.text(bf, 'mono', 'Closes #12', 24, 20); css(kw, { fontSize: '38px', fontWeight: 700, color: 'var(--green-d)' });
      A(kw, 'type', 0.9, { cps: 16 });
      this.mbtn = U.btn(P.body, 'Merge pull request', 'green', { icon: 'merge', x: 30, y: 206 }); css(this.mbtn, { height: '58px', fontSize: '25px', padding: '0 22px' });
      // 연결선
      const ln = U.arrow(el, [[1076, 395], [724, 395]], { color: 'var(--green)', sw: 6, dash: null });
      A(ln.path, 'draw', 1.75, { dur: 0.5 }); A(ln.head, 'fade', 2.2);
      const lk = U.badge(el, 'link', { size: 76, bg: 'var(--green)', x: 862, y: 357 }); A(lk, 'pop', 2.0);
      A(ref, 'up', 2.25, { d: 20 });
      // 2×2 확인 항목
      const L = [
        '예시 PR 본문: <code>Closes #12</code>',
        '대상은 저장소의 기본 브랜치입니다',
        'Merge되면 연결한 이슈가 닫힙니다',
        '일반적인 언급과 종료 키워드는 다릅니다',
      ];
      L.forEach((t, i) => {
        const x = 120 + (i % 2) * 850, y = 630 + Math.floor(i / 2) * 140;
        const r = U.box(el, x, y, 830, 120); css(r, { display: 'flex', alignItems: 'center', gap: '22px', background: '#F4F5F8', borderRadius: '20px', padding: '0 30px' });
        r.appendChild(U.status(null, 'ok', 48));
        const tx = h('div', 'p1d-cap', r, t); css(tx, { fontSize: '33px' });
        if (i === 3) { const sb = h('div', '', tx, '<code>#12 참고</code>는 참조만 남고 이슈는 열린 채로 남습니다'); css(sb, { fontSize: '24px', fontWeight: 550, color: '#7B8299', marginTop: '4px' }); }
        A(r, 'up', 0.6 + i * 0.1, { d: 30 });
      });
    },
    render(t, S) {
      const m = S.at(1); const p = prog(m, 0.15, 0.4, ease.pop);
      css(this.mbtn, { transform: `scale(${m > 0 && m < 0.15 ? 0.94 : 1})`, opacity: lerp(1, 0.45, clamp(m / 0.3)) });
      css(this.pOpen, { opacity: 1 - clamp(p * 2) }); css(this.pMerged, { opacity: clamp(p * 2), transform: `scale(${p > 0 && p < 1 ? lerp(1.3, 1, p) : 1})` });
      const q = prog(m, 0.55, 0.45, ease.pop);
      css(this.iOpen, { opacity: 1 - clamp(q * 2) }); css(this.iClosed, { opacity: clamp(q * 2), transform: `scale(${q > 0 && q < 1 ? lerp(1.3, 1, q) : 1})` });
    },
  });

  /* 7. Diff에서 확인할 내용 (p.39) — 큰 Diff 창 + 번호 주석 */
  slide({
    id: 'p1d-diff', part: 'p1', chap: CH, title: 'Diff에서 확인할 내용', theme: 'white',
    notes: 'Files changed 탭에서 세 가지를 봅니다. ① 추가·삭제된 줄을 실제로 읽기 ② 목적과 상관없는 파일(여기서는 package-lock.json)이 섞였는지 ③ 최종 동작과 검증 범위. 리뷰어뿐 아니라 PR 작성자도 제출 전에 스스로 봅니다.',
    build(el, A) {
      ttl(el, A, 'Diff에서 확인할 내용');
      const W = U.win(el, { x: 120, y: 226, w: 1120, h: 700, title: 'Files changed  3' });
      A(W.el, 'up', 0.25, { d: 60 });
      const b = W.body;
      const sb = U.box(b, 0, 0, 380, 644); css(sb, { background: '#F6F7FA', borderRight: '1.5px solid #E6E8EF' });
      const fs = [['README.md', 3, 1], ['docs/setup.md', 2, 1], ['package-lock.json', 840, 611]];
      this.lock = null;
      fs.forEach((f, i) => {
        const r = file(sb, f[0], null, null, 14, 22 + i * 74, 352, { icon: 'file' });
        css(r, { fontSize: '24px', gap: '10px' });
        if (i === 0) css(r, { background: '#fff', boxShadow: 'inset 0 0 0 2px #DCE0EA' });
        const cnt = h('div', '', sb); U.place(cnt, 66, 22 + i * 74 + 48); css(cnt, { fontFamily: 'var(--mono)', fontSize: '0px' });
        if (i === 2) this.lock = r;
        A(r, 'right', 0.6 + i * 0.1, { d: 30 });
      });
      const cn = U.text(sb, 'mono', '<span style="color:var(--green-d)">+840</span> <span style="color:#C93434">−611</span>', 66, 268); css(cn, { fontSize: '24px', fontWeight: 700 });
      A(cn, 'fade', 0.95);
      const fh = U.text(b, 'mono', 'README.md', 410, 20); css(fh, { fontSize: '26px', fontWeight: 700 });
      const D = U.diff(b, [
        ['@', '@@ -12,6 +12,7 @@'],
        [' ', '## 설치'],
        ['-', 'python setup.py install'],
        ['+', 'pip install .'],
        ['+', 'pip install -r requirements-dev.txt'],
        [' ', '## 실행'],
        [' ', 'python -m project'],
      ], { x: 392, y: 70, w: 728, size: 25, rowH: 54, start: 12 });
      A(D.rows, 'left', 0.7, { each: 0.08, d: 70 });
      const vf = U.box(b, 392, 470, 728, 174); css(vf, { borderTop: '1.5px solid #E6E8EF', padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '16px' });
      const v1 = h('div', '', vf); css(v1, { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '27px', fontWeight: 650 }); v1.appendChild(U.status(null, 'ok', 40)); h('span', '', v1, '새 환경에서 설치 → 실행 확인');
      const v2 = h('div', '', vf); css(v2, { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '27px', fontWeight: 650 }); v2.appendChild(U.status(null, 'ok', 40)); h('span', '', v2, '테스트 12개 통과');
      A([v1, v2], 'up', 1.4, { each: 0.1, d: 20 });
      // 번호 표식
      const marks = [[1080, 226 + 56 + 70 + 54 * 2 + 3, 'g'], [410, 226 + 56 + 256, 'a'], [1080, 226 + 56 + 470 + 30, 'b']];
      marks.forEach((m, i) => { const e = mk(el, i + 1, m[2]); U.place(e, m[0], m[1]); css(e, { width: '56px', height: '56px', fontSize: '32px', boxShadow: '0 0 0 6px #fff' }); A(e, 'pop', 1.6 + i * 0.15); });
      // 오른쪽 설명
      const L = [['추가·삭제된 코드와 문서를 읽습니다', 'g'], ['무관한 파일이 섞였는지 봅니다', 'a'], ['최종 동작과 검증 범위를 확인합니다', 'b']];
      L.forEach((l, i) => {
        const r = U.box(el, 1300, 250 + i * 225, 500, 200); css(r, { display: 'flex', gap: '22px', alignItems: 'flex-start' });
        const m = mk(r, i + 1, l[1]); css(m, { width: '56px', height: '56px', fontSize: '32px' });
        const tx = h('div', 'p1d-cap', r, l[0]); css(tx, { fontSize: '38px', fontWeight: 760, lineHeight: 1.35 });
        A(r, 'left', 1.0 + i * 0.15, { d: 50 });
      });
    },
    render(t) { if (!this.lock) return; const p = t > 2 ? 0.5 + 0.5 * Math.sin((t - 2) * 3) : 0; css(this.lock, { background: `rgba(245,165,36,${0.12 + p * 0.18})`, boxShadow: 'inset 0 0 0 2.5px var(--amber)' }); },
  });

  /* 8. 작은 PR이 검토를 돕습니다 (p.40) — 파일 5개가 2개 + 별도 PR 로 나뉜다 */
  slide({
    id: 'p1d-small-pr', part: 'p1', chap: CH, title: '작은 PR이 검토를 돕습니다', theme: 'white',
    notes: '하나의 PR에는 하나의 목적만 담습니다. 왼쪽처럼 문서 수정에 정리·스타일·이미지 변경이 섞이면 리뷰어가 확인할 범위가 넓어집니다. 목적과 상관없는 정리 작업은 별도 PR로 나눕니다.',
    build(el, A) {
      ttl(el, A, '작은 PR이 검토를 돕습니다');
      const files = [
        ['docs/setup.md', 'doc', 1], ['tests/test_setup.py', 'flask', 1],
        ['src/utils.py', 'code', 0], ['.editorconfig', 'gear', 0], ['assets/diagram.png', 'file', 0],
      ];
      const big = U.card(el, { x: 120, y: 230, w: 640, h: 560, pad: 0 });
      A(big, 'up', 0.25, { d: 60 });
      const bh = U.text(big, '', 'PR · 파일 5개', 36, 30); css(bh, { fontSize: '38px', fontWeight: 850 });
      const bc = U.text(big, 'mono', '<span style="color:var(--green-d)">+412</span> <span style="color:#C93434">−198</span>', 400, 38); css(bc, { fontSize: '28px', fontWeight: 700 });
      this.rows = files.map((f, i) => {
        const r = file(big, f[0], null, null, 24, 110 + i * 86, 592, { icon: f[1], ic: f[2] ? 'var(--green)' : '#9AA0B4' });
        css(r, { height: '70px', fontSize: '27px', background: f[2] ? 'var(--green-l)' : '#F4F5F8' });
        A(r, 'left', 0.5 + i * 0.08, { d: 40 });
        return r;
      });
      // 가운데 숫자
      const n5 = U.text(el, 'numf', '5', 820, 330); css(n5, { fontSize: '200px', color: '#C9CEDA', lineHeight: 1 }); A(n5, 'fade', 0.4);
      const ar = U.icon('arrow', 90, 'var(--ink)', 2.6); U.place(ar, 905, 410); el.appendChild(ar); A(ar, 'right', 1.2, { d: 40 });
      const n2 = U.text(el, 'numf', '2', 1015, 330); css(n2, { fontSize: '200px', color: 'var(--green)', lineHeight: 1 }); A(n2, 'slam', 1.5, { from: 1.8 });
      const nl = U.text(el, 'b3', '리뷰어가 볼 파일', 820, 560, 340); css(nl, { textAlign: 'center', fontWeight: 650 }); A(nl, 'fade', 1.6);
      // 오른쪽: 작은 PR
      const sm = U.card(el, { x: 1200, y: 230, w: 600, h: 290, pad: 0 });
      css(sm, { boxShadow: '0 0 0 3px var(--green), 0 24px 48px -24px rgba(15,27,61,.28)' });
      A(sm, 'left', 1.3, { d: 60 });
      const sh = U.text(sm, '', 'PR · 파일 2개', 36, 28); css(sh, { fontSize: '38px', fontWeight: 850, color: 'var(--green-d)' });
      const sc = U.text(sm, 'mono', '<span style="color:var(--green-d)">+18</span> <span style="color:#C93434">−4</span>', 420, 36); css(sc, { fontSize: '28px', fontWeight: 700 });
      const sp = U.box(el, 1200, 560, 600, 230); css(sp, { border: '3px dashed #C9CEDA', borderRadius: '26px' });
      const spl = U.text(sp, '', '별도 PR로 분리', 30, 20); css(spl, { fontSize: '30px', fontWeight: 800, color: '#7B8299' });
      A(sp, 'fade', 1.4);
      // 움직이는 파일 칩(왼쪽에서 오른쪽으로)
      const dest = [[1224, 330], [1224, 410], [1224, 630], [1224, 680], [1224, 730]];
      this.fly = files.map((f, i) => {
        const g = file(el, f[0], null, null, 0, 0, i < 2 ? 552 : 552, { icon: f[1], ic: f[2] ? 'var(--green)' : '#7B8299' });
        css(g, { height: i < 2 ? '66px' : '46px', fontSize: i < 2 ? '27px' : '24px', background: i < 2 ? 'var(--green-l)' : 'transparent', padding: i < 2 ? '0 20px' : '0 12px', opacity: 0 });
        return { g, from: [144, 340 + i * 86], to: dest[i] };
      });
      const bl = ['한 PR에서 하나의 목적을 설명합니다', '무관한 정리 작업은 분리합니다', '리뷰어가 확인할 범위를 줄입니다'];
      bl.forEach((t, i) => {
        const r = U.box(el, 120 + i * 570, 834, 550, 80); css(r, { display: 'flex', alignItems: 'center', gap: '16px' });
        r.appendChild(U.status(null, 'ok', 44)); const tx = h('span', 'p1d-cap', r, t); css(tx, { fontSize: '30px' });
        A(r, 'up', 1.9 + i * 0.1, { d: 20 });
      });
    },
    render(t) {
      this.fly.forEach((f, i) => {
        const p = prog(t, 1.35 + i * 0.09, 0.75, ease.inOutCubic);
        const x = lerp(f.from[0], f.to[0], p), y = lerp(f.from[1], f.to[1], p) - Math.sin(p * Math.PI) * 70;
        css(f.g, { left: x + 'px', top: y + 'px', opacity: p > 0 ? 1 : 0 });
        css(this.rows[i], { opacity: lerp(1, 0.35, clamp(p * 1.5)) });
      });
    },
  });

  /* 9. Code Review의 목적 (p.41) — 세 목적과 리뷰 결과를 한 줄씩 짝지음 */
  slide({
    id: 'p1d-review-purpose', part: 'p1', chap: CH, title: 'Code Review의 목적', theme: 'white', cls: 'dots',
    notes: '리뷰는 취향을 맞추는 일이 아닙니다. 합의한 동작을 만족하는지, 기존 기능이 깨지지 않는지, 다음 사람이 읽고 고치기 쉬운지를 봅니다. 오른쪽은 각 목적에 해당하는 실제 리뷰 결과 예시입니다.',
    build(el, A) {
      ttl(el, A, 'Code Review의 목적');
      const R = [
        ['합의한 동작을 만족하는지<br>확인합니다', 'ok', '완료 조건 충족', '빈 입력에 빈 문자열 반환', 'var(--green)'],
        ['기존 기능에 미치는 영향을<br>봅니다', 'fail', '기존 테스트 1개 실패', 'test_title_case', 'var(--red)'],
        ['읽고 수정하기 쉬운 코드인지<br>검토합니다', 'chat', '읽기 쉬운 구조 제안', '예외 처리를 함수 앞쪽으로', 'var(--blue)'],
      ];
      R.forEach((r, i) => {
        const y = 250 + i * 220;
        const n = U.text(el, 'numf', '0' + (i + 1), 120, y - 8); css(n, { fontSize: '150px', lineHeight: 1, color: r[4] });
        A(n, 'slam', 0.3 + i * 0.18, { from: 1.6 });
        const tx = U.text(el, '', r[0], 330, y + 12, 720); css(tx, { fontSize: '46px', fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1.25 });
        A(tx, 'chars', 0.45 + i * 0.18, { each: 0.018 });
        const ln = U.arrow(el, [[1060, y + 70], [1200, y + 70]], { color: r[4], sw: 4, head: false, dash: null });
        A(ln.path, 'draw', 1.1 + i * 0.18, { dur: 0.3 });
        const c = U.card(el, { x: 1200, y: y - 4, w: 600, h: 150, pad: 0 });
        css(c, { boxShadow: `inset 6px 0 0 ${r[4]}, 0 20px 40px -24px rgba(15,27,61,.3), 0 0 0 1.5px rgba(15,27,61,.06)` });
        let ic;
        if (r[1] === 'chat') { ic = U.badge(c, 'chat', { size: 56, bg: 'var(--blue)', x: 36, y: 46 }); }
        else { ic = U.status(c, r[1], 56); U.place(ic, 36, 46); }
        const t1 = U.text(c, '', r[2], 116, 32, 460); css(t1, { fontSize: '33px', fontWeight: 800 });
        const t2 = U.text(c, 'mono', r[3], 116, 86, 470); css(t2, { fontSize: '25px', color: '#5B6480', fontWeight: 500, fontFamily: r[1] === 'fail' ? 'var(--mono)' : 'var(--sans)' });
        A(c, 'left', 1.25 + i * 0.18, { d: 50 }); A(ic, 'stamp', 1.45 + i * 0.18, { dur: 0.4 });
      });
    },
  });

  /* 10. Comment와 Approve와 Request changes (p.42) — 거대 버튼 셋 */
  slide({
    id: 'p1d-review-buttons', part: 'p1', chap: CH, title: 'Comment와 Approve와 Request changes', theme: 'white',
    notes: '리뷰를 마칠 때 셋 중 하나를 고릅니다. Comment는 의견만 남기고, Approve는 반영해도 된다는 판단, Request changes는 수정 요청입니다. 저장소 규칙에 따라 Approve가 Merge 조건이 되기도 합니다.',
    build(el, A) {
      ttl(el, A, 'Comment와 Approve와 Request changes', { cls: 'h2' });
      const B = [
        ['Comment', '', 'chat', '의견을 남깁니다', '이 부분은 왜 바뀌었나요?', '#fff', 'var(--ink)', '#D7DBE5'],
        ['Approve', 'green', 'check', '반영해도 된다고 판단합니다', '확인했습니다. 반영해도 됩니다.', 'var(--green-l)', 'var(--green-d)', 'var(--green)'],
        ['Request changes', 'red', 'x', '수정을 요청합니다', '빈 입력 테스트를 추가해 주세요.', 'var(--red-l)', '#B42323', 'var(--red)'],
      ];
      this.btns = [];
      B.forEach((b, i) => {
        const x = 120 + i * 570, cx = x + 265;
        const holder = U.box(el, x, 300, 530, 150); css(holder, { display: 'flex', alignItems: 'center', justifyContent: 'center' });
        const bt = U.btn(holder, b[0], b[1], { icon: b[2], is: 48 }); css(bt, { height: '120px', fontSize: b[0].length > 10 ? '40px' : '48px', padding: '0 40px', borderRadius: '26px', borderWidth: '3px' });
        A(bt, 'pop', 0.35 + i * 0.15, { from: 0.5 });
        this.btns.push(bt);
        const nm = U.text(el, 'mono', b[0], x, 510, 530); css(nm, { textAlign: 'center', fontSize: '30px', fontWeight: 700, color: '#7B8299' });
        const df = U.text(el, '', b[3], x, 562, 530); css(df, { textAlign: 'center', fontSize: '42px', fontWeight: 820, letterSpacing: '-.03em', lineHeight: 1.3 });
        A([nm, df], 'up', 0.7 + i * 0.15, { each: 0.06, d: 24 });
        const bb = U.bubble(el, b[4], { x: x + 20, y: 760, w: 490, size: 32, bg: b[5], fg: b[6], tail: 'tl', shadow: `0 0 0 2.5px ${b[7]}` });
        bb.querySelector('i') && css(bb.querySelector('i'), { boxShadow: `-2.5px -2.5px 0 0 ${b[7]}` });
        A(bb, 'up', 1.1 + i * 0.15, { d: 40 });
      });
      this.ring = h('div', 'p1d-ring', el);
    },
    render(t, S) {
      if (S.final || t < 2.2) { css(this.ring, { opacity: 0 }); return; }
      const k = Math.floor((t - 2.2) / 1.6) % 3, f = ((t - 2.2) % 1.6) / 1.6;
      const r = this.btns[k].getBoundingClientRect ? null : null;
      const xs = [120, 690, 1260];
      const w = [380, 380, 500][k];
      const hh = 150;
      const a = clamp(f / 0.15) * (1 - clamp((f - 0.85) / 0.15));
      css(this.ring, { left: (xs[k] + 265 - w / 2) + 'px', top: '285px', width: w + 'px', height: hh + 'px', opacity: a, borderColor: ['#9AA0B4', 'var(--green)', 'var(--red)'][k] });
    },
  });

  /* 11. 근거가 있는 리뷰 댓글 (p.43) — Diff 의 한 줄 + 근거 세 부분이 표시된 댓글 */
  slide({
    id: 'p1d-review-comment', part: 'p1', chap: CH, title: '근거가 있는 리뷰 댓글', theme: 'white',
    notes: '좋은 리뷰 댓글은 문제가 생기는 입력, 기대 결과와 수정 이유, 프로젝트의 기준을 함께 적습니다. "이상해요" 대신 재현 가능한 근거를 남기면 작성자가 바로 고칠 수 있습니다.',
    build(el, A) {
      ttl(el, A, '근거가 있는 리뷰 댓글');
      const W = U.win(el, { x: 120, y: 226, w: 980, h: 330, title: 'src/title.py' });
      A(W.el, 'up', 0.25, { d: 50 });
      const D = U.diff(W.body, [
        ['@', '@@ def normalize_title(title):'],
        [' ', 'def normalize_title(title):'],
        ['+', '    title = title.strip()'],
        ['+', '    return title[0].upper() + title[1:]'],
      ], { x: 0, y: 12, w: 980, size: 26, rowH: 58, start: 1 });
      A(D.rows, 'left', 0.5, { each: 0.08, d: 60 });
      const hl = U.box(el, 126, 226 + 56 + 12 + 58 * 3, 968, 58); css(hl, { border: '4px solid var(--blue)', borderRadius: '8px' });
      A(hl, 'pop', 1.0, { from: 1.05 });
      const cn = U.arrow(el, [[600, 226 + 56 + 12 + 58 * 4], [600, 606]], { color: 'var(--blue)', sw: 5, head: false });
      A(cn.path, 'draw', 1.15, { dur: 0.3 });
      // 오른쪽 범례
      const L = [['어떤 입력에서 문제가 생기는지 적습니다', 'r'], ['기대 결과와 수정 이유를 설명합니다', 'g'], ['프로젝트의 기준으로 제안합니다', 'b']];
      L.forEach((l, i) => {
        const r = U.box(el, 1160, 240 + i * 108, 640, 96); css(r, { display: 'flex', alignItems: 'center', gap: '18px' });
        const m = mk(r, i + 1, l[1]); const tx = h('span', 'p1d-cap', r, l[0]); css(tx, { fontSize: '32px', lineHeight: 1.3 });
        A(r, 'left', 0.6 + i * 0.12, { d: 40 });
      });
      // 댓글 카드
      const C = U.card(el, { x: 120, y: 606, w: 1680, h: 320, pad: 0 });
      css(C, { boxShadow: '0 0 0 3px var(--blue), 0 30px 60px -30px rgba(15,27,61,.35)' });
      A(C, 'up', 1.25, { d: 40 });
      const hd = U.box(C, 36, 26, 1600, 56); css(hd, { display: 'flex', alignItems: 'center', gap: '16px' });
      hd.appendChild(U.avatar(null, 'R', 'var(--blue)', 50));
      const hn = h('span', '', hd, '리뷰어'); css(hn, { fontSize: '28px', fontWeight: 800 });
      const hm = h('span', 'mono', hd, 'src/title.py 3번째 줄'); css(hm, { fontSize: '24px', color: '#7B8299' });
      const S3 = [
        ['r', '<code>normalize_title("")</code>처럼 빈 문자열을 넣으면 <code>IndexError</code>가 납니다.'],
        ['g', '빈 입력이면 빈 문자열을 돌려줘야 Issue #12의 완료 조건을 만족합니다.'],
        ['b', 'CONTRIBUTING에 따라 이 경우를 확인하는 테스트도 함께 추가해 주세요.'],
      ];
      S3.forEach((s3, i) => {
        const r = U.box(C, 36, 100 + i * 70, 1610, 62); css(r, { display: 'flex', alignItems: 'center', gap: '18px' });
        const m = mk(r, i + 1, s3[0]); css(m, { width: '42px', height: '42px', fontSize: '24px' });
        const tx = h('span', '', r, s3[1]); css(tx, { fontSize: '31px', fontWeight: 600, letterSpacing: '-.02em' });
        A(r, 'up', 1.5 + i * 0.2, { d: 20 });
        A(m, 'pop', 1.55 + i * 0.2);
      });
    },
  });

  /* 12. 리뷰 요청에 응답하는 방법 (p.44) — 가로 3단 흐름 */
  slide({
    id: 'p1d-respond', part: 'p1', chap: CH, title: '리뷰 요청에 응답하는 방법', theme: 'white', cls: 'dots',
    notes: '수정 요청을 받으면 먼저 댓글의 의도를 확인하고, 같은 브랜치에 Push해서 PR을 갱신합니다. 새 PR을 만들지 않습니다. 마지막으로 무엇을 반영했고 어떻게 검증했는지 댓글로 알립니다.',
    build(el, A) {
      ttl(el, A, '리뷰 요청에 응답하는 방법');
      const P = [
        ['chat', '댓글의 의도를 먼저 확인합니다', 'var(--green)'],
        ['branch', '수정 후 같은 브랜치에 Push합니다', 'var(--blue)'],
        ['check', '반영한 내용과 검증 결과를 알립니다', 'var(--violet)'],
      ];
      P.forEach((p, i) => {
        const x = 120 + i * 590, T0 = 0.3 + i * 0.55;
        const cd = U.card(el, { x, y: 266, w: 500, h: 470, pad: 0 });
        A(cd, 'up', T0, { d: 60 });
        const vis = U.box(cd, 0, 0, 500, 470);
        if (i === 0) {
          const av = U.avatar(vis, 'R', 'var(--blue)', 60); U.place(av, 34, 44);
          const avn = U.text(vis, '', '리뷰어', 108, 56); css(avn, { fontSize: '28px', fontWeight: 800 });
          const bb = U.bubble(vis, '빈 입력 테스트를<br>추가해 주세요.', { x: 34, y: 130, w: 432, size: 32, bg: 'var(--red-l)', fg: '#8F1D1D', tail: 'tl', shadow: 'none' });
          A(avn, 'fade', T0 + 0.35);
          const it = U.box(vis, 34, 320, 432, 110); css(it, { background: 'var(--green-l)', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', padding: '0 22px' });
          it.appendChild(U.icon('search', 40, 'var(--green-d)', 2.4)); const itt = h('span', '', it, '의도: 빈 입력에서도<br>오류 없이 동작'); css(itt, { fontSize: '27px', fontWeight: 700, color: 'var(--green-d)', lineHeight: 1.35 });
          A(bb, 'pop', T0 + 0.3, { from: 0.6 }); A(av, 'pop', T0 + 0.35); A(it, 'up', T0 + 0.5, { d: 20 });
        } else if (i === 1) {
          const tb = U.box(vis, 0, 0, 500, 470); css(tb, { background: '#0E1530', borderRadius: '26px' });
          const tm = U.term(tb, ['$ git add tests/', '$ git commit -m', '>   "test: 빈 입력 확인"', '$ git push'], { x: 30, y: 36, size: 26 });
          tm.rows.forEach(r => css(r, { lineHeight: '60px' }));
          A(tm.rows, 'right', T0 + 0.3, { each: 0.1, d: 30 });
          const bc = U.box(tb, 30, 300, 440, 130); css(bc, { background: 'rgba(75,227,166,.12)', borderRadius: '18px', padding: '20px 24px' });
          const b1 = h('div', '', bc, '같은 브랜치'); css(b1, { fontSize: '24px', fontWeight: 700, color: '#8F9ABB' });
          const b2 = h('div', '', bc); css(b2, { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontFamily: 'var(--mono)', fontSize: '30px', fontWeight: 700, color: 'var(--mint)' });
          b2.appendChild(U.icon('branch', 34, 'var(--mint)', 2.4)); h('span', '', b2, 'fix/empty-title');
          A(bc, 'up', T0 + 0.75, { d: 20 });
        } else {
          const bb = U.bubble(vis, '반영했습니다. 빈 입력이면 빈 문자열을 돌려주고, 테스트를 추가했습니다.', { x: 34, y: 40, w: 432, size: 28, bg: 'var(--violet-l)', fg: '#3D2A99', tail: 'bl', shadow: 'none' });
          const ck = U.box(vis, 34, 300, 432, 140); css(ck, { display: 'flex', flexDirection: 'column', gap: '14px' });
          ['test_empty  통과', '전체 테스트 12개 통과'].forEach((t, k) => { const r = h('div', '', ck); css(r, { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '27px', fontWeight: 650 }); const s1 = U.status(r, 'ok', 40); h('span', '', r, t); A(s1, 'stamp', T0 + 0.6 + k * 0.12, { dur: 0.4 }); });
          A(bb, 'pop', T0 + 0.3, { from: 0.6 });
        }
        const cp = U.box(el, x, 776, 500, 170); css(cp, { display: 'flex', gap: '18px', alignItems: 'flex-start' });
        const n = U.num(cp, i + 1, { size: 60, bg: p[2] });
        const tx = h('div', 'p1d-cap', cp, p[1]); css(tx, { fontSize: '36px', fontWeight: 780, lineHeight: 1.32 });
        A(cp, 'up', T0 + 0.2, { d: 30 });
        if (i < 2) { const ar = U.arrow(el, [[x + 512, 500], [x + 578, 500]], { color: '#C9CEDA', sw: 6 }); A(ar.path, 'draw', T0 + 0.45, { dur: 0.3 }); A(ar.head, 'fade', T0 + 0.7); }
      });
    },
  });

  /* 13. GitHub Actions와 CI (p.45) — 검사 세 단계가 차례로 돌다가 통과 */
  slide({
    id: 'p1d-actions-ci', part: 'p1', chap: CH, title: 'GitHub Actions와 CI', theme: 'white',
    notes: 'PR을 열거나 Push하면 .github/workflows의 워크플로가 실행됩니다. 빌드, 테스트, 코드 스타일 검사가 차례로 돌고 결과가 PR 화면에 표시됩니다. 실패하면 그 결과를 보고 고칩니다.',
    build(el, A) {
      ttl(el, A, 'GitHub Actions와 CI');
      const wf = U.chip(el, '.github/workflows/ci.yml', { bg: '#F2F3F7', fg: 'var(--ink)', icon: 'file', size: 'lg', x: 120, y: 216 }); css(wf, { fontFamily: 'var(--mono)', fontSize: '28px' });
      const on = U.chip(el, 'on: pull_request', { bg: 'var(--violet-l)', fg: '#4B32C3', icon: 'play', size: 'lg', x: 640, y: 216 }); css(on, { fontFamily: 'var(--mono)', fontSize: '28px' });
      A(wf, 'up', 0.3, { d: 20 }); A(on, 'up', 0.4, { d: 20 });
      // 파이프라인
      const Y = 340, HH = 330;
      const pr = U.card(el, { x: 120, y: Y, w: 300, h: HH, pad: 0 });
      U.badge(pr, 'pr', { size: 84, bg: 'var(--ink)', x: 108, y: 44 });
      const pt = U.text(pr, '', 'PR #14', 0, 150, 300); css(pt, { textAlign: 'center', fontSize: '34px', fontWeight: 850 });
      this.prs = U.text(pr, '', '검사 대기', 0, 210, 300); css(this.prs, { textAlign: 'center', fontSize: '27px', fontWeight: 700, color: '#7B8299' });
      A(pr, 'up', 0.45, { d: 50 });
      const run = U.card(el, { x: 480, y: Y + 65, w: 220, h: 200, pad: 0 }); css(run, { background: '#0E1530' });
      U.badge(run, 'server', { size: 70, bg: 'transparent', fg: '#fff', x: 75, y: 30, k: .8 });
      const rt = U.text(run, '', 'Actions', 0, 120, 220); css(rt, { textAlign: 'center', fontSize: '30px', fontWeight: 800, color: '#fff' });
      A(run, 'pop', 0.65, { from: 0.6 });
      const S3 = [['gear', '빌드', 'python -m build'], ['flask', '테스트', 'python -m unittest'], ['pen', '코드 스타일', 'ruff check .']];
      this.sw = [];
      S3.forEach((sg, i) => {
        const x = 780 + i * 350;
        const c = U.card(el, { x, y: Y, w: 320, h: HH, pad: 0 });
        A(c, 'up', 0.8 + i * 0.1, { d: 50 });
        U.badge(c, sg[0], { size: 76, bg: '#F2F3F7', fg: 'var(--ink)', x: 32, y: 34, square: true, k: .55 });
        const sw = swap(c, 'run', 'ok', 60); U.place(sw.el, 228, 42); this.sw.push(sw);
        const wt = U.status(c, 'wait', 60); U.place(wt, 228, 42); sw.wait = wt;
        const nm = U.text(c, '', sg[1], 32, 140, 270); css(nm, { fontSize: '40px', fontWeight: 850 });
        const cm = U.text(c, 'mono', sg[2], 32, 206, 270); css(cm, { fontSize: '24px', color: '#5B6480', lineHeight: 1.35 });
      });
      const ls = [[420, 505, 480, 505], [700, 505, 780, 505], [1100, 505, 1130, 505], [1450, 505, 1480, 505]];
      ls.forEach((l, i) => { const a = U.arrow(el, [[l[0], l[1]], [l[2], l[3]]], { color: '#C9CEDA', sw: 6, head: false }); A(a.path, 'draw', 0.6 + i * 0.12, { dur: 0.25 }); });
      this.dot = U.box(el, 0, 0, 20, 20); css(this.dot, { borderRadius: '50%', background: 'var(--amber)' });
      // 설명 세 줄
      const bl = ['PR 변경을 자동으로 검사합니다', '빌드·테스트·코드 스타일을 확인합니다', '결과를 보고 필요한 수정을 합니다'];
      bl.forEach((t, i) => {
        const r = U.box(el, 120 + i * 570, 740, 540, 150); css(r, { display: 'flex', gap: '18px', alignItems: 'flex-start', borderTop: '3px solid var(--ink)', paddingTop: '26px' });
        const m = mk(r, i + 1); const tx = h('span', 'p1d-cap', r, t); css(tx, { fontSize: '36px', fontWeight: 760 });
        A(r, 'up', 1.0 + i * 0.1, { d: 30 });
      });
    },
    render(t, S) {
      const T = i => 1.3 + i * 0.85;
      this.sw.forEach((sw, i) => {
        const a = S.final ? 99 : t;
        const started = a >= T(i), done = a >= T(i) + 0.85;
        css(sw.wait, { opacity: started ? 0 : 1 });
        css(sw.el, { opacity: started ? 1 : 0 });
        sw.set(done ? clamp((a - T(i) - 0.85) / 0.3) : 0, a);
      });
      const all = S.final || t >= T(2) + 0.85;
      this.prs.textContent = all ? '검사 3/3 통과' : t >= T(0) ? '검사 중' : '검사 대기';
      css(this.prs, { color: all ? 'var(--green-d)' : t >= T(0) ? '#B07400' : '#7B8299' });
      // 단계 사이를 오가는 점
      if (!S.final && t > 1.1 && t < T(2) + 0.85) {
        const k = clamp(Math.floor((t - 1.1) / 0.85), 0, 2), f = ((t - 1.1) % 0.85) / 0.85;
        const x = lerp(700 + k * 350, 780 + k * 350 + 160, f);
        css(this.dot, { opacity: 1, left: (x - 10) + 'px', top: '495px' });
      } else css(this.dot, { opacity: 0 });
    },
  });

  /* 14. 실패한 검사의 원인 확인 (p.46) — 단계 2: 실패한 Job → 로그의 오류 줄 → 새 Commit 에서 모두 통과 */
  slide({
    id: 'p1d-ci-fail', part: 'p1', chap: CH, title: '실패한 검사의 원인 확인', theme: 'white', steps: 2,
    notes: '클릭 1: 실패한 Job(test)을 열어 어느 Step에서 멈췄는지 찾고 로그에서 실제 오류 줄(IndexError)을 읽습니다. 클릭 2: 고친 뒤 새 Commit을 Push하면 검사가 다시 돕니다. 이전 Commit의 결과가 아니라 최신 Commit의 결과를 확인합니다.',
    build(el, A) {
      ttl(el, A, '실패한 검사의 원인 확인');
      // 왼쪽 단계 안내
      const L = ['실패한 Job과 Step을 찾습니다', '로그에서 실제 오류를 읽습니다', '수정 후 최신 Commit의 결과를 봅니다'];
      this.guide = L.map((l, i) => {
        const r = U.box(el, 120, 250 + i * 200, 470, 170); css(r, { display: 'flex', gap: '20px', alignItems: 'flex-start', borderRadius: '22px', padding: '24px 24px' });
        const m = mk(r, i + 1, ['r', 'a', 'g'][i]); css(m, { width: '56px', height: '56px', fontSize: '32px' });
        const tx = h('span', 'p1d-cap', r, l); css(tx, { fontSize: '35px', fontWeight: 780, lineHeight: 1.32 });
        A(r, 'left', 0.3 + i * 0.1, { d: 40 });
        return r;
      });
      // 검사 창
      const W = U.win(el, { x: 640, y: 236, w: 1160, h: 680, title: 'Checks' });
      A(W.el, 'up', 0.3, { d: 60 });
      const b = W.body;
      this.cm = U.box(b, 24, 16, 1110, 64); css(this.cm, { display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--mono)', fontSize: '25px', fontWeight: 600, background: '#F6F7FA', borderRadius: '12px', padding: '0 20px' });
      this.cm.appendChild(U.icon('commit', 34, '#7B8299', 2.4));
      this.cmt = h('span', '', this.cm, '9f3e1d0 · feat: normalize_title 추가');
      const jobs = [['build', 'ok'], ['lint', 'ok'], ['test (3.12)', 'fail'], ['docs', 'skip'], ['e2e', 'skip'], ['package', 'skip']];
      this.jobs = jobs.map((j, i) => {
        const r = U.box(b, 24, 100 + i * 82, 380, 70); css(r, { display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '14px', padding: '0 18px', fontFamily: 'var(--mono)', fontSize: '27px', fontWeight: 600 });
        const sw = swap(r, j[1], 'ok', 44);
        h('span', '', r, j[0]);
        A(r, 'right', 0.6 + i * 0.07, { d: 30 });
        return { r, sw, kind: j[1] };
      });
      // 로그
      const lg = U.box(b, 430, 100, 706, 500); css(lg, { background: '#0E1530', borderRadius: '16px', overflow: 'hidden' });
      this.lg = lg;
      const lh = U.text(lg, 'mono', 'test (3.12) · Run tests', 26, 18); css(lh, { fontSize: '24px', color: '#8F9ABB', fontWeight: 600 });
      const lw = h('div', 'p1d-log', lg); U.place(lw, 0, 64, 706);
      const LL = [['dim', '✓ Set up Python'], ['dim', '✓ Install dependencies'], ['', '✗ Run tests'], ['', 'test_basic ... ok'], ['er', 'test_empty ... ERROR'], ['er', 'IndexError: string index'], ['er', '  out of range'], ['', 'FAILED (errors=1)']];
      this.ll = LL.map(l => { const r = h('div', 'ln ' + l[0], lw); r.textContent = l[1]; return r; });
      this.erb = U.box(lg, 10, 64 + 50 * 5 - 2, 686, 104); css(this.erb, { border: '3px solid #FF6B6B', borderRadius: '10px' });
      this.cn = U.arrow(el, [[1044, 236 + 56 + 100 + 82 * 2 + 35], [1080, 236 + 56 + 100 + 64 + 50 * 5 + 50]], { color: 'var(--red)', sw: 5, curve: 'h', head: false });
      this.okTail = h('span', '', this.cm); css(this.okTail, { marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--sans)', fontWeight: 800, fontSize: '26px', color: 'var(--green-d)' });
      U.status(this.okTail, 'ok', 40); h('span', '', this.okTail, '모든 검사 통과');
      this.lh = lh;
    },
    render(t, S) {
      const s1 = S.at(1), s2 = S.at(2);
      // 단계 안내 강조
      const act = S.step;
      this.guide.forEach((r, i) => css(r, { background: i === act ? ['var(--red-l)', 'var(--amber-l)', 'var(--green-l)'][i] : 'transparent', opacity: i <= act ? 1 : 0.4 }));
      // 실패 행 강조
      const fr = this.jobs[2].r;
      const pul = t > 1.2 && s2 < 0 ? 0.5 + 0.5 * Math.sin((t - 1.2) * 4) : 0;
      css(fr, { background: s2 >= 0 ? 'transparent' : `rgba(239,75,75,${0.1 + pul * 0.12})`, boxShadow: s2 >= 0 ? 'none' : 'inset 0 0 0 3px var(--red)' });
      // 로그 펼침
      const lp = prog(s1, 0, 0.5, ease.snap);
      css(this.lg, { clipPath: lp >= 1 ? 'none' : `inset(0 0 ${(1 - lp) * 100}% 0)`, opacity: lp > 0 ? 1 : 0 });
      this.ll.forEach((l, i) => { const q = prog(s1, 0.15 + i * 0.06, 0.35); css(l, { opacity: q, transform: `translateX(${(1 - q) * 30}px)` }); });
      const ep = prog(s1, 0.8, 0.35, ease.pop); css(this.erb, { opacity: clamp(ep * 2), transform: `scale(${lerp(1.08, 1, ep)})` });
      css(this.cn.path, { strokeDasharray: '1 1', strokeDashoffset: 1 - prog(s1, 0.9, 0.35), opacity: s1 > 0.9 && s2 < 0 ? 1 : 0 });
      // 새 Commit → 모두 통과
      const q2 = prog(s2, 0, 0.4);
      this.cmt.textContent = s2 >= 0 ? 'a1b2c3d · fix: 빈 입력 처리' : '9f3e1d0 · feat: normalize_title 추가';
      css(this.cm, { background: s2 >= 0 ? 'var(--green-l)' : '#F6F7FA', color: s2 >= 0 ? 'var(--green-d)' : 'var(--ink)' });
      this.jobs.forEach((j, i) => { const p = j.kind === 'ok' ? 0 : prog(s2, 0.3 + i * 0.12, 0.35); j.sw.set(j.kind === 'ok' ? 0 : p, t); });
      const op = prog(s2, 1.0, 0.5, ease.pop);
      css(this.okTail, { opacity: clamp(op * 2), transform: `scale(${op > 0 && op < 1 ? lerp(1.3, 1, op) : 1})` });
      this.lh.textContent = s2 >= 0 ? '이전 Commit 9f3e1d0 · test (3.12) 로그' : 'test (3.12) · Run tests';
      css(this.lg, { filter: s2 >= 0 ? `saturate(${1 - q2 * 0.7})` : 'none' });
      css(this.erb, { opacity: s2 >= 0 ? lerp(1, 0.45, q2) : clamp(ep * 2) });
    },
  });
})();
