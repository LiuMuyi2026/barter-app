'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import styles from '../item.module.css';
import { StreakBadge } from '@/components/streak-badge';

export function FeedHeader() {
    const { t } = useLanguage();

    return (
        <>
            <div className={styles.nav}>
                <StreakBadge />
                <Link href="/upload" className="btn btn-primary">{t('upload.title') || 'Upload Item'}</Link>
                <Link href="/api/auth/signout" className="btn" style={{ marginLeft: '1rem' }}>{t('common.signout') || 'Sign Out'}</Link>
            </div>
            <h1 className="title" style={{ textAlign: 'center', marginTop: '2rem' }}>{t('feed.title') || 'Discover'}</h1>
        </>
    );
}
