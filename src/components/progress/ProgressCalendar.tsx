import React from 'react';
import { useHabits } from '../../hooks/useHabits';
import { getMonthDates, getMonthName, getTodayString, formatDate } from '../../utils/dateUtils';
import { isHabitCompletedOnDate } from '../../utils/habitUtils';
import { Card } from '../common/Card';
import './ProgressCalendar.css';

interface ProgressCalendarProps {
    habitId?: string;
    year?: number;
    month?: number;
}

export const ProgressCalendar: React.FC<ProgressCalendarProps> = ({
    habitId,
    year = new Date().getFullYear(),
    month = new Date().getMonth(),
}) => {
    const { habits, completions } = useHabits();
    const dates = getMonthDates(year, month);
    const today = getTodayString();

    const habit = habitId ? habits.find(h => h.id === habitId) : null;

    // Fill in empty days at the start of the month
    const firstDay = dates[0].getDay();
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    return (
        <Card className="progress-calendar-card">
            <div className="calendar-header">
                <h3 className="calendar-title">
                    {getMonthName(month)} {year}
                </h3>
                {habit && (
                    <div className="calendar-legend">
                        <span className="legend-item">
                            <span className="dot dot-completed" style={{ background: habit.color }} />
                            Concluído
                        </span>
                    </div>
                )}
            </div>

            <div className="calendar-grid">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="calendar-day-label">
                        {day}
                    </div>
                ))}

                {blanks.map(i => (
                    <div key={`blank-${i}`} className="calendar-day blank" />
                ))}

                {dates.map(date => {
                    const dateStr = formatDate(date);
                    const isCurrentToday = dateStr === today;

                    let isCompleted = false;
                    if (habitId && habit) {
                        isCompleted = isHabitCompletedOnDate(habit, dateStr, completions);
                    } else if (!habitId) {
                        // Overall completion (if ANY habit was completed on this day)
                        isCompleted = habits.some(h => isHabitCompletedOnDate(h, dateStr, completions));
                    }

                    return (
                        <div
                            key={dateStr}
                            className={`calendar-day ${isCurrentToday ? 'today' : ''} ${isCompleted ? 'completed' : ''}`}
                            title={dateStr}
                        >
                            <span className="day-number">{date.getDate()}</span>
                            {isCompleted && (
                                <div
                                    className="completion-indicator"
                                    style={{ background: habit?.color || 'var(--color-primary)' }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
