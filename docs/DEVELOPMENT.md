# 개발 가이드

## 📋 목차
1. [개발 환경 설정](#1-개발-환경-설정)
2. [기능 개발 워크플로우](#2-기능-개발-워크플로우)
3. [테스트 작성 가이드](#3-테스트-작성-가이드)
4. [디버깅 방법](#4-디버깅-방법)
5. [성능 최적화](#5-성능-최적화)

---

## 1. 개발 환경 설정

### 필수 요구사항
- **Node.js**: 18.x 이상
- **PostgreSQL**: 14.x 이상
- **Git**: 2.x 이상

### 초기 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local

# 데이터베이스 마이그레이션
npm run db:migrate

# 개발 서버 실행
npm run dev
```

### 환경 변수
```env
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/todoapp"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 2. 기능 개발 워크플로우

### 개발 순서
1. **도메인 모델링**: 비즈니스 요구사항 분석 및 도메인 모델 설계
2. **인터페이스 정의**: 리포지토리와 서비스 인터페이스 작성
3. **도메인 로직**: 엔티티와 도메인 서비스 구현
4. **인프라 구현**: 데이터베이스 연동 및 외부 서비스 연동
5. **유스케이스**: 애플리케이션 서비스 구현
6. **UI 개발**: 컴포넌트 및 서버 액션 구현

> **아키텍처 설계 원칙은 `docs/ARCHITECTURE.md` 참고**

### 브랜치 전략
```bash
# 기능 개발
git checkout -b feature/user-registration
git checkout -b feature/todo-management

# 버그 수정
git checkout -b fix/auth-validation

# 리팩토링
git checkout -b refactor/user-domain
```

### 커밋 컨벤션
```bash
# 기능 추가
git commit -m "feat(auth): add user registration use case"

# 버그 수정
git commit -m "fix(todo): resolve validation error"

# 문서 업데이트
git commit -m "docs: update architecture guide"
```

---

## 3. 테스트 작성 가이드

### 테스트 구조
```
tests/
├── unit/                   # 단위 테스트
│   ├── domain/            # 도메인 로직
│   ├── application/       # 유스케이스
│   └── infrastructure/    # 인프라 구현
├── integration/           # 통합 테스트
│   ├── api/              # API 엔드포인트
│   └── database/         # 데이터베이스
└── e2e/                  # E2E 테스트
    └── user-flows/       # 사용자 시나리오
```

### 단위 테스트 예시
```typescript
// tests/unit/domain/auth/entities/user.test.ts
describe('User', () => {
  it('should create user with valid data', () => {
    // Given
    const email = new Email('test@example.com');
    const password = new Password('secure123');

    // When
    const user = new User('user-id', email, password);

    // Then
    expect(user.email).toEqual(email);
    expect(user.password).toEqual(password);
  });
});
```

### 통합 테스트 예시
```typescript
// tests/integration/database/user-repository.test.ts
describe('PostgresUserRepository', () => {
  it('should save and retrieve user', async () => {
    // Given
    const user = new User(/* ... */);
    const repository = new PostgresUserRepository(db);

    // When
    await repository.save(user);
    const retrieved = await repository.findById(user.id);

    // Then
    expect(retrieved).toEqual(user);
  });
});
```

### 테스트 실행
```bash
# 모든 테스트
npm test

# 단위 테스트만
npm run test:unit

# 통합 테스트만
npm run test:integration

# E2E 테스트
npm run test:e2e

# 커버리지
npm run test:coverage
```

---

## 4. 디버깅 방법

### 로깅 전략
```typescript
// 애플리케이션 레이어에서 로깅
export class RegisterUserUseCase {
  async execute(command: RegisterUserCommand): Promise<Result> {
    this.logger.log('user_registration_started', { email: command.email });
    
    try {
      // 비즈니스 로직
      this.logger.log('user_registration_completed', { userId: user.id });
    } catch (error) {
      this.logger.error('user_registration_failed', { error, email: command.email });
      throw error;
    }
  }
}
```

### 디버깅 도구
- **브라우저**: Chrome DevTools
- **서버**: Node.js Inspector
- **데이터베이스**: PostgreSQL 로그
- **네트워크**: Network 탭

### 일반적인 문제 해결
```typescript
// 1. 타입 에러
// ❌ 문제
const user = await userRepo.findById(id); // User | null

// ✅ 해결
const user = await userRepo.findById(id);
if (!user) {
  throw new UserNotFoundError();
}

// 2. 비동기 에러
// ❌ 문제
const result = await useCase.execute(command); // 에러 처리 없음

// ✅ 해결
try {
  const result = await useCase.execute(command);
  return result;
} catch (error) {
  logger.error('use_case_failed', { error, command });
  throw error;
}
```

---

## 5. 성능 최적화

### 데이터베이스 최적화
```sql
-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_todos_user_id ON todos(user_id);

-- 쿼리 최적화
SELECT * FROM users WHERE email = $1; -- 인덱스 사용
```

### React 최적화
```typescript
// 메모이제이션
const TodoList = memo(({ todos }: { todos: Todo[] }) => {
  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </div>
  );
});

// 지연 로딩
const LazyComponent = lazy(() => import('./HeavyComponent'));
```

### Next.js 최적화
```typescript
// 이미지 최적화
import Image from 'next/image';

<Image
  src="/todo-icon.png"
  alt="Todo"
  width={24}
  height={24}
  priority
/>

// 동적 임포트
const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <p>Loading...</p>
});
```

### 캐싱 전략
```typescript
// React Query 캐싱
const { data: todos } = useQuery({
  queryKey: ['todos', userId],
  queryFn: () => fetchTodos(userId),
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 10 * 60 * 1000, // 10분
});
```

---

## 🚀 개발 팁

### 코드 품질
- **ESLint**: 코드 스타일 검사
- **Prettier**: 코드 포맷팅
- **TypeScript**: 타입 안전성
- **Husky**: Git 훅으로 품질 검사

### 협업
- **PR 템플릿**: 일관된 리뷰 프로세스
- **코드 리뷰**: 최소 2명의 승인
- **문서화**: README와 주석 업데이트
- **컨벤션**: `CONVENTIONS.md` 참고

### 모니터링
- **에러 추적**: Sentry 또는 유사 도구
- **성능 모니터링**: Web Vitals
- **사용자 분석**: Google Analytics

### 디버깅 도구
- **브라우저**: Chrome DevTools
- **서버**: Node.js Inspector
- **데이터베이스**: PostgreSQL 로그
- **네트워크**: Network 탭

---

## 📚 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Testing Library](https://testing-library.com/)

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0
