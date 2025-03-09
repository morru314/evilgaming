import Link from "next/link"
import Image from "next/image"
import type { Content } from "@/types/supabase"
import { formatDate, getCategoryColor, truncateText } from "@/lib/utils"

interface ContentCardProps {
  content: Content
  size?: "small" | "medium" | "large"
}

export default function ContentCard({ content, size = "medium" }: ContentCardProps) {
  const { title, slug, excerpt, featured_image, content_type, category, created_at, rating } = content

  const imageHeight = size === "small" ? 150 : size === "medium" ? 200 : 300
  const titleLength = size === "small" ? 60 : size === "medium" ? 80 : 100
  const excerptLength = size === "small" ? 80 : size === "medium" ? 120 : 160

  return (
    <Link href={`/${content_type === "noticia" ? "noticias" : content_type === "review" ? "reviews" : "tops"}/${slug}`}>
      <article className="content-card h-full flex flex-col">
        <div className="relative">
          {rating && content_type === "review" && <div className="rating-badge">{rating}</div>}
          <Image
            src={featured_image || `/placeholder.svg?height=${imageHeight}&width=600`}
            alt={title}
            width={600}
            height={imageHeight}
            className="w-full h-auto object-cover"
          />
          {category && (
            <span className={`${getCategoryColor(category)} category-badge absolute bottom-4 left-4`}>
              {category.toUpperCase()}
            </span>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className={`font-bold ${size === "small" ? "text-lg" : size === "medium" ? "text-xl" : "text-2xl"} mb-2`}>
            {truncateText(title, titleLength)}
          </h3>
          {excerpt && <p className="text-gray-400 mb-4">{truncateText(excerpt, excerptLength)}</p>}
          <div className="text-sm text-gray-500 mt-auto">{formatDate(created_at)}</div>
        </div>
      </article>
    </Link>
  )
}

