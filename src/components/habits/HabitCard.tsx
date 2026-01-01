import React, { useState } from 'react';
import type { Habit } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CategoryIcon, CheckIcon, EditIcon, TrashIcon, FireIcon } from '../icons/HabitIcons';
import { useHabits } from '../../hooks/useHabits';
import { formatTime } from '../../utils/dateUtils';
import './HabitCard.css';

interface HabitCardProps {
    habit: Habit;
    onEdit: (habit: Habit) => void;
    onDelete: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, onDelete }) => {
    const { toggleCompletion, isCompleted, getHabitStats, completions } = useHabits();
    const [isDeleting, setIsDeleting] = useState(false);

    const completed = isCompleted(habit.id);
    const stats = getHabitStats(habit.id);

    // Get current completion count
    const todayStr = new Date().toISOString().split('T')[0];
    const completion = completions.find(c => c.habitId === habit.id && c.date === todayStr);
    const currentCount = completion?.count || 0;
    const progressPercent = Math.min((currentCount / habit.goal) * 100, 100);

    const handleToggleComplete = () => {
        toggleCompletion(habit.id);
    };

    const handleDelete = () => {
        if (isDeleting) {
            onDelete(habit);
        } else {
            setIsDeleting(true);
            setTimeout(() => setIsDeleting(false), 3000);
        }
    };

    return (
        <Card className="habit-card" hover>
            <div className="habit-card-header">
                <div className="habit-card-icon" style={{ color: habit.color }}>
                    <CategoryIcon category={habit.icon} size={28} />
                </div>

                <div className="habit-card-actions">
                    <button
                        className="habit-action-btn"
                        onClick={() => onEdit(habit)}
                        title="Editar"
                    >
                        <EditIcon size={18} />
                    </button>
                    <button
                        className={`habit-action-btn habit-action-delete ${isDeleting ? 'habit-action-confirm' : ''}`}
                        onClick={handleDelete}
                        title={isDeleting ? 'Clique novamente para confirmar' : 'Deletar'}
                    >
                        <TrashIcon size={18} />
                    </button>
                </div>
            </div>

            <div className="habit-card-content">
                <h3 className="habit-card-title">{habit.name}</h3>
                {habit.description && (
                    <p className="habit-card-description">{habit.description}</p>
                )}

                <div className="habit-card-meta">
                    {habit.time && (
                        <span className="habit-meta-item">
                            🕐 {formatTime(habit.time)}
                        </span>
                    )}
                    <span className="habit-meta-item">
                        🎯 Meta: {habit.goal}x
                    </span>
                </div>

                {habit.goal > 1 && (
                    <div className="habit-progress-container">
                        <div className="habit-progress-info">
                            <span>Progresso diário</span>
                            <span>{currentCount}/{habit.goal}</span>
                        </div>
                        <div className="habit-progress-bar-bg">
                            <div
                                className="habit-progress-bar-fill"
                                style={{
                                    width: `${progressPercent}%`,
                                    background: habit.color
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="habit-card-stats">
                {stats.currentStreak > 0 && (
                    <div className="habit-stat">
                        <FireIcon size={16} color="var(--color-warning)" />
                        <span>{stats.currentStreak} dias</span>
                    </div>
                )}
                <div className="habit-stat">
                    <span className="habit-stat-label">Taxa:</span>
                    <span className="habit-stat-value">{stats.completionRate}%</span>
                </div>
            </div>

            <div className="habit-card-footer">
                <Button
                    variant={completed ? 'success' : 'secondary'}
                    size="md"
                    fullWidth
                    onClick={handleToggleComplete}
                    className="habit-complete-btn"
                >
                    {completed ? (
                        <>
                            <CheckIcon size={18} />
                            Concluído
                        </>
                    ) : (
                        <>
                            {habit.goal > 1 ? `Adicionar (${currentCount}/${habit.goal})` : 'Marcar como concluído'}
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
};
