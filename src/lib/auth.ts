'use server'

import NextAuth from 'next-auth'
import Github from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const {
	handlers,
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'database',
	},
	providers: [
		Github,
	],
	pages: {},
	callbacks: {},
})


