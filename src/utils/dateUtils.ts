import type { FrequencyType, WeekDay } from '../types';

export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const parseDate = (dateString: string): Date => {
    return new Date(dateString + 'T00:00:00');
};

export const isToday = (dateString: string): boolean => {
    const today = formatDate(new Date());
    return dateString === today;
};

export const getTodayString = (): string => {
    return formatDate(new Date());
};

export const getWeekDay = (date: Date): WeekDay => {
    return date.getDay() as WeekDay;
};

export const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
    return date >= startDate && date <= endDate;
};

export const getDateRange = (days: number): { start: string; end: string } => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    return {
        start: formatDate(start),
        end: formatDate(end),
    };
};

export const getMonthDates = (year: number, month: number): Date[] => {
    const dates: Date[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        dates.push(new Date(year, month, day));
    }

    return dates;
};

export const getMonthName = (month: number): string => {
    const names = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return names[month];
};

export const getWeekDayName = (weekDay: WeekDay): string => {
    const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return names[weekDay];
};

export const shouldShowHabitOnDate = (
    frequency: FrequencyType,
    customDays: WeekDay[] | undefined,
    dateString: string
): boolean => {
    if (frequency === 'daily') {
        return true;
    }

    const date = parseDate(dateString);
    const weekDay = getWeekDay(date);

    if (frequency === 'weekly') {
        // Show on weekdays (Monday-Friday)
        return weekDay >= 1 && weekDay <= 5;
    }

    if (frequency === 'custom' && customDays) {
        return customDays.includes(weekDay);
    }

    return false;
};

export const getDaysBetween = (date1: string, date2: string): number => {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatTime = (time: string | undefined): string => {
    if (!time) return '';
    return time;
};
