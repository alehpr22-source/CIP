export default async function PagoPage({ params }: { params: Promise<{ expedienteId: string }> }) {
  const { expedienteId } = await params
  return <div>Pago expediente {expedienteId}</div>
}
