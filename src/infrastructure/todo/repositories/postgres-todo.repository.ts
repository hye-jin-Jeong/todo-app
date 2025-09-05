import { injectable } from 'inversify';
import { TodoRepository } from '@/domain/todo/repositories';
import { Todo } from '@/domain/todo/entities';
import { TodoId } from '@/domain/todo/types';
import { TodoStatus } from '@/domain/todo/value-objects';
import { UserId } from '@/domain/auth/types';
import { prisma } from '@/lib/prisma';

/**
 * PrismaTodoRepository 구현체
 * TodoRepository 인터페이스의 Prisma 구현
 */
@injectable()
export class PrismaTodoRepository implements TodoRepository {
  /**
   * 할일 저장
   */
  async save(todo: Todo): Promise<Todo> {
    const todoData = {
      id: todo.id,
      userId: todo.userId,
      title: todo.title.getValue(),
      description: todo.description?.getValue() || null,
      status: todo.status.getValue(),
      priority: todo.priority.getValue(),
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    };

    const savedTodo = await prisma.todo.upsert({
      where: { id: todo.id },
      update: {
        title: todoData.title,
        description: todoData.description,
        status: todoData.status,
        priority: todoData.priority,
        updatedAt: todoData.updatedAt
      },
      create: todoData
    });

    return Todo.fromData(savedTodo);
  }

  /**
   * ID로 할일 조회
   */
  async findById(id: TodoId): Promise<Todo | null> {
    const todo = await prisma.todo.findUnique({
      where: { id }
    });

    if (!todo) {
      return null;
    }

    return Todo.fromData(todo);
  }

  /**
   * 사용자별 할일 목록 조회
   */
  async findByUserId(userId: UserId): Promise<Todo[]> {
    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return todos.map(todo => Todo.fromData(todo));
  }

  /**
   * 상태별 할일 목록 조회
   */
  async findByUserIdAndStatus(userId: UserId, status: TodoStatus): Promise<Todo[]> {
    const todos = await prisma.todo.findMany({
      where: { 
        userId,
        status: status
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return todos.map(todo => Todo.fromData(todo));
  }

  /**
   * 할일 삭제
   */
  async delete(id: TodoId): Promise<void> {
    await prisma.todo.delete({
      where: { id }
    });
  }

  /**
   * 사용자의 모든 할일 삭제
   */
  async deleteByUserId(userId: UserId): Promise<void> {
    await prisma.todo.deleteMany({
      where: { userId }
    });
  }
}
