/* 1B Git 기본 (원본 p.12~p.21) — 짙은 잉크 바탕 + 형광 초록, 커밋 그래프 */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, count, noise } = DECK;
  const U = UI;
  const CH = '1B Git 기본';
  const C = { main: '#9DB0E0', mint: '#4BE3A6', blue: '#7FA4FF', vio: '#B3A2FF', amb: '#F5C26B', red: '#FF8A8A', bg: '#0F1B3D', card: '#18264D' };

  /* 전체 화면 SVG 한 장 */
  const fullSvg = el => s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none' }, el);
  /* 저장소 카드: 아이콘 + 위 라벨 + 아래 mono 이름 */
  function repoCard(parent, x, y, w, hh, o) {
    const c = U.card(parent, { x, y, w, h: hh, pad: 30 });
    css(c, { boxShadow: `0 0 0 3px ${o.color}, 0 30px 60px -30px rgba(0,0,0,.6)`, background: C.card });
    const r = h('div', 'row', c); css(r, { gap: '16px' });
    r.appendChild(U.icon(o.icon || 'folder', 48, o.color, 2.2));
    const lb = h('span', '', r, o.label); css(lb, { fontSize: '30px', fontWeight: 780, color: '#fff' });
    const nm = h('div', 'mono', c, o.name); css(nm, { fontSize: '28px', color: o.color, marginTop: '18px', fontWeight: 700 });
    if (o.sub) { const sb = h('div', '', c, o.sub); css(sb, { fontSize: '24px', color: '#AEB8D3', marginTop: '8px', fontWeight: 550 }); }
    return c;
  }

  /* 1. Clone과 Fork의 차이 (p.12) */
  slide({
    id: 'p1b-clone-fork', part: 'p1', chap: CH, title: 'Clone과 Fork의 차이', theme: 'ink', cls: 'dots',
    notes: 'Clone 은 저장소를 내 컴퓨터로 복제하는 것, Fork 는 GitHub 안에 내 계정의 별도 저장소를 만드는 것. 쓰기 권한이 없는 프로젝트에는 Fork 를 Clone 해서 작업한다.',
    build(el, A) {
      const T = U.title(el, null, 'Clone과 Fork의 차이', { y: 90, align: 'center' });
      A(T.t, 'chars', 0, { each: 0.04 });
      const div = U.box(el, 959, 250, 2, 560); css(div, { background: 'rgba(255,255,255,.16)' });
      A(div, 'grow', 0.2, { axis: 'y', origin: '50% 0%' });
      // Clone
      const r1 = repoCard(el, 150, 280, 330, 190, { color: C.blue, label: 'GitHub', name: 'owner/project', icon: 'cloud' });
      const r2 = repoCard(el, 560, 520, 330, 190, { color: C.mint, label: '내 PC', name: '~/project', icon: 'laptop' });
      A(r1, 'up', 0.3); A(r2, 'up', 0.9);
      const svg = fullSvg(el);
      const cp = s('path', { d: 'M 480 375 C 640 375, 725 400, 725 510', fill: 'none', stroke: C.mint, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1 }, svg);
      A(cp, 'draw', 0.55, { dur: 0.5 });
      const ch = s('path', { d: 'M 707 492 L 725 512 L 743 492', fill: 'none', stroke: C.mint, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
      A(ch, 'fade', 0.95);
      this.clonePath = cp;
      this.flyers = [0, 1, 2].map(k => { const f = U.icon('file', 40, '#fff', 2.2); U.place(f, 0, 0); el.appendChild(f); return f; });
      const c1 = U.text(el, '', '<b class="hl">Clone</b> 내 작업 환경에 복제', 150, 760, 760); css(c1, { fontSize: '46px', fontWeight: 760, letterSpacing: '-.03em' });
      A(c1, 'up', 1.2);
      // Fork
      const f1 = repoCard(el, 1030, 280, 360, 190, { color: C.blue, label: '원본 저장소', name: 'owner/project', icon: 'folder' });
      const f2 = repoCard(el, 1440, 520, 360, 190, { color: C.mint, label: '내 계정의 Fork', name: 'my-id/project', icon: 'branch' });
      A(f1, 'up', 0.5);
      A(f2, 'tilt', 1.3, { dx: -300, d: -170, r: 0, dur: 0.75 });
      const fp = s('path', { d: 'M 1390 375 C 1560 375, 1620 400, 1620 510', fill: 'none', stroke: C.mint, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1 }, svg);
      A(fp, 'draw', 1.3, { dur: 0.5 });
      const fh = s('path', { d: 'M 1602 492 L 1620 512 L 1638 492', fill: 'none', stroke: C.mint, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
      A(fh, 'fade', 1.75);
      const gz = U.chip(el, 'GitHub 안에서', { bg: 'rgba(127,164,255,.16)', fg: C.blue, icon: 'cloud', x: 1030, y: 540 });
      css(gz, { fontSize: '26px' }); A(gz, 'fade', 1.5);
      const c2 = U.text(el, '', '<b class="hb">Fork</b> GitHub에 별도 저장소 생성', 1030, 760, 780); css(c2, { fontSize: '46px', fontWeight: 760, letterSpacing: '-.03em' });
      A(c2, 'up', 1.6);
      // 바닥 띠
      const band = U.box(el, 120, 868, 1680, 96);
      css(band, { background: 'rgba(75,227,166,.12)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '22px', fontSize: '40px', fontWeight: 780, color: '#fff', letterSpacing: '-.02em' });
      band.innerHTML = '<span><span class="hl">Fork</span>를 <span class="hl">Clone</span>해서 수정할 수 있습니다</span>';
      A(band, 'wipe', 2.0, { dur: 0.6 });
    },
    render(t, S) {
      const L = this.clonePath.getTotalLength();
      this.flyers.forEach((f, k) => {
        const ph = S.final ? -1 : ((t - 1.0 - k * 0.45) / 1.35);
        const u = ph - Math.floor(ph);
        if (S.final || t < 1.0 + k * 0.45) { css(f, { opacity: 0 }); return; }
        const p = this.clonePath.getPointAtLength(u * L);
        css(f, { left: (p.x - 20) + 'px', top: (p.y - 20) + 'px', opacity: Math.sin(u * Math.PI) });
      });
    },
  });

  /* 2. Fork로 시작하는 기여 (p.13) — 세 칸 장면 */
  slide({
    id: 'p1b-fork-flow', part: 'p1', chap: CH, title: 'Fork로 시작하는 기여', theme: 'ink',
    notes: '① 원본 저장소에서 Fork 버튼 ② 내 Fork 에 작업 브랜치를 만들어 수정 ③ 원본 저장소로 PR. PR 화면의 화살표 방향(my-id:fix/readme → owner:main)을 짚어 준다.',
    build(el, A) {
      const T = U.title(el, null, 'Fork로 시작하는 기여', { y: 90 });
      A(T.t, 'chars', 0, { each: 0.04 });
      const X = [120, 700, 1280], W = 520;
      const caps = ['원본 프로젝트를<br>Fork합니다', '내 Fork의 브랜치에서<br>수정합니다', '원본 프로젝트에<br>PR을 제안합니다'];
      X.forEach((x, k) => {
        const n = U.num(el, k + 1, { size: 70, bg: [C.blue, C.mint, C.vio][k], fg: C.bg, x, y: 770 });
        const c = U.text(el, '', caps[k], x + 96, 766, W - 96); css(c, { fontSize: '38px', fontWeight: 750, lineHeight: 1.3, letterSpacing: '-.02em' });
        A(n, 'pop', 0.5 + k * 0.7); A(c, 'up', 0.58 + k * 0.7, { d: 24 });
        if (k < 2) { const ar = U.icon('arrow', 56, 'rgba(255,255,255,.45)', 2.4); U.place(ar, x + W + 2, 460); el.appendChild(ar); A(ar, 'right', 0.9 + k * 0.7, { d: 30 }); }
      });
      // ① Fork 버튼
      const w1 = U.win(el, { x: X[0], y: 250, w: W, h: 470, title: 'owner/project' }); css(w1.el, { background: '#fff' });
      A(w1.el, 'up', 0.3);
      const nm1 = U.text(w1.body, 'mono', 'owner / <b>project</b>', 30, 30); css(nm1, { fontSize: '28px' });
      const fb = U.btn(w1.body, 'Fork', '', { icon: 'branch', x: 300, y: 92 }); css(fb, { height: '64px', fontSize: '28px', padding: '0 26px' });
      this.fb = fb;
      const cur = U.icon('play', 44, C.bg, 2); U.place(cur, 0, 0); w1.body.appendChild(cur); css(cur, { transform: 'rotate(-60deg)' });
      this.cur = cur;
      const cp = U.card(w1.body, { x: 30, y: 210, w: 460, h: 160, pad: 26 });
      css(cp, { background: '#E9FBF3', color: 'var(--ink)', boxShadow: 'inset 0 0 0 3px #12B07A' });
      const cpl = h('div', 'row', cp); css(cpl, { gap: '12px', fontSize: '26px', fontWeight: 750 }); cpl.appendChild(U.icon('branch', 34, '#0B8A5F', 2.4)); h('span', '', cpl, '내 계정에 생긴 Fork');
      const cpn = h('div', 'mono', cp, 'my-id/project'); css(cpn, { fontSize: '28px', fontWeight: 700, color: '#0B8A5F', marginTop: '12px' });
      A(cp, 'pop', 1.25, { from: 0.6 });
      // ② 브랜치 그래프
      const w2 = U.win(el, { x: X[1], y: 250, w: W, h: 470, dark: true, title: 'my-id/project' });
      A(w2.el, 'up', 1.0);
      const g = U.graph(w2.body, {
        x: 0, y: 0, w: W, h: 400, r: 17, sw: 7, bg: '#0E1530',
        lanes: { main: { y: 120, color: C.main }, fix: { y: 270, color: C.mint } },
        nodes: [{ id: 'a', x: 60, lane: 'main' }, { id: 'b', x: 170, lane: 'main' }, { id: 'c', x: 460, lane: 'main' },
          { id: 'f1', x: 300, lane: 'fix' }, { id: 'f2', x: 420, lane: 'fix', ring: true }],
        edges: [['a', 'b'], ['b', 'c'], ['b', 'f1', C.mint], ['f1', 'f2']],
      });
      const lm = U.text(w2.body, 'mono', 'main', 40, 50); css(lm, { fontSize: '26px', color: C.main, fontWeight: 700 });
      const lf = U.text(w2.body, 'mono', 'fix/readme', 220, 316); css(lf, { fontSize: '26px', color: C.mint, fontWeight: 700 });
      A(g.edges[0], 'draw', 1.2, { dur: 0.3 }); A(g.edges[1], 'draw', 1.35, { dur: 0.4 });
      A([g.nodes.a, g.nodes.b, g.nodes.c], 'pop', 1.25, { each: 0.1 });
      A(g.edges[2], 'draw', 1.6, { dur: 0.4 }); A(g.nodes.f1, 'pop', 1.9); A(g.edges[3], 'draw', 2.0, { dur: 0.25 }); A(g.nodes.f2, 'pop', 2.2);
      A(lm, 'fade', 1.3); A(lf, 'fade', 1.9);
      // ③ PR 화면
      const w3 = U.win(el, { x: X[2], y: 250, w: W, h: 470, title: 'owner/project · Pull requests' }); css(w3.el, { background: '#fff' });
      A(w3.el, 'up', 1.7);
      const pt = U.text(w3.body, '', 'Open a pull request', 30, 30); css(pt, { fontSize: '30px', fontWeight: 800 });
      const dir = U.box(w3.body, 30, 96, 460, 150); css(dir, { background: '#F4F6FB', borderRadius: '16px', padding: '20px 24px', fontFamily: 'var(--mono)', fontSize: '25px', lineHeight: 1.65 });
      dir.innerHTML = '<div><span style="color:#7B8299">base:</span> <b>owner:main</b></div><div style="color:#7C5CFF">← <span style="color:#7B8299">compare:</span> <b>my-id:fix/readme</b></div>';
      A(dir, 'up', 2.0, { d: 20 });
      const pb = U.btn(w3.body, 'Create pull request', 'green', { icon: 'pr', x: 30, y: 300 }); css(pb, { height: '70px', fontSize: '28px' });
      A(pb, 'stamp', 2.35, { dur: 0.45, from: 1.4, r: 0 });
    },
    render(t, S) {
      // 커서가 Fork 버튼으로 가서 누름
      const mv = S.final ? 1 : prog(t, 0.6, 0.45, ease.inOutCubic);
      css(this.cur, { left: lerp(120, 410, mv) + 'px', top: lerp(320, 140, mv) + 'px', opacity: S.final ? 0 : clamp((t - 0.5) * 4) * (1 - prog(t, 1.6, 0.3)) });
      const press = S.final ? 0 : Math.exp(-Math.pow((t - 1.1) * 9, 2));
      css(this.fb, { transform: `scale(${1 - press * 0.08})`, background: press > 0.3 ? '#EEF0F5' : '#fff' });
    },
  });

  /* 3. Branch에서 변경을 분리합니다 (p.14) — 큰 커밋 그래프 */
  slide({
    id: 'p1b-branch', part: 'p1', chap: CH, title: 'Branch에서 변경을 분리합니다', theme: 'ink', cls: 'dots',
    notes: 'docs 와 fix 처럼 목적이 다른 변경은 각자 브랜치에서 작업한다. 검토가 끝난 docs 만 main 에 Merge 되고, fix 는 아직 작업 중이다.',
    build(el, A) {
      const T = U.title(el, null, 'Branch에서 변경을 분리합니다', { y: 90 });
      A(T.t, 'chars', 0, { each: 0.035 });
      const lanes = { main: { y: 230, color: C.main }, docs: { y: 90, color: C.mint }, fix: { y: 370, color: C.blue } };
      const g = U.graph(el, {
        x: 120, y: 230, w: 1680, h: 460, r: 22, sw: 9, bg: C.bg, lanes,
        nodes: [
          { id: 'm1', x: 220, lane: 'main' }, { id: 'm2', x: 420, lane: 'main' },
          { id: 'd1', x: 640, lane: 'docs' }, { id: 'd2', x: 860, lane: 'docs' },
          { id: 'f1', x: 720, lane: 'fix' }, { id: 'f2', x: 960, lane: 'fix' }, { id: 'f3', x: 1500, lane: 'fix' },
          { id: 'm3', x: 1140, lane: 'main', ring: true, r: 28 }, { id: 'm4', x: 1620, lane: 'main' },
        ],
        edges: [['m1', 'm2'], ['m2', 'd1', C.mint], ['d1', 'd2'], ['m2', 'f1', C.blue], ['f1', 'f2'], ['d2', 'm3', C.mint], ['m2', 'm3'], ['f2', 'f3', C.blue], ['m3', 'm4']],
      });
      const E = g.edges, N = g.nodes;
      const P1 = 0.4, P2 = 1.2, P3 = 2.1;
      A(E[0], 'draw', P1, { dur: 0.3 }); A([N.m1, N.m2], 'pop', P1, { each: 0.15 });
      A(E[1], 'draw', P1 + 0.35, { dur: 0.35 }); A(E[3], 'draw', P1 + 0.45, { dur: 0.35 });
      A(N.d1, 'pop', P2); A(N.f1, 'pop', P2 + 0.1); A(E[2], 'draw', P2 + 0.15, { dur: 0.3 }); A(E[4], 'draw', P2 + 0.25, { dur: 0.3 });
      A(N.d2, 'pop', P2 + 0.45); A(N.f2, 'pop', P2 + 0.55);
      A(E[6], 'draw', P3 - 0.2, { dur: 0.5 }); A(E[5], 'draw', P3, { dur: 0.4 }); A(N.m3, 'pop', P3 + 0.4, { from: 0.3 });
      A(E[8], 'draw', P3 + 0.5, { dur: 0.3 }); A(N.m4, 'pop', P3 + 0.75);
      A(E[7], 'draw', P3 + 0.4, { dur: 0.5 }); A(N.f3, 'pop', P3 + 0.85);
      const lab = (txt, x, y, col, t0) => { const l = U.text(el, 'mono', txt, x, y); css(l, { fontSize: '30px', fontWeight: 700, color: col }); A(l, 'right', t0, { d: 30 }); return l; };
      lab('main', 120, 410, C.main, P1); lab('docs', 120 + 560, 230 + 90 - 78, C.mint, P2); lab('fix', 120 + 640, 230 + 370 + 34, C.blue, P2 + 0.1);
      const mg = U.chip(el, 'Merge', { bg: 'rgba(179,162,255,.18)', fg: C.vio, icon: 'merge', x: 120 + 1140 - 70, y: 230 + 230 + 46 });
      css(mg, { fontSize: '26px' }); A(mg, 'pop', P3 + 0.5);
      const wip = U.chip(el, '작업 중', { bg: 'rgba(127,164,255,.16)', fg: C.blue, x: 120 + 1500 + 34, y: 230 + 370 - 22 });
      css(wip, { fontSize: '24px' }); A(wip, 'fade', P3 + 0.9);
      // 아래 세 단계
      const steps = [['branch', '기본 브랜치에서<br>작업 브랜치를 만듭니다', C.mint, P1 + 0.4], ['doc', '서로 다른 변경은<br>분리합니다', C.blue, P2 + 0.5], ['merge', '검토한 변경을<br>Merge합니다', C.vio, P3 + 0.5]];
      steps.forEach(([ic, tx, col, t0], k) => {
        const x = 120 + k * 590;
        const b = U.badge(el, ic, { size: 96, bg: col, fg: C.bg, x, y: 790 });
        const c = U.text(el, '', tx, x + 124, 790, 420); css(c, { fontSize: '36px', fontWeight: 720, lineHeight: 1.32, letterSpacing: '-.02em' });
        A(b, 'pop', t0); A(c, 'up', t0 + 0.08, { d: 24 });
        if (k < 2) { const ar = U.icon('arrow', 44, 'rgba(255,255,255,.35)', 2.4); U.place(ar, x + 520, 816); el.appendChild(ar); A(ar, 'fade', t0 + 0.3); }
      });
    },
  });

  /* 4. 작업 폴더와 Staging과 Commit (p.15) — 세 구역 */
  slide({
    id: 'p1b-staging', part: 'p1', chap: CH, title: '작업 폴더와 Staging과 Commit', theme: 'ink',
    notes: '수정한 파일이 모두 Commit 되는 것이 아니다. git add 로 이번 Commit 에 넣을 변경만 Staging 에 고른다. 여기서는 README.md 만 고르고 app.py 는 남겨 둔다.',
    build(el, A) {
      const T = U.title(el, null, '작업 폴더와 Staging과 Commit', { y: 90 });
      A(T.t, 'chars', 0, { each: 0.03 });
      const Z = [
        { x: 120, col: C.amb, ic: 'folder', name: '작업 폴더', en: 'Working directory', cap: '작업 폴더에서<br>파일을 수정합니다' },
        { x: 710, col: C.mint, ic: 'check', name: 'Staging', en: 'Staging area', cap: 'Staging에서 기록할<br>변경을 고릅니다' },
        { x: 1300, col: C.blue, ic: 'commit', name: 'Commit', en: 'Repository', cap: 'Commit으로<br>이력에 남깁니다' },
      ];
      Z.forEach((z, k) => {
        const b = U.box(el, z.x, 240, 500, 700); css(b, { background: 'rgba(255,255,255,.05)', borderRadius: '32px', boxShadow: `inset 0 0 0 2px ${z.col}55` });
        const hd = U.box(b, 36, 32, 430, 60); css(hd, { display: 'flex', alignItems: 'center', gap: '16px' });
        hd.appendChild(U.icon(z.ic, 46, z.col, 2.4));
        const nm = h('span', '', hd, z.name); css(nm, { fontSize: '42px', fontWeight: 850, color: '#fff', letterSpacing: '-.03em' });
        const en = U.text(b, 'mono', z.en, 38, 100); css(en, { fontSize: '24px', color: '#8F9ABB' });
        const cp = U.text(b, '', z.cap, 38, 540, 440); css(cp, { fontSize: '36px', fontWeight: 720, lineHeight: 1.35, color: '#fff', letterSpacing: '-.02em' });
        A(b, 'up', 0.15 + k * 0.12, { d: 60 }); A(cp, 'up', 0.5 + k * 0.6, { d: 20 });
        z.box = b;
      });
      // 구역 1: 수정한 파일 두 개
      const fileCard = (parent, x, y, name, col, tag) => {
        const c = U.box(parent, x, y, 428, 92); css(c, { background: C.card, borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '18px', padding: '0 24px', boxShadow: '0 0 0 2px rgba(255,255,255,.08)' });
        c.appendChild(U.icon('file', 40, col, 2.2));
        const n = h('span', 'mono', c, name); css(n, { fontSize: '30px', fontWeight: 700, color: '#fff' });
        if (tag) { const tg = h('span', '', c, tag); css(tg, { marginLeft: 'auto', fontSize: '24px', fontWeight: 750, color: col }); }
        return c;
      };
      const fA = fileCard(Z[0].box, 36, 190, 'README.md', C.amb, '수정됨');
      const fB = fileCard(Z[0].box, 36, 300, 'app.py', C.amb, '수정됨');
      A([fA, fB], 'left', 0.6, { each: 0.12, d: 40 });
      // 구역 2: 고르기 목록
      const pick = (y, name, on, t0) => {
        const r = U.box(Z[1].box, 36, y, 428, 92); css(r, { background: on ? 'rgba(75,227,166,.14)' : 'rgba(255,255,255,.04)', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '20px', padding: '0 24px' });
        const bx = h('span', 'badge', r); css(bx, { width: '44px', height: '44px', borderRadius: '10px', border: `3px solid ${on ? C.mint : '#5A678E'}`, background: on ? C.mint : 'transparent', color: C.bg });
        if (on) { const ck = U.icon('check', 32, C.bg, 3.4); bx.appendChild(ck); A(ck, 'stamp', t0 + 0.25, { dur: 0.4 }); }
        const n = h('span', 'mono', r, name); css(n, { fontSize: '30px', fontWeight: 700, color: on ? '#fff' : '#8F9ABB' });
        A(r, 'fade', t0);
        return r;
      };
      pick(190, 'README.md', true, 1.2); pick(300, 'app.py', false, 1.2);
      // 날아가는 README 복제본
      this.ghost = fileCard(el, 0, 0, 'README.md', C.mint, '');
      // 구역 3: Commit 기록
      const g = s('svg', { width: 500, height: 420, viewBox: '0 0 500 420', style: 'position:absolute;left:0;top:0;overflow:visible' }, Z[2].box);
      const ln = s('path', { d: 'M 70 200 L 70 400', stroke: '#5A678E', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g);
      [300, 380].forEach((y, k) => { const c = s('circle', { cx: 70, cy: y, r: 16, fill: '#5A678E' }, g); A(c, 'fade', 0.6); });
      A(ln, 'fade', 0.6);
      const oldL = U.text(Z[2].box, 'mono', '9c2e7b1  이전 Commit', 110, 282); css(oldL, { fontSize: '24px', color: '#8F9ABB' }); A(oldL, 'fade', 0.7);
      const nc = s('circle', { cx: 70, cy: 215, r: 26, fill: C.blue, stroke: '#fff', 'stroke-width': 5 }, g);
      css(nc, { transformBox: 'fill-box', transformOrigin: 'center' });
      A(nc, 'pop', 2.75, { from: 0.2 });
      const ncl = U.box(Z[2].box, 116, 180, 360, 80); css(ncl, { fontFamily: 'var(--mono)' });
      ncl.innerHTML = '<div style="font-size:30px;font-weight:700;color:#fff">docs: fix setup</div><div style="font-size:24px;color:#7FA4FF;margin-top:4px">a1f3c2e · README.md</div>';
      A(ncl, 'right', 2.85, { d: 30 });
      // 명령 칩
      const cmd1 = U.chip(el, 'git add README.md', { bg: C.mint, fg: C.bg, x: 520, y: 150 + 0 });
      const cmd2 = U.chip(el, 'git commit', { bg: C.blue, fg: C.bg, x: 1180, y: 150 });
      [cmd1, cmd2].forEach(c => css(c, { fontFamily: 'var(--mono)', fontSize: '26px', height: '52px' }));
      css(cmd1, { top: '660px', left: '746px' }); css(cmd2, { top: '660px', left: '1336px' });
      const ar1 = U.icon('arrow', 40, 'rgba(255,255,255,.4)', 2.4); U.place(ar1, 645, 470); el.appendChild(ar1); A(ar1, 'fade', 1.0);
      const ar2 = U.icon('arrow', 40, 'rgba(255,255,255,.4)', 2.4); U.place(ar2, 1235, 470); el.appendChild(ar2); A(ar2, 'fade', 2.4);
      A(cmd1, 'pop', 1.05); A(cmd2, 'pop', 2.45);
    },
    render(t, S) {
      // README 복제본: 구역1 → 구역2(1.2~1.7s), 구역2 → 구역3(2.4~2.9s)
      const p1 = prog(t, 1.15, 0.5, ease.inOutCubic), p2 = prog(t, 2.35, 0.5, ease.inOutCubic);
      const x = lerp(lerp(156, 746, p1), 1336, p2), y = lerp(430, 430, p1) - Math.sin(p1 * Math.PI) * 60 - Math.sin(p2 * Math.PI) * 60;
      const vis = S.final ? 0 : (t < 1.15 ? 0 : (t < 1.7 ? 1 : (t < 2.35 ? 0 : (t < 2.85 ? 1 : 0))));
      css(this.ghost, { left: x + 'px', top: y + 'px', opacity: vis, boxShadow: '0 0 0 3px #4BE3A6, 0 20px 40px -10px rgba(0,0,0,.5)' });
    },
  });

  /* 5. Commit에 남겨야 할 정보 (p.16) */
  slide({
    id: 'p1b-commit-msg', part: 'p1', chap: CH, title: 'Commit에 남겨야 할 정보', theme: 'ink', cls: 'dots',
    notes: '좋은 Commit 은 목적이 하나다. 첫 줄에 무엇을 바꿨는지, 필요하면 빈 줄 뒤 본문에 이유를 적는다. 예시 메시지는 설명용으로 만든 것.',
    build(el, A) {
      const T = U.title(el, null, 'Commit에<br>남겨야 할 정보', { y: 96, w: 780 });
      A(T.t, 'chars', 0, { each: 0.035 });
      const it = U.items(el, [
        { text: '하나의 목적을 설명할 수<br>있게 나눕니다', color: C.mint },
        { text: '무엇을 바꿨는지<br>메시지에 적습니다', color: C.blue },
        { text: '필요하면 변경 이유를<br>덧붙입니다', color: C.vio },
      ], { kind: 'num', x: 120, y: 420, w: 760, isz: 84, gap: 50, cls: 'b1' });
      it.rows.forEach(r => { css(r.lastChild, { color: '#fff', fontWeight: 650 }); r.firstChild.style.color = C.bg; });
      A(it.rows, 'up', 0.3, { each: 0.14 });
      // 메시지 편집기
      const w = U.win(el, { x: 940, y: 220, w: 860, h: 420, dark: true, title: 'COMMIT_EDITMSG' });
      A(w.el, 'left', 0.4, { d: 120 });
      const l1 = U.text(w.body, 'mono', 'docs: fix setup', 40, 40); css(l1, { fontSize: '40px', fontWeight: 700, color: C.amb });
      const l2 = U.text(w.body, '', 'README의 설치 명령이 바뀐 패키지', 40, 150); css(l2, { fontSize: '30px', color: '#DCE3F5', fontWeight: 500 });
      const l3 = U.text(w.body, '', '이름과 달라 실행되지 않았습니다.', 40, 200); css(l3, { fontSize: '30px', color: '#DCE3F5', fontWeight: 500 });
      A(l1, 'type', 0.9, { cps: 24 }); A(l2, 'type', 1.7, { cps: 30 }); A(l3, 'type', 2.3, { cps: 30, hold: true });
      const tg2 = U.chip(w.body, '무엇을 바꿨는지', { bg: 'rgba(127,164,255,.18)', fg: C.blue, x: 520, y: 42 }); css(tg2, { fontSize: '24px' });
      const tg3 = U.chip(w.body, '변경 이유', { bg: 'rgba(179,162,255,.18)', fg: C.vio, x: 40, y: 280 }); css(tg3, { fontSize: '24px' });
      A(tg2, 'pop', 1.5); A(tg3, 'pop', 2.9);
      // 한 목적씩 나눈 기록
      const lg = U.win(el, { x: 940, y: 680, w: 860, h: 270, dark: true, title: 'git log --oneline' });
      A(lg.el, 'up', 0.7);
      [['a1f3c2e', 'docs: fix setup'], ['9c2e7b1', 'test: 빈 입력 테스트 추가'], ['4b7d0aa', 'fix: 빈 입력 처리']].forEach(([hs, m], k) => {
        const r = U.box(lg.body, 36, 20 + k * 60, 780, 52); css(r, { display: 'flex', alignItems: 'center', gap: '22px', fontSize: '28px' });
        const a = h('span', 'mono', r, hs); css(a, { color: C.amb });
        const b = h('span', 'mono', r, m); css(b, { color: '#E6EAF5' });
        A(r, 'left', 1.0 + k * 0.1, { d: 30 });
      });
      const one = U.chip(lg.body, '목적 하나씩', { bg: 'rgba(75,227,166,.16)', fg: C.mint, x: 600, y: 80 }); css(one, { fontSize: '24px' });
      A(one, 'pop', 1.5);
    },
  });

  /* 6. Push와 Pull의 방향 (p.17) */
  slide({
    id: 'p1b-push-pull', part: 'p1', chap: CH, title: 'Push와 Pull의 방향', theme: 'ink',
    notes: 'Push 는 내 Commit 을 원격으로 올리고, Pull 은 원격 변경을 가져와 지금 브랜치에 합친다. 명령에 들어가는 원격 이름과 브랜치 이름을 항상 확인한다.',
    build(el, A) {
      const T = U.title(el, null, 'Push와 Pull의 방향', { y: 90 });
      A(T.t, 'chars', 0, { each: 0.04 });
      const panel = (x, label, icon, col) => {
        const p = U.card(el, { x, y: 250, w: 520, h: 380, pad: 36 });
        css(p, { background: C.card, boxShadow: `0 0 0 3px ${col}66` });
        const hd = h('div', 'row', p); css(hd, { gap: '16px', marginBottom: '26px' });
        hd.appendChild(U.icon(icon, 48, col, 2.2));
        const t = h('span', '', hd, label); css(t, { fontSize: '36px', fontWeight: 820, color: '#fff' });
        [['작업 브랜치', true], ['main', false]].forEach(([b, on]) => {
          const r = h('div', 'row', p); css(r, { gap: '16px', height: '86px', padding: '0 24px', borderRadius: '16px', background: on ? 'rgba(75,227,166,.16)' : 'rgba(255,255,255,.05)', marginTop: '14px', fontSize: '32px', fontWeight: 700, color: on ? C.mint : '#AEB8D3' });
          r.appendChild(U.icon('branch', 36, on ? C.mint : '#8F9ABB', 2.4)); h('span', '', r, b);
        });
        return p;
      };
      const L = panel(120, '내 PC (로컬)', 'laptop', C.mint), R = panel(1280, '원격 저장소', 'cloud', C.blue);
      A(L, 'right', 0.2, { d: 100 }); A(R, 'left', 0.3, { d: 100 });
      const svg = fullSvg(el);
      const push = s('path', { d: 'M 670 360 C 860 250, 1060 250, 1250 360', fill: 'none', stroke: C.mint, 'stroke-width': 10, 'stroke-linecap': 'round', pathLength: 1 }, svg);
      const pull = s('path', { d: 'M 1250 520 C 1060 630, 860 630, 670 520', fill: 'none', stroke: C.blue, 'stroke-width': 10, 'stroke-linecap': 'round', pathLength: 1 }, svg);
      const ph = s('path', { d: 'M 1222 336 L 1252 362 L 1215 370', fill: 'none', stroke: C.mint, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
      const lh = s('path', { d: 'M 698 544 L 668 518 L 705 510', fill: 'none', stroke: C.blue, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
      A(push, 'draw', 0.7, { dur: 0.6 }); A(ph, 'fade', 1.25); A(pull, 'draw', 1.3, { dur: 0.6 }); A(lh, 'fade', 1.85);
      this.push = push; this.pull = pull;
      this.dots = [0, 1, 2, 3].map(k => s('circle', { r: 11, fill: k < 2 ? C.mint : C.blue, stroke: C.bg, 'stroke-width': 4 }, svg));
      const pl = U.text(el, '', '<b class="hl">Push</b>  로컬 Commit을 원격으로', 690, 360, 540); css(pl, { fontSize: '32px', fontWeight: 700, textAlign: 'center' });
      const ll = U.text(el, '', '<b class="hb">Pull</b>  원격 변경을 가져와 통합', 690, 470, 540); css(ll, { fontSize: '32px', fontWeight: 700, textAlign: 'center' });
      A(pl, 'up', 1.0, { d: 20 }); A(ll, 'up', 1.6, { d: 20 });
      // 명령 해부
      const kk = U.text(el, 'k', '브랜치와 원격 이름을 확인합니다', 120, 730); A(kk, 'right', 2.0);
      const cmdRow = (y, parts, t0) => {
        const r = U.box(el, 120, y, 1680, 70); css(r, { display: 'flex', alignItems: 'flex-start', gap: '22px', fontFamily: 'var(--mono)', fontSize: '40px', fontWeight: 700 });
        parts.forEach(([tx, col, note]) => {
          const c = h('span', '', r); css(c, { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', color: col });
          h('span', '', c, tx);
          if (note) { const n = h('span', '', c, note); css(n, { fontFamily: 'var(--sans)', fontSize: '24px', fontWeight: 700, borderTop: `3px solid ${col}`, paddingTop: '6px', marginTop: '6px', color: col }); A(n, 'up', t0 + 0.35, { d: 12 }); }
        });
        A(r, 'right', t0, { d: 40 });
        return r;
      };
      cmdRow(790, [['git push', '#fff'], ['origin', C.amb, '원격 이름'], ['fix/readme', C.mint, '브랜치 이름']], 2.2);
      const r2 = cmdRow(790, [['git pull', '#fff'], ['origin', C.amb, '원격 이름'], ['main', C.blue, '브랜치 이름']], 2.5);
      css(r2, { left: '1000px', width: '800px' });
    },
    render(t, S) {
      const Lp = this.push.getTotalLength(), Ll = this.pull.getTotalLength();
      this.dots.forEach((d, k) => {
        const path = k < 2 ? this.push : this.pull, L = k < 2 ? Lp : Ll;
        const start = k < 2 ? 1.3 : 1.9;
        const u = ((t - start) / 1.6 + (k % 2) * 0.5) % 1;
        if (S.final || t < start) { css(d, { opacity: 0 }); return; }
        const p = path.getPointAtLength(u * L);
        d.setAttribute('cx', p.x); d.setAttribute('cy', p.y);
        css(d, { opacity: Math.sin(u * Math.PI) });
      });
    },
  });

  /* 7. 내 Fork와 원본 저장소 (p.18) — origin · upstream */
  slide({
    id: 'p1b-remotes', part: 'p1', chap: CH, title: '내 Fork와 원본 저장소', theme: 'ink', cls: 'dots',
    notes: 'Fork 를 Clone 하면 origin 은 내 Fork 를 가리킨다. 원본은 직접 upstream 이라는 이름으로 추가한다(git remote add upstream <원본 주소>). 이름은 관례일 뿐이므로 git remote -v 로 실제 주소를 확인한다.',
    build(el, A) {
      const T = U.title(el, null, '내 Fork와 원본 저장소', { y: 90, align: 'center' });
      A(T.t, 'chars', 0, { each: 0.04 });
      const cloud = (x, name, sub, col, t0) => {
        const c = U.card(el, { x, y: 250, w: 470, h: 230, pad: 34 });
        css(c, { background: C.card, boxShadow: `0 0 0 3px ${col}` });
        const r = h('div', 'row', c); css(r, { gap: '16px' });
        r.appendChild(U.icon('cloud', 52, col, 2.2));
        const n = h('span', 'mono', r, name); css(n, { fontSize: '46px', fontWeight: 700, color: col });
        const sb = h('div', 'mono', c, sub); css(sb, { fontSize: '28px', color: '#DCE3F5', marginTop: '22px' });
        A(c, 'up', t0, { d: 60 });
        return c;
      };
      cloud(120, 'origin', 'my-id/project', C.mint, 0.3);
      cloud(1330, 'upstream', 'owner/project', C.blue, 0.5);
      const lap = U.card(el, { x: 760, y: 270, w: 400, h: 190, pad: 30 });
      css(lap, { background: '#fff', color: 'var(--ink)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' });
      lap.appendChild(U.icon('laptop', 72, 'var(--ink)', 2));
      const lt = h('div', '', lap, '내 PC의 Clone'); css(lt, { fontSize: '30px', fontWeight: 800 });
      A(lap, 'pop', 0.15, { from: 0.8 });
      const a1 = U.arrow(el, [[600, 365], [740, 365]], { color: C.mint, sw: 7 });
      const a2 = U.arrow(el, [[1320, 365], [1180, 365]], { color: C.blue, sw: 7 });
      A(a1.path, 'draw', 0.7, { dur: 0.35 }); A(a1.head, 'fade', 1.0); A(a2.path, 'draw', 0.9, { dur: 0.35 }); A(a2.head, 'fade', 1.2);
      const c1 = U.text(el, '', '<b class="hl">origin</b>은 Clone한<br>저장소입니다', 120, 510, 600); css(c1, { fontSize: '36px', fontWeight: 720, lineHeight: 1.35 });
      const c2 = U.text(el, '', '<b class="hb">upstream</b>은 원본을<br>가리키도록 설정합니다', 1330, 510, 520); css(c2, { fontSize: '36px', fontWeight: 720, lineHeight: 1.35 });
      A(c1, 'up', 0.8); A(c2, 'up', 1.0);
      // git remote -v
      const w = U.win(el, { x: 330, y: 660, w: 1260, h: 300, dark: true, title: 'terminal' });
      const nt = U.text(w.body, '', '이름보다 실제 주소를 확인합니다', 560, 20, 660); css(nt, { fontSize: '30px', fontWeight: 800, color: C.amb, textAlign: 'right' });
      A(nt, 'right', 2.9, { d: 30 });
      A(w.el, 'up', 1.3);
      const t = U.term(w.body, ['$ git remote -v'], { size: 30, x: 40, y: 22 });
      A(t.rows[0].cmd, 'type', 1.6, { cps: 26 });
      const rows = [['origin', 'my-id', 'fetch', C.mint], ['origin', 'my-id', 'push', C.mint], ['upstream', 'owner', 'fetch', C.blue], ['upstream', 'owner', 'push', C.blue]];
      rows.forEach(([n, who, kind, col], k) => {
        const r = U.box(w.body, 40, 74 + k * 40, 1180, 40); css(r, { fontFamily: 'var(--mono)', fontSize: '27px', color: '#AEB8D3', whiteSpace: 'pre' });
        r.innerHTML = `<span style="color:${col};font-weight:700">${n.padEnd(9, ' ')}</span> https://github.com/<span class="who" style="color:${col};font-weight:700">${who}</span>/project.git (${kind})`;
        A(r, 'fade', 2.1 + k * 0.08, { dur: 0.2 });
        const wh = r.querySelector('.who'); css(wh, { position: 'relative', display: 'inline-block' });
        const mk = h('i', '', wh); css(mk, { position: 'absolute', left: 0, right: 0, height: '5px', bottom: '-1px', background: col, borderRadius: '3px', display: 'block' });
        A(mk, 'grow', 2.6 + k * 0.06, { dur: 0.3 });
      });
    },
  });

  /* 8. Upstream의 변경 반영 (p.19) — 클릭할 때마다 명령 하나 */
  slide({
    id: 'p1b-sync', part: 'p1', chap: CH, title: 'Upstream의 변경 반영', theme: 'ink', steps: 3,
    notes: '들어오면 1번(fetch)이 실행된 상태. 클릭마다 다음 명령. merge --ff-only 는 새 Merge Commit 없이 앞으로만 옮길 수 있을 때만 합친다. 마지막에 내 Fork(origin)의 main 도 원본과 같아진다.',
    build(el, A) {
      const T = U.title(el, null, 'Upstream의 변경 반영', { y: 90 });
      A(T.t, 'chars', 0, { each: 0.04 });
      const cmds = [
        ['git fetch upstream', '원본의 새 Commit을 가져옵니다'],
        ['git switch main', 'main 브랜치로 이동합니다'],
        ['git merge --ff-only upstream/main', '앞으로만 이동해 합칩니다'],
        ['git push origin main', '내 Fork에도 올립니다'],
      ];
      this.rows = cmds.map(([c, d], k) => {
        const r = U.box(el, 120, 250 + k * 170, 900, 148); css(r, { borderRadius: '22px', padding: '22px 30px 0 120px', background: 'rgba(255,255,255,.04)' });
        const n = U.num(r, k + 1, { size: 62, bg: '#3A4766', x: 30, y: 40 });
        const cm = h('div', 'mono', r, c); css(cm, { fontSize: '34px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' });
        const ds = h('div', '', r, d); css(ds, { fontSize: '28px', fontWeight: 600, color: '#AEB8D3', marginTop: '10px' });
        A(r, 'right', 0.2 + k * 0.08, { d: 40 });
        r.n = n; r.cm = cm;
        return r;
      });
      // 오른쪽 세 줄 다이어그램
      const svg = fullSvg(el);
      this.svg = svg;
      const XS = [1330, 1427, 1524, 1621, 1718], RY = [330, 560, 790];
      const labs = [['upstream', '원본 저장소', C.blue], ['main', '내 PC', C.mint], ['origin/main', '내 Fork', C.amb]];
      labs.forEach(([a, b, col], k) => {
        const l = U.text(el, '', `<div class="mono" style="font-size:28px;font-weight:700;color:${col};white-space:nowrap">${a}</div><div style="font-size:24px;font-weight:600;color:#8F9ABB;margin-top:4px">${b}</div>`, 1080, RY[k] - 34, 200);
        A(l, 'fade', 0.4 + k * 0.1);
      });
      this.lines = []; this.nodes = [];
      RY.forEach((y, r) => {
        const base = s('path', { d: `M ${XS[0]} ${y} L ${XS[2]} ${y}`, stroke: labs[r][2], 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none', pathLength: 1 }, svg);
        A(base, 'draw', 0.5 + r * 0.1, { dur: 0.4 });
        const ext = s('path', { d: `M ${XS[2]} ${y} L ${XS[4]} ${y}`, stroke: labs[r][2], 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none', pathLength: 1 }, svg);
        this.lines.push(ext);
        this.nodes.push(XS.map((x, i) => {
          const c = s('circle', { cx: x, cy: y, r: 22, fill: i < 3 ? labs[r][2] : C.bg, stroke: labs[r][2], 'stroke-width': 6 }, svg);
          css(c, { transformBox: 'fill-box', transformOrigin: 'center' });
          if (i < 3) A(c, 'pop', 0.55 + r * 0.1 + i * 0.06);
          return c;
        }));
      });
      // 새 Commit 표시
      const nw = U.chip(el, '새 Commit 2개', { bg: 'rgba(127,164,255,.18)', fg: C.blue, x: 1560, y: 240 }); css(nw, { fontSize: '24px' });
      A(nw, 'pop', 1.0);
      this.ghostLab = U.chip(el, '가져옴 · 아직 합치지 않음', { bg: 'rgba(255,255,255,.08)', fg: '#AEB8D3', x: 1450, y: 610 }); css(this.ghostLab, { fontSize: '24px' });
      this.head = U.chip(el, 'HEAD', { bg: C.mint, fg: C.bg, x: 1300, y: 476 }); css(this.head, { fontFamily: 'var(--mono)', fontSize: '24px', height: '40px' });
      this.ff = U.chip(el, 'Fast-forward', { bg: 'rgba(75,227,166,.18)', fg: C.mint, x: 1430, y: 470 }); css(this.ff, { fontFamily: 'var(--mono)', fontSize: '24px' });
      this.ar1 = U.arrow(el, [[1670, 368], [1670, 520]], { color: 'rgba(127,164,255,.7)', sw: 5 });
      this.ar2 = U.arrow(el, [[1670, 600], [1670, 750]], { color: 'rgba(245,194,107,.8)', sw: 5 });
    },
    render(t, S) {
      const at = S.at;
      // 단계 진행률: 0 fetch(입장), 1 switch, 2 merge, 3 push
      const P = [prog(at(0), 0.9, 0.6), prog(at(1), 0.1, 0.5), prog(at(2), 0.1, 0.6), prog(at(3), 0.1, 0.6)];
      const cur = S.step;
      this.rows.forEach((r, k) => {
        const active = k === cur, done = k < cur;
        css(r, { background: active ? 'rgba(75,227,166,.14)' : 'rgba(255,255,255,.04)', boxShadow: active ? 'inset 0 0 0 3px #4BE3A6' : 'none' });
        css(r.n, { background: active ? C.mint : done ? '#5A678E' : '#3A4766', color: active ? C.bg : '#fff' });
        css(r.cm, { color: active || done ? '#fff' : '#8F9ABB' });
      });
      const [u, m, o] = this.nodes;
      // fetch: upstream 에 새 Commit 두 개(입장 직후), main 쪽에 점선 유령
      [3, 4].forEach((i, j) => {
        const pu = prog(at(0), 0.6 + j * 0.15, 0.4, ease.pop);
        css(u[i], { transform: `scale(${pu})`, opacity: pu > 0 ? 1 : 0 }); u[i].setAttribute('fill', C.blue);
        const pg = P[0];
        const pm = P[2];
        m[i].setAttribute('fill', pm > 0.5 ? C.mint : C.bg);
        m[i].setAttribute('stroke-dasharray', pm > 0.5 ? 'none' : '8 7');
        css(m[i], { opacity: Math.max(pg * 0.8, pm), transform: `scale(${lerp(0.85, 1, pm)})` });
        const po = prog(at(3), 0.15 + j * 0.15, 0.4, ease.pop);
        o[i].setAttribute('fill', C.amb);
        css(o[i], { transform: `scale(${po})`, opacity: po > 0 ? 1 : 0 });
      });
      css(this.lines[0], { strokeDasharray: '1 1', strokeDashoffset: 1 - prog(at(0), 0.55, 0.4) });
      css(this.lines[1], { strokeDasharray: '1 1', strokeDashoffset: 1 - P[2] });
      css(this.lines[2], { strokeDasharray: '1 1', strokeDashoffset: 1 - prog(at(3), 0.1, 0.4) });
      css(this.ghostLab, { opacity: P[0] * (1 - P[2]) });
      css(this.head, { opacity: P[1], transform: `translateY(${(1 - P[1]) * -20}px)` });
      css(this.ff, { opacity: P[2], transform: `scale(${lerp(0.7, 1, P[2])})` });
      css(this.ar1.path, { strokeDasharray: '1 1', strokeDashoffset: 1 - P[0] }); css(this.ar1.head, { opacity: P[0] * (1 - P[2] * 0.6) });
      css(this.ar1.path, { opacity: 1 - P[2] * 0.6 });
      css(this.ar2.path, { strokeDasharray: '1 1', strokeDashoffset: 1 - P[3] }); css(this.ar2.head, { opacity: P[3] });
    },
  });

  /* 9. GitHub 웹에서 하는 문서 수정 (p.20) */
  slide({
    id: 'p1b-web-edit', part: 'p1', chap: CH, title: 'GitHub 웹에서 하는 문서 수정', theme: 'ink', cls: 'dots',
    notes: '간단한 문서 수정은 Clone 없이 웹에서 끝낼 수 있다. 연필 버튼 → Preview 로 확인 → Commit changes 창에서 새 브랜치를 만들고 PR 시작. 쓰기 권한이 없으면 GitHub 가 Fork 를 자동으로 만들어 준다.',
    build(el, A) {
      const T = U.title(el, null, 'GitHub 웹에서<br>하는 문서 수정', { y: 96, w: 580, cls: 'h2' });
      css(T.t, { whiteSpace: 'nowrap' });
      A(T.t, 'chars', 0, { each: 0.035 });
      const it = U.items(el, [
        { text: '파일을 열어 수정하고<br>Preview합니다', color: C.mint },
        { text: '새 브랜치에<br>변경을 기록합니다', color: C.blue },
        { text: 'PR로 변경을<br>제안합니다', color: C.vio },
      ], { kind: 'num', x: 120, y: 420, w: 560, isz: 76, gap: 48, cls: 'b1' });
      it.rows.forEach(r => { css(r.lastChild, { color: '#fff', fontWeight: 650, fontSize: '38px' }); r.firstChild.style.color = C.bg; });
      A(it.rows, 'up', 0.3, { each: 0.14 });
      // 브라우저
      const w = U.win(el, { x: 720, y: 180, w: 1080, h: 780, title: 'owner/project / README.md' });
      css(w.el, { background: '#fff' });
      A(w.el, 'zoom', 0.2, { from: 0.95 });
      const tabs = U.box(w.body, 36, 26, 420, 60); css(tabs, { display: 'flex', gap: '10px', background: '#F1F2F6', borderRadius: '14px', padding: '6px' });
      this.tEdit = h('span', '', tabs, 'Edit'); this.tPrev = h('span', '', tabs, 'Preview');
      [this.tEdit, this.tPrev].forEach(x => css(x, { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', fontSize: '26px', fontWeight: 750 }));
      // 편집 화면
      this.edit = U.box(w.body, 36, 110, 1008, 560);
      const ed = U.box(this.edit, 0, 0, 1008, 520); css(ed, { background: '#FAFBFD', borderRadius: '16px', boxShadow: 'inset 0 0 0 1.5px rgba(15,27,61,.1)', fontFamily: 'var(--mono)', fontSize: '28px', lineHeight: '58px', padding: '20px 30px', color: 'var(--ink)' });
      ed.innerHTML = '<div># project</div><div>&nbsp;</div><div>## 설치</div><div style="color:#7B8299">```</div><div class="ln-edit"></div><div style="color:#7B8299">```</div>';
      const le = ed.querySelector('.ln-edit'); le.textContent = 'pip install new-name';
      css(le, { background: 'rgba(18,176,122,.14)', margin: '0 -30px', padding: '0 30px' });
      A(le, 'type', 0.8, { cps: 22 });
      // 미리보기 화면
      this.prev = U.box(w.body, 36, 110, 1008, 560);
      css(this.prev, { padding: '20px 30px' });
      this.prev.innerHTML = '<div style="font-size:52px;font-weight:850;border-bottom:2px solid #E3E6EE;padding-bottom:12px">project</div><div style="font-size:38px;font-weight:800;margin-top:26px">설치</div><div style="margin-top:18px;background:#F4F6FB;border-radius:12px;padding:22px 26px;font-family:var(--mono);font-size:28px">pip install new-name</div>';
      // Commit changes 창
      const dlg = U.card(w.body, { x: 476, y: 190, w: 580, h: 440, pad: 30 });
      css(dlg, { background: '#fff', color: 'var(--ink)', boxShadow: '0 40px 80px -20px rgba(15,27,61,.5), 0 0 0 1.5px rgba(15,27,61,.12)' });
      const dt = h('div', '', dlg, 'Commit changes'); css(dt, { fontSize: '32px', fontWeight: 850 });
      const msg = h('div', 'mono', dlg, 'docs: fix setup'); css(msg, { marginTop: '18px', border: '2px solid #D5D9E4', borderRadius: '10px', padding: '12px 18px', fontSize: '26px' });
      const opt = (txt, on) => {
        const r = h('div', 'row', dlg); css(r, { gap: '16px', marginTop: '18px', fontSize: '25px', fontWeight: on ? 750 : 550, color: on ? 'var(--ink)' : '#7B8299' });
        const rb = h('span', '', r); css(rb, { width: '30px', height: '30px', borderRadius: '50%', border: `3px solid ${on ? 'var(--blue)' : '#C2C7D3'}`, flex: 'none', boxShadow: on ? 'inset 0 0 0 6px #fff' : 'none', background: on ? 'var(--blue)' : '#fff' });
        h('span', '', r, txt);
        return r;
      };
      opt('Commit directly to the main branch', false);
      const o2 = opt('Create a new branch for this commit<br>and start a pull request', true);
      const br = h('div', 'mono', dlg, 'my-id-patch-1'); css(br, { marginTop: '14px', marginLeft: '46px', display: 'inline-block', border: '2px solid var(--blue)', borderRadius: '10px', padding: '6px 16px', fontSize: '24px', color: 'var(--blue-d)' });
      const pc = h('div', '', dlg); css(pc, { display: 'flex', justifyContent: 'flex-end', marginTop: '6px' });
      const pbn = U.btn(pc, 'Propose changes', 'green'); css(pbn, { height: '62px', fontSize: '26px' });
      A(dlg, 'pop', 2.4, { from: 0.85 });
      A(o2, 'right', 2.75, { d: 20 }); A(br, 'pop', 2.9); A(pbn, 'stamp', 3.15, { dur: 0.4, from: 1.5, r: 0 });
      // 번호 표시
      const nb = (n, x, y, col, t0) => { const b = U.num(w.body, n, { size: 54, bg: col, fg: C.bg, x, y }); A(b, 'pop', t0); };
      nb(1, 470, 28, C.mint, 1.6); nb(2, 408, 400, C.blue, 2.8); nb(3, 672, 552, C.vio, 3.2);
    },
    render(t, S) {
      const pv = S.final ? 1 : prog(t, 1.75, 0.35, ease.inOutCubic);
      css(this.tEdit, { background: pv < 0.5 ? '#fff' : 'transparent', color: pv < 0.5 ? 'var(--ink)' : '#7B8299', boxShadow: pv < 0.5 ? '0 2px 6px rgba(15,27,61,.12)' : 'none' });
      css(this.tPrev, { background: pv >= 0.5 ? '#fff' : 'transparent', color: pv >= 0.5 ? 'var(--ink)' : '#7B8299', boxShadow: pv >= 0.5 ? '0 2px 6px rgba(15,27,61,.12)' : 'none' });
      css(this.edit, { opacity: 1 - pv }); css(this.prev, { opacity: pv, transform: `translateY(${(1 - pv) * 16}px)` });
    },
  });

  /* 10. Git 기본 명령의 연결 (p.21) */
  slide({
    id: 'p1b-commands', part: 'p1', chap: CH, title: 'Git 기본 명령의 연결', theme: 'ink',
    notes: '지금까지 본 흐름을 명령 네 줄로. 브랜치 만들기 → 변경 고르기 → 기록 → 원격에 올리기. -u 는 이후 git push 만 써도 같은 원격 브랜치로 올라가게 연결한다.',
    build(el, A) {
      const T = U.title(el, null, 'Git 기본 명령의 연결', { y: 90 });
      A(T.t, 'chars', 0, { each: 0.04 });
      const w = U.win(el, { x: 120, y: 240, w: 1060, h: 700, dark: true, title: '~/project' });
      A(w.el, 'right', 0.15, { d: 80 });
      const lines = ['$ git switch -c fix/readme', "> Switched to a new branch 'fix/readme'", '$ git add README.md', '$ git commit -m "docs: fix setup"', '> [fix/readme a1f3c2e] docs: fix setup', '$ git push -u origin fix/readme', "> branch 'fix/readme' set up to track", ">   'origin/fix/readme'."];
      const tm = U.term(w.body, lines, { size: 30, x: 44, y: 34 });
      tm.rows.forEach(r => css(r, { lineHeight: '64px' }));
      const T0 = [0.5, 1.6, 2.4, 3.5];
      const cmdIdx = [0, 2, 3, 5], outIdx = [[1], [], [4], [6, 7]];
      cmdIdx.forEach((ri, k) => {
        A(tm.rows[ri], 'fade', T0[k] - 0.05, { dur: 0.1 });
        A(tm.rows[ri].cmd, 'type', T0[k], { cps: 34, hold: k === 3 });
        outIdx[k].forEach((oi, j) => A(tm.rows[oi], 'up', T0[k] + 0.85 + j * 0.06, { d: 10, dur: 0.3 }));
      });
      // 오른쪽 단계 표시
      const steps = [['branch', '작업 브랜치 만들기', 'fix/readme', C.mint], ['check', 'Staging에 고르기', 'README.md', C.amb], ['commit', 'Commit으로 기록', 'a1f3c2e', C.blue], ['upload', '원격 저장소에 올리기', 'origin/fix/readme', C.vio]];
      const rail = U.box(el, 1279, 300, 6, 560); css(rail, { background: 'rgba(255,255,255,.12)', borderRadius: '3px' });
      A(rail, 'grow', 0.3, { axis: 'y', origin: '50% 0%' });
      steps.forEach(([ic, tt, sub, col], k) => {
        const y = 270 + k * 180;
        const b = U.badge(el, ic, { size: 92, bg: col, fg: C.bg, x: 1236, y });
        const tx = U.text(el, '', `<div style="font-size:34px;font-weight:800;color:#fff">${tt}</div><div class="mono" style="font-size:24px;color:${col};margin-top:6px">${sub}</div>`, 1360, y + 8, 440);
        A(b, 'stamp', T0[k] + 0.8, { dur: 0.45, r: 0, from: 1.8 }); A(tx, 'right', T0[k] + 0.9, { d: 30 });
      });
    },
  });
})();
