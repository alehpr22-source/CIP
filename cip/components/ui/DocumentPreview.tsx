"use client"

import { useState } from "react"
import { Button } from "./Button"
import { Lightbox } from "./Lightbox"

interface DocumentPreviewProps {
  url: string
  label: string
  thumbnail?: boolean
  className?: string
}

function esImagen(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i.test(url)
}

export function DocumentPreview({ url, label, thumbnail, className }: DocumentPreviewProps) {
  const [open, setOpen] = useState(false)
  const isImage = esImagen(url)
  const src = `${url}?_t=${Date.now()}`

  if (thumbnail && isImage) {
    return (
      <>
        <button type="button" onClick={() => setOpen(true)} className="cursor-pointer transition-opacity hover:opacity-80">
          <img src={src} alt={label} className={`max-h-32 rounded-lg border object-contain ${className ?? ""}`} />
        </button>
        {open && <Lightbox src={src} alt={label} onClose={() => setOpen(false)} />}
      </>
    )
  }

  return (
    <>
      {isImage ? (
        <Button variant="outline" onClick={() => setOpen(true)}>
          {label}
        </Button>
      ) : (
        <a href={src} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">{label}</Button>
        </a>
      )}
      {open && isImage && <Lightbox src={src} alt={label} onClose={() => setOpen(false)} />}
    </>
  )
}
