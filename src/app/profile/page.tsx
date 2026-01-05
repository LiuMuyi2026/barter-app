import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StreakBadge } from '@/components/streak-badge';
import { GlassCard } from '@/components/ui/glass-card';

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { _count: { select: { items: true, posts: true } } }
    });

    if (!user) redirect('/login');

    const verifiedDeals = await prisma.match.count({
        where: {
            OR: [
                { item1: { userId: user.id } },
                { item2: { userId: user.id } }
            ]
        }
    });

    const isVerifiedTrader = user.kycStatus === 'VERIFIED';
    const isTopContributor = verifiedDeals > 5;

    return (
        <div className="min-h-screen bg-black pb-24 px-4 pt-10">
            {/* Holographic Background Effect */}
            <div className="fixed inset-0 bg-gradient-to-br from-violet-900/20 via-black to-pink-900/20 pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto space-y-6">

                {/* Gamer ID Card */}
                <GlassCard neonBorder className="text-center relative overflow-visible mt-10">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full p-1 bg-gradient-to-r from-violet-500 to-pink-500 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-5xl font-bold text-white overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                                user.name?.[0]
                            )}
                        </div>
                        {isVerifiedTrader && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-black" title="Verified">
                                ✓
                            </div>
                        )}
                    </div>

                    <div className="mt-16">
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                            {user.name}
                            <StreakBadge />
                        </h1>
                        <p className="text-violet-300 font-medium">@{user.name?.toLowerCase().replace(/\s/g, '')}</p>

                        {user.bio && <p className="text-gray-400 text-sm mt-3">{user.bio}</p>}

                        <div className="flex justify-center gap-2 mt-4">
                            {isTopContributor && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-bold rounded-full">
                                    🏆 Top Contributor
                                </span>
                            )}
                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-xs font-bold rounded-full">
                                📅 Joined {new Date(user.createdAt).getFullYear()}
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                        <div>
                            <div className="text-2xl font-black text-white">{user._count.items}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Items</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{verifiedDeals}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Deals</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-pink-500">4.9</div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Rating</div>
                        </div>
                    </div>
                </GlassCard>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="glass p-4 rounded-xl text-left hover:bg-white/5 transition-colors group">
                        <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">⚙️</span>
                        <span className="font-bold text-white block">Settings</span>
                        <span className="text-xs text-gray-400">Manage account</span>
                    </button>
                    <button className="glass p-4 rounded-xl text-left hover:bg-white/5 transition-colors group">
                        <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">📦</span>
                        <span className="font-bold text-white block">My Inventory</span>
                        <span className="text-xs text-gray-400">View active listings</span>
                    </button>
                    <button className="glass p-4 rounded-xl text-left hover:bg-white/5 transition-colors group">
                        <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">❤️</span>
                        <span className="font-bold text-white block">Saved</span>
                        <span className="text-xs text-gray-400">Watchlist</span>
                    </button>
                    <button className="glass p-4 rounded-xl text-left hover:bg-white/5 transition-colors group">
                        <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">🔔</span>
                        <span className="font-bold text-white block">Alerts</span>
                        <span className="text-xs text-gray-400">Notifications</span>
                    </button>
                </div>

                <div className="text-center pt-8">
                    <Link href="/api/auth/signout" className="text-red-500 text-sm font-bold hover:underline opacity-50 hover:opacity-100">
                        Sign Out
                    </Link>
                </div>
            </div>
        </div>
    );
}
