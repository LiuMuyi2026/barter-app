import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/30 rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-600">
          BARTER
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold text-violet-300 mb-8 animate-fade-in-up">
          ✨ The Future of Trading is Here
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 max-w-4xl mx-auto leading-[0.9]">
          <span className="block text-white">TRADE UP.</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500">
            CASH DOWN.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The social marketplace where value is determined by demand, not dollars.
          Swipe to trade your way to better gear.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/feed"
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full text-lg font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/50 hover:scale-105 transition-all"
          >
            Start Trading Now
          </Link>
          <Link
            href="/upload"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-lg font-bold hover:bg-white/10 transition-all backdrop-blur-md"
          >
            List an Item
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32">
          <GlassCard className="p-8 text-left">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI Valuation</h3>
            <p className="text-gray-400">Our Vision AI analyzes your items instantly to suggest fair trade values.</p>
          </GlassCard>
          <GlassCard className="p-8 text-left">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Real-Time Chat</h3>
            <p className="text-gray-400">Connect instantly with traders. No lag, just deals.</p>
          </GlassCard>
          <GlassCard className="p-8 text-left">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Verified Trust</h3>
            <p className="text-gray-400">Identify top traders with our Reputation & Streak system.</p>
          </GlassCard>
        </div>
      </main>

      <footer className="relative z-10 py-12 text-center text-gray-600 text-sm mt-20">
        &copy; 2026 Barter App. Built with Next.js 16 & Neon.
      </footer>
    </div>
  );
}
