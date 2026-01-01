import React from 'react';
import { PlusIcon, CalendarIcon, FireIcon } from '../icons/HabitIcons';
import { Button } from '../common/Button';
import './Header.css';

interface HeaderProps {
    onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddClick }) => {
    const today = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = today.toLocaleDateString('pt-BR', dateOptions);

    return (
        <header className="app-header">
            <div className="header-container container">
                <div className="header-left">
                    <div className="brand">
                        <div className="brand-logo">
                            <FireIcon size={24} color="white" />
                        </div>
                        <h1 className="brand-name">HabitFlow</h1>
                    </div>

                    <div className="header-date">
                        <CalendarIcon size={16} />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                <div className="header-right">
                    <Button variant="primary" size="md" onClick={onAddClick}>
                        <PlusIcon size={18} />
                        <span>Novo Hábito</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};
