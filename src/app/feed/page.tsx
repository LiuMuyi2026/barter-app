import { getFeed } from '@/lib/actions';
import FeedClient from './FeedClient';
import { FeedHeader } from './FeedHeader';
import styles from '../item.module.css';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
    const items = await getFeed();

    return (
        <div className="container">
            <FeedHeader />
            <FeedClient initialItems={items} />
        </div>
    );
}
