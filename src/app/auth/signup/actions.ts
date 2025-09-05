'use server'

import { container } from '@/lib/container'
import { RegisterUserUseCase } from '@/application/auth/use-cases/register-user.use-case'

/**
 * 사용자 등록 서버 액션
 */
export async function registerUserAction(formData: FormData) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return { success: false, error: '이메일과 비밀번호를 입력해주세요.' }
  }

  try {
    // 동적으로 TYPES를 가져와서 순환 의존성 문제 해결
    const { TYPES } = await import('@/lib/types')
    const useCase = container.get<RegisterUserUseCase>(TYPES.registerUserUseCase)
    const result = await useCase.execute({ email, password })

    if (result.success) {
      return { success: true, redirectTo: '/login' }
    }

    return { success: false, error: result.error }
  } catch (error) {
    console.error('🚨 Register error:', error)
    const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}
