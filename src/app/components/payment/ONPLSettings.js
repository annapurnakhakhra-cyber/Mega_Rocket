// src/components/payment/ONPLSettings.js
'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const API_BASE = '/api/onpl-settings'

export default function ONPLSettings() {
    const [pendingTimer, setPendingTimer] = useState('10')
    const [failedTimer, setFailedTimer] = useState('10')
    const [waiveCodCharges, setWaiveCodCharges] = useState(false)
    const [enableCodTimer, setEnableCodTimer] = useState(true)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [initialData, setInitialData] = useState(null)
    const [user, setUser] = useState(null);
    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                console.log("user data is", parsed);
            } catch (err) {
                console.error("Invalid user data in localStorage");
            }
        }
    }, []);

    const STORE_ID = user?.shopUrl;

    useEffect(() => {
        if (!STORE_ID) return;
        loadSettings()
    }, [STORE_ID])

    async function loadSettings() {
        try {
            setLoading(true)

            const res = await fetch(API_BASE, {
                method: 'GET',
                headers: {
                    'x-store-id': STORE_ID,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            })

            if (!res.ok) throw new Error('Failed to load settings')

            const data = await res.json()

            setPendingTimer(String(data.pendingTimer ?? 10))
            setFailedTimer(String(data.failedTimer ?? 10))
            setWaiveCodCharges(!!data.waiveCodCharges)
            setEnableCodTimer(data.enableCodTimer !== false)

            setInitialData(data)
        } catch (err) {
            console.error('Load error:', err)
            alert('Failed to load ONPL settings. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        if (saving) return

        setSaving(true)

        try {
            const payload = {
                pendingTimer: Number(pendingTimer),
                failedTimer: Number(failedTimer),
                waiveCodCharges,
                enableCodTimer,
            }

            const res = await fetch(API_BASE, {
                method: 'POST', 




























                
                headers: {
                    'x-store-id': STORE_ID,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to save settings')
            }

            const savedData = await res.json()
            setInitialData(savedData)

            alert('Settings saved successfully!')
        } catch (err) {
            console.error('Save error:', err)
            alert('Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    function handleRevert() {
        if (!initialData) return

        setPendingTimer(String(initialData.pendingTimer ?? 10))
        setFailedTimer(String(initialData.failedTimer ?? 10))
        setWaiveCodCharges(!!initialData.waiveCodCharges)
        setEnableCodTimer(initialData.enableCodTimer !== false)

        alert('Changes reverted to original values')
    }

    const isDirty = initialData && (
        Number(pendingTimer) !== (initialData.pendingTimer ?? 10) ||
        Number(failedTimer) !== (initialData.failedTimer ?? 10) ||
        waiveCodCharges !== !!initialData.waiveCodCharges ||
        enableCodTimer !== (initialData.enableCodTimer !== false)
    )

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                    <p className="text-gray-600 font-medium">Loading settings...</p>
                </div>
            </div>
        )
    }

    return (
      
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                

                {/* Main Card */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Card Header */}
                    <div className="border-b bg-gray-50/70 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Order Now Pay Later (ONPL)
                            </h2>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-5 py-8 sm:px-10">
                        <div className="mb-10">
                            <h3 className="mb-6 border-b border-gray-200 pb-3 text-xl font-semibold text-blue-700">
                                General Settings
                            </h3>

                            <div className="space-y-8">
                                {/* Pending Timer */}
                               <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8 justify-between">
                                    <div>
                                        <label htmlFor="pending-timer" className="block text-base font-medium text-gray-900">
                                            Pending ONPL Timer
                                        </label>
                                        <p className="mt-1.5 text-sm text-gray-600">
                                            Waiting time (minutes) before auto placing as COD
                                        </p>
                                    </div>
                                    <div>
                                    <input
                                        id="pending-timer"
                                        type="number"
                                        min="1"
                                        value={pendingTimer}
                                        onChange={(e) => setPendingTimer(e.target.value)}
                                        className="h-11 w-full max-w-xs rounded-lg border border-gray-300 px-4 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                                    />
                                    </div>
                                </div>

                                {/* Failed Timer */}
                               <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8 justify-between">
                                    <div>
                                        <label htmlFor="failed-timer" className="block text-base font-medium text-gray-900">
                                            Failed ONPL Timer
                                        </label>
                                        <p className="mt-1.5 text-sm text-gray-600">
                                            Waiting time (minutes) before auto placing as COD
                                        </p>
                                    </div>
                                    <div>
                                    <input
                                        id="failed-timer"
                                        type="number"
                                        min="1"
                                        value={failedTimer}
                                        onChange={(e) => setFailedTimer(e.target.value)}
                                        className="h-11 w-full max-w-xs rounded-lg border border-gray-300 px-4 text-base shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                                    />
                                    </div>
                                </div>

                                {/* Waive COD Charges */}
                                <div className="flex items-start justify-between gap-6 py-3">
                                    <div>
                                        <div className="text-base font-medium text-gray-900">Waive Off COD Charges</div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Automatically remove COD charges for ONPL orders
                                        </p>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={waiveCodCharges}
                                            onChange={() => setWaiveCodCharges(v => !v)}
                                            className="sr-only peer"
                                        />
                                        <div className="peer h-7 w-14 rounded-full bg-gray-300 transition-colors duration-300 after:content-[''] after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-gray-300 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-7 peer-focus:ring-4 peer-focus:ring-blue-300/40"></div>
                                    </label>
                                </div>

                                {/* Enable COD Auto-Conversion Timer */}
                                <div className="flex items-start justify-between gap-6 py-3">
                                    <div>
                                        <div className="text-base font-medium text-gray-900">Enable COD Auto-Conversion Timer</div>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Automatically convert to COD if prepaid payment is not completed
                                        </p>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={enableCodTimer}
                                            onChange={() => setEnableCodTimer(v => !v)}
                                            className="sr-only peer"
                                        />
                                        <div className="peer h-7 w-14 rounded-full bg-gray-300 transition-colors duration-300 after:content-[''] after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:border after:border-gray-300 after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-7 peer-focus:ring-4 peer-focus:ring-blue-300/40"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Action Bar */}
                    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-white/95 backdrop-blur-lg px-4 py-5 shadow-xl sm:static sm:bg-white sm:backdrop-blur-none sm:shadow-none sm:py-6">
                        <div className="mx-auto max-w-5xl flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={!isDirty || saving}
                                onClick={handleRevert}
                                className="h-12 flex items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-6 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition min-w-[140px] cursor-pointer"
                            >
                                <RotateCcw size={18} />
                                Revert Changes
                            </button>

                            <button
                                type="button"
                                disabled={saving || !isDirty}
                                onClick={handleSave}
                                className="h-12 flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-8 text-base font-medium text-white shadow-md hover:bg-blue-700 disabled:opacity-60 transition min-w-[140px] cursor-pointer"
                            >
                                {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        
    )
} 