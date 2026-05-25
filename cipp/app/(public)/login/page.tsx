"use client"

import { useActionState } from "react"
import { loginUser } from "@/actions/user-auth.actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import Link from "next/link"

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => loginUser(formData),
    null,
  )

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Ingresa con el correo y contraseña que registraste al solicitar tu colegiatura.
        </p>

        <form action={formAction} className="space-y-4">
          <Input label="Correo electrónico" name="correo" type="email" placeholder="correo@ejemplo.com" required />
          <Input label="Contraseña" name="password" type="password" placeholder="Tu contraseña" required />

          <div className="text-right text-sm">
            <Link href="/auth/recuperar" className="font-medium text-blue-700 hover:text-blue-900">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {state && "error" in state && (
            <Alert variant="error" title="Error de inicio de sesión">
              {(state as { error: string }).error}
            </Alert>
          )}

          <Button type="submit" loading={pending} className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link href="/solicitar" className="font-medium text-blue-700 hover:text-blue-900">
            Solicitar colegiatura
          </Link>
        </p>
      </div>
    </div>
  )
}
