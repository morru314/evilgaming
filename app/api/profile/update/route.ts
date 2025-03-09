import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const { user, error: sessionError } = await getSession()

  if (sessionError || !user) {
    return NextResponse.json({ error: sessionError || "No se encontró la sesión" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, profile: data[0] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar perfil" },
      { status: 500 },
    )
  }
}

