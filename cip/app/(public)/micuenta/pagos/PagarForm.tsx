"use client"

import { useActionState } from "react"
import { registrarPagoMensual } from "@/actions/pago-mensual.actions"
import { nombreMes } from "@/lib/constants"
import { Button } from "@/components/ui/Button"
import { Alert } from "@/components/ui/Alert"

interface Props {
  colegiadoId: string
  anio: number
  mes: number
}

export function PagarForm({ colegiadoId, anio, mes }: Props) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => registrarPagoMensual(formData),
    null,
  )

  return (
    <div>
      <form action={formAction} className="space-y-3">
        <input type="hidden" name="anio" value={anio} />
        <input type="hidden" name="mes" value={mes} />

        <div className="flex items-center gap-3">
          <Button type="submit" loading={pending} size="sm">
            Pagar S/ 20.00 - {nombreMes(mes)} {anio}
          </Button>
        </div>

        {state && "success" in state && (
          <Alert variant="success">Pago registrado correctamente. ¡Gracias!</Alert>
        )}
        {state && "error" in state && (
          <Alert variant="error">{(state as { error: string }).error}</Alert>
        )}
      </form>
    </div>
  )
}
