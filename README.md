# PENBOT_Front

본 프로젝트는 PENBOT 서비스의 프론트엔드 구현체로, **TypeScript** 기반으로 개발되었습니다.  
프론트엔드 코드는 **Cursor AI**를 적극 활용하여 작성되었습니다.

## 주요 폴더 및 파일 구조

- `public/` : 정적 파일(이미지, favicon 등) 및 웹앱의 진입점 리소스를 포함합니다.
- `src/` : 애플리케이션의 핵심 소스 코드가 위치합니다. 페이지, 컴포넌트, 스타일, 비즈니스 로직 등 모든 프론트엔드 구현이 이 폴더에 있습니다.
- `index.html` : 웹 앱의 기본 HTML 템플릿 파일입니다.
- `package.json` / `package-lock.json` : 프로젝트의 의존성 및 스크립트 관리 파일입니다.
- `vite.config.ts` : Vite 빌드 도구의 설정 파일입니다.
- `.gitignore`, `.prettierignore`, `.prettierrc` : 코드 포맷 및 관리 관련 설정 파일입니다.
- `eslint.config.js` : 코드 품질 및 규칙 관련 ESLint 설정 파일입니다.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` : TypeScript 설정 파일입니다.
- `vercel.json` : 배포(Vercel) 환경 설정 파일입니다.

## 기술 스택

- TypeScript
- Vite
- Cursor AI (프론트엔드 개발 보조)
- ESLint, Prettier

## 개발 및 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 기타

- 본 리포지토리는 PENBOT의 프론트엔드 역할을 수행하며, 백엔드와 연동하여 주요 서비스 기능을 제공합니다.
- 프론트엔드 전체 개발은 Cursor AI를 중심으로 진행되었습니다.

## 시연 영상

https://github.com/user-attachments/assets/6986afb1-0b6c-40c2-a296-9a6e18d97c25

## 디자인 

https://www.figma.com/design/U1faDyN8cOZAh96X3tzJIn/PENBOT?node-id=0-1&p=f

## 배포 홈페이지 

https://penbot.vercel.app/
