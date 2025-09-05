# Todo App - Next.js 15 + DDD + Auth.js

Next.js 15 + TypeScript + PostgreSQL + DDD 아키텍처 기반 Todo 애플리케이션

## 🏗️ 아키텍처

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma
- **Authentication**: Auth.js v5
- **Architecture**: Domain-Driven Design (DDD)
- **UI**: shadcn/ui + Tailwind CSS

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 라우팅
├── domain/                 # 비즈니스 로직 (순수)
├── infrastructure/         # 기술 구현체
├── application/            # 유스케이스
├── presentation/           # UI 컴포넌트
└── lib/                   # 유틸리티
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
AUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
```

### 3. 데이터베이스 설정
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. 개발 서버 실행
```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 📚 문서

- [컨벤션 가이드](./CONVENTIONS.md) - 프로젝트 컨벤션 및 규칙
- [아키텍처 가이드](./docs/ARCHITECTURE.md) - DDD 아키텍처 설명
- [개발 가이드](./docs/DEVELOPMENT.md) - 개발 환경 설정
- [개발 체크리스트](./docs/DEVELOPMENT_CHECKLIST.md) - 개발 시 확인사항
- [파일 템플릿](./docs/FILE_TEMPLATES.md) - 파일 생성 템플릿

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
