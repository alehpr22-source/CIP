"use client"

import { Suspense } from "react"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { loginAdmin } from "@/actions/auth.actions"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"

const initialState = { error: "" }

function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")
  const [state, formAction, pending] = useActionState(loginAdmin, initialState)

  const errorMsg = state.error || (urlError === "no_autorizado" ? "No tienes permisos de administrador" : "")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          CIP - Administrador
        </h1>

        {errorMsg && (
          <div className="mb-4">
            <Alert variant="error">{errorMsg}</Alert>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="admin@cip.pe"
            required
          />
          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
