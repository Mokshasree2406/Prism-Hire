import React, { createContext } from 'react';

export const ThemeContext = createContext();

// Dark theme colors only
export const colors = {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHighlight: '#334155',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    border: 'rgba(255,255,255,0.1)',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    card: '#1e293b',
    input: '#0f172a',
    placeholder: '#64748b'
};

export const ThemeProvider = ({ children }) => {
    return (
        <ThemeContext.Provider value={{ theme: 'dark', colors }}>
            {children}
        </ThemeContext.Provider>
    );
};
