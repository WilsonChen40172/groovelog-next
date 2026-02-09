'use client';

import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { MusicNote, Settings, ArrowForward } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Link from 'next/link';

export default function HomeDashboard() {
  const { currentSong, bpm } = useSelector((state: RootState) => state.practice);
  const gears = useSelector((state: RootState) => state.gear.ownedGears);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" align="center" sx={{ mb: 6 }}>
        GrooveLog 工作台
      </Typography>

      {/* 在 MUI v6 中，container 依然保留，但內部元件不再寫 item */}
      <Grid container spacing={3}>

        {/* 歌曲練習卡片 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MusicNote color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">練習進度</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                當前曲目：**{currentSong}**
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                練習速度：{bpm} BPM
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Link href="/practice" passHref style={{ textDecoration: 'none' }}>
                  <Button variant="contained" fullWidth endIcon={<ArrowForward />}>
                    開始練習
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 樂器保養卡片 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Settings color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">器材保養</Typography>
              </Box>
              {gears.map(gear => (
                <Box key={gear.id} sx={{ mb: 2 }}>
                  <Typography variant="body1">{gear.brand} {gear.model}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    上次換弦：{gear.lastChanged}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ mt: 'auto' }}>
                <Link href="/gear" passHref style={{ textDecoration: 'none' }}>
                  <Button variant="outlined" color="secondary" fullWidth endIcon={<ArrowForward />}>
                    查看詳情
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Container>
  );
}