'use server'

import { signIn } from '@/lib/auth'

/**
 * 사용자 로그인 (Credentials)
 * Auth.js가 내부적으로 DDD 유스케이스를 사용하도록 설정됨
 */
export async function loginUserAction(formData: FormData) {
  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email || !password) {
    return { success: false, error: '이메일과 비밀번호를 입력해주세요.' }
  }

  try {
    
    // Auth.js를 통한 로그인 (내부적으로 LoginUserUseCase 사용)
    const result = await signIn('credentials', { 
      email, 
      password, 
      redirect: false 
    })


    if (result?.error) {
      return { success: false, error: '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.' }
    }

    return { success: true, redirectTo: '/dashboard' }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}
