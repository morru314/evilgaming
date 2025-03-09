"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@/types"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Obtener datos del usuario de Supabase Auth
          const { data: authUser } = await supabase.auth.getUser()

          if (authUser?.user) {
            // Obtener el rol del usuario desde la tabla auth.users
            const { data: userData } = await supabase
              .from("auth.users")
              .select("role")
              .eq("id", authUser.user.id)
              .single()

            setUser({
              id: authUser.user.id,
              email: authUser.user.email || "",
              username: authUser.user.user_metadata?.username || "",
              role: userData?.role || "user",
              created_at: authUser.user.created_at,
            })
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Obtener datos del usuario de Supabase Auth
        const { data: authUser } = await supabase.auth.getUser()

        if (authUser?.user) {
          // Obtener el rol del usuario desde la tabla auth.users
          const { data: userData } = await supabase
            .from("auth.users")
            .select("role")
            .eq("id", authUser.user.id)
            .single()

          setUser({
            id: authUser.user.id,
            email: authUser.user.email || "",
            username: authUser.user.user_metadata?.username || "",
            role: userData?.role || "user",
            created_at: authUser.user.created_at,
          })
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

