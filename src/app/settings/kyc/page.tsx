'use client';

import { useState } from 'react';
import { submitKyc } from '@/lib/actions';

export default function KycPage() {
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubmit(formData: FormData) {
        setStatus('uploading');
        setMessage('');

        const result = await submitKyc(formData);

        if (result.success) {
            setStatus('success');
            setMessage(result.message || 'Verification Submitted!');
        } else {
            setStatus('error');
            setMessage(result.message || 'Verification Failed');
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Identity Verification (KYC)</h1>
            <p className="text-gray-600 mb-6">
                To ensure a safe trading environment, we require all users to verify their identity.
                Please upload a clear photo of your Government ID (Passport or Driver's License).
            </p>

            {status === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                        <p className="font-bold">Verified!</p>
                        <p className="text-sm">{message}</p>
                    </div>
                </div>
            ) : (
                <form action={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                        <input
                            type="file"
                            name="idDocument"
                            id="idDocument"
                            accept="image/*"
                            required
                            className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
                        />
                        <div className="pointer-events-none">
                            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <p className="text-sm text-gray-500">Tap to upload Passport or Driver's License</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'uploading'}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-all"
                    >
                        {status === 'uploading' ? 'Verifying...' : 'Submit for Verification'}
                    </button>

                    {status === 'error' && (
                        <p className="text-red-500 text-sm text-center mt-2">{message}</p>
                    )}
                </form>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
                <span>Powered by <span className="font-semibold text-blue-500">BarterAI Guard™</span></span>
                <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Mock Mode
                </span>
            </div>
        </div>
    );
}
