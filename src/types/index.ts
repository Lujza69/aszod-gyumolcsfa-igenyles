
export type Database = {
    public: {
        Tables: {
            inventory: {
                Row: {
                    id: string
                    name: string
                    remaining: number
                }
                Insert: {
                    id: string
                    name: string
                    remaining: number
                }
                Update: {
                    id?: string
                    name?: string
                    remaining?: number
                }
            }
            applications: {
                Row: {
                    id: string
                    name: string
                    address: string
                    fruit: string | null
                    bulb: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    address: string
                    fruit?: string | null
                    bulb?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    address?: string
                    fruit?: string | null
                    bulb?: boolean
                    created_at?: string
                }
            }
        }
        Functions: {
            apply_request: {
                Args: {
                    p_name: string
                    p_address: string
                    p_fruit: string
                    p_bulb: boolean
                }
                Returns: {
                    success: boolean
                    id?: string
                    error?: string
                }
            }
        }
    }
}
