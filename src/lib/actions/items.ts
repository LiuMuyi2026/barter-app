'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const UploadItemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url('Invalid Image URL'),
    category: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    condition: z.enum(['BRAND_NEW', 'LIKE_NEW', 'USED_GOOD', 'USED_FAIR']).optional(),
    value: z.coerce.number().min(0, 'Value must be positive'),
    avsConfidence: z.coerce.number().optional(),
    avsEstimatedValue: z.coerce.number().optional()
});


export type UploadState = {
    errors?: {
        title?: string[];
        description?: string[];
        imageUrl?: string[];
    };
    message?: string;
} | undefined;

export async function uploadItem(prevState: UploadState, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Unauthorized' };
    }

    const validated = UploadItemSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        imageUrl: formData.get('imageUrl'),
        category: formData.get('category'),
        brand: formData.get('brand'),
        model: formData.get('model'),
        condition: formData.get('condition'),
        value: formData.get('value'),
        avsConfidence: formData.get('avsConfidence'),
        avsEstimatedValue: formData.get('avsEstimatedValue'),
    });

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: 'Missing Fields',
        };
    }

    const data = validated.data;

    try {
        await prisma.item.create({
            data: {
                title: data.title,
                description: data.description,
                imageUrl: data.imageUrl,
                value: data.value,
                category: data.category,
                brand: data.brand,
                model: data.model,
                condition: data.condition as any, // Prisma Enum casting
                avsEstimatedValue: data.avsEstimatedValue,
                avsConfidence: data.avsConfidence,
                userId: session.user.id,
            },
        });

    } catch (error) {
        console.error(error);
        return { message: 'Database Error: Failed to Create Item' };
    }

    revalidatePath('/feed');
    redirect('/feed');
}

export async function getFeed() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const swipedItemIds = await prisma.like.findMany({
        where: { fromUserId: session.user.id },
        select: { toItemId: true },
    });

    const swipedIds = swipedItemIds.map((l: { toItemId: string }) => l.toItemId);

    const items = await prisma.item.findMany({
        where: {
            userId: { not: session.user.id },
            id: { notIn: swipedIds }
        },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    return items;
}

export async function searchItems(query: any, category: any, minPrice: number, maxPrice: number) {
    const q = String(query || '').trim();
    const cat = String(category || '').trim();

    if (!prisma) return [];

    const where: any = {};
    if (q) {
        where.OR = [
            { title: { contains: q } },
            { description: { contains: q } },
            { brand: { contains: q } }
        ];
    }
    if (cat) where.category = cat;
    if (maxPrice > 0) where.value = { gte: minPrice || 0, lte: maxPrice };

    return await prisma.item.findMany({
        where,
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });
}
