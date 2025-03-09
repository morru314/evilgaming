import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Crear cliente de Supabase en el servidor
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbayhvryvczxquimkfys.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "tu_clave_service_role_aqui",
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Se requiere el ID de usuario",
        },
        { status: 400 },
      )
    }

    // Obtener perfil del usuario
    const { data: profile, error } = await supabaseAdmin.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error al obtener perfil:", error)
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error: any) {
    console.error("Error en API route profile:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

