"use client"

import { useActionState } from "react"
import { solicitarResetPassword } from "@/actions/user-auth.actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import Link from "next/link"

export default function RecuperarPasswordPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => solicitarResetPassword(formData),
    null,
  )

  if (state && "enviado" in state) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-lg border bg-white p-8 shadow-sm text-center">
          <div className="mb-4 text-4xl">📧</div>
          <h1 className="mb-2 text-xl font-bold text-gray-800">Revisa tu correo</h1>
          <p className="text-sm text-gray-600">
            Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-medium text-blue-700 hover:text-blue-900">
            Volver a inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">Recuperar Contraseña</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form action={formAction} className="space-y-4">
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
          />

          {state && "error" in state && (
            <Alert variant="error" title="Error">
              {(state as { error: string }).error}
            </Alert>
          )}

          <Button type="submit" loading={pending} className="w-full">
            Enviar enlace de recuperación
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-blue-700 hover:text-blue-900">
            Volver a inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
