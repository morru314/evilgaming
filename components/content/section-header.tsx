import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SectionHeaderProps {
  title: string
  viewAllLink?: string
  viewAllText?: string
  className?: string
}

export default function SectionHeader({
  title,
  viewAllLink,
  viewAllText = "Ver todo",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <h2 className="text-2xl font-bold flex items-center">
        <span className="text-red-600 mr-2">|</span>
        {title}
      </h2>
      {viewAllLink && (
        <Link href={viewAllLink}>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            {viewAllText}
          </Button>
        </Link>
      )}
    </div>
  )
}

