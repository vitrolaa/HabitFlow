import type { Habit, HabitCompletion, HabitStatistics } from '../types';
import { formatDate, getTodayString, shouldShowHabitOnDate, parseDate } from './dateUtils';

export const calculateStreak = (
    habit: Habit,
    completions: HabitCompletion[]
): { current: number; longest: number } => {
    const habitCompletions = completions
        .filter(c => c.habitId === habit.id && c.count >= habit.goal)
        .map(c => c.date)
        .sort()
        .reverse();

    if (habitCompletions.length === 0) {
        return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = getTodayString();
    const yesterday = formatDate(new Date(Date.now() - 86400000));

    // Check if we should count current streak
    let checkDate = habitCompletions[0] === today ? today : yesterday;
    let dateObj = parseDate(checkDate);

    for (let i = 0; i < 365; i++) {
        const dateStr = formatDate(dateObj);

        if (!shouldShowHabitOnDate(habit.frequency, habit.customDays, dateStr)) {
            dateObj.setDate(dateObj.getDate() - 1);
            continue;
        }

        if (habitCompletions.includes(dateStr)) {
            tempStreak++;
            if (i === 0 || (habitCompletions[0] === today && i < 30)) {
                currentStreak = tempStreak;
            }
        } else {
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
            if (i < 2) {
                currentStreak = 0;
            }
            tempStreak = 0;
        }

        dateObj.setDate(dateObj.getDate() - 1);
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
};

export const isHabitDueToday = (habit: Habit): boolean => {
    const today = getTodayString();
    return shouldShowHabitOnDate(habit.frequency, habit.customDays, today);
};

export const isHabitCompletedOnDate = (
    habit: Habit,
    date: string,
    completions: HabitCompletion[]
): boolean => {
    const completion = completions.find(c => c.habitId === habit.id && c.date === date);
    return (completion?.count || 0) >= habit.goal;
};

export const calculateCompletionRate = (
    habit: Habit,
    completions: HabitCompletion[],
    days: number
): number => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let expectedCompletions = 0;
    let actualCompletions = 0;

    for (let i = 0; i < days; i++) {
        const checkDate = new Date(endDate);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = formatDate(checkDate);

        if (shouldShowHabitOnDate(habit.frequency, habit.customDays, dateStr)) {
            expectedCompletions++;
            if (isHabitCompletedOnDate(habit, dateStr, completions)) {
                actualCompletions++;
            }
        }
    }

    return expectedCompletions > 0 ? (actualCompletions / expectedCompletions) * 100 : 0;
};

export const calculateHabitStatistics = (
    habit: Habit,
    completions: HabitCompletion[]
): HabitStatistics => {
    const streaks = calculateStreak(habit, completions);
    const habitCompletions = completions.filter(c => c.habitId === habit.id && c.count >= habit.goal);
    const completionRate = calculateCompletionRate(habit, completions, 30);

    const lastCompletion = habitCompletions
        .sort((a, b) => b.date.localeCompare(a.date))[0];

    return {
        habitId: habit.id,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        totalCompletions: habitCompletions.length,
        completionRate: Math.round(completionRate),
        lastCompleted: lastCompletion?.date,
    };
};

export const sortHabits = (habits: Habit[], sortBy: 'name' | 'created' | 'category'): Habit[] => {
    return [...habits].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        if (sortBy === 'created') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'category') {
            return a.category.localeCompare(b.category);
        }
        return 0;
    });
};

export const filterHabits = (
    habits: Habit[],
    category?: string,
    frequency?: string,
    dueToday?: boolean
): Habit[] => {
    return habits.filter(habit => {
        if (category && habit.category !== category) return false;
        if (frequency && habit.frequency !== frequency) return false;
        if (dueToday !== undefined && isHabitDueToday(habit) !== dueToday) return false;
        return true;
    });
};

export const generateHabitId = (): string => {
    return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
        health: '#ef4444',
        fitness: '#f59e0b',
        study: '#3b82f6',
        work: '#8b5cf6',
        personal: '#ec4899',
        custom: '#6366f1',
    };
    return colors[category] || colors.custom;
};
