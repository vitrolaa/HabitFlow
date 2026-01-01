import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glass?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    glass = false,
    onClick,
}) => {
    const classes = [
        'card',
        hover && 'card-hover',
        glass && 'card-glass',
        onClick && 'card-clickable',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};
