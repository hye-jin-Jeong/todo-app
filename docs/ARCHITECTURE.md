# 아키텍처 가이드

## 📋 목차
1. [아키텍처 개요](#1-아키텍처-개요)
2. [레이어별 책임](#2-레이어별-책임)
3. [의존성 방향](#3-의존성-방향)
4. [도메인 모델링](#4-도메인-모델링)
5. [확장성 고려사항](#5-확장성-고려사항)

---

## 1. 아키텍처 개요

### 핵심 원칙
- **Domain-Driven Design (DDD)**: 비즈니스 로직 중심 설계
- **Clean Architecture**: 의존성 역전과 레이어 분리
- **Layered Architecture**: 명확한 책임 분리

### DDD 핵심 개념
- **유비쿼터스 언어**: 도메인 전문가와 개발자가 공통으로 사용하는 용어
- **바운디드 컨텍스트**: 도메인을 명확히 구분하는 경계
- **도메인 모델**: 엔티티, 값 객체, 도메인 서비스로 비즈니스 규칙 표현
- **도메인 이벤트**: 도메인에서 발생하는 중요한 사건들

### 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **데이터베이스**: PostgreSQL
- **디자인 시스템**: shadcn/ui
- **상태 관리**: Server Actions + React Context

---

## 2. 레이어별 책임

### 🎯 Domain Layer (도메인 레이어)
**핵심**: 비즈니스 로직과 도메인 규칙

```typescript
// 순수한 비즈니스 로직만
export class User {
  canChangePassword(currentPassword: string): boolean {
    return this.password.matches(currentPassword);
  }
}
```

**구성 요소**:
- **엔티티**: 비즈니스 객체 (User, Todo)
- **값 객체**: 불변 객체 (Email, Password)
- **도메인 서비스**: 복잡한 비즈니스 로직
- **리포지토리 인터페이스**: 데이터 접근 계약

### 🔧 Infrastructure Layer (인프라스트럭처 레이어)
**핵심**: 기술적 구현 세부사항

```typescript
// PostgreSQL 구현체
export class PostgresUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    // DB 저장 로직
  }
}
```

**구성 요소**:
- **리포지토리 구현체**: 데이터베이스 연동
- **외부 서비스**: 이메일, 알림 등
- **데이터베이스**: 연결 및 마이그레이션

### 🎮 Application Layer (애플리케이션 레이어)
**핵심**: 유스케이스 조정 및 워크플로우

```typescript
export class RegisterUserUseCase {
  async execute(command: RegisterUserCommand): Promise<Result> {
    // 1. 검증
    // 2. 도메인 객체 생성
    // 3. 저장
    // 4. 부수 효과 처리
  }
}
```

**구성 요소**:
- **유스케이스**: 비즈니스 시나리오
- **애플리케이션 서비스**: 유스케이스 조합
- **DTO**: 데이터 전송 객체

### 🎨 Presentation Layer (프레젠테이션 레이어)
**핵심**: 사용자 인터페이스와 상호작용

```typescript
// Next.js App Router
export default function LoginPage() {
  return <LoginForm />;
}

// 서버 액션
export async function loginAction(formData: FormData) {
  const useCase = container.get(LoginUseCase);
  return useCase.execute(extractData(formData));
}
```

**구성 요소**:
- **페이지**: Next.js 라우팅
- **컴포넌트**: UI 컴포넌트
- **서버 액션**: 폼 처리
- **훅**: 상태 관리

---

## 3. 의존성 방향

### 의존성 규칙
```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑           ↑
     └──────────────┴───────────┴───────────┘
```

### 핵심 원칙
1. **단방향 의존성**: 상위 레이어가 하위 레이어에만 의존
2. **역전 의존성**: Infrastructure가 Domain의 인터페이스를 구현
3. **도메인 순수성**: Domain은 외부 의존성 없음

### 예시
```typescript
// ✅ 올바른 의존성
class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,  // 인터페이스에 의존
    private emailService: EmailService
  ) {}
}

// ❌ 잘못된 의존성
class User {
  constructor(
    private db: Database  // 인프라에 직접 의존
  ) {}
}
```

---

## 4. 도메인 모델링

### 엔티티 (Entity)
**특징**: 고유한 식별자를 가지는 비즈니스 객체

```typescript
export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private readonly _password: Password
  ) {}

  // 비즈니스 메서드
  canChangePassword(currentPassword: string): boolean {
    return this._password.matches(currentPassword);
  }

  changePassword(newPassword: Password): User {
    return new User(this._id, this._email, newPassword);
  }
}
```

### 값 객체 (Value Object)
**특징**: 불변 객체, 식별자 없음, 값으로만 구분

```typescript
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new InvalidEmailError();
    }
    this.value = email.toLowerCase();
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

### 도메인 서비스
**특징**: 엔티티에 속하지 않는 복잡한 비즈니스 로직

```typescript
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async authenticateUser(email: Email, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.password.matches(password)) {
      return null;
    }
    return user;
  }
}
```

### 도메인 이벤트
**특징**: 도메인에서 발생하는 중요한 사건

```typescript
export class UserRegisteredEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: Email,
    public readonly occurredAt: Date
  ) {}
}

// 이벤트 핸들러
export class UserRegisteredHandler {
  async handle(event: UserRegisteredEvent): Promise<void> {
    // 환영 이메일 발송
    await this.emailService.sendWelcomeEmail(event.email);
  }
}
```

### 리포지토리 인터페이스
**특징**: 도메인 객체의 영속성을 추상화

```typescript
export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
```

---

## 5. 확장성 고려사항

### 모듈화 전략
- **도메인별 분리**: 각 도메인은 독립적인 폴더 구조
- **인터페이스 우선**: 구현체보다 인터페이스를 먼저 정의
- **이벤트 시스템**: 도메인 이벤트를 통한 느슨한 결합

### 바운디드 컨텍스트
```typescript
// 각 도메인은 독립적인 컨텍스트
domain/
├── auth/           # 인증 컨텍스트
├── todo/           # 할일 관리 컨텍스트
├── user/           # 사용자 관리 컨텍스트
└── shared/         # 공통 컨텍스트
```

### 이벤트 기반 아키텍처
```typescript
// 도메인 이벤트를 통한 느슨한 결합
export class TodoService {
  async completeTodo(todoId: TodoId): Promise<void> {
    const todo = await this.todoRepository.findById(todoId);
    todo.complete();
    await this.todoRepository.save(todo);
    
    // 이벤트 발행
    await this.eventBus.publish(new TodoCompletedEvent(todoId));
  }
}
```

### 성능 최적화
- **지연 로딩**: 필요할 때만 데이터 로드
- **캐싱**: 자주 사용되는 데이터 캐시
- **인덱싱**: 데이터베이스 성능 최적화
- **비동기 처리**: 이벤트 핸들러를 통한 비동기 작업

### 테스트 전략
- **단위 테스트**: 도메인 로직과 서비스
- **통합 테스트**: 리포지토리와 데이터베이스
- **E2E 테스트**: 사용자 시나리오
- **이벤트 테스트**: 도메인 이벤트 처리 검증

---

## 📚 참고 자료

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0
