export default async function CarnetPage({ params }: { params: Promise<{ cip: string }> }) {
  const { cip } = await params
  return <div>Carnet CIP {cip}</div>
}
