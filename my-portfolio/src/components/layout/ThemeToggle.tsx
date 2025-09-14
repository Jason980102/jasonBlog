import React from 'react';
import { useTheme } from './ThemeProvider';

const ThemeToggle: React.FC = () => {
    const { theme, toggle } = useTheme();
    return (
        <button type="button" className="theme-toggle-button" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggle;
