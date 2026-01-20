import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { api } from '../../services/api'
import SurveyWrapper from './SurveyWrapper'

export default async function SurveyPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        redirect('/')
    }

    let profileData;
    let user;
    try {
        const dash = await api.getDashboardData(token);
        user = dash.user;

        const prof = await api.getProfile(token);
        profileData = prof.profile;
    } catch (e) {
        redirect('/')
    }

    return <SurveyWrapper currentStats={profileData} user={user} />
}
