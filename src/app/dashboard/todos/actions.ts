'use server'

import { auth } from '@/lib/auth'
import { container } from '@/lib/container'
import { TYPES } from '@/lib/types'
import { 
  CreateTodoUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
  GetTodosUseCase
} from '@/application/todo/use-cases'

/**
 * 할일 생성 액션
 */
export async function createTodoAction(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: '인증이 필요합니다.', redirectTo: '/login' }
  }

  const title = formData.get('title')?.toString()
  const description = formData.get('description')?.toString()
  const priority = formData.get('priority')?.toString()

  if (!title) {
    return { success: false, error: '제목을 입력해주세요.' }
  }

  try {
    const createTodoUseCase = container.get<CreateTodoUseCase>(TYPES.createTodoUseCase)
    
    const result = await createTodoUseCase.execute({
      userId: session.user.id,
      title,
      description: description || undefined,
      priority: priority || 'MEDIUM'
    })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    // Todo 엔티티를 일반 객체로 변환
    return { success: true, data: result.data.toPlainObject() }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '할일 생성 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}

/**
 * 할일 수정 액션
 */
export async function updateTodoAction(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: '인증이 필요합니다.', redirectTo: '/login' }
  }

  const todoId = formData.get('todoId')?.toString()
  const title = formData.get('title')?.toString()
  const description = formData.get('description')?.toString()
  const status = formData.get('status')?.toString()
  const priority = formData.get('priority')?.toString()

  if (!todoId) {
    return { success: false, error: '할일 ID가 필요합니다.' }
  }

  try {
    const updateTodoUseCase = container.get<UpdateTodoUseCase>(TYPES.updateTodoUseCase)
    
    const result = await updateTodoUseCase.execute({
      todoId,
      userId: session.user.id,
      title,
      description,
      status,
      priority
    })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    // Todo 엔티티를 일반 객체로 변환
    return { success: true, data: result.data.toPlainObject() }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '할일 수정 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}

/**
 * 할일 삭제 액션
 */
export async function deleteTodoAction(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: '인증이 필요합니다.', redirectTo: '/login' }
  }

  const todoId = formData.get('todoId')?.toString()

  if (!todoId) {
    return { success: false, error: '할일 ID가 필요합니다.' }
  }

  try {
    const deleteTodoUseCase = container.get<DeleteTodoUseCase>(TYPES.deleteTodoUseCase)
    
    const result = await deleteTodoUseCase.execute({
      todoId,
      userId: session.user.id
    })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '할일 삭제 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}

/**
 * 할일 목록 조회 액션
 */
export async function getTodosAction(status?: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: '인증이 필요합니다.', redirectTo: '/login' }
  }

  try {
    const getTodosUseCase = container.get<GetTodosUseCase>(TYPES.getTodosUseCase)
    
    const result = await getTodosUseCase.execute({
      userId: session.user.id,
      status
    })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    // Todo 엔티티를 일반 객체로 변환
    const plainTodos = result.data.map(todo => todo.toPlainObject())

    return { success: true, data: plainTodos }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '할일 목록 조회 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}
