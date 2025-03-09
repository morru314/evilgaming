import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Asegurarse de que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Verificar que las variables de entorno estén disponibles
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL or Service Key is missing. Please check your environment variables.")
}

// Este cliente usa la clave de servicio y solo debe usarse en el servidor
const supabaseAdmin = createClient<Database>(
  supabaseUrl || "https://cbayhvryvczxquimkfys.supabase.co",
  supabaseServiceKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiYXlodnJ5dmN6eHF1aW1rZnlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTMzNDMyNywiZXhwIjoyMDU2OTEwMzI3fQ.TKIs1QqD3HnjlNNurTutrGiGlrmgSw3nFIZ1Im1Mid0",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export { supabaseAdmin }

