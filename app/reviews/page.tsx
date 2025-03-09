import { createServerSupabaseClient } from "@/lib/supabase/server"
import ContentGrid from "@/components/content/content-grid"
import type { Content } from "@/types/supabase"

export const revalidate = 3600 // Revalidar cada hora

export default async function ReviewsPage() {
  const supabase = createServerSupabaseClient()

  // Obtener todos los reviews
  const { data: reviews } = await supabase
    .from("content")
    .select("*")
    .eq("content_type", "review")
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-[#3c1518] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">REVIEWS</h1>
          <p className="text-xl text-gray-300">
            Análisis detallados y honestos de los últimos lanzamientos. Nuestro equipo evalúa cada aspecto para ayudarte
            a decidir qué juegos merecen tu tiempo y dinero.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <ContentGrid contents={(reviews as Content[]) || []} columns={3} size="medium" />
      </div>
    </div>
  )
}

