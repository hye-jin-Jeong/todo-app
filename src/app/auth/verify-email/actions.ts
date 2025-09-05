'use server'

import { container } from '@/lib/container'
import { VerifyEmailUseCase } from '@/application/auth/use-cases/verify-email.use-case'

/**
 * 이메일 인증 서버 액션
 */
export async function verifyEmailAction(formData: FormData) {
  const userId = formData.get('userId')?.toString()
  const token = formData.get('token')?.toString()

  if (!userId || !token) {
    return { success: false, error: '인증 정보가 올바르지 않습니다.' }
  }

  try {
    // 동적으로 TYPES를 가져와서 순환 의존성 문제 해결
    const { TYPES } = await import('@/lib/types')
    const useCase = container.get<VerifyEmailUseCase>(TYPES.verifyEmailUseCase)
    const result = await useCase.execute({ userId, token })

    if (result.success) {
      return { success: true, redirectTo: '/login' }
    }

    return { success: false, error: result.error }
  } catch (error) {
    console.error('🚨 Verify email error:', error)
    const errorMessage = error instanceof Error ? error.message : '이메일 인증 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}
