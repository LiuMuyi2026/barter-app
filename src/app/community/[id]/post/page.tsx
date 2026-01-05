import Link from 'next/link';

export default async function CreatePostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white sticky top-0 z-10 p-4 shadow-sm flex items-center justify-between">
                <Link href={`/community/${id}`} className="text-gray-500">Cancel</Link>
                <h1 className="font-bold">New Post</h1>
                <button className="text-blue-600 font-bold">Post</button>
            </header>

            <div className="p-4 space-y-6">
                {/* Post Type Selector */}
                <div className="flex bg-gray-200 p-1 rounded-xl">
                    <button className="flex-1 bg-white shadow-sm py-2 rounded-lg text-sm font-bold">Legit Check 🔍</button>
                    <button className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-500">Showcase ✨</button>
                </div>

                {/* Legit Check Template */}
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-700">
                        To get an accurate check, please upload clear photos of: Tag, Stitching, and Box Label.
                    </div>

                    <textarea
                        placeholder="Describe the item, where you bought it, and what concerns you have..."
                        className="w-full p-4 bg-white rounded-xl h-32 resize-none focus:outline-none"
                    ></textarea>

                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                                <span>+ Photo</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
