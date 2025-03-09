"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Youtube, Instagram, Twitch, TwitterIcon as TikTok } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export function Header() {
  const pathname = usePathname()
  const supabase = createClientSupabaseClient()

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Noticias", href: "/noticias" },
    { name: "Reviews", href: "/reviews" },
    { name: "Tops", href: "/tops" },
  ]

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: Youtube,
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
    },
    {
      name: "Twitch",
      href: "https://twitch.tv",
      icon: Twitch,
    },
    {
      name: "TikTok",
      href: "https://tiktok.com",
      icon: TikTok,
    },
  ]

  return (
    <header className="bg-black border-b border-red-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Social Media Icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.name}</span>
              </a>
            ))}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-red-500",
                  pathname === item.href ? "text-red-500" : "text-gray-300",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-red-500" asChild>
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

