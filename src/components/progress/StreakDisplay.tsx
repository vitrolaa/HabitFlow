import React from 'react';
import type { Habit } from '../../types';
import { Card } from '../common/Card';
import { FireIcon } from '../icons/HabitIcons';
import { useHabits } from '../../hooks/useHabits';
import './StreakDisplay.css';

interface StreakDisplayProps {
    habit?: Habit;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ habit }) => {
    const { getHabitStats, habits } = useHabits();

    if (habit) {
        const stats = getHabitStats(habit.id);

        return (
            <Card className="streak-card">
                <div className="streak-header">
                    <FireIcon size={32} color="var(--color-warning)" />
                    <h3>Sequência</h3>
                </div>

                <div className="streak-stats">
                    <div className="streak-stat">
                        <div className="streak-stat-value">{stats.currentStreak}</div>
                        <div className="streak-stat-label">Dias Atual</div>
                    </div>

                    <div className="streak-divider" />

                    <div className="streak-stat">
                        <div className="streak-stat-value best">{stats.longestStreak}</div>
                        <div className="streak-stat-label">Melhor Sequência</div>
                    </div>
                </div>
            </Card>
        );
    }

    // Show top streaks across all habits
    const habitsWithStreaks = habits
        .map(h => ({ habit: h, stats: getHabitStats(h.id) }))
        .filter(item => item.stats.currentStreak > 0)
        .sort((a, b) => b.stats.currentStreak - a.stats.currentStreak)
        .slice(0, 3);

    if (habitsWithStreaks.length === 0) {
        return (
            <Card className="streak-card empty">
                <FireIcon size={48} color="var(--color-text-tertiary)" />
                <p>Comece um hábito para criar sua primeira sequência!</p>
            </Card>
        );
    }

    return (
        <Card className="streak-card">
            <div className="streak-header">
                <FireIcon size={28} color="var(--color-warning)" />
                <h3>Top Sequências</h3>
            </div>

            <div className="streak-list">
                {habitsWithStreaks.map(({ habit: h, stats }, index) => (
                    <div key={h.id} className="streak-item">
                        <div className="streak-rank" style={{ color: h.color }}>
                            #{index + 1}
                        </div>
                        <div className="streak-item-info">
                            <div className="streak-item-name">{h.name}</div>
                            <div className="streak-item-value">
                                {stats.currentStreak} dia{stats.currentStreak !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
