import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

// Crear cliente de Supabase en el servidor
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbayhvryvczxquimkfys.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "tu_clave_service_role_aqui",
)

export async function GET(request: Request) {
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

    // Verificar rol de usuario
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single()

    if (roleError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al verificar permisos",
        },
        { status: 403 },
      )
    }

    if (roleData.role !== "admin" && roleData.role !== "editor") {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes permisos para acceder a esta sección",
        },
        { status: 403 },
      )
    }

    // Obtener contenido
    const { data: content, error: contentError } = await supabaseAdmin
      .from("content")
      .select("*")
      .order("created_at", { ascending: false })

    if (contentError) {
      return NextResponse.json(
        {
          success: false,
          message: contentError.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error: any) {
    console.error("Error en API route admin/content:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

