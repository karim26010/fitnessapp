export interface User {
  username: string;
  email: string;
  avatarUrl: string;
  joinDate: string;
}

export interface Macro {
  current: number;
  target: number;
  remaining: number;
  percent: number;
}

export interface NutritionStatus {
  calories: Macro;
  protein: Macro;
  carbs: Macro;
  fat: Macro;
}

export interface StatusMetric {
  today?: number;
  current?: number;
  target: number;
  percent?: number;
  difference?: number;
}

export interface Analytics {
  bmi: number;
  bmr: number;
  tdee: number;
  water_target_ml: number;
  sleep_target_hours: number;
  daily_calories: number;
  macros: {
    protein_g: number;
    fat_g: number;
    carbs_g: number;
  };
  water_status: StatusMetric;
  sleep_status: StatusMetric;
  weight_status: StatusMetric;
  nutrition_status: NutritionStatus;
}

export interface GraphPoint {
  date: string;
  value: number | null;
}

export interface GraphSeries {
  labels: string[];
  data: (number | null)[];
  unit: string;
  series: GraphPoint[];
}

export interface DashboardData {
  analytics: Analytics;
  graph_series: {
    hydration: GraphSeries;
    sleep: GraphSeries;
    weight: GraphSeries;
  };
}

export interface ProfileData {
  id: number;
  gender: 'male' | 'female' | 'other';
  age: number;
  height_cm: number;
  weight_kg: number;
  goal: string;
  goal_pace: string;
  target_weight_kg: number;
  fitness_level: string;
  activity_level: string;
  water_target_ml: number;
  // User ID reference
  user: number;
}

export interface ProfileResponse {
  profile: ProfileData;
  analytics: Analytics;
}

export enum Page {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  SURVEY = 'SURVEY',
  PROFILE = 'PROFILE',
}