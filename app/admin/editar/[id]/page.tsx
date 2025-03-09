"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Film, ListOrdered, Save, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditContentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [contentType, setContentType] = useState("noticias")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(`/api/admin/content/${id}`)
        const data = await response.json()

        if (data.success && data.content) {
          const item = data.content
          setTitle(item.title)
          setSlug(item.slug)
          setDescription(item.description)
          setContent(item.content)
          setImageUrl(item.image_url || "")
          setContentType(item.type)
          setCategory(item.category || "")
        } else {
          setError(data.message || "Error al cargar el contenido")
        }
      } catch (err: any) {
        console.error("Error al cargar contenido:", err)
        setError(`Error al cargar contenido: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    // Validaciones básicas
    if (!title || !slug || !description || !content || !contentType) {
      setError("Todos los campos son obligatorios")
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          content,
          image_url: imageUrl,
          type: contentType,
          category,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Contenido actualizado correctamente")
        // Redirigir después de un breve retraso
        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      } else {
        setError(data.message || "Error al actualizar el contenido")
      }
    } catch (err: any) {
      console.error("Error al actualizar contenido:", err)
      setError(`Error al actualizar contenido: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este contenido? Esta acción no se puede deshacer.")) {
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Contenido eliminado correctamente")
        // Redirigir después de un breve retraso
        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      } else {
        setError(data.message || "Error al eliminar el contenido")
      }
    } catch (err: any) {
      console.error("Error al eliminar contenido:", err)
      setError(`Error al eliminar contenido: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-20 bg-gray-800 mr-2" />
          <Skeleton className="h-8 w-48 bg-gray-800" />
        </div>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-gray-800" />
            <Skeleton className="h-4 w-72 bg-gray-800 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-800" />
                <Skeleton className="h-10 w-full bg-gray-800" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/admin">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Editar Contenido</h1>
        </div>
        <Button variant="outline" className="text-red-500 hover:text-red-400" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
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
            {contentType === "noticias" && <FileText className="h-5 w-5 text-blue-400 mr-2" />}
            {contentType === "reviews" && <Film className="h-5 w-5 text-green-400 mr-2" />}
            {contentType === "tops" && <ListOrdered className="h-5 w-5 text-yellow-400 mr-2" />}
            <CardTitle>
              Editar {contentType === "noticias" ? "Noticia" : contentType === "reviews" ? "Review" : "Top"}
            </CardTitle>
          </div>
          <CardDescription>Actualiza la información del contenido</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="contentType">Tipo de Contenido</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Selecciona el tipo de contenido" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="noticias">Noticia</SelectItem>
                    <SelectItem value="reviews">Review</SelectItem>
                    <SelectItem value="tops">Top</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Título del contenido"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="slug-del-contenido"
                />
                <p className="text-xs text-gray-400 mt-1">El slug se usa para la URL. Ejemplo: /noticias/{slug}</p>
              </div>

              <div>
                <Label htmlFor="description">Descripción corta</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-800 border-gray-700 min-h-[80px]"
                  placeholder="Breve descripción que aparecerá en las tarjetas y resúmenes"
                />
              </div>

              <div>
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-gray-800 border-gray-700 min-h-[200px]"
                  placeholder="Contenido principal del artículo"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">URL de la imagen</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Ejemplo: PS5, Xbox, PC, Nintendo"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={saving}>
              {saving ? "Guardando..." : "Actualizar Contenido"}
              {!saving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

