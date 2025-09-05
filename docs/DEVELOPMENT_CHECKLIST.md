# 개발 체크리스트

## 📋 새 파일 생성 시 체크리스트

### 1. 파일 위치 확인
- [ ] **서버 액션**: `app/{route}/actions.ts`에 위치하는가?
- [ ] **유스케이스**: `application/{domain}/use-cases/`에 위치하는가?
- [ ] **리포지토리**: `infrastructure/{domain}/repositories/`에 위치하는가?
- [ ] **도메인 엔티티**: `domain/{domain}/entities/`에 위치하는가?

### 2. 파일명 컨벤션 확인
- [ ] **유스케이스**: `{name}.use-case.ts` 형식인가?
- [ ] **리포지토리**: `{technology}-{domain}.repository.ts` 형식인가?
- [ ] **서버 액션**: `actions.ts`로 명명되었는가?
- [ ] **컴포넌트**: `PascalCase.tsx` 형식인가?

### 3. DTO 구조 확인
- [ ] **DTO가 별도 폴더에 있지 않은가?**
- [ ] **Command/Result가 유스케이스 파일 내에 정의되었는가?**
- [ ] **타입 안전성이 보장되는가?** (`any` 타입 사용 금지)

### 4. 의존성 방향 확인
- [ ] **Presentation → Application → Domain ← Infrastructure** 방향을 준수하는가?
- [ ] **Domain 레이어에 외부 의존성이 없는가?**
- [ ] **Infrastructure가 Domain 인터페이스를 구현하는가?**

## 🔍 코드 리뷰 체크리스트

### 구조적 검토
- [ ] 레이어별 책임이 명확히 분리되었는가?
- [ ] 파일 위치가 해당 레이어의 역할에 맞는가?
- [ ] 네이밍 컨벤션이 일관되게 적용되었는가?

### 코드 품질 검토
- [ ] 타입 안전성이 보장되는가?
- [ ] 에러 처리가 적절한가?
- [ ] 비즈니스 로직이 도메인 레이어에 있는가?

## ⚠️ 자주 발생하는 위반 사항

### 1. 서버 액션 위치 오류
```typescript
// ❌ 잘못된 위치
src/presentation/actions/auth-actions.ts

// ✅ 올바른 위치
src/app/(auth)/signup/actions.ts
src/app/(auth)/login/actions.ts
```

### 2. 파일명 컨벤션 위반
```typescript
// ❌ 잘못된 명명
register-user-use-case.ts
prisma-user-repository.ts

// ✅ 올바른 명명
register-user.use-case.ts
postgres-user.repository.ts
```

### 3. DTO 구조 오류
```typescript
// ❌ 잘못된 구조
src/application/auth/dto/commands.ts
src/application/auth/dto/results.ts

// ✅ 올바른 구조
// 유스케이스 파일 내에 Command/Result 정의
```

## 🛠️ 개발 도구 설정

### ESLint 규칙 (권장)
```json
{
  "rules": {
    "naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase"]
      },
      {
        "selector": "typeLike", 
        "format": ["PascalCase"]
      }
    ]
  }
}
```

### VS Code 스니펫 (권장)
```json
{
  "Use Case Template": {
    "prefix": "usecase",
    "body": [
      "import { injectable, inject } from 'inversify';",
      "import { TYPES } from '@/lib/container';",
      "",
      "// Command DTO",
      "export interface ${1:Name}Command {",
      "  $2",
      "}",
      "",
      "// Result DTO", 
      "export interface SuccessResult<T> {",
      "  success: true;",
      "  data: T;",
      "}",
      "",
      "export interface ErrorResult {",
      "  success: false;",
      "  error: string;",
      "}",
      "",
      "export type ${1:Name}Result = SuccessResult<${3:DataType}> | ErrorResult;",
      "",
      "@injectable()",
      "export class ${1:Name}UseCase {",
      "  constructor(",
      "    @inject(TYPES.${4:Dependency}) private ${5:dependency}: ${6:DependencyType}",
      "  ) {}",
      "",
      "  async execute(command: ${1:Name}Command): Promise<${1:Name}Result> {",
      "    try {",
      "      $7",
      "      return { success: true, data: $8 } as SuccessResult<${3:DataType}>;",
      "    } catch (error) {",
      "      return { success: false, error: error.message } as ErrorResult;",
      "    }",
      "  }",
      "}"
    ],
    "description": "Create a new use case with proper DTO structure"
  }
}
```

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0


