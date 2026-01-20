'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Profile } from '@/components/Profile'
import { Layout } from '@/components/Layout'
import { ProfileData, Page, User } from '@/types'
import { updateProfileAction } from './actions'
import { logoutAction } from '@/app/actions/auth'

interface Props {
    profileData: ProfileData
    user: User
}

export default function ProfileWrapper({ profileData, user }: Props) {
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
            currentPage={Page.PROFILE}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            userAvatar={user.avatarUrl}
        >
            <Profile
                user={user}
                profileData={profileData}
                onUpdateProfile={async (data) => { await updateProfileAction(data); }}
            />
        </Layout>
    )
}
