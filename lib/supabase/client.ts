"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Crear el cliente de Supabase con valores hardcodeados para asegurar que funcione
export const supabase = createClient<Database>(
  "https://cbayhvryvczxquimkfys.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYXlodnJ5dmN6eHF1aW1rZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMzQzMjcsImV4cCI6MjA1NjkxMDMyN30.Jnjozq4vIRTtyZG1t9iT0y_sRcXxjlwq3uZ_92NcTmg",
)

