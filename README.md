# 강의 덱 사용법

`index.html`을 Chrome으로 엽니다. 인터넷 연결 없이 동작하고, 폰트와 이미지는 이 폴더 안에 있습니다.

## 발표 중 키

| 키 | 동작 |
| --- | --- |
| → · Space · PageDown · Enter · 클릭 | 다음 단계, 단계가 끝나면 다음 장 |
| ← · PageUp · 오른쪽 클릭 | 이전 장(최종 화면으로 바로 표시) |
| 숫자 + Enter | 해당 쪽으로 이동(예: `42` Enter) |
| F | 전체 화면 |
| O | 목차(Part·장별 쪽 목록, 클릭해서 이동) |
| N | 발표자 메모를 화면 아래에 표시 |
| P | 발표자 창 열기(메모·다음 장·경과 시간, 이 창에서도 넘길 수 있음) |
| R | 현재 장의 애니메이션 다시 재생 |
| B 또는 . | 화면 가리기 |
| H | 아래 진행 표시 숨기기 |

프레젠터(클리커)의 PageDown·PageUp 키를 그대로 씁니다. 주소 끝의 `#42`로 특정 쪽을 바로 열 수 있습니다.

## 파일

| 파일 | 내용 |
| --- | --- |
| `index.html` | 발표 덱 |
| `presenter.html` | 발표자 창(P 키로 엽니다) |
| `slides/*.js` | 장별 슬라이드. 글을 고칠 때는 이 파일의 문자열을 고칩니다 |
| `engine.js`, `ui.js`, `deck.css` | 엔진·부품·스타일 |
| `tools/shoot.mjs` | 쪽 캡처와 PDF 만들기 |
| `tools/audit.mjs` | 작은 글자·화면 밖 글자·겹친 글자 점검 |
| `tools/livecheck.mjs` | 발표 모드에서 키로 끝까지 넘겨 보며 오류 점검 |

## PDF 다시 만들기

```bash
node tools/shoot.mjs --dir . --pdf ../out/동국대_오픈소스AI특강_2026-11-13.pdf
```

PDF는 모든 장의 최종 화면을 한 쪽씩 담습니다. 클릭 단계가 있는 장도 마지막 단계까지 보인 상태로 들어갑니다.

`tools/` 의 스크립트는 Node.js와 `playwright-core`, 시스템 Chrome을 씁니다. 지금은 showreel 스킬 폴더(`~/.claude/skills/showreel/scripts/`)에 설치된 `playwright-core`를 불러오므로, 다른 컴퓨터에서 돌릴 때는 `npm i playwright-core` 후 각 스크립트의 `createRequire` 경로를 바꿉니다. 발표 자체(`index.html`)에는 필요 없습니다.

## 글을 고친 뒤 점검

```bash
node tools/audit.mjs --dir .                              # 22px 미만 글자, 화면 밖·겹친 글자
node tools/livecheck.mjs --dir .                          # 1쪽에서 끝까지 키로 넘기며 오류 확인
node tools/shoot.mjs --dir . --out ../qa/x --match p2-    # 일부 장만 그림으로 확인(장 id 앞부분)
```
