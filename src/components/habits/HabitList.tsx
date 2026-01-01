import React, { useState } from 'react';
import type { Habit } from '../../types';
import { HabitCard } from './HabitCard';
import { HabitFilters, type FilterState } from './HabitFilters';
import { filterHabits, sortHabits } from '../../utils/habitUtils';
import { useHabits } from '../../hooks/useHabits';
import { Modal } from '../common/Modal';
import { HabitForm, type HabitFormData } from './HabitForm';
import './HabitList.css';

export const HabitList: React.FC = () => {
    const { habits, updateHabit, deleteHabit } = useHabits();
    const [filters, setFilters] = useState<FilterState>({});
    const [sortBy] = useState<'name' | 'created' | 'category'>('created');
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const filteredHabits = filterHabits(
        habits,
        filters.category,
        filters.frequency,
        filters.dueToday
    );

    const sortedHabits = sortHabits(filteredHabits, sortBy);

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
    };

    const handleEditSubmit = (data: HabitFormData) => {
        if (editingHabit) {
            updateHabit(editingHabit.id, data);
            setEditingHabit(null);
        }
    };

    const handleDelete = (habit: Habit) => {
        deleteHabit(habit.id);
    };

    return (
        <div className="habit-list-container">
            <div className="habit-list-header">
                <h2 className="habit-list-title">
                    Meus Hábitos
                    <span className="habit-count">{sortedHabits.length}</span>
                </h2>
                <HabitFilters onFilterChange={setFilters} />
            </div>

            {sortedHabits.length === 0 ? (
                <div className="habit-list-empty">
                    <div className="empty-icon">📋</div>
                    <h3>Nenhum hábito encontrado</h3>
                    <p>
                        {habits.length === 0
                            ? 'Comece criando seu primeiro hábito!'
                            : 'Tente ajustar os filtros para ver mais hábitos.'}
                    </p>
                </div>
            ) : (
                <div className="habit-list-grid">
                    {sortedHabits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={!!editingHabit}
                onClose={() => setEditingHabit(null)}
                title="Editar Hábito"
                size="md"
            >
                {editingHabit && (
                    <HabitForm
                        initialValues={{
                            name: editingHabit.name,
                            description: editingHabit.description,
                            category: editingHabit.category,
                            frequency: editingHabit.frequency,
                            customDays: editingHabit.customDays,
                            time: editingHabit.time,
                            goal: editingHabit.goal,
                            color: editingHabit.color,
                            icon: editingHabit.icon,
                        }}
                        onSubmit={handleEditSubmit}
                        onCancel={() => setEditingHabit(null)}
                        submitLabel="Salvar Alterações"
                    />
                )}
            </Modal>
        </div>
    );
};
