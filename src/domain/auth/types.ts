/**
 * Auth 도메인 기본 타입 정의
 * Auth.js와 호환되는 최소한의 타입들
 */

// 기본 식별자 타입
export type UserId = string;
export type EmailValue = string;

// Auth.js 호환 타입들
export interface AuthUser {
  id: UserId;
  email: EmailValue;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 결과 타입 (에러 처리용)
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
