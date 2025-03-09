import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  // Asegurarse de que las variables de entorno estén definidas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Verificar que las variables de entorno estén disponibles
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Please check your environment variables.")
  }

  return createServerClient<Database>(
    supabaseUrl || "https://cbayhvryvczxquimkfys.supabase.co",
    supabaseAnonKey ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYXlodnJ5dmN6eHF1aW1rZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMzQzMjcsImV4cCI6MjA1NjkxMDMyN30.Jnjozq4vIRTtyZG1t9iT0y_sRcXxjlwq3uZ_92NcTmg",
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )
}

