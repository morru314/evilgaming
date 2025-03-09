import { ContentGrid } from "@/components/content/content-grid"
import { getServerContent } from "@/lib/supabase/server"

export default async function NoticiasPage() {
  const { content: noticias } = await getServerContent("noticias")

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-8">Noticias</h1>
      <ContentGrid items={noticias || []} />
    </main>
  )
}

