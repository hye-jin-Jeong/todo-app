import { injectable, inject } from 'inversify';
import type { TodoRepository } from '@/domain/todo/repositories';
import { Todo } from '@/domain/todo/entities';
import { UserId } from '@/domain/auth/types';
import { TYPES } from '@/lib/types';

// Command DTO
export interface GetTodosCommand {
  userId: UserId;
  status?: string;
}

// Result DTO
export interface SuccessResult<T> {
  success: true;
  data: T;
}

export interface ErrorResult {
  success: false;
  error: string;
}

export type GetTodosResult = SuccessResult<Todo[]> | ErrorResult;

/**
 * GetTodosUseCase
 * 할일 목록 조회 비즈니스 로직 처리
 */
@injectable()
export class GetTodosUseCase {
  constructor(
    @inject(TYPES.todoRepository) private todoRepository: TodoRepository
  ) {}

  async execute(command: GetTodosCommand): Promise<GetTodosResult> {
    try {
      // 1. 할일 목록 조회
      let todos: Todo[];
      
      if (command.status) {
        todos = await this.todoRepository.findByUserIdAndStatus(
          command.userId, 
          command.status
        );
      } else {
        todos = await this.todoRepository.findByUserId(command.userId);
      }

      return {
        success: true,
        data: todos
      };

    } catch (error) {
        console.error('🚨 GetTodosUseCase error:', error);
      return {
        success: false,
        error: '할일 목록 조회 중 오류가 발생했습니다.'
      };
    }
  }
}
