/* PART 1 · 1E Merge와 저장소 규칙 — 원본 p.47~57 + 확인 퀴즈
 * 아트 디렉션: 종이 바탕 + 보라(병합). 갈라졌던 것이 하나로 모이는 움직임. */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp } = DECK;
  const U = UI;
  const CH = '1E Merge와 저장소 규칙', K = '1E · Merge와 저장소 규칙';
  const BLUE = '#2F6BFF', GREEN = '#12B07A', VIOLET = '#7C5CFF';

  /* 이 파일 전용 스타일 */
  const st = document.createElement('style');
  st.textContent = `
  .p1e-code { font-family: var(--mono); font-size: 30px; }
  .p1e-code .r { height: 58px; display: flex; align-items: center; padding: 0 28px; white-space: pre; overflow: hidden; }
  .p1e-code .mkr { background: rgba(124,92,255,.22); color: #C9BCFF; font-weight: 700; }
  .p1e-code .ours { background: rgba(47,107,255,.18); color: #CFE0FF; }
  .p1e-code .theirs { background: rgba(18,176,122,.18); color: #C8F5E2; }
  .p1e-code .plain { color: #DCE3F5; }
  .p1e-col { position: absolute; display: flex; gap: 24px; align-items: flex-start; }
  .p1e-q { position: absolute; background: #fff; border-radius: 28px; padding: 34px 38px; color: var(--ink); box-shadow: 0 30px 60px -30px rgba(0,0,0,.45); }
  .p1e-opt { display: inline-flex; align-items: center; gap: 12px; height: 70px; padding: 0 30px; border-radius: 35px; font-weight: 800; font-size: 34px; background: #EEF1F8; color: var(--ink); margin-right: 16px; }
  .p1e-opt code { background: transparent; padding: 0; font-size: 30px; }
  `;
  document.head.appendChild(st);

  const ttl = (el, A, html, o = {}) => {
    const T = U.title(el, K, html, Object.assign({ cls: 'h2' }, o));
    A(T.k, 'right', 0); A(T.t, 'chars', 0.06, { each: 0.022 });
    return T;
  };
  const svgLayer = el => s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none' }, el);
  const path = (svg, d, col, sw = 5, dash) => { const p = s('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }, svg); if (dash) p.setAttribute('stroke-dasharray', dash); return p; };
  const codeRows = (parent, rows) => { const w = h('div', 'p1e-code', parent); return rows.map(([txt, cls]) => { const r = h('div', 'r ' + cls, w); r.textContent = txt; return r; }); };

  /* p.47 Merge Conflict가 생기는 이유 — 두 브랜치의 같은 줄이 부딪힌다 */
  slide({
    id: 'p1e-conflict', part: 'p1', chap: CH, title: 'Merge Conflict가 생기는 이유', theme: 'paper',
    notes: '두 브랜치가 README.md 의 같은 줄을 서로 다르게 고쳤을 때 Git 은 어느 쪽을 남길지 정하지 못합니다. 그래서 충돌 마커를 넣고 사람에게 결정을 넘깁니다.',
    build(el, A) {
      ttl(el, A, 'Merge Conflict가 생기는 이유');
      const L = U.win(el, { x: 120, y: 330, w: 500, h: 250, title: 'main' });
      css(L.el, { boxShadow: `inset 0 6px 0 ${BLUE}, 0 30px 60px -20px rgba(15,27,61,.25), 0 0 0 1.5px rgba(15,27,61,.08)` });
      U.diff(L.body, [[' ', '# my-project'], ['+', '## 시작하기']], { size: 32, rowH: 64 }).el.style.marginTop = '30px';
      const R = U.win(el, { x: 1300, y: 330, w: 500, h: 250, title: 'fix/readme' });
      css(R.el, { boxShadow: `inset 0 6px 0 ${GREEN}, 0 30px 60px -20px rgba(15,27,61,.25), 0 0 0 1.5px rgba(15,27,61,.08)` });
      U.diff(R.body, [[' ', '# my-project'], ['+', '## 설치 방법']], { size: 32, rowH: 64 }).el.style.marginTop = '30px';
      A(L.el, 'right', 0.25, { d: 260, dur: 0.75, ease: ease.outBack });
      A(R.el, 'left', 0.25, { d: 260, dur: 0.75, ease: ease.outBack });

      const E = U.win(el, { x: 660, y: 280, w: 600, h: 420, title: 'README.md', dark: true });
      this.E = E.el; css(E.body, { fontSize: '34px' });
      const rows = codeRows(E.body, [
        ['<<<<<<< HEAD', 'mkr'], ['## 시작하기', 'ours'], ['=======', 'mkr'], ['## 설치 방법', 'theirs'], ['>>>>>>> fix/readme', 'mkr']]);
      css(rows[0].parentNode, { paddingTop: '12px', fontSize: '34px' }); rows.forEach(r => css(r, { height: '66px' }));
      A(E.el, 'zoom', 0.7, { dur: 0.5, from: 0.9 });
      rows.forEach((r, i) => A(r, 'wipe', 0.95 + i * 0.1, { dur: 0.35 }));
      const warn = U.badge(el, 'warn', { size: 100, bg: 'var(--red)', x: 1206, y: 230, k: .52 });
      A(warn, 'stamp', 1.55, { dur: 0.45 });

      const sv = svgLayer(el);
      const a1 = path(sv, 'M620 520 L656 520', BLUE, 6), a2 = path(sv, 'M1300 520 L1264 520', GREEN, 6);
      A(a1, 'draw', 0.9, { dur: 0.3 }); A(a2, 'draw', 0.9, { dur: 0.3 });

      const B = [['같은 줄을 다르게<br>수정할 수 있습니다', BLUE], ['한쪽은 수정하고 다른 쪽은<br>삭제할 수 있습니다', GREEN], ['최종 코드를<br>직접 결정해야 합니다', VIOLET]];
      B.forEach((b, i) => {
        const c = h('div', 'p1e-col', el); U.place(c, 120 + i * 580, 770, 540);
        c.appendChild(U.num(null, i + 1, { size: 76, bg: b[1] }));
        const t = h('div', 'b1', c, b[0]); css(t, { fontSize: '40px', fontWeight: 680, lineHeight: 1.38 });
        A(c, 'up', 1.7 + i * 0.12);
      });
    },
    render(t) {
      const k = t > 1.55 ? Math.exp(-(t - 1.55) * 7) : 0;
      css(this.E, { translate: `${Math.sin(t * 70) * 12 * k}px 0` });
    },
  });

  /* p.48 충돌 해결 후 다시 검증 — 마커가 사라지고 정리된 코드만 남는다 */
  slide({
    id: 'p1e-resolve', part: 'p1', chap: CH, title: '충돌 해결 후 다시 검증', theme: 'white',
    notes: '충돌을 해결한다는 것은 마커를 지우고 남길 코드를 정하는 일입니다. 해결한 뒤에는 Commit 하고, 테스트와 실행 결과를 다시 확인합니다.',
    build(el, A) {
      ttl(el, A, '충돌 해결 후 <span class="hv">다시 검증</span>');
      const E = U.win(el, { x: 120, y: 280, w: 820, h: 480, title: 'README.md', dark: true });
      this.rows = codeRows(E.body, [
        ['# my-project', 'plain'], ['<<<<<<< HEAD', 'mkr'], ['## 시작하기', 'ours'], ['=======', 'mkr'], ['## 설치 방법', 'theirs'], ['>>>>>>> fix/readme', 'mkr'], ['pip install -r requirements.txt', 'plain']]);
      css(this.rows[0].parentNode, { paddingTop: '10px' });
      A(E.el, 'up', 0.2);
      this.keep = this.rows[4]; this.ctx = [this.rows[0], this.rows[6]];
      const ok = U.status(E.el, 'ok', 52); U.place(ok, 730, 128); this.ok = ok;
      A(ok, 'stamp', 1.55, { dur: 0.45 });

      const T = U.win(el, { x: 120, y: 786, w: 820, h: 170, dark: true, nobar: true });
      css(T.body, { padding: '18px 34px' });
      const tm = U.term(T.body, ['$ git add README.md && git commit', '$ python -m unittest', 'ok 테스트를 다시 실행: 모두 통과'], { size: 28 });
      A(T.el, 'up', 0.35);
      A(tm.rows[0].cmd, 'type', 1.9, { cps: 50 });
      A(tm.rows[1].cmd, 'type', 2.65, { cps: 45 });
      A(tm.rows[2], 'fade', 3.2, { dur: 0.3 });
      [0, 1].forEach(i => A(tm.rows[i], 'fade', [1.85, 2.6][i], { dur: 0.1 }));

      const items = [['충돌 내용을 읽고<br>최종 코드를 정합니다', 0.9], ['충돌 마커를 제거하고<br>Commit합니다', 2.45], ['테스트와 실행 결과를<br>다시 확인합니다', 3.3]];
      items.forEach((it, i) => {
        const y = 300 + i * 210;
        const ring = U.status(el, 'wait', 68); U.place(ring, 1040, y + 10);
        const okk = U.status(el, 'ok', 68); U.place(okk, 1040, y + 10);
        const tx = U.text(el, 'b1', it[0], 1140, y, 660); css(tx, { fontSize: '40px', fontWeight: 650, lineHeight: 1.35 });
        A(ring, 'fade', 0.4 + i * 0.1); A(tx, 'up', 0.45 + i * 0.1);
        A(okk, 'stamp', it[1], { dur: 0.4 });
      });
    },
    render(t) {
      const p = prog(t, 1.0, 0.6, ease.inOutCubic);
      this.rows.forEach((r, i) => {
        if (r === this.keep) { css(r, { background: `rgba(18,176,122,${lerp(0.18, 0.32, p)})` }); return; }
        if (this.ctx.includes(r)) return;
        css(r, { height: lerp(58, 0, p) + 'px', opacity: 1 - p, textDecoration: p > 0.05 ? 'line-through' : 'none' });
      });
    },
  });

  /* p.49 Merge 방식의 차이 — 같은 Commit 으로 세 방식을 차례로 */
  slide({
    id: 'p1e-methods', part: 'p1', chap: CH, title: 'Merge 방식의 차이', theme: 'paper', steps: 2,
    notes: '클릭할 때마다 한 방식씩 보여 줍니다. 세 그래프 모두 같은 main Commit(파랑)과 같은 PR Commit(초록)에서 출발합니다. 프로젝트가 어떤 방식을 쓰는지는 저장소 설정과 기여 지침에서 확인합니다.',
    build(el, A) {
      ttl(el, A, 'Merge 방식의 차이');
      // 범례
      const lg = U.box(el, 1130, 112, 670);
      [[BLUE, 'main의 Commit'], [GREEN, 'PR의 Commit'], [VIOLET, '새로 만들어지는 Commit']].forEach((l, i) => {
        const r = h('div', '', lg); css(r, { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '26px', fontWeight: 650, color: 'var(--ink2)', height: '40px' });
        const d = h('i', '', r); css(d, { width: '22px', height: '22px', borderRadius: '50%', background: l[0], display: 'block' });
        h('span', '', r, l[1]);
        A(r, 'right', 0.3 + i * 0.08, { d: 30 });
      });
      const bands = [
        ['Merge commit', '개별 Commit과 병합 지점'],
        ['Squash', 'PR 변경을 하나의 Commit으로'],
        ['Rebase', '개별 Commit을 선형으로 반영'],
      ];
      this.g = [];
      bands.forEach((b, i) => {
        const y = 272 + i * 228;
        const card = U.box(el, 120, y, 1680, 206);
        css(card, { background: '#fff', borderRadius: '26px', boxShadow: '0 24px 48px -28px rgba(15,27,61,.3), 0 0 0 1.5px rgba(15,27,61,.06)' });
        const n = U.text(card, 'mono', b[0], 48, 46); css(n, { fontSize: '44px', fontWeight: 700, color: i === 0 ? VIOLET : 'var(--ink)' });
        const d = U.text(card, 'b2', b[1], 48, 112); css(d, { fontSize: '32px', fontWeight: 600, color: 'var(--ink2)' });
        A(card, 'up', i === 0 ? 0.35 : 0, { step: i, d: 60 });
        const lanes = { main: { y: 128, color: BLUE }, pr: { y: 52, color: GREEN } };
        let spec;
        if (i === 0) spec = { nodes: [{ id: 'm1', x: 30, lane: 'main' }, { id: 'm2', x: 300, lane: 'main' }, { id: 'c1', x: 190, lane: 'pr' }, { id: 'c2', x: 370, lane: 'pr' }, { id: 'c3', x: 550, lane: 'pr' }, { id: 'M', x: 760, lane: 'main', color: VIOLET, r: 24 }],
          edges: [['m1', 'm2'], ['m2', 'M'], ['m1', 'c1'], ['c1', 'c2'], ['c2', 'c3'], ['c3', 'M']] };
        else if (i === 1) spec = { nodes: [{ id: 'm1', x: 30, lane: 'main' }, { id: 'm2', x: 300, lane: 'main' }, { id: 'S', x: 600, lane: 'main', color: VIOLET, r: 24 }],
          edges: [['m1', 'm2'], ['m2', 'S']] };
        else spec = { nodes: [{ id: 'm1', x: 30, lane: 'main' }, { id: 'm2', x: 300, lane: 'main' }, { id: 'r1', x: 490, lane: 'main', color: GREEN }, { id: 'r2', x: 680, lane: 'main', color: GREEN }, { id: 'r3', x: 870, lane: 'main', color: GREEN }],
          edges: [['m1', 'm2'], ['m2', 'r1', GREEN], ['r1', 'r2', GREEN], ['r2', 'r3', GREEN]] };
        const G = U.graph(card, Object.assign({ x: 720, y: 14, w: 940, h: 180, lanes, r: 17, sw: 8 }, spec));
        const base = i === 0 ? 0.6 : 0.3;
        G.edges.forEach((e, j) => A(e, 'draw', base + j * 0.12, { step: i, dur: 0.4, ease: ease.inOutCubic }));
        Object.keys(G.nodes).forEach((id, j) => {
          const late = id === 'M' || id === 'S';
          A(G.nodes[id], 'pop', late ? base + 0.95 : base + j * 0.1, { step: i, dur: 0.45 });
        });
        if (i === 1) {
          // 세 PR Commit 이 하나로 모인다
          this.ghost = [190, 340, 490].map(x => s('circle', { cx: x, cy: 52, r: 17, fill: GREEN }, G.svg));
        }
        if (i === 2) this.reb = ['r1', 'r2', 'r3'].map(id => G.nodes[id].firstChild);
        this.g.push(G);
      });
    },
    render(t, S) {
      const q = prog(S.at(1), 0.45, 0.8, ease.inOutCubic);
      const vis = S.at(1) > -1;
      this.ghost.forEach((c, i) => {
        const x0 = [190, 340, 490][i];
        c.setAttribute('cx', lerp(x0, 600, q)); c.setAttribute('cy', lerp(52, 128, q));
        c.setAttribute('r', lerp(17, 6, q));
        c.style.opacity = vis ? (q >= 1 ? 0 : 1) * clamp(prog(S.at(1), 0.25, 0.3) * 1) : 0;
      });
      this.reb.forEach((c, i) => {
        const p = prog(S.at(2), 0.3 + i * 0.12, 0.5, ease.outBack);
        c.setAttribute('cy', lerp(52, 128, p));
      });
    },
  });

  /* p.50 Merge 전 필요한 조건 — 조건이 모두 맞아야 Merge 버튼이 켜진다 */
  slide({
    id: 'p1e-before-merge', part: 'p1', chap: CH, title: 'Merge 전 필요한 조건', theme: 'white', steps: 1,
    notes: '세 번째 조건에서 충돌·미해결 의견이 남아 있는 상태로 시작합니다. 클릭하면 해결된 상태로 바뀌고 Merge 버튼이 켜집니다. 실제 조건은 저장소마다 다르므로 저장소 규칙을 확인합니다.',
    build(el, A) {
      ttl(el, A, 'Merge 전 필요한 조건');
      const W = U.win(el, { x: 120, y: 280, w: 1140, h: 660, title: 'Pull Request · fix/readme → main' });
      A(W.el, 'up', 0.2);
      const rows = [
        ['user', '반영 권한이 있어야 합니다', 0.7],
        ['branch', '필수 승인과 검사를 충족합니다', 0.95],
        ['x', '충돌과 미해결 의견을 확인합니다', 1.2],
        ['doc', '저장소의 실제 규칙을 따릅니다', 1.45],
      ];
      rows.forEach((r, i) => {
        const y = 36 + i * 138;
        const row = U.box(W.body, 36, y, 1068, 118);
        css(row, { borderRadius: '18px', background: '#F6F7FB', display: 'flex', alignItems: 'center', gap: '26px', padding: '0 30px' });
        const ic = U.icon(r[0] === 'x' ? 'warn' : r[0], 46, 'var(--ink2)', 2.2); row.appendChild(ic);
        const tx = h('div', 'b1', row, r[1]); css(tx, { fontSize: '38px', fontWeight: 650, flex: '1' });
        if (i === 1) { ['승인 1/1', '검사 3/3'].forEach(c => { const cp = U.chip(row, c, { bg: 'var(--green-l)', fg: 'var(--green-d)' }); css(cp, { fontSize: '24px' }); }); }
        const slot = h('span', '', row); css(slot, { position: 'relative', width: '62px', height: '62px', flex: 'none' });
        const ring = U.status(slot, 'wait', 62); U.place(ring, 0, 0);
        A(row, 'up', 0.3 + i * 0.08, { d: 30 });
        A(ring, 'fade', 0.35 + i * 0.08);
        if (i === 2) {
          const bad = U.status(slot, 'fail', 62); U.place(bad, 0, 0); A(bad, 'stamp', r[2], { dur: 0.4 });
          const good = U.status(slot, 'ok', 62); U.place(good, 0, 0); A(good, 'stamp', 0.3, { step: 1, dur: 0.4 });
          this.bad = bad; this.row2 = row;
        } else {
          const good = U.status(slot, 'ok', 62); U.place(good, 0, 0); A(good, 'stamp', r[2], { dur: 0.4 });
        }
      });
      // 오른쪽: Merge 버튼
      const pane = U.box(el, 1320, 300, 480, 620);
      const lk = U.badge(pane, 'lock', { size: 150, bg: '#E6E8EF', fg: '#8A91A8', x: 165, y: 40, k: .46 });
      const un = U.badge(pane, 'check', { size: 150, bg: 'var(--green)', fg: '#fff', x: 165, y: 40, k: .5 });
      A(lk, 'pop', 0.5); A(un, 'stamp', 0.6, { step: 1, dur: 0.45 });
      const b = U.btn(pane, 'Merge', '', { icon: 'merge', is: 44 });
      U.place(b, 60, 260); css(b, { height: '120px', padding: '0 56px', fontSize: '52px', borderRadius: '24px', width: '360px', justifyContent: 'center' });
      this.btn = b; A(b, 'up', 0.6);
      const cap = U.text(pane, 'b3', '조건을 모두 충족하면<br>Merge 할 수 있습니다', 0, 430, 480); css(cap, { textAlign: 'center', fontSize: '30px', fontWeight: 600 });
      A(cap, 'fade', 0.9);
    },
    render(t, S) {
      const p = prog(S.at(1), 0.55, 0.35);
      css(this.btn, { background: p > 0.5 ? 'var(--green)' : '#E6E8EF', color: p > 0.5 ? '#fff' : '#9AA0B4', borderColor: p > 0.5 ? 'var(--green-d)' : '#D6D9E3', transform: `scale(${1 + 0.06 * Math.sin(clamp(p) * Math.PI)})` });
      css(this.bad, { opacity: 1 - prog(S.at(1), 0, 0.25) });
      css(this.row2, { background: p > 0.5 ? '#ECF9F3' : (t > 1.2 ? '#FFF1F1' : '#F6F7FB') });
    },
  });

  /* p.51 Merge 이후의 작업 — 세 단계 카드 */
  slide({
    id: 'p1e-after-merge', part: 'p1', chap: CH, title: 'Merge 이후의 작업', theme: 'paper',
    notes: 'Merge 뒤에는 로컬 기본 브랜치를 최신으로 맞추고, 끝난 브랜치를 지우고, 다음 작업은 새 브랜치에서 시작합니다. 화면의 명령은 한 예입니다.',
    build(el, A) {
      ttl(el, A, 'Merge 이후의 작업');
      const C = [
        ['download', '기본 브랜치를<br>최신 상태로 맞춥니다'],
        ['trash', '끝난 작업 브랜치를<br>정리합니다'],
        ['branch', '다음 변경은<br>새 브랜치에서 시작합니다'],
      ];
      const sv = svgLayer(el);
      C.forEach((c, i) => {
        const x = 120 + i * 580;
        const card = U.card(el, { x, y: 270, w: 520, h: 290, pad: 36 });
        const top = h('div', '', card); css(top, { display: 'flex', alignItems: 'center', gap: '18px' });
        top.appendChild(U.num(null, i + 1, { size: 60, bg: VIOLET }));
        top.appendChild(U.icon(c[0], 50, VIOLET, 2.2));
        const tx = h('div', 'h4', card, c[1]); css(tx, { marginTop: '28px', fontSize: '40px', lineHeight: 1.32 });
        A(card, 'up', 0.3 + i * 0.2, { d: 60 });
        if (i < 2) { const a = path(sv, `M${x + 532} 415 L${x + 568} 415`, VIOLET, 6); A(a, 'draw', 0.6 + i * 0.2, { dur: 0.3 }); }
      });
      // 아래: 세 단계를 한 터미널에 이어서 입력한다(왼쪽 번호가 위 카드 번호)
      const W = U.win(el, { x: 120, y: 596, w: 1080, h: 360, dark: true, title: 'terminal · ~/project' });
      css(W.body, { padding: '22px 30px 0 84px' });
      const lines = ['$ git switch main', '$ git pull', '$ git branch -d fix/readme', '> Deleted branch fix/readme (was 9f3e1d0).', '$ git switch -c docs/next', "> Switched to a new branch 'docs/next'"];
      const tm = U.term(W.body, lines, { size: 26 }); css(tm.el, { lineHeight: '40px' });
      [0, 2, 4].forEach((r, k) => {
        const n = U.num(W.body, k + 1, { size: 40, bg: VIOLET }); css(n, { position: 'absolute', left: '28px', top: 22 + r * 40 + 'px' });
        A(n, 'pop', 1.0 + k * 0.6);
      });
      tm.rows.forEach((r, j) => {
        if (lines[j].startsWith('$')) A(r.cmd, 'type', 1.0 + j * 0.3, { cps: 50 });
        else A(r, 'fade', 1.15 + j * 0.3);
      });
      A(W.el, 'up', 0.8, { d: 40 });
      // 오른쪽: 브랜치 그래프 — fix/readme 는 main 에 합쳐진 뒤 지워지고, docs/next 가 최신 main 에서 갈라진다
      const g = U.box(el, 1240, 596, 560, 360); css(g, { background: '#fff', borderRadius: '22px', boxShadow: '0 20px 40px -28px rgba(15,27,61,.35)' });
      A(g, 'up', 0.9, { d: 40 });
      const gs = s('svg', { width: 560, height: 360, viewBox: '0 0 560 340', style: 'position:absolute;left:0;top:0' }, g);
      const main = path(gs, 'M40 190 L520 190', '#0F1B3D', 6); A(main, 'draw', 1.2, { dur: 0.6 });
      const fix = path(gs, 'M100 190 C140 190 140 100 180 100 L280 100 C320 100 320 190 360 190', '#9AA0B4', 5, '10 10'); A(fix, 'draw', 1.5, { dur: 0.6 });
      const nxt = path(gs, 'M400 190 C430 190 430 270 460 270 L520 270', VIOLET, 6); A(nxt, 'draw', 2.6, { dur: 0.5 });
      [[40, 190, '#0F1B3D'], [100, 190, '#0F1B3D'], [230, 100, '#9AA0B4'], [360, 190, VIOLET], [400, 190, '#0F1B3D'], [520, 270, VIOLET]].forEach(([cx, cy, col], k) => {
        const c = s('circle', { cx, cy, r: 13, fill: '#fff', stroke: col, 'stroke-width': 5 }, gs); A(c, 'pop', 1.3 + k * 0.2);
      });
      const lab = (txt, x, y, col, o = {}) => { const t = U.text(g, 'mono', txt, x, y); css(t, Object.assign({ fontSize: '24px', fontWeight: 700, color: col }, o)); return t; };
      A(lab('main', 24, 222, '#0F1B3D'), 'fade', 1.4);
      A(lab('fix/readme · 삭제됨', 120, 40, '#7A8099', { textDecoration: 'line-through' }), 'fade', 2.0);
      A(lab('docs/next', 360, 290, VIOLET), 'fade', 2.8);
    },
  });

  /* p.52 Branch Protection과 Ruleset — 규칙 토글이 켜진다 */
  slide({
    id: 'p1e-protection', part: 'p1', chap: CH, title: 'Branch Protection과 Ruleset', theme: 'ink', cls: 'dots',
    notes: '중요한 브랜치(main 등)에 변경 조건을 겁니다. 필수 리뷰와 검사를 요구할 수 있고, 누가 규칙을 우회할 수 있는지와 규칙이 실제로 켜져 있는지(Active)도 함께 봅니다.',
    build(el, A) {
      ttl(el, A, 'Branch Protection과 Ruleset');
      const L = U.items(el, [
        { icon: 'check', text: '중요한 브랜치의<br>변경 조건을 정합니다' },
        { icon: 'check', text: '필수 리뷰와 검사를<br>적용할 수 있습니다' },
        { icon: 'check', text: '우회 권한과 실제<br>적용 상태를 확인합니다' },
      ], { x: 120, y: 320, w: 640, isz: 64, gap: 54, kind: 'check', cls: 'b1' });
      L.rows.forEach((r, i) => { css(r.lastChild, { fontSize: '38px', lineHeight: 1.35, color: '#EEF1F8' }); A(r, 'up', 0.35 + i * 0.12); });

      const W = U.win(el, { x: 820, y: 280, w: 980, h: 660, title: 'Settings · Rules' });
      css(W.el, { background: '#fff', color: 'var(--ink)' });
      A(W.el, 'left', 0.25, { d: 120 });
      const panel = (y, ic, name, rows, on, ph) => {
        const p = U.box(W.body, 34, y, 912, ph);
        css(p, { border: '2px solid #E3E6EE', borderRadius: '20px', padding: '22px 28px' });
        const hd = h('div', '', p); css(hd, { display: 'flex', alignItems: 'center', gap: '16px' });
        hd.appendChild(U.icon(ic, 42, VIOLET, 2.2));
        const nm = h('div', '', hd, name); css(nm, { fontSize: '34px', fontWeight: 800, flex: '1' });
        const tg = U.toggle(hd, false, { w: 92, color: VIOLET });
        rows.forEach(([ri, rt, chip]) => {
          const r = h('div', '', p); css(r, { display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px', fontSize: '28px', fontWeight: 600, color: 'var(--ink2)' });
          const okk = U.status(r, 'ok', 34);
          r.appendChild(U.icon(ri, 32, 'var(--ink2)', 2));
          h('span', '', r, rt);
          if (chip) { const c = U.chip(r, chip, { bg: 'var(--green-l)', fg: 'var(--green-d)' }); css(c, { marginLeft: 'auto', fontSize: '24px', height: '40px' }); }
          A(okk, 'pop', on + 0.3 + rows.indexOf(rows.find(x => x[1] === rt)) * 0.12, { dur: 0.35 });
        });
        return tg;
      };
      this.t1 = panel(26, 'branch', 'Branch Protection', [['user', 'Pull Request 리뷰 승인 필요'], ['check', '상태 검사 통과 필요']], 0.9, 222);
      this.t2 = panel(272, 'shield', 'Ruleset', [['target', '대상 브랜치: main'], ['key', '우회 권한: 관리자'], ['eye', '적용 상태', 'Active']], 1.35, 290);
    },
    render(t) {
      U.setToggle(this.t1, prog(t, 0.8, 0.3, ease.inOutCubic), VIOLET);
      U.setToggle(this.t2, prog(t, 1.25, 0.3, ease.inOutCubic), VIOLET);
    },
  });

  /* p.53 CODEOWNERS와 검토 담당자 — 경로별 줄이 담당자에게 이어진다 */
  slide({
    id: 'p1e-codeowners', part: 'p1', chap: CH, title: 'CODEOWNERS와 검토 담당자', theme: 'paper',
    notes: 'CODEOWNERS 파일에 경로와 담당자를 적어 두면, 그 경로를 바꾸는 PR 에 담당자의 리뷰가 자동으로 요청됩니다. 승인을 "필수"로 만드는 것은 Branch Protection·Ruleset 같은 별도 규칙입니다. 화면의 팀 이름은 예시입니다.',
    build(el, A) {
      ttl(el, A, 'CODEOWNERS와 검토 담당자');
      const F = U.win(el, { x: 620, y: 290, w: 680, h: 270, title: '.github/CODEOWNERS' });
      A(F.el, 'zoom', 0.25, { dur: 0.5, from: 0.92 });
      const l1 = U.text(F.body, 'mono', '<span style="color:#0B8A5F">/docs/</span>   @org/docs-team', 34, 40); css(l1, { fontSize: '34px', fontWeight: 600 });
      const l2 = U.text(F.body, 'mono', '<span style="color:#1E4FD0">/src/</span>    @org/core-team', 34, 112); css(l2, { fontSize: '34px', fontWeight: 600 });
      A(l1, 'wipe', 0.6, { dur: 0.4 }); A(l2, 'wipe', 0.75, { dur: 0.4 });
      const team = (x, col, name, path_) => {
        const c = U.card(el, { x, y: 310, w: 400, h: 230, pad: 32 });
        css(c, { boxShadow: `inset 0 0 0 3px ${col}, 0 24px 48px -24px rgba(15,27,61,.28)` });
        const av = h('div', '', c); css(av, { display: 'flex', gap: '10px' });
        U.avatar(av, path_ === '/docs/' ? 'D' : 'C', col, 64); U.avatar(av, path_ === '/docs/' ? 'J' : 'K', col, 64);
        const nm = h('div', 'mono', c, name); css(nm, { marginTop: '22px', fontSize: '28px', fontWeight: 700, color: col });
        const pt = h('div', '', c, path_ + ' 담당'); css(pt, { marginTop: '4px', fontSize: '28px', fontWeight: 650, color: 'var(--ink2)' });
        return c;
      };
      const tl = team(120, GREEN, '@org/docs-team', '/docs/'), tr = team(1400, BLUE, '@org/core-team', '/src/');
      A(tl, 'right', 1.1, { d: 80 }); A(tr, 'left', 1.25, { d: 80 });
      const sv = svgLayer(el);
      const p1 = path(sv, 'M650 390 C 590 390, 580 420, 524 420', GREEN, 6);
      const p2 = path(sv, 'M1270 462 C 1340 462, 1350 420, 1398 420', BLUE, 6);
      A(p1, 'draw', 0.9, { dur: 0.4 }); A(p2, 'draw', 1.05, { dur: 0.4 });
      // PR 창
      const P = U.win(el, { x: 600, y: 610, w: 760, h: 170, title: 'PR · docs: fix setup' });
      const rq = U.text(P.body, '', 'Review requested: <b class="mono" style="color:#0B8A5F">@org/docs-team</b>', 34, 30); css(rq, { fontSize: '32px', fontWeight: 600 });
      A(P.el, 'up', 1.55);
      const p3 = path(sv, 'M320 542 C 320 670, 450 700, 598 700', GREEN, 6, null);
      A(p3, 'draw', 1.5, { dur: 0.45 });
      const B = ['파일 경로별 담당자를 정합니다', '해당 변경의 리뷰를 요청합니다', '필수 승인은 별도 규칙으로 적용합니다'];
      B.forEach((b, i) => {
        const c = h('div', 'p1e-col', el); U.place(c, 120 + i * 580, 832, 560); css(c, { alignItems: 'center' });
        c.appendChild(U.num(null, i + 1, { size: 64, bg: VIOLET }));
        const t = h('div', 'b1', c, b); css(t, { fontSize: '36px', fontWeight: 680, lineHeight: 1.3 });
        A(c, 'up', 1.8 + i * 0.1);
      });
    },
  });

  /* p.54 Release와 Tag — 커밋에 꽂힌 Tag, Release 페이지, 배포는 별도 */
  slide({
    id: 'p1e-release', part: 'p1', chap: CH, title: 'Release와 Tag', theme: 'white',
    notes: 'Tag 는 특정 Commit 에 붙이는 이름이고, Release 는 그 Tag 를 기준으로 파일과 변경 설명을 묶어 공개합니다. Merge 했다고 곧바로 배포되는 것은 아닙니다. 화면의 버전 번호는 예시입니다.',
    build(el, A) {
      ttl(el, A, 'Release와 Tag');
      // 세로 커밋 타임라인
      const sv = svgLayer(el);
      const ln = path(sv, 'M200 300 L200 800', BLUE, 8); A(ln, 'draw', 0.25, { dur: 0.7, ease: ease.inOutCubic });
      [300, 420, 540, 660, 780].forEach((y, i) => {
        const c = s('circle', { cx: 200, cy: y, r: 17, fill: BLUE }, sv); css(c, { transformBox: 'fill-box', transformOrigin: 'center' });
        A(c, 'pop', 0.3 + i * 0.1, { dur: 0.35 });
      });
      const tag1 = U.chip(el, 'v1.0.0', { icon: 'tag', bg: 'var(--green)', fg: '#fff', size: 'lg' }); U.place(tag1, 250, 388);
      const tag2 = U.chip(el, 'v1.1.0', { icon: 'tag', bg: BLUE, fg: '#fff', size: 'lg' }); U.place(tag2, 250, 748);
      A(tag1, 'left', 0.9, { d: 60 }); A(tag2, 'left', 1.05, { d: 60 });
      const n1 = U.text(el, 'b2', 'Tag는 특정 Commit을<br>표시합니다', 250, 500, 420); css(n1, { fontSize: '34px', fontWeight: 650, color: 'var(--ink)' });
      A(n1, 'fade', 1.2);
      // Release 창
      const R = U.win(el, { x: 760, y: 280, w: 1040, h: 430, title: 'Releases · v1.1.0' });
      A(R.el, 'up', 0.6);
      const rh = U.text(R.body, '', 'v1.1.0', 40, 30); css(rh, { fontSize: '50px', fontWeight: 850 });
      const rl = U.chip(R.body, 'Latest', { bg: 'var(--green-l)', fg: 'var(--green-d)' }); U.place(rl, 250, 42);
      const rn = U.text(R.body, 'b3', '변경 내용: 설치 안내 수정, 빈 입력 처리 개선', 40, 104, 940); css(rn, { fontSize: '28px' });
      ['my-project-1.1.0.zip', 'my-project-1.1.0.tar.gz', 'CHANGELOG.md'].forEach((f, i) => {
        const r = U.box(R.body, 40, 168 + i * 62, 960, 52);
        css(r, { display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1.5px solid #ECEEF4', paddingTop: '8px' });
        r.appendChild(U.icon('package', 34, 'var(--ink2)'));
        const fn = h('span', 'mono', r, f); css(fn, { fontSize: '26px', flex: '1' });
        r.appendChild(U.icon('download', 34, BLUE, 2.4));
        A(r, 'up', 1.0 + i * 0.1, { d: 20 });
      });
      const n2 = U.text(el, 'b2', 'Release는 파일과 변경 설명을 제공합니다', 760, 728, 1040); css(n2, { fontSize: '34px', fontWeight: 650, color: 'var(--ink)' });
      A(n2, 'fade', 1.3);
      // 배포 흐름
      const flow = [['merge', 'Merge', VIOLET], ['package', 'Release', BLUE], ['server', '배포', 'var(--amber)']];
      flow.forEach((f, i) => {
        const x = 760 + i * 262;
        const b = U.badge(el, f[0], { size: 84, bg: f[2], x, y: 812, square: true });
        const l = U.text(el, '', f[1], x + 98, 834); css(l, { fontSize: '32px', fontWeight: 750 });
        A(b, 'pop', 1.5 + i * 0.15); A(l, 'fade', 1.55 + i * 0.15);
        if (i < 2) { const ar = U.icon('arrow', 40, '#9AA0B4', 2.6); U.place(ar, x + 214, 834); el.appendChild(ar); A(ar, 'right', 1.6 + i * 0.15, { d: 20 }); }
      });
      const n3 = U.text(el, '', 'Merge와 배포는<br><span class="hr">별도 단계</span>입니다', 1500, 808, 300); css(n3, { fontSize: '34px', fontWeight: 800, lineHeight: 1.3 });
      A(n3, 'up', 2.1);
    },
  });

  /* p.55 CONTRIBUTING의 역할 — 문서의 단락이 실제 작업으로 이어진다 */
  slide({
    id: 'p1e-contributing', part: 'p1', chap: CH, title: 'CONTRIBUTING의 역할', theme: 'paper',
    notes: '기여 전에 가장 먼저 열어 볼 문서입니다. 개발 환경과 검사 명령, Issue·PR 작성 절차, 프로젝트가 원하는 것과 원하지 않는 것이 적혀 있습니다. 화면의 문서 내용은 예시입니다.',
    build(el, A) {
      ttl(el, A, 'CONTRIBUTING의 역할');
      const D = U.win(el, { x: 120, y: 280, w: 760, h: 660, title: 'CONTRIBUTING.md' });
      A(D.el, 'flipY', 0.2, { deg: 30 });
      const secs = [
        ['## 개발 환경과 검사', '$ pip install -r requirements.txt<br>$ python -m unittest'],
        ['## Issue와 PR 작성', '템플릿을 채우고 관련 이슈를 연결합니다'],
        ['## 프로젝트가 원하는 기여', '큰 변경은 먼저 Issue로 논의합니다'],
      ];
      this.sec = secs.map((sc, i) => {
        const b = U.box(D.body, 28, 26 + i * 192, 704, 172);
        css(b, { borderRadius: '16px', padding: '20px 26px' });
        const hd = h('div', 'mono', b, sc[0]); css(hd, { fontSize: '30px', fontWeight: 700, color: VIOLET });
        const bd = h('div', '', b, sc[1]); css(bd, { fontSize: '26px', marginTop: '10px', color: 'var(--ink2)', fontFamily: i === 0 ? 'var(--mono)' : 'var(--sans)', fontWeight: 550, lineHeight: 1.5 });
        A(b, 'up', 0.45 + i * 0.1, { d: 20 });
        return b;
      });
      const R = [
        ['gear', '개발 환경과 검사 명령을<br>안내합니다'],
        ['doc', 'Issue와 PR 작성 절차를<br>설명합니다'],
        ['book', '프로젝트의 요구를<br>먼저 읽습니다'],
      ];
      const sv = svgLayer(el);
      R.forEach((r, i) => {
        const y = 300 + i * 212;
        const c = U.card(el, { x: 1060, y, w: 740, h: 176, pad: 34 });
        css(c, { display: 'flex', alignItems: 'center', gap: '28px' });
        c.appendChild(U.badge(null, r[0], { size: 96, bg: VIOLET, square: true }));
        const t = h('div', 'b1', c, r[1]); css(t, { fontSize: '38px', fontWeight: 700, lineHeight: 1.3 });
        const tt = 1.0 + i * 0.4;
        const p = path(sv, `M860 ${y + 54} C 960 ${y + 54}, 960 ${y + 88}, 1058 ${y + 88}`, VIOLET, 5);
        A(p, 'draw', tt, { dur: 0.35 }); A(c, 'left', tt + 0.2, { d: 60 });
      });
    },
    render(t) {
      this.sec.forEach((b, i) => {
        const on = prog(t, 0.95 + i * 0.4, 0.3);
        css(b, { background: `rgba(124,92,255,${0.1 * on})`, boxShadow: on > 0 ? `inset 4px 0 0 rgba(124,92,255,${on})` : 'none' });
      });
    },
  });

  /* p.56 행동 규범과 커뮤니케이션 — 같은 내용을 다르게 쓴 두 댓글 */
  slide({
    id: 'p1e-conduct', part: 'p1', chap: CH, title: '행동 규범과 커뮤니케이션', theme: 'white',
    notes: '오른쪽 두 댓글은 같은 문제를 다르게 쓴 예시입니다. 위 댓글은 사람을 평가하고, 아래 댓글은 입력과 결과, 제안을 구체적으로 말합니다. 문제가 생기면 CODE_OF_CONDUCT 의 신고·논의 절차를 따릅니다.',
    build(el, A) {
      ttl(el, A, '행동 규범과 커뮤니케이션');
      const doc = U.chip(el, 'CODE_OF_CONDUCT.md', { icon: 'doc', size: 'lg', bg: 'var(--violet-l)', fg: '#5B3FD6' }); U.place(doc, 120, 272);
      css(doc, { fontFamily: 'var(--mono)' }); A(doc, 'pop', 0.3);
      const L = U.items(el, [
        { icon: 'chat', text: '문제와 변경 내용을<br>구체적으로 말합니다', color: VIOLET },
        { icon: 'users', text: '사람에 대한 평가를<br>피합니다', color: VIOLET },
        { icon: 'shield', text: '신고와 논의 절차를<br>따릅니다', color: VIOLET },
      ], { x: 120, y: 400, w: 700, isz: 80, gap: 44, square: true });
      L.rows.forEach((r, i) => { css(r.lastChild, { fontSize: '38px', fontWeight: 650, lineHeight: 1.35, color: 'var(--ink)' }); A(r, 'up', 0.45 + i * 0.12); });
      const cm = (y, who, col, body, kind) => {
        const c = U.card(el, { x: 900, y, w: 900, h: 250, pad: 34 });
        const hd = h('div', '', c); css(hd, { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '28px', fontWeight: 700, color: 'var(--ink2)' });
        U.avatar(hd, who[0], col, 52); h('span', '', hd, who);
        const tag = U.chip(hd, kind === 'bad' ? '사람을 평가함' : '구체적으로 말함', { bg: kind === 'bad' ? 'var(--red-l)' : 'var(--green-l)', fg: kind === 'bad' ? '#B42323' : 'var(--green-d)' });
        css(tag, { marginLeft: 'auto', fontSize: '24px', height: '40px' });
        const b = h('div', '', c, body); css(b, { marginTop: '22px', fontSize: '34px', fontWeight: 600, lineHeight: 1.45 });
        return { c, b };
      };
      const bad = cm(300, 'reviewer-a', '#9AA0B4', '이런 코드를 누가 이렇게 짰나요?', 'bad');
      const good = cm(590, 'reviewer-b', VIOLET, '빈 문자열을 넣으면 <code>IndexError</code>가 납니다.<br>길이를 먼저 확인하면 어떨까요?', 'good');
      A(bad.c, 'left', 0.7, { d: 100 }); A(good.c, 'left', 1.4, { d: 100 });
      this.bad = bad;
      const ex = U.text(el, 'cap', '댓글 예시', 1680, 870); css(ex, { fontSize: '24px' }); A(ex, 'fade', 1.6);
    },
    render(t) {
      const p = prog(t, 1.2, 0.4);
      css(this.bad.b, { textDecoration: p > 0.1 ? 'line-through' : 'none', textDecorationColor: 'var(--red)', textDecorationThickness: '4px' });
      css(this.bad.c, { opacity: 1 - 0.45 * p });
    },
  });

  /* p.57 DCO와 CLA 확인 — 좌우 비교 + Sign-off 와 Commit 서명의 차이 */
  slide({
    id: 'p1e-dco-cla', part: 'p1', chap: CH, title: 'DCO와 CLA 확인', theme: 'paper',
    notes: 'DCO 는 Commit 마다 Signed-off-by 줄로 "이 기여를 제출할 권리가 있다"는 것 등을 확인합니다. CLA 는 프로젝트마다 다른 기여 계약입니다. git commit -s(소문자)는 Sign-off 줄을 넣고, -S(대문자)는 Commit 에 암호 서명을 합니다. 둘은 다릅니다. 이름·주소는 예시입니다.',
    build(el, A) {
      ttl(el, A, 'DCO와 CLA 확인');
      const L = U.card(el, { x: 120, y: 280, w: 800, h: 420, pad: 40 });
      const R = U.card(el, { x: 1000, y: 280, w: 800, h: 420, pad: 40 });
      [L, R].forEach((c, i) => A(c, 'up', 0.25 + i * 0.15));
      const hd = (c, name, col) => { const t = h('div', 'mono', c, name); css(t, { fontSize: '56px', fontWeight: 700, color: col }); return t; };
      hd(L, 'DCO', VIOLET); hd(R, 'CLA', BLUE);
      const lt = h('div', 'b1', L, 'DCO는 기여 권한 등을 확인합니다'); css(lt, { fontSize: '36px', fontWeight: 700, marginTop: '10px' });
      const rt = h('div', 'b1', R, 'CLA는 프로젝트별 기여 계약입니다'); css(rt, { fontSize: '36px', fontWeight: 700, marginTop: '10px' });
      const lc = h('div', '', L); css(lc, { marginTop: '28px', background: '#0E1530', borderRadius: '16px', padding: '22px 26px', fontFamily: 'var(--mono)', fontSize: '26px', color: '#DCE3F5', lineHeight: 1.6 });
      lc.innerHTML = 'docs: fix setup<br><br><span style="color:#B3A2FF">Signed-off-by: Kim Dongguk</span><br><span style="color:#B3A2FF">&nbsp;&nbsp;&lt;dongguk@example.com&gt;</span>';
      A(lc, 'wipe', 0.8, { dur: 0.5 });
      const rc = h('div', '', R); css(rc, { marginTop: '28px' });
      ['license/cla', 'build', 'test'].forEach((c, i) => {
        const r = h('div', '', rc); css(r, { display: 'flex', alignItems: 'center', gap: '18px', height: '60px', borderTop: i ? '1.5px solid #ECEEF4' : 'none', fontFamily: 'var(--mono)', fontSize: '30px', fontWeight: 600 });
        const okk = U.status(r, 'ok', 40); h('span', '', r, c);
        A(okk, 'stamp', 1.0 + i * 0.15, { dur: 0.35 });
      });
      // 아래 띠
      const band = U.box(el, 120, 740, 1680, 200);
      css(band, { background: 'var(--ink)', borderRadius: '26px', color: '#fff' });
      A(band, 'up', 1.4);
      const b1 = U.text(band, '', '요구 여부와 실제 조건을 읽습니다', 48, 40, 640); css(b1, { fontSize: '36px', fontWeight: 750 });
      const b2 = U.text(band, '', 'Sign-off와 Commit 서명은 다릅니다', 48, 104, 640); css(b2, { fontSize: '36px', fontWeight: 750, color: '#B3A2FF' });
      const cmp = U.box(band, 760, 36, 880, 130); css(cmp, { display: 'flex', alignItems: 'center', gap: '26px' });
      const c1 = h('div', '', cmp, '<div class="mono" style="font-size:40px;font-weight:700">git commit <span style="color:#B3A2FF">-s</span></div><div style="font-size:26px;color:#AEB8D3;margin-top:6px;font-weight:600">Signed-off-by 줄 추가</div>');
      const ne = U.icon('neq', 64, 'var(--red)', 2.6); cmp.appendChild(ne);
      const c2 = h('div', '', cmp, '<div class="mono" style="font-size:40px;font-weight:700">git commit <span style="color:#7FA4FF">-S</span></div><div style="font-size:26px;color:#AEB8D3;margin-top:6px;font-weight:600">Commit에 암호 서명</div>');
      A(c1, 'up', 1.7); A(ne, 'pop', 1.9); A(c2, 'up', 2.0);
    },
  });

  /* 확인 퀴즈 — 단계마다 정답 하나씩 */
  slide({
    id: 'p1e-quiz', part: 'p1', chap: CH, title: '확인 퀴즈', theme: 'blue', steps: 4,
    notes: '학생들에게 먼저 답을 묻고 클릭으로 정답을 하나씩 공개합니다. ③에서 "#12 참고"처럼 단순히 언급하면 이슈가 닫히지 않는다는 점을 짚습니다.',
    build(el, A) {
      const k = U.text(el, 'k', '지금까지 확인', 120, 96); css(k, { color: '#fff' }); A(k, 'right', 0);
      const tt = U.text(el, 'h1', '확인 퀴즈', 120, 140); css(tt, { color: '#fff', fontSize: '96px' }); A(tt, 'chars', 0.08, { each: 0.05 });
      const Q = [
        ['원본 저장소를 내 계정에<br>별도 저장소로 만드는 것은?', ['Clone', 'Fork'], 1],
        ['PR에서 변경을<br>반영할 대상은?', ['Base', 'Head'], 0],
        ['Merge되면 연결한 이슈를<br>닫는 PR 본문은?', ['<code>Closes #12</code>', '#12 참고'], 0],
        ['PR 변경을 하나의 Commit으로<br>합치는 방식은?', ['Squash', 'Rebase'], 0],
      ];
      this.opts = [];
      Q.forEach((q, i) => {
        const x = 120 + (i % 2) * 850, y = 290 + Math.floor(i / 2) * 330;
        const c = h('div', 'p1e-q', el); U.place(c, x, y, 830, 310);
        const n = h('div', 'numf', c, String(i + 1)); css(n, { position: 'absolute', right: '34px', top: '18px', fontSize: '90px', color: '#DCE6FF', lineHeight: 1 });
        const qt = h('div', '', c, q[0]); css(qt, { fontSize: '38px', fontWeight: 760, lineHeight: 1.32, letterSpacing: '-.025em', maxWidth: '640px', position: 'relative' });
        const ob = h('div', '', c); css(ob, { position: 'absolute', left: '38px', bottom: '34px', display: 'flex' });
        const os = q[1].map((o, j) => {
          const op = h('span', 'p1e-opt', ob);
          const mk = h('span', '', op); css(mk, { width: '36px', height: '36px', display: 'none' });
          mk.appendChild(U.icon('check', 36, '#fff', 3));
          h('span', '', op, o);
          return { op, mk, right: j === q[2] };
        });
        this.opts.push(os);
        A(c, 'up', 0.3 + i * 0.1, { d: 50 });
      });
    },
    render(t, S) {
      this.opts.forEach((os, i) => {
        const p = prog(S.at(i + 1), 0, 0.35, ease.pop);
        os.forEach(o => {
          if (o.right) {
            css(o.op, { background: p > 0 ? 'var(--green)' : '#EEF1F8', color: p > 0 ? '#fff' : 'var(--ink)', transform: `scale(${p > 0 ? lerp(1.25, 1, p) : 1})` });
            css(o.mk, { display: p > 0 ? 'inline-block' : 'none' });
            const cd = o.op.querySelector('code'); if (cd) cd.style.color = p > 0 ? '#fff' : '';
          } else css(o.op, { opacity: 1 - 0.6 * clamp(p) });
        });
      });
    },
  });
})();
