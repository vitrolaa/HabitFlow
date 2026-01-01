import React from 'react';
import { Card } from '../common/Card';
import { useHabits } from '../../hooks/useHabits';
import { ChartIcon, CheckIcon, FireIcon, CalendarIcon } from '../icons/HabitIcons';
import './Statistics.css';

export const Statistics: React.FC = () => {
    const { getDashboardStats } = useHabits();
    const stats = getDashboardStats();

    const statCards = [
        {
            icon: <CalendarIcon size={24} color="var(--color-primary)" />,
            label: 'Total de Hábitos',
            value: stats.totalHabits,
            color: 'var(--color-primary)',
        },
        {
            icon: <CheckIcon size={24} color="var(--color-success)" />,
            label: 'Concluídos Hoje',
            value: stats.completedToday,
            color: 'var(--color-success)',
        },
        {
            icon: <FireIcon size={24} color="var(--color-warning)" />,
            label: 'Streaks Ativos',
            value: stats.activeStreaks,
            color: 'var(--color-warning)',
        },
        {
            icon: <ChartIcon size={24} color="var(--color-info)" />,
            label: 'Taxa do Mês',
            value: `${Math.round(stats.completionRateMonth)}%`,
            color: 'var(--color-info)',
        },
    ];

    return (
        <div className="statistics-container">
            <div className="statistics-grid">
                {statCards.map((stat, index) => (
                    <Card key={index} className="stat-card" hover>
                        <div className="stat-icon" style={{ color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <div className="stat-value" style={{ color: stat.color }}>
                                {stat.value}
                            </div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="completion-rates">
                <h3 className="rates-title">Taxas de Conclusão</h3>
                <div className="rates-list">
                    <div className="rate-item">
                        <span className="rate-label">Hoje</span>
                        <div className="rate-bar-container">
                            <div
                                className="rate-bar"
                                style={{
                                    width: `${stats.completionRateToday}%`,
                                    background: 'var(--color-success)',
                                }}
                            />
                        </div>
                        <span className="rate-value">{Math.round(stats.completionRateToday)}%</span>
                    </div>

                    <div className="rate-item">
                        <span className="rate-label">Esta Semana</span>
                        <div className="rate-bar-container">
                            <div
                                className="rate-bar"
                                style={{
                                    width: `${stats.completionRateWeek}%`,
                                    background: 'var(--color-primary)',
                                }}
                            />
                        </div>
                        <span className="rate-value">{Math.round(stats.completionRateWeek)}%</span>
                    </div>

                    <div className="rate-item">
                        <span className="rate-label">Este Mês</span>
                        <div className="rate-bar-container">
                            <div
                                className="rate-bar"
                                style={{
                                    width: `${stats.completionRateMonth}%`,
                                    background: 'var(--color-info)',
                                }}
                            />
                        </div>
                        <span className="rate-value">{Math.round(stats.completionRateMonth)}%</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};
