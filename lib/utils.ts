import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para formatear fechas
export function formatDate(date: string | Date) {
  if (!date) return ""
  return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es })
}

// Función para truncar texto
export function truncateText(text: string, maxLength = 100) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Función para obtener el color de una categoría
export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    PS5: "bg-blue-600",
    Xbox: "bg-green-600",
    PC: "bg-yellow-600",
    Nintendo: "bg-red-600",
    Mobile: "bg-purple-600",
    VR: "bg-pink-600",
    Retro: "bg-orange-600",
    Indie: "bg-teal-600",
    Esports: "bg-indigo-600",
  }

  return colors[category] || "bg-gray-600"
}

// Función para obtener la URL de embed de YouTube
export function getYoutubeEmbedUrl(url: string) {
  if (!url) return ""

  // Extraer el ID del video de YouTube de diferentes formatos de URL
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`
  }

  return url
}

