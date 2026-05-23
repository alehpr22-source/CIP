export default async function ExpedienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Revisión expediente {id}</div>
}
