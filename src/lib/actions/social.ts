'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { pusherServer } from '@/lib/pusher';

// Helper: Validate 10% Trading Rule
function validateTrade(valueA: number, valueB: number): boolean {
    const delta = Math.abs(valueA - valueB);
    const lowerValue = Math.min(valueA, valueB);
    return delta <= (lowerValue * 0.10);
}

export async function swipeItem(itemId: string, direction: 'right' | 'left') {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    const isLike = direction === 'right';

    try {
        const myItem = await prisma.item.findFirst({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        if (isLike) {
            if (!myItem) return { error: "You need an item to trade!", match: false };

            const targetItem = await prisma.item.findUnique({ where: { id: itemId } });
            if (!targetItem) return { message: 'Item not found' };

            if (!validateTrade(myItem.value, targetItem.value)) {
                return { error: 'Value Mismatch! Outside 10% range.', match: false };
            }
        }

        await prisma.like.create({
            data: {
                fromUserId: session.user.id,
                fromItemId: myItem?.id,
                toItemId: itemId,
                isLike,
            }
        });

        if (isLike && myItem) {
            const incomingLike = await prisma.like.findFirst({
                where: {
                    fromItemId: itemId,     // From THEM
                    toItemId: myItem.id,    // To ME
                    isLike: true,
                }
            });

            if (incomingLike) {
                await prisma.match.create({
                    data: {
                        item1Id: incomingLike.fromItemId!,
                        item2Id: myItem.id,
                    }
                });
                return { match: true, message: "It's a Match!" };
            }
        }

        return { match: false, message: 'Swipe recorded' };

    } catch (error) {
        console.error("Swipe Error:", error);
        return { message: 'Failed to record swipe' };
    }
}

export async function getMatches() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const matches = await prisma.match.findMany({
        where: {
            OR: [
                { item1: { userId: session.user.id } },
                { item2: { userId: session.user.id } }
            ]
        },
        include: {
            item1: { include: { user: { select: { id: true, name: true, email: true } } } },
            item2: { include: { user: { select: { id: true, name: true, email: true } } } },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return matches.map((match: any) => {
        const isItem1Mine = match.item1.userId === session.user?.id;
        const myItem = isItem1Mine ? match.item1 : match.item2;
        const otherItem = isItem1Mine ? match.item2 : match.item1;

        return {
            id: match.id,
            myItem,
            otherItem,
            lastMessage: match.messages[0]?.content || "New Match!"
        };
    });
}

export async function getMessages(matchId: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const messages = await prisma.message.findMany({
        where: { matchId },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { name: true, id: true } } }
    });

    return messages;
}

export async function sendMessage(matchId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    if (!content.trim()) return { message: 'Message cannot be empty' };

    const BANNED_WORDS = ['whatsapp', 'telegram', 'bank', 'transfer', 'venmo', 'zelle', 'pay'];
    const lowerContent = content.toLowerCase();

    if (BANNED_WORDS.some(w => lowerContent.includes(w))) {
        return { error: 'Safety Alert: For your protection, please keep all communication and payments within the app.' };
    }

    try {
        const message = await prisma.message.create({
            data: {
                matchId,
                content,
                senderId: session.user.id
            },
            include: { sender: { select: { name: true, id: true } } }
        });

        // Trigger Real-Time Event
        // Channel: match-{matchId}
        // Event: new-message
        await pusherServer.trigger(`match-${matchId}`, 'new-message', message);

        revalidatePath('/chat');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { message: 'Failed to send message' };
    }
}

export async function addComment(postId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    if (!content.trim()) return { message: 'Comment cannot be empty' };

    try {
        await prisma.comment.create({
            data: {
                content,
                postId,
                userId: session.user.id
            }
        });

        revalidatePath(`/community/[id]/post/${postId}`);
        return { success: true };
    } catch (err) {
        console.error("Comment Error:", err);
        return { message: "Failed to post comment" };
    }
}

export async function checkStreak() {
    const session = await auth();
    if (!session?.user?.id) return { streak: 0 };

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { lastActive: true, streakCount: true }
    });

    if (!user) return { streak: 0 };

    const now = new Date();
    const lastActive = new Date(user.lastActive);

    const diffTime = Math.abs(now.getTime() - lastActive.getTime());

    // Day comparison logic
    const isSameDay = now.toDateString() === lastActive.toDateString();
    const isYesterday = new Date(new Date().setDate(now.getDate() - 1)).toDateString() === lastActive.toDateString();

    let newStreak = user.streakCount;

    if (isSameDay) {
        // Do nothing
    } else if (isYesterday) {
        newStreak += 1;
    } else {
        newStreak = 1;
    }

    if (!isSameDay) {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                lastActive: new Date(),
                streakCount: newStreak
            }
        });
    }

    return { streak: newStreak };
}

export async function upvoteComment(commentId: string) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Unauthorized' };

    try {
        await prisma.comment.update({
            where: { id: commentId },
            data: { upvotes: { increment: 1 } }
        });

        // Find post to revalidate
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { postId: true }
        });

        if (comment) {
            revalidatePath(`/community/[id]/post/${comment.postId}`);
        }
        return { success: true };
    } catch (err) {
        return { message: "Failed to upvote" };
    }
}
