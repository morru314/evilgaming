import { ContentGrid } from "@/components/content/content-grid"
import { getServerContent } from "@/lib/supabase/server"

export default async function TopsPage() {
  const { content: tops } = await getServerContent("tops")

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">TOPS</h1>
          <p className="text-gray-300 max-w-2xl">
            Nuestras selecciones de los mejores juegos por categoría, género y plataforma. Descubre los títulos
            imprescindibles que no puedes perderte.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <ContentGrid items={tops || []} />
      </div>
    </main>
  )
}

