'use server'

import { cookies } from 'next/headers'
import { api } from '../../services/api'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
        const { token } = await api.login(username, password)
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        return { success: true }
    } catch (error) {
        return { message: 'Login failed' }
    }
}

export async function signupAction(prevState: any, formData: FormData) {
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        await api.signup(username, email, password)
        return { success: true, message: 'Account created successfully! Please log in.' }
    } catch (error: any) {
        return { success: false, message: error.message || 'Signup failed' }
    }
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    redirect('/')
}
