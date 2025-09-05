'use server'

import { signOut } from '@/lib/auth'

/**
 * 로그아웃 서버 액션
 */
export async function signOutAction() {
  try {
    await signOut({
      redirect: false,
    })
    
    return { success: true, redirectTo: '/login' }
  } catch (error) {
    console.error('🚨 Logout error:', error)
    const errorMessage = error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.'
    return { success: false, error: errorMessage }
  }
}

