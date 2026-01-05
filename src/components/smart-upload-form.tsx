'use client';

import { useState, useActionState } from 'react';
import { uploadItem } from '@/lib/actions';
import { analyzeImageAction } from '@/lib/actions/ai';
import { useFormStatus } from 'react-dom';
import styles from '../app/item.module.css'; // Reuse existing styles or inline new ones

import { PricingMeter } from './pricing-meter';
import { ConditionSelector } from './condition-selector';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg mt-6 hover:bg-gray-800 disabled:opacity-50 transition-all shadow-xl" type="submit" disabled={pending}>
            {pending ? 'Publishing Listing...' : '🚀 Publish Listing'}
        </button>
    );
}

export function SmartUploadForm() {
    const [step, setStep] = useState(1);
    const [analyzing, setAnalyzing] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [state, formAction] = useActionState(uploadItem, undefined);

    // Form State (Auto-filled)
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        brand: '',
        model: '',
        condition: 'USED_GOOD',
        description: '',
        value: 0
    });

    const [aiData, setAiData] = useState<{
        confidence: number;
        priceRange: { min: number, max: number };
        reasoning: string;
    } | null>(null);


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setImages([file]);

        // Convert to Base64 for Persistence (Demo Only - In prod use S3)
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Mock Video Detection based on filename
        if (file.name.endsWith('.mp4') || file.name.endsWith('.mov')) {
            // In a real app, we'd handle video preview/compression here
            alert("Video selected! Processing thumbnail...");
        }

        // AI Analysis
        setAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const result = await analyzeImageAction(formData);

            if (result.error || !result.success) {
                throw new Error(result.error);
            }

            const { analysis: specs, valuation } = result;

            setFormData(prev => ({
                ...prev,
                title: `${specs.brand} ${specs.model}`,
                category: specs.category,
                brand: specs.brand,
                model: specs.model,
                condition: specs.condition,
                description: `Selling my ${(specs.condition || '').replace('_', ' ')} ${specs.brand} ${specs.model}. ${valuation.reasoning}`,
                value: valuation.estimatedValue
            }));

            setAiData({
                confidence: valuation.confidence,
                priceRange: valuation.priceRange,
                reasoning: valuation.reasoning
            });

            // Auto advance after short delay
            setTimeout(() => {
                setAnalyzing(false);
                setStep(2);
            }, 500);

        } catch (err) {
            console.error(err);
            setAnalyzing(false);
            alert("AI Analysis failed. Please enter details manually.");
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            {/* Step 1: Media */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">What are you trading?</h2>
                        <p className="text-gray-500">Upload a photo. Our AI will fill in the details.</p>
                    </div>

                    <label className="block w-full aspect-[4/5] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all relative overflow-hidden group">
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={handleImageUpload} />


                        {analyzing ? (
                            <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-blue-600 font-medium animate-pulse">Analyzing with Vision AI...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <span className="text-4xl">📸 🎥</span>
                                </div>
                                <span className="font-semibold text-gray-700">Tap to Upload Photo or Video</span>
                            </>
                        )}
                    </label>


                    <button onClick={() => setStep(2)} className="w-full text-gray-400 text-sm hover:text-gray-600">
                        Skip AI / Enter Manually
                    </button>
                </div>
            )}

            {/* Step 2: Details & Pricing */}
            {step === 2 && (
                <form action={formAction} className="space-y-6 animate-in slide-in-from-right duration-300">
                    {state?.message && <div className="p-3 bg-red-100 text-red-600 rounded-lg text-sm">{state.message}</div>}
                    {/* Hidden AI Fields */}
                    <input type="hidden" name="imageUrl" value={previewUrl || 'https://via.placeholder.com/400'} />
                    <input type="hidden" name="avsConfidence" value={aiData?.confidence || 0} />
                    <input type="hidden" name="avsEstimatedValue" value={aiData?.priceRange.min ? (aiData.priceRange.min + aiData.priceRange.max) / 2 : 0} />

                    <div className="flex gap-4 items-start">
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="w-20 h-24 object-cover rounded-lg shadow-sm" />
                        )}
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                            <input
                                name="title"
                                defaultValue={formData.title}
                                className="w-full text-xl font-bold border-b border-gray-200 focus:border-black focus:outline-none pb-2 bg-transparent"
                                placeholder="Item Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Brand</label>
                            <input name="brand" defaultValue={formData.brand} className="w-full p-3 bg-gray-50 rounded-lg border-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Model</label>
                            <input name="model" defaultValue={formData.model} className="w-full p-3 bg-gray-50 rounded-lg border-none" />
                        </div>
                    </div>

                    <ConditionSelector
                        value={formData.condition}
                        onChange={(val) => setFormData(prev => ({ ...prev, condition: val }))}
                    />

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <input
                                name="value"
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                                className="w-full pl-8 p-4 bg-gray-50 rounded-xl text-2xl font-bold"
                                required
                            />
                        </div>
                        <PricingMeter currentPrice={formData.value} suggestedRange={aiData?.priceRange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Original Price ($)</label>
                            <input
                                name="originalPrice"
                                type="number"
                                placeholder="0.00"
                                className="w-full p-3 bg-gray-50 rounded-lg border-none font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Shipping</label>
                            <select name="shippingInfo" className="w-full p-3 bg-gray-50 rounded-lg border-none font-medium">
                                <option value="meetup">🤝 Meetup Only</option>
                                <option value="shipping">📦 Shipping Available</option>
                            </select>
                        </div>
                    </div>


                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                        <textarea
                            name="description"
                            defaultValue={formData.description}
                            className="w-full p-4 bg-gray-50 rounded-xl min-h-[120px]"
                            placeholder="Tell the story of your item..."
                        />
                        {aiData?.reasoning && (
                            <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                                ✨ AI Tip: {aiData.reasoning}
                            </p>
                        )}
                    </div>

                    <SubmitButton />
                </form>
            )}
        </div>
    );
}
