'use client'; // 👈 必加

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  MenuItem,
  FormControl,
  Slider,
  Autocomplete,
} from '@mui/material';

// MUI Icons 導入
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import Link from 'next/link'; // 👈 改用這個
import { Song, DefinedInstrument } from '@/types'; // 使用 @ 代表 src
import songApi from '@/services/api';
import { useThemeMode } from '@/app/ThemeContext';

// 導入 Styled 元件
import {
  HeaderBox,
  AddSongPaper,
  StyledContainer,
  SongPaper,
  EmptyStateBox,
  DialogTitleBox,
  StatusSelect
} from './pageStyle';

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const { themeMode, setThemeMode } = useThemeMode();

  const [openDialog, setOpenDialog] = useState(false); // 彈窗開關
  const [deleteId, setDeleteId] = useState<number | null>(null); // 暫存要刪除的 ID
  const [disabledSongs, setDisabledSongs] = useState<Set<number>>(new Set()); // 記錄正在更新的歌曲 ID

  // 1. 存「所有可選樂器」
  const [allInstruments, setAllInstruments] = useState<DefinedInstrument[]>([]);
  // 2. 存「使用者選了哪些」(改成存物件陣列，方便 UI 顯示)
  const [selectedInstruments, setSelectedInstruments] = useState<DefinedInstrument[]>([]);

  // 3. 一進來就去後端抓樂器清單
  useEffect(() => {
    songApi.getDefinedInstruments().then(setAllInstruments);
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const data = await songApi.getAll(); // 這裡直接拿到 data，不用再 .data
      setSongs(data);
    } catch (error) {
      console.error("讀取失敗", error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleSubmit = async () => {
    if (!title) return;
    try {
      // await axios.post('http://localhost:3000/songs', { title, artist });
      const data = await songApi.create({
        title, artist,
        instrumentIds: selectedInstruments.map(i => i.id)
      });
      console.log("新增成功", data); // 之後做成顯示成功alert
      setTitle('');
      setArtist('');
      setSelectedInstruments([]); // 清空選擇
      fetchSongs();
    } catch (error) {
      console.error(error);
    }
  };

  // 處理進度條拖拉變更
  const handleProgressChange = async (instrumentId: number, newValue: number | number[]) => {
    // 這裡為了效能，通常會做 Debounce (防抖)，但練習先直接打 API
    try {
      await songApi.updateProgress(instrumentId, newValue as number);
      // 為了畫面流暢，這裡建議先更新本地 state，或者重新 fetch
      fetchSongs();
    } catch (error) { console.error(error); }
  };

  const handleClickDelete = (id: number) => {
    setDeleteId(id); // 記住這首歌
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteId === null) return;

    try {
      const data = await songApi.delete(deleteId);
      console.log("刪除成功", data);
      // 刪除成功後：
      setOpenDialog(false); // 關閉彈窗
      setDeleteId(null);    // 清空 ID
      fetchSongs();         // 重新抓取列表
    } catch (error) {
      console.error("刪除失敗", error);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    // 防止重複更新
    if (disabledSongs.has(id)) return;

    try {
      // 標記為 disabled
      setDisabledSongs(prev => new Set(prev).add(id));

      await songApi.updateStatus(id, newStatus);
      console.log("狀態更新成功");
      fetchSongs(); // 重新抓取列表

      // 10 秒後解除 disabled
      setTimeout(() => {
        setDisabledSongs(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 10000);
    } catch (error) {
      console.error("狀態更新失敗", error);
      // 如果失敗，立即解除 disabled
      setDisabledSongs(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };


  // 只有一點不同：列表的 Link
  // <Link href={`/songs/${song.id}`} ...> ... </Link>

  return (
    <Container maxWidth="sm">
      {/* 更改主題樣式按鈕 */}
      <Button
        variant="outlined"
        onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
      >
        切換到 {themeMode === 'light' ? '深色' : '淺色'} 主題
      </Button>
      <StyledContainer maxWidth="sm">
        {/* 標題區塊 */}
        <HeaderBox>
          <LibraryMusicIcon color="secondary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            GrooveLog
          </Typography>
        </HeaderBox>

        {/* 新增歌曲卡片 (Paper 取代 div) */}
        <AddSongPaper elevation={3}>
          <Typography variant="h6" gutterBottom>
            🎸 新增練習曲目
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Stack spacing={2}>
              <TextField
                label="歌名 (Title)"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: 勘冴えて悔しいわ"
              />
              <TextField
                label="演出者 (Artist)"
                variant="outlined"
                fullWidth
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="例如: ZUTOMAYO"
              />
              <Autocomplete
                multiple // 支援多選
                options={allInstruments} // 選項來源
                getOptionLabel={(option) => option.name} // 顯示什麼文字
                value={selectedInstruments}
                onChange={(_, newValue) => {
                  setSelectedInstruments(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="選擇樂器"
                    placeholder="選擇或搜尋..."
                  />
                )}

              />
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleSubmit}
                size="large"
              >
                加入練習清單
              </Button>
            </Stack>
          </Box>
        </AddSongPaper>

        {/* 歌曲列表 */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          練習中 ({songs.length})
        </Typography>

        <List>
          {songs.map((song) => (
            <SongPaper key={song.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleClickDelete(song.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                {/* 左側圖示 */}
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <MusicNoteIcon />
                  </Avatar>
                </ListItemAvatar>

                {/* 文字內容 */}
                <ListItemText
                  primary={
                    // 👇 把歌名變成連結
                    <Link href={`/songs/${song.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', '&:hover': { color: 'secondary.main' } }}>
                        {song.title}
                      </Typography>
                    </Link>
                  }
                // ...
                />



                {/* 狀態下拉選單 */}
                <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                  <StatusSelect
                    value={song.status}
                    onChange={(e) => handleUpdateStatus(song.id, e.target.value as string)}
                    disabled={disabledSongs.has(song.id)}
                    variant="outlined"
                    isMastered={song.status === 'MASTERED'}
                  >
                    <MenuItem value="PRACTICING">練習中</MenuItem>
                    <MenuItem value="MASTERED">已精通</MenuItem>
                  </StatusSelect>
                </FormControl>
              </ListItem>

              {/* --- 🆕 下半部：樂器軌道與進度條 --- */}
              {song.instruments && song.instruments.length > 0 && (
                <Box sx={{ px: 3, pb: 2, pt: 0 }}>
                  {/* 加一條分隔線或間距讓視覺分開 */}
                  <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mb: 2 }} />

                  <Stack spacing={1}>
                    {song.instruments.map((inst) => (
                      <Box key={inst.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                        {/* 1. 樂器名稱 (固定寬度以免對不齊) */}
                        <Typography
                          variant="caption"
                          sx={{
                            minWidth: 50,
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}
                        >
                          {inst.defined_instrument.name}
                        </Typography>

                        {/* 2. 進度拉桿 (Slider) */}
                        <Slider
                          size="small"
                          value={inst.progress ?? 0} // 使用 defaultValue 讓它更順暢
                          onChange={(_, newValue) => {
                            setSongs(prevSongs => prevSongs.map(s => {
                              // 找到這首歌
                              if (s.id !== song.id) return s;
                              // 找到這個樂器並更新它的 progress
                              return {
                                ...s,
                                instruments: s.instruments.map(i =>
                                  i.id === inst.id
                                    ? { ...i, progress: newValue as number }
                                    : i
                                )
                              };
                            }));
                          }}
                          // 使用 onChangeCommitted：只有放開滑鼠時才送出 API 請求
                          onChangeCommitted={(_, val) => handleProgressChange(inst.id, val)}
                          valueLabelDisplay="auto" // 拖拉時顯示數字泡泡
                          sx={{
                            flex: 1,
                            color: inst.progress === 100 ? '#66bb6a' : 'primary.main', // 100% 變綠色
                          }}
                        />

                        {/* 3. 進度數字 */}
                        <Typography variant="caption" sx={{ minWidth: 30, textAlign: 'right' }}>
                          {inst.progress}%
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </SongPaper>
          ))}

          {songs.length === 0 && (
            <EmptyStateBox>
              <PlayCircleOutlineIcon sx={{ fontSize: 60, opacity: 0.5 }} />
              <Typography>目前沒有練習曲目，快去新增吧！</Typography>
            </EmptyStateBox>
          )}
        </List>


        {/* --- 🆕 這裡就是那個彈窗 (Dialog) 元件 --- */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitleBox id="alert-dialog-title">
            <WarningAmberIcon color="warning" />
            確認刪除？
          </DialogTitleBox>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              刪除後就救不回來囉！你確定要放棄這首歌的練習進度嗎？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">
              算了我再練練
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
              刪除它
            </Button>
          </DialogActions>
        </Dialog>

      </StyledContainer>
    </Container>
  )
}