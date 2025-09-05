import { Todo } from '../entities';
import { TodoId } from '../types';
import { UserId } from '@/domain/auth/types';

/**
 * TodoRepository 인터페이스
 * 할일 데이터 접근 추상화
 */
export interface TodoRepository {
  /**
   * 할일 저장
   */
  save(todo: Todo): Promise<Todo>;

  /**
   * ID로 할일 조회
   */
  findById(id: TodoId): Promise<Todo | null>;

  /**
   * 사용자별 할일 목록 조회
   */
  findByUserId(userId: UserId): Promise<Todo[]>;

  /**
   * 상태별 할일 목록 조회
   */
  findByUserIdAndStatus(userId: UserId, status: string): Promise<Todo[]>;

  /**
   * 할일 삭제
   */
  delete(id: TodoId): Promise<void>;

  /**
   * 사용자의 모든 할일 삭제
   */
  deleteByUserId(userId: UserId): Promise<void>;
}
