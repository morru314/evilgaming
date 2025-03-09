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
          <p className="
