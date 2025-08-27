# PENBOT Frontend

React + TypeScript + Vite를 사용한 프론트엔드 프로젝트입니다.

## 기술 스택

- **React 19** - 사용자 인터페이스 라이브러리
- **TypeScript** - 정적 타입 검사
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **ESLint** - 코드 품질 검사
- **Prettier** - 코드 포맷팅
- **React Router** - 클라이언트 사이드 라우팅
- **네이버 지도 API** - 지도 기능

## 시작하기

### 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 네이버 지도 API 설정

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/)에서 애플리케이션을 등록합니다.
2. Maps 서비스를 활성화하고 Client ID를 발급받습니다.
3. `src/pages/DirectionsPage.tsx` 파일에서 `YOUR_CLIENT_ID`를 실제 Client ID로 교체합니다:

```typescript
script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_ACTUAL_CLIENT_ID';
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - ESLint로 코드 검사
- `npm run lint:fix` - ESLint로 코드 검사 및 자동 수정
- `npm run format` - Prettier로 코드 포맷팅
- `npm run format:check` - Prettier 포맷팅 검사

## 프로젝트 구조

```
src/
├── components/         # 재사용 가능한 컴포넌트
│   ├── Header.tsx     # 네비게이션 헤더
│   ├── Layout.tsx     # 공통 레이아웃
│   ├── MainSection.tsx # 메인 콘텐츠
│   ├── Footer.tsx     # 푸터
│   └── LoginModal.tsx # 로그인 모달
├── pages/             # 페이지 컴포넌트
│   ├── HomePage.tsx   # 홈페이지
│   ├── IntroductionPage.tsx # 펜션 소개
│   ├── BookingPage.tsx # 예약 정보
│   └── DirectionsPage.tsx # 찾아오는 길
├── types/             # TypeScript 타입 정의
│   └── naver-maps.d.ts # 네이버 지도 API 타입
├── App.tsx            # 메인 앱 컴포넌트
├── main.tsx           # 앱 진입점
├── index.css          # 전역 스타일
└── App.css            # 앱 컴포넌트 스타일
```

## 페이지 구성

- **홈페이지 (`/`)** - 메인 랜딩 페이지
- **펜션 소개 (`/introduction`)** - 펜션 상세 정보
- **예약 정보 (`/booking`)** - 예약 방법 및 정책
- **찾아오는 길 (`/directions`)** - 위치 및 교통편 (네이버 지도 포함)

## 코드 품질

이 프로젝트는 ESLint와 Prettier를 사용하여 코드 품질을 유지합니다:

- **ESLint**: 코드 품질 검사 및 잠재적 오류 감지
- **Prettier**: 일관된 코드 포맷팅

## 개발 환경 설정

### VS Code 설정 (권장)

`.vscode/settings.json` 파일을 생성하여 다음 설정을 추가하세요:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### 확장 프로그램

다음 VS Code 확장 프로그램을 설치하는 것을 권장합니다:

- ESLint
- Prettier - Code formatter
- TypeScript Importer
- Auto Rename Tag

## 네이버 지도 API 사용법

찾아오는 길 페이지에서는 네이버 지도 API를 사용합니다:

1. **API 키 설정**: `DirectionsPage.tsx`에서 Client ID를 설정
2. **지도 표시**: 펜션 위치에 마커와 정보창 표시
3. **사용자 상호작용**: 마커 클릭 시 정보창 열기/닫기

## 주의사항

- 네이버 지도 API를 사용하려면 유효한 Client ID가 필요합니다.
- 실제 배포 시에는 환경 변수를 사용하여 API 키를 관리하는 것을 권장합니다.
