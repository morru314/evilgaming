import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { formatDate, truncateText } from "@/lib/utils"
import type { Database } from "@/types/supabase"

type Content = Database["public"]["Tables"]["content"]["Row"] & {
  profiles: { username: string } | null
}

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  const href = `/${content.type}/${content.slug || content.id}`
  const rating = content.rating || Math.floor(Math.random() * 3) + 8 // Placeholder rating between 8-10

  return (
    <Card className="overflow-hidden bg-navy-900 border-navy-700 hover:border-red-600 transition-colors">
      <div className="relative">
        <Link href={href}>
          <div className="aspect-video relative">
            <Image
              src={content.image_url || "/placeholder.svg?height=400&width=600"}
              alt={content.title || "Content thumbnail"}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        {/* Category Badge */}
        {content.category && (
          <div className="absolute bottom-0 left-0 bg-red-600 text-white text-xs font-bold uppercase px-3 py-1">
            {content.category}
          </div>
        )}

        {/* Rating Badge for Reviews */}
        {content.type === "reviews" && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
            {rating}
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={href} className="hover:text-red-500 transition-colors">
          <h3 className="text-lg font-bold line-clamp-2 mb-2 text-white">{content.title}</h3>
        </Link>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{truncateText(content.description || "", 120)}</p>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{content.profiles?.username || "Admin"}</span>
          <time>{formatDate(content.created_at)}</time>
        </div>
      </div>
    </Card>
  )
}

