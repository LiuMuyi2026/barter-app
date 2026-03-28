export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-50 pb-20">
            {/* Header Skeleton */}
            <div className="w-full max-w-md flex justify-between items-center mb-4">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Card Skeleton */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden aspect-[3/4] p-4 flex flex-col">
                <div className="w-full h-[400px] bg-gray-200 rounded-xl animate-pulse mb-4"></div>
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-8"></div>

                <div className="flex justify-between mt-auto">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
