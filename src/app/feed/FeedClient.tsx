'use client';

import { useState } from 'react';
import { swipeItem } from '@/lib/actions';
import { useLanguage } from '@/components/providers/language-provider';
import Image from 'next/image';
import { ReportModal } from '@/components/report-modal';

type Item = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    value: number;
    user: { name: string | null };
};

export default function FeedClient({ initialItems }: { initialItems: Item[] }) {
    const [items, setItems] = useState(initialItems);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastDirection, setLastDirection] = useState<string | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const { t } = useLanguage();

    const currentItem = items[currentIndex];

    // Empty State
    if (!currentItem) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-center p-8 space-y-6">
                <div className="text-6xl animate-bounce">🎬</div>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
                    {t('feed.no_items') || "That's a wrap!"}
                </h2>
                <p className="text-gray-400 max-w-xs">{t('feed.check_back') || 'You have viewed all available items. Come back later for more drops.'}</p>
                <button onClick={() => window.location.reload()} className="btn-neon">
                    {t('common.refresh') || 'Refresh Feed'}
                </button>
            </div>
        );
    }

    const handleSwipe = async (direction: 'left' | 'right') => {
        const itemId = currentItem.id;

        // Optimistic
        setLastDirection(direction);
        setTimeout(() => setLastDirection(null), 500); // Reset animation
        setCurrentIndex(prev => prev + 1);

        const result = await swipeItem(itemId, direction);
        if (result?.match) {
            // Ideally toggle a match modal here
            alert(`🔥 IT'S A MATCH with ${currentItem.user.name}!`);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Main Card Layer */}
            <div key={currentItem.id} className="absolute inset-0 z-10">
                {/* Full Screen Image */}
                <div className="relative w-full h-full">
                    <Image
                        src={currentItem.imageUrl}
                        alt={currentItem.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-24 left-0 right-0 p-6 space-y-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2 leading-tight">
                                {currentItem.title}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-bold border border-white/10">
                                    ${currentItem.value}
                                </span>
                                <span className="text-sm text-gray-300 font-medium">
                                    @{currentItem.user.name || 'Anonymous'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-200 line-clamp-2 text-sm opacity-90">
                        {currentItem.description}
                    </p>
                </div>
            </div>

            {/* Swipe Controls (Floating) */}
            <div className="absolute bottom-32 right-6 z-20 flex flex-col gap-4">
                <button
                    onClick={() => setShowReportModal(true)}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-sm text-gray-400 border border-white/10 hover:bg-black/80"
                    aria-label="Report"
                >
                    🚩
                </button>
                <button
                    onClick={() => handleSwipe('right')}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg border border-white/20 animate-pulse"
                    aria-label="Like"
                >
                    🔥
                </button>
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur flex items-center justify-center text-xl text-gray-400 border border-white/10"
                    aria-label="Pass"
                >
                    ✕
                </button>
            </div>

            {/* Feedback Animation Layer */}
            {lastDirection === 'right' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-green-500/10 backdrop-blur-[2px] animate-fade-out">
                    <div className="border-4 border-green-500 text-green-500 text-6xl font-black px-8 py-2 rounded-xl -rotate-12 uppercase tracking-widest">
                        LIKE
                    </div>
                </div>
            )}
            {lastDirection === 'left' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-red-500/10 backdrop-blur-[2px] animate-fade-out">
                    <div className="border-4 border-red-500 text-red-500 text-6xl font-black px-8 py-2 rounded-xl rotate-12 uppercase tracking-widest">
                        NOPE
                    </div>
                </div>
            )}

            {showReportModal && (
                <ReportModal
                    targetId={currentItem.id}
                    type="ITEM"
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </div>
    );
}
