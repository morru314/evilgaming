import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
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

  // Obtener todos los contenidos
  const { data: content, error: contentError } = await supabase
    .from("content")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false })

  if (contentError) {
    return NextResponse.json({ error: contentError.message }, { status: 500 })
  }

  return NextResponse.json({ content })
}

