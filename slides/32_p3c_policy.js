/* 3C AI 기여 정책과 근거 — 편집 디자인(신문 지면 같은 단 구성, Hahmlet 세리프, 빨강 한 점) */
(function () {
  const { slide, css, h, s, prog, ease, lerp, clamp, kf, count, rand } = DECK;
  const U = UI;
  const CH = 'AI 기여 정책과 근거';
  const RED = '#D23A2E';

  // 신문 머리줄: 위 굵은 줄 + 얇은 줄 + 작은 머리말
  function masthead(el, A, left, right) {
    const r1 = U.box(el, 120, 84, 1680, 6); css(r1, { background: '#1A1A1A' }); A(r1, 'grow', 0, { dur: 0.6 });
    const r2 = U.box(el, 120, 96, 1680, 2); css(r2, { background: '#1A1A1A' }); A(r2, 'grow', 0.08, { dur: 0.6 });
    const l = U.text(el, '', left, 120, 112); css(l, { fontSize: '24px', fontWeight: 750, color: RED }); A(l, 'fade', 0.3);
    const r = U.text(el, '', right, 1200, 112, 600); css(r, { fontSize: '24px', fontWeight: 600, color: '#555', textAlign: 'right' }); A(r, 'fade', 0.3);
  }
  function headline(el, A, html, y = 168, size = 92) {
    const t = U.text(el, 'serif', html, 120, y, 1680);
    css(t, { fontSize: size + 'px', fontWeight: 900, letterSpacing: '-.035em', lineHeight: 1.12 });
    A(t, 'chars', 0.2, { each: 0.028 });
    return t;
  }

  /* p.89 */
  slide({
    id: 'p3c-policies', part: 'p3', chap: CH, title: 'AI 기여 정책은 프로젝트마다 다릅니다', theme: 'editorial',
    notes: 'Pallets 는 PR 뿐 아니라 이슈·댓글·문서 등 모든 상호작용에 적용되므로 "AI 생성 기여 금지"로 표기(원본: AI 생성 PR 금지). 출처: palletsprojects.com/contributing/llm-ai, ghostty AI_POLICY.md, netbsd.org commit-guidelines. 확인일 2026-11-08.',
    build(el, A) {
      masthead(el, A, 'AI 기여 정책', '확인일 2026. 11. 8.');
      headline(el, A, 'AI 기여 정책은 프로젝트마다 다릅니다');
      const cols = [
        ['Pallets', 'Flask 등', 'ban', 'AI 생성 기여 금지', 'PR·이슈·댓글·문서 모두 적용'],
        ['Ghostty', '터미널 에뮬레이터', 'megaphone', '사용 공개와<br>직접 이해 요구', '도구와 사용 범위를 밝힘'],
        ['NetBSD', '운영체제', 'sign', 'core 사전<br>서면 승인 요구', 'LLM 생성 코드는 커밋 전 승인'],
      ];
      cols.forEach((c, i) => {
        const x = 120 + i * 573;
        if (i > 0) { const v = U.box(el, x - 24, 330, 2, 520); css(v, { background: 'rgba(0,0,0,.25)' }); A(v, 'grow', 0.5 + i * 0.1, { axis: 'y', origin: '50% 0%', dur: 0.7 }); }
        const nm = U.text(el, 'serif', c[0], x, 330); css(nm, { fontSize: '84px', fontWeight: 900, letterSpacing: '-.03em' });
        A(nm, 'up', 0.6 + i * 0.15, { d: 40 });
        const sub = U.text(el, '', c[1], x + 4, 440); css(sub, { fontSize: '26px', fontWeight: 600, color: '#666' }); A(sub, 'fade', 0.8 + i * 0.15);
        const ic = U.badge(el, c[2], { size: 96, bg: i === 0 ? RED : '#1A1A1A', x, y: 506 }); A(ic, 'pop', 0.9 + i * 0.15);
        const st = U.text(el, '', c[3], x, 626, 520); css(st, { fontSize: '46px', fontWeight: 850, lineHeight: 1.22, letterSpacing: '-.03em', color: i === 0 ? RED : '#1A1A1A' });
        A(st, 'stamp', 1.05 + i * 0.15, { from: 1.4, r: -4, dur: 0.5 });
        const ds = U.text(el, '', c[4], x, 760, 520); css(ds, { fontSize: '28px', fontWeight: 560, color: '#444' }); A(ds, 'up', 1.2 + i * 0.15, { d: 20 });
      });
      const ban = U.box(el, 120, 846, 1680, 96); css(ban, { background: '#1A1A1A', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '40px', fontWeight: 800, letterSpacing: '-.02em' });
      ban.appendChild(U.icon('doc', 44, '#fff', 2.2)); h('span', '', ban, '변경하기 전에 최신 정책을 읽습니다');
      A(ban, 'wipe', 1.7, { dur: 0.6 });
    },
  });

  /* p.90 */
  slide({
    id: 'p3c-pallets', part: 'p3', chap: CH, title: 'Pallets의 AI 기여 제한', theme: 'editorial',
    notes: '원문: "AI-generated PRs and issues are closed on sight, without review or discussion." "This applies regardless of code quality or correctness." "must not be reopened, cleaned up, or used as a base for further work." 출처: github.com/pallets/.github CONTRIBUTING.md, palletsprojects.com/contributing/llm-ai (2026-11-08 확인). 원본의 "재작성·재제출 금지"를 원문에 맞춰 "다시 열기·다듬기·재활용도 금지"로 고침.',
    build(el, A) {
      masthead(el, A, 'Pallets · CONTRIBUTING.md', 'Flask · Jinja · Click 등을 관리하는 조직');
      const t = U.text(el, 'serif', 'Pallets의<br><span style="color:' + RED + '">AI 기여 제한</span>', 120, 168, 760);
      css(t, { fontSize: '96px', fontWeight: 900, letterSpacing: '-.035em', lineHeight: 1.1 }); A(t, 'chars', 0.2, { each: 0.035 });
      // 원문 인용 카드 + 닫힘 도장
      const q = U.box(el, 120, 450, 760, 400);
      css(q, { background: '#fff', borderRadius: '8px', padding: '44px 48px', boxShadow: '0 30px 60px -30px rgba(0,0,0,.35)' });
      q.innerHTML = '<div style="font-family:var(--serif);font-size:40px;font-weight:700;line-height:1.35;letter-spacing:-.01em;color:#1A1A1A">“AI-generated PRs and issues are closed on sight, without review or discussion.”</div>' +
        '<div style="margin-top:28px;font-size:24px;font-weight:600;color:#777">pallets/.github · CONTRIBUTING.md</div>';
      A(q, 'tilt', 0.5, { r: -3, d: 80 });
      const stamp = U.chip(el, 'Closed', { icon: 'x', size: 'lg', bg: RED, fg: '#fff', x: 610, y: 410 });
      css(stamp, { boxShadow: '0 10px 24px -8px rgba(210,58,46,.6)' });
      A(stamp, 'stamp', 1.2, { from: 2.6, r: 14, dur: 0.45 });
      const rows = ['AI 생성 PR·이슈는<br>검토 없이 종료', '품질과 정확성에<br>관계없이 적용', '댓글·문서·번역에도<br>정책 적용', '다시 열기·다듬기·<br>재활용도 금지'];
      rows.forEach((r, i) => {
        const y = 200 + i * 182;
        const ln = U.box(el, 1000, y, 800, 2); css(ln, { background: 'rgba(0,0,0,.3)' }); A(ln, 'grow', 0.6 + i * 0.12, { dur: 0.5 });
        const n = U.text(el, 'serif', String(i + 1), 1000, y + 22); css(n, { fontSize: '64px', fontWeight: 900, color: RED, lineHeight: 1 }); A(n, 'up', 0.7 + i * 0.12, { d: 30 });
        const tx = U.text(el, '', r, 1080, y + 26, 720); css(tx, { fontSize: '44px', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-.03em' }); A(tx, 'right', 0.75 + i * 0.12, { d: 40 });
      });
    },
  });

  /* p.91 */
  slide({
    id: 'p3c-ghostty', part: 'p3', chap: CH, title: 'Ghostty의 AI 기여 조건', theme: 'editorial',
    notes: '원문: "All AI usage in any form must be disclosed." "The human-in-the-loop must fully understand all code." 첫 기여자는 vouch 절차: Vouch Request 토론 글 → 메인테이너 !vouch → 이후 PR 가능(vouch 전 PR 은 자동 종료). 출처: ghostty-org/ghostty AI_POLICY.md, CONTRIBUTING.md (2026-11-08 확인). PR 본문의 도구·범위는 설명용 예시.',
    build(el, A) {
      masthead(el, A, 'Ghostty · AI_POLICY.md', '확인일 2026. 11. 8.');
      const t = U.text(el, 'serif', 'Ghostty의<br><span style="color:' + RED + '">AI 기여 조건</span>', 120, 168, 800);
      css(t, { fontSize: '96px', fontWeight: 900, letterSpacing: '-.035em', lineHeight: 1.1 }); A(t, 'chars', 0.2, { each: 0.035 });
      const L = [['wrench', '사용한 도구와 범위를 공개합니다'], ['doc', '코드 변화와 영향을 직접 설명합니다'], ['user', '생성 내용을 사람이 검토합니다'], ['shield', '첫 기여자는 vouch 절차를 확인합니다']];
      L.forEach((r, i) => {
        const y = 450 + i * 112;
        const b = U.badge(el, r[0], { size: 76, bg: i === 3 ? RED : '#1A1A1A', x: 120, y }); A(b, 'pop', 0.6 + i * 0.12);
        const tx = U.text(el, '', r[1], 222, y + 14, 700); css(tx, { fontSize: '38px', fontWeight: 760, letterSpacing: '-.025em' }); A(tx, 'right', 0.66 + i * 0.12, { d: 40 });
      });
      // 오른쪽: PR 본문의 AI 사용 공개 예시
      const w = U.win(el, { x: 1000, y: 200, w: 800, h: 420, title: 'Pull request · 본문' });
      const body = w.body; css(body, { padding: '30px 36px', fontSize: '28px', lineHeight: 1.5 });
      const hd = h('div', '', body, 'AI 사용 공개'); css(hd, { fontWeight: 850, fontSize: '32px', marginBottom: '14px' });
      this.l1 = h('div', 'mono', body, '도구: Claude Code'); css(this.l1, { fontSize: '27px', color: '#333' });
      this.l2 = h('div', 'mono', body, '범위: 테스트 초안 작성'); css(this.l2, { fontSize: '27px', color: '#333' });
      this.l3 = h('div', 'mono', body, '확인: 변경 내용을 직접 설명할 수 있음'); css(this.l3, { fontSize: '27px', color: '#333' });
      const ex = h('div', '', body, '설명용 예시'); css(ex, { marginTop: '22px', fontSize: '24px', color: '#999', fontWeight: 600 });
      A(w.el, 'flipY', 0.4, { deg: -50, origin: '100% 50%' });
      A(this.l1, 'type', 0.9, { cps: 30 }); A(this.l2, 'type', 1.5, { cps: 30 }); A(this.l3, 'type', 2.1, { cps: 30 });
      // vouch 절차
      const steps = ['Vouch Request<br>토론 글', '메인테이너<br><code>!vouch</code>', 'PR 제출'];
      steps.forEach((st, i) => {
        const x = 1000 + i * 285;
        const c = U.box(el, x, 690, 225, 140); css(c, { background: i === 2 ? RED : '#fff', color: i === 2 ? '#fff' : '#1A1A1A', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '28px', fontWeight: 780, lineHeight: 1.3, boxShadow: '0 16px 30px -18px rgba(0,0,0,.4)' });
        c.innerHTML = st;
        A(c, 'up', 1.3 + i * 0.18, { d: 30 });
        if (i < 2) { const ar = U.icon('arrow', 44, '#1A1A1A', 2.6); U.place(ar, x + 233, 738); el.appendChild(ar); A(ar, 'right', 1.42 + i * 0.18, { d: 20 }); }
      });
      const vn = U.text(el, '', 'vouch 전에 연 PR은 자동으로 닫힙니다', 1000, 866, 800); css(vn, { fontSize: '26px', fontWeight: 600, color: '#555' }); A(vn, 'fade', 2.0);
    },
  });

  /* p.92 — 19% 증가 */
  slide({
    id: 'p3c-metr', part: 'p3', chap: CH, title: '생산성 연구를 읽는 방법', theme: 'editorial',
    notes: 'METR 2025(2025-07-10): 숙련 오픈소스 개발자 16명, 실제 이슈 246개. AI 허용 시 완료 시간이 19% 늘었다. 2026-02-24 후속 글: 새 실험은 AI 없이 하기 싫은 과제를 빼는 선택 효과(30~50%) 때문에 새 추정치를 믿기 어렵다고 밝힘. 원본의 "선택 편향 확인"을 "선택 효과로 추정 불확실"로 고침. 출처: metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study, metr.org/blog/2026-02-24-uplift-update. 막대는 상대 길이를 보여 주는 도식.',
    build(el, A) {
      masthead(el, A, '근거 자료 읽기', 'METR · 2025. 7. / 2026. 2.');
      headline(el, A, '생산성 연구를 읽는 방법', 168, 84);
      const big = U.text(el, 'serif', '19%', 108, 300); css(big, { fontSize: '330px', fontWeight: 900, color: RED, lineHeight: 1, letterSpacing: '-.05em' });
      A(big, 'slam', 0.5, { from: 1.5, dur: 0.6 });
      const lb = U.text(el, '', 'AI 허용 시 완료 시간 19% 증가', 120, 650, 820); css(lb, { fontSize: '44px', fontWeight: 850, letterSpacing: '-.03em' }); A(lb, 'up', 1.0);
      // 막대 비교
      const bars = [['AI 없이', 1, '#1A1A1A'], ['AI 허용', 1.19, RED]];
      bars.forEach((b, i) => {
        const y = 744 + i * 90;
        const l = U.text(el, '', b[0], 120, y + 8); css(l, { fontSize: '28px', fontWeight: 750 }); A(l, 'fade', 1.1 + i * 0.1);
        const bar = U.box(el, 280, y, 520 * b[1], 56); css(bar, { background: b[2], borderRadius: '4px' });
        A(bar, 'grow', 1.15 + i * 0.25, { dur: 0.9, ease: ease.outCubic });
        const v = U.text(el, 'mono', i === 0 ? '100' : '119', 290 + 520 * b[1], y + 10); css(v, { fontSize: '28px', fontWeight: 700, color: b[2] }); A(v, 'fade', 1.9 + i * 0.2);
      });
      // 오른쪽 단: 두 시점의 연구
      const cols = [
        ['2025', 'METR 2025: 16명 · 246과제', '숙련 오픈소스 개발자 16명이 실제 이슈 246개를 AI 허용·비허용으로 나눠 수행'],
        ['2026', '2026 후속: 선택 효과로 추정 불확실', 'AI 없이 하기 싫은 과제를 빼는 참가자가 30~50%. 새 추정치를 믿기 어렵다고 발표'],
      ];
      const v = U.box(el, 1000, 300, 2, 560); css(v, { background: 'rgba(0,0,0,.25)' }); A(v, 'grow', 0.6, { axis: 'y', origin: '50% 0%' });
      cols.forEach((c, i) => {
        const y = 300 + i * 270;
        const yr = U.text(el, 'serif', c[0], 1050, y); css(yr, { fontSize: '64px', fontWeight: 900, color: i === 1 ? RED : '#1A1A1A', lineHeight: 1 }); A(yr, 'up', 0.8 + i * 0.25, { d: 30 });
        const t1 = U.text(el, '', c[1], 1050, y + 84, 750); css(t1, { fontSize: '36px', fontWeight: 820, letterSpacing: '-.025em' }); A(t1, 'right', 0.9 + i * 0.25, { d: 30 });
        const t2 = U.text(el, '', c[2], 1050, y + 140, 750); css(t2, { fontSize: '27px', fontWeight: 550, color: '#444', lineHeight: 1.45 }); A(t2, 'fade', 1.05 + i * 0.25);
      });
      const fin = U.box(el, 1050, 848, 750); fin.innerHTML = '<span class="mark" style="font-size:36px;font-weight:850;letter-spacing:-.025em">시점·참여자·과제 조건을 함께 봅니다</span>';
      css(fin.firstChild, { background: 'linear-gradient(transparent 58%, rgba(210,58,46,.25) 58%)' });
      A(fin, 'wipe', 1.9, { dur: 0.6 });
    },
  });

  /* p.93 — 500 칸 */
  slide({
    id: 'p3c-swebench', part: 'p3', chap: CH, title: '벤치마크와 실제 기여의 차이', theme: 'editorial',
    notes: 'SWE-bench Verified: 사람이 검토한 500개 문제(swebench.com/verified.html). 칸 하나가 문제 하나. 점수는 실제 프로젝트의 PR 병합률이 아니며, 정책·리뷰·유지보수 부담은 따로 판단해야 한다.',
    build(el, A) {
      masthead(el, A, '근거 자료 읽기', 'SWE-bench · swebench.com');
      headline(el, A, '벤치마크와 실제 기여의 차이', 168, 84);
      // 500 칸 격자(25×20)
      const g = U.box(el, 120, 330, 760, 608);
      this.cells = [];
      for (let i = 0; i < 500; i++) {
        const c = h('i', '', g); const cx = i % 25, cy = Math.floor(i / 25);
        css(c, { position: 'absolute', left: cx * 28.8 + 'px', top: cy * 28.8 + 'px', width: '23px', height: '23px', borderRadius: '4px', background: '#1A1A1A', opacity: 0.08 });
        this.cells.push(c);
      }
      const n5 = U.text(el, 'serif', '500', 300, 520); css(n5, { fontSize: '190px', fontWeight: 900, color: '#D23A2E', lineHeight: 1, background: '#F1EBDF', padding: '6px 30px 18px', borderRadius: '10px', boxShadow: '0 20px 50px -20px rgba(0,0,0,.4)' });
      A(n5, 'slam', 1.9, { from: 1.6, dur: 0.5 });
            const L = U.box(el, 120, 270, 760); L.innerHTML = '<span style="font-size:34px;font-weight:820">SWE-bench</span><span style="font-size:30px;font-weight:600;color:#444">: 이슈 해결 패치 평가</span>';
      A(L, 'fade', 0.4);
      // 가운데 ≠
      const ne = U.text(el, 'serif', '≠', 880, 420); css(ne, { fontSize: '240px', fontWeight: 900, color: RED, lineHeight: 1 }); A(ne, 'pop', 1.2, { from: 0.2 });
      // 오른쪽: PR 검토 현장
      const w = U.win(el, { x: 1110, y: 300, w: 690, h: 360, title: 'Pull request #128' });
      const cm = [['M', '#2F6BFF', '이 변경이 기존 API에 영향을 주나요?'], ['K', '#12B07A', '테스트 실행 결과를 붙여 주세요'], ['J', '#7C5CFF', '프로젝트 정책상 범위를 줄여야 해요']];
      cm.forEach((c, i) => {
        const r = U.box(w.body, 26, 22 + i * 96, 640, 80); css(r, { display: 'flex', alignItems: 'center', gap: '18px' });
        r.appendChild(U.avatar(null, c[0], c[1], 54));
        const b = h('div', '', r, c[2]); css(b, { background: '#F3F4F8', borderRadius: '16px', padding: '14px 20px', fontSize: '26px', fontWeight: 600 });
        A(r, 'left', 1.0 + i * 0.22, { d: 50 });
      });
      A(w.el, 'up', 0.7);
      const R1 = U.text(el, '', '점수는 PR 병합률과 다릅니다', 1110, 700, 690); css(R1, { fontSize: '44px', fontWeight: 850, letterSpacing: '-.03em' }); A(R1, 'up', 1.6);
      const R2 = U.text(el, '', '정책·리뷰·유지보수는 별도로 판단합니다', 1110, 776, 690); css(R2, { fontSize: '32px', fontWeight: 650, color: '#444' }); A(R2, 'up', 1.75);
      const V = U.text(el, '', 'Verified: 사람이 검토한 500문제', 1110, 860, 690); css(V, { fontSize: '30px', fontWeight: 760, color: RED }); A(V, 'up', 1.9);
    },
    render(t) {
      this.cells.forEach((c, i) => {
        const order = (i % 25) + Math.floor(i / 25) * 1.6 + 0.0 * i;
        const p = prog(t, 0.45 + order * 0.022 + rand(i, 3) * 0.12, 0.25, ease.outCubic);
        c.style.opacity = 0.08 + 0.62 * p;
        c.style.background = p > 0.5 ? '#1A1A1A' : '#1A1A1A';
      });
    },
  });

  /* p.94 — PR 더미 */
  slide({
    id: 'p3c-burden', part: 'p3', chap: CH, title: '유지보수자의 검토 부담', theme: 'editorial',
    notes: 'PR 수가 늘면 유지보수자가 읽어야 할 양도 늘어난다. 재현 방법·검사 결과·설명을 함께 내면 검토 시간을 줄일 수 있다. 쌓이는 PR 카드는 설명용 도식.',
    build(el, A) {
      masthead(el, A, '유지보수자 관점', '검토는 사람의 시간이 드는 일');
      const t = U.text(el, 'serif', '유지보수자의<br><span style="color:' + RED + '">검토 부담</span>', 120, 168, 800);
      css(t, { fontSize: '96px', fontWeight: 900, letterSpacing: '-.035em', lineHeight: 1.1 }); A(t, 'chars', 0.2, { each: 0.035 });
      // 쌓이는 PR 카드 더미
      this.pile = [];
      for (let i = 0; i < 14; i++) {
        // 아래 카드가 위 카드에 가려지므로 글자는 카드 아래쪽(보이는 띠)에 둔다
        const c = U.box(el, 140 + (i % 2) * 14 + rand(i, 1) * 24, 880 - i * 36, 600, 72);
        css(c, { background: '#fff', borderRadius: '8px', boxShadow: '0 4px 0 rgba(0,0,0,.08), 0 0 0 1.5px rgba(0,0,0,.12)', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '0 22px 5px', fontFamily: 'var(--mono)', fontSize: '24px', fontWeight: 600, color: '#555', lineHeight: '30px' });
        c.appendChild(U.icon('pr', 26, i % 3 === 0 ? '#12B07A' : '#888', 2.4));
        h('span', '', c, `PR #${140 + i * 3}`);
        const tg = h('span', '', c, ['리뷰 대기', '확인 필요', '테스트 없음'][i % 3]); css(tg, { marginLeft: 'auto', fontFamily: 'var(--sans)', fontSize: '24px', color: i % 3 === 2 ? RED : '#888' });
        c.__r = (rand(i, 2) - 0.5) * 1.6;
        this.pile.push(c);
      }
      const cnt = U.text(el, 'serif', '14', 800, 470); css(cnt, { fontSize: '120px', fontWeight: 900, color: RED, lineHeight: 1 }); this.cnt = cnt;
      const cl = U.text(el, '', '검토 대기', 806, 600); css(cl, { fontSize: '28px', fontWeight: 700, color: RED }); A(cl, 'fade', 1.0);
      const L = ['PR이 늘면 검토할 일도 늘어납니다', '재현과 검사 결과를 함께 제출합니다', '관련 없는 변경은 분리합니다', '설명할 수 있는 코드만 제출합니다'];
      L.forEach((r, i) => {
        const y = 330 + i * 138;
        const ln = U.box(el, 1000, y, 800, 2); css(ln, { background: 'rgba(0,0,0,.3)' }); A(ln, 'grow', 1.2 + i * 0.12, { dur: 0.5 });
        const tx = U.text(el, '', r, 1000, y + 30, 800); css(tx, { fontSize: '42px', fontWeight: 820, letterSpacing: '-.03em', color: i === 0 ? RED : '#1A1A1A' }); A(tx, 'right', 1.3 + i * 0.12, { d: 40 });
      });
      const att = [['play', '재현'], ['flask', '검사 결과'], ['doc', '설명']];
      const row = U.box(el, 1000, 884, 800); css(row, { display: 'flex', gap: '20px' });
      att.forEach((a, i) => {
        const c = U.chip(row, a[1], { icon: a[0], size: 'lg', bg: '#1A1A1A', fg: '#fff' }); A(c, 'pop', 2.0 + i * 0.1);
      });
    },
    render(t) {
      let n = 0;
      this.pile.forEach((c, i) => {
        const p = prog(t, 0.3 + i * 0.09, 0.45, ease.outCubic);
        if (p > 0.5) n++;
        css(c, { opacity: clamp(p * 3), transform: `translate3d(0,${(1 - p) * -260}px,0) rotate(${c.__r * p}deg)` });
      });
      this.cnt.textContent = String(Math.max(n, 0));
      this.cnt.style.opacity = t > 0.4 ? 1 : 0;
    },
  });
})();
