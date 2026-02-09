'use client';

import { Container, Typography, Box } from '@mui/material';
import GearStatus from '@/components/GearStatus'; // 這是我們之前寫的 Redux 組件

export default function GearPage() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    樂器保養中心
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    追蹤你的 **Yamaha TRBX304** 狀態與換弦紀錄。
                </Typography>

                {/* 引入 Redux 器材組件 */}
                <GearStatus />
            </Box>
        </Container>
    );
}