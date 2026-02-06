'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

// Create the context with an initial undefined value.
// It will be provided by the ThemeProvider component.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme mode context
export function useThemeMode() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeMode must be used within a ThemeProvider');
    }
    return context;
}

// ThemeProvider component to wrap the application
export function ThemeModeProvider({ children }: { children: ReactNode }) {
    const [themeMode, setThemeMode] = useState<ThemeMode>('dark'); // Default to dark mode

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({ themeMode, setThemeMode }), [themeMode]);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}