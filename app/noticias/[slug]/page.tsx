import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatDate, getCategoryColor } from "@/lib/utils"
import Image from "next/image"
import YouTubeEmbed from "@/components/content/youtube-embed"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Revalidar cada hora

interface NoticiasDetailPageProps {
  params: {
    slug: string
  }
}

export default async function NoticiasDetailPage({ params }: NoticiasDetailPageProps) {
  const { slug } = params
  const supabase = createServerSupabaseClient()

  // Obtener la noticia por slug
  const { data: noticia, error } = await supabase
    .from("content")
    .select(`
      *,
      author:author_id (
        email
      )
    `)
    .eq("slug", slug)
    .eq("content_type", "noticia")
    .eq("published", true)
    .single()

  if (error || !noticia) {
    notFound()
  }

  return (
    <div>
      {/* Hero Image */}
      <div className="relative w-full h-[40vh] md:h-[60vh]">
        <Image
          src={noticia.featured_image || `/placeholder.svg?height=600&width=1200`}
          alt={noticia.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {noticia.category && (
            <span className={`${getCategoryColor(noticia.category)} category-badge mb-4`}>
              {noticia.category.toUpperCase()}
            </span>
          )}

          <h1 className="text-3xl md:text-5xl font-bold mb-4">{noticia.title}</h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>{formatDate(noticia.created_at)}</span>
            <span className="mx-2">•</span>
            <span>Por {noticia.author?.email.split("@")[0] || "Editor"}</span>
          </div>

          {noticia.has_video && noticia.video_url && (
            <div className="mb-8">
              <YouTubeEmbed url={noticia.video_url} title={noticia.title} />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none">
            {noticia.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

