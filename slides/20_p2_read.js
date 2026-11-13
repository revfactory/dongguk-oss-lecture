/* PART 2 · 기존 프로젝트의 이슈 읽기 — 원본 p.58~65 + 표지 + 쉬는 시간
 * 아트 디렉션: 파랑 계열, Mono + Pretendard, 찾고 좁혀 가는 움직임. */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, count } = DECK;
  const U = UI;
  const CH = '2 기존 프로젝트 읽기', K = 'PART 2 · 기존 프로젝트의 이슈 읽기';
  const BLUE = '#2F6BFF', GREEN = '#12B07A', RED = '#EF4B4B', AMBER = '#F5A524';

  const st = document.createElement('style');
  st.textContent = `
  .p2-panel-h { display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 800; padding: 22px 26px 12px; }
  .p2-iss { display: flex; align-items: center; gap: 14px; padding: 14px 26px; border-top: 1.5px solid #ECEEF4; font-size: 26px; font-weight: 600; }
  .p2-q { position: absolute; background: #fff; border-radius: 26px; padding: 34px 32px; box-shadow: 0 24px 48px -26px rgba(15,27,61,.3), 0 0 0 1.5px rgba(15,27,61,.06); }
  .p2-rd .sec { position: absolute; left: 30px; right: 30px; border-radius: 14px; padding: 12px 18px; }
  .p2-rd .hd { font-weight: 800; font-size: 32px; letter-spacing: -.02em; }
  .p2-rd .bd { font-size: 26px; color: var(--ink2); font-weight: 550; margin-top: 6px; line-height: 1.45; }
  .p2-rd .cd { font-family: var(--mono); font-size: 25px; background: #F1F3F8; border-radius: 10px; padding: 8px 14px; margin-top: 8px; display: inline-block; }
  .p2-res { position: absolute; background: #fff; border-radius: 20px; padding: 22px 28px; box-shadow: 0 18px 36px -24px rgba(15,27,61,.35), 0 0 0 1.5px rgba(15,27,61,.06); }
  .p2-res .tt { font-size: 30px; font-weight: 750; letter-spacing: -.02em; display: flex; align-items: center; gap: 12px; }
  .p2-res .lb { display: flex; gap: 10px; margin-top: 14px; align-items: center; }
  .p2-ev { position: absolute; display: flex; align-items: center; gap: 22px; }
  .p2-ev .tx { font-size: 32px; font-weight: 650; letter-spacing: -.02em; }
  .p2-ev .tm { font-size: 24px; color: var(--muted); font-weight: 600; margin-left: 6px; }
  `;
  document.head.appendChild(st);

  const ttl = (el, A, html, o = {}) => {
    const T = U.title(el, K, html, Object.assign({ cls: 'h2' }, o));
    A(T.k, 'right', 0); A(T.t, 'chars', 0.06, { each: 0.022 });
    return T;
  };
  const svgLayer = el => s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none' }, el);
  const path = (svg, d, col, sw = 5) => s('path', { d, fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }, svg);

  /* Part 2 표지 */
  slide({
    id: 'p2-cover', part: 'p2', title: 'PART 2 · 기존 프로젝트의 이슈 읽기', theme: 'blue', noChrome: true,
    notes: '이제 직접 만든 저장소가 아니라 이미 운영 중인 프로젝트에 들어가는 방법입니다. 고르기 → 읽기 → 찾기 → 재현하기 순서로 갑니다.',
    build(el, A) {
      U.partCover(el, A, { n: '2', label: 'PART 2', title: '기존 프로젝트의<br>이슈 읽기', chapters: ['프로젝트 고르기', 'README와 폴더 구조', '이슈 검색', '실패 재현'], color: '#2F6BFF', img: 'img/part2_issues_cut.png', imgBox: { x: 125, y: 7, w: 1632, h: 919 } });
    },
  });

  /* p.58 기존 프로젝트에서 시작하기 — 저장소·이슈·변경 세 패널 */
  slide({
    id: 'p2-start', part: 'p2', chap: CH, title: '기존 프로젝트에서 시작하기', theme: 'white',
    notes: '처음부터 새 프로젝트를 만들기보다, 이미 쓰고 있는 도구의 저장소에서 시작하면 문제를 이해하기 쉽습니다. 저장소 구조 → 이슈 → 작은 변경 순서로 봅니다.',
    build(el, A) {
      ttl(el, A, '기존 프로젝트에서 시작하기');
      const P = [
        ['folder', 'Repository', '내가 사용하는 도구를 고릅니다'],
        ['issue', 'Issues', '문제와 기존 논의를 읽습니다'],
        ['code', 'Changes', '작은 변경부터 기여합니다'],
      ];
      P.forEach((p, i) => {
        const x = 120 + i * 572;
        const W = U.win(el, { x, y: 280, w: 536, h: 470, nobar: true });
        A(W.el, 'flipY', 0.25 + i * 0.15, { deg: 50 });
        const hd = h('div', 'p2-panel-h', W.body); hd.appendChild(U.icon(p[0], 38, BLUE, 2.2)); h('span', '', hd, p[1]);
        if (i === 0) {
          const T = U.tree(W.body, ['src/', '  components/', '  utils/', 'tests/', 'README.md', 'CONTRIBUTING.md', 'LICENSE'], { size: 27, rowH: 50, hi: { 'README.md': BLUE } });
          css(T.el, { padding: '4px 18px' });
          T.rows.forEach((r, j) => A(r, 'right', 0.6 + j * 0.05, { d: 30 }));
        } else if (i === 1) {
          [['bug', '설치 문서의 명령이 다릅니다', 'bug'], ['good first issue', '빈 입력에서 오류가 납니다', 'issue'], ['documentation', '예제 코드를 보완합니다', 'issue']].forEach((it, j) => {
            const r = h('div', 'p2-iss', W.body); css(r, { flexDirection: 'column', alignItems: 'flex-start', gap: '10px' });
            const t1 = h('div', '', r); css(t1, { display: 'flex', alignItems: 'center', gap: '12px' });
            t1.appendChild(U.icon('issue', 32, GREEN, 2.4)); h('span', '', t1, it[1]);
            U.chip(r, it[0]).style.fontSize = '24px';
            A(r, 'up', 0.75 + j * 0.1, { d: 24 });
          });
        } else {
          const D = U.diff(W.body, [['@', '@@ README.md @@'], [' ', '## 설치'], ['-', 'pip install mypkg'], ['+', 'pip install my-pkg']], { size: 26, rowH: 56 });
          css(D.el, { marginTop: '18px' });
          D.rows.forEach((r, j) => A(r, 'wipe', 0.9 + j * 0.1, { dur: 0.35 }));
        }
        const cap = U.box(el, x, 790, 536);
        css(cap, { display: 'flex', alignItems: 'center', gap: '20px' });
        cap.appendChild(U.num(null, i + 1, { size: 64, bg: BLUE }));
        const t = h('div', 'b1', cap, p[2]); css(t, { fontSize: '36px', fontWeight: 700, lineHeight: 1.3 });
        A(cap, 'up', 1.1 + i * 0.12);
      });
      const ex = U.text(el, 'cap', '화면의 저장소·이슈는 예시', 1520, 910, 280); css(ex, { textAlign: 'right' }); A(ex, 'fade', 1.6);
    },
  });

  /* p.59 프로젝트 선택 기준 — 질문 카드 4개, 체크가 차례로 찍힌다 */
  slide({
    id: 'p2-choose', part: 'p2', chap: CH, title: '프로젝트 선택 기준', theme: 'paper',
    notes: '네 질문에 모두 "예"라고 답할 수 있는 프로젝트가 첫 기여에 알맞습니다. 특히 최근 기여에 메인테이너가 답하고 있는지, AI 사용에 대한 정책이 있는지 확인합니다.',
    build(el, A) {
      ttl(el, A, '프로젝트 선택 기준');
      const sub = U.text(el, 'b2', '네 가지에 모두 "예"라고 답할 수 있나요?', 120, 250, 1200); A(sub, 'fade', 0.4);
      const Q = [
        ['gamepad', '관심 분야와 언어가<br>맞나요?', ['Python', 'JavaScript', 'TypeScript']],
        ['gear', '실행 환경을<br>설치할 수 있나요?', ['Docker', 'Python', 'Node.js']],
        ['chat', '최근 기여에<br>답변이 있나요?', ['최근 댓글', '리뷰 응답']],
        ['doc', '기여 규칙과 AI 정책을<br>확인했나요?', ['CONTRIBUTING.md', 'AI 정책']],
      ];
      Q.forEach((q, i) => {
        const x = 120 + i * 428;
        const c = h('div', 'p2-q', el); U.place(c, x, 340, 400, 560);
        c.appendChild(U.badge(null, q[0], { size: 96, bg: BLUE, square: true }));
        const t = h('div', '', c, q[1]); css(t, { marginTop: '30px', fontSize: '38px', fontWeight: 780, lineHeight: 1.32, letterSpacing: '-.03em' });
        const ch = h('div', '', c); css(ch, { position: 'absolute', left: '32px', right: '32px', bottom: '120px', display: 'flex', flexWrap: 'wrap', gap: '10px' });
        q[2].forEach(x2 => { const cp = U.chip(ch, x2, { bg: '#EEF3FF', fg: '#1E4FD0' }); css(cp, { fontSize: '24px', height: '42px', fontFamily: x2.endsWith('.md') ? 'var(--mono)' : 'var(--sans)' }); });
        const box = h('div', '', c); css(box, { position: 'absolute', left: '32px', bottom: '32px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '30px', fontWeight: 800, color: GREEN });
        const sl = h('span', '', box); css(sl, { position: 'relative', width: '56px', height: '56px' });
        const ring = U.status(sl, 'wait', 56); U.place(ring, 0, 0);
        const ok = U.status(sl, 'ok', 56); U.place(ok, 0, 0);
        const yes = h('span', '', box, '예');
        A(c, 'up', 0.35 + i * 0.12, { d: 70 });
        A(ok, 'stamp', 1.2 + i * 0.25, { dur: 0.4 }); A(yes, 'fade', 1.3 + i * 0.25);
      });
    },
  });

  /* p.60 README에서 실행 방법 찾기 — 형광펜이 README 를 훑는다 */
  slide({
    id: 'p2-readme', part: 'p2', chap: CH, title: 'README에서 실행 방법 찾기', theme: 'white',
    notes: 'README 에서 찾을 것은 네 가지입니다. 무엇을 하는 프로젝트인지, 설치·실행 명령, 필요한 버전과 설정, 기여 문서 링크. 화면의 README 는 예시입니다.',
    build(el, A) {
      ttl(el, A, 'README에서 실행 방법 찾기');
      const W = U.win(el, { x: 120, y: 270, w: 860, h: 680, title: 'README.md' });
      A(W.el, 'up', 0.2);
      const rd = h('div', 'p2-rd', W.body); css(rd, { position: 'absolute', inset: '0' });
      const secs = [
        [20, '# my-project', '문서 제목의 첫 글자를 정리하는 Python 도구', null],
        [158, '## 설치와 실행', null, '$ pip install -r requirements.txt<br>$ python main.py'],
        [330, '## 요구 사항', 'Python 3.10 이상 · 설정 파일 <span class="mono">config.toml</span>', null],
        [468, '## 기여하기', '<span style="color:#1E4FD0;text-decoration:underline">CONTRIBUTING.md</span> 를 먼저 읽어 주세요', null],
      ];
      this.sec = secs.map((sc, i) => {
        const b = h('div', 'sec', rd); css(b, { top: sc[0] + 'px' });
        h('div', 'hd', b, sc[1]);
        if (sc[2]) h('div', 'bd', b, sc[2]);
        if (sc[3]) h('div', 'cd', b, sc[3]);
        A(b, 'up', 0.4 + i * 0.08, { d: 20 });
        return b;
      });
      const R = [
        ['search', '무엇을 하는<br>프로젝트인가요?'],
        ['play', '설치와 실행 명령을<br>찾습니다'],
        ['gear', '필요한 버전과 설정을<br>확인합니다'],
        ['link', '기여 문서로 이어지는<br>링크를 읽습니다'],
      ];
      this.R = R.map((r, i) => {
        const y = 280 + i * 172;
        const row = U.box(el, 1060, y, 740, 150);
        css(row, { display: 'flex', alignItems: 'center', gap: '28px', borderRadius: '22px', padding: '0 26px' });
        const b = U.badge(row, r[0], { size: 88, bg: BLUE, square: true });
        const t = h('div', 'b1', row, r[1]); css(t, { fontSize: '36px', fontWeight: 720, lineHeight: 1.3 });
        A(row, 'left', 0.5 + i * 0.1, { d: 60 });
        return row;
      });
    },
    render(t) {
      this.sec.forEach((b, i) => {
        const on = prog(t, 1.1 + i * 0.45, 0.3);
        css(b, { background: `rgba(47,107,255,${0.11 * on})`, boxShadow: on > 0 ? `inset 5px 0 0 rgba(47,107,255,${on})` : 'none' });
        css(this.R[i], { background: `rgba(47,107,255,${0.08 * on})` });
      });
    },
  });

  /* p.61 폴더와 테스트 구조 읽기 — src 와 tests 의 짝 */
  slide({
    id: 'p2-structure', part: 'p2', chap: CH, title: '폴더와 테스트 구조 읽기', theme: 'paper',
    notes: '소스 파일과 같은 이름의 테스트 파일이 짝을 이루는 경우가 많습니다. 바꿀 기능의 기존 테스트를 먼저 읽고, 검사 명령은 설정 파일(package.json, jest.config.js)에서 찾습니다.',
    build(el, A) {
      ttl(el, A, '폴더와 <span class="hb">테스트 구조</span> 읽기');
      const W = U.win(el, { x: 120, y: 270, w: 520, h: 640, nobar: true });
      A(W.el, 'up', 0.2);
      const T = U.tree(W.body, ['my-project/', '  src/', '    components/', '    utils/', '    pages/', '  tests/', '    unit/', '    e2e/', '  package.json', '  jest.config.js'], { size: 29, rowH: 58, hi: { 'src/': GREEN, 'tests/': BLUE, 'jest.config.js': AMBER } });
      css(T.el, { padding: '20px 18px' });
      T.rows.forEach((r, j) => A(r, 'right', 0.35 + j * 0.05, { d: 30 }));
      const card = (y, col, dir, file) => {
        const c = U.card(el, { x: 760, y, w: 540, h: 160, pad: 30 });
        css(c, { boxShadow: `inset 0 0 0 3px ${col}, 0 24px 48px -24px rgba(15,27,61,.28)` });
        const d = h('div', 'mono', c, dir); css(d, { fontSize: '26px', fontWeight: 700, color: col });
        const f = h('div', 'mono', c, file); css(f, { fontSize: '32px', fontWeight: 700, marginTop: '8px' });
        return c;
      };
      const c1 = card(300, GREEN, 'src/', 'userService.ts'), c2 = card(560, BLUE, 'tests/', 'userService.test.ts');
      A(c1, 'left', 0.9, { d: 60 }); A(c2, 'left', 1.15, { d: 60 });
      const sv = svgLayer(el);
      // 트리 행 위치: 위 여백 20 + 58*행
      const yr = i => 270 + 20 + 58 * i + 29;
      const a1 = path(sv, `M600 ${yr(1)} C 690 ${yr(1)}, 690 380, 758 380`, GREEN, 5);
      const a2 = path(sv, `M600 ${yr(5)} C 690 ${yr(5)}, 690 640, 758 640`, BLUE, 5);
      A(a1, 'draw', 0.8, { dur: 0.35 }); A(a2, 'draw', 1.05, { dur: 0.35 });
      // 짝 표시
      const pair = path(sv, 'M1300 380 C 1360 380, 1360 640, 1300 640', '#0F1B3D', 4);
      pair.setAttribute('stroke-dasharray', '0.02 0.02');
      A(pair, 'fade', 1.45, { dur: 0.3 });
      const pl = U.chip(el, '같은 이름의 짝', { bg: 'var(--ink)', fg: '#fff' }); U.place(pl, 1250, 486); css(pl, { fontSize: '24px' });
      A(pl, 'pop', 1.55);
      const a3 = path(sv, `M600 ${yr(9)} C 690 ${yr(9)}, 700 840, 758 840`, AMBER, 5);
      A(a3, 'draw', 1.3, { dur: 0.35 });
      const cfg = U.card(el, { x: 760, y: 790, w: 540, h: 100, pad: 26 });
      css(cfg, { boxShadow: `inset 0 0 0 3px ${AMBER}, 0 24px 48px -24px rgba(15,27,61,.28)`, display: 'flex', alignItems: 'center' });
      const cf = h('div', 'mono', cfg, '"test": "jest"'); css(cf, { fontSize: '30px', fontWeight: 700 });
      A(cfg, 'left', 1.45, { d: 60 });
      const L = U.items(el, [
        { text: '소스와 테스트의<br>위치를 찾습니다' },
        { text: '관련 기능의<br>기존 검사를 읽습니다' },
        { text: '설정 파일에서<br>검사 명령을 확인합니다' },
        { text: '전체 구조를<br>바꾸지 않습니다' },
      ], { x: 1440, y: 290, w: 380, isz: 56, gap: 40, kind: 'check' });
      L.rows.forEach((r, i) => { css(r, { gap: '20px' }); css(r.lastChild, { fontSize: '32px', fontWeight: 680, lineHeight: 1.3 }); A(r, 'up', 1.6 + i * 0.1); });
    },
  });

  /* p.62 실제 이슈 목록 탐색 — 검색 조건이 붙을수록 결과가 줄어든다 */
  slide({
    id: 'p2-search', part: 'p2', chap: CH, title: '실제 이슈 목록 탐색', theme: 'white', steps: 2,
    notes: '클릭할 때마다 검색 조건을 하나씩 더합니다. 열린 이슈 → good first issue 라벨 → 담당자 없음. 결과 수와 이슈는 설명을 위한 예시입니다. 라벨은 후보를 찾는 표시일 뿐, 실제로 작업 가능한지는 이슈를 열어 확인합니다.',
    build(el, A) {
      ttl(el, A, '실제 <span class="hb">이슈 목록</span> 탐색');
      const box = U.box(el, 120, 262, 1680, 112);
      css(box, { background: '#fff', borderRadius: '24px', boxShadow: `inset 0 0 0 3px ${BLUE}, 0 24px 48px -26px rgba(47,107,255,.45)`, display: 'flex', alignItems: 'center', gap: '22px', padding: '0 34px' });
      box.appendChild(U.icon('search', 48, BLUE, 2.6));
      const q = h('div', 'mono', box); css(q, { fontSize: '34px', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', gap: '20px' });
      this.tok = ['is:issue is:open', 'label:"good first issue"', 'no:assignee'].map((tk, i) => { const sp = h('span', '', q, tk); css(sp, { color: ['#0F1B3D', '#0B7A54', '#1E4FD0'][i], background: ['#EEF1F8', '#D5F2E6', '#DCE6FF'][i], padding: '6px 14px', borderRadius: '10px' }); return sp; });
      A(this.tok[0], 'type', 0.45, { cps: 40, caret: false });
      A(this.tok[1], 'type', 0.1, { step: 1, cps: 40, caret: false });
      A(this.tok[2], 'type', 0.1, { step: 2, cps: 40, caret: false });
      A(box, 'wipe', 0.2, { dur: 0.5 });
      const cnt = U.box(el, 1300, 140, 500); css(cnt, { display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '14px' });
      this.num = h('div', 'numf', cnt, '0'); css(this.num, { fontSize: '96px', lineHeight: 1, color: BLUE });
      const cl = h('div', '', cnt, '개 결과 <span style="font-size:24px;color:var(--muted)">(예시)</span>'); css(cl, { fontSize: '30px', fontWeight: 700 });
      A(cnt, 'up', 0.6);
      const issues = [
        ['다크 모드 대비 개선', ['enhancement'], 'A', 0],
        ['빈 입력에서 IndexError', ['bug', 'good first issue'], null, 2],
        ['CLI 도움말 번역 누락', ['documentation', 'good first issue'], 'M', 1],
        ['테스트 실행 시간 단축', ['enhancement'], 'K', 0],
        ['README 설치 명령 오타', ['documentation', 'good first issue'], null, 2],
        ['설정 파일 검증 추가', ['enhancement'], null, 0],
      ];
      this.cards = issues.map((it, i) => {
        const x = 120 + (i % 3) * 572, y = 400 + Math.floor(i / 3) * 236;
        const c = h('div', 'p2-res', el); U.place(c, x, y, 536, 212);
        const tt = h('div', 'tt', c); tt.appendChild(U.icon('issue', 34, GREEN, 2.4)); h('span', '', tt, it[0]);
        const lb = h('div', 'lb', c); css(lb, { flexWrap: 'nowrap' });
        it[1].forEach(l => { const cp = U.chip(lb, l); css(cp, { fontSize: '22px', height: '38px', padding: '0 14px' }); });
        const ft = h('div', '', c); css(ft, { position: 'absolute', left: '28px', bottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', color: 'var(--muted)', fontWeight: 600 });
        if (it[2]) { U.avatar(ft, it[2], '#9AA0B4', 36); h('span', '', ft, '담당자 있음'); } else h('span', '', ft, '담당자 없음');
        A(c, 'up', 0.7 + i * 0.06, { d: 30 });
        return { c, lvl: it[3] };
      });
      const foot = U.text(el, '', '라벨은 <span class="hb">후보를 찾는 표시</span>입니다', 120, 880, 1300); css(foot, { fontSize: '42px', fontWeight: 800, letterSpacing: '-.03em' });
      A(foot, 'up', 1.2);
    },
    render(t, S) {
      const p1 = prog(S.at(1), 0.6, 0.6), p2 = prog(S.at(2), 0.45, 0.6);
      const base = prog(t, 0.7, 1.0, ease.outQuart);
      const v = S.at(2) > 0 ? lerp(23, 9, p2) : S.at(1) > 0 ? lerp(1284, 23, p1) : 1284 * base;
      this.num.textContent = count(1, Math.round(v));
      this.cards.forEach(o => {
        const out = Math.max(o.lvl < 1 ? p1 : 0, o.lvl < 2 ? p2 : 0);
        css(o.c, { opacity: 1 - 0.82 * out, filter: out > 0 ? `grayscale(${out})` : 'none', scale: String(1 - 0.06 * out) });
        if (out === 0 && (o.lvl === 2 && p2 > 0 || o.lvl >= 1 && p1 > 0 && S.at(2) < 0)) css(o.c, { boxShadow: `inset 0 0 0 3px ${BLUE}, 0 18px 36px -24px rgba(15,27,61,.35)` });
        else css(o.c, { boxShadow: '' });
      });
    },
  });

  /* p.63 이슈의 마지막 상태 확인 — 이슈 타임라인을 끝까지 읽는다 */
  slide({
    id: 'p2-status', part: 'p2', chap: CH, title: '이슈의 마지막 상태 확인', theme: 'paper',
    notes: '이슈 제목만 보고 시작하지 않습니다. 타임라인 맨 아래까지 읽고, 담당자와 연결된 PR, 이미 닫혔거나 병합된 기록을 확인합니다. 작업을 시작하는 날 상태를 한 번 더 봅니다. 타임라인은 예시입니다.',
    build(el, A) {
      ttl(el, A, '이슈의 마지막 상태 확인');
      const W = U.win(el, { x: 120, y: 270, w: 900, h: 680, title: 'Issue #12 · 빈 입력에서 오류가 납니다' });
      A(W.el, 'up', 0.2);
      const sv = s('svg', { width: 900, height: 620, viewBox: '0 0 900 620', style: 'position:absolute;left:0;top:0;overflow:visible' }, W.body);
      const ln = s('path', { d: 'M74 50 L74 560', stroke: '#DADDE6', 'stroke-width': 4, fill: 'none', pathLength: 1 }, sv);
      A(ln, 'draw', 0.4, { dur: 1.2, ease: ease.inOutCubic });
      const ev = [
        ['chat', '#9AA0B4', '재현했습니다. 빈 문자열에서 실패합니다', '3주 전'],
        ['user', BLUE, '담당자 지정: contributor-a', '2주 전'],
        ['pr', '#7C5CFF', 'PR #57 연결', '5일 전'],
        ['merge', '#7C5CFF', 'PR #57 병합됨', '어제'],
        ['closed', GREEN, '이슈 닫힘', '어제'],
        ['refresh', AMBER, '오늘 다시 확인', '오늘'],
      ];
      this.spin = null;
      ev.forEach((e, i) => {
        const r = h('div', 'p2-ev', W.body); U.place(r, 40, 22 + i * 98);
        const b = U.badge(r, e[0], { size: 68, bg: e[1] });
        const tx = h('div', 'tx', r, e[2]); h('span', 'tm', tx, e[3]);
        A(r, 'right', 0.5 + i * 0.16, { d: 40 });
        if (i === 5) this.spin = b.firstChild;
      });
      const R = [
        ['chat', '최신 댓글과 결정 사항을 읽습니다'],
        ['users', '담당자와 연결 PR을 확인합니다'],
        ['search', '닫힌 이슈와 병합된 PR도 검색합니다'],
        ['refresh', '당일 상태는 다시 확인합니다'],
      ];
      const L = U.items(el, R.map(r => ({ icon: r[0], text: r[1], color: BLUE })), { x: 1090, y: 286, w: 720, isz: 72, gap: 40, square: true });
      L.rows.forEach((r, i) => { css(r.lastChild, { fontSize: '36px', fontWeight: 700, lineHeight: 1.3 }); A(r, 'up', 1.4 + i * 0.1); });
      const nb = U.box(el, 1090, 780, 710, 170);
      css(nb, { background: 'var(--ink)', color: '#fff', borderRadius: '26px', display: 'flex', alignItems: 'center', gap: '28px', padding: '0 36px' });
      nb.appendChild(U.badge(null, 'warn', { size: 84, bg: AMBER }));
      const nt = h('div', '', nb, '이 예시 이슈는 <span style="color:#7FA6FF">이미 해결</span>되었습니다<br><span style="font-size:28px;font-weight:600;color:#C9D2EA">다른 이슈를 찾아 다시 시작합니다</span>');
      css(nt, { fontSize: '36px', fontWeight: 780, lineHeight: 1.4, letterSpacing: '-.02em' });
      A(nb, 'up', 2.0, { d: 50 });
    },
    render(t) { if (this.spin) css(this.spin, { rotate: (t > 1.3 ? (t - 1.3) * 120 : 0) + 'deg' }); },
  });

  /* p.64 교육용 저장소의 용도 — 원본 → 강의용 포크 → 내 PR */
  slide({
    id: 'p2-edu', part: 'p2', chap: CH, title: '교육용 저장소의 용도', theme: 'blue',
    notes: 'First Contributions 는 PR 절차만 연습하도록 만든 교육용 저장소입니다. 오늘 실습은 원본이 아니라 강의용 포크에서 진행합니다. 댓글은 AI 로 쓰지 말고 직접 씁니다.',
    build(el, A) {
      const T = U.title(el, K, '교육용 저장소의 용도', { cls: 'h2' });
      css(T.k, { color: '#fff' }); A(T.k, 'right', 0); A(T.t, 'chars', 0.06, { each: 0.03 });
      // 왼쪽: 원본처럼 저장소 창 → PR 창으로 이어지는 그림(글자는 최소로), 오른쪽: 항목 4개
      const bar = (parent, w, op = 1) => { const b = h('i', '', parent); css(b, { display: 'block', height: '16px', width: w + 'px', borderRadius: '8px', background: '#DCE2EE', opacity: op }); return b; };
      const R = U.win(el, { x: 120, y: 290, w: 560, h: 330, title: 'first-contributions' });
      css(R.body, { padding: '24px 30px' });
      const fk = U.chip(R.body, 'Fork', { icon: 'branch', bg: '#EEF1F8', fg: 'var(--ink)' }); css(fk, { position: 'absolute', right: '28px', top: '22px' });
      const hd = h('div', 'mono', R.body, 'README.md'); css(hd, { fontSize: '26px', fontWeight: 700, color: 'var(--ink)', marginBottom: '22px' });
      ['doc', 'folder', 'file'].forEach((ic, k) => {
        const r = h('div', '', R.body); css(r, { display: 'flex', alignItems: 'center', gap: '16px', height: '52px' });
        r.appendChild(U.icon(ic, 30, '#8C93A8', 2)); bar(r, [300, 220, 260][k]);
      });
      A(R.el, 'up', 0.3, { d: 50 });
      const ar = U.arrow(el, [[300, 628], [300, 800], [404, 800]], { color: '#fff', sw: 6 });
      A(ar.path, 'draw', 0.9, { dur: 0.5 }); if (ar.head) A(ar.head, 'fade', 1.35, { dur: 0.2 });
      const P = U.win(el, { x: 420, y: 650, w: 560, h: 290, title: 'Pull request' });
      css(P.body, { padding: '22px 30px' });
      const r1 = h('div', '', P.body); css(r1, { display: 'flex', alignItems: 'center', gap: '16px' });
      r1.appendChild(U.chip(null, 'Open', { icon: 'pr', bg: GREEN, fg: '#fff' })); bar(r1, 250);
      const r2 = h('div', '', P.body); css(r2, { display: 'flex', alignItems: 'center', gap: '14px', marginTop: '22px' });
      r2.appendChild(U.status(null, 'ok', 36)); bar(r2, 200, 0.8);
      const r3 = h('div', '', P.body); css(r3, { display: 'flex', alignItems: 'flex-start', gap: '14px', marginTop: '22px' });
      r3.appendChild(U.avatar(null, '나', BLUE, 54));
      const cb = h('div', '', r3); css(cb, { background: '#EEF3FF', borderRadius: '14px', padding: '12px 18px', fontSize: '25px', fontWeight: 650, color: 'var(--ink)' }); cb.textContent = '직접 쓴 댓글';
      A(P.el, 'up', 1.1, { d: 50 });
      const I = [
        ['branch', 'First Contributions:', 'PR 절차 연습'],
        ['chat', '댓글은 직접 쓰고', '변경을 이해합니다'],
        ['doc', '현재 기여 지침을', '먼저 읽습니다'],
        ['hat', '수업은 강의용 포크에서', '진행합니다'],
      ];
      I.forEach((it, i) => {
        const y = 290 + i * 166;
        const c = U.box(el, 1060, y, 740, 146);
        css(c, { background: 'rgba(255,255,255,.12)', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '28px', padding: '0 34px', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.22)' });
        c.appendChild(U.badge(null, it[0], { size: 80, bg: '#fff', fg: BLUE }));
        const t = h('div', '', c, `<b style="font-weight:820">${it[1]}</b><br>${it[2]}`); css(t, { fontSize: '36px', fontWeight: 620, lineHeight: 1.3, color: '#fff', letterSpacing: '-.02em' });
        A(c, 'left', 0.5 + i * 0.12, { d: 50 });
      });
    },
  });

  /* p.65 수정 전에 실패를 재현 — X · X · 체크 · X 가 차례로 찍힌다 */
  slide({
    id: 'p2-reproduce', part: 'p2', chap: CH, title: '수정 전에 실패를 재현', theme: 'night', cls: 'dots',
    notes: '고치기 전에 문제를 먼저 내 손으로 재현합니다. 빈 문자열과 공백만 있는 입력에서 오류가 나는지, 정상 입력은 어떻게 동작하는지 기록하고, 지금은 실패하는 회귀 테스트를 남깁니다. normalize_title 예제는 PART 3 에서 이어집니다.',
    build(el, A) {
      ttl(el, A, '수정 전에 <span class="hr">실패를 재현</span>');
      const W = U.win(el, { x: 120, y: 270, w: 1000, h: 680, dark: true, title: 'terminal' });
      A(W.el, 'up', 0.2);
      const lines = [
        ['$ python -c \'normalize_title("")\'', 'er IndexError: string index out of range'],
        ['$ python -c \'normalize_title("   ")\'', 'er IndexError: string index out of range'],
        ['$ python -c \'print(normalize_title("hello"))\'', 'ok Hello'],
        ['$ python -m unittest tests.test_title', 'er FAIL: test_empty_title'],
      ];
      const tw = U.term(W.body, lines.flat(), { size: 30 });
      css(tw.el, { padding: '30px 38px', lineHeight: 1.8 });
      tw.rows.forEach((r, j) => {
        const i = Math.floor(j / 2), base = 0.6 + i * 0.75;
        if (j % 2 === 0) { A(r, 'fade', base - 0.05, { dur: 0.1 }); A(r.cmd, 'type', base, { cps: 70 }); }
        else { A(r, 'fade', base + 0.5, { dur: 0.15 }); css(r, { marginBottom: '34px' }); }
      });
      const R = [
        ['fail', '빈 문자열에서<br>오류를 확인합니다'],
        ['fail', '공백만 있는 입력도<br>확인합니다'],
        ['ok', '정상 입력의<br>결과를 기록합니다'],
        ['fail', '실패하는 회귀 테스트를<br>남깁니다'],
      ];
      R.forEach((r, i) => {
        const y = 290 + i * 162;
        const row = U.box(el, 1180, y, 620, 140);
        css(row, { display: 'flex', alignItems: 'center', gap: '26px' });
        const sl = h('span', '', row); css(sl, { position: 'relative', width: '72px', height: '72px', flex: 'none' });
        const ring = U.status(sl, 'wait', 72); U.place(ring, 0, 0);
        const st2 = U.status(sl, r[0], 72); U.place(st2, 0, 0);
        const t = h('div', '', row, r[1]); css(t, { fontSize: '36px', fontWeight: 700, lineHeight: 1.3, color: '#E6EAF5' });
        A(row, 'left', 0.35 + i * 0.08, { d: 50 });
        A(st2, 'stamp', 1.15 + i * 0.75, { dur: 0.4 });
      });
    },
  });

  /* 쉬는 시간 */
  slide({
    id: 'p2-break', part: 'p2', chap: '쉬는 시간', title: '쉬는 시간', theme: 'paper',
    notes: '10분 휴식 뒤 PART 3(AI Agent)로 다시 시작합니다. 휴식 중 First Contributions 저장소를 열어 두게 안내해도 좋습니다.',
    build(el, A) { this.b = U.breakCover(el, A, { resume: '10분 뒤', next: 'PART 3 · AI Agent로 수정하고 검증하기' }); },
    render(t, S) { this.b.update(t, S); },
  });
})();
