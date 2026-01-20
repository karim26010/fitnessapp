'use server'

import { api } from '../../services/api'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ProfileData } from '../../types'

export async function updateProfileAction(data: Partial<ProfileData>) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value
        await api.updateProfileData(data, token)
        revalidatePath('/profile')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        return { success: false, message: error.message }
    }
}
