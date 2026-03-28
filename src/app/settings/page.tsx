'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { updateSettings } from '@/lib/actions';


export default function SettingsPage() {
    const { t, language, setLanguage } = useLanguage();
    const [activeTab, setActiveTab] = useState<'account' | 'privacy' | 'notifications' | 'general'>('general');

    const handleUpdate = async (key: string, value: boolean) => {
        await updateSettings({ [key]: value });
    };


    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/feed" className="text-gray-500 hover:text-gray-900">
                        ← Back
                    </Link>
                    <h1 className="text-xl font-bold">{t('settings.title')}</h1>
                    <div className="w-8" />
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'general' ? 'bg-black text-white' : 'bg-white text-gray-600 border'}`}
                    >
                        {t('settings.general')}
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'account' ? 'bg-black text-white' : 'bg-white text-gray-600 border'}`}
                    >
                        {t('settings.account')}
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'privacy' ? 'bg-black text-white' : 'bg-white text-gray-600 border'}`}
                    >
                        {t('settings.privacy')}
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'notifications' ? 'bg-black text-white' : 'bg-white text-gray-600 border'}`}
                    >
                        {t('settings.notifications')}
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">{t('settings.language')}</h3>
                                    <p className="text-sm text-gray-500">Change application language</p>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as any)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                >
                                    <option value="en">English 🇺🇸</option>
                                    <option value="zh">简体中文 🇨🇳</option>
                                    <option value="ja">日本語 🇯🇵</option>
                                    <option value="es">Español 🇪🇸</option>
                                    <option value="fr">Français 🇫🇷</option>
                                    <option value="de">Deutsch 🇩🇪</option>
                                </select>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Clear Cache</h3>
                                    <p className="text-sm text-gray-500">Free up space (128 MB)</p>
                                </div>
                                <button className="text-red-500 text-sm font-medium hover:text-red-600">Clear</button>
                            </div>
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="divide-y divide-gray-100">
                            <Link href="/settings/kyc" className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                        {t('settings.kyc')}
                                        <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border">REQUIRED</span>
                                    </h3>
                                    <p className="text-sm text-gray-500">Get Verified badge & unlocking trading limits</p>
                                </div>
                                <span className="text-gray-400">→</span>
                            </Link>
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Linked Accounts</h3>
                                    <p className="text-sm text-gray-500">Google, Facebook</p>
                                </div>
                                <span className="text-blue-600 text-sm font-medium">Manage</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="text-red-600 font-medium">Delete Account</div>
                            </div>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Location Services</h3>
                                    <p className="text-sm text-gray-500">Show in "Near Me" searches</p>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleUpdate('locationServices', e.target.checked)}
                                        name="toggle"
                                        id="toggle"
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                    />
                                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>

                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Hide Sold Items</h3>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleUpdate('hideSold', e.target.checked)}
                                        defaultChecked
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                    />
                                    <label className="toggle-label block overflow-hidden h-6 rounded-full bg-green-400 cursor-pointer"></label>

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
