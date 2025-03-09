"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push("/")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className="mt-2 text-gray-400">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register" className="text-red-500 hover:underline">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  )
}

