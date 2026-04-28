# CLAUDE.md

이 문서는 Claude Code가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 응대 톤

- 사용자는 서울대 전기정보공학부 교수님입니다. HTML, CSS, Javascript 경험은 있지만 React / Next.js에는 익숙하지 않습니다.
- 일반 프로그래밍 용어는 자연스럽게 사용해도 되지만, React / Next 특유의 개념(App Router, Server Component, hydration 등)은 한 줄로 풀어 설명해 주세요.
- 변경을 적용하기 전에 무엇을 어떻게 바꿀지 짧게 먼저 알리고, 작업 후에는 어떤 파일이 어떻게 바뀌었는지 요약해 주세요.

## 프로젝트 맵

| 종류                    | 위치                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| 콘텐츠 데이터           | `public/data/*.json` (highlights, news, people, gallery, publications, join-us, links)          |
| 이미지                  | `public/images/<카테고리>/` (예: `public/images/highlights/`)                                   |
| 페이지                  | `src/app/<route>/page.tsx` + `page.module.css` (Next.js App Router — 폴더가 곧 URL)             |
| 홈                      | `src/app/page.tsx`                                                                              |
| 공통 레이아웃           | `src/app/layout.tsx` (Navbar / Footer 적용)                                                     |
| 네비게이션              | `src/components/Navbar.tsx` (**링크가 하드코딩되어 있음** — 새 페이지 추가 시 여기도 수정 필요) |
| 타입 정의               | `src/types/index.ts` (**수정 금지 — 개발자 영역**)                                              |
| 테마 / 색상 / 폰트 변수 | `src/app/theme.css`, `src/app/globals.css`                                                      |
| 빌드 설정               | `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` (**수정 금지**)                          |

## 작업 패턴 — 카피베이스로 쓸 파일

새 페이지나 섹션을 만들 때는 처음부터 짜지 말고 아래 파일들을 카피베이스로 시작하세요. 컨벤션이 자연스럽게 유지됩니다.

- **가장 단순한 리스트 페이지**: `src/app/highlights/page.tsx` + `src/app/highlights/page.module.css`
  - JSON을 읽어 카드 그리드로 보여주는 패턴
  - 새 데이터 페이지(예: `/research`, `/courses`)는 이걸 복제해서 만드세요
- **홈 섹션 패턴**: `src/app/page.tsx`의 `highlightsSection` / `newsSection`
  - 홈에 새 섹션을 추가할 때는 이 구조를 그대로 복제 (`<section>` + 헤더 + 그리드)
  - 스타일도 `src/app/page.module.css`의 `.highlightsSection`, `.highlightsGrid`, `.highlightCard` 등을 복제해서 새 클래스명으로 쓰세요
- **콘텐츠 중심 정적 페이지**: `src/app/join-us/page.tsx`
  - 구조화된 콘텐츠를 단일 페이지로 보여주는 패턴

## 콘텐츠 데이터 컨벤션

- 각 컬렉션은 객체 배열(`[{...}, {...}]`)이며, 모든 항목에 `id` 필드가 있습니다.
- id 컨벤션 예시:
  - `highlights.json` → `h1, h2, h3, ...`
  - `news.json` → `1, 2, 3, ...` (문자열)
  - `gallery.json` → `g1, g2, ...`
  - 새 항목 추가 시 같은 패턴으로 마지막 번호 +1 하세요
- 항목의 필드는 같은 파일 내 다른 항목을 보고 그대로 따라 쓰세요. 새로운 필드를 임의로 추가하지 마세요(타입 정의와 어긋나면 빌드가 깨집니다).
- JSON 신택스 주의: 마지막 `]` 위치, 항목 사이 콤마, **trailing comma 금지**.

## 이미지 규칙 (중요)

- 이미지는 항상 `public/images/<카테고리>/` 아래에 두고, JSON에서는 `/images/<카테고리>/<파일명>` 형태의 경로로 참조합니다.
- **외부 URL 사용 금지.** `next.config.ts`의 `images.remotePatterns`에 등록된 도메인(picsum.photos, drive.google.com 등) 외에는 `<Image>`가 빌드를 깨뜨립니다. 임의로 도메인을 추가하지 마세요.
- 사용자가 이미지 파일 위치를 알려주지 않으면 어디에 있는지 또는 어떻게 받을 수 있는지 물어보세요. 임의로 placeholder 이미지를 사용하지 마세요.

## 새 페이지 추가 절차

1. `src/app/<route>/` 디렉토리에 `page.tsx`와 `page.module.css`를 만듭니다 (라우트 이름은 영문 소문자 + 하이픈, 예: `research`, `open-source`).
2. 데이터를 표시하는 페이지라면 `public/data/<route>.json`도 함께 만들고 `highlights/page.tsx` 패턴을 따라 import하세요.
3. **Navbar 노출 여부를 사용자에게 물어보세요.** 동의하면 `src/components/Navbar.tsx`의 `<nav>` 안에 한 줄을 추가합니다 (라벨은 사용자에게 확인). Navbar는 하드코딩이라 직접 추가하지 않으면 메뉴에 안 나옵니다.

## 홈에 새 섹션 추가 절차

1. `src/app/page.tsx`에 `<section>` 블록을 추가합니다 — 기존 `highlightsSection`을 그대로 복제한 뒤 데이터·제목·링크만 바꾸는 게 가장 안전합니다.
2. `src/app/page.module.css`에 대응하는 클래스(`.xxxSection`, `.xxxGrid`, `.xxxCard` 등)를 같은 패턴으로 추가합니다.
3. 섹션이 외부 데이터에 의존한다면 `public/data/<name>.json`을 만들어 import하세요.

## 하지 말 것

- `npm install` 또는 `package.json` 의존성 추가. 새 라이브러리가 필요하면 사용자에게 "이건 개발자에게 요청해 주세요"라고 안내하세요.
- `src/types/index.ts`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.env*` 수정.
- 기존 컴포넌트(`src/components/*`)의 props 시그니처 변경 — 다른 페이지가 깨질 수 있습니다. 새 prop이 필요하면 새 컴포넌트를 만드세요.
- 기존 항목의 `id` 변경 — 다른 곳에서 참조될 수 있습니다.
- JSON에 새로운 종류의 필드 추가(타입 정의에 없는 필드) — 빌드가 깨지거나 무시됩니다.

## 거절해야 하는 요청

다음 요청이 들어오면 친절히 거절하고, 개발자에게 전달할 내용을 정리해서 보여 주세요.

- 콘텐츠 타입에 새 필드 추가 (예: highlight에 "PDF 링크" 필드 추가)
- 새 라이브러리 설치
- 빌드 / 배포 설정 변경

거절 메시지 예시:

> 이 작업은 개발자가 처리해야 합니다. 다음 내용을 개발자에게 전달해 주세요:
>
> - 요청: (요약)
> - 영향 범위: (어떤 파일/기능)
> - 기대 동작: (구체적으로)

## 작업 후 검증

변경이 끝나면 항상 빌드가 깨지지 않을지 확인하세요:

```bash
npm run lint
```

타입 에러가 의심되면:

```bash
npx tsc --noEmit
```

문제가 있으면 사용자에게 알리고, 임의로 타입을 손대지 말고 원인을 설명해 주세요.
