import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const { user, error: sessionError } = await getSession()

  if (sessionError || !user) {
    return NextResponse.json({ error: sessionError || "No se encontró la sesión" }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()

  // Verificar si el usuario es administrador
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile?.role !== "admin") {
    return NextResponse.json({ error: "No tienes permisos para acceder a este recurso" }, { status: 403 })
  }

  try {
    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "Se requiere userId y role" }, { status: 400 })
    }

    const { data, error } = await supabase.from("profiles").update({ role }).eq("id", userId).select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al asignar rol" },
      { status: 500 },
    )
  }
}

