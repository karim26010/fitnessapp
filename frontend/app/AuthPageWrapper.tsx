'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { AuthPage } from '@/components/AuthPage'
import { loginAction, signupAction } from '@/app/actions/auth'

export default function AuthPageWrapper() {
    const router = useRouter()
    const [isSignup, setIsSignup] = React.useState(false)

    const handleLogin = async (u: string, p: string) => {
        const formData = new FormData()
        formData.append('username', u)
        formData.append('password', p)

        const res = await loginAction(null, formData)
        if (typeof res === 'object' && res?.success) {
            router.push('/dashboard')
        } else if (res?.message) {
            alert(res.message)
        }
    }

    const handleSignup = async (u: string, e: string, p: string) => {
        const formData = new FormData()
        formData.append('username', u)
        formData.append('email', e)
        formData.append('password', p)

        const res = await signupAction(null, formData)
        if (res?.success) {
            alert(res.message || 'Account created! Please log in.')
            setIsSignup(false) // Toggle to login mode
            // Optionally toggle to login mode automatically if we had state here, 
            // but the alert is enough for now.
        } else {
            alert(res?.message || 'Signup failed')
        }
    }

    return (
        <AuthPage
            onLogin={handleLogin}
            onSignup={handleSignup}
            isSignup={isSignup}
            setIsSignup={setIsSignup}
        />
    )
}
