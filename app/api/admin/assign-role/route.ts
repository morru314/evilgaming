import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Crear cliente de Supabase en el servidor
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cbayhvryvczxquimkfys.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "tu_clave_service_role_aqui",
)

export async function POST(request: Request) {
  try {
    const { userId, role, secretKey } = await request.json()

    // Verificar clave secreta para proteger esta ruta
    // Esta es una medida temporal, deberías usar un método más seguro en producción
    if (secretKey !== "clave_secreta_temporal") {
      return NextResponse.json(
        {
          success: false,
          message: "Clave secreta incorrecta",
        },
        { status: 401 },
      )
    }

    // Validar datos
    if (!userId || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Faltan datos requeridos",
        },
        { status: 400 },
      )
    }

    // Validar rol
    if (!["user", "editor", "admin"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Rol no válido",
        },
        { status: 400 },
      )
    }

    // Verificar si el usuario existe
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (userError || !userData.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 },
      )
    }

    // Actualizar rol en la tabla profiles
    const { error: updateError } = await supabaseAdmin.from("profiles").update({ role }).eq("id", userId)

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: updateError.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Rol ${role} asignado correctamente al usuario ${userId}`,
    })
  } catch (error: any) {
    console.error("Error en API route admin/assign-role:", error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    )
  }
}

