
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

// Force dynamic rendering to ensure data is always fresh
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/admin/login')
    }

    // 2. Fetch Data
    const { data: applications, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

    // 3. Handle Logout Action (Server Action)
    async function signOut() {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 p-1.5 rounded-lg text-sm">ADMIN</span>
                    Igénylések
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 hidden sm:inline">{user.email}</span>
                    <form action={signOut}>
                        <button className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm">
                            <LogOut className="w-4 h-4" />
                            Kilépés
                        </button>
                    </form>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium uppercase">Összes</div>
                        <div className="text-2xl font-bold text-slate-900">{applications?.length || 0}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium uppercase">Barack 🍑</div>
                        <div className="text-2xl font-bold text-slate-900">{applications?.filter(a => a.fruit === 'barack').length || 0}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium uppercase">Szilva 🖼️</div>
                        <div className="text-2xl font-bold text-slate-900">{applications?.filter(a => a.fruit === 'szilva').length || 0}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-medium uppercase">Körte 🍐</div>
                        <div className="text-2xl font-bold text-slate-900">{applications?.filter(a => a.fruit === 'korte').length || 0}</div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Dátum</th>
                                    <th className="px-6 py-4">Név</th>
                                    <th className="px-6 py-4">Telefon</th>
                                    <th className="px-6 py-4">Cím</th>
                                    <th className="px-6 py-4">Igényelt Fa</th>
                                    <th className="px-6 py-4">Hagyma?</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {applications?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                                            Még nem érkezett igénylés.
                                        </td>
                                    </tr>
                                ) : (
                                    applications?.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                                {new Date(app.created_at).toLocaleString('hu-HU')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{app.name}</td>
                                            <td className="px-6 py-4 text-slate-600 font-mono">{app.phone}</td>
                                            <td className="px-6 py-4 text-slate-600">{app.address}</td>
                                            <td className="px-6 py-4">
                                                {app.fruit === 'barack' && <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-medium text-xs">🍑 Barack</span>}
                                                {app.fruit === 'szilva' && <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium text-xs">🖼️ Szilva</span>}
                                                {app.fruit === 'korte' && <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-medium text-xs">🍐 Körte</span>}
                                                {!app.fruit && <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {app.bulb ? (
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium text-xs">
                                                        🌷 Igen
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
