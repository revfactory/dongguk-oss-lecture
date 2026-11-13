/* PART 1 표지 + 1A 오픈소스와 저장소 (원본 p.4~p.11) */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, count, noise } = DECK;
  const U = UI;
  const CH = '1A 오픈소스와 저장소';

  /* 코드처럼 보이는 색 막대 줄 */
  function codeBars(parent, x, y, rows, o = {}) {
    const gap = o.gap || 40, hh = o.h || 16;
    return rows.map(([indent, w, col], i) => {
      const b = U.box(parent, x + indent * 34, y + i * gap, w, hh);
      css(b, { background: col, borderRadius: hh / 2 + 'px', opacity: o.op ?? 1 });
      return b;
    });
  }
  const CODE_ROWS = [[0, 210, '#B3A2FF'], [1, 300, '#7FA4FF'], [1, 180, '#4BE3A6'], [2, 260, '#AEB8D3'], [2, 140, '#7FA4FF'], [1, 230, '#4BE3A6'], [0, 120, '#B3A2FF'], [1, 280, '#AEB8D3'], [1, 190, '#7FA4FF']];

  /* 0. PART 1 표지 */
  slide({
    id: 'p1a-cover', part: 'p1', title: 'PART 1 · GitHub의 기본 협업 방식', theme: 'green', noChrome: true,
    notes: 'Part 1은 두 번에 나눠 진행. 전반(오픈소스·Git·Issue) 뒤 10분 휴식, 후반(PR·리뷰·CI·Merge).',
    build(el, A) {
      U.partCover(el, A, { n: '1', label: 'PART 1', title: 'GitHub의<br>기본 협업 방식', chapters: ['오픈소스와 저장소', 'Git 기본', 'Issue', 'PR·리뷰·CI', 'Merge와 저장소 규칙'], color: '#12B07A', img: 'img/part1_collab_cut.png' });
    },
  });

  /* 1. 오픈소스의 의미 (p.4) */
  slide({
    id: 'p1a-meaning', part: 'p1', chap: CH, title: '오픈소스의 의미', theme: 'paper',
    notes: '코드를 볼 수 있다는 것만으로 오픈소스가 되지 않는다. 라이선스가 사용·수정·배포 조건을 정하고, 운영 규칙이 참여 방법을 정한다.',
    build(el, A) {
      const T = U.title(el, null, '오픈소스의 의미', { y: 110 });
      A(T.t, 'chars', 0, { each: 0.05 });
      const it = U.items(el, [
        { icon: 'doc', text: '소스 코드를 확인할 수 있습니다', color: 'var(--green)' },
        { icon: 'gear', text: '라이선스에 따라<br>사용·수정·배포합니다', color: 'var(--blue)' },
        { icon: 'users', text: '프로젝트의 운영 규칙을<br>확인합니다', color: 'var(--teal)' },
      ], { x: 120, y: 330, w: 800, isz: 92, gap: 54, cls: 'b1' });
      A(it.rows, 'up', 0.35, { each: 0.12 });
      // 운영 규칙 카드(뒤)
      const rules = U.card(el, { x: 960, y: 650, w: 380, h: 200, pad: 34 });
      rules.appendChild(U.icon('users', 46, 'var(--teal)'));
      const r1 = h('div', '', rules, '운영 규칙'); css(r1, { fontSize: '34px', fontWeight: 800, marginTop: '10px' });
      const r2 = h('div', 'mono', rules, 'CONTRIBUTING'); css(r2, { fontSize: '24px', color: 'var(--ink2)', marginTop: '4px' });
      A(rules, 'tilt', 1.25, { r: -6, d: 80 });
      // 코드 창
      const w = U.win(el, { x: 1000, y: 180, w: 640, h: 440, dark: true, title: 'src/main.py' });
      A(w.el, 'tilt', 0.3, { r: 4, d: 90 });
      const bars = codeBars(w.body, 40, 40, CODE_ROWS, { gap: 38 });
      bars.forEach((b, i) => A(b, 'grow', 0.6 + i * 0.05, { dur: 0.35 }));
      // LICENSE 문서
      const lic = U.card(el, { x: 1290, y: 470, w: 510, h: 400, pad: 40 });
      const hd = h('div', 'row', lic); css(hd, { gap: '16px' });
      hd.appendChild(U.icon('doc', 50, 'var(--ink)'));
      const ht = h('span', 'mono', hd, 'LICENSE'); css(ht, { fontSize: '40px', fontWeight: 700 });
      A(lic, 'tilt', 0.9, { r: -5, d: 110 });
      const chips = h('div', 'row', lic); css(chips, { gap: '14px', marginTop: '34px' });
      ['사용', '수정', '배포'].forEach((t, i) => {
        const c = U.chip(chips, t, { size: 'lg', bg: 'var(--green-l)', fg: 'var(--green-d)', icon: 'check' });
        A(c, 'stamp', 1.35 + i * 0.16, { dur: 0.45 });
      });
      [380, 330, 400, 260].forEach((ww, i) => {
        const l = h('div', '', lic); css(l, { width: ww + 'px', height: '14px', borderRadius: '7px', background: '#E3E0EA', marginTop: i ? '18px' : '40px' });
        A(l, 'grow', 1.2 + i * 0.05, { dur: 0.35 });
      });
    },
  });

  /* 2. 코드 외에도 기여할 수 있습니다 (p.5) */
  slide({
    id: 'p1a-beyond-code', part: 'p1', chap: CH, title: '코드 외에도 기여할 수 있습니다', theme: 'white',
    notes: '첫 기여로 문서 수정, 오류 재현 정보 정리, 번역·디자인·리뷰가 많이 쓰인다. 코드를 잘 몰라도 시작할 수 있다는 점을 강조.',
    build(el, A) {
      const T = U.title(el, null, '코드 외에도 기여할 수 있습니다', { y: 96, align: 'center' });
      A(T.t, 'chars', 0, { each: 0.03 });
      const cols = [
        { x: 120, color: 'var(--green)', tint: '#E4F6EE', icon: 'doc', cap: '문서를 고치고<br>예제를 추가합니다' },
        { x: 690, color: 'var(--red)', tint: '#FDECEC', icon: 'bug', cap: '오류를 재현하고<br>정보를 정리합니다' },
        { x: 1260, color: 'var(--blue)', tint: '#E6EDFF', icon: 'globe', cap: '번역·디자인·리뷰에도<br>참여합니다' },
      ];
      cols.forEach((c, i) => {
        const cd = U.card(el, { x: c.x, y: 290, w: 540, h: 640, pad: 0 });
        css(cd, { overflow: 'hidden' });
        const top = U.box(cd, 0, 0, 540, 380); css(top, { background: c.tint });
        const b = U.badge(cd, c.icon, { size: 84, bg: c.color, x: 40, y: 420 });
        const cap = U.text(cd, 'b1', c.cap, 40, 524, 470); css(cap, { fontWeight: 700, fontSize: '38px', lineHeight: 1.35 });
        A(cd, 'tilt', 0.35 + i * 0.14, { r: (i - 1) * 4, d: 140 });
        A(b, 'pop', 0.8 + i * 0.14);
        c.top = top; c.i = i;
      });
      // 1) 문서: Diff 의 추가 줄
      {
        const top = cols[0].top;
        const w = U.win(top, { x: 40, y: 40, w: 460, h: 300, title: 'README.md' });
        const d = U.diff(w.body, [[' ', '## 설치'], [' ', 'pip install …'], ['+', '## 사용 예제'], ['+', 'run --help']], { size: 24, rowH: 52, x: 0, y: 14, w: 460 });
        d.rows.forEach((r, k) => A(r, k >= 2 ? 'wipe' : 'fade', 1.0 + k * 0.12, { dur: 0.4 }));
      }
      // 2) 오류 재현: 터미널 + 정리 항목
      {
        const top = cols[1].top;
        const w = U.win(top, { x: 40, y: 40, w: 460, h: 170, dark: true, nobar: true });
        const t = U.term(w.body, ['$ ./run.sh', 'er Error: 예상과 다른 결과'], { size: 26, x: 30, y: 26 });
        A(t.rows[0].cmd, 'type', 1.0, { cps: 30 });
        A(t.rows[1], 'fade', 1.45);
        ['환경', '재현 절차', '결과'].forEach((tx, k) => {
          const c = U.chip(top, tx, { bg: '#fff', fg: 'var(--ink)', x: 40 + [0, 120, 300][k], y: 260, icon: 'check' });
          css(c, { fontSize: '26px' });
          A(c, 'pop', 1.7 + k * 0.12);
        });
      }
      // 3) 번역·디자인·리뷰
      {
        const top = cols[2].top;
        const a = U.text(top, '', 'A', 60, 40); css(a, { fontSize: '120px', fontWeight: 900, color: 'var(--blue)', lineHeight: 1 });
        const ar = U.icon('arrow', 60, 'var(--ink2)', 2.4); U.place(ar, 165, 70); top.appendChild(ar);
        const g = U.text(top, '', '가', 250, 40); css(g, { fontSize: '120px', fontWeight: 900, color: 'var(--ink)', lineHeight: 1 });
        A(a, 'pop', 1.0); A(ar, 'right', 1.15, { d: 30 }); A(g, 'pop', 1.3);
        ['#12B07A', '#2F6BFF', '#7C5CFF', '#F5A524'].forEach((col, k) => {
          const sw = U.box(top, 400, 40 + k * 36, 100, 28); css(sw, { background: col, borderRadius: '14px' });
          A(sw, 'grow', 1.2 + k * 0.07, { dur: 0.35 });
        });
        const bb = U.bubble(top, '<span style="display:flex;align-items:center;gap:14px"><span class="badge" style="width:40px;height:40px;background:var(--green);color:#fff"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l4.8 4.8L19.5 7"/></svg></span>리뷰 의견</span>', { x: 60, y: 210, size: 30, pad: '20px 28px', tail: 'bl' });
        A(bb, 'up', 1.6);
      }
    },
  });

  /* 3. 기여자와 메인테이너의 역할 (p.6) */
  slide({
    id: 'p1a-roles', part: 'p1', chap: CH, title: '기여자와 메인테이너의 역할', theme: 'paper',
    notes: '기여자는 변경과 검증 근거를 함께 낸다. 반영 여부는 메인테이너가 정한다. 그래서 기여 전에 프로젝트가 무엇을 필요로 하는지 먼저 확인한다.',
    build(el, A) {
      const T = U.title(el, null, '기여자와 메인테이너의 역할', { y: 96 });
      A(T.t, 'chars', 0, { each: 0.03 });
      // 기여자
      const cb = U.badge(el, 'user', { size: 150, bg: 'var(--green)', x: 190, y: 330, k: .52 });
      const cl = U.text(el, 'h3', '기여자', 120, 506, 380); css(cl, { textAlign: 'center', width: '300px' });
      const cc = U.text(el, 'b2', '변경과 검증 근거를<br>제안합니다', 120, 580, 340); css(cc, { textAlign: 'center', width: '300px', color: 'var(--ink)', fontWeight: 600 });
      A(cb, 'pop', 0.3); A([cl, cc], 'up', 0.45, { each: 0.08 });
      // 메인테이너
      const mb = U.badge(el, 'user', { size: 150, bg: 'var(--blue)', x: 1580, y: 330, k: .52 });
      const ml = U.text(el, 'h3', '메인테이너', 1500, 506); css(ml, { textAlign: 'center', width: '310px' });
      const mc = U.text(el, 'b2', '검토하고 반영을<br>결정합니다', 1500, 580); css(mc, { textAlign: 'center', width: '310px', color: 'var(--ink)', fontWeight: 600 });
      A(mb, 'pop', 1.5); A([ml, mc], 'up', 1.6, { each: 0.08 });
      // 가운데 PR 창
      const w = U.win(el, { x: 560, y: 270, w: 800, h: 540, title: 'Pull Request' });
      A(w.el, 'zoom', 0.6, { from: 0.9 });
      const sec = (y, label) => { const l = U.text(w.body, 'cap', label, 40, y); css(l, { fontSize: '26px', fontWeight: 800, color: 'var(--ink)' }); return l; };
      const s1 = sec(28, '설명');
      const d1 = U.box(w.body, 40, 76, 560, 16); css(d1, { background: '#E3E0EA', borderRadius: '8px' });
      const d2 = U.box(w.body, 40, 106, 420, 16); css(d2, { background: '#E3E0EA', borderRadius: '8px' });
      const s2 = sec(150, '변경 파일');
      const df = U.diff(w.body, [['-', 'pip install old-name'], ['+', 'pip install new-name']], { size: 24, rowH: 46, x: 40, y: 196, w: 720, gutter: false });
      const s3 = sec(310, '검사 결과');
      const chk = ['빌드', '테스트'].map((t, k) => {
        const r = U.box(w.body, 40 + k * 230, 356, 210, 60); css(r, { display: 'flex', alignItems: 'center', gap: '14px', fontSize: '28px', fontWeight: 700 });
        r.appendChild(U.status(null, 'ok', 44)); h('span', '', r, t);
        return r;
      });
      [s1, d1, d2, s2, ...df.rows, s3, ...chk].forEach((e, k) => A(e, 'up', 0.85 + k * 0.06, { d: 20 }));
      // 화살표
      const a1 = U.arrow(el, [[440, 410], [540, 410]], { color: 'var(--green)', sw: 6 });
      const a2 = U.arrow(el, [[1380, 410], [1490, 410]], { color: 'var(--blue)', sw: 6 });
      A(a1.path, 'draw', 0.55, { dur: 0.4 }); A(a1.head, 'fade', 0.85);
      A(a2.path, 'draw', 1.35, { dur: 0.4 }); A(a2.head, 'fade', 1.65);
      // 반영 결정 도장
      const st = U.chip(el, '반영 결정', { size: 'lg', bg: 'var(--blue)', fg: '#fff', icon: 'check', x: 1100, y: 700 });
      A(st, 'stamp', 1.95, { dur: 0.45 });
      // 바닥 띠
      const band = U.box(el, 120, 850, 1680, 100);
      css(band, { background: 'var(--ink)', color: '#fff', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '24px', padding: '0 40px', fontSize: '40px', fontWeight: 760, letterSpacing: '-.02em' });
      band.appendChild(U.icon('target', 52, 'var(--mint)', 2.2)); h('span', '', band, '프로젝트의 필요를 먼저 확인합니다');
      A(band, 'wipe', 2.2, { dur: 0.6 });
    },
  });

  /* 4. 공개 저장소와 오픈소스 라이선스 (p.7) */
  slide({
    id: 'p1a-license', part: 'p1', chap: CH, title: '공개 저장소와 오픈소스 라이선스', theme: 'white',
    notes: 'Public 저장소라고 해서 마음대로 써도 되는 것은 아니다. LICENSE 파일이 없으면 이용 조건이 정해지지 않은 것이다. 두 가지를 함께 본다.',
    build(el, A) {
      const T = U.title(el, null, '공개 저장소와 오픈소스 라이선스', { y: 96, align: 'center' });
      A(T.t, 'chars', 0, { each: 0.03 });
      // 왼쪽 저장소 창
      const L = U.win(el, { x: 120, y: 280, w: 540, h: 560, title: 'owner/project' });
      A(L.el, 'right', 0.3, { d: 140 });
      const rn = U.text(L.body, 'mono', 'project', 36, 34); css(rn, { fontSize: '34px', fontWeight: 700 });
      const pub = U.chip(L.body, 'Public', { size: 'lg', bg: 'var(--green-l)', fg: 'var(--green-d)', icon: 'eye', x: 250, y: 24 });
      A(pub, 'stamp', 0.9, { dur: 0.45 });
      ['folder', 'folder', 'file', 'file', 'file'].forEach((ic, k) => {
        const r = U.box(L.body, 36, 130 + k * 72, 470, 56); css(r, { display: 'flex', alignItems: 'center', gap: '18px', borderTop: '1.5px solid rgba(15,27,61,.08)' });
        r.appendChild(U.icon(ic, 34, ic === 'folder' ? '#5B8DEF' : '#9AA0B4'));
        const bar = h('i', '', r); css(bar, { display: 'block', width: [180, 140, 220, 160, 120][k] + 'px', height: '14px', borderRadius: '7px', background: '#E3E0EA' });
        A(r, 'fade', 0.6 + k * 0.05);
      });
      // 오른쪽 LICENSE 창
      const R = U.win(el, { x: 1260, y: 280, w: 540, h: 560, title: 'LICENSE' });
      A(R.el, 'left', 0.45, { d: 140 });
      const lh = h('div', 'row', R.body); U.place(lh, 36, 30); css(lh, { gap: '16px' });
      lh.appendChild(U.icon('doc', 52, 'var(--ink)'));
      const lt = h('span', 'mono', lh, 'LICENSE'); css(lt, { fontSize: '44px', fontWeight: 700 });
      A(lh, 'stamp', 1.1, { dur: 0.45, from: 1.6, r: 0 });
      [440, 400, 460, 300, 420, 380, 250].forEach((ww, k) => {
        const l = U.box(R.body, 36, 140 + k * 46, ww, 14); css(l, { background: '#E3E0EA', borderRadius: '7px' });
        A(l, 'grow', 1.0 + k * 0.04, { dur: 0.3 });
      });
      // 가운데 흐름
      const steps = [
        ['<b class="hb">Public</b>은<br>공개 범위입니다', '#E6EDFF'],
        ['<b class="hl">LICENSE</b>는<br>이용 조건입니다', '#E4F6EE'],
        ['두 항목을<br>함께 확인합니다', 'var(--ink)'],
      ];
      steps.forEach((st, k) => {
        const b = U.box(el, 720, 290 + k * 196, 480, 150);
        css(b, { background: st[1], borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '36px', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-.02em', color: k === 2 ? '#fff' : 'var(--ink)' });
        b.innerHTML = '<span>' + st[0] + '</span>';
        A(b, 'up', 0.8 + k * 0.4, { d: 40 });
        if (k < 2) { const ar = U.icon('download', 40, 'var(--muted)', 2.4); U.place(ar, 940, 446 + k * 196 - 4); el.appendChild(ar); A(ar, 'down', 1.05 + k * 0.4, { d: 20 }); }
      });
      // 두 창에 확인 표시
      [[600, 252], [1740, 252]].forEach(([x, y], k) => {
        const c = U.status(el, 'ok', 76); U.place(c, x, y);
        A(c, 'stamp', 2.0 + k * 0.12, { dur: 0.45 });
      });
    },
  });

  /* 5. 저장소에서 먼저 읽을 문서 (p.8) */
  slide({
    id: 'p1a-docs', part: 'p1', chap: CH, title: '저장소에서 먼저 읽을 문서', theme: 'paper',
    notes: '저장소 첫 화면의 파일 목록에서 README, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT 를 먼저 찾는다. Part 2 에서 실제 저장소로 다시 해 본다.',
    build(el, A) {
      const T = U.title(el, null, '저장소에서 먼저 읽을 문서', { y: 96 });
      A(T.t, 'chars', 0, { each: 0.035 });
      const w = U.win(el, { x: 120, y: 270, w: 720, h: 660, title: 'owner/project' });
      A(w.el, 'right', 0.2, { d: 120 });
      const files = ['.github/', 'docs/', 'src/', 'tests/', 'CODE_OF_CONDUCT.md', 'CONTRIBUTING.md', 'LICENSE', 'README.md'];
      const hiRow = { 'README.md': 'var(--green)', 'CONTRIBUTING.md': 'var(--blue)', 'LICENSE': 'var(--violet)', 'CODE_OF_CONDUCT.md': 'var(--violet)' };
      const hiBg = { 'README.md': 'rgba(18,176,122,.16)', 'CONTRIBUTING.md': 'rgba(47,107,255,.14)', 'LICENSE': 'rgba(124,92,255,.15)', 'CODE_OF_CONDUCT.md': 'rgba(124,92,255,.15)' };
      const rowY = k => 22 + k * 70;
      const his = {};
      files.forEach((f, k) => {
        if (hiRow[f]) {
          const hb = U.box(w.body, 14, rowY(k), 692, 62); css(hb, { background: hiBg[f], borderRadius: '12px' });
          his[f] = hb;
        }
      });
      const tr = U.tree(w.body, files, { x: 14, y: 22, w: 692, size: 30, rowH: 70 });
      tr.rows.forEach((r, k) => { A(r, 'up', 0.4 + k * 0.05, { d: 16 }); if (hiRow[r.name]) css(r.lastChild, { fontWeight: 700, color: hiRow[r.name] }); });
      // 설명 카드
      const notes = [
        { name: 'README', desc: '목적과 실행 방법', col: 'var(--green)', rows: ['README.md'], y: 290 },
        { name: 'CONTRIBUTING', desc: '기여 절차', col: 'var(--blue)', rows: ['CONTRIBUTING.md'], y: 500 },
        { name: 'LICENSE · 행동 규범', desc: '조건과 기준', col: 'var(--violet)', rows: ['LICENSE', 'CODE_OF_CONDUCT.md'], y: 710 },
      ];
      const order = ['README.md', 'CONTRIBUTING.md', 'LICENSE', 'CODE_OF_CONDUCT.md'];
      notes.forEach((n, k) => {
        const t0 = 1.0 + k * 0.45;
        n.rows.forEach(r => A(his[r], 'wipe', t0, { dur: 0.45 }));
        const cd = U.card(el, { x: 1060, y: n.y, w: 740, h: 170, pad: 0 });
        css(cd, { borderLeft: `12px solid ${n.col}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '40px' });
        const nm = h('div', 'mono', cd, n.name); css(nm, { fontSize: '34px', fontWeight: 700, color: n.col });
        const ds = h('div', '', cd, n.desc); css(ds, { fontSize: '44px', fontWeight: 780, letterSpacing: '-.025em', marginTop: '6px' });
        A(cd, 'left', t0 + 0.2, { d: 80 });
        n.rows.forEach(r => {
          const ry = 270 + 56 + rowY(files.indexOf(r)) + 31;
          const ln = U.arrow(el, [[850, ry], [1048, n.y + 85]], { curve: 'h', color: n.col, sw: 4, head: false });
          A(ln.path, 'draw', t0 + 0.1, { dur: 0.45 });
          const dt = s('circle', { cx: 850, cy: ry, r: 8, fill: n.col }, ln.svg);
          A(dt, 'fade', t0 + 0.1);
        });
      });
    },
  });

  /* 6. Git과 GitHub의 역할 (p.9) */
  slide({
    id: 'p1a-git-github', part: 'p1', chap: CH, title: 'Git과 GitHub의 역할', theme: 'white',
    notes: 'Git 은 내 컴퓨터에서 변경 이력을 관리하는 도구, GitHub 는 저장소를 올려 두고 Issue·PR 로 협업하는 서비스. 둘을 같은 것으로 생각하는 학생이 많다.',
    build(el, A) {
      const T = U.title(el, null, 'Git과 GitHub의 역할', { y: 96 });
      A(T.t, 'chars', 0, { each: 0.04 });
      const panel = (x, col, tint) => { const p = U.box(el, x, 260, 760, 620); css(p, { background: tint, borderRadius: '36px' }); return p; };
      const LP = panel(120, 'var(--green)', '#E9F6F0'), RP = panel(1040, 'var(--blue)', '#E8EEFF');
      A(LP, 'grow', 0.2, { dur: 0.6, axis: 'y', origin: '50% 100%' });
      A(RP, 'grow', 0.35, { dur: 0.6, axis: 'y', origin: '50% 100%' });
      const g1 = U.text(LP, '', 'Git', 56, 40); css(g1, { fontSize: '120px', fontWeight: 900, letterSpacing: '-.04em', color: 'var(--green-d)', lineHeight: 1 });
      const g1d = U.text(LP, 'b1', '변경 이력을 관리합니다', 60, 180); css(g1d, { fontWeight: 700 });
      const g2 = U.text(RP, '', 'GitHub', 56, 40); css(g2, { fontSize: '120px', fontWeight: 900, letterSpacing: '-.04em', color: 'var(--blue-d)', lineHeight: 1 });
      const g2d = U.text(RP, 'b1', '저장소와 협업 도구를<br>제공합니다', 60, 180); css(g2d, { fontWeight: 700 });
      A(g1, 'chars', 0.45, { each: 0.06 }); A(g1d, 'up', 0.6);
      A(g2, 'chars', 0.6, { each: 0.05 }); A(g2d, 'up', 0.75);
      // 왼쪽: 로컬 커밋 기록
      const lw = U.win(LP, { x: 56, y: 262, w: 648, h: 236, dark: true, title: 'git log' });
      const commits = [['a1f3c2e', 'README 설치 명령 수정'], ['9c2e7b1', '테스트 추가'], ['4b7d0aa', '첫 Commit']];
      commits.forEach((c, k) => {
        const r = U.box(lw.body, 30, 14 + k * 54, 600, 50); css(r, { display: 'flex', alignItems: 'center', gap: '18px', fontSize: '26px', color: '#E6EAF5' });
        const d = h('i', '', r); css(d, { width: '20px', height: '20px', borderRadius: '50%', background: 'var(--mint)', display: 'block', flex: 'none' });
        const hs = h('span', 'mono', r, c[0]); css(hs, { color: '#F5C26B', fontSize: '24px' });
        h('span', '', r, c[1]);
        A(r, 'left', 0.95 + k * 0.12, { d: 40 });
      });
      // 오른쪽: 협업 도구 탭
      const tabs = [['code', 'Code'], ['issue', 'Issues'], ['pr', 'Pull requests'], ['play', 'Actions']];
      tabs.forEach(([ic, tx], k) => {
        const c = U.chip(RP, tx, { size: 'lg', bg: '#fff', fg: 'var(--ink)', icon: ic, x: 56 + (k % 2) * 330, y: 330 + Math.floor(k / 2) * 100 });
        A(c, 'pop', 1.35 + k * 0.1);
      });
      // 로컬·원격 라벨
      const ll = U.chip(LP, '로컬 작업', { size: 'lg', bg: 'var(--green)', fg: '#fff', icon: 'laptop', x: 56, y: 600 - 80 + 0 });
      const rl = U.chip(RP, '원격 공유', { size: 'lg', bg: 'var(--blue)', fg: '#fff', icon: 'cloud', x: 56, y: 520 });
      css(ll, { top: '520px' });
      A(ll, 'up', 1.7); A(rl, 'up', 1.8);
      // 가운데 동기화
      const sync = U.badge(el, 'refresh', { size: 110, bg: 'var(--ink)', x: 905, y: 515 });
      A(sync, 'pop', 1.2);
      this.sync = sync;
      const bt = U.text(el, 'b1', '로컬 작업과 원격 공유를 구분합니다', 120, 905, 1680); css(bt, { textAlign: 'center', fontWeight: 780, fontSize: '40px' });
      A(bt, 'up', 2.0, { d: 24 });
    },
    render(t) { css(this.sync.firstChild, { transform: `rotate(${t * 40}deg)` }); },
  });

  /* 7. Repository의 구성 (p.10) */
  slide({
    id: 'p1a-repo', part: 'p1', chap: CH, title: 'Repository의 구성', theme: 'paper',
    notes: '저장소 화면 하나에 파일(Code), 변경 이력(Commits), 협업 기록(Issues·PR)이 모두 있다. 강조 표시가 차례로 옮겨 가며 세 영역을 보여 준다.',
    build(el, A) {
      const T = U.title(el, null, 'Repository의<br>구성', { y: 110, w: 680 });
      A(T.t, 'chars', 0, { each: 0.04 });
      const cols = ['var(--green)', 'var(--blue)', 'var(--violet)'];
      const it = U.items(el, [
        { text: '파일과 폴더를<br>보관합니다', color: cols[0] },
        { text: 'Commit으로<br>변경 이력을 남깁니다', color: cols[1] },
        { text: 'Issue와 PR로<br>협업을 기록합니다', color: cols[2] },
      ], { kind: 'num', x: 120, y: 420, w: 680, isz: 84, gap: 44, cls: 'b1' });
      A(it.rows, 'up', 0.3, { each: 0.12 });
      this.rows = it.rows;
      const w = U.win(el, { x: 820, y: 130, w: 980, h: 820, title: 'github.com/owner/project' });
      A(w.el, 'zoom', 0.2, { from: 0.94 });
      const nm = U.text(w.body, 'mono', 'owner / <b>project</b>', 40, 30); css(nm, { fontSize: '32px' });
      const pb = U.chip(w.body, 'Public', { bg: 'var(--green-l)', fg: 'var(--green-d)', x: 420, y: 26 });
      // 탭
      const tabs = [['code', 'Code', 0], ['issue', 'Issues 3', 2], ['pr', 'Pull requests 1', 2], ['play', 'Actions', -1]];
      const tabRow = U.box(w.body, 40, 100, 900, 64); css(tabRow, { display: 'flex', gap: '36px', borderBottom: '2px solid rgba(15,27,61,.08)' });
      tabs.forEach(([ic, tx], k) => {
        const tb = h('span', '', tabRow); css(tb, { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '26px', fontWeight: 650, color: 'var(--ink2)', paddingBottom: '16px', borderBottom: k === 0 ? '4px solid var(--amber)' : '4px solid transparent' });
        tb.appendChild(U.icon(ic, 28)); h('span', '', tb, tx);
      });
      A(tabRow, 'fade', 0.6);
      // 영역 1: 파일 목록
      const files = U.tree(w.body, ['src/', 'tests/', 'docs/', 'README.md', 'LICENSE', 'CONTRIBUTING.md'], { x: 40, y: 200, w: 520, size: 28, rowH: 62 });
      files.rows.forEach((r, k) => A(r, 'up', 0.7 + k * 0.05, { d: 16 }));
      // 영역 2: 최근 Commit
      const cm = U.box(w.body, 600, 200, 340, 380); css(cm, { background: '#F7F5F1', borderRadius: '18px', padding: '24px' });
      const ch = h('div', '', cm, '<span style="display:flex;align-items:center;gap:10px"></span>'); ch.firstChild.appendChild(U.icon('commit', 30, 'var(--blue)')); h('span', '', ch.firstChild, 'Commits'); css(ch, { fontSize: '26px', fontWeight: 800, marginBottom: '14px' });
      ['a1f3c2e', '9c2e7b1', '4b7d0aa', '1e08f9c'].forEach((hs, k) => {
        const r = h('div', 'row', cm); css(r, { gap: '14px', height: '64px', borderTop: '1.5px solid rgba(15,27,61,.08)' });
        const d = h('i', '', r); css(d, { width: '16px', height: '16px', borderRadius: '50%', background: 'var(--blue)', display: 'block' });
        const t = h('span', 'mono', r, hs); css(t, { fontSize: '25px', color: 'var(--ink2)' });
        A(r, 'left', 0.9 + k * 0.06, { d: 30 });
      });
      // 영역 3: Issue·PR 미리보기
      const ip = U.box(w.body, 40, 600, 900, 140); css(ip, { display: 'flex', gap: '20px' });
      [['issue', 'var(--green)', '#12 설치 명령이 실행되지 않음'], ['pr', 'var(--violet)', '#13 docs: fix setup']].forEach(([ic, col, tx], k) => {
        const c = h('div', '', ip); css(c, { flex: 1, background: '#fff', borderRadius: '16px', boxShadow: 'inset 0 0 0 1.5px rgba(15,27,61,.1)', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 24px', fontSize: '25px', fontWeight: 650 });
        c.appendChild(U.icon(ic, 34, col, 2.4)); h('span', '', c, tx);
        A(c, 'up', 1.1 + k * 0.1, { d: 24 });
      });
      // 강조 테두리 + 번호
      const regions = [[24, 186, 548, 392], [588, 186, 366, 392], [24, 594, 930, 160]];
      this.hl = regions.map((r, k) => {
        const b = U.box(w.body, r[0], r[1], r[2], r[3]); css(b, { borderRadius: '22px', boxShadow: `0 0 0 4px ${cols[k]}`, pointerEvents: 'none' });
        // 3번은 위 두 영역과 붙어 있고 창 아래 끝에 닿아 번호를 영역 안 오른쪽에 둔다
        const n = U.num(w.body, k + 1, { size: 52, bg: cols[k], x: k === 2 ? r[0] + r[2] - 72 : r[0] + r[2] - 34, y: k === 2 ? r[1] + r[3] / 2 - 26 : r[1] - 18 });
        return [b, n];
      });
    },
    render(t, S) {
      const live = t > 2.2 && !S.final;
      const k = live ? Math.floor((t - 2.2) / 2.6) % 3 : -1;
      const ph = live ? ((t - 2.2) % 2.6) / 2.6 : 1;
      const enter = clamp((t - 1.6) / 0.6);
      this.hl.forEach(([b, n], i) => {
        const on = S.final ? 1 : (k === i ? clamp(Math.min(ph * 6, (1 - ph) * 6)) : (t < 2.2 ? enter : 0));
        css(b, { opacity: S.final ? 0.9 : on });
        css(n, { opacity: S.final ? 1 : Math.max(on, enter * 0.0 + (t < 2.2 ? enter : 0)), transform: `scale(${0.8 + 0.2 * (S.final ? 1 : on)})` });
      });
      if (live || S.final) this.rows.forEach((r, i) => css(r, { opacity: S.final || k === i ? 1 : 0.35 }));
    },
  });

  /* 8. 오픈소스 운영 전체 사이클 (p.11) — 8단계 순환 */
  slide({
    id: 'p1a-cycle', part: 'p1', chap: CH, title: '오픈소스 운영 전체 사이클', theme: 'white', steps: 2,
    notes: '오늘 강의 전체가 이 순환을 따라간다. 클릭 1: 프로젝트 준비와 지속 관리(보안 취약점은 공개 Issue 가 아니라 비공개로 신고). 클릭 2: AI Agent 가 돕는 부분과 사람이 확인·승인하는 부분. 출처: GitHub Docs · Open Source Guides.',
    build(el, A) {
      const T = U.title(el, null, '오픈소스 운영 전체 사이클', { y: 60, cls: 'h2' });
      A(T.t, 'chars', 0, { each: 0.03 });
      const ST = [
        ['issue', 'Issue 등록', '버그·개선 요청을 기록<br>재현 방법·완료 조건 명시', '#12B07A'],
        ['search', '검토·계획', '중복·우선순위·담당 확인<br>진행·보류·종료 결정', '#2F6BFF'],
        ['code', '구현·테스트', 'Branch 생성·필요하면 Fork<br>코드·테스트·문서 수정', '#2F6BFF'],
        ['pr', 'PR 제출', 'Issue 연결·변경 내용 설명<br>검증 결과·리뷰 요청', '#7C5CFF'],
        ['eye', '리뷰·CI', '코드 리뷰·자동 검사<br>수정·재검토 반복', '#EF4B4B'],
        ['merge', '병합', '승인·필수 검사 통과 확인<br>Merge·관련 Issue 정리', '#7C5CFF'],
        ['package', '릴리스', '배포할 변경을 묶어 공개<br>버전·변경 기록 제공', '#E8950C'],
        ['users', '운영·피드백', '사용자 지원·버그 대응<br>개선 요청을 다시 수집', '#12B07A'],
      ];
      const CW = 360, CHh = 206, X = [150, 580, 1010, 1440], Y = [282, 552];
      const pos = k => k < 4 ? [X[k], Y[0]] : [X[7 - k], Y[1]];
      // 순환 경로(카드 뒤)
      const cy1 = Y[0] + CHh / 2, cy2 = Y[1] + CHh / 2;
      const xl = X[0] + CW / 2, xr = X[3] + CW / 2;
      const d = `M ${xl} ${cy1} L ${xr} ${cy1} C ${xr + 300} ${cy1}, ${xr + 300} ${cy2}, ${xr} ${cy2} L ${xl} ${cy2} C ${xl - 300} ${cy2}, ${xl - 300} ${cy1}, ${xl} ${cy1}`;
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible' }, el);
      const path = s('path', { d, fill: 'none', stroke: '#C9D3E8', 'stroke-width': 8, 'stroke-linecap': 'round', pathLength: 1 }, svg);
      A(path, 'draw', 0.25, { dur: 1.4, ease: ease.inOutCubic });
      this.path = path; this.svg = svg;
      this.dot = s('circle', { r: 16, fill: 'var(--ink)', stroke: '#fff', 'stroke-width': 5 }, svg);
      // 방향 화살촉(카드 사이)
      [[X[0] + CW + 35, cy1, 0], [X[1] + CW + 35, cy1, 0], [X[2] + CW + 35, cy1, 0], [X[3] - 35, cy2, 180], [X[2] - 35, cy2, 180], [X[1] - 35, cy2, 180]].forEach(([x, y, r], k) => {
        const g = s('path', { d: 'M -12 -16 L 10 0 L -12 16', fill: 'none', stroke: '#9DAACB', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: `translate(${x} ${y}) rotate(${r})` }, svg);
        A(g, 'fade', 1.0 + k * 0.08);
      });
      const loopLab = U.chip(el, '새 Issue로 반영', { bg: 'var(--ink)', fg: '#fff', x: 22, y: (cy1 + cy2) / 2 - 22 });
      css(loopLab, { fontSize: '24px' });
      A(loopLab, 'pop', 1.6);
      this.cards = ST.map((st, k) => {
        const [x, y] = pos(k);
        const c = U.card(el, { x, y, w: CW, h: CHh, pad: 26 });
        css(c, { borderTop: `8px solid ${st[3]}` });
        const hd = h('div', 'row', c); css(hd, { gap: '14px' });
        const n = h('span', 'numf', hd, String(k + 1).padStart(2, '0')); css(n, { fontSize: '34px', color: st[3] });
        hd.appendChild(U.icon(st[0], 36, st[3], 2.4));
        const tt = h('span', '', hd, st[1]); css(tt, { fontSize: '34px', fontWeight: 850, letterSpacing: '-.03em' });
        const ds = h('div', '', c, st[2]); css(ds, { fontSize: '24px', fontWeight: 560, lineHeight: 1.45, color: 'var(--ink2)', marginTop: '12px' });
        A(c, 'pop', 0.35 + k * 0.13, { from: 0.7 });
        return c;
      });
      // 단계 1: 프로젝트 준비 + 지속 관리
      const prep = U.box(el, 150, 172, 1650, 76);
      css(prep, { background: '#EEF3FF', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '30px', padding: '0 34px', fontSize: '28px', fontWeight: 650 });
      prep.innerHTML = '<b style="font-size:30px;font-weight:850;color:var(--blue-d)">프로젝트 준비</b><span>목적·라이선스</span><span style="opacity:.35">|</span><span>README·기여 지침</span><span style="opacity:.35">|</span><span>역할·승인 규칙</span>';
      A(prep, 'wipe', 0, { step: 1, dur: 0.5 });
      const keep = U.box(el, 150, 790, 1650, 66);
      css(keep, { background: '#F1F2F6', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '24px', padding: '0 34px', fontSize: '26px', fontWeight: 600 });
      keep.innerHTML = '<b style="font-weight:850">지속 관리</b><span>문서·의존성 업데이트, 신규 기여자 지원</span><span style="opacity:.35">|</span>';
      const sec = h('span', 'row', keep); css(sec, { gap: '10px', color: 'var(--red)', fontWeight: 800 });
      sec.appendChild(U.icon('lock', 30, 'var(--red)', 2.4)); h('span', '', sec, '보안 취약점은 비공개 신고');
      A(keep, 'wipe', 0.25, { step: 1, dur: 0.5 });
      // 단계 2: AI Agent 지원 / 사람의 확인·승인
      const ai = U.box(el, 150, 872, 812, 82);
      css(ai, { background: 'var(--violet-l)', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '18px', padding: '0 28px', fontSize: '25px', fontWeight: 600 });
      ai.appendChild(U.icon('bot', 40, 'var(--violet)', 2.2));
      ai.insertAdjacentHTML('beforeend', '<span><b style="font-weight:850;color:#5B3FD6">AI Agent 지원</b>  Issue 요약·코드·테스트 초안·PR 설명</span>');
      const hu = U.box(el, 988, 872, 812, 82);
      css(hu, { background: 'var(--amber-l)', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '18px', padding: '0 28px', fontSize: '25px', fontWeight: 600 });
      hu.appendChild(U.icon('user', 40, '#B86E00', 2.2));
      hu.insertAdjacentHTML('beforeend', '<span><b style="font-weight:850;color:#8A5200">사람의 확인·승인</b>  작업 범위 결정·결과 검증·병합 승인</span>');
      A(ai, 'up', 0, { step: 2, d: 30 }); A(hu, 'up', 0.15, { step: 2, d: 30 });
      const src = U.text(el, 'cap', '출처: GitHub Docs · Open Source Guides', 1200, 962); css(src, { fontSize: '24px', textAlign: 'right', width: '600px', color: 'var(--muted)', whiteSpace: 'nowrap' });
      A(src, 'fade', 0.3, { step: 2 });
    },
    render(t, S) {
      const L = this.path.getTotalLength ? this.path.getTotalLength() : 0;
      const tl = this.path; // pathLength=1 이라도 getPointAtLength 는 실제 길이를 쓴다
      const real = tl.getTotalLength();
      const u = S.final ? 0.02 : ((t - 1.7) * 0.055) % 1;
      const vis = S.final ? 1 : clamp((t - 1.7) / 0.3);
      const pt = tl.getPointAtLength(((u % 1) + 1) % 1 * real);
      this.dot.setAttribute('cx', pt.x); this.dot.setAttribute('cy', pt.y);
      css(this.dot, { opacity: vis });
      // 점에 가장 가까운 카드를 살짝 들어 올림
      let best = -1, bd = 1e9;
      this.cards.forEach((c, k) => {
        const x = parseFloat(c.style.left) + 180, y = parseFloat(c.style.top) + 103;
        const dd = Math.hypot(x - pt.x, y - pt.y); if (dd < bd) { bd = dd; best = k; }
      });
      this.cards.forEach((c, k) => {
        const on = !S.final && t > 2.2 && k === best && bd < 260 ? 1 : 0;
        c.style.boxShadow = on ? '0 0 0 4px var(--ink), 0 30px 50px -24px rgba(15,27,61,.45)' : '';
        c.style.translate = on ? '0 -8px' : '0 0';
      });
    },
  });
})();
