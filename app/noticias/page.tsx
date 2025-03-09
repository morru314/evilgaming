import { createServerSupabaseClient } from "@/lib/supabase/server"
import ContentGrid from "@/components/content/content-grid"
import type { Content } from "@/types/supabase"

export const revalidate = 3600 // Revalidar cada hora

export default async function NoticiasPage() {
  const supabase = createServerSupabaseClient()

  // Obtener todas las noticias
  const { data: noticias } = await supabase
    .from("content")
    .select("*")
    .eq("content_type", "noticia")
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">NOTICIAS</h1>
          <p className="text-xl text-gray-300">
            Las últimas novedades del mundo de los videojuegos. Mantente informado con las noticias más recientes.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <ContentGrid contents={(noticias as Content[]) || []} columns={3} size="medium" />
      </div>
    </div>
  )
}

