"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { realizarPago } from "@/actions/consulta.actions"
import { generarVoucher } from "@/lib/pago/procesador"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"

interface Props {
  solicitanteId: string
  dni: string
  correo: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string
}

export function PagoForm({ solicitanteId, dni, correo, nombres, apellido_paterno, apellido_materno }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<"init" | "voucher" | "loading" | "done">("init")
  const [voucherBase64, setVoucherBase64] = useState("")
  const [error, setError] = useState("")

  function handleGenerarVoucher() {
    const transaccionId = "TXN-" + Date.now().toString(36).toUpperCase()
    const vData = generarVoucher({ transaccionId, dni, nombres, apellidos: `${apellido_paterno} ${apellido_materno}`, monto: 1500 })
    setVoucherBase64(vData.voucherBase64)
    setStep("voucher")
  }

  async function handleConfirmarPago() {
    setStep("loading")
    setError("")

    try {
      const result = await realizarPago(solicitanteId, dni, correo, voucherBase64)

      if (result.error) {
        setError(result.error)
        setStep("voucher")
      } else {
        setStep("done")
        setTimeout(() => router.refresh(), 3000)
      }
    } catch (err) {
      console.error("Error al procesar pago:", err)
      setError("Error inesperado al procesar el pago. Intenta de nuevo.")
      setStep("voucher")
    }
  }

  if (step === "done") {
    return (
      <Alert variant="success">
        <p className="font-medium">✅ Pago registrado</p>
        <p className="mt-1">Tu comprobante ha sido enviado. Espera la confirmación del administrador.</p>
        <p className="mt-1 text-sm">Redirigiendo...</p>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Alert variant="info" title="💳 Pago de inscripción">
        <p>El derecho de inscripción es de <strong>S/ 1,500.00</strong>.</p>
        <p className="mt-1">Primer mes de colegiatura <strong>GRATIS</strong>.</p>
      </Alert>

      {step === "init" && (
        <Button className="w-full" size="lg" onClick={handleGenerarVoucher}>
          Pagar ahora - S/ 1,500.00
        </Button>
      )}

      {step === "voucher" && (
        <div className="space-y-4">
          <div className="flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
            <img
              src={voucherBase64}
              alt="Voucher de pago"
              className="max-w-full rounded shadow-sm"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep("init")}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleConfirmarPago}>
              Confirmar pago
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      {step === "loading" && (
        <Button className="w-full" disabled loading>
          Procesando pago...
        </Button>
      )}
    </div>
  )
}
