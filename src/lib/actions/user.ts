'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { AiService } from '@/lib/services/ai';

export async function submitKyc(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    const file = formData.get('idDocument') as File;
    if (!file) {
        return { message: 'No file uploaded' };
    }

    try {
        // 1. Set status to PENDING
        await prisma.user.update({
            where: { id: session.user.id },
            data: { kycStatus: 'PENDING' }
        });

        // 2. Perform AI Verification (Mock)
        const result = await AiService.performKYC(file);

        // 3. Update User based on result
        if (result.status === 'VERIFIED') {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    kycStatus: 'VERIFIED',
                    isVerified: true
                }
            });
            revalidatePath('/settings');
            return { success: true, message: 'Verification Successful!' };
        } else {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { kycStatus: 'REJECTED' }
            });
            return { success: false, message: 'Verification Failed. Please try again.' };
        }

    } catch (error) {
        console.error("KYC Error:", error);
        return { success: false, message: 'Server error during verification' };
    }
}

export async function updateSettings(settings: Record<string, any>) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    try {
        // Fetch existing settings to merge
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { settings: true }
        });

        const currentSettings = user?.settings ? JSON.parse(user.settings) : {};
        const newSettings = { ...currentSettings, ...settings };

        await prisma.user.update({
            where: { id: session.user.id },
            data: { settings: JSON.stringify(newSettings) }
        });

        revalidatePath('/settings');
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, message: 'Database Error' };
    }
}

export async function toggleSaveItem(itemId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    try {
        const existing = await prisma.savedItem.findUnique({
            where: {
                userId_itemId: {
                    userId: session.user.id,
                    itemId
                }
            }
        });

        if (existing) {
            await prisma.savedItem.delete({
                where: { id: existing.id }
            });
            revalidatePath('/profile');
            return { saved: false };
        } else {
            await prisma.savedItem.create({
                data: {
                    userId: session.user.id,
                    itemId
                }
            });
            revalidatePath('/profile');
            return { saved: true };
        }
    } catch (error) {
        return { message: 'Error toggling save' };
    }
}

export async function getNotifications() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });
}

export async function updateProfile(data: { bio?: string; bannerUrl?: string; name?: string }) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    await prisma.user.update({
        where: { id: session.user.id },
        data
    });
    revalidatePath('/profile');
    return { success: true };
}
