import { createServerSupabaseClient } from "@/lib/supabase/server"
import ContentGrid from "@/components/content/content-grid"
import type { Content } from "@/types/supabase"

export const revalidate = 3600 // Revalidar cada hora

export default async function TopsPage() {
  const supabase = createServerSupabaseClient()

  // Obtener todos los tops
  const { data: tops } = await supabase
    .from("content")
    .select("*")
    .eq("content_type", "top")
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TOPS</h1>
          <p className="text-xl text-gray-300">
            Nuestras selecciones de los mejores juegos, momentos y curiosidades del mundo gaming.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <ContentGrid contents={(tops as Content[]) || []} columns={3} size="medium" />
      </div>
    </div>
  )
}

