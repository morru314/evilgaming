import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import YouTubeEmbed from "@/components/content/youtube-embed"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Revalidar cada hora

interface ReviewDetailPageProps {
  params: {
    slug: string
  }
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { slug } = params
  const supabase = createServerSupabaseClient()

  // Obtener el review por slug
  const { data: review, error } = await supabase
    .from("content")
    .select(`
      *,
      author:author_id (
        email
      )
    `)
    .eq("slug", slug)
    .eq("content_type", "review")
    .eq("published", true)
    .single()

  if (error || !review) {
    notFound()
  }

  return (
    <div>
      {/* Hero Image */}
      <div className="relative w-full h-[40vh] md:h-[60vh]">
        <Image
          src={review.featured_image || `/placeholder.svg?height=600&width=1200`}
          alt={review.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

        {review.rating && (
          <div className="absolute top-8 left-8 bg-red-600 text-white text-3xl font-bold w-20 h-20 flex items-center justify-center rounded-lg">
            {review.rating}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{review.title}</h1>

          <div className="flex items-center text-gray-400 mb-8">
            <span>{formatDate(review.created_at)}</span>
            <span className="mx-2">•</span>
            <span>Por {review.author?.email.split("@")[0] || "Editor"}</span>
          </div>

          {review.has_video && review.video_url && (
            <div className="mb-8">
              <YouTubeEmbed url={review.video_url} title={review.title} />
            </div>
          )}

          <div className="prose prose-lg prose-invert max-w-none">
            {review.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

