import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const { user, error: sessionError } = await getSession()

  if (sessionError || !user) {
    return NextResponse.json({ error: sessionError || "No se encontró la sesión" }, { status: 401 })
  }

  const supabase = createServerSupabaseClient()
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ profile })
}

