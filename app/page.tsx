import { createServerSupabaseClient } from "@/lib/supabase/server"
import ContentGrid from "@/components/content/content-grid"
import SectionHeader from "@/components/content/section-header"
import type { Content } from "@/types/supabase"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 3600 // Revalidar cada hora

export default async function Home() {
  const supabase = createServerSupabaseClient()

  // Obtener las últimas 6 noticias
  const { data: noticias } = await supabase
    .from("content")
    .select("*")
    .eq("content_type", "noticia")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6)

  // Obtener los últimos 3 reviews
  const { data: reviews } = await supabase
    .from("content")
    .select("*")
    .eq("content_type", "review")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3)

  // Obtener los últimos 3 tops
  const { data: tops } = await supabase
    .from("content")
    .select("*")
    .eq("content_type", "top")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3)

  // Obtener la noticia destacada (la más reciente)
  const featuredNews = noticias && noticias.length > 0 ? noticias[0] : null
  // Resto de noticias
  const restOfNews = noticias && noticias.length > 1 ? noticias.slice(1) : []

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Tu portal definitivo de gaming</h1>
            <p className="text-xl text-gray-300 mb-8">
              Mantente al día con las últimas noticias, análisis detallados y guías exclusivas del mundo de los
              videojuegos.
            </p>
            <a
              href="#content"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg inline-block transition-colors"
            >
              DESCUBRIR MÁS
            </a>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <div id="content" className="container mx-auto px-4 py-16">
        {/* Noticia Destacada */}
        {featuredNews && (
          <section className="mb-16">
            <SectionHeader title="DESTACADO" className="mb-8" />
            <Link href={`/noticias/${featuredNews.slug}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 content-card p-0 overflow-hidden">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src={featuredNews.featured_image || `/placeholder.svg?height=400&width=600`}
                    alt={featuredNews.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col">
                  {featuredNews.category && (
                    <span className="bg-red-600 category-badge mb-4">{featuredNews.category.toUpperCase()}</span>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{featuredNews.title}</h2>
                  <p className="text-gray-400 mb-4">{featuredNews.excerpt}</p>
                  <div className="text-sm text-gray-500 mt-auto">
                    {new Date(featuredNews.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Últimas Noticias */}
        <section className="mb-16">
          <SectionHeader title="ÚLTIMAS NOTICIAS" viewAllLink="/noticias" />
          <ContentGrid contents={(restOfNews as Content[]) || []} columns={3} size="medium" />
        </section>

        {/* Reviews Recientes */}
        <section className="mb-16">
          <SectionHeader title="REVIEWS RECIENTES" viewAllLink="/reviews" />
          <ContentGrid contents={(reviews as Content[]) || []} columns={3} size="medium" />
        </section>

        {/* Tops */}
        <section className="mb-16">
          <SectionHeader title="TOPS" viewAllLink="/tops" />
          <ContentGrid contents={(tops as Content[]) || []} columns={3} size="medium" />
        </section>
      </div>
    </div>
  )
}

