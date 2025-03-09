"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit, Trash2, FileText, Film, ListOrdered } from "lucide-react"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch("/api/admin/content")
        const data = await response.json()

        if (data.success) {
          setContent(data.content || [])
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
  }, [])

  const filteredContent = activeTab === "all" ? content : content.filter((item) => item.type === activeTab)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "noticias":
        return <FileText className="h-5 w-5 text-blue-400" />
      case "reviews":
        return <Film className="h-5 w-5 text-green-400" />
      case "tops":
        return <ListOrdered className="h-5 w-5 text-yellow-400" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <Link href="/admin/crear">
          <Button className="bg-red-600 hover:bg-red-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear Contenido
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="noticias">Noticias</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="tops">Tops</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-gray-900 border-gray-800 opacity-50">
              <CardHeader className="pb-2">
                <CardTitle className="h-6 bg-gray-800 rounded animate-pulse"></CardTitle>
                <CardDescription className="h-4 bg-gray-800 rounded animate-pulse mt-2 w-3/4"></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4"></div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="h-8 bg-gray-800 rounded animate-pulse w-20"></div>
                <div className="h-8 bg-gray-800 rounded animate-pulse w-20"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <Card key={item.id} className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getTypeIcon(item.type)}
                    <span className="ml-2 text-sm text-gray-400">{item.type}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <CardTitle className="mt-2">{item.title}</CardTitle>
                <CardDescription className="line-clamp-1">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 line-clamp-2">{item.content.substring(0, 100)}...</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/admin/editar/${item.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-400">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-900 rounded-lg">
          <p className="text-gray-400 mb-4">No hay contenido disponible</p>
          <Link href="/admin/crear">
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear tu primer contenido
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

