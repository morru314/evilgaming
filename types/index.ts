import type React from "react"
export interface User {
  id: string
  email: string
  username?: string
  role: "admin" | "editor" | "user"
  created_at: string
}

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

