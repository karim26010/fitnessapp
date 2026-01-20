'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Dashboard } from '@/components/Dashboard'
import { Layout } from '@/components/Layout'
import { DashboardData, Page, User } from '@/types'
import { updateWaterAction, logNutritionAction } from './actions'
import { logoutAction } from '@/app/actions/auth'

interface Props {
    data: DashboardData
    user: User
}

export default function DashboardWrapper({ data, user }: Props) {
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
            currentPage={Page.DASHBOARD}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            userAvatar={user.avatarUrl}
        >
            <Dashboard
                data={data}
                updateWater={(amount, isTotal) => updateWaterAction(amount, isTotal || false)}
                logNutrition={(d) => logNutritionAction(d)}
            />
        </Layout>
    )
}
