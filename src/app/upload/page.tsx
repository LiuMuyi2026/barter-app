import Link from 'next/link';
import { SmartUploadForm } from '@/components/smart-upload-form';

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/feed" className="text-gray-500 hover:text-black font-medium">
                        Cancel
                    </Link>
                    <h1 className="font-bold text-lg">New Listing</h1>
                    <div className="w-12"></div> {/* Spacer for centering */}
                </div>
            </div>

            <main className="px-4 py-8">
                <SmartUploadForm />
            </main>
        </div>
    );
}
