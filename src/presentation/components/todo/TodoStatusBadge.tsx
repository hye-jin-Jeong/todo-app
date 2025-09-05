interface TodoStatusCheckboxProps {
  status: 'PENDING' | 'COMPLETED'
  onToggle: () => void
  disabled?: boolean
}

export function TodoStatusCheckbox({ status, onToggle, disabled = false }: TodoStatusCheckboxProps) {
  const isCompleted = status === 'COMPLETED'

  return (
    <div className="flex items-center">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all duration-200
          ${isCompleted 
            ? 'border-green-500 bg-green-500 text-white hover:bg-green-600' 
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        `}
        aria-label={isCompleted ? '완료됨 - 클릭하여 미완료로 변경' : '미완료 - 클릭하여 완료로 변경'}
      >
        {isCompleted && (
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )}
      </button>
      <span className="ml-2 text-sm text-gray-600">
        {isCompleted ? '완료' : '미완료'}
      </span>
    </div>
  )
}
