"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Film, ListOrdered, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateContentPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [contentType, setContentType] = useState("noticias")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Generar slug automáticamente a partir del título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Generar slug: convertir a minúsculas, reemplazar espacios por guiones y eliminar caracteres especiales
    const newSlug = newTitle
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    setSlug(newSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validaciones básicas
    if (!title || !slug || !description || !content || !contentType) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/content/create", {
        method: "POST",
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
        setSuccess("Contenido creado correctamente")
        // Redirigir después de un breve retraso
        setTimeout(() => {
          router.push("/admin")
        }, 1500)
      } else {
        setError(data.message || "Error al crear el contenido")
      }
    } catch (err: any) {
      console.error("Error al crear contenido:", err)
      setError(`Error al crear contenido: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Crear Nuevo Contenido</h1>
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
              Nuevo {contentType === "noticias" ? "Noticia" : contentType === "reviews" ? "Review" : "Top"}
            </CardTitle>
          </div>
          <CardDescription>Completa el formulario para crear nuevo contenido</CardDescription>
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
                  onChange={handleTitleChange}
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

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Contenido"}
              {!loading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

