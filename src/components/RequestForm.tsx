
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitApplication, FormState } from '@/app/actions'
import { Loader2, CheckCircle2, AlertCircle, Sprout, TreeDeciduous } from 'lucide-react'
import clsx from 'clsx'
import { Database } from '@/types'

const schema = z.object({
    name: z.string().min(2, "Név megadása kötelező"),
    address: z.string().min(5, "Lakcím megadása kötelező"),
    fruit: z.string().min(1, "Válassz gyümölcsfát"),
    bulb: z.boolean(),
})

type FormData = z.infer<typeof schema>
type InventoryItem = Database['public']['Tables']['inventory']['Row']

export default function RequestForm() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [loadingInventory, setLoadingInventory] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [formState, setFormState] = useState<FormState | null>(null)

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            bulb: false,
            fruit: ''
        }
    })

    // Real-time inventory subscription
    useEffect(() => {
        const supabase = createClient()

        const fetchInventory = async () => {
            const { data } = await supabase.from('inventory').select('*')
            if (data) setInventory(data)
            setLoadingInventory(false)
        }

        fetchInventory()

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'inventory',
                },
                (payload) => {
                    setInventory(current =>
                        current.map(item =>
                            item.id === payload.new.id ? payload.new as InventoryItem : item
                        )
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const onSubmit = (data: FormData) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('address', data.address)
        formData.append('fruit', data.fruit)
        if (data.bulb) formData.append('bulb', 'on')

        startTransition(async () => {
            const result = await submitApplication({} as FormState, formData)
            setFormState(result)
            if (result.success) {
                reset()
            }
        })
    }

    // Stock helpers
    const getStock = (id: string) => inventory.find(i => i.id === id)?.remaining || 0
    const bulbStock = getStock('hagyma')

    // Fruits config
    const fruits = [
        { id: 'barack', label: 'Barackfa', icon: '🍑' },
        { id: 'szilva', label: 'Szilvafa', icon: '🍇' }, // Emoji approx
        { id: 'korte', label: 'Körtefa', icon: '🍐' },
    ]

    if (formState?.success) {
        return (
            <div className="glass-panel p-8 rounded-3xl text-center max-w-md mx-auto animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Sikeres igénylés!</h2>
                <p className="text-slate-600 mb-8">Köszönjük jelentkezésedet. Hamarosan értesítünk a részletekről.</p>
                <button
                    onClick={() => setFormState(null)}
                    className="text-green-600 font-medium hover:underline"
                >
                    Új igénylés leadása
                </button>
            </div>
        )
    }

    return (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-outfit text-slate-800 mb-2">Igénylő űrlap</h2>
            <p className="text-slate-500 mb-8">Töltsd ki az adataidat a facsemete igényléséhez.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Teljes név</label>
                        <input
                            {...register('name')}
                            className="input-field"
                            placeholder="Pl. Gipsz Jakab"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Lakcím (Aszód)</label>
                        <input
                            {...register('address')}
                            className="input-field"
                            placeholder="Pl. Kossuth Lajos u. 1."
                        />
                        {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                    </div>
                </div>

                {/* Fruit Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <TreeDeciduous className="w-4 h-4 text-green-600" />
                        Válassz egy gyümölcsfát
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {fruits.map((fruit) => {
                            const stock = getStock(fruit.id)
                            const disabled = stock <= 0

                            return (
                                <label
                                    key={fruit.id}
                                    className={clsx(
                                        "relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                        watch('fruit') === fruit.id
                                            ? "border-green-600 bg-green-50 shadow-md transform scale-[1.02]"
                                            : "border-slate-100 bg-white hover:border-green-200 hover:bg-slate-50",
                                        disabled && "opacity-50 grayscale cursor-not-allowed hover:border-slate-100 hover:bg-white"
                                    )}
                                >
                                    <input
                                        type="radio"
                                        value={fruit.id}
                                        disabled={disabled}
                                        {...register('fruit')}
                                        className="sr-only"
                                    />
                                    <span className="text-4xl mb-3">{fruit.icon}</span>
                                    <span className="font-semibold text-slate-800">{fruit.label}</span>
                                    <span className={clsx(
                                        "text-xs font-medium mt-1 px-2 py-px rounded-full",
                                        stock > 10 ? "bg-green-100 text-green-700" :
                                            stock > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                    )}>
                                        {loadingInventory ? "Betöltés..." : stock > 0 ? `${stock} db maradt` : "ELFOGYOTT"}
                                    </span>
                                </label>
                            )
                        })}
                    </div>
                    {errors.fruit && <span className="text-red-500 text-sm">{errors.fruit.message}</span>}
                </div>

                {/* Bulb Selection - Only show if in stock */}
                {(loadingInventory || bulbStock > 0) && (
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                        <label className="flex items-start gap-4 cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('bulb')}
                                    className="w-6 h-6 border-2 border-orange-300 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                                        <Sprout className="w-5 h-5 text-orange-500" />
                                        Szeretnék virághagyma csomagot is
                                    </span>
                                    <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">
                                        {loadingInventory ? "..." : `${bulbStock} csomag maradt`}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Ingyenesen igényelhető 1 csomag vegyes virághagyma a facsemete mellé.
                                </p>
                            </div>
                        </label>
                    </div>
                )}

                {/* Error Message */}
                {formState?.message && !formState.success && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 text-red-700 border border-red-100">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{formState.message}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending || loadingInventory}
                    className="btn-primary w-full text-lg"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Beküldés...
                        </>
                    ) : (
                        "Igénylés leadása"
                    )}
                </button>

            </form>
        </div>
    )
}
