'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOutAction } from '../auth/logout/actions'
import { useSession } from 'next-auth/react'
import { TodoList } from '@/presentation/components/todo/TodoList'
import { TodoForm } from '@/presentation/components/todo/TodoForm'
import { getTodosAction } from './todos/actions'

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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [todos, setTodos] = useState<TodoDTO[]>([])
  const [isLoadingTodos, setIsLoadingTodos] = useState(true)
  const router = useRouter()

  // 투두 목록 로드
  const loadTodos = async () => {
    try {
      const result = await getTodosAction()
      if (result.success && result.data) {
        setTodos(result.data)
      }
    } catch (error) {
      console.error('Failed to load todos:', error)
    } finally {
      setIsLoadingTodos(false)
    }
  }

  // 컴포넌트 마운트 시 투두 목록 로드
  useEffect(() => {
    if (session?.user?.id) {
      loadTodos()
    }
  }, [session?.user?.id])

  async function handleLogout() {
    setIsLoggingOut(true)
    
    try {
      const result = await signOutAction()
      if (result.success) {
        // 클라이언트에서 리다이렉트 처리
        router.push(result.redirectTo || '/login')
      } else {
        console.error('Logout failed:', result.error)
        // 에러가 발생해도 세션이 만료되었을 가능성이 높으므로 로그인 페이지로 이동
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // 에러가 발생해도 로그인 페이지로 이동
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            로그인이 필요합니다
          </h1>
          <a
            href="/login"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            로그인하기
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Todo App Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                안녕하세요, {session.user.email || '사용자'}님!
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
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
                <TodoForm onTodoAdded={loadTodos} />
              </div>
            </div>

            {/* 할일 목록 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  할일 목록
                </h2>
                {isLoadingTodos ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">로딩 중...</div>
                  </div>
                ) : (
                  <TodoList initialTodos={todos} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}