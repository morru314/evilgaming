import { ContentGrid } from "@/components/content/content-grid"
import { getServerContent } from "@/lib/supabase/server"

export default async function ReviewsPage() {
  const { content: reviews } = await getServerContent("reviews")

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">REVIEWS</h1>
          <p className="text-gray-300 max-w-2xl">
            Análisis detallados y honestos de los últimos lanzamientos. Nuestro equipo evalúa cada aspecto para ayudarte
            a decidir qué juegos merecen tu tiempo y dinero.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <ContentGrid items={reviews || []} />
      </div>
    </main>
  )
}

