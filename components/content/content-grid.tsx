import { ContentCard } from "./content-card"
import type { Database } from "@/types/supabase"

type Content = Database["public"]["Tables"]["content"]["Row"] & {
  profiles: { username: string } | null
}

interface ContentGridProps {
  items: Content[]
}

export function ContentGrid({ items }: ContentGridProps) {
  if (!items?.length) {
    return <div className="text-center py-12 text-muted-foreground">No hay contenido disponible</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ContentCard key={item.id} content={item} />
      ))}
    </div>
  )
}

