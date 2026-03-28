import Link from 'next/link';

const COMMUNITIES = [
    { id: '1', name: 'Sneakerheads', members: '12.4k', icon: '👟', color: 'bg-orange-100' },
    { id: '2', name: 'Rolex Collectors', members: '3.2k', icon: '⌚️', color: 'bg-slate-100' },
    { id: '3', name: 'Vintage Camera', members: '8.5k', icon: '📷', color: 'bg-zinc-100' },
    { id: '4', name: 'Mechanical Keyboards', members: '5.1k', icon: '⌨️', color: 'bg-purple-100' },
    { id: '5', name: 'Golf Exchange', members: '2.8k', icon: '⛳️', color: 'bg-green-100' },
    { id: '6', name: 'Designer Bags', members: '15k', icon: '👜', color: 'bg-rose-100' },
];

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white sticky top-0 z-10 p-4 shadow-sm">
                <h1 className="text-2xl font-bold">Explore Ponds 🌊</h1>
                <p className="text-gray-500 text-sm">Dive into your niche</p>
            </header>

            <div className="p-4 grid grid-cols-2 gap-4">
                {COMMUNITIES.map((c) => (
                    <Link key={c.id} href={`/community/${c.id}`} className="block group">
                        <div className={`aspect-square rounded-2xl ${c.color} flex flex-col items-center justify-center mb-2 transition-transform group-hover:scale-105`}>
                            <span className="text-4xl mb-2">{c.icon}</span>
                            <span className="font-bold text-gray-900">{c.name}</span>
                            <span className="text-xs text-gray-500">{c.members} Active</span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="p-4">
                <h2 className="font-bold text-lg mb-4">Trending Discussions</h2>
                <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <p className="font-medium text-sm">Is this Submariner dial legit?</p>
                            <p className="text-xs text-blue-500">#LegitCheck • Rolex Collectors</p>
                        </div>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                            <p className="font-medium text-sm">Trading my Leica M6 for a Hasselblad</p>
                            <p className="text-xs text-green-500">#Swap • Vintage Camera</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Placeholder (In a real app this would be in Layout) */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 flex justify-around text-2xl">
                <Link href="/feed" className="opacity-50 hover:opacity-100">🏠</Link>
                <Link href="/community" className="opacity-100">🌊</Link>
                <Link href="/upload" className="opacity-50 hover:opacity-100">➕</Link>
                <Link href="/chat" className="opacity-50 hover:opacity-100">💬</Link>
                <Link href="/settings" className="opacity-50 hover:opacity-100">👤</Link>
            </nav>
        </div>
    );
}
