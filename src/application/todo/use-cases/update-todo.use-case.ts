import { injectable, inject } from 'inversify';
import type { TodoRepository } from '@/domain/todo/repositories';
import { Todo } from '@/domain/todo/entities';
import { TodoTitle, TodoDescription, TodoStatusValue, TodoPriorityValue } from '@/domain/todo/value-objects';
import { TodoId } from '@/domain/todo/types';
import { UserId } from '@/domain/auth/types';
import { TodoNotFoundError, TodoAccessDeniedError } from '@/domain/todo/exceptions';
import { TYPES } from '@/lib/types';

// Command DTO
export interface UpdateTodoCommand {
  todoId: TodoId;
  userId: UserId;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
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

export type UpdateTodoResult = SuccessResult<Todo> | ErrorResult;

/**
 * UpdateTodoUseCase
 * 할일 수정 비즈니스 로직 처리
 */
@injectable()
export class UpdateTodoUseCase {
  constructor(
    @inject(TYPES.todoRepository) private todoRepository: TodoRepository
  ) {}

  async execute(command: UpdateTodoCommand): Promise<UpdateTodoResult> {
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

      // 3. 업데이트할 필드들 적용
      let updatedTodo = existingTodo;

      if (command.title !== undefined) {
        const title = new TodoTitle(command.title);
        updatedTodo = updatedTodo.updateTitle(title);
      }

      if (command.description !== undefined) {
        const description = command.description 
          ? new TodoDescription(command.description)
          : null;
        updatedTodo = updatedTodo.updateDescription(description);
      }

      if (command.status !== undefined) {
        const status = new TodoStatusValue(command.status);
        updatedTodo = updatedTodo.changeStatus(status);
      }

      if (command.priority !== undefined) {
        const priority = new TodoPriorityValue(command.priority);
        updatedTodo = updatedTodo.changePriority(priority);
      }

      // 4. 할일 저장
      const savedTodo = await this.todoRepository.save(updatedTodo);

      return {
        success: true,
        data: savedTodo
      };

    } catch (error) {
      if (error instanceof TodoNotFoundError || 
          error instanceof TodoAccessDeniedError ||
          error instanceof Error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: false,
        error: '할일 수정 중 오류가 발생했습니다.'
      };
    }
  }
}
