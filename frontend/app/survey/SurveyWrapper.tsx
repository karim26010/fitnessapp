'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Survey } from '@/components/Survey'
import { Layout } from '@/components/Layout'
import { ProfileData, Page, User } from '@/types'
import { updateProfileAction } from '@/app/profile/actions'
import { logoutAction } from '@/app/actions/auth'

interface Props {
    currentStats: ProfileData
    user: User
}

export default function SurveyWrapper({ currentStats, user }: Props) {
    const router = useRouter()

    const handleNavigate = (page: Page) => {
        const path = page === Page.DASHBOARD ? '/dashboard' :
            page === Page.PROFILE ? '/profile' :
                page === Page.SURVEY ? '/survey' : '/dashboard'
        router.push(path)
    }

    const handleLogout = async () => {
        await logoutAction()
    }

    return (
        <Layout
            currentPage={Page.SURVEY}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            userAvatar={user.avatarUrl}
        >
            <Survey
                currentStats={currentStats}
                onUpdate={async (data) => {
                    const res = await updateProfileAction(data)
                    if (res?.success) {
                        router.push('/dashboard')
                    } else {
                        alert(res?.message || 'Failed to update profile')
                    }
                }}
            />
        </Layout>
    )
}
