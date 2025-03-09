import ContentCard from "./content-card"
import type { Content } from "@/types/supabase"

interface ContentGridProps {
  contents: Content[]
  columns?: 1 | 2 | 3 | 4
  size?: "small" | "medium" | "large"
}

export default function ContentGrid({ contents, columns = 3, size = "medium" }: ContentGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} size={size} />
      ))}
    </div>
  )
}

