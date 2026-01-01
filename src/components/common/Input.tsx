import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helpText,
    icon,
    className = '',
    ...props
}) => {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    className={`input ${icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <span className="input-error-text">{error}</span>}
            {helpText && !error && <span className="input-help-text">{helpText}</span>}
        </div>
    );
};
