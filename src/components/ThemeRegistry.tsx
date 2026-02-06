'use client'; // 👈 這一行很重要，代表這是客戶端元件

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from '@/theme';
import { useThemeMode } from '@/app/ThemeContext';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const { themeMode } = useThemeMode();
    return (
        <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}