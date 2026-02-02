
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(2, "A név megadása kötelező (min. 2 karakter)"),
    address: z.string().min(5, "A lakcím megadása kötelező (min. 5 karakter)"),
    fruit: z.string().optional(),
    bulb: z.boolean().default(false),
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
        address: formData.get('address'),
        fruit: formData.get('fruit'),
        bulb: formData.get('bulb') === 'on',
    })

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Kérlek javítsd a hibákat az űrlapon.",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, address, fruit, bulb } = validatedFields.data
    const supabase = await createClient()

    try {
        const { data, error } = await supabase.rpc('apply_request', {
            p_name: name,
            p_address: address,
            p_fruit: fruit || null,
            p_bulb: bulb,
        })

        if (error) {
            console.error("RPC Error:", error)
            return { success: false, message: "Hiba történt a mentés során. Lehet, hogy időközben elfogyott a készlet." }
        }

        // RPC returns JSON, handle custom error logic from inside RPC if needed
        // But our RPC raises exception on stockout, which comes as `error` here.

        // However, if we change RPC to return checking status instead of raising, we check data.
        // Our current RPC raises exception for logic errors, so checking `error` is correct.

        return { success: true, message: "Sikeres jelentkezés!" }

    } catch (e) {
        console.error("Submission error:", e)
        return { success: false, message: "Váratlan hiba történt." }
    }
}
