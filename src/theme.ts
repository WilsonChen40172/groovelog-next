import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212', // 深黑色背景
            paper: '#1e1e1e',   // 卡片背景
        },
    },
});

// Light Mode 主題
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#fafafa', // 淺灰色背景
            paper: '#ffffff',   // 白色卡片背景
        },
    },
});
