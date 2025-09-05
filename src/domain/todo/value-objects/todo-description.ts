import { InvalidTodoDescriptionError } from '../exceptions';

/**
 * TodoDescription 값 객체 - 설명 검증
 */
export class TodoDescription {
  private readonly value: string;

  constructor(description: string) {
    if (!this.isValid(description)) {
      throw new InvalidTodoDescriptionError(description);
    }
    this.value = description.trim();
  }

  private isValid(description: string): boolean {
    const trimmed = description.trim();
    return trimmed.length <= 500;
  }

  equals(other: TodoDescription): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }

  /**
   * 빈 설명인지 확인
   */
  isEmpty(): boolean {
    return this.value.length === 0;
  }
}
