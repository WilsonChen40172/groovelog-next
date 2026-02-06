'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Typography, Box, Paper, Button, Slider, Chip, Stack } from '@mui/material';
import songApi from '@/services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { Song } from '@/types';

export default function SongDetailPage() {
    const params = useParams(); // Next.js 抓參數的方法
    const router = useRouter(); // 用來 router.push('/') 回首頁

    const id = params.id; // 取得網址上的 id


    const [song, setSong] = useState<Song | null>(null);

    // 載入歌曲資料
    useEffect(() => {
        if (id) {
            songApi.getAll().then(songs => {
                const foundSong = songs.find(s => s.id === Number(id));
                if (foundSong) {
                    setSong(foundSong);
                }
            }).catch(err => console.error(err));
        }
    }, [id]);

    if (!song) return <Typography>載入中...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/')} // 回首頁
                sx={{ mb: 2 }}
            >
                回列表
            </Button>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {/* 標題區 */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>{song.title}</Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>{song.artist}</Typography>
                    <Chip
                        label={song.status}
                        color={song.status === 'MASTERED' ? 'success' : 'primary'}
                        variant="outlined"
                    />
                </Box>

                {/* YouTube 播放器區塊 (如果有 URL) */}
                {/* {song.youtube_url && (
            <Box sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
                <Typography sx={{p:2}}>🔗 YouTube 連結: <a href={song.youtube_url} target="_blank">{song.youtube_url}</a></Typography>
            </Box>
        )} */}

                {/* 樂器詳細進度區 */}
                <Typography variant="h5" sx={{ mb: 2, borderLeft: '4px solid #f48fb1', pl: 2 }}>
                    樂器練習狀況
                </Typography>

                <Stack spacing={4}>
                    {song.instruments.map((inst) => (
                        <Box key={inst.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6">{inst.defined_instrument.name}</Typography>
                                <Typography variant="h6" color="secondary">{inst.progress}%</Typography>
                            </Box>
                            <Slider
                                value={inst.progress}
                                // 這裡可以加上 onChangeCommitted 來更新進度
                                disabled // 在詳細頁如果要純檢視就 disabled，要編輯就把 disabled 拿掉並加 onChange
                                valueLabelDisplay="auto"
                                sx={{ height: 8 }}
                            />
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Container>
    )
}