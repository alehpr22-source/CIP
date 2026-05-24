"use client"

import { useRef } from "react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/Button"

interface Props {
  fotoUrl: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  carreraCodigo: string
  carreraNombre: string
  dni: string
  numeroCip: string
}

export function Carnet({
  fotoUrl,
  apellidoPaterno,
  apellidoMaterno,
  nombres,
  carreraCodigo,
  carreraNombre,
  dni,
  numeroCip,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  async function handleDescargar() {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2 })
      const link = document.createElement("a")
      link.download = `carnet-cip-${numeroCip}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Error al descargar carnet:", err)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="relative w-[400px] overflow-hidden rounded-xl border-2 border-yellow-600 bg-white shadow-lg"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {/* Header */}
        <div className="bg-blue-900 px-6 py-3 text-center text-white">
          <p className="text-lg font-bold tracking-wide">COLEGIO DE INGENIEROS</p>
          <p className="text-sm font-bold tracking-wide">DEL PERÚ</p>
          <div className="mx-auto mt-1 h-0.5 w-16 bg-yellow-500" />
        </div>

        {/* Body */}
        <div className="flex px-6 py-5">
          {/* Left: Photo */}
          <div className="mr-6 flex-shrink-0">
            <div className="h-52 w-40 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt="Foto"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  Sin foto
                </div>
              )}
            </div>
          </div>

          {/* Center: Data */}
          <div className="flex flex-1 flex-col justify-center">
            <p className="text-xl font-bold uppercase leading-tight text-gray-900">
              {apellidoPaterno}
            </p>
            <p className="text-xl font-bold uppercase leading-tight text-gray-900">
              {apellidoMaterno}
            </p>
            <p className="text-base font-semibold uppercase leading-tight text-gray-800">
              {nombres}
            </p>

            <div className="mt-4 border-t border-gray-200 pt-3">
              <p className="text-xs font-semibold uppercase text-gray-500">Carrera</p>
              <p className="text-sm font-bold text-gray-900">
                {carreraCodigo} - {carreraNombre}
              </p>
            </div>

            <div className="mt-2">
              <p className="text-xs font-semibold uppercase text-gray-500">DNI</p>
              <p className="text-sm font-bold text-gray-900">{dni}</p>
            </div>
          </div>
        </div>

        {/* Footer with CIP */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-2 text-right">
          <p className="text-xs font-semibold uppercase text-gray-500">Código CIP</p>
          <p className="text-xl font-bold tracking-widest text-blue-900">
            {numeroCip}
          </p>
        </div>
      </div>

      <Button onClick={handleDescargar}>
        📥 Descargar carnet
      </Button>
    </div>
  )
}
