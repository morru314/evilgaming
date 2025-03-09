import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function NoticiaPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()

  const { data: noticia, error } = await supabase
    .from("content")
    .select("*, profiles(username)")
    .eq("type", "noticias")
    .eq("slug", params.slug)
    .single()

  if (error || !noticia) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {noticia.category && (
              <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 mb-4">
                {noticia.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{noticia.title}</h1>
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <span>{noticia.profiles?.username || "Admin"}</span>
              <span className="mx-2">•</span>
              <time>{formatDate(noticia.created_at)}</time>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {noticia.image_url && (
            <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
              <Image src={noticia.image_url || "/placeholder.svg"} alt={noticia.title} fill className="object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">{noticia.description}</p>

            <div className="text-gray-300 space-y-4" dangerouslySetInnerHTML={{ __html: noticia.content || "" }} />
          </div>
        </div>
      </div>
    </main>
  )
}

