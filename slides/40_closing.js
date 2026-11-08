/* 마무리 — 오늘의 실습, 참고 자료, 첫 PR 전 확인, 질문과 답변 */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf } = DECK;
  const U = UI;
  const CH = '마무리';

  /* p.95 — 오늘의 기여 실습: 네 단계가 하나의 브랜치 위에 놓인다 */
  slide({
    id: 'close-practice', chap: CH, title: '오늘의 기여 실습', theme: 'paper', cls: 'dots',
    notes: '오늘 배운 흐름을 강의용 저장소에서 한 번에 해 본다. 오류 재현 → 에이전트와 작은 수정 → 세 가지 입력 검사 → 설명을 붙여 Draft PR.',
    build(el, A) {
      const T = U.title(el, '마무리 · 실습', '오늘의 기여 실습');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.04 });
      const xs = [270, 690, 1110, 1530], y = 600;
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible' }, el);
      const main = s('path', { d: `M120 ${y} L1800 ${y}`, stroke: '#0F1B3D', 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none', pathLength: 1 }, svg);
      A(main, 'draw', 0.3, { dur: 1.4, ease: ease.inOutCubic });
      const steps = [
        ['warn', 'var(--red)', '강의용 저장소에서<br>오류를 재현합니다', 'IndexError'],
        ['bot', 'var(--violet)', '에이전트와<br>작은 수정을 만듭니다', 'normalize_title'],
        ['flask', 'var(--blue)', '빈 입력·공백·정상 입력을<br>검사합니다', '3 passed'],
        ['pr', 'var(--green)', '변경을 설명하고<br>Draft PR을 엽니다', 'Draft'],
      ];
      steps.forEach((st, i) => {
        const x = xs[i];
        const n = U.num(el, i + 1, { size: 64, bg: '#0F1B3D', x: x - 32, y: y - 32 }); A(n, 'pop', 0.5 + i * 0.3);
        const b = U.badge(el, st[0], { size: 150, bg: st[1], x: x - 75, y: y - 250, square: true }); A(b, 'tilt', 0.6 + i * 0.3, { d: 60, r: i % 2 ? 6 : -6 });
        const tag = U.chip(el, st[3], { bg: '#fff', fg: '#0F1B3D', x: x - 110, y: y - 330 }); css(tag, { fontFamily: 'var(--mono)', width: '220px', justifyContent: 'center' }); A(tag, 'up', 0.9 + i * 0.3, { d: 20 });
        const tx = U.text(el, '', st[2], x - 190, y + 70, 380); css(tx, { fontSize: '38px', fontWeight: 780, lineHeight: 1.35, letterSpacing: '-.025em', textAlign: 'center' }); A(tx, 'up', 0.7 + i * 0.3);
      });
      const foot = U.text(el, 'b2', '네 단계 모두 오늘 배운 GitHub 협업 흐름 그대로입니다', 120, 870, 1680); css(foot, { textAlign: 'center' }); A(foot, 'fade', 2.0);
    },
  });

  /* p.96 — 참고 자료: 주소창에 주소가 입력된다 */
  slide({
    id: 'close-refs', chap: CH, title: '발표 후 참고할 공식 자료', theme: 'white',
    notes: '모든 주소는 2026-11-08에 열리는 것을 확인했다. Open Source Guides 는 한국어판 주소.',
    build(el, A) {
      const T = U.title(el, '마무리 · 자료', '발표 후 참고할 <span class="hl">공식 자료</span>');
      A(T.k, 'right', 0); A(T.t, 'chars', 0.1, { each: 0.03 });
      const R = [
        ['GitHub Docs', '이슈와 PR 사용법', 'docs.github.com/en/issues', 'docs.github.com/en/pull-requests', '#0F1B3D'],
        ['Open Source Guides', '첫 기여 준비', 'opensource.guide/ko/how-to-contribute', 'github.com/firstcontributions/first-contributions', 'var(--green)'],
        ['Python unittest', '회귀 테스트', 'docs.python.org/3/library/unittest.html', '', 'var(--blue)'],
        ['CONTRIBUTING · AI_POLICY', '프로젝트별 기여 규칙', '기여할 저장소의 루트와 .github 폴더', '', 'var(--violet)'],
      ];
      R.forEach((r, i) => {
        const x = 120 + (i % 2) * 850, y = 300 + Math.floor(i / 2) * 320;
        const w = U.win(el, { x, y, w: 830, h: 290, nobar: true });
        const bar = U.box(w.body, 0, 0, 830, 64); css(bar, { background: '#F3F4F8', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 24px' });
        h('div', 'win-dots', bar, '<i></i><i></i><i></i>');
        const url = h('div', 'mono', bar); css(url, { flex: 1, background: '#fff', borderRadius: '10px', height: '42px', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: '24px', color: '#3A4766', whiteSpace: 'nowrap', overflow: 'hidden' });
        const ut = h('span', '', url, r[2]);
        const side = U.box(w.body, 0, 64, 12, 226); css(side, { background: r[4] });
        const nm = U.text(w.body, '', r[0], 44, 94, 760); css(nm, { fontSize: '44px', fontWeight: 860, letterSpacing: '-.03em' });
        const ds = U.text(w.body, '', r[1], 44, 156, 760); css(ds, { fontSize: '32px', fontWeight: 600, color: 'var(--ink2)' });
        if (r[3]) { const u2 = U.text(w.body, 'mono', r[3], 44, 222, 760); css(u2, { fontSize: '24px', color: 'var(--muted)', whiteSpace: 'nowrap' }); A(u2, 'fade', 1.5 + i * 0.12); }
        A(w.el, 'up', 0.4 + i * 0.12, { d: 50 });
        A(ut, 'type', 0.8 + i * 0.25, { cps: 45, caret: false });
        if (r[2].includes('.')) { const a = document.createElement('a'); a.href = 'https://' + r[2]; a.target = '_blank'; a.rel = 'noopener'; css(a, { position: 'absolute', inset: '0', zIndex: 3 }); w.el.appendChild(a); }
      });
    },
  });

  /* p.97 — 첫 PR 제출 전 확인: 네 방향 점검이 하나씩 켜진다 */
  slide({
    id: 'close-check', chap: CH, title: '첫 PR 제출 전 확인', theme: 'ink', cls: 'dots', steps: 4,
    notes: '클릭할 때마다 한 항목씩 켜진다. 마지막 질문(리뷰 질문에 답할 수 있나요?)은 학생에게 직접 묻는다.',
    build(el, A) {
      const T = U.title(el, '마무리 · 점검', '첫 PR 제출 <span class="hl">전 확인</span>', { align: 'center' });
      A(T.k, 'fade', 0); A(T.t, 'chars', 0.1, { each: 0.04 });
      css(T.k, { display: 'none' });
      const cx = 960, cy = 590;
      const core = U.box(el, cx - 150, cy - 150, 300, 300); css(core, { borderRadius: '50%', background: '#18264D', boxShadow: '0 0 0 3px rgba(255,255,255,.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' });
      core.appendChild(U.icon('pr', 110, '#fff', 1.8));
      this.ready = h('div', '', core, 'Ready?'); css(this.ready, { fontWeight: 850, fontSize: '32px', color: '#fff' });
      A(core, 'pop', 0.3);
      this.core = core;
      const P = [
        ['doc', '기여 규칙과<br>최신 이슈 상태 확인', 140, 300, 'tl'],
        ['code', '작은 변경과<br>실제 검사 결과 준비', 140, 700, 'bl'],
        ['cpu', 'AI 공개 요구 확인<br>코드 직접 이해', 1290, 300, 'tr'],
        ['chat', '리뷰 질문에<br>답할 수 있나요?', 1290, 700, 'br'],
      ];
      const svg = s('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'position:absolute;left:0;top:0;overflow:visible' }, el);
      this.items = P.map((p, i) => {
        const left = p[2] < 900;
        const c = U.box(el, p[2], p[3], 490, 170);
        css(c, { borderRadius: '24px', background: '#18264D', display: 'flex', alignItems: 'center', gap: '24px', padding: '0 30px', flexDirection: left ? 'row' : 'row-reverse', textAlign: left ? 'left' : 'right' });
        const b = U.badge(c, p[0], { size: 92, bg: '#2A3459' });
        const tx = h('div', '', c, p[1]); css(tx, { fontSize: '36px', fontWeight: 780, lineHeight: 1.3, color: '#AEB8D3', letterSpacing: '-.02em' });
        const ex = left ? p[2] + 490 : p[2], ey = p[3] + 85;
        const ln = s('path', { d: `M${ex} ${ey} C ${(ex + cx) / 2} ${ey}, ${(ex + cx) / 2} ${cy}, ${left ? cx - 150 : cx + 150} ${cy}`, stroke: 'rgba(255,255,255,.15)', 'stroke-width': 5, fill: 'none', pathLength: 1 }, svg);
        A(c, left ? 'right' : 'left', 0.5 + i * 0.1, { d: 60 });
        A(ln, 'draw', 0.7 + i * 0.1, { dur: 0.6 });
        return { c, b, tx, ln };
      });
    },
    render(t, S) {
      let lit = 0;
      this.items.forEach((it, i) => {
        const p = prog(S.at(i + 1), 0, 0.45, ease.snap);
        if (p > 0.5) lit++;
        css(it.c, { background: p > 0.5 ? 'var(--green)' : '#18264D', transform: `scale(${1 + 0.05 * Math.sin(Math.PI * clamp(p))})` });
        css(it.b, { background: p > 0.5 ? '#0B8A5F' : '#2A3459' });
        css(it.tx, { color: p > 0.5 ? '#fff' : '#AEB8D3' });
        it.ln.setAttribute('stroke', p > 0.5 ? 'var(--mint)' : 'rgba(255,255,255,.15)');
      });
      const done = lit === 4;
      css(this.core, { background: done ? 'var(--green)' : '#18264D', transform: `scale(${done ? 1 + 0.06 * Math.sin(Math.PI * clamp(prog(S.at(4), 0.2, 0.5, ease.linear))) : 1})` });
      this.ready.textContent = done ? 'Ready!' : `${lit} / 4`;
    },
  });

  /* p.98 — 질문과 답변 */
  slide({
    id: 'close-qa', chap: CH, title: '질문과 답변', theme: 'paper', noChrome: true,
    notes: '어떤 프로젝트에 기여하고 싶은지 학생에게 묻고, 그 프로젝트의 CONTRIBUTING·AI 정책을 함께 열어 본다.',
    build(el, A) {
      // 이미지 위쪽 절반이 빈 벽이라 화면 전체에 깔고 글은 그 빈 곳에 둔다
      const im = U.img(el, 'img/qa_table.jpg', { x: 0, y: 0, w: 1920, h: 1080 });
      A(im, 'fade', 0.3, { dur: 1.0 });
      const t = U.text(el, '', '질문과 <span class="hl">답변</span>', 120, 90, 1680);
      css(t, { fontSize: '170px', fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1, textAlign: 'center' });
      A(t, 'chars', 0.05, { each: 0.06, dur: 0.7 });
      const sub = U.text(el, '', '어떤 프로젝트에 기여하고 싶으신가요?', 120, 290, 1680);
      css(sub, { fontSize: '48px', fontWeight: 700, color: 'var(--ink2)', textAlign: 'center', letterSpacing: '-.02em' });
      A(sub, 'up', 0.6);
      const who = U.text(el, '', '황민호 · Kakao AI Studio FDE  ·  <span class="mono" style="font-weight:600">github.com/revfactory</span>', 120, 380, 1680);
      css(who, { fontSize: '28px', fontWeight: 650, color: 'var(--muted)', textAlign: 'center' });
      A(who, 'fade', 1.0);
    },
  });
})();
