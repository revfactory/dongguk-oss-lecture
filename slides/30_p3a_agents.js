/* PART 3 표지 + 3A GitHub의 AI 에이전트 (원본 p.66~p.77)
 * 아트 디렉션: 짙은 남색(night) + 민트·보라, Mono + Pretendard, 순환하는 루프 */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, count, noise } = DECK;
  const U = UI;
  const CH = 'GitHub의 AI 에이전트';
  const KK = 'GitHub의 AI 에이전트';
  const MINT = '#4BE3A6', VIO = '#B3A2FF', AMB = '#F5A524', BLU = '#7FA4FF', RED = '#FF8A8A';
  const AG = { copilot: '#4BE3A6', claude: '#F0A15A', codex: '#7FA4FF' };

  /* 이 파일 전용 스타일(p3a- 접두어) */
  const st = document.createElement('style');
  st.textContent = `
    .p3a-panel { position:absolute; background:#121A33; border-radius:22px; box-shadow:0 0 0 1.5px rgba(255,255,255,.08), 0 24px 48px -24px rgba(0,0,0,.7); color:#E6EAF5; }
    .p3a-tag { display:inline-flex; align-items:center; gap:10px; height:44px; padding:0 18px; border-radius:12px; font-family:var(--mono); font-size:24px; font-weight:700; white-space:nowrap; }
    .p3a-row { display:flex; align-items:center; gap:18px; }
    .p3a-code { font-family:var(--mono); font-size:26px; line-height:48px; white-space:pre; color:#DCE3F5; }
    .p3a-code .cm { color:#7F8AAD; } .p3a-code .kw { color:${MINT}; font-weight:700; } .p3a-code .bl { color:${BLU}; font-weight:700; } .p3a-code .vi { color:${VIO}; font-weight:700; }
    .p3a-ghost { color:#5F6A8C; font-style:italic; }
    .p3a-cap { font-size:34px; font-weight:700; letter-spacing:-.02em; line-height:1.35; color:#E6EAF5; }
    .p3a-sub { font-size:28px; font-weight:550; letter-spacing:-.01em; line-height:1.4; color:#9AA6C6; }
  `;
  document.head.appendChild(st);

  function head(el, A, html, o = {}) {
    const T = U.title(el, o.k ?? KK, html, { cls: o.cls || 'h1', x: o.x, y: o.y, w: o.w, align: o.align });
    A(T.k, 'right', 0); A(T.t, 'chars', 0.08, { each: o.each ?? 0.026 });
    return T;
  }
  /* 겹쳐 그리는 SVG 판(점·선) */
  function overlay(el) { return s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none' }, el); }
  function cub(a, b, c, d, t) { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; }
  /* arrow({curve:true}) 와 같은 곡선 위 점 */
  function curvePt(x1, y1, x2, y2, t, v) {
    if (v) { const my = (y1 + y2) / 2; return [cub(x1, x1, x2, x2, t), cub(y1, my, my, y2, t)]; }
    const mx = (x1 + x2) / 2; return [cub(x1, mx, mx, x2, t), cub(y1, y1, y2, y2, t)];
  }
  function dot(svg, r, color) { const c = s('circle', { cx: -100, cy: -100, r, fill: color }, svg); return c; }
  function setDot(c, x, y, o = 1) { c.setAttribute('cx', x); c.setAttribute('cy', y); c.style.opacity = o; }
  const frac = x => x - Math.floor(x);
  /* 상태 아이콘 3종(대기·실행·완료)을 겹쳐 두고 시각에 따라 바꾼다 */
  function stateIcon(parent, size, x, y) {
    const wrap = U.box(parent, x, y, size, size);
    const w = U.status(wrap, 'wait', size), r = U.status(wrap, 'run', size), o = U.status(wrap, 'ok', size);
    [w, r, o].forEach(e => css(e, { position: 'absolute', left: 0, top: 0 }));
    return { wrap, w, r, o };
  }
  function setState(si, t, start, end) {
    const k = t < start ? 0 : t < end ? 1 : 2;
    css(si.w, { opacity: k === 0 ? 1 : 0 }); css(si.r, { opacity: k === 1 ? 1 : 0, transform: `rotate(${t * 300}deg)` });
    const p = prog(t, end, 0.35, ease.pop);
    css(si.o, { opacity: k === 2 ? 1 : 0, transform: `scale(${k === 2 ? lerp(0.4, 1, p) : 0.4})` });
  }

  /* ───────── PART 3 표지 ───────── */
  slide({
    id: 'p3a-cover', part: 'p3', title: 'PART 3 · AI Agent로 수정하고 검증하기', theme: 'ink', noChrome: true,
    notes: 'Part 3 시작. 앞에서 익힌 Issue·PR·리뷰 절차를 AI 에이전트와 함께 진행하는 방법, 에이전트에게 줄 지침과 검증 명령, 프로젝트별 AI 기여 정책과 근거 자료를 차례로 봅니다.',
    build(el, A) {
      U.partCover(el, A, { n: '3', label: 'PART 3', title: 'AI Agent로<br>수정하고 검증하기', chapters: ['GitHub의 AI 에이전트', '하네스와 기여 절차', 'AI 기여 정책과 근거'], color: '#6A4DF0', img: 'img/part3_agent_cut.png' });
    },
  });

  /* ───────── p.66 GitHub에서 여러 에이전트를 사용합니다 ───────── */
  slide({
    id: 'p3a-agents', part: 'p3', chap: CH, theme: 'night', cls: 'dots',
    title: 'GitHub에서 여러 에이전트를 사용합니다',
    notes: 'GitHub 안에서 Copilot뿐 아니라 Claude·Codex 에이전트에게도 Issue 할당이나 PR 댓글 멘션(@copilot·@claude·@codex)으로 작업을 맡길 수 있습니다. Claude·Codex는 지금도 공개 프리뷰입니다. 원본의 확인일(2026년 10월 12일)을 재확인한 날짜(11월 8일)로 바꿨습니다. 출처: https://docs.github.com/en/copilot/concepts/agents/about-third-party-agents',
    build(el, A) {
      head(el, A, 'GitHub에서 <span class="hl">여러 에이전트를 사용합니다</span>', { cls: 'h2' });
      const L = U.items(el, ['Copilot과 Claude·Codex 통합', 'Issue와 PR에서 작업을 요청', 'Claude·Codex는 공개 프리뷰', '확인일: 2026년 11월 8일'], { x: 120, y: 350, w: 620, kind: 'check', isz: 62, cls: 'b2', gap: 40 });
      L.rows.forEach((r, i) => A(r, 'up', 0.45 + i * 0.1, { d: 30 }));
      css(L.rows[3].lastChild, { fontFamily: 'var(--mono)', fontSize: '28px', color: MINT, fontWeight: 600 });
      // GitHub 화면
      const W = U.win(el, { x: 770, y: 290, w: 590, h: 620, dark: true, title: 'github.com' });
      A(W.el, 'zoom', 0.3, { from: 1.06 });
      const tabs = U.box(W.body, 28, 18, 540, 50); css(tabs, { display: 'flex', gap: '28px', fontSize: '26px', fontWeight: 700, color: '#9AA6C6' });
      tabs.innerHTML = `<span style="color:#fff;border-bottom:4px solid ${MINT};padding-bottom:8px">Issues</span><span>Pull requests</span><span>Discussions</span>`;
      // 이슈 카드
      const ic = U.box(W.body, 24, 90, 542, 144); css(ic, { background: '#16204A', borderRadius: '16px', padding: '16px 22px' });
      const icR = h('div', 'p3a-row', ic); icR.appendChild(U.icon('issue', 36, MINT, 2.4));
      const icT = h('div', '', icR, 'Improve performance of data processing'); css(icT, { fontSize: '26px', fontWeight: 700, lineHeight: 1.25 });
      const icS = U.chip(ic, 'Open', { bg: 'rgba(75,227,166,.16)', fg: MINT }); css(icS, { marginTop: '8px', height: '40px', fontSize: '24px' });
      A(ic, 'up', 0.6, { d: 30 });
      // PR 카드
      const pc = U.box(W.body, 24, 248, 542, 310); css(pc, { background: '#16204A', borderRadius: '16px', padding: '20px 22px' });
      const pcR = h('div', 'p3a-row', pc); pcR.appendChild(U.icon('pr', 36, MINT, 2.4));
      const pcT = h('div', '', pcR, 'Add streaming data processing'); css(pcT, { fontSize: '26px', fontWeight: 700 });
      const pg = h('div', '', pc); css(pg, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 18px', marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '24px', color: '#9AA6C6' });
      pg.innerHTML = '<span>Conversation <b style="color:#fff">3</b></span><span>Commits <b style="color:#fff">5</b></span><span>Checks <b style="color:#fff">4</b></span><span>Files changed <b style="color:#fff">8</b></span>';
      const dd = U.diff(pc, [['-', 'for row in rows: load(row)'], ['+', 'for chunk in stream(rows):'], ['+', '    load(chunk)']], { size: 24, rowH: 42, gutter: false });
      css(dd.el, { marginTop: '18px', borderRadius: '10px', overflow: 'hidden' });
      A(pc, 'up', 0.75, { d: 30 });
      dd.rows.forEach((r, i) => A(r, 'wipe', 1.0 + i * 0.1, { dur: 0.4 }));
      // 에이전트 패널
      const ov = overlay(el);
      this.lines = [];
      [['GitHub Copilot', '@copilot', AG.copilot], ['Claude', '@claude', AG.claude], ['Codex', '@codex', AG.codex]].forEach((a, i) => {
        const y = 320 + i * 196;
        const p = U.box(el, 1500, y, 300, 150, 'p3a-panel'); css(p, { borderLeft: `8px solid ${a[2]}`, padding: '26px 26px' });
        const n = h('div', '', p, a[0]); css(n, { fontSize: '32px', fontWeight: 850, letterSpacing: '-.02em' });
        const m = h('div', 'mono', p, a[1]); css(m, { fontSize: '26px', color: a[2], marginTop: '10px', fontWeight: 700 });
        A(p, 'left', 1.0 + i * 0.12, { d: 80 });
        const L = U.arrow(el, [[1500, y + 75], [1360, 600]], { svg: ov, curve: true, color: a[2], sw: 4, head: false });
        A(L.path, 'draw', 1.15 + i * 0.12, { dur: 0.5 });
        this.lines.push({ x1: 1500, y1: y + 75, x2: 1360, y2: 600, d: dot(ov, 8, a[2]), i });
      });
    },
    render(t) {
      this.lines.forEach(L => {
        const ph = frac((t - 1.7 - L.i * 0.35) / 1.6);
        const [x, y] = curvePt(L.x1, L.y1, L.x2, L.y2, ph);
        setDot(L.d, x, y, t < 1.7 ? 0 : Math.sin(ph * Math.PI));
      });
    },
  });

  /* ───────── p.67 자동완성과 Agent의 차이 ───────── */
  slide({
    id: 'p3a-vs', part: 'p3', chap: CH, theme: 'night',
    title: '자동완성과 Agent의 차이',
    notes: '자동완성은 커서 다음에 올 코드 한 줄을 제안하고, 받아들일지는 사람이 Tab으로 정합니다. Agent는 작업 목표를 받아 파일을 읽고 고치고 테스트를 실행하는 과정을 스스로 반복합니다. 그래서 결과를 Diff와 실행 기록으로 확인해야 합니다.',
    build(el, A) {
      head(el, A, '자동완성과 <span class="hv">Agent</span>의 차이');
      const ov = overlay(el);
      const div = s('path', { d: 'M960 300 L960 930', stroke: 'rgba(255,255,255,.16)', 'stroke-width': 3, pathLength: 1, fill: 'none' }, ov);
      A(div, 'draw', 0.3, { dur: 0.8 });
      // 왼쪽: 편집기 + 한 줄 제안
      const W = U.win(el, { x: 120, y: 300, w: 760, h: 420, dark: true, title: 'calc.py' });
      A(W.el, 'up', 0.35, { d: 60 });
      const code = U.box(W.body, 36, 30, 700, 330, 'p3a-code');
      code.innerHTML = '<span class="kw">def</span> add(a, b):\n    <span class="kw">return</span> a + b\n\n<span class="kw">def</span> sub(a, b):\n    <span class="cur"></span>';
      this.cur = code.querySelector('.cur');
      this.ghost = h('span', 'p3a-ghost', code); this.ghost.textContent = 'return a - b';
      code.appendChild(this.ghost);
      const tab = U.box(W.body, 470, 300, 260, 50); css(tab, { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 650, color: '#9AA6C6' });
      tab.innerHTML = '<span class="p3a-tag" style="background:#202A52;color:#fff;height:40px">Tab</span><span>눌러 수락</span>';
      A(tab, 'fade', 1.6);
      const capL = U.text(el, '', '자동완성', 120, 772); css(capL, { fontSize: '56px', fontWeight: 880, letterSpacing: '-.03em' });
      const capL2 = U.text(el, 'p3a-sub', '다음 코드를 제안', 120, 846); css(capL2, { fontSize: '36px', color: '#C9D1E6' });
      A(capL, 'up', 0.6); A(capL2, 'up', 0.7);
      // 오른쪽: 도는 루프
      const cx = 1400, cy = 490, R = 165;
      this.loop = { cx, cy, R };
      const ring = s('circle', { cx, cy, r: R, fill: 'none', stroke: 'rgba(179,162,255,.7)', 'stroke-width': 6, pathLength: 1, transform: `rotate(-90 ${cx} ${cy})` }, ov);
      A(ring, 'draw', 0.5, { dur: 1.0, ease: ease.inOutCubic });
      const nodes = [['doc', '읽기', -90], ['pen', '수정', 0], ['play', '실행', 90], ['check', '확인', 180]];
      this.nodes = nodes.map((n, i) => {
        const a = n[2] * Math.PI / 180, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        const b = U.badge(el, n[0], { size: 92, bg: '#1C2550', fg: VIO, x: x - 46, y: y - 46, k: 0.46 });
        css(b, { boxShadow: `0 0 0 3px ${VIO}` });
        const lx = i === 1 ? x + 60 : i === 3 ? x - 60 - 90 : x - 45, ly = i === 0 ? y - 100 : i === 2 ? y + 54 : y - 22;
        const lb = U.text(el, '', n[1], lx, ly, 90); css(lb, { fontSize: '30px', fontWeight: 800, textAlign: i === 3 ? 'right' : i === 1 ? 'left' : 'center', color: '#E6EAF5' });
        A(b, 'pop', 0.8 + i * 0.12); A(lb, 'fade', 0.9 + i * 0.12);
        return { b, a };
      });
      const ctr = U.text(el, '', 'Agent', cx - 100, cy - 30, 200); css(ctr, { fontSize: '48px', fontWeight: 880, textAlign: 'center', color: VIO });
      A(ctr, 'pop', 1.2);
      this.runner = dot(ov, 12, MINT);
      const capR = U.text(el, '', '<span class="hv">Agent</span>: 작업에 맞춰 도구를 실행', 1020, 780, 780); css(capR, { fontSize: '44px', fontWeight: 850, letterSpacing: '-.03em' });
      const capR2 = U.text(el, 'p3a-sub', '파일 수정과 테스트를 반복<br>결과는 Diff와 실행 기록으로 확인', 1020, 848, 780); css(capR2, { fontSize: '32px', color: '#C9D1E6' });
      A(capR, 'up', 1.0); A(capR2, 'up', 1.1);
    },
    render(t) {
      // 왼쪽: 제안이 흐리게 나타나고 커서가 깜빡인다
      const g = prog(t, 1.2, 0.5, ease.outCubic);
      css(this.ghost, { opacity: g });
      this.cur.textContent = Math.floor(t * 2.2) % 2 === 0 ? '▌' : ' ';
      css(this.cur, { color: MINT, marginRight: '-0.6em' });
      // 오른쪽: 점이 루프를 돈다
      const { cx, cy, R } = this.loop;
      const on = prog(t, 1.4, 0.3, ease.linear);
      const ang = -Math.PI / 2 + Math.max(0, t - 1.4) * 1.8;
      setDot(this.runner, cx + R * Math.cos(ang), cy + R * Math.sin(ang), on);
      this.nodes.forEach(n => {
        let d = Math.abs(((ang - n.a) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
        const near = t > 1.4 ? clamp(1 - d / 0.5) : 0;
        n.b.style.background = near > 0.3 ? 'rgba(179,162,255,.35)' : '#1C2550';
        n.b.style.scale = String(1 + near * 0.1);
      });
    },
  });

  /* ───────── p.68 로컬 Agent와 클라우드 Agent ───────── */
  slide({
    id: 'p3a-local-cloud', part: 'p3', chap: CH, theme: 'night', cls: 'dots',
    title: '로컬 Agent와 클라우드 Agent',
    notes: '같은 Git 저장소를 내 컴퓨터에서 작업할 수도 있고(로컬), GitHub이 만든 별도 실행 환경에서 작업할 수도 있습니다(클라우드). 어디서 실행하든 에이전트가 볼 수 있는 코드 범위와 권한, 그리고 플랜·사용량 조건을 먼저 확인합니다. 실행 환경과 사용 조건 출처: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent',
    build(el, A) {
      head(el, A, '로컬 Agent와 <span class="hl">클라우드</span> Agent');
      const ov = overlay(el);
      // 가운데 Git 저장소
      const g = U.box(el, 860, 340, 200, 220, 'p3a-panel'); css(g, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: `0 0 0 3px ${AMB}` });
      g.appendChild(U.icon('branch', 72, AMB, 2.2));
      const gl = h('div', '', g, 'Git'); css(gl, { fontSize: '44px', fontWeight: 900 });
      const gs = h('div', '', g, '같은 저장소'); css(gs, { fontSize: '24px', color: '#9AA6C6', fontWeight: 650 });
      A(g, 'pop', 0.4);
      // 왼쪽: 로컬
      const Lc = U.box(el, 120, 300, 600, 300, 'p3a-panel'); css(Lc, { padding: '40px 44px' });
      const Li = U.badge(Lc, 'laptop', { size: 96, bg: 'rgba(75,227,166,.16)', fg: MINT, square: true });
      const Lt = h('div', '', Lc, '로컬'); css(Lt, { fontSize: '56px', fontWeight: 880, marginTop: '22px', letterSpacing: '-.03em' });
      const Ls = h('div', 'p3a-sub', Lc, '내 개발 환경에서 작업'); css(Ls, { fontSize: '34px', color: '#C9D1E6', marginTop: '6px' });
      A(Lc, 'right', 0.6, { d: 120 });
      // 오른쪽: 클라우드
      const Rc = U.box(el, 1200, 300, 600, 300, 'p3a-panel'); css(Rc, { padding: '40px 44px' });
      const Ri = U.badge(Rc, 'server', { size: 96, bg: 'rgba(179,162,255,.18)', fg: VIO, square: true });
      const Rt = h('div', '', Rc, '클라우드'); css(Rt, { fontSize: '56px', fontWeight: 880, marginTop: '22px', letterSpacing: '-.03em' });
      const Rs = h('div', 'p3a-sub', Rc, '별도 실행 환경에서 작업'); css(Rs, { fontSize: '34px', color: '#C9D1E6', marginTop: '6px' });
      const sb = U.box(Rc, 300, 40, 256, 110); css(sb, { border: `2.5px dashed ${VIO}`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', color: VIO });
      ['term', 'folder', 'gear'].forEach(n => sb.appendChild(U.icon(n, 46, VIO, 2.2)));
      A(Rc, 'left', 0.6, { d: 120 }); A(sb, 'pop', 1.1);
      // 양방향 선
      this.flows = [];
      [[720, 450, 860, 450, MINT], [1060, 450, 1200, 450, VIO]].forEach((f, i) => {
        const L = U.arrow(el, [[f[0], f[1]], [f[2], f[3]]], { svg: ov, color: f[4], sw: 4, head: false, dash: null });
        A(L.path, 'draw', 0.9, { dur: 0.4 });
        this.flows.push({ f, a: dot(ov, 8, f[4]), b: dot(ov, 8, f[4]) });
      });
      // 아래: 확인할 것 두 가지
      [['shield', '코드 접근 범위와 권한을 확인', MINT], ['doc', '플랜과 사용량 조건도 확인', AMB]].forEach((c, i) => {
        const cd = U.box(el, 120 + i * 860, 700, 820, 160, 'p3a-panel'); css(cd, { display: 'flex', alignItems: 'center', gap: '30px', padding: '0 44px' });
        cd.appendChild(U.badge(null, c[0], { size: 88, bg: c[2], fg: '#0A1020' }));
        const tx = h('div', '', cd, c[1]); css(tx, { fontSize: '40px', fontWeight: 800, letterSpacing: '-.025em' });
        A(cd, 'up', 1.3 + i * 0.12, { d: 40 });
      });
    },
    render(t) {
      this.flows.forEach((F, i) => {
        const [x1, y1, x2, y2] = F.f;
        const p1 = frac((t - 1.3) / 1.3), p2 = frac((t - 1.95) / 1.3);
        setDot(F.a, lerp(x1, x2, p1), y1 - 10, t < 1.3 ? 0 : Math.sin(p1 * Math.PI));
        setDot(F.b, lerp(x2, x1, p2), y1 + 10, t < 1.95 ? 0 : Math.sin(p2 * Math.PI));
      });
    },
  });

  /* ───────── p.69 GitHub Copilot cloud agent ───────── */
  slide({
    id: 'p3a-cloud-agent', part: 'p3', chap: CH, theme: 'night',
    title: 'GitHub Copilot cloud agent',
    notes: 'Copilot cloud agent는 저장소를 읽고 변경을 구현한 뒤, 별도 실행 환경에서 테스트를 돌립니다. 2026년 10월 28일 이후 기본 환경은 클라우드 샌드박스이고 GitHub Actions 환경은 선택 사항입니다. 프롬프트로 시작한 세션은 PR 없이 브랜치로 끝날 수 있어 원본의 "작업 결과를 PR로 전달"을 "결과를 브랜치·PR로 전달"로 바꿨습니다. 관리자 정책 이름은 "Copilot in the cloud". 출처: https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/',
    build(el, A) {
      head(el, A, 'GitHub Copilot <span class="hl">cloud agent</span>', { cls: 'h2' });
      const L = U.items(el, [
        { icon: 'book', text: '저장소를 읽고 변경을 구현' },
        { icon: 'term', text: '별도 환경에서 테스트를 실행' },
        { icon: 'pr', text: '결과를 브랜치·PR로 전달' },
        { icon: 'shield', text: '플랜·관리자 정책·권한 확인', color: AMB },
      ], { x: 120, y: 290, w: 800, isz: 84, cls: 'b1', gap: 40, color: '#2A3466', square: true });
      L.rows.forEach((r, i) => { const b = r.firstChild; css(b, { color: i === 3 ? '#0A1020' : MINT }); A(r, 'up', 0.4 + i * 0.12, { d: 36 }); });
      // 세션 창
      const W = U.win(el, { x: 1000, y: 260, w: 800, h: 640, dark: true, title: 'Copilot 세션' });
      A(W.el, 'left', 0.35, { d: 120 });
      const tb = U.box(W.body, 30, 20, 740, 50); css(tb, { display: 'flex', gap: '30px', fontSize: '25px', fontWeight: 700, color: '#9AA6C6' });
      tb.innerHTML = `<span>Code</span><span>Issues</span><span style="color:#fff;border-bottom:4px solid ${MINT};padding-bottom:8px">Pull requests</span><span>Actions</span>`;
      const steps = [['저장소 읽기', 'book'], ['변경 구현', 'pen'], ['테스트 실행', 'flask'], ['브랜치·PR 전달', 'pr']];
      this.si = steps.map((stp, i) => {
        const y = 100 + i * 96;
        const row = U.box(W.body, 30, y, 740, 80); css(row, { background: '#16204A', borderRadius: '14px' });
        const si = stateIcon(row, 48, 22, 16);
        const tx = U.text(row, '', stp[0], 94, 20); css(tx, { fontSize: '30px', fontWeight: 750 });
        const ic = U.icon(stp[1], 36, '#5F6A8C', 2.2); U.place(ic, 680, 22); row.appendChild(ic);
        A(row, 'up', 0.6 + i * 0.08, { d: 20 });
        return si;
      });
      const sand = U.box(W.body, 30, 494, 740, 70); css(sand, { border: `2.5px dashed ${VIO}`, borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 22px', color: VIO, fontSize: '26px', fontWeight: 750 });
      sand.appendChild(U.icon('lock', 34, VIO, 2.2)); h('span', '', sand, '별도 실행 환경 · 기본은 클라우드 샌드박스');
      A(sand, 'fade', 1.2);
    },
    render(t) {
      this.si.forEach((si, i) => setState(si, t, 0.9 + i * 0.75, 1.55 + i * 0.75));
    },
  });

  /* ───────── p.70 Issue를 에이전트에게 맡기는 흐름 ───────── */
  slide({
    id: 'p3a-flow', part: 'p3', chap: CH, theme: 'night', cls: 'dots', steps: 3,
    title: 'Issue를 에이전트에게 맡기는 흐름',
    notes: '클릭할 때마다 한 단계씩. ① Issue에 재현 방법과 완료 조건을 먼저 씁니다. ② 쓰기 권한이 있는 저장소에서 에이전트에게 요청합니다. ③ 변경과 테스트 결과를 확인합니다. ④ 사람이 PR을 검토합니다. 현재 문서는 이슈 할당으로 만든 PR이 Draft인지 밝히지 않아 원본의 "Draft PR에서 사람이 검토"를 "PR에서 사람이 검토"로 바꿨습니다. 출처: https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task',
    build(el, A) {
      head(el, A, 'Issue를 <span class="hl">에이전트</span>에게 맡기는 흐름', { cls: 'h2' });
      const ov = overlay(el);
      const X = [120, 555, 990, 1425], Y = 300, Wd = 375, Hd = 560;
      const cols = [MINT, BLU, AMB, VIO];
      const txt = ['재현 방법과<br>완료 조건을 작성', '권한이 있는 저장소에서<br>작업 요청', '변경과 테스트<br>결과를 확인', 'PR에서<br>사람이 검토'];
      this.cards = X.map((x, i) => {
        const c = U.box(el, x, Y, Wd, Hd, 'p3a-panel'); css(c, { padding: '32px 32px' });
        const n = U.text(c, 'numf', '0' + (i + 1), 32, 26); css(n, { fontSize: '76px', color: cols[i], lineHeight: 1 });
        const vis = U.box(c, 32, 130, Wd - 64, 210); css(vis, { background: '#0E1530', borderRadius: '16px' });
        const tx = U.text(c, '', txt[i], 32, 372, Wd - 64); css(tx, { fontSize: '34px', fontWeight: 800, lineHeight: 1.35, letterSpacing: '-.025em' });
        A(c, 'up', i === 0 ? 0.4 : 0, { d: 50, step: i });
        return { c, vis, n };
      });
      // 단계별 그림
      const v0 = this.cards[0].vis;
      const r0 = U.box(v0, 22, 20, 260, 44); css(r0, { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: 800 }); r0.appendChild(U.icon('issue', 34, MINT, 2.4)); h('span', '', r0, 'Issue #12');
      ['재현 방법', '완료 조건'].forEach((w, i) => { const r = U.box(v0, 22, 82 + i * 56, 260, 44); css(r, { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', fontWeight: 650, color: '#C9D1E6' }); r.appendChild(U.status(null, 'ok', 32)); h('span', '', r, w); A(r, 'right', 0.9 + i * 0.12, { d: 30 }); });
      const v1 = this.cards[1].vis;
      const bt = U.badge(v1, 'bot', { size: 90, bg: 'rgba(127,164,255,.18)', fg: BLU, x: 22, y: 60, k: 0.56 });
      const tm = U.box(v1, 130, 50, 160, 110); css(tm, { background: '#060A18', borderRadius: '12px', fontFamily: 'var(--mono)', fontSize: '24px', color: MINT, padding: '16px 18px', lineHeight: 1.5 });
      tm.innerHTML = '&gt; 작업<br>&gt; 요청';
      A(bt, 'pop', 0.3, { step: 1 }); A(tm, 'wipe', 0.45, { step: 1 });
      const v2 = this.cards[2].vis;
      const dd = U.diff(v2, [['-', 'return t[0]'], ['+', 'if not t:'], ['+', '  return ""']], { size: 24, rowH: 44, gutter: false });
      U.place(dd.el, 16, 16, 280); css(dd.el, { borderRadius: '10px', overflow: 'hidden', color: '#0F1B3D' });
      dd.rows.forEach((r, i) => A(r, 'wipe', 0.3 + i * 0.1, { step: 2, dur: 0.35 }));
      const ok2 = U.box(v2, 16, 160, 290, 40); css(ok2, { display: 'flex', gap: '10px', alignItems: 'center', fontSize: '24px', fontWeight: 700, color: MINT });
      ok2.appendChild(U.status(null, 'ok', 32)); ok2.appendChild(U.status(null, 'ok', 32)); h('span', '', ok2, '테스트 통과');
      A(ok2, 'up', 0.7, { step: 2, d: 20 });
      const v3 = this.cards[3].vis;
      const us = U.badge(v3, 'user', { size: 90, bg: 'rgba(179,162,255,.2)', fg: VIO, x: 22, y: 22, k: 0.52 });
      const ap = U.btn(v3, 'Approve', 'green', { icon: 'check', x: 22, y: 128 }); css(ap, { height: '60px', fontSize: '26px', padding: '0 24px' });
      const pi = U.icon('pr', 64, VIO, 2.2); U.place(pi, 200, 34); v3.appendChild(pi);
      A(us, 'pop', 0.3, { step: 3 }); A(ap, 'stamp', 0.6, { step: 3, from: 1.8 }); A(pi, 'fade', 0.4, { step: 3 });
      // 단계 사이 화살표
      this.arrows = [0, 1, 2].map(i => {
        const x1 = X[i] + Wd + 6, x2 = X[i + 1] - 6, y = Y + 70;
        const L = U.arrow(el, [[x1, y], [x2, y]], { svg: ov, color: cols[i + 1], sw: 5, hl: 14 });
        A(L.path, 'draw', 0, { step: i + 1, dur: 0.35 }); A(L.head, 'fade', 0.3, { step: i + 1, dur: 0.15 });
        return { x1, x2, y };
      });
      this.cols = cols;
    },
    render(t, S) {
      // 진행 중인 단계 카드에 테두리
      this.cards.forEach((c, i) => {
        const active = S.step === i;
        c.c.style.boxShadow = active ? `0 0 0 3px ${this.cols[i]}, 0 24px 48px -24px rgba(0,0,0,.7)` : '';
        c.c.style.opacity = c.c.style.opacity === '' ? '' : c.c.style.opacity;
      });
    },
  });

  /* ───────── p.71 Agent가 만든 PR 검토 ───────── */
  slide({
    id: 'p3a-review', part: 'p3', chap: CH, theme: 'night',
    title: 'Agent가 만든 PR 검토',
    notes: '에이전트가 만든 PR도 사람이 만든 PR과 같은 기준으로 봅니다. 요구사항을 해결했는지, 필요 없는 변경이나 의존성이 섞이지 않았는지, 실제로 실행한 테스트와 로그가 있는지 확인합니다. 승인과 Merge는 사람이 결정합니다. 예시의 의존성 줄은 설명을 위해 만든 것입니다.',
    build(el, A) {
      head(el, A, 'Agent가 만든 PR 검토', { cls: 'h2' });
      // 왼쪽: 큰 Diff 창
      const W = U.win(el, { x: 120, y: 280, w: 960, h: 650, dark: true, title: 'Files changed', right: '에이전트가 연 PR' });
      A(W.el, 'up', 0.3, { d: 60 });
      const dd = U.diff(W.body, [
        ['@', 'src/titles.py'],
        [' ', 'def normalize_title(title):'],
        ['+', '    if not title:'],
        ['+', '        return ""'],
        [' ', '    return title[0].upper() + title[1:]'],
        ['@', 'requirements.txt'],
        ['+', 'unused-helper==0.1.0'],
      ], { size: 26, rowH: 54 });
      U.place(dd.el, 0, 10, 960);
      dd.rows.forEach(r => { if (r.classList.contains('hunk')) css(r, { background: '#1A2450', color: '#9AA6C6' }); });
      dd.rows.forEach((r, i) => A(r, 'right', 0.5 + i * 0.06, { d: 40 }));
      this.dep = dd.rows[6];
      const log = U.box(W.body, 24, 420, 912, 150); css(log, { background: '#060A18', borderRadius: '14px', padding: '20px 26px', fontFamily: 'var(--mono)', fontSize: '25px', lineHeight: 1.6, color: '#9AA6C6' });
      log.innerHTML = `<div><span style="color:${MINT}">$</span> python -m unittest discover -s tests -v</div><div style="color:${MINT}">OK</div><div>실행 기록 · 테스트 로그</div>`;
      A(log, 'wipe', 1.1, { dur: 0.5 });
      this.scan = U.box(W.body, 0, 10, 960, 54); css(this.scan, { background: 'rgba(179,162,255,.16)', borderLeft: `6px solid ${VIO}` });
      const flag = U.bubble(el, '이 의존성이 꼭 필요한가요?', { x: 640, y: 670, size: 28, bg: '#FFE3E3', fg: '#8A1F1F', pad: '18px 26px', r: 18, tail: 'tl' });
      A(flag, 'pop', 2.4);
      // 오른쪽: 검토 체크리스트
      const items = [['check', '요구사항을<br>해결했는지 확인'], ['doc', '불필요한 변경과<br>의존성 점검'], ['flask', '실행한 테스트와<br>로그 확인'], ['users', '승인과 Merge는<br>사람이 결정']];
      this.checks = items.map((it, i) => {
        const y = 290 + i * 158;
        const r = U.box(el, 1140, y, 660, 138, 'p3a-panel'); css(r, { display: 'flex', alignItems: 'center', gap: '24px', padding: '0 28px' });
        const bx = U.box(r, 28, 37, 64, 64); css(bx, { position: 'relative', left: 'auto', top: 'auto', flex: 'none', borderRadius: '14px', border: '3px solid #3A4570', display: 'flex', alignItems: 'center', justifyContent: 'center' });
        const ck = U.icon('check', 46, '#0A1020', 3.2); bx.appendChild(ck);
        const tx = h('div', '', r, it[1]); css(tx, { fontSize: '32px', fontWeight: 780, lineHeight: 1.3, letterSpacing: '-.02em' });
        const ic = U.icon(it[0], 40, '#5F6A8C', 2.2); css(ic, { marginLeft: 'auto' }); r.appendChild(ic);
        A(r, 'left', 0.5 + i * 0.1, { d: 60 });
        return { bx, ck, r, at: 1.5 + i * 0.45, last: i === 3 };
      });
    },
    render(t) {
      // 읽는 위치가 diff 를 따라 내려간다
      const p = prog(t, 0.9, 1.6, ease.inOutSine);
      const rows = [1, 2, 3, 4, 6];
      const k = Math.min(rows.length - 1, Math.floor(p * rows.length));
      css(this.scan, { top: (10 + rows[k] * 54) + 'px', opacity: t < 0.9 ? 0 : t > 2.6 ? 0 : 1 });
      const fl = t > 2.4;
      css(this.dep, { boxShadow: fl ? `inset 0 0 0 3px ${RED}` : 'none' });
      this.checks.forEach(c => {
        const q = prog(t, c.at, 0.3, ease.pop);
        const col = c.last ? VIO : MINT;
        css(c.bx, { background: q > 0 ? col : 'transparent', borderColor: q > 0 ? col : '#3A4570' });
        css(c.ck, { transform: `scale(${q})` });
        if (c.last) css(c.r, { boxShadow: q > 0 ? `0 0 0 3px ${VIO}` : '' });
      });
    },
  });

  /* ───────── p.72 Copilot의 지시 파일 ───────── */
  slide({
    id: 'p3a-instructions', part: 'p3', chap: CH, theme: 'night', cls: 'dots',
    title: 'Copilot의 지시 파일',
    notes: '.github/copilot-instructions.md에는 저장소 전체에 적용할 규칙과 빌드·테스트 명령을 적습니다. 특정 경로에만 적용할 규칙은 .github/instructions/ 아래 NAME.instructions.md 파일을 만들고 맨 앞 applyTo에 경로 패턴을 적습니다. 원본의 "폴더별 규칙은 별도 파일로 관리"는 실제로는 폴더가 아니라 경로 패턴으로 지정하므로 문구를 고쳤습니다. 출처: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions',
    build(el, A) {
      head(el, A, 'Copilot의 지시 파일', { cls: 'h2', w: 700 });
      const ov = overlay(el);
      const T = U.tree(el, ['my-project/', '  .github/', '    copilot-instructions.md', '    instructions/', '      tests.instructions.md', '  src/', '  tests/', '  README.md'], { x: 120, y: 290, w: 640, size: 28, rowH: 56, hi: { 'copilot-instructions.md': MINT, 'tests.instructions.md': VIO }, color: '#C9D1E6', dirColor: BLU, fileColor: '#7F8AAD' });
      T.rows.forEach((r, i) => A(r, 'right', 0.3 + i * 0.05, { d: 30 }));
      // 창 1: 저장소 공통 규칙
      const t1 = U.chip(el, '저장소 공통 규칙을 기록', { bg: 'rgba(75,227,166,.16)', fg: MINT, icon: 'doc', x: 860, y: 222 }); css(t1, { fontSize: '28px', height: '50px' });
      const W1 = U.win(el, { x: 860, y: 286, w: 940, h: 260, dark: true, title: '.github/copilot-instructions.md' });
      css(W1.el, { boxShadow: `0 0 0 3px ${MINT}, 0 30px 70px -20px rgba(0,0,0,.6)` });
      const c1 = U.box(W1.body, 34, 18, 880, 180, 'p3a-code');
      c1.innerHTML = '<span class="kw"># 저장소 공통 규칙</span>\n- Python 3와 표준 unittest 사용\n<span class="hlbox">- 테스트: python -m unittest discover -s tests -v</span>';
      const hb = c1.querySelector('.hlbox'); css(hb, { display: 'inline-block', background: 'rgba(245,165,36,.16)', outline: `2.5px solid ${AMB}`, borderRadius: '8px', padding: '0 10px', margin: '0 -10px' });
      A(t1, 'up', 0.5); A(W1.el, 'up', 0.55, { d: 40 });
      const t3 = U.chip(el, '빌드와 테스트 명령을 명시', { bg: 'rgba(245,165,36,.16)', fg: AMB, icon: 'term', x: 1426, y: 562 }); css(t3, { fontSize: '28px', height: '50px' });
      A(t3, 'pop', 1.4);
      // 창 2: 경로별 규칙
      const t2 = U.chip(el, '경로별 규칙은 .instructions.md 로 관리', { bg: 'rgba(179,162,255,.18)', fg: VIO, icon: 'tree', x: 860, y: 628 }); css(t2, { fontSize: '28px', height: '50px' });
      const W2 = U.win(el, { x: 860, y: 692, w: 940, h: 250, dark: true, title: '.github/instructions/tests.instructions.md' });
      css(W2.el, { boxShadow: `0 0 0 3px ${VIO}, 0 30px 70px -20px rgba(0,0,0,.6)` });
      const c2 = U.box(W2.body, 34, 14, 880, 180, 'p3a-code');
      c2.innerHTML = '<span class="cm">---</span>\n<span class="vi">applyTo</span>: "tests/**/*.py"\n<span class="cm">---</span>';
      A(t2, 'up', 0.9); A(W2.el, 'up', 0.95, { d: 40 });
      // 트리 → 창 연결선
      const L1 = U.arrow(el, [[760, 290 + 2 * 56 + 28], [860, 420]], { svg: ov, curve: true, color: MINT, sw: 4, head: false });
      const L2 = U.arrow(el, [[760, 290 + 4 * 56 + 28], [860, 815]], { svg: ov, curve: true, color: VIO, sw: 4, head: false });
      A(L1.path, 'draw', 0.8, { dur: 0.5 }); A(L2.path, 'draw', 1.15, { dur: 0.5 });
      // 경로 표기(원본 문장)
      const pth = U.text(el, 'mono', '.github/copilot-instructions.md', 120, 760, 680); css(pth, { fontSize: '30px', fontWeight: 700, color: MINT });
      const pth2 = U.text(el, 'p3a-sub', '저장소 전체에 적용되는 지시 파일', 120, 810, 680);
      A(pth, 'type', 1.5, { cps: 40 }); A(pth2, 'fade', 2.1);
    },
  });

  /* ───────── p.73 Claude Code와 GitHub Actions ───────── */
  slide({
    id: 'p3a-claude-actions', part: 'p3', chap: CH, theme: 'night', cls: 'dots',
    title: 'Claude Code와 GitHub Actions',
    notes: 'Issue나 PR 댓글에 @claude로 요청하면 저장소에 설치한 Actions 워크플로(anthropics/claude-code-action)가 실행됩니다. 실행하려면 Claude GitHub App 설치, API 키 Secret(ANTHROPIC_API_KEY 등), 저장소 권한 설정이 필요합니다. 댓글 대신 이슈 생성 같은 이벤트에 맞춰 자동으로 돌게 구성할 수도 있습니다. 출처: https://code.claude.com/docs/en/github-actions',
    build(el, A) {
      head(el, A, 'Claude Code와 GitHub Actions', { cls: 'h2' });
      const ov = overlay(el);
      const P = [120, 700, 1280], Wd = 520, Y = 280, Hd = 380;
      // 1. 댓글
      const W1 = U.win(el, { x: P[0], y: Y, w: Wd, h: Hd, dark: true, title: 'Issue #12 · 댓글' });
      A(W1.el, 'up', 0.3, { d: 50 });
      const av = U.avatar(W1.body, 'D', '#2F6BFF', 56); U.place(av, 28, 26);
      const cbox = U.box(W1.body, 100, 22, 392, 270); css(cbox, { border: '2px solid #2A3459', borderRadius: '14px', padding: '18px 20px', fontSize: '28px', lineHeight: 1.45, fontWeight: 600 });
      const at = h('span', 'p3a-tag', cbox, '@claude'); css(at, { background: 'rgba(240,161,90,.18)', color: AG.claude, height: '42px', fontSize: '26px' });
      const req = h('div', '', cbox, 'normalize_title 빈 입력 오류를 분석해 주세요'); css(req, { marginTop: '12px', color: '#E6EAF5' });
      A(at, 'pop', 0.7); A(req, 'type', 0.95, { cps: 26 });
      // 2. Actions 실행
      const W2 = U.win(el, { x: P[1], y: Y, w: Wd, h: Hd, dark: true, title: 'Actions · claude.yml' });
      A(W2.el, 'up', 0.45, { d: 50 });
      const jobs = ['actions/checkout', 'claude-code-action@v1', '커밋 push · 댓글'];
      this.si = jobs.map((j, i) => {
        const row = U.box(W2.body, 26, 30 + i * 96, 468, 80); css(row, { background: '#16204A', borderRadius: '14px' });
        const si = stateIcon(row, 44, 20, 18);
        const tx = U.text(row, 'mono', j, 82, 22, 380); css(tx, { fontSize: '25px', fontWeight: 600, whiteSpace: 'nowrap' });
        return si;
      });
      // 3. 결과 PR
      const W3 = U.win(el, { x: P[2], y: Y, w: Wd, h: Hd, dark: true, title: 'Pull request' });
      A(W3.el, 'up', 0.6, { d: 50 });
      const pr = U.box(W3.body, 26, 26, 468, 60); css(pr, { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '28px', fontWeight: 800 });
      pr.appendChild(U.icon('pr', 40, MINT, 2.4)); h('span', '', pr, '빈 입력 처리 추가');
      const dd = U.diff(W3.body, [['+', 'if not title:'], ['+', '    return ""']], { size: 24, rowH: 46, gutter: false });
      U.place(dd.el, 26, 110, 468); css(dd.el, { borderRadius: '10px', overflow: 'hidden' });
      this.prOk = U.box(W3.body, 26, 230, 468, 50); css(this.prOk, { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '26px', fontWeight: 750, color: MINT });
      this.prOk.appendChild(U.status(null, 'ok', 36)); h('span', '', this.prOk, '검사 통과');
      this.prParts = [pr, dd.el, this.prOk];
      // 패널 아래 문장
      const caps = ['Issue나 PR에서 <code>@claude</code>로 요청', 'Actions 워크플로에서 실행', '결과는 커밋·PR로 확인'];
      caps.forEach((c, i) => { const e = U.text(el, 'p3a-cap', c, P[i], Y + Hd + 24, Wd); A(e, 'up', 0.7 + i * 0.12, { d: 24 }); });
      // 연결선 + 흐르는 점
      this.links = [0, 1].map(i => {
        const x1 = P[i] + Wd + 4, x2 = P[i + 1] - 4, y = Y + Hd / 2;
        const L = U.arrow(el, [[x1, y], [x2, y]], { svg: ov, color: AG.claude, sw: 4, hl: 12 });
        A(L.path, 'draw', 0.9 + i * 0.6, { dur: 0.3 }); A(L.head, 'fade', 1.15 + i * 0.6, { dur: 0.15 });
        return { x1, x2, y, d: dot(ov, 7, AG.claude), i };
      });
      // 아래: 설정 두 가지
      const notes = [['key', 'Secret과 저장소 권한을 설정', '<span class="mono" style="font-size:26px;color:#9AA6C6">ANTHROPIC_API_KEY ••••••</span>'], ['refresh', '이벤트 자동 실행도 구성 가능', '<span class="mono" style="font-size:26px;color:#9AA6C6">on: issues · pull_request</span>']];
      notes.forEach((n, i) => {
        const c = U.box(el, 120 + i * 840, 790, 800, 150, 'p3a-panel'); css(c, { display: 'flex', alignItems: 'center', gap: '26px', padding: '0 36px' });
        c.appendChild(U.badge(null, n[0], { size: 80, bg: 'rgba(240,161,90,.18)', fg: AG.claude }));
        const tx = h('div', '', c, `<div style="font-size:36px;font-weight:820;letter-spacing:-.02em">${n[1]}</div><div style="margin-top:4px">${n[2]}</div>`);
        A(c, 'up', 1.6 + i * 0.12, { d: 30 });
      });
    },
    render(t) {
      this.si.forEach((si, i) => setState(si, t, 1.25 + i * 0.4, 1.6 + i * 0.4));
      const pp = prog(t, 2.6, 0.5);
      this.prParts.forEach((e, i) => css(e, { opacity: prog(t, 2.5 + i * 0.12, 0.4) }));
      this.links.forEach(L => {
        const st0 = 1.3 + L.i * 0.6;
        const ph = frac((t - st0) / 1.2);
        setDot(L.d, lerp(L.x1, L.x2 - 14, ph), L.y, t < st0 ? 0 : Math.sin(ph * Math.PI));
      });
    },
  });

  /* ───────── p.74 Claude Code의 프로젝트 지침 ───────── */
  slide({
    id: 'p3a-claude-md', part: 'p3', chap: CH, theme: 'night',
    title: 'Claude Code의 프로젝트 지침',
    notes: 'CLAUDE.md에는 실행 명령, 폴더 구조, 작업 규칙을 짧고 확인할 수 있는 문장으로 씁니다. "깔끔하게 작성한다"처럼 확인할 수 없는 문장은 지우고, 무엇을 수정하고 어떤 명령으로 검증하는지 적습니다. CLAUDE.md는 참고 맥락일 뿐 강제 설정이 아니므로, 꼭 막아야 할 동작은 권한 설정(permissions.deny)과 Hook(PreToolUse)으로 막습니다. 출처: https://code.claude.com/docs/en/memory',
    build(el, A) {
      head(el, A, 'Claude Code의 <span class="hl">프로젝트 지침</span>', { cls: 'h2' });
      const W = U.win(el, { x: 120, y: 280, w: 1000, h: 640, dark: true, title: 'CLAUDE.md' });
      A(W.el, 'up', 0.3, { d: 60 });
      const dd = U.diff(W.body, [
        [' ', '# 실행'],
        [' ', 'python -m unittest discover -s tests -v'],
        [' ', '# 구조'],
        [' ', 'src/ 소스 코드 · tests/ 테스트'],
        [' ', '# 규칙'],
        ['-', '코드를 깔끔하고 좋게 작성한다'],
        ['+', 'normalize_title 과 테스트만 수정한다'],
        ['+', '수정 후 위 테스트 명령을 실행한다'],
      ], { size: 27, rowH: 62, gutter: false });
      U.place(dd.el, 0, 20, 1000);
      [0, 2, 4].forEach(i => css(dd.rows[i], { color: MINT, fontWeight: 700 }));
      dd.rows.slice(0, 5).forEach((r, i) => A(r, 'right', 0.5 + i * 0.07, { d: 30 }));
      A(dd.rows[5], 'right', 0.85, { d: 30 });
      this.vague = dd.rows[5].querySelector('.c');
      A(dd.rows[6], 'wipe', 1.7, { dur: 0.45 }); A(dd.rows[7], 'wipe', 1.85, { dur: 0.45 });
      // 오른쪽: 원본 네 문장
      const L = [['doc', 'CLAUDE.md에\n작업 규칙 기록', MINT], ['folder', '실행 명령과\n폴더 구조 명시', BLU], ['check', '짧고 검증 가능한\n문장 사용', AMB]];
      L.forEach((it, i) => {
        const r = U.box(el, 1180, 280 + i * 150, 620, 128); css(r, { display: 'flex', alignItems: 'center', gap: '24px' });
        r.appendChild(U.badge(null, it[0], { size: 84, bg: it[2], fg: '#0A1020' }));
        const tx = h('div', '', r, it[1].replace('\n', '<br>')); css(tx, { fontSize: '36px', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-.02em' });
        A(r, 'left', 0.6 + i * 0.12, { d: 60 });
      });
      // 권한 제한 패널
      const P = U.box(el, 1180, 720, 620, 210, 'p3a-panel'); css(P, { padding: '26px 30px', boxShadow: `0 0 0 3px ${VIO}` });
      const ph = h('div', '', P, '권한 제한은 설정과 Hook으로 적용'); css(ph, { fontSize: '32px', fontWeight: 820, letterSpacing: '-.02em', color: VIO });
      [['permissions.deny', true], ['hooks · PreToolUse', true]].forEach((k, i) => {
        const r = h('div', '', P); css(r, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: i ? '10px' : '18px' });
        const nm = h('span', 'mono', r, k[0]); css(nm, { fontSize: '26px', color: '#C9D1E6' });
        const tg = U.toggle(r, false, { w: 76, color: VIO }); this['tg' + i] = tg;
      });
      A(P, 'up', 1.0, { d: 40 });
    },
    render(t) {
      const sp = prog(t, 1.35, 0.35, ease.outCubic);
      css(this.vague, { textDecoration: sp > 0 ? 'line-through' : 'none', textDecorationColor: RED, textDecorationThickness: '3px', opacity: 1 - sp * 0.45 });
      U.setToggle(this.tg0, prog(t, 1.5, 0.3, ease.outCubic), VIO);
      U.setToggle(this.tg1, prog(t, 1.75, 0.3, ease.outCubic), VIO);
    },
  });

  /* ───────── p.75 Codex와 GitHub 개발 ───────── */
  slide({
    id: 'p3a-codex', part: 'p3', chap: CH, theme: 'night', cls: 'dots',
    title: 'Codex와 GitHub 개발',
    notes: 'Codex 클라우드는 GitHub 저장소를 연결해 작업을 요청하고, 변경 파일과 테스트 결과를 확인한 뒤 Commit하거나 PR을 엽니다. PR 댓글에 @codex review를 남기면 Codex가 코드 리뷰를 올립니다. OpenAI의 Codex 문서는 learn.chatgpt.com 으로 옮겨졌습니다. 출처: https://learn.chatgpt.com/docs/third-party/github',
    build(el, A) {
      head(el, A, 'Codex와 GitHub 개발', { cls: 'h2' });
      // 왼쪽: 작업 화면
      const W = U.win(el, { x: 120, y: 280, w: 780, h: 660, dark: true, title: 'Codex · 작업' });
      A(W.el, 'up', 0.3, { d: 60 });
      const repo = U.box(W.body, 30, 26, 720, 64); css(repo, { display: 'flex', alignItems: 'center', gap: '14px', background: '#16204A', borderRadius: '14px', padding: '0 20px', fontSize: '26px', fontWeight: 700 });
      repo.appendChild(U.icon('link', 34, BLU, 2.4)); h('span', '', repo, '저장소 연결됨'); const rn = h('span', 'mono', repo, 'lecture-sample'); css(rn, { marginLeft: 'auto', color: '#9AA6C6', fontSize: '24px' });
      const ask = U.box(W.body, 30, 110, 720, 120); css(ask, { border: '2px solid #2A3459', borderRadius: '14px', padding: '18px 22px', fontSize: '28px', fontWeight: 600, lineHeight: 1.45 });
      ask.textContent = 'normalize_title 빈 입력 오류를 고치고 회귀 테스트를 추가해 주세요';
      const res = U.box(W.body, 30, 252, 720, 240); css(res, { background: '#16204A', borderRadius: '14px', padding: '20px 22px' });
      res.innerHTML = `<div style="font-size:26px;font-weight:800;margin-bottom:12px">변경 파일 2개</div>
        <div class="mono" style="font-size:24px;line-height:1.7;color:#C9D1E6"><span style="color:${MINT}">M</span> src/titles.py<br><span style="color:${MINT}">M</span> tests/test_titles.py</div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:14px;font-size:26px;font-weight:750;color:${MINT}" class="ok"></div>`;
      const okr = res.querySelector('.ok'); okr.appendChild(U.status(null, 'ok', 34)); h('span', '', okr, '테스트 결과 통과');
      const b1 = U.btn(W.body, 'Commit', '', { icon: 'commit', x: 30, y: 520 }); css(b1, { background: '#16204A', color: '#E6EAF5', borderColor: '#2A3459', height: '64px', fontSize: '26px' });
      const b2 = U.btn(W.body, 'PR 만들기', 'green', { icon: 'pr', x: 250, y: 520 }); css(b2, { height: '64px', fontSize: '26px' });
      this.hl = [repo, ask, res, b2];
      A(ask, 'fade', 0.7); A(res, 'up', 1.2, { d: 30 }); A(b1, 'pop', 1.5); A(b2, 'pop', 1.6);
      // 오른쪽: 세로 타임라인
      const ov = overlay(el);
      const tx = 1040, ys = [330, 490, 650, 810];
      const ln = s('path', { d: `M${tx} ${ys[0]} L${tx} ${ys[3]}`, stroke: BLU, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none', pathLength: 1 }, ov);
      A(ln, 'draw', 0.4, { dur: 1.4, ease: ease.inOutCubic });
      const its = [['link', '저장소를 연결하고 작업 요청'], ['doc', '변경 파일과 테스트 결과 확인'], ['branch', '검토 후 Commit 또는 PR 생성'], ['eye', 'GitHub의 코드 리뷰도 활용']];
      this.tl = its.map((it, i) => {
        const b = U.badge(el, it[0], { size: 84, bg: '#1C2A5C', fg: BLU, x: tx - 42, y: ys[i] - 42, k: 0.48 });
        css(b, { boxShadow: `0 0 0 4px ${BLU}` });
        const t1 = U.text(el, '', it[1], tx + 70, ys[i] - 26, 700); css(t1, { fontSize: '38px', fontWeight: 820, letterSpacing: '-.025em' });
        A(b, 'pop', 0.45 + i * 0.35); A(t1, 'right', 0.5 + i * 0.35, { d: 40 });
        return b;
      });
      const rv = U.text(el, 'p3a-tag', '@codex review', tx + 70, ys[3] + 34); css(rv, { background: 'rgba(127,164,255,.18)', color: BLU, fontSize: '28px', height: '50px' });
      A(rv, 'pop', 1.75);
    },
    render(t) {
      const k = clamp(Math.floor((t - 0.45) / 0.35), -1, 3);
      this.hl.forEach((e, i) => css(e, { boxShadow: i === k && t < 3.2 ? `0 0 0 3px ${BLU}` : 'none' }));
    },
  });

  /* ───────── p.76 AGENTS.md에 담을 내용 ───────── */
  slide({
    id: 'p3a-agents-md', part: 'p3', chap: CH, theme: 'ink', cls: 'dots',
    title: 'AGENTS.md에 담을 내용',
    notes: 'AGENTS.md는 여러 코딩 에이전트가 함께 읽는 지침 파일 형식입니다(Codex, GitHub Copilot 코딩 에이전트 등). 프로젝트 구조와 수정 범위, 설치와 테스트 명령, 코드 규칙과 금지할 변경, PR에 남길 검증 결과를 적습니다. 디렉터리마다 둘 수 있고, 에이전트는 가장 가까운 파일을 따릅니다. 출처: https://agents.md/',
    build(el, A) {
      const T = U.title(el, KK, 'AGENTS.md에 담을 내용', { cls: 'h2', align: 'center' }); A(T.k, 'fade', 0); A(T.t, 'chars', 0.08, { each: 0.03 });
      css(T.k, { justifyContent: 'center', display: 'flex' });
      const ov = overlay(el);
      // 가운데 문서
      const D = U.box(el, 740, 300, 440, 560); css(D, { background: '#FBFAF7', borderRadius: '24px', color: '#0F1B3D', padding: '34px 36px', boxShadow: '0 40px 80px -30px rgba(0,0,0,.7)' });
      const dh = h('div', 'mono', D, 'AGENTS.md'); css(dh, { fontSize: '36px', fontWeight: 800 });
      const secs = [['## 구조와 범위', '#0B8A5F'], ['## 설치와 테스트', '#1E4FD0'], ['## 규칙과 금지', '#C93434'], ['## PR 검증 결과', '#5B3FD6']];
      this.secs = secs.map((sc, i) => {
        const b = h('div', '', D); css(b, { marginTop: i ? '20px' : '26px' });
        const hh = h('div', 'mono', b, sc[0]); css(hh, { fontSize: '26px', fontWeight: 800, color: sc[1] });
        [0.9, 0.62].forEach(w => { const bar = h('div', '', b); css(bar, { height: '12px', width: (w * 100) + '%', background: '#E3DED4', borderRadius: '6px', marginTop: '10px' }); });
        A(b, 'up', 0.55 + i * 0.1, { d: 20 });
        return b;
      });
      A(D, 'zoom', 0.3, { from: 1.1 });
      // 네 모서리 카드
      const C = [
        [120, 300, 'tree', '프로젝트 구조와\n수정 범위', MINT, [740, 418]],
        [1280, 300, 'term', '환경 설치와\n테스트 명령', BLU, [1180, 520]],
        [120, 700, 'ban', '코드 규칙과\n금지할 변경', RED, [740, 640]],
        [1280, 700, 'pr', 'PR에 남길\n검증 결과', VIO, [1180, 760]],
      ];
      C.forEach((c, i) => {
        const cd = U.box(el, c[0], c[1], 520, 180, 'p3a-panel'); css(cd, { display: 'flex', alignItems: 'center', gap: '28px', padding: '0 36px', boxShadow: `0 0 0 3px ${c[4]}`, background: '#18264D' });
        cd.appendChild(U.badge(null, c[2], { size: 92, bg: c[4], fg: '#0F1B3D' }));
        const tx = h('div', '', cd, c[3].replace('\n', '<br>')); css(tx, { fontSize: '38px', fontWeight: 840, lineHeight: 1.25, letterSpacing: '-.025em' });
        const ax = i % 2 === 0 ? c[0] + 520 : c[0], ay = c[1] + 90;
        const L = U.arrow(el, [[c[5][0], c[5][1]], [ax, ay]], { svg: ov, curve: true, color: c[4], sw: 4, head: false });
        A(L.path, 'draw', 1.0 + i * 0.12, { dur: 0.45 });
        A(cd, 'pop', 1.2 + i * 0.12, { from: 0.7 });
      });
    },
  });

  /* ───────── p.77 GitHub Agentic Workflows ───────── */
  slide({
    id: 'p3a-agentic-wf', part: 'p3', chap: CH, theme: 'night',
    title: 'GitHub Agentic Workflows',
    notes: 'Markdown 파일 맨 앞에 트리거(on), 권한(permissions), 허용 출력(safe-outputs)을 적고 본문에 할 일을 자연어로 씁니다. 이 파일이 표준 Actions YAML로 컴파일되어 GitHub Actions에서 실행되고, 에이전트는 기본적으로 읽기 권한만 가진 채 허용된 출력만 남깁니다. 2026년 10월 28일 정식 출시(GA)되어 원본의 "공개 프리뷰"를 바꿨습니다. 기본 엔진(Copilot CLI)을 쓰려면 Copilot 라이선스가 필요합니다. 출처: https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/',
    build(el, A) {
      head(el, A, 'GitHub <span class="hl">Agentic</span> Workflows', { cls: 'h2' });
      const W = U.win(el, { x: 120, y: 280, w: 800, h: 660, dark: true, title: '.github/workflows/issue-triage.md' });
      A(W.el, 'up', 0.3, { d: 60 });
      const code = U.box(W.body, 34, 16, 740, 600, 'p3a-code'); css(code, { lineHeight: '46px' });
      code.innerHTML = [
        '<span class="cm">---</span>',
        '<span class="kw">on</span>:',
        '  issues:',
        '    types: [opened]',
        '<span class="bl">permissions</span>:',
        '  contents: read',
        '<span class="vi">safe-outputs</span>:',
        '  add-comment:',
        '<span class="cm">---</span>',
        '<span style="font-weight:700"># 이슈 분류</span>',
        '새 이슈를 읽고 요약 댓글을 남긴다',
      ].map(l => `<div class="ln">${l || ' '}</div>`).join('');
      const lines = [...code.querySelectorAll('.ln')];
      lines.forEach((l, i) => A(l, 'right', 0.5 + i * 0.05, { d: 24 }));
      // 줄 묶음 표시
      const bands = [[1, 3, MINT, '트리거'], [4, 5, BLU, '권한'], [6, 7, VIO, '허용 출력']];
      bands.forEach((b, i) => {
        const y = 280 + 56 + 16 + b[0] * 46, hh = (b[1] - b[0] + 1) * 46;
        const bar = U.box(el, 920 - 8, y, 8, hh); css(bar, { background: b[2], borderRadius: '4px' });
        const lb = U.text(el, '', b[3], 936, y + hh / 2 - 22); css(lb, { fontSize: '30px', fontWeight: 820, color: b[2], whiteSpace: 'nowrap' });
        A(bar, 'grow', 1.2 + i * 0.15, { axis: 'y', origin: '50% 0%', dur: 0.35 }); A(lb, 'right', 1.25 + i * 0.15, { d: 30 });
      });
      // 오른쪽: 원본 네 문장
      const its = [['doc', 'Markdown으로 자동화 작업 정의', MINT], ['gear', '트리거·권한·허용 출력을 설정', BLU], ['play', 'Actions에서 실행하고 결과 검토', VIO]];
      its.forEach((it, i) => {
        const r = U.box(el, 1150, 300 + i * 150, 650, 120); css(r, { display: 'flex', alignItems: 'center', gap: '24px' });
        r.appendChild(U.badge(null, it[0], { size: 80, bg: it[2], fg: '#0A1020' }));
        const tx = h('div', '', r, it[1]); css(tx, { fontSize: '36px', fontWeight: 800, lineHeight: 1.3, letterSpacing: '-.02em' });
        A(r, 'left', 0.7 + i * 0.12, { d: 60 });
      });
      const ga = U.box(el, 1150, 760, 650, 160, 'p3a-panel'); css(ga, { display: 'flex', alignItems: 'center', gap: '28px', padding: '0 34px', boxShadow: `0 0 0 3px ${MINT}` });
      const stamp = U.box(ga, 0, 0, 120, 120); css(stamp, { position: 'relative', left: 'auto', top: 'auto', flex: 'none', borderRadius: '50%', border: `5px solid ${MINT}`, color: MINT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--num)', fontSize: '50px' });
      stamp.textContent = 'GA';
      const gt = h('div', '', ga, '<div style="font-size:34px;font-weight:840;letter-spacing:-.02em">정식 출시(GA)</div><div style="font-size:30px;font-weight:600;color:#C9D1E6;margin-top:4px">사용 조건 확인</div>');
      A(ga, 'up', 1.3, { d: 40 }); A(stamp, 'stamp', 1.65, { r: -20 });
    },
  });
})();
