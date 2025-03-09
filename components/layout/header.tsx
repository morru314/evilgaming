"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Youtube, Instagram, DiscIcon as Discord, Twitch } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()

  const navigation = [
    { name: "INICIO", href: "/" },
    { name: "NOTICIAS", href: "/noticias" },
    { name: "REVIEWS", href: "/reviews" },
    { name: "FOROS", href: "/foros" },
    { name: "CONTACTO", href: "/contacto" },
  ]

  const socialLinks = [
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: Youtube,
      color: "hover:text-red-500",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:text-pink-500",
    },
    {
      name: "Discord",
      href: "https://discord.gg",
      icon: Discord,
      color: "hover:text-indigo-500",
    },
    {
      name: "Twitch",
      href: "https://twitch.tv",
      icon: Twitch,
      color: "hover:text-purple-500",
    },
  ]

  return (
    <header className="bg-black border-b border-red-900/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              Evil<span className="text-red-600">Gaming</span>
            </span>
          </Link>

          {/* Social Media Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("text-gray-400 transition-colors", item.color)}
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

