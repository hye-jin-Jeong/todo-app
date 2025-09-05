import { InvalidTodoTitleError } from '../exceptions';

/**
 * TodoTitle 값 객체 - 제목 검증
 */
export class TodoTitle {
  private readonly value: string;

  constructor(title: string) {
    if (!this.isValid(title)) {
      throw new InvalidTodoTitleError(title);
    }
    this.value = title.trim();
  }

  private isValid(title: string): boolean {
    const trimmed = title.trim();
    return trimmed.length >= 1 && trimmed.length <= 100;
  }

  equals(other: TodoTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }
}
