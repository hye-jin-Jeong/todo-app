import { injectable, inject } from 'inversify';
import type { TodoRepository } from '@/domain/todo/repositories';
import { TodoId } from '@/domain/todo/types';
import { UserId } from '@/domain/auth/types';
import { TodoNotFoundError, TodoAccessDeniedError } from '@/domain/todo/exceptions';
import { TYPES } from '@/lib/types';

// Command DTO
export interface DeleteTodoCommand {
  todoId: TodoId;
  userId: UserId;
}

// Result DTO
export interface SuccessResult {
  success: true;
}

export interface ErrorResult {
  success: false;
  error: string;
}

export type DeleteTodoResult = SuccessResult | ErrorResult;

/**
 * DeleteTodoUseCase
 * 할일 삭제 비즈니스 로직 처리
 */
@injectable()
export class DeleteTodoUseCase {
  constructor(
    @inject(TYPES.todoRepository) private todoRepository: TodoRepository
  ) {}

  async execute(command: DeleteTodoCommand): Promise<DeleteTodoResult> {
    try {
      // 1. 할일 조회
      const existingTodo = await this.todoRepository.findById(command.todoId);
      if (!existingTodo) {
        throw new TodoNotFoundError(command.todoId);
      }

      // 2. 접근 권한 확인
      if (!existingTodo.canAccessBy(command.userId)) {
        throw new TodoAccessDeniedError(command.todoId, command.userId);
      }

      // 3. 할일 삭제
      await this.todoRepository.delete(command.todoId);

      return {
        success: true
      };

    } catch (error) {
      if (error instanceof TodoNotFoundError || 
          error instanceof TodoAccessDeniedError) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: false,
        error: '할일 삭제 중 오류가 발생했습니다.'
      };
    }
  }
}
