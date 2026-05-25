"use client"

import { UserSearch } from "lucide-react"
import { useState } from "react"
import { buscarColegiadosPublico, type ResultadoColegiadoPublico } from "@/actions/colegiado.actions"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Table } from "@/components/ui/Table"

const estadoBadge: Record<string, "success" | "danger"> = {
  Habilitado: "success",
  Inhabilitado: "danger",
}

export default function ColegiadosPublicPage() {
  const [tipoBusqueda, setTipoBusqueda] = useState<"dni" | "nombres">("dni")
  const [dni, setDni] = useState("")
  const [apellidoPaterno, setApellidoPaterno] = useState("")
  const [apellidoMaterno, setApellidoMaterno] = useState("")
  const [nombres, setNombres] = useState("")
  const [resultados, setResultados] = useState<ResultadoColegiadoPublico[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [consultado, setConsultado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setConsultado(true)

    const filtros = tipoBusqueda === "dni"
      ? { tipo: "dni" as const, dni }
      : { tipo: "nombres" as const, apellido_paterno: apellidoPaterno, apellido_materno: apellidoMaterno, nombres }

    const result = await buscarColegiadosPublico(filtros)
    setResultados(result.data)
    setLoading(false)
  }

  return (
    <div>
      <section className="bg-cip-red py-10">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-2">
            <UserSearch className="mx-auto h-16 w-16 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Consultar Colegiados</h1>
          <p className="mt-1 text-sm text-white/80">
            Busca colegiados por DNI o nombres y apellidos
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-cip-gold" />
        </div>
      </section>

      <section className="pb-16 pt-8">
        <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 border-l-8 border-l-cip-red bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-44">
                <Select
                  label="Buscar por"
                  name="tipo"
                  options={[
                    { value: "dni", label: "DNI" },
                    { value: "nombres", label: "Nombres y Apellidos" },
                  ]}
                  value={tipoBusqueda}
                  onChange={(e) => setTipoBusqueda(e.target.value as "dni" | "nombres")}
                />
              </div>

              {tipoBusqueda === "dni" ? (
                <div className="w-48">
                  <Input
                    label="DNI"
                    name="dni"
                    placeholder="12345678"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="w-44">
                    <Input
                      label="Apellido Paterno"
                      name="apellido_paterno"
                      placeholder="Ingrese apellido"
                      value={apellidoPaterno}
                      onChange={(e) => setApellidoPaterno(e.target.value)}
                    />
                  </div>
                  <div className="w-44">
                    <Input
                      label="Apellido Materno"
                      name="apellido_materno"
                      placeholder="Ingrese apellido"
                      value={apellidoMaterno}
                      onChange={(e) => setApellidoMaterno(e.target.value)}
                    />
                  </div>
                  <div className="w-44">
                    <Input
                      label="Nombres"
                      name="nombres"
                      placeholder="Ingrese nombres"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                    />
                  </div>
                </>
              )}

              <Button type="submit" disabled={loading} variant="danger">
                {loading ? "Buscando..." : "Consultar"}
              </Button>
            </div>
          </form>

          {consultado && !loading && (
            <div className="rounded-xl border border-gray-200 border-l-8 border-l-cip-red bg-white p-6 shadow-sm">
              {resultados && resultados.length > 0 ? (
                <Table
                  columns={[
                    {
                      key: "numero_cip",
                      header: "CIP",
                      render: (item) => item.numero_cip,
                    },
                    {
                      key: "solicitante",
                      header: "Apellidos y Nombres",
                      render: (item) => `${item.apellido_paterno} ${item.apellido_materno}, ${item.nombres}`,
                    },
                    {
                      key: "carrera",
                      header: "Carrera",
                      render: (item) => item.carrera_nombre,
                    },
                    {
                      key: "sede",
                      header: "Sede",
                      render: (item) => item.sede_nombre,
                    },
                    {
                      key: "estado",
                      header: "Estado",
                      render: (item) => (
                        <Badge variant={estadoBadge[item.estado_habilitacion] ?? "neutral"}>
                          {item.estado_habilitacion}
                        </Badge>
                      ),
                    },
                  ]}
                  data={resultados}
                  keyExtractor={(item) => item.dni + item.numero_cip}
                  emptyMessage=""
                />
              ) : (
                <p className="py-4 text-center text-sm text-gray-500">
                  No se encontraron colegiados con los datos ingresados.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
