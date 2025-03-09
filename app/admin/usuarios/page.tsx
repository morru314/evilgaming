"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, UserCog } from "lucide-react"
import Link from "next/link"

export default function AdminUsersPage() {
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("editor")
  const [secretKey, setSecretKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validaciones básicas
    if (!userId || !role || !secretKey) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/assign-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role,
          secretKey,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        // Limpiar formulario
        setUserId("")
        setSecretKey("")
      } else {
        setError(data.message || "Error al asignar rol")
      }
    } catch (err: any) {
      console.error("Error al asignar rol:", err)
      setError(`Error al asignar rol: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-900 border-green-800 mb-6">
          <AlertDescription className="text-green-100">{success}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center mb-2">
            <UserCog className="h-5 w-5 text-blue-400 mr-2" />
            <CardTitle>Asignar Rol a Usuario</CardTitle>
          </div>
          <CardDescription>Asigna roles de administrador o editor a los usuarios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAssignRole} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">ID del Usuario</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="UUID del usuario"
                />
                <p className="text-xs text-gray-400 mt-1">El ID del usuario se encuentra en la tabla auth.users</p>
              </div>

              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  <strong>Usuario:</strong> Solo puede comentar
                  <br />
                  <strong>Editor:</strong> Puede crear y editar contenido
                  <br />
                  <strong>Administrador:</strong> Acceso completo
                </p>
              </div>

              <div>
                <Label htmlFor="secretKey">Clave Secreta</Label>
                <Input
                  id="secretKey"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Clave secreta para autorizar cambios"
                />
                <p className="text-xs text-gray-400 mt-1">La clave secreta temporal es: clave_secreta_temporal</p>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Asignando..." : "Asignar Rol"}
              {!loading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

