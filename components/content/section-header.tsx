import Link from "next/link"

interface SectionHeaderProps {
  title: string
  viewAllLink: string
}

export function SectionHeader({ title, viewAllLink }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold flex items-center">
        <span className="w-1 h-6 bg-red-600 mr-3"></span>
        {title}
      </h2>
      <Link href={viewAllLink} className="text-muted-foreground hover:text-foreground transition-colors">
        Ver todo
      </Link>
    </div>
  )
}

