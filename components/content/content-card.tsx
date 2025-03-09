import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { formatDate, truncateText, getCategoryColor } from "@/lib/utils"
import type { Database } from "@/types/supabase"

type Content = Database["public"]["Tables"]["content"]["Row"] & {
  profiles: { username: string } | null
}

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  const href = `/${content.type}/${content.slug || content.id}`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={href}>
        <div className="aspect-video relative">
          <Image
            src={content.image_url || "/placeholder.svg"}
            alt={content.title || "Content thumbnail"}
            fill
            className="object-cover"
          />
          {content.category && (
            <Badge className={`absolute top-2 left-2 ${getCategoryColor(content.category)}`}>{content.category}</Badge>
          )}
        </div>
      </Link>

      <CardHeader>
        <Link href={href} className="hover:text-primary transition-colors">
          <h3 className="text-xl font-semibold line-clamp-2">{content.title}</h3>
        </Link>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground line-clamp-2">{truncateText(content.description || "", 150)}</p>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={content.profiles?.avatar_url} />
            <AvatarFallback>{content.profiles?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{content.profiles?.username}</span>
        </div>
        <time className="text-sm text-muted-foreground">{formatDate(content.created_at)}</time>
      </CardFooter>
    </Card>
  )
}

