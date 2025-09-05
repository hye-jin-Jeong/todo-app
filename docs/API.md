# API 문서

## 📋 목차
1. [서버 액션 API](#1-서버-액션-api)
2. [인증 API](#2-인증-api)
3. [할일 API](#3-할일-api)
4. [에러 코드](#4-에러-코드)
5. [인증/인가](#5-인증인가)

---

## 1. 서버 액션 API

### 기본 구조
```typescript
// 모든 서버 액션은 'use server' 지시어 사용
'use server'

export async function actionName(formData: FormData): Promise<ActionResult> {
  // 액션 로직
}
```

### 응답 형식
```typescript
interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

---

## 2. 인증 API

### 회원가입
```typescript
// POST /signup
export async function registerUserAction(formData: FormData): Promise<ActionResult>

// 요청 데이터
{
  email: string;      // 이메일 주소
  password: string;   // 비밀번호 (8자 이상)
  name: string;       // 사용자 이름
}

// 응답
{
  success: true;
  data: {
    userId: string;
    message: "회원가입이 완료되었습니다.";
  }
}
```

### 로그인
```typescript
// POST /login
export async function loginUserAction(formData: FormData): Promise<ActionResult>

// 요청 데이터
{
  email: string;      // 이메일 주소
  password: string;   // 비밀번호
}

// 응답
{
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    message: "로그인되었습니다.";
  }
}
```

### 로그아웃
```typescript
// POST /logout
export async function logoutUserAction(): Promise<ActionResult>

// 응답
{
  success: true;
  message: "로그아웃되었습니다.";
}
```

---

### 에러 처리
```typescript
// 전역 에러 처리
export async function handleActionError(error: unknown) {
  if (error instanceof ValidationError) {
    return { success: false, error: 'VALIDATION_ERROR', message: error.message };
  }
  
  if (error instanceof UnauthorizedError) {
    return { success: false, error: 'UNAUTHORIZED', message: '인증이 필요합니다.' };
  }
  
  // 기본 에러
  return { success: false, error: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' };
}
```

---

## 🔧 개발 도구

### API 테스트
```bash
# 서버 액션 테스트
npm run test:actions

# 통합 테스트
npm run test:integration

# E2E 테스트
npm run test:e2e
```

### 문서화
- **Swagger**: API 문서 자동 생성 (필요시)
- **TypeScript**: 타입 정의로 API 계약 명확화
- **JSDoc**: 함수별 상세 문서화

---

**마지막 업데이트**: 2024년 12월
**버전**: 1.0.0


