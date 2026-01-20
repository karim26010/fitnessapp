import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { api } from '../../services/api'
import ProfileWrapper from './ProfileWrapper'

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        redirect('/')
    }

    let profileData;
    let user;
    try {
        // We need both profile stats and user info. 
        // Usually getDashboardData gives both, but let's see. 
        // User info is also in getProfile response if updated? 
        // Actually getProfile returns ProfileResponse which has profile: ProfileData.
        // We also need user data (avatar, etc).
        // Let's call dashboard to get user info easily or we could rely on stored user info if we had it.
        // For simplicity, let's fetch dashboard to get the User object.
        const dash = await api.getDashboardData(token);
        user = dash.user;

        // Then get detailed profile
        const prof = await api.getProfile(token);
        profileData = prof.profile;
    } catch (e) {
        redirect('/')
    }

    return <ProfileWrapper profileData={profileData} user={user} />
}
