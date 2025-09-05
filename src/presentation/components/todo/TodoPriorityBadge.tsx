interface TodoPriorityBadgeProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

export function TodoPriorityBadge({ priority }: TodoPriorityBadgeProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return {
          label: '낮음',
          className: 'bg-gray-100 text-gray-800'
        }
      case 'MEDIUM':
        return {
          label: '보통',
          className: 'bg-blue-100 text-blue-800'
        }
      case 'HIGH':
        return {
          label: '높음',
          className: 'bg-red-100 text-red-800'
        }
      default:
        return {
          label: '알 수 없음',
          className: 'bg-gray-100 text-gray-800'
        }
    }
  }

  const config = getPriorityConfig(priority)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
