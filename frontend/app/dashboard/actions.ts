'use server'

import { api } from '../../services/api'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateWaterAction(amount: number, isTotal: boolean) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    await api.updateWaterIntake(amount, isTotal, token)
    revalidatePath('/dashboard')
}

export async function logNutritionAction(data: { calories: number; protein: number; carbs: number; fat: number }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    await api.logNutrition(data, token)
    revalidatePath('/dashboard')
}
