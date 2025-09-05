import { injectable, inject } from 'inversify';
import type { TodoRepository } from '@/domain/todo/repositories';
import { Todo } from '@/domain/todo/entities';
import { TodoTitle, TodoDescription, TodoPriorityValue } from '@/domain/todo/value-objects';
import { UserId } from '@/domain/auth/types';
import { TYPES } from '@/lib/types';

// Command DTO
export interface CreateTodoCommand {
  userId: UserId;
  title: string;
  description?: string;
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

export type CreateTodoResult = SuccessResult<Todo> | ErrorResult;

/**
 * CreateTodoUseCase
 * 할일 생성 비즈니스 로직 처리
 */
@injectable()
export class CreateTodoUseCase {
  constructor(
    @inject(TYPES.todoRepository) private todoRepository: TodoRepository
  ) {}

  async execute(command: CreateTodoCommand): Promise<CreateTodoResult> {
    try {
      // 1. 입력 검증 및 값 객체 생성
      const title = new TodoTitle(command.title);
      const description = command.description 
        ? new TodoDescription(command.description)
        : null;
      const priority = new TodoPriorityValue(command.priority || 'MEDIUM');

      // 2. 할일 생성
      const todo = Todo.create(
        command.userId,
        title,
        description,
        priority
      );

      // 3. 할일 저장
      const savedTodo = await this.todoRepository.save(todo);

      return {
        success: true,
        data: savedTodo
      };

    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: false,
        error: '할일 생성 중 오류가 발생했습니다.'
      };
    }
  }
}
