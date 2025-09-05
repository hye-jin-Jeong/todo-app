import { InvalidTodoPriorityError } from '../exceptions';

export type TodoPriority = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * TodoPriority 값 객체 - 우선순위 검증
 */
export class TodoPriorityValue {
  private readonly value: TodoPriority;

  constructor(priority: string) {
    if (!this.isValid(priority)) {
      throw new InvalidTodoPriorityError(priority);
    }
    this.value = priority as TodoPriority;
  }

  private isValid(priority: string): boolean {
    return ['LOW', 'MEDIUM', 'HIGH'].includes(priority);
  }

  equals(other: TodoPriorityValue): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): TodoPriority {
    return this.value;
  }

  /**
   * 우선순위가 높은지 확인
   */
  isHigh(): boolean {
    return this.value === 'HIGH';
  }

  /**
   * 우선순위가 중간인지 확인
   */
  isMedium(): boolean {
    return this.value === 'MEDIUM';
  }

  /**
   * 우선순위가 낮은지 확인
   */
  isLow(): boolean {
    return this.value === 'LOW';
  }

  /**
   * 우선순위 비교 (숫자로 변환)
   */
  getNumericValue(): number {
    const priorityMap: Record<TodoPriority, number> = {
      'LOW': 1,
      'MEDIUM': 2,
      'HIGH': 3
    };
    return priorityMap[this.value];
  }
}
