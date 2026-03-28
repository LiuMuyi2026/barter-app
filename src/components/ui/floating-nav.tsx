'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FloatingNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Feed', href: '/feed', icon: '🏠' },
        { name: 'Search', href: '/search', icon: '🔍' },
        { name: 'Upload', href: '/upload', icon: '➕' },
        { name: 'Community', href: '/community', icon: '💬' },
        { name: 'Profile', href: '/profile', icon: '👤' },
    ];

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="glass px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl border-white/10">
                {navItems.map(item => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-violet-400 -translate-y-2' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span className="text-2xl filter drop-shadow-md">{item.icon}</span>
                            {isActive && (
                                <span className="text-[10px] font-bold tracking-widest uppercase animate-pulse">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
}
