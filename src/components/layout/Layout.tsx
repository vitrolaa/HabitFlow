import React from 'react';
import './Layout.css';

interface LayoutProps {
    header: React.ReactNode;
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ header, children }) => {
    return (
        <div className="app-layout">
            {header}
            <main className="app-main">
                <div className="container">
                    {children}
                </div>
            </main>
            <footer className="app-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} HabitFlow. Criado com ❤️ para sua produtividade.</p>
                </div>
            </footer>
        </div>
    );
};
