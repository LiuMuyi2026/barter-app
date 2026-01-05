'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function reportUser(targetId: string, reason: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    try {
        await prisma.report.create({
            data: {
                reporterId: session.user.id,
                targetId,
                reason,
                status: 'PENDING'
            }
        });
        return { success: true };
    } catch (e) {
        return { error: 'Failed to report user' };
    }
}

export async function reportItem(itemId: string, reason: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    try {
        await prisma.report.create({
            data: {
                reporterId: session.user.id,
                itemId,
                reason,
                status: 'PENDING'
            }
        });
        return { success: true };
    } catch (e) {
        return { error: 'Failed to report item' };
    }
}

export async function blockUser(targetId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: 'Unauthorized' };

    try {
        await prisma.block.create({
            data: {
                blockerId: session.user.id,
                blockedId: targetId
            }
        });
        revalidatePath('/feed');
        return { success: true };
    } catch (e) {
        // likely already blocked
        return { success: true };
    }
}
