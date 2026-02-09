'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { updateStringChange } from '@/lib/features/gear/gearSlice';

export default function GearStatus() {
    const gears = useSelector((state: RootState) => state.gear.ownedGears);
    const dispatch = useDispatch();

    const handleUpdateStrings = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        dispatch(updateStringChange({ id, date: today }));
    };

    return (
        <div className="p-4 bg-gray-900 text-white rounded-xl">
            <h2 className="text-xl font-bold mb-4">我的器材庫</h2>
            {gears.map(gear => (
                <div key={gear.id} className="mb-4 p-3 border border-gray-700 rounded">
                    <p className="font-semibold">{gear.brand} {gear.model}</p>
                    <p className="text-sm text-gray-400">上次換弦：{gear.lastChanged}</p>
                    <button
                        onClick={() => handleUpdateStrings(gear.id)}
                        className="mt-2 text-xs bg-blue-600 px-2 py-1 rounded"
                    >
                        標記為今日換弦
                    </button>
                </div>
            ))}
        </div>
    );
}