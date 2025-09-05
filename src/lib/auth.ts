import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { container } from '@/lib/container'
import { LoginUserUseCase } from '@/application/auth/use-cases'

export const {
	handlers,
	auth,
	signIn,
	signOut,
} = NextAuth({
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	// adapter: PrismaAdapter(prisma), // 주석 처리
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
				  return null
				}
			  
				try {
				  
				  // 동적으로 TYPES를 가져와서 순환 의존성 문제 해결
				  const { TYPES } = await import('@/lib/types')
				  const loginUseCase = container.get<LoginUserUseCase>(TYPES.loginUserUseCase)
				  const result = await loginUseCase.execute({
					email: credentials.email as string,
					password: credentials.password as string
				  })
			  
			  
				  if (result.success) {
					return {
					  id: result.data.id,
					  email: result.data.email.getValue(),
					  emailVerified: result.data.emailVerified
					}
				  }
			  
				  return null
				} catch (error) {
				  console.error('🚨 Auth error:', error)
				  return null
				}
			  }
		})
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async session({ session, token }) {
			
			if (session.user && token) {
				session.user.id = token.id as string
			}
			return session
		},
		async jwt({ token, user }) {
			
			if (user) {
				token.id = user.id
			}
			return token
		}
	},
	debug: process.env.NODE_ENV === 'development',
	secret: process.env.NEXTAUTH_SECRET,
})


