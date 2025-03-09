import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  })
}

export async function getSession() {
  const cookieStore = cookies()
  const supabaseToken = cookieStore.get("supabase-auth-token")?.value

  if (!supabaseToken) {
    return { user: null, error: "No session found" }
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.getUser(supabaseToken)

  if (error || !data?.user) {
    return { user: null, error: error?.message || "Invalid session" }
  }

  return { user: data.user, error: null }
}

export async function getServerProfile() {
  const { user, error: sessionError } = await getSession()

  if (sessionError || !user) {
    return { profile: null, error: sessionError }
  }

  const supabase = createServerSupabaseClient()
  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profileError) {
    return { profile: null, error: profileError.message }
  }

  return { profile, error: null }
}

export async function getServerContent(type?: string) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from("content")
    .select("*, profiles(username)")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (type) {
    query = query.eq("type", type)
  }

  const { data, error } = await query

  if (error) {
    return { content: null, error: error.message }
  }

  return { content: data, error: null }
}

