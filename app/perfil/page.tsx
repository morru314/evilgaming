"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserProfile() {
      try {
        // Verificar si hay una sesión activa
        const sessionResponse = await fetch("/api/auth/session")
        const sessionData = await sessionResponse.json()

        if (!sessionData.success || !sessionData.user) {
          // No hay sesión, redirigir al login
          router.push("/auth/server-auth")
          return
        }

        setUser(sessionData.user)

        // Cargar el perfil del usuario
        const profileResponse = await fetch(`/api/profile?userId=${sessionData.user.id}`)
        const profileData = await profileResponse.json()

        if (profileData.success && profileData.profile) {
          setProfile(profileData.profile)
          setUsername(profileData.profile.username || "")
          setFullName(profileData.profile.full_name || "")
        }
      } catch (err: any) {
        console.error("Error al cargar el perfil:", err)
        setError(`Error al cargar el perfil: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [router])

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          full_name: fullName,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSaveMessage("Perfil actualizado correctamente")
      } else {
        setError(data.message || "Error al actualizar el perfil")
      }
    } catch (err: any) {
      setError(`Error al guardar: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-gray-800" />
            <Skeleton className="h-4 w-72 bg-gray-800" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 bg-gray-800" />
              <Skeleton className="h-10 w-full bg-gray-800" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-800" />
              <Skeleton className="h-10 w-full bg-gray-800" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32 bg-gray-800" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Tu Perfil</CardTitle>
          <CardDescription>Administra tu información personal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {saveMessage && (
            <Alert className="bg-green-900 border-green-800">
              <AlertDescription className="text-green-100">{saveMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled className="bg-gray-800 border-gray-700" />
            <p className="text-xs text-gray-400">El email no se puede cambiar</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={saving} className="bg-red-600 hover:bg-red-700">
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

