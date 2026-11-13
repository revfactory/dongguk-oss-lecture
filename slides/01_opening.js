/* 오프닝 — 표지, 강사 소개, 참여 질문, 오늘 다룰 내용, 시간표 */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, count } = DECK;
  const U = UI;

  /* 1. 표지 — 제목 줄이 Diff 의 추가 줄처럼 들어온다 */
  slide({
    id: 'cover', title: '표지', theme: 'paper', noChrome: true,
    notes: 'GitHub 협업과 AI 에이전트로 시작하는 오픈소스.',
    build(el, A) {
      this.img = U.img(el, 'img/cover_hero.jpg', { x: 560, y: 300, w: 1440, h: 810, mask: 'radial-gradient(ellipse 62% 70% at 62% 52%, #000 55%, transparent 80%)' });
      A(this.img, 'zoom', 0.35, { dur: 1.3, from: 1.08 });
      const lines = [
        { y: 120, html: 'GitHub 협업과 AI 에이전트로', size: 104 },
        { y: 262, html: '시작하는 <span class="hl">오픈소스</span>', size: 104 },
      ];
      lines.forEach((L, i) => {
        const bar = U.box(el, 96, L.y - 10, i === 0 ? 1460 : 980, 150);
        css(bar, { background: 'rgba(18,176,122,.13)', borderRadius: '14px' });
        A(bar, 'wipe', 0.15 + i * 0.32, { dur: 0.55 });
        const plus = U.text(el, 'mono', '+', 118, L.y + 18);
        css(plus, { fontSize: '60px', fontWeight: 700, color: 'var(--green)' });
        A(plus, 'pop', 0.2 + i * 0.32, { dur: 0.4 });
        const t = U.text(el, 'h1', L.html, 196, L.y + 4, 1500);
        css(t, { fontSize: L.size + 'px', fontWeight: 880, whiteSpace: 'nowrap' });
        A(t, 'chars', 0.3 + i * 0.32, { each: 0.03, dur: 0.55 });
      });
      const who = U.box(el, 120, 868, 760);
      who.innerHTML = '<div style="font-size:46px;font-weight:850;letter-spacing:-.03em">황민호</div>';
      A(who, 'up', 1.35, { dur: 0.7 });
    },
    render(t) { css(this.img, { translate: `0 ${Math.sin(t * 0.8) * 6}px` }); },
  });

  /* 2. 강사 소개 — 경력을 main 브랜치의 커밋으로 */
  slide({
    id: 'speaker', title: '강사 소개', theme: 'paper',
    notes: '경력은 커밋 그래프로 표시. 별 수는 2026.11.08 GitHub API 기준 9,337.',
    build(el, A) {
      const nm = U.text(el, '', '황민호', 120, 140);
      css(nm, { fontSize: '170px', fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1 });
      A(nm, 'chars', 0.1, { each: 0.07, dur: 0.6 });
      const id = U.text(el, 'mono', 'robin.hwang', 660, 226); css(id, { fontSize: '36px', color: 'var(--ink2)' }); A(id, 'right', 0.45);
      const tag = U.text(el, 'b1', 'AI가 일할 환경을 설계하는 사람', 120, 340); css(tag, { fontWeight: 700 }); A(tag, 'up', 0.66);
      const q = U.box(el, 120, 430, 760);
      q.innerHTML = '<div style="font-family:var(--serif);font-weight:700;font-size:48px;line-height:1.3;letter-spacing:-.02em">“프롬프트가 아니라,<br>시스템을 만듭니다.”</div>';
      css(q, { borderLeft: '8px solid var(--green)', paddingLeft: '34px' });
      A(q, 'wipe', 0.85, { dur: 0.7 });
      // 경력 커밋 그래프(세로)
      const gx = 1010, rows = [
        ['2009', 'WIPRO', '자동 SQL DBMS 테스트'],
        ['2010', 'KISTI', '문장 패턴 분석 · 온톨로지'],
        ['2013', 'DAUM', '클라우드 서비스 · 검색'],
        ['현재', 'KAKAO', '광고 · OLIVE · AI Studio'],
      ];
      const svg = s('svg', { width: 80, height: 600, viewBox: '0 0 80 600', style: 'position:absolute;left:' + (gx - 40) + 'px;top:120px;overflow:visible' }, el);
      const line = s('path', { d: 'M40 30 L40 520', stroke: 'var(--ink)', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none', pathLength: 1 }, svg);
      A(line, 'draw', 0.2, { dur: 1.2, ease: ease.inOutCubic });
      rows.forEach((r, i) => {
        const y = 30 + i * 163;
        const last = i === rows.length - 1;
        const dot = s('circle', { cx: 40, cy: y, r: last ? 22 : 15, fill: last ? '#FFCD00' : 'var(--paper)', stroke: 'var(--ink)', 'stroke-width': 6 }, svg);
        css(dot, { transformBox: 'fill-box', transformOrigin: 'center' });
        A(dot, 'pop', 0.3 + i * 0.28, { dur: 0.45 });
        const yr = U.text(el, 'mono', r[0], gx + 52, 120 + y - 44); css(yr, { fontSize: '24px', color: 'var(--muted)', fontWeight: 700 });
        const co = U.text(el, '', r[1], gx + 52, 120 + y - 16); css(co, { fontSize: '50px', fontWeight: 880, letterSpacing: '-.03em' });
        const ds = U.text(el, 'b3', r[2], gx + 52, 120 + y + 46); css(ds, { fontSize: '26px' });
        [yr, co, ds].forEach((e, j) => A(e, 'right', 0.36 + i * 0.28 + j * 0.05, { d: 40 }));
      });
      // 아래 4칸: 저서 · 교육 · 커뮤니티 · GitHub
      const cells = [
        ['book', '저서', '「하네스 엔지니어링<br>with 클로드 코드」<br>한빛미디어, 2026'],
        ['users', '교육·강연', '카카오 그룹·대학·정부·기업<br>AI 실습형 강의'],
        ['globe', '커뮤니티', 'today-ai-news<br>AI 소식 정리'],
      ];
      cells.forEach((a, i) => {
        const c = U.card(el, { x: 120 + i * 425, y: 744, w: 405, h: 214, pad: 30 });
        const hd = h('div', '', c); css(hd, { display: 'flex', alignItems: 'center', gap: '12px' });
        hd.appendChild(U.icon(a[0], 38, 'var(--green)', 2.4));
        const t1 = h('span', '', hd, a[1]); css(t1, { fontWeight: 820, fontSize: '30px' });
        const t2 = h('div', '', c, a[2]); css(t2, { fontSize: '25px', lineHeight: 1.42, color: 'var(--ink2)', marginTop: '12px', fontWeight: 560 });
        A(c, 'up', 1.1 + i * 0.08);
      });
      const star = U.card(el, { x: 1395, y: 744, w: 405, h: 214, pad: 0 });
      css(star, { background: 'var(--ink)', color: '#fff' });
      const sl = U.text(star, '', 'revfactory/harness', 30, 26); css(sl, { fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 700, color: '#AEB8D3' });
      const sn = U.text(star, 'numf', '9,337', 30, 66); css(sn, { fontSize: '86px', lineHeight: 1, color: '#fff' });
      this.sn = sn;
      const si = U.icon('star', 58, '#FFCD00', 2.4); U.place(si, 300, 78); star.appendChild(si);
      const sc = U.text(star, '', 'GitHub Stars · 2026. 11. 8. 기준', 30, 164); css(sc, { fontSize: '24px', fontWeight: 600, color: '#AEB8D3' });
      A(star, 'up', 1.34); A(si, 'stamp', 1.9, { dur: 0.5 });
    },
    render(t) { this.sn.textContent = count(prog(t, 1.45, 1.6, ease.outQuart), 9337); },
  });

  /* 3. 참여 질문 — 단계마다 질문이 바뀐다 */
  slide({
    id: 'poll', title: '손 들어 보기', theme: 'blue', steps: 2,
    notes: '세 질문을 차례로 묻고 손을 든 비율을 눈으로 확인. 비율에 따라 Part 1의 속도를 조절.',
    build(el, A) {
      const k = U.text(el, 'k', '시작하기 전에', 120, 100); css(k, { color: '#fff' }); A(k, 'right', 0);
      const hand = U.icon('hand', 220, '#fff', 1.6); U.place(hand, 1520, 120); el.appendChild(hand); A(hand, 'tilt', 0.15, { r: -20, d: 80 });
      const qs = ['GitHub 계정이<br>있는 분?', 'Pull Request를<br>올려 본 적이 있는 분?', 'AI 코딩 도구로<br>코드를 고쳐 본 적이 있는 분?'];
      this.qs = qs.map((q, i) => {
        const e = U.text(el, '', q, 120, 250, 1500);
        css(e, { fontSize: '128px', fontWeight: 880, letterSpacing: '-.045em', lineHeight: 1.12, color: '#fff' });
        return e;
      });
      this.nums = qs.map((q, i) => {
        const n = U.text(el, 'numf', '0' + (i + 1), 120 + i * 120, 860);
        css(n, { fontSize: '72px', color: '#fff' });
        return n;
      });
      const lab = U.text(el, 'b2', '손을 들어 주세요', 520, 880); css(lab, { color: '#DCE6FF', fontWeight: 650 }); A(lab, 'fade', 0.8);
    },
    render(t, S) {
      if (DECK.MODE === 'print') {   // 배포용 PDF 에는 세 질문을 한 화면에
        this.qs.forEach((e, i) => css(e, { top: (230 + i * 200) + 'px', fontSize: '76px', lineHeight: 1.1, opacity: 1, transform: 'none', filter: 'none' }));
        this.qs.forEach((e, i) => { e.innerHTML = e.innerHTML.replace(/<br>/g, ' '); e.style.left = '250px'; });
        this.nums.forEach((n, i) => css(n, { opacity: 1, left: '120px', top: (236 + i * 200) + 'px', transform: 'none' }));
        return;
      }
      this.qs.forEach((e, i) => {
        // 이전 질문이 0.3초 안에 빠진 뒤(0.22초부터) 새 질문이 들어온다. 같은 자리에 두 질문이 겹쳐 보이지 않게 한다.
        const tin = i === 0 ? S.at(0) - 0.25 : S.at(i) - 0.22;
        const tout = i < 2 ? S.at(i + 1) : -1e9;
        const pin = prog(tin, 0, 0.7, ease.snap), pout = prog(tout, 0, 0.3, ease.outCubic);
        css(e, { opacity: clamp(pin * 1.5) * (1 - pout), transform: `translate3d(${(1 - pin) * 160 - pout * 220}px,0,0)`, filter: pin < 1 ? `blur(${(1 - pin) * 10}px)` : 'none' });
      });
      this.nums.forEach((n, i) => {
        const on = (i === 0 ? S.at(0) : S.at(i)) > 0;
        const cur = S.step === i;
        css(n, { opacity: on ? (cur ? 1 : 0.35) : 0.15, transform: `scale(${cur ? 1 : 0.8})`, transformOrigin: '0 100%' });
      });
    },
  });

  /* 4. 오늘 다룰 내용 — 세 개의 Part */
  slide({
    id: 'today', title: '오늘 다룰 내용', theme: 'paper',
    notes: '원본 커리큘럼 그대로. 세 가지를 Part 1~3으로 진행.',
    build(el, A) {
      const T = U.title(el, '오늘 다룰 내용', '세 가지를 순서대로 해 봅니다');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.025 });
      const P = [
        ['01', 'GitHub의 기본 협업 방식', 'Repository · Branch · Issue · PR · Review · CI · Merge', 'var(--green)', 'branch'],
        ['02', '기존 프로젝트의 이슈 읽기', 'README · 폴더 구조 · 이슈 검색 · 실패 재현', 'var(--blue)', 'search'],
        ['03', 'AI Agent로 수정하고 검증하기', '에이전트 · 프로젝트 지침 · 회귀 테스트 · AI 기여 정책', 'var(--violet)', 'bot'],
      ];
      P.forEach((p, i) => {
        const y = 340 + i * 220;
        const band = U.box(el, 120, y, 1680, 190);
        css(band, { background: '#fff', borderRadius: '28px', boxShadow: '0 24px 48px -28px rgba(15,27,61,.3), 0 0 0 1.5px rgba(15,27,61,.06)', overflow: 'hidden' });
        const side = U.box(band, 0, 0, 16, 190); css(side, { background: p[3] });
        const n = U.text(band, 'numf', p[0], 60, 30); css(n, { fontSize: '130px', color: p[3], lineHeight: 1 });
        const t1 = U.text(band, 'h3', p[1], 290, 40); css(t1, { fontSize: '56px' });
        const t2 = U.text(band, 'b3', p[2], 290, 118); css(t2, { fontFamily: 'var(--sans)', fontSize: '28px' });
        const b = U.badge(band, p[4], { size: 110, bg: p[3], x: 1530, y: 40 });
        A(band, 'left', 0.45 + i * 0.14, { d: 220, dur: 0.8 });
        A(n, 'up', 0.7 + i * 0.14, { d: 60 });
        A(b, 'pop', 0.85 + i * 0.14);
      });
    },
  });

  /* 5. 시간표 */
  slide({
    id: 'timetable', title: '오늘의 진행 순서', theme: 'ink', cls: 'dots',
    notes: '휴식 두 번(각 10분). 진행 상황에 맞춰 조정.',
    build(el, A) {
      const T = U.title(el, '진행 순서', '오늘의 진행 순서');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.08, { each: 0.04 });
      const t0 = 14 * 60, t1 = 17 * 60, X0 = 120, X1 = 1800;
      const X = m => X0 + (X1 - X0) * (m - t0) / (t1 - t0);
      const blocks = [
        [0, 8, '오프닝', '#AEB8D3', 0],
        [8, 50, 'PART 1 · 전반', 'var(--green)', 1, '오픈소스 · Git · Issue'],
        [50, 60, '휴식', '#3A4766', 0],
        [60, 95, 'PART 1 · 후반', 'var(--green)', 1, 'PR · 리뷰 · CI · Merge'],
        [95, 115, 'PART 2', 'var(--blue)', 1, '이슈 읽기'],
        [115, 125, '휴식', '#3A4766', 0],
        [125, 170, 'PART 3', 'var(--violet)', 1, 'AI Agent'],
        [170, 180, '마무리', '#AEB8D3', 0],
      ];
      // 시간 눈금
      for (let m = 0; m <= 180; m += 30) {
        const x = X(t0 + m);
                const ln = U.box(el, x - 1, 405, 2, 470); css(ln, { background: 'rgba(255,255,255,.1)' });
        A(ln, 'grow', 0.3 + m / 600, { axis: 'y', origin: '50% 0%' });
      }
      blocks.forEach((b, i) => {
        const x = X(t0 + b[0]), w = X(t0 + b[1]) - x;
        const big = b[4] === 1;
        const y = big ? 460 : 600, hh = big ? 260 : 120;
        const bx = U.box(el, x + 4, y, w - 8, hh);
        css(bx, { background: b[3], borderRadius: '18px', overflow: 'hidden' });
        A(bx, 'grow', 0.5 + i * 0.1, { dur: 0.6 });
        if (big) {
          const l = U.text(bx, '', b[2], 26, 24, w - 40); css(l, { fontSize: w > 300 ? '34px' : '28px', fontWeight: 850, color: '#fff', whiteSpace: 'nowrap' });
          const l2 = U.text(bx, '', b[5], 26, 76, w - 40); css(l2, { fontSize: '24px', fontWeight: 600, color: 'rgba(255,255,255,.85)', lineHeight: 1.35 });
                    A([l, l2], 'up', 0.8 + i * 0.1, { d: 20, each: 0.05 });
        } else {
          const l = U.text(el, '', b[2], x - 40, y + hh + 16, w + 80); css(l, { fontSize: '24px', fontWeight: 750, color: '#AEB8D3', textAlign: 'center', whiteSpace: 'nowrap' });
          const ic = U.icon(b[2] === '휴식' ? 'coffee' : b[2] === '오프닝' ? 'play' : 'chat', 36, b[3] === '#3A4766' ? '#AEB8D3' : 'var(--navy)'); U.place(ic, (w - 8) / 2 - 18, 42); bx.appendChild(ic);
          A(l, 'fade', 0.9 + i * 0.1);
        }
      });
      const note = U.text(el, 'b3', '진행 상황에 따라 조금씩 달라질 수 있습니다', 120, 920); css(note, { color: '#8F9ABB' }); A(note, 'fade', 1.6);
    },
  });
})();
