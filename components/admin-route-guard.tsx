"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkPermission() {
      try {
        // Verificar si hay una sesión activa
        const sessionResponse = await fetch("/api/auth/session")
        const sessionData = await sessionResponse.json()

        if (!sessionData.success || !sessionData.user) {
          // No hay sesión, redirigir al login
          router.push("/auth/server-auth")
          return
        }

        // Verificar rol de usuario
        const profileResponse = await fetch(`/api/profile?userId=${sessionData.user.id}`)
        const profileData = await profileResponse.json()

        if (!profileData.success || !profileData.profile) {
          setError("No se pudo verificar tu perfil")
          return
        }

        const userRole = profileData.profile.role

        if (userRole !== "admin" && userRole !== "editor") {
          setError("No tienes permisos para acceder a esta sección")
          setTimeout(() => {
            router.push("/")
          }, 3000)
          return
        }

        // Usuario autenticado y con permisos
        setLoading(false)
      } catch (err: any) {
        console.error("Error al verificar permisos:", err)
        setError(`Error al verificar permisos: ${err.message}`)
      }
    }

    checkPermission()
  }, [router])

  if (loading && !error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-48 bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <p className="text-center text-gray-400">Redirigiendo al inicio...</p>
      </div>
    )
  }

  return <>{children}</>
}

