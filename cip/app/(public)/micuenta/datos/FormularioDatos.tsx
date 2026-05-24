"use client"

import { useActionState, useState, useMemo } from "react"
import { actualizarDatos } from "./actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Alert } from "@/components/ui/Alert"
import type { Carrera, Universidad, UniversidadCarrera } from "@/types"

const CARRERA_OTRO = "__otro__"

interface Props {
  correo: string
  telefono: string
  universidadId: string | null
  sedeId: string
  universidades: Universidad[]
  universidadCarreras: UniversidadCarrera[]
  carreras: Carrera[]
  carreraId: string | null
  carreraManual: string | null
}

export function FormularioDatos({
  correo,
  telefono,
  universidadId,
  sedeId,
  universidades,
  universidadCarreras,
  carreras,
  carreraId,
  carreraManual,
}: Props) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => actualizarDatos(formData),
    null,
  )

  const [selectedUniversidadId, setSelectedUniversidadId] = useState(universidadId ?? "")
  const [selectedCarreraId, setSelectedCarreraId] = useState(carreraId ?? "")
  const [carreraManualText, setCarreraManualText] = useState(carreraManual ?? "")
  const [modoManual, setModoManual] = useState(!!carreraManual && !carreraId)

  const universidadFiltradas = useMemo(
    () => universidades.filter((u) => u.sede_id === sedeId),
    [universidades, sedeId],
  )

  const carreraIdsPorUniversidad = useMemo(() => {
    const set = new Set<string>()
    universidadCarreras
      .filter((uc) => uc.universidad_id === selectedUniversidadId)
      .forEach((uc) => set.add(uc.carrera_id))
    return set
  }, [universidadCarreras, selectedUniversidadId])

  const carrerasFiltradas = useMemo(
    () => carreras.filter((c) => carreraIdsPorUniversidad.has(c.id)),
    [carreras, carreraIdsPorUniversidad],
  )

  return (
    <form action={formAction} className="space-y-4">
      <Input label="Correo electrónico" name="correo" type="email" defaultValue={correo} required />
      <Input label="Teléfono" name="telefono" defaultValue={telefono} />

      <Select
        label="Universidad"
        placeholder="Selecciona una universidad"
        options={universidadFiltradas.map((u) => ({ value: u.id, label: u.nombre }))}
        name="universidad_id"
        defaultValue={selectedUniversidadId}
        onChange={(e) => {
          setSelectedUniversidadId(e.target.value)
          setSelectedCarreraId("")
          setModoManual(false)
        }}
      />

      {modoManual ? (
        <Input
          label="Carrera de ingeniería"
          name="carrera_manual"
          placeholder="Escribe el nombre de tu carrera"
          value={carreraManualText}
          onChange={(e) => setCarreraManualText(e.target.value)}
        />
      ) : (
        <Select
          label="Carrera de ingeniería"
          placeholder="Selecciona una carrera"
          name="carrera_id"
          options={[
            ...carrerasFiltradas.map((c) => ({ value: c.id, label: `${c.codigo} - ${c.nombre}` })),
            ...(selectedUniversidadId ? [{ value: CARRERA_OTRO, label: "Otra / No aparece aquí" }] : []),
          ]}
          defaultValue={selectedCarreraId}
          onChange={(e) => {
            if (e.target.value === CARRERA_OTRO) {
              setModoManual(true)
              setSelectedCarreraId(CARRERA_OTRO)
            } else {
              setSelectedCarreraId(e.target.value)
              setCarreraManualText("")
            }
          }}
        />
      )}

      {modoManual && (
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => {
            setModoManual(false)
            setSelectedCarreraId("")
            setCarreraManualText("")
          }}
        >
          ← Volver a seleccionar de la lista
        </button>
      )}

      {state && "success" in state && (
        <Alert variant="success">Datos actualizados correctamente.</Alert>
      )}
      {state && "error" in state && (
        <Alert variant="error">{(state as { error: string }).error}</Alert>
      )}

      <Button type="submit" loading={pending}>
        Guardar cambios
      </Button>
    </form>
  )
}
