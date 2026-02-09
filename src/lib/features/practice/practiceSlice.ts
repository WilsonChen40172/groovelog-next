import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定義狀態型別 (對應你使用的 TypeScript)
interface PracticeState {
    bpm: number;
    currentSong: string;
}

const initialState: PracticeState = {
    bpm: 120,
    currentSong: '尚未選擇曲目',
};

export const practiceSlice = createSlice({
    name: 'practice',
    initialState,
    reducers: {
        // 這裡定義你的 Action 和如何更新狀態
        incrementBpm: (state) => {
            state.bpm += 1;
        },
        setSong: (state, action: PayloadAction<string>) => {
            state.currentSong = action.payload;
        },
    },
});

export const { incrementBpm, setSong } = practiceSlice.actions;
export default practiceSlice.reducer;