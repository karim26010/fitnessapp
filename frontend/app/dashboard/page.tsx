import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { api } from '../../services/api'
import DashboardWrapper from './DashboardWrapper'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        redirect('/')
    }

    let dashboardData;
    let fetchError = false;
    try {
        dashboardData = await api.getDashboardData(token);
    } catch (e) {
        console.error("Dashboard Fetch Error:", e);
        fetchError = true;
    }

    if (fetchError) {
        redirect('/')
    }

    if (!dashboardData || dashboardData.data.survey_completed === false) {
        redirect('/survey')
    }

    return <DashboardWrapper data={dashboardData.data} user={dashboardData.user} />
}
