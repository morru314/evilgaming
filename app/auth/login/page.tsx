"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClientSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push("/")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/auth/register" className="text-red-600 hover:text-red-500">
                Regístrate
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

