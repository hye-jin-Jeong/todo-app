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

## 3. 할일 API

### 할일 생성
```typescript
// POST /todos
export async function createTodoAction(formData: FormData): Promise<ActionResult>

// 요청 데이터
{
  title: string;           // 할일 제목 (필수)
  description?: string;    // 할일 설명 (선택)
  dueDate?: string;        // 마감일 (ISO 8601 형식)
  priority?: 'low' | 'medium' | 'high'; // 우선순위
}

// 응답
{
  success: true;
  data: {
    todo: {
      id: string;
      title: string;
      description: string;
      status: 'pending';
      createdAt: string;
      updatedAt: string;
    };
  }
}
```

### 할일 목록 조회
```typescript
// GET /todos
export async function getTodosAction(): Promise<ActionResult>

// 응답
{
  success: true;
  data: {
    todos: Array<{
      id: string;
      title: string;
      description: string;
      status: 'pending' | 'completed' | 'cancelled';
      priority: 'low' | 'medium' | 'high';
      dueDate: string;
      createdAt: string;
      updatedAt: string;
    }>;
  }
}
```

### 할일 수정
```typescript
// PUT /todos/[id]
export async function updateTodoAction(
  todoId: string, 
  formData: FormData
): Promise<ActionResult>

// 요청 데이터
{
  title?: string;
  description?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// 응답
{
  success: true;
  data: {
    todo: {
      id: string;
      title: string;
      description: string;
      status: string;
      priority: string;
      dueDate: string;
      updatedAt: string;
    };
  }
}
```

### 할일 삭제
```typescript
// DELETE /todos/[id]
export async function deleteTodoAction(todoId: string): Promise<ActionResult>

// 응답
{
  success: true;
  message: "할일이 삭제되었습니다.";
}
```

---

## 4. 에러 코드

### 일반 에러
```typescript
// 400 Bad Request
{
  success: false;
  error: "VALIDATION_ERROR";
  message: "입력 데이터가 올바르지 않습니다.";
}

// 401 Unauthorized
{
  success: false;
  error: "UNAUTHORIZED";
  message: "인증이 필요합니다.";
}

// 403 Forbidden
{
  success: false;
  error: "FORBIDDEN";
  message: "접근 권한이 없습니다.";
}

// 404 Not Found
{
  success: false;
  error: "NOT_FOUND";
  message: "요청한 리소스를 찾을 수 없습니다.";
}

// 500 Internal Server Error
{
  success: false;
  error: "INTERNAL_ERROR";
  message: "서버 오류가 발생했습니다.";
}
```

### 도메인별 에러
```typescript
// 인증 관련
{
  success: false;
  error: "EMAIL_ALREADY_EXISTS";
  message: "이미 존재하는 이메일입니다.";
}

{
  success: false;
  error: "INVALID_CREDENTIALS";
  message: "이메일 또는 비밀번호가 올바르지 않습니다.";
}

// 할일 관련
{
  success: false;
  error: "TODO_NOT_FOUND";
  message: "할일을 찾을 수 없습니다.";
}

{
  success: false;
  error: "INVALID_TODO_STATUS";
  message: "올바르지 않은 할일 상태입니다.";
}
```

---

## 5. 인증/인가

### 인증 방식
- **세션 기반**: NextAuth.js 사용
- **JWT 토큰**: 서버 사이드에서 관리
- **쿠키**: HttpOnly 쿠키로 보안 강화

### 인가 레벨
```typescript
// 사용자별 접근 제어
export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

// 리소스별 접근 제어
export async function requireTodoOwnership(todoId: string, userId: string) {
  const todo = await todoRepository.findById(todoId);
  if (todo?.userId !== userId) {
    throw new ForbiddenError('할일 접근 권한이 없습니다.');
  }
}
```

### 보안 고려사항
- **CSRF 보호**: Next.js 기본 CSRF 보호
- **XSS 방지**: 입력 데이터 검증 및 이스케이프
- **SQL 인젝션 방지**: 파라미터화된 쿼리 사용
- **비밀번호 해싱**: bcrypt 사용

---

## 📚 사용 예시

### 클라이언트에서 서버 액션 호출
```typescript
// React 컴포넌트에서 사용
export function TodoForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createTodoAction(formData);
    
    if (result.success) {
      // 성공 처리
      console.log('할일이 생성되었습니다:', result.data.todo);
    } else {
      // 에러 처리
      console.error('에러:', result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="title" placeholder="할일 제목" required />
      <button type="submit">생성</button>
    </form>
  );
}
```

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

