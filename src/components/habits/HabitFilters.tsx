import React, { useState } from 'react';
import type { CategoryType, FrequencyType } from '../../types';
import { FilterIcon } from '../icons/HabitIcons';
import { Button } from '../common/Button';
import './HabitFilters.css';

interface HabitFiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    category?: CategoryType;
    frequency?: FrequencyType;
    dueToday?: boolean;
}

export const HabitFilters: React.FC<HabitFiltersProps> = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({});

    const categories: (CategoryType | undefined)[] = [undefined, 'health', 'fitness', 'study', 'work', 'personal', 'custom'];
    const frequencies: (FrequencyType | undefined)[] = [undefined, 'daily', 'weekly', 'custom'];

    const categoryLabels: Record<string, string> = {
        health: '❤️ Saúde',
        fitness: '💪 Fitness',
        study: '📚 Estudo',
        work: '💼 Trabalho',
        personal: '⭐ Pessoal',
        custom: '⚙️ Custom',
    };

    const frequencyLabels: Record<string, string> = {
        daily: 'Diário',
        weekly: 'Semanal',
        custom: 'Personalizado',
    };

    const handleCategoryChange = (category?: CategoryType) => {
        const newFilters = { ...filters, category };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleFrequencyChange = (frequency?: FrequencyType) => {
        const newFilters = { ...filters, frequency };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleDueTodayToggle = () => {
        const newValue = filters.dueToday === true ? undefined : true;
        const newFilters = { ...filters, dueToday: newValue };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        onFilterChange({});
    };

    const hasActiveFilters = filters.category || filters.frequency || filters.dueToday;

    return (
        <div className="habit-filters">
            <Button
                variant="secondary"
                size="md"
                onClick={() => setIsOpen(!isOpen)}
                className="filters-toggle"
            >
                <FilterIcon size={18} />
                Filtros
                {hasActiveFilters && <span className="filter-badge" />}
            </Button>

            {isOpen && (
                <div className="filters-panel">
                    <div className="filter-section">
                        <h4 className="filter-title">Categoria</h4>
                        <div className="filter-options">
                            <button
                                className={`filter-chip ${!filters.category ? 'filter-chip-active' : ''}`}
                                onClick={() => handleCategoryChange(undefined)}
                            >
                                Todas
                            </button>
                            {categories.filter(c => c).map(category => (
                                <button
                                    key={category}
                                    className={`filter-chip ${filters.category === category ? 'filter-chip-active' : ''}`}
                                    onClick={() => handleCategoryChange(category as CategoryType)}
                                >
                                    {categoryLabels[category as string]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h4 className="filter-title">Frequência</h4>
                        <div className="filter-options">
                            <button
                                className={`filter-chip ${!filters.frequency ? 'filter-chip-active' : ''}`}
                                onClick={() => handleFrequencyChange(undefined)}
                            >
                                Todas
                            </button>
                            {frequencies.filter(f => f).map(frequency => (
                                <button
                                    key={frequency}
                                    className={`filter-chip ${filters.frequency === frequency ? 'filter-chip-active' : ''}`}
                                    onClick={() => handleFrequencyChange(frequency as FrequencyType)}
                                >
                                    {frequencyLabels[frequency as string]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <button
                            className={`filter-toggle-btn ${filters.dueToday ? 'filter-toggle-active' : ''}`}
                            onClick={handleDueTodayToggle}
                        >
                            <span className="filter-toggle-icon">
                                {filters.dueToday ? '✓' : ''}
                            </span>
                            Apenas hábitos de hoje
                        </button>
                    </div>

                    {hasActiveFilters && (
                        <div className="filter-actions">
                            <Button variant="ghost" size="sm" onClick={clearFilters} fullWidth>
                                Limpar Filtros
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
