'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getTodosAction } from './actions'
import { TodoList } from '@/presentation/components/todo/TodoList'
import { TodoForm } from '@/presentation/components/todo/TodoForm'

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

export default function TodosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [todos, setTodos] = useState<TodoDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 인증 확인
  useEffect(() => {
    if (status === 'loading') return // 로딩 중이면 대기
    
    if (!session?.user?.id) {
      router.push('/login')
      return
    }

    // 할일 목록 로드
    loadTodos()
  }, [session, status, router])

  const loadTodos = async () => {
    try {
      const todosResult = await getTodosAction()
      
      if (todosResult.success && todosResult.data) {
        setTodos(todosResult.data)
      }
    } catch (error) {
      console.error('할일 목록 로드 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTodoAdded = () => {
    // 할일 추가 후 목록 새로고침 (정렬이 적용된 상태로 로드됨)
    loadTodos()
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            할일 관리
          </h1>
          <p className="text-gray-600">
            할일을 추가하고 관리해보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 할일 추가 폼 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                새 할일 추가
              </h2>
              <TodoForm onTodoAdded={handleTodoAdded} />
            </div>
          </div>

          {/* 할일 목록 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                할일 목록
              </h2>
              <TodoList initialTodos={todos} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
