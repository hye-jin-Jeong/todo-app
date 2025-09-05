import { TodoId } from '../types';
import { UserId } from '@/domain/auth/types';
import { TodoTitle, TodoDescription, TodoStatusValue, TodoPriorityValue } from '../value-objects';

/**
 * Todo 엔티티 - 할일 비즈니스 로직
 */
export class Todo {
  constructor(
    private readonly _id: TodoId,
    private readonly _userId: UserId,
    private readonly _title: TodoTitle,
    private readonly _description: TodoDescription | null,
    private readonly _status: TodoStatusValue,
    private readonly _priority: TodoPriorityValue,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date
  ) {}

  // Getters
  get id(): TodoId {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get title(): TodoTitle {
    return this._title;
  }

  get description(): TodoDescription | null {
    return this._description;
  }

  get status(): TodoStatusValue {
    return this._status;
  }

  get priority(): TodoPriorityValue {
    return this._priority;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * 제목 업데이트
   */
  updateTitle(title: TodoTitle): Todo {
    return new Todo(
      this._id,
      this._userId,
      title,
      this._description,
      this._status,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  /**
   * 설명 업데이트
   */
  updateDescription(description: TodoDescription | null): Todo {
    return new Todo(
      this._id,
      this._userId,
      this._title,
      description,
      this._status,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  /**
   * 상태 변경
   */
  changeStatus(status: TodoStatusValue): Todo {
    return new Todo(
      this._id,
      this._userId,
      this._title,
      this._description,
      status,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  /**
   * 상태 토글 (완료 ↔ 미완료)
   */
  toggleStatus(): Todo {
    const newStatus = this._status.toggle();
    return new Todo(
      this._id,
      this._userId,
      this._title,
      this._description,
      newStatus,
      this._priority,
      this._createdAt,
      new Date()
    );
  }

  /**
   * 우선순위 변경
   */
  changePriority(priority: TodoPriorityValue): Todo {
    return new Todo(
      this._id,
      this._userId,
      this._title,
      this._description,
      this._status,
      priority,
      this._createdAt,
      new Date()
    );
  }

  /**
   * 사용자 접근 권한 확인
   */
  canAccessBy(userId: UserId): boolean {
    return this._userId === userId;
  }

  /**
   * 할일 완료 여부 확인
   */
  isCompleted(): boolean {
    return this._status.isCompleted();
  }


  /**
   * 할일 대기 중 여부 확인
   */
  isPending(): boolean {
    return this._status.isPending();
  }

  /**
   * 정적 팩토리 메서드: 새 할일 생성
   */
  static create(
    userId: UserId,
    title: TodoTitle,
    description: TodoDescription | null = null,
    priority: TodoPriorityValue
  ): Todo {
    const now = new Date();
    return new Todo(
      crypto.randomUUID(), // 임시 ID, 실제로는 Repository에서 생성
      userId,
      title,
      description,
      new TodoStatusValue('PENDING'),
      priority,
      now,
      now
    );
  }

  /**
   * 정적 팩토리 메서드: 데이터베이스에서 복원
   */
  static fromData(data: {
    id: TodoId;
    userId: UserId;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    createdAt: Date;
    updatedAt: Date;
  }): Todo {
    return new Todo(
      data.id,
      data.userId,
      new TodoTitle(data.title),
      data.description ? new TodoDescription(data.description) : null,
      new TodoStatusValue(data.status),
      new TodoPriorityValue(data.priority),
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * 일반 객체로 변환 (Client Component 전달용)
   */
  toPlainObject(): {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this._id,
      userId: this._userId,
      title: this._title.getValue(),
      description: this._description?.getValue() || null,
      status: this._status.getValue(),
      priority: this._priority.getValue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
