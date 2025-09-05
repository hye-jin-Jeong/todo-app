'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TodoStatusCheckbox } from './TodoStatusBadge'
import { TodoPriorityBadge } from './TodoPriorityBadge'
import { updateTodoAction, deleteTodoAction } from '@/app/dashboard/todos/actions'

// Todo DTO 타입 정의
type TodoDTO = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoItemProps {
  todo: TodoDTO
  onUpdate: (todo: TodoDTO) => void
  onDelete: (todoId: string) => void
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority
  })
  const router = useRouter()

  const handleStatusToggle = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const newStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
      const formData = new FormData()
      formData.append('todoId', todo.id)
      formData.append('status', newStatus)

      const result = await updateTodoAction(formData)
      
      if (result.success && result.data) {
        onUpdate(result.data)
      } else {
        // redirectTo가 있으면 리다이렉트 처리
        if (result.redirectTo) {
          router.push(result.redirectTo)
          return
        }
        setError(result.error || '알 수 없는 오류가 발생했습니다.')
      }
    } catch {
      setError('상태 변경 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말로 이 할일을 삭제하시겠습니까?')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('todoId', todo.id)

      const result = await deleteTodoAction(formData)
      
      if (result.success) {
        onDelete(todo.id)
      } else {
        // redirectTo가 있으면 리다이렉트 처리
        if (result.redirectTo) {
          router.push(result.redirectTo)
          return
        }
        setError(result.error || '알 수 없는 오류가 발생했습니다.')
      }
    } catch {
      setError('할일 삭제 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority
    })
    setError(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority
    })
    setError(null)
  }

  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('todoId', todo.id)
      formData.append('title', editForm.title)
      formData.append('description', editForm.description)
      formData.append('priority', editForm.priority)
      formData.append('status', todo.status) // 기존 상태 유지

      const result = await updateTodoAction(formData)
      
      if (result.success && result.data) {
        onUpdate(result.data)
        setIsEditing(false)
      } else {
        // redirectTo가 있으면 리다이렉트 처리
        if (result.redirectTo) {
          router.push(result.redirectTo)
          return
        }
        setError(result.error || '알 수 없는 오류가 발생했습니다.')
      }
    } catch {
      setError('할일 수정 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const isCompleted = todo.status === 'COMPLETED'

  return (
    <div className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            /* 수정 모드 */
            <div className="space-y-3">
              {/* 제목 입력 */}
              <div>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="할일 제목을 입력하세요"
                  disabled={isLoading}
                />
              </div>

              {/* 설명 입력 */}
              <div>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="할일 설명을 입력하세요 (선택사항)"
                  disabled={isLoading}
                />
              </div>

              {/* 우선순위 선택 */}
              <div>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="LOW">낮음</option>
                  <option value="MEDIUM">보통</option>
                  <option value="HIGH">높음</option>
                </select>
              </div>

              {/* 수정 버튼들 */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? '저장 중...' : '저장'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            /* 일반 모드 */
            <>
              {/* 제목 */}
              <h3 className={`text-lg font-medium mb-2 ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {todo.title}
              </h3>

              {/* 설명 */}
              {todo.description && (
                <p className={`mb-3 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}

              {/* 상태 체크박스 및 우선순위 */}
              <div className="flex items-center gap-4 mb-3">
                <TodoStatusCheckbox 
                  status={todo.status as 'PENDING' | 'COMPLETED'} 
                  onToggle={handleStatusToggle}
                  disabled={isLoading}
                />
                <TodoPriorityBadge priority={todo.priority as 'LOW' | 'MEDIUM' | 'HIGH'} />
              </div>

              {/* 생성일 */}
              <p className="text-xs text-gray-400">
                생성일: {todo.createdAt.toLocaleDateString('ko-KR')}
              </p>
            </>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600 mb-2">
              {error}
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        {!isEditing && (
          <div className="ml-4 flex gap-1">
            {/* 수정 버튼 */}
            <button
              onClick={handleEdit}
              disabled={isLoading}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
              title="할일 수정"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* 삭제 버튼 */}
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
              title="할일 삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
