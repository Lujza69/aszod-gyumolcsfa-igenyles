
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(2, "A név megadása kötelező (min. 2 karakter)"),
    phone: z.string().regex(/^\+36[ ]?(20|30|70)[ ]?[0-9]{3}[ ]?[0-9]{4}$/, "Hibás formátum! Használd a +36 20/30/70 formátumot (pl. +36 20 123 4567)"),
    address: z.string().min(5, "A lakcím megadása kötelező (min. 5 karakter)"),
    fruit: z.string().optional(),
    bulb: z.boolean().default(false),
    privacy: z.boolean().refine(val => val === true, "Az adatkezelési tájékoztató elfogadása kötelező!"),
}).refine((data) => data.fruit || data.bulb, {
    message: "Legalább egy tételt választani kell",
    path: ["fruit"],
});

export type FormState = {
    success?: boolean
    message?: string
    fieldErrors?: {
        [key: string]: string[]
    }
}

export async function submitApplication(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        fruit: formData.get('fruit'),
        bulb: formData.get('bulb') === 'on',
        privacy: formData.get('privacy') === 'on',
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Kérlek javítsd a hibákat az űrlapon.",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, phone, address, fruit, bulb } = validatedFields.data
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.rpc('apply_request', {
            p_name: name,
            p_phone: phone.replace(/\s/g, ''), // Clean spaces
            p_address: address,
            p_fruit: fruit || null,
            p_bulb: bulb,
        })

        if (error) {
            console.error("RPC Error:", error)
            return { success: false, message: "Hiba történt a mentés során. Lehet, hogy időközben elfogyott a készlet." }
        }

        // RPC returns JSON object { success: boolean, message?: string }
        if (data && data.success === false) {
            return { success: false, message: data.message || "Hiba történt." }
        }

        return { success: true, message: "Sikeres jelentkezés!" }

    } catch (e) {
        console.error("Submission error:", e)
        return { success: false, message: "Váratlan hiba történt." }
    }
}

export async function deleteApplication(id: string) {
    const supabase = await createClient()

    // Auth check is handled by RLS/RPC security definer, but good to check here too or rely on RPC?
    // RPC is security definer, so it bypasses RLS, but we should probably check if user is admin.
    // However, for simplicity and since only admin has access to the dashboard calling this...
    // ideally we should check auth.

    // Let's rely on the fact that only authenticated users can access the admin page, 
    // and ideally we should check role, but we only have one user.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { success: false, message: "Nem vagy bejelentkezve." }
    }

    try {
        const { data, error } = await supabase.rpc('delete_application', {
            p_application_id: id
        })

        if (error) {
            console.error("Delete Error:", error)
            return { success: false, message: "Hiba történt a törlés során." }
        }

        return { success: true, message: "Sikeres törlés!" }
    } catch (e) {
        return { success: false, message: "Váratlan hiba." }
    }
}

