import { Suspense } from "react"
import { listarExpedientes, type FiltrosExpedientes } from "@/actions/expediente.actions"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Select } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ESTADO_BADGE, formatDate } from "@/lib/constants"
import Link from "next/link"

const estadoOpciones = [
  { value: "", label: "Todos" },
  { value: "Pendiente", label: "Pendiente" },
  { value: "Pendiente de pago", label: "Pendiente de pago" },
  { value: "Aprobado", label: "Aprobado" },
  { value: "Rechazado", label: "Rechazado" },
]

async function ExpedientesTable({ estado, busqueda }: FiltrosExpedientes) {
  const result = await listarExpedientes({ estado, busqueda })

  if (result.error) {
    return <p className="py-8 text-center text-sm text-red-600">Error: {result.error}</p>
  }

  const data = result.data ?? []

  return (
    <Table
      columns={[
        {
          key: "codigo_expediente",
          header: "Código",
          render: (item) => (
            <Link
              href={`/admin/expedientes/${item.id}`}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              {item.codigo_expediente}
            </Link>
          ),
        },
        {
          key: "dni",
          header: "DNI",
          render: (item) => item.solicitantes?.dni ?? "-",
        },
        {
          key: "solicitante",
          header: "Apellidos y Nombres",
          render: (item) => {
            const s = item.solicitantes
            return s ? `${`${s.apellido_paterno ?? ""} ${s.apellido_materno ?? ""}`}, ${s.nombres}` : "-"
          },
        },
        {
          key: "estado",
          header: "Estado",
          render: (item) => (
            <Badge variant={ESTADO_BADGE[item.estado] ?? "neutral"}>{item.estado}</Badge>
          ),
        },
        {
          key: "created_at",
          header: "Fecha",
          render: (item) => formatDate(item.created_at),
        },
      ]}
      data={data}
      keyExtractor={(item) => item.id}
      emptyMessage="No se encontraron expedientes"
    />
  )
}

export default async function ExpedientesPage(props: {
  searchParams: Promise<{ estado?: string; busqueda?: string }>
}) {
  const { estado, busqueda } = await props.searchParams

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bandeja de Expedientes</h1>

      <form
        className="flex flex-wrap items-end gap-4 rounded-lg border bg-white p-4"
        method="GET"
      >
        <div className="w-44">
          <Select
            label="Estado"
            name="estado"
            options={estadoOpciones}
            defaultValue={estado ?? ""}
          />
        </div>
        <div className="w-64">
          <Input
            label="Buscar"
            name="busqueda"
            placeholder="DNI, nombres o apellidos"
            defaultValue={busqueda ?? ""}
          />
        </div>
        <Button type="submit">Filtrar</Button>
      </form>

      <Suspense fallback={<p className="py-8 text-center text-sm text-gray-500">Cargando...</p>}>
        <ExpedientesTable estado={estado} busqueda={busqueda} />
      </Suspense>
    </div>
  )
}
