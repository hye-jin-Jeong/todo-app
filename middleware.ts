export { auth as middleware } from '@/lib/auth'

export const config = {
	matcher: [
		'/todos/:path*',
		'/dashboard/:path*',
	],
}


