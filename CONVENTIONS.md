# 프로젝트 컨벤션 문서

## 📋 목차
1. [프로젝트 구조 컨벤션](#1-프로젝트-구조-컨벤션)
2. [코딩 컨벤션](#2-코딩-컨벤션)
3. [도메인 모델링 컨벤션](#3-도메인-모델링-컨벤션)
4. [유스케이스 작성 컨벤션](#4-유스케이스-작성-컨벤션)
5. [서버 액션 작성 컨벤션](#5-서버-액션-작성-컨벤션)
6. [컴포넌트 작성 컨벤션](#6-컴포넌트-작성-컨벤션)
7. [테스트 작성 컨벤션](#7-테스트-작성-컨벤션)
8. [에러 처리 컨벤션](#8-에러-처리-컨벤션)
9. [의존성 주입 컨벤션](#9-의존성-주입-컨벤션)
10. [Git 컨벤션](#10-git-컨벤션)
11. [코드 리뷰 체크리스트](#11-코드-리뷰-체크리스트)

---

## 1. 프로젝트 구조 컨벤션

### 폴더 네이밍 규칙
- **kebab-case**: 폴더명 (user-repository, auth-service)
- **PascalCase**: 컴포넌트 파일명 (UserForm.tsx, TodoList.tsx)
- **camelCase**: 일반 파일명 (userService.ts, authActions.ts)

### 파일명 컨벤션 (중요!)
- **유스케이스**: `{name}.use-case.ts` (예: `register-user.use-case.ts`)
- **리포지토리**: `{technology}-{domain}.repository.ts` (예: `postgres-user.repository.ts`)
- **서버 액션**: `actions.ts` (라우트 폴더 내에 위치)
- **DTO**: 유스케이스 파일 내에 정의 (별도 폴더 사용 금지)

### 전체 프로젝트 구조
```
src/
├── app/                           # Next.js 라우팅
│   ├── (auth)/                    # 인증 페이지
│   │   ├── signup/page.tsx + actions.ts
│   │   └── login/page.tsx + actions.ts
│   ├── (dashboard)/               # 대시보드 페이지
│   │   └── todos/page.tsx + actions.ts
│   └── layout.tsx + page.tsx
│
├── domain/                        # 비즈니스 로직 (순수)
│   ├── auth/                      # 인증 도메인
│   │   ├── entities/user.ts
│   │   ├── value-objects/email.ts, password.ts
│   │   ├── repositories/user-repository.ts
│   │   └── services/auth-service.ts
│   └── todo/                      # 할일 도메인
│       ├── entities/todo.ts
│       ├── value-objects/todo-title.ts, todo-status.ts
│       ├── repositories/todo-repository.ts
│       └── services/todo-service.ts
│
├── infrastructure/                # 기술 구현체
│   ├── auth/
│   │   ├── postgres-user.repository.ts    # ✅ 컨벤션 준수
│   │   └── jwt-service.ts
│   └── todo/
│       └── postgres-todo.repository.ts    # ✅ 컨벤션 준수
│
├── application/                   # 유스케이스
│   ├── auth/
│   │   ├── register-user.use-case.ts      # ✅ 컨벤션 준수
│   │   └── login-user.use-case.ts         # ✅ 컨벤션 준수
│   └── todo/
│       ├── create-todo.use-case.ts        # ✅ 컨벤션 준수
│       └── complete-todo.use-case.ts      # ✅ 컨벤션 준수
│
├── presentation/                  # UI 컴포넌트
│   ├── components/
│   │   ├── ui/ (shadcn/ui)
│   │   ├── forms/auth/
│   │   └── features/todo/
│   ├── hooks/
│   └── providers/
│
├── lib/                           # 유틸리티
│   ├── container.ts (DI)
│   ├── utils.ts
│   └── validations.ts
│
└── types/                         # 전역 타입
    ├── auth.types.ts
    └── todo.types.ts
```

### 핵심 원칙

#### 의존성 방향
```
Presentation → Application → Domain ← Infrastructure
```

#### 레이어별 역할
- **`app/`**: 페이지 + 서버 액션 (라우팅만)
- **`domain/`**: 비즈니스 로직 (순수, 의존성 없음)
- **`infrastructure/`**: DB, 외부 서비스 구현체
- **`application/`**: 유스케이스 (도메인 조합)
- **`presentation/`**: UI 컴포넌트 + 훅

#### 도메인 구조 (각 도메인마다)
```
domain/{domain}/
├── entities/          # 엔티티
├── value-objects/     # 값 객체
├── repositories/      # 리포지토리 인터페이스
├── services/          # 도메인 서비스
├── events/            # 도메인 이벤트
└── exceptions/        # 도메인 예외
```

> **아키텍처 상세 설명은 `docs/ARCHITECTURE.md` 참고**

---

## 2. 코딩 컨벤션

### TypeScript 컨벤션
```typescript
// ✅ 좋은 예
export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}

export class User {
  constructor(
    private readonly id: UserId,
    private readonly email: Email,
    private readonly password: Password
  ) {}

  // 비즈니스 로직
  canChangePassword(currentPassword: string): boolean {
    return this.password.matches(currentPassword);
  }
}

// ❌ 나쁜 예
export interface userRepository {
  findById(id: string): Promise<any>;
  save(user: any): Promise<void>;
}
```

### 네이밍 컨벤션
```typescript
// 클래스: PascalCase
export class UserService {}
export class TodoRepository {}

// 인터페이스: PascalCase (I 접두사 사용하지 않음)
export interface UserRepository {}
export interface AuthService {}

// 함수/메서드: camelCase
export function createUser() {}
export function validateEmail() {}

// 상수: UPPER_SNAKE_CASE
export const MAX_TODO_COUNT = 100;
export const AUTH_TOKEN_KEY = 'auth_token';

// 타입: PascalCase
export type UserId = string;
export type TodoStatus = 'pending' | 'completed' | 'cancelled';
```

---

## 3. 도메인 모델링 컨벤션

### 엔티티 작성 규칙
```typescript
// domain/auth/entities/user.ts
export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private readonly _password: Password
  ) {}

  // Getters
  get id(): UserId { return this._id; }
  get email(): Email { return this._email; }

  // 비즈니스 메서드
  canChangePassword(currentPassword: string): boolean {
    return this._password.matches(currentPassword);
  }
}
```

### 값 객체 작성 규칙
```typescript
// domain/auth/value-objects/email.ts
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new InvalidEmailError(`Invalid email: ${email}`);
    }
    this.value = email.toLowerCase();
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

> **도메인 모델링 상세 가이드는 `docs/ARCHITECTURE.md` 참고**

---

## 4. 유스케이스 작성 컨벤션

### 유스케이스 구조
```typescript
// application/auth/use-cases/register-user.use-case.ts
export interface RegisterUserCommand {
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    try {
      // 1. 입력 검증
      this.validateCommand(command);

      // 2. 비즈니스 규칙 검증
      if (await this.userRepository.existsByEmail(command.email)) {
        throw new EmailAlreadyExistsError();
      }

      // 3. 도메인 객체 생성
      const user = User.create(
        command.email,
        command.password,
        command.name
      );

      // 4. 저장
      await this.userRepository.save(user);

      // 5. 부수 효과 처리
      await this.emailService.sendWelcomeEmail(user.email);
      await this.logger.log('user_registered', { userId: user.id });
      
      // 6. 도메인 이벤트 발행
      await this.eventBus.publish(new UserRegisteredEvent(user.id));

      return { success: true, userId: user.id };
    } catch (error) {
      await this.logger.log('user_registration_failed', { error });
      return { success: false, error: error.message };
    }
  }

  private validateCommand(command: RegisterUserCommand): void {
    if (!command.email || !command.password || !command.name) {
      throw new ValidationError('All fields are required');
    }
  }
}
```

---

## 5. 서버 액션 작성 컨벤션

### 서버 액션 구조
```typescript
// app/(auth)/signup/actions.ts
'use server'

import { RegisterUserUseCase } from '@/application/auth/use-cases/register-user.use-case';
import { container } from '@/lib/container';
import { redirect } from 'next/navigation';

export async function registerUserAction(formData: FormData) {
  try {
    const useCase = container.get(RegisterUserUseCase);
    
    const result = await useCase.execute({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string
    });

    if (result.success) {
      redirect('/login?message=registration-success');
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    return { success: false, error: 'Registration failed' };
  }
}
```

---

## 6. 컴포넌트 작성 컨벤션

### React 컴포넌트 구조
```typescript
// presentation/components/forms/auth/signup-form.tsx
'use client'

import { useState } from 'react';
import { registerUserAction } from '@/app/(auth)/signup/actions';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';

interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SignupForm({ onSuccess, onError }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await registerUserAction(formData);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Registration failed');
        onError?.(result.error || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Input
        name="email"
        type="email"
        placeholder="Email"
        required
        disabled={isLoading}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        required
        disabled={isLoading}
      />
      <Input
        name="name"
        type="text"
        placeholder="Name"
        required
        disabled={isLoading}
      />
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
```

---

## 7. 테스트 작성 컨벤션

### 단위 테스트
```typescript
// tests/unit/domain/auth/entities/user.test.ts
import { User } from '@/domain/auth/entities/user';
import { Email } from '@/domain/auth/value-objects/email';
import { Password } from '@/domain/auth/value-objects/password';

describe('User', () => {
  describe('canChangePassword', () => {
    it('올바른 비밀번호로 변경 가능', () => {
      // Given
      const user = new User(
        'user-id',
        new Email('test@example.com'),
        new Password('current-password'),
        new Date(),
        new Date()
      );

      // When
      const canChange = user.canChangePassword('current-password');

      // Then
      expect(canChange).toBe(true);
    });

    it('잘못된 비밀번호로는 변경 불가', () => {
      // Given
      const user = new User(
        'user-id',
        new Email('test@example.com'),
        new Password('current-password'),
        new Date(),
        new Date()
      );

      // When
      const canChange = user.canChangePassword('wrong-password');

      // Then
      expect(canChange).toBe(false);
    });
  });
});
```

---

## 8. 에러 처리 컨벤션

### 도메인 예외
```typescript
// domain/auth/exceptions/auth.exceptions.ts
export class AuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthException';
  }
}

export class EmailAlreadyExistsError extends AuthException {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
    this.name = 'EmailAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends AuthException {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}
```

---

## 9. 의존성 주입 컨벤션

### 컨테이너 설정
```typescript
// lib/container.ts
import { Container } from 'inversify';
import { UserRepository } from '@/domain/auth/repositories/user-repository';
import { PostgresUserRepository } from '@/infrastructure/auth/user-repository';
import { RegisterUserUseCase } from '@/application/auth/use-cases/register-user.use-case';

const container = new Container();

// Repository
container.bind<UserRepository>('UserRepository').to(PostgresUserRepository);

// Use Cases
container.bind<RegisterUserUseCase>('RegisterUserUseCase').to(RegisterUserUseCase);

export { container };
```

---

## 10. Git 컨벤션

### 커밋 메시지 규칙
```
<type>(<scope>): <subject>

<body>

<footer>
```

**타입:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경

**예시:**
```
feat(auth): add user registration use case

- Implement RegisterUserUseCase with email validation
- Add UserRegisteredEvent for domain events
- Include password hashing and email service integration

Closes #123
```

---

## 11. 코드 리뷰 체크리스트

### 도메인 레이어
- [ ] 비즈니스 로직이 순수한지 확인
- [ ] 외부 의존성이 없는지 확인
- [ ] 불변성이 보장되는지 확인
- [ ] 도메인 규칙이 명확히 표현되었는지 확인

### 애플리케이션 레이어
- [ ] 유스케이스가 단일 책임을 가지는지 확인
- [ ] 도메인 객체를 올바르게 조합하는지 확인
- [ ] 에러 처리가 적절한지 확인
- [ ] 트랜잭션 경계가 명확한지 확인

### 인프라스트럭처 레이어
- [ ] 도메인 인터페이스를 올바르게 구현하는지 확인
- [ ] 기술적 세부사항이 도메인에 노출되지 않는지 확인
- [ ] 성능 최적화가 적절한지 확인

### 프레젠테이션 레이어
- [ ] 서버 액션이 올바르게 구현되었는지 확인
- [ ] 컴포넌트가 재사용 가능한지 확인
- [ ] 에러 처리가 사용자 친화적인지 확인
- [ ] 접근성이 고려되었는지 확인

---

## 📚 참고 자료

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0
