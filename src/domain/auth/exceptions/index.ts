/**
 * Auth 도메인 기본 예외 클래스들
 */

export abstract class DomainException extends Error {
  readonly name: string;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidEmailError extends DomainException {
  readonly name = 'InvalidEmailError';
  
  constructor(email: string) {
    super(`유효하지 않은 이메일 형식입니다: ${email}`);
  }
}

export class UserNotFoundError extends DomainException {
  readonly name = 'UserNotFoundError';
  
  constructor(identifier: string) {
    super(`사용자를 찾을 수 없습니다: ${identifier}`);
  }
}

export class UserAlreadyExistsError extends DomainException {
  readonly name = 'UserAlreadyExistsError';
  
  constructor(email: string) {
    super(`이미 존재하는 사용자입니다: ${email}`);
  }
}

export class InvalidCredentialsError extends DomainException {
  readonly name = 'InvalidCredentialsError';
  
  constructor() {
    super('이메일 또는 비밀번호가 올바르지 않습니다.');
  }
}
