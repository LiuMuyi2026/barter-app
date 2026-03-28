import { getMatches } from '@/lib/actions';
import { auth } from '@/auth';
import ChatClient from './ChatClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ChatPage() {
    const session = await auth();
    const matches = await getMatches();

    // Pass user ID to client for detecting "my" messages
    const currentUserId = session?.user?.id || '';

    return (
        <div>
            <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
                <Link href="/feed" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Back to Feed</Link>
            </div>
            <ChatClient initialMatches={matches} currentUserId={currentUserId} />
        </div>
    );
}
