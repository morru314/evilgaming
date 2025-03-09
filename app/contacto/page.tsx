"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Youtube, Instagram, DiscIcon as Discord, Twitch } from "lucide-react"

export default function ContactoPage() {
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Aquí iría la lógica para enviar el mensaje
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSending(false)
  }

  const socialLinks = [
    { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "Discord", icon: Discord, href: "https://discord.gg" },
    { name: "Twitch", icon: Twitch, href: "https://twitch.tv" },
  ]

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-900/50 to-black">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-white mb-4">CONTACTO</h1>
          <p className="text-gray-300 max-w-2xl">
            ¿Tienes alguna pregunta, sugerencia o propuesta? Estamos aquí para escucharte. Ponte en contacto con nuestro
            equipo y te responderemos lo antes posible.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-navy-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Nombre</label>
                  <Input placeholder="Tu nombre" className="bg-navy-800 border-navy-700" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <Input type="email" placeholder="tu@email.com" className="bg-navy-800 border-navy-700" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Asunto</label>
                <Input placeholder="Asunto de tu mensaje" className="bg-navy-800 border-navy-700" />
              </div>
              <div>
                <label className="text-sm text-gray-400">Mensaje</label>
                <Textarea placeholder="Escribe tu mensaje aquí..." className="bg-navy-800 border-navy-700 h-32" />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={sending}>
                {sending ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Información de contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400">info@evilgaming.com</p>
                    <p className="text-gray-400">soporte@evilgaming.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="text-white font-medium">Ubicación</p>
                    <p className="text-gray-400">Calle Falsa 123</p>
                    <p className="text-gray-400">28001, Madrid, España</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="text-white font-medium">Teléfono</p>
                    <p className="text-gray-400">+34 91 123 45 67</p>
                    <p className="text-gray-400">Lun-Vie: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Síguenos en redes sociales</h2>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-navy-800 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <link.icon className="w-6 h-6" />
                    <span className="sr-only">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

