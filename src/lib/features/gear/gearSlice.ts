import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定義器材的 TypeScript 型別
interface Gear {
    id: string;
    model: string;
    brand: string;
    strings: string;       // 目前使用的琴弦型號
    lastChanged: string;   // 上次換弦日期 (ISO 字串)
}

interface GearState {
    ownedGears: Gear[];
}

// 將你目前的真實數據設為初始狀態
const initialState: GearState = {
    ownedGears: [
        {
            id: '1',
            brand: 'Yamaha',
            model: 'TRBX304',
            strings: 'D’Addario NYXL',
            lastChanged: '2026-02-01', // 根據你最近換弦的紀錄
        }
    ],
};

export const gearSlice = createSlice({
    name: 'gear',
    initialState,
    reducers: {
        // 動作：更新換弦紀錄
        updateStringChange: (state, action: PayloadAction<{ id: string; date: string }>) => {
            const gear = state.ownedGears.find(g => g.id === action.payload.id);
            if (gear) {
                gear.lastChanged = action.payload.date;
            }
        },
        // 動作：新增器材 (例如未來買了 Xotic XJ-1T)
        addGear: (state, action: PayloadAction<Gear>) => {
            state.ownedGears.push(action.payload);
        },
    },
});

export const { updateStringChange, addGear } = gearSlice.actions;
export default gearSlice.reducer;