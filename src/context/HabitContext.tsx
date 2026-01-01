import React, { createContext, useCallback, useMemo } from 'react';
import type { Habit, HabitCompletion, DashboardStats } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
    generateHabitId,
    calculateHabitStatistics,
    isHabitDueToday,
    isHabitCompletedOnDate,
} from '../utils/habitUtils';
import { getTodayString, getDateRange } from '../utils/dateUtils';

interface HabitContextType {
    habits: Habit[];
    completions: HabitCompletion[];
    addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    toggleCompletion: (habitId: string, date?: string) => void;
    getHabitStats: (habitId: string) => ReturnType<typeof calculateHabitStatistics>;
    getDashboardStats: () => DashboardStats;
    isCompleted: (habitId: string, date?: string) => boolean;
}

export const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
    const [completions, setCompletions] = useLocalStorage<HabitCompletion[]>('completions', []);

    const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt'>) => {
        const newHabit: Habit = {
            ...habit,
            id: generateHabitId(),
            createdAt: new Date().toISOString(),
        };
        setHabits(prev => [...prev, newHabit]);
    }, [setHabits]);

    const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    }, [setHabits]);

    const deleteHabit = useCallback((id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id));
        setCompletions(prev => prev.filter(c => c.habitId !== id));
    }, [setHabits, setCompletions]);

    const toggleCompletion = useCallback((habitId: string, date?: string) => {
        const targetDate = date || getTodayString();
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        setCompletions(prev => {
            const existing = prev.find(c => c.habitId === habitId && c.date === targetDate);
            if (existing) {
                if (existing.count >= habit.goal) {
                    return prev.filter(c => !(c.habitId === habitId && c.date === targetDate));
                }
                return prev.map(c =>
                    (c.habitId === habitId && c.date === targetDate)
                        ? { ...c, count: c.count + 1, completedAt: new Date().toISOString() }
                        : c
                );
            } else {
                const newCompletion: HabitCompletion = {
                    habitId,
                    date: targetDate,
                    completedAt: new Date().toISOString(),
                    count: 1,
                };
                return [...prev, newCompletion];
            }
        });
    }, [habits, setCompletions]);

    const getHabitStats = useCallback((habitId: string) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) {
            return {
                habitId,
                currentStreak: 0,
                longestStreak: 0,
                totalCompletions: 0,
                completionRate: 0,
            };
        }
        return calculateHabitStatistics(habit, completions);
    }, [habits, completions]);

    const getDashboardStats = useCallback((): DashboardStats => {
        const today = getTodayString();
        const todayHabits = habits.filter(h => isHabitDueToday(h));
        const completedToday = todayHabits.filter(h =>
            isHabitCompletedOnDate(h, today, completions)
        ).length;

        // Calculate rates for periods

        const calculateRateForPeriod = (days: number): number => {
            const { start } = getDateRange(days);
            let expected = 0;
            let completed = 0;

            habits.forEach(habit => {
                const dates = Array.from({ length: days }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                });

                dates.forEach(date => {
                    if (date >= start && isHabitDueToday(habit)) {
                        expected++;
                        if (isHabitCompletedOnDate(habit, date, completions)) {
                            completed++;
                        }
                    }
                });
            });

            return expected > 0 ? (completed / expected) * 100 : 0;
        };

        const activeStreaks = habits.filter(h => {
            const stats = calculateHabitStatistics(h, completions);
            return stats.currentStreak > 0;
        }).length;

        return {
            totalHabits: habits.length,
            completedToday,
            completionRateToday: todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0,
            completionRateWeek: calculateRateForPeriod(7),
            completionRateMonth: calculateRateForPeriod(30),
            activeStreaks,
        };
    }, [habits, completions]);

    const isCompleted = useCallback((habitId: string, date?: string) => {
        const targetDate = date || getTodayString();
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return false;
        return isHabitCompletedOnDate(habit, targetDate, completions);
    }, [habits, completions]);

    const value = useMemo(() => ({
        habits,
        completions,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        getHabitStats,
        getDashboardStats,
        isCompleted,
    }), [habits, completions, addHabit, updateHabit, deleteHabit, toggleCompletion, getHabitStats, getDashboardStats, isCompleted]);

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
};
