import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import YouTubeEmbed from "@/components/content/youtube-embed"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Revalidar cada hora

interface TopDetailPageProps {
  params: {
    slug: string
  }
}

export default async function TopDetailPage({ params }: TopDetailPageProps) {
  const { slug } = params
  const supabase = createServerSupabaseClient()

  // Obtener el top por slug
  const { data: top, error } = await supabase
    .from("content")
    .select(`
      *,
      author:author_id (
        email
      )
    `)
    .eq("slug", slug)
    .eq("content_type", "top")
    .eq("published", true)
    .single()

  if (error || !top) {
    notFound()
  }

  return (
    <div>
      {/* Hero Image */}
      <div className="relative w-full h-[40vh] md:h-[60vh]">
        <Image
          src={top.featured_image || `/placeholder.svg?height=600&width=1200`}
          alt={top.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{top.title}</h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>{formatDate(top.created_at)}</span>
            <span className="mx-2">•</span>
            <span>Por {top.author?.email.split("@")[0] || "Editor"}</span>
          </div>

          {top.has_video && top.video_url && (
            <div className="mb-8">
              <YouTubeEmbed url={top.video_url} title={top.title} />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none">
            {top.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

