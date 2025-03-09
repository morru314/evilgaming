"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClientSupabaseClient()

      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username,
            email,
          },
        ])

        if (profileError) throw profileError
      }

      router.push("/auth/login")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <span className="text-2xl font-bold">
            Evil<span className="text-red-600">Gaming</span>
          </span>
        </Link>

        {/* Register Form */}
        <div className="bg-navy-900 rounded-lg p-8">
          <div className="flex gap-4 mb-8">
            <Link href="/auth/login" className="flex-1 py-2 text-gray-400 hover:text-white text-center">
              Iniciar Sesión
            </Link>
            <button className="flex-1 py-2 text-white font-medium border-b-2 border-red-600">Registrarse</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Nombre de usuario</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-navy-800 border-navy-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-navy-800 border-navy-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-navy-800 border-navy-700"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Al registrarte, aceptas nuestros términos y condiciones.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

