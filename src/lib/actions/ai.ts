'use server';

import { AiService } from '@/lib/services/ai';

export async function analyzeImageAction(formData: FormData) {
    const file = formData.get('image') as File;
    if (!file) return { error: 'No image provided' };

    try {
        // In a real app, we'd pass the file buffer or upload to S3 first
        // For this mock/demo, we pass the file directly to our service
        // Note: Passing File objects to server actions works in Next.js 14+ specific cases, 
        // but typically we might need to serialize it. 
        // Our AiService mock doesn't actually read the file content, just the name. 
        // So we extract the name here to be safe and "simulate" the analysis.

        // However, let's try to keep the signature close to reality.
        const analysis = await AiService.analyzeItemImage(file);
        const valuation = await AiService.estimateValue(analysis);

        return { success: true, analysis, valuation };
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        return { error: 'Failed to analyze image' };
    }
}
