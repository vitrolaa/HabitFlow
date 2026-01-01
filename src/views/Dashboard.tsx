import React from 'react';
import { HabitList } from '../components/habits/HabitList';
import { Statistics } from '../components/progress/Statistics';
import { StreakDisplay } from '../components/progress/StreakDisplay';
import { ProgressCalendar } from '../components/progress/ProgressCalendar';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-view">
            <div className="dashboard-grid">
                <div className="dashboard-main-content">
                    <section className="dashboard-section">
                        <Statistics />
                    </section>

                    <section className="dashboard-section">
                        <HabitList />
                    </section>
                </div>

                <aside className="dashboard-sidebar">
                    <section className="dashboard-section">
                        <h2 className="section-title">Minhas Sequências</h2>
                        <StreakDisplay />
                    </section>

                    <section className="dashboard-section">
                        <h2 className="section-title">Calendário Geral</h2>
                        <ProgressCalendar />
                    </section>
                </aside>
            </div>
        </div>
    );
};
