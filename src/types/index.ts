export type FrequencyType = 'daily' | 'weekly' | 'custom';

export type CategoryType = 'health' | 'fitness' | 'study' | 'work' | 'personal' | 'custom';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday

export interface Habit {
    id: string;
    name: string;
    description: string;
    category: CategoryType;
    frequency: FrequencyType;
    customDays?: WeekDay[]; // Used when frequency is 'custom'
    time?: string; // Format: "HH:MM"
    goal: number; // Target completions per period
    color: string; // Hex color
    icon: CategoryType;
    createdAt: string;
}

export interface HabitCompletion {
    habitId: string;
    date: string; // Format: "YYYY-MM-DD"
    completedAt: string; // ISO timestamp
    count: number; // Current count of completions for this day
}

export interface HabitStatistics {
    habitId: string;
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    completionRate: number; // Percentage (0-100)
    lastCompleted?: string;
}

export interface DashboardStats {
    totalHabits: number;
    completedToday: number;
    completionRateToday: number;
    completionRateWeek: number;
    completionRateMonth: number;
    activeStreaks: number;
}
