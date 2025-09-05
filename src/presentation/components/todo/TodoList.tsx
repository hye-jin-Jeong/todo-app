'use client'

import { useState, useEffect } from 'react'
import { TodoItem } from './TodoItem'

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

// 우선순위 정렬을 위한 유틸리티 함수
const sortTodosByPriority = (todos: TodoDTO[]): TodoDTO[] => {
  const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
  
  return [...todos].sort((a, b) => {
    // 1. 우선순위로 정렬 (높음 > 보통 > 낮음)
    const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
    if (priorityDiff !== 0) return priorityDiff
    
    // 2. 우선순위가 같으면 생성일로 정렬 (최신순)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

interface TodoListProps {
  initialTodos: TodoDTO[]
}

export function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<TodoDTO[]>(sortTodosByPriority(initialTodos))

  // initialTodos가 변경되면 로컬 상태 업데이트 (정렬 적용)
  useEffect(() => {
    setTodos(sortTodosByPriority(initialTodos))
  }, [initialTodos])
  
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL')

  // 필터링된 할일 목록도 정렬 적용
  const filteredTodos = sortTodosByPriority(todos.filter(todo => {
    if (filter === 'ALL') return true
    return todo.status === filter
  }))

  const handleTodoUpdate = (updatedTodo: TodoDTO) => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.map(todo => 
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
      return sortTodosByPriority(updatedTodos)
    })
  }

  const handleTodoDelete = (todoId: string) => {
    setTodos(prevTodos => {
      const filteredTodos = prevTodos.filter(todo => todo.id !== todoId)
      return sortTodosByPriority(filteredTodos)
    })
  }

  const getStatusCounts = () => {
    return {
      all: todos.length,
      pending: todos.filter(t => t.status === 'PENDING').length,
      completed: todos.filter(t => t.status === 'COMPLETED').length,
    }
  }

  const counts = getStatusCounts()

  return (
    <div className="space-y-4">
      {/* 필터 버튼들 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'ALL'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체 ({counts.all})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          미완료 ({counts.pending})
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filter === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          완료 ({counts.completed})
        </button>
      </div>

      {/* 할일 목록 */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>할일이 없습니다.</p>
            {filter !== 'ALL' && (
              <p className="text-sm mt-1">
                {filter === 'PENDING' && '미완료된 할일이 없습니다.'}
                {filter === 'COMPLETED' && '완료된 할일이 없습니다.'}
              </p>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleTodoUpdate}
              onDelete={handleTodoDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
