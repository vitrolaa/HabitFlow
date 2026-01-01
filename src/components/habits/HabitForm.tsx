import React, { useState } from 'react';
import type { CategoryType, FrequencyType, WeekDay } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CategoryIcon } from '../icons/HabitIcons';
import { getCategoryColor } from '../../utils/habitUtils';
import { getWeekDayName } from '../../utils/dateUtils';
import './HabitForm.css';

interface HabitFormProps {
    initialValues?: HabitFormData;
    onSubmit: (data: HabitFormData) => void;
    onCancel: () => void;
    submitLabel?: string;
}

export interface HabitFormData {
    name: string;
    description: string;
    category: CategoryType;
    frequency: FrequencyType;
    customDays?: WeekDay[];
    time?: string;
    goal: number;
    color: string;
    icon: CategoryType;
}

export const HabitForm: React.FC<HabitFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    submitLabel = 'Criar Hábito',
}) => {
    const [formData, setFormData] = useState<HabitFormData>(
        initialValues || {
            name: '',
            description: '',
            category: 'custom',
            frequency: 'daily',
            customDays: [],
            time: '',
            goal: 1,
            color: getCategoryColor('custom'),
            icon: 'custom',
        }
    );

    const [errors, setErrors] = useState<Partial<Record<keyof HabitFormData, string>>>({});

    const categoryOptions = [
        { value: 'health', label: '❤️ Saúde' },
        { value: 'fitness', label: '💪 Fitness' },
        { value: 'study', label: '📚 Estudo' },
        { value: 'work', label: '💼 Trabalho' },
        { value: 'personal', label: '⭐ Pessoal' },
        { value: 'custom', label: '⚙️ Personalizado' },
    ];

    const frequencyOptions = [
        { value: 'daily', label: 'Diariamente' },
        { value: 'weekly', label: 'Dias da semana (Seg-Sex)' },
        { value: 'custom', label: 'Dias personalizados' },
    ];

    const weekDays: WeekDay[] = [0, 1, 2, 3, 4, 5, 6];

    const handleChange = (field: keyof HabitFormData, value: any) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };

            // Auto-update color and icon when category changes
            if (field === 'category') {
                updated.color = getCategoryColor(value as CategoryType);
                updated.icon = value as CategoryType;
            }

            return updated;
        });

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const toggleCustomDay = (day: WeekDay) => {
        setFormData(prev => {
            const currentDays = prev.customDays || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day];
            return { ...prev, customDays: newDays };
        });
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof HabitFormData, string>> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (formData.frequency === 'custom' && (!formData.customDays || formData.customDays.length === 0)) {
            newErrors.customDays = 'Selecione pelo menos um dia';
        }

        if (formData.goal < 1) {
            newErrors.goal = 'Meta deve ser pelo menos 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form className="habit-form" onSubmit={handleSubmit}>
            <Input
                label="Nome do Hábito"
                placeholder="Ex: Beber água, Ler livros..."
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                error={errors.name}
                required
            />

            <div className="habit-form-row">
                <Input
                    label="Descrição (opcional)"
                    placeholder="Detalhes sobre o hábito..."
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                />
            </div>

            <div className="habit-form-row">
                <Select
                    label="Categoria"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={e => handleChange('category', e.target.value as CategoryType)}
                />

                <Select
                    label="Frequência"
                    options={frequencyOptions}
                    value={formData.frequency}
                    onChange={e => handleChange('frequency', e.target.value as FrequencyType)}
                />
            </div>

            {formData.frequency === 'custom' && (
                <div className="habit-form-section">
                    <label className="habit-form-label">Dias da Semana</label>
                    <div className="weekday-selector">
                        {weekDays.map(day => (
                            <button
                                key={day}
                                type="button"
                                className={`weekday-btn ${formData.customDays?.includes(day) ? 'weekday-btn-active' : ''}`}
                                onClick={() => toggleCustomDay(day)}
                            >
                                {getWeekDayName(day)}
                            </button>
                        ))}
                    </div>
                    {errors.customDays && <span className="error-text">{errors.customDays}</span>}
                </div>
            )}

            <div className="habit-form-row">
                <Input
                    label="Horário (opcional)"
                    type="time"
                    value={formData.time}
                    onChange={e => handleChange('time', e.target.value)}
                />

                <Input
                    label="Meta diária"
                    type="number"
                    min="1"
                    value={formData.goal}
                    onChange={e => handleChange('goal', parseInt(e.target.value) || 1)}
                    error={errors.goal}
                />
            </div>

            <div className="habit-form-preview">
                <label className="habit-form-label">Preview</label>
                <div className="habit-preview-card" style={{ borderColor: formData.color }}>
                    <div className="habit-preview-icon" style={{ color: formData.color }}>
                        <CategoryIcon category={formData.icon} size={32} />
                    </div>
                    <div className="habit-preview-info">
                        <h3>{formData.name || 'Novo Hábito'}</h3>
                        <p>{formData.description || 'Sem descrição'}</p>
                    </div>
                </div>
            </div>

            <div className="habit-form-actions">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary">
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};
