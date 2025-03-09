import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function TopPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient()

  const { data: top, error } = await supabase
    .from("content")
    .select("*, profiles(username)")
    .eq("type", "tops")
    .eq("slug", params.slug)
    .single()

  if (error || !top) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {top.category && (
              <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 mb-4">
                {top.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{top.title}</h1>
            <div className="flex items-center text-gray-400 text-sm mb-6">
              <span>{top.profiles?.username || "Admin"}</span>
              <span className="mx-2">•</span>
              <time>{formatDate(top.created_at)}</time>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {top.image_url && (
            <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
              <Image src={top.image_url || "/placeholder.svg"} alt={top.title} fill className="object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-6">{top.description}</p>

            <div className="text-gray-300 space-y-4" dangerouslySetInnerHTML={{ __html: top.content || "" }} />

            {/* Top Items */}
            {(top.items || []).length > 0 && (
              <div className="space-y-6 mt-8">
                {(top.items || []).map((item: any, index: number) => (
                  <div key={index} className="bg-navy-900 p-6 rounded-lg flex">
                    <div className="text-3xl font-bold text-red-600 mr-6">#{index + 1}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

