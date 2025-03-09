"use client"

import { useState, useEffect } from "react"
import { getYoutubeEmbedUrl } from "@/lib/utils"

interface YouTubeEmbedProps {
  url: string
  title?: string
}

export default function YouTubeEmbed({ url, title = "YouTube video" }: YouTubeEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState("")

  useEffect(() => {
    setEmbedUrl(getYoutubeEmbedUrl(url))
  }, [url])

  if (!embedUrl) return null

  return (
    <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  )
}

