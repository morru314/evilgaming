'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import Link from "next/link"
import { FileText, Users, BarChart, Settings } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    noticias: 0,
    reviews: 0,
    tops: 0,
    users: 0
  })
  
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function checkAdmin() {
      setLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      if (error || data?.role !== 'admin') {
        router.push('/')
        return
      }
      
      // Get stats
      const [
        { count: noticiasCount },
        { count: reviewsCount },
        { count: topsCount },
        { count: usersCount }
      ] = await Promise.all([
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('type', 'noticias'),
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('type', 'reviews'),
        supabase.from('content').select('*', { count: 'exact', head: true }).eq('type', 'tops'),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ])
      
      setStats({
        noticias: noticiasCount || 0,
        reviews: reviewsCount || 0,
        tops: topsCount || 0,
        users: usersCount || 0
      })
      
      setLoading(false)
    }
    
    checkAdmin()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando panel de administración...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Panel de Administración</h1>
          <p className="text-gray-300 max-w-2xl">
            Gestiona el contenido, usuarios y configuración del sitio.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-navy-900 border-navy-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Noticias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.noticias}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-navy-900 border-navy-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.reviews}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-navy-900 border-navy-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Tops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.tops}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-navy-900 border-navy-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-400">Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.users}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/crear">
            <Card className="bg-navy-900 border-navy-700 hover:border-red-600 transition-colors h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <FileText className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Crear Contenido</h3>
                <p className="text-gray-400">Añade noticias, reviews o tops al sitio</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/usuarios">
            <Card className="bg-navy-900 border-navy-700 hover:border-red-600 transition-colors h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Gestionar Usuarios</h3>
                <p className="text-gray-400">Administra los usuarios y sus roles</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/estadisticas">
            <Card className="bg-navy-900 border-navy-700 hover:border-red-600 transition-colors h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <BarChart className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Estadísticas</h3>
                <p className="text-gray-400">Visualiza métricas y análisis del sitio</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/configuracion">
            <Card className="bg-navy-900 border-navy-700 hover:border-red-600 transition-colors h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Settings className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Configuración</h3>
                <p className="text-gray-400">Ajusta la configuración del sitio</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
