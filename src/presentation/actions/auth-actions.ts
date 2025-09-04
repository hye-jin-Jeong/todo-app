'use server'

import { signIn, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function signInAction(_: unknown, formData: FormData) {
	const provider = formData.get('provider')?.toString() || 'github'
	await signIn(provider)
	redirect('/')
}

export async function signOutAction() {
	await signOut()
	redirect('/login')
}


