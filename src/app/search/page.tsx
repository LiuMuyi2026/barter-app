
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { searchItems } from '@/lib/actions';
import Image from 'next/image';

export default async function SearchPage(
    props: {
        searchParams: Promise<{ q?: string; category?: string; min?: string; max?: string }>
    }
) {
    const searchParams = await props.searchParams;
    const q = searchParams.q || '';
    const category = searchParams.category || '';
    const min = Number(searchParams.min) || 0;
    const max = Number(searchParams.max) || 10000;

    const results = await searchItems(q, category, min, max);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex gap-2 mb-4">
                    <Link href="/feed" className="text-2xl">←</Link>
                    <form className="flex-1 flex gap-2">
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search Jordan, Supreme, Watch..."
                            className="flex-1 bg-gray-100 px-4 py-2 rounded-xl focus:outline-none"
                        />
                        <button className="bg-black text-white px-4 rounded-xl font-bold">Search</button>
                    </form>
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['Sneakers', 'Electronics', 'Clothing', 'Collectibles'].map(c => (
                        <Link
                            key={c}
                            href={`/search?q=${q}&category=${c}`}
                            className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap ${category === c ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {c}
                        </Link>
                    ))}
                    <Link href="/search?q=" className="px-4 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap">Clear</Link>
                </div>
            </header>

            <div className="p-4 grid grid-cols-2 gap-4">
                {results.length === 0 && (
                    <div className="col-span-2 text-center py-20 text-gray-400">
                        <span className="text-4xl block mb-2">🔍</span>
                        No results found. Try a different term.
                    </div>
                )}

                {results.map(item => (
                    <Link href={`/community/item/${item.id}`} key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                        <div className="aspect-[4/5] relative">
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-bold">
                                ${item.value}
                            </div>
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-sm truncate">{item.title}</h3>
                            <p className="text-xs text-gray-500">{item.brand}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
