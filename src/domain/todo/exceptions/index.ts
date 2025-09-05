/**
 * Todo 도메인 기본 예외 클래스들
 */

export abstract class DomainException extends Error {
  readonly name: string;
  
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class TodoNotFoundError extends DomainException {
  readonly name = 'TodoNotFoundError';
  
  constructor(todoId: string) {
    super(`할일을 찾을 수 없습니다: ${todoId}`);
  }
}

export class InvalidTodoTitleError extends DomainException {
  readonly name = 'InvalidTodoTitleError';
  
  constructor(title: string) {
    super(`유효하지 않은 할일 제목입니다: ${title}`);
  }
}

export class InvalidTodoDescriptionError extends DomainException {
  readonly name = 'InvalidTodoDescriptionError';
  
  constructor(description: string) {
    super(`유효하지 않은 할일 설명입니다: ${description}`);
  }
}

export class InvalidTodoStatusError extends DomainException {
  readonly name = 'InvalidTodoStatusError';
  
  constructor(status: string) {
    super(`유효하지 않은 할일 상태입니다: ${status}`);
  }
}

export class InvalidTodoPriorityError extends DomainException {
  readonly name = 'InvalidTodoPriorityError';
  
  constructor(priority: string) {
    super(`유효하지 않은 할일 우선순위입니다: ${priority}`);
  }
}

export class TodoAccessDeniedError extends DomainException {
  readonly name = 'TodoAccessDeniedError';
  
  constructor(todoId: string, userId: string) {
    super(`할일 접근 권한이 없습니다. TodoId: ${todoId}, UserId: ${userId}`);
  }
}
