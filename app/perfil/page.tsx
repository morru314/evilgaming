"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import Image from "next/image"

export default function PerfilPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function getProfile() {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (error) {
        console.error(error)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    getProfile()
  }, [router, supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setUpdating(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          bio: profile.bio,
          website: profile.website,
        })
        .eq("id", profile.id)

      if (error) throw error

      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al actualizar el perfil")
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando perfil...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Mi Perfil</h1>
          <p className="text-gray-300 max-w-2xl">Gestiona tu información personal y preferencias de cuenta.</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy-900 rounded-lg p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 bg-green-900 border-green-800">
                <AlertDescription className="text-green-300">Perfil actualizado correctamente</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="aspect-square relative rounded-full overflow-hidden mb-4 max-w-[200px] mx-auto">
                  <Image
                    src={profile.avatar_url || "/placeholder.svg?height=200&width=200"}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">{profile.username}</h2>
                  <p className="text-gray-400 mb-4">{profile.email}</p>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </div>

              <div className="md:w-2/3">
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-400">Nombre de usuario</label>
                    <Input
                      value={profile.username || ""}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="bg-navy-800 border-navy-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Biografía</label>
                    <Textarea
                      value={profile.bio || ""}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="bg-navy-800 border-navy-700 h-32"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Sitio web</label>
                    <Input
                      value={profile.website || ""}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="bg-navy-800 border-navy-700"
                    />
                  </div>

                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={updating}>
                    {updating ? "Actualizando..." : "Guardar cambios"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

