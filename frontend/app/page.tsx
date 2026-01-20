import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthPageWrapper from './AuthPageWrapper'

export default async function HomePage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (token) {
        redirect('/dashboard')
    }
    return <AuthPageWrapper />
}
