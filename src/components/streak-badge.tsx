'use client';

import { useEffect, useState } from 'react';
import { checkStreak } from '@/lib/actions';

export function StreakBadge() {
    const [streak, setStreak] = useState<number | null>(null);

    useEffect(() => {
        checkStreak().then(res => setStreak(res.streak));
    }, []);

    if (streak === null || streak <= 0) return null;

    return (
        <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold animate-in zoom-in duration-300">
            <span>🔥</span>
            <span>{streak}</span>
        </div>
    );
}
