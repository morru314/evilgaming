import { Button } from "@/components/ui/button"
import { ContentGrid } from "@/components/content/content-grid"
import { SectionHeader } from "@/components/content/section-header"
import Link from "next/link"
import { getServerContent } from "@/lib/supabase/server"

export default async function Home() {
  const { content: news } = await getServerContent("noticias")
  const { content: reviews } = await getServerContent("reviews")
  const { content: tops } = await getServerContent("tops")

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-red-900/20 to-black">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          Tu portal definitivo de gaming
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Mantente al día con las últimas noticias, análisis detallados y guías exclusivas del mundo de los videojuegos.
        </p>
        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
          <Link href="/noticias">DESCUBRIR MÁS</Link>
        </Button>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Latest News Section */}
        <section className="mb-16">
          <SectionHeader title="ÚLTIMAS NOTICIAS" viewAllLink="/noticias" />
          <ContentGrid items={news?.slice(0, 3) || []} />
        </section>

        {/* Recent Reviews Section */}
        <section className="mb-16">
          <SectionHeader title="REVIEWS RECIENTES" viewAllLink="/reviews" />
          <ContentGrid items={reviews?.slice(0, 3) || []} />
        </section>

        {/* Tops Section */}
        <section className="mb-16">
          <SectionHeader title="TOPS" viewAllLink="/tops" />
          <ContentGrid items={tops?.slice(0, 3) || []} />
        </section>
      </div>
    </main>
  )
}

