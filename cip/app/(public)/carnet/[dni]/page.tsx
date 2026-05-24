import { obtenerDatosCarnet } from "@/actions/carnet.actions"
import { Carnet } from "@/components/carnet/Carnet"
import Link from "next/link"

interface Props {
  params: Promise<{ dni: string }>
}

export default async function CarnetPage({ params }: Props) {
  const { dni } = await params
  const datos = await obtenerDatosCarnet(dni)

  if (!datos) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Carnet no encontrado</h1>
        <p className="mb-6 text-sm text-gray-500">
          No se encontró un colegiado con el DNI <strong>{dni}</strong>.
        </p>
        <Link
          href="/consulta"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
        >
          ← Ir a consulta
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">🪪 Carnet de Colegiatura</h1>
        <p className="mt-1 text-sm text-gray-500">
          CIP: {datos.numero_cip}
        </p>
      </div>

      <Carnet
        fotoUrl={datos.foto_url}
        apellidoPaterno={datos.apellido_paterno}
        apellidoMaterno={datos.apellido_materno}
        nombres={datos.nombres}
        carreraCodigo={datos.carrera_codigo}
        carreraNombre={datos.carrera_nombre}
        dni={datos.dni}
        numeroCip={datos.numero_cip}
        estadoHabilitacion={datos.estado_habilitacion}
      />
    </div>
  )
}
