import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ReviewPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()

  const { data: review, error } = await supabase
    .from("content")
    .select("*, profiles(username)")
    .eq("type", "reviews")
    .eq("slug", params.slug)
    .single()

  if (error || !review) {
    notFound()
  }

  const rating = review.rating || Math.floor(Math.random() * 3) + 8 // Placeholder rating between 8-10

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {review.category && (
              <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 mb-4">
                {review.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{review.title}</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-gray-400 text-sm">
                <span>{review.profiles?.username || "Admin"}</span>
                <span className="mx-2">•</span>
                <time>{formatDate(review.created_at)}</time>
              </div>
              <div className="bg-red-600 text-white text-xl font-bold px-3 py-1 rounded">{rating}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {review.image_url && (
            <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
              <Image src={review.image_url || "/placeholder.svg"} alt={review.title} fill className="object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">{review.description}</p>

            <div className="text-gray-300 space-y-4" dangerouslySetInnerHTML={{ __html: review.content || "" }} />

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
              <div className="bg-navy-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-green-500 mb-4">Lo Bueno</h3>
                <ul className="space-y-2">
                  {(review.pros || ["Contenido por añadir"]).map((pro: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-navy-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-500 mb-4">Lo Malo</h3>
                <ul className="space-y-2">
                  {(review.cons || ["Contenido por añadir"]).map((con: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict */}
            <div className="bg-navy-900 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Veredicto Final</h3>
              <p className="text-gray-300">{review.verdict || "Contenido por añadir"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

