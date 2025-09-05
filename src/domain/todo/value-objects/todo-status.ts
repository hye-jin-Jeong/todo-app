import { InvalidTodoStatusError } from '../exceptions';

export type TodoStatus = 'PENDING' | 'COMPLETED';

/**
 * TodoStatus 값 객체 - 상태 검증
 */
export class TodoStatusValue {
  private readonly value: TodoStatus;

  constructor(status: string) {
    if (!this.isValid(status)) {
      throw new InvalidTodoStatusError(status);
    }
    this.value = status as TodoStatus;
  }

  private isValid(status: string): boolean {
    return ['PENDING', 'COMPLETED'].includes(status);
  }

  equals(other: TodoStatusValue): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): TodoStatus {
    return this.value;
  }

  /**
   * 상태가 완료 상태인지 확인
   */
  isCompleted(): boolean {
    return this.value === 'COMPLETED';
  }

  /**
   * 상태가 미완료 상태인지 확인
   */
  isPending(): boolean {
    return this.value === 'PENDING';
  }

  /**
   * 상태를 토글 (완료 ↔ 미완료)
   */
  toggle(): TodoStatusValue {
    const newStatus = this.isCompleted() ? 'PENDING' : 'COMPLETED';
    return new TodoStatusValue(newStatus);
  }
}
