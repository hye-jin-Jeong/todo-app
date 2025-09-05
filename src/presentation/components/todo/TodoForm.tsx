'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTodoAction } from '@/app/dashboard/todos/actions'

interface TodoFormProps {
  onTodoAdded?: () => void
}

export function TodoForm({ onTodoAdded }: TodoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await createTodoAction(formData)
      
      if (result.success) {
        setSuccess(true)
        // 폼 리셋
        const form = document.getElementById('todo-form') as HTMLFormElement
        form?.reset()
        // 콜백 호출하여 목록 업데이트
        onTodoAdded?.()
      } else {
        // redirectTo가 있으면 리다이렉트 처리
        if (result.redirectTo) {
          router.push(result.redirectTo)
          return
        }
        setError(result.error || '알 수 없는 오류가 발생했습니다.')
      }
    } catch {
      setError('할일 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form id="todo-form" action={handleSubmit} className="space-y-4">
      {/* 제목 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          제목 *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={100}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="할일 제목을 입력하세요"
        />
      </div>

      {/* 설명 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          설명
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="할일 설명을 입력하세요 (선택사항)"
        />
      </div>

      {/* 우선순위 */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          우선순위
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue="MEDIUM"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="LOW">낮음</option>
          <option value="MEDIUM">보통</option>
          <option value="HIGH">높음</option>
        </select>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 성공 메시지 */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">할일이 성공적으로 추가되었습니다!</p>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '추가 중...' : '할일 추가'}
      </button>
    </form>
  )
}
