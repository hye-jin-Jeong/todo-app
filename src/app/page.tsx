import { redirect } from 'next/navigation'

export default function Home() {
  // 메인 페이지에서 로그인 페이지로 리다이렉트
  redirect('/login')
}
