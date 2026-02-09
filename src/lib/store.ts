import { configureStore } from '@reduxjs/toolkit';
import practiceReducer from './features/practice/practiceSlice';
import gearReducer from './features/gear/gearSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            practice: practiceReducer,
            gear: gearReducer,         // 管貝斯器材、換弦紀錄
        },
    });
};

// 導出型別供 TypeScript 使用
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];