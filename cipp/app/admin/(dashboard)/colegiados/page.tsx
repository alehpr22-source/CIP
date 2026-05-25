import { Suspense } from "react"
import { listarColegiados, type FiltrosColegiados } from "@/actions/colegiado.actions"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

const estadoOpciones = [
  { value: "", label: "Todos" },
  { value: "Habilitado", label: "Habilitado" },
  { value: "Inhabilitado", label: "Inhabilitado" },
]

const estadoBadge: Record<string, "success" | "danger"> = {
  Habilitado: "success",
  Inhabilitado: "danger",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

async function ColegiadosTable(filtros: FiltrosColegiados) {
  const result = await listarColegiados(filtros)

  if (result.error) {
    return <p className="py-8 text-center text-sm text-red-600">Error: {result.error}</p>
  }

  const data = result.data ?? []

  return (
    <Table
      columns={[
        {
          key: "numero_cip",
          header: "CIP",
          render: (item) => (
            <Link
              href={`/carnet/${item.dni}`}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              {item.numero_cip}
            </Link>
          ),
        },
        {
          key: "dni",
          header: "DNI",
          render: (item) => item.dni,
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
          key: "codigo_expediente",
          header: "Expediente",
          render: (item) => item.codigo_expediente,
        },
        {
          key: "estado_habilitacion",
          header: "Estado",
          render: (item) => (
            <Badge variant={estadoBadge[item.estado_habilitacion] ?? "neutral"}>
              {item.estado_habilitacion}
            </Badge>
          ),
        },
        {
          key: "fecha_colegiatura",
          header: "Colegiatura",
          render: (item) => formatDate(item.fecha_colegiatura),
        },
      ]}
      data={data}
      keyExtractor={(item) => item.id}
      emptyMessage="No se encontraron colegiados"
    />
  )
}

export default async function ColegiadosPage(props: {
  searchParams: Promise<{ estado_habilitacion?: string; carrera_id?: string; sede_id?: string; busqueda?: string }>
}) {
  const { estado_habilitacion, carrera_id, sede_id, busqueda } = await props.searchParams

  const supabase = createClient()
  const [carrerasData, sedesData] = await Promise.all([
    supabase.from("carreras").select("id, nombre").order("nombre"),
    supabase.from("sedes").select("id, nombre").order("nombre"),
  ])

  const carreraOpciones = [
    { value: "", label: "Todas" },
    ...(carrerasData.data ?? []).map((c) => ({
      value: c.id,
      label: c.nombre,
    })),
  ]

  const sedeOpciones = [
    { value: "", label: "Todas" },
    ...(sedesData.data ?? []).map((s) => ({
      value: s.id,
      label: s.nombre,
    })),
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestión de Colegiados</h1>

      <form
        className="flex flex-wrap items-end gap-4 rounded-lg border bg-white p-4"
        method="GET"
      >
        <div className="w-44">
          <Select
            label="Estado"
            name="estado_habilitacion"
            options={estadoOpciones}
            defaultValue={estado_habilitacion ?? ""}
          />
        </div>
        <div className="w-52">
          <Select
            label="Carrera"
            name="carrera_id"
            options={carreraOpciones}
            defaultValue={carrera_id ?? ""}
          />
        </div>
        <div className="w-48">
          <Select
            label="Sede"
            name="sede_id"
            options={sedeOpciones}
            defaultValue={sede_id ?? ""}
          />
        </div>
        <div className="w-64">
          <Input
            label="Buscar"
            name="busqueda"
            placeholder="CIP, DNI, nombres o apellidos"
            defaultValue={busqueda ?? ""}
          />
        </div>
        <Button type="submit">Filtrar</Button>
      </form>

      <Suspense fallback={<p className="py-8 text-center text-sm text-gray-500">Cargando...</p>}>
        <ColegiadosTable
          busqueda={busqueda}
          estado_habilitacion={estado_habilitacion}
          carrera_id={carrera_id}
          sede_id={sede_id}
        />
      </Suspense>
    </div>
  )
}
