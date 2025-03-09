import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

// Crear cliente de Supabase en el servidor
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbayhvryvczxquimkfys.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "tu_clave_service_role_aqui",
)

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabaseToken = cookieStore.get("supabase-auth-token")?.value

    if (!supabaseToken) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay sesión activa",
        },
        { status: 401 },
      )
    }

    // Verificar sesión
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(supabaseToken)

    if (userError || !userData.user) {
      return NextResponse.json(
        {
          success: false,
          message: userError?.message || "Usuario no autenticado",
        },
        { status: 401 },
      )
    }

    const userId = userData.user.id
    const { username, full_name } = await request.json()

    // Actualizar perfil
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        username,
        full_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error al actualizar perfil:", error)
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
      message: "Perfil actualizado correctamente",
    })
  } catch (error: any) {
    console.error("Error en API route profile update:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

