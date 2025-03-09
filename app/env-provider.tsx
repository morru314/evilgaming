"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Crear un contexto para las variables de entorno
interface EnvContextType {
  supabaseUrl: string
  supabaseAnonKey: string
}

const EnvContext = createContext<EnvContextType>({
  supabaseUrl: "",
  supabaseAnonKey: "",
})

// Hook para usar las variables de entorno
export const useEnv = () => useContext(EnvContext)

// Proveedor de variables de entorno
export function EnvProvider({ children }: { children: ReactNode }) {
  const [env, setEnv] = useState<EnvContextType>({
    supabaseUrl: "",
    supabaseAnonKey: "",
  })

  useEffect(() => {
    // Establecer las variables de entorno desde window
    setEnv({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbayhvryvczxquimkfys.supabase.co",
      supabaseAnonKey:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYXlodnJ5dmN6eHF1aW1rZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMzQzMjcsImV4cCI6MjA1NjkxMDMyN30.Jnjozq4vIRTtyZG1t9iT0y_sRcXxjlwq3uZ_92NcTmg",
    })
  }, [])

  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>
}

