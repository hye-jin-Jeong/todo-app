# 파일 템플릿 가이드

## 📁 파일 생성 템플릿

### 1. 유스케이스 템플릿
```typescript
// application/{domain}/use-cases/{name}.use-case.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '@/lib/container';
import { {Domain}Repository } from '@/domain/{domain}/repositories';
import { {Domain}Entity } from '@/domain/{domain}/entities';

// Command DTO
export interface {Name}Command {
  // 입력 필드 정의
}

// Result DTO
export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface ErrorResult {
  success: false;
  error: string;
}

export type {Name}Result = SuccessResult<{DataType}> | ErrorResult;

@injectable()
export class {Name}UseCase {
  constructor(
    @inject(TYPES.{Domain}Repository) private {domain}Repository: {Domain}Repository
  ) {}

  async execute(command: {Name}Command): Promise<{Name}Result> {
    try {
      // 1. 입력 검증
      // 2. 비즈니스 로직 실행
      // 3. 결과 반환
      
      return { success: true, data: result } as SuccessResult<{DataType}>;
    } catch (error) {
      return { success: false, error: error.message } as ErrorResult;
    }
  }
}
```

### 2. 리포지토리 템플릿
```typescript
// infrastructure/{domain}/repositories/{technology}-{domain}.repository.ts
import { {Domain}Repository } from '@/domain/{domain}/repositories';
import { {Domain}Entity } from '@/domain/{domain}/entities';
import { {Technology}Client } from '@/lib/{technology}';

export class {Technology}{Domain}Repository implements {Domain}Repository {
  constructor(
    private readonly {technology}Client: {Technology}Client
  ) {}

  async findById(id: string): Promise<{Domain}Entity | null> {
    // 구현
  }

  async save(entity: {Domain}Entity): Promise<void> {
    // 구현
  }
}
```

### 3. 서버 액션 템플릿
```typescript
// app/{route}/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { container, TYPES } from '@/lib/container'
import { {Name}UseCase } from '@/application/{domain}/use-cases/{name}.use-case'

export async function {name}Action(_: unknown, formData: FormData) {
  const {field1} = formData.get('{field1}')?.toString()
  const {field2} = formData.get('{field2}')?.toString()

  if (!{field1} || !{field2}) {
    return { success: false, error: '필수 필드를 입력해주세요.' }
  }

  const useCase = container.get<{Name}UseCase>(TYPES.{Name}UseCase)
  const result = await useCase.execute({ {field1}, {field2} })

  if (result.success) {
    redirect('/{success-route}')
  }

  return { success: result.success, error: result.error }
}
```

### 4. 도메인 엔티티 템플릿
```typescript
// domain/{domain}/entities/{entity}.ts
import { {Entity}Id } from '../types';
import { {ValueObject} } from '../value-objects';

export class {Entity} {
  constructor(
    private readonly _id: {Entity}Id,
    private readonly _field1: {ValueObject},
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  // Getters
  get id(): {Entity}Id {
    return this._id;
  }

  get field1(): {ValueObject} {
    return this._field1;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // 비즈니스 메서드들
  businessMethod(): {Entity} {
    // 비즈니스 로직
    return new {Entity}(
      this._id,
      this._field1,
      this._createdAt,
      new Date()
    );
  }

  // 정적 팩토리 메서드
  static create(field1: {ValueObject}): {Entity} {
    const now = new Date();
    return new {Entity}(
      crypto.randomUUID(),
      field1,
      now,
      now
    );
  }
}
```

### 5. 값 객체 템플릿
```typescript
// domain/{domain}/value-objects/{value-object}.ts
import { Invalid{ValueObject}Error } from '../exceptions';

export class {ValueObject} {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Invalid{ValueObject}Error(value);
    }
    this.value = value;
  }

  private isValid(value: string): boolean {
    // 검증 로직
    return true;
  }

  equals(other: {ValueObject}): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
```

## 🎯 네이밍 규칙 요약

### 파일명 규칙
- **유스케이스**: `{kebab-case}.use-case.ts`
- **리포지토리**: `{technology}-{domain}.repository.ts`
- **서버 액션**: `actions.ts` (라우트 폴더 내)
- **엔티티**: `{kebab-case}.ts`
- **값 객체**: `{kebab-case}.ts`

### 클래스명 규칙
- **유스케이스**: `{PascalCase}UseCase`
- **리포지토리**: `{Technology}{Domain}Repository`
- **엔티티**: `{PascalCase}`
- **값 객체**: `{PascalCase}`

### 인터페이스명 규칙
- **Command**: `{PascalCase}Command`
- **Result**: `{PascalCase}Result`
- **Repository**: `{Domain}Repository`

## ⚠️ 주의사항

1. **DTO는 유스케이스 파일 내에 정의**
2. **서버 액션은 해당 라우트 폴더에 위치**
3. **파일명은 컨벤션을 정확히 준수**
4. **타입 안전성 보장** (`any` 타입 사용 금지)
5. **의존성 방향 준수** (Domain ← Infrastructure)

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0


