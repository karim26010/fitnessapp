import { User, DashboardData, ProfileResponse, ProfileData, NutritionStatus } from '../types';

// Toggle this to false when your Django backend is running
const USE_MOCK = false;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
console.log('API_BASE configured as:', API_BASE);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getAuthHeaders = (tokenOverride?: string) => {
  const token = tokenOverride || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  };
};

export const api = {
  login: async (username: string, password: string): Promise<{ user: User, token: string }> => {

    if (USE_MOCK) {
      await delay(1000);
      throw new Error("Mock not supported");
    }
    console.log(`Calling API: ${API_BASE}/login/`);
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    console.log(`Login response status: ${res.status}`);
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  signup: async (username: string, email: string, password1: string): Promise<{ message: string }> => {
    if (USE_MOCK) {
      await delay(1000);
      return { message: "User created successfully" };
    }
    const res = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password1 }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.error || errorData.detail || Object.values(errorData)[0] || 'Signup failed';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
    return res.json();
  },

  getDashboardData: async (token?: string): Promise<{ user: User, data: DashboardData }> => {
    if (USE_MOCK) {
      await delay(500);
      throw new Error("Mock not supported");
    }
    const res = await fetch(`${API_BASE}/dashboard/`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Dashboard Fetch Error: ${res.status}`, errorText);
      throw new Error(`Failed to fetch dashboard data: ${res.status}`);
    }
    const data = await res.json();
    return { user: data.user || { username: 'User', email: 'user@example.com', avatarUrl: 'https://ui-avatars.com/api/?name=User', joinDate: '' }, data: data };
  },

  getProfile: async (token?: string): Promise<ProfileResponse> => {
    if (USE_MOCK) {
      await delay(500);
      throw new Error("Mock not supported");
    }
    const res = await fetch(`${API_BASE}/profile/`, {
      headers: getAuthHeaders(token)
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  updateWaterIntake: async (amount: number, isTotal: boolean = false, token?: string): Promise<number> => {
    if (USE_MOCK) {
      await delay(300);
      throw new Error("Mock not supported");
    }
    const res = await fetch(`${API_BASE}/log/water/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ amount_ml: amount }),
    });
    const data = await res.json();
    return data.new_total;
  },

  updateProfileData: async (data: Partial<ProfileData>, token?: string): Promise<ProfileData> => {
    if (USE_MOCK) {
      await delay(800);
      throw new Error("Mock not supported");
    }
    const res = await fetch(`${API_BASE}/profile/update/`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message = errorData.error || errorData.detail || Object.values(errorData)[0] || 'Failed to update profile';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
    return res.json();
  },

  logNutrition: async (data: { calories: number; protein: number; carbs: number; fat: number }, token?: string): Promise<NutritionStatus> => {
    if (USE_MOCK) {
      await delay(500);
      throw new Error("Mock not supported");
    }

    const res = await fetch(`${API_BASE}/log/nutrition/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to log nutrition');
    return res.json();
  }
};